# Presentable — Portfolio case agent

You are helping a human build a **personal portfolio, designer's website-as-deck, or single-project case study** using the framework. Read the root `AGENTS.md` first for the foundation (components, charts, design tokens, PDF export). This file is the **portfolio case overlay** — what makes portfolio work different from enterprise or investor decks.

## What this case is for

Three legitimate uses of this case:

- **Designer / freelancer portfolio** — selected work, with the deck doing the work a Squarespace site usually does
- **Single-project case study** — one project, told well: brief, process, results
- **Personal-brand / talk deck** — speaker bio, writing, what you're thinking about

Two tells that someone wants the portfolio case:
- The audience is small and specific (one client, one hiring manager, one conference organizer) — not "executives" or "investors"
- The output is primarily about *the work itself*, not about a decision the reader needs to make

If someone says "portfolio" but the actual ask is "investor pitch for my agency," that's the investor case. If they say "portfolio" but the ask is "case study for our enterprise client to evaluate us as a vendor," that's enterprise. Push back gently and pick correctly.

## Theme

Pre-themed in `portfolio/deck.html`. Tokens at `:root`:

- **Background:** warm cream `#f5f1e8` — this is the signature
- **Ink:** warm browns, not cool grays — `#2a241d` → `#c4baa9`
- **Accent:** muted terracotta `#a05a3c` — used on italicized words, links, accent rules
- **Lines:** warm hairlines `#d8d0bc` — never the cool grays from enterprise
- **Fonts:** Newsreader (variable serif, display) + Instrument Sans (body) + JetBrains Mono (labels)
- **Type scale:** softer than enterprise — `--title-size: clamp(26px, 3.2vw, 40px)`
- **Spacing:** generous — `--slide-pad-x: 7vw`

The warm tone is the brand. Don't switch the background to white "to look more professional" — the cream *is* the professionalism. It signals craft, design literacy, and confidence to leave the white-space-by-default consulting aesthetic behind.

Newsreader is a contemporary newsreading serif with optical-size axes. It looks like an editorial magazine. Set display sizes to use `font-variation-settings: "opsz" 36` and larger — it's what makes the type feel published, not Microsoft Word.

The terracotta accent should:
- Italicize key words via `em` in titles (`I design for <em>quiet</em> brands`)
- Tint links and contact rows
- Mark the left border on the `.portfolio-note` pull-quote
- Appear at most 4–5 times per slide

If you're using terracotta as a background fill or bar, you're probably misusing it. The accent in this theme is a *typographic* accent, not a chromatic one.

## Theming workflow

The portfolio case ships with **`portfolio/theme-builder.html`** — a self-contained tool that derives a full palette from a single base color and a warm/cool tone setting, with preset starting points.

### When the user wants to retheme

Portfolio theming is the most subjective of the three cases. A designer doesn't pick brand tokens by research or by extraction — they pick by *mood*. The theme builder is built around this:

1. **Open `portfolio/theme-builder.html`** in the browser.
2. Start from a preset: *Warm editorial* (the default), *Monochrome*, *Cool studio*, *Library*, *Dusty rose*, *Midnight*, or *Custom*. Each preset is a (color, tone, font-pair) combination.
3. Refine the accent color — picker or hex input. The palette derives in real time using HSL math (background, ink scale, lines, all generated from the base + tone).
4. Choose Warm or Cool tone. Warm shifts ink and backgrounds toward brown (the default portfolio aesthetic); Cool keeps them neutral gray (closer to a Swiss studio palette).
5. Pick display + body fonts from the dropdowns.
6. Live preview shows a mini cover + content slide. Copy the generated `:root` block into `portfolio/deck.html`.

### Helping someone who can't decide

Most portfolio reskinning starts with the user saying something like "I want something more X" — moody, modern, library, warm, cool, restrained. Map these descriptions to presets:

- *"Warm, editorial, like a magazine"* → **Warm editorial** preset (the default)
- *"Stark, minimal, designer-y"* → **Monochrome**
- *"Cool, professional, designed studio"* → **Cool studio**
- *"Earthy, book-like, library"* → **Library**
- *"Soft, feminine, but not pink"* → **Dusty rose**
- *"Dark, considered, late-night"* → **Midnight**
- *"I have a specific color in mind"* → **Custom** (then ask for the hex or describe the color and convert mentally — e.g., "muted sage" ≈ `#7a8870`)

If the user describes a vibe without a color, suggest one and confirm before generating: *"For 'considered and modern' I'd start with `#3d4a5c` (slate) on a cool tone. Want me to plug that in?"*

