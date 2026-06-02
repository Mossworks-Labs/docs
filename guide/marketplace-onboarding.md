# Seller onboarding

Becoming a seller is a **21-item checklist** split across four sections — **Identity** (8), **Profile** (6), **Stripe** (4), and **Compliance** (3). It lives at `/me/start`. The wizard tracks every item; your seller listing turns on automatically when the full checklist passes, and the Stripe-side items resolve themselves once Stripe completes verification.

<FlatImage name="marketplace-onboarding-start" alt="Onboarding checklist — identity / profile / stripe / compliance sections" />

The left rail shows progress and lets you jump to any item; the main pane walks one step at a time with a single "Open …" CTA, so there's never ambiguity about what's next. Strikethrough indicates completed items.

::: info Buyers have a shorter path
You don't need any of this to *hire* someone. Buyer onboarding is a separate, lighter **8-item** checklist (identity + compliance only — no Stripe, demos, or packages), reached from `/me/buyer/start`. Seller onboarding is only for listing yourself for hire.
:::

## The four sections

- **Identity** (8) — verify email, confirm you're 18+, set country, provide legal name, choose a display name, and accept the Terms of Service, Privacy Policy, and Seller Agreement.
- **Profile** (6) — avatar, a bio (≥ 200 chars), at least one role, a demo per role (with rights attestation), at least one priced package, and at least one declared language. These fill out your public [Artist profile](/guide/marketplace-artist-profile); the individual editors live at `/me/demos`, `/me/packages`, and `/me/availability`.
- **Stripe** (4) — the payout and verification handoff (below).
- **Compliance** (3) — sanctions/verification screening that runs in the background.

## Stripe handoff

Government-ID verification, tax forms (W-8BEN / W-9), bank-account verification, and 1099 issuance all live in **Stripe** — we never see any of it, only the verification status. The Stripe surface is at `/me/stripe`.

<FlatImage name="marketplace-stripe-handoff" alt="Stripe handoff — four checks waiting on Stripe" />

The four checks flip green as Stripe completes each step:

1. Stripe account created
2. Details submitted
3. Charges enabled
4. Payouts enabled

The **Resolve in Stripe** button opens Stripe's hosted onboarding flow in a new tab; typical completion time is around **8 minutes** for a first-time seller.

::: tip Testing in beta
On Stripe sandbox, use the test bank accounts and test KYC values from the [Beta testing reference](/guide/beta-testing) — real bank details are rejected until the live-mode cutover.
:::

## Next steps

Once the checklist passes, your listing goes live. Continue with **[Selling your work](/guide/marketplace-seller)** to win and deliver your first gig.
