#!/usr/bin/env node
/**
 * brand-lock.js — Presentable brand compliance validator
 *
 * Usage:
 *   node brand-lock.js <deck.html> [--lock brand.lock]   # validate a deck
 *   node brand-lock.js --init <deck.html>                 # generate brand.lock from deck's :root
 *   node brand-lock.js --init                             # generate blank brand.lock template
 *
 * Exit codes: 0 = clean, 1 = violations found, 2 = configuration error
 *
 * What it catches:
 *   - Hardcoded hex/rgb colors in inline style attributes that aren't in the palette
 *   - Colors in the palette but hardcoded (should use a CSS variable instead)
 *   - Inline font-family values that aren't in the approved font list
 *   - <style> blocks written directly inside a slide section
 *
 * What it intentionally skips:
 *   - The main <style> block (component CSS is fine to read directly)
 *   - data-chart attributes (Chart.js JSON can't reference CSS variables)
 *   - transparent / rgba(0,0,0,0) / inherit / currentColor / var(--token)
 */

'use strict';
const fs   = require('fs');
const path = require('path');

// ── CLI args ──────────────────────────────────────────────────────────────────
const args  = process.argv.slice(2);
const flags = {};
let deckFile = null;

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key  = args[i].slice(2);
    const next = args[i + 1];
    flags[key] = (next && !next.startsWith('--')) ? args[++i] : true;
  } else if (!deckFile) {
    deckFile = args[i];
  }
}

if (!deckFile && !flags.init) {
  process.stderr.write([
    'Usage:',
    '  node brand-lock.js <deck.html> [--lock brand.lock]   validate',
    '  node brand-lock.js --init <deck.html>                generate brand.lock from :root',
    '  node brand-lock.js --init                            generate blank template',
    '',
    'npm alias:  npm run brand-check -- enterprise/deck.html',
  ].join('\n') + '\n');
  process.exit(2);
}

// ── Color helpers ─────────────────────────────────────────────────────────────
function hexToRgb(hex) {
  const h = hex.replace('#', '');
  if (h.length === 3) return [parseInt(h[0]+h[0],16), parseInt(h[1]+h[1],16), parseInt(h[2]+h[2],16)];
  return [parseInt(h.slice(0,2),16), parseInt(h.slice(2,4),16), parseInt(h.slice(4,6),16)];
}
function rgbToHex(r, g, b) {
  return '#' + [r,g,b].map(v => Math.round(+v).toString(16).padStart(2,'0')).join('');
}
function normaliseHex(hex) {
  return hex.toLowerCase().replace(/^#([0-9a-f])([0-9a-f])([0-9a-f])$/, '#$1$1$2$2$3$3');
}
function colorDist(a, b) {
  const [r1,g1,b1] = hexToRgb(a), [r2,g2,b2] = hexToRgb(b);
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2);
}
// Euclidean RGB distance — 25 allows for minor alpha-composited shade variants
const PALETTE_TOL = 25;

function parseHardcodedColor(value) {
  const v = value.trim().toLowerCase();
  // Anything using a CSS variable or a non-color keyword → skip
  if (/^(transparent|inherit|initial|unset|currentcolor|none|auto)/.test(v)) return null;
  if (/var\s*\(/.test(v)) return null;
  // Skip fully transparent rgba
  if (/rgba?\(\s*\d+[,\s]+\d+[,\s]+\d+[,\s]+0\s*\)/.test(v)) return null;

  const hexM = v.match(/^(#[0-9a-f]{3,6})/);
  if (hexM) return normaliseHex(hexM[1]);
  const rgbM = v.match(/rgba?\(\s*(\d+)[,\s]+(\d+)[,\s]+(\d+)/);
  if (rgbM) return rgbToHex(...rgbM.slice(1,4));
  return null;
}

// ── Style attribute parsing ───────────────────────────────────────────────────
function parseInlineStyle(attr) {
  const props = {};
  for (const decl of attr.split(';')) {
    const i = decl.indexOf(':');
    if (i < 0) continue;
    props[decl.slice(0,i).trim().toLowerCase()] = decl.slice(i+1).trim();
  }
  return props;
}

const COLOR_PROPS = new Set([
  'color','background','background-color','border','border-color',
  'border-top','border-right','border-bottom','border-left',
  'outline','fill','stroke','box-shadow','text-shadow'
]);
const SYSTEM_FONTS = new Set([
  'system-ui','-apple-system','blinkmacsystemfont','segoe ui','helvetica neue',
  'arial','helvetica','georgia','times new roman','sans-serif','serif',
  'monospace','cursive','fantasy','inherit','initial','unset','auto'
]);

// ── :root token extractor (used by --init) ────────────────────────────────────
function extractRootTokens(cssText) {
  const m = cssText.match(/:root\s*\{([^}]+)\}/);
  if (!m) return {};
  const tokens = {};
  for (const t of m[1].matchAll(/--([a-z0-9-]+)\s*:\s*([^;]+);/g)) {
    tokens['--'+t[1]] = t[2].trim();
  }
  return tokens;
}

function primaryFontName(value) {
  // "'Fraunces', Georgia, serif" → "Fraunces"
  const m = value.match(/^'([^']+)'/) || value.match(/^"([^"]+)"/) || value.match(/^([^,'"()\s][^,()'"]*)/) ;
  return m ? m[1].trim() : value.trim();
}

