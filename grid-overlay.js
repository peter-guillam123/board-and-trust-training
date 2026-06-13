/**
 * grid-overlay.js — EXPERIMENT (grid-experiment branch only).
 *
 * A Müller-Brockmann instrument, not a redesign: it draws the modular
 * grid the deck is measured against, in the same content box as the
 * content, from one source of truth. Press G to toggle.
 *
 * It changes nothing about the slides — it only lets us SEE how close
 * the existing layout already sits to a 12-column + baseline grid, and
 * where it drifts. Keep the Guardian palette and type; borrow only the
 * discipline. Delete this file and its <script> tag to remove entirely.
 *
 * Tokens (one source of truth) — sized for the 1920×1080 canvas, with
 * the column field aligned to the deck's existing 120px side margins
 * and the rule-band:
 *   --gm  margin   120px   (matches .slide side padding + .rule-band)
 *   --gc  columns  12
 *   --gg  gutter   24px    (2× the 12px baseline)
 *   --gt  top      100px   (matches .slide top padding)
 *   --gb  bottom   80px    (matches .slide bottom padding)
 *   --gbl baseline 12px    (major line every 3rd = 36px)
 */
(() => {
  const stage = document.querySelector('deck-stage');
  if (!stage) return;

  // Read the canonical grid tokens from :root (styles.css). The overlay
  // and the content thus share one source of truth; fall back to the
  // deck's defaults if the variables are ever absent.
  const css = getComputedStyle(document.documentElement);
  const num = (name, fb) => {
    const v = parseFloat(css.getPropertyValue(name));
    return Number.isFinite(v) ? v : fb;
  };
  const TOKENS = {
    gm: num('--grid-margin', 120), gc: num('--grid-cols', 12),
    gg: num('--grid-gutter', 24), gt: num('--grid-top', 100),
    gb: num('--grid-bottom', 80), gbl: num('--grid-baseline', 12),
  };

  const root = document.documentElement.style;
  root.setProperty('--gm', TOKENS.gm + 'px');
  root.setProperty('--gc', TOKENS.gc);
  root.setProperty('--gg', TOKENS.gg + 'px');
  root.setProperty('--gt', TOKENS.gt + 'px');
  root.setProperty('--gb', TOKENS.gb + 'px');
  root.setProperty('--gbl', TOKENS.gbl + 'px');

  const style = document.createElement('style');
  style.id = 'grid-overlay-style';
  style.textContent = `
    .grid-guides {
      position: absolute; inset: 0; z-index: 70;
      pointer-events: none; opacity: 0;
      transition: opacity 220ms ease;
    }
    deck-stage.grid-on .grid-guides { opacity: 1; }

    /* Baseline: faint minor line every --gbl, stronger major every 3rd,
       drawn across the type area (inside top/bottom + side margins). */
    .grid-guides .gbase {
      position: absolute;
      top: var(--gt); bottom: var(--gb);
      left: var(--gm); right: var(--gm);
      background-image:
        repeating-linear-gradient(to bottom,
          rgba(5,41,98,0.16) 0, rgba(5,41,98,0.16) 1px, transparent 1px,
          transparent calc(var(--gbl) * 3)),
        repeating-linear-gradient(to bottom,
          rgba(5,41,98,0.06) 0, rgba(5,41,98,0.06) 1px, transparent 1px,
          transparent var(--gbl));
    }

    /* Columns: 12 translucent red fields between the side margins,
       same repeat()+gutter the content would use. */
    .grid-guides .gcols {
      position: absolute;
      top: 0; bottom: 0;
      left: var(--gm); right: var(--gm);
      display: grid;
      grid-template-columns: repeat(var(--gc), 1fr);
      column-gap: var(--gg);
    }
    .grid-guides .gcol {
      position: relative;
      background: rgba(199,0,0,0.07);
      border-left: 1px solid rgba(199,0,0,0.22);
      border-right: 1px solid rgba(199,0,0,0.22);
    }
    .grid-guides .gcol::before {
      content: attr(data-n);
      position: absolute; top: 6px; left: 0; right: 0;
      text-align: center;
      font-family: var(--mono);
      font-size: 13px;
      color: rgba(199,0,0,0.6);
    }
    /* Margin lines */
    .grid-guides .gmargin {
      position: absolute; top: 0; bottom: 0; width: 1px;
      background: rgba(5,41,98,0.4);
    }
    .grid-guides .gmargin.l { left: var(--gm); }
    .grid-guides .gmargin.r { right: var(--gm); }

    /* A small readout, top-right, so the instrument announces itself */
    .grid-guides .greadout {
      position: absolute; top: 100px; right: 124px;
      font-family: var(--mono);
      font-size: 13px; letter-spacing: 0.04em;
      color: rgba(5,41,98,0.55);
      text-align: right; line-height: 1.5;
    }
    .slide.ink .grid-guides .gbase {
      background-image:
        repeating-linear-gradient(to bottom,
          rgba(255,229,0,0.20) 0, rgba(255,229,0,0.20) 1px, transparent 1px,
          transparent calc(var(--gbl) * 3)),
        repeating-linear-gradient(to bottom,
          rgba(255,229,0,0.08) 0, rgba(255,229,0,0.08) 1px, transparent 1px,
          transparent var(--gbl));
    }
    .slide.ink .grid-guides .gmargin { background: rgba(255,229,0,0.45); }
    .slide.ink .grid-guides .greadout { color: rgba(255,229,0,0.7); }
  `;
  document.head.appendChild(style);

  document.querySelectorAll('deck-stage > section.slide').forEach((slide) => {
    const g = document.createElement('div');
    g.className = 'grid-guides';
    g.setAttribute('aria-hidden', 'true');

    const base = document.createElement('div');
    base.className = 'gbase';
    g.appendChild(base);

    const cols = document.createElement('div');
    cols.className = 'gcols';
    for (let i = 1; i <= TOKENS.gc; i++) {
      const c = document.createElement('div');
      c.className = 'gcol';
      c.setAttribute('data-n', String(i));
      cols.appendChild(c);
    }
    g.appendChild(cols);

    ['l', 'r'].forEach((side) => {
      const m = document.createElement('div');
      m.className = 'gmargin ' + side;
      g.appendChild(m);
    });

    const readout = document.createElement('div');
    readout.className = 'greadout';
    readout.textContent = `${TOKENS.gc} cols · ${TOKENS.gg}px gutter\n${TOKENS.gm}px margin · ${TOKENS.gbl}px baseline`;
    readout.style.whiteSpace = 'pre';
    g.appendChild(readout);

    slide.appendChild(g);
  });

  let on = false;
  const setOn = (v) => { on = v; stage.classList.toggle('grid-on', on); };
  window.addEventListener('keydown', (e) => {
    if (e.key === 'g' || e.key === 'G') {
      const t = e.target;
      if (t && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      setOn(!on);
    }
  });
  // Expose for the preview harness to drive without a keypress.
  window.__grid = { on: () => setOn(true), off: () => setOn(false), toggle: () => setOn(!on) };
})();
