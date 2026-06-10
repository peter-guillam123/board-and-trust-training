# Advanced AI training — Board and Trust

An HTML slide deck in the Guardian editorial style, built from the
[guardian-deck-template](https://github.com/peter-guillam123). It renders the
"Prompt Inflection" framework — how to think about and instruct LLMs — as a
strategic training session for Board and Trust.

## What this is

Twenty-six slides, one source of truth. Open `index.html` in a browser to present:
arrow keys / space to navigate, `R` to reset, `Cmd-P → Save as PDF` for a
one-slide-per-page export at 1920×1080.

- `index.html` — the twenty-six slides plus the deck-specific component styles.
- `styles.css` — the shared Guardian stylesheet (fonts, design tokens, base
  components). Untouched from the template; the deck's own components live in
  the `<style>` block of `index.html`.
- `deck-stage.js` — the `<deck-stage>` web component (keyboard nav, auto-scale,
  tap zones, print rules). Untouched.
- `.github/workflows/pages.yml` — deploys to GitHub Pages on push to `main`.
  Inert until the deck is pushed to a repo.
- `example-rubric-prompt.md` — a portable prompt to paste into projects already
  built with Claude. It hands back layperson-ready material — a plain-English
  opener, an honest read of which deck ideas the project illustrates, and drafted
  stand-alone slide briefs. Keep its rubric in sync with the slides.

## How it's made

The starting content came from a 10-page PDF of slides ("Prompt Inflection:
Typographic Mastery"). Each source slide was re-skinned into the Guardian
palette — cream paper, Guardian blue, red and yellow accents — rather than
copying the source's white-and-periwinkle look. Card icons were translated into
the template's typographic `01 / 02 / 03` numbering. Copy is verbatim from the
source, Anglicised (Labour, distil, realise).

## Changelog

### 10 June 2026 — Fixed intermittent prompt-typing freeze on reload

On reload the slides slot in over several `slotchange` events, and `deck-stage`
fires a `slidechange` each time — re-triggering the prompt typing while a previous
run is mid-flight. `runPromptTyping` re-read the full prompt from the DOM on every
call, so a re-entrant call could capture a half-typed fragment as the "full" text
and stick there (e.g. "Can you buil"). Now each prompt's full text is captured once
in a `WeakMap` and read from there, so re-entrant calls always type the whole
prompt. Reproduced deterministically (stuck at 5/224 chars under a forced overlap)
and confirmed fixed (full 224); slides 18, 19 and 25 all type through cleanly.

### 10 June 2026 — Published to GitHub Pages

Live at <https://peter-guillam123.github.io/board-and-trust-training/> — public
repo, deployed by the Actions workflow on push to `main`. The unoptimised source
PNGs and the local `.claude/` config are kept out of the repo via `.gitignore`;
the site ships as `index.html` + `styles.css` + `deck-stage.js` + `images/`.

### 10 June 2026 — Moved "Four key rules" to after the thesis

Relocated the editorial non-negotiables from slide 3 (right after the agenda) to
sit after "The thesis" (now slide 10), so the ground rules land alongside the
"how to think about LLMs" framing rather than front-loading the deck.

### 10 June 2026 — "But that's not all…" (chat stream, from Awayday)

Lifted Awayday slide 15 in after "Verify externally" (slide 23): a chat stream of
four real prompts, each a link to the project it became, revealing one at a time.
Retitled to "But that's not all…"; the fourth bubble is now the abandoned-churches
map (so the four are Guardian Angles, Hansard/House, Congress, derelict churches).
Brought the `.chat-stream` / `.chat-bubble` CSS and `chatIn` keyframe over; wired
the bubbles into the replay handler and print rule. Kicker retitled from the
Awayday "Part 02 · Artificial intelligence" to "In the newsroom · And more".

### 10 June 2026 — Getting started, slide B: "Pick a first project" (deck complete)

Three ways into a first project — a hobby, a child's homework, a week at work —
each a card with a rationale and an "I asked Claude to…" example in a message
bubble (slide-12 pattern), bubbles fading in after their card. Kept the
self-deprecating "neither could I" on the homework card. New `.slide--ways`. With
this, all four agenda parts now have both a divider and content — the deck's
promised structure is complete at twenty-five slides.

### 10 June 2026 — Getting started, slide A: "First, you have to use it"

First content slide of the closing section (after the Getting-started
interstitial). Left: the non-negotiable argument — you can't grasp LLMs at scale
without committing time; skip it and you're the "tried AI Overviews once, declared
it broken" person — plus two principles (put time aside; expect not to finish, the
hours still teach you). Right: the "magic genie" on-ramp with a real first prompt
typing itself in live (reuses the worked-example prompt-box / typing engine —
closing the loop on the deck's spine), and a buy-Claude line. New `.slide--start`.
Slide B (three ways into a first project) still to come.

### 10 June 2026 — "Verify externally": new top text, rebalanced, animated

Rewrote the opening line to name the ISW report as the benchmark and frame it as
Claude comparing our report to theirs each week. Gave the comparison table roomier
rows so it fills the slide (bottom void cut from ~217px to ~83px). Added the same
light reveal as 20/21 — the five rows fade up in turn (220–620ms).

### 10 June 2026 — Light reveals on the two Iran Watcher slides

Slide 20 ("Feed it material"): the six table rows fade up in turn (200–650ms).
Slide 21 ("It proposes things"): the three exchanges fade up in turn (200–440ms).
Both reuse `cardIn`, replay on revisit, and are forced visible for print.

### 10 June 2026 — Rebalanced "It proposes things"

Dropped the redundant opening sentence (Iran Watcher already introduced earlier);
the lede is now just "Three moments where the model suggested something Chris
hadn't asked for:". Set `.exchanges` to `flex: 1` with `justify-content:
space-evenly` so the three exchanges distribute evenly down the slide instead of
clumping under the title.

### 10 June 2026 — Clearer "Feed it material" table

Dropped the opening context paragraph (now redundant after the newsfeed slide
introduces Iran Watcher); the bold "born from one thing…" line is the dek.
Reframed every table row into plain language for a lay audience (no "free API",
"slots", "unparseable", "benchmark pages", "Dan"). Restyled `.feed-table`: dropped
the ink header bar and zebra for a light mono header, thin rules, roomy rows, and
a red → arrow linking each input to what it triggered.

### 10 June 2026 — Animated the two static slides (agenda, Fable)

Slide 2 (agenda): the four items fade up in reading order (140–440ms). Slide 6
("Why this is out of date"): the image settles in with a soft fade + scale, then
the text rises in after it. Both reuse the `cardIn` idiom (plus a `fadeScale`
keyframe for the image), replay on revisit, and are forced visible for print.

### 10 June 2026 — Second worked example: fuel-price dashboard

Reproduced the Bespoke newsfeed prompt slide for a second project — a UK
fuel-price tracker — placed before it (slide 18). Framed dashboard screenshot
left, live-typing opening prompt right. Refactored the typing engine to read each
prompt slide's own text from the markup, with the self-correction driven
by `data-typo` / `data-fix` attributes (newsfeed: secondary → primary; fuel:
differences → disparities). This is the second of the agenda's promised three
examples. Title "Building a fuel-price dashboard" is my choice — easily changed.

### 10 June 2026 — Magpie slide copy tweaks

Card 3 heading "Sculpt and adapt" → "Sculpt and capture"; expanded the "Collect
everything" list (YouTube videos, screengrabs, audio notes … and any useful
collateral). Both fit without crowding.

### 10 June 2026 — Expertise slide polish

Trimmed the Governance copy to four short sentences; softened the example-bubble
fill from white to a warm off-white (#faf6ee); and staged the animation so each
card appears first and its example bubble fades in after it (cards 120–360ms,
bubbles 660–960ms, replays on visit, forced visible for print).

### 10 June 2026 — Expertise slide → four columns with example prompts

Reworked "Irreplaceable expertise" from three plain cards into four columns, each
carrying an example prompt in a white message bubble (rounded, tail, bottom-
aligned) at its foot. Added a fourth box, "Governance" (interpreting intent is
both the magic and the main source of error; sculpt through conversation). The
four examples are the real prompts behind this deck. New `.aims.quad` /
`.example-bubble` components; title reduced to 52px to make room.

### 10 June 2026 — Quantum Leap slide: image + stacked cards

Reworked the Quantum Leap slide from two side-by-side cards into a split: the
Quantumleap collage portrait (16:9, optimised to ~370KB, soft shadow) on the
left, the two concept cards reduced and stacked on the right. New `.slide--ql`
split component. Cards keep their blue/red borders and fade-up animation.

### 10 June 2026 — Deep-research prompt slide (opens practical examples)

Added an oversized pull-quote slide at the start of the practical-examples
section (slide 17), modelled on a reference: ink ground, grey mono eyebrow ("A
beginner's deep research prompt"), a big quote with a hanging mark and red-italic
emphasis — "How might the agentic web affect *the Guardian's journalism and
revenue model* in the next five years?" — and a grey caps sub-line inviting
attendees to think of their own question. New `.slide--research` component.
Twenty-two slides.

### 10 June 2026 — Built the two missing section interstitials

The agenda lists four parts; only two had black/yellow dividers (the thesis = "How
to think about LLMs", and "Practical examples"). Built the other two as matching
ink section-openers: "The current landscape" (chapter "The state of AI") opening
the state-of-AI run, and "Getting started" (chapter "Over to you") closing the
deck. Deks taken from the agenda copy; titles match the agenda items. All four
dividers use thematic chapter labels rather than numbers — could be numbered
01–04 to tie to the agenda if wanted. "Getting started" ends the deck (part 4
content still to come). Twenty-one slides.

### 10 June 2026 — Agenda slide + "bespoke" accent

Added an agenda slide at position 2 ("What we'll cover"), laying out the four
parts — the current landscape, how to think about LLMs, practical examples,
getting started — in a 2×2 grid with top rules, mono-blue numbers and serif
headings (emulating a reference slide). New `.slide--agenda` component. Note: the
deck currently covers parts 1–3; part 4 ("Getting started") isn't built yet (like
the "three examples" promise). Also moved the red accent on the Bespoke newsfeed
title from "newsfeed" to "bespoke".

### 10 June 2026 — Reworked the opening-prompt slide (Bespoke newsfeed)

Retitled "How we began…" to "Building a bespoke newsfeed" and turned it into a
Fable-style split: the framed ISW report screenshot (PNG, kept crisp; white
window frame + shadow) on the left, the opening prompt on the right. The prompt
is no longer a speech bubble — it's a bordered input field that types the prompt
in live (JS, ~9s) with a blinking caret and one self-correction (types
"secondary", deletes it, rewrites "primary"). Full text also in the markup for
print/no-JS. New `.slide--prompt` / `.prompt-box` / `.isw-frame` components;
`.speech-bubble` removed.

### 10 June 2026 — "Practical examples" interstitial

Added a black/yellow ink section-opener before the Iran Watcher example,
titled "Practical examples" (examples in yellow italic), dek pivoting from the
abstract framework to concrete newsroom builds. Bookends with the thesis opener.
Note: the dek promises "three concrete examples" but only the Iran Watcher one is
in the deck so far — two more to come, or soften the number.

### 10 June 2026 — Removed three now-duplicative slides

Cut The Prompt Architect, The New Division of Labour and The payoff (the old
abstract closers of the mental-models run). The Iran Watcher worked example now
carries those points concretely — the division of labour, the payoff, and (via
the Magpie slide's "reproducible prompt" line) the prompt-architect idea. The
mental models now end on The Strategic Expedition and flow straight into the
worked example. Down to seventeen slides.

### 10 June 2026 — Reworked the "in practice" note (slide 5)

Replaced the Awayday-carryover "project management of this group" text with the
real workflow: every slide generated with AI — Gemini for simple formats, ChatGPT
for consistent images, Claude for the design — with the human expertise intact.
Red-italic accent on the opening "Every slide in this presentation". Resolves the
placeholder flagged when the slide was lifted.

### 10 June 2026 — "Why this is already out of date" (Fable) slide

Added a split image/text slide at position 4 (after "Beyond chat"): the square
Fable collage on the left half, kicker + title ("Why this is already *out of
date*", out of date in red) + body on the right. The image shows whole (square
slot, no crop), both columns vertically centred. New `.slide--fable` two-column
component. Image optimised to a 1400px JPEG (~760KB). Copy verbatim from the brief
bar one typo fix ("occured" → "occurred"). Deck is at twenty slides.

### 10 June 2026 — Dropped the AI-scale slide, retitled the speed chart

Removed the "AI has already arrived" stat panel (41% / 58% / 3 yrs) and folded its
message into the adoption-speed chart's title, now "AI has already arrived… and
*quicker* than anything else" (quicker in red). Dropped the chart title to 54px so
the longer headline sits comfortably on one line. Deck is back to nineteen slides.

### 10 June 2026 — Lifted a sixth slide from Awayday (the enterprise gap)

Pulled Awayday slide 30 into the adoption run at slide 7: the 18%-firms /
41%-workers stat pair plus a "why deploying it is hard" frictions list. Needed
three more lifted components (`.ax-pair`, `.ax-frictions-head`, `.ax-frictions`);
no images. Then adjusted: retitled to "The enterprise gap" (gap in red); added a
fifth friction, "Negative customer reaction" (AI-produced news seen as less
trustworthy than human-produced, even with oversight); added RISJ Digital News
Report 2025 to the sources. Tightened the frictions list, stat figures and the
appendix body gap so all five fit with ~45px to spare — not cramped. Then gave it
a staged `cardIn` reveal: the two stats in, then the heading, then the frictions
one at a time (added to the replay handler and the print override).

### 10 June 2026 — Moved the thesis after the state-of-AI run

The thesis ("How to think about LLMs") was slide 2; moved it to slide 7, after
the four state-of-AI slides, so it pivots out of "here's where AI is" straight
into the mental-models section (and the ink slide breaks up the paper run). New
dek: prompt engineering has become complex and opaque, but the value of LLMs is
that you can talk to them — so the training favours mental models over tips.

### 10 June 2026 — Fixed the adoption-speed chart's line-draw

The lifted AI-speed chart was missing its line animation — the original draws the
internet and smartphone lines together, pauses, then draws the AI line in last,
and only the dots were fading in here. Cause: in Awayday that line-draw is
JS-driven (a `stroke-dashoffset` transition via `getTotalLength()`), not CSS, so
the CSS-only lift missed it. Carried the original's slidechange block over
verbatim (internet/phone 2800/2600ms at 200ms, AI 2000ms at 3400ms).

### 10 June 2026 — Recreated the "Four key rules" non-negotiables slide

Rebuilt a "Before we begin · non-negotiables / Four key rules" slide from a
screengrab (no source available), text transcribed verbatim — including "judgment"
(US spelling, left as-is since it reads like editorial-code wording) and "GenAI".
New `.quad-grid` / `.quad-card` component: a 2×2 of paper-deep cards with mono
"rule" labels and blue / red / green / ink top borders. Placed right after the
thesis (slide 3), as a non-negotiables gate before the state-of-AI run. This
pushed everything down by one — the AI-choices slide (the "this group" one to
reword) is now slide 5.

### 10 June 2026 — Lifted four "state of AI" slides from Awayday (milestone)

Pulled four slides from the sibling Awayday deck (same template) in as a "state of
AI" run, slotted right after the thesis (slides 3–6), before the mental-models:

3. **Beyond chat: the new AI stack** — reasoning brain / harness / agentic loop,
   each card with a diagram (`.aim-image`).
4. **AI is not just something that happens to us** — three should/where/how choice
   cards plus an "in practice" note (`.slide--choice`, `.choice-card`, `.ai-meta`).
5. **AI has already arrived** — the 41% / 58% / 3-yrs adoption stat panel
   (`.slide--appendix`, `.ax-hero`, `.ax-card`, `.ax-keyfinding`).
6. **Faster than anything we've seen** — the SVG line-chart comparing internet /
   smartphone / AI three-year adoption, with the sequenced dot animation.

Because both decks share the identical `styles.css`, this was a clean lift: ~150
lines of their component CSS dropped straight in (only the rules these four use),
the three diagrams optimised to ~170–205KB JPEGs in `images/`, and the Awayday
framing ("Part 02", "Appendix · AI adoption" kickers/watermarks) swapped to this
deck's conventions plus a shared "The state of AI · …" kicker. Em-dashes
normalised; concept words ("brain + harness", "agent") lowercased to house style.
Also added a `@media print` override so the animated-in elements (here and on the
existing flow/card slides) survive Cmd-P PDF export.

Flagged for Chris: the "in practice" note on slide 4 still reads "the project
management of *this group*" — Awayday context that wants rewording for Board/Trust.

### 9 June 2026 — Retitled the thesis slide

Slide 2's headline is now "How to think about LLMs" (yellow italic on *think* —
the point being how you think, not which tactics), replacing "Beyond the
embroidery". New dek: short-lived tactical advice matters less than how you think
about talking to the LLM; straightforward mental models are what lead to results.
Chapter label ("The thesis") and kicker unchanged.

### 9 June 2026 — Images on the magpie slide

Turned slide 5's three cards into columns, each with a full-width image band
anchored at the bottom: collect (a collected style reference — the London
line-illustration), feed (an example input image), sculpt (the adapted output).
All three source images are 16:9 (1672×941), so the band is a true 16:9 slot
(534×300 on the canvas) and each image shows in full, no cropping. Optimised from
~3MB PNGs to ~1100px-wide JPEGs in `images/` (~245–390KB each) to keep the deck
light. New `.aims.media` card variant: smaller body text, a bottom-anchored image
that bleeds to the card edges. The original PNGs are still in the project root,
now orphaned — candidates to remove or .gitignore before any deploy.

### 9 June 2026 — Reworked the magpie slide's last two cards

Slide 5's cards 02 and 03 were saying the same thing ("Feeding the machine" /
"Fuel for thought"). Split them: 02 is now **Feed the machine** (the multimodal
inputs — images, voice notes, screen grabs, video — that cut text-prompting and
steer creative direction); 03 is now **Sculpt and adapt** (refine towards a
personalised vision enriched by your expertise, then turn the output into a
reproducible prompt). Card 01 (Collect everything) unchanged.

### 9 June 2026 — Sentence case across all titles and headings

Standardised every slide title and card heading to sentence case — cap-down
unless the word genuinely needs a capital (Swiss, Iran, and the acronyms AI / LLM
in the tables). This reverses the earlier decision to keep the coined concept
names ("The Swiss Cheese Brain", "The Magpie Habit") in title case: house style is
cap-down, so "The quantum leap principle", "The Swiss cheese brain", and so on.
Kickers and table column headers were already in the right register; internal
nav `data-label`s and code comments left as-is (not audience-visible).

### 8 June 2026 — Opening-prompt intro for the Iran Watcher example

Reworked slide 11 into the example's setup: a standard paper slide titled "How we
began to create an Iran newsfeed", carrying Chris's opening prompt in a speech
bubble. The bubble doubles as an exemplar of a strong first prompt — problem,
context, editorial constraint, and an openness to being fed more ("I'll feed you
sources and examples that the editor values as we go", which tees up slide 12).
Written to land cold for a context-free audience. (First tried as a cream bubble
on an ink divider — the cream-on-black clashed, so it moved to paper and the text
was reframed from a reflective quote into the prompt itself.) `.speech-bubble`
component: paper-deep panel, tail, mono "the opening prompt" label, body-serif text.

### 8 June 2026 — Iran Watcher worked example (milestone)

Added a four-slide case-study section after the conceptual deck, turning the
Iran Watcher project into a worked example of three of the deck's ideas. The
structure: a "worked example" ink section opener, then three dense slides —

11. **Iran Watcher** (section opener) — tagline "Context in. Suggestions out.
    Benchmark and repeat." as the dek; its three clauses thread through the next
    three slides' kickers.
12. **Feed it material** (Context in) — the magpie/context habit, as a six-row
    "material fed in → what it triggered" table.
13. **It proposes things** (Suggestions out) — the payoff, as three asked/suggested
    exchange rows (Chris left, Claude right).
14. **Verify externally** (Benchmark and repeat) — the loop-and-verify habit, as
    the five benchmark comparisons in a date/missing/built table.

These are denser than the hero slides, so they run on a `.slide.case` variant:
smaller title, top-aligned body, compact ledes and tables (`.feed-table`, the
existing `.compare-table`, and `.exchange` rows). Copy is verbatim from the brief.
Screenshot thumbnails (UN email, broken mobile view, the tweet) are left as text
for now — drop-in candidates if the images turn up.

### 8 June 2026 — Added a closing payoff slide

The deck ended on the Division of Labour table — a useful summary, but a flat
note to finish on. Added a tenth slide, *The payoff* ("It stops executing and
starts creating"), to land the training point: set the right conditions on a
project — a clear problem, rich input context — and the return compounds, with
the machine taking a more creative role rather than just executing. Done as a
normal paper content slide, not a dramatic ink one. Back to ten slides.

### 8 June 2026 — Merged the two process slides

The Planning Expedition and the Strategic Workflow were saying the same thing
twice — three of their four beats overlapped, and the workflow was the superset.
Folded them into one slide, *The Strategic Expedition*: a four-step timeline
(define aim → map steps → specific context → loop & refine) whose connecting
line *descends* left-to-right, so the line itself carries the old expedition's
"start wide, then refine down" metaphor. Nodes ride the curve; labels align on a
baseline beneath. The expedition's phase wording is folded into the labels, so
nothing's lost. Deck is now nine slides; footer numbering re-flows on its own.

The old `.expedition`/`.phase` and straight-line `.flow` components were removed
and replaced with the single descending `.flow` timeline.

### 8 June 2026 — First cut (milestone)

Set the deck up from the template and rendered all ten source slides:

1. **Cover** — *Advanced AI training*, with the original "how to think about and
   instruct LLMs" line as the framing dek.
2. **Beyond the embroidery** — the thesis, as an ink section opener. Mental
   models beat technical syntax.
3. **The Quantum Leap Principle** — two-up cards (Swiss Cheese Brain / the
   Fundamental Anchor).
4. **Irreplaceable Expertise** — three cards (the Problem / Support Context /
   Ideal Output).
5. **The Magpie Habit** — three cards on collecting fuel for the machine.
6. **The Mentor & The Manager** — two-up cards on how to instruct.
7. **The Planning Expedition** — a descending blue curve over three phases,
   recreated as inline SVG to echo the source.
8. **The Strategic Workflow** — a four-step timeline with numbered nodes
   threaded on a connecting line.
9. **The Prompt Architect** — two-up cards on distilling a conversation into a
   reusable prompt.
10. **The New Division of Labour** — the human/machine comparison table, ink
    header, paper-deep zebra, blue display first column.

Four new components were added to the template's kit, all in the `index.html`
`<style>` block: `.aims.two` (two-up cards), `.expedition` (the curve slide),
`.flow` (the four-step timeline), and `.compare-table`. These are candidates to
lift back into the template if they earn their keep on the next deck.

Not yet deployed — held local pending a decision on whether internal Board and
Trust material should go to a public GitHub Pages site.
