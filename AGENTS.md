# Presentable — Foundation Agent

You are an AI assistant helping a human work with this slide framework. **This is the foundation file** — read it first. Then read the **case-specific agent** for whichever case the human is working in:

- `enterprise/AGENTS.md` — consulting-grade strategy decks, business cases, board updates, proposals, GTM plans, 100-day plans, executive summaries, market teardowns
- `investor/AGENTS.md` — startup pitch decks: seed, Series A/B
- `portfolio/AGENTS.md` — designer portfolios, project case studies, personal-brand decks

This foundation file covers what is **shared across all three cases**: how slides work, the design-token system, the full component library (38 components + 7 chart types), and the PDF export. Things that **vary** by case — principles, storylines, tone, and which components to favor — live in the case files.

## What this framework is

A self-contained HTML deck framework. One `.html` file per deck. No build step. No JavaScript framework. The only external dependencies are Google Fonts and a Chart.js CDN. Each deck is one file you can email, version-control, or upload anywhere.

The framework optimizes for the LLM-with-human workflow: you (the assistant) write slide HTML directly, using the component library below; the human reviews and iterates. There is no GUI, no slide editor — just text in, slides out.

**The same underlying component library serves all three cases.** What changes between cases is the *theme tokens* (background, ink scale, fonts, accent), the *storyline conventions*, and *which components are used*. A Harvey Balls scoring table makes sense in an enterprise consulting deck; it makes no sense in a portfolio.

## File structure

```
presentable/
├── README.md                    ← three-case overview, quick start
├── AGENTS.md                    ← this file (the foundation)
├── export-pdf.js                ← Playwright headless PDF exporter
├── package.json                 ← Playwright dependency + per-case PDF scripts
│
├── enterprise/
│   ├── deck.html                ← showcase: 46 slides, 38 components, 7 chart types
│   ├── theme-builder.html       ← form-based theme tool with AI brand-research prompt
│   ├── AGENTS.md                ← enterprise case overlay (consulting principles, storylines, tone)
│   └── examples/
│       ├── business-case.html                       ← focused 11-slide business case (generic shape)
│       └── business-case-warehousing-analytics.html ← 13-slide worked example: analytics team in 3PL
│
├── investor/
│   ├── deck.html                ← showcase: 13-slide Series A pitch (the "Loop" demo)
│   ├── theme-builder.html       ← image-upload theme tool with Canvas color extraction
│   ├── AGENTS.md                ← investor case overlay (pitch principles, storylines, tone)
│   └── examples/
│       └── seed-pitch-sundial-health.html ← 11-slide seed pitch (Sundial Health · healthcare AI)
│
└── portfolio/
    ├── deck.html                ← showcase: 10-slide designer portfolio (the "Ana Rivera" demo)
    ├── theme-builder.html       ← color-picker theme tool with algorithmic palette derivation
    ├── AGENTS.md                ← portfolio case overlay (portfolio principles, storylines, tone)
    └── examples/
        └── case-study-marfa-bookshop.html ← 10-slide single-project case study (Theo Park · brand)
```

Each `<case>/deck.html` is a fully self-contained file: its own font links, its own theme tokens at `:root`, its own component CSS (identical across cases), its own slide content, its own script. Decks share *structure*; they own their own *tokens*.

Each `<case>/examples/*.html` is a focused, edit-ready template for a specific storyline within the case — never a wholesale clone of another example. Each picks its own mix of components from the framework's library based on what the situation needs.

Each `<case>/theme-builder.html` is also self-contained — a tool for retheming the deck. Each builder has a different ingestion mechanism appropriate to its case (form + AI prompt for enterprise, image upload for investor, color-picker for portfolio). All three produce a copy-pasteable `:root` CSS block that drops into the case's `deck.html`.

## Slide density — universal rule

**No slide should have more than ~40% blank space in the content area.** This applies across all three cases. Empty screen is not minimalism — it reads as incomplete work.

The framework's main content components (`stat-grid`, `two-col`, `three-col`, `big-stat`, `bullets`, `image-gallery`, `market-funnel`, etc.) are built with `flex: 1 1 auto; min-height: 0` so they automatically expand to fill the slide. This means the layout handles density for you — but only if you give it enough content to work with.

**Two strategies when content is sparse:**

1. **If the slide is drawing attention to a specific detail** (a big number, a stat, a quote): center it vertically. Dark moment slides and big-stat slides intentionally do this — the content sits in the middle of the page, commanding attention. Do not add more content just to fill space; instead, let the CSS centering do the work.

2. **If the slide is text-based** (bullets, columns, action title + body): fill the space. A three-bullet list with one sentence each will leave half the slide blank. Either deepen the bullets, add a sub-point or example, or add a supporting sentence beneath the list that interprets or contextualizes the content.

**Before finalizing any slide**: look at the bottom half. If it's largely blank, either the content is too sparse or you need to restructure. A slide where only 20% of the area has content is not a slide — it's a title card.

## How slides work

Each slide is a `<section class="slide">` inside the `.deck` container. The first slide gets the class `active`. The JS handles navigation (arrow keys, click to advance, deep links via `#3`), the slide counter, the progress bar, and hash routing automatically. Add or remove `<section>` blocks; everything updates.

```html
<section class="slide">
  <div class="slide-inner">
    <!-- content here -->
  </div>
</section>
```

Dark slides add `.dark` to the section. Use sparingly — at most one or two per deck (case-specific guidance applies).

Chrome behavior:
- `?pdf=1` URL query disables animations and forces print-friendly chart rendering.
- The progress bar updates per slide at the top.
- The counter (e.g., `04 / 13`) is in the bottom-right.
- Nav buttons (`Prev / Next / PDF`) sit beside the counter.

The framework is **screen-first** but exports cleanly to PDF via `window.print()` (in-page button) or the headless Playwright exporter (`export-pdf.js`).

## First decision: which case?

Before writing a single line of HTML, identify which case the human is in. Wrong-case decks fail no matter how well-executed.

Three quick tests:
- **Who is the audience?** Executives / clients = enterprise. VCs / angels = investor. A single small audience (one client, one hiring manager) = portfolio.
- **What decision is being asked for?** Strategy or investment approval = enterprise. Capital = investor. *No decision, just impression* = portfolio.
- **What is the dominant content type?** Numbers and frameworks = enterprise. Numbers and narrative = investor. Images and craft = portfolio.

If the human is ambiguous, ask. Don't guess. The cases share components but have different storytelling logic, and the wrong choice undoes the work.

Once you know the case, **read the matching `<case>/AGENTS.md`** for that case's principles, storylines, tone, common mistakes, and component discipline. Then come back to this file for the component reference.

---

## Design tokens

