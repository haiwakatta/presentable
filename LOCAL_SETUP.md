# Local setup & QA guide

This guide takes you from "I have a folder" to "everything works, I trust it, it's on GitHub." Allow about 45 minutes for the full pass; you can skip sections you don't need.

## 0 · Prerequisites

You need:

- **Node.js 18 or newer.** Check with `node --version`. If you don't have it: install via [nodejs.org](https://nodejs.org), `brew install node` (macOS), or use [nvm](https://github.com/nvm-sh/nvm).
- **A modern browser.** Chrome, Edge, Safari, or Firefox — all recent versions work.
- **A code editor.** Use whatever you already have. If you want the AGENTS.md system to be most useful, see *Working with Claude Code* below.
- **git.** For pushing to GitHub. `git --version` to confirm.
- **A GitHub account.** Free is fine.

That's it. No framework, no build pipeline, no package manager beyond npm for the optional PDF exporter.

---

## 1 · Get the files onto your machine

You should have received `presentable-v0.7.tar.gz` (or a folder named `presentable/`). Unpack:

```bash
# If you got the tarball
tar -xzf presentable-v0.7.tar.gz
cd presentable

# Or, if you already have the folder
cd presentable
```

You should see this structure:

```
presentable/
├── README.md
├── AGENTS.md
├── LOCAL_SETUP.md          ← you are here
├── export-pdf.js
├── package.json
├── .gitignore
├── enterprise/
│   ├── deck.html
│   ├── theme-builder.html
│   ├── AGENTS.md
│   └── examples/business-case.html
├── investor/
│   ├── deck.html
│   ├── theme-builder.html
│   └── AGENTS.md
└── portfolio/
    ├── deck.html
    ├── theme-builder.html
    └── AGENTS.md
```

---

## 2 · The two ways to run this

### Option A: Open files directly (simplest)

Every HTML file in this project is self-contained — open it in your browser:

```bash
# macOS
open enterprise/deck.html

# Linux
xdg-open enterprise/deck.html

# Windows
start enterprise/deck.html
```

This works for **viewing decks and using theme builders**. Two caveats:

- The **Copy CSS** buttons on the theme builders use the Clipboard API, which most browsers restrict on `file://` URLs. The button will appear to do nothing. **Workaround:** select the CSS block manually and Cmd/Ctrl-C, or use Option B below.
- A few subtle browser features (service workers, some font loading edge cases) behave better over HTTP than `file://`.

### Option B: Run a local HTTP server (recommended)

Trivial, no install needed:

```bash
# If you have Python 3
python3 -m http.server 8080

# Or if you have Node
npx serve -p 8080

# Or
npx http-server -p 8080
```

Then in your browser:

- Enterprise deck: <http://localhost:8080/enterprise/deck.html>
- Investor deck: <http://localhost:8080/investor/deck.html>
- Portfolio deck: <http://localhost:8080/portfolio/deck.html>
- Enterprise theme builder: <http://localhost:8080/enterprise/theme-builder.html>
- Investor theme builder: <http://localhost:8080/investor/theme-builder.html>
- Portfolio theme builder: <http://localhost:8080/portfolio/theme-builder.html>

All the copy-paste flows work over HTTP. Recommended whenever you're actively using the theme builders.

### Option C: Install Playwright for headless PDF export

Optional, only needed if you want to generate PDFs from the command line:

```bash
npm install
# This auto-runs `playwright install chromium` via the postinstall hook,
# which downloads about 150 MB of browser. Takes a minute.
```

Then:

```bash
npm run pdf:enterprise        # → enterprise/deck.pdf
npm run pdf:investor          # → investor/deck.pdf
npm run pdf:portfolio         # → portfolio/deck.pdf
npm run pdf:all               # all three
npm run pdf:example           # the business-case example
```

---

## 3 · QA pass

Work through these in order. Estimated total: **35–45 minutes** if everything works first try. Check items off as you go.

