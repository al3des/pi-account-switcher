FROM node:22.16.0-bookworm-slim@sha256:048ed02c5fd52e86fda6fbd2f6a76cf0d4492fd6c6fee9e2c463ed5108da0e34
WORKDIR /work
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts
COPY src ./src
COPY tsconfig.json vitest.config.ts ./
COPY scripts/acceptance ./scripts/acceptance
ENV HOME=/tmp/synthetic-home PI_CODING_AGENT_DIR=/tmp/synthetic-home/.pi/agent
CMD ["sh", "-ec", "mkdir -p \"$PI_CODING_AGENT_DIR\"; ./node_modules/.bin/pi install /work; node scripts/acceptance/package.mjs; node scripts/acceptance/auth-cleanup.mjs; node scripts/acceptance/initialization.mjs; node scripts/acceptance/lifecycle.mjs; node scripts/acceptance/children.mjs; node scripts/acceptance/switching.mjs; node scripts/acceptance/verification.mjs; npm run typecheck; npm test"]
