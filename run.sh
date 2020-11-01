#!/bin/bash

# Default values of arguments
ENTERYPOINT=0

# Loop through arguments and process them
# Taken from: https://pretzelhands.com/posts/command-line-flags
for arg in "$@"; do
    case $arg in
    --entrypoint)
        ENTERYPOINT=1
        shift # Remove
        ;;
    esac
done

if [ $ENTERYPOINT -eq 1 ]; then
    docker run --rm -it \
        --entrypoint /bin/sh \
        -p 3000:80 \
        --name exporterclientcontainer \
        exporterclient:v1
else
    docker run -d --rm \
        -p 3000:80 \
        --name exporterclientcontainer \
        exporterclient:v1
fi
