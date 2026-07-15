# The Open Veracity Standard: Rules of Engagement

The Open Veracity Standard (OVS) is not a legal mandate, nor is it a censorship
tool. It is an open-source framework designed to solve the "Market for Lemons"
in political advertising. 

By voluntarily applying the OVS JSON-LD schema to a digital asset, or by
displaying the visual OVS Badge, the claimant (political party, PAC, or
individual) enters into a strict, mathematically enforced protocol. 

These are the Rules of Engagement.

---

## 1. Zero-Day Transparency (The Burden of Proof)
Truth in the OVS framework is not determined by debate; it is determined by data
availability. 
*   **Immediate Access:** The mathematical model, dataset, or source code
    proving a claim must be accessible at the exact moment the claim is
    published. There is no grace period.
*   **Machine Readability:** The proof must be embedded in the advertisement's
    metadata using the `ClaimReview` JSON-LD standard. 
*   **The Fail State:** If the linked proof returns a `404 Not Found`, requires
    a login, or sits behind a paywall, the claim is instantly classified as
    **OVS Invalid**.

## 2. The Cryptographic Whitelist (No "Custom" Reality)
A common tactic in political deception is the "Garbage In, Garbage Out" exploit,
where mathematically sound formulas are fed fabricated datasets. 
*   **Approved Nodes:** All data utilized to secure an OVS Badge must originate
    from neutral, institutional, publicly accessible databases (e.g., Danmarks
    Statistik, The Ministry of Finance, Eurostat, IPCC). 
*   **Banned Sources:** Proprietary datasets provided by partisan think-tanks,
    dark-money PACs, or internal campaign polling are strictly prohibited.
*   **The Fail State:** Automated OVS validators check the dataset's domain
    against a hardcoded whitelist. Unrecognized domains trigger an immediate
    verification failure.

## 3. Probability vs. Veracity (Certifying the Engine)
OVS recognizes that most political claims are not about the past (Veracity), but
about the future (Probability). Because no one can fact-check the future, OVS
requires politicians to certify the *engine* and the *inputs*.
*   **Methodology Registration:** For predictive claims (e.g., "Our policy will
    create 10,000 jobs"), the claimant must publicly register the exact
    macroeconomic model utilized.
*   **Open Source Inputs:** The exact variables, confidence intervals, and
    assumptions fed into the model must be provided in a standard CSV or script
    format. The public must be able to run the campaign's exact inputs through
    the stated model and arrive at the exact claimed number.
*   **The Fail State:** If the methodology relies on a "black box" secret
    algorithm, or if independent execution of the inputs does not match the
    advertised claim, the badge is revoked.

## 4. The Symmetrical Retraction Protocol
The ultimate enforcement mechanism of the OVS is the Symmetrical Retraction. If
an independent arbitration panel, or an automated open-source audit,
definitively proves that a claimant violated these Rules of Engagement, the
claimant is structurally bound to the following:
1.  **Immediate Cessation:** The original, invalid advertisement must be pulled
    from all broadcasting and digital networks.
2.  **Corrective Advertising:** The claimant must purchase and deploy a
    retraction advertisement. 
3.  **Symmetrical Reach:** This retraction must utilize the *exact same
    micro-targeting parameters, platforms, and financial budget* as the original
    ad to ensure the exact same demographics see the correction.

---

**Note to Adopters:** 
Claims without the OVS badge are entirely legal. The OVS does not stop
politicians from lying. It simply provides the public with a highly visible tool
to instantly identify the politicians who refuse to prove they are telling the
truth.

