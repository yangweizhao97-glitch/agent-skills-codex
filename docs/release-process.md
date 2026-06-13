# Release Process

## Versioning

Use semantic versioning after `v0.1.0`.

## Release Checklist

- [ ] `node scripts/validate-skills.mjs` passes
- [ ] GitHub Actions passes on `main`
- [ ] `CHANGELOG.md` includes the release notes
- [ ] README install instructions still match current structure
- [ ] New or changed core skills have `agents/openai.yaml`
- [ ] Examples and templates do not contain secrets
- [ ] Tag is created as `vX.Y.Z`

## First Release

Target:

```text
v0.1.0 - Codex browser-proof skill pack
```

Suggested notes:

```md
## Added

- Codex-native skill discovery guidance
- Frontend/browser evidence gate
- Visual layout QA skill and audit helper
- Backend reliability review
- Evidence report template
- Skill validator
```

