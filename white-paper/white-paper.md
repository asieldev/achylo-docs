White Paper
ACHYLO PROTOCOL
Peer-to-Peer Escrow and Stablecoin Infrastructure
Version 1.0
February 2026

Executive Summary
Achylo is a decentralized peer-to-peer (P2P) escrow protocol built on the Base blockchain, designed to facilitate secure, transparent, and efficient transactions between parties without requiring intermediaries. The protocol combines advanced smart contract architecture with user-friendly interfaces to enable trustless commerce at scale.

By leveraging blockchain technology and cryptographic guarantees, Achylo eliminates counterparty risk, reduces transaction costs, and provides dispute resolution mechanisms that protect both buyers and sellers in cross-border and domestic transactions.

1. Introduction
1.1 The Problem
Traditional P2P commerce faces fundamental challenges:

Trust Asymmetry: Buyers and sellers must trust each other or rely on centralized intermediaries

High Costs: Intermediaries charge significant fees (2-5%) for their services

Slow Settlement: Traditional payment systems require days for final settlement

Geographic Limitations: Cross-border transactions face regulatory and operational barriers

Dispute Resolution: Centralized arbitration is slow, opaque, and expensive

1.2 The Achylo Solution
Achylo addresses these challenges through a decentralized protocol that:

Eliminates Intermediaries: Direct peer-to-peer transactions without middlemen

Reduces Costs: Minimal protocol fees with transparent, on-chain fee structures

Instant Settlement: Blockchain-based settlement with finality in minutes

Global Access: Available to anyone with internet access and a digital wallet

Transparent Disputes: Community-driven arbitration with verifiable voting mechanisms

2. Protocol Architecture
2.1 Core Components
The Achylo protocol consists of four primary smart contracts working in concert:

2.1.1 P2P Escrow Contract

The escrow contract is the heart of the protocol, managing the lifecycle of transactions:

Transaction Initiation: Buyers and sellers create escrow agreements with defined terms

Collateral Management: Merchants provide collateral to secure their commitments

Payment Verification: Automated verification of payment methods and amounts

Fund Custody: Secure holding of stablecoins during transaction lifecycle

Dispute Resolution: Decentralized arbitration through community voting

Key Features:

Multi-state transaction management (pending, confirmed, released, disputed)

Customizable payment methods and exchange rates

Tiered user reputation system (new user, active user, merchant, gold user)

Automatic timeout mechanisms for transaction finality

Collateral slashing for fraudulent behavior

2.1.2 CUBT Token Contract

The CUBT token serves as the protocol's native utility and value token:

Minting: Users convert stablecoins (USDT) into CUBT tokens

Redemption: Users convert CUBT tokens back into stablecoins

Fee Structure: Dynamic mint/redeem fees based on protocol economics

Overcollateralization: Ensures token stability through collateral backing

Staking Integration: Rewards for long-term token holders

Economic Model:

Mint Fee: Applied when converting USDT → CUBT

Redeem Fee: Applied when converting CUBT → USDT

Fee Reductions: Available through holding, staking, or gold membership

Overcollateralization Rate: Maintains token stability and security

2.1.3 Referral System Contract

The referral system incentivizes network growth and user acquisition:

Referral Registration: Users can register referrers to earn commissions

Commission Tracking: Automated calculation of referral rewards

Tier-Based Rewards: Higher rewards for more active referrers

Circular Prevention: Prevents fraudulent referral chains

Reward Distribution: Direct payment to referrer wallets

Incentive Structure:

Commission on referred user transactions

Bonus multipliers for high-volume referrers

Gold membership benefits for top referrers

Transparent reward tracking and history

2.1.4 Recovery Module Contract

The recovery module provides account security and recovery mechanisms:

Guardian Registration: Users designate backup guardians

Email Verification: Secure recovery through verified email addresses

Timelock Protection: Prevents immediate account takeover

Ownership Transfer: Secure transfer of account control

Social Recovery: Community-assisted account recovery

3. Transaction Flow
3.1 Standard Escrow Transaction

Copy
1. INITIATION
   ├─ Buyer creates escrow with terms
   ├─ Seller accepts order
   └─ Collateral locked

2. PAYMENT
   ├─ Buyer sends payment via agreed method
   ├─ Seller confirms receipt
   └─ Funds held in escrow

