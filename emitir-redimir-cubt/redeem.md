#  Redeem CUBT

Guide to redeem **CUBT** and receive **USDC** using the **Redeem** tab of the “Mint & Redeem” module.

---

##  Before You Begin
- Wallet connected on Base / Base Sepolia.
- CUBT available in your balance (and not locked in an escrow).

---

##  Step by Step
1. **Select Redeem**: switch to the Redeem tab within the module.
2. **Enter the amount**: write how many CUBT you want to redeem. You can use the **MAX** button if you want to free up your entire balance.
3. **Review the simulator**:
   - You will see the estimated USDC **before and after** the fee.
   - Active discounts are shown, or if you are **feeExempt**.
4. **Confirm**: click **Redeem** and approve the transaction in your wallet. The interface will show progress toasts and the final result.
5. **Automatic update**: just like in Mint, the dApp waits a few seconds after confirmation and refreshes balances and statistics.

---

##  Tips
- If you just received CUBT from another account or contract, use **Refresh** to update the balance before redeeming.
- If the simulator shows the fee is zero, it means you are exempt (feeExempt or applicable Gold/staking status).
- The Redeem flow has no overcollateralization: only the fee configured at that time is deducted.