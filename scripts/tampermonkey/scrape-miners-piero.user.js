// ==UserScript==
// @name         Auto add miners from Piero's page
// @namespace    http://tampermonkey.net/
// @version      2025-06-28
// @description  Scrap miners one by one
// @author       You
// @match        https://minaryganar.com/miner/
// @match        https://minaryganar.com/miner/page/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minaryganar.com
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    function wait(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function waitForSyncCompletion(href) {
        return new Promise((resolve) => {
            const listener = (event) => {
                if (event.data === "sync-completed") {
                    window.removeEventListener("message", listener);
                    resolve(true);
                }
            };

            window.addEventListener("message", listener);
            window.open(`${href}?sync=true`, "_blank");
        });
    }

    async function scrapMiners() {
        syncButton.disabled = true;
        syncButton.style.cursor = "not-allowed";
        syncButton.style.background = "gray";
        let text = syncButton.querySelector("p");
        text.innerText = "Scraping...";

        try {
            await wait(1000);

            const pageNumbers = document.querySelector(".page-numbers")?.children;
            let maxPages = 1;

            if (pageNumbers && pageNumbers.length > 2) {
                //maxPages = parseInt(pageNumbers[pageNumbers.length - 2].innerText);
            }

            for (let actPage = 1; actPage <= maxPages; actPage++) {
                await wait(1000);
                const miners = document.querySelectorAll(".brxe-gzrnkg");

                for (let i = 0; i < miners.length; i++) {
                    const href = miners[i]?.querySelector(".brxe-fxbrin")?.href;
                    if (href) {
                        await waitForSyncCompletion(href);
                        await wait(1000); // per seguretat
                    }
                }
            }

        } catch (error) {
            console.error("❌ Error durant el scraping:", error);
            alert("Hi ha hagut un error durant el scraping.");
        }

        text.innerText = "Scrap miners";
        syncButton.style.background = "linear-gradient(135deg, #f97316, #dc2626)";
        syncButton.disabled = false;
        syncButton.style.cursor = "pointer";
    }

    let syncButton = document.createElement("button");
    syncButton.innerHTML = "<i class='fas fa-sync'></i> <p style='margin-bottom: 0'>Scrap miners</p>";
    syncButton.id = "scrapMinerButton";
    syncButton.style.display = "flex";
    syncButton.style.alignItems = "center";
    syncButton.style.gap = "10px";
    syncButton.style.position = "fixed";
    syncButton.style.bottom = "20px";
    syncButton.style.right = "20px";
    syncButton.style.background = "linear-gradient(135deg, #f97316, #dc2626)";
    syncButton.style.color = "white";
    syncButton.style.border = "none";
    syncButton.style.padding = "12px 24px";
    syncButton.style.fontSize = "24px";
    syncButton.style.fontWeight = "600";
    syncButton.style.letterSpacing = "0.5px";
    syncButton.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.5)";
    syncButton.style.borderRadius = "12px";
    syncButton.style.zIndex = "9999";
    syncButton.style.transition = "all 0.3s ease";
    syncButton.style.fontFamily = "Segoe UI, Roboto, sans-serif";
    syncButton.style.opacity = "0.95";

    syncButton.addEventListener("mouseenter", () => {
        syncButton.style.transform = "translateY(-2px)";
        syncButton.style.boxShadow = "0 12px 32px rgba(0, 0, 0, 1)";
    });

    syncButton.addEventListener("mouseleave", () => {
        syncButton.style.transform = "none";
        syncButton.style.boxShadow = "0 8px 20px rgba(0, 0, 0, 0.5)";
    });

    document.body.appendChild(syncButton);
    syncButton.addEventListener("click", scrapMiners);
})();