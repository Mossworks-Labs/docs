# AI Providers

CRAFT Studio supports three AI providers. All can be active at once — pick per-request from the model dropdown. Keys are stored per user and managed from **Profile → API keys** in the sidebar.

## Free model

Every signed-in account has access to a built-in free model for script writing, ideas, and revisions. It shows up as **Free** in the model picker and works without any key — useful for exploring the studio before you decide which paid provider you want to add.

## Gemini (Google)

Paste a Gemini key under **Profile → API keys → Gemini**.

Get one at [ai.google.dev](https://ai.google.dev/gemini-api/docs/api-key).

**Characteristics**

- Streams responses in real time
- Good for quick iterations
- The free Gemini tier is usually enough to try the studio end to end

## Claude (Anthropic)

Claude signs in with a **long-lived token from your Claude subscription**, not a paid API key. Generate one at [claude.ai/settings/tokens](https://claude.ai/settings/tokens) and paste it under **Profile → API keys → Claude**.

::: tip No API credits needed
The token uses your existing Claude subscription. Premium accounts get the full Claude model family (Opus, Sonnet, Haiku) plus research-tool access when a token is saved.
:::

**Characteristics**

- May use research tools (storytelling, comedy, etc.) during multi-turn generation
- Responses arrive once they're complete (intermediate planning is filtered out)
- Excellent for complex script writing and fact-checking

## Model selection

The model dropdown appears in:

- The Script editor's Revise tab
- AI chat
- The Ideas inline context hint
- The mobile app's script detail

All available providers show in the same dropdown, grouped by provider. Providers that aren't set up for your account are disabled with a short reason.

## Comparison

| Feature | Free | Gemini | Claude |
|---------|------|--------|--------|
| What you need | Nothing | A Gemini key | A Claude subscription |
| Streaming | Yes | Yes | No (single response) |
| Research tools | No | No | Yes |
| Best for | Trying things out, drafts | Fast iterations | Complex scripts & fact-checking |
