---
"Achylo Protocol White Paper"
version: "v1.0.0"
Actualizado: "14 de noviembre de 2025"
---
---

# Achylo Protocol — Peer-to-Peer Escrow and Stablecoin Infrastructure

## Executive Summary

Achylo is a decentralized peer-to-peer (P2P) escrow protocol built on the Base blockchain. It enables secure, transparent, and efficient transactions without intermediaries by combining advanced smart-contract architecture with user-friendly interfaces. Leveraging cryptographic guarantees, Achylo minimizes counterparty risk, reduces costs, and delivers dispute resolution mechanisms that protect all participants across cross-border and domestic transactions.

## 1. Introduction

### 1.1 The Problem

Traditional P2P commerce suffers from:

- **Trust asymmetry:** Parties must trust each other or rely on centralized intermediaries.
- **High costs:** Intermediaries typically charge 2–5% fees.
- **Slow settlement:** Legacy payment systems require days to settle.
- **Geographic limitations:** Cross-border deals face regulatory and operational friction.
- **Opaque disputes:** Centralized arbitration is slow, expensive, and difficult to audit.

### 1.2 The Achylo Solution

Achylo addresses these gaps by providing:

- **Direct P2P settlement** with no middlemen.
- **On-chain fees** that are minimal, transparent, and configurable.
- **Fast finality** through blockchain confirmation in minutes.
- **Global access** from any internet-connected wallet.
- **Community-driven arbitration** with verifiable votes and outcomes.

## 2. Protocol Architecture

### 2.1 Core Components

Achylo relies on four primary smart contracts working in concert.

#### 2.1.1 P2P Escrow Contract

Manages the entire lifecycle of an escrow transaction:

- Transaction initiation with explicit terms.
- Collateral management for merchants.
- Payment method verification and enforcement.
- Secure custody of stablecoins until settlement.
- Dispute workflows handled by community arbiters.

**Key capabilities**

- Multi-state management (pending, confirmed, released, disputed).
- Custom payment methods and exchange rates.
- Tiered reputation system (new, active, merchant, gold).
- Automatic timeouts to guarantee finality.
- Collateral slashing for fraudulent behavior.

#### 2.1.2 CUBT Token Contract

Acts as the utility and value token for the protocol:

- **Minting:** Converts USDT into CUBT.
- **Redemption:** Converts CUBT back into USDT.
- **Dynamic fees:** Mint and redeem fees adjust to protocol economics.
- **Overcollateralization:** Ensures price stability and security.
- **Staking integration:** Rewards long-term holders.

#### 2.1.3 Referral System Contract

Incentivizes network growth and user acquisition:

- Registers referrers and tracks commissions.
- Calculates rewards programmatically.
- Applies tier-based bonuses for active referrers.
- Blocks circular or fraudulent referral loops.
- Distributes rewards directly to wallet addresses.

#### 2.1.4 Recovery Module Contract

Provides account safety and optional recovery:

- Guardian registration and management.
- Email verification for recovery requests.
- Timelock protections against instant takeovers.
- Secure ownership transfers when needed.
- Social recovery with community involvement.

## 3. Transaction Flow

### 3.1 Standard Escrow Transaction

1. **Initiation**
   - Buyer creates an escrow with defined terms.
   - Seller accepts and collateral is locked (if required).
2. **Payment**
   - Buyer sends payment through the agreed method.
   - Seller confirms receipt while funds remain in escrow.
3. **Delivery**
   - Seller delivers goods or services.
   - Buyer confirms delivery.
   - Smart contract releases funds when conditions are met.
4. **Settlement**
   - Seller receives payment.
   - Buyer receives goods/services.
   - Escrow closes on-chain with immutable proof.

### 3.2 Dispute Resolution Flow

1. **Dispute initiation**
   - Either party raises a dispute.
   - Evidence submission window opens.
   - Arbiters are assigned automatically.
2. **Arbitration**
   - Community arbiters review evidence.
   - Voting period (24–48 hours) determines the outcome.
   - Majority vote is binding.
3. **Resolution**
   - Funds are distributed according to the decision.
   - Losing party may forfeit collateral.
   - Transaction closes with an auditable record.

## 4. Security Model

### 4.1 Collateral System

- Merchants post collateral proportional to order capacity.
- Slashing mechanisms punish fraudulent behavior.
- Collateral returns after successful activity, subject to cooldowns.
- Tiered requirements ensure new merchants ramp up responsibly.

### 4.2 Rate Limiting

- Tier-based hourly and daily limits mitigate spam.
- Cooldowns prevent burst attacks.
- Critical operations can be exempted when necessary.

### 4.3 Account Freezing

- Automatic triggers respond to fraud signals or dispute losses.
- Governance can manually freeze accounts if required.
- Users retain an appeal process with defined criteria.
- Unfreezing occurs automatically once conditions are satisfied.

### 4.4 Cryptographic Security

- Regular third-party smart-contract audits.
- Multi-signature controls across treasury operations.
- Timelocks before critical upgrades.
- Governance approval required for protocol changes.

## 5. Economic Model

### 5.1 Fee Structure

Achylo generates revenue via transparent on-chain fees.

**Escrow fees**

- Base transaction fee: 0.1% (governance configurable).
- Dispute fees deducted from losing party collateral.
- Arbitration rewards paid from dispute fees.

**Token fees**

- Mint fee: 0.1–1% (USDT → CUBT).
- Redeem fee: 0.1–1% (CUBT → USDT).

**Fee reductions**

