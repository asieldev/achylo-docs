

#  Transaction Limits

Each user level has specific hourly and daily limits to ensure fair use of the protocol and protect the system against abuse or malicious automation.

---

##  Active Protection Layers
- **Anti-burst:** more than **3 transactions in 10 seconds** triggers an automatic cooldown of **30 seconds**.
- **Duplicate detection:** identical actions repeated within **5 seconds** are blocked immediately.
- **Progressive backoff:** after **3 consecutive failures**, the wait time increases exponentially up to a maximum of **2 minutes**.
- **Hourly and daily limits:** depend on the user level and are described in the following table.

---

##  Limits by Level
| User Level | Requirements | Hourly Limit | Daily Limit |
| :--- | :--- | :--- | :--- |
| **New** | 0 completed escrows | 10 transactions | 24 transactions |
| **Active** | 1+ completed escrows | 20 transactions | 48 transactions |
| **Merchant** | Registration and active collateral | 30 transactions | 300 transactions |
| **Gold** | Verified account + Gold benefits | Unlimited | Unlimited |

> **Note:** Gold users have no limits, but they are still subject to instant anti-abuse protections (anti-burst, duplicates, and backoff).

---

##  Always Allowed Actions
The following functions **do not consume** limiter quota and are available without restrictions for all levels:

- Create private escrow.
- Accept public order.
- Release funds.
- Confirm payment.
- Reclaim funds.
- Start dispute.
- Vote in dispute.

---

##  Recommendations
1. **Plan your operations:** group similar actions to avoid triggering anti-burst.
2. **Avoid aggressive automation:** scripts that send multiple identical transactions within seconds will be blocked.
3. **Monitor your limits:** if you reach the hourly limit, wait for the next interval or adjust your level (for example, by completing escrows to upgrade to Active User).

With these limits, the protocol maintains sponsored gas stability and protects both users and merchants.