# Roles

Every user in CRAFT Studio belongs to one of four roles. Your role decides which channels you see, which AI models you can run, and which premium features are unlocked.

## The four roles

### Admin

- Full access to all channels regardless of ownership
- All AI models available (Claude Opus, Sonnet, Haiku, Gemini, Ollama)
- Can manage all users' resources and content
- Automatically qualifies as premium

### Editor

- Read access to all channels
- Write access only to channels they own
- Standard model access (upgraded with their own API keys, or to premium via the premium role)

### Premium

- All advanced Claude models: Opus, Sonnet, Haiku
- Proposals and Jobs features unlocked (channel-scoped)
- Full Claude Agent SDK capabilities including MCP tool integrations

### Standard

- Own channels only (create, read, update, delete)
- Limited to Ollama local models and Claude Haiku
- No proposals or jobs access
- All other content-creation features

## Three-tier model access

Model availability depends on your role **and** which API keys you've saved in your profile:

| Tier | Who qualifies | Available models |
|------|--------------|-----------------|
| **Standard** | All authenticated users | Ollama (local) + Claude Haiku |
| **API keys** | Users with saved Gemini / Claude keys | + Gemini models |
| **Premium** | `premium` or `admin` role | All Claude models (Opus, Sonnet, Haiku) + Gemini + Ollama + MCP tools |

API keys are stored per-user (encrypted in the database) and managed from the avatar menu → **API Keys**. The studio checks your keys first, then falls back to the server-wide defaults.

## Change password

1. Click your **avatar** in the top-right of the top chrome.
2. Click **Change password** in the dropdown.
3. Enter your **current password** for verification.
4. Enter and confirm your **new password**.

The current-password check prevents unauthorised changes if a session is left open.

## Sign out

Click your avatar → **Sign out** at the bottom of the dropdown. This ends your session and returns you to the login screen.
