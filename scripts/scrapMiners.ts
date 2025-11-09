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

const BASE = "https://minaryganar.com";
const START_URL = `${BASE}/miner/`;

// Concurrency for detail pages
const CONCURRENCY = 3;
// Delay between page requests (ms)
const PAGE_DELAY = 500;

/**
 * Scrapes miners from minaryganar.com.
 * 
 * @param scraperState The state object to track scraping progress.
 */
export const scrapeMiners = async (scraperState: ScraperState) => {
    logger.info("Starting scraper of miners...");

    // Launch browser
    const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox", "--disable-setuid-sandbox"]
    });
    logger.debug("Browser launched");

    // Open new page
    const page = await browser.newPage();
    logger.debug("New page opened");

    let pageIndex = 1;

    try {
        // Visit the first page
        logger.info(`Visiting first page: ${START_URL}`);
        await page.goto(START_URL, { waitUntil: "networkidle2" });

        // Extract max page number from pagination
        const maxPages = await page.evaluate(() => {
            const pageLinks = Array.from(document.querySelectorAll(".page-numbers"))
                .map(el => parseInt(el.textContent || "0"))
                .filter(n => !isNaN(n));
            return Math.max(...pageLinks);
        });

        scraperState.totalPages = maxPages;
        logger.info(`Total pages found: ${maxPages}`);

        for (let pageIndex = 1; pageIndex <= maxPages; pageIndex++) {
            const url = pageIndex === 1 ? START_URL : `${START_URL}page/${pageIndex}/`;
            logger.debug(`Visiting list page: ${url}`);

            // Aquí faràs la captura dels miners de la pàgina

            scraperState.progress = Math.round((pageIndex / maxPages) * 100);
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
