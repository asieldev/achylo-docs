# On-Chain Price Oracle (Chainlink Compatible)

The **Achylo Price Oracle** (`AchyloPriceOracle`) is a decentralized, manipulation-resistant on-chain pricing engine deployed on **Base Mainnet**. It provides real-time, volume-weighted exchange rates between fiat currencies and stablecoins (USDC) derived directly from completed, on-chain settled P2P escrows.

It natively implements both **custom institutional methods** (VWAP, Median, Ring Buffer inspection) and the industry-standard **Chainlink `AggregatorV3Interface`** format, enabling seamless plug-and-play integration with DeFi lending protocols, collateral vaults, derivatives, payment processors, and automated market makers.

---

## Contract Deployment Details

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

## Currency Identifiers (`currencyId`)

The oracle indexes each fiat currency by its dynamic `currencyId` (defined in the `PaymentMethodRegistry` contract):

| `currencyId` | Code | Name | Example Rate (6 Decimals) | Scaled Price |
| :---: | :---: | :--- | :---: | :---: |
| `0` | **CUP** | Peso Cubano | `930000000` | 930.00 CUP / USDC |
| `1` | **CUBT** | CUBT Token | `1000000` | 1.00 CUBT / USDC |
| `2` | **MLC** | Moneda Libremente Convertible | *Configured on-demand* | *Dynamic* |
| `3+` | *Dynamic* | Additional fiat currencies | *Configured on-demand* | *Dynamic* |

> **Units & Precision:** Rates represent **units of fiat currency per 1 USDC**, scaled by `10^6`. For example, `930000000` corresponds to `930000000 / 1e6 = 930.00 CUP/USDC`.

---

## Institutional Security & Anti-Manipulation Engine

Unlike naive DEX spot oracles that are vulnerable to flash loans and momentary liquidity drainage, the Achylo Price Oracle calculates exchange rates exclusively from real, completed P2P escrows upon `releaseFunds()`. Every trade must pass through an institutional multi-layer verification pipeline before admission into the sliding ring buffer.

```
[ P2P Escrow Finalized: releaseFunds() ]
                 │
                 ▼
  [ 1. Minimum Volume Filter ] ──── (Volume < minVolume? Dropped)
                 │
                 ▼
  [ 2. Anti-Wash Trade Cooldown ] ── (Same pair within cooldown? Dropped)
                 │
                 ▼
  [ 3. Intra-Block Cooldown ] ───── (Same pair in same block? Dropped)
                 │
                 ▼
  [ 4. Volume Capping ] ─────────── (Effective volume capped at maxVolumePerTradeCap)
                 │
                 ▼
  [ 5. Circuit Breaker Outlier ] ── (Deviation > maxDeviationBps vs refPrice? Dropped)
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

---

## Security Parameters & Mathematical Specifications

The smart contract features full parametric configurability both globally and per individual currency feed (`currencyConfigs[currencyId]`), governed by strict contract-level guardrails to prevent misconfiguration or governance denial-of-service.

### Comprehensive Parameters Table

| Parameter | Storage Variable | Global Default | Allowed Guardrail Range | Units / Representation |
| :--- | :--- | :---: | :---: | :--- |
| **Window Capacity (N)** | `defaultBufferSize` | `10` | `3` to `50` | Number of trade observations |
| **Minimum Volume** | `defaultMinVolume` | `5e6` (5 USDC) | `0.01e6` to `100_000e6` | USDC (`1e6` = 1.00 USDC) |
| **Volume Cap per Trade** | `defaultMaxVolumePerTradeCap` | `5000e6` (5,000 USDC) | `minVolume` to unlimited | USDC (`1e6` = 1.00 USDC) |
| **Circuit Breaker Band** | `defaultMaxDeviationBps` | `3500` (35.00%) | `100` to `10000` bps | Basis Points (`100 bps` = 1.00%) |
| **Stale Threshold** | `defaultStaleThreshold` | `86400` (24 Hours) | `600` (10m) to `7776000` (90d) | Seconds |
| **Pair Cooldown** | `pairCooldown` | `300` (5 Minutes) | `0` to `86400` (24 Hours) | Seconds |
| **Intra-Block Cooldown** | `blockCooldownEnabled` | `true` | `true` / `false` | Boolean flag |
| **Min Obs for Calculation** | `defaultMinObservations` | `2` | `1` to `N` | Count of observations |
| **Min Obs for Outlier Check**| `defaultMinObservationsForOutlier` | `2` | `1` to `N` | Count of observations |
| **Primary Pricing Mode** | `defaultPriceMode` | `PriceMode.VWAP` | `VWAP (0)` or `Median (1)` | Enum |

---

### 1. Sliding Window N (Dynamic Ring Buffer)

The oracle maintains an on-chain cyclic ring buffer of fixed capacity `N` (`bufferSize`) per currency feed:

<div class="formula-card">
  <div class="formula-label">Ring Buffer State Structure</div>
  <div class="formula-math">Observation[N] = { (Price<sub>0</sub>, Vol<sub>0</sub>, time<sub>0</sub>, block<sub>0</sub>), ..., (Price<sub>N-1</sub>, Vol<sub>N-1</sub>, time<sub>N-1</sub>, block<sub>N-1</sub>) }</div>
  <div class="formula-desc">Fixed-capacity cyclic buffer storing the most recent <code>N</code> finalized escrow transactions.</div>
</div>

Each insertion executes in `O(1)` storage complexity:

```solidity
head = (head + 1) % N;
count = count < N ? count + 1 : N;
```

**Mathematical Rationale & Gas Guardrail:**
* Bounding `N` between 3 and 50 (`3 <= N <= 50`) ensures that calculation loops for both VWAP and in-memory Insertion Sort never exceed block gas limits, completely eliminating algorithmic gas denial-of-service vulnerabilities.
* When governance or an administrator updates `N` dynamically to a smaller capacity `N' < N`, the contract dynamically truncates excess array slots via `.pop()` and resets the cyclic pointer:

