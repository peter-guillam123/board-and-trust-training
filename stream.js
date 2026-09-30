/**
 * stream.js — words appear the way a model writes them.
 *
 * Used on the reasoning slide: two answers to the same question race
 * side by side. The fast one streams out at once; the slow one shows
 * "Thinking" with a live seconds count while its working streams out,
 * then writes its answer. When both are done the slide gets
 * .stream-done, which reveals anything marked [data-after-stream].
 *
 * Markup:
 *   [data-stream-seq]        a pane that streams its items in order
 *     data-start="900"       ms after the slide arrives
 *   [data-stream]            an item; its text streams word by word
 *     data-rate="60"         ms per word
 *     data-pause="400"       ms to wait before this item starts
 *     data-stream="show"     appear whole instead (verdicts)
 *   [data-think-timer]       reads "Thinking · Ns" until an item with
 *     data-stop-timer starts, then "Thought for N seconds"
 *
 * Without JavaScript, with reduced motion, or when printing, every
 * word is simply there.
 */
(() => {
  'use strict';

  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const stage = document.querySelector('deck-stage');
  const seqs = Array.from(document.querySelectorAll('[data-stream-seq]'));
  if (!stage || !seqs.length || REDUCED) return;

  // Capture every item's full text once, before anything is cleared.
  const full = new WeakMap();
  seqs.forEach((seq) => seq.querySelectorAll('[data-stream]').forEach((el) => {
    full.set(el, el.textContent.replace(/\s+/g, ' ').trim());
  }));
  const timers = Array.from(document.querySelectorAll('[data-think-timer]'));
  timers.forEach((t) => full.set(t, t.textContent));

  const slideOf = (el) => el.closest('deck-stage > section');
  const slides = Array.from(new Set(seqs.map(slideOf)));
  slides.forEach((s) => s.classList.add('stream-armed'));

  let gen = 0;
  let ticking = [];
  const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

  function finish(slide) {
    slide.querySelectorAll('[data-stream]').forEach((el) => {
      el.textContent = full.get(el);
      el.classList.remove('is-waiting', 'is-streaming');
    });
    slide.querySelectorAll('[data-think-timer]').forEach((t) => { t.textContent = full.get(t); });
    slide.classList.add('stream-done');
  }

  function clear(slide) {
    slide.classList.remove('stream-done');
    slide.querySelectorAll('[data-stream]').forEach((el) => {
      el.textContent = '';
      el.classList.add('is-waiting');
      el.classList.remove('is-streaming');
    });
    slide.querySelectorAll('[data-think-timer]').forEach((t) => { t.textContent = 'Thinking'; });
  }

  async function run(seq, g) {
    const timer = seq.querySelector('[data-think-timer]');
    let t0 = 0, tick = null;
    const stopTimer = () => {
      if (!tick) return;
      clearInterval(tick); tick = null;
      const secs = Math.max(1, Math.round((performance.now() - t0) / 1000));
      timer.textContent = 'Thought for ' + secs + ' second' + (secs === 1 ? '' : 's');
      timer.parentElement.classList.remove('is-thinking');
    };

    await sleep(parseFloat(seq.dataset.start || '0'));
    if (g !== gen) return;

    if (timer) {
      t0 = performance.now();
      timer.parentElement.classList.add('is-thinking');
      timer.textContent = 'Thinking · 0s';
      tick = setInterval(() => {
        timer.textContent = 'Thinking · ' + Math.floor((performance.now() - t0) / 1000) + 's';
      }, 250);
      ticking.push(() => { clearInterval(tick); timer.parentElement.classList.remove('is-thinking'); });
    }

    for (const el of seq.querySelectorAll('[data-stream]')) {
      await sleep(parseFloat(el.dataset.pause || '0'));
      if (g !== gen) return;
      if (el.hasAttribute('data-stop-timer')) stopTimer();
      el.classList.remove('is-waiting');
      if (el.dataset.stream === 'show') { el.textContent = full.get(el); continue; }

      const words = full.get(el).split(' ');
      const rate = parseFloat(el.dataset.rate || '70');
      el.classList.add('is-streaming');
      el.textContent = '';
      for (let i = 0; i < words.length; i++) {
        if (g !== gen) return;
        el.textContent += (i ? ' ' : '') + words[i];
        await sleep(rate * (0.7 + Math.random() * 0.6));
      }
      el.classList.remove('is-streaming');
    }
    stopTimer();
  }

  function play(slide) {
    gen++;
    ticking.forEach((f) => f()); ticking = [];
    const g = gen;
    slides.forEach((s) => { if (s !== slide) finish(s); });
    if (!slides.includes(slide)) return;
    clear(slide);
    const mine = seqs.filter((q) => slideOf(q) === slide);
    Promise.all(mine.map((q) => run(q, g))).then(() => {
      if (g === gen) slide.classList.add('stream-done');
    });
  }

  let last = null;
  stage.addEventListener('slidechange', (e) => {
    const s = e.detail && e.detail.slide;
    if (!s || s === last) return;   // slotchange can re-fire; don't restart in place
    last = s;
    play(s);
  });

  // The stage's first slidechange fires before this script runs.
  const active = document.querySelector('deck-stage > section[data-deck-active]');
  if (active) { last = active; play(active); }

  // A PDF should carry the whole slide, whatever moment it was caught at.
  window.addEventListener('beforeprint', () => { gen++; ticking.forEach((f) => f()); ticking = []; slides.forEach(finish); });
})();
