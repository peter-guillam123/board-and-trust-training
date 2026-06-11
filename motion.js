/**
 * motion.js — choreography engine for the Board and Trust deck.
 *
 * Owns everything that moves:
 *   (a) folio numbering ("NN / TT") and the bottom progress seam;
 *   (b) masked word reveals — wraps each word of a [data-split]
 *       element in .w/.wi and staggers --wd across them;
 *   (c) the data-fx replay — toggles .fx-play on the active slide so
 *       CSS reveals re-run on every visit, forward or back;
 *   (d) count-up figures ([data-count]);
 *   (e) the live-typing prompts (with one self-correction), ported
 *       from the first edition with its WeakMap + generation guard;
 *   (f) the adoption-chart line draw (JS-driven, staged: internet and
 *       smartphone together, a beat, then AI alone — the pause is the
 *       editorial moment).
 *
 * Safety: nothing in here is load-bearing for content. If this file
 * never runs, no .fx-armed class is added and every element stays
 * visible; prefers-reduced-motion gets the same static deck.
 */
(() => {
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.querySelector('deck-stage');
  if (!stage) return;

  /* ── Folios + progress seam ──────────────────────────────────── */
  const slides = Array.from(document.querySelectorAll('deck-stage > section'));
  const total = String(slides.length).padStart(2, '0');
  slides.forEach((slide, i) => {
    const num = slide.querySelector('.slide-foot .num');
    if (num) num.textContent = `${String(i + 1).padStart(2, '0')} / ${total}`;
    const bar = document.createElement('div');
    bar.className = 'deck-progress';
    bar.setAttribute('aria-hidden', 'true');
    bar.appendChild(document.createElement('i'));
    slide.appendChild(bar);
  });
  const setProgress = (index) => {
    stage.style.setProperty('--prog', String((index + 1) / slides.length));
  };

  /* ── Reduced motion: static deck, progress only ──────────────── */
  if (REDUCED) {
    stage.addEventListener('slidechange', (e) => setProgress(e.detail.index));
    return;
  }

  /* Arm the hide-then-reveal styles only once JS is alive */
  stage.classList.add('fx-armed');

  /* ── Masked word reveals ─────────────────────────────────────── */
  const splitWords = (root) => {
    const walk = (node) => {
      Array.from(node.childNodes).forEach((child) => {
        if (child.nodeType === Node.TEXT_NODE) {
          if (!child.textContent.trim()) return;
          const frag = document.createDocumentFragment();
          child.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) {
              frag.appendChild(document.createTextNode(part));
            } else {
              const w = document.createElement('span');
              w.className = 'w';
              const wi = document.createElement('span');
              wi.className = 'wi';
              wi.textContent = part;
              w.appendChild(wi);
              frag.appendChild(w);
            }
          });
          child.replaceWith(frag);
        } else if (
          child.nodeType === Node.ELEMENT_NODE &&
          child.tagName !== 'BR' &&
          !child.classList.contains('no-split')
        ) {
          walk(child);
        }
      });
    };
    walk(root);
  };

  document.querySelectorAll('[data-split]').forEach((el) => {
    const base = parseFloat(el.dataset.splitBase || '140');
    const step = parseFloat(el.dataset.splitStep || '36');
    splitWords(el);
    el.querySelectorAll('.wi').forEach((wi, i) => {
      wi.style.setProperty('--wd', `${Math.round(base + i * step)}ms`);
    });
  });

  /* ── Count-up figures ────────────────────────────────────────── */
  let countGen = 0;
  const runCounts = (slide, gen) => {
    slide.querySelectorAll('[data-count]').forEach((el) => {
      const target = parseFloat(el.dataset.count);
      if (!Number.isFinite(target)) return;
      const suffix = el.dataset.countSuffix || '';
      const dur = parseFloat(el.dataset.countDur || '1100');
      const delay = parseFloat(el.dataset.countDelay || '0');
      const finalText = el.dataset.count + suffix;
      el.textContent = '0' + suffix;
      setTimeout(() => {
        if (gen !== countGen) return;
        const t0 = performance.now();
        const tick = (now) => {
          if (gen !== countGen) { el.textContent = finalText; return; }
          const p = Math.min(1, (now - t0) / dur);
          const eased = 1 - Math.pow(1 - p, 3);
          el.textContent = Math.round(eased * target) + suffix;
          if (p < 1) requestAnimationFrame(tick);
          else el.textContent = finalText;
        };
        requestAnimationFrame(tick);
      }, delay);
    });
  };

  /* ── Live-typing prompts ─────────────────────────────────────── */
  let typingGen = 0;
  const promptFullText = new WeakMap();   // each prompt's full text, captured once
  const runPromptTyping = (slide, gen) => {
    const typed = slide.querySelector('.prompt-text .typed');
    if (!typed) return;
    // Capture the full prompt the first time only. A re-entrant call must
    // NOT re-read textContent — a prior run may have cleared and half-typed
    // it, and we'd then "complete" that fragment and stick.
    if (!promptFullText.has(typed)) promptFullText.set(typed, typed.textContent);
    const full = promptFullText.get(typed);
    const typo = typed.dataset.typo;      // optional: a word typed wrong first…
    const fix = typed.dataset.fix;        // …then corrected to this (must occur in `full`)
    const lead = parseFloat(typed.dataset.typeDelay || '650');
    const cancelled = () => gen !== typingGen;
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    typed.textContent = '';
    (async () => {
      await sleep(lead); if (cancelled()) return;
      const type = async (str, base) => {
        for (const ch of str) {
          if (cancelled()) return true;
          typed.textContent += ch;
          await sleep(base + Math.random() * 8);
        }
        return false;
      };
      const backspace = async (n, base) => {
        for (let i = 0; i < n; i++) {
          if (cancelled()) return true;
          typed.textContent = typed.textContent.slice(0, -1);
          await sleep(base);
        }
        return false;
      };
      if (typo && fix && full.includes(fix)) {
        const i = full.indexOf(fix);
        if (await type(full.slice(0, i), 11)) return;
        if (await type(typo, 13)) return;                // a wrong word, typed out…
        await sleep(520); if (cancelled()) return;
        if (await backspace(typo.length, 26)) return;    // …then deleted…
        await sleep(180); if (cancelled()) return;
        if (await type(fix, 15)) return;                 // …and rewritten
        if (await type(full.slice(i + fix.length), 11)) return;
      } else {
        if (await type(full, 11)) return;                // no correction — type it straight
      }
    })();
  };

  /* ── Adoption-chart line draw ────────────────────────────────── */
  const drawChart = (slide) => {
    const setup = [
      { sel: '.ax-line--internet', dur: 2200, delay: 300 },
      { sel: '.ax-line--phone',    dur: 2200, delay: 300 },
      { sel: '.ax-line--ai',       dur: 1600, delay: 3200 },
    ];
    requestAnimationFrame(() => {
      setup.forEach(({ sel, dur, delay }) => {
        const line = slide.querySelector(sel);
        if (!line) return;
        const len = line.getTotalLength();
        line.style.transition = 'none';
        line.style.strokeDasharray = len;
        line.style.strokeDashoffset = len;
        line.getBoundingClientRect();  // force reflow
        line.style.transition = `stroke-dashoffset ${dur}ms cubic-bezier(.45,.05,.25,1) ${delay}ms`;
        line.style.strokeDashoffset = '0';
      });
    });
  };

  /* ── Replay choreography on every slide change ───────────────── */
  let lastIndex = -1;
  const play = (slide, index) => {
    setProgress(index);
    // slotchange can re-fire the initial slidechange; don't replay in place.
    if (!slide || index === lastIndex) return;
    lastIndex = index;
    typingGen++;
    countGen++;
    slide.classList.remove('fx-play');
    void slide.offsetWidth;   // reflow so re-adding restarts the animations
    slide.classList.add('fx-play');
    if (slide.querySelector('.ax-line')) drawChart(slide);
    if (slide.querySelector('.prompt-text .typed')) runPromptTyping(slide, typingGen);
    runCounts(slide, countGen);
  };

  stage.addEventListener('slidechange', (e) => play(e.detail.slide, e.detail.index));

  // The stage's initial slidechange fires from the slotchange microtask,
  // before this script has run — so choreograph the active slide directly.
  const active = slides.findIndex((s) => s.hasAttribute('data-deck-active'));
  if (active >= 0) play(slides[active], active);
})();
