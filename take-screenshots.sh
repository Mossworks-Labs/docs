#!/usr/bin/env bash
# Capture all documentation screenshots into docs/public/screenshots/.
#
# Studio shots live in docs/screenshots.spec.ts and are taken against a
# port-forwarded craft-frontend service (bypasses oauth2-proxy — studio
# trusts the alg:none JWT bearer the spec sends).
#
# Marketplace shots live in marketplace/tests/screenshots/ and are taken
# against the k3s ingress at https://marketplace-dev.mossworks.io/. Chromium
# host-resolver-rules maps the hostname to the cluster LAN IP — no
# /etc/hosts edit needed.
#
# Both flows assume the full stack is already running in k3s. The
# orchestrator sets up two port-forwards (craft-frontend for studio, and
# craft-postgresql so marketplace `forceSellerEnabled` priming works) and
# tears them down on exit.
#
# Usage:
#   cd docs && bash take-screenshots.sh                  # both
#   cd docs && bash take-screenshots.sh studio           # studio only
#   cd docs && bash take-screenshots.sh marketplace      # marketplace only
#
# Env overrides:
#   STUDIO_URL              base URL for studio (default http://localhost:3000)
#   MARKETPLACE_URL         base URL for marketplace (default https://marketplace-dev.mossworks.io)
#   MOSSWORKS_INGRESS_IP    ingress LAN IP for host-resolver-rules (default 192.168.50.26)
#   MARKETPLACE_DIR         marketplace clone path (default ../marketplace)
#   SKIP_PORT_FORWARDS      set to 1 to skip the kubectl port-forward setup
#                           (use if you already have them running)

set -euo pipefail

DOCS_DIR="$(cd "$(dirname "$0")" && pwd)"
SCREENSHOTS_DIR="$DOCS_DIR/public/screenshots"
MARKETPLACE_DIR="${MARKETPLACE_DIR:-$DOCS_DIR/../marketplace}"
STUDIO_URL="${STUDIO_URL:-${SCREENSHOT_URL:-http://localhost:3000}}"
MARKETPLACE_URL="${MARKETPLACE_URL:-${PLAYWRIGHT_BASE_URL:-https://marketplace-dev.mossworks.io}}"
MOSSWORKS_INGRESS_IP="${MOSSWORKS_INGRESS_IP:-192.168.50.26}"
SKIP_PORT_FORWARDS="${SKIP_PORT_FORWARDS:-0}"

target="${1:-all}"

mkdir -p "$SCREENSHOTS_DIR"

# ── Port-forward management ─────────────────────────────────────────────────
PF_PIDS=()
cleanup_port_forwards() {
  if [ "${#PF_PIDS[@]}" -gt 0 ]; then
    echo "[cleanup] stopping ${#PF_PIDS[@]} port-forward(s)..."
    for pid in "${PF_PIDS[@]}"; do kill "$pid" 2>/dev/null || true; done
  fi
}
trap cleanup_port_forwards EXIT

start_port_forward() {
  local svc="$1" port_map="$2"
  if ss -ltn "sport = :${port_map%%:*}" | grep -q LISTEN; then
    echo "[pf] port ${port_map%%:*} already listening — assuming pre-existing forward"
    return
  fi
  kubectl port-forward "svc/$svc" "$port_map" >/dev/null 2>&1 &
  PF_PIDS+=("$!")
  # Wait for the forward to be reachable
  for _ in {1..20}; do
    if ss -ltn "sport = :${port_map%%:*}" | grep -q LISTEN; then return; fi
    sleep 0.2
  done
  echo "ERROR: port-forward for $svc ($port_map) didn't come up"
  exit 1
}

ensure_port_forwards() {
  if [ "$SKIP_PORT_FORWARDS" = "1" ]; then
    echo "[pf] SKIP_PORT_FORWARDS=1 — assuming caller has these set up:"
    echo "       craft-frontend     -> localhost:3000"
    echo "       craft-postgresql   -> localhost:15432"
    return
  fi
  echo "[pf] setting up kubectl port-forwards..."
  start_port_forward craft-frontend     3000:3000
  start_port_forward craft-postgresql   15432:5432
  echo "[pf] ready."
}

# ── Capture functions ───────────────────────────────────────────────────────
shoot_studio() {
  echo "=== studio screenshots ($STUDIO_URL) ==="
  cd "$DOCS_DIR"
  SCREENSHOT_URL="$STUDIO_URL" npx playwright test screenshots.spec.ts
}

shoot_marketplace() {
  echo "=== marketplace screenshots ($MARKETPLACE_URL) ==="
  if [ ! -f "$MARKETPLACE_DIR/package.json" ]; then
    echo "ERROR: marketplace not found at $MARKETPLACE_DIR"
    echo "       Set MARKETPLACE_DIR to the marketplace clone path."
    exit 1
  fi
  MOSSWORKS_SCREENSHOTS_OUT="$SCREENSHOTS_DIR" \
  PLAYWRIGHT_BASE_URL="$MARKETPLACE_URL" \
  MOSSWORKS_INGRESS_IP="$MOSSWORKS_INGRESS_IP" \
  PLAYWRIGHT_DB_URL="postgres://craft:craft@localhost:15432/craft" \
  SPA_BASE_PATH="/" \
  npm --prefix "$MARKETPLACE_DIR" run test:screenshots
}

# ── Main ────────────────────────────────────────────────────────────────────
ensure_port_forwards

case "$target" in
  studio)       shoot_studio ;;
  marketplace)  shoot_marketplace ;;
  all)          shoot_studio; shoot_marketplace ;;
  *)            echo "Unknown target: $target (expected: studio | marketplace | all)"; exit 1 ;;
esac

echo "=== done. screenshots in $SCREENSHOTS_DIR ==="
