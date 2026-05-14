#!/usr/bin/env node
/**
 * csv-to-chart.js — CSV → Presentable chart HTML
 *
 * Usage:
 *   node csv-to-chart.js <file.csv> [options]
 *
 * Options:
 *   --chart     bar | column | line | waterfall | tornado | cost-benefit | cumulative | stat-grid
 *   --title     Slide title (action title, complete sentence)
 *   --eyebrow   Eyebrow label (e.g. "Revenue trajectory")
 *   --note      Chart note (appears below chart)
 *   --source    Source line text
 *   --stacked   Force stacked mode for column charts
 *
 * Expected CSV column layouts per chart type:
 *   bar          label, value  [, value2 …]
 *   column       period, series1, series2 …
 *   line         period, series1, series2 …
 *   waterfall    label, value              (first/last rows are totals)
 *   tornado      label, downside, upside   (downside values negative or positive, script normalises)
 *   cost-benefit label, col1, col2 …       (negative cols = costs, positive = benefits)
 *   cumulative   period, cumulative_value
 *   stat-grid    label, value [, delta, description]  (max 4 rows)
 *
 * Output is written to stdout — pipe or capture it.
 * Detection info is written to stderr so it doesn't pollute the HTML.
 *
 * Auto-detection fires when --chart is omitted:
 *   · 3 cols with down/up/low/high words → tornado
 *   · col name includes "cumul" → cumulative
 *   · cost+benefit words in col names → cost-benefit
 *   · period-like first col → line (2 series) or column (3+ series)
 *   · 2 cols, mixed +/-, bridge word in header → waterfall
 *   · 2 cols, all numeric → bar
 */

'use strict';

const fs   = require('fs');
const path = require('path');

// ─── CLI ──────────────────────────────────────────────────────────────────────
const args  = process.argv.slice(2);
const flags = {};
let csvFile = null;

for (let i = 0; i < args.length; i++) {
  if (args[i].startsWith('--')) {
    const key = args[i].slice(2);
    const next = args[i + 1];
    flags[key] = (next && !next.startsWith('--')) ? args[++i] : true;
  } else if (!csvFile) {
    csvFile = args[i];
  }
}

if (!csvFile) {
  process.stderr.write([
    'Usage: node csv-to-chart.js <file.csv> [--chart TYPE] [--title TEXT] [--eyebrow TEXT] [--note TEXT] [--source TEXT]',
    'Types: bar  column  line  waterfall  tornado  cost-benefit  cumulative  stat-grid',
  ].join('\n') + '\n');
  process.exit(1);
}

// ─── CSV parser ───────────────────────────────────────────────────────────────
function parseCSV(text) {
  return text.trim().split(/\r?\n/).map(line => {
    const cells = [];
    let inQ = false, cell = '';
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        if (inQ && line[i + 1] === '"') { cell += '"'; i++; }
        else { inQ = !inQ; }
      } else if (c === ',' && !inQ) { cells.push(cell.trim()); cell = ''; }
      else { cell += c; }
    }
    cells.push(cell.trim());
    return cells;
  });
}

// ─── Numeric helpers ──────────────────────────────────────────────────────────
const toNum   = v  => parseFloat(String(v).replace(/[$,%\s]/g, '')) || 0;
const isNum   = v  => v !== '' && !isNaN(toNum(v));
const roundUp = n  => { if (!n) return 100; const m = Math.pow(10, Math.floor(Math.log10(Math.abs(n)))); return Math.ceil(n / m) * m; };
const roundDn = n  => { if (!n) return -100; const m = Math.pow(10, Math.floor(Math.log10(Math.abs(n)))); return Math.floor(n / m) * m; };
const esc     = s  => String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/'/g,'&#39;');

function detectUnit(vals) {
  const s = vals.join(' ');
  if (s.includes('$')) return '$';
  if (s.includes('%')) return '%';
  return '';
}

// ─── Period detection ─────────────────────────────────────────────────────────
function isPeriodLike(v) {
  return /^\d{4}$/.test(v)
    || /^[QH][1-4]/i.test(v)
    || /^(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)/i.test(v)
    || /^Y\d+$/i.test(v)
    || /^(FY|CY)\d+/i.test(v)
    || /^(Yr|Year)\s*\d+/i.test(v);
}

