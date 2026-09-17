# Domain Docs

This repository uses a single-context domain-doc layout.

## Before exploring, read these

- `CONTEXT.md` at the repository root
- Relevant ADRs under `docs/adr/`

If these files do not exist, proceed silently. The domain-modeling workflow creates them when terminology or architectural decisions are resolved.

## Layout

```
/
├── CONTEXT.md
├── docs/adr/
└── src/
```

## Use the glossary's vocabulary

Use terms as defined in `CONTEXT.md` when naming domain concepts in issues, proposals, hypotheses, and tests.

If a needed concept is absent, reconsider whether the project already uses another term or note the gap for domain modeling.

## Flag ADR conflicts

Explicitly identify output that conflicts with an existing ADR rather than silently overriding it.
