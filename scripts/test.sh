#!/usr/bin/env bash

# Test the code
CI=true npm test 

# Verify the project is buildable in prod
docker build -t test-build-image . -f test.Dockerfile