The framework uses a CSS-variable design system. **Each case overrides the token values at `:root`** — fonts, background, ink scale, accent — but the *structure* of the system (the token names and where they're used) is identical across cases. The component CSS reads from tokens, never from hardcoded colors or fonts.

The values shown below are the **enterprise defaults**. The investor and portfolio cases override them with their own values (see `investor/deck.html` and `portfolio/deck.html`). The discipline is the same in all three cases: **do not introduce new colors or fonts beyond what the case's token set defines**.

### Retheming a deck — use the theme builder

Each case has its own theming surface, tuned to how that case actually works in the world:

- **Enterprise** → open `enterprise/theme-builder.html`. Form-based with a generated AI prompt the user (or you) can paste into Claude to research a real company's brand guidelines. Best for "build this deck for [BigCo]" requests.
- **Investor** → open `investor/theme-builder.html`. Drag-drop a logo, deck screenshot, or product image; Canvas-based color extraction surfaces the dominant brand colors; pick which is the accent and which is the ink color. Best for "match our existing brand" requests.
- **Portfolio** → open `portfolio/theme-builder.html`. Style preset selector + base-color picker + warm/cool toggle; algorithmic palette derivation (HSL math) fills in the full token set. Best for "I want a [mood]" requests where there's no external brand to match.

Each tool outputs a complete `:root` block plus the Google Fonts URL. The user (or you) replaces the `:root` block in the case's `deck.html` and updates the `<link>` in `<head>`. The whole deck retones to the new theme — every component, every chart, every slide.

Detailed theming guidance for each case lives in the case's `AGENTS.md` under the "Theming workflow" section.

### Colors

| Token | Enterprise value | Use |
|---|---|---|
| `--bg` | `#ffffff` | Page background |
| `--bg-tint` | `#fafaf8` | Body backdrop (around slides on screen) |
| `--bg-card-alt` | `#f6f6f3` | Subtle card emphasis, recommended-option highlight |
| `--bg-dark` | `#0e1116` | Dark slide background |
| `--ink-1` | `#0a0a0a` | Primary text, headlines, hard dividers |
| `--ink-2` | `#2a2a2a` | Body text |
| `--ink-3` | `#6a6a6a` | Subtitle, secondary body |
| `--ink-4` | `#9a9a9a` | Eyebrows, captions |
| `--ink-5` | `#c4c4c4` | Sources, very dim |
| `--line-1` | `#ececec` | Default hairlines |
| `--line-2` | `#d4d4d4` | Emphasized borders |
| `--accent` | `#1a4d7a` | Brand accent — case-specific |
| `--positive-tint` | `#eaf3ed` | Low-risk cells, positive outcomes |
| `--warn-tint` | `#fbf0e8` | Medium-risk cells |
| `--risk-tint` | `#f7eaea` | High-risk cells |

**The semantic tint colors** (positive / warn / risk) and **the on-dark colors** stay consistent across cases. **The accent** and the **ink scale character** (cool gray for enterprise/investor; warm brown for portfolio) are the main per-case differences.

How each case sets its accent:

- **Enterprise:** deep blue `#1a4d7a`, used sparingly
- **Investor:** vivid orange `#ea580c`, used confidently
- **Portfolio:** muted terracotta `#a05a3c`, typographic only (italics, links)

### Typography

The three font roles — display, body, mono — are constant. The fonts that fill them vary per case:

| Case | Display | Body | Mono |
|---|---|---|---|
| Enterprise | Fraunces | Manrope | JetBrains Mono |
| Investor | Bricolage Grotesque | Sora | JetBrains Mono |
| Portfolio | Newsreader | Instrument Sans | JetBrains Mono |

Type scale (enterprise values shown; investor scales larger, portfolio similar):

- Cover title: `clamp(40px, 6vw, 80px)`, display weight 400
- Section divider title: `clamp(28px, 3.4vw, 44px)`, display weight 400
- Slide action title (`.title`): `clamp(26px, 3.2vw, 40px)`, display weight 400
- Subtitle / body lead: `clamp(14px, 1.4vw, 17px)`, body weight 400
- Body: `clamp(12.5px, 1.05vw, 14.5px)`, body weight 400
- Eyebrow: `11px`, mono, uppercase, weight 500, letter-spacing 0.12em
- Source: `10px`, mono, color `--ink-5`

### Spacing & geometry

- Slide padding: `5vh 6vw` enterprise · `6vh 6.5vw` investor · `5.5vh 7vw` portfolio
- Section gaps: `1.5rem` between elements, `2.5rem` between sections within a slide
- Border radius: `3px` for small (tags, dots), `6px` for medium, `10px` for cards (rare)
- Hairlines: 1px solid `--line-1`

---

## Component reference

Twenty components, in the order they appear in `deck.html`. Use the exact class names. Copy the HTML structure. Change only the content.

### 1. Cover slide

The opening slide of every deck. Confidentiality marker top-right is optional but typical for external/board work.

```html
<section class="slide active">
  <div class="cover">
    <div class="cover-top">
      <div class="cover-mark">Company · Year</div>
      <div class="cover-confid">Confidential · Internal</div>
    </div>
    <div class="cover-center">
      <div class="cover-eyebrow">Document type · Date</div>
      <h1 class="cover-title">Action-title statement <em>with italic emphasis</em>.</h1>
      <p class="cover-sub">A one-sentence framing of what this document argues.</p>
    </div>
    <div class="cover-bottom">
      <div class="cover-meta"><div class="meta-label">Prepared for</div><div>Audience</div></div>
      <div class="cover-meta" style="text-align: right;"><div class="meta-label">Prepared by</div><div>Author · Date</div></div>
    </div>
  </div>
</section>
```

The cover title should still be an action title — not a topic label. "A path to doubling EBITDA by 2029" not "2026 Strategy Review."

### 2. Executive summary (Pyramid)

The most important slide in the deck. Goes immediately after the cover. The reader who reads only this slide should understand the recommendation and three reasons for it.

```html
<section class="slide">
  <div class="slide-inner">
    <div class="eyebrow">Executive Summary</div>
    <h2 class="title">[Action title that states the recommendation.]</h2>
    <div class="title-rule"></div>
    <div class="exec-summary">
      <div class="key-msg">
        <span class="label">Headline</span>
        [The single most important sentence in the deck — the conclusion.]
      </div>
      <div class="support-grid">
        <div class="support">
          <div class="support-no">— 01 [Theme]</div>
          <h4>[Supporting argument 1 as a complete sentence.]</h4>
          <p>[One or two sentences of evidence.]</p>
        </div>
        <!-- Two more supports, MECE with the first -->
      </div>
    </div>
    <div class="source"><div class="source-label">[Sources]</div><div class="page-no">02</div></div>
  </div>
</section>
```

Three supporting arguments, MECE. If you can't make three, make two — but two strong is better than three forced.

### 3. Section divider

Marks a new chapter. A deck of more than ~10 slides usually has 2–4 of these.

```html
<section class="slide">
  <div class="section-divider">
    <div class="roman">I.</div>
    <div>
      <div class="roman-meta">Part One</div>
      <h2>[Action title for this section.]</h2>
      <p class="section-summary">[A two-sentence framing of what this section argues.]</p>
    </div>
  </div>
</section>
```

Use Roman numerals (I, II, III, IV). Section titles, like slide titles, are sentences, not labels.

### 4. SCR slide (Situation · Complication · Resolution)

The single most powerful storytelling component. Use it when you need to anchor the reader before making a recommendation.

```html
<div class="scr">
  <div class="scr-col"><div class="label">Situation</div><h4>[Today's reality.]</h4><p>[Evidence.]</p></div>
  <div class="scr-col"><div class="label">Complication</div><h4>[What changed.]</h4><p>[Evidence.]</p></div>
  <div class="scr-col resolution"><div class="label">Resolution</div><h4>[What we propose.]</h4><p>[The bridge.]</p></div>
</div>
```

The resolution column has a tinted background — it's visually weightier because it's where the argument lands.

### 5. Action title + bullets

The default content slide. Use a small number of bullets (3–5), each a complete sentence.

```html
<ul class="bullets">
  <li><span class="lead">[Lead phrase in dark.]</span> [Supporting clause.]</li>
  <li>...</li>
</ul>
```

Each bullet leads with a 2–4 word phrase in `<span class="lead">` that captures the point, followed by the qualifying detail. This makes bullets scannable. Plain bullets without a lead are acceptable but worse.

### 6. Stat grid

Four KPIs side by side, with deltas where meaningful. Use for headline numbers that frame the rest of the section.

```html
<div class="stat-grid">
  <div class="stat">
    <div class="stat-label">[What this measures]</div>
    <div class="stat-num">22<span class="unit">%</span></div>
    <div class="stat-desc">[One sentence of context.]</div>
    <div class="stat-delta">▲ 4 pts vs 2023</div>
  </div>
  <!-- repeat 4× total -->
</div>
```

Deltas use `▲` (positive), `▼` (negative — add class `neg`), or `—` (neutral). Always include the comparison period.

### 7. Big stat

When one number is the point. The number takes the left half; framing takes the right.

```html
<div class="big-stat">
  <div class="number">8<span class="unit">pts</span></div>
  <div class="frame">
    <h4>[What this number means in one sentence.]</h4>
    <p>[The implication — why it matters.]</p>
  </div>
</div>
```

### 8. 2×2 matrix

Strategic positioning. The axes carry the meaning; pick them carefully. Label each quadrant.

```html
<div class="matrix-wrap">
  <div class="matrix-y-label">[Y-axis label, vertical, e.g. "Market growth →"]</div>
  <div class="matrix">
    <div class="matrix-quad"><div><div class="qlabel">[Action]</div><div class="qname">[Quadrant name]</div></div><div class="qdesc">[Description]</div></div>
    <div class="matrix-quad hero"><!-- the hero is the recommended quadrant --></div>
    <div class="matrix-quad"><!-- bottom-left --></div>
    <div class="matrix-quad"><!-- bottom-right --></div>
  </div>
  <div class="matrix-x-label">[X-axis label, e.g. "Right to win →"]</div>
</div>
```

The `.hero` quadrant is dark — use it for the strategic destination (where the recommendation points). The other three are light. Every quadrant gets a 2-line label: what to do (e.g. "Defend," "Invest aggressively," "Exit," "Watch") and a name.

### 9. Strategy House

The classic consulting framework: ambition (roof), pillars (3–4), foundation. Use for strategy slides where the recommendation has structure.

```html
<div class="house">
  <div class="house-roof"><div class="label">Ambition · 2029</div><h4>[The vision in one sentence.]</h4></div>
  <div class="house-pillars">
    <div class="pillar"><div class="pno">— 01</div><h5>[Pillar 1.]</h5><p>[Detail.]</p></div>
    <!-- 3 more pillars -->
  </div>
  <div class="house-foundation"><div class="label">Foundation</div><p>[The enabling capability.]</p></div>
</div>
```

Four pillars is the sweet spot. Three works. Five is too many; if you have five, two of them are not strategic pillars.

### 10. Pyramid summary

The Pyramid Principle made visual: main message → 3 supporting arguments → evidence row. Different from the exec summary in that it goes deeper — use it as a section-end summary.

```html
<div class="pyramid">
  <div class="pyramid-top"><span class="label">Main message</span><h4>[Conclusion sentence.]</h4></div>
  <div class="pyramid-mid">
    <div><div class="ino">— 01 [Theme]</div><h5>[Argument.]</h5></div>
    <!-- 2 more -->
  </div>
  <div class="pyramid-base">
    <div><p>[Evidence for argument 1.]</p></div>
    <!-- 2 more -->
  </div>
</div>
```

### 11. MECE tree

A decomposition with the parent at top, branches below, sub-items per branch. Use for "where does X come from?" slides — growth, cost, customers, etc.

```html
<div class="mece">
  <div class="mece-root">[The total being decomposed]</div>
  <div class="mece-branches">
    <div class="mece-branch">
      <div class="bno">— 01 [Branch name]</div>
      <h5>[Branch headline]</h5>
      <div class="mece-sub">
        <div class="mece-sub-item">[Sub-item]</div>
        <!-- 2-4 sub-items -->
      </div>
    </div>
    <!-- 2 more branches -->
  </div>
</div>
```

Three branches, MECE. If you can't, change the decomposition.

### 12. Two-column

Before/after, current/future, option A/option B. Both columns get an eyebrow and a heading.

```html
<div class="two-col">
  <div><div class="eyebrow">Today</div><h3>[Heading.]</h3><p>[Body.]</p></div>
  <div><div class="eyebrow">Future state</div><h3>[Heading.]</h3><p>[Body.]</p></div>
</div>
```

### 13. Three-column

Three perspectives, three drivers, three pillars. Each gets a number, a heading, and a paragraph.

```html
<div class="three-col">
  <div><div class="colno">— 01 [Theme]</div><h3>[Heading.]</h3><p>[Body.]</p></div>
  <!-- 2 more -->
</div>
```

### 14. Roadmap

Phased plan with explicit time windows and gate decisions. Horizontal, 3–5 phases.

```html
<div class="roadmap">
  <div class="phase">
    <div class="ptime">[Time range]</div>
    <h4>[Phase name]</h4>
    <ul><li>[Outcome]</li><li>[Outcome]</li><li>[Gate: clear criterion]</li></ul>
  </div>
  <!-- 3 more phases -->
</div>
```

Name the gates explicitly. A roadmap without gates is a wish list.

### 15. Process flow

Sequential steps with arrow connectors. Use for decision processes, customer journeys, or governance. Mark the current/active step with `.active`.

```html
<div class="flow">
  <div class="flow-step active"><div class="sno">01 — Now</div><h5>[Step name.]</h5><p>[Detail.]</p></div>
  <div class="flow-step"><div class="sno">02 — [When]</div><h5>[Step.]</h5><p>[Detail.]</p></div>
  <!-- 3–5 steps total -->
</div>
```

### 16. Comparison table

Multi-row, multi-column comparison. Use to compare segments, options, or vendors across attributes. Mark hero columns with `.hero`.

```html
<table class="ctable">
  <thead>
    <tr><th></th><th>[Column]</th><th class="hero">[Hero column]</th><th>[Column]</th></tr>
  </thead>
  <tbody>
    <tr><td>[Attribute]</td><td>[Value]</td><td class="hero">[Value]</td><td>[Value]</td></tr>
  </tbody>
</table>
```

Limit to 5–6 rows and 4–5 columns. Anything bigger belongs in an appendix.

### 17. Options assessment

Options × criteria matrix, with one row marked `.recommended`. Use to show the rigor behind a recommendation.

```html
<table class="options-table">
  <thead><tr><th>Option</th><th>[Criterion]</th><th>[Criterion]</th><!-- ... --></tr></thead>
  <tbody>
    <tr><td>A · [Option name]</td><td><span class="score low">low</span></td><!-- ... --></tr>
    <tr class="recommended"><td>B · [Option name] <em>(recommended)</em></td><td><span class="score high">$X</span></td><!-- ... --></tr>
  </tbody>
</table>
```

Score classes: `.score.high` (dark, strongest), `.score.med` (tinted, middle), `.score.low` (outlined, weakest).

3–5 options, 4–6 criteria. Always show the rejected options — that's the source of credibility.

### 18. Risk matrix

3×3 probability × impact grid with risks placed as labeled dots. Reference risks below in the source line (e.g. R1: …, R2: …).

```html
<div class="risk-matrix">
  <div class="y-axis-label">Impact →</div>
  <div class="risk-grid">
    <!-- 9 cells, row 1 = high impact -->
    <div class="risk-cell med"></div>
    <div class="risk-cell high"><div class="risk-dot">R1</div></div>
    <!-- etc. -->
  </div>
  <div class="x-axis"><div class="x-tick">Low</div><div class="x-tick">Medium</div><div class="x-tick">High</div></div>
</div>
```

Cell colors: `.low` (positive tint), `.med` (warn tint), `.high` (risk tint). Always include a legend in the upper right.

### 19. Insight / quote

A single insight or quote, large. Use *very* sparingly — one per deck maximum, ideally as a transition or as a senior thinker's authority before a bold recommendation.

```html
<div class="insight">
  <div class="quote-mark">"</div>
  <div class="quote-text">[Quote — large serif italic.]</div>
  <div class="quote-attr">[Author] · <em>[Source]</em></div>
</div>
```

### 20. Closing / next steps

The action slide. Always two halves: "for approval today" (the asks) and "launches in the next 30 days" (the commitments). Every item has a number, a description, and an owner.

```html
<div class="closing-next">
  <div class="next-grid">
    <div class="next-col">
      <h4>For approval today</h4>
      <ul>
        <li><span class="ino">01</span><span>[Decision required.]</span><span class="iown">[Decider]</span></li>
      </ul>
    </div>
    <div class="next-col">
      <h4>Launches in the next 30 days</h4>
      <ul>
        <li><span class="ino">01</span><span>[Action.]</span><span class="iown">[Owner]</span></li>
      </ul>
    </div>
  </div>
</div>
```

If a strategic deck doesn't end with a slide that names decisions and owners, the decision will not be made. Always include this.

### Sign-off / thanks

```html
<div class="thanks">
  <div class="thanks-center">
    <div class="eyebrow">Discussion</div>
    <h2 class="thanks-title">Questions <em>and</em> dissent.</h2>
    <p class="thanks-sub">[A one-line invitation to challenge the analysis.]</p>
  </div>
  <div class="thanks-bottom"><div>[Team · Date]</div><div>[Contact]</div></div>
</div>
```

The phrase "Questions and dissent" is intentional — consulting decks should invite challenge, not applause.

---

## Additional components (v0.3)

Ten further patterns drawn from the consulting component library. Same design tokens as everything above — no new fonts or colors. Use these alongside the core twenty.

### 21. Big-number section divider

An alternative chapter break: short title on the left, a huge numeral or Roman letter on the right. Use this when you want a section divider with more presence than the standard Roman-numeral version — typically the *first* divider of a deck or an appendix divider.

```html
<section class="slide">
  <div class="section-divider-big">
    <div class="sdb-left">
      <div class="sdb-eyebrow">[Eyebrow · e.g., "Part Two"]</div>
      <h2>[Section action title.]</h2>
      <div class="sdb-meta">[Optional sub-meta — date range, scope]</div>
    </div>
    <div class="sdb-number">02</div>
  </div>
</section>
```

Don't mix the two divider styles in one deck. Pick Roman (component 3) *or* big-number, and use it consistently.

### 22. Harvey Balls

The canonical consulting rating visual — circles with five fill levels indicating strength on a criterion. Use for vendor evaluation, option scoring, capability assessment, anywhere a 0–4 ordinal rating beats a number or word.

Glyph syntax: `<span class="hb hb-N"></span>` where N is 0 (empty), 1 (quarter), 2 (half), 3 (three-quarters), 4 (full).

```html
<table class="hb-table">
  <thead>
    <tr>
      <th>[Option]</th>
      <th>[Criterion 1]</th>
      <th>[Criterion 2]</th>
      <th>[Criterion 3]</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>[Option A]</td>
      <td><span class="hb hb-3"></span></td>
      <td><span class="hb hb-1"></span></td>
      <td><span class="hb hb-4"></span></td>
    </tr>
    <tr class="hero">
      <td>[Option B] <em>(recommended)</em></td>
      <td><span class="hb hb-4"></span></td>
      <td><span class="hb hb-4"></span></td>
      <td><span class="hb hb-3"></span></td>
    </tr>
  </tbody>
</table>
<div class="hb-legend">
  <div class="item"><span class="hb hb-0"></span>None</div>
  <div class="item"><span class="hb hb-2"></span>Partial</div>
  <div class="item"><span class="hb hb-4"></span>Full</div>
</div>
```

Always include the legend — the fill levels are not self-evident on first read. Always mark the recommended row with `.hero` and `▸` prefix. 4–7 criteria, 3–6 options is the readable range.

### 23. Stakeholder directory

People-driven table — names, roles, status — with semantic priority pills. Use for stakeholder maps in 100-day plans, kickoff decks, change-management plans, RACI summaries.

```html
<table class="directory">
  <thead>
    <tr><th>Name</th><th>Role</th><th>Team</th><th>Tenure</th><th>Stance</th><th>Engagement</th></tr>
  </thead>
  <tbody>
    <tr><td>[Name]</td><td>[Role]</td><td>[Team]</td><td>[Years]</td><td>[Supportive / Neutral / Skeptical]</td><td><span class="pill pill-high">Week 1</span></td></tr>
  </tbody>
</table>
```

Pill classes: `.pill.pill-high` (filled dark — top priority), `.pill.pill-med` (warm tint — middle), `.pill.pill-low` (outlined — lowest), `.pill.pill-yes` (positive tint), `.pill.pill-no` (outlined). 6–12 rows; more belongs in an appendix.

### 24. Checklist

A side-labeled list with checkbox bullets. Use for pre-meeting prep, launch readiness, post-mortem action items — any "things that must be done" with optional ownership.

```html
<div class="checklist">
  <div class="checklist-side">
    <div class="cls-label">[Side label · e.g., "Checklist"]</div>
    <div class="cls-sublabel">[Optional sub-label]</div>
  </div>
  <div class="checklist-items">
    <div class="cl-item done"><span></span><div><div class="cl-text">[Completed item]</div><div class="cl-meta">Completed · [date]</div></div></div>
    <div class="cl-item"><span></span><div><div class="cl-text">[Pending item]</div><div class="cl-meta">Due [date] · [owner]</div></div></div>
  </div>
</div>
```

Add `.done` class to items already completed — the checkbox fills in. Keep each line under 18 words. 4–8 items is the sweet spot.

### 25. SWOT analysis

The classic 2×2: Strengths, Weaknesses (top — internal) × Opportunities, Threats (bottom — external) and positive (left) × negative (right). Use as a strategic diagnostic before recommending a direction.

```html
<div class="swot">
  <div class="swot-cell s">
    <div class="swot-tag"><span class="swot-letter">S</span><span class="swot-name">Strengths · internal · positive</span></div>
    <ul><li>[Point]</li><li>[Point]</li><li>[Point]</li></ul>
  </div>
  <div class="swot-cell w">
    <div class="swot-tag"><span class="swot-letter">W</span><span class="swot-name">Weaknesses · internal · negative</span></div>
    <ul><li>[Point]</li></ul>
  </div>
  <div class="swot-cell o">
    <div class="swot-tag"><span class="swot-letter">O</span><span class="swot-name">Opportunities · external · positive</span></div>
    <ul><li>[Point]</li></ul>
  </div>
  <div class="swot-cell t">
    <div class="swot-tag"><span class="swot-letter">T</span><span class="swot-name">Threats · external · negative</span></div>
    <ul><li>[Point]</li></ul>
  </div>
</div>
```

3–4 bullets per cell. A SWOT with 7 weaknesses doesn't tell you anything — it's a list of complaints. Force a ranking and keep the top items.

### 26. Buyer persona card

A single-persona card with dark header (avatar + name + role + quote) and four light blocks (needs, behaviors, pain points, wins). Use in GTM decks, product strategy, segmentation work.

```html
<div class="persona">
  <div class="persona-head">
    <div class="persona-avatar">[Initials]</div>
    <div>
      <div class="persona-name">"[Persona name]"</div>
      <div class="persona-role">[Title · Industry · Segment]</div>
    </div>
    <div class="persona-quote">"[Direct quote that captures their worldview.]"</div>
  </div>
  <div class="persona-body">
    <div class="persona-block">
      <div class="pb-label">Needs</div>
      <ul><li>[Need]</li><li>[Need]</li><li>[Need]</li></ul>
    </div>
    <div class="persona-block">
      <div class="pb-label">Behaviors</div>
      <ul><li>[Behavior]</li></ul>
    </div>
    <div class="persona-block">
      <div class="pb-label">Pain points</div>
      <ul><li>[Pain]</li></ul>
    </div>
    <div class="persona-block">
      <div class="pb-label">Wins (what we offer)</div>
      <ul><li>[Win]</li></ul>
    </div>
  </div>
</div>
```

The persona name in quotes signals "synthesized archetype, not a real person." The "wins" block is the bridge from persona to product — it's where the slide earns its place.

### 27. TAM / SAM / SOM

Market sizing visualized as three nested bars, each successively smaller — Total addressable, Serviceable addressable, Serviceable obtainable.

```html
<div class="market-funnel">
  <div class="mf-row">
    <div class="mf-tier">Total · TAM<span class="mf-tier-name">[Scope description]</span></div>
    <div class="mf-bar"><div class="mf-bar-track"></div><div class="mf-bar-fill" style="width: 100%;">$24.0B</div></div>
    <div class="mf-value">$24.0B</div>
    <div class="mf-desc">[Definition and source.]</div>
  </div>
  <div class="mf-row">
    <div class="mf-tier">Serviceable · SAM<span class="mf-tier-name">[Scope]</span></div>
    <div class="mf-bar"><div class="mf-bar-track"></div><div class="mf-bar-fill mid" style="width: 17%;">$4.1B</div></div>
    <div class="mf-value">$4.1B</div>
    <div class="mf-desc">[Definition.]</div>
  </div>
  <div class="mf-row">
    <div class="mf-tier">Obtainable · SOM<span class="mf-tier-name">[Realistic target]</span></div>
    <div class="mf-bar"><div class="mf-bar-track"></div><div class="mf-bar-fill tight" style="width: 1.3%;">$320M</div></div>
    <div class="mf-value">$320M</div>
    <div class="mf-desc">[Assumptions and timeframe.]</div>
  </div>
</div>
```

The `width:` in the `mf-bar-fill` style attribute is the ratio of each tier to the TAM (the first bar). The math should be honest — if SAM is 17% of TAM, the bar width should be 17%.

### 28. Initiative card grid

Three (or four) cards each describing a strategic initiative via three questions: **Why is this important?**, **What will improve?**, **How?** Use to explain a portfolio of initiatives in a single slide.

```html
<div class="initiative-grid">
  <div class="initiative-card">
    <div class="ic-no">— 01 Initiative</div>
    <h4>[Initiative name — short action phrase.]</h4>
    <div class="ic-section"><div class="ic-label">Why is this important?</div><p>[2 sentences.]</p></div>
    <div class="ic-section"><div class="ic-label">What will improve?</div><p>[2 sentences with a number.]</p></div>
    <div class="ic-section"><div class="ic-label">How?</div><p>[2 sentences with mechanism.]</p></div>
  </div>
  <!-- 2–3 more cards -->
</div>
```

Three cards is the sweet spot. Four works. Two means the page is empty; expand or use two-column. The "what will improve" answer should always contain a number.

### 29. Before / After transformation

Paired panels with a connecting arrow — current state on the left (dimmed), target state on the right (full ink). Use to make organisation, process, or product transformations visible.

```html
<div class="before-after">
  <div class="ba-side before">
    <div class="ba-label">Today · [State name]</div>
    <h3>[Current-state action title.]</h3>
    <ul><li>[Reality]</li><li>[Reality]</li><li>[Reality]</li></ul>
  </div>
  <div class="ba-arrow">→</div>
  <div class="ba-side after">
    <div class="ba-label">Target · [State name]</div>
    <h3>[Future-state action title.]</h3>
    <ul><li>[Reality]</li><li>[Reality]</li><li>[Reality]</li></ul>
  </div>
</div>
```

The "after" headline should be the same shape as the "before" — same number of bullets in the same conceptual order — so the contrast is line-by-line. Asymmetric before/after slides obscure the change.

### 30. Workstream layout

Horizontal Gantt-like layout — one row per workstream, columns by time period, bars and milestones for activities. Use to show parallel work over a multi-quarter plan.

```html
<div class="workstreams">
  <div class="ws-header">
    <div></div>
    <div>[Time 1]</div><div>[Time 2]</div><div>[Time 3]</div>
    <!-- ... up to 8 time columns -->
  </div>
  <div class="ws-row">
    <div class="ws-name">WS1 · [Workstream name]</div>
    <div class="ws-cell" style="grid-column: 2;"><div class="ws-bar" style="left: 4%; right: -200%;">[Activity]</div></div>
    <div class="ws-cell"></div>
    <div class="ws-cell"><div class="ws-milestone" data-label="[Milestone]"></div></div>
    <!-- ... -->
  </div>
</div>
```

Bar variants: default (solid black — active build), `.alt` (gray — parallel/secondary track), `.outline` (outlined — preparation/design phase). Milestones are diamond markers with a `data-label` for the milestone name. The HTML is fiddly — the bar's `right: -N%` negative value sets how many additional columns it spans. Test in browser.

Maximum 5 rows × 8 columns. Anything bigger belongs in a project-management tool, not a strategy deck.

### Pills (status indicators)

Used inside several components above. Standalone reference:

```html
<span class="pill pill-high">High</span>
<span class="pill pill-med">Medium</span>
<span class="pill pill-low">Low</span>
<span class="pill pill-yes">Yes</span>
<span class="pill pill-no">No</span>
```

Use for priority columns, status columns, and yes/no flags. Don't use for everything — pills compete for attention, so reserve them for the truly status-bearing column in a table.

---

## Financial & operational components (v0.4)

Eight further patterns from the consulting Excel-template family — financial-case visualizations and project-management staples. Four are Chart.js-driven.

### 31. Financial summary tiles

Four KPI tiles in a row showing the headline returns of an investment case — NPV, IRR, Payback, ROI — each with a gauge bar comparing value-to-target. Use as the headline of any business case, near the executive summary.

```html
<div class="fin-tiles">
  <div class="fin-tile">
    <div class="fin-tile-label">Net present value</div>
    <div class="fin-tile-value">$1.18<span class="unit">M</span></div>
    <div class="fin-tile-target">Target · $0.75M</div>
    <div class="fin-tile-gauge">
      <div class="fin-tile-gauge-fill" style="width: 92%;"></div>
      <div class="fin-tile-gauge-mark" style="left: 58%;"></div>
    </div>
    <div class="fin-tile-status beat">▲ Beats target by 57%</div>
  </div>
  <!-- 3 more tiles: IRR, Payback, ROI -->
</div>
```

Status classes: `.beat` (positive — value better than target), `.meet` (gray — at target), `.miss` (warm — below target). The gauge `fill` is the actual value as a % of the gauge max; the `mark` is the target position on the same scale. Pick a consistent gauge max per tile (e.g., NPV target × 2) so visual comparison reads correctly.

Four tiles is the canonical set for an investment case. Don't add a fifth — if you have a fifth metric it's usually a sensitivity or qualitative judgment, not a KPI.

### 32. Cost-Benefit chart (Chart.js)

A stacked bar chart where costs stack downward from zero (in grayscale) and benefits stack upward (in greens). The single most-used business-case visual after the financial summary.

```html
<canvas data-chart='{
  "type": "bar",
  "data": {
    "labels": ["Y1", "Y2", "Y3", "Y4", "Y5"],
    "datasets": [
      {"label": "Investment", "data": [-106, -71, -54, -43, -26], "backgroundColor": "#0a0a0a"},
      {"label": "Ongoing costs", "data": [-35, -35, -35, -35, -35], "backgroundColor": "#6a6a6a"},
      {"label": "Revenue", "data": [450, 630, 630, 630, 540], "backgroundColor": "#1f6b3e"},
      {"label": "Cost savings", "data": [60, 80, 40, 0, 0], "backgroundColor": "#7faf95"}
    ]
  },
  "options": {
    "scales": {
      "x": {"stacked": true},
      "y": {"stacked": true, "min": -200, "max": 800, "ticks": {"callback_unit": "$K"}}
    }
  }
}'></canvas>
```

This is the only place in the framework where color carries semantic meaning — grayscale for costs, green for benefits. The convention is universal in financial reporting; respect it.

If the year-zero entry investment dwarfs the operating years (typical for capex-heavy cases), exclude it from this chart and call it out in the chart note. Show it instead on the cumulative cash flow chart, where the dip below zero tells the story.

### 33. Cumulative cash flow (Chart.js)

A line chart of running cumulative cash position over time, with a dashed zero line marking break-even. Pair with the cost-benefit chart — together they make the financial case.

```html
<canvas data-chart='{
  "type": "line",
  "data": {
    "labels": ["Y0", "Y1", "Y2", "Y3", "Y4", "Y5"],
    "datasets": [
      {"label": "_breakeven", "data": [0,0,0,0,0,0], "borderColor": "#c4c4c4", "borderDash": [3,3], "pointRadius": 0, "borderWidth": 1, "tension": 0},
      {"label": "Cumulative cash", "data": [-1055, -686, -82, 499, 1051, 1530], "borderColor": "#0a0a0a", "pointRadius": [4,0,0,4,0,4], "borderWidth": 2.5}
    ]
  },
  "options": {"scales": {"y": {"ticks": {"callback_unit": "$K"}}}}
}'></canvas>
```

The `_breakeven` dataset is a dashed flat line at y=0 — drawn first so the cash-flow line crosses it visibly. Mark the start, break-even, and end points with visible dots via `pointRadius: [4,0,0,4,0,4]`. The action title should name the break-even period (e.g., "breaks even in month 26").

### 34. Tornado / Sensitivity chart (Chart.js)

Horizontal bars centered on zero showing how each variable affects NPV when flexed up or down. Downside in risk-red, upside in positive-green. Sort variables by magnitude (largest range at the top — that's why it's called a tornado).

```html
<canvas data-chart='{
  "type": "bar",
  "data": {
    "labels": ["Adoption rate (±20%)", "Pricing (±15%)", "Year-1 revenue (±25%)", "Implementation cost (±30%)"],
    "datasets": [
      {"label": "Downside", "data": [-470, -380, -240, -180], "backgroundColor": "#a02929"},
      {"label": "Upside",   "data": [ 410,  340,  260,  200], "backgroundColor": "#1f6b3e"}
    ]
  },
  "options": {
    "indexAxis": "y",
    "scales": {
      "x": {"stacked": true, "min": -600, "max": 600, "ticks": {"callback_unit": "$K"}},
      "y": {"stacked": false}
    }
  }
}'></canvas>
```

The trick is `x.stacked: true` — this lets the negative downside bar and positive upside bar share the same horizontal row by stacking from zero in opposite directions. Always include the flex range in parentheses next to the variable name (e.g., "Adoption rate (±20%)") so the reader knows the assumption being tested.

This is the classic consulting visual for "what could go wrong with this number?" — pair with a base-case NPV slide so the reader knows what's being flexed.

### 35. Power / Interest stakeholder map

A 2×2 with stakeholders plotted as dots based on their power (Y-axis) and interest (X-axis), with management strategy named in each quadrant. The "manage closely" top-right quadrant is the hero — those are the stakeholders the project's success depends on.

```html
<div class="power-interest">
  <div class="pi-y-label">Power / Influence →</div>
  <div class="pi-grid">
    <div class="pi-quad"><div class="pi-qlabel">Top-left</div><div class="pi-qaction">Keep satisfied</div></div>
    <div class="pi-quad hero"><div class="pi-qlabel">Top-right</div><div class="pi-qaction">Manage closely</div></div>
    <div class="pi-quad"><div class="pi-qlabel">Bottom-left</div><div class="pi-qaction">Monitor casually</div></div>
    <div class="pi-quad"><div class="pi-qlabel">Bottom-right</div><div class="pi-qaction">Keep informed</div></div>
    <!-- Stakeholder dots positioned by left/top % -->
    <div class="pi-dot" style="left: 86%; top: 12%;">SC</div>
    <span class="pi-dot-name" style="left: calc(86% + 22px); top: 12%;">Sara C. · CTO</span>
    <!-- repeat for each stakeholder -->
  </div>
  <div class="pi-x-label">Interest →</div>
</div>
```

Each dot needs both an absolute-positioned `.pi-dot` (the circle with initials) and an absolute-positioned `.pi-dot-name` (the label to the right). The coordinates are percentages: `left: X%` is interest (0% = no interest, 100% = total interest); `top: Y%` is power, but **inverted** — `top: 0%` is high power (top of the chart), `top: 100%` is low power.

Use 2–3 letter initials inside the dot, full name + role in the label. 8–12 stakeholders is the readable range; more becomes a wall of names.

### 36. Risk register (scored)

A full risk table with calculated score (Impact × Likelihood), mitigation strategy, cost-if-happens, mitigation cost, and mitigation ROI. Use when the risk picture needs more rigor than the 3×3 risk matrix (component 18) — typically in business cases, due diligence, and committee-level approvals.

```html
<table class="risk-register">
  <thead>
    <tr>
      <th class="ctr">#</th>
      <th>Risk</th>
      <th class="ctr">Impact<br/>(1–5)</th>
      <th class="ctr">Likelihood<br/>(1–5)</th>
      <th class="ctr">Score</th>
      <th>Mitigation</th>
      <th class="num">Cost if happens</th>
      <th class="num">Mitigation cost</th>
      <th class="num">Mitigation ROI</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="rid">R1</td>
      <td class="rname">[Risk description]</td>
      <td class="ctr">5</td><td class="ctr">4</td>
      <td class="ctr"><span class="rscore high">20</span></td>
      <td>[Mitigation strategy]</td>
      <td class="num">$1,200K</td>
      <td class="num">$180K</td>
      <td class="num">5.7×</td>
    </tr>
    <!-- 5-7 more risks -->
  </tbody>
</table>
```

Score classes: `.rscore.high` (≥ 12 — dark filled), `.rscore.med` (6–11 — warm tint), `.rscore.low` (≤ 5 — positive tint). Header cell classes: `.num` (right-aligned numeric), `.ctr` (center-aligned).

Pair with the simpler risk-matrix component (18) — risk matrix for the executive-summary visual, risk register for the detail.

### 37. RAG status dashboard

A status report layout: four traffic-light tiles for project dimensions (Overall / Scope / Schedule / Budget) plus two text columns — achievements + decisions-needed. The default layout for weekly or biweekly steering-committee updates.

```html
<div class="rag-dashboard">
  <div class="rag-tiles">
    <div class="rag-tile green">
      <div class="rag-label">Overall health</div>
      <div class="rag-status">On track</div>
      <div class="rag-note">[Brief note]</div>
    </div>
    <div class="rag-tile amber">
      <div class="rag-label">Schedule</div>
      <div class="rag-status">Slightly off track</div>
      <div class="rag-note">[Brief note]</div>
    </div>
    <!-- 2 more tiles -->
  </div>
  <div class="rag-body">
    <div>
      <h4>Main achievements · past two weeks</h4>
      <ul><li>[Item]</li><li>[Item]</li></ul>
    </div>
    <div>
      <h4>Decisions needed · steering committee</h4>
      <ul class="numbered"><li>[Decision]</li><li>[Decision]</li></ul>
    </div>
  </div>
</div>
```

RAG colors: `.green` (on track), `.amber` (slightly off), `.red` (very off / blocked). The decisions-needed list uses `.numbered` so each ask has an explicit number — easier to reference in the meeting ("on number two…").

Achievements should be 4–6 bullets; decisions should be 2–4. A status report with ten asks is a status report that won't get any of them.

### 38. Gantt task list

A tabular Gantt — hierarchical tasks (Step header rows + indented task rows) with start/end dates, days, and status pills. Use when the workstream layout (component 30) is too abstract and the reader needs a real task-by-task plan.

```html
<table class="gantt-tasks">
  <thead>
    <tr>
      <th>Task</th><th>Owner</th><th>Start</th><th>End</th>
      <th class="num">Days</th><th class="ctr">Status</th>
    </tr>
  </thead>
  <tbody>
    <tr class="step">
      <td class="task-name">Step 1 · [Phase name]</td>
      <td>[Owner]</td>
      <td>[Start]</td><td>[End]</td>
      <td class="num">21</td>
      <td class="ctr"><span class="pill pill-complete">Complete</span></td>
    </tr>
    <tr>
      <td class="indent">[Sub-task name]</td>
      <td>[Owner]</td>
      <td>[Start]</td><td>[End]</td>
      <td class="num">3</td>
      <td class="ctr"><span class="pill pill-overdue">Overdue</span></td>
    </tr>
    <!-- ... -->
  </tbody>
</table>
```

Step rows (parent rows) use `<tr class="step">` and `.task-name` on the first cell — they get a subtle background and bolder type. Sub-task rows use `.indent` on the first cell for visual hierarchy.

Status pill classes (specific to plans): `.pill.pill-complete`, `.pill.pill-progress`, `.pill.pill-overdue`, `.pill.pill-notstarted`. These join the existing `.pill-high / .pill-med / .pill-low / .pill-yes / .pill-no` family.

Maximum 15 visible tasks per slide. More belongs in the project tracker, not a deck.

---

## Chart components

Four chart types are built in via Chart.js: line, horizontal bar, stacked column, and waterfall. The framework applies design-token defaults — Manrope and JetBrains Mono fonts, ink-scale colors, hairline gridlines — so the author specifies *data*, not styling.

### Wrapper

Every chart sits in the same wrapper:

```html
<div class="chart-wrap">
  <div class="chart-canvas-box">
    <canvas data-chart='[JSON config]'></canvas>
  </div>
  <div class="chart-legend">
    <div class="item"><span class="swatch" style="background: #0a0a0a;"></span>[Series A]</div>
    <div class="item"><span class="swatch dashed"></span>[Series B]</div>
  </div>
  <div class="chart-note">[Y-axis unit, any caveat]</div>
</div>
```

Legend swatch variants: `.swatch` (solid block — for bars/areas), `.swatch.line` (thin solid line — for line charts), `.swatch.dashed` (dashed line — for secondary/scenario series), `.swatch.dot` (filled circle — for points).

The custom legend is intentional — Chart.js's built-in legend is hard to style precisely. Author the legend in HTML so it matches the rest of the deck.

### Line chart

For trajectories, time series, scenario comparison. Maximum **3 lines** per chart; usually 2. Solid for primary, dashed for status-quo or counterfactual.

```html
<canvas data-chart='{
  "type": "line",
  "data": {
    "labels": ["2025", "2026", "2027", "2028", "2029"],
    "datasets": [
      {"label": "Status quo", "data": [1200,1250,1280,1300,1310], "borderColor": "#9a9a9a", "borderDash": [4,4]},
      {"label": "With strategy", "data": [1200,1280,1430,1660,1920], "borderColor": "#0a0a0a", "pointRadius": [0,0,0,0,5]}
    ]
  },
  "options": {
    "scales": {"y": {"min": 1100, "max": 2000, "ticks": {"stepSize": 200, "callback_unit": "$M"}}}
  }
}'></canvas>
```

Highlight the endpoint with `"pointRadius": [0,0,0,0,5]` — a single visible dot on the last data point of the primary series anchors the eye to "where we end up."

### Horizontal bar

For ranked comparison across categories — segment growth, channel performance, vendor scoring. 5–10 bars max. Sort descending unless there's an ordinal reason not to. Use `"indexAxis": "y"`.

```html
<canvas data-chart='{
  "type": "bar",
  "data": {
    "labels": ["Healthcare", "SMB", "Public sector", "Enterprise", "Legacy"],
    "datasets": [{
      "data": [22, 18, 14, 6, -4],
      "backgroundColor": ["#0a0a0a","#0a0a0a","#c4c4c4","#9a9a9a","#c4c4c4"]
    }]
  },
  "options": {
    "indexAxis": "y",
    "scales": {"x": {"min": -8, "max": 28, "ticks": {"callback_unit": "%"}}}
  }
}'></canvas>
```

Color the "hero" bars (the ones the recommendation is about) in `--ink-1` (black), others in `--ink-3` (mid gray) or `--ink-5` (very light). This makes the conclusion visible at a glance.

### Stacked column

For composition over time — revenue mix, cost structure, customer mix. 2–4 series stacked, **largest at the bottom**. Use `"stacked": true` on both axes.

```html
<canvas data-chart='{
  "type": "bar",
  "data": {
    "labels": ["2026", "2027", "2028", "2029"],
    "datasets": [
      {"label": "Enterprise core", "data": [1200,1230,1250,1260], "backgroundColor": "#0a0a0a"},
      {"label": "SMB self-serve", "data": [0,35,90,200], "backgroundColor": "#6a6a6a"},
      {"label": "Healthcare", "data": [0,15,50,120], "backgroundColor": "#c4c4c4"}
    ]
  },
  "options": {
    "scales": {
      "x": {"stacked": true},
      "y": {"stacked": true, "min": 0, "max": 2000, "ticks": {"stepSize": 500, "callback_unit": "$M"}}
    }
  }
}'></canvas>
```

### Waterfall (EBITDA bridge)

For showing how you got from A to B as a sequence of additive moves — the classic "EBITDA bridge" slide. Built from a stacked bar with an invisible "spacer" series.

The trick: each non-anchor bar has a `_spacer` segment underneath it equal to the running total *before* the move, and a visible segment equal to the move itself. The anchor bars (start and end) have a zero spacer and a full-height visible bar.

```html
<canvas data-chart='{
  "type": "bar",
  "data": {
    "labels": ["2026 EBITDA","+ New revenue","+ Cost reduction","+ Core retention","2029 EBITDA"],
    "datasets": [
      {"label": "_spacer", "data": [0,240,400,450,0], "backgroundColor": "rgba(0,0,0,0)", "stack": "wf"},
      {"label": "Value", "data": [240,160,50,30,480], "backgroundColor": ["#0a0a0a","#6a6a6a","#6a6a6a","#6a6a6a","#0a0a0a"], "stack": "wf"}
    ]
  },
  "options": {
    "scales": {"x": {"stacked": true}, "y": {"stacked": true, "min": 0, "ticks": {"callback_unit": "$M"}}}
  }
}'></canvas>
```

The two anchor bars (start and end states) get `--ink-1` (black); the movement bars get `--ink-3` (gray). The reader's eye reads "start → steps → end" without explanation.

### Chart design rules

These rules are not stylistic preferences; they are the difference between a chart that delivers a finding and a chart that decorates a slide.

- **Maximum 3 visible series per chart.** More requires either a different chart type or splitting into two slides. If you have five lines, you have not picked a finding yet.
- **Sort meaningfully.** Bars sorted by value (descending), not alphabetically. Time series in chronological order. Categories in conceptual order if there is one.
- **Hero by color.** Use `--ink-1` (black) only on the series the recommendation is about; everything else in `--ink-3` or `--ink-5`. The chart should answer "which line/bar matters?" without needing the legend.
- **Y-axis units always.** Use the `"callback_unit"` sugar (`"$M"`, `"$B"`, `"%"`, or any string) — it produces formatted tick labels in Mono font.
- **Custom legend in mono, below the chart.** Never rely on Chart.js's default legend.
- **Action title states the finding.** Never a topic-label like "Revenue forecast" — always a sentence stating what the chart shows. The chart is *evidence for the title*, not the headline.
- **One chart per slide.** A slide with two charts has two messages; split it.
- **Cite below.** Source line at the bottom, every time.

### The `callback_unit` sugar

JSON can't carry JavaScript functions, so the framework recognizes a `"callback_unit"` string on any axis's `ticks` object and converts it to a proper Chart.js callback. Supported tokens:

- `"$M"` → `$1,200M`
- `"$B"` → `$2B`
- `"%"` → `25%`
- any other string → appended as a suffix

If you need anything more complex, drop the JSON-attribute approach for that one chart and instantiate it imperatively from JavaScript at the bottom of the file — but 95% of consulting charts fit the four built-in types.

---

## PDF export

Two ways to get a PDF out:

### 1. Browser `P` button (casual)

Hit `P` in the deck (or click the **⤓ PDF** button). The browser's print dialog opens with the page already set to 16:9 landscape. Choose "Save as PDF," ensure margins are at zero, ensure "Background graphics" is on. Good enough for most uses.

### 2. Playwright exporter (production / CI)

For deterministic output — same on every machine, reliable handling of charts inside hidden slides, scriptable into a build pipeline:

```bash
npm install                                              # one-time
node export-pdf.js enterprise/deck.html                  # → enterprise/deck.pdf
node export-pdf.js investor/deck.html                    # → investor/deck.pdf
node export-pdf.js portfolio/deck.html                   # → portfolio/deck.pdf
node export-pdf.js enterprise/deck.html out/board.pdf    # custom output path
```

Convenience scripts in `package.json`:

```bash
npm run pdf:enterprise
npm run pdf:investor
npm run pdf:portfolio
npm run pdf:all                                          # all three at once
```

What the exporter does:

1. Loads the deck with `?pdf=1` (this query flag disables Chart.js animations so render is deterministic).
2. Waits for `document.fonts.ready`.
3. Switches to print media emulation. The framework's `@media print` CSS does the rest: every slide becomes its own 13.333in × 7.5in landscape page, background colors preserved.
4. Calls `window.__renderCharts()` to resize every Chart.js instance — this is critical, because charts inside `display: none` slides start at zero dimensions and only get real ones when print emulation kicks in.
5. Writes the PDF with `printBackground: true`.

Use the browser button for quick iteration. Use Playwright when the PDF is going to a board, a client, an investor, or any external audience.

---

## Final note on craft

This is the foundation. It tells you how to render slides, what components exist, how the design system works, and how to export. It does **not** tell you how to make a deck *good* — that's case-specific. Read the case agent for the case the human is in.

What the three case agents share, despite their differences:

- Every title is a sentence, not a label.
- Every claim is sourced or specific.
- Every slide carries one message.
- Restraint is the default; embellishment earns its way in.

The framework does not make decks good. The components don't make the argument. The argument is in the action titles, the storyline choice, and the discipline to cut what isn't earning its place. That work belongs to the human, supported by the case agent, supported by you.

When the work is done well — when every slide title states a conclusion, every chart answers a "so what?", every section ends where a decision can be made — the deck almost makes itself. When it isn't done well, no quantity of beautifully styled components will save it.
