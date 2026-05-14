# Presentable — Investor case agent

You are helping a human build a **startup investor pitch deck** using the framework. Read the root `AGENTS.md` first for the foundation (components, charts, design tokens, PDF export). This file is the **investor case overlay** — what's different about pitch decks vs the enterprise case, and how to do them well.

## What this case is for

Pre-seed through Series B pitch decks. Internal investor updates (LP reports, board decks at venture-backed companies) are *not* this case — those use the enterprise case. This case is specifically about **persuading a sophisticated investor to put money into a startup**.

Three tells that someone wants the investor case:
- Words like "pitch," "Series A/B," "seed round," "raising," "investor deck," "demo day," "VC."
- Audience is venture investors, angels, or strategic corporate VCs.
- The decision being asked for is *capital*, not approval of a strategy.

If unsure between investor and enterprise: ask. The frameworks are different enough that getting it wrong wastes both your time and the user's.

## Theme

Pre-themed in `investor/deck.html`. Tokens at `:root`:

- **Background:** white `#ffffff`, with a dark `#0c0a09` for moment slides
- **Ink:** the standard ink scale, punchier blacks
- **Accent:** vivid orange `#ea580c` — this is the brand color, used confidently
- **Fonts:** Bricolage Grotesque (display) + Sora (body) + JetBrains Mono (labels)
- **Type scale:** larger than enterprise — `--title-size: clamp(30px, 4vw, 52px)`
- **Spacing:** more generous — `--slide-pad-y: 6vh; --slide-pad-x: 6.5vw`

Bricolage Grotesque is a variable display sans with personality. It's not "neutral" — it has shoulders. Lean into that on cover and section titles; pull back on body content where Sora carries the reading.

The accent color is meant to be **used**, not held in reserve. Investor decks live on their accent. Apply it to:
- The italic `em` in cover and section titles
- Mission/closing slide eyebrows
- Hero chart series
- The amount in The Ask slide
- One or two emphasis moments per deck

Don't use it for: body copy, table cells, semantic states (those have their own colors).

## Theming workflow

The investor case ships with **`investor/theme-builder.html`** — a self-contained tool that extracts colors from an uploaded image and turns the user's pick into a `:root` CSS block.

### When the user wants to retheme to match their brand

If the user shares a logo, an existing pitch deck, a website screenshot, or product imagery — anything visual — that's the signal to use the investor theme builder:

1. **Open `investor/theme-builder.html`** in the browser. Drag the image into the upload zone.
2. The tool extracts up to 8 dominant colors from the image using a Canvas pixel-sampling algorithm. The most vivid color is auto-suggested as the accent.
3. Click a swatch to select it, then assign it a role — **Accent** (the brand pop) or **Ink** (the body text color).
4. The live preview updates as you assign roles. Two slides render — light cover + dark "mission" slide — so you see how the accent works on both backgrounds.
5. Copy the generated `:root` CSS, paste into `investor/deck.html`.

### What images work best

In rough order of usefulness:
- **The company logo** as PNG or SVG. Clearest, highest-saturation colors. Works best if the logo has a meaningful primary color.
- **A screenshot of the existing pitch deck** (or the cover slide). Captures the brand's actual color usage in deck context.
- **The product UI** at a hero shot, or a marketing-site hero. Color comes through, plus typography hints.
- **A brand-rich photo** — the lifestyle imagery on the company's homepage often encodes the brand palette.

What works *poorly*: full-bleed dark stock photography (extracts mostly black), white-on-white logo marks (extracts only the brand color faintly), or product screenshots dominated by white UI chrome (extracts mostly white).

### When the user has no image to share

Two fallbacks:
- **Manual hex input.** The "Or enter manually" field below the upload zone accepts a hex code directly. Use this when the user knows their brand color (e.g., "we're using #5b21b6") but doesn't have an image handy.
- **Ask the user to describe their brand.** "What feeling do you want — bold and energetic, considered and credible, or playful and unexpected?" Map to a recommended accent and proceed.

### What "branded" means for investor

Investor theming uses brand color **confidently**, unlike enterprise's restraint. The discipline:

