/**
 * Server-side scraper for https://minaryganar.com/miner/
 *
 * - Visits paginated list pages
 * - Collects links to individual miner pages
 * - Visits each miner page and extracts relevant data
 * - Saves results to database
 *
 * Usage:
 *   import { scrapeMiners } from "../scripts/scrapMiners.js";
 *   await scrapeMiners();
 */

import puppeteer from "puppeteer";
import pLimit from "p-limit";

import logger from "../src/utils/logger.js";
import { wait } from "../src/helpers/time.js";
import type { ScraperState } from "../src/models/ScraperState.js";
import { MinerCategory } from "../src/types/enums.js";
import * as minerService from "../src/services/minerService.js";

const BASE = "https://minaryganar.com";
const START_URL = `${BASE}/miner/`;

// Concurrency for detail pages
const CONCURRENCY = 5;
// Delay between page requests (ms)
const PAGE_DELAY = 500;

/**
 * Scrapes miners from minaryganar.com.
 * 
 * @param scraperState The state object to track scraping progress.
 */
export const scrapeMiners = async (scraperState: ScraperState, maxPages: number) => {
    logger.info("Miner scraper started");

    // Launch browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    logger.debug("Browser launched");

    // Open new page
    const page = await browser.newPage();
    logger.debug("New page opened");

    try {
        // Visit the first page
        logger.info(`Visiting first page: ${START_URL}`);
        await page.goto(START_URL, { waitUntil: "networkidle2" });

        // Extract max page number from pagination
        const totalPages = await page.evaluate(() => {
            const DOC_PAGINATION_SELECTOR = ".page-numbers";

            const pageLinks = Array.from(document.querySelectorAll(DOC_PAGINATION_SELECTOR))
                .map(el => parseInt(el.textContent || "0"))
                .filter(n => !isNaN(n));
            return Math.max(...pageLinks);
        });

        // Update scraper state
        maxPages = totalPages < maxPages ? totalPages : maxPages;
        scraperState.totalPages = maxPages;
        logger.info(`Total pages found: ${totalPages}`);
        logger.info(`Starting to scrape up to ${maxPages} pages`);

        // Loop through each page
        for (let pageIndex = 1; pageIndex <= maxPages; pageIndex++) {
            // Construct page URL
            const url = pageIndex === 1 ? START_URL : `${START_URL}page/${pageIndex}/`;
            logger.debug(`Visiting list page: ${url}`);

            // Visit page and extract miner links
            const minersURLs = Array.from(await page.goto(url, { waitUntil: "networkidle2" })
                .then(() => page.evaluate(() => {
                    const DOC_MINER_URLS_SELECTOR = ".jet-listing.jet-listing-dynamic-image a";

                    return Array.from(document.querySelectorAll(DOC_MINER_URLS_SELECTOR))
                        .map(el => el.getAttribute("href") || "")
                        .filter(href => href.startsWith("http"));
                })));

            logger.debug(`Found ${minersURLs.length} miner links on page ${pageIndex}`);

            // Visit each miner page with concurrency limit
            const limit = pLimit(CONCURRENCY);
            const minerPromises = minersURLs.map(minerURL => limit(async () => {
                // Visit miner page
                logger.debug(`Visiting miner page: ${minerURL}`);
                const minerPage = await browser.newPage();
                await minerPage.goto(minerURL, { waitUntil: "networkidle2" });
                
                // Extract miner data
                const minerData = await minerPage.evaluate((minerCategoryValues) => {
                    // Selectors
                    const DOC_MINER_NAME_SELECTOR = "#brxe-ooaqmp";
                    const DOC_MINER_IMAGE_SELECTOR = "#brxe-lbeflu";
                    const DOC_MINER_CELLS_SELECTOR = "#brxe-upgtjw";
                    const DOC_MINER_SELLABLE_SELECTOR = "#brxe-yxkmxp div span";
                    const DOC_MINER_MERGEABLE_SELECTOR = "#brxe-dzzqum div span";
                    const DOC_MINER_POWER_SELECTOR = "-pwr";
                    const DOC_MINER_BONUS_SELECTOR = "-bonus";

                    // Extract common fields
                    const name = document.querySelector(DOC_MINER_NAME_SELECTOR)?.textContent?.trim() || "";
                    const imageUrl = (document.querySelector(DOC_MINER_IMAGE_SELECTOR) as HTMLImageElement)?.src || "";
                    const cells = (Number(document.querySelector(DOC_MINER_CELLS_SELECTOR)?.textContent?.split(" ")[1]) || 2) as 1 | 2;
                    const sellable = document.querySelector(DOC_MINER_SELLABLE_SELECTOR)?.textContent?.trim() === "Sellable" || document.querySelector(DOC_MINER_MERGEABLE_SELECTOR)?.textContent?.trim() === "Sellable" ? true : false;
                    const mergeable = document.querySelector(DOC_MINER_SELLABLE_SELECTOR)?.textContent?.trim() === "Mergeable" || document.querySelector(DOC_MINER_MERGEABLE_SELECTOR)?.textContent?.trim() === "Mergeable" ? true : false;

                    // Extract category-specific fields
                    const categories: Record<string, any> = {};
                    minerCategoryValues.forEach(cat => {
                        // Skip legacy category
                        if (cat === "legacy") return;

                        const category = cat === "common" ? "basic" : cat;

                        // Extract power and bonus
                        const powerEl = document.querySelector(`#${category}${DOC_MINER_POWER_SELECTOR}`);
                        const bonusEl = document.querySelector(`#${category}${DOC_MINER_BONUS_SELECTOR}`);
                        if (powerEl || bonusEl) {
                            const power = powerEl ? Number(powerEl.textContent?.split(" ")[0]) * 1000 : 0;
                            const bonus = bonusEl ? Number(bonusEl.textContent?.split(" ")[0]) : 0;

                            categories[cat] = { power, bonus };
                        }
                    });

                    return { name, imageUrl, cells, sellable, mergeable, categories };
                }, Object.values(MinerCategory));

                try {
                    // Save miner data to database
                    const savedMiner = await minerService.upsertMiner(minerData);
                    if (!savedMiner) logger.warn(`Miner not saved: ${minerData.name}`);
                    else logger.info(`Miner saved: ${savedMiner.name}`);
                } 
                catch (error) {
                    logger.error(`Error saving miner ${minerData.name}:`, error);
                }

                // Close miner page
                await minerPage.close();
            }));

            // Wait for all miners on the page to be processed
            await Promise.all(minerPromises);

            // Update scraper state progress
            scraperState.progress = Math.round((pageIndex / maxPages) * 100);

            // Delay before next page
            await wait(PAGE_DELAY);
        }

        logger.info("Scraping completed successfully");
    } 
    catch (error) {
        logger.error("Error during scraping:", error);
    }
    finally {
        // Close browser
        await browser.close();
        logger.debug("Browser closed");
    }
};
