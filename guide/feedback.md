# Feedback

The Feedback panel lets you submit suggestions, bug reports, and content ideas that get refined by AI. When the studio is configured for it, submissions become GitHub Issues; otherwise they're logged server-side with your user + channel context for an operator to triage.

## Opening the Panel

Click **Feedback** in the top bar's right rail. The link is always visible.

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

Click **Submit** to send the feedback. Depending on how your studio is configured:

- **GitHub-connected studio** — the button reads "Submit to GitHub" and an issue is filed in the configured repository.
- **Logging-only studio** — the button reads "Submit feedback" and the submission is logged for an operator to review.

The issue (or log entry) includes:

- Refined title as the issue title
- Markdown body with summary, action items checklist, original description, suggestions, and metadata
- Labels from the groomed result plus a `feedback` label
- Your username so the issue is attributed to you

The submission runs as an async background job. You'll see real-time status updates and a link to the created issue once complete.

::: info Requirements
- AI grooming uses your studio's local model, so it works whenever the local model service is reachable. Ask your administrator if the **Groom with AI** button is greyed out.
- GitHub forwarding is optional — without it, submissions log server-side; with it, a real issue is created.
:::

## Re-grooming

Click **Re-groom** to run the AI analysis again with your edited fields. This is useful if you've substantially changed the description after the first grooming pass.
