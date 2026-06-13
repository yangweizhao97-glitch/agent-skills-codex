# Agent Skills Codex Maturity Roadmap

## Purpose

This document turns the review notes into a practical roadmap for making `agent-skills-codex` feel less like a forked Markdown collection and more like a Codex-native, installable, verifiable, and maintainable skill product.

The main principle is:

> Do not keep adding skills before the package itself is discoverable, installable, validated, and supported by evidence.

## Source Check

The proposal is mostly correct and useful. It aligns with the current Codex skill model:

- A skill is a directory containing `SKILL.md`.
- `SKILL.md` requires `name` and `description`.
- Codex uses progressive disclosure: it sees skill name, description, and path first, then loads the full skill when selected.
- Implicit invocation depends heavily on concise, front-loaded descriptions.
- Codex scans repo, user, admin, and system skill locations.
- Reusable distribution should use plugins when skills need to be shared or bundled.
- `agents/openai.yaml` can provide app-facing metadata and invocation policy.

One correction matters:

- Codex repo-scoped and user-scoped skill discovery uses `.agents/skills` and `$HOME/.agents/skills`.
- Plugin packaging uses `.codex-plugin/plugin.json` plus marketplace entries.
- This repository can keep `skills/` as source, but should provide install or sync paths into `.agents/skills` and package as a plugin for distribution.

## Current Diagnosis

The project direction is strong:

- It adds real-browser completion discipline.
- It emphasizes screenshots, console checks, network checks, and responsive verification.
- It adds backend reliability review.
- It adds visual layout QA for overlap, overflow, clipping, and touch target defects.

The weak points are product maturity signals:

- The repository still looks like a personal fork unless it has releases, CI, contribution docs, and clean packaging.
- Users must infer how to install and combine skills.
- Quality gates are written in Markdown, but not yet enforced by repository automation.
- There are few concrete examples proving the evidence-based workflow.

## Target Positioning

Position this package as:

> Codex-native browser-proof engineering skill pack.

It should not claim original authorship of the upstream lifecycle model. It should claim a focused extension:

- Codex-native skill packaging
- Browser evidence before frontend completion
- Visual layout QA before accepting UI
- Backend reliability review before accepting API or data-writing work
- Evidence-based completion reports

## Priority 1: Repository Hygiene

These are small changes with high trust impact.

### Required

- Remove `.DS_Store` from git history going forward.
- Add `.gitignore`.
- Add `CONTRIBUTING.md`.
- Add `CHANGELOG.md`.
- Add `SECURITY.md`.
- Add `UPSTREAM.md`.
- Add a release process note, either `RELEASE.md` or `docs/release-process.md`.
- Add GitHub description and topics:
  - `codex`
  - `ai-agents`
  - `agent-skills`
  - `coding-agent`
  - `browser-verification`
  - `visual-regression`

### Suggested `.gitignore`

```gitignore
.DS_Store
node_modules/
dist/
.env
.env.*
!.env.example
coverage/
.turbo/
.vite/
```

### Why

A public repository with `.DS_Store`, no release, no contribution guide, and no CI looks experimental. This weakens the credibility of a package whose core claim is disciplined engineering.

## Priority 2: Codex-Native Discovery

Keep the canonical source in `skills/`, but support Codex discovery paths.

### Repo-Scoped Install

```bash
mkdir -p .agents/skills
cp -R skills/* .agents/skills/
```

### User-Scoped Install

```bash
mkdir -p ~/.agents/skills/agent-skills-codex
cp -R skills/* ~/.agents/skills/agent-skills-codex/
```

### Recommended Scripts

Add:

```text
scripts/
  codex-install-skills.sh
  validate-skills.mjs
  sync-repo-skills.mjs
```

`codex-install-skills.sh` should support:

```bash
./scripts/codex-install-skills.sh --repo
./scripts/codex-install-skills.sh --user
```

### Why

If the package only tells users to manually load Markdown files, it is not taking full advantage of Codex skill discovery.

## Priority 3: Skill Descriptions

Audit every `SKILL.md` description.

### Rules

