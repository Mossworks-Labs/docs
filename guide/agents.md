# AI Agents

CRAFT uses specialized AI agents that collaborate through the content pipeline. Each agent has a defined role, structured output format, and quality expectations.

## Pipeline Agents

These agents are directly wired into the 7-stage orchestration pipeline:

| Agent | Pipeline Stage | Tools | Output |
|-------|---------------|-------|--------|
| **Researcher** | Research | Web search, file read/write | `research.md` — sources, data, competitive analysis, unique angle |
| **Writer** | Script | File read/write | `script.md` — screenplay in channel character voice |
| **Storyboarder** | Storyboard | File read/write | `storyboard.md` — visual sequences, scene layouts, timing |
| **Asset Finder** | Assets | Web search, file tools | Downloads media resources to episode directory |
| **Producer** | Review (all stages) | Read-only | Structured score (1–10) with pass/fail, feedback, and any upstream issues flagged |

## Support Agents

These agents handle tasks outside the main pipeline:

| Agent | Role |
|-------|------|
| **Content Architect** | Episode structure and outline generation |
| **Brand Designer** | Visual branding and identity |
| **Trend Analyst** | Trend identification and scoring |
| **Channel Wizard** | Channel setup and onboarding |
| **Curator** | Content proposal evaluation |
| **Discovery** | YouTube trend discovery |
| **Idea Router** | Idea classification and channel routing |
| **Channel Strategist** | Long-form channel growth analysis |

## How Agents Execute

When you click **Run** on a pipeline stage, the orchestrator picks the right agent for that stage, hands it the episode context (channel character, prior stage output, any feedback notes from earlier review iterations), and lets it work. When the agent returns, the **Producer** reviews the result against quality criteria for that stage and either passes it forward or sends it back with revision notes.

## Producer Review

The Producer agent is the quality gate. After each stage, it:

- Reads the channel's character configuration for tone and audience expectations
- Reads the stage output
- Scores 1–10 against the stage's quality criteria
- Provides actionable feedback if the score is below 7
- Can flag **upstream issues** (e.g., "the script is weak because the research missed X")

## Budget Controls

Each agent invocation has configurable budget limits:

| Stage | Max Turns | Budget | Review Budget |
|-------|-----------|--------|---------------|
| Research | 30 | $2.00 | $0.50 |
| Script | 30 | $3.00 | $0.50 |
| Storyboard | 25 | $2.00 | $0.50 |
| Assets | 30 | $3.00 | — |
| Final Review | 15 | $1.00 | — |

::: tip
Each agent has a defined persona, instructions, and output expectations. Administrators can customise these for their studio — ask yours if you'd like to tune how a particular agent thinks.
:::
