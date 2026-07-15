#!/usr/bin/env bash

# Required programs
REQUIREMENTS=( "curl" "jq" "tr" "awk")

# The hardcoded whitelist of approved proof sources
WHITELISTED_SOURCES=(
    'dst\.dk'
    'finansministeriet\.dk'
    'OpenVeracity\.github\.io/ovs-demo'
)


main () {
    # Ensure ${REQUIREMENTS[@]} are available
    local MISSING=()
    local REQD URL PAYLOAD curlExit SOURCE WHITELIST_REGEX 
    local CSV_DATA CALCULATED_SUM CLAIMED_VALUE 
    CLAIMED_TEXT=$(echo "$PAYLOAD" | jq -r '.claimReviewed // empty')
    for REQD in "${REQUIREMENTS[@]}" ; do
        if ! command -v "$REQD" &> /dev/null; then
            MISSING+=("$REQD")
        fi
    done

    if [[ ${#MISSING[@]} -gt 0 ]] ; then
        printf "Error: the following requirements don't seem to be met:\n"
        printf "\t%s\n" "${MISSING[@]}"
        return 1
    fi

    URL="$1"

    echo "Fetching OVS payload from: $URL..."
    PAYLOAD=$(curl -sL "$URL")
    curlExit=$?

    if [ ${curlExit} -ne 0 ] || [ -z "$PAYLOAD" ]; then
        echo -e "\e[31m[ERROR] Failed to fetch data.\e[0m"
        return 1
    fi

    # Extract the data source and the claimed text using jq
    SOURCE=$(echo "$PAYLOAD" | jq -r '.ovsExtensions.probabilityProof.replicationFile // .ovsExtensions.veracityProof.datasetSource // empty')
    CLAIMED_TEXT=$(echo "$PAYLOAD" | jq -r '.claimReviewed // empty')

    if [ -z "$SOURCE" ] || [ -z "$CLAIMED_TEXT" ]; then
        echo -e "\e[31m[FAIL] Missing OVS Proof or Claim text in JSON.\e[0m"
        return 1
    fi

    if [ -z "$SOURCE" ]; then
        echo -e "\e[31m[FAIL] No OVS Proof found in JSON.\e[0m"
        return 1
    fi

    # Dynamically extract the numeric value from the claim (strips all non-digits)
    # E.g., "generates 10,000 jobs" becomes "10000"
    CLAIMED_VALUE=$(echo "$CLAIMED_TEXT" | tr -dc '0-9')

    # Enforce the Whitelist
    WHITELIST_REGEX="$(IFS="|"; echo "${WHITELISTED_SOURCES[*]}")"
    if ( echo "$SOURCE" | grep -qE "$WHITELIST_REGEX" ); then
        echo -e "\e[32m[PASS] OVS VERIFIED: Source is whitelisted -> $SOURCE\e[0m"
    else
        echo -e "\e[31m[FAIL] OVS INVALID: Custom or non-whitelisted source -> $SOURCE\e[0m"
        return 1
    fi

    # Fetch and Process the Proof
    echo "Fetching proof..."
    CSV_DATA=$(curl -sL "$SOURCE")

    if [ -z "$CSV_DATA" ]; then
        echo -e "\e[31m[ERROR] Failed to fetch CSV data from $SOURCE\e[0m"
        return 1
    fi

    # Use awk to sum the 2nd column, skipping the header row
    CALCULATED_SUM=$(echo "$CSV_DATA" | awk -F, 'NR>1 {sum+=$2} END {print sum}')

    if [ -z "$CALCULATED_SUM" ]; then
        echo -e "\e[31m[ERROR] Could not parse CSV data.\e[0m"
        return 1
    fi

    # 5. Verify the Math
    echo "----------------------------------------"
    echo -e "Claimed Text: \t\"$CLAIMED_TEXT\""
    echo -e "Claimed Value: \t$CLAIMED_VALUE"
    echo -e "Calculated Sum: \t$CALCULATED_SUM"
    echo "----------------------------------------"

    if [ "$CALCULATED_SUM" -eq "$CLAIMED_VALUE" ]; then
        echo -e "\e[32m[SUCCESS] OVS VERIFIED: The proof supports the claim!\e[0m"
        return 0
    else
        echo -e "\e[31m[FAIL] OVS INVALID: The math does not match the claim!\e[0m"
        return 1
    fi
}

main "${@}"