- **The accent is the brand.** It appears in the cover italic, the mission eyebrow, the chart hero series, the Ask amount. The deck *lives on* the accent.
- **Keep the ink scale neutral.** Default cool grays work for almost every brand. Only override `--ink-1` when the brand has a distinctive dark color that meaningfully matters (rare).
- **Don't dilute with secondary brand colors.** Many startups have a "fun" secondary or tertiary brand color. Don't introduce them — the deck should feel monobrand, not like a swatch chart.
- **Charts use the accent for the hero series.** Other series fall back to ink-1 and ink-3. This is automatic if the chart configs reference accent properly.

### Common cases

- **"Match our existing deck"** — screenshot a slide from the existing deck (or export to PDF and screenshot from there), drop into the theme builder, pick the accent color.
- **"Use our logo's colors"** — drop the logo file. Usually the most vivid extracted color is the right accent.
- **"Use Sequoia red / a16z purple / [fund] color"** — manual hex input is faster than searching for an image.
- **"We don't have a brand yet"** — push back gently: a pitch without a brand color is fine for an internal draft, but a deck going to investors should pick a color and commit. Suggest one based on what category they're in (fintech → tend toward blue/indigo, consumer → tend toward warm orange/coral, dev tools → tend toward green or violet).

### What the theme builder does NOT do

- It doesn't extract *fonts* from images — typeface OCR is unreliable. The user picks display + body fonts manually from the dropdowns. If they want a specific custom typeface, suggest the closest Google Fonts substitute and tell them why.
- It doesn't edit the deck. You or the user paste the generated `:root` block into `investor/deck.html`.

## Principles — pitch-specific

The enterprise case has eight non-negotiable principles (Pyramid, action titles, SCR, MECE, etc.). Investor pitch decks share *some* of them — action titles still apply — but have their own logic.

### 1. One message per slide, ruthlessly

Worse than the enterprise rule. Enterprise decks tolerate dense slides because the reader has the document in front of them. Pitches are *presented* — the investor sees the slide for 30 seconds while the founder talks. If the slide has two messages, both are lost.

The discipline: every slide should be readable in 5 seconds. If you can't extract the headline in 5 seconds, the slide is too dense.

### 2. The narrative arc is canonical — use it

A pitch is not a strategy document. It follows a well-known narrative that investors expect and that every framework (Sequoia, a16z, YC) more or less converges on:

1. **Vision / Mission** — the world you're trying to make
2. **Problem** — what's broken, with a number
3. **Solution** — your specific answer
4. **Why now** — what changed; why this is the moment
5. **Market** — how big this could be
6. **Product** — how it actually works
7. **Traction** — proof you're not just talking
8. **Business model** — how you make money
9. **Competition** — why you, not them
10. **Team** — why you can pull this off
11. **Ask** — what you want and why
12. **Vision restatement** — return to the world you're making

Skip a slide only if you have a specific reason. Mostly, follow the order. Investors will notice deviations.

### 3. Show traction or don't pitch

If you have traction (revenue, users, growth, retention, NDR), it goes near the front and gets hero treatment. If you don't have traction, you have a *seed pitch*, and the burden shifts to:
- A team that has done this before
- A product demo that's so compelling it does the talking
- A market dynamic so urgent that "why now" is the strongest slide

A pitch with no traction, no proven team, and no "why now" is not yet ready to pitch.

### 4. Numbers are the language

Investors think in numbers. Every claim should be testable. Replace:
- "Massive market" → "$2.8B SAM growing 31% YoY"
- "Rapid growth" → "24% MoM for the last six months"
- "World-class team" → "two prior exits, eight Figma alums"

If you find yourself reaching for adjectives, you don't have the number yet. Go get the number.

### 5. The Ask is concrete

The last substantive slide is the ask. It says:
- **How much** ($8M Series A)
- **From whom** (lead + co-lead)
- **At what** (target valuation)
- **For how long** (runway)
- **Used how** (3–4 buckets of spend, percentages)
- **To reach what** (milestone for next round)

A pitch without a concrete ask is a friendly conversation. Sometimes that's what the founder wants. Usually it isn't.

### 6. Tone: confident, not careful

Enterprise tone is "sober senior associate writing for a CFO." Investor tone is closer to "founder telling their best friend why this is going to work."