// ─── Auto-detection ───────────────────────────────────────────────────────────
function detectChartType(headers, rows) {
  const ncols = headers.length;
  const h = headers.map(s => s.toLowerCase());

  if (ncols === 3) {
    const sensitivityRe = /down|up|low|high|pessim|optim|worst|best|adverse|favor|favou|min|max/i;
    if (sensitivityRe.test(h[1]) || sensitivityRe.test(h[2])) return 'tornado';
    const c2 = rows.map(r => toNum(r[1]));
    const c3 = rows.map(r => toNum(r[2]));
    if (c2.every(v => v <= 0) && c3.every(v => v >= 0)) return 'tornado';
  }

  if (h.some(x => x.includes('cumul'))) return 'cumulative';

  if (h.some(x => /cost|invest|spend|capex|opex/.test(x)) &&
      h.some(x => /benefit|revenue|saving|gain/.test(x))) return 'cost-benefit';

  if (ncols >= 2 && rows.length >= 2 && rows.every(r => isPeriodLike(r[0]))) {
    return ncols >= 3 ? 'column' : 'line';
  }

  if (ncols === 2) {
    const vals = rows.map(r => toNum(r[1]));
    if (vals.some(v => v < 0) && vals.some(v => v > 0) &&
        /value|delta|change|driver|bridge/i.test(h[1])) return 'waterfall';
    return 'bar';
  }

  return ncols >= 3 ? 'column' : 'bar';
}

// ─── Colour palette ───────────────────────────────────────────────────────────
const INK   = ['#0a0a0a', '#6a6a6a', '#9a9a9a', '#c4c4c4', '#2a2a2a', '#525252'];
const POS   = '#1f6b3e';
const NEG   = '#a02929';
const POS2  = '#7faf95';

// ─── Chart renderers ──────────────────────────────────────────────────────────

function renderBar(headers, rows, opts) {
  const labels = rows.map(r => r[0]);
  const isMulti = headers.length > 2;
  const unit    = detectUnit(rows.flatMap(r => r.slice(1)));

  let datasets, legend;

  if (isMulti) {
    datasets = headers.slice(1).map((name, i) => ({
      label: name,
      data: rows.map(r => toNum(r[i + 1])),
      backgroundColor: INK[i] || INK[3]
    }));
    legend = datasets.map((ds, i) =>
      `<div class="item"><span class="swatch" style="background:${INK[i] || INK[3]};"></span>${esc(ds.label)}</div>`
    ).join('\n          ');
  } else {
    const data = rows.map(r => toNum(r[1]));
    const maxAbs = Math.max(...data.map(Math.abs));
    datasets = [{ data, backgroundColor: data.map(v => v < 0 ? NEG : INK[0]) }];
    legend = `<div class="item"><span class="swatch" style="background:${INK[0]};"></span>${esc(headers[1])}</div>`;
    const allVals = data;
    const xMin = allVals.some(v => v < 0) ? -roundUp(maxAbs) : 0;
    return {
      config: {
        type: 'bar',
        data: { labels, datasets },
        options: { indexAxis: 'y', scales: { x: { min: xMin, max: roundUp(maxAbs), ticks: { callback_unit: unit } } } }
      },
      legend,
      note: opts.note || ''
    };
  }

  const allVals = rows.flatMap(r => r.slice(1).map(toNum));
  const xMax = roundUp(Math.max(...allVals));
  const xMin = allVals.some(v => v < 0) ? -roundUp(Math.max(...allVals.map(Math.abs))) : 0;

  return {
    config: {
      type: 'bar',
      data: { labels, datasets },
      options: { indexAxis: 'y', scales: { x: { min: xMin, max: xMax, ticks: { callback_unit: unit } } } }
    },
    legend,
    note: opts.note || ''
  };
}

function renderLine(headers, rows, opts) {
  const labels      = rows.map(r => r[0]);
  const seriesNames = headers.slice(1);
  const unit        = detectUnit(rows.flatMap(r => r.slice(1)));
  const allVals     = rows.flatMap(r => r.slice(1).map(toNum));
  const yMin        = roundDn(Math.min(...allVals));
  const yMax        = roundUp(Math.max(...allVals));

  const datasets = seriesNames.map((name, i) => ({
    label: name,
    data: rows.map(r => toNum(r[i + 1])),
    borderColor: INK[i] || INK[3],
    tension: 0.15,
    pointRadius: 3,
    ...(i > 0 ? { borderDash: [4, 4] } : {})
  }));

  const legend = datasets.map((ds, i) =>
    `<div class="item"><span class="swatch ${i > 0 ? 'dashed' : 'line'}" style="background:${INK[i] || INK[3]};"></span>${esc(ds.label)}</div>`
  ).join('\n          ');

  return {
    config: {
      type: 'line',
      data: { labels, datasets },
      options: { scales: { y: { min: yMin, max: yMax, ticks: { callback_unit: unit } } } }
    },
    legend,
    note: opts.note || ''
  };
}

