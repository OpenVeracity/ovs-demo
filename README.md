# The Open Veracity Standard (OVS) - MVP Demo

## Overview
The Open Veracity Standard (OVS) is an open-source framework designed to solve the "Market for Lemons" in political campaigning. It operates on a simple premise: **Truth should not be mandated by the state; it should be verified by the facts.**

Rather than trying to legislate political speech or build complex AI filters,
OVS proposes a voluntary, highly visible "Veracity Badge" for political claims.
Politicians who use the badge signal that their claims are backed by objective,
publicly accessible data. 

This repository contains a Minimum Viable Product (MVP) of the OVS framework,
demonstrating how political claims can be verified using nothing but standard
UNIX POSIX tools (like `bash`, `curl`, `awk`, and `jq`).

## Philosophy
In modern politics, "The amount of energy needed to refute bullshit is an order
of magnitude larger than is needed to produce it." (Brandolini's Law). 

OVS flips this dynamic by requiring politicians to embed the exact mathematical
models they used to make a claim directly into the ad's metadata (via a custom
JSON-LD schema). If the math doesn't match the claim, or if the data comes from
a partisan, non-whitelisted source, the validation fails instantly.

## Repository Structure

*   `ovs-validate.sh` - The core engine. A bash script that fetches a JSON claim, enforces a domain whitelist, extracts the numeric claim, downloads the raw CSV data, runs the math, and verifies the result.
*   `index.html` - The frontend demo. A simple HTML page simulating political ads with embedded `application/ld+json` schema tags.
*   `claim.json`, `claim2.json`, `claim3.json` - The OVS data payloads containing the claims and pointing to the mathematical proofs.
*   `model.csv`, `model2.csv` - The raw "open-source" macroeconomic datasets used to calculate the claims.

## How to Run the Demo

### Prerequisites
Ensure you have the following installed on your system:
*   `bash`
*   `curl`
*   `jq`
*   `awk`
*   `tr`
*   `grep`

### Execution
Run the validator script directly from your terminal, passing the URL of an OVS
JSON payload.

**Test 1: The Honest Claim (Passes)**
This tests `claim.json`, which claims 10,000 jobs and points to `model.csv`
(which mathematically sums to 10,000).
```bash
./ovs-validate.sh [https://OpenVeracity.github.io/ovs-demo/claims/claim.json](https://OpenVeracity.github.io/ovs-demo/claims/claim.json)

```

**Test 2: The Fake Dataset (Fails)**
This tests `claim2.json`, which points to data hosted on
`fake-partisan-thinktank.com`. The script will immediately invalidate the claim
because the domain is not on the cryptographic whitelist.

```bash
./ovs-validate.sh [https://OpenVeracity.github.io/ovs-demo/claims/claim2.json](https://OpenVeracity.github.io/ovs-demo/claims/claim2.json)

```

**Test 3: The Cherry-Picked Math (Fails)**
This tests `claim3.json`, which claims 100,000 affordable homes but points to
`model2.csv` (which actually sums to a much lower, or negative, number). The
script will catch the mathematical discrepancy.

```bash
./ovs-validate.sh [https://OpenVeracity.github.io/ovs-demo/claims/claim3.json](https://OpenVeracity.github.io/ovs-demo/claims/claim3.json)

```


## Contributing

This project demonstrates that democratic accountability doesn't require massive
servers; it just requires a sysadmin and `awk`. Future expansions will include
UserScripts to overlay the Verification Badges natively onto social media feeds.
