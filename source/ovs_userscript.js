// ==UserScript==
// @name         Open Veracity Standard (OVS) Overlay & Sweeper
// @namespace    OpenVeracity
// @version      0.1
// @description  Validates OVS metadata and actively neutralizes fake/spoofed OVS HTML badges.
// @author       OpenVeracity@users.noreply.github.com
// @match        *://*/*
// @match        file:///*
// @grant        GM_xmlhttpRequest
// @connect      *
// @run-at       document-end
// @updateURL    https://raw.githubusercontent.com/OpenVeracity/ovs-demo/refs/heads/main/source/ovs_userscript.js
// @downloadURL  https://raw.githubusercontent.com/OpenVeracity/ovs-demo/refs/heads/main/source/ovs_userscript.js
// ==/UserScript==

(function() {
    'use strict';
    
    const WHITELISTED_SOURCES = [
        'dst.dk',                   // Danmarks Statistik (Trusted)
        'finansministeriet.dk',     // Ministry of Finance (Trusted)
        'OpenVeracity.github.io'    // Demo site
    ];

    function isWhitelisted(url) {
        try {
            const parsedUrl = new URL(url);
            return WHITELISTED_SOURCES.some(domain => {
                const regex = new RegExp('(^|\\.)' + domain.replace(/\./g, '\\.') + '$');
                return regex.test(parsedUrl.hostname);
            });
        } catch (e) {
            return false;
        }
    }

    // 1. THE SWEEPER: Finds and neutralizes fake HTML badges
    function sweepForSpoofs() {
        // Search the DOM for common fake badge phrases
        const xpath = `//*[contains(text(), 'OVS Certified') or contains(text(), 'OVS Verified')]`;
        const result = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
        
        let spoofsFound = 0;
        for (let i = 0; i < result.snapshotLength; i++) {
            const element = result.snapshotItem(i);
            
            // If the element has our official script-injected class, leave it alone.
            if (element.classList && element.classList.contains("ovs-injected-badge")) {
                continue; 
            }
            
            // If it DOES NOT have our class, it is a hardcoded spoof. Neutralize it.
            element.style.cssText = `
                background-color: #000 !important;
                color: #ff0000 !important;
                border: 2px solid #ff0000 !important;
                padding: 5px;
                font-weight: bold;
                text-decoration: line-through;
            `;
            element.innerText = "❌ FRAUDULENT OVS BADGE DETECTED ❌";
            spoofsFound++;
        }

        if (spoofsFound > 0) {
            console.warn(`[OVS WARNING] Sweeper neutralized ${spoofsFound} fake badge(s) on this page!`);
        }
        return spoofsFound;
    }

    function processOVSLinks() {
        const linkTags = document.querySelectorAll('link[rel="alternate"][type="application/ld+json"]');
        
        // 2. THE EARLY EXIT: If no tags and no spoofs exist, do absolutely nothing.
        const spoofsDetected = sweepForSpoofs();
        if (linkTags.length === 0 && spoofsDetected === 0) {
            return; // Normal webpage. Exit silently.
        }

        if (linkTags.length > 0) {
            console.log(`[OVS] Found ${linkTags.length} embedded OVS tags. Validating...`);
        }

        linkTags.forEach(linkElement => {
            const jsonUrl = linkElement.href;

            GM_xmlhttpRequest({
                method: "GET",
                url: jsonUrl,
                onload: function(response) {
                    if (response.status !== 200 && response.status !== 0) return;

                    try {
                        const payload = JSON.parse(response.responseText);
                        const claimReviewed = payload.claimReviewed;
                        const source = payload.ovsExtensions?.probabilityProof?.replicationFile || 
                                       payload.ovsExtensions?.veracityProof?.datasetSource;

                        if (!source) return;
                        const validSource = isWhitelisted(source);

                        GM_xmlhttpRequest({
                            method: "GET",
                            url: source,
                            onload: function(csvResponse) {
                                let calculatedSum = 0;
                                let isMathValid = false;

                                if ((csvResponse.status === 200 || csvResponse.status === 0) && validSource) {
                                    const rows = csvResponse.responseText.split('\n');
                                    for (let i = 1; i < rows.length; i++) {
                                        const columns = rows[i].split(',');
                                        if (columns.length > 1) {
                                            const val = parseInt(columns[1].trim(), 10);
                                            if (!isNaN(val)) calculatedSum += val;
                                        }
                                    }
                                    const claimedValue = parseInt(claimReviewed.replace(/\D/g, ''), 10);
                                    isMathValid = (calculatedSum === claimedValue);
                                }

                                let badgeText = "🔴 OVS INVALID: Math Discrepancy";
                                let badgeColor = "#f8d7da";
                                let textColor = "#721c24";
                                let borderColor = "#f5c6cb";

                                if (!validSource) {
                                    badgeText = "🔴 OVS INVALID: Untrusted Source";
                                } else if (isMathValid) {
                                    badgeText = `🟢 OVS VERIFIED: ${calculatedSum.toLocaleString()} matched`;
                                    badgeColor = "#d4edda";
                                    textColor = "#155724";
                                    borderColor = "#c3e6cb";
                                }

                                injectBadge(linkElement, badgeText, badgeColor, textColor, borderColor);
                            }
                        });
                    } catch (e) {
                        console.error("[OVS] JSON Parsing Error: ", e);
                    }
                }
            });
        });
    }

    function injectBadge(linkNode, badgeText, bgColor, textColor, borderColor) {
        if (linkNode.nextSibling && linkNode.nextSibling.className === "ovs-injected-badge") return;

        const badgeNode = document.createElement("span");
        
        // This specific class is our "trusted signature" to prevent the Sweeper from destroying it
        badgeNode.className = "ovs-injected-badge"; 
        
        badgeNode.style.cssText = `
            background-color: ${bgColor};
            color: ${textColor};
            border: 1px solid ${borderColor};
            padding: 4px 8px;
            border-radius: 4px;
            font-weight: bold;
            font-family: sans-serif;
            font-size: 0.85em;
            margin-left: 10px;
            display: inline-block;
            vertical-align: middle;
        `;
        badgeNode.innerText = badgeText;
        
        linkNode.parentNode.insertBefore(badgeNode, linkNode.nextSibling);
    }

    // Run the script
    processOVSLinks();
})();
