#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    task: "frontend",
    evidence: "evidence"
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (!arg.startsWith("--")) continue;
    const key = arg.slice(2);
    const value = argv[index + 1];
    if (!value || value.startsWith("--")) {
      args[key] = "true";
    } else {
      args[key] = value;
      index += 1;
    }
  }

  return args;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function listFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      const nested = await listFiles(fullPath);
      files.push(...nested);
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

function relativeFiles(files, root) {
  return files.map((file) => path.relative(root, file));
}

function hasFile(files, pattern) {
  return files.some((file) => pattern.test(path.basename(file)) || pattern.test(file));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const task = args.task;
  const evidenceDir = path.resolve(args.evidence);
  const errors = [];
  const warnings = [];

  if (!["frontend", "fullstack", "backend"].includes(task)) {
    errors.push(`Unsupported --task "${task}". Use frontend, fullstack, or backend.`);
  }

  if (!(await exists(evidenceDir))) {
    errors.push(`Evidence directory does not exist: ${evidenceDir}`);
  }

  const files = (await exists(evidenceDir)) ? await listFiles(evidenceDir) : [];
  const relative = relativeFiles(files, evidenceDir);

  const completionReport = files.find((file) => path.basename(file) === "completion-report.md");
  if (!completionReport) {
    errors.push("Missing completion-report.md");
  }

  if (["frontend", "fullstack"].includes(task)) {
    if (!hasFile(relative, /desktop.*\.(png|jpe?g|webp)$/i)) {
      errors.push("Missing at least one desktop screenshot");
    }
    if (!hasFile(relative, /mobile.*\.(png|jpe?g|webp)$/i)) {
      errors.push("Missing at least one mobile screenshot");
    }
    if (!hasFile(relative, /^console-log\.txt$/i)) {
      errors.push("Missing console-log.txt");
    }
    if (!hasFile(relative, /^network-summary\.md$/i) && !hasFile(relative, /^no-network-dependency\.md$/i)) {
      errors.push("Missing network-summary.md or no-network-dependency.md");
    }
    if (!hasFile(relative, /^layout-audit\.json$/i) && !hasFile(relative, /^no-layout-risk\.md$/i)) {
      errors.push("Missing layout-audit.json or no-layout-risk.md");
    }
  }

  if (task === "backend") {
    if (!hasFile(relative, /reliability-review\.md$/i)) {
      errors.push("Missing reliability-review.md for backend task");
    }
  }

  if (completionReport) {
    const report = await readFile(completionReport, "utf8");
    const missingEvidence = errors.length > 0;
    if (missingEvidence && /\bDone\b/i.test(report)) {
      errors.push('completion-report.md says "Done" while required evidence is missing');
    }
    if (!/## Not Verified/i.test(report)) {
      warnings.push("completion-report.md should include a Not Verified section");
    }
  }

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }

  if (errors.length) {
    for (const error of errors) {
      console.error(`Error: ${error}`);
    }
    console.error(`\nEvidence check failed for ${task}: ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }

  console.log(`Evidence check passed for ${task}: ${relative.length} file(s), ${warnings.length} warning(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});

