#!/usr/bin/env bash

set -euo pipefail

if repo_root="$(git rev-parse --show-toplevel 2>/dev/null)"; then
  :
else
  repo_root="$(cd "$(dirname "$0")/.." && pwd)"
fi
cd "$repo_root"

if [[ "${SKIP_PRECOMMIT_DEPLOY:-}" == "1" ]]; then
  echo "pre-commit deploy: skipped by SKIP_PRECOMMIT_DEPLOY=1"
  exit 0
fi

env_file="${DEPLOY_ENV_FILE:-.env.deploy.local}"
if [[ -f "$env_file" ]]; then
  set -a
  # shellcheck disable=SC1090
  source "$env_file"
  set +a
fi

build_cmd="${DEPLOY_BUILD_CMD:-pnpm docs:build}"
source_dir="${DEPLOY_SOURCE_DIR:-docs/.vitepress/dist}"
remote_dir="${DEPLOY_REMOTE_DIR:-${REMOTE_DIR:-/www/wwwroot/ryw_yun_project/wgg_project/}}"
ssh_host="${DEPLOY_SSH_HOST:-${SSH_HOST:-}}"
ssh_user="${DEPLOY_SSH_USER:-${SSH_USER:-}}"
ssh_port="${DEPLOY_SSH_PORT:-${SSH_PORT:-22}}"
ssh_key="${DEPLOY_SSH_KEY:-${SSH_KEY:-}}"
strict_host_key_checking="${DEPLOY_STRICT_HOST_KEY_CHECKING:-accept-new}"

cleanup_files=()
cleanup() {
  [[ "${#cleanup_files[@]}" -eq 0 ]] && return 0

  for file in "${cleanup_files[@]}"; do
    [[ -n "$file" && -f "$file" ]] && rm -f "$file"
  done
}
trap cleanup EXIT

fail_missing_config() {
  cat <<'EOF'
pre-commit deploy: missing SSH config.

Create .env.deploy.local from .env.deploy.example and fill:
  DEPLOY_SSH_HOST=your-server-public-ip
  DEPLOY_SSH_USER=root
  DEPLOY_SSH_KEY=~/.ssh/tencent-cloud.pem

Or export compatible variables:
  SSH_HOST, SSH_USER, SSH_PRIVATE_KEY

Temporarily skip this hook with:
  SKIP_PRECOMMIT_DEPLOY=1 git commit ...
EOF
  exit 1
}

shell_quote() {
  local value="${1//\'/\'\\\'\'}"
  printf "'%s'" "$value"
}

require_command() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "pre-commit deploy: command not found: $1"
    exit 1
  fi
}

[[ -n "$ssh_host" && -n "$ssh_user" ]] || fail_missing_config

require_command ssh
require_command rsync

if [[ "$build_cmd" == pnpm* ]]; then
  require_command pnpm
fi

if [[ "$ssh_key" == "~/"* ]]; then
  ssh_key="$HOME/${ssh_key#~/}"
fi

ssh_args=(
  -p "$ssh_port"
  -o BatchMode=yes
  -o StrictHostKeyChecking="$strict_host_key_checking"
)

if [[ -n "$ssh_key" ]]; then
  if [[ ! -f "$ssh_key" ]]; then
    echo "pre-commit deploy: SSH key file not found: $ssh_key"
    exit 1
  fi
  chmod 600 "$ssh_key" 2>/dev/null || true
  ssh_args+=(-i "$ssh_key")
elif [[ -n "${SSH_PRIVATE_KEY:-}" ]]; then
  temp_key="$(mktemp)"
  printf '%s\n' "$SSH_PRIVATE_KEY" | tr -d '\r' > "$temp_key"
  chmod 600 "$temp_key"
  cleanup_files+=("$temp_key")
  ssh_args+=(-i "$temp_key")
fi

echo "pre-commit deploy: building site with '$build_cmd'"
bash -lc "$build_cmd"

if [[ ! -d "$source_dir" ]]; then
  echo "pre-commit deploy: build output not found: $source_dir"
  exit 1
fi

destination="$ssh_user@$ssh_host"
remote_dir_quoted="$(shell_quote "$remote_dir")"

echo "pre-commit deploy: ensuring remote directory $destination:$remote_dir"
ssh "${ssh_args[@]}" "$destination" "mkdir -p $remote_dir_quoted"

rsync_ssh="ssh"
for arg in "${ssh_args[@]}"; do
  rsync_ssh+=" $(shell_quote "$arg")"
done

echo "pre-commit deploy: syncing $source_dir/ to $destination:$remote_dir"
rsync -az --delete -e "$rsync_ssh" "$source_dir/" "$destination:$remote_dir"

echo "pre-commit deploy: done"
