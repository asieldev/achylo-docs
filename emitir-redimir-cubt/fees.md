#  Fees and Overcollateralization (Mint & Redeem)

Achylo uses a **flat percentage fee** for each flow and, in the case of Mint, adds an **overcollateralization** component to strengthen the Treasury.

---

##  How They Are Calculated
1. **Mint**
   - The fee (`mintFee`) is deducted first.
   - Then 1% destined for overcollateralization is subtracted (if you are not exempt).
   - The remaining net amount is converted into CUBT.
2. **Redeem**
   - Only the fee (`redeemFee`) is deducted.
   - You receive the net calculated by the simulator in USDC.

The simulation card clearly indicates both concepts (`Protocol Fee` and `Overcollateralization`).

---

##  Discounts and Exemptions
- **Gold Users:** users with active Gold status in P2P are automatically exempt from all fees (0% fee). This verification is performed in real time by querying the P2PEscrow contract.
- **feeExempt Accounts:** manual fee exemption (0% fee) configured by Governance (composed of Gold users, stakers, and holders), independent of Gold status.
- **Active Staking:** Users who have active stake in the contract automatically receive a 50% discount on Mint and Redeem fees.
- **CUBT Holders:** Users who hold at least 1 CUBT in their wallet receive a discount on Mint and Redeem fees (the current contract configuration grants a 25% discount).

The backend verifies these conditions on every call and the dApp reflects the result in real time, indicating it in the simulator.

---

##  Overcollateralization
- If you are not exempt, 1% of the USDC deposited in Mint is sent to the Treasury.
- This fraction appears in the simulator as **Overcollateralization** and is not converted to CUBT.
- feeExempt users or those with special permissions may be exempt from this component.

---

##  Dynamic Updates
If you see the effective fee or overcollateralization change, it is because:
- The protocol adjusted the rates within the allowed limits.
- Your status was updated (for example, you obtained or lost the feeExempt / staking / holder label).

Always review the simulator before confirming; there you will have the final breakdown applied to your account.