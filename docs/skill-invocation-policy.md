# Skill Invocation Policy

Codex sees each skill's `name`, `description`, and path before loading the full `SKILL.md`. Keep descriptions concise and front-load trigger language.

## Good Implicit Invocation Candidates

These skills should usually allow implicit invocation because their trigger conditions are broad and task-driven:

- `frontend-ui-engineering`
- `browser-ui-verification`
- `visual-regression-and-layout-qa`
- `backend-reliability-review`
- `api-and-interface-design`
- `test-driven-development`
- `code-review-and-quality`
- `security-and-hardening`

## Recommended Explicit Invocation

Use explicit `$skill` invocation when:

- You want a specific workflow even if the task is ambiguous.
- You are evaluating the skill itself.
- You are doing high-risk review and want to force a particular lens.
- You want to avoid the meta-skill choosing a shorter route.

## Policy Guidance

Do not disable implicit invocation by default. Use `agents/openai.yaml` policy only when a skill is dangerous, expensive, noisy, or should never run without explicit user intent.

For this package, most skills are workflow guidance and should remain implicitly invocable.

