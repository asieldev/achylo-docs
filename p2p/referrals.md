# Referral System

The Achylo Referral System allows users to invite friends and trading partners to the platform. By referring new active users, referrers can unlock Gold status and enjoy 0% protocol fees on all P2P escrow operations.

---

## How It Works

### Option 1 (Link)
1. **Receive a referral link** from another user (e.g. `https://www.achylo.com/p2p?ref=0x...` or `achylo.com/#/p2p?ref=0x...`).
2. **Open the link in your browser:** The application automatically detects the referrer's wallet address from the URL parameter and saves it to your local session.
3. **Connect your wallet:** Log in with your preferred wallet or Coinbase Smart Account.
4. **Complete at least one transaction (buy or sell) to activate the referral:** To prevent spam and Sybil accounts, a referral only becomes eligible once the referred user completes a valid P2P transaction.
5. **Automatic registration:** Registration is executed automatically after your first completed escrow (`releaseFunds`). You do not need to sign a separate registration transaction.

---

### Option 2 (Manual)
1. Navigate to your **Profile** in the Achylo application.
2. Select the **Referrals** section from the user menu.
3. Locate the **"Who referred you?"** section.
4. If you have already completed at least one transaction (buy or sell), you will be eligible to register your referrer manually.
5. Enter your referrer's wallet address (`0x...`) in the input field.
6. Click **Register Referrer** to submit the on-chain registration.

---

## Earning Gold Status via Referrals

You can share your own referral link with friends and counterparties to earn Gold status:

1. Open your **Profile** and go to the **Referrals** tab.
2. In the **"Share your referral link"** card, copy your unique referral URL:
   ```text
   https://www.achylo.com/p2p?ref=0xYourWalletAddress
   ```
3. Share the link with potential users via social media, chat, or direct message.
4. When your invitees connect their wallet and complete their first escrow, they are credited to your monthly and total referral counters.
5. Monitor your progress toward Gold status directly in the **Referrals** dashboard (Monthly and Total counts).
6. Once the monthly threshold is reached, your wallet qualifies for **Gold Status**, granting you 0% protocol fees across all future P2P operations.

---

## Referral Rules and Protections

* **One referrer per user:** A user can only register a single referrer address. Once registered, it cannot be modified.
* **Transaction requirement:** Users must complete at least one escrow to prevent phantom accounts from counting toward Gold status.
* **Anti-loop protection:** Users cannot refer their own wallet address, nor can they create circular referral chains.
* **Monthly reset:** Monthly referral counts reset at the beginning of each billing cycle, encouraging continuous active participation.