function renderColumn(headers, rows, opts) {
  const labels      = rows.map(r => r[0]);
  const seriesNames = headers.slice(1);
  const unit        = detectUnit(rows.flatMap(r => r.slice(1)));
  const allVals     = rows.flatMap(r => r.slice(1).map(toNum));
  const isStacked   = !!flags.stacked;
  const yMax        = roundUp(Math.max(...allVals));

  const datasets = seriesNames.map((name, i) => ({
    label: name,
    data: rows.map(r => toNum(r[i + 1])),
    backgroundColor: INK[i] || INK[3],
    ...(isStacked ? { stack: 'col' } : {})
  }));

  const stackOpts = isStacked ? { stacked: true } : {};

  const legend = datasets.map((ds, i) =>
    `<div class="item"><span class="swatch" style="background:${INK[i] || INK[3]};"></span>${esc(ds.label)}</div>`
  ).join('\n          ');

  return {
    config: {
      type: 'bar',
      data: { labels, datasets },
      options: {
        scales: {
          x: { ...stackOpts },
          y: { ...stackOpts, min: 0, max: yMax, ticks: { callback_unit: unit } }
        }
      }
    },
    legend,
    note: opts.note || ''
  };
}

function renderWaterfall(headers, rows, opts) {
  const labels = rows.map(r => r[0]);
  const values = rows.map(r => toNum(r[1]));
  const unit   = detectUnit(rows.map(r => r[1]));

  // Classify rows: first row = starting total, last = ending total, rest = drivers
  const isTotal = (label, i) =>
    i === 0 || i === rows.length - 1 || /total|net|end|final|result/i.test(label);

  let running = 0;
  const spacers = [], barVals = [], barColors = [];

  rows.forEach((r, i) => {
    const v      = values[i];
    const asTotal = isTotal(r[0], i);

    if (asTotal && i === 0) {
      // Starting bar: full height from zero
      spacers.push(0);
      barVals.push(v);
      barColors.push(INK[0]);
      running = v;
    } else if (asTotal) {
      // Ending bar: full height from zero (should equal running)
      spacers.push(0);
      barVals.push(running);
      barColors.push(INK[0]);
    } else {
      // Driver: floating bar — spacer is the bottom of the visible segment
      spacers.push(v >= 0 ? running : running + v);
      barVals.push(Math.abs(v));
      barColors.push(v >= 0 ? INK[1] : NEG);
      running += v;
    }
  });

  const yMax = roundUp(Math.max(...spacers.map((s, i) => s + barVals[i])));

  const legend = [
    `<div class="item"><span class="swatch" style="background:${INK[0]};"></span>Start / end state</div>`,
    `<div class="item"><span class="swatch" style="background:${INK[1]};"></span>Driver of change (positive)</div>`,
    `<div class="item"><span class="swatch" style="background:${NEG};"></span>Driver of change (negative)</div>`
  ].join('\n          ');

  return {
    config: {
      type: 'bar',
      data: {
        labels,
        datasets: [
          { label: '_spacer', data: spacers, backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)', stack: 'wf' },
          { label: 'Value',   data: barVals, backgroundColor: barColors, stack: 'wf' }
        ]
      },
      options: {
        scales: {
          x: { stacked: true },
          y: { stacked: true, min: 0, max: yMax, ticks: { callback_unit: unit } }
        }
      }
    },
    legend,
    note: opts.note || `${unit ? unit + ' ' : ''}values. ${esc(headers[0])} to ${esc(labels[labels.length - 1])}.`
  };
}

function renderTornado(headers, rows, opts) {
  const unit = detectUnit(rows.flatMap(r => r.slice(1)));

  // Normalise: downside must be negative, upside positive
  const data = rows.map(r => ({
    label:    r[0],
    downside: Math.min(0, -Math.abs(toNum(r[1]))),
    upside:   Math.max(0,  Math.abs(toNum(r[2])))
  }));

  // Sort largest total swing first
  data.sort((a, b) => (Math.abs(b.downside) + b.upside) - (Math.abs(a.downside) + a.upside));

  const axisMax = roundUp(Math.max(...data.map(d => Math.max(Math.abs(d.downside), d.upside))));

  return {
    config: {
      type: 'bar',
      data: {
        labels: data.map(d => d.label),
        datasets: [
          { label: esc(headers[1] || 'Downside'), data: data.map(d => d.downside), backgroundColor: NEG },
          { label: esc(headers[2] || 'Upside'),   data: data.map(d => d.upside),   backgroundColor: POS }
        ]
      },
      options: {
        indexAxis: 'y',
        scales: {
          x: { stacked: true, min: -axisMax, max: axisMax, ticks: { callback_unit: unit } },
          y: { stacked: false }
        }
      }
    },
    legend: [
      `<div class="item"><span class="swatch" style="background:${NEG};"></span>${esc(headers[1] || 'Downside impact')}</div>`,
      `<div class="item"><span class="swatch" style="background:${POS};"></span>${esc(headers[2] || 'Upside impact')}</div>`
    ].join('\n          '),
    note: opts.note || 'Sorted by magnitude of total swing · ranges per variable in parentheses.'
  };
}

