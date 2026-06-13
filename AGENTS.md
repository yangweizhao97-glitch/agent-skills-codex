# AGENTS.md

This repository is a Codex-first skill pack for evidence-based software engineering workflows.

## Positioning

- This project is based on `addyosmani/agent-skills`.
- It does not try to replace upstream multi-platform support.
- Its focus is Codex-native completion gates: browser proof, visual layout QA, backend reliability review, and evidence-based final reports.

For upstream attribution and scope, see `UPSTREAM.md`.
For non-Codex platform notes, see `docs/platform-interop.md`.

## Codex Working Rules

- Use skills from `skills/<skill-name>/SKILL.md` when the task matches their descriptions.
- For frontend or full-stack work, do not claim completion without `browser-ui-verification`.
- For layout-sensitive UI work, also use `visual-regression-and-layout-qa`.
- For backend, API, auth, database, queue, job, webhook, or external integration work, use `backend-reliability-review`.
- For behavior changes, add or update tests or explicitly explain why tests cannot run.
- Keep `AGENTS.md` short. Put task-specific workflow details in skills, bundles, templates, or docs.

## Completion Rule

Frontend or full-stack work is not complete without browser evidence.

If browser evidence is missing, write `Not complete` instead of `Done`.

Final answers for implementation work should include:

- Changed files
- Verification run
- Browser evidence, when applicable
- Layout audit, when applicable
- Backend reliability review, when applicable
- Remaining risks
- Not verified

## Repository Commands

```bash
node scripts/validate-skills.mjs
scripts/codex-install-skills.sh --repo
scripts/codex-install-skills.sh --user
node scripts/assert-evidence-complete.mjs --task frontend --evidence evidence/layout-qa
```

## Skill Routing

- UI work: `frontend-ui-engineering` -> `browser-ui-verification` -> `visual-regression-and-layout-qa`
- Backend/API work: `api-and-interface-design` -> `backend-reliability-review` -> `security-and-hardening`
- Full-stack work: use `bundles/fullstack.md`
- Review work: use `code-review-and-quality`
- Shipping work: use `shipping-and-launch`

