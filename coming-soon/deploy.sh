#!/usr/bin/env bash
# Deploy coming-soon pages over FTP.
#
# Credentials come from .deploy.env (gitignored). Create it as:
#   PEOPLE_USER=... PEOPLE_PASS=... PEOPLE_HOST=...
#   MERCH_USER=...  MERCH_PASS=...  MERCH_HOST=...
#
# Usage: ./deploy.sh [people|merchanity|all]

set -euo pipefail
cd "$(dirname "$0")"

[[ -f .deploy.env ]] || { echo "missing .deploy.env — see header"; exit 1; }
# shellcheck disable=SC1091
source .deploy.env

# Plain passive FTP. FTPS (--ftp-ssl) truncated transfers on this host with a
# 426, so the data channel stays unencrypted here — see README note on rotating
# these passwords.
FTP_OPTS=(--ftp-pasv --connect-timeout 20 --max-time 240 -sS)

deploy() {
  local label=$1 user=$2 pass=$3 host=$4 src=$5 dest=$6
  local size_local size_remote

  echo "==> $label: $src -> $dest"
  [[ -f $src ]] || { echo "    ERROR: $src not found"; return 1; }

  mkdir -p "backups/$label"
  if curl "${FTP_OPTS[@]}" -u "$user:$pass" "ftp://$host/$dest" \
       -o "backups/$label/$(basename "$dest").bak" 2>/dev/null; then
    echo "    backed up existing $dest"
  else
    rm -f "backups/$label/$(basename "$dest").bak"
    echo "    no existing $dest to back up"
  fi

  curl "${FTP_OPTS[@]}" -u "$user:$pass" -T "$src" "ftp://$host/$dest"

  # Verify: upload is only done if the remote byte count matches local.
  size_local=$(wc -c < "$src" | tr -d ' ')
  size_remote=$(curl "${FTP_OPTS[@]}" -u "$user:$pass" "ftp://$host/$dest" 2>/dev/null | wc -c | tr -d ' ')
  if [[ "$size_local" == "$size_remote" ]]; then
    echo "    OK ($size_local bytes verified)"
  else
    echo "    FAILED: local $size_local != remote $size_remote — file may be truncated"
    return 1
  fi
}

target=${1:-all}
case $target in
  people)     deploy people     "$PEOPLE_USER" "$PEOPLE_PASS" "$PEOPLE_HOST" people-first.html index.html ;;
  merchanity) deploy merchanity "$MERCH_USER"  "$MERCH_PASS"  "$MERCH_HOST"  merchanity.html   public/index.html ;;
  all)
    deploy people     "$PEOPLE_USER" "$PEOPLE_PASS" "$PEOPLE_HOST" people-first.html index.html
    deploy merchanity "$MERCH_USER"  "$MERCH_PASS"  "$MERCH_HOST"  merchanity.html   public/index.html
    ;;
  *) echo "usage: $0 [people|merchanity|all]"; exit 1 ;;
esac
