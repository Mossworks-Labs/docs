# Ideas

The Ideas panel is where content starts. Generate ideas with AI, capture inspiration from YouTube, or add your own manually. It's the default view for a newly-selected channel — click **Ideas** on the top-chrome stage rail to reach it from anywhere.

<SchemeImage name="ideas-panel" alt="Ideas panel — three-column layout" />

## Layout

The panel is a three-column layout:

- **Left — filter rail.** Type (All / Shorts / Long-form), Source (All / AI / Discover / Manual — each with a live count and a coloured dot), Tags (pills that toggle in/out), and a Sort dropdown. Converted ideas are always hidden — once an idea becomes a script it lives on the Board instead.
- **Centre — dense list.** Each idea is a single row: checkbox · type badge · title + hook · source + source metadata · age · action arrow. Click any row to focus it in the right pane.
- **Right — focus pane.** Shows the selected idea's badges, serif title, italic hook, angle, tags, any discovery enrichment (views / likes / transcript), and an action footer (Edit · delete · Convert to script).

## Creating ideas

### Manual

Click **Manual** in the header. A pair of fields appears — title and hook — plus an **Add** button. Manual ideas track with `source: manual` and show a small `✎ Manual` chip.

### AI Generate

<SchemeImage name="ideas-generate" alt="AI generate with inline context hint" />

The **Generate 5 more** button is always visible. Above the list sits an inline **Context hint** input — anything you type there (e.g. "trending topic: kelp forests") is fed to the generator. The current model is shown next to the input; change it via the model picker. Click generate and five new ideas stream into the list, tagged with the model that produced them.

### From Discover

When researching YouTube videos in the [Discover](/guide/discover) panel, click **Inspire** on any video. The idea lands here with `source: discover` and the video's metadata (views, duration, description, transcript if available) carried as enrichment — visible in the focus pane.

## Working the list

- **Search** — type in the box above the list (`⌘F` focuses it in Chrome). Matches title, hook, angle, and tags.
- **Sort** — newest / oldest / title A–Z / source — switchable from the left rail's Sort dropdown.
- **Type toggle** — Short ↔ Long controls both filtering and what's used when you generate.
- **Multi-select** — checkboxes on each row. When anything is selected the toolbar shows **Delete (n)** and **Cancel**.

## Editing an idea

Click a row to focus it, then **Edit** in the right pane. Title / hook / angle are inline form fields; save commits immediately.

## Convert to script

From the focus pane, click **Convert to script**. A new script **and** a matching episode are created together — research is auto-approved so the episode lands in the board's **Script** column, and the script-generate worker (write → fact-check → humanize) is dispatched immediately. The script bubble flips through `not_started → in_progress → complete` while the worker runs.

The script carries the idea's title, hook, angle, and any enrichment data (e.g. Discover transcripts become reference material). The original idea is marked `convertedToScript` and disappears from Ideas — from here on, the board is where it lives. Clicking **Convert to script** a second time on an already-converted idea jumps to the existing script instead of duplicating it.

Dragging an idea from the **Backlog** column to **Script** on the board does the same thing (creates the episode + dispatches the worker), so either entry point lands you in the same flow.

::: info Source tracking
Every idea records its `source` (`manual` / `ai` / `discover`). AI-sourced ideas also record the `generatedByModel` for reproducibility. The source chip in the list (`✦ AI · claude sonnet` / `⊕ Discover · 2.4M views`) makes provenance visible at a glance.
:::
