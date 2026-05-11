# Beta testing reference

A quick-reference page for beta testers: the test data the Marketplace will accept while we're on Stripe sandbox mode and the platform isn't yet processing real money.

::: warning Sandbox only
Everything on this page is **test data only**. The marketplace is currently wired to Stripe's sandbox — real card numbers will be rejected, and these test numbers won't work once we cut over to live mode. Don't enter your real payment details until we announce the cutover.
:::

## Stripe test cards

Use these in the **Hire** modal (buyer-side checkout) or when adding a card to your saved **Payment methods**. For every test card:

- **Expiry** — any future date (e.g. `12/34`)
- **CVC** — any 3 digits (`123` is fine)
- **ZIP / postal code** — any (e.g. `12345`)
- **Name on card** — any name

### Successful payments

| Number | What happens |
|---|---|
| `4242 4242 4242 4242` | ✓ Standard success — Visa |
| `4000 0566 5566 5556` | ✓ Standard success — Visa debit |
| `5555 5555 5555 4444` | ✓ Standard success — Mastercard |
| `3782 822463 10005` | ✓ Standard success — Amex (4-digit CVC) |

### 3D Secure authentication

These cards force the "verify with your bank" modal — useful for testing the SCA challenge flow.

| Number | What happens |
|---|---|
| `4000 0025 0000 3155` | ⚠ Requires 3DS authentication; click **Complete** in the test modal |
| `4000 0027 6000 3184` | ⚠ Requires 3DS authentication; fails if you click **Fail** |

### Declines

| Number | What happens |
|---|---|
| `4000 0000 0000 0002` | ✗ Generic decline (`card_declined`) |
| `4000 0000 0000 9995` | ✗ Insufficient funds (`insufficient_funds`) |
| `4000 0000 0000 9987` | ✗ Lost card (`lost_card`) |
| `4000 0000 0000 9979` | ✗ Stolen card (`stolen_card`) |
| `4000 0000 0000 0069` | ✗ Expired card (`expired_card`) |
| `4000 0000 0000 0127` | ✗ Incorrect CVC (`incorrect_cvc`) |
| `4000 0000 0000 0119` | ✗ Processing error (`processing_error`) |

### Disputes / chargebacks

These cards immediately raise a dispute after a successful charge — handy for testing the buyer-dispute and admin-chargeback flows.

| Number | What happens |
|---|---|
| `4000 0000 0000 0259` | ⚠ Charges succeed, then a chargeback arrives (`fraudulent`) |
| `4000 0000 0000 1976` | ⚠ Charges succeed, then a chargeback arrives (`product_not_received`) |

Stripe's full reference: <https://docs.stripe.com/testing>.

## Stripe Connect — test bank accounts for sellers

If you're testing the **seller onboarding** flow (Settings → Stripe → Set up payouts), Stripe Connect Express will ask for a bank account during the hosted onboarding. Use one of the test routing/account numbers below — Stripe accepts them in sandbox even though the underlying bank doesn't exist.

### US sellers (USD payouts)

| Routing number | Account number | What happens |
|---|---|---|
| `110000000` | `000123456789` | ✓ Standard success |
| `110000000` | `000111111116` | ✗ Account closed when first payout is attempted |
| `110000000` | `000111111113` | ✗ No bank account at this routing number |

### Other countries

| Country | Test value | Format |
|---|---|---|
| UK (GBP) | Sort code `10-88-00`, account `00012345` | ✓ Success |
| EU (EUR — IBAN) | `DE89370400440532013000` | ✓ Success (Germany) |
| Canada (CAD) | Transit `11000`, institution `000`, account `000123456789` | ✓ Success |
| Australia (AUD) | BSB `000-000`, account `000123456` | ✓ Success |
| Japan (JPY) | Bank `1100`, branch `000`, account `0001234` | ✓ Success |

### Test identity / KYC values

Stripe's hosted Express onboarding also asks for name, date of birth, address, and (in the US) the last 4 of your SSN. In sandbox, use:

| Field | Value |
|---|---|
| Date of birth | `01 / 01 / 1901` (any DOB in the past works, but this one is the canonical "approves cleanly" value) |
| US SSN last 4 | `0000` (auto-approves) or `1117` (forces "info pending" state) |
| Address | Any valid-looking US address, e.g. `address_full_match` line `address_full_match`, city `Seattle`, ZIP `99999` |
| Phone | `0000000000` |

