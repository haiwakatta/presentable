# Presentable

An HTML deck framework built for the LLM-with-human workflow. **One foundation. Three cases.** Each deck is a self-contained `.html` file — no build step, no JavaScript framework, no install beyond the optional PDF exporter. The discipline is rooted in classical consulting structure: Pyramid Principle, action titles, SCR, MECE.

> **Running this locally for the first time?** See **[LOCAL_SETUP.md](./LOCAL_SETUP.md)** — covers prerequisites, the QA checklist, Claude Code integration, and pushing to GitHub.
>
> **Want to build a deck for your situation?** See **[NEW_DECK.md](./NEW_DECK.md)** — the manual and Claude Code workflows, the storyline picker, and a fully worked example (13-slide business case for an analytics team in a warehousing company, using a deliberately different component mix than the generic business case).

The same component library — 46 components and 7 chart types — serves three very different audiences:

- **Enterprise** decks for executives, boards, and clients (consulting-grade strategy work)
- **Investor** decks for startup pitches (seed, Series A/B)
- **Portfolio** decks for designers, case studies, and personal-brand work

Each case has its own visual theme, its own storyline conventions, its own tone discipline — and its own LLM agent (`AGENTS.md`) that knows how to do that case well.

## The three cases at a glance

| | Enterprise | Investor | Portfolio |
|---|---|---|---|
| **For** | Strategy decks, business cases, board updates, GTM plans, 100-day plans, proposals | Seed / Series A / Series B pitch decks | Designer portfolios, project case studies, personal-brand decks |
| **Audience** | Executives, boards, CFOs, clients | VCs, angels, strategic investors | One client, one hiring manager, conference organizers |
| **Decision asked for** | Approve a strategy or investment | Allocate capital | None — leave an impression |
| **Aesthetic** | Editorial-executive (HBR × McKinsey) | Bold-modern (Linear × Sequoia) | Editorial-warm (designer's notebook) |
| **Display font** | Fraunces (variable serif) | Bricolage Grotesque | Newsreader |
| **Body font** | Manrope | Sora | Instrument Sans |
| **Background** | White | White + dark moment slides | Warm cream `#f5f1e8` |
| **Ink scale** | Cool grays `#0a0a0a → #c4c4c4` | Cool grays, punchier black | Warm browns `#2a241d → #c4baa9` |
| **Accent** | Deep blue `#1a4d7a` (rare) | Vivid orange `#ea580c` (confident) | Muted terracotta `#a05a3c` (typographic only) |
| **Density** | High — text and tables | Low — one moment per slide | Low-medium — image-led |
| **Typical length** | 15–25 slides | 12–15 slides | 8–12 slides |
| **Showcase deck** | 50 slides demonstrating every component | 17-slide Loop Series A pitch | 10-slide Ana Rivera portfolio |

## Folder map

```
presentable/
├── README.md                    ← this file
├── AGENTS.md                    ← foundation agent (shared by all cases)
├── export-pdf.js                ← Playwright PDF exporter
├── package.json                 ← npm scripts: pdf / csv / brand-check / brand-init / theme / dev
├── csv-to-chart.js              ← CLI: parse a .csv and emit a chart slide (8 types, auto-detects)
├── brand-lock.js                ← CLI: validate a deck against brand.lock; generate lock from :root
│
├── enterprise/
│   ├── deck.html                ← 50-slide showcase: every component, every chart
│   ├── theme-builder.html       ← brand-research theme tool with AI prompt helper
│   ├── AGENTS.md                ← enterprise case overlay
│   └── examples/
│       ├── business-case.html                       ← focused 11-slide business case (generic)
│       └── business-case-warehousing-analytics.html ← 13-slide worked example: analytics team in a 3PL
│                                                      (uses stat grid, Harvey Balls, initiative cards,
│                                                       tornado, financial tiles, workstreams, scored risks)
│
├── investor/
│   ├── deck.html                ← 17-slide Series A pitch (Loop · B2B SaaS demo)
│   ├── theme-builder.html       ← image-upload theme tool with color extraction
│   ├── AGENTS.md                ← investor case overlay
│   └── examples/
│       └── seed-pitch-sundial-health.html ← 11-slide seed pitch (Sundial Health · primary-care AI scheduling)
│                                            (uses dark big-stat, early-signal stat grid, dark team grid,
│                                             workstreams, comparison table — deliberately not 2x2)
│
└── portfolio/
    ├── deck.html                ← 10-slide designer portfolio (Ana Rivera · multi-project overview)
    ├── theme-builder.html       ← color-picker theme tool with palette derivation
    ├── AGENTS.md                ← portfolio case overlay
    └── examples/
        └── case-study-marfa-bookshop.html ← 10-slide single-project case study (Theo Park · brand redesign)
                                              (uses multiple image+text splits, 2×2 detail grid,
                                               banner hero, two-col reflection — deeper than portfolio overview)
```

**Each example is deliberately a different mix of components from the showcase deck**, demonstrating that the storyline shapes the spine and the components are chosen per situation — not copied template-to-template. See [NEW_DECK.md](./NEW_DECK.md) for the principle and the workflow.

## Theming each case

Every case has its own dedicated **theme builder** (`<case>/theme-builder.html`) — a self-contained HTML tool, no install, that turns case-appropriate inputs into a copy-pasteable `:root` CSS block. The three builders are designed around how each case is *actually* themed in practice:

| Case | Input mechanism | Best for |
|---|---|---|
| **Enterprise** | Company name + generated AI research prompt | "Build this deck for Acme Corp" — the tool generates a Claude-ready prompt to research the real brand guidelines, then you plug the values back in |
| **Investor** | Drag-drop logo, deck screenshot, or product image | Canvas extracts the dominant colors from the image; you assign roles (accent / ink) by clicking the swatches |
| **Portfolio** | Base color + style preset + warm/cool toggle | Algorithmic palette derivation via HSL math; six presets (warm editorial, monochrome, cool studio, library, dusty rose, midnight) plus custom |

All three builders include a live preview, a derived-tokens panel showing every variable, and a copy-paste `:root` block. The output drops into the case's `deck.html` — the whole deck retones to the new theme, all 46 components, every chart.

Open each tool by double-clicking the HTML file (or `open enterprise/theme-builder.html` from a terminal). Detailed per-case theming guidance is in each case's `AGENTS.md`.

## What's shared, what isn't

**Shared (foundation):**
- 46 components — covers, section dividers, exec summary, SCR, action titles, stat grids, 2×2 matrix, Strategy House, MECE tree, roadmap, options assessment, risk matrix, Harvey Balls, stakeholder directory, SWOT, persona, TAM/SAM/SOM, financial tiles, RAG dashboard, SaaS metrics, pricing tiers, system topology, BPMN swimlane, mockup frames, image gallery, project hero, and more
- 7 chart types — line, horizontal bar, stacked column, waterfall, cost-benefit (mixed-sign stacked), cumulative cash flow (with break-even marker), tornado / sensitivity
- Navigation, progress bar, keyboard shortcuts, deep links via `#3`
- PDF export (browser print dialog + headless Playwright)
- The CSS-variable design-token system (the *names* of the tokens)
- `csv-to-chart.js` — CLI that parses a `.csv` and emits a ready-to-paste `<section>` chart slide (8 types, auto-detection)
- `brand-lock.js` — CLI validator that checks a deck against a `brand.lock` file for color, font, and style drift

**Per case:**
- Theme token *values* (fonts, background, ink, accent)
- Storyline conventions (which slides go where, in what order)
- Tone discipline (what voice is appropriate)
- Which components are favored, which are off-limits
- Case-specific demo content

Same engine. Different bodies.

## The AI workflow

Each case has its own `AGENTS.md` file. The recommended workflow:

```
1. Identify the case (enterprise / investor / portfolio)
2. Read the foundation: AGENTS.md (root)
3. Read the case overlay: <case>/AGENTS.md
4. Open the case's deck.html as the working file
5. Tell the agent the recommendation, audience, and decision being asked
6. Agent picks the case-appropriate storyline
7. Agent drafts the strongest slide first (exec summary, vision, or cover line)
8. Iterate on action titles before body content. Always.
9. If the human has data in a .csv file, run csv-to-chart.js — don't hand-write chart JSON
10. Before hand-off: npm run brand-check -- <deck.html> (if a brand.lock exists in the repo)
```

When working with Cursor, Claude Code, or any agentic LLM, the agent reads the foundation file plus the case file and produces case-appropriate output. The case files differ enough that an enterprise agent will produce a different deck than an investor agent given the same brief — that's the design.

## Quick start

Open any case's showcase deck in a browser:

```
enterprise/deck.html       # 50-slide enterprise showcase
investor/deck.html         # 17-slide investor pitch (Loop)
portfolio/deck.html        # 10-slide designer portfolio (Ana Rivera)
```

No install, no build. Navigate with `←` `→` arrow keys, space, swipe, or the on-screen buttons. Hit `P` (or the **⤓ PDF** button) to export to PDF via the browser's print dialog.

To build your own deck:

1. Copy a case's `deck.html` to a new filename (or just edit it in place)
2. Replace the slide content with yours
3. The `:root` token block at the top of `<style>` is where you'd retheme — change the accent color, swap fonts, etc.
4. The slide counter, progress bar, and navigation auto-update

## PDF export

Browser print dialog works for quick iteration (`P` key or button). For deterministic output — same on every machine, reliable handling of charts inside hidden slides, scriptable into CI:

```bash
npm install                                              # one-time, fetches Chromium
npm run pdf:enterprise                                   # → enterprise/deck.pdf
npm run pdf:investor                                     # → investor/deck.pdf
npm run pdf:portfolio                                    # → portfolio/deck.pdf
npm run pdf:all                                          # all three at once

# Or invoke the exporter directly:
node export-pdf.js enterprise/deck.html                  # → enterprise/deck.pdf
node export-pdf.js investor/deck.html out/pitch.pdf      # custom output path
```

Use the browser button while iterating. Use Playwright when the PDF leaves your machine.

## Keyboard shortcuts

| Key | Action |
|---|---|
| `→` / `Space` / `PageDown` | Next slide |
| `←` / `PageUp` | Previous slide |
| `Home` / `End` | First / last slide |
| `P` | Export PDF |

## Embed mode

Append `?embed` to the URL to hide the navigation chrome and progress bar. Useful for screenshots, recordings, or iframe embeds.

## Which AI does the work?

Presentable is **model-agnostic**. The framework is just files — HTML decks, theme builders, and `AGENTS.md` instruction files — that any capable LLM can read.

The `AGENTS.md` convention is read natively by **Claude Code** (recommended; the framework is designed around it). It also works with **Cursor**, **Windsurf**, **GitHub Copilot**, and any agentic editor that ingests files from the workspace — though those tools have their own additional configuration formats (e.g., `.cursor/rules`, `.github/copilot-instructions.md`) you can mirror the content into if you want native pickup. You can also work with plain **Claude.ai**, **ChatGPT**, or **Gemini** by pasting the relevant `AGENTS.md` into the chat alongside your request.

What matters more than the model is **context length**. The root `AGENTS.md` is ~1,250 lines; each case overlay adds 300–400 more. Models with shorter context windows (smaller open-source models, older API versions) will struggle to keep the framework's discipline in view across a long deck-building session. Modern frontier models from any provider handle it comfortably.

## License

MIT. Use it, fork it, ship it. If you build something interesting on top, send it.