```solidity
head = head % newCapacity;
```

This preserves historical continuity without requiring feed re-initialization.

---

### 2. Minimum Volume Filter

Every finalized escrow delivers transaction volume `tradeVolume` denominated in USDC with 6 decimal places. The observation is evaluated against the minimum volume threshold:

<div class="formula-card">
  <div class="formula-label">Volume Admission Rule</div>
  <div class="formula-math">tradeVolume &gt;= minVolumeThreshold</div>
  <div class="formula-desc">Global default: <code>5 USDC</code> (<code>5,000,000</code> units). Any transaction with volume below this threshold is dropped immediately.</div>
</div>

If `tradeVolume < minVolume`, the transaction is immediately discarded before modifying any storage slot.

**Mathematical Rationale:**
* Protects against Sybil volume dilution. In an open P2P marketplace without a minimum volume threshold, a malicious actor could generate `N` micro-escrows of `0.000001 USDC` with skewed prices to completely overwrite the ring buffer at negligible capital cost.
* Setting `minVolume = 5 USDC` imposes a prohibitive economic cost and liquidity requirement on any attempt to influence the feed.

---

### 3. Volume Capping per Trade

To prevent high-net-worth participants (whales) from dominating the moving average, the volume injected into the weighting formula is capped:

<div class="formula-card">
  <div class="formula-label">Effective Volume Formula</div>
  <div class="formula-math">effectiveVolume = min(tradeVolume, maxVolumePerTradeCap)</div>
  <div class="formula-desc">Default cap: <code>5,000 USDC</code> (<code>5,000,000,000</code> units). Trades larger than this cap are admitted with weight restricted to <code>5,000 USDC</code>.</div>
</div>

**Mathematical Rationale:**
In standard Volume-Weighted Average Price, the relative weight `w_i` of an observation `i` is:

```text
       effectiveVolume_i
w_i = ───────────────────
       ∑ effectiveVolume
```

If a counterparty executes a single `100,000 USDC` escrow alongside nine `100 USDC` escrows:
* **Without volume capping:** The single large transaction would control:
  ```text
  100,000 / (100,000 + 9 × 100) = 100,000 / 100,900 ≈ 99.11%
  ```
* **With volume capping applied (`cap = 5,000 USDC`):**
  ```text
  5,000 / (5,000 + 900) = 5,000 / 5,900 ≈ 84.75%
  ```

Combining volume capping with the median engine ensures that even extreme volume cannot arbitrarily distort the price.

---

### 4. Circuit Breaker & Outlier Band

Incoming trade prices are checked against the last calculated reference price `refPrice = lastCalculatedPrice`. The relative deviation in basis points (`bps`) is calculated on-chain using integer arithmetic:

<div class="formula-card">
  <div class="formula-label">Deviation Calculation (Basis Points)</div>
  <div class="formula-math">deviationBps = (|tradePrice - refPrice| × 10,000) / refPrice</div>
  <div class="formula-desc">Where <code>100 bps = 1.00%</code>. Example: a price swing from 930 to 1,260 yields <code>(|1260 - 930| × 10,000) / 930 = 3,548 bps (35.48%)</code>.</div>
</div>

The trade is categorized as an anomalous outlier and rejected if:

```solidity
// Outlier rejection rule (trade is discarded):
deviationBps > maxDeviationBps &&
observationCount >= minObservationsForOutlierCheck &&
(block.timestamp - lastUpdated) < staleThreshold
```

When triggered, the contract drops the trade, preserves the existing ring buffer state, and emits:

```solidity
event OutlierFiltered(uint8 indexed currencyId, uint88 price, uint88 referencePrice, uint16 deviationBps);
```

**Stale Price Recalibration Exemption:**
If market conditions remain inactive such that `(block.timestamp - lastUpdated) >= staleThreshold` (default 24 hours), the circuit breaker condition is bypassed. This permits legitimate macroeconomic shifts (e.g. sharp currency devaluations or central bank rate adjustments) to be assimilated into the oracle without deadlock.

---

### 5. Anti-Wash Trading (Canonical Pair Cooldown)

To prevent circular trading between colluding accounts, the oracle tracks the timestamp of the last trade between any two addresses. The pair identity is computed canonically using lexicographical ordering:

```solidity
bytes32 pairHash = keccak256(abi.encodePacked(
    buyer < seller ? buyer : seller,
    buyer < seller ? seller : buyer,
    currencyId
));
```

A trade between counterparty `A` and counterparty `B` is dropped if:

<div class="formula-card">
  <div class="formula-label">Anti-Wash Trade Cooldown Rule</div>
  <div class="formula-math">(block.timestamp - lastPairTradeTimestamp[pairHash]) &lt; pairCooldown</div>
  <div class="formula-desc">Default cooldown: <code>300 seconds (5 minutes)</code>. Drops rapid back-and-forth trades between the same participants within the window.</div>
</div>

This introduces temporal friction that makes rapid back-and-forth spoofing mathematically ineffective.

---

### 6. Intra-Block Cooldown (Anti Flash-Loan Engine)

To guarantee immunity against atomic flash loans and single-block sandwich manipulation:

<div class="formula-card">
  <div class="formula-label">Flash-Loan Block Isolation Rule</div>
  <div class="formula-math">blockCooldownEnabled == true &amp;&amp; lastPairTradeBlockNumber[pairHash] == block.number</div>
  <div class="formula-desc">Blocks any second trade between the same accounts within the exact same Ethereum / Base block number.</div>
</div>

If counterparty `A` and `B` execute an escrow within block `B_n`, any subsequent trade between the same accounts in block `B_n` is rejected. Because flash loans must borrow, manipulate, and repay funds within a single block transaction sequence, this mechanism eliminates flash-loan attacks entirely.

---

### 7. Mathematical Aggregation Algorithms

The contract supports two independent mathematical aggregation algorithms:

#### Engine A: Volume-Weighted Average Price (VWAP)

For a sliding window of `k` active observations (`k <= N`):

<div class="formula-card">
  <div class="formula-label">Volume-Weighted Average Price (VWAP) Formula</div>
  <div class="formula-math">
          ∑ [ Price<sub>i</sub> × effectiveVolume<sub>i</sub> ]  (for i = 0 .. k-1)<br>
P<sub>VWAP</sub> = ────────────────────────────────────────────────────────────<br>
                    ∑ [ effectiveVolume<sub>i</sub> ]  (for i = 0 .. k-1)
  </div>
  <div class="formula-desc">Every price point is weighted proportionally by its capped real volume settled in USDC.</div>
</div>

**Integer Precision & Overflow Safety:**
* `Price_i` and `effectiveVolume_i` are stored as `uint88` (up to ≈ 3 × 10^26).
* The product `Price_i * effectiveVolume_i` is accumulated into a 256-bit unsigned integer (`uint256`), supporting up to `50 × (10^14 × 10^14) = 5 × 10^29 << 2^256 - 1`, providing mathematical proof against arithmetic overflow.

#### Engine B: Statistical Median Price

The observations array `{ Price_0, ..., Price_{k-1} }` is copied to memory and sorted in-place in ascending order:

```text
Price_(0) <= Price_(1) <= ... <= Price_(k-1)
```

The median price is extracted according to:

<div class="formula-card">
  <div class="formula-label">Statistical Median Extraction</div>
  <div class="formula-math">
If k is odd:  P<sub>Median</sub> = Price<sub>(k - 1) / 2</sub><br><br>
If k is even: P<sub>Median</sub> = ( Price<sub>(k / 2) - 1</sub> + Price<sub>k / 2</sub> ) / 2
  </div>
  <div class="formula-desc">Sorts observations in memory and selects the middle value. Provides 50% breakdown point immunity against outlier spikes.</div>
</div>

**Statistical Robustness:**
The median offers a breakdown point of 50%. An attacker must control at least `floor(k / 2) + 1` observations in the active buffer to alter the output value. Outlier spikes and volume manipulations cannot influence the median price.

---

## How to Query the Oracle

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

## Live Visual Explorer

You can inspect all live oracle feeds, verify on-chain parameters, and monitor the ring buffer in real time directly from the Achylo App:

**[Achylo Price Oracle Dashboard](https://achylo.com/oracle)** (located in the top navigation under **Tools → Price Oracle**).