This means:
- First person ("we") is fine and often better than third
- Active voice always
- One exclamation point per deck is *allowed* but should be earned (on the mission or closing only, not on every traction stat)
- Direct, declarative claims — even slightly bold ones — beat hedged ones
- The phrase "we believe" is usually a verbal tic; cut it

What stays from enterprise tone:
- No emoji
- No buzzwords (synergy, leverage as a verb, unlock value)
- Source any external claim
- Specific numbers beat adjectives

### 7. Density rule: 12–15 slides

Sequoia's template is 10 slides. YC tells founders "no more than 12." Series B decks creep to 18. Above 20, you've lost the investor.

Three knobs to keep the count down:
- **One stat per slide.** If you want to show four traction numbers, use a stat grid component — that's still one message ("look at our momentum"). If you want to show four *different stories*, split.
- **Combine product + how-it-works.** A process flow on top of a product screenshot beats two separate slides.
- **Skip "thank you" slides.** Investors hate them. End on the vision restatement; "any questions?" is verbal, not slide-worthy.

## Storylines

Three canonical storylines. Pick one and stay disciplined.

### Storyline 1 · Seed pitch (10–12 slides)

For founders raising their first institutional round. Limited or no traction. The bet is on the team and the market.

1. **Cover** — Company · stage · author
2. **Vision** (dark moment slide) — One sentence about the world you're building
3. **Problem** — Big stat + framing: why this is broken
4. **Solution** — How your product solves it (3–4 bullets, lead-bold)
5. **Why now** — Three forces (three-column) that make this the moment
6. **Product** — How it works (process flow), or screenshots, or a 2x2 of features
7. **Market** — TAM/SAM/SOM with realistic SOM
8. **Team** — Team grid: who, prior work, why this team for this problem
9. **Business model** — How you make money (comparison table or stat grid)
10. **The Ask** — Raise amount, use of funds, milestone for next round
11. **Closing** — Vision restated (dark moment slide)

Seed pitches *can* skip the traction slide if there isn't traction yet. They cannot skip the team slide.

### Storyline 2 · Series A pitch (12–15 slides) — *this is the default*

For founders with product-market fit, raising to scale. Traction is the centerpiece.

1. **Cover**
2. **Mission** (dark moment)
3. **Problem** (big stat + framing)
4. **Solution** (action title + bullets)
5. **How it works** (process flow)
6. **Why now** (three-column)
7. **Market** (TAM/SAM/SOM)
8. **Traction** (stat grid + line chart of growth) ← *the hero slide*
9. **Business model** (comparison table)
10. **Competition** (2×2 positioning)
11. **Team** (team grid)
12. **The Ask**
13. **Closing** (dark moment, vision restated)

The Loop deck in this folder is a worked example of this storyline. Reference it.

### Storyline 3 · Series B / growth pitch (14–18 slides)

For founders with material revenue, raising to accelerate. The deck has more depth — investors will dig into unit economics, retention cohorts, expansion logic.

1. **Cover**
2. **Vision** (dark moment)
3. **The category we're winning** (positioning)
4. **Traction · headline metrics** (stat grid)
5. **Growth chart** (line chart)
6. **Cohort retention** (line chart by cohort) ← *Series B-specific*
7. **Unit economics** (stat grid: CAC, LTV, payback, gross margin)
8. **Why now (still)** — what's changed since the Series A
9. **Product roadmap** (roadmap component, gated)
10. **Market expansion** (where the next growth comes from — MECE tree)
11. **Competition** (2×2 or comparison table)
12. **Team** (team grid, often with senior hires)
13. **The Ask** (use of funds focused on scale)
14. **Closing**

Series B decks frequently include a customer-logo bar or testimonial quote between the traction and market slides. Use the insight/quote component for that.

## Components — what to use, what to avoid

Most of the framework's 46 components work in investor decks, but lean toward these:

**Heavy use:**
- Cover, dark moment slides (`.slide.dark`)
- Big stat (problem framing, "the cost of not acting")
- Stat grid (traction)
- Process flow (how it works)
- Two-column / three-column (why now)
- TAM/SAM/SOM (market)
- 2×2 matrix (competition)
- Comparison table (business model)
- Team grid *(investor-specific component)*
- The Ask *(investor-specific component)*
- Line chart (growth, retention)
- SaaS metrics dashboard (component 43) — traction slide for SaaS businesses
- Pricing & packaging tiers (component 44) — monetisation slide
- Device / UI mockup frames (component 45) — product slide
- The Ask full layout (component 46) — Series A/B ask with donut + cap table + milestones

**Avoid:**
- Harvey Balls — too consulting-y; investors find them sterile
- Risk register, risk matrix — investors will ask about risks verbally; a "risks" slide is a target
- RAG status dashboard, Gantt task list — these are project-management; investors don't want to see operational tracking in a pitch
- Detailed financial bridge (waterfall, cost-benefit) — too dense; replace with one or two stat tiles or the cumulative cash-flow line for runway
- Strategy House — corporate; doesn't fit pitch energy
- Section dividers — pitches are too short to need them; just flow

**Use sparingly:**
- Quote slide (testimonial) — *one* per deck, and only if you have a great quote
- SWOT — generally too generic for investors; replace with a focused 2×2 of competitive positioning
- Tornado/sensitivity chart — fine for a back-of-deck appendix in late-stage decks; never in the main flow

## The investor-specific components

Six patterns introduced for this case (CSS in `investor/deck.html` only):

### Team grid

A row of 3–4 founder cards. Avatar (initials), role, name, prior companies. Mark one card with `.hero` for the CEO/lead founder.

```html
<div class="team-grid">
  <div class="team-card hero">
    <div class="team-avatar">MK</div>
    <div class="team-role">— Co-founder · CEO</div>
    <h4>Maya Kim</h4>
    <div class="team-prior">Prev. <strong>Figma</strong> (Director of PM) · <strong>Stripe</strong>.</div>
  </div>
  <!-- 3 more cards -->
</div>
```

The bio is **one sentence**. Reverse-chronological, prior companies in `<strong>`. Don't list every job. List the two that signal you can build this thing.

Three or four cards. Two reads as "small team — should I be worried?"; five+ reads as "kitchen sink — we couldn't pick."

### The Ask

Left side: the headline amount. Right side: use-of-funds breakdown with horizontal bar fills proportional to allocation.

```html
<div class="ask">
  <div class="ask-amount">
    <div class="a-label">Round · Series A</div>
    <div class="a-number">$8<span class="unit">M</span></div>
    <div class="a-sub">At target valuation of $48M post-money. Co-led by [Lead] and [Co-lead].</div>
  </div>
  <div class="ask-use">
    <div class="au-title">Use of funds · 24-month runway</div>
    <div class="ask-row">
      <div><div class="au-label">Product &amp; engineering</div><div class="au-bar"><div class="au-bar-fill" style="width: 50%;"></div></div></div>
      <div class="au-pct">50% · $4.0M</div>
    </div>
    <!-- 2–3 more rows -->
  </div>
</div>
```

Always 3–4 use-of-funds rows. Always percentages that add to 100%. Always a dollar amount alongside the percentage.

Always include the milestone the round is meant to reach ("target Series B at $10M ARR"). Investors care about *what this money buys you*, not just *what you spend it on*.

---

### SaaS metrics dashboard (component 43)

Use on the **traction slide** when the company is a SaaS business. Replaces a plain stat grid with four purpose-built tiles for ARR, NRR, CAC:LTV, and monthly churn — each with a sparkline or ratio bar and an industry benchmark line.

**When to use:** any SaaS pitch at Series A or later where the audience needs to see unit economics, not just revenue. Skip it for pre-revenue pitches or non-SaaS business models.

**Key rule:** each tile's `.sm-bench` line should state whether the number is good by industry standards — don't force the investor to do the benchmark comparison themselves.

```html
<div class="saas-metrics">
  <div class="sm-tile hero">
    <div class="sm-label">ARR</div>
    <div class="sm-value">$1.2<span class="unit">M</span></div>
    <div class="sm-delta pos">▲ 180% YoY</div>
    <div class="sm-sparkline">
      <div class="sm-spark" style="--h:0.35"></div>
      <div class="sm-spark" style="--h:0.72"></div>
      <div class="sm-spark current" style="--h:1"></div>
    </div>
    <div class="sm-bench good">Top-decile at seed-stage, month 18</div>
  </div>
  <!-- NRR, CAC:LTV, Churn tiles -->
</div>
```

