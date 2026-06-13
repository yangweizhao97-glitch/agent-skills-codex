---
name: visual-regression-and-layout-qa
description: Audits rendered UI for visual regressions and layout defects. Use after frontend or full-stack changes when buttons, cards, forms, tables, navigation, modals, sticky elements, responsive layouts, screenshots, text wrapping, overflow, z-index, or visual polish could affect whether the UI is acceptable.
---

# Visual Regression and Layout QA

## Overview

Catch the visual bugs AI agents miss when they only inspect source code: overlapping buttons, clipped labels, horizontal scrolling, broken mobile layouts, hidden controls, bad z-index, layout shifts, and states that look acceptable only on one viewport.

Use this with `browser-ui-verification`. That skill proves the user journey; this skill proves the rendered layout is visually sound across states and viewports.

## When to Use

- Building or modifying user-facing pages, dashboards, forms, cards, tables, modals, drawers, nav bars, sticky headers, or toolbars
- Changing CSS, design tokens, responsive breakpoints, typography, icons, animations, images, or layout primitives
- Adding generated UI where AI may have used absolute positioning, decorative layers, large cards, or generic responsive CSS
- Fixing visual issues such as overlap, overflow, clipping, invisible content, or mobile breakage
- Before claiming completion for any frontend or full-stack feature with visible UI

Do not use for backend-only, CLI-only, or non-rendered library changes.

## Core Workflow

### 1. Define the Visual Surfaces

List the pages, routes, components, and states that must be visually correct.

Include:

- Primary route and any changed subroutes
- Loading, empty, error, success, and validation states when reachable
- Open states for menus, modals, popovers, drawers, date pickers, select menus, and tooltips
- Data-heavy states such as long names, long emails, many table columns, empty results, and pagination
- Authenticated and unauthenticated states when the UI changes after login

### 2. Test Realistic Content

Do not verify only short happy-path text. Use content that stresses layout:

- Long button labels
- Long unbroken words, emails, file names, URLs, company names, and user names
- Multiple rows in lists and tables
- Empty and single-item datasets
- Error messages that wrap
- Images before and after load

If test data is not already available, create local seed/demo data that exercises these cases without changing production data.

### 3. Run Multi-Viewport Browser Checks

Default viewport set:

| Target | Size |
|---|---:|
| Narrow mobile | 320 x 640 |
| Mobile | 390 x 844 |
| Tablet | 768 x 1024 |
| Desktop | 1440 x 900 |

For each relevant route/state:

1. Open the page in a real browser.
2. Capture a screenshot.
3. Check console errors and warnings.
4. Check for horizontal document scrolling.
5. Check critical buttons and controls for clipping or overlap.
6. Open overlays and verify they are not clipped by the viewport.
7. Tab through the page and confirm focus is visible and not hidden behind sticky elements.

If the product defines other breakpoints, use those too.

### 4. Run the Layout Audit Script

This skill includes a Playwright helper:

```bash
node skills/visual-regression-and-layout-qa/scripts/playwright-layout-audit.mjs --url http://127.0.0.1:3000 --out evidence/layout-qa
```

Options:

```text
--url       Required app URL or route
--out       Output directory for screenshots and JSON report
--viewports Optional comma-separated viewports, e.g. 390x844,768x1024,1440x900
--wait      Optional wait time in ms after navigation, default 500
```

Run it from the project under test. If Playwright is not installed, install or use the project's existing browser tool. If no browser automation is available, do manual browser verification and explicitly report that the script could not be run.

### 5. Inspect the Report

Treat these as failures unless the product intentionally allows them:

- `documentHorizontalOverflow`: page width exceeds viewport width
- `smallTouchTargets`: buttons, links, inputs, selects, and textareas smaller than 44 x 44 CSS pixels
- `interactiveOverlaps`: clickable controls whose bounding boxes overlap another clickable control
- `viewportClipping`: fixed, sticky, dialog, menu, popover, or tooltip elements outside the viewport
- `consoleErrors`: uncaught exceptions, hydration errors, failed resources, CORS errors, framework warnings

Review screenshots even when the JSON report is clean. Automated checks do not understand visual quality, hierarchy, color, or whether a layout feels intentional.

### 6. Fix and Re-Run

When a defect appears:

1. Save the screenshot/report as evidence.
2. Identify whether the cause is layout constraints, text wrapping, z-index, positioning, responsive breakpoint, dynamic data, or async loading.
3. Fix source code.
4. Rebuild/reload.
5. Re-run the same viewport and state.

Do not mark the task complete while known visual defects remain unless the user explicitly accepts them.

## Layout Guardrails

- Prefer normal flow, grid, and flexbox over absolute positioning for primary layout.
- Give fixed-format UI stable dimensions with `min-width`, `max-width`, `min-height`, `aspect-ratio`, or grid tracks.
- Buttons must survive the longest expected label without text escaping their bounds.
- Icon-only controls must have fixed square dimensions and accessible names.
- Sticky and fixed elements must not hide focused content, form fields, or page anchors.
- Cards, rows, and toolbar items must wrap or stack intentionally at narrow widths.
- Data tables may scroll horizontally inside a contained region, but the document itself should not.
- Images, videos, charts, and canvases need explicit dimensions or aspect ratio to prevent layout shift.
- Avoid decorative layers that can sit above controls. If decoration is present, set `pointer-events: none` when appropriate.

## Common Rationalizations

| Rationalization | Reality |
|---|---|
| "The CSS is responsive, so mobile is fine." | Responsive intent is not evidence. Mobile screenshots and overflow checks are evidence. |
| "I looked at the desktop screenshot." | Most overlap and clipping bugs appear at narrow widths or in open overlay states. |
| "The tests pass." | Unit tests do not render CSS, calculate layout, or expose z-index and text wrapping defects. |
| "The button text is short in the mock." | Real product text changes. Layout must survive realistic long content. |
| "It is only a prototype." | Prototype UI is often reused. Visual debt compounds quickly. |

## Red Flags

- Absolute positioning used for structural layout
- `width: 100vw` on elements inside padded containers
- Negative margins used to make layouts "fit"
- Text hidden with fixed heights and no overflow strategy
- Toolbars with many text buttons and no wrapping behavior
- Modals, popovers, or menus without viewport constraints
- Mobile CSS present but no mobile screenshot
- Evidence says "looks good" without screenshots, viewport sizes, or report output

## Verification

Before completion:

- [ ] Relevant routes, states, and overlays were listed
- [ ] Realistic long content was used or the limitation was named
- [ ] Mobile, tablet, and desktop viewports were checked
- [ ] Screenshots were captured for the important states
- [ ] Horizontal document overflow was checked
- [ ] Interactive overlap and touch target issues were checked
- [ ] Console errors/warnings were checked
- [ ] Any defect was fixed and re-verified, or explicitly reported as remaining risk

