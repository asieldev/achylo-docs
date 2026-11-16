/* ============================================================
   Achylo Docs — Enhancement layer
   Header, theme, language, code chrome, TOC, callouts, pager
   ============================================================ */

(function () {
  'use strict';

  const THEME_KEY = 'achylo-theme';
  const LANG_KEY = 'achylo-docs-lang';
  const NAV_STATE_KEY = 'achylo-docs-nav-groups';
  const LANG_MAP = { en: 'English', es: 'Español', pt: 'Português' };

  const ICONS = {
    search:
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>',
    sun: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>',
    moon: '<svg viewBox="0 0 24 24"><path d="M21 12.79A9 9 0 1 1 11.21 3a7 7 0 0 0 9.79 9.79z"/></svg>',
    menu: '<svg viewBox="0 0 24 24"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>',
    close:
      '<svg viewBox="0 0 24 24"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>',
    copy: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',
    check:
      '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',
    external:
      '<svg viewBox="0 0 24 24"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>',
    chevron:
      '<svg class="docs-nav-group__chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>',
    info: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>',
    tip: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2z"/></svg>',
    warning:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>',
    danger:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>',
    note: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>',
    success:
      '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>'
  };

  const LANG_LABELS = {
    js: 'JavaScript',
    javascript: 'JavaScript',
    ts: 'TypeScript',
    typescript: 'TypeScript',
    bash: 'Shell',
    sh: 'Shell',
    shell: 'Shell',
    zsh: 'Shell',
    json: 'JSON',
    html: 'HTML',
    css: 'CSS',
    python: 'Python',
    py: 'Python',
    php: 'PHP',
    solidity: 'Solidity',
    sol: 'Solidity',
    http: 'HTTP',
    text: 'Text',
    txt: 'Text',
    yaml: 'YAML',
    yml: 'YAML',
    env: 'Env',
    diff: 'Diff',
    xml: 'XML',
    sql: 'SQL',
    go: 'Go',
    rust: 'Rust',
    ruby: 'Ruby',
    java: 'Java',
    csharp: 'C#',
    cpp: 'C++'
  };

  /* ---------- Theme ---------- */

  function applyTheme(theme) {
    document.body.dataset.theme = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem(THEME_KEY, theme);
  }

  function resolveTheme() {
    return localStorage.getItem(THEME_KEY) || 'light';
  }

  /* ---------- Header ---------- */

  function isMac() {
    return /Mac|iPhone|iPad|iPod/.test(navigator.platform || '');
  }

  function ensureHeader() {
    if (document.querySelector('.docs-header')) return;

    const header = document.createElement('header');
    header.className = 'docs-header notranslate';
    header.setAttribute('translate', 'no');
    header.innerHTML = `
      <button type="button" class="docs-header__btn docs-header__menu-toggle" id="docsMenuToggle" aria-label="Open navigation" aria-expanded="false">
        ${ICONS.menu}
      </button>
      <a class="docs-header__brand" href="/" aria-label="Achylo Docs home">
        <span class="docs-header__mark" aria-hidden="true">
          <img src="/assets/images/logo_app.png" alt="" width="26" height="26" />
        </span>
        <span class="docs-header__wordmark">Achylo</span>
        <span class="docs-header__badge">Docs</span>
      </a>
      <div class="docs-header__spacer"></div>
      <button type="button" class="docs-header__search" id="docsSearchTrigger" aria-label="Search documentation">
        ${ICONS.search}
        <span class="docs-header__search-label">Search docs…</span>
        <kbd class="docs-kbd">${isMac() ? '⌘' : 'Ctrl'}K</kbd>
      </button>
      <div class="docs-header__actions">
        <div class="docs-lang-wrap">
          <button type="button" class="docs-header__btn" id="docsLangToggle" aria-label="Change language" aria-expanded="false" aria-haspopup="true">
            <span id="docsLangLabel">English</span>
          </button>
          <div class="docs-lang-menu" id="docsLangMenu" role="menu">
            <button type="button" data-lang="en" role="menuitem">English</button>
            <button type="button" data-lang="es" role="menuitem">Español</button>
            <button type="button" data-lang="pt" role="menuitem">Português</button>
          </div>
        </div>
        <button type="button" class="docs-header__btn docs-theme-btn" id="docsThemeToggle" aria-label="Toggle light and dark mode">
          <span class="icon-sun" aria-hidden="true">${ICONS.sun}</span>
          <span class="icon-moon" aria-hidden="true">${ICONS.moon}</span>
        </button>
        <a class="docs-header__btn" href="https://achylo.com" target="_blank" rel="noopener noreferrer" aria-label="Open Achylo app">
          ${ICONS.external}
          <span class="docs-header__external-label">App</span>
        </a>
      </div>
    `;

    document.body.prepend(header);

    const backdrop = document.createElement('div');
    backdrop.className = 'docs-sidebar-backdrop';
    backdrop.id = 'docsSidebarBackdrop';
    document.body.appendChild(backdrop);

    const searchOverlay = document.createElement('div');
    searchOverlay.className = 'docs-search-overlay';
    searchOverlay.id = 'docsSearchOverlay';
    searchOverlay.innerHTML = `<div class="docs-search-dialog" id="docsSearchDialog" role="dialog" aria-modal="true" aria-label="Search"></div>`;
    document.body.appendChild(searchOverlay);

    const toc = document.createElement('nav');
    toc.className = 'docs-toc';
    toc.id = 'docsToc';
    toc.setAttribute('aria-label', 'On this page');
    document.body.appendChild(toc);

    wireHeaderControls();
  }

  function wireHeaderControls() {
    const themeBtn = document.getElementById('docsThemeToggle');
    themeBtn?.addEventListener('click', () => {
      const next = document.body.dataset.theme === 'dark' ? 'light' : 'dark';
      applyTheme(next);
    });

    const menuBtn = document.getElementById('docsMenuToggle');
    const backdrop = document.getElementById('docsSidebarBackdrop');
    const toggleNav = (open) => {
      const shouldOpen = typeof open === 'boolean' ? open : !document.body.classList.contains('docs-nav-open');
      document.body.classList.toggle('docs-nav-open', shouldOpen);
      backdrop?.classList.toggle('is-open', shouldOpen);
      if (menuBtn) {
        menuBtn.setAttribute('aria-expanded', String(shouldOpen));
        menuBtn.setAttribute('aria-label', shouldOpen ? 'Close navigation' : 'Open navigation');
        menuBtn.innerHTML = shouldOpen ? ICONS.close : ICONS.menu;
      }
    };
    menuBtn?.addEventListener('click', () => toggleNav());
    backdrop?.addEventListener('click', () => toggleNav(false));

    document.getElementById('docsSearchTrigger')?.addEventListener('click', openSearch);
    document.getElementById('docsSearchOverlay')?.addEventListener('click', (e) => {
      if (e.target.id === 'docsSearchOverlay') closeSearch();
    });

    document.addEventListener('keydown', (e) => {
      const meta = e.metaKey || e.ctrlKey;
      if (meta && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        openSearch();
      }
      if (e.key === 'Escape') {
        closeSearch();
        toggleNav(false);
        closeLangMenu();
      }
    });

    wireLanguage();
  }

  /* ---------- Language ---------- */

  function closeLangMenu() {
    const menu = document.getElementById('docsLangMenu');
    const toggle = document.getElementById('docsLangToggle');
    menu?.classList.remove('is-open');
    toggle?.setAttribute('aria-expanded', 'false');
  }

  function applyLang(lang) {
    const combo = document.querySelector('#google_translate_container select.goog-te-combo');
    if (combo) {
      combo.value = lang;
      combo.dispatchEvent(new Event('change'));
    }
    const label = document.getElementById('docsLangLabel');
    if (label) label.textContent = LANG_MAP[lang] || 'English';
    document.querySelectorAll('#docsLangMenu button').forEach((btn) => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });
    localStorage.setItem(LANG_KEY, lang);
    closeLangMenu();
  }

  function wireLanguage() {
    const toggle = document.getElementById('docsLangToggle');
    const menu = document.getElementById('docsLangMenu');
    toggle?.addEventListener('click', (e) => {
      e.stopPropagation();
      const open = !menu?.classList.contains('is-open');
      menu?.classList.toggle('is-open', open);
      toggle.setAttribute('aria-expanded', String(open));
    });
    menu?.addEventListener('click', (e) => {
      const btn = e.target.closest('button[data-lang]');
      if (!btn) return;
      applyLang(btn.dataset.lang);
    });
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.docs-lang-wrap')) closeLangMenu();
    });
  }

  function initGoogleTranslate() {
    window.googleTranslateElementInit = function () {
      // eslint-disable-next-line no-undef
      new google.translate.TranslateElement(
        {
          pageLanguage: 'en',
          includedLanguages: 'es,en,pt',
          autoDisplay: false
        },
        'google_translate_container'
      );
      const stored = localStorage.getItem(LANG_KEY) || 'en';
      setTimeout(() => applyLang(stored), 50);
    };

    if (!document.querySelector('script[data-google-translate]')) {
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.setAttribute('data-google-translate', 'true');
      document.body.appendChild(script);
    }
  }

  /* ---------- Search ---------- */

  function openSearch() {
    const overlay = document.getElementById('docsSearchOverlay');
    const dialog = document.getElementById('docsSearchDialog');
    if (!overlay || !dialog) return;

    // Move Docsify's search widget into the dialog if present
    let searchEl = document.querySelector('.sidebar .search') || document.querySelector('.search');
    if (searchEl && searchEl.parentElement !== dialog) {
      dialog.appendChild(searchEl);
      searchEl.style.display = 'block';
    }

    overlay.classList.add('is-open');
    const input = dialog.querySelector('input');
    if (input) {
      input.focus();
      input.select();
    }
  }

  function closeSearch() {
    const overlay = document.getElementById('docsSearchOverlay');
    overlay?.classList.remove('is-open');

    // Return search widget to sidebar so Docsify keeps working
    const dialog = document.getElementById('docsSearchDialog');
    const searchEl = dialog?.querySelector('.search');
    const sidebar = document.querySelector('.sidebar');
    if (searchEl && sidebar && searchEl.parentElement === dialog) {
      sidebar.insertBefore(searchEl, sidebar.firstChild);
    }
  }

  /* ---------- Clipboard ---------- */

  function copyText(text, btn) {
    const done = () => {
      if (!btn) return;
      btn.classList.add('is-copied');
      const prev = btn.innerHTML;
      btn.innerHTML = `${ICONS.check}<span>Copied</span>`;
      btn.setAttribute('aria-label', 'Copied');
      setTimeout(() => {
        btn.classList.remove('is-copied');
        btn.innerHTML = prev;
        btn.setAttribute('aria-label', 'Copy');
      }, 1800);
    };

    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(text).then(done).catch(() => fallbackCopy(text, done));
    } else {
      fallbackCopy(text, done);
    }
  }

  function fallbackCopy(text, done) {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      done();
    } catch (_) {
      /* ignore */
    }
    document.body.removeChild(ta);
  }

  function makeCopyButton(getText) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'docs-copy-btn';
    btn.setAttribute('aria-label', 'Copy');
    btn.innerHTML = `${ICONS.copy}<span>Copy</span>`;
    btn.addEventListener('click', () => copyText(getText(), btn));
    return btn;
  }

  /* ---------- Code blocks ---------- */

  function parseLang(raw) {
    if (!raw) return { lang: '', filename: '' };
    const cleaned = String(raw).trim();
    // Support "ts:src/file.ts" or "typescript filename=foo.ts"
    const filenameMatch = cleaned.match(/(?:filename|file)=([^\s]+)/i);
    if (filenameMatch) {
      const lang = cleaned.replace(filenameMatch[0], '').trim().split(/[\s:]+/)[0] || '';
      return { lang, filename: filenameMatch[1] };
    }
    if (cleaned.includes(':') && !cleaned.startsWith('http')) {
      const [lang, ...rest] = cleaned.split(':');
      if (rest.length && /\.|\/|\\/.test(rest.join(':'))) {
        return { lang, filename: rest.join(':') };
      }
    }
    return { lang: cleaned.split(/\s+/)[0], filename: '' };
  }

  function enhanceCodeBlocks(root) {
    root.querySelectorAll('pre').forEach((pre) => {
      if (pre.closest('.docs-code-wrap') || pre.dataset.docsEnhanced === '1') return;

      // Remove legacy chrome
      pre.querySelector('.code-dots')?.remove();
      pre.querySelector('.copy-code-btn')?.remove();

      const code = pre.querySelector('code');
      if (!code) return;

      const rawLang =
        pre.getAttribute('data-lang') ||
        (code.className.match(/language-([^\s]+)/) || [])[1] ||
        '';
      const { lang, filename } = parseLang(rawLang);
      const label =
        LANG_LABELS[lang.toLowerCase()] ||
        (lang ? lang.toUpperCase() : guessLangFromContent(code.innerText || ''));

      // HTTP method endpoint chrome for simple request lines
      if (lang.toLowerCase() === 'http' || looksLikeHttpBlock(code)) {
        if (tryEnhanceHttpEndpoint(pre, code)) return;
      }

      const wrap = document.createElement('div');
      wrap.className = 'docs-code-wrap notranslate';
      wrap.setAttribute('translate', 'no');

      const header = document.createElement('div');
      header.className = 'docs-code-header';
      header.innerHTML = `
        <div class="docs-code-header__meta">
          <span class="docs-code-lang">${escapeHtml(label)}</span>
          ${filename ? `<span class="docs-code-filename">${escapeHtml(filename)}</span>` : ''}
        </div>
      `;
      header.appendChild(
        makeCopyButton(() => code.innerText.replace(/\n$/, ''))
      );

      pre.classList.add('docs-enhanced');
      pre.dataset.docsEnhanced = '1';
      pre.parentNode.insertBefore(wrap, pre);
      wrap.appendChild(header);
      wrap.appendChild(pre);
    });
  }

  function guessLangFromContent(text) {
    const t = text.trim();
    if (/^https?:\/\//i.test(t) && !t.includes('\n')) return 'URL';
    if (/^(GET|POST|PUT|PATCH|DELETE)\s+/i.test(t)) return 'HTTP';
    if (/^\{[\s\S]*\}$/.test(t) || /^\[[\s\S]*\]$/.test(t)) return 'JSON';
    if (/^(npm|yarn|pnpm|curl|export|cd |mkdir )/m.test(t)) return 'Shell';
    return 'Code';
  }

  function looksLikeHttpBlock(codeEl) {
    const text = (codeEl.innerText || '').trim();
    return /^(GET|POST|PUT|PATCH|DELETE)\s+\S+/i.test(text.split('\n')[0] || '');
  }

  function tryEnhanceHttpEndpoint(pre, code) {
    const lines = (code.innerText || '').trim().split('\n');
    const first = lines[0] || '';
    const match = first.match(/^(GET|POST|PUT|PATCH|DELETE)\s+(\S+)/i);
    if (!match) return false;

    // Only convert single-line or method+headers simple blocks into endpoint bar;
    // multi-line bodies keep the full code block treatment but still get wrapped.
    if (lines.length > 6) return false;

    const method = match[1].toUpperCase();
    const path = match[2];

    const endpoint = document.createElement('div');
    endpoint.className = 'docs-endpoint notranslate';
    endpoint.setAttribute('translate', 'no');
    endpoint.innerHTML = `
      <span class="docs-method docs-method--${method.toLowerCase()}">${method}</span>
      <code class="docs-endpoint-path">${escapeHtml(path)}</code>
    `;
    endpoint.appendChild(makeCopyButton(() => path));

    // If there are extra header lines, keep a compact code wrap below
    const rest = lines.slice(1).filter((l) => l.trim()).join('\n');
    pre.dataset.docsEnhanced = '1';
    pre.parentNode.insertBefore(endpoint, pre);

    if (rest) {
      const wrap = document.createElement('div');
      wrap.className = 'docs-code-wrap';
      const header = document.createElement('div');
      header.className = 'docs-code-header';
      header.innerHTML = `<div class="docs-code-header__meta"><span class="docs-code-lang">Headers</span></div>`;
      header.appendChild(makeCopyButton(() => rest));
      const newPre = document.createElement('pre');
      newPre.className = 'docs-enhanced';
      newPre.dataset.docsEnhanced = '1';
      const newCode = document.createElement('code');
      newCode.textContent = rest;
      newPre.appendChild(newCode);
      wrap.appendChild(header);
      wrap.appendChild(newPre);
      pre.parentNode.insertBefore(wrap, pre);
    }

    pre.remove();
    return true;
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  /* ---------- Callouts ---------- */

  function detectCallout(text) {
    const t = text.trim();
    if (/^(⚠️|⚠)|danger|irreversible|do\s*\*\*not\*\*|do not use/i.test(t) && /warning|important|danger|⚠️/i.test(t.slice(0, 80))) {
      if (/danger|irreversible|cannot be turned off/i.test(t.slice(0, 120))) {
        return { type: 'danger', title: 'Danger' };
      }
      return { type: 'warning', title: 'Warning' };
    }
    if (/^(\*\*)?(tip|💡)/i.test(t)) return { type: 'tip', title: 'Tip' };
    if (/^(\*\*)?(success|✅)/i.test(t)) return { type: 'success', title: 'Success' };
    if (/^(\*\*)?(info|ℹ️)/i.test(t)) return { type: 'info', title: 'Info' };
    if (/^(\*\*)?(note|important)/i.test(t)) {
      if (/important/i.test(t.slice(0, 40))) return { type: 'warning', title: 'Important' };
      return { type: 'note', title: 'Note' };
    }
    if (/^⚠️/.test(t)) return { type: 'warning', title: 'Warning' };
    return { type: 'note', title: 'Note' };
  }

  function enhanceCallouts(root) {
    root.querySelectorAll('blockquote').forEach((bq) => {
      if (bq.classList.contains('docs-callout')) return;
      const text = bq.textContent || '';
      if (!text.trim()) return;

      const { type, title } = detectCallout(text);
      const iconMap = {
        info: ICONS.info,
        tip: ICONS.tip,
        warning: ICONS.warning,
        danger: ICONS.danger,
        note: ICONS.note,
        success: ICONS.success
      };

      bq.className = `docs-callout docs-callout--${type}`;
      const body = document.createElement('div');
      body.className = 'docs-callout__body';

      const titleEl = document.createElement('div');
      titleEl.className = 'docs-callout__title';
      titleEl.textContent = title;

      // Clean leading label from first paragraph if present
      const children = Array.from(bq.childNodes);
      children.forEach((node) => body.appendChild(node));

      const firstP = body.querySelector('p');
      if (firstP) {
        firstP.innerHTML = firstP.innerHTML
          .replace(/^(\s*(?:⚠️|⚠|💡|ℹ️|✅)\s*)/u, '')
          .replace(/^(\s*<strong>\s*)?(TIP|NOTE|WARNING|IMPORTANT|DANGER|INFO|SUCCESS)(\s*:?\s*<\/strong>)?\s*/i, '')
          .replace(/^(\*\*)?(TIP|NOTE|WARNING|IMPORTANT|DANGER|INFO|SUCCESS)(\*\*)?:?\s*/i, '');
      }

      bq.innerHTML = '';
      const icon = document.createElement('div');
      icon.className = 'docs-callout__icon';
      icon.innerHTML = iconMap[type] || ICONS.note;
      icon.setAttribute('aria-hidden', 'true');

      body.prepend(titleEl);
      bq.appendChild(icon);
      bq.appendChild(body);
    });
  }

  /* ---------- Tables ---------- */

  function enhanceTables(root) {
    root.querySelectorAll('table').forEach((table) => {
      if (table.parentElement?.classList.contains('table-wrapper')) return;
      const wrapper = document.createElement('div');
      wrapper.className = 'table-wrapper';
      table.parentNode.insertBefore(wrapper, table);
      wrapper.appendChild(table);
    });
  }

  /* ---------- Anchors ---------- */

  function enhanceAnchors() {
    // Docsify already wraps heading titles in `.anchor`; no extra hash needed.
  }

  /* ---------- Breadcrumbs ---------- */

  function enhanceBreadcrumbs(root) {
    root.querySelector('.docs-breadcrumbs')?.remove();

    const path = (window.location.pathname || '/').replace(/\/$/, '') || '/';
    if (path === '/' || path === '/README' || path === '/index.html') return;

    const parts = path.split('/').filter(Boolean);
    const crumbs = [{ label: 'Docs', href: '/' }];
    let acc = '';
    parts.forEach((part, i) => {
      acc += `/${part}`;
      const isLast = i === parts.length - 1;
      const label = decodeURIComponent(part)
        .replace(/\.md$/i, '')
        .replace(/-/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
      crumbs.push({ label, href: isLast ? null : acc });
    });

    const nav = document.createElement('nav');
    nav.className = 'docs-breadcrumbs';
    nav.setAttribute('aria-label', 'Breadcrumb');
    nav.innerHTML = crumbs
      .map((c, i) => {
        const sep = i ? `<span class="docs-breadcrumbs__sep" aria-hidden="true">/</span>` : '';
        if (!c.href) {
          return `${sep}<span class="docs-breadcrumbs__current">${escapeHtml(c.label)}</span>`;
        }
        return `${sep}<a href="${c.href}">${escapeHtml(c.label)}</a>`;
      })
      .join('');

    const h1 = root.querySelector('h1');
    if (h1) root.insertBefore(nav, h1);
    else root.prepend(nav);
  }

  /* ---------- TOC ---------- */

  function buildToc(root) {
    const toc = document.getElementById('docsToc');
    const content = document.querySelector('.content');
    if (!toc) return;

    const headings = Array.from(root.querySelectorAll('h2[id], h3[id]'));
    if (headings.length < 3) {
      toc.classList.remove('is-visible');
      toc.innerHTML = '';
      content?.classList.remove('has-toc');
      return;
    }

    toc.innerHTML = `
      <div class="docs-toc__title">On this page</div>
      <ul class="docs-toc__list">
        ${headings
          .map((h) => {
            const level = h.tagName === 'H3' ? 'docs-toc__h3' : 'docs-toc__h2';
            const text = Array.from(h.childNodes)
              .filter((n) => n.nodeType === 3 || (n.nodeType === 1 && !n.classList?.contains('docs-anchor')))
              .map((n) => n.textContent)
              .join('')
              .trim();
            return `<li><a class="${level}" href="#${h.id}">${escapeHtml(text)}</a></li>`;
          })
          .join('')}
      </ul>
    `;
    toc.classList.add('is-visible');
    content?.classList.add('has-toc');

    const links = Array.from(toc.querySelectorAll('a'));
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          links.forEach((l) => l.classList.toggle('is-active', l.getAttribute('href') === `#${id}`));
        });
      },
      { rootMargin: '-20% 0px -70% 0px', threshold: 0 }
    );
    headings.forEach((h) => observer.observe(h));
  }

  /* ---------- Sidebar groups ---------- */

  function enhanceSidebarGroups() {
    const nav = document.querySelector('.sidebar-nav > ul');
    if (!nav) return;

    let state = {};
    try {
      state = JSON.parse(localStorage.getItem(NAV_STATE_KEY) || '{}');
    } catch (_) {
      state = {};
    }

    Array.from(nav.children).forEach((li, index) => {
      const nested = li.querySelector(':scope > ul');
      if (!nested) return;

      if (li.classList.contains('docs-nav-group') && li.querySelector('.docs-nav-group__label')) {
        // Keep group containing the active page expanded
        if (li.querySelector('li.active, .active')) li.classList.remove('is-collapsed');
        return;
      }

      // Find label: p, strong, or first text
      let labelEl =
        li.querySelector(':scope > p') ||
        li.querySelector(':scope > strong') ||
        li.querySelector(':scope > span');

      // Docsify often wraps group title as text node + ul
      if (!labelEl) {
        const textNode = Array.from(li.childNodes).find(
          (n) => n.nodeType === 3 && n.textContent.trim()
        );
        if (textNode) {
          labelEl = document.createElement('button');
          labelEl.type = 'button';
          labelEl.className = 'docs-nav-group__label';
          labelEl.textContent = textNode.textContent.trim();
          textNode.replaceWith(labelEl);
        }
      }

      if (!labelEl) return;

      li.classList.add('docs-nav-group');
      const key =
        (labelEl.textContent || '').trim().toUpperCase() || `group-${index}`;

      if (labelEl.tagName !== 'BUTTON') {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'docs-nav-group__label';
        btn.innerHTML = `<span>${escapeHtml((labelEl.textContent || '').trim())}</span>${ICONS.chevron}`;
        labelEl.replaceWith(btn);
        labelEl = btn;
      } else if (!labelEl.querySelector('.docs-nav-group__chevron')) {
        labelEl.classList.add('docs-nav-group__label');
        const span = document.createElement('span');
        span.textContent = labelEl.textContent.trim();
        labelEl.textContent = '';
        labelEl.appendChild(span);
        labelEl.insertAdjacentHTML('beforeend', ICONS.chevron);
      }

      const hasActive = !!li.querySelector('li.active, a.active, .active');
      const collapsed = state[key] === true && !hasActive;
      li.classList.toggle('is-collapsed', collapsed);

      labelEl.onclick = (e) => {
        e.preventDefault();
        e.stopPropagation();
        li.classList.toggle('is-collapsed');
        state[key] = li.classList.contains('is-collapsed');
        localStorage.setItem(NAV_STATE_KEY, JSON.stringify(state));
      };
    });
  }

  /* ---------- Prev / Next ---------- */

  function getSidebarLinks() {
    // Page links from _sidebar.md only (subMaxLevel is 0 — no in-page TOC in sidebar)
    return Array.from(document.querySelectorAll('.sidebar-nav a'))
      .map((a) => ({
        href: a.getAttribute('href') || '',
        title: (a.textContent || '').trim()
      }))
      .filter((l) => {
        if (!l.href || !l.title) return false;
        if (l.href.startsWith('http') || l.href.startsWith('#')) return false;
        if (l.href.includes('?id=')) return false;
        return true;
      });
  }

  function normalizePath(href) {
    try {
      const u = new URL(href, window.location.origin);
      let p = u.pathname.replace(/\/$/, '') || '/';
      p = p.replace(/\.md$/i, '');
      if (p === '/README' || p === '/index') p = '/';
      return p;
    } catch {
      return href;
    }
  }

  function enhancePager(root) {
    root.querySelector('.docs-pager')?.remove();
    const links = getSidebarLinks();
    if (links.length < 2) return;

    const current = normalizePath(window.location.pathname);
    const idx = links.findIndex((l) => normalizePath(l.href) === current);
    if (idx === -1) return;

    const prev = links[idx - 1];
    const next = links[idx + 1];
    if (!prev && !next) return;

    const pager = document.createElement('nav');
    pager.className = 'docs-pager';
    pager.setAttribute('aria-label', 'Page navigation');

    if (prev) {
      pager.innerHTML += `
        <a class="docs-pager__link docs-pager__link--prev" href="${prev.href}">
          <span class="docs-pager__label">Previous</span>
          <span class="docs-pager__title">${escapeHtml(prev.title)}</span>
        </a>`;
    } else {
      pager.innerHTML += `<div></div>`;
    }

    if (next) {
      pager.innerHTML += `
        <a class="docs-pager__link docs-pager__link--next" href="${next.href}">
          <span class="docs-pager__label">Next</span>
          <span class="docs-pager__title">${escapeHtml(next.title)}</span>
        </a>`;
    }

    root.appendChild(pager);
  }

  /* ---------- Page enhance pipeline ---------- */

  function enhancePage() {
    const section = document.querySelector('.markdown-section');
    if (!section) return;

    enhanceBreadcrumbs(section);
    enhanceCallouts(section);
    enhanceTables(section);
    enhanceCodeBlocks(section);
    enhanceAnchors();
    buildToc(section);
    enhancePager(section);
    enhanceSidebarGroups();

    // Close mobile nav on route change
    document.body.classList.remove('docs-nav-open');
    document.getElementById('docsSidebarBackdrop')?.classList.remove('is-open');
  }

  /* ---------- Docsify plugin ---------- */

  function docsEnhancePlugin(hook) {
    function markSidebarNoTranslate() {
      const sidebar = document.querySelector('.sidebar');
      if (sidebar) {
        sidebar.classList.add('notranslate');
        sidebar.setAttribute('translate', 'no');
      }
    }

    function scheduleEnhance() {
      requestAnimationFrame(() => {
        enhancePage();
        setTimeout(() => {
          enhancePage();
          enhanceSidebarGroups();
          markSidebarNoTranslate();
        }, 120);
        setTimeout(() => {
          enhanceSidebarGroups();
          markSidebarNoTranslate();
        }, 400);
      });
    }

    hook.ready(() => {
      ensureHeader();
      applyTheme(resolveTheme());
      markSidebarNoTranslate();
      initGoogleTranslate();

      const sidebarHost = document.querySelector('.sidebar') || document.body;
      const mo = new MutationObserver(() => {
        enhanceSidebarGroups();
        markSidebarNoTranslate();
      });
      mo.observe(sidebarHost, { childList: true, subtree: true });
    });

    hook.doneEach(() => {
      ensureHeader();
      markSidebarNoTranslate();
      scheduleEnhance();
    });
  }

  // Expose plugin for Docsify config
  window.AchyloDocsEnhance = docsEnhancePlugin;

  // Early theme to avoid flash
  applyTheme(resolveTheme());

  // Bootstrap header ASAP
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ensureHeader);
  } else {
    ensureHeader();
  }
})();
