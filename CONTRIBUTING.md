# Contributing

Thanks for improving Agent Skills Codex. This project values small, verifiable changes over broad rewrites.

## Development Rules

- Keep each skill focused on one job.
- Every skill must have `SKILL.md` with YAML frontmatter containing `name` and `description`.
- The `name` must match the skill directory.
- Descriptions must front-load trigger words so Codex can select the skill implicitly.
- Workflow skills should include `When to Use`, `Common Rationalizations`, and `Verification`.
- Prefer scripts only when deterministic checks are more reliable than prose.
- Do not commit `.DS_Store`, generated evidence, secrets, or local environment files.

## Before Opening a PR

Run:

```bash
node scripts/validate-skills.mjs
```

For frontend or visual-verification changes, also run a browser or layout audit against a real app when possible and include the evidence in the PR description.

## PR Description

Include:

- What changed
- Why it changed
- Skills or docs affected
- Validation run
- Remaining risks