### Smoke test (5 min)

Just confirm the basics aren't broken.

- [ ] All three decks open in the browser without console errors
- [ ] Fonts load on all three (Fraunces on enterprise, Bricolage Grotesque on investor, Newsreader on portfolio)
- [ ] All three theme builders open and the live preview renders
- [ ] You can run a local HTTP server (you'll need this for the theme-builder tests)

### Per-deck QA (15 min — 5 min each)

For **each** of `enterprise/deck.html`, `investor/deck.html`, `portfolio/deck.html`:

- [ ] **Navigation works.** Arrow keys (← →) move between slides. So does Space, PageUp/PageDown.
- [ ] **Counter is correct.** Bottom-right shows `01 / N` where N matches the actual slide count (46 / 13 / 10).
- [ ] **Progress bar advances.** Top-of-screen thin line fills as you move forward.
- [ ] **Click navigation works.** Clicking the right half of a slide advances; clicking the nav buttons works.
- [ ] **Home/End jump to first/last slide.**
- [ ] **Deep links work.** Add `#3` to the URL — should jump to slide 3.
- [ ] **Dark slides render correctly.** Look for the dark moment slides (cover dark backgrounds, mission slides). Text should be readable.
- [ ] **Charts render** (enterprise has 7, investor has 1, portfolio has 0). Check that each chart's axis labels, lines, and colors look right — not blank, not overflowing.
- [ ] **Tables render** — comparison tables, risk matrices, options assessments. Cells should be aligned.
- [ ] **Source lines** appear at the bottom of analytical slides.
- [ ] **Print/PDF button** opens the browser's print dialog with page set to 16:9 landscape.

Specific to **enterprise/deck.html**:

- [ ] **All 38 components display** as you advance. The deck cycles through covers → exec summary → SCR → 2×2 → strategy house → ... → financial tiles → risk register → sign-off.
- [ ] **Harvey Balls** show partial-fill states correctly.
- [ ] **RAG status dashboard** shows colored cells (green/amber/red).
- [ ] **Cost-benefit and cumulative cash flow charts** show the break-even marker / mixed-sign bars.

Specific to **investor/deck.html**:

- [ ] **Mission slide** (slide 2) is the dark moment — orange eyebrow on dark warm-black background.
- [ ] **Traction slide** (slide 8) shows both the stat grid (top) and the growth line chart (bottom) without overlap.
- [ ] **Team grid slide** shows 4 founder cards; the CEO card has the orange avatar.
- [ ] **The Ask slide** shows the `$8M` amount on the left and proportional use-of-funds bars on the right.

Specific to **portfolio/deck.html**:

- [ ] **Background is warm cream** (`#f5f1e8`), not white.
- [ ] **Ink color is warm brown** (`#2a241d`), not cool gray.
- [ ] **Italic `em` words** (e.g., "*quiet*" on the cover) are terracotta.
- [ ] **Image placeholders** show the diagonal hatched pattern with a labeled rectangle in the center.
- [ ] **Image gallery on the process slide** shows three captioned images in a row.
- [ ] **Pull-quote with terracotta left border** renders on the project brief slide.

### Per–theme-builder QA (15 min — 5 min each)

Open each builder via the local HTTP server (so copy-paste works).

**`portfolio/theme-builder.html`:**

- [ ] Live preview shows the cover + content slides.
- [ ] **All 7 presets work.** Click each: Warm editorial / Monochrome / Cool studio / Library / Dusty rose / Midnight / Custom. The preview should change color and font.
- [ ] **Color picker works.** Click the colored square, pick a new color, preview updates.
- [ ] **Hex text input works.** Type `#3d5a3a` (a forest green) in the text field, preview updates. The preset selection should auto-switch to Custom.
- [ ] **Warm/Cool toggle works.** Switch tone, preview updates — warm gives cream/brown ink, cool gives near-white/black ink.
- [ ] **Font dropdowns work.** Change display font, the preview's title typeface changes (takes a beat for fonts to load).
- [ ] **Tokens grid** below the preview shows all 14 derived swatches.
- [ ] **Copy CSS button** writes the generated `:root` block to clipboard. Button briefly turns green and says "✓ Copied."
- [ ] **The Google Fonts URL** in the CSS comment is well-formed (try opening it; should return CSS, not 404).

**`investor/theme-builder.html`:**

- [ ] Upload zone is visible with the dashed border.
- [ ] **Drag-drop a logo image** (PNG/SVG) — extraction kicks off, swatches appear in 1–2 seconds.
- [ ] **File picker also works** — click the upload zone, choose a file from disk.
- [ ] **Swatches are clickable.** Click a swatch — it gets a border indicating selection, and "Use as ACCENT / Use as INK" buttons appear below.
- [ ] **"Use as ACCENT"** sets the accent color; the role display below shows the swatch and hex.
- [ ] **"Use as INK"** assigns the swatch as the ink-1 color; the ink scale derives from it.
- [ ] **Live preview** updates with the chosen colors — cover italic switches to the new accent, dark mission slide eyebrow switches color too.
- [ ] **Manual hex input** works as a fallback if no image is uploaded.
- [ ] **Try edge cases:**
  - A logo with strong colors (e.g., a Twitter logo with bird-blue) — should surface that color first.
  - A photo with lots of mid-tones (a landscape photo) — extraction will give muddier colors; that's expected.
  - A pure-text logo on white — should still surface a primary color; if not, fall back to manual hex.
- [ ] **Copy CSS button** works (copies the generated CSS, not the prompt).

**`enterprise/theme-builder.html`:**

- [ ] Three workflow steps at top show the process.
- [ ] **Company name field** updates the AI prompt live as you type. Try "Stripe" and check the prompt's first line says "research the brand identity for Stripe."
- [ ] **Copy prompt button** copies the prompt as plain text (no HTML tags). Paste into a text editor to verify.
- [ ] **Manual color input** works (picker + hex field).
- [ ] **Font dropdowns work.**
- [ ] **Live preview** shows enterprise-style slides — Fraunces serif title, three pyramid bullets with company-mark in the cover top.
- [ ] **Cover preview's company mark** updates with the company name typed above.

### End-to-end theming test (10 min)

Do an actual retheming to verify the full loop works.

**Pick a target.** Let's say you want to theme the enterprise deck for **Linear** (the issue tracker, picked because it has a clean public brand).

1. [ ] Open `enterprise/theme-builder.html` over `http://localhost:8080`.
2. [ ] Type `Linear` in the company name field.
3. [ ] Click **Copy prompt** — paste it somewhere. The prompt should be filled-in (not the placeholder `[COMPANY]`).
4. [ ] Paste the prompt into Claude (claude.ai or Claude Code) — let it research. You should get back something like:
   ```
   PRIMARY: #5E6AD2
   DISPLAY_FONT: Inter Display [substitute: Inter]
   BODY_FONT: Inter
   SOURCE: linear.app/brand
   ```
5. [ ] Enter `#5E6AD2` into the accent color picker on the theme builder.
6. [ ] Select **Inter** for body font; pick **Manrope** for display (Inter substitute, since Inter Display isn't in the dropdown).
7. [ ] Watch the live preview retone.
8. [ ] Click **Copy CSS**.
9. [ ] Open `enterprise/deck.html` in your editor.
10. [ ] Find the `:root {` block (around line 15) — replace the whole `:root { ... }` with what you copied.
11. [ ] Find the Google Fonts `<link>` in `<head>` — replace its `href` with the URL from the generated CSS comment.
12. [ ] Save. Refresh `http://localhost:8080/enterprise/deck.html`.
13. [ ] **Verify:** the accent has gone from deep blue to Linear's indigo (`#5E6AD2`), titles are still serif (or Manrope if you swapped them), the rest of the deck is intact.

Repeat the same flow once each for investor (upload a Linear logo or use `#5E6AD2` manually) and portfolio (pick the Midnight preset and tweak — no real brand needed for portfolio).

### PDF export QA (5 min)

Only if you ran `npm install` from the optional setup step.

- [ ] `npm run pdf:enterprise` produces `enterprise/deck.pdf` without errors.
- [ ] Open the PDF — all 46 slides are present, each on its own 13.333" × 7.5" landscape page.
- [ ] **Charts are visible in the PDF** (not blank — this is the tricky part; the exporter calls `window.__renderCharts()` to fix the hidden-slide-zero-dimension issue).
- [ ] **Dark slides preserve their dark background** in the PDF (`printBackground: true` is on).
- [ ] **No content cut off at slide edges** — the layout should match the on-screen version exactly.
- [ ] `npm run pdf:investor` and `npm run pdf:portfolio` — same checks for each.
- [ ] `npm run pdf:all` runs all three sequentially without errors.

### Common issues you might hit (and how to fix)

| Symptom | Likely cause | Fix |
|---|---|---|
| Fonts look like Times New Roman or default sans | Google Fonts didn't load | Check internet, check the `<link>` href is well-formed |
| Charts show as empty rectangles | Chart.js CDN didn't load | Check internet; refresh the page |
| Copy buttons in theme builders do nothing | Browser blocks Clipboard API on `file://` | Use Option B (HTTP server) |
| `npm install` fails on `playwright install` | Network restriction or disk space | Skip Playwright; PDFs work via browser print dialog instead |
| `npm run pdf:*` produces a PDF with blank charts | Old Playwright cache | `npx playwright install --force chromium` |
| Theme builder live preview doesn't update fonts | Network race; fonts still loading | Wait 2–3 seconds, click any other input to retrigger render |
| Slide content overflows on small screens | Slides are sized for ≥1280px wide | Resize the browser window wider, or accept that mobile is for read-only |

---

## 4 · Working with Claude Code

[Claude Code](https://docs.claude.com/en/docs/claude-code/overview) reads `AGENTS.md` files automatically. The framework's architecture maps directly onto how Claude Code works:

```bash
cd presentable
claude                       # opens Claude Code in this directory
```

Claude Code will read the root `AGENTS.md` first, then descend into whichever case folder you're working in. Try these prompts:

- *"Build me a Series A pitch deck for a B2B fintech doing real-time fraud detection."* — Claude should switch to the investor case, open `investor/AGENTS.md` for guidance, and edit `investor/deck.html` (or create a copy).
- *"I want to use Anthropic's brand for an enterprise strategy deck."* — Claude should open `enterprise/theme-builder.html`'s logic, run the AI research prompt itself (it has web search), and produce a themed `:root` block.
- *"Retheme the portfolio deck for someone whose work is mostly black-and-white photography."* — Claude should pick the Monochrome preset, maybe tweak to deeper ink, and update `portfolio/deck.html`.

When Claude proposes edits, review the diffs. The framework values restraint — if a generated slide has six bullets where three would do, push back. The case AGENTS.md files document the discipline; reference them when iterating.

### Tips for working with Claude Code on this framework

- Keep `AGENTS.md` files where they are. Claude Code's heuristics for finding them work from the cwd up.
- For long sessions, occasionally ask Claude to **list the slide titles in order** — that's the surface to iterate on, not the body content. If the titles tell the story, the body content fills in. If they don't, the body content can't save it.
- The case AGENTS.md files include a "When the user asks you to build a [case] deck" section near the bottom. If Claude is producing wrong-feeling output, point it at that section explicitly.

---

## 5 · Pushing to GitHub

### Create the repo

Two options:

**Option A: via the GitHub website** (most reliable first time):

1. Go to [github.com/new](https://github.com/new).
2. Name it whatever you want (`slides`, `decks`, `presentation-framework` — your call).
3. **Leave "Initialize with README" unchecked.** You already have one.
4. Visibility: Private if you want, Public if you plan to share. You can change this later.
5. Click **Create repository**. GitHub shows you the push commands.

**Option B: via the `gh` CLI** (faster if you have GitHub CLI installed):

```bash
gh repo create slides --private --source=. --remote=origin
# Add --public for a public repo
```

### Initial commit and push

From inside the `presentable/` directory:

```bash
git init
git add .
git status                            # verify .gitignore caught node_modules and *.pdf
git commit -m "Initial commit: Presentable v0.6 (three-case architecture + theme builders)"

# Only if you used Option A above (Option B already did this):
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPONAME.git
git branch -M main
git push -u origin main
```

If you'd rather use HTTPS than SSH:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPONAME.git
```

### Verify

- [ ] Refresh the repo page on GitHub. All the files appear in the tree.
- [ ] `node_modules/` is NOT in the repo (it's gitignored). If it shows up, your `.gitignore` didn't activate — fix it before committing more.
- [ ] `*.pdf` outputs are NOT in the repo (also gitignored). Check.
- [ ] README.md renders nicely on the repo home page.

### Optional: GitHub Pages

If you want the decks live at a URL (for sharing without sending HTML files around):

1. On the repo page → **Settings** → **Pages**.
2. Source: **Deploy from a branch**.
3. Branch: **main**, folder: `/ (root)`.
4. Save. After ~30 seconds you'll get a URL like `https://YOUR_USERNAME.github.io/YOUR_REPONAME/`.

Then your decks are at:

- `https://YOUR_USERNAME.github.io/YOUR_REPONAME/enterprise/deck.html`
- `https://YOUR_USERNAME.github.io/YOUR_REPONAME/investor/deck.html`
- `https://YOUR_USERNAME.github.io/YOUR_REPONAME/portfolio/deck.html`

The theme builders also work on GitHub Pages.

### Optional: CI for PDF artifacts

If you want PDFs generated on every push, add `.github/workflows/pdf.yml`:

```yaml
name: Generate PDFs
on: [push]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run pdf:all
      - uses: actions/upload-artifact@v4
        with:
          name: decks-pdf
          path: '**/deck.pdf'
```

Each push generates PDFs and attaches them to the run; you can download them from the Actions tab.

---

## 6 · Going further

A few directions you might take it from here:

- **Brand a deck for real.** Pick a company, run through the theming workflow end-to-end, share the result.
- **Add a new storyline.** The case AGENTS.md files document 8 enterprise / 3 investor / 3 portfolio storylines today. Adding a fourth investor storyline (e.g., a one-page memo) is a few hundred lines of HTML and a new section in `investor/AGENTS.md`.
- **Add a new component.** Pick something the framework doesn't have — an org chart, a Gantt with dependencies, a sequence diagram — and add it. The pattern is: CSS in the component CSS block, an example slide in the showcase deck, a documentation block in the root `AGENTS.md`.
- **Strip the showcases.** The case `deck.html` files are showcases of every component. Once you've internalized the framework, you might want to keep an empty starter deck per case (just the cover and the script) and build from there. The showcase decks are the documentation; the starter would be the working surface.
- **Convert the framework to a static-site generator.** If you start to outgrow self-contained HTML, the natural next step is to split each slide into its own file and use a build step to assemble. But — most users never need this. The "one HTML file" property is more valuable than DRY.

---

## What you have

After working through this guide you should have:

- A working local copy of the framework
- High confidence that all three decks and all three theme builders work as designed
- A live GitHub repo (private or public) with the project pushed
- Optionally: PDFs generated on every push via GitHub Actions
- Optionally: decks live at a `github.io` URL

If something doesn't work, the most common debugging step is to look at the browser console (F12 → Console). Most issues surface there before they're visible in the page.

Good luck. The framework rewards restraint — when in doubt, write fewer slides, fewer bullets, fewer charts.
