# Channels

Channels are the top-level organizer in CRAFT. Each channel has its own character personality, topics, voice settings, and content library.

## Creating a channel

1. Click the **channel pill** in the top bar (left side, next to the logo) to open the dropdown.
2. Click **+ New channel** at the bottom.
3. Enter a **Channel name** and optional **Character name**.
4. Click **Create**.

<SchemeImage name="create-channel" alt="Create Channel dialog inside the channel pill dropdown" />

You'll land in the new channel's Settings so you can configure character, voice, and topics.

## Channel settings

Open them from the top bar — either the **Settings** link in the right-rail (only visible when a channel is selected) or the channel-pill dropdown → **Channel settings**. See the full [Settings guide](/guide/settings).

### Character

- **Name** — your character's display name
- **Description** — personality, tone, speaking style. This is fed to the AI for all content generation.
- **Topics** — content themes (e.g., "cloud computing", "DevOps", "terraform"). Used as default search hints in Discover.
- **Tags** — organizational labels for your ideas and scripts

::: tip AI Character Creator
Click **Create Character** in Settings to have AI generate a full character description from a few inputs: tone, audience, inspiration, and quirks.
:::

### Voice

Configure a default TTS voice for audio generation:
- **Service** — Edge TTS (free), ElevenLabs, or OpenAI
- **Voice** — cascading filters by language, gender, then specific voice
- **Test** — preview the voice before saving

### Niche

A preset (Gaming, Tech, Finance, Education, Entertainment, How-To, News, Lifestyle, Health, Food, Travel, Kids, Beauty) or **Other (custom)** for niches outside the preset set. Drives Discover's default search query and the RPM used to estimate earnings. Custom niches let you set a label + comma-separated Discover prompts. See [Settings → Niche](/guide/settings#niche).

### CLAUDE.md

The AI Context editor lets you view and edit the CLAUDE.md file that shapes Claude's responses for this channel. In **Character** mode, it's auto-generated from your settings. In **Raw** mode, you can write custom instructions.

## Switching channels

The top bar gives you three ways to switch:

- **Peer avatars** — the next few channels sit as small avatars next to the channel pill. One click to switch.
- **Channel pill dropdown** — shows every channel you own with subs/character, click to select.
- **⌘K command palette** — type a channel name, hit enter. See [Top bar & ⌘K](/guide/command-palette).

## Channel ownership

Each channel is owned by the user who created it. What you can see and edit depends on your [role](/guide/auth):

| Role | See own channels | See others' | Edit others' |
|------|-----------------|-------------|--------------|
| **Admin** | Yes | Yes | Yes |
| **Editor** | Yes | Yes (read-only) | No |
| **Standard** | Yes | No | No |

When you create a channel it's automatically assigned to you. Your username and role live under the avatar menu in the top-right of the top bar.

## Multiple Channels

You can create as many channels as you need — one per YouTube channel, or separate ones for different content series.
