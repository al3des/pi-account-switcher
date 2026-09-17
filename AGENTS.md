# AGENTS.md

## Agent skills

### Issue tracker

Track work exclusively in the fork's GitHub Issues; keep agent infrastructure out of upstream submissions. See `docs/agents/issue-tracker.md`.

### Triage labels

Use the five default triage labels. See `docs/agents/triage-labels.md`.

### Domain docs

Use the single-context domain-doc layout. See `docs/agents/domain.md`.

### pi-ralph ticket compatibility

Matt Pocock's current flow is `/to-spec` → `/to-tickets` → `/implement` → `/code-review`. Prefer the issue tracker's native parent/child, sub-issue, and blocking/dependency metadata for tickets created by `/to-tickets`.

If `pi-ralph` needs markdown fallback discovery, every child ticket/issue must also include a `## Parent` section with exactly one bullet containing the parent spec issue reference, for example `- #123`. Do not use prose, URLs, or multiple parent refs in that fallback section. Use `## Blocked by` only when native blocking links are unavailable or when `pi-ralph` compatibility requires it.
