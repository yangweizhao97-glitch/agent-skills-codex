---
name: browser-ui-verification
description: Verifies frontend and full-stack changes in a real browser from the user's perspective. Use after building or modifying pages, components, forms, routing, authentication flows, dashboards, modals, responsive layouts, or any feature where rendered UI, interaction behavior, console errors, network requests, or visual correctness determine whether the task is actually done. Use when code tests pass but browser behavior still needs proof.
---

# Browser UI Verification

## Overview

Verify that the user-facing experience works in a real browser, not just in code, unit tests, or API scripts. Treat browser verification as a release gate for frontend and full-stack work: render the page, operate it like a user, inspect runtime evidence, fix issues, and repeat until the expected flow is proven.

This skill complements `browser-testing-with-devtools`: use this skill to define the acceptance workflow and quality bar, and use browser/DevTools tools such as Playwright or Chrome DevTools MCP to collect evidence.

## When to Use

Use this skill after completing or changing frontend or full-stack work where the final result is user-visible.

Typical triggers:

- A page, component, layout, modal, form, dashboard, or navigation flow changed
- Authentication, onboarding, checkout, CRUD, search, filtering, upload, or submission behavior changed
- A task is considered done only if users can see and operate the feature correctly
- Automated tests pass but rendered browser behavior still needs proof
- Console errors, failed API requests, responsive layout, accessibility, or visual overlap could affect quality

Do not use this skill for backend-only changes, CLI tools, or library code with no browser-rendered surface.

## Core Workflow

### 1. Derive the User Journey

Before opening the browser, extract the expected behavior from the task, spec, PRD, issue, or user request.

Write a short verification plan:

```markdown
Journey:
1. Navigate to [route]
2. Perform [user action]
3. Expect [visible result, route, state, API result]

Evidence to collect:
- Screenshot or visual observation
- DOM/accessibility state for key UI
- Console errors/warnings
- Network requests and responses
- Responsive viewport checks when layout matters
```

If the task involves login, forms, modal flows, data loading, permissions, pagination, filtering, uploads, checkout, or destructive actions, include those exact steps. If credentials, seed data, or a dev server command are unknown and cannot be discovered from the repo, ask for the missing input.

### 2. Run the App Like a User

Start the app the same way a developer or tester would. Use the real browser whenever possible.

Perform actual user operations:

- Navigate through routes instead of only loading isolated components
- Type into inputs instead of mutating state directly
- Click buttons, links, tabs, menus, checkboxes, and toggles
- Submit forms and verify validation messages
- Open and close dialogs, drawers, popovers, menus, and tooltips
- Follow redirects and page transitions
- Exercise loading, empty, success, and error states when reachable

Use JavaScript execution only for read-only inspection by default. Do not treat direct DOM mutation as proof that the user flow works.

### 3. Inspect Runtime Evidence

For each journey, check all relevant evidence:

| Area | Check |
|---|---|
| Visual rendering | No overlapping components, broken spacing, clipped content, text overflow, invisible labels, incorrect z-index, or layout jumps |
| Interaction | Buttons, links, forms, keyboard focus, hover/focus states, modals, tabs, menus, and disabled states behave as expected |
| Functional result | Displayed content, redirects, success states, errors, persistence, filtering, sorting, and submitted data match the requirement |
| Console | No uncaught exceptions, hydration errors, framework warnings, accessibility warnings, or unexpected security/CORS messages |
| Network | Required requests fire once, use expected methods/payloads, return expected status codes, and failure states are handled |
| Accessibility | Interactive elements are keyboard reachable, focus is visible, labels exist, dialog focus is managed, and semantic roles are sensible |
| Responsiveness | Critical pages work at mobile, tablet, and desktop widths when the feature is responsive or user-facing |

For data-driven screens, confirm that the UI reflects the network response or application state. Do not accept a passing API call if the rendered page shows stale, missing, duplicated, or incorrectly formatted data.

### 4. Compare Against Expectations

Judge browser observations against the task objective, not merely against "the page loaded."

Verify:

- Required content is present and understandable
- Primary and secondary actions lead to the right state
- Form validation messages appear at the right time and are actionable
- Error states are visible, not swallowed by console/network failures
- Navigation lands on the expected route
- Loading states do not permanently block the page
- Mobile layout remains usable without horizontal scrolling or hidden controls

If expected behavior is ambiguous, state the assumption before marking verification as passed.

### 5. Fix and Re-Verify

When browser verification fails:

1. Capture the symptom with screenshot, console, DOM, or network evidence.
2. Identify the likely source: layout/CSS, component state, routing, API contract, data shape, async timing, accessibility, or browser compatibility.
3. Fix the source code.
4. Rebuild or reload the app.
5. Repeat the same user journey until the evidence passes.

Do not report completion while known browser failures remain unresolved unless the user explicitly accepts the limitation.

## Common Rationalizations

| Rationalization | Counter |
|---|---|
| "The tests pass, so the UI is done." | Tests prove selected logic paths, not rendered layout, browser console health, network behavior, or actual user operation. |
| "The component code looks correct." | Browser rendering can still fail because of CSS cascade, z-index, viewport size, data shape, hydration, or runtime state. |
| "The API returned data, so the page works." | The user sees the rendered result, not the raw response. Confirm the UI displays the right data in the right state. |
| "I don't need to click through it." | If the task changes interaction, completion requires operating the interaction through the visible UI. |
| "Responsive CSS should handle mobile." | Responsive intent is not evidence. Check at the relevant viewport sizes. |

## Verification

A frontend or full-stack task is not done until browser verification produces evidence for the relevant flow.

Minimum exit checklist:

- [ ] App opened in a real browser at the relevant route
- [ ] Primary user journey completed through visible UI operations
- [ ] Expected visible content, route changes, and functional results confirmed
- [ ] Console checked for errors and relevant warnings
- [ ] Network requests checked when the flow depends on APIs
- [ ] Screenshot or visual inspection confirmed no obvious layout defects
- [ ] Responsive checks completed for user-facing layouts
- [ ] Any discovered issue fixed and re-verified, or explicitly reported as remaining risk

## Report Format

Present concise evidence:

```markdown
Browser verification:
- Route/view tested: [route]
- User flow: [steps completed]
- Result: Pass/Fail
- Evidence: [screenshot/DOM/console/network summary]
- Issues found: [fixed items or remaining risks]
- Responsive checks: [viewports tested]
```

Avoid vague claims such as "looks good" without naming what was checked.

## Red Flags

Stop and verify in the browser if you catch yourself saying:

- "Tests pass, so the UI should work"
- "The component code looks correct"
- "I can infer the layout from CSS"
- "The API returned data, so the page is fine"
- "I don't need to click through the flow"
- "Mobile should be okay because the CSS is responsive"

These are assumptions. Replace them with browser evidence.