function tokensToLock(tokens, name) {
  const get = k => primaryFontName(tokens[k] || '');
  const fonts   = ['--font-display','--font-body','--font-mono'].map(get).filter(Boolean);
  const accent  = tokens['--accent'] ? normaliseHex(tokens['--accent']) : '';
  const palette = [...new Set(
    Object.values(tokens).flatMap(v => (v.match(/#[0-9a-fA-F]{6}/g) || [])).map(normaliseHex)
  )];
  return { name: name || 'Brand', locked_at: new Date().toISOString().slice(0,10), fonts, accent, palette };
}

// ── --init ────────────────────────────────────────────────────────────────────
if (flags.init !== undefined) {
  // Support: --init deck.html (where deck.html landed in flags.init)
  // or:      deck.html --init (where it landed in deckFile)
  const src = typeof flags.init === 'string' ? flags.init : deckFile || null;
  let lock;

  if (src) {
    if (!fs.existsSync(src)) { process.stderr.write(`File not found: ${src}\n`); process.exit(2); }
    const html   = fs.readFileSync(src, 'utf8');
    const styleM = html.match(/<style>([\s\S]*?)<\/style>/);
    if (!styleM) { process.stderr.write('No <style> block found.\n'); process.exit(2); }
    lock = tokensToLock(extractRootTokens(styleM[1]), path.basename(src, '.html'));
  } else {
    lock = {
      name: 'Brand',
      locked_at: new Date().toISOString().slice(0,10),
      fonts: ['Display Font', 'Body Font', 'JetBrains Mono'],
      accent: '#000000',
      palette: ['#000000','#ffffff']
    };
  }

  const json    = JSON.stringify(lock, null, 2) + '\n';
  const outFile = typeof flags.out === 'string' ? flags.out : 'brand.lock';

  if (fs.existsSync(outFile)) {
    process.stderr.write(`${outFile} already exists — writing to stdout instead. Use --out <path> to override.\n`);
    process.stdout.write(json);
  } else {
    fs.writeFileSync(outFile, json);
    process.stderr.write(`✓ Written ${outFile}`);
    if (src) process.stderr.write(` (from ${src})`);
    process.stderr.write('\n');
    if (!src) process.stderr.write('  Edit fonts, accent, and palette before committing.\n');
  }
  process.exit(0);
}

// ── Validate ──────────────────────────────────────────────────────────────────
const lockFile = typeof flags.lock === 'string' ? flags.lock : 'brand.lock';

if (!fs.existsSync(lockFile)) {
  process.stderr.write([
    `No brand.lock found at "${lockFile}".`,
    `Generate one with:  node brand-lock.js --init ${deckFile || 'enterprise/deck.html'}`,
  ].join('\n') + '\n');
  process.exit(2);
}
if (!fs.existsSync(deckFile)) {
  process.stderr.write(`Deck not found: ${deckFile}\n`); process.exit(2);
}

const lock = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
const html  = fs.readFileSync(deckFile, 'utf8');

const allowedFonts  = (lock.fonts   || []).map(f => f.toLowerCase());
const normPalette   = (lock.palette || []).map(normaliseHex);

const violations = [];
const warnings   = [];

// Strip the main <style> block so we only lint slide content
const bodyHtml = html.replace(/<style>[\s\S]*?<\/style>/i, '');

// Walk each slide
const slideRe = /<section[^>]*class="[^"]*\bslide\b[^"]*"[^>]*>([\s\S]*?)<\/section>/g;
let slideIdx = 0, slideM;

while ((slideM = slideRe.exec(bodyHtml)) !== null) {
  slideIdx++;
  const raw = slideM[1];

  // ── <style> blocks inside a slide (Claude occasionally adds these) ──
  if (/<style[\s>]/i.test(raw)) {
    violations.push({
      slide: slideIdx, type: 'style-block', prop: '<style>', value: '',
      detail: '<style> block inside a slide can override brand tokens — move rules to the main <style> block'
    });
  }

  // Strip data-chart JSON (Chart.js data; cannot use CSS vars)
  const slideHtml = raw
    .replace(/data-chart='[^']*'/g, '')
    .replace(/data-chart="[^"]*"/g, '');

  // ── Inline style attributes ──
  // Match full opening tags so we can read the element's class list for exceptions
  const styleAttrRe = /<[a-z][^<>]*\bstyle="([^"]*)"[^<>]*>/gi;
  let styleM2;
  while ((styleM2 = styleAttrRe.exec(slideHtml)) !== null) {
    const fullTag = styleM2[0];
    // Skip chart legend swatches — their hardcoded background colors are intentional visual keys
    const classMatch = fullTag.match(/\bclass="([^"]*)"/);
    const classes    = classMatch ? classMatch[1].split(/\s+/) : [];
    if (classes.includes('swatch')) continue;

    const props = parseInlineStyle(styleM2[1]);

    // Color properties
    for (const [prop, rawVal] of Object.entries(props)) {
      if (!COLOR_PROPS.has(prop)) continue;
      if (/var\s*\(/.test(rawVal)) continue; // CSS variable → fine

      const hex = parseHardcodedColor(rawVal);
      if (!hex) continue;

      if (normPalette.length === 0) {
        warnings.push({ slide: slideIdx, type: 'color', prop, value: rawVal,
          detail: `Hardcoded ${hex} — define a palette in brand.lock to validate` });
        continue;
      }

      const best = normPalette.reduce((a, p) => {
        const d = colorDist(hex, p); return d < a.d ? { p, d } : a;
      }, { p: normPalette[0], d: Infinity });

      if (best.d > PALETTE_TOL) {
        violations.push({ slide: slideIdx, type: 'color', prop, value: rawVal,
          detail: `${hex} is not in the brand palette (closest: ${best.p}, Δ${Math.round(best.d)})` });
      } else {
        warnings.push({ slide: slideIdx, type: 'color', prop, value: rawVal,
          detail: `${hex} is a palette color but hardcoded — replace with var(--token)` });
      }
    }

    // Font-family
    const rawFont = props['font-family'] || '';
    if (rawFont && !/var\s*\(/.test(rawFont)) {
      const primary = rawFont.split(',').map(f => f.trim().replace(/^['"]|['"]$/g,'').trim())
        .find(f => !SYSTEM_FONTS.has(f.toLowerCase()));
      if (primary && allowedFonts.length > 0) {
        const approved = allowedFonts.some(af =>
          primary.toLowerCase().includes(af) || af.includes(primary.toLowerCase())
        );
        if (!approved) {
          violations.push({ slide: slideIdx, type: 'font', prop: 'font-family', value: primary,
            detail: `"${primary}" not in approved fonts [${lock.fonts.join(', ')}] — use var(--font-display/body/mono)` });
        }
      }
    }
  }
}

// ── Report ────────────────────────────────────────────────────────────────────
const line   = '─'.repeat(58);
const v = violations.length, w = warnings.length;
const status = v === 0 ? '✓ PASS' : `✗ FAIL  (${v} violation${v!==1?'s':''})`;

process.stdout.write(`
  Brand Lock · ${path.basename(deckFile)}
  Lock: ${lock.name || 'unnamed'} · ${(lock.fonts||[]).length} fonts · ${normPalette.length} palette colors
  ${line}

  ${status}${w > 0 ? `  +  ${w} warning${w!==1?'s':''}` : ''}
`);

if (v > 0) {
  process.stdout.write(`\n  VIOLATIONS — fix before finalising:\n\n`);
  for (const x of violations) {
    process.stdout.write(`    Slide ${String(x.slide).padStart(2,'0')}  [${x.type}]  ${x.prop}${x.value ? ': ' + x.value : ''}\n`);
    process.stdout.write(`           → ${x.detail}\n\n`);
  }
}
if (w > 0) {
  process.stdout.write(`  WARNINGS — should fix (right colour, wrong method):\n\n`);
  for (const x of warnings) {
    process.stdout.write(`    Slide ${String(x.slide).padStart(2,'0')}  [${x.type}]  ${x.prop}: ${x.value}\n`);
    process.stdout.write(`           → ${x.detail}\n\n`);
  }
}

process.stdout.write('\n');
process.exit(v > 0 ? 1 : 0);
