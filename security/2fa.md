# Wallet Protection (MFA)

> **Warning — irreversible once enabled**  
> After you enable Wallet Protection, **it cannot be turned off or removed**. For security, Achylo has no admin reset and no “disable” path. Before you click Enable, make sure you can keep access to your Authenticator app and, ideally, enroll **SMS recovery** and/or a **Passkey** right away. Losing every enrolled factor permanently blocks export, withdrawals, and other protected actions.

**Wallet Protection** is the extra security layer for your Achylo wallet. Once enabled, Achylo may ask you to verify before sensitive actions.

---

## What it protects

- Exporting your private key
- Withdrawals / sending funds
- Other sensitive actions (for example merchant registration, or creating/accepting orders that use funds from your wallet), when your verification session has expired

You can verify with:

1. **Authenticator app** — primary method (Google Authenticator, Authy, 1Password, etc.)
2. **SMS recovery** — optional but strongly recommended backup
3. **Passkey** — optional faster method (Face ID, Touch ID, Windows Hello, or device lock)

> **Important:** Login to Achylo is done with Google, Apple, or Email. SMS is **not** used for login — only as a recovery method for Wallet Protection.

### What you can change later

| Action | Available? | How |
|--------|------------|-----|
| Enable Wallet Protection (Authenticator) | Yes | Security Settings → Enable |
| Add SMS recovery | Yes | **Add SMS** (only if SMS is not set up yet) |
| Change SMS number | Yes* | **Update SMS** (confirm with Authenticator first) |
| Add Passkey | Yes | **Add Passkey** |
| Change / replace Authenticator | **No** | Not supported once enrolled |
| Disable Wallet Protection entirely | **No** | Irreversible by design |

\* If Update SMS is not available, keep using your current recovery number for verification.

**Important:** Authenticator can only be set up once. Keep the app and device safe. With SMS recovery or a Passkey enrolled, you can still verify protected actions if you lose the authenticator app — but you cannot install a replacement Authenticator.

---

## Step by step: enable Wallet Protection (first time)

### Requirements

- You are signed in to Achylo
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
8. Confirm.

After Authenticator is set up, Achylo offers **SMS recovery** and **Passkey**:

9. Choose **Add SMS recovery**, **Add Passkey**, or skip for now.
10. If you add SMS:
    - Enter your phone number with **country code**, for example `+53 5XXX XXXX` or `+1 415 555 2671`.
    - Continue so Achylo sends an SMS code.
    - Enter the **6-digit SMS code**.
11. If you add a Passkey:
    - Tap **Create passkey**.
    - Confirm with Face ID, Touch ID, Windows Hello, or your device lock when prompted.
12. When finished, Wallet Protection shows status **Enabled**, with methods:
    - **Authenticator**
    - **SMS recovery** (if you completed that step)
    - **Passkey** (if you completed that step)

---

## Add a Passkey (later)

Use this if Wallet Protection is already on and Passkey is not set up yet.

1. Profile → **Security Settings** → **Wallet Protection**.
2. Click **Add Passkey**.
3. Tap **Create passkey** and complete the device prompt.
4. Passkey appears as enabled under **Methods**.

You can then verify with Passkey, Authenticator, or SMS (whichever you enrolled).

> Enroll and verify Passkeys on the same Achylo site you normally use.

---

## Add SMS as a recovery method (later)

Use this if Wallet Protection is already on with Authenticator only.

1. Profile → **Security Settings** → **Wallet Protection**.
2. Confirm status shows **Authenticator** enabled and **SMS recovery** missing (a warning may appear).
3. Click **Add SMS**.
4. Enter your phone number with country code (example: `+1 415 555 2671`).
5. Request the SMS code.
6. Enter the **6-digit code** from the text message.
7. SMS recovery appears as enabled.

You can then verify with either Authenticator or SMS (when offered).

---

## Update / change your SMS recovery number

1. Profile → **Security Settings** → **Wallet Protection**.
2. Click **Update SMS**.
3. Confirm with your **Authenticator** 6-digit code first.
4. Enter the **new phone number** with country code.
5. Request and enter the new **SMS code**.
6. The previous recovery number is replaced by the new one.

> You cannot change SMS without confirming Authenticator first. That prevents someone who only has your phone from swapping your recovery number.

---

## Authenticator cannot be replaced

Once Authenticator is enrolled, Achylo cannot issue a new QR or secret for the same wallet.

If you lose the authenticator app but still have **SMS recovery**:

1. Start the protected action again.
2. In the verify screen, choose **SMS** if offered.
3. Enter the SMS code to complete the action.

There is no path to install a brand-new Authenticator for that wallet.

---

## How verification works day to day

1. You start a protected action (export, withdraw, etc.).
2. If you verified recently, the action may continue without asking again.
3. If not, Achylo shows the **Wallet Protection** verify screen.
4. Choose **Passkey**, **Authenticator**, or **SMS** (whichever you enrolled).
5. After success, the original action continues.

Tips:

- After a successful verification, you may not be asked again for a short time.
- If you cancel the screen, open the action again and complete verification.

---

## Recommended setup

| Method | Role | Required? |
|--------|------|-----------|
| Authenticator | Primary | Yes — required to enable Wallet Protection |
| SMS | Recovery / alternate verify | Strongly recommended |
| Passkey | Fast alternate verify | Recommended when your device supports it |

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
2. In the verify screen, switch to **SMS** if available.
3. Enter the SMS code to complete the action.

You cannot enroll a replacement Authenticator after the first one. Keep SMS recovery current.

If you lose **both** Authenticator and SMS access:

- **Achylo cannot reset or bypass Wallet Protection for you.** Support cannot unlock export, withdrawals, or other protected actions without a valid method.
- You will not be able to complete those protected operations until you can verify again.
- This is why adding **SMS recovery** as soon as you enable Authenticator is critical.

---

## FAQ

### Do I need Wallet Protection to use Achylo?
You can browse and use many features without it, but **export private key** and **withdrawals** require Wallet Protection. Enabling it is strongly recommended before moving significant funds.

### Can I use SMS for login?
No. Login is Google / Apple / Email only. SMS is only for Wallet Protection recovery.

### What phone format does SMS need?
International format with `+` and country code, for example `+14155552671`.

### Why wasn’t I asked to verify this time?
You verified recently. When that window expires, the verify screen appears again before the next protected action.

### Can I disable Wallet Protection or reset it if I lose access?
No. Once enabled, Wallet Protection **cannot be turned off**. Achylo does **not** offer a support reset. Authenticator cannot be re-enrolled once set. You may update SMS recovery while you still control Authenticator. If you lose every enrolled method, protected actions stay blocked.

---

## Related

- Profile → **Security Settings** → **Wallet Protection**