Full Connect testing reference: <https://docs.stripe.com/connect/testing>.

## Dev personas

The deployed test environment ships a fixed cast of seed users. Sign in via the persona-picker (or, on local dev, the `X-Dev-User` header) and you'll inherit that persona's role + state.

| Persona | Role | What they're for |
|---|---|---|
| **Ben Carter** (`ben`) | Buyer, onboarded | The "default buyer" — has contract history with the seed sellers. Use for testing browse, hire, contracts, payments, alerts, public profile. |
| **Noah Bell** (`noah`) | Buyer, onboarded | A second clean buyer. Use when Ben's contract history would get in the way (e.g. testing first-time hire UX without his past hires showing up). |
| **Paul Lambert** (`paul`) | Buyer, **un-onboarded** | Fresh buyer with no checklist progress. Use for testing the `/me/buyer/start` onboarding wizard and the buyer-gate redirect. |
| **Aria Sato** (`aria`) | Seller, enabled | Voice actor + spokesperson. Has demos, packages, and is browse-discoverable. Use as the "hire someone" target. |
| **Kai Okafor** (`kai`) | Seller, enabled | Editor. Second enabled seller — gives the browse grid some variety. |
| **Lina Park** (`lina`) | Seller, enabled | Musician + animator. Third enabled seller — covers the remaining browse categories. |
| **Olivia Chen** (`olivia`) | Seller, **un-onboarded** | Fresh seller with no Stripe account, no demos, no packages, `is_enabled=false`. Use for testing the seller onboarding wizard at `/me/start`. |
| **Zoe Rivera** (`zoe`) | Buyer **and** seller | Multi-role user — exercises the `/me/choose` persona chooser and the persona-pinning flow. |
| **Mira Soto** (`mira`) | Admin | Admin console access. Use for testing brand-verification approvals, dispute/chargeback flows, the gig moderation queue, and the refund/webhook ops surfaces. |

### How to switch personas

- **Local dev** — set the `X-Dev-User` header (e.g. via a browser extension) or visit `/me/dev?as=<persona>` if the dev tooling is enabled.
- **Deployed beta** — sign in via the persona-picker on the login page; each persona has its own pre-provisioned identity.

## Brand verification — testing the TXT-record flow

The buyer brand-verification flow (Settings → Brand) asks you to publish a DNS TXT record at `_mossworks-verify.<your-domain>` matching a token we issue. To test the **happy path** in sandbox, you have three options:

### Option A — use a real domain you own (recommended)

If you control a domain (even a $1/year one), set the TXT record as instructed and click **Verify**. The check runs against real DNS — there's no test-mode shortcut on the deployed environment.

A common cheap-domain trick: register a `.xyz` or `.click` (≈$1/year on Namecheap or Cloudflare Registrar), point its DNS at Cloudflare, and use Cloudflare's DNS panel to add the TXT record. Propagation typically takes 1–5 minutes.

### Option B — ask an admin to manually approve

The admin queue at `/admin/brand-verifications` includes a **Mark verified** button as a manual override for cases where DNS isn't viable (small private brands, in-progress domain transfers, etc.). For beta-test approvals, ping Mira (the admin persona) in `#mossworks-beta` and she'll flip you through.

### Domains that won't work

The verifier rejects "private-looking" TLDs to prevent bogus brand claims:

- `.local`, `.localhost`, `.test`, `.example`, `.invalid`
- `.corp`, `.home`, `.lan`, `.internal`, `.private`

Use a real public TLD (`.com`, `.io`, `.xyz`, etc.) or Option B.

## Mock email / phone / OTP

Email verification is gated on the Keycloak realm — beta testers don't need to receive a real verification email; the seeded personas come pre-verified.

The Marketplace does **not** use SMS / phone OTP anywhere in the user flow today. If a screen asks for a phone number (Stripe Connect Express asks for one during seller KYC), any test number that matches the format works — `+1 555 555 5555` is the convention.

## Getting help

- **Beta channel:** `#mossworks-beta`
- **Bugs:** [github.com/Mossworks-Labs/marketplace/issues](https://github.com/Mossworks-Labs/marketplace/issues)
- **Stripe testing reference:** <https://docs.stripe.com/testing>
- **Stripe Connect testing reference:** <https://docs.stripe.com/connect/testing>
