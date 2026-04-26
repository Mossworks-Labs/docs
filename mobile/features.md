# Mobile Features

A walkthrough of every screen in the Craft mobile app, in roughly the order you'll use them.

## Sign in

<div class="mobile-screen">
  <img src="/screenshots/mobile/login.png" alt="Login screen" />
</div>

The first time you launch Craft you'll land on the sign-in screen. Set the **Server URL** to your CRAFT deployment, tap **Test connection** to verify, then **Login** — Keycloak handles the auth flow in a system browser tab and you're sent back into the app.

The redirect URI shown on the login screen needs to be allowed in your Keycloak `mobile` client; ask your administrator if you hit "Invalid parameter: redirect_uri."

## Home

<div class="mobile-screen">
  <img src="/screenshots/mobile/home.png" alt="Home" />
</div>

Home is the daily landing surface. The greeting summarizes what's waiting for you — scripts in review, episodes mid-pipeline. The four **stage tiles** (Discover, Ideas, Scripts, Episodes) jump you to each phase of the production lifecycle, and the **Live now** rail surfaces any episodes the AI agents are actively working on with their pipeline progress strip.

## Discover

<div class="mobile-screen-row">
  <img src="/screenshots/mobile/discover.png" alt="Discover" />
  <img src="/screenshots/mobile/channel-deep.png" alt="Channel deep dive" />
  <img src="/screenshots/mobile/video-deep.png" alt="Video deep dive" />
</div>

Search YouTube without burning API quota — yt-dlp drives the search. The **outlier slider** boosts videos performing above their channel's baseline, and the **channel chips** group results so you can do a competitive read at a glance.

Tapping a channel opens a **deep dive** with subscriber count, growth rate, engagement, content mix, and estimated monthly earnings (uses your channel's RPM preset). Tapping a video shows the full transcript and lets you **Inspire idea** — pipes the metadata straight into the AI ideas generator with the source video as context.

## Ideas

<div class="mobile-screen-row">
  <img src="/screenshots/mobile/ideas.png" alt="Ideas list" />
  <img src="/screenshots/mobile/idea-detail.png" alt="Idea detail" />
</div>

Three sources of ideas merge into one feed — AI-generated, Discover-imported, and manually written — each with a marker showing where it came from. The dashed-border **Generate** strip lets you drop in optional context and produce 5 ideas with the model of your choice. The Long/Shorts pill is a hard filter on what gets generated.

Idea detail shows the angle, source metrics, and tags. **Convert to script** kicks off the full production flow: creates the episode shell, spawns the script-generate worker, marks research as approved. **YOLO** runs the entire pipeline end-to-end without manual review.

## Scripts

<div class="mobile-screen-row">
  <img src="/screenshots/mobile/scripts.png" alt="Scripts list" />
  <img src="/screenshots/mobile/script-edit.png" alt="Script editor" />
</div>

The list shows each script with its **type pill** (long/short), **status pill** (draft / review / final), and **word-count progress** against the target (1500 for long, 150 for shorts).

The editor surfaces the four AI tools — **Revise**, **Polish**, **Fact-check**, **Humanize** — across the top. Fact-check opens a bottom sheet with verified / unverified / disputed claims, and Humanize shows the rewritten passages with a one-tap accept. Auto-save fires every 12 seconds. **Send to audio** is gated behind `review` or `final` status — drafts can't be sent.

## Episodes (Board)

<div class="mobile-screen-row">
  <img src="/screenshots/mobile/episodes.png" alt="Episodes" />
  <img src="/screenshots/mobile/episode-detail.png" alt="Episode detail" />
</div>

Episodes is the production board. Each card shows the **7-stage pipeline strip** (research → script → storyboard → assets → export → review → publish) so you can see exactly where every episode is at a glance. Amber stages mean the producer agent flagged something for review.

Tap an episode for the per-stage detail view — each row shows status (running / queued / done / changes-requested) and the producer agent's feedback when a stage scored under 7/10.

## Audio

<div class="mobile-screen">
  <img src="/screenshots/mobile/audio-create.png" alt="Audio production" />
</div>

The four TTS providers (Edge free, ElevenLabs, OpenAI, OpenedAI Speech) live across the top. Voice tuning sliders adjust stability, similarity, and inter-section pause. Each section has its own **render**, **play**, and **mic** controls — tap the mic to record a take from your phone, which uploads as the section's voice (replacing the TTS output). The MusicGen background track is generated from a text prompt and mixed under the voice during the merge.

## Resources

<div class="mobile-screen">
  <img src="/screenshots/mobile/resources.png" alt="Resources" />
</div>

Search across 14 royalty-free media sources — Pexels, Unsplash, Wikimedia Commons, NASA, Met Museum, and more. The **type tabs** (video / image / audio / reference) scope the search; the **source toggles** let you opt out of providers you don't want. CC0 / PD badges surface license info inline. Tap **Upload** in the top bar to add your own media via the system file picker.

## Proposals & Jobs (Premium)

<div class="mobile-screen-row">
  <img src="/screenshots/mobile/proposals.png" alt="Proposals" />
  <img src="/screenshots/mobile/jobs.png" alt="Jobs" />
</div>

Proposals are AI-scored content suggestions — relevance to your existing catalog, uniqueness in your niche, and character fit (averaged into the lead score). **Accept** spawns an idea + script + queues research; **YOLO** one-shots the entire pipeline.

Jobs shows every async worker invocation with live status — running, queued, completed, failed. The mobile app polls every 3 seconds (the web frontend uses SSE; React Native's fetch lacks ReadableStream, so polling is the workaround).

## More

<div class="mobile-screen-row">
  <img src="/screenshots/mobile/more.png" alt="More menu" />
  <img src="/screenshots/mobile/settings.png" alt="Settings" />
  <img src="/screenshots/mobile/endpoints.png" alt="Endpoint health" />
</div>

The More menu is a flat tray for everything that didn't earn a permanent bottom-nav slot — Scripts, Episodes, Resources, Proposals, Jobs, Channel settings, Endpoint health, Sign out. Premium-only items are visually marked but never gated until tapped (discoverability over conversion friction).

**Settings** is the channel control panel: character description, default voice, RPM for earnings estimates, topic tags, API keys, billing chip, publishing connections, brand templates, and the AI channel wizard.

**Endpoint health** is a refactor appendix — diff of `mobile/src/lib/api.ts` against the live backend, grouped by section, with status pills for `ok` / `mismatch` / `add` and inline notes for each gap.
