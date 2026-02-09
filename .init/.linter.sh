#!/bin/bash
cd /home/kavia/workspace/code-generation/love-match-finder-215354-215368/valentines_matcher_frontend
npm run build
EXIT_CODE=$?
if [ $EXIT_CODE -ne 0 ]; then
   exit 1
fi