For the CAC:LTV tile, use `.sm-ratio-bar` instead of `.sm-sparkline`: `--cac-w` sets the CAC portion as a percentage; the LTV fills the rest.

---

### Pricing & packaging tiers (component 44)

Use on the **monetisation / business model slide** for SaaS companies. Shows Starter / Pro / Enterprise (or Free / Starter / Pro / Enterprise for a free-tier model) with feature rows and CTAs.

**When to use:** whenever an investor needs to understand how different customer segments are priced and why the expansion motion works. Replaces or augments a comparison table for SaaS pricing.

**Hero column:** exactly one `.pt-col.hero` — the revenue-driving tier that most paying customers land on. This is visually weightier and gets the `.pt-badge` ("Most popular").

**Feature density:** 6–7 feature rows. Fewer than 5 is sparse; more than 8 crowds the cell.

```html
<div class="pricing">
  <div class="pt-col"><!-- Starter --></div>
  <div class="pt-col hero">
    <div class="pt-badge">Most popular</div>
    <!-- Pro column -->
  </div>
  <div class="pt-col"><!-- Enterprise --></div>
</div>
```

Add `.pricing.four-col` for a four-tier layout. The feature list marks available features with `✓` (default) and unavailable with `—` (`.pt-feat.na`). Wrap differentiating words in `<strong>` to make the tier differences scannable.

---

### Device / UI mockup frames (component 45)

Use on the **product slide** when the product is software and you want to show what it looks like without a live screenshot.

**When to use:** any software pitch where there is no screenshot available or where the screenshot would need heavy redaction. Also useful to frame a screenshot: drop an `<img>` inside `.mb-screen` or `.mm-screen` in place of the CSS placeholder.

**Two mockup types:**
- `.mockup-browser` — macOS-style window with traffic-light dots, URL bar, and a sidebar + content area placeholder UI
- `.mockup-mobile` with `.mm-device` — smartphone bezel with notch and 9:16 screen

**Side-by-side:** wrap in `.mockup-wrap` for a flex row layout. The browser stretches to fill; the mobile stays at fixed 140px width. This is the canonical pairing for a product that has both a web and mobile surface.

Replace the CSS placeholder by dropping an `<img src="...">` inside `.mb-screen` or `.mm-screen` when a real screenshot is available — the placeholder disappears and the image fills the space.

The URL bar (`mb-url`) should use the **real product URL** — this is a trust signal, not a placeholder.

---

### The Ask — full layout (component 46)

Use on the **Ask slide** for Series A or later decks where investors need full detail: raise amount + use-of-funds breakdown + post-round cap table + milestones the round achieves.

**When to use:** Series A and B. Use the simpler two-column `.ask` component (above) for seed rounds — a donut chart and cap table in a seed pitch reads as premature.

**Three-column layout:** amount column (left) + donut chart with legend (center) + cap table (right).

**Donut chart:** the `background` of `.af-donut-chart` is set inline as a `conic-gradient`. Convert percentages to degrees (pct × 360) and use cumulative stops. Four segments maximum.

**Cap table bar:** `.act-bar-track` is a flex row of `.act-seg` segments, each with `--w` (percentage) and `--c` (color). Use `var(--c1)` through `var(--c5)` and `var(--ink-1)` / `var(--ink-4)` from the palette.