### What "branded" means for portfolio

Portfolio theming differs from enterprise/investor in that **the brand is the designer**, not a company. The discipline:

- **Pick a base color that means something to you.** Not a Pantone-of-the-year, not a trend color. A color you'd want behind your work for the next two years.
- **Don't be afraid of low saturation.** The portfolio defaults are deliberately muted. Vibrant colors fight with the work being shown; muted colors let it breathe.
- **Warm tone is the default for a reason.** Designer-portfolio aesthetic is warm — it has roots in print, in books, in physical materials. Cool tone is appropriate for a portfolio of digital-product work or a studio doing UI design exclusively.
- **The font pair matters as much as the color.** Newsreader + Instrument Sans is editorial-warm. Fraunces + Manrope is refined-modern. EB Garamond + Source Sans 3 is classical. Pick the pair that feels closest to *the work you make*, not what's trendy.

### Iterating

Portfolio theme decisions are not one-shot. Expect 2–4 iterations. Common iteration patterns:

- *"This is close but a bit too warm"* → switch tone from Warm to Cool, or reduce accent saturation
- *"The body text feels too gray"* → no input for this directly, but bumping the accent toward a darker variant pulls the derived ink slightly that direction
- *"I want the cream background but with a different accent"* → keep tone=Warm, change accent
- *"Make the contrast higher"* → switch tone to Cool (gives whiter backgrounds and blacker ink)

### What the theme builder does NOT do

- It doesn't generate the slide content — you (the assistant) help the user write the actual case studies, captions, and project descriptions.
- It doesn't pick which projects to feature — that's an editorial decision the human makes.
- It doesn't replace images. The deck uses `.image-block` placeholders; the user replaces them with real images in their editor.

## Principles — portfolio-specific

The enterprise case has eight non-negotiable consulting principles (Pyramid, action titles, SCR, MECE). Portfolio work has its own, looser principles.

### 1. Show, don't describe

Portfolio decks have a special temptation: explain how good the work is. Don't. Show the work and let restraint do the rhetoric.

If a slide says *"We crafted a beautiful, distinctive identity system..."* — cut every word before "we" and after the comma. Show the work in a hero image. Let the reader judge whether it's distinctive.

### 2. Image-first, words-second

The component CSS includes a styled `.image-block` placeholder. In real use, that's where actual photos go. **Plan slides around images, not around text blocks.** If a slide has no image on it, ask whether there should be one. Usually yes.

The framework patterns that fit portfolio work:
- **Project hero** — text on left, image on right (or vice versa)
- **Image + text** — split with image
- **Image gallery** — three images in a row, captioned
- **Project results** — stats panel + supporting image

The framework patterns that *don't* fit portfolio work are documented below in "Components to avoid."

### 3. Restraint, not minimalism

Portfolio aesthetic ≠ blank-page aesthetic. The warm cream, the serif display, the off-black text — that's all *present*. The restraint is in not adding more, not in stripping away. Two well-spaced images and a paragraph beat one image on a sea of white.

If a portfolio slide feels empty, ask whether it's actually empty or whether you've absorbed enterprise instincts about "every slide must answer a question." Portfolio slides can breathe.

### 4. Action titles still apply, but soften

The enterprise rule is: every title is a conclusion, not a topic. Portfolio titles can be slightly more *narrative*, less imperative.

Enterprise: *"Three forces are compressing the enterprise core simultaneously."*
Portfolio: *"A second-generation roaster trying not to look like every other third-wave coffee brand."*

Both convey something — but the portfolio version *describes* where the project is, the enterprise version *concludes* what's true. Portfolio readers want context, not edicts.

### 5. The work is the argument

Enterprise: the argument is on the slide, supported by data.
Investor: the argument is the founder's story, supported by traction.
Portfolio: the argument *is* the work. Slide text exists to frame what the reader is looking at, not to substitute for the work.

This means: when in doubt, write less. The reader is here to see what you made, not what you'd say about what you made.

### 6. Tone: warmer, more personal

You can:
- Write in first person ("I", "we") — first person is *expected* in portfolio
- Use contractions
- Have a voice; let preferences show ("I'm best at...", "the work I'm proudest of...")
- Include a personal photo
- Acknowledge what didn't work, what you'd change, what you learned

You shouldn't:
- Drop into corporate-speak ("we leveraged our strengths to deliver value")
- List every project you've ever done — *selected* work is the point
- Apologize for the work (false modesty is its own kind of arrogance)
- Use the word "passionate" — earn the feeling without naming it

