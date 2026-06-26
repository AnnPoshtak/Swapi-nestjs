#!/bin/bash

DIRECTORY=$1

if [ -z "$DIRECTORY" ]; then
    echo "Error: Missing argument"
    echo "Usage: $0 <directory>"
    exit 1
fi

echo "Watcher started for $DIRECTORY under screen. Press Ctrl+A, then D to detach."

while true; do
    find "$DIRECTORY" -type f -exec chmod 660 {} \;
    find "$DIRECTORY" -type d -exec chmod 770 {} \;
    sleep 5
done