# Example-finding prompt

A portable prompt for turning a project already built with Claude into
designer-ready slide material for the training deck. Open a fresh Claude session
**inside the project** and paste the prompt below. It asks that project's Claude
to read its own history and hand back: a plain-English opener, an honest read of
which of the deck's ideas the project illustrates, and a tight set of stand-alone
slide briefs.

**How this prompt is shaped (learned the hard way on Iran Watcher).** Left to its
own devices the first pass comes back too technical and too inside-baseball — it
writes for someone who already knows the project and cares about the code. It has
to be steered, up front, toward (a) a complete layperson, (b) the *ideas and ways
of working* rather than the engineering, and (c) a concrete hand-off — an opening
context line plus drafted slides — rather than a dry assessment. Those nudges are
now built in below.

Run it across several projects and the rubric read gives you a scannable map of
which project owns which idea; the slide briefs give you something to hand
straight to whoever lays the deck out.

Keep this file in sync with the slides: if the deck is reshuffled, update the
rubric here so the prompt doesn't drift out of date.

---

## The prompt

```
I'm building a training deck about how to work with LLMs, and I'd like to use this
project as a real, worked example. I need designer-ready material that a complete
stranger — non-technical, no knowledge of this project — could follow.

How to approach it:

- Write for a layperson. Assume the reader has never seen this project and doesn't
  care about the code. Everything on the page has to stand on its own, in plain
  English. No jargon, no talk of files, commits, branches or frameworks.

- The subject is the ideas, not the engineering. I care about the ways of working
  we realised together — the context that went in, the judgement calls, the things
  you suggested, how the work was checked — not the technical detail. Treat the
  code, the commits and the bug-fixes as private evidence of what happened; the
  story you put on the page is about the collaboration and the thinking.

- Be concrete about the story. Specific beats vague — but "specific" means the
  collaboration, not the codebase. ("It started with a lot of context from the
  editor and a benchmark report, and as we went you kept proposing new sources we
  hadn't thought of" is the right altitude. "We refactored the fallback in the
  query function" is not.) Don't invent: if something didn't happen, leave it out.
  I'd rather three true examples than ten stretched ones.

To work out what actually happened, read the git history, the README / changelog /
About page, the CLAUDE.md and the code — then translate all of it into plain
language for the page.

Give me three things:

1. THE OPENER. Take this project's original brief — the first thing I asked you for
   — and lightly rework it so a stranger instantly gets what this is, who it's for
   and why it existed. Two or three sentences, written to be read aloud or dropped
   into a speech bubble on the opening slide. It should set up everything that
   follows.

2. A READ AGAINST THE RUBRIC. For each idea below, tell me — in a line or two, in
   plain terms — whether this project illustrates it (Strong / Partial / Not
   really) and the concrete moment that shows it. Be honest where it doesn't apply.

   a. Context is the anchor — the model arrives with no memory; it's capable but
      unoriented, and context is what steadies it. Where did the context you gave —
      a clear brief, background, pasted-in material — turn vague work into good work?
   b. Irreplaceable expertise — what only I brought: a precisely framed problem;
      supporting knowledge or judgement; a clear picture of the ideal result. Where
      did my own judgement shape the outcome in a way the model couldn't have
      reached alone?
   c. The magpie habit — collecting and feeding in raw material (references,
      screenshots, examples, off-hand remarks) to steer the direction. Did things I
      brought in change what got built?
   d. The mentor and the manager — two levels of instruction. Prompt level:
      instructing clearly and patiently, like teaching, because the thing is capable
      but forgetful and easily led astray. Project level: breaking a big job into
      small, verifiable chunks. Where did each matter?
   e. The strategic expedition — the working loop: set the aim, map the steps, feed
      the right context per step, then refine and check at every waypoint. Does the
      way this project unfolded show that start-wide-then-narrow-and-verify rhythm?
   f. Distilling what works — once you hit a good result, capturing it as something
      repeatable: a reusable prompt, a template, a written-up way of working. Did
      anything reusable come out of this?
   g. The new division of labour — I own context, expertise, direction and goal-
      setting; the machine owns synthesis, making connections, execution and
      generating the scaffolding. Where is that split clearest here?
   h. The payoff — once the conditions are right, the machine stops just doing what
      it's told and starts contributing: suggesting informed, genuinely useful ideas
      I didn't ask for, and getting sharper the more context it has. Is there a
      moment where it proposed something good, unasked?

3. A SLIDE HAND-OFF. Assume we have room for up to three slides on this project.
   Propose the best two or three — the ones that tell its story and each stand
   completely on their own (a stranger could read one slide cold and understand it).
   For each slide, give me:
     - a working title;
     - the one idea it lands (which rubric point above);
     - the story it tells (one or two sentences, for the designer — not for the slide);
     - the key visual (a table, a set of exchanges, a timeline — whatever fits);
     - the on-slide text, fully drafted and layperson-ready;
     - speaker notes (a few sentences for whoever presents it).
```

---

## Short version

For when the full prompt feels heavy to paste repeatedly:

```
Use this project as a worked example in a training deck about working with LLMs,
for a non-technical audience who has never seen it. Read the git history,
README / changelog and code to work out what happened — but write only in plain
English, about the ideas and the collaboration, never the engineering. Give me:
(1) a two-or-three-sentence plain-English opener, reworked from the project's
original brief, that tells a stranger what this is and why it existed; (2) a quick,
honest read of which of these ideas the project illustrates and how — context as
the anchor, the expertise I brought, the magpie habit of feeding in material,
instructing well (clear teaching) and managing the work in chunks, the
aim → steps → context → check loop, distilling something reusable, the human/machine
division of labour, and the payoff where it started suggesting good things unasked;
and (3) up to three stand-alone slide briefs (working title, the one idea, the key
visual, the on-slide text fully drafted, and speaker notes) that each make sense
cold. Be concrete about the collaboration, not the code. Don't invent anything.
```
