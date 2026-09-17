# Issue tracker: GitHub fork

Issues and specs for this checkout live exclusively in the fork's GitHub Issues:

`al3des/pi-account-switcher`

Use the `gh` CLI with `--repo al3des/pi-account-switcher` for all operations. Do not create or modify issues in the upstream `hieplp/pi-account-switcher` repository.

## Fork boundary

Code changes may later be proposed upstream, but planning issues and agent infrastructure belong only to the fork.

Keep changes to `AGENTS.md`, `docs/agents/`, and other agent-only infrastructure separate from code changes intended for upstream. Exclude those files and commits from upstream pull requests.

## Conventions

- **Create an issue**: `gh issue create --repo al3des/pi-account-switcher --title "..." --body "..."`
- **Read an issue**: `gh issue view --repo al3des/pi-account-switcher <number> --comments`
- **List issues**: `gh issue list --repo al3des/pi-account-switcher --state open --json number,title,body,labels,comments`
- **Comment**: `gh issue comment --repo al3des/pi-account-switcher <number> --body "..."`
- **Apply/remove labels**: `gh issue edit --repo al3des/pi-account-switcher <number> --add-label "..."` / `--remove-label "..."`
- **Close**: `gh issue close --repo al3des/pi-account-switcher <number> --comment "..."`

## Pull requests as a triage surface

**PRs as a request surface: no.**

## When a skill says "publish to the issue tracker"

Create an issue in `al3des/pi-account-switcher`.

## When a skill says "fetch the relevant ticket"

Run `gh issue view --repo al3des/pi-account-switcher <number> --comments`.

## Wayfinding operations

The **map** is a single issue with child issues as tickets, all in `al3des/pi-account-switcher`.

- **Map**: an issue labelled `wayfinder:map`.
- **Child ticket**: an issue linked to the map as a GitHub sub-issue. Where sub-issues are unavailable, add the child to a task list in the map body and put `Part of #<map>` at the top of the child body.
- **Labels**: `wayfinder:<type>` (`research`, `prototype`, `grilling`, or `task`).
- **Blocking**: prefer GitHub's native issue dependencies. Where unavailable, use a `Blocked by: #<n>, #<n>` line at the top of the child body.
- **Frontier**: choose the first open, unblocked, and unassigned child in map order.
- **Claim**: assign the issue to the current user before beginning work.
- **Resolve**: comment with the answer, close the child, then add a context pointer to the map's Decisions-so-far.
