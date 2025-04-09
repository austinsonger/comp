#!/bin/bash

# Change these to your source paths
LOCALES_DIR="src/locales"
SOURCE_FILE="${LOCALES_DIR}/en.ts"

# Check if there are any changes at all
if git diff HEAD^ HEAD --quiet; then
  echo "No changes detected. Skipping build."
  exit 0
fi

# Check if there are changes in source file
if git diff --name-only HEAD^ HEAD | grep -q "^${SOURCE_FILE}$"; then
  echo "Changes detected in ${SOURCE_FILE}"
  # Check if other files in source directory were also changed
  if git diff --name-only HEAD^ HEAD | grep -q "^${LOCALES_DIR}/[^/]*\.json$" | grep -v "^${SOURCE_FILE}$"; then
    echo "Other locale files were also changed. Proceeding with build..."
    exit 1
  else
    echo "${SOURCE_FILE} was changed but other locale files were not. Failing build."
    exit 0
  fi
else
    # If no changes in source file, proceed with build
    echo "No changes in ${SOURCE_FILE}. Proceeding with build..."
    exit 1
fi
