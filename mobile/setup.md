# Mobile Setup

## Install the APK

1. Download the latest APK from the [EAS build page](https://expo.dev/accounts/xander-rudolph/projects/craft).
2. Transfer to your phone and open it. Allow "Unknown sources" in Android settings the first time.
3. Open **Craft** and sign in with your Keycloak account.
4. Open **Settings** → **Server URL** and point it at your CRAFT server's host (e.g. `https://craft.example.com`).
5. Tap **Test connection** — you should see a green check.

## Server URL

The Server URL field takes the **host root** of your CRAFT deployment, not a specific path. The app appends `/api` for backend calls and derives the Keycloak URL by appending `/auth`. So a single host entry covers both:

- API → `<server-url>/api`
- Auth → `<server-url>/auth/realms/craft`

Use the same hostname you'd type into a desktop browser to reach the studio (e.g. `https://craft.example.com`). The setting persists between launches.

::: warning HTTP on Android
Android blocks cleartext HTTP by default. The Craft APK is built with `usesCleartextTraffic: true` so HTTP-only servers work without certificate setup — but production deployments should use HTTPS.
:::

## Building from source

Building the APK yourself, running the app in Expo Go, or making changes to the mobile codebase is covered in the [project README](https://github.com/Mossworks-Labs/craft/blob/main/README.md#mobile-app-android) — that's contributor territory rather than user-facing setup.
