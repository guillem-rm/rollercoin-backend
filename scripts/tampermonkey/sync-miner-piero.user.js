// ==UserScript==
// @name         Add button to sync miner on Piero's page
// @namespace    http://tampermonkey.net/
// @version      2025-03-17
// @description  Sync miner and notify opener when done
// @author       You
// @match        https://minaryganar.com/miner/*
// @exclude      https://minaryganar.com/miner/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=minaryganar.com
// @grant        GM_xmlhttpRequest
// @connect      localhost
// ==/UserScript==

(function () {
    'use strict';

    function showNotification(message, success = true) {
        const notification = document.createElement("div");
        notification.innerText = message;
        notification.style.position = "fixed";
        notification.style.top = "20px";
        notification.style.right = "40vw";
        notification.style.padding = "14px 24px";
        notification.style.fontSize = "16px";
        notification.style.fontWeight = "600";
        notification.style.fontFamily = "Segoe UI, Roboto, sans-serif";
        notification.style.color = "white";
        notification.style.borderRadius = "10px";
        notification.style.boxShadow = "0 6px 16px rgba(0,0,0,0.4)";
        notification.style.zIndex = "9999";
        notification.style.opacity = "1";
        notification.style.transition = "opacity 0.6s ease, transform 0.6s ease";
        notification.style.background =
            success ? "linear-gradient(135deg, #22c55e, #15803d)" : "linear-gradient(135deg, #f43f5e, #991b1b)";
        notification.style.transform = "translateY(0)";
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.opacity = "0";
            notification.style.transform = "translateY(20px)";
            setTimeout(() => notification.remove(), 600);
        }, 3000);
    }

    function syncMiner() {
        let rarity = "COMMON";
        let name = document.querySelector("#brxe-ooaqmp").innerText;
        let description = "";
        let gifUrl = document.querySelector("#brxe-rfkapx img").getAttribute("src");
        let cells = parseInt(document.querySelector("#brxe-upgtjw").innerText.split(":")[1]);
        let power = parseFloat(document.querySelector("#basic-pwr").innerText.split(" ")[0]) * 1000;
        let bonus = parseFloat(document.querySelector("#basic-bonus").innerText.split(" ")[0]);
        let price = 0.0;
        let sellable = document.querySelector("#brxe-dzzqum").querySelector("div span").innerText == "Sellable";
        let mergeable = document.querySelector("#brxe-yxkmxp").querySelector("div span").innerText == "Mergeable";

        let miner = {
            rarity: rarity,
            name: name.trim(),
            description: description,
            gifUrl: gifUrl,
            cells: cells,
            power: power,
            bonus: bonus,
            price: price,
            sellable: sellable,
            mergeable: mergeable,
        };

        GM_xmlhttpRequest({
            method: "POST",
            url: "http://localhost:3000/miners",
            headers: {
                "Content-Type": "application/json"
            },
            data: JSON.stringify(miner),
            onload: function (response) {
                if (response.status >= 200 && response.status < 300) {
                    showNotification("Miner sincronitzat correctament!");
                } else {
                    showNotification("Error de sincronització (" + response.status + ")", false);
                }

                // Notificar la finestra pare que ja ha acabat
                window.opener?.postMessage("sync-completed", "*");
                window.close();
            },
            onerror: function (error) {
                console.error("Error with miner " + name + ": ", error);
                showNotification("Error de connexió amb el servidor", false);

                window.opener?.postMessage("sync-completed", "*");
                window.close();
            }
        });
    }

    const urlParams = new URLSearchParams(window.location.search);
    const sync = urlParams.get("sync");
    if (sync) {
        syncMiner();
    }

    let syncButton = document.createElement("button");
    syncButton.innerHTML = "<p style='margin-bottom: 0'>Sync miner</p>";
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
    syncButton.style.fontSize = "20px";
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
    syncButton.addEventListener("click", syncMiner);
})();