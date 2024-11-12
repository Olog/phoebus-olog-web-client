#!/usr/bin/env bash

# Install dependencies and build for later steps
npm ci

# Set required environment varible(s)
export REACT_APP_LEVEL_VALUES=[\"Normal\",\"Shift Start\",\"Shift End\",\"Fault\",\"Beam Loss\",\"Beam Configuration\",\"Crew\",\"Expert Intervention Call\",\"Incident\"]

# Verify the project is buildable in prod
docker build -t test-build-image . -f test.Dockerfile
