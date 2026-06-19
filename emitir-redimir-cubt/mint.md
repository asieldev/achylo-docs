#  Mint CUBT

Guide to deposit **USDC** and receive **CUBT** using the **Mint** tab of the “Mint & Redeem” module.

---

##  Prerequisites
- Wallet connected on the correct network (**Base** or **Base Sepolia**).
- Sufficient USDC balance and allowance available for the Mint contract (managed automatically if you use the **Approve & Mint** button).

---

##  Step by Step
1. **Enter the amount**: in the Mint tab, write how many USDC you want to deposit. Use the quick 25%, 50%, 75%, or 100% buttons to fill the field according to your balance.
2. **Analyze the simulator**: the simulation card shows
   - Estimated CUBT to receive (net).
   - Effective fee according to your active discounts.
   - Overcollateralization portion that will go to the Treasury if applicable.
3. **Approve and mint**:
   - If it's your first time or your allowance is low, click **Approve & Mint**. The dApp will send the approval and, once confirmed, will launch the mint (two automatic steps).
   - If you already had sufficient allowance, just press **Mint** to execute a single transaction.
4. **Confirm in your wallet**: accept the transactions in MetaMask (or another compatible wallet). The interface shows toasts indicating “Step 1/2…”, “Step 2/2…” and “Mint successful”.
5. **Automatic update**: after on-chain confirmation, the app waits a few seconds and refreshes balances, metrics, and discounts.

---

##  Useful Notes
- If you changed networks or made operations outside the dApp, use the **Refresh** button at the top to synchronize balances.
- When the simulator shows “Overcollateralization”, it means that 1% of the USDC amount is sent to the Treasury as backing. This portion is not converted to CUBT.
- If your account is marked as **feeExempt** or you have discounts (staking / minimum CUBT balance), you will see the reduced fee directly in the simulator.