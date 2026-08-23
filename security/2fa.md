# Wallet Protection (MFA)

> **Warning — irreversible once enabled**  
> After you enable Wallet Protection, **it cannot be turned off or removed**. For security, Achylo has no admin reset and no “disable MFA” path. Before you click Enable, make sure you can keep access to your Authenticator app and, ideally, enroll **SMS recovery** right away. Losing every enrolled factor permanently blocks export, withdrawals, and other protected actions.

Achylo uses **Wallet Protection** as the multi-factor authentication (MFA) for your embedded wallet.

It replaces the old Achylo-only 2FA / backup-codes system. Protection applies to sensitive wallet and on-chain actions.

---

## What it protects

Once Wallet Protection is enabled, Achylo may ask you to verify before actions such as:

- Exporting your private key
- Withdrawals / sending funds
- Other MFA-protected operations (for example merchant registration, creating or accepting orders that deposit from your wallet), when your MFA session has expired

You verify with:

1. **Authenticator app (TOTP)** — primary factor (Google Authenticator, Authy, 1Password, etc.)
2. **SMS recovery** — optional but strongly recommended second factor for recovery

> **Important:** Login to Achylo is done with Google, Apple, or Email. SMS is **not** used for login. SMS is reserved as an MFA recovery method so it stays independent from your login channel.

### What you can change later

| Action | Available today? | How |
|--------|------------------|-----|
| Enable Wallet Protection (Authenticator) | Yes | Security Settings → Enable |
| Add SMS recovery | Yes | **Add SMS** |
| Change SMS number | Yes | **Update SMS** (confirm with Authenticator first) |
| Change / re-enroll Authenticator (TOTP) | **Not yet** | Planned: confirm with SMS, then scan a new QR |
| Disable Wallet Protection entirely | **No** | Irreversible by design |

Until Authenticator rotation ships, protect your TOTP device carefully and always keep SMS recovery enrolled so you can still verify if the app is lost.

---

## Step by step: enable Wallet Protection (first time)

### Requirements

- You are signed in to Achylo with your embedded wallet
- An authenticator app installed on your phone

### Steps

1. Open your **profile / account** (user menu).
2. Open **Security Settings**.
3. Find the **Wallet Protection** card.
4. Click **Enable**.
5. A **QR code** and a **manual secret key** appear.
6. In your authenticator app, add a new account:
   - Scan the QR code, **or**
   - Enter the secret key manually.
7. Enter the **6-digit code** from the app into Achylo.
8. Confirm enrollment.

After TOTP succeeds, Achylo offers **SMS recovery**:

9. Choose **Add SMS** (recommended) or skip for now.
10. If you add SMS:
    - Enter your phone number with **country code** (E.164), for example `+53 5XXX XXXX` or `+1 415 555 2671`.
    - Tap send / continue so Achylo sends an SMS code.
    - Enter the **6-digit SMS code**.
11. When finished, Wallet Protection shows status **Enabled**, with methods:
    - **Authenticator**
    - **SMS recovery** (if you completed that step)

---

## Add SMS as a recovery second factor (later)

Use this if Wallet Protection is already on with Authenticator only.

1. Profile → **Security Settings** → **Wallet Protection**.
2. Confirm status shows **Authenticator** enabled and **SMS recovery** missing (warning may appear).
3. Click **Add SMS**.
4. Enter your phone number with country code (example: `+1 415 555 2671`).
5. Request the SMS code.
6. Enter the **6-digit code** from the text message.
7. SMS recovery appears as enabled.

You can then verify protected actions with either:

- Authenticator code, or
- SMS code (when that method is offered)

---

## Update / change your SMS recovery number

Use this when you already have SMS enrolled and need a new number.

1. Profile → **Security Settings** → **Wallet Protection**.
2. Click **Update SMS**.
3. Confirm with your **Authenticator** 6-digit code first (required for security).
4. Enter the **new phone number** with country code.
5. Request and enter the new **SMS code**.
6. The previous recovery number is replaced by the new one.

> You cannot change SMS without confirming Authenticator first. That prevents someone who only has your phone from swapping your recovery number.

---

## How verification works day to day

1. You start a protected action (export, withdraw, deposit escrow, etc.).
2. If your MFA session is still valid, the action continues.
3. If the session expired, Achylo shows the **Wallet Protection** verify modal.
4. Enter your Authenticator code (or use SMS if offered).
5. After success, the original action continues.

Tips:

- Completing MFA once keeps a short **session window**; you may not be asked again immediately.
- If you cancel the modal, the transaction fails with a cancellation message — open the action again and complete verification.

---

## Recommended setup

| Factor | Role | Required? |
|--------|------|-----------|
| Authenticator (TOTP) | Primary MFA | Yes — required to enable Wallet Protection |
| SMS | Recovery / alternate verify | Strongly recommended |

Best practice:

1. Enable Authenticator first.
2. Add SMS recovery immediately after.
3. Keep Authenticator on a device you control.
4. Use a phone number you can always access for recovery SMS.

---

## Lost authenticator app

If you still have **SMS recovery** enrolled:

1. Start the protected action again.
2. In the verify modal, switch to **SMS** if available.
3. Enter the SMS code.
4. After you regain access, keep SMS up to date. Use **Update SMS** if your number changed, and set up Authenticator again if your app or device was replaced (when the UI allows re-enrollment after a successful verify).

If you lose **both** Authenticator and SMS access:

- **Achylo cannot reset or bypass Wallet Protection for you.** MFA is bound to your wallet account; support cannot unlock export, withdrawals, or other protected actions without a valid factor.
- You will not be able to complete those protected operations until you can verify with an enrolled method again.
- This is why adding **SMS recovery** as soon as you enable Authenticator is critical — treat both factors as irreplaceable credentials.

---

## What changed vs the old 2FA

The previous Achylo-native 2FA (QR + Achylo backup codes + `/api/v1/security/2fa/...`) is **retired**.

| Old system | New system |
|------------|------------|
| Achylo TOTP + backup codes | **Wallet Protection** |
| Backup codes `XXXX-XXXX` | **SMS recovery** as second factor |
| Achylo API 2FA endpoints | Wallet Protection enrollment / verify in Security Settings |
| Only some Achylo endpoints | Wallet signing and protected operations gated by MFA |

Do **not** look for “Enable 2FA”, “backup codes”, or “Regenerate backup codes” in Security Settings. Use **Wallet Protection**, **Enable**, **Add SMS**, and **Update SMS** instead.

---

## FAQ

### Do I need Wallet Protection to use Achylo?
You can browse and use many features without it, but **export private key** and **withdrawals** require Wallet Protection. Enabling it is strongly recommended before moving significant funds.

### Can I use SMS for login?
No. Login is Google / Apple / Email only. SMS is only for MFA recovery so a SIM swap alone does not compromise both login and MFA.

### What phone format does SMS need?
International format with `+` and country code, digits only after the plus (E.164), e.g. `+14155552671`.

### Why wasn’t I asked for MFA this time?
Your MFA session is still valid. When it expires, the verify modal appears again before the next protected action.

### Can I disable Wallet Protection or reset MFA if I lose access?
No. Once enabled, Wallet Protection **cannot be reverted**. Achylo does **not** offer a support reset to remove or bypass it. You can only manage factors you still control from Security Settings (**Add SMS** / **Update SMS**). Changing the Authenticator secret is not available yet. If you lose every enrolled factor, protected actions stay blocked — there is no admin override. Keep Authenticator and SMS recovery current before you lose access to either.

---

## Related

- Profile → **Security Settings** → **Wallet Protection**
