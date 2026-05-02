# AI Providers

CRAFT Studio supports three AI providers. All can be active at once — pick per-request from the model dropdown. API keys are **per-user** and stored encrypted on the server — set them in **Avatar menu → API Keys**.

## Gemini (Google)

Paste a Gemini API key in the API Keys modal under the **Gemini** field.

Get a key at [ai.google.dev](https://ai.google.dev/gemini-api/docs/api-key).

**Characteristics**

- Streams responses token-by-token (real-time)
- Reliable with standard API keys
- Good for quick iterations
- Free tier is usually enough to explore the studio

## Claude (Anthropic)

Claude authenticates via a **long-lived OAuth token**, not a paid API key. Generate a token at [claude.ai/settings/tokens](https://claude.ai/settings/tokens) and paste it into the API Keys modal under the **Claude** field.

::: tip No API credits needed
The OAuth token uses your Claude subscription instead of the paid API. Premium users get the full Claude model family (Opus, Sonnet, Haiku) plus MCP tool access when a token is saved.
:::

**Characteristics**

- May use MCP research tools (storytelling, comedy, etc.) during multi-turn generation
- Responses arrive as a single block (not streamed) — intermediate planning is filtered out
- Excellent for complex script writing and fact-checking

## Ollama (Local LLM)

Ollama runs models on your local GPU — no API key needed, no internet after the model is pulled. The studio picks up whatever models are loaded on its Ollama service; the model picker shows them automatically in an "Ollama (Free)" optgroup. Availability depends on whether your studio operator has the local-model service enabled.

::: tip Auto-pull on first boot
A small starter model is pulled automatically on first boot, so a fresh studio always has at least one usable local model. The recommended default for script writing is `qwen2.5:7b` (~4.7 GB, 128 k context).
:::

### Pulling additional models

There's no in-app pull UI today — pulling new local models is an operator task. Ask your administrator if you'd like a different model added.

### Suggested models

| Model | Size | Best for |
|-------|------|----------|
| `qwen2.5:7b` | ~4.7 GB | **Recommended default** — script writing, 128 k context |
| `qwen2.5-coder:14b` | ~9 GB | Code-aware scripts, reasoning |
| `deepseek-r1:14b` | ~9 GB | Reasoning, fact-heavy scripts |
| `llama3.1:8b` | ~5 GB | General purpose (lower VRAM) |
| `qwen2.5:1.5b` | ~986 MB | Auto-pulled fallback — fast but limited output |

### Characteristics

- Streams responses token-by-token (like Gemini)
- Fully offline once the model is downloaded
- GPU required for usable speed
- Available to every user — Ollama models appear in the dropdown's "Ollama (Free)" optgroup whether or not the user has any API keys configured

::: tip VRAM requirements
14 B parameter models need ~10 GB VRAM. If you have 8 GB or less, pick 7 B / 8 B variants instead.
:::

## Model selection

The model dropdown appears in:

- The Script editor's Revise tab
- AI chat
- The Ideas panel's inline context hint
- The mobile app's script detail

All three providers show in the same dropdown when configured, grouped by provider. Providers that aren't set up for your account are disabled with a reason (e.g. "No API credits", "Service unavailable").

## Comparison

| Feature | Gemini | Claude | Ollama |
|---------|--------|--------|--------|
| Auth | API key | OAuth token | None (local) |
| Streaming | Yes (token-by-token) | No (buffered) | Yes (token-by-token) |
| MCP tools | No | Yes | No |
| Speed | Fast | Multi-turn possible | Depends on GPU |
| Cost | API credits | Included with Claude subscription | Free (your hardware) |
| Internet | Required | Required | Not needed after pull |
