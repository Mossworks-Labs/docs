# Discover

Discover is where you work out what to make next. Instead of browsing what other
people have already published, you talk it through: what the video is about, who
it's for, and how long it should run. When the idea is solid, one click turns it
into a script in your channel.

Open it from the Studio sidebar → **Discover**.

::: tip This replaced the old YouTube search
Discover used to search YouTube directly. That depended on a logged-in session
that expired constantly, and it mostly surfaced other people's uploads rather
than a plan for yours. Planning in conversation is both more reliable and more
useful.
:::

## Planning an episode

1. **Pick a channel.** Planning is channel-specific — it uses your channel's
   voice and niche to suggest angles, so choose a channel first (or create one).
2. **Say what you're thinking.** A topic, a half-formed idea, or just the mood
   you're after. If you're stuck, say who you're making it for and you'll get a
   few angles to react to.
3. **Set the shape.** Use the **Short / Long-form** toggle in the header, and say
   how long you want it — the target length shapes the structure you get back.
4. **Push back.** Reject the angles that feel generic. The useful result is the
   one you argued your way to.

### Turning it into a script

When the idea has settled, click **Turn this into a script**. That creates:

- an **idea** in your channel, carrying the title, hook and angle
- a **script** seeded with that framing, ready to write in the editor
- the link between them, so the idea doesn't reappear as an orphan on your board

You'll land in the Scripts panel with the new draft selected.

## Choosing a model

The model picker sits in the header next to the length toggle. Claude and Gemini
models are both available; which ones you see depends on your plan and on the API
keys stored for the channel (Profile → API keys). If a model is unavailable, the
picker says why.

**Start over** (the circular arrow) clears the conversation and begins fresh.
Nothing is saved until you turn it into a script.

## Planning in Claude instead

Every plan is a paid AI action. If you'd rather not spend allowance on ideation —
or you simply prefer working in Claude — connect CRAFT to Claude and plan there:
the conversation runs on your own Claude plan, and the finished script still
lands in your channel.

In Claude: **Settings → Connectors → Add custom connector**, then paste your
CRAFT connector URL (`https://<your-craft-host>/api/mcp`) and sign in with the
account you use here.

Claude can then research the topic, draft the script, submit it to your channel,
fact-check or humanize it, and estimate what production will cost — without you
leaving the conversation. Setup guide and the full tool list:
[Mossworks-Labs/craft-claude-plugin](https://github.com/Mossworks-Labs/craft-claude-plugin).

## Script length

There's no length limit. Write to whatever the material deserves — a 20-minute
deep dive is as valid as a 45-second short. The word targets shown in the script
editor (150 for shorts, 1,500 for long-form) are pacing guidance, not caps.

CRAFT prices runtime at roughly **150 spoken words per minute**, so a 3,000-word
script is about a 20-minute video. Stage directions in `[square brackets]` and
`**Speaker:**` prefixes don't count toward the spoken total.

## What happened to channel research?

Subscriber caps, outlier filters, channel deep-dives and earnings estimates went
with the YouTube search surface.

Your **own** channel's metrics are unaffected — they live in
[Channel settings](/guide/settings) → YouTube, which connects over OAuth and is
unrelated to the retired search path. Publishing to YouTube is likewise unchanged.
