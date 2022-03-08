#!/bin/bash
curl \
  -s -o /dev/null \
  -X PUT localhost:3040/api/crud/reset-attendance \
  -H 'Content-Type: application/json' \
  -d "{\"types\": [\"a\"]}"
