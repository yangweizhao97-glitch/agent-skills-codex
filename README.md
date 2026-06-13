# Agent Skills Codex

**Codex-oriented engineering skills for AI coding agents.**

This repository is based on [addyosmani/agent-skills](https://github.com/addyosmani/agent-skills) and adapted for Codex-style coding agents. It keeps the original lifecycle discipline, then strengthens the places where AI coding agents often overclaim completion: real-browser UI verification, frontend interaction checks, expected-behavior matching, backend reliability review, and evidence-based test output.

Compared with the original workflow, this Codex-oriented version treats code-level tests, API checks, and unit tests as necessary but not always sufficient. For frontend or full-stack tasks, the agent must open the application in a real browser, render the page, operate the UI like a user, inspect console logs and network requests, verify responsive layouts, compare the visible result against the expected behavior, and provide evidence such as screenshots, logs, and network summaries. A task cannot be marked complete until the primary user journey is proven through browser evidence.

Core rule: **No screenshot, no browser proof. No browser proof, no completion.**

```text
DEFINE        PLAN         BUILD        VERIFY                 REVIEW        SHIP
Idea/Spec --> Tasks  -->   Code   -->   Tests + Browser Proof --> QA Gate --> Launch
```

## What This Version Adds

| Area | Codex-oriented improvement |
|---|---|
| Frontend verification | Adds `browser-ui-verification` as a real-browser acceptance gate |
| Browser evidence | Requires screenshots, console checks, network summaries, and viewport checks |
| Visual layout QA | Adds `visual-regression-and-layout-qa` for overlap, overflow, clipping, touch target, and responsive defects |
| UX correctness | Verifies what users see and do, not only whether code executes |
| Backend reliability | Adds `backend-reliability-review` for validation, auth, consistency, concurrency, and idempotency |
| Completion discipline | Treats missing evidence as incomplete work |

## Codex Usage

For Codex-style coding agents, load skills as instruction context instead of relying on Claude/Gemini plugin commands.

Start with:

1. `skills/using-agent-skills/SKILL.md`
2. The task-specific skill, such as:
   - `skills/browser-ui-verification/SKILL.md`
   - `skills/frontend-ui-engineering/SKILL.md`
   - `skills/api-and-interface-design/SKILL.md`
   - `skills/backend-reliability-review/SKILL.md`
   - `skills/security-and-hardening/SKILL.md`

For frontend or full-stack tasks, always include `browser-ui-verification` during the Verify phase. Code tests passing is not enough when the final result is user-visible.

Use the two browser skills together:

| Skill | Role |
|---|---|
| `browser-ui-verification` | Defines what must be proven: user journeys, expected results, pass/fail criteria, viewport set, and evidence format |
| `browser-testing-with-devtools` | Provides browser runtime tools: screenshots, DOM, console, network, performance, accessibility tree, and computed styles |
| `visual-regression-and-layout-qa` | Adds a visual defect gate: screenshots, horizontal overflow, overlapping controls, clipped overlays, touch targets, and long-content stress checks |

## Quick Start

```bash
git clone https://github.com/yangweizhao97-glitch/agent-skills-codex.git
cd agent-skills-codex
```

Then point your coding agent at:

```text
skills/using-agent-skills/SKILL.md
```

For a frontend or full-stack implementation, add:

```text
skills/frontend-ui-engineering/SKILL.md
skills/test-driven-development/SKILL.md
skills/browser-ui-verification/SKILL.md
skills/visual-regression-and-layout-qa/SKILL.md
```

For a backend API or data-writing implementation, add:

```text
skills/api-and-interface-design/SKILL.md
skills/backend-reliability-review/SKILL.md
skills/security-and-hardening/SKILL.md
```

The upstream Claude, Gemini, Cursor, Windsurf, OpenCode, and Copilot setup guides still apply conceptually because skills are Markdown files, but this repository is intentionally packaged as a Codex-first instruction set rather than a native plugin bundle.

## All 27 Skills

The pack includes 27 skills total: 26 lifecycle skills plus the `using-agent-skills` meta-skill. Each skill is a structured workflow with steps, verification gates, and anti-rationalization tables. You can reference any skill directly.

### Meta

| Skill | What It Does | Use When |
|---|---|---|
| [using-agent-skills](skills/using-agent-skills/SKILL.md) | Maps incoming work to the right skill workflow and defines shared operating rules | Starting a session or deciding which skill applies |

### Define

| Skill | What It Does | Use When |
|---|---|---|
| [interview-me](skills/interview-me/SKILL.md) | Extracts what the user actually wants through a one-question-at-a-time interview | The ask is underspecified or the user asks to be interviewed |
| [idea-refine](skills/idea-refine/SKILL.md) | Refines vague ideas through divergent and convergent thinking | A concept needs exploration before planning |
| [spec-driven-development](skills/spec-driven-development/SKILL.md) | Creates requirements and acceptance criteria before code | Starting a new project, feature, or significant change |

### Plan

| Skill | What It Does | Use When |
|---|---|---|
| [planning-and-task-breakdown](skills/planning-and-task-breakdown/SKILL.md) | Breaks specs into small, ordered, verifiable tasks | You have requirements and need implementable units |

### Build

| Skill | What It Does | Use When |
|---|---|---|
| [incremental-implementation](skills/incremental-implementation/SKILL.md) | Builds in thin vertical slices with verification at each step | Any change touching more than one file |
| [context-engineering](skills/context-engineering/SKILL.md) | Curates the right agent context at the right time | Starting sessions, switching tasks, or improving output quality |
| [source-driven-development](skills/source-driven-development/SKILL.md) | Grounds framework decisions in official documentation | Current, source-cited implementation matters |
| [doubt-driven-development](skills/doubt-driven-development/SKILL.md) | Cross-examines non-trivial decisions while work is in flight | Stakes are high or assumptions are risky |
| [frontend-ui-engineering](skills/frontend-ui-engineering/SKILL.md) | Builds production-quality UI with accessibility and design discipline | Creating or modifying user-facing interfaces |
| [api-and-interface-design](skills/api-and-interface-design/SKILL.md) | Designs stable APIs, contracts, and module boundaries | Creating endpoints, schemas, props, or public interfaces |

### Verify

| Skill | What It Does | Use When |
|---|---|---|
| [test-driven-development](skills/test-driven-development/SKILL.md) | Proves behavior with tests before and during implementation | Implementing logic, fixing bugs, or changing behavior |
| [browser-ui-verification](skills/browser-ui-verification/SKILL.md) | Verifies rendered UI, user journeys, console logs, network requests, and responsive layouts in a real browser | Frontend or full-stack work affects user-visible behavior |
| [browser-testing-with-devtools](skills/browser-testing-with-devtools/SKILL.md) | Uses browser runtime tools for DOM, console, network, performance, and screenshots | Browser evidence or debugging is needed |
| [visual-regression-and-layout-qa](skills/visual-regression-and-layout-qa/SKILL.md) | Audits screenshots and rendered layout for overlap, overflow, clipping, small touch targets, and broken responsive states | UI layout or visual polish could regress |
| [backend-reliability-review](skills/backend-reliability-review/SKILL.md) | Reviews validation, authorization, consistency, concurrency, idempotency, errors, performance, and observability | Backend or full-stack changes affect data, users, or production behavior |
| [debugging-and-error-recovery](skills/debugging-and-error-recovery/SKILL.md) | Reproduces, localizes, fixes, and guards against failures | Tests fail, builds break, or behavior is unexpected |

### Review

| Skill | What It Does | Use When |
|---|---|---|
| [code-review-and-quality](skills/code-review-and-quality/SKILL.md) | Reviews correctness, readability, architecture, security, and performance | Before merging or accepting a change |
| [code-simplification](skills/code-simplification/SKILL.md) | Reduces complexity without changing behavior | Code works but is harder to understand than it should be |
| [security-and-hardening](skills/security-and-hardening/SKILL.md) | Hardens code against vulnerabilities and unsafe inputs | Handling user input, auth, secrets, storage, or integrations |
| [performance-optimization](skills/performance-optimization/SKILL.md) | Measures and improves performance bottlenecks | Performance requirements exist or regressions are suspected |

### Ship

| Skill | What It Does | Use When |
|---|---|---|
| [git-workflow-and-versioning](skills/git-workflow-and-versioning/SKILL.md) | Keeps changes atomic, reviewable, and reversible | Making code changes, committing, branching, or resolving conflicts |
| [ci-cd-and-automation](skills/ci-cd-and-automation/SKILL.md) | Automates quality gates and deployment pipelines | Setting up or changing CI/CD |
| [deprecation-and-migration](skills/deprecation-and-migration/SKILL.md) | Removes old systems and migrates users safely | Replacing, sunsetting, or consolidating systems |
| [documentation-and-adrs](skills/documentation-and-adrs/SKILL.md) | Documents decisions, APIs, and architectural context | Decisions need future human or agent understanding |
| [observability-and-instrumentation](skills/observability-and-instrumentation/SKILL.md) | Adds logs, metrics, traces, and alerting | Shipping production behavior that must be diagnosable |
| [shipping-and-launch](skills/shipping-and-launch/SKILL.md) | Prepares launches with monitoring and rollback plans | Deploying meaningful or risky changes |

## Evidence Standards

Frontend or full-stack completion should include browser evidence:

- Primary user journey completed through visible UI operations
- Console checked for uncaught errors and relevant warnings
- Network requests checked when the flow depends on APIs
- Screenshots captured for relevant states and viewports
- Layout QA completed for overlap, clipping, text overflow, horizontal scrolling, and touch target size when UI changed
- Responsive checks completed for mobile, tablet, and desktop unless the product defines other targets
- Remaining risks explicitly named

Default viewport set:

| Viewport | Size |
|---|---|
| Mobile | 390 x 844 |
| Tablet | 768 x 1024 |
| Desktop | 1440 x 900 |

Suggested evidence file names:

- `before-[route]-desktop.png`
- `after-[route]-desktop.png`
- `after-[route]-mobile.png`
- `after-[route]-tablet.png`
- `console-log.txt`
- `network-summary.md`
- `layout-audit.json`

## Agent Personas

Pre-configured specialist personas for targeted reviews:

| Agent | Role | Perspective |
|---|---|---|
| [code-reviewer](agents/code-reviewer.md) | Senior Staff Engineer | Five-axis code review with "would a staff engineer approve this?" standard |
| [test-engineer](agents/test-engineer.md) | QA Specialist | Test strategy, coverage analysis, and the Prove-It pattern |
| [security-auditor](agents/security-auditor.md) | Security Engineer | Vulnerability detection, threat modeling, OWASP assessment |
| [web-performance-auditor](agents/web-performance-auditor.md) | Web Performance Engineer | Core Web Vitals audit with metric honesty |

## Reference Checklists

| Reference | Covers |
|---|---|
| [testing-patterns.md](references/testing-patterns.md) | Test structure, naming, mocking, React/API/E2E examples, anti-patterns |
| [security-checklist.md](references/security-checklist.md) | Pre-commit checks, auth, input validation, headers, CORS, OWASP Top 10 |
| [performance-checklist.md](references/performance-checklist.md) | Core Web Vitals targets, frontend/backend checklists, measurement commands |
| [accessibility-checklist.md](references/accessibility-checklist.md) | Keyboard nav, screen readers, visual design, ARIA, testing tools |

## Project Structure

```text
agent-skills-codex/
├── skills/                 # 27 skills: 26 lifecycle + 1 meta
├── agents/                 # Specialist review personas
├── references/             # Supplementary checklists
├── docs/                   # Generic skill usage and anatomy docs
├── AGENTS.md               # Agent-oriented routing guidance
├── CODEX-README.md         # Local selection notes for this Codex-oriented package
├── README.md
└── LICENSE
```

## Why Agent Skills Codex?

AI coding agents default to the shortest path, which often means skipping specs, tests, real browser checks, backend failure modes, and the evidence needed to trust a change. Agent Skills Codex gives agents structured workflows that enforce the same discipline senior engineers bring to production code.

The goal is not just "code compiles." The goal is: requirements are understood, implementation is incremental, tests prove logic, browsers prove the user experience, backend reviews catch reliability risks, and final answers include evidence.

## License

MIT. This package preserves the upstream license from `addyosmani/agent-skills`.
