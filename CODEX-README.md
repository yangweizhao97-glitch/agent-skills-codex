# Agent Skills for Codex

Selected version: **Codex / Other Agents**

Why this one:
- The upstream repo does not ship a Codex-native plugin directory.
- Its documented Codex path is the universal Markdown workflow: load `skills/*/SKILL.md` on demand.
- This folder keeps the portable pieces only: `skills/`, `references/`, `agents/`, `AGENTS.md`, and core docs.
- This fork adds Codex-focused verification gates for real-browser UI proof and backend reliability review.
- This fork adds visual layout QA for overlap, overflow, clipping, touch target, and responsive defects.
- This fork adds evidence scripts, examples, bundles, completion-report templates, and Codex `agents/openai.yaml` metadata.

What changed from upstream:

| Area | Upstream | Codex fork |
|---|---|---|
| Agent entry points | Claude slash commands, hooks, plugin metadata, and several platform setup docs | Codex-oriented Markdown skills, install script, bundles, and routing guidance |
| UI completion | Browser tools can be used during verification | Browser evidence is mandatory for frontend/full-stack completion |
| Layout quality | General frontend and accessibility guidance | Dedicated visual layout QA workflow plus Playwright audit helper |
| Backend quality | API/security/review skills cover backend work | Dedicated backend reliability review gate |
| Reporting | Skill-specific exit criteria | Evidence directories and completion reports are first-class outputs |

Source:
- Repository: https://github.com/addyosmani/agent-skills
- Branch: `main`
- Commit: `d187883`
- Commit date: 2026-06-10

Codex fork:
- Repository: https://github.com/yangweizhao97-glitch/agent-skills-codex

Suggested use:
- Start with `skills/using-agent-skills/SKILL.md` to choose the right workflow.
- Run `node scripts/validate-skills.mjs` before publishing changes.
- Run `node scripts/assert-evidence-complete.mjs --task frontend --evidence <dir>` before claiming frontend/full-stack completion.
- Install locally with `scripts/codex-install-skills.sh --repo` or `scripts/codex-install-skills.sh --user`.
- For feature work, load `spec-driven-development`, then `planning-and-task-breakdown`, then `incremental-implementation` and `test-driven-development`.
- For frontend or full-stack work, load `browser-ui-verification` during Verify. Code tests alone are not sufficient for user-visible changes.
- For frontend layout or visual polish work, also load `visual-regression-and-layout-qa`; screenshots alone are useful, but screenshots plus layout-audit evidence are better.
- For backend API or data-writing work, load `backend-reliability-review`.
- For review work, load `code-review-and-quality`.
- For frontend work, load `frontend-ui-engineering`, `browser-ui-verification`, `visual-regression-and-layout-qa`, and optionally `references/accessibility-checklist.md`.

Note:
- `AGENTS.md` is included because it is the closest project-level instruction file for coding agents.
- The Claude/Gemini/Cursor/Windsurf-specific command files were intentionally not copied.
