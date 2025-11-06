document.addEventListener('DOMContentLoaded', () => {
  // ===== Hero slides (simple fade) =====
  const SLIDE_INTERVAL_MS = 5000;
  const slides = Array.from(document.querySelectorAll('.slide'));
  let slideIndex = 0;
  const showSlide = (i) => slides.forEach((el, idx) => el.classList.toggle('is-active', idx === i));
  if (slides.length) {
    showSlide(slideIndex);
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (!mq.matches) setInterval(() => { slideIndex = (slideIndex + 1) % slides.length; showSlide(slideIndex); }, SLIDE_INTERVAL_MS);
  }

  // ===== Overlay screens =====
  const cta = document.querySelector('[data-next]');
  const fade = document.getElementById('fadeScreen');
  const backBtn = document.getElementById('backBtn');

  const screen1 = () => document.querySelector('.screen-1');
  const screen2 = () => document.querySelector('.screen-2');
  const screen3 = () => document.querySelector('.screen-3');
  const screen4 = () => document.querySelector('.screen-4');
  const screen5 = () => document.querySelector('.screen-5');
  const screen6 = () => document.querySelector('.screen-6');
  const screen7 = () => document.querySelector('.screen-7');

  const resetScreensToStep1 = () => {
    fade.classList.remove('step-2', 'step-3');
    const s1 = screen1(), s2 = screen2(), s3 = screen3(), s4 = screen4(), s5 = screen5(), s6 = screen6(), s7 = screen7();
    if (s1) s1.setAttribute('aria-hidden', 'false');
    if (s2) s2.setAttribute('aria-hidden', 'true');
    if (s3) s3.setAttribute('aria-hidden', 'true');
    if (s4) s4.setAttribute('aria-hidden', 'true');
    if (s5) s5.setAttribute('aria-hidden', 'true');
    if (s6) s6.setAttribute('aria-hidden', 'true');
    if (s7) s7.setAttribute('aria-hidden', 'true');
  };

  const openOverlay = () => {
    resetScreensToStep1();
    fade.classList.add('active');
    document.documentElement.style.backgroundColor = '#fff';
    document.documentElement.classList.add('blank-mode');
    const onDone = (ev) => {
      if (ev && ev.target !== fade) return;
      fade.classList.add('done');
      document.documentElement.classList.add('names-in');
      fade.setAttribute('aria-hidden', 'false');
    };
    fade.addEventListener('transitionend', onDone, { once: true });
  };

  cta && fade && cta.addEventListener('click', (e) => { e.preventDefault(); openOverlay(); });

  backBtn && fade && backBtn.addEventListener('click', () => {
    if (fade.classList.contains('step-7')) {
      fade.classList.remove('step-7');
      const s6 = screen6(), s7 = screen7();
      if (s6 && s7) { s6.setAttribute('aria-hidden','false'); s7.setAttribute('aria-hidden','true'); }
      return;
    }
    if (fade.classList.contains('step-6')) {
      fade.classList.remove('step-6');
      const s5 = screen5(), s6 = screen6();
      if (s5 && s6) { s5.setAttribute('aria-hidden','false'); s6.setAttribute('aria-hidden','true'); }
      return;
    }
    if (fade.classList.contains('step-5')) {
      fade.classList.remove('step-5');
      const s4 = screen4(), s5 = screen5();
      if (s4 && s5) { s4.setAttribute('aria-hidden','false'); s5.setAttribute('aria-hidden','true'); }
      return;
    }
    if (fade.classList.contains('step-4')) {
      fade.classList.remove('step-4');
      const s3 = screen3(), s4 = screen4();
      if (s3 && s4) { s3.setAttribute('aria-hidden','false'); s4.setAttribute('aria-hidden','true'); }
      return;
    }
    if (fade.classList.contains('step-3')) {
      fade.classList.remove('step-3');
      const s2 = screen2(), s3 = screen3();
      if (s2 && s3) { s2.setAttribute('aria-hidden','false'); s3.setAttribute('aria-hidden','true'); }
      return;
    }
    if (fade.classList.contains('step-2')) {
      fade.classList.remove('step-2');
      const s1 = screen1(), s2 = screen2();
      if (s1 && s2) { s1.setAttribute('aria-hidden','false'); s2.setAttribute('aria-hidden','true'); }
      return;
    }
    // Close overlay, restore landing
    fade.classList.remove('active');
    fade.setAttribute('aria-hidden', 'true');
    fade.classList.remove('done', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7');
    resetScreensToStep1();
    document.documentElement.classList.remove('blank-mode', 'names-in');
    document.documentElement.style.backgroundColor = '';
  });

  // Next buttons
  const nextBtn1 = document.getElementById('nextBtn');
  nextBtn1 && nextBtn1.addEventListener('click', (e) => {
    e.preventDefault();
    const s1 = screen1(), s2 = screen2();
    if (s1 && s2) { s1.setAttribute('aria-hidden','true'); s2.setAttribute('aria-hidden','false'); }
    fade && requestAnimationFrame(() => fade.classList.add('step-2'));
  });

  const nextBtn2 = document.getElementById('nextBtn2');
  nextBtn2 && nextBtn2.addEventListener('click', (e) => {
    e.preventDefault();
    const s2 = screen2(), s3 = screen3();
    if (s2 && s3) { s2.setAttribute('aria-hidden','true'); s3.setAttribute('aria-hidden','false'); }
    fade && requestAnimationFrame(() => fade.classList.add('step-3'));
  });

  // Next from screen 3 to screen 4
  const wireNext3 = () => {
    const next3 = document.getElementById('nextBtn3');
    next3 && next3.addEventListener('click', (e) => {
      e.preventDefault();
      const s3 = screen3(), s4 = screen4();
      if (s3 && s4) { s3.setAttribute('aria-hidden','true'); s4.setAttribute('aria-hidden','false'); }
      fade && requestAnimationFrame(() => fade.classList.add('step-4'));
    });
  };

  // ===== Screen 2: Partner field show/hide with fade =====
  const maritalSel = document.getElementById('maritalStatus');
  const partnerField = document.getElementById('partnerField');
  const updatePartnerVisibility = () => {
    if (!maritalSel || !partnerField) return;
    const v = (maritalSel.value || '').toLowerCase();
    const norm = v.normalize ? v.normalize('NFD').replace(/[\u0300-\u036f]/g, '') : v;
    const show = norm.includes('casado') || norm.includes('union');
    // On first run, hand control to CSS classes and remove [hidden]
    if (!partnerField.dataset.init) {
      partnerField.dataset.init = '1';
      partnerField.removeAttribute('hidden');
    }
    partnerField.classList.toggle('is-visible', show);
    partnerField.classList.toggle('is-hidden', !show);
    partnerField.setAttribute('aria-hidden', show ? 'false' : 'true');
    const partnerInput = partnerField.querySelector('input');
    if (partnerInput) partnerInput.required = !!show;
  };
  maritalSel && maritalSel.addEventListener('change', updatePartnerVisibility);
  updatePartnerVisibility();

  // ===== Repeatable groups (children, pets) =====
  const makeRepeatableItem = (name, placeholder) => {
    const wrap = document.createElement('div');
    wrap.className = 'item';
    const input = document.createElement('input');
    input.type = 'text';
    input.name = name + '[]';
    input.placeholder = placeholder || '';
    const remove = document.createElement('button');
    remove.type = 'button';
    remove.className = 'remove';
    remove.textContent = 'Eliminar';
    wrap.appendChild(input);
    wrap.appendChild(remove);
    return wrap;
  };

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.repeatable .add');
    if (addBtn) {
      e.preventDefault();
      const field = addBtn.closest('.repeatable');
      const items = field && field.querySelector('.items');
      if (!items) return;
      const name = field.dataset.name || 'items';
      const placeholder = field.dataset.placeholder || '';
      const node = makeRepeatableItem(name, placeholder);
      items.appendChild(node);
      const inp = node.querySelector('input');
      inp && inp.focus();
      return;
    }
    const removeBtn = e.target.closest('.repeatable .remove');
    if (removeBtn) {
      e.preventDefault();
      const item = removeBtn.closest('.item');
      item && item.remove();
    }
  });

  // ===== Custom select enhancer (non-breaking) =====
  const enhanceSelect = (wrap) => {
    const select = wrap.querySelector('select');
    if (!select) return;

    // Avoid double-enhance
    if (wrap.dataset.enhanced === '1') return;
    wrap.dataset.enhanced = '1';

    // Keep native select for form submission, but visually hide it
    select.classList.add('enhanced-hidden');

    // Visible trigger button mirrors current value
    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'custom-select-trigger';
    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.textContent = (select.selectedOptions[0] && select.selectedOptions[0].textContent) || (select.options[0] && select.options[0].textContent) || 'Seleccioneâ€¦';

    // Ensure chevron exists
    let chev = wrap.querySelector('.select-chevron');
    if (!chev) {
      chev = document.createElement('span');
      chev.className = 'select-chevron';
      chev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
    }

    // Options list (rendered on open)
    const list = document.createElement('div');
    list.className = 'custom-select-list';
    list.setAttribute('role', 'listbox');
    list.tabIndex = -1;

    const options = Array.from(select.options);
    let activeIndex = Math.max(0, options.findIndex(o => o.selected));

    const renderOptions = () => {
      list.innerHTML = '';
      options.forEach((opt, idx) => {
        const item = document.createElement('div');
        item.className = 'custom-select-option' + (idx === activeIndex ? ' is-active' : '');
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', String(opt.selected));
        item.dataset.value = opt.value;
        item.textContent = opt.textContent;
        item.addEventListener('click', () => {
          select.value = opt.value;
          options.forEach(o => (o.selected = (o === opt)));
          trigger.textContent = opt.textContent;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          close();
        });
        list.appendChild(item);
      });
    };

    const open = () => {
      wrap.classList.add('is-open');
      trigger.setAttribute('aria-expanded', 'true');
      // Sync activeIndex with current selection before rendering
      activeIndex = Math.max(0, options.findIndex(o => o.selected));
      renderOptions();
      list.focus({ preventScroll: true });
    };
    const close = () => {
      wrap.classList.remove('is-open');
      trigger.setAttribute('aria-expanded', 'false');
      trigger.focus({ preventScroll: true });
    };
    const toggle = () => (wrap.classList.contains('is-open') ? close() : open());

    trigger.addEventListener('click', toggle);

    // Keyboard navigation on list
    list.addEventListener('keydown', (e) => {
      const max = options.length - 1;
      if (e.key === 'ArrowDown') { e.preventDefault(); activeIndex = Math.min(max, activeIndex + 1); renderOptions(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); activeIndex = Math.max(0, activeIndex - 1); renderOptions(); }
      else if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const opt = options[activeIndex] || options[0];
        select.value = opt.value;
        options.forEach(o => (o.selected = (o === opt)));
        trigger.textContent = opt.textContent;
        select.dispatchEvent(new Event('change', { bubbles: true }));
        close();
      } else if (e.key === 'Escape') { e.preventDefault(); close(); }
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target)) close();
    });

    // Keep trigger label in sync if native select changes (e.g., programmatically)
    select.addEventListener('change', () => {
      const opt = select.selectedOptions[0];
      if (opt) trigger.textContent = opt.textContent;
    });

    // Attach to DOM
    wrap.appendChild(trigger);
    wrap.appendChild(list);
    if (!chev.isConnected) wrap.appendChild(chev);
  };

  // Enhance marked selects in blank form (e.g., Nacionalidad, Estado civil)
  document.querySelectorAll('.blank-form .select-wrap[data-enhance-select]')
    .forEach(enhanceSelect);

  // ===== Screen 3: Experiences form (injected to avoid breaking HTML encoding) =====
  const s3 = document.querySelector('.screen-3');
  if (s3 && !document.getElementById('experience-form')) {
    const hr = document.createElement('hr');
    hr.className = 'light-blue-divider';

    const form = document.createElement('form');
    form.id = 'experience-form';
    form.className = 'blank-form';
    form.noValidate = true;

    const fields = document.createElement('div');
    fields.className = 'fields';

    const field = document.createElement('div');
    field.className = 'field';

    const label = document.createElement('label');
    label.textContent = 'Deportes favoritos';

    const group = document.createElement('div');
    group.className = 'checkbox-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Deportes favoritos');

    const options = [
      'Futbol',
      'Futbol americano',
      'Baloncesto',
      'Beisbol',
      'Tenis',
      'Padel',
      'Golf',
      'Rugby',
      'Voleibol',
      'Natacion',
      'Ciclismo',
      'Running',
      'Automovilismo',
      'Motociclismo',
      'Boxeo',
      'MMA'
    ];
    options.forEach((v) => {
      const lab = document.createElement('label');
      lab.className = 'check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.name = 'sports[]';
      inp.value = v;
      const span = document.createElement('span');
      span.textContent = v;
      lab.appendChild(inp);
      lab.appendChild(span);
      group.appendChild(lab);
    });

    field.appendChild(label);
    field.appendChild(group);
    fields.appendChild(field);
    form.appendChild(fields);
    s3.appendChild(hr);
    s3.appendChild(form);

    // Add a "Next" arrow button to Screen 3 (same style as Screen 2)
    const next3 = document.createElement('button');
    next3.id = 'nextBtn3';
    next3.className = 'next-btn';
    next3.type = 'button';
    next3.setAttribute('aria-label', 'Continuar');
    next3.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n    </svg>';
    s3.appendChild(next3);
    wireNext3();
  }

  // ===== Screen 4: replicate of Screen 3 =====
  const s4 = document.querySelector('.screen-4');
  if (s4 && !document.getElementById('experience-form-4')) {
    const hr = document.createElement('hr');
    hr.className = 'light-blue-divider';

    const form = document.createElement('form');
    form.id = 'experience-form-4';
    form.className = 'blank-form';
    form.noValidate = true;

    const fields = document.createElement('div');
    fields.className = 'fields';

    const field = document.createElement('div');
    field.className = 'field';

    const label = document.createElement('label');
    label.textContent = 'Deportes favoritos';
    // Override title to requested copy for screen 4
    label.textContent = 'Intereses culturales';

    const group = document.createElement('div');
    group.className = 'checkbox-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Deportes favoritos');
    // Keep aria-label consistent with title for screen 4
    group.setAttribute('aria-label', 'Intereses culturales');

    const unescapeUnicode = (str) => str.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    const options = [ 'Arte', 'Arquitectura', 'Gastronom\\u00eda' ];
    options.forEach((v) => {
      const lab = document.createElement('label');
      lab.className = 'check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.name = 'cultural[]';
      inp.value = unescapeUnicode(v);
      const span = document.createElement('span');
      span.textContent = unescapeUnicode(v);
      lab.appendChild(inp);
      lab.appendChild(span);
      group.appendChild(lab);
    });

    // Extra common cultural interests
    const extraOptions = [
      'Musica', 'Cine', 'Teatro', 'Literatura', 'Historia',
      'Fotografia', 'Danza', 'Pintura', 'Museos', 'Diseno',
      'Moda', 'Arqueologia'
    ];
    extraOptions.forEach((v) => {
      const lab = document.createElement('label');
      lab.className = 'check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.name = 'cultural[]';
      inp.value = unescapeUnicode(v);
      const span = document.createElement('span');
      span.textContent = unescapeUnicode(v);
      lab.appendChild(inp);
      lab.appendChild(span);
      group.appendChild(lab);
    });

    field.appendChild(label);
    field.appendChild(group);
    fields.appendChild(field);
    form.appendChild(fields);
    s4.appendChild(hr);
    s4.appendChild(form);

    const next4 = document.createElement('button');
    next4.id = 'nextBtn4';
    next4.className = 'next-btn';
    next4.type = 'button';
    next4.setAttribute('aria-label', 'Continuar');
    next4.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n    </svg>';
    s4.appendChild(next4);

    // Wire: Screen 4 -> Screen 5
    next4.addEventListener('click', (e) => {
      e.preventDefault();
      const s4n = screen4(), s5n = screen5();
      if (s4n && s5n) { s4n.setAttribute('aria-hidden','true'); s5n.setAttribute('aria-hidden','false'); }
      fade && requestAnimationFrame(() => fade.classList.add('step-5'));
    });
  }

  // ===== Screen 5: replicate of Screen 4 =====
  const s5 = document.querySelector('.screen-5');
  if (s5 && !document.getElementById('experience-form-5')) {
    const hr = document.createElement('hr');
    hr.className = 'light-blue-divider';

    const form = document.createElement('form');
    form.id = 'experience-form-5';
    form.className = 'blank-form';
    form.noValidate = true;

    const fields = document.createElement('div');
    fields.className = 'fields';

    const field = document.createElement('div');
    field.className = 'field';

    const label = document.createElement('label');
    label.textContent = 'Bebidas o vinos favoritos';

    const group = document.createElement('div');
    group.className = 'checkbox-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Bebidas o vinos favoritos');

    const unescapeUnicode = (str) => str.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    const options5 = [
      'Vino tinto', 'Vino blanco', 'Vino rosado', 'Champagne/Espumante'
    ];
    options5.forEach((v) => {
      const lab = document.createElement('label');
      lab.className = 'check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.name = 'cultural[]';
      inp.value = unescapeUnicode(v);
      const span = document.createElement('span');
      span.textContent = unescapeUnicode(v);
      lab.appendChild(inp);
      lab.appendChild(span);
      group.appendChild(lab);
    });

    const extraOptions5 = [
      'Malbec', 'Cabernet Sauvignon', 'Merlot', 'Pinot Noir', 'Syrah', 'Tempranillo',
      'Chardonnay', 'Sauvignon Blanc', 'Riesling',
      'Cerveza', 'IPA', 'Lager', 'Stout',
      'Whisky', 'Gin', 'Ron', 'Vodka', 'Tequila', 'Mezcal',
      'C\u00f3cteles cl\u00e1sicos', 'Caf\u00e9', 'T\u00e9'
    ];
    extraOptions5.forEach((v) => {
      const lab = document.createElement('label');
      lab.className = 'check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.name = 'cultural[]';
      inp.value = unescapeUnicode(v);
      const span = document.createElement('span');
      span.textContent = unescapeUnicode(v);
      lab.appendChild(inp);
      lab.appendChild(span);
      group.appendChild(lab);
    });

    field.appendChild(label);
    field.appendChild(group);
    fields.appendChild(field);
    form.appendChild(fields);
    s5.appendChild(hr);
    s5.appendChild(form);

    const next5 = document.createElement('button');
    next5.id = 'nextBtn5';
    next5.className = 'next-btn';
    next5.type = 'button';
    next5.setAttribute('aria-label', 'Continuar');
    next5.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n    </svg>';
    s5.appendChild(next5);

    // Wire: Screen 5 -> Screen 6
    next5.addEventListener('click', (e) => {
      e.preventDefault();
      const s5n = screen5(), s6n = screen6();
      if (s5n && s6n) { s5n.setAttribute('aria-hidden','true'); s6n.setAttribute('aria-hidden','false'); }
      fade && requestAnimationFrame(() => fade.classList.add('step-6'));
    });
  }

  // ===== Screen 6: replicate of Screen 5 =====
  const s6 = document.querySelector('.screen-6');
  if (s6 && !document.getElementById('experience-form-6')) {
    const hr = document.createElement('hr');
    hr.className = 'light-blue-divider';

    const form = document.createElement('form');
    form.id = 'experience-form-6';
    form.className = 'blank-form';
    form.noValidate = true;

    const fields = document.createElement('div');
    fields.className = 'fields';

    const field = document.createElement('div');
    field.className = 'field';

    const label = document.createElement('label');
    const unescapeUnicode = (str) => str.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    label.textContent = unescapeUnicode('M\\u00fasica favorita');

    const group = document.createElement('div');
    group.className = 'checkbox-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', unescapeUnicode('M\\u00fasica favorita'));

    // helper defined above
    const options6 = [ 'Pop', 'Rock', 'Jazz', 'Cl\u00e1sica' ];
    options6.forEach((v) => {
      const lab = document.createElement('label');
      lab.className = 'check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.name = 'cultural[]';
      inp.value = unescapeUnicode(v);
      const span = document.createElement('span');
      span.textContent = unescapeUnicode(v);
      lab.appendChild(inp);
      lab.appendChild(span);
      group.appendChild(lab);
    });

    const extraOptions6 = [
      'Blues', 'Hip Hop', 'R&B', 'Reggae',
      'Electr\u00f3nica', 'House', 'Techno', 'Trance',
      'Country', 'Folk', 'Indie', 'Metal',
      'Salsa', 'Bachata', 'Cumbia', 'Merengue', 'Bolero',
      'Flamenco', 'Tango', 'K-pop', 'Reggaet\u00f3n'
    ];
    extraOptions6.forEach((v) => {
      const lab = document.createElement('label');
      lab.className = 'check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.name = 'cultural[]';
      inp.value = unescapeUnicode(v);
      const span = document.createElement('span');
      span.textContent = unescapeUnicode(v);
      lab.appendChild(inp);
      lab.appendChild(span);
      group.appendChild(lab);
    });

    field.appendChild(label);
    field.appendChild(group);
    fields.appendChild(field);
    form.appendChild(fields);
    s6.appendChild(hr);
    s6.appendChild(form);

    const next6 = document.createElement('button');
    next6.id = 'nextBtn6';
    next6.className = 'next-btn';
    next6.type = 'button';
    next6.setAttribute('aria-label', 'Continuar');
    next6.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n    </svg>';
    s6.appendChild(next6);

    // Wire: Screen 6 -> Screen 7
    next6.addEventListener('click', (e) => {
      e.preventDefault();
      const s6n = screen6(), s7n = screen7();
      if (s6n && s7n) { s6n.setAttribute('aria-hidden','true'); s7n.setAttribute('aria-hidden','false'); }
      fade && requestAnimationFrame(() => fade.classList.add('step-7'));
    });
  }

  // ===== Screen 7: replicate of Screen 6 =====
  const s7c = document.querySelector('.screen-7');
  if (s7c && !document.getElementById('experience-form-7')) {
    const hr = document.createElement('hr');
    hr.className = 'light-blue-divider';

    const form = document.createElement('form');
    form.id = 'experience-form-7';
    form.className = 'blank-form';
    form.noValidate = true;

    const fields = document.createElement('div');
    fields.className = 'fields';

    const field = document.createElement('div');
    field.className = 'field';

    const label = document.createElement('label');
    const unescapeUnicode7 = (str) => str.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
    label.textContent = 'Estilo de viaje';

    const group = document.createElement('div');
    group.className = 'checkbox-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', 'Estilo de viaje');
    group.setAttribute('aria-multiselectable', 'true');

    const options7 = [
      'Relajado',
      'Aventura',
      'Lujo',
      'Cultural',
      'Gastron\u00f3mico',
      'Negocios',
      'Familiar',
      'Road trip',
      'Escapada urbana',
      'Playa',
      'Monta\u00f1a',
      'Bienestar/SPA',
      'Safari',
      'Crucero',
      'Mochilero',
      'Rom\u00e1ntico',
      'Fotogr\u00e1fico',
      'Deportes de invierno',
      'Naturaleza',
      'Aventura extrema'
    ];
    options7.forEach((v) => {
      const lab = document.createElement('label');
      lab.className = 'check';
      const inp = document.createElement('input');
      inp.type = 'checkbox';
      inp.name = 'travelStyle[]';
      inp.value = unescapeUnicode7(v);
      const span = document.createElement('span');
      span.textContent = unescapeUnicode7(v);
      lab.appendChild(inp);
      lab.appendChild(span);
      group.appendChild(lab);
    });

    field.appendChild(label);
    field.appendChild(group);
    fields.appendChild(field);
    form.appendChild(fields);
    s7c.appendChild(hr);
    s7c.appendChild(form);

    const next7 = document.createElement('button');
    next7.id = 'nextBtn7';
    next7.className = 'next-btn';
    next7.type = 'button';
    next7.setAttribute('aria-label', 'Continuar');
    next7.innerHTML = '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">\n      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>\n    </svg>';
    s7c.appendChild(next7);
  }
});