3. DELIVERY
   ├─ Seller delivers goods/services
   ├─ Buyer confirms receipt
   └─ Escrow releases funds

4. SETTLEMENT
   ├─ Seller receives payment
   ├─ Buyer receives goods/services
   └─ Transaction complete
3.2 Dispute Resolution Flow

Copy
1. DISPUTE INITIATION
   ├─ Either party raises dispute
   ├─ Evidence submission period
   └─ Arbiters assigned

2. ARBITRATION
   ├─ Community arbiters review evidence
   ├─ Voting period (24-48 hours)
   └─ Majority decision binding

3. RESOLUTION
   ├─ Funds distributed per decision
   ├─ Losing party may lose collateral
   └─ Transaction finalized
4. Security Model
4.1 Collateral System
Merchants must provide collateral to participate in transactions:

Collateral Requirement: Percentage of transaction value

Slashing Mechanism: Automatic deduction for fraudulent behavior

Reclaim Period: Collateral returned after successful transactions

Tiered Requirements: Higher requirements for new merchants

4.2 Rate Limiting
The protocol implements transaction rate limiting to prevent abuse:

Tier-Based Limits: Different limits for user reputation levels

Hourly/Daily Caps: Prevents rapid-fire transactions

Critical Operation Exemption: Essential operations bypass limits

Cooldown Periods: Prevents burst attacks

4.3 Account Freezing
Accounts can be frozen for suspicious activity:

Automatic Triggers: Fraud detection and dispute losses

Manual Override: Protocol governance can freeze accounts

Appeal Process: Users can appeal freezing decisions

Unfreezing: Conditions-based automatic unfreezing

4.4 Cryptographic Security
Smart Contract Audits: Regular security audits by third parties

Multi-Signature Controls: Treasury operations require multiple signatures

Timelock Mechanisms: Critical changes subject to timelock delays

Upgrade Governance: Protocol upgrades require community approval

5. Economic Model
5.1 Fee Structure
The protocol generates revenue through transparent, on-chain fees:

Escrow Fees:

Transaction fee: 0.1% (configurable by governance)

Dispute resolution fee: Deducted from losing party collateral

Arbitration rewards: Paid to arbiters from dispute fees

Token Fees:

Mint fee: 0.1-1% (USDT → CUBT)

Redeem fee: 0.1-1% (CUBT → USDT)

Fee reductions available through:

Token holding (up to 50% reduction)

Staking participation (up to 30% reduction)

Gold membership (up to 75% reduction)

5.2 Fee Distribution
All fees are transparently distributed:

Treasury: Protocol development and operations

Arbiters: Dispute resolution compensation

Stakers: Rewards for network security

Referrers: Commission on referred transactions

5.3 Token Economics
CUBT Token Supply:

Minted on demand when users deposit USDT

Redeemed on demand when users withdraw USDT

Backed by USDT reserves (overcollateralized)

Deflationary through fee burning

Value Proposition:

Access to lower fees through holding

Staking rewards for long-term holders

Governance participation rights

Exclusive benefits through gold membership

6. User Tiers and Reputation
6.1 Tier System
Users progress through reputation tiers based on transaction history:

New User

0 completed transactions

Standard transaction limits

Standard fee rates

Limited collateral requirements

Active User

1+ completed transactions

2x transaction limits

Reduced collateral requirements

Merchant

10+ completed transactions

Unlimited transaction limits

Can create public orders

Can provide collateral

Gold User

50+ completed transactions OR paid membership

Unlimited transaction limits

Priority dispute resolution

Exclusive features and benefits

6.2 Reputation Mechanics
Transaction History: Tracked on-chain with full transparency

Dispute Record: Losses and wins affect reputation

7. Governance and Decentralization
7.1 Protocol Governance
The Achylo protocol is governed by its community:

Governance Token: CUBT holders participate in decisions

Proposal System: Community members can propose changes

Voting: Token-weighted voting on protocol parameters

Timelock: Changes subject to delay for security

7.2 Parameter Control
Community governance controls:

Fee Rates: Escrow and token fees

Collateral Requirements: Merchant collateral percentages

Rate Limits: Transaction limits per tier

Arbitration Rules: Dispute resolution parameters

