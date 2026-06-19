#  Private Order

## Create a Private Order (Directed to a Trusted Counterparty)

Private orders are the ideal tool when you already have a trusted buyer or seller and want to use Achylo's **smart escrow** to protect the transaction end-to-end.

### Steps to Create the Escrow:

1.  **Access:** In the main panel, go to the **“Active Orders”** tab.
2.  **Start process:** Click the **“Private Order”** button located in the upper right corner.
3.  **Configure the “Create New Escrow” modal:** Fill in the required fields:
    * **USDC Amount:** Enter the amount you are going to sell (these funds will be locked in the contract until you decide to release them).
    * **Counterparty Address:** Paste your counterparty's wallet address (who will receive the USDC upon completion).
    * **Exchange Rate (per 1 USDC):** Define the agreed fiat exchange rate.
    * **Fiat Currency:** Select the corresponding fiat currency.
    * **Fiat Card Details:** Enter your bank details or the method where you will receive the payment.
    * **Reclaim Timeout (Optional):** Time in minutes to recover your funds if the transaction stalls (minimum 30 minutes by default).
4.  **Confirmation flow:** Follow the steps indicated by the main button sequentially:
    * **Step 1:** Create Escrow.
    * **Step 2:** Fund Escrow.
5.  **Completion:** Confirm each transaction in your wallet. The app will show notifications (*toasts*) indicating progress (e.g. “Escrow created…”, “Escrow funded…”).

---

###  Important Considerations
* **Privacy:** Private orders **do not appear in the public marketplace**. Only the specified counterparty will be able to see the order on their dashboard.
* **Notifications:** If the counterparty has notifications enabled, they will receive an automatic alert at the time of creation.

###  Advantages
* **Total control:** You choose exactly who to trade with.
* **No noise:** Your offer stays off the general marketplace radar.
* **Security:** You enjoy the same smart contract protection as with public orders.

---

<p align="center">
  <img src="/assets/images/active-orders.png" alt="View of the 'Create New Escrow' modal" width="75%" />
</p>
<p align="center"><strong>📍 Img. No.1. View of the 'Create New Escrow' modal.</strong></p>