#!/usr/bin/env bash
set -euo pipefail

usage() {
  cat <<'EOF'
Usage:
  scripts/codex-install-skills.sh --repo [TARGET_ROOT]
  scripts/codex-install-skills.sh --user

Options:
  --repo   Copy skills into TARGET_ROOT/.agents/skills. TARGET_ROOT defaults to the current directory.
  --user   Copy skills into ~/.agents/skills/agent-skills-codex.
EOF
}

if [[ $# -lt 1 ]]; then
  usage
  exit 1
fi

mode="$1"
target_root="${2:-$(pwd)}"
script_dir="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
repo_root="$(cd "$script_dir/.." && pwd)"
source_dir="$repo_root/skills"

case "$mode" in
  --repo)
    target_dir="$target_root/.agents/skills"
    ;;
  --user)
    target_dir="$HOME/.agents/skills/agent-skills-codex"
    ;;
  -h|--help)
    usage
    exit 0
    ;;
  *)
    usage
    exit 1
    ;;
esac

mkdir -p "$target_dir"
rsync -a --delete "$source_dir"/ "$target_dir"/

echo "Installed skills to $target_dir"

