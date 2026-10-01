/**
 * img-copy.js — click a picture, get it on the clipboard.
 *
 * So the room can take an image straight into Gemini (or anything else)
 * and ask for something in that style. Browsers only accept PNG on the
 * clipboard, so JPEGs are redrawn through a canvas on the way out. The
 * images are same-origin, so the canvas stays clean.
 *
 * Two things worth knowing. The clipboard needs a secure context, so
 * this works on the published deck and on localhost, but not from a
 * file:// copy. And deck-stage puts full-height tap zones over the left
 * and right thirds on touch devices, so the click is caught in the
 * capture phase at window level, before those zones see it.
 *
 * Safety: if this file never runs, the images are exactly as they were.
 */
(() => {
  const SELECTOR = '.slide img';
  const REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const live = document.createElement('p');
  live.className = 'imgcopy-live';
  live.setAttribute('aria-live', 'polite');
  live.setAttribute('role', 'status');
  document.body.appendChild(live);
  const say = (msg) => { live.textContent = ''; setTimeout(() => { live.textContent = msg; }, 60); };

  /* Redraw through a canvas: the clipboard only takes PNG. */
  const toPng = async (img) => {
    if (!img.complete || !img.naturalWidth) {
      await (img.decode ? img.decode() : new Promise((r) => { img.onload = r; }));
    }
    const c = document.createElement('canvas');
    c.width = img.naturalWidth;
    c.height = img.naturalHeight;
    c.getContext('2d').drawImage(img, 0, 0);
    return new Promise((res, rej) => {
      c.toBlob((b) => (b ? res(b) : rej(new Error('canvas gave no blob'))), 'image/png');
    });
  };

  const flash = (img, text, ok) => {
    const chip = img.__chip;
    if (!chip) return;
    chip.textContent = text;
    chip.classList.toggle('is-ok', !!ok);
    chip.classList.add('is-shown');
    clearTimeout(img.__t);
    img.__t = setTimeout(() => {
      chip.classList.remove('is-shown', 'is-ok');
      chip.textContent = 'Copy image';
    }, REDUCED ? 2600 : 2000);
  };

  const copy = async (img) => {
    const name = (img.getAttribute('alt') || 'image').replace(/\s+/g, ' ').trim();
    try {
      if (!navigator.clipboard || !window.ClipboardItem) throw new Error('no clipboard api');
      // Build the item synchronously from a promise: Safari drops the
      // user gesture if you await the blob first.
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': toPng(img) })]);
      flash(img, 'Copied', true);
      say('Image copied. Paste it wherever you like.');
    } catch (err) {
      flash(img, 'Use right-click', false);
      say('Could not copy automatically. Right-click the picture and choose Copy image. ' + name);
    }
  };

  document.querySelectorAll(SELECTOR).forEach((img) => {
    // An image inside a link already has a job. The Steinem screenshot
    // opens the artifact, and hijacking that click to copy would break
    // the one thing the slide asks you to do. Leave those alone; a
    // right-click still copies them the ordinary way.
    if (img.closest('a')) return;
    img.dataset.copyImage = '';
    img.setAttribute('role', 'button');
    img.setAttribute('tabindex', '0');
    const alt = (img.getAttribute('alt') || '').trim();
    img.setAttribute('aria-label', alt ? `Copy image: ${alt}` : 'Copy image');

    const frame = img.parentElement;
    if (frame && getComputedStyle(frame).position === 'static') frame.style.position = 'relative';
    const chip = document.createElement('span');
    chip.className = 'imgcopy-chip';
    chip.setAttribute('aria-hidden', 'true');
    chip.textContent = 'Copy image';
    (frame || img).appendChild(chip);
    img.__chip = chip;

    img.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
        e.preventDefault();
        copy(img);
      }
    });
  });

  /* Capture at window level so the tap zones never see the click. */
  window.addEventListener('click', (e) => {
    const stack = document.elementsFromPoint(e.clientX, e.clientY) || [];
    const img = stack.find((el) => el instanceof HTMLImageElement && 'copyImage' in el.dataset);
    if (!img) return;
    e.preventDefault();
    e.stopPropagation();
    copy(img);
  }, true);
})();
