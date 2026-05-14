#!/usr/bin/env node
/**
 * export-pdf.js — Headless PDF exporter for the slides framework.
 *
 * Usage:
 *   node export-pdf.js <path/to/deck.html> [output.pdf]
 *
 * What it does:
 *   1. Launches headless Chromium via Playwright.
 *   2. Loads the deck with ?pdf=1 (which disables Chart.js animations
 *      so the export is deterministic).
 *   3. Waits for fonts and any Chart.js charts to render.
 *   4. Switches the rendering context to print media — your existing
 *      `@media print` CSS does the rest: every <section class="slide">
 *      becomes its own 13.333in × 7.5in landscape page.
 *   5. Resizes all charts so they re-fit their now-visible parents,
 *      then writes the PDF.
 *
 * Why this exists:
 *   Browser `window.print()` works for casual use, but its output varies
 *   by browser, by OS, by user margin settings, and it routinely strips
 *   background colors. Playwright gives one canonical, scriptable output
 *   that you can wire into CI, publish artifacts, or run from a build step.
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

function fmtMs(ms) {
  return ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`;
}

async function main() {
  const argv = process.argv.slice(2);
  if (argv.length === 0 || argv.includes('--help') || argv.includes('-h')) {
    console.log('Usage:  node export-pdf.js <input.html> [output.pdf]');
    console.log('        node export-pdf.js deck.html');
    console.log('        node export-pdf.js examples/business-case.html out/case.pdf');
    process.exit(argv.length === 0 ? 1 : 0);
  }

  const inputPath = path.resolve(argv[0]);
  if (!fs.existsSync(inputPath)) {
    console.error(`✗ File not found: ${inputPath}`);
    process.exit(1);
  }
  const outputPath = argv[1]
    ? path.resolve(argv[1])
    : inputPath.replace(/\.html?$/i, '.pdf');

  // Ensure output directory exists
  const outDir = path.dirname(outputPath);
  if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });

  const t0 = Date.now();
  console.log(`→ Input:  ${path.relative(process.cwd(), inputPath)}`);
  console.log(`→ Output: ${path.relative(process.cwd(), outputPath)}`);

  console.log(`→ Launching headless Chromium…`);
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1280, height: 720 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Bubble browser console errors up to our terminal
  page.on('pageerror', (err) => console.error('  [page error]', err.message));
  page.on('console', (msg) => {
    if (msg.type() === 'error') console.error('  [console]', msg.text());
  });

  const url = `file://${inputPath}?pdf=1`;
  console.log(`→ Loading deck…`);
  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });

  console.log(`→ Waiting for fonts…`);
  await page.evaluate(() => document.fonts.ready);

  // Switch to print emulation — this triggers our @media print CSS,
  // which (a) forces every slide to display:flex and (b) page-breaks
  // them. Critically, this also gives canvases inside previously-hidden
  // slides real dimensions, so Chart.js can render them properly.
  console.log(`→ Emulating print media…`);
  await page.emulateMedia({ media: 'print' });

  // Resize all Chart.js instances so they pick up their now-real
  // parent dimensions, then give the browser a moment to paint.
  console.log(`→ Rendering charts…`);
  await page.evaluate(() => {
    if (typeof window.__renderCharts === 'function') {
      window.__renderCharts();
    }
  });
  await page.waitForTimeout(600);

  console.log(`→ Writing PDF…`);
  await page.pdf({
    path: outputPath,
    width: '13.333in',
    height: '7.5in',
    printBackground: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 },
    preferCSSPageSize: true,
  });

  await browser.close();

  const sizeKb = (fs.statSync(outputPath).size / 1024).toFixed(1);
  const elapsed = fmtMs(Date.now() - t0);
  console.log(`✓ Done in ${elapsed} — ${sizeKb} KB`);
}

main().catch((err) => {
  console.error('✗ Error:', err.message);
  if (err.stack) console.error(err.stack);
  process.exit(1);
});
