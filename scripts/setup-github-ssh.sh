#!/usr/bin/env bash
# One-time setup: add SSH key to ssh-agent, copy pubkey, open GitHub.
# Run: npm run setup-github-ssh  (or ./scripts/setup-github-ssh.sh)

set -e
KEY="${HOME}/.ssh/id_ed25519_github_salaam"
PUB="${KEY}.pub"
GITHUB_SSH_URL="https://github.com/settings/ssh/new?title=salaam-website&target=salaamcolamy"

if [[ ! -f "$PUB" ]]; then
  echo "SSH key not found at $PUB. Run this from the project that created it."
  exit 1
fi

# Add to agent (macOS Keychain) so pushes work without prompts
if command -v ssh-add >/dev/null 2>&1; then
  ssh-add --apple-use-keychain "$KEY" 2>/dev/null || ssh-add "$KEY" 2>/dev/null || true
fi

# Copy pubkey to clipboard (macOS)
if command -v pbcopy >/dev/null 2>&1; then
  cat "$PUB" | pbcopy
  echo "Public key copied to clipboard."
else
  echo "Public key (paste into GitHub):"
  cat "$PUB"
fi

# Open GitHub SSH new key page
if command -v open >/dev/null 2>&1; then
  open "$GITHUB_SSH_URL"
  echo "Opened GitHub SSH settings. Paste (Cmd+V), name the key, then Add SSH key."
else
  echo "Add this key at: $GITHUB_SSH_URL"
fi
