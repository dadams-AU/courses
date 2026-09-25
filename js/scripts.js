// courses.dadams.io site behavior.
// The first half mirrors dadams.io's js/scripts.js (theme, shortcuts, help); the
// lecture accordion and lecture search at the bottom are specific to this site.

/* Accordion handlers, called from onclick attributes in the lecture lists. */
function setUnit(button, open) {
  const content = button.nextElementSibling;
  if (!content) return;
  content.classList.toggle('expanded', open);
  button.classList.toggle('expanded', open);
  button.setAttribute('aria-expanded', open ? 'true' : 'false');
}
function toggleUnit(button) {
  setUnit(button, button.getAttribute('aria-expanded') !== 'true');
}
function expandAllUnits(sectionId, expand) {
  const section = document.getElementById(sectionId);
  if (section) section.querySelectorAll('.unit-header').forEach((b) => setUnit(b, expand));
}

(function () {
  'use strict';

  const root = document.documentElement;
  const media = window.matchMedia('(prefers-color-scheme: dark)');

  const store = {
    get(key) { try { return localStorage.getItem(key); } catch (e) { return null; } },
    set(key, value) { try { localStorage.setItem(key, value); } catch (e) { /* private mode */ } },
  };

  const isTyping = (el) =>
    el && (el.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(el.tagName));

  /* ---------- theme: auto -> light -> dark ---------- */
  const THEMES = ['auto', 'light', 'dark'];
  const ICONS = { auto: 'fa-circle-half-stroke', light: 'fa-sun', dark: 'fa-moon' };
  const themeBtn = document.getElementById('theme-cycle');

  function applyTheme(pref) {
    const dark = pref === 'dark' || (pref === 'auto' && media.matches);
    root.setAttribute('data-bs-theme', dark ? 'dark' : 'light');
    root.setAttribute('data-theme-pref', pref);
    if (!themeBtn) return;
    const icon = themeBtn.querySelector('i');
    const label = themeBtn.querySelector('.theme-cycle-label');
    if (icon) icon.className = 'fa-solid ' + ICONS[pref];
    if (label) label.textContent = pref;
    themeBtn.setAttribute('aria-label', 'Color theme: ' + pref + ' (click to change)');
  }

  function cycleTheme() {
    const current = store.get('themePreference') || 'auto';
    const next = THEMES[(THEMES.indexOf(current) + 1) % THEMES.length];
    store.set('themePreference', next);
    applyTheme(next);
  }

  applyTheme(store.get('themePreference') || 'auto');
  if (themeBtn) themeBtn.addEventListener('click', cycleTheme);
  media.addEventListener('change', () => {
    if ((store.get('themePreference') || 'auto') === 'auto') applyTheme('auto');
  });

  /* ---------- navbar: hide on scroll down (mobile), back-to-top ---------- */
  const nav = document.querySelector('.site-nav');
  const navLinks = document.getElementById('site-nav-links');
  const toTop = document.getElementById('backToTop');
  let lastY = window.scrollY;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    if (nav && window.innerWidth < 992) {
      const menuOpen = navLinks && navLinks.classList.contains('show');
      nav.classList.toggle('navbar-hidden', !menuOpen && y > lastY && y > 80);
    }
    if (toTop) toTop.classList.toggle('is-visible', y > 500);
    lastY = y;
  }, { passive: true });

  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });
  if (toTop) toTop.addEventListener('click', scrollTop);

  /* ---------- keyboard help dialog ---------- */
  const help = document.getElementById('kbd-help');
  const openHelp = () => { if (help && !help.open && help.showModal) help.showModal(); };
  const toggleHelp = () => { if (!help) return; help.open ? help.close() : openHelp(); };
  document.querySelectorAll('[data-kbd-help]').forEach((b) => b.addEventListener('click', openHelp));
  if (help) {
    help.querySelectorAll('[data-kbd-close]').forEach((b) => b.addEventListener('click', () => help.close()));
    help.addEventListener('click', (e) => { if (e.target === help) help.close(); }); // backdrop
  }

  /* ---------- vim-ish shortcuts: g + key, gg, /, t, ? ---------- */
  const routes = {};
  document.querySelectorAll('.site-nav [data-shortcut]').forEach((a) => {
    routes[a.getAttribute('data-shortcut')] = a.getAttribute('href'); // set in _data/nav.yml
  });
  let pendingG = 0;

  document.addEventListener('keydown', (e) => {
    if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.altKey || isTyping(e.target)) return;
    const k = e.key;

    if (pendingG && Date.now() - pendingG < 900) {
      pendingG = 0;
      if (k === 'g') { e.preventDefault(); scrollTop(); return; }
      if (routes[k]) { e.preventDefault(); window.location.href = routes[k]; return; }
    }
    pendingG = 0;

    if (k === 'g') { pendingG = Date.now(); return; }
    if (k === '?') { e.preventDefault(); toggleHelp(); return; }
    if (k === 't') { cycleTheme(); return; }
    if (k === '/') {
      const filter = document.getElementById('pub-filter') || document.getElementById('lecture-filter');
      if (filter) { e.preventDefault(); filter.focus(); filter.select(); }
    }
  });

  /* ---------- research: grep the publication list ---------- */
  const filter = document.getElementById('pub-filter');
  if (filter) {
    const pubs = Array.from(document.querySelectorAll('[data-pub]'));
    const sections = Array.from(document.querySelectorAll('[data-pub-section]'));
    const countEl = document.querySelector('[data-pub-count]');
    const echoEl = document.querySelector('[data-grep-echo]');
    const emptyEl = document.querySelector('[data-pub-empty]');
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
    const haystacks = pubs.map((li) => norm(li.textContent.replace(/\s+/g, ' ')));

    const run = () => {
      const terms = norm(filter.value.trim()).split(/\s+/).filter(Boolean);
      let shown = 0;
      pubs.forEach((li, i) => {
        const hit = terms.every((t) => haystacks[i].includes(t));
        li.hidden = !hit;
        if (hit) shown += 1;
      });
      sections.forEach((s) => { s.hidden = !s.querySelector('[data-pub]:not([hidden])'); });
      if (countEl) countEl.textContent = shown;
      if (echoEl) echoEl.textContent = filter.value;
      if (emptyEl) emptyEl.hidden = shown !== 0;
      const url = new URL(window.location.href);
      if (filter.value) url.searchParams.set('q', filter.value); else url.searchParams.delete('q');
      history.replaceState(null, '', url);
    };

    const initial = new URLSearchParams(window.location.search).get('q');
    if (initial) { filter.value = initial; run(); }
    filter.addEventListener('input', run);
    filter.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { filter.value = ''; run(); filter.blur(); }
    });
  }

  /* ---------- code blocks: language label + copy button ---------- */
  const copyText = (text, btn, done) => {
    if (!navigator.clipboard) return;
    navigator.clipboard.writeText(text).then(() => {
      const label = btn.querySelector('span') || btn;
      const prev = label.textContent;
      label.textContent = done;
      setTimeout(() => { label.textContent = prev; }, 1600);
    });
  };

  document.querySelectorAll('.post-body div.highlighter-rouge').forEach((block) => {
    const langClass = Array.from(block.classList).find((c) => c.startsWith('language-'));
    const lang = langClass ? langClass.replace('language-', '') : 'text';
    const head = document.createElement('div');
    head.className = 'code-head';
    const name = document.createElement('span');
    name.textContent = lang === 'plaintext' ? 'text' : lang;
    head.appendChild(name);
    if (navigator.clipboard) {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'code-copy';
      btn.textContent = 'copy';
      btn.setAttribute('aria-label', 'Copy code to clipboard');
      btn.addEventListener('click', () => {
        const code = block.querySelector('code');
        if (code) copyText(code.innerText.replace(/\n$/, ''), btn, 'copied');
      });
      head.appendChild(btn);
    }
    block.insertBefore(head, block.firstChild);
  });

  document.querySelectorAll('.copy-link[data-copy]').forEach((btn) => {
    btn.addEventListener('click', () => copyText(btn.getAttribute('data-copy'), btn, 'copied!'));
  });

  /* ---------- 404: echo the missing path ---------- */
  document.querySelectorAll('[data-404-path]').forEach((el) => {
    el.textContent = decodeURIComponent(window.location.pathname);
  });

  /* ---------- courses: grep the lecture lists ---------- */
  const lectureFilter = document.getElementById('lecture-filter');
  if (lectureFilter) {
    const items = Array.from(document.querySelectorAll('.lecture-item'));
    const units = Array.from(document.querySelectorAll('.unit-section'));
    const blocks = Array.from(document.querySelectorAll('.course-block'));
    const countEl = document.querySelector('[data-lecture-count]');
    const emptyEl = document.querySelector('[data-lecture-empty]');
    document.querySelectorAll('[data-lecture-total]').forEach((el) => { el.textContent = items.length; });
    if (document.querySelector('[data-lecture-count]')) document.querySelector('[data-lecture-count]').textContent = items.length;
    const norm = (s) => s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
    // search each item's own text plus its unit title and course name
    const haystacks = items.map((li) => {
      const unit = li.closest('.unit-section');
      const block = li.closest('.course-block');
      const context = (unit ? unit.querySelector('.unit-header').textContent : '') + ' ' +
        (block ? block.querySelector('h2').textContent : '');
      return norm((li.textContent + ' ' + context).replace(/\s+/g, ' '));
    });

    const run = () => {
      const q = lectureFilter.value.trim();
      const terms = norm(q).split(/\s+/).filter(Boolean);
      let shown = 0;
      items.forEach((li, i) => {
        const hit = terms.every((t) => haystacks[i].includes(t));
        li.hidden = !hit;
        if (hit) shown += 1;
      });
      units.forEach((u) => {
        const any = !!u.querySelector('.lecture-item:not([hidden])');
        u.hidden = !any;
        const header = u.querySelector('.unit-header');
        if (header) setUnit(header, terms.length > 0 && any);
      });
      blocks.forEach((b) => { b.hidden = !b.querySelector('.unit-section:not([hidden])'); });
      if (countEl) countEl.textContent = shown;
      if (emptyEl) emptyEl.hidden = shown !== 0;
      const url = new URL(window.location.href);
      if (q) url.searchParams.set('q', q); else url.searchParams.delete('q');
      history.replaceState(null, '', url);
    };

    const initial = new URLSearchParams(window.location.search).get('q');
    if (initial) { lectureFilter.value = initial; run(); }
    lectureFilter.addEventListener('input', run);
    lectureFilter.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { lectureFilter.value = ''; run(); lectureFilter.blur(); }
    });
  }

  /* Open the unit a deep link points into (e.g. #unit-content-12). */
  const openFromHash = () => {
    const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
    if (target && target.classList.contains('unit-content')) {
      const header = target.previousElementSibling;
      if (header) setUnit(header, true);
    }
  };
  openFromHash();
  window.addEventListener('hashchange', openFromHash);
})();
