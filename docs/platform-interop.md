# Platform Interop Notes

This repository is Codex-first. The active project-level instructions live in `AGENTS.md` and should stay short.

These notes preserve cross-platform context without polluting Codex startup guidance.

## Upstream Platform Context

The upstream `addyosmani/agent-skills` project supports multiple coding-agent environments, including Claude Code, Cursor, Gemini CLI, Windsurf, OpenCode, GitHub Copilot, Kiro, and generic Markdown-based agents.

This fork does not try to match all upstream platform integrations. Its focused value is:

- Codex-native skill discovery and plugin packaging
- Browser evidence before frontend completion
- Visual layout QA for overlap, overflow, clipping, and responsive defects
- Backend reliability review
- Evidence-based completion reports

## OpenCode Notes

OpenCode can conceptually use the same Markdown skills under `skills/<skill-name>/SKILL.md`, but OpenCode-specific routing rules should live in separate OpenCode configuration or documentation.

Do not put OpenCode-only rules in root `AGENTS.md`.

## Claude Notes

Claude Code and claude.ai use different skill/plugin conventions from Codex. Historical instructions about `.claude`, slash commands, zip packages, or Claude project knowledge are not Codex requirements.

Do not describe `scripts/` or zip files as required for Codex skills. In Codex, a skill requires only `SKILL.md`; `scripts/`, `references/`, `assets/`, and `agents/openai.yaml` are optional.

## Subagents and Personas

The files under `agents/` are specialist persona prompts. They are useful references for review, security, testing, and performance perspectives, but they are not required for every Codex run.

Do not make personas invoke other personas. Use them as optional review perspectives when the host platform supports that pattern.

## Distribution Guidance

For Codex:

- Repo-scoped skills: `.agents/skills`
- User-scoped skills: `$HOME/.agents/skills`
- Plugin packaging: `.codex-plugin/plugin.json`
- Marketplace distribution: `.agents/plugins/marketplace.json`

For other platforms, document installation separately and keep it outside root `AGENTS.md`.