function renderCostBenefit(headers, rows, opts) {
  const unit        = detectUnit(rows.flatMap(r => r.slice(1)));
  const seriesNames = headers.slice(1);
  const allVals     = rows.flatMap(r => r.slice(1).map(toNum));
  const yMin        = roundDn(Math.min(...allVals, 0));
  const yMax        = roundUp(Math.max(...allVals, 0));

  const COST_COLORS    = [INK[0], INK[1]];
  const BENEFIT_COLORS = [POS, POS2];
  let ci = 0, bi = 0;

  const datasets = seriesNames.map((name, i) => {
    const vals   = rows.map(r => toNum(r[i + 1]));
    const isCost = vals.every(v => v <= 0) || /cost|invest|spend|opex|capex/i.test(name);
    return {
      label: name,
      data: vals,
      backgroundColor: isCost ? COST_COLORS[ci++ % COST_COLORS.length] : BENEFIT_COLORS[bi++ % BENEFIT_COLORS.length]
    };
  });

  const legend = datasets.map(ds =>
    `<div class="item"><span class="swatch" style="background:${ds.backgroundColor};"></span>${esc(ds.label)}</div>`
  ).join('\n          ');

  return {
    config: {
      type: 'bar',
      data: { labels: rows.map(r => r[0]), datasets },
      options: {
        scales: {
          x: { stacked: true },
          y: { stacked: true, min: yMin, max: yMax, ticks: { callback_unit: unit } }
        }
      }
    },
    legend,
    note: opts.note || `${unit ? unit + ' ' : ''}nominal · costs stack downward, benefits upward.`
  };
}

function renderCumulative(headers, rows, opts) {
  const labels   = rows.map(r => r[0]);
  // Use the column most likely to be the cumulative series
  const valCol   = Math.max(1, headers.findIndex(h => /cumul/i.test(h)));
  const values   = rows.map(r => toNum(r[valCol]));
  const unit     = detectUnit(rows.map(r => r[valCol]));
  const allVals  = [...values, 0];
  const yMin     = roundDn(Math.min(...allVals));
  const yMax     = roundUp(Math.max(...allVals));

  // Find break-even annotation
  let breakNote = '';
  for (let i = 1; i < values.length; i++) {
    if (values[i - 1] < 0 && values[i] >= 0) {
      breakNote = ` · Break-even between ${esc(labels[i - 1])} and ${esc(labels[i])}.`;
      break;
    }
  }

  return {
    config: {
      type: 'line',
      data: {
        labels,
        datasets: [
          { label: '_breakeven', data: labels.map(() => 0), borderColor: '#c4c4c4', borderDash: [3, 3], pointRadius: 0, borderWidth: 1, tension: 0 },
          { label: headers[valCol] || 'Cumulative cash', data: values, borderColor: INK[0], tension: 0.15, pointRadius: 3, pointBackgroundColor: INK[0], borderWidth: 2.5 }
        ]
      },
      options: { scales: { y: { min: yMin, max: yMax, ticks: { callback_unit: unit } } } }
    },
    legend: [
      `<div class="item"><span class="swatch line" style="background:${INK[0]};"></span>${esc(headers[valCol] || 'Cumulative cash position')}</div>`,
      `<div class="item"><span class="swatch dashed"></span>Break-even line ($0)</div>`
    ].join('\n          '),
    note: opts.note || `${unit ? unit + ' ' : ''}nominal${breakNote}.`
  };
}

