# 💸 P2P Marketplace Fees

P2P module fees fund Achylo's **gas sponsorship** system. Every time you confirm an on-chain action from the app (create/accept orders, release funds, register merchants, start disputes, etc.), the protocol covers the gas for you and recovers that cost with a **flat USDC fee per escrow**. Always check the **Stats** section for the current value (for example, "Fee per escrow: X USDC").

---

## 🧠 What are these fees used for?
- Payment of on-chain gas when the user signs sponsored actions.
- Maintenance and monitoring of the gas pool to ensure availability.
- Sustaining the Transaction Guard and other anti-abuse layers.

> **Important:** You don't need to worry about network gas fluctuations; Achylo covers them as long as there is balance in the pool.

## ⏱️ When are fees deducted?
The escrow contract charges the fee **only once** when the transaction is successfully completed or a dispute is resolved. Specifically, the amount is deducted in the following cases:

1. **When completing a buy/sell:** It is deducted (from the total amount in custody) at the exact moment the seller **releases the funds** to the buyer (`releaseFunds`).
2. **After a dispute:** If an order enters a dispute, the fee is deducted from the final amount before being sent to the winner (`_resolveDispute`).

*Other actions on the platform (such as creating an order, requesting cancellation, or registering as a merchant) **do not** incur a fee from the Escrow.*

---

## 👥 Who pays and who is exempt?
- The **user who executes the action** pays the fee (for example, the seller when releasing funds to the buyer or when accepting an order).
- **Gold Users:** are exempt from the charge and enjoy 0% protocol fees. You can obtain Gold status by purchasing the membership or through the monthly referral system. If you are Gold, the contract omits the fee for your operations.

---

## 👀 How it appears in the UI
- Each action modal (Accept Order, Release Funds, Register Merchant, etc.) includes a summary showing the exact fee.
- Tooltips explain the fee destination and the net amount that will reach the buyer.
- If you are Gold or the action is exempt, the interface marks it with the badge "⭐ Gold User - No protocol fees".

---

## 📏 Fee Structure
- **Contract-defined fee:** same amount for all completed operations, can be checked at Stats > Protocol > P2P Escrow Protocol > Fixed Fee and Percentage Fee. The value is defined by the protocol and varies according to the order value (e.g. 0.1 USDC for orders < 100 USDC and 0.1% for orders > 100 USDC).
- **Basic requirement:** these are automatically deducted from the contract when any buy/sell action is executed.

> **Tip:** Before releasing funds or accepting a large order, check the Stats panel to confirm that the "Fee per escrow" value hasn't changed.

---

## 🧾 Quick Summary
| Question | Answer |
| :--- | :--- |
| Who defines the amount? | Governance (composed of Gold users, stakers, and holders); published on the Stats page. |
| Who pays it? | The user who executes the sponsored action, unless they are Gold. |
| What is it for? | Cover on-chain gas and maintain the sponsorship service. |
| When is it charged? | At the key moment of each flow (e.g. releasing funds). |
| Can I avoid it? | Only if you have Gold status; otherwise it is deducted automatically. |

With this scheme, users enjoy sponsored transactions without worrying about gas or complex variable fee calculations.