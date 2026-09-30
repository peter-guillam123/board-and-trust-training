/**
 * predictor.js — the next-word toy on the layer 1 slide.
 *
 * Lifted from plate 1 of the AI risk field guide (same words, same odds,
 * same sampling), restyled for the deck. Pick a word yourself, or let the
 * model roll the dice; the risk setting flattens or sharpens the odds.
 *
 * Two deck-specific cares:
 *  - Space and Enter on a focused button must press the button, not
 *    advance the slide, so their keydown stops here. Mouse clicks blur
 *    the button afterwards, so the arrow keys and Space go back to the
 *    deck straight away.
 *  - The toy resets each time its slide comes round, so every showing
 *    starts clean.
 *
 * Without JavaScript the slide shows the first set of odds as plain
 * text, which is also what prints.
 */
(() => {
  'use strict';

  const root = document.getElementById('pred');
  if (!root) return;

  const P = {
    start: 'The cat sat on the',
    steps: [
      { join: ' ', rest: 5, opts: [['mat', 52], ['sofa', 21], ['windowsill', 13], ['keyboard', 9]] },
      { join: ' and ', rest: 6, opts: [['purred', 38], ['fell asleep', 31], ['stared at me', 17], ['washed its paws', 8]],
        by: {
          keyboard: [['refused to move', 44], ['fell asleep', 28], ['sent an email', 14], ['purred', 8]],
          windowsill: [['watched the birds', 49], ['fell asleep', 24], ['purred', 13], ['stared at me', 8]]
        } },
      { join: ' ', rest: 7, opts: [['all afternoon', 41], ['until dinner', 27], ['like it owned the place', 16], ['while I tried to work', 9]],
        by: {
          keyboard: [['while I tried to work', 58], ['all afternoon', 19], ['like it owned the place', 12], ['until dinner', 5]]
        } }
    ],
    outro: 'A real model does the same thing thousands of times to write an essay, using everything so far to weigh what comes next. Set it to "wild" and run it again: the same prompt can give a different answer every time.'
  };

  const sentence = root.querySelector('.pred-sentence');
  const bars = root.querySelector('.pred-bars');
  const q = root.querySelector('.pred-q');
  const pickBtn = root.querySelector('.pred-pick');
  const resetBtn = root.querySelector('.pred-reset');
  const tempBtns = Array.from(root.querySelectorAll('.pred-temp button'));
  const live = root.querySelector('.pred-live');
  const temps = { cautious: 0.45, normal: 1, wild: 2.2 };
  const state = { step: 0, picks: [], temp: 'normal' };

  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

  function options() {
    const st = P.steps[state.step];
    if (!st) return null;
    const key = state.picks.length ? state.picks[state.picks.length - 1].w : null;
    const first = state.picks.length ? state.picks[0].w : null;
    const raw = (st.by && (st.by[key] || st.by[first])) || st.opts;
    const t = temps[state.temp];
    const ws = raw.map((o) => Math.pow(o[1], 1 / t));
    const rw = Math.pow(st.rest || 4, 1 / t) * (t > 1 ? 2.5 : 1); // the long tail grows when wild
    const sum = ws.reduce((a, b) => a + b, 0) + rw;
    return { list: raw.map((o, i) => ({ w: o[0], p: ws[i] / sum })), rest: rw / sum, join: st.join };
  }

  function draw() {
    let html = esc(P.start);
    state.picks.forEach((p, i) => {
      html += esc(P.steps[i].join || ' ') + '<span class="pw' + (p.by === 'model' ? ' pw--model' : '') + '">' + esc(p.w) + '</span>';
    });
    const o = options();
    html += o ? esc(o.join || ' ') + '<span class="pred-caret" aria-hidden="true"></span>' : '.';
    sentence.innerHTML = html;

    bars.innerHTML = '';
    if (o) {
      q.textContent = 'What comes next? Its odds:';
      o.list.sort((a, b) => b.p - a.p).forEach((op) => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'pbar';
        b.style.setProperty('--p', op.p.toFixed(3));
        b.innerHTML = '<span>' + esc(op.w) + '</span><span class="pbar-pct">' + Math.round(op.p * 100) + '%</span>';
        b.addEventListener('click', (e) => { choose(op.w, 'you'); e.currentTarget.blur(); });
        guard(b);
        bars.appendChild(b);
      });
      const r = document.createElement('div');
      r.className = 'pbar pbar--rest';
      r.style.setProperty('--p', o.rest.toFixed(3));
      r.innerHTML = '<span>tens of thousands of other options</span><span class="pbar-pct">' + Math.max(1, Math.round(o.rest * 100)) + '%</span>';
      bars.appendChild(r);
    } else {
      q.textContent = 'Done. One word at a time, that is all it did.';
      const p = document.createElement('p');
      p.className = 'pred-outro';
      p.textContent = P.outro;
      bars.appendChild(p);
    }
    pickBtn.disabled = !o;
  }

  function choose(w, by) {
    state.picks.push({ w, by });
    state.step++;
    if (live) live.textContent = (by === 'model' ? 'The model chose ' : 'You chose ') + w + '.';
    draw();
  }

  function reset() { state.step = 0; state.picks = []; draw(); }

  // Keep Space and Enter on our buttons; everything else goes to the deck.
  function guard(el) {
    el.addEventListener('keydown', (e) => {
      if (e.key === ' ' || e.key === 'Spacebar' || e.key === 'Enter') e.stopPropagation();
    });
  }

  pickBtn.addEventListener('click', (e) => {
    const o = options();
    if (o) {
      const r = Math.random() * (1 - o.rest);
      let acc = 0, pick = o.list[0].w;
      for (const it of o.list) { acc += it.p; if (r <= acc) { pick = it.w; break; } }
      choose(pick, 'model');
    }
    if (e.detail) e.currentTarget.blur();   // mouse click: hand keys back to the deck
  });
  resetBtn.addEventListener('click', (e) => { reset(); if (e.detail) e.currentTarget.blur(); });
  tempBtns.forEach((b) => {
    b.addEventListener('click', (e) => {
      state.temp = b.dataset.t;
      tempBtns.forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      draw();
      if (e.detail) e.currentTarget.blur();
    });
  });
  [pickBtn, resetBtn, ...tempBtns].forEach(guard);

  // Start clean whenever the slide comes round.
  const stage = document.querySelector('deck-stage');
  if (stage) {
    stage.addEventListener('slidechange', (e) => {
      if (e.detail && e.detail.slide && e.detail.slide.contains(root)) {
        state.temp = 'normal';
        tempBtns.forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.t === 'normal')));
        reset();
      }
    });
  }

  root.classList.add('is-live');
  draw();
})();
