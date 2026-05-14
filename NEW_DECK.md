# Creating a new deck for your situation

You have a real situation — a board update, a Series A pitch, a portfolio case study, a business case for a new analytics team in your warehousing company — and you want a deck. This guide is how.

## The mental model

Each case folder contains **three different kinds of files**, and confusing them is the most common mistake:

| File | What it is | What to do with it |
|---|---|---|
| `<case>/deck.html` | The **showcase** — demonstrates every component the framework offers (46 slides for enterprise). | Reference. Don't edit. Browse it to see what's possible. |
| `<case>/AGENTS.md` | The **agent overlay** — case-specific principles, storylines, tone, common mistakes. | Reference for the LLM. Read it when you want to know what shape your deck should take. |
| `<case>/examples/*.html` | **Focused templates** — real, lean decks that follow one specific storyline (e.g., an 11-slide enterprise business case). | **Copy and edit**, or feed to Claude Code as a starting point. |

**Showcases are the framework's documentation. Examples are starting points.** Always start from an example or from scratch, never by editing the showcase.

## The two workflows

### Workflow A — Manual

Best when you know exactly what you want and prefer typing HTML.

```bash
# 1. Pick the case + storyline that matches your situation
#    (Use the table below)

# 2. Copy the nearest example to a new file
cp enterprise/examples/business-case.html enterprise/my-business-case.html

# 3. Open in editor; replace each <section class="slide"> with your content,
#    keeping the same component classes. Update the counter at the bottom.

# 4. Open in browser to preview as you go
open enterprise/my-business-case.html   # macOS
```

### Workflow B — Claude Code (recommended)

Best when you want to talk through the deck instead of write HTML.

```bash
cd presentable
claude                                  # opens Claude Code in this directory
```

Then prompt:

> *"I need to build a business case for hiring a 6-person analytics team in my warehousing company. We're a 3PL with 6 facilities and $84M revenue. The audience is the CEO, CFO, and COO. The decision being asked is approval of the hiring plan and $2.1M Year-1 budget."*

Claude will:
1. Read the root `AGENTS.md` → identify this as the **enterprise** case
2. Read `enterprise/AGENTS.md` → pick the **Business Case** storyline
3. Ask clarifying questions about the recommendation, the value at stake, and the risks
4. **Draft the executive summary slide first** — if that lands cleanly, the rest of the deck has a spine
5. Build slide-by-slide, with you iterating on action titles before body content
6. Output to a new file (e.g., `enterprise/warehousing-analytics-case.html`)

What Claude Code is doing internally is exactly what Workflow A does manually — it just removes the typing and adds judgment from the case AGENTS.md.

## Pick the right case and storyline

| Your situation | Case | Storyline | Nearest example |
|---|---|---|---|
| Multi-year business strategy | enterprise | Business Strategy (15–25 slides) | (none yet — build from showcase) |
| **Investment justification with $$ and ROI** | **enterprise** | **Business Case (10–18 slides)** | **`enterprise/examples/business-case-warehousing-analytics.html`** (13 slides, 3PL analytics team) or **`enterprise/examples/business-case.html`** (11 slides, generic) |
| Quarterly board update / QBR | enterprise | Board Update / QBR (8–14) | (none yet) |
| One-page exec summary | enterprise | Executive Summary (1–3) | (none yet) |
| Pitching a consulting engagement | enterprise | Consulting Proposal (12–20) | (none yet) |
| Launching a product or entering a market | enterprise | Go-to-Market (12–20) | (none yet) |
| New leader's first 100 days | enterprise | 100-Day Plan (10–15) | (none yet) |
| Market or competitor analysis | enterprise | Market Teardown (10–15) | (none yet) |
| **Seed pitch (limited traction)** | **investor** | **Seed pitch (10–12)** | **`investor/examples/seed-pitch-sundial-health.html`** (11 slides, healthcare AI) |
| **Series A pitch (product-market fit)** | **investor** | **Series A pitch (12–15)** | **`investor/deck.html`** (13 slides, Loop · B2B SaaS) |
| Series B / growth round | investor | Series B (14–18) | (none yet) |
| **Designer / freelancer portfolio** | **portfolio** | **Portfolio overview (8–12)** | **`portfolio/deck.html`** (10 slides, Ana Rivera) |
| **Single-project deep case study** | **portfolio** | **Case study (8–10)** | **`portfolio/examples/case-study-marfa-bookshop.html`** (10 slides, Theo Park · brand redesign) |
| Personal-brand / speaker deck | portfolio | Personal-brand (6–10) | (none yet) |