### 7. Narrative beats taxonomy

A portfolio organized by category (Logos / UI / Print / Web) is a portfolio that doesn't have a point of view. A portfolio organized by *narrative* (Selected work · Three projects from the last year · This is the one I'd start with) is.

Pick a sequence and have a reason for it. The reason can be:
- Newest first
- Most representative first
- Most ambitious first
- Most relevant to the audience first

But there should be a reason. If asked "why this order," you should have an answer.

## Storylines

Three canonical portfolio shapes. Pick one and stay disciplined.

### Storyline 1 · Designer portfolio overview (8–12 slides)

For a generalist designer presenting selected work to a prospective client or employer. This is the deck inside `portfolio/deck.html`.

1. **Cover** — name, role, location, one-line positioning
2. **Hello** — a short note before the work; intro paragraph + portrait
3. **Selected work** — three projects overview as image gallery with captions
4. **Project 1 hero** — title, role/timeline/team, hero image
5. **Project 1 brief** — the problem (image + text split)
6. **Project 1 process** — three explorations as image gallery
7. **Project 1 results** — stats, outcomes, a quote
8. **What I'm thinking about** — writing, talks, reading (two-column lists)
9. **Available / contact** — what kind of work, what kind of clients
10. **Thanks** — quiet sign-off

Optional slides between 7 and 8: a *second* project hero + brief (no full case study; just a hero shot and one-paragraph note). This lets you show range without bloating to 16 slides.

### Storyline 2 · Single project case study (8–10 slides)

For one project, told completely. The portfolio equivalent of a long-form magazine feature.

1. **Cover** — project name + tagline
2. **The brief** — what the client asked for, in their words if possible
3. **Where we started** — the existing brand/product, what was wrong (image + text)
4. **Exploration** — directions considered, including the ones rejected (image gallery)
5. **The decision** — why the chosen direction (action title + bullets)
6. **The work** — final outputs (image gallery)
7. **Detail close-ups** — three close-ups of craft moments (image gallery)
8. **Results** — stats + a customer quote
9. **What I'd change** — honest reflection (action title + bullets, soft tone)
10. **Thanks** — sign-off

Slide 9 ("What I'd change") is the most consequential one. It's the one that makes the case study feel honest rather than promotional. Don't skip it just because nothing went wrong — *find* something. Every project has at least one decision you'd revisit.

### Storyline 3 · Personal-brand / speaker deck (6–10 slides)

For a personal site, conference bio page, or "here's who I am" deck for a podcast/talk introduction.

1. **Cover** — name, role, location
2. **Hello** — short bio paragraph
3. **What I do** — three modes of work (three-column or bullets)
4. **Selected work** — three projects (image gallery)
5. **Selected writing / talks** — list
6. **What I'm thinking about** — interests, themes, recent reading
7. **Speaking topics** — what you talk about (if relevant)
8. **Available** — contact, availability, fit
9. **Thanks**

This storyline is the shortest and most personal. It's appropriate for a designer-developer, a writer who also makes things, a founder between things, anyone whose "work" doesn't fit a portfolio-of-deliverables format.

## Components — what to use, what to avoid

Most of the framework's 38 components were built for enterprise and investor cases. For portfolio, the disciplined list is much shorter.