- Put the most important trigger words first.
- Use clear boundaries.
- Say when to use the skill.
- Avoid vague descriptions.
- Keep descriptions concise enough to survive truncation.

### Good Examples

```yaml
description: Verify frontend or full-stack user-visible changes in a real browser. Use when modifying UI, routes, forms, dialogs, responsive layout, network-backed flows, or when browser evidence is required before completion.
```

```yaml
description: Review backend or full-stack changes for validation, authorization, tenant boundaries, transactions, concurrency, idempotency, error handling, observability, and production reliability. Use when APIs, database writes, auth, queues, jobs, or external integrations change.
```

### Why

Codex implicit skill selection depends mainly on `description`. Weak descriptions mean good skills will not be selected at the right time.

## Priority 4: Keep `AGENTS.md` Short

`AGENTS.md` should be a routing and completion contract, not a long manual.

### Recommended Shape

```md
# AGENTS.md

## Codex Working Rules

- Do not claim frontend or full-stack work is complete without browser evidence.
- For UI work, use `frontend-ui-engineering` and `browser-ui-verification`.
- For layout-sensitive UI work, use `visual-regression-and-layout-qa`.
- For backend, API, auth, database, queue, job, or external integration work, use `backend-reliability-review`.
- For behavior changes, add or update tests.
- Final answers must include changed files, verification run, browser evidence if applicable, and remaining risks.

## Repository Commands

- Validate skills: `node scripts/validate-skills.mjs`
- Run layout audit: `node skills/visual-regression-and-layout-qa/scripts/playwright-layout-audit.mjs --url <url>`
```

### Why

Codex loads `AGENTS.md` before work. A large instruction file consumes context and dilutes important rules. Specific workflows belong in skills.

## Priority 5: Task Bundles

Add bundles that tell users which skills to combine.

```text
bundles/
  frontend.md
  backend.md
  fullstack.md
  review.md
  ship.md
```

Each bundle should include:

- Use when
- Skills
- Evidence required
- Failure conditions
- Final response template

### Example: `bundles/fullstack.md`

```md
# Fullstack Bundle

## Use When

- The task changes both UI and backend/API behavior.

## Skills

- `frontend-ui-engineering`
- `api-and-interface-design`
- `test-driven-development`
- `browser-ui-verification`
- `visual-regression-and-layout-qa`
- `backend-reliability-review`
- `security-and-hardening`

## Completion Requires

- Tests, lint, typecheck, or explicit reason they could not run
- Browser journey verified through visible UI operations
- Console checked
- Network checked
- Screenshots captured
- Layout audit completed for responsive/visual risk
- Backend reliability risks reviewed
- Remaining risks named

## Failure Conditions

- Missing browser evidence for user-visible changes
- Console errors not explained
- Required API requests fail unexpectedly
- Responsive layout untested
- Backend auth, validation, or error handling not reviewed
```

## Priority 6: Completion Report Template

Add `templates/completion-report.md`.

```md
# Completion Report

## Changed

- ...

## Verification

- Unit tests:
- Integration/API tests:
- Typecheck:
- Lint:
- Build:
- Browser journey:
- Console:
- Network:
- Screenshots:
- Layout audit:
- Responsive viewports:

## Evidence

- ...

## Risks

- ...

## Not Verified

- ...
```

Hard rule:

> If browser evidence is missing for frontend or full-stack work, write `Not complete` instead of `Done`.

## Priority 7: Automation

Markdown rules are useful. Automated validation makes them credible.

### Minimum Scripts

```text
scripts/
  validate-skills.mjs
  codex-install-skills.sh
  generate-evidence-report.mjs
```

### `validate-skills.mjs` Should Check

- Every skill directory has `SKILL.md`.
- Frontmatter exists.
- `name` exists.
- `description` exists.
- `name` matches directory name.
- Descriptions are not too short.
- Descriptions include clear trigger language.
- `When to Use` exists.
- `Verification` exists.
- `Common Rationalizations` exists for workflow skills.
- Skill names are unique.
- `agents/openai.yaml` is present for core skills.

