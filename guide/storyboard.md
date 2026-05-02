# Storyboard

Once a script is in **review** or **final**, the Storyboard editor is where you plan the visuals beat-by-beat — shot type, notes, duration, transitions, and the images or clips you intend to drop into each scene during composition.

<SchemeImage name="storyboard-editor" alt="Storyboard editor — scene list, detail, and resource picker" />

## Opening the editor

There are two entry points that both land in the same place:

1. **From Episodes** — open an episode, find the **Storyboard** row in the Pipeline Stages list, click **Open editor**. If the episode has a linked script, the storyboard auto-populates for it. If not, a dropdown at the top lets you pick one.
2. **Via ⌘K** — open the command palette and jump straight to the storyboard. The script dropdown at the top of the editor works the same way as the Audio room: review/final scripts listed first, drafts below a divider.

## Layout

### Left — scene list

One row per script beat, parsed from the same script-section parser the Audio room uses:

- Numbered index
- Shot-type tag (if set)
- Beat text preview (2 lines)
- Attached-resource count on the right

The footer tallies total resources, estimated duration, and save state — autosaves continuously as you type.

### Center — scene detail

Each scene has:

- **Shot type** — wide, medium, close, cutaway, insert, aerial. Toggle-pill selection.
- **Estimated duration** — seconds (influences total at the bottom of the scene list).
- **Transition** — free-text (cut / fade / dissolve / etc.)
- **Director notes** — multiline textarea for framing, lighting, pacing, or music cues.
- **Planned resources** — grid of attached image/clip thumbnails; hover to reveal a remove button.

### Right — resource library picker

The right rail pulls from the channel's downloaded Resources library:

- **Search** by filename or title
- **Filter** to images or videos only
- Click the **+** button on a row to attach it to the currently focused scene
- **Search the web** and **Upload** buttons open Resource Search and Resource Upload inline as modals — no navigating away — so newly downloaded or uploaded files appear in the right rail the moment you close them

## Typical workflow

1. Finalize a script (promote from draft → review → final in the Script editor).
2. Open its Episode — or create one — and click **Open editor** on the storyboard stage.
3. Walk beat-by-beat. For each scene, pick a shot type, jot notes, attach any images/clips from the library. If you're missing visuals, jump out to Resource Search and they'll appear in the right rail.
4. When every scene is populated, mark the storyboard stage complete in the Episode's pipeline and hand off to assets.

## Persistence

Storyboards autosave continuously and are tied to the script. That means:

- They survive page refresh, browser restarts, and device switches
- Multiple devices see the same storyboard
- A script re-linked to a different episode keeps its storyboard — the record follows the script, not the episode

::: tip
The split into beats comes from the same parser the Audio room uses, which means adding or removing paragraphs in the script after starting a storyboard can shift the beat indexing. Re-run the pipeline's `script` stage or touch up the text first to stabilise scene boundaries.
:::
