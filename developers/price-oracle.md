# On-Chain Price Oracle (Chainlink Compatible)

The **Achylo Price Oracle** (`AchyloPriceOracle`) is a decentralized, manipulation-resistant on-chain pricing engine deployed on **Base Mainnet**. It provides real-time, volume-weighted exchange rates between fiat currencies and stablecoins (USDC) derived directly from completed, on-chain settled P2P escrows.

It natively implements both **custom institutional methods** (VWAP, Median, Ring Buffer inspection) and the industry-standard **Chainlink `AggregatorV3Interface`** format, enabling seamless plug-and-play integration with DeFi lending protocols, collateral vaults, derivatives, payment processors, and automated market makers.

---

## 📌 Contract Deployment Details

| Parameter | Value |
| :--- | :--- |
| **Network** | Base Mainnet |
| **Chain ID** | `8453` |
| **Contract Address** | `0x90767Ec609a1EF79a4326316866583919BfF253F` |
| **Explorer** | [Basescan: 0x90767Ec6...F253F](https://basescan.org/address/0x90767Ec609a1EF79a4326316866583919BfF253F) |
| **Base Currency / Quote** | USD / USDC (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`) |
| **Precision (Decimals)** | `6` (matching USDC: `1e6` = 1.00 unit) |
| **Standard Interface** | Chainlink `AggregatorV3Interface` + `IAchyloPriceOracle` |

---

## 🪙 Currency Identifiers (`currencyId`)

The oracle indexes each fiat currency by its dynamic `currencyId` (defined in the `PaymentMethodRegistry` contract):

| `currencyId` | Code | Name | Example Rate (6 Decimals) | Scaled Price |
| :---: | :---: | :--- | :---: | :---: |
| `0` | **CUP** | Peso Cubano | `930000000` | 930.00 CUP / USDC |
| `1` | **CUBT** | CUBT Token | `1000000` | 1.00 CUBT / USDC |
| `2` | **MLC** | Moneda Libremente Convertible | *Configured on-demand* | *Dynamic* |
| `3+` | *Dynamic* | Additional fiat currencies | *Configured on-demand* | *Dynamic* |

> 💡 **Units & Precision:** Rates represent **units of fiat currency per 1 USDC**, scaled by `10^6`. For example, `930000000` corresponds to `930000000 / 1e6 = 930.00 CUP/USDC`.

---

## 🛡️ Institutional Security & Anti-Manipulation Engine

Unlike naive DEX spot oracles that are vulnerable to flash loans, Achylo calculates prices exclusively from settled P2P transactions upon `releaseFunds`, protected by multiple algorithmic guardrails:

```
[ P2P Escrow Finalized: releaseFunds() ]
                 │
                 ▼
  [ 1. Minimum Volume Filter ] ──── (Under min volume? Dropped)
                 │
                 ▼
  [ 2. Anti-Wash Trade Cooldown ] ── (Same buyer & seller within cooldown? Dropped)
                 │
                 ▼
  [ 3. Intra-Block Cooldown ] ───── (Same pair in same block? Dropped)
                 │
                 ▼
  [ 4. Volume Capping ] ─────────── (Max volume cap applied per trade)
                 │
                 ▼
  [ 5. Circuit Breaker Outlier ] ── (Deviation > threshold vs ref price? Dropped)
                 │
                 ▼
  [ 6. Dynamic Ring Buffer O(1) ] ── (Inserted into sliding window N = 10)
                 │
       ┌─────────┴─────────┐
       ▼                   ▼
 [ VWAP Calculation ]   [ Median Calculation ]
       │                   │
       └─────────┬─────────┘
                 ▼
   Chainlink latestRoundData()
```

1. **VWAP (Volume-Weighted Average Price):** Weights each trade proportionally by its USDC volume. Small spam transactions cannot distort the price.
2. **Median Filtering:** Sorts observations in the window $N$ and selects the center value, providing immunity to up to **50% spoofing / malicious trades**.
3. **Volume Cap per Trade:** Prevents whales from inserting outsized volume to artificially skew the VWAP.
4. **Circuit Breaker (Outlier Filtering):** Rejects trades deviating beyond the allowed threshold (e.g. 35%) from the prevailing reference price.
5. **Pair & Block Cooldowns:** Restricts consecutive trades between the same two counterparties and within the same block, mitigating wash-trading and flash-loan attacks.
6. **Dynamic Sliding Window $N$:** Stores the last $N$ observations in an $O(1)$ cyclic ring buffer (configurable between 3 and 50 observations).

---

## 🔗 How to Query the Oracle

You can integrate and consume oracle prices in three primary ways:
1. **Chainlink `AggregatorV3Interface`** (Standard DeFi format)
2. **Direct `IAchyloPriceOracle` Native Interface** (Extended stats, VWAP, Median, and observation history)
3. **Frontend / Off-Chain SDKs** (Viem, Ethers.js, Web3.js)

---

### Method 1: Chainlink Format (`AggregatorV3Interface`)

The oracle implements the exact `latestRoundData`, `decimals`, and `description` functions standard across Chainlink feeds.

#### Function Signature:
```solidity
function latestRoundData(uint8 currencyId) external view returns (
    uint80 roundId,
    int256 answer,
    uint256 startedAt,
    uint256 updatedAt,
    uint80 answeredInRound
);
```

- **`roundId`**: Unix timestamp of the latest observation.
- **`answer`**: The current VWAP price with 6 decimals (e.g., `930000000` = 930.00).
- **`startedAt`**: Unix timestamp when the round began.
- **`updatedAt`**: Unix timestamp when the round was updated on-chain.
- **`answeredInRound`**: Equal to `roundId`.

#### Chainlink Consumer Adapter (Solidity Example):

If your protocol expects the parameterless standard `latestRoundData()` from a standalone feed address per pair, you can deploy a lightweight 10-line wrapper or call the oracle directly:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAchyloChainlinkFeed {
    function latestRoundData(uint8 currencyId) external view returns (
        uint80 roundId,
        int256 answer,
        uint256 startedAt,
        uint256 updatedAt,
        uint80 answeredInRound
    );
    function decimals() external pure returns (uint8);
    function description() external pure returns (string memory);
}

contract AchyloPriceConsumer {
    IAchyloChainlinkFeed public immutable priceOracle;
    uint8 public constant CUP_CURRENCY_ID = 0;

    constructor(address _oracleAddress) {
        priceOracle = IAchyloChainlinkFeed(_oracleAddress);
    }

    /**
     * @notice Returns the latest CUP/USDC price formatted as a 6-decimal integer
     */
    function getLatestCUPPrice() external view returns (int256 price, uint256 updatedAt) {
        (
            /* uint80 roundId */,
            int256 answer,
            /* uint256 startedAt */,
            uint256 timestamp,
            /* uint80 answeredInRound */
        ) = priceOracle.latestRoundData(CUP_CURRENCY_ID);

        require(answer > 0, "Invalid price");
        require(timestamp > 0, "Round not complete");

        return (answer, timestamp);
    }
}
```

---

### Method 2: Native Solidity Interface (`IAchyloPriceOracle`)

For applications that need direct access to both **VWAP** and **Median**, feed health metrics, and the observation buffer:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IAchyloPriceOracle {
    enum PriceMode { VWAP, Median }

    struct Observation {
        uint88 price;        // Fiat units per 1 USDC (scaled 1e6)
        uint88 volume;       // Capped volume in USDC (scaled 1e6)
        uint32 timestamp;    // Block timestamp of releaseFunds
        uint32 blockNumber;  // Block number
    }

    /// @notice Returns the official configured price (VWAP or Median)
    function getPrice(uint8 currencyId) external view returns (uint88 price, uint32 lastUpdated);

    /// @notice Returns the Volume-Weighted Average Price
    function getVWAP(uint8 currencyId) external view returns (uint88 vwap, uint32 lastUpdated);

    /// @notice Returns the Median price (immune to 50% manipulation)
    function getMedianPrice(uint8 currencyId) external view returns (uint88 median, uint32 lastUpdated);

    /// @notice Returns whether a feed has expired past the staleness threshold
    function isFeedStale(uint8 currencyId) external view returns (bool);

    /// @notice Returns all stored observations in the circular buffer
    function getObservations(uint8 currencyId) external view returns (Observation[] memory obs, uint16 count);

    /// @notice Returns complete feed metadata and configuration
    function getFeedStatus(uint8 currencyId) external view returns (
        bool isInitialized,
        bool isPaused,
        bool isStale,
        uint16 count,
        uint16 bufferSize,
        uint32 lastUpdated,
        uint88 lastCalculatedPrice,
        PriceMode preferredMode
    );
}
```

#### Reading Prices in Solidity:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./IAchyloPriceOracle.sol";

contract LendingVault {
    IAchyloPriceOracle public immutable oracle;

    constructor(address _oracle) {
        oracle = IAchyloPriceOracle(_oracle);
    }

    function calculateCollateralValue(uint8 currencyId, uint256 fiatAmount) external view returns (uint256 usdcValue) {
        require(!oracle.isFeedStale(currencyId), "Oracle feed is stale");

        (uint88 price, ) = oracle.getPrice(currencyId);
        require(price > 0, "Price feed uninitialized");

        // fiatAmount has fiat decimals; price is scaled by 1e6
        // usdcValue = (fiatAmount * 1e6) / price
        usdcValue = (fiatAmount * 1e6) / uint256(price);
    }
}
```

---

### Method 3: TypeScript / JavaScript Integration

#### Using Viem (Recommended for Base):

```typescript
import { createPublicClient, http, parseAbi } from 'viem';
import { base } from 'viem/chains';

const ORACLE_ADDRESS = '0x90767Ec609a1EF79a4326316866583919BfF253F';

const client = createPublicClient({
  chain: base,
  transport: http('https://mainnet.base.org'),
});

const ORACLE_ABI = parseAbi([
  'function latestRoundData(uint8 currencyId) external view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function getPrice(uint8 currencyId) external view returns (uint88 price, uint32 lastUpdated)',
  'function getVWAP(uint8 currencyId) external view returns (uint88 vwap, uint32 lastUpdated)',
  'function getMedianPrice(uint8 currencyId) external view returns (uint88 median, uint32 lastUpdated)',
  'function decimals() external pure returns (uint8)',
]);

async function fetchCUPRate() {
  const currencyId = 0; // 0 = CUP

  // 1. Query using Chainlink AggregatorV3 format
  const [roundId, rawAnswer, , updatedAt] = await client.readContract({
    address: ORACLE_ADDRESS,
    abi: ORACLE_ABI,
    functionName: 'latestRoundData',
    args: [currencyId],
  });

  const priceCUP = Number(rawAnswer) / 1e6;
  const updateDate = new Date(Number(updatedAt) * 1000);

  console.log(`CUP / USDC Price (Chainlink): ${priceCUP.toFixed(2)} CUP`);
  console.log(`Last Updated: ${updateDate.toISOString()}`);

  // 2. Query official price
  const [officialPriceRaw] = await client.readContract({
    address: ORACLE_ADDRESS,
    abi: ORACLE_ABI,
    functionName: 'getPrice',
    args: [currencyId],
  });

  console.log(`Official Rate: ${(Number(officialPriceRaw) / 1e6).toFixed(2)} CUP`);
}

fetchCUPRate();
```

#### Using Ethers.js (v6):

```typescript
import { ethers } from 'ethers';

const ORACLE_ADDRESS = '0x90767Ec609a1EF79a4326316866583919BfF253F';
const provider = new ethers.JsonRpcProvider('https://mainnet.base.org');

const abi = [
  'function latestRoundData(uint8 currencyId) view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() view returns (uint8)',
];

async function main() {
  const oracle = new ethers.Contract(ORACLE_ADDRESS, abi, provider);

  const [roundId, answer, , updatedAt] = await oracle.latestRoundData(0);
  const decimals = await oracle.decimals();

  const formattedPrice = ethers.formatUnits(answer, decimals);
  console.log(`Current CUP Rate: ${formattedPrice} CUP per USDC`);
}

main();
```

---

## 📊 Subgraph & Indexing

All oracle operations emit indexed EVM events for Subgraph integration:

- **`TradeObserved(uint8 indexed currencyId, uint88 price, uint88 volume, address indexed buyer, address indexed seller, uint32 timestamp)`**
- **`OutlierFiltered(uint8 indexed currencyId, uint88 rejectedPrice, uint88 currentReferencePrice, uint16 deviationBps)`**
- **`FeedConfigUpdated(uint8 indexed currencyId, uint16 bufferSize, ...)`**
- **`CurrencyPauseUpdated(uint8 indexed currencyId, bool isPaused, string reason)`**

### Production Subgraph GraphQL Query:

```graphql
query GetCurrencyFeed {
  currencyFeed(id: "0") {
    id
    currencyId
    lastPrice
    lastUpdated
    bufferSize
    observationsCount
    isPaused
  }
  priceObservations(
    first: 10
    where: { currencyId: 0 }
    orderBy: timestamp
    orderDirection: desc
  ) {
    id
    price
    volume
    buyer
    seller
    timestamp
    blockNumber
  }
}
```

---

## 🖥️ Live Visual Explorer

You can inspect all live oracle feeds, verify on-chain parameters, and monitor the ring buffer in real time directly from the Achylo App:

👉 **[Achylo Price Oracle Dashboard](https://achylo.com/oracle)** (located in the top navigation under **Tools → Price Oracle**).
