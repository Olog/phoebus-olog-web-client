#!/usr/bin/env bash

# Install dependencies and build for later steps
npm ci

# Verify the project is buildable in prod
docker build -t test-build-image . -f test.Dockerfile
