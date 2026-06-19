#  Public Order Management

##  Create a Public Order 
> **Note:** This function is exclusive to users with the **Merchant** role. If you don't see the "Create Public Order" button, make sure you have completed your registration in the *Become a Merchant* menu.

###  Order Capacity and Collateral
When opening the modal, you will see a summary of your operational capacity based on your guarantee:
* **Your Merchant Collateral:** The total balance you have deposited as collateral.
* **Max order capacity (2x multiplier):** Achylo allows you to publish orders for up to **double (2x)** your collateral.
* **Available:** Indicates how much capacity you have left for new orders after deducting active orders.

### Steps to configure the modal:

1. **Order Type:**
   * **Buy USDC:** You buy USDC and deliver fiat.
   * **Sell USDC:** You sell USDC and receive fiat.

2. **Fiat Currency:** Select the exchange currency.
   * *Highlighted options:* **CUP**, **CUBT** (50% discount applies), **MLC**, **USD Classic**, **COP**, **USD**, **EUR**, **GBP**, **MXN**, **ARS**, among others.

3. **Exchange Rate:** * Define how much fiat you pay/receive per 1 USDC. 
   * *Valid range:* 0.01 - 1,000,000 per unit.

4. **Transaction Limits:**
   * **Min Amount:** The minimum a user can accept from you.
   * **Max Amount:** The maximum a user can accept from you in a single operation.

5. **Total Available Amount:** * This is the total order amount. 
   * **Important:** For buy orders, tokens from your wallet are not locked; your collateral capacity is used instead.

6. **Payment Method:**
   * Select up to **5 different methods** (e.g. Zelle, Pix, Bandec, Transfer).

7. **Reclaim Timeout:**
   * Time the buyer has to complete the payment before the seller can reclaim the funds.
   * *Range:* From 15 minutes to 28 days. If left empty, the default value applies.

8. **🏪 Merchant Only:** * If you check this box, **only registered merchants** will be able to see and accept your order, adding an extra layer of security.

---

<p align="center">
  <img src="/assets/images/order.png" alt="View of the 'Create Public Order' modal" width="75%" />
</p>

<p align="center"><strong>📍 Img. No.1. View of Create Public Order.</strong></p>

---

###  “Merchant Only” Orders
Some orders are restricted and can only be accepted by users who already have **Merchant** status. 
* If you see a **red warning** on an order, it means it is exclusive to merchants. 
* If you want to access them, you must register first in the *Become a Merchant* menu.

---

##  Accept a Public Order

If you have found an offer that suits your needs, follow these steps to carry out the exchange safely:

### Steps to perform the operation:

1.  **Search:** Locate the order of interest in the marketplace. You can use **filters** to segment by fiat currency or operation type.
2.  **Selection:** Make sure you are in the **“Marketplace”** tab and click the **“Accept Order”** button of the chosen listing.
3.  **Amount configuration:**
    * Enter the amount you want to transact. 
    * The amount must be within the **minimum and maximum** range defined by the Merchant.
    * You can use the **MAX** button to take all available capacity of the order.
4.  **Payment details:** * If you are accepting a **Buy** order (where you sell USDC), you must enter the details of your account or card where the Merchant must send the fiat money.
5.  **Review and Fees:** * Verify the detailed summary of the transaction. 
    * The app will automatically show you **fee discounts** if you are operating with **CUBT**.
6.  **Confirmation:** Press **“Accept Order”**. 
    * Once processed, the dApp will send you a notification confirming that the **escrow** (smart guarantee contract) has been created successfully.

---

###  “Merchant Only” Orders
Some orders are restricted and can only be accepted by users who already have **Merchant** status. 
* If you see a **red warning** on an order, it means it is exclusive to merchants. 
* If you want to access them, you must register first in the *Become a Merchant* menu.

---

<p align="center">
  <img src="/assets/images/card_accept.png" alt="View of the 'Accept Order' card" width="50%" />
</p>
<p align="center"><strong>📍 Img. No.2. Accept a public order</strong></p>