- Token holding: up to 50% discount.
- Staking: up to 30% additional reduction.
- Gold membership: up to 75% reduction.

### 5.2 Fee Distribution

- **Treasury:** Funds protocol operations and development.
- **Arbiters:** Receive compensation for dispute resolution.
- **Stakers:** Earn rewards for securing the network.
- **Referrers:** Collect commissions on referred volume.

### 5.3 Token Economics

- CUBT mints on demand when users deposit USDT.
- Redeems on demand when users withdraw USDT.
- Backed by overcollateralized reserves.
- Deflationary pressure achieved through fee burning.
- Provides lower fees, staking rewards, governance voting, and gold-tier perks.

## 6. User Tiers and Reputation

### 6.1 Tier System

- **New User:** 0 completed escrows, standard limits/fees.
- **Active User:** 1+ escrows, doubled limits, reduced collateral.
- **Merchant:** 10+ escrows, unlimited limits, can post public orders and supply collateral.
- **Gold User:** 50+ escrows or paid membership, unlimited limits, priority dispute handling, exclusive benefits.

### 6.2 Reputation Mechanics

- On-chain transaction history provides transparency.
- Dispute results (wins/losses) modify standing and future requirements.

## 7. Governance and Decentralization

### 7.1 Protocol Governance

- CUBT holders participate through token-weighted voting.
- Community can submit proposals to adjust protocol parameters.
- Approved changes execute after timelock delays for security.

### 7.2 Parameter Control

Governance controls:

- Fee rates for escrow and token operations.
- Merchant collateral requirements.
- Rate limits per tier.
- Arbitration and dispute policies.
- Treasury allocations and budgets.

### 7.3 Decentralization Roadmap

1. **Phase 1:** Centralized governance with community feedback.
2. **Phase 2:** Token-weighted voting rolls out incrementally.
3. **Phase 3:** Transition to a full DAO structure.
4. **Phase 4:** Entire protocol configuration managed by the community.

## 8. Risk Management

### 8.1 Smart-Contract Risks

- Continuous audits by independent firms.
- Bug bounty programs incentivize responsible disclosure.
- Upgrade mechanisms allow critical fixes.
- Optional protocol insurance for catastrophic failures.

### 8.2 Economic Risks

- Overcollateralization safeguards token stability.
- Reserves monitored to ensure backing ratios.
- Fee mechanisms adjust dynamically to protocol health.
- Liquidity management guarantees redemption capacity.

### 8.3 Operational Risks

- Community arbitration avoids centralized control.
- Appeal processes handle contested outcomes.
- Full transparency through on-chain logs.
- Governance can override actions that threaten protocol integrity.

## 9. Scalability and Performance

### 9.1 Blockchain Infrastructure

- Built on Base (Ethereum L2) for throughput and low costs.
- Multiple Alchemy RPC endpoints increase reliability.
- Automatic failover to public RPCs.
- Sub-minute confirmation times for user operations.

### 9.2 Throughput

- Engineered for thousands of transactions per second.
- Sub-cent transaction fees in typical conditions.
- Batch processing optimizes multi-call workflows.
- Prepared for future L2 improvements without major redesigns.

## 10. Use Cases

### 10.1 Cross-Border Commerce

- Secure international payments.
- Built-in exchange-rate mechanisms.
- Payment method verification to aid compliance.
- Neutral arbitration for disputes across jurisdictions.

### 10.2 Freelance Services

- Milestone or deliverable-based escrows.
- Buyer confirmation protects final payments.
- Arbitration for quality or delivery conflicts.
- On-chain track record builds reputation.

### 10.3 Marketplace Operations

- Collateral-based onboarding for merchants.
- Public order books for standing offers.
- Efficient handling of high-volume trades.
- Collateral ensures both parties remain accountable.

### 10.4 Stablecoin Infrastructure

- Token minting converts fiat-backed stablecoins into CUBT.
- Redemption routes back to fiat on demand.
- Fee optimization for users holding CUBT or staking.
- Staking yields for token holders.

## 12. Conclusion

Achylo unites secure escrow mechanics, transparent arbitration, and incentive-aligned economics to enable trustless commerce at scale. By making peer-to-peer trade safer and more efficient, Achylo equips marketplaces, freelancers, and cross-border businesses with the infrastructure needed for the next generation of decentralized transactions.

## Appendix A — Technical Specifications

- **Smart contract addresses:** Parameterized via environment variables for P2P Escrow, CUBT Token, Referral System, and Recovery Module.
- **Supported networks:** Base Sepolia (testnet) and Base Mainnet (production).
- **Stablecoin support:** Primary—USDT; secondary—USDC.

## Appendix B — Glossary

- **Escrow:** Neutral holding of funds during a transaction.
- **Collateral:** Security deposit required from merchants.
- **Arbitration:** Community-based dispute resolution.
- **CUBT:** Achylo’s native utility token.
- **Mint:** Convert stablecoin to CUBT.
- **Redeem:** Convert CUBT back to stablecoin.
- **Referral:** Commission-based user acquisition program.
- **Gold User:** Premium tier with enhanced benefits.
- **Rate limiting:** Controls transaction frequency to prevent abuse.
- **Overcollateralization:** Excess backing that guarantees stability.

## Appendix C — Contact and Resources

- **Website:** [https://achylo.com](https://achylo.com)
- **Disclaimer:** This white paper is informational and not investment advice. Cryptocurrency and blockchain technologies carry inherent risks; conduct your own research and consult financial professionals before participating.
- © 2026 Achylo Protocol. All rights reserved.