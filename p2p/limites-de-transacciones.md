# Transaction Limits

Achylo uses a two-layer transaction guard to ensure fair access to gas-sponsored transactions and protect the protocol against abuse.

---

## How It Works

Every gas-sponsored transaction passes through two protection layers:

- **Client-side (instant):** rapid-fire detection, duplicate blocking, and progressive backoff — evaluated locally in the browser with no network round-trip.
- **Server-side (source of truth):** daily and monthly counters stored in the database, applied per user address and multiplied by the user's tier.

---

## Active Protection Layers

| Layer | Trigger | Response |
| :--- | :--- | :--- |
| **Anti-burst** | > 3 transactions in 10 seconds | 30-second automatic cooldown |
| **Duplicate detection** | Same action repeated within 5 seconds | Immediate block |
| **Progressive backoff** | 3+ consecutive failures | Exponential wait (up to 2 minutes max) |
| **Daily limit** | Configurable base × tier multiplier | Block until UTC midnight reset or escrow completion |
| **Monthly limit** | Configurable base × tier multiplier | Block until UTC month reset or escrow completion |

> Completing an escrow resets both the daily and monthly counters for both parties.

---

## Limits by Tier

Base limits are configured server-side via environment variables (`TX_GUARD_BASE_DAILY` / `TX_GUARD_BASE_MONTHLY`). Tier multipliers are applied on top of the base.

| Tier | Multiplier | Daily Limit | Monthly Limit | Requirements |
| :--- | :---: | :--- | :--- | :--- |
| **New User** | 1× | 10 transactions | 20 transactions | New account |
| **Active User** | 1× | 10 transactions | 20 transactions | 1+ completed escrows |
| **Merchant** | **2×** | 20 transactions | 40 transactions | Registered merchant with active collateral |
| **Gold** | **5×** | 50 transactions | 100 transactions | Active Gold membership |

> **Example:** if the base daily limit is 10, a Gold user can send up to 50 gas-sponsored transactions per day.

---

## Always Allowed Actions

The following critical escrow operations are **exempt from all limits** and are never blocked by the guard, regardless of tier:

- Create private escrow
- Accept public order
- Release funds
- Confirm payment
- Reclaim funds
- Start dispute
- Vote in dispute
- Purchase Gold membership
- Register referral
- Mint / Redeem CUB tokens

---

## Limit Reset

Limits reset automatically under two conditions:

1. **UTC midnight** — daily counter resets at 00:00 UTC every day.
2. **UTC month start** — monthly counter resets on the 1st of each month at 00:00 UTC.
3. **Escrow completion** — both daily and monthly counters reset immediately for both parties when an escrow is successfully completed.

---

## Recommendations

1. **Upgrade your tier** — register as a Merchant (2× limits) or purchase a Gold membership (5× limits) for higher quotas.
2. **Avoid rapid automation** — sending more than 3 transactions in 10 seconds triggers a 30-second cooldown.
3. **Complete escrows** — every completed escrow resets your counter, effectively giving you a fresh quota.
4. **Monitor your usage** — visit the **Stats** page inside the app to see your current daily/monthly usage and the time until the next reset.

---

With these limits, Achylo maintains gas sponsorship stability while ensuring all users have fair, predictable access to the protocol.