**Milestones:** three items, always. Format: `M6 →`, `M12 →`, `M24 →` (or the round's relevant timepoints). Lead with the ARR or GMV milestone (`<strong>`), then supporting context.

```html
<div class="ask-full">
  <div class="ask-top">
    <div class="af-amount"><!-- raise amount --></div>
    <div class="af-donut"><!-- donut + legend --></div>
    <div class="af-captable"><!-- bar + rows --></div>
  </div>
  <div class="ask-milestones"><!-- 3 milestone items --></div>
</div>
```

This component replaces the existing `.ask` component for later-stage pitches. Don't include both on the same deck. The simple Ask is for decks where speed of comprehension matters more than detail.

---

## When the user says...

Use these as quick-decision rules for component selection.

| User intent | Component to reach for |
|---|---|
| "Show our growth metrics / traction" | SaaS metrics dashboard (43) if SaaS; stat grid + line chart if not |
| "Show our pricing model" | Pricing & packaging tiers (44) |
| "Show what the product looks like" | Device / UI mockup frames (45) |
| "Show the ask / how we're spending the money" | The Ask full (46) for Series A+; simple Ask component for seed |
| "Show the team" | Team grid (investor-specific) |
| "Show the market" | TAM/SAM/SOM (component 27) |
| "Show the competition" | 2×2 matrix (component 8) |
| "Show how the product works" | Process flow (component 15) |

---

## Slide density rule

**Never produce a slide where more than ~40% of the content area is blank space.** Empty screen reads as unfinished, not minimal. Two strategies depending on content type:

- **Stat/number slides** (stat grid, big stat, The Ask): the CSS components fill and center automatically. The stat grid uses `align-content: center` and `flex: 1 1 auto` — it expands to fill the slide and centers the row of numbers. Never put a four-stat grid on a slide without also adding a narrative sentence below that interprets the data for the investor.
- **Text slides** (bullets, three-col): fill the space. A four-bullet solution slide with one sentence per bullet will have 50% blank space — deepen the bullets, add a sub-point, or use a stat to anchor the claim.
- **Dark moment / vision slides**: these intentionally breathe. They use `justify-content: center` to vertically center a title + subtitle. This is correct. Don't add more content just to fill the space.

When reviewing a slide you've written: look at the bottom half. If it's blank, either add content or restructure.

## Common mistakes

- **The traction stat grid with no context.** Four big numbers and no comparison or trend isn't traction — it's bragging. Always include a YoY/MoM delta or comparison.
- **Two slides of competition.** One. A 2×2 with your hero quadrant, period. The second slide invites comparison; the first asserts position.
- **Team slides with bios.** Three lines per founder, max. Investors scan the prior-company logos; they don't read paragraphs.
- **The Ask with no valuation.** "Raising $8M" without "at $48M post" reads as evasive. Either show the valuation or skip the slide.
- **A "thank you" final slide.** End on vision restated, with contact info in small mono at the bottom. No "thank you," no "questions?"
- **Using enterprise components.** Risk registers, RAG dashboards, and detailed Gantts are operational tools — they belong in a board pack, not a pitch. They make founders look like middle managers.
- **Quoting a customer who isn't recognizable.** A testimonial from "John D., user" is dead weight. Either you have a quote from someone investors recognize (a CTO at a known company) or you skip the quote slide.
- **More than 15 slides.** If your deck won't fit in 15 slides, the deck isn't the problem — the story is.

## When the user asks you to build an investor deck

1. **Confirm the case.** "Sounds like an investor pitch — for a seed round, Series A, or later? And what's the audience — VCs, angels, or strategics?"
2. **Confirm traction posture.** "How much traction do you have? Roughly — revenue, users, growth rate?" This determines whether to lead with team or with metrics.
3. **Draft the vision slide first.** One sentence. If the human can't agree on one sentence describing the world they're building, the deck has nothing to build around.
4. **Lock the storyline** before writing slide content. Show them the 12–15 slide outline and confirm before drafting body copy.
5. **Numbers first.** For each slide that needs a number, ask for the real one. Do not invent placeholder numbers; mark them `[NUMBER NEEDED]` and flag.
6. **Iterate on action titles** before any body copy. The titles, read in order, should tell the whole story even if the body never gets read.
7. **Refuse to bloat.** If the user wants slide 16, push back. The investor case rewards discipline. Tell the user the slide they want to add is probably an appendix slide.

## Final note

The investor case has more emotional latitude than enterprise. The deck is supposed to make someone *feel* that they want to be part of this. Don't overdo it — the framework is still designed for executives — but allow one moment where the deck breathes. The dark mission slide is usually that moment. So is the closing.

The framework's restraint is the floor, not the ceiling. On a pitch deck you can stand on that floor and reach higher.