### Visual QA Script

The existing `visual-regression-and-layout-qa` script is the right direction. Standardize it as the default layout audit helper and document expected outputs:

```text
evidence/layout-qa/
  320x640.png
  390x844.png
  768x1024.png
  1440x900.png
  layout-audit.json
```

## Priority 8: GitHub Actions

Add `.github/workflows/validate.yml`.

### Checks

- No `.DS_Store`
- Skill schema validation
- YAML frontmatter validation
- Markdown link check
- Script syntax check
- Optional markdown lint

### Example Workflow

```yaml
name: Validate

on:
  pull_request:
  push:
    branches: [main]

jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 22
      - name: Reject .DS_Store
        run: test -z "$(find . -name .DS_Store -print)"
      - name: Validate skills
        run: node scripts/validate-skills.mjs
      - name: Check scripts
        run: node --check skills/visual-regression-and-layout-qa/scripts/playwright-layout-audit.mjs
```

## Priority 9: Upstream Transparency

Add `UPSTREAM.md`.

```md
# Upstream Relationship

## Based On

- Repository: https://github.com/addyosmani/agent-skills
- Commit: <hash>

## This Fork Adds

- Codex-native discovery and packaging guidance
- `browser-ui-verification`
- `visual-regression-and-layout-qa`
- `backend-reliability-review`
- Evidence-based completion gate
- Browser and layout audit artifacts

## This Fork Does Not Claim

- Original authorship of the lifecycle skill architecture
- Replacement of upstream multi-agent platform support
- Compatibility with every upstream command, hook, or platform integration
```

### Why

This makes the fork honest and professional. It also prevents the project from looking like a rebranded copy.

## Priority 10: Examples

Add examples that prove the workflow works.

```text
examples/
  responsive-layout-regression/
    task.md
    selected-skills.md
    evidence/
      screenshots/
      console-log.txt
      network-summary.md
      layout-audit.json
    completion-report.md
  api-idempotency-review/
  fullstack-form-flow/
```

Each example should show:

- The task
- Skills selected
- What failed initially
- What evidence was collected
- What changed
- Final completion report

## Priority 11: First Release

Publish:

```text
v0.1.0 - Codex browser-proof skill pack
```

Release notes:

```md
## Added

- Codex-native skill discovery guidance
- Frontend/browser evidence gate
- Visual layout QA skill
- Layout audit helper
- Backend reliability review
- Evidence report template
- Skill validator
```

## Recommended Execution Order

### Phase 1: Trust Basics

1. Remove `.DS_Store`.
2. Add `.gitignore`.
3. Add `CONTRIBUTING.md`.
4. Add `CHANGELOG.md`.
5. Add `SECURITY.md`.
6. Add `UPSTREAM.md`.

### Phase 2: Codex-Native Use

1. Add install/sync scripts for `.agents/skills`.
2. Add plugin manifest if distributing as a plugin. Done: `.codex-plugin/plugin.json`.
3. Improve all skill descriptions.
4. Add missing `agents/openai.yaml` for core skills.

### Phase 3: Evidence Productization

1. Add completion report template.
2. Add bundle docs.
3. Standardize evidence file names.
4. Document missing-evidence failure rules.

### Phase 4: Automation

1. Add `validate-skills.mjs`.
2. Add GitHub Actions.
3. Add link checks.
4. Add script smoke tests.

### Phase 5: Credibility

1. Add examples.
2. Publish `v0.1.0`.
3. Add GitHub topics and description.
4. Start tracking issues and release notes.

## Final Recommendation

Do not measure maturity by the number of skills.

Measure maturity by whether a user can:

1. Install the skills in Codex.
2. Trust that Codex can discover the right skill.
3. Run validation on the repository.
4. See evidence that frontend work was actually browser-tested.
5. See layout QA artifacts for visual changes.
6. Understand the relationship to upstream.
7. Install or pin a release.

If only one thing is done next, do this:

> Add Codex-native `.agents/skills` install support and a required completion report template.

That gives the project a sharper identity: not just more Markdown, but a browser-proof Codex workflow package.
