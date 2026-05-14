# Presentable — Enterprise case agent

You are helping a human build a **consulting-grade enterprise deck** using the framework. Read the root `AGENTS.md` first for the foundation (components, charts, design tokens, PDF export). This file is the **enterprise case overlay** — the consulting principles, storylines, and tone that make enterprise decks land.

## What this case is for

The enterprise case covers any **strategic-thinking artifact** for an enterprise audience:

- Multi-year business strategies and BU strategies
- Business cases justifying investment with NPV / IRR / ROI
- Board updates, QBRs, quarterly business reviews
- Executive summaries and one-pagers
- Consulting proposals
- Go-to-market plans
- 100-day plans for new leaders
- Market analyses, competitive teardowns, due diligence summaries

Three tells that someone wants the enterprise case:
- The audience is described as "executives," "the board," "the CFO," "leadership team," or a client
- The decision being asked for is *approval of a strategy or investment* — not capital, not a portfolio review
- The language used is consulting-coded ("MECE," "exec summary," "options analysis," "Pyramid Principle," "strategic choice")

If unsure between enterprise and investor: ask. The clearest tell is the audience — venture investors deciding to fund a startup gets investor; an enterprise board deciding to fund an initiative gets enterprise.

## Theme

Pre-themed in `enterprise/deck.html`. Tokens at `:root`:

- **Background:** pure white `#ffffff` with subtle off-white `#fafaf8` tints
- **Ink:** cool grayscale, `#0a0a0a` → `#c4c4c4`
- **Accent:** deep blue `#1a4d7a` — used sparingly (never decoratively)
- **Lines:** cool hairlines `#ececec`, `#d4d4d4`
- **Fonts:** Fraunces (variable serif display) + Manrope (sans body) + JetBrains Mono (labels)
- **Type scale:** measured — `--title-size: clamp(26px, 3.2vw, 40px)`
- **Spacing:** standard — `--slide-pad-y: 5vh; --slide-pad-x: 6vw`

The Fraunces serif at display sizes is what gives the deck its editorial-executive register. It's not "fun" — it's the typographic equivalent of a senior partner writing for a CFO. Use `font-variation-settings: "opsz" 72` on cover and large titles.

The accent color is *almost never used*. Enterprise decks earn credibility through restraint. Apply blue only on:
- The italic `em` in cover and one or two section titles (typographically, not chromatically)
- A single chart series when it must stand out from the ink scale
- The hero quadrant background in a 2×2 matrix

Never use the accent for body text, table cells, decorative bars, or "to make it pop." A deck that pops doesn't read as consulting — it reads as marketing.

## Theming workflow

The enterprise case ships with **`enterprise/theme-builder.html`** — a self-contained tool that turns a company name and brand inputs into a copy-pasteable `:root` CSS block.

### When the user wants to retheme for a specific company

If the user says "build this deck for Acme Corp" or "use Stripe's brand colors" or anything that names a real company:

1. **Open `enterprise/theme-builder.html`** in the browser (or describe to the user how to do so). It's the canonical theming surface for this case.
2. The user types the company name into the tool. The tool generates an AI research prompt tailored to that company.
3. **You do the research.** If web search is available to you, run the generated prompt yourself: look up the company's brand guide, footer, press kit, or design system page. Find:
   - Primary brand color (hex)
   - Display typeface (with a Google Fonts substitute if it's custom)
   - Body typeface (same substitute rule)
4. Report the values back in the structured format the prompt requests. The user pastes them into the tool, sees the live preview, and copies the generated `:root` block.
5. The user replaces the `:root` block in `enterprise/deck.html` and updates the Google Fonts `<link>` per the comment in the generated CSS.

### What "branded" means for enterprise

Enterprise theming is the most *constrained* of the three cases. The discipline:

- **One brand color.** Map the company's primary brand color to `--accent`. Do not add a secondary or tertiary color to the deck — restraint is the enterprise aesthetic.
- **Keep the ink scale neutral.** Even if the company has a "warm" or "cool" brand, leave the ink scale at the framework defaults (cool grays from `#0a0a0a` to `#c4c4c4`). Branded ink scales make the deck read as marketing material, not strategy.
- **Match the typeface category, not the exact font.** If the company uses Söhne, pick a clean modern sans like Inter or Manrope as the substitute. If they use a proprietary serif, pick Fraunces, Source Serif 4, or Lora. The reader's eye reads typeface *category*, not the specific cut.
- **Don't change the spacing or geometry tokens.** Type scale and slide padding stay at enterprise defaults — they're what makes the deck feel like consulting.

### Common cases

- **"Build this deck for [BigCo]"** — open the theme builder, research the brand, plug in the values, regenerate CSS. Then update the cover slide's company mark and any references to the company name throughout the deck.
- **"Match the brand book on this PDF I'm sharing"** — read the PDF for hex codes and font names; plug them in manually. The brand book is more authoritative than web search.
- **"They don't have a public brand guide"** — find the primary CTA color on the company's homepage as a fallback. Pair with Fraunces and Manrope (the framework defaults). The deck will still read as consulting-grade even without a perfect brand match.
- **"Match the prior deck I'm sharing"** — extract the accent color from the prior deck's title or first emphasized element. Note: if the prior deck is a typical PowerPoint, its color palette is probably not branded — confirm with the user before inheriting.

### What the theme builder does NOT do

The theme builder generates the `:root` CSS block. It does *not*:
- Edit `deck.html` for you — you (the assistant) or the user does that
- Update the cover slide's company name — you do that
- Update the source-line attributions throughout the deck — you do that
- Suggest a storyline — that's case-and-context dependent and is your job

Think of the theme builder as the *theming primitive*; the surrounding work is yours.

## THE NON-NEGOTIABLE PRINCIPLES

These eight principles separate consulting-grade work from amateur slides. They are not style preferences. They are the actual logic of how strategic arguments are made. **If you violate them, the deck stops being consulting-grade. You will not be told this politely later — you will be told it now.**

### 1. Action titles

Every slide headline is a **complete sentence that states the conclusion**. The reader can flip through only the titles and follow the argument.

❌ "Market overview"
❌ "Our competitive position"
❌ "Strategic options"
❌ "Key findings"

✅ "Mid-market is the largest underserved segment, growing 22% CAGR."
✅ "We hold third position in a market where the top two are consolidating."
✅ "Only one of four options meets the 2029 EBITDA target at acceptable risk."
✅ "Three forces are compressing the enterprise core simultaneously."

Action titles are usually 8–18 words. They contain a subject, a verb, and a conclusion. If the title could sit above ten different slides, it is not an action title — it's a topic label, and topic labels are amateur-hour.

Test: read the slide titles in order, ignoring everything else. Do they tell a story? If they read like a table of contents, every one of them is wrong.

### 2. Pyramid Principle

State the most important thing first. The conclusion goes at the top, then supporting arguments, then evidence. This applies at three levels:

- **The deck.** First substantive slide is the executive summary, which states the recommendation and 3 supporting arguments. Everything after elaborates.
- **The slide.** Action title is the conclusion. Body is the support.
- **The sentence.** Lead with the point, then qualify.

The executive summary slide should be a complete miniature of the entire deck. A reader who reads only that slide should understand the recommendation and the three reasons for it.

### 3. One message per slide

Every slide carries exactly one message. If a slide has two conclusions, split it into two slides. Density of evidence is fine; density of conclusions is not.

Test: can you write one action title that captures everything important on the slide? If yes, the slide is one message. If you'd need an "and" to join two ideas, split.

### 4. SCR storyline (Situation, Complication, Resolution)

The default narrative arc for any persuasive document. Used as the spine of business cases, proposals, and recommendations.

- **Situation:** What is true today. The shared context the reader already accepts.
- **Complication:** What changed, or what we discovered, that makes the situation no longer adequate.
- **Resolution:** What we propose to do about it.

A consulting deck without SCR somewhere in its DNA tends to drift into "here is everything we know" — which is not a recommendation. Use the SCR component explicitly when you need to anchor the reader, or distribute it across three sections of the deck.

### 5. MECE thinking

When listing options, segments, drivers, causes, or anything decomposable: **Mutually Exclusive, Collectively Exhaustive.** No overlaps. No gaps.

If you list "EBITDA growth comes from new revenue, cost reduction, and core retention," that's MECE — every dollar lands in exactly one bucket. If you list "growth comes from new customers, product expansion, and SMB" — that's not MECE, because SMB overlaps both other categories.

When the AI proposes a three-column slide, three pillars, or any decomposition, it must justify the MECE-ness. If it can't, restructure.

### 6. The "So what?" test

Every chart, table, stat, and finding must answer: *Why does the reader care?* If you cannot answer in one sentence, either:

- the action title needs to be sharper (most common fix), or
- the slide should be cut.

A 2×2 matrix with no quadrant labeled "where we are" or "where we should be" fails the test. A stat grid with no comparison or implication fails the test. A timeline with no decision gate fails the test.

### 7. Strategic choice means saying no

A real strategy specifies what the organization will **not** do. "Do everything well" is not a strategy. The deck must, somewhere, name the things being deprioritized, sunsetted, or rejected.

If the deck has a "what we will invest in" slide but no "what we will not invest in" slide, you have written an aspiration, not a strategy. Add the negative explicitly — it's where the credibility lives.

### 8. Make hypotheses explicit

When a recommendation rests on assumptions (it always does), say so. Use phrases like "this rests on three assumptions" or "the recommendation breaks if X is false." This is not weakness — it is the marker of senior thinking. Executives trust analyses that surface their own fragility.

A risk register or risk matrix is one way to do this. Inline phrases like "assuming Vendor A does not enter SMB before 2027" are another.

### Cross-cutting habits

- **Cite sources.** Every analytical slide has a source line at the bottom. No exceptions.
- **Specific numbers beat adjectives.** "22% CAGR" beats "rapid growth." "$80M over 36 months" beats "significant investment."
- **No exclamation points.** Anywhere. Consulting decks do not shout.
- **No emojis.**
- **No buzzwords.** Synergize, leverage (as a verb), unlock value, world-class. If a CFO would roll their eyes, cut it.

## Storylines

A storyline is the **sequence and structure** of a deck — what slides appear, in what order, in service of what argument. The right storyline is half the work; the components only realize it.

Pick the storyline that matches the document type. Each is described as a slide-by-slide sequence with the recommended component.

### 1. Business Strategy (15–25 slides)

Multi-year direction for a business unit or company. The classic strategy deck.

1. Cover
2. Executive Summary *(Pyramid)*
3. Section I: **Diagnostic** — where are we, why must we change
4. SCR slide
5. Stat grid (current state)
6. Action-title + bullets (forces compressing us)
7. Section II: **Choice** — what we will and will not do
8. 2×2 matrix (portfolio choice)
9. Strategy House (architecture)
10. Pyramid summary (why this works)
11. Two-column (what changes)
12. Section III: **Plan** — how we execute
13. Roadmap (phased plan with gates)
14. MECE tree (how growth breaks down)
15. Options assessment (paths considered)
16. Risk matrix
17. Closing / Next steps
18. Sign-off

**Key principle:** the recommendation appears on the Exec Summary slide. Everything after is the case for it. Do not save the answer for the end.

### 2. Business Case (10–18 slides)

Justify a specific investment with $$ and ROI. Sharper, more compact than a strategy deck.

1. Cover
2. Executive Summary (Pyramid — recommendation + investment + return)
3. SCR slide
4. Big stat (the size of the prize or the cost of inaction)
5. Action-title + bullets (key drivers of the opportunity)
6. Two-column (current state vs proposed state)
7. MECE tree (where the value comes from)
8. Options assessment (with recommended option highlighted)
9. Financial summary tiles (NPV / IRR / Payback / ROI)
10. Cost-benefit chart + cumulative cash flow
11. Tornado / sensitivity (which assumptions matter)
12. Roadmap (when value materializes)
13. Risk register (scored) + key mitigants
14. Closing / Next steps (the decision being asked for)

**Key principle:** the financial number is named on the Exec Summary and never lost. Every slide either explains how the number is achieved or what could put it at risk.

### 3. Board Update / QBR (8–14 slides)

Quarterly review. Lighter on framework, heavier on evidence and asks.

1. Cover
2. Executive Summary (state of the business + 2–3 key items)
3. RAG status dashboard (Overall / Scope / Schedule / Budget)
4. Stat grid (the headline KPIs)
5. Two-column or comparison table (vs plan, vs prior period)
6. Action-title + bullets (what's working)
7. Action-title + bullets (what's not, and what we're doing)
8. Roadmap (next quarter)
9. Risk register (the live risks, scored)
10. Closing / Next steps (decisions needed from the board)

**Key principle:** boards have read the materials. Don't recap; lead with what changed, what you need, and what you'd like challenge on.

### 4. Executive Summary (1–3 slides)

A standalone exec summary lifted from a longer document. The Pyramid Principle in pure form.

1. Cover (optional)
2. Pyramid summary slide *or* the exec summary slide from above
3. Closing / Next steps (optional)

**Key principle:** if you can't reduce the argument to this one page, you don't yet understand the argument.

### 5. Consulting Proposal (12–20 slides)

Pitching a consulting engagement to a client.

1. Cover (their logo on the right, yours discreetly)
2. Executive Summary (our understanding + our recommendation + investment)
3. Section I: **Your situation as we understand it**
4. SCR slide (their world)
5. Stat grid (their KPIs, what we observe)
6. Section II: **Our approach**
7. Strategy House or process flow (methodology)
8. Roadmap (phasing of the engagement)
9. Section III: **Why us**
10. Two-column or three-column (relevant experience, team)
11. Comparison table (deliverables by phase)
12. Options assessment (engagement options at different scopes)
13. Risk matrix (engagement risks and mitigations)
14. Closing / Next steps (decisions, references, kickoff date)

**Key principle:** the client wants to feel understood before they hear your pitch. Sections I and II carry that — III is the close.

### 6. Go-to-Market (12–20 slides)

How to launch / commercialize a product or enter a market.

1. Cover
2. Executive Summary (the GTM motion in one sentence)
3. Section I: **Who we serve**
4. Stat grid (target segments)
5. 2×2 matrix (segment prioritization)
6. Buyer persona card
7. TAM/SAM/SOM (the addressable opportunity)
8. Section II: **What we sell**
9. Two-column (product positioning vs alternatives)
10. Comparison table (pricing tiers)
11. Section III: **How we sell**
12. Process flow (the GTM motion / customer journey)
13. Roadmap (launch phases)
14. Stat grid (forecast: pipeline, ARR, CAC)
15. Risk register (GTM risks)
16. Closing / Next steps

### 7. 100-Day Plan (10–15 slides)

A new leader's first-100-day plan, typically presented to a board, CEO, or team within the first weeks of taking a role.

1. Cover
2. Executive Summary (my understanding + my plan + what I need)
3. SCR slide (what I'm walking into)
4. Stat grid (baseline metrics)
5. Stakeholder directory (who I need to engage and when)
6. Strategy House (my four priorities)
7. Roadmap (Days 1–30, 31–60, 61–100)
8. Checklist (week-one and week-two commitments)
9. Action-title + bullets (what I will personally own)
10. Two-column (what I will stop / start doing)
11. Risk matrix (transition risks)
12. Closing / Next steps (what I need from you)

### 8. Market / Competitive Teardown (10–15 slides)

Diagnostic of a market or competitor. Usually a build to a strategic recommendation, but can stand alone.

1. Cover
2. Executive Summary
3. Stat grid (market size, growth, structure)
4. TAM/SAM/SOM (addressable opportunity)
5. MECE tree (market decomposition)
6. 2×2 matrix (competitive positioning)
7. Harvey Balls (capability comparison across competitors)
8. Comparison table (us vs competitors on key dimensions)
9. Three-column (the three biggest threats / opportunities)
10. Big stat (the headline implication)
11. Closing / Next steps or implications

## Tone rules — follow strictly

1. **Action titles, always.** No topic labels.
2. **Sober register.** No exclamation points, no emoji, no buzzwords. Write the way a 30-year-old senior associate at McKinsey would write for a CFO.
3. **Pick a term and stick with it.** If we're calling something "SMB self-serve," don't paraphrase to "mid-market motion" three slides later. Inconsistency reads as imprecision.
4. **Specific numbers.** "22% CAGR" beats "rapid growth." "$80M over 36 months" beats "significant investment."
5. **Headlines are statements, not questions.** Exceptions are rare and intentional.
6. **No em-dashes used as breath-pauses in body copy.** Use periods or shorter sentences. Em-dashes are fine in headlines (where they're rhythmic) and in tables.
7. **Italics for emphasis on a single word per headline, max.** Editorial italics carry meaning; they aren't decoration.
8. **Source every analytical slide.** Bottom-left source line is required.

## Components — what to use, what to avoid

The enterprise case uses the **broadest palette** of the three cases. Most of the framework's 46 components were designed for enterprise work and fit naturally.

**Heavy use:**
- Executive summary (Pyramid), SCR, section dividers (Roman)
- Action title + bullets, stat grid, big stat, two-column, three-column
- 2×2 matrix, Strategy House, Pyramid summary, MECE tree
- Roadmap, options assessment, comparison table
- Risk matrix (3×3), risk register (scored)
- Harvey Balls, stakeholder directory, checklist, SWOT
- Initiative cards (Why/What/How), workstreams, Gantt task list
- Financial tiles, cost-benefit chart, cumulative cash flow, tornado/sensitivity
- Power/Interest stakeholder map, RAG status dashboard
- Line chart, horizontal bar, stacked column, waterfall
- **System topology** — for any deck proposing or auditing infrastructure (analytics platforms, SaaS rollouts, network architecture)
- **Swimlane** — whenever the key finding is about *who does what and when* (onboarding, change management, cross-team handoffs)
- **TCO table** — business cases and board updates where the reader needs to see cost and benefit detail, not just headline metrics; always pair with the cumulative cash flow chart on the next slide
- **Gantt-lite** — executive deployment timeline when the argument is about *phasing* (concurrent workstreams, dependencies, milestone sequencing); use `.gantt-tasks` instead when the reader needs task-level detail

**Use sparingly:**
- Insight/quote — at most two per deck; favor specific testimony over generic motivation
- Buyer persona card — for GTM and market work, not strategy
- Before/After transformation — strong but easily overused; one per deck is the right cadence
- Big-number section divider — pick *either* Roman or big-number for the whole deck, not both

**Avoid:**
- Team grid — too informal for executive audiences (and unnecessary; people are introduced in the Cover or appendix)
- The Ask — that's an investor-case component
- Image-led portfolio components (project-hero, image gallery, etc.) — wrong register

## Slide density rule

**Never produce a slide where more than ~40% of the content area is blank space.** Empty screen is not restraint — it reads as incomplete work. Two strategies depending on content type:

- **Data/stat slides** (stat grid, big-stat): center the content vertically on the page. The CSS components now do this automatically (`align-content: center` on `.stat-grid`; `flex: 1 1 auto` on `.big-stat`). These components fill the slide and center their row.
- **Text slides** (bullets, two-col, three-col): fill the space with more detail, context, or sub-points. Short bullet lists with three items and one sentence each will leave 60% of the page blank — either deepen the content or use a data component instead.
- **Closing slides**: the `.closing-next` component uses a two-row grid (`auto` for action items, `1fr` for what follows). Always populate the second row — a phase gate summary, a commitment statement, or a timeline. A closing slide with one approval item in a half-empty layout is not a closing.

When reviewing a slide you've written: ask whether the content area reads as full. If you can see large empty regions, add depth to the content or restructure.

## Common mistakes to avoid

- **Topic-label titles.** The single most common failure mode. "Market overview." "Strategic options." If the title doesn't contain a conclusion, it's wrong.
- **Burying the recommendation.** Putting the recommendation on slide 18 of 20. The recommendation goes on slide 2 (the exec summary). Everything after is the case for it.
- **Skipping the "what we will not do" slide.** Strategy without negative choice is aspiration. The 2×2 matrix or the strategy house should make the negative choice visible.
- **Forgetting to source.** A slide with a stat and no source has no credibility.
- **Five-pillar Strategy Houses.** Four is the sweet spot. Five means you haven't chosen yet.
- **Decorative dark slides.** Dark slides are emphasis. Two per deck max, used at pivot moments.
- **Stat grids without deltas or context.** A number alone isn't a finding.
- **MECE violations.** "New customers, expansion, and SMB" overlaps. Decomposition must be exhaustive AND non-overlapping.
- **No decision-required slide at the end.** A deck without a "decision required" close will not produce a decision.
- **Pitching before diagnosing.** Especially in proposals. Show them you understand their situation before you say what they should do.
- **Charts with five series.** Three series is the maximum that a reader can hold in working memory. Five lines is a graph of "everything we know," not a chart of a finding.
- **Default Chart.js colors.** If a chart slide has bars in blue, orange, and red, the deck has drifted off-brand. Use the ink scale; let `--ink-1` mark the hero.
- **Topic-label chart titles.** "Revenue forecast" is a label; "With strategy, revenue compounds to $1.9B by 2029" is a finding. The chart is evidence — the title is the conclusion.

## When the user asks you to build an enterprise deck

1. **Ask for the storyline, not the slides.** "What's the recommendation? Who's the audience? What's the decision being asked of them?" Then pick the matching storyline above and scaffold.
2. **Draft the exec summary slide first.** If the recommendation and three supports can be stated cleanly, the rest of the deck has a spine. If they can't, the thinking isn't done — and no quantity of slides will fix that. Tell the human, don't paper over it.
3. **Action-title every slide before writing body content.** Read the titles in order. They should tell the story. Fix the titles first; body content is secondary.
4. **Pick components from the reference.** Match component to content type. Don't invent new layouts unless the standard set genuinely doesn't fit.
5. **Iterate slide-by-slide.** Don't bulk-generate twenty slides and ask for feedback. Show one, get a reaction, refine, move on.
6. **Source everything.** If you don't know the source, write `[Source: ...]` as a placeholder and flag it to the human. Don't invent a source.
7. **If the human provides a .csv or Excel export** — don't hand-write chart JSON. Run `csv-to-chart.js` and paste the output. Always update the generated action title before handing off. See the root `AGENTS.md` CSV → chart bridge section for supported types and flags.
8. **Validate brand compliance before reporting done.** If a `brand.lock` exists in the repo, run `npm run brand-check -- <deck.html>` and resolve any violations. If there is no lock file, skip this step — the validator is opt-in.

When the human says:

- "Add an exec summary" → exec-summary component (Pyramid)
- "Show the strategy" → Strategy House or 2×2
- "Compare options" → options assessment
- "Show the plan" → roadmap with named gates
- "Show the architecture / how the systems connect" → **topology grid** (component 39); three zones maximum; hero zone = the platform being proposed or evaluated
- "Show the process / who does what / onboarding flow / handoffs" → **swimlane** (component 40); four phases maximum; hero lane = the primary owning team
- "Show the business case / costs vs benefits / ROI / TCO" → **TCO table** (component 41) for full breakdown + **fin-tiles** (component 31) or **cumulative cash flow** chart (component 33) on adjacent slides for the headline summary; never put the full table and the cash flow on the same slide
- "Show the timeline / deployment plan / rollout phasing / workstreams" → **Gantt-lite** (component 42) for executive view; **Gantt task list** (component 38) for operational detail; one Gantt-lite per deck is the rule
- "Here's the data / I have a spreadsheet / here's a CSV" → run `csv-to-chart.js` (see root AGENTS.md). Don't hand-write chart JSON when source data exists.
- "Add a chart of X" → match to one of the seven chart types: line (trajectory), horizontal bar (ranked comparison), stacked column (composition over time), waterfall (bridge between two states), cost-benefit (project economics by year), cumulative cash flow (running balance), tornado (sensitivity). If none fit the finding, the finding probably isn't a chart — it's a stat grid or comparison table. **Always write the action title before picking the chart type.** The title describes the finding; the chart type is whatever makes the finding most visible.
- "Make this sharper" → start with the action title. If the title is a sentence stating the conclusion, the slide is probably fine. If it's a topic label, rewrite the title and the rest will follow.
- "Add a quote slide" → insight/quote, but ask "do we really need it?" — these are the most over-used component in amateur decks.

When the human asks for a chart that isn't in the built-in seven types, do not pull in another chart library or hand-roll an SVG. Instead, ask: "What's the *finding* this chart needs to deliver?" Then pick an existing component that delivers the finding. If none of them fit and the chart genuinely matters, write the title first, sketch the chart in description, and ask the human to confirm before adding a custom Chart.js block inline.

## Final note on craft

A consulting-grade deck is not impressive because it's flashy. It's impressive because, when an executive flips through it, they form a clear, defensible opinion of a complex situation. Every slide either sharpens that opinion or it has no business being in the deck.

The framework gives you the components. The components don't make the argument. The argument is in the action titles, in the SCR, in the strategic choice. If those are right, the deck is right — even on the most boring components. If those are wrong, no amount of beautifully styled bar charts will save it.

When in doubt, write less. Print the slide titles, lay them on a table, and ask: does this tell the story? If the answer is yes, the deck is done. If no, the slides are not the problem.
