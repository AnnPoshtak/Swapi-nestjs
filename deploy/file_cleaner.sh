#!/bin/bash

DIRECTORY=$1

if [ -z "$DIRECTORY" ]; then
    echo "Error: Missing directory argument"
    echo "Usage: $0 <directory_to_clean>"
    exit 1
fi

if [ ! -d "$DIRECTORY" ]; then
    echo "Error: Directory $DIRECTORY does not exist."
    exit 1
fi

find "$DIRECTORY" -type f -mmin +3 -exec tar -czf "{}.tar.gz" "{}" \; -delete