# Agent Skills for Codex

Selected version: **Codex / Other Agents**

Why this one:
- The upstream repo does not ship a Codex-native plugin directory.
- Its documented Codex path is the universal Markdown workflow: load `skills/*/SKILL.md` on demand.
- This folder keeps the portable pieces only: `skills/`, `references/`, `agents/`, `AGENTS.md`, and core docs.
- This fork adds Codex-focused verification gates for real-browser UI proof and backend reliability review.

Source:
- Repository: https://github.com/addyosmani/agent-skills
- Branch: `main`
- Commit: `d187883`
- Commit date: 2026-06-10

Codex fork:
- Repository: https://github.com/yangweizhao97-glitch/agent-skills-codex

Suggested use:
- Start with `skills/using-agent-skills/SKILL.md` to choose the right workflow.
- For feature work, load `spec-driven-development`, then `planning-and-task-breakdown`, then `incremental-implementation` and `test-driven-development`.
- For frontend or full-stack work, load `browser-ui-verification` during Verify. Code tests alone are not sufficient for user-visible changes.
- For backend API or data-writing work, load `backend-reliability-review`.
- For review work, load `code-review-and-quality`.
- For frontend work, load `frontend-ui-engineering` and optionally `references/accessibility-checklist.md`.

Note:
- `AGENTS.md` is included because it is the closest project-level instruction file for coding agents.
- The Claude/Gemini/Cursor/Windsurf-specific command files were intentionally not copied.