**Heavy use:**
- Cover, thanks
- Image block (`.image-block` with `.tall / .wide / .square / .banner / .hero` variants)
- Project hero layout (text + image)
- Image + text split
- Image gallery (three columns)
- Project results (stats + image)
- Two-column / three-column (for hello, what-I'm-thinking-about, available)
- Portfolio note (italic serif pull-quote with terracotta border)
- Big stat (project results)
- Insight/quote (testimonials, single quotes)
- Available block (contact list)

**Use carefully:**
- Bullets — fine, but keep lists short (3–5 items max) and never use them where a paragraph would read better
- Stat grid — works for traction-style "the project moved these numbers"; doesn't work for cramming four random data points together

**Avoid entirely:**
- Harvey Balls, Risk matrix, Risk register — not what portfolio readers want
- SWOT, options assessment, MECE tree — strategic-analysis components have no place
- Roadmap, Workstreams, Gantt task list — operational components belong in a project plan, not a portfolio
- Strategy House, Pyramid summary, SCR slide — consulting-framework components feel out of place
- RAG status dashboard — operational tracking is the opposite of portfolio energy
- Tornado, sensitivity, cost-benefit chart — quantitative-analysis components feel sterile
- Section dividers (Roman or big-number) — portfolios are too short to need section breaks; just flow

The portfolio case has the *narrowest* component palette of the three cases. That's deliberate — restraint is the discipline.

## The portfolio-specific components

Several new patterns introduced for this case (CSS in `portfolio/deck.html`).

### Image block

Labeled rectangle placeholder for images. In real use, replace with `<img>`. The component is sized via aspect-ratio variants and includes a subtle hatched background pattern so it doesn't read as empty in placeholder mode.

```html
<div class="image-block tall">
  <div class="image-label">Patrón Coffee · cover</div>
</div>
```

Variants: `.wide` (16:9), `.tall` (3:4), `.square` (1:1), `.banner` (21:9), `.hero` (dark background, ink-1 fill). Use `.hero` for the single most important image in a project case study — typically the project's signature image.

The `.image-label` is the placeholder text. In real use, you'd remove the label div and replace the `.image-block` with an `<img>` tag, keeping the same class for sizing.

### Project hero

The standard project intro layout: text column with project number, title, description, and metadata (role / timeline / team) on the left; hero image on the right.

```html
<div class="project-hero">
  <div class="project-hero-text">
    <div class="project-no">— Brand &amp; packaging · 2024–2025</div>
    <h3>Patrón Coffee. A <em>small</em> roaster that wanted to feel like one.</h3>
    <p class="project-deck-desc">[1–2 sentence brief description.]</p>
    <div class="project-meta">
      <div class="project-meta-item">Role<span class="pm-value">Lead designer</span></div>
      <div class="project-meta-item">Timeline<span class="pm-value">11 months</span></div>
      <div class="project-meta-item">Team<span class="pm-value">2 people</span></div>
    </div>
  </div>
  <div class="project-hero-image">
    <div class="image-block hero"><div class="image-label">Hero · packaging</div></div>
  </div>
</div>
```

Always 3 metadata items. Always one `em` italicization in the title. The hero image gets `.image-block.hero` for the dark fill — it's the only place in a portfolio deck where dark fill makes sense.

### Image + text split

The standard mid-case-study layout. Image on one side, supporting text on the other.

```html
<div class="image-text">
  <div class="image-text-image">
    <div class="image-block tall"><div class="image-label">[Image description]</div></div>
  </div>
  <div class="image-text-content">
    <div class="it-eyebrow">[Section · e.g., "Where we started"]</div>
    <h3>[Sub-headline.]</h3>
    <p>[1–2 paragraphs.]</p>
    <p class="portfolio-note">"[Pull-quote or client statement.]"</p>
  </div>
</div>
```

You can also reverse the order — image on the right — by changing the grid order. Use sparingly; consistency reads as confidence.

### Image gallery

Three-column grid of captioned images. The default way to show variations, process, or a series of finals.

```html
<div class="image-gallery">
  <div class="gallery-item">
    <div class="image-block"><div class="image-label">[Image description]</div></div>
    <div class="gallery-caption">
      <strong>[Image title]</strong>
      [1-line description.]
    </div>
  </div>
  <!-- 2 more gallery items -->
</div>
```

Three columns. Not four (loses presence), not two (use image+text instead). Captions are *short* — a bold title and one line. Long captions break the rhythm of a gallery.

### Portfolio note (pull-quote)

Italicized serif pull-quote with a terracotta left border. For client statements, designer reflections, or a key sentence you want to highlight.

```html
<p class="portfolio-note">"Make us look like we've been here for forty years, not like we opened last Tuesday."</p>
```

One per slide, max. Two pull-quotes on one slide is two pull-quotes too many.

### Project results

Stats + supporting image. Used at the end of a case study.

```html
<div class="project-results">
  <div class="project-results-stats">
    <div class="pr-stat">
      <div class="pr-number">+<em>62</em>%</div>
      <div class="pr-desc">[What this number means, in context.]</div>
    </div>
    <!-- 2 more stats -->
  </div>
  <div class="image-text-image">
    <div class="image-block tall"><div class="image-label">[Supporting image]</div></div>
  </div>
</div>
```

Three stats. The number can include an `em` to highlight the key digit ("+<em>62</em>%"). Each `pr-desc` should anchor the number in real-world meaning ("revenue growth in the first 90 days post-rebrand") — naked numbers are not results.

### Available block

Contact-and-availability section. Left column has the framing headline; right column is a labeled contact list.

```html
<div class="available">
  <div>
    <h3>[Availability statement, with one <em>italic</em>.]</h3>
    <p class="portfolio-note">[Sentence about who's a good fit.]</p>
  </div>
  <div class="contact-list">
    <div class="contact-row">
      <div class="c-label">Email</div>
      <div class="c-value"><a href="mailto:...">...</a></div>
    </div>
    <!-- more rows: Studio, Instagram, Location, Availability -->
  </div>
</div>
```

Links use the terracotta accent with an underline. Keep contact rows to 4–6 — not every social profile needs a line.

## Slide density rule

**Slides should not have large blank regions.** Portfolio decks have more latitude than enterprise — breathing room is intentional — but "breathing room" means generous margins and careful spacing, not half a page of empty white below a two-line title.

- **Image slides**: the image block should fill the available area. `.image-block` inside `.image-gallery` uses `flex: 1 1 auto` and the gallery itself fills the slide — this is correct. If you're placing a single image on a slide, give it `flex: 1 1 auto; min-height: 0;` so it expands.
- **Text slides** (two-col, three-col): these components now fill the slide automatically (`flex: 1 1 auto`). If the columns still look sparse, add a pull-quote (`.portfolio-note`) at the bottom, or deepen the text. A two-column with one sentence per column is not a slide — it's a caption.
- **Stats slides**: `.stat-grid` fills and centers automatically. If you use stats, include a descriptive context line per stat — context makes stats land.

The exception: "thanks" and closing slides intentionally use centered, minimal content. That's correct and should stay minimal.

## Common mistakes

- **Too many projects.** A portfolio with 12 projects is a portfolio with no point of view. Three projects, well-told, beats a dozen quick hits.
- **Generic about page.** "Designer with 8 years of experience passionate about typography and storytelling." Cut it. Replace with one specific sentence that actually says something ("I design for quiet brands that want to be remembered.").
- **Missing the results slide.** Case studies that show the work but not the outcome read as decoration. Even soft outcomes count — a client testimonial, a publication mention, a thing you learned that changed your practice.
- **Defensive "what I'd change" slides.** If you include one (you should), don't hedge. Pick something real you'd actually do differently. Vague "I'd love to spend more time iterating" reads worse than no reflection at all.
- **Using cool gray instead of warm brown for ink.** This breaks the theme more than any other mistake. Check that ink colors at the slide level are inheriting `var(--ink-1)` and not hardcoded grays.
- **White-background dark slides.** The cream background is the brand. Dark slides (using the existing `.slide.dark`) should use the warm dark `--bg-dark: #2a241d` from the portfolio tokens, not a true black. The framework handles this if you stay on tokens.
- **Putting strategy components on portfolio slides.** A risk matrix on a portfolio slide is a category error — it tells the reader you don't understand the format.
- **Apologizing in the cover sub.** "Currently exploring..." / "Looking for..." / "Open to opportunities..." — none of these belong on a cover. The cover is your strongest assertion of who you are, not a status update.
- **The "thanks for looking" slide too earnest.** A simple "Thanks for looking." in the same voice as the rest of the deck reads better than a heartfelt sign-off. Match the deck's register.

## When the user asks you to build a portfolio deck

1. **Confirm the case and shape.** "Is this a generalist portfolio of selected work, a single-project case study, or a personal-brand/speaker deck?" Different storylines.
2. **Ask about images.** "Do you have real images you'll be inserting, or should I build with labeled placeholders for now?" Portfolio work without images is a stub.
3. **Draft the cover line first.** One sentence that positions the maker. If they can't agree on one sentence about themselves, the rest of the deck has nothing to hang from. Be patient on this one — it's the hardest sentence in the deck.
4. **Lock the storyline.** Show the 8–12 slide outline before drafting any body copy.
5. **Refuse to cram.** If they want to show six projects, push back. Three projects with proper case studies beat six brand-name-drops. Reserve the "long list" for a CV — not a portfolio deck.
6. **Watch the tone drift.** Portfolio writing is the easiest place for both you (the assistant) and the human to slip into corporate voice. Re-read every paragraph in the human's actual voice. If it doesn't sound like them, rewrite.
7. **Save the "what I'd change" slide for when there's enough drafted content to honestly reflect on.** Don't write it speculatively — wait until the rest of the case study is in place.

## Final note

The portfolio case has the *most* latitude in voice and the *least* latitude in component palette. That's not a contradiction — it means: pick a narrow set of components, use them with care, and let the warmth and craft of the writing fill what would otherwise be visual noise.

Restraint plus warmth. That's the case in one phrase.