function renderStatGrid(headers, rows) {
  // CSS-only component — no Chart.js
  const tiles = rows.slice(0, 4).map(r => {
    const label   = r[0] || '';
    const rawVal  = r[1] || '';
    const delta   = r[2] || '';
    const desc    = r[3] || '';

    // Split leading currency/unit prefix, trailing unit suffix
    const m = String(rawVal).match(/^([^\d\-+]*)([+\-]?[\d,\.]+)([^\d]*)$/);
    const [prefix, numPart, suffix] = m ? [m[1], m[2], m[3]] : ['', rawVal, ''];

    return `    <div class="stat">
      <div class="stat-label">${esc(label)}</div>
      <div class="stat-num">${prefix ? `<span class="unit">${esc(prefix)}</span>` : ''}${esc(numPart)}${suffix ? `<span class="unit">${esc(suffix)}</span>` : ''}${delta ? `<span class="stat-delta">${esc(delta)}</span>` : ''}</div>
      ${desc ? `<div class="stat-desc">${esc(desc)}</div>` : ''}
    </div>`;
  });

  return { isStatGrid: true, html: `<div class="stat-grid">\n${tiles.join('\n')}\n    </div>` };
}

// ─── Slide assembler ──────────────────────────────────────────────────────────
const EYEBROW_DEFAULT = {
  bar: 'Analysis', column: 'Trend', line: 'Trajectory', waterfall: 'Bridge',
  tornado: 'Sensitivity analysis', 'cost-benefit': 'Cost-benefit profile',
  cumulative: 'Cumulative cash flow', 'stat-grid': 'Key metrics'
};

function buildSlide(result, opts, chartType) {
  const eyebrow = esc(opts.eyebrow || EYEBROW_DEFAULT[chartType] || 'Chart');
  const title   = esc(opts.title   || '[Action title — complete sentence stating the insight.]');
  const source  = esc(opts.source  || `Source: ${path.basename(csvFile)}`);

  if (result.isStatGrid) {
    return `
<!-- ─── PASTE INTO deck.html ──────────────────────────────────── -->
<section class="slide">
  <div class="slide-inner">
    <div class="eyebrow">${eyebrow}</div>
    <h2 class="title">${title}</h2>
    <div class="title-rule"></div>
    ${result.html}
    <div class="source">
      <div class="source-label">${source}</div>
    </div>
  </div>
</section>`;
  }

  const { config, legend, note } = result;
  const dataAttr = JSON.stringify(config).replace(/'/g, '&#39;');

  return `
<!-- ─── PASTE INTO deck.html ──────────────────────────────────── -->
<section class="slide">
  <div class="slide-inner">
    <div class="eyebrow">${eyebrow}</div>
    <h2 class="title">${title}</h2>
    <div class="title-rule"></div>
    <div class="chart-wrap">
      <div class="chart-canvas-box">
        <canvas data-chart='${dataAttr}'></canvas>
      </div>
      <div class="chart-legend">
        ${legend}
      </div>
      ${note ? `<div class="chart-note">${esc(note)}</div>` : ''}
    </div>
    <div class="source">
      <div class="source-label">${source}</div>
    </div>
  </div>
</section>`;
}

// ─── Main ─────────────────────────────────────────────────────────────────────
function main() {
  if (!fs.existsSync(csvFile)) {
    process.stderr.write(`Error: file not found — ${csvFile}\n`);
    process.exit(1);
  }

  const rows = parseCSV(fs.readFileSync(csvFile, 'utf8'));
  if (rows.length < 2) {
    process.stderr.write('CSV must have at least one header row and one data row.\n');
    process.exit(1);
  }

  const headers   = rows[0];
  const dataRows  = rows.slice(1).filter(r => r.some(c => c.trim() !== ''));
  const chartType = flags.chart || detectChartType(headers, dataRows);
  const opts      = { title: flags.title, eyebrow: flags.eyebrow, note: flags.note, source: flags.source };

  const VALID = ['bar','column','line','waterfall','tornado','cost-benefit','cumulative','stat-grid'];
  if (!VALID.includes(chartType)) {
    process.stderr.write(`Unknown chart type: "${chartType}"\nValid types: ${VALID.join('  ')}\n`);
    process.exit(1);
  }

  const renderers = {
    'bar':          () => renderBar(headers, dataRows, opts),
    'column':       () => renderColumn(headers, dataRows, opts),
    'line':         () => renderLine(headers, dataRows, opts),
    'waterfall':    () => renderWaterfall(headers, dataRows, opts),
    'tornado':      () => renderTornado(headers, dataRows, opts),
    'cost-benefit': () => renderCostBenefit(headers, dataRows, opts),
    'cumulative':   () => renderCumulative(headers, dataRows, opts),
    'stat-grid':    () => renderStatGrid(headers, dataRows),
  };

  const result = renderers[chartType]();
  process.stdout.write(buildSlide(result, opts, chartType) + '\n');
  process.stderr.write(`[csv-to-chart] ${chartType} · ${dataRows.length} rows · ${headers.length} cols · ${path.basename(csvFile)}\n`);
}

main();