Treasury Allocation: Fund distribution decisions

7.3 Decentralization Roadmap
Phase 1 (Current): Centralized governance with community input
Phase 2: Transition to token-weighted voting
Phase 3: Full decentralized autonomous organization (DAO)
Phase 4: Community-controlled protocol parameters

8. Risk Management
8.1 Smart Contract Risks
Audit Program: Regular third-party security audits

Bug Bounty: Incentives for responsible vulnerability disclosure

Upgrade Mechanism: Ability to fix critical issues quickly

Insurance: Protocol insurance for smart contract failures

8.2 Economic Risks
Overcollateralization: Maintains token stability

Reserve Monitoring: Continuous verification of backing

Fee Mechanisms: Automatic adjustment based on protocol health

Liquidity Management: Ensures redemption capability

8.3 Operational Risks
Dispute Mechanisms: Community arbitration prevents monopoly

Appeal Process: Users can challenge unfair decisions

Transparency: All actions recorded on-chain

Governance Oversight: Community can override decisions

9. Scalability and Performance
9.1 Blockchain Infrastructure
Base Network: Built on Base, an Ethereum L2 with high throughput

RPC Infrastructure: Multiple Alchemy endpoints for reliability

Fallback Mechanisms: Automatic failover to public RPCs

Transaction Finality: Sub-minute confirmation times

9.2 Throughput
Transaction Capacity: Thousands of transactions per second

Cost Efficiency: Sub-cent transaction costs

Batch Processing: Efficient handling of multiple operations

Scalability Path: Ready for future L2 improvements

10. Use Cases
10.1 Cross-Border Commerce
International Payments: Secure payments across borders

Currency Exchange: Built-in exchange rate mechanisms

Regulatory Compliance: Payment method verification

Dispute Resolution: Neutral arbitration for international disputes

10.2 Freelance Services
Milestone Payments: Escrow for service delivery

Quality Assurance: Buyer confirmation before payment

Dispute Protection: Arbitration for quality disputes

Reputation Building: On-chain proof of successful work

10.3 Marketplace Operations
Merchant Onboarding: Collateral-based trust system

Public Orders: Merchants can post standing offers

Bulk Transactions: Efficient handling of high-volume trades

Seller Protection: Collateral ensures buyer commitment

10.4 Stablecoin Infrastructure
Token Minting: Convert fiat to stablecoin

Token Redemption: Convert stablecoin back to fiat

Fee Optimization: Discounts for active users

Yield Generation: Staking rewards for token holders

12. Conclusion
Achylo represents a fundamental shift in how peer-to-peer commerce can operate. By combining the security and transparency of blockchain technology with practical, user-friendly interfaces, the protocol enables trustless transactions at scale.

The combination of smart escrow mechanisms, community-driven arbitration, and aligned economic incentives creates a system where all participants benefit from honest behavior. Whether facilitating international commerce, freelance services, or marketplace operations, Achylo provides the infrastructure for the next generation of peer-to-peer transactions.

Appendix A: Technical Specifications
Smart Contract Addresses
P2P Escrow: Configurable via environment variables

CUBT Token: Configurable via environment variables

Referral System: Configurable via environment variables

Recovery Module: Configurable via environment variables

Supported Networks
Base Sepolia (Testnet)

Base Mainnet (Production)

Stablecoin Support
USDT: Primary stablecoin for transactions

USDC: Secondary stablecoin support

Appendix B: Glossary
Term
Definition
Escrow

Neutral holding of funds during a transaction

Collateral

Security deposit required from merchants

Arbitration

Community-based dispute resolution

CUBT

Achylo's native utility token

Mint

Convert stablecoin to CUBT token

Redeem

Convert CUBT token back to stablecoin

Referral

Commission-based user acquisition

Gold User

Premium tier with enhanced benefits

Rate Limiting

Transaction frequency restrictions

Overcollateralization

Excess backing to ensure stability

Appendix C: Contact and Resources
Website: https://achylo.com

Disclaimer: This whitepaper is for informational purposes only and does not constitute investment advice. Cryptocurrency and blockchain technologies carry inherent risks. Users should conduct their own research and consult with financial advisors before participating in the Achylo protocol.

© 2026 Achylo Protocol. All rights reserved.