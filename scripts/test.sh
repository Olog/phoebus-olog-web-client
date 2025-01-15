#!/usr/bin/env bash

# Test the code
CI=true npm test && npx cypress run --component --browser chrome
