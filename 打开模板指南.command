#!/bin/zsh
cd -- "$(dirname "$0")"
python3 photo-world-builder/scripts/serve.py . --port 5196 --open
