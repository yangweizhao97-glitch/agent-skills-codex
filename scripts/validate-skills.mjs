#!/usr/bin/env node
import { readdir, readFile, stat } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const skillsDir = path.join(root, "skills");
const requiredWorkflowSections = ["## When to Use", "## Verification"];
const recommendedWorkflowSections = ["## Common Rationalizations"];
const coreSkillsRequiringOpenAIYaml = new Set([
  "backend-reliability-review",
  "browser-ui-verification",
  "code-review-and-quality",
  "frontend-ui-engineering",
  "test-driven-development",
  "visual-regression-and-layout-qa"
]);

const errors = [];
const warnings = [];

function addError(message) {
  errors.push(message);
}

function addWarning(message) {
  warnings.push(message);
}

function parseFrontmatter(source, filePath) {
  if (!source.startsWith("---\n")) {
    addError(`${filePath}: missing YAML frontmatter`);
    return {};
  }

  const end = source.indexOf("\n---", 4);
  if (end === -1) {
    addError(`${filePath}: unclosed YAML frontmatter`);
    return {};
  }

  const frontmatter = source.slice(4, end).trim();
  const result = {};
  for (const line of frontmatter.split("\n")) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    const [, key, rawValue] = match;
    result[key] = rawValue.replace(/^["']|["']$/g, "").trim();
  }
  return result;
}

async function exists(filePath) {
  try {
    await stat(filePath);
    return true;
  } catch {
    return false;
  }
}

async function findFiles(dir, predicate, results = []) {
  const entries = await readdir(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      if (entry.name === ".git" || entry.name === "node_modules") continue;
      await findFiles(fullPath, predicate, results);
    } else if (predicate(fullPath)) {
      results.push(fullPath);
    }
  }
  return results;
}

async function main() {
  const dsStoreFiles = await findFiles(root, (filePath) => path.basename(filePath) === ".DS_Store");
  for (const filePath of dsStoreFiles) {
    addError(`forbidden .DS_Store file: ${path.relative(root, filePath)}`);
  }

  const pluginManifest = path.join(root, ".codex-plugin", "plugin.json");
  if (await exists(pluginManifest)) {
    try {
      const manifest = JSON.parse(await readFile(pluginManifest, "utf8"));
      if (!manifest.name) addError(".codex-plugin/plugin.json: missing name");
      if (!manifest.version) addError(".codex-plugin/plugin.json: missing version");
      if (!manifest.description) addError(".codex-plugin/plugin.json: missing description");
      if (manifest.skills !== "./skills/") addError('.codex-plugin/plugin.json: expected "skills": "./skills/"');
    } catch (error) {
      addError(`.codex-plugin/plugin.json: invalid JSON (${error.message})`);
    }
  } else {
    addWarning(".codex-plugin/plugin.json is missing; plugin distribution is not configured");
  }

  const skillEntries = await readdir(skillsDir, { withFileTypes: true });
  const names = new Map();

  for (const entry of skillEntries) {
    if (!entry.isDirectory()) continue;

    const skillName = entry.name;
    const skillPath = path.join(skillsDir, skillName);
    const skillFile = path.join(skillPath, "SKILL.md");
    const relativeSkillFile = path.relative(root, skillFile);

    if (!(await exists(skillFile))) {
      addError(`${path.relative(root, skillPath)}: missing SKILL.md`);
      continue;
    }

    const source = await readFile(skillFile, "utf8");
    const metadata = parseFrontmatter(source, relativeSkillFile);

    if (!metadata.name) {
      addError(`${relativeSkillFile}: missing frontmatter name`);
    } else if (metadata.name !== skillName) {
      addError(`${relativeSkillFile}: name "${metadata.name}" does not match directory "${skillName}"`);
    }

    if (metadata.name) {
      if (names.has(metadata.name)) {
        addError(`${relativeSkillFile}: duplicate skill name "${metadata.name}" also used by ${names.get(metadata.name)}`);
      } else {
        names.set(metadata.name, relativeSkillFile);
      }
    }

    if (!metadata.description) {
      addError(`${relativeSkillFile}: missing frontmatter description`);
    } else {
      if (metadata.description.length < 80) {
        addWarning(`${relativeSkillFile}: description is short; implicit trigger quality may be weak`);
      }
      if (!/\bUse when\b|\bUse after\b|\bUse to\b|\bUse for\b/i.test(metadata.description)) {
        addWarning(`${relativeSkillFile}: description should include explicit trigger language such as "Use when"`);
      }
    }

    for (const section of requiredWorkflowSections) {
      if (!source.includes(section)) {
        addError(`${relativeSkillFile}: missing required section "${section}"`);
      }
    }

    for (const section of recommendedWorkflowSections) {
      if (!source.includes(section)) {
        addWarning(`${relativeSkillFile}: missing recommended section "${section}"`);
      }
    }

    if (source.length > 25_000) {
      addWarning(`${relativeSkillFile}: large SKILL.md; consider moving details into references for progressive disclosure`);
    }

    if (coreSkillsRequiringOpenAIYaml.has(skillName)) {
      const openAIYaml = path.join(skillPath, "agents", "openai.yaml");
      if (!(await exists(openAIYaml))) {
        addError(`${relativeSkillFile}: core skill missing agents/openai.yaml`);
      }
    }
  }

  for (const warning of warnings) {
    console.warn(`Warning: ${warning}`);
  }

  if (errors.length) {
    for (const error of errors) {
      console.error(`Error: ${error}`);
    }
    console.error(`\nSkill validation failed: ${errors.length} error(s), ${warnings.length} warning(s).`);
    process.exit(1);
  }

  console.log(`Skill validation passed: ${names.size} skill(s), ${warnings.length} warning(s).`);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
