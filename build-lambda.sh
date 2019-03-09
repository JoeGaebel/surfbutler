#!/bin/bash
set -euo pipefail

npm install
npm test
zip target/surfbutler.zip -r app