(function () {
  'use strict';
  if (document.getElementById('lumina-accessibility-button')) return;
  const button = document.createElement('button');
  button.id = 'lumina-accessibility-button';
  button.type = 'button';
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-controls', 'lumina-accessibility-panel');
  button.innerHTML = '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="4" r="2"/><path d="M4 8h16M12 6v14M8 20l4-8 4 8"/></svg><span>Accessibility Tips</span>';
  const panel = document.createElement('section');
  panel.id = 'lumina-accessibility-panel';
  panel.setAttribute('aria-labelledby', 'lumina-accessibility-title');
  panel.hidden = true;
  


panel.innerHTML = '<header><h2 id="lumina-accessibility-title">Accessibility Tips</h2><button id="lumina-accessibility-close" type="button" aria-label="Close accessibility tips">&times;</button></header>' +
    '<p><strong>Keyboard navigation:</strong> Use <strong>Tab</strong> to move forwards and <strong>Shift + Tab</strong> to move backwards between interactive elements.</p>' +
    '<p><strong>Selecting items:</strong> Press <strong>Enter</strong> or <strong>Space</strong> to activate buttons and other interactive elements.</p>' +
    '<p><strong>Course contents:</strong> Select the menu icon (&#9776;) in the top-left corner to show or hide the course contents.</p>' +
    '<p><strong>Searching the course:</strong> Select the magnifying glass icon (&#128269;&#65038;) in the top-left corner to search for specific topics, terms or concepts.</p>' +
    '<p><strong>Pop-up windows:</strong> Press <strong>Escape</strong> to close pop-up windows where supported, or select the Close button.</p>' +
    '<p><strong>Adjusting the view:</strong> Use <strong>Ctrl + Plus (+)</strong> to zoom in, <strong>Ctrl + Minus (&minus;)</strong> to zoom out, and <strong>Ctrl + 0</strong> to reset the zoom.</p>' +
    '<p><strong>Data visualisations:</strong> Use <strong>Tab</strong> to access interactive charts and tables. Press <strong>Enter</strong> or <strong>Space</strong> to activate buttons and other interactive elements.</p>';


  document.body.append(button, panel);
  const close = panel.querySelector('#lumina-accessibility-close');
  function setOpen(open, returnFocus) {
    panel.hidden = !open;
    button.setAttribute('aria-expanded', String(open));
    if (open) close.focus();
    else if (returnFocus) button.focus();
  }
  button.addEventListener('click', () => setOpen(panel.hidden, false));
  close.addEventListener('click', () => setOpen(false, true));
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !panel.hidden) setOpen(false, true);
  });
  document.addEventListener('pointerdown', e => {
    if (!panel.hidden && !panel.contains(e.target) && !button.contains(e.target)) setOpen(false, false);
  });
  // If Rise's AI Tutor is present, align above its actual location.
  // Uses a conservative fallback if the Tutor cannot be identified.
  function position() {
    const candidates = Array.from(document.querySelectorAll('button,a,[role="button"]'));
    const tutor = candidates.find(el => el !== button && /ask ai tutor/i.test((el.innerText || el.getAttribute('aria-label') || '').trim()));
    let bottom = 72;
    if (tutor) {
      const rect = tutor.getBoundingClientRect();
      if (rect.width && rect.height && rect.bottom > 0 && rect.top < window.innerHeight) {
        bottom = Math.max(12, window.innerHeight - rect.top + 10);
      }
    }
    button.style.bottom = bottom + 'px';
    panel.style.bottom = (bottom + button.getBoundingClientRect().height + 10) + 'px';
  }
  position();
  window.addEventListener('resize', position);
  document.addEventListener('scroll', position, {passive:true});
  // Rise can rerender its UI; recheck occasionally without moving keyboard focus.
  setInterval(position, 1500);
})();
