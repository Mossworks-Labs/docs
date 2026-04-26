# Mobile Setup

## Install the APK

1. Download the latest APK from the [EAS build page](https://expo.dev/accounts/xander-rudolph/projects/craft).
2. Transfer to your phone and open it. Allow "Unknown sources" in Android settings the first time.
3. Open **Craft**, sign in with your Keycloak account.
4. Open **Settings** → **Server URL** and point it at your CRAFT server (e.g. `https://craft.example.com/studio`).
5. Tap **Test Connection** — you should see a green check.

## Server Connection

The mobile app talks to the same Express backend as the web app:

- **Hosted CRAFT** — use your ingress hostname (e.g. `https://craft.example.com/studio`). Works from anywhere on the public internet.
- **Local network** — use your server's LAN IP and port (e.g. `http://192.168.1.42:3000`). Phone and server must be on the same network (Wi-Fi or VPN like Tailscale).

The server URL is saved between launches.

::: tip Finding your LAN IP
On the machine running CRAFT, run `ipconfig` (Windows) or `ifconfig` / `ip addr` (Mac/Linux). Use the Wi-Fi adapter's IPv4 address.
:::

::: warning HTTP on Android
Android blocks cleartext HTTP by default. The Craft APK is built with `usesCleartextTraffic: true` so local-network HTTP works without certificate setup.
:::

## Building from source

Building the APK yourself, running the app in Expo Go, or making changes to the mobile codebase is covered in the [project README](https://github.com/Mossworks-Labs/craft/blob/main/README.md#mobile-app-android) — that's contributor territory rather than user-facing setup.
