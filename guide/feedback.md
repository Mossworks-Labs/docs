# Feedback

The Feedback panel lets you submit suggestions, bug reports, and content ideas that get refined by AI. With a `GITHUB_TOKEN` configured, submissions become GitHub Issues. Without a token, they're logged server-side with your user + channel context for the operator to triage later.

## Opening the Panel

Click **Feedback** in the top chrome's right rail. The link is always visible — submission destination depends on whether a GitHub token is configured (see below).

## Submitting Feedback

1. **Title** -- a brief summary of your feedback
2. **Description** -- detailed explanation of the suggestion, bug, or idea
3. **Channel** (optional) -- associate the feedback with a specific channel for context

## AI Grooming

Click **Groom with AI** to have the local Ollama model analyze and refine your feedback. The AI returns:

- **Refined Title** -- a clearer, more actionable version
- **Summary** -- 1-2 sentence distillation
- **Action Items** -- concrete checklist of things to do
- **Labels** -- categorization tags (e.g., "bug", "feature", "content-idea")
- **Priority** -- low, medium, or high based on impact
- **Suggestions** -- tips to improve or expand the feedback

All fields are editable after grooming -- tweak anything before submitting.

## Submitting

Click **Submit** to send the feedback. The destination depends on whether a `GITHUB_TOKEN` is configured:

- **With token** — the button reads "Submit to GitHub" and an issue lands in the [Mossworks-Labs/craft](https://github.com/Mossworks-Labs/craft) repository (or whatever repo `GITHUB_ISSUE_REPO` points at).
- **Without token** — the button reads "Submit feedback" and the worker logs the structured payload (title, body, submitter, channel id, labels) to its stdout under `[feedback]`. A `local-<timestamp>` id is returned so the worker run shows complete in the Jobs panel.

Forwarding existing local logs to GitHub later is just a matter of grepping `[feedback]` in the `craft-worker-github-issue` pod logs.

The issue (or log entry) includes:

- Refined title as the issue title
- Markdown body with summary, action items checklist, original description, suggestions, and metadata
- Labels from the groomed result plus a `feedback` label
- Your username so the issue is attributed to you

The submission runs as an async background job. You'll see real-time status updates and a link to the created issue once complete.

::: info Requirements
- **Ollama** must be running for AI grooming. Enable GPU services via Helm (`gpu.enabled: true` in values.yaml) or `docker compose -f docker-compose.dev.yml --profile gpu up -d` for local dev.
- **GitHub Token** is optional. Without it, submissions log server-side with full user/channel context. With it, a real issue is created.
:::

## Re-grooming

Click **Re-groom** to run the AI analysis again with your edited fields. This is useful if you've substantially changed the description after the first grooming pass.