Storylines without an example today: copy the nearest existing example or showcase, and use Claude Code to restructure to the storyline's slide order (documented in `<case>/AGENTS.md`).

---

## Worked examples — three demonstrations of the principle

The repo includes one focused example per case, each demonstrating that the **storyline is the spine but the components are picked per situation**:

| Example | Case | Storyline | Lives at | Component mix that's distinct |
|---|---|---|---|---|
| Meridian Warehousing — analytics team business case | enterprise | Business Case (13 slides) | `enterprise/examples/business-case-warehousing-analytics.html` | stat grid · Harvey Balls · initiative cards · tornado · financial tiles · workstreams · scored risk register |
| Sundial Health — seed pitch | investor | Seed pitch (11 slides) | `investor/examples/seed-pitch-sundial-health.html` | dark big-stat · "early signal" stat grid · dark team grid · workstreams · comparison table (NOT the Loop deck's 2×2) |
| Theo Park — Marfa Bookshop case study | portfolio | Case study (10 slides) | `portfolio/examples/case-study-marfa-bookshop.html` | multiple image+text splits · 2×2 detail grid · banner hero · two-col reflection (deeper than Ana Rivera's multi-project overview) |

**Open each one in a browser before you start building your own deck.** Looking at three case-specific examples side by side teaches the principle faster than any prose.

---

## Worked example — building the warehousing analytics business case

The warehousing case is the most detailed of the three examples. Walking through it:

**`enterprise/examples/business-case-warehousing-analytics.html`** — 13 slides, real numbers, real risks, ready to edit.

The scenario: **Meridian Warehousing**, a fictional mid-size 3PL (6 facilities, 380 employees, $84M revenue), proposing a $2.1M Year-1 investment in a 6-person internal analytics team, returning $4.6M of operating value by month 24.

### The 13-slide structure (a meaningfully different mix from `business-case.html`)

The warehousing example deliberately uses *different* components than the generic business-case example, to show that the framework's component library lets you adapt the storyline shape to the situation. Same Business Case spine; different evidence.

1. **Cover** — title, recommendation, audience, who prepared it
2. **Executive Summary** — recommendation + 3 supporting arguments in Pyramid Principle form (the whole deck in one slide)
3. **Stat grid** — current-state operating baseline: $84M revenue, 72% network OEE, -280 bps margin trend, 31% RFP win rate
4. **Harvey Balls** — Meridian vs three competitors across six analytics dimensions, plus a "M24 target" row showing where the team gets us to
5. **Big stat (cost of inaction)** — $3.1M margin loss over 24 months from staying with monthly reporting
6. **Value decomposition (MECE tree)** — $4.6M = $1.8M inventory + $1.4M labor + $0.8M throughput + $0.6M forecasting
7. **Initiative cards (Why / What / How)** — three cards for the team's three execution initiatives (slotting, labor scheduling, customer-facing throughput + forecasting)
8. **Options considered** — Do nothing / Consultants / Build in-house / SaaS, recommended highlighted
9. **Tornado / sensitivity** — value-capture rate and labor savings drive 65% of NPV variance
10. **Financial tiles with gauges** — NPV $7.2M / IRR 67% / Payback 14mo / ROI 3.7×, each shown vs target with a gauge bar
11. **Workstreams / Gantt** — four parallel workstreams over 18 months: team build, slotting model, labor scheduling, throughput + forecasting
12. **Risk register (scored)** — six risks with impact × likelihood scoring, mitigation cost, and mitigation ROI
13. **Decision required** — one approval today, three workstreams launching in 30 days

**Components in this deck that the basic `business-case.html` doesn't use:** stat grid, Harvey Balls, initiative cards (Why/What/How), tornado/sensitivity chart, financial tiles with gauges, workstreams/Gantt, and the scored risk register. That's 7 of the 13 slides demonstrating components not in the generic example.

This is the principle for every new deck you build: **pick the components that match your evidence, not the components from the nearest example**. The storyline (Business Case → Cover → Exec Summary → diagnosis → options → financial case → plan → risks → close) is the spine; the components are the muscle on the bone, and they should differ from deck to deck.

Read through it. Every slide follows the framework's rules — action titles state conclusions, sources at the bottom, one message per slide, the recommendation lives on slide 2 (not slide 12).

### How to adapt it for *your* business case

If your situation is similar in shape (an investment, a return, a plan, an ask):

1. Copy the file: `cp enterprise/examples/business-case-warehousing-analytics.html enterprise/my-case.html`
2. Replace the cover: company name, deck title, audience, author.
3. **Replace the exec summary first.** Until you can write a clean recommendation + 3 supports, the rest of the deck has nothing to hang from. Don't move on until this lands.
4. Update the stat-grid baseline (slide 3) with your real current-state numbers.
5. Update the Harvey Balls comparison (slide 4) — your dimensions, your competitors, your scoring. Add a "target state" row if your situation has one.
6. Replace the big-stat cost-of-inaction (slide 5) with your number.
7. Update the MECE value decomposition (slide 6) — the pools have to be mutually exclusive; no overlapping categories.
8. Update the initiative cards (slide 7) with your real initiatives. Each card is Why / What / How.
9. Update options (slide 8). Always include "do nothing" — it's the honest counter-factual.
10. Update the tornado / sensitivity (slide 9) with your real assumption drivers. Most cases have 5–7; rank by impact on NPV.
11. Update the financial tiles (slide 10) with your real NPV / IRR / Payback / ROI. Adjust the chart data (the JSON inside `data-chart=`) with your cash flow.
12. Update workstreams (slide 11) with your real execution streams, owners, durations.
13. Update the scored risk register (slide 12). Six rows is the right cadence; more reads as anxiety, fewer reads as wishful thinking.
14. Update the decision-required slide (slide 13) — what specific approval is needed, what launches in the next 30 days, who owns each thing.
15. Bump the counter at the bottom if you've added or removed slides.

### How to do the same with Claude Code

Open Claude Code in the project root. Give it the brief:

> *"Adapt `enterprise/examples/business-case-warehousing-analytics.html` to my situation: I'm a VP of Engineering at \[company\], proposing a $X investment in \[initiative\], returning $Y by month \[N\]. The audience is the CEO and the board. The four value drivers are A, B, C, D. The three biggest risks are X, Y, Z. Output to `enterprise/my-business-case.html`."*

Claude will read the warehousing example as a structural reference, the Business Case storyline from `enterprise/AGENTS.md` as the spine, and produce your version. Iterate by reading the slide titles back to you:

> *"Read me the slide titles 1–13. Are they telling the story I want to tell?"*

If they aren't, fix the titles first. Body content follows from titles, not the other way around.

---

## Common questions

**"Can I skip slides I don't need?"**
Yes, but with discipline. Skipping the Options slide because "we know what to do" is the most common mistake — it hides the strategic choice. Skipping the Risk slide because "we don't have material risks" usually means you haven't thought hard enough. Other slides are more genuinely skippable: skip SCR if your audience already knows the situation cold; skip the big-stat if you have a stronger opener.

**"Can I add slides the example doesn't have?"**
Yes. Common additions for business cases: a buyer-persona slide (if value depends on a specific customer profile), a pricing comparison table, a competitive positioning 2×2, a workstream / Gantt for the execution plan. All these components exist in the showcase deck (`enterprise/deck.html`) — copy the `<section>` block from there.

**"What if my situation doesn't fit any storyline?"**
Look at the case AGENTS.md storylines table. If nothing matches, your situation is probably either (a) a hybrid — start from the closest storyline and add 2–3 slides from another, or (b) genuinely novel — design the storyline first by listing the 8–14 slide titles, in order, that would make the argument. Then build.

**"Should I use the theme builder before or after building the deck?"**
Either works, but **build the content first**. Themes are easy to swap (one `:root` block); content is hard. If you spend the first 30 minutes picking colors you don't have a deck yet. The default enterprise theme works for any business case; theme it after the slides are tight.

**"How do I make the charts work?"**
The 7 chart types are documented in the root `AGENTS.md` under "Chart components" with JSON examples. The data lives in the `data-chart` attribute on a `<canvas>` element. For each chart type there's a recommended use ("line for trajectory, bar for ranking, waterfall for bridge"). If your finding doesn't fit any of the 7, it's usually not a chart — it's a stat grid.

**"Where do real images go?"**
The framework's portfolio case has an `.image-block` placeholder pattern. In real use, replace `<div class="image-block">...</div>` with `<img src="path/to/your-image.jpg" class="image-block">`. Images live in a `media/` folder you create alongside the deck file. For enterprise and investor cases, images are rare — the framework is text-and-chart-first.

---

## The thing to remember

The framework rewards **arguing well, not designing fancier**. A deck with 12 sharp action titles and 4 charts beats a deck with 30 slides and 15 charts every time. When you're choosing what to put on slide 7, ask: *what conclusion does this slide deliver?* If you can't answer in one sentence, the slide isn't ready yet — go back to titles.

When in doubt, write fewer slides. The framework is built to make that easier.
