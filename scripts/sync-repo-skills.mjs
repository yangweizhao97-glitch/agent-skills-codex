#!/usr/bin/env node
import { cp, mkdir, rm } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "skills");
const target = path.join(root, ".agents", "skills");

await mkdir(path.dirname(target), { recursive: true });
await rm(target, { recursive: true, force: true });
await cp(source, target, { recursive: true });
console.log(`Synced ${path.relative(root, source)} -> ${path.relative(root, target)}`);

