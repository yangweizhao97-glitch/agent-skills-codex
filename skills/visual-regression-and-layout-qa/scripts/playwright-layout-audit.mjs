#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";

function parseArgs(argv) {
  const args = {
    out: "evidence/layout-qa",
    viewports: "320x640,390x844,768x1024,1440x900",
    wait: "500"
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg.startsWith("--")) {
      const key = arg.slice(2);
      const next = argv[index + 1];
      if (!next || next.startsWith("--")) {
        args[key] = "true";
      } else {
        args[key] = next;
        index += 1;
      }
    }
  }

  return args;
}

function parseViewports(value) {
  return value.split(",").map((item) => {
    const [width, height] = item.split("x").map((part) => Number.parseInt(part, 10));
    if (!Number.isFinite(width) || !Number.isFinite(height)) {
      throw new Error(`Invalid viewport: ${item}`);
    }
    return { width, height, name: `${width}x${height}` };
  });
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (!args.url) {
    throw new Error("Missing --url. Example: node playwright-layout-audit.mjs --url http://127.0.0.1:3000");
  }

  const { chromium } = await import("playwright");
  const outDir = path.resolve(args.out);
  const waitMs = Number.parseInt(args.wait, 10);
  const viewports = parseViewports(args.viewports);
  await mkdir(outDir, { recursive: true });

  const browser = await chromium.launch();
  const results = [];

  for (const viewport of viewports) {
    const page = await browser.newPage({ viewport: { width: viewport.width, height: viewport.height } });
    const consoleEntries = [];

    page.on("console", (message) => {
      const type = message.type();
      if (["error", "warning"].includes(type)) {
        consoleEntries.push({ type, text: message.text() });
      }
    });
    page.on("pageerror", (error) => {
      consoleEntries.push({ type: "pageerror", text: error.message });
    });

    await page.goto(args.url, { waitUntil: "networkidle" });
    if (Number.isFinite(waitMs) && waitMs > 0) {
      await page.waitForTimeout(waitMs);
    }

    const audit = await page.evaluate(() => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const selectors = [
        "button",
        "a[href]",
        "input:not([type='hidden'])",
        "select",
        "textarea",
        "[role='button']",
        "[tabindex]:not([tabindex='-1'])"
      ].join(",");

      function rectFor(element) {
        const rect = element.getBoundingClientRect();
        return {
          x: Math.round(rect.x),
          y: Math.round(rect.y),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          right: Math.round(rect.right),
          bottom: Math.round(rect.bottom)
        };
      }

      function visible(element) {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.visibility !== "hidden" &&
          style.display !== "none" &&
          Number.parseFloat(style.opacity || "1") > 0.01 &&
          rect.width > 0 &&
          rect.height > 0
        );
      }

      function labelFor(element) {
        return (
          element.getAttribute("aria-label") ||
          element.getAttribute("title") ||
          element.textContent?.trim().slice(0, 80) ||
          element.getAttribute("name") ||
          element.id ||
          element.tagName.toLowerCase()
        );
      }

      function overlaps(a, b) {
        return a.left < b.right && a.right > b.left && a.top < b.bottom && a.bottom > b.top;
      }

      const interactive = Array.from(document.querySelectorAll(selectors)).filter(visible);
      const smallTouchTargets = interactive
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.width < 44 || rect.height < 44)
        .map(({ element }) => ({ label: labelFor(element), tag: element.tagName.toLowerCase(), rect: rectFor(element) }));

      const interactiveOverlaps = [];
      for (let i = 0; i < interactive.length; i += 1) {
        for (let j = i + 1; j < interactive.length; j += 1) {
          const first = interactive[i].getBoundingClientRect();
          const second = interactive[j].getBoundingClientRect();
          const area = Math.min(first.right, second.right) - Math.max(first.left, second.left);
          const height = Math.min(first.bottom, second.bottom) - Math.max(first.top, second.top);
          if (overlaps(first, second) && area * height > 16) {
            interactiveOverlaps.push({
              first: labelFor(interactive[i]),
              second: labelFor(interactive[j]),
              firstRect: rectFor(interactive[i]),
              secondRect: rectFor(interactive[j])
            });
          }
        }
      }

      const overlaySelectors = [
        "[role='dialog']",
        "[role='menu']",
        "[popover]",
        ".modal",
        ".popover",
        ".dropdown",
        ".tooltip"
      ].join(",");

      const positionSelectors = ["[style*='position: fixed']", "[style*='position: sticky']", overlaySelectors].join(",");
      const viewportClipping = Array.from(document.querySelectorAll(positionSelectors))
        .filter(visible)
        .map((element) => ({ element, rect: element.getBoundingClientRect() }))
        .filter(({ rect }) => rect.left < 0 || rect.top < 0 || rect.right > viewportWidth || rect.bottom > viewportHeight)
        .map(({ element }) => ({ label: labelFor(element), tag: element.tagName.toLowerCase(), rect: rectFor(element) }));

      return {
        url: window.location.href,
        viewport: { width: viewportWidth, height: viewportHeight },
        documentHorizontalOverflow: document.documentElement.scrollWidth > viewportWidth + 1,
        documentWidth: document.documentElement.scrollWidth,
        viewportWidth,
        smallTouchTargets,
        interactiveOverlaps,
        viewportClipping
      };
    });

    const screenshot = path.join(outDir, `${viewport.name}.png`);
    await page.screenshot({ path: screenshot, fullPage: true });
    results.push({ viewport: viewport.name, screenshot, consoleEntries, audit });
    await page.close();
  }

  await browser.close();

  const reportPath = path.join(outDir, "layout-audit.json");
  await writeFile(reportPath, `${JSON.stringify(results, null, 2)}\n`);

  const failures = results.flatMap((result) => {
    const issues = [];
    if (result.audit.documentHorizontalOverflow) issues.push("documentHorizontalOverflow");
    if (result.audit.smallTouchTargets.length) issues.push("smallTouchTargets");
    if (result.audit.interactiveOverlaps.length) issues.push("interactiveOverlaps");
    if (result.audit.viewportClipping.length) issues.push("viewportClipping");
    if (result.consoleEntries.length) issues.push("consoleEntries");
    return issues.map((issue) => `${result.viewport}: ${issue}`);
  });

  console.log(`Layout audit written to ${reportPath}`);
  if (failures.length) {
    console.error(`Layout audit found ${failures.length} issue group(s):`);
    for (const failure of failures) console.error(`- ${failure}`);
    process.exitCode = 1;
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

