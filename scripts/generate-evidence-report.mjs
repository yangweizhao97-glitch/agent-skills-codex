#!/usr/bin/env node
import { readdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const evidenceDir = path.resolve(process.argv[2] ?? "evidence");
const outputPath = path.resolve(process.argv[3] ?? path.join(evidenceDir, "completion-report.md"));

async function listFiles(dir) {
  try {
    return await readdir(dir);
  } catch {
    return [];
  }
}

const files = await listFiles(evidenceDir);
const screenshots = files.filter((file) => /\.(png|jpe?g|webp)$/i.test(file));
const consoleLog = files.find((file) => /console/i.test(file));
const networkSummary = files.find((file) => /network/i.test(file));
const layoutAudit = files.find((file) => /layout-audit\.json/i.test(file));

let layoutSummary = "Not provided";
if (layoutAudit) {
  try {
    const content = await readFile(path.join(evidenceDir, layoutAudit), "utf8");
    const parsed = JSON.parse(content);
    const issueCount = parsed.reduce((count, item) => {
      const audit = item.audit ?? {};
      return (
        count +
        (audit.documentHorizontalOverflow ? 1 : 0) +
        (audit.smallTouchTargets?.length ?? 0) +
        (audit.interactiveOverlaps?.length ?? 0) +
        (audit.viewportClipping?.length ?? 0) +
        (item.consoleEntries?.length ?? 0)
      );
    }, 0);
    layoutSummary = `${layoutAudit} (${issueCount} issue(s) reported)`;
  } catch {
    layoutSummary = `${layoutAudit} (could not parse)`;
  }
}

const report = `# Completion Report

## Changed

- ...

## Verification

- Unit tests:
- Integration/API tests:
- Typecheck:
- Lint:
- Build:
- Browser journey:
- Console: ${consoleLog ?? "Not provided"}
- Network: ${networkSummary ?? "Not provided"}
- Screenshots: ${screenshots.length ? screenshots.join(", ") : "Not provided"}
- Layout audit: ${layoutSummary}
- Responsive viewports:

## Evidence

${files.length ? files.map((file) => `- ${path.join(path.relative(path.dirname(outputPath), evidenceDir), file)}`).join("\n") : "- No evidence files found."}

## Risks

- ...

## Not Verified

- ...

## Completion Rule

If browser evidence is missing for frontend or full-stack work, write \`Not complete\` instead of \`Done\`.
`;

await writeFile(outputPath, report);
console.log(`Wrote ${outputPath}`);

