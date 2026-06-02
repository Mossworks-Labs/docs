# Hiring a creator

A start-to-finish walkthrough of the **buyer** journey on the [Marketplace](/guide/marketplace): from finding a creator to accepting the finished work. If you're the one being hired, see [Selling your work](/guide/marketplace-seller) instead.

::: tip You don't need to be a seller to hire
Hiring only requires the lightweight **8-item buyer onboarding** (identity + compliance), reached from `/me/buyer/start` — no Stripe payout setup, no demos, no packages. You only need the full [seller onboarding](/guide/marketplace-onboarding) if you also want to list yourself for hire.
:::

<FlatImage name="marketplace-buyer-onboarding" alt="Buyer onboarding — 8-item identity + compliance checklist" />

## 1. Find the right creator

Two ways to find someone, depending on whether you'd rather search or be approached.

**Search — Browse**

<FlatImage name="marketplace-browse" alt="Marketplace browse — filter rail, spotlight rail, creator grid" />

Open **[Browse](/guide/marketplace-browse)** (`/sellers`) and narrow with the filter rail — category, style/vibe, language, turnaround, price. The **Spotlight rail** surfaces creators at ≥ 4.8★ with ≥ 25 completed jobs. Ranking is merit-only; there are no paid placements.

**Get applicants — post a gig**

Prefer to describe the job and let creators come to you? Skip ahead to step 3 and post a gig first; creators apply, and you pick from the applicants.

## 2. Vet them on their profile

<FlatImage name="marketplace-artist-profile" alt="Artist public profile — bio, languages, packages, ratings, hire sidebar" />

Click a creator to open their **[Artist profile](/guide/marketplace-artist-profile)** (`/sellers/<slug>`). Listen to the demo reel, read reviews, and check the package tiers in the sticky hire sidebar (e.g. *"Script under 500w · 24h · $60"*).

Not sure of the scope yet? Use **Send a message first** to open real messaging (`/messages`) and talk it through before committing — nothing is charged for a conversation.

<FlatImage name="marketplace-messages" alt="Messages — inbox grouped by who owes a reply" />

## 3. Start the engagement

When you're ready, you have two equivalent paths — **both create the engagement through a [gig](/guide/marketplace-gigs)**:

- **Request this creator** from their profile. This walks a short **Brief → Schedule → Pay** preview, then routes you to post a gig with that creator invited.

  ::: info Heads-up: the stepper is a preview
  That Brief → Schedule → Pay stepper is currently a **non-functional preview** of the upcoming one-click direct-hire flow. It doesn't create a contract by itself — the live path is posting a gig (below). See [Hire & contract](/guide/marketplace-hire).
  :::

- **Post a gig** directly at `/gigs/new`.

<FlatImage name="marketplace-post-gig" alt="Post a gig form with live preview" />

Fill in the title, role, description/brief, deliverables, budget range, deadline, and tags. A live preview shows the card exactly as applicants will see it. **Nothing is charged when you post** — money only moves once you accept someone.

## 4. Accept an applicant → contract

Creators apply with a pitch and a quote; their applications appear under your gig. Accepting one creates a **CRAFT-standard contract** against that quote, with the payment summary broken out:

- `{words} × {rate}` → creator receives
- **Marketplace fee (15%)** — your only added cost
- **You pay** — the total

See [Hire & contract](/guide/marketplace-hire) for the full field list.

## 5. Fund escrow

When you confirm, your payment is held in **escrow** — not paid out yet.

- **Single-payment** contracts hold one charge for the whole price.
- **Milestone** contracts hold each milestone independently, so you release them one at a time as work lands.

::: tip Beta testing
On Stripe sandbox, use the test cards from the [Beta testing reference](/guide/beta-testing) (e.g. `4242 4242 4242 4242`). Real cards are rejected until the live-mode cutover.
:::

## 6. Review the work and release payment

When the creator delivers, open the contract from **Contracts** (`/contracts`) and choose:

- **Accept the deliverable** → releases the escrowed funds (or that milestone) to the creator.
- **Request revisions** within the agreed revision count.
- **Refund / cancel** if the work falls through.
- **Open a dispute** (`/me/disputes`) if you can't agree — disputes go to platform mediation.

## 7. Leave a review

After acceptance, rate the creator. Reviews are public on their [Artist profile](/guide/marketplace-artist-profile) and feed the merit-only [tier and badge system](/guide/marketplace-gamification) — so your honest rating directly affects how creators rank.
