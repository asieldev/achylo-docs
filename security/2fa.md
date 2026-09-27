# Wallet Protection (MFA)

> **Warning — irreversible once enabled**  
> After you enable Wallet Protection, **it cannot be turned off or removed**. For security, Achylo has no admin reset and no “disable MFA” path. Before you click Enable, make sure you can keep access to your Authenticator app and, ideally, enroll **SMS recovery** and/or a **Passkey** right away. Losing every enrolled factor permanently blocks export, withdrawals, and other protected actions.

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
3. **Passkey** — optional WebAuthn factor (Face ID, Touch ID, Windows Hello, or device lock) for faster verification

> **Important:** Login to Achylo is done with Google, Apple, or Email. SMS is **not** used for login. SMS is reserved as an MFA recovery method so it stays independent from your login channel.

### What you can change later

| Action | Available? | How |
|--------|------------|-----|
| Enable Wallet Protection (Authenticator) | Yes | Security Settings → Enable |
| Add SMS recovery | Yes | **Add SMS** (only if SMS is not enrolled yet) |
| Change SMS number | Yes* | **Update SMS** (confirm with Authenticator first) |
| Add Passkey | Yes | **Add Passkey** (device/browser must support WebAuthn) |
| Change / re-enroll Authenticator (TOTP) | **No** | Not supported by the wallet MFA provider once enrolled |
| Disable Wallet Protection entirely | **No** | Irreversible by design |

\* If Update SMS fails because the method is already locked, keep using your enrolled recovery number for verification.

**Important:** Authenticator can only be enrolled once. Keep the app and device safe. With SMS recovery or a Passkey enrolled, you can still verify protected actions if you lose the authenticator app — but you cannot install a replacement Authenticator secret.

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

After TOTP succeeds, Achylo offers **SMS recovery** and **Passkey**:

9. Choose **Add SMS recovery**, **Add Passkey**, or skip for now.
10. If you add SMS:
    - Enter your phone number with **country code** (E.164), for example `+53 5XXX XXXX` or `+1 415 555 2671`.
    - Tap send / continue so Achylo sends an SMS code.
    - Enter the **6-digit SMS code**.
11. If you add a Passkey:
    - Tap **Create passkey**.
    - Confirm with Face ID, Touch ID, Windows Hello, or your device lock when the browser prompts you.
12. When finished, Wallet Protection shows status **Enabled**, with methods:
    - **Authenticator**
    - **SMS recovery** (if you completed that step)
    - **Passkey** (if you completed that step)

---

## Add a Passkey (later)

Use this if Wallet Protection is already on and Passkey is not enrolled yet.

1. Profile → **Security Settings** → **Wallet Protection**.
2. Click **Add Passkey**.
3. Tap **Create passkey** and complete the browser / OS prompt.
4. Passkey appears as enabled under **Methods**.

You can then verify protected actions with Passkey, Authenticator, or SMS (whichever is enrolled).

> Passkeys are scoped to the site hostname (RP ID). Enroll and verify on the same Achylo domain you normally use (for example production vs staging).

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

## Authenticator cannot be replaced

Once Authenticator is enrolled, Achylo **cannot** issue a new QR / secret for the same wallet. The MFA provider rejects re-enrollment (`already enrolled`).

If you lose the authenticator app but still have **SMS recovery**:

1. Start the protected action again.
2. In the verify modal, choose **SMS** if offered.
3. Enter the SMS code to complete the action.

You will keep verifying with SMS (and any remaining Authenticator entry) — there is no path to install a brand-new Authenticator for that wallet.

---

## How verification works day to day

1. You start a protected action (export, withdraw, deposit escrow, etc.).
2. If your MFA session is still valid, the action continues.
3. If the session expired, Achylo shows the **Wallet Protection** verify modal.
4. Choose **Passkey**, **Authenticator**, or **SMS** (whichever you enrolled).
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
| Passkey | Fast alternate verify (WebAuthn) | Recommended when your device supports it |

Best practice:

1. Enable Authenticator first.
2. Add SMS recovery immediately after.
3. Add a Passkey on a trusted device for faster day-to-day verification.
4. Keep Authenticator on a device you control.
5. Use a phone number you can always access for recovery SMS.

---

## Lost authenticator app

If you still have **SMS recovery** enrolled:

1. Start the protected action again.
2. In the verify modal, switch to **SMS** if available.
3. Enter the SMS code to complete the action.

You cannot enroll a replacement Authenticator after the first one. Keep SMS recovery current.

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

Do **not** look for “Enable 2FA”, “backup codes”, or “Regenerate backup codes” in Security Settings. Use **Wallet Protection**, **Enable**, **Add SMS**, **Update SMS**, and **Add Passkey** instead.

---

## Operator checklist: CDP Portal (Passkey)

Before Passkey works in Achylo, the Coinbase Developer Platform project must allow it:

1. Open [CDP Portal](https://portal.cdp.coinbase.com/) → your Achylo Embedded Wallet project.
2. Enable **MFA → Passkey** (in addition to TOTP / SMS as needed).
3. Under **CORS / allowed origins**, add every Achylo web origin that will enroll or verify passkeys (exact scheme + host + port), for example:
   - `https://app.achylo.com`
   - `https://staging.…`
   - `http://localhost:5173` (local only)
4. Confirm the live site hostname matches the origin users enroll on — WebAuthn **RP ID** is derived from the request origin host.
5. Ship Achylo frontend with CDP SDK **≥ 0.0.126** (`@coinbase/cdp-core` / `cdp-hooks` / `cdp-react`) so `enrollPasskey` / `verifyPasskey` are available.

If Passkey is disabled in Portal, Achylo hides **Add Passkey** and never offers it in the verify modal.

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
No. Once enabled, Wallet Protection **cannot be reverted**. Achylo does **not** offer a support reset to remove or bypass it. Authenticator cannot be re-enrolled once set. You may update SMS recovery while you still control Authenticator. If you lose every enrolled factor, protected actions stay blocked — there is no admin override.

---

## Related

- Profile → **Security Settings** → **Wallet Protection**
