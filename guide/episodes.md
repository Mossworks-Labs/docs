# Episodes

Episodes represent complete video productions that move through a 7-stage pipeline orchestrated by AI agents with automated quality gates. Reach Episodes from the stage rail — **Episodes** is the rightmost stage.

<SchemeImage name="episodes-panel" alt="Episodes panel" />

## Episode detail layout

Click any episode card to open the detail view. It has three stacked sections:

- **Header** — episode title, slug, target duration, action buttons (Delete · Composition · Run Pipeline).
- **Preview** — **collapsed by default**. The header row shows a live status chip (`video ready` / `composition ready` / `not available`). Expand it only when you want to watch — that keeps the pipeline in view while you work.
- **Pipeline Stages** — one row per stage with status dot, name, status chip, and contextual actions.

<SchemeImage name="episode-detail" alt="Episode detail — collapsed preview + pipeline stages" />

## Pipeline stages

Stages run in this order:

| # | Label | Agent | Reviewer | Max iterations | Description |
|---|-------|-------|----------|----------------|-------------|
| 1 | Research | Researcher | Producer | 2 | Gather facts, sources, competitive analysis, define unique angle |
| 2 | Script | Writer | Producer | 3 | Write screenplay in channel character voice |
| 3 | **Audio** | Asset Finder | — | 1 | Generate voiceover and gather media resources |
| 4 | Storyboard *(optional)* | Storyboarder | Producer | 2 | Plan visual sequences and scene layouts |
| 5 | **Composite** | Render Worker | — | 1 | Composition render to MP4 |
| 6 | Review | Producer | — | 1 | Holistic quality gate across all artifacts — always requires human approval |
| 7 | Publish | — | — | 1 | Guard on review approval, mark episode complete |

**Optional stages** (Storyboard, Research) can be skipped on the board — forward drops past them don't require completion.

## Storyboard stage — Open editor

The storyboard stage row has a special **Open editor** button. It jumps to the [Storyboard editor](/guide/storyboard) for this episode — a dedicated UI for planning per-scene visuals, shot types, and attached image/clip resources. That's normally where you'd land rather than running the AI storyboarder directly. If the episode has a linked script, the editor auto-populates; otherwise there's a script dropdown to pick one.

## Execution modes

- **Full Pipeline** — click **Run Pipeline** in the header to execute from the next pending stage through to completion (or until a stage requires human intervention).
- **Single Stage** — click **Run** on any individual stage row to execute just that stage.

## Quality gates

The producer agent scores each stage output 1–10. Stages scoring 7+ pass automatically. Failed stages trigger a feedback loop:

1. Producer writes structured revision notes.
2. Notes are saved as stage feedback.
3. The responsible agent re-runs with the feedback context.
4. Repeat up to the stage's max iterations.

If iterations exhaust without passing, the stage is marked `needs_human` and the pipeline pauses for manual intervention.

### Upstream issues

If the producer identifies a problem originating from an earlier stage (e.g., a weak script caused by thin research), both the current stage and the upstream stage are marked `changes_requested`. The pipeline halts so a human can decide whether to re-run the upstream stage.

### Soft recovery

If an agent hits its turn limit but still produced the expected artifact (e.g., `research.md` exists), the orchestrator proceeds to review rather than hard-failing — the artifact may be good enough to pass.

## Stage statuses

| Status | Meaning | Colour |
|--------|---------|--------|
| `not_started` | Stage hasn't been run | Gray |
| `in_progress` | Agent or render currently executing | Blue (pulsing) |
| `review` | Producer is evaluating the output | Yellow |
| `complete` | Stage passed quality gate | Green |
| `approved` | Human explicitly approved (review stage) | Green |
| `changes_requested` | Feedback provided, needs re-run | Gray |
| `needs_human` | Max iterations exhausted or human gate | Pink |
| `error` | Agent or render failed | Red |

## Artifact viewers

Research, script, and storyboard rows have a chevron for viewing the produced artifact inline. For **storyboard**, the artifact is a summary — the full interactive editor is behind **Open editor**.

## Composition

The header's **Composition** button opens the timeline editor for direct composition editing. Useful for fine-tuning once the AI has produced a first pass.

::: tip
Episodes rely on the background job pool. If a stage hangs in `queued` for several minutes, ask your administrator to check the system's job processors.
:::
