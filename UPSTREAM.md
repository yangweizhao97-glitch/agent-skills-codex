# Upstream Relationship

## Based On

- Repository: https://github.com/addyosmani/agent-skills
- Recorded source commit: `d187883`
- Recorded source date: 2026-06-10

## This Fork Adds

- Codex-oriented usage and routing guidance.
- Browser UI verification as a completion gate.
- Visual regression and layout QA for overlap, overflow, clipping, touch targets, and responsive defects.
- Backend reliability review for validation, authorization, consistency, concurrency, idempotency, and observability risks.
- Evidence-based completion expectations.
- Codex-native install and packaging roadmap.
- Codex-oriented `agents/openai.yaml` metadata for core skills.
- Evidence tooling:
  - `scripts/assert-evidence-complete.mjs`
  - `scripts/generate-evidence-report.mjs`
  - `scripts/codex-install-skills.sh`
  - `scripts/sync-repo-skills.mjs`
  - `scripts/validate-skills.mjs`
- Evidence-backed examples for frontend, full-stack, and backend review workflows.
- Bundles, completion-report template, skill invocation policy, maturity roadmap, release process, security policy, and platform interop notes.

## Major Differences From Upstream

| Area | Upstream | This fork |
|---|---|---|
| Target environment | Broad multi-platform support, including Claude Code commands, hooks, plugin metadata, and setup guides for multiple agents | Codex-first instructions and scripts, with other platforms documented as interop notes |
| Frontend completion | Browser/devtools workflow is available when selected | Frontend and full-stack work is not complete without browser evidence |
| Layout verification | Included as part of general UI/accessibility expectations | Dedicated layout QA skill plus an optional Playwright audit helper |
| Backend reliability | Covered through API, security, observability, and review skills | Dedicated backend reliability review gate for production-facing API/data changes |
| Evidence artifacts | Workflow-dependent and mostly manual | Standard evidence files, examples, completion report template, and evidence checker |
| Root packaging | Includes upstream command, hook, and plugin files | Removes those platform-specific entry points from the Codex-focused distribution |

## This Fork Does Not Claim

- Original authorship of the upstream lifecycle skill architecture.
- Replacement of upstream multi-agent platform support.
- Compatibility with every upstream command, hook, or platform-specific integration.

## Maintenance Policy

When pulling ideas from upstream, preserve attribution and document behavior changes in `CHANGELOG.md`.
