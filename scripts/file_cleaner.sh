#!/bin/bash

DIRECTORY=$1
FILE_CLEANER_PATH=$2

if [ -z "$DIRECTORY" ] || [ -z "$FILE_CLEANER_PATH" ]; then
    echo "Error: Missing arguments"
    echo "Usage: $0 <directory_to_clean> <path_to_this_script>"
    exit 1
fi

if ! crontab -l 2>/dev/null | grep -q "file_cleaner.sh"; then
    (crontab -l 2>/dev/null; echo "* * * * * $FILE_CLEANER_PATH $DIRECTORY") | crontab -
    echo "Script was successfully added to cron!"
fi

find "$DIRECTORY" -type f -mmin +3 -exec tar -czf "{}.tar.gz" "{}" \; -delete