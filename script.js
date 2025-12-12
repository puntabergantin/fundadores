document.addEventListener('DOMContentLoaded', () => {
  // ===== Runtime stylesheet hot-reload to avoid hard-refresh for users =====
  // This replaces the existing styles.css link with a cloned one that
  // contains a timestamp query param so the browser fetches the latest CSS
  // and applies it immediately without a full page reload.
  try {
    const styleLink = document.querySelector('link[rel="stylesheet"][href*="styles.css"]');
    if (styleLink) {
      const hrefBase = styleLink.getAttribute('href').split('?')[0];
      const newLink = styleLink.cloneNode();
      newLink.setAttribute('href', hrefBase + (hrefBase.includes('?') ? '&' : '?') + 't=' + Date.now());
      newLink.addEventListener('load', () => {
        // remove the old link after new CSS has loaded to avoid FOUC
        try { styleLink.parentNode && styleLink.parentNode.removeChild(styleLink); } catch (e) {}
      });
      styleLink.parentNode.insertBefore(newLink, styleLink.nextSibling);
    }
  } catch (e) {
    // don't break the app if anything goes wrong here
    console.warn('Stylesheet hot-reload failed', e);
  }

  // ===== Video loop seamless (evita el brinco al reiniciar) =====
  const heroVideo = document.querySelector('.hero-video');
  if (heroVideo) {
    heroVideo.addEventListener('timeupdate', () => {
      // Reinicia 100ms antes del final para transición imperceptible
      if (heroVideo.duration - heroVideo.currentTime < 0.1) {
        heroVideo.currentTime = 0;
      }
    });
  }

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
  // Nuevo flujo: home minimalista
  const homeCenter = document.getElementById('homeCenter');
  const loaderOverlay = document.getElementById('loaderOverlay');
  const startBtn = document.getElementById('startBtn');
  const cta = document.querySelector('[data-next]');
  const fade = document.getElementById('fadeScreen');
  const backBtn = document.getElementById('backBtn');
  const closeBtn = document.getElementById('closeBtn');

  const screen1 = () => document.querySelector('.screen-1');
  const screen2 = () => document.querySelector('.screen-2');
  const screen3 = () => document.querySelector('.screen-3');
  const screen4 = () => document.querySelector('.screen-4');
  const screen5 = () => document.querySelector('.screen-5');
  const screen6 = () => document.querySelector('.screen-6');
  const screen7 = () => document.querySelector('.screen-7');
  const screen8 = () => document.querySelector('.screen-8');
  const screen9 = () => document.querySelector('.screen-9');
  const screen10 = () => document.querySelector('.screen-10');

  // Guardar/restaurar progreso en localStorage
  const clearProgress = () => {
    localStorage.removeItem('founders_progress');
  };

  const saveProgress = () => {
    // Ya no persistimos el paso actual; solo mantenemos los datos en el DOM.
    clearProgress();
  };

  const resetScreensToStep1 = () => {
    const s1 = screen1(), s2 = screen2(), s3 = screen3(), s4 = screen4(), s5 = screen5(), s6 = screen6(), s7 = screen7(), s8 = screen8(), s9 = screen9(), s10 = screen10();
    if (s1) s1.setAttribute('aria-hidden', 'false');
    if (s2) s2.setAttribute('aria-hidden', 'true');
    if (s3) s3.setAttribute('aria-hidden', 'true');
    if (s4) s4.setAttribute('aria-hidden', 'true');
    if (s5) s5.setAttribute('aria-hidden', 'true');
    if (s6) s6.setAttribute('aria-hidden', 'true');
    if (s7) s7.setAttribute('aria-hidden', 'true');
    if (s8) s8.setAttribute('aria-hidden', 'true');
    if (s9) s9.setAttribute('aria-hidden', 'true');
    if (s10) s10.setAttribute('aria-hidden', 'true');
  };

  const openOverlay = () => {
    // Limpiar cualquier estado residual
    fade.classList.remove('closing');
    // Siempre arrancar en la pantalla 1, pero sin borrar los datos ya capturados
    clearProgress();
    resetScreensToStep1();
    
    fade.classList.add('active');
    document.documentElement.style.backgroundColor = '#fff';
    document.documentElement.classList.add('blank-mode');
    
    // Usar setTimeout en vez de transitionend para más consistencia
    setTimeout(() => {
      fade.classList.add('done');
      document.documentElement.classList.add('names-in');
      fade.setAttribute('aria-hidden', 'false');
    }, 10);
  };

  const closeOverlay = () => {
    // Siempre limpiar el paso guardado para que el pr¢ximo arranque sea en screen 1
    clearProgress();
    
    // Cierre inmediato sin animaciones
    fade.classList.remove('active', 'done');
    fade.setAttribute('aria-hidden', 'true');
    document.documentElement.classList.remove('blank-mode', 'names-in');
    document.documentElement.style.backgroundColor = '';
    
    // Limpiar todos los step-X classes
    fade.className = 'fade-screen';

    // Restaurar el home completo (video + logo + botón)
    if (homeCenter) {
      homeCenter.style.display = '';
      homeCenter.classList.remove('fadeout');
    }
    if (loaderOverlay) {
      loaderOverlay.style.display = 'none';
    }
  };


  // Nuevo flujo: botón continuar
  if (startBtn && homeCenter && loaderOverlay) {
    const loaderIntro = document.getElementById('loaderIntro');
    startBtn.addEventListener('click', function () {
      // Fade out home
      homeCenter.classList.add('fadeout');
      setTimeout(() => {
        homeCenter.style.display = 'none';
        loaderOverlay.style.display = 'flex';
        // Fade in loader intro
        if (loaderIntro) {
          loaderIntro.classList.add('fadein');
        }
        // Después de 2.2s, oculta loader y muestra overlay
        setTimeout(() => {
          loaderOverlay.style.display = 'none';
          if (loaderIntro) loaderIntro.classList.remove('fadein');
          openOverlay();
        }, 2200);
      }, 700); // match fadeout duration
    });
  }

  // Por compatibilidad, si existe el antiguo botón cta, lo ocultamos
  if (cta) cta.style.display = 'none';

  // Botón X: cierra y guarda progreso
  closeBtn && fade && closeBtn.addEventListener('click', () => {
    closeOverlay();
  });

  backBtn && fade && backBtn.addEventListener('click', () => {
      if (fade.classList.contains('step-10')) {
        fade.classList.remove('step-10');
        const s9 = screen9(), s10 = screen10();
        if (s9 && s10) { s9.setAttribute('aria-hidden','false'); s10.setAttribute('aria-hidden','true'); }
        return;
      }
      if (fade.classList.contains('step-9')) {
        fade.classList.remove('step-9');
        const s8 = screen8(), s9 = screen9();
        if (s8 && s9) { s8.setAttribute('aria-hidden','false'); s9.setAttribute('aria-hidden','true'); }
        return;
      }
      if (fade.classList.contains('step-8')) {
        fade.classList.remove('step-8');
        const s7 = screen7(), s8 = screen8();
      if (s7 && s8) { s7.setAttribute('aria-hidden','false'); s8.setAttribute('aria-hidden','true'); }
      return;
    }
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
      saveProgress();
      return;
    }
    if (fade.classList.contains('step-3')) {
      fade.classList.remove('step-3');
      const s2 = screen2(), s3 = screen3();
      if (s2 && s3) { s2.setAttribute('aria-hidden','false'); s3.setAttribute('aria-hidden','true'); }
      saveProgress();
      return;
    }
    if (fade.classList.contains('step-2')) {
      fade.classList.remove('step-2');
      const s1 = screen1(), s2 = screen2();
      if (s1 && s2) { s1.setAttribute('aria-hidden','false'); s2.setAttribute('aria-hidden','true'); }
      saveProgress();
      return;
    }
    // Si estamos en step-1, cerrar todo y limpiar progreso, mostrar home
    clearProgress();
    fade.classList.remove('active');
    fade.setAttribute('aria-hidden', 'true');
    fade.classList.remove('done', 'step-2', 'step-3', 'step-4', 'step-5', 'step-6', 'step-7', 'step-8', 'step-9', 'step-10');
    resetScreensToStep1();
    document.documentElement.classList.remove('blank-mode', 'names-in');
    document.documentElement.style.backgroundColor = '';
    if (typeof homeCenter !== 'undefined' && homeCenter) {
      homeCenter.style.display = 'flex';
      homeCenter.classList.remove('fadeout');
      // Mostrar también el logo de Bergantín si está oculto
      var bergantinLogo = document.querySelector('.brand-mark-home');
      if (bergantinLogo) bergantinLogo.style.display = '';
    }
    if (typeof loaderOverlay !== 'undefined' && loaderOverlay) loaderOverlay.style.display = 'none';
    // Asegura que el texto de loader no quede visible
    const loaderIntro = document.getElementById('loaderIntro');
    if (loaderIntro) loaderIntro.classList.remove('fadein');
  });

  // Normalize ticker separators only
  document.querySelectorAll('.ticker .sep').forEach(el => el.textContent = '\u2022');
  
  // Next buttons
  const nextBtn1 = document.getElementById('nextBtn');
  nextBtn1 && nextBtn1.addEventListener('click', (e) => {
    e.preventDefault();
    const form = document.getElementById('founders-form');
    if (form && !form.checkValidity()) {
      form.reportValidity();
      return;
    }
    const s1 = screen1(), s2 = screen2();
    if (s1 && s2) { s1.setAttribute('aria-hidden','true'); s2.setAttribute('aria-hidden','false'); }
    fade && requestAnimationFrame(() => fade.classList.add('step-2'));
    saveProgress();
  });

  const nextBtn2 = document.getElementById('nextBtn2');
  nextBtn2 && nextBtn2.addEventListener('click', (e) => {
    e.preventDefault();
    const s2 = screen2(), s3 = screen3();
    if (s2 && s3) { s2.setAttribute('aria-hidden','true'); s3.setAttribute('aria-hidden','false'); }
    fade && requestAnimationFrame(() => fade.classList.add('step-3'));
    saveProgress();
  });

  // Next from screen 3 to screen 4
  const wireNext3 = () => {
    const next3 = document.getElementById('nextBtn3');
    next3 && next3.addEventListener('click', (e) => {
      e.preventDefault();
      const s3 = screen3(), s4 = screen4();
      if (s3 && s4) { s3.setAttribute('aria-hidden','true'); s4.setAttribute('aria-hidden','false'); }
      fade && requestAnimationFrame(() => fade.classList.add('step-4'));
      saveProgress();
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
    trigger.textContent = (select.selectedOptions[0] && select.selectedOptions[0].textContent) || (select.options[0] && select.options[0].textContent) || 'Seleccione…';

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
        const fadeScreenEl = document.getElementById('fadeScreen');
        if (fadeScreenEl) fadeScreenEl.classList.add('select-open');
      
      // Sync activeIndex with current selection before rendering
      activeIndex = Math.max(0, options.findIndex(o => o.selected));
      renderOptions();
      list.focus({ preventScroll: true });
    };
      const close = () => {
        wrap.classList.remove('is-open');
        trigger.setAttribute('aria-expanded', 'false');
        const fadeScreenEl = document.getElementById('fadeScreen');
        if (fadeScreenEl) fadeScreenEl.classList.remove('select-open');
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

    // Close on outside click (incluyendo click en backdrop)
    document.addEventListener('click', (e) => {
      if (!wrap.contains(e.target) || e.target === wrap) {
        if (wrap.classList.contains('is-open')) {
          close();
        }
      }
    });
    
    // Cerrar al hacer clic en el backdrop
    wrap.addEventListener('click', (e) => {
      if (e.target === wrap && wrap.classList.contains('is-open')) {
        close();
      }
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

    // Orden personalizado: Golf, Natación, Baloncesto, Tenis, Pádel, Running, Ciclismo y luego el resto
    const options = [
      'Golf',
      'Natacion',
      'Baloncesto',
      'Tenis',
      'Padel',
      'Running',
      'Ciclismo',
      'Futbol',
      'Futbol americano',
      'Beisbol',
      'Rugby',
      'Voleibol',
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
    
    field.appendChild(group);
    fields.appendChild(field);
    form.appendChild(fields);
    s3.appendChild(hr);
    s3.appendChild(form);

    // Update Screen 3 header copy
    const head = s3.querySelector('.blank-message');
    if (head) {
      head.innerHTML = '"Selecciona las experiencias deportivas <strong>que m\\u00e1s disfrutas."</strong>';
    }
    // Fix special characters and add "deportivas" in case innerHTML kept escape sequence
    if (head) {
      head.innerHTML = head.innerHTML
        .replace('\\u00e1', 'á')
        .replace('experiencias <strong>', 'experiencias deportivas <strong>');
    }
    // Normalize any literal unicode escape sequences to actual characters
    if (head) { head.innerHTML = head.innerHTML.replace(/\\u00e1/g, '\u00e1'); }

    // Add a "Next" arrow button to Screen 3 (same style as Screen 2)
    const next3 = document.createElement('button');
    next3.id = 'nextBtn3';
    next3.className = 'next-btn';
    next3.type = 'button';
    next3.setAttribute('aria-label', 'Continuar');
    // Ensure only Screen 3 heading uses bold on "experiencias deportivas"
    (function(){
      const el = s3.querySelector('.blank-message');
      if (el) el.innerHTML = '"Selecciona las <strong>experiencias deportivas</strong> que más disfrutas."';
    })();
    next3.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    s3.appendChild(next3);
    // Finalize heading copy for Screen 3 with correct accents
    const headFix = s3.querySelector('.blank-message');
    if (headFix) headFix.innerHTML = '"Selecciona las <strong>experiencias deportivas</strong> que más disfrutas."';
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

    const group = document.createElement('div');
    group.className = 'checkbox-group';
    group.setAttribute('role', 'group');
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
      'Moda', 'Arqueologia',
      'Catas Cigarros', 'Wellness', 'Charlas', 'Cl\u00ednicas deportivas', 'Religiosas'
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
    next4.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
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
    next5.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
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

    const unescapeUnicode = (str) => str.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

    const group = document.createElement('div');
    group.className = 'checkbox-group';
    group.setAttribute('role', 'group');
    group.setAttribute('aria-label', unescapeUnicode('M\\u00fasica favorita'));

    // Orden personalizado de géneros musicales:
    // Merengue, Bolero, Salsa, Bachata, Pop, Rock, Country, y luego los demás.
    const musicGenres = [
      'Merengue',
      'Bolero',
      'Salsa',
      'Bachata',
      'Pop',
      'Rock',
      'Country',
      'Jazz',
      'Cl\u00e1sica',
      'Blues',
      'Hip Hop',
      'R&B',
      'Reggae',
      'Electr\u00f3nica',
      'House',
      'Techno',
      'Trance',
      'Folk',
      'Indie',
      'Metal',
      'Cumbia',
      'Flamenco',
      'Tango',
      'K-pop',
      'Reggaet\u00f3n'
    ];
    musicGenres.forEach((v) => {
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
    next6.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    s6.appendChild(next6);

    // Wire: Screen 6 -> Screen 7
    next6.addEventListener('click', (e) => {
      e.preventDefault();
      const s6n = screen6(), s7n = screen7();
      if (s6n && s7n) { s6n.setAttribute('aria-hidden','true'); s7n.setAttribute('aria-hidden','false'); }
      fade && requestAnimationFrame(() => fade.classList.add('step-7'));
    });
  }

  // Helper: sincronizar "Cumpleaños de hijos" en Screen 8 a partir del repeatable de hijos
  function syncChildrenBirthdaysField() {
    const s8 = screen8();
    if (!s8) return;

    // Buscar primero por data-role; si no existe (versión anterior), localizar por label
    let field = s8.querySelector('[data-role="children-birthdays-field"]');
    if (!field) {
      field = Array.from(s8.querySelectorAll('.field')).find((f) => {
        const lbl = f.querySelector('label');
        if (!lbl) return false;
        const txt = lbl.textContent.toLowerCase();
        return txt.includes('cumple') && txt.includes('hijo');
      });
    }
    if (!field) return;

    // Mantener solo la etiqueta; limpiar resto
    const label = field.querySelector('label');
    field.innerHTML = '';
    if (label) field.appendChild(label);

    const childrenField = document.querySelector('.field.repeatable[data-name="children"]');
    const childrenInputs = childrenField
      ? Array.from(childrenField.querySelectorAll('.items input'))
      : [];
    const namedChildren = childrenInputs
      .map(inp => ((inp.value || inp.placeholder || '').trim()))
      .filter(Boolean);

    if (namedChildren.length) {
      const list = document.createElement('div');
      list.className = 'children-birthdays-list';

      namedChildren.forEach((name, idx) => {
        const row = document.createElement('div');
        row.className = 'children-birthday-row';

        const nameSpan = document.createElement('span');
        nameSpan.className = 'child-name';
        nameSpan.textContent = name;

        const dateInput = document.createElement('input');
        dateInput.type = 'date';
        dateInput.name = 'childrenBirthdays[]';
        dateInput.id = `childBirthday${idx + 1}`;

        row.appendChild(nameSpan);
        row.appendChild(dateInput);
        list.appendChild(row);
      });

      field.appendChild(list);
    } else {
      const naBox = document.createElement('button');
      naBox.type = 'button';
      naBox.className = 'na-box';
      naBox.textContent = 'N/A';
      naBox.disabled = true;
      field.appendChild(naBox);
    }
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

    const unescapeUnicode7 = (str) => str.replace(/\\u([0-9a-fA-F]{4})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));

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
    next7.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    s7c.appendChild(next7);

      // Wire: Screen 7 -> Screen 8
      next7.addEventListener('click', (e) => {
        e.preventDefault();
        const s7 = screen7();
        let s8 = screen8();
      if (!s8 && fade) {
        // Crear contenedor de screen-8 si no existe (fallback)
          s8 = document.createElement('div');
          s8.className = 'screen screen-8';
          s8.setAttribute('aria-label', 'Pantalla 8');
          s8.setAttribute('aria-hidden', 'true');
          fade.appendChild(s8);
        }
        // Sincronizar las filas de cumpleaños de hijos antes de mostrar Screen 8
        syncChildrenBirthdaysField();
        if (s7 && s8) { s7.setAttribute('aria-hidden','true'); s8.setAttribute('aria-hidden','false'); }
        fade && requestAnimationFrame(() => fade.classList.add('step-8'));
      });
  }

  // ===== Screen 8: Fechas e hitos especiales (form) =====
  let s8c = screen8();
  if (!s8c && fade) {
    s8c = document.createElement('div');
    s8c.className = 'screen screen-8';
    s8c.setAttribute('aria-label', 'Pantalla 8');
    s8c.setAttribute('aria-hidden', 'true');
    fade.appendChild(s8c);
  }
  if (s8c && !document.getElementById('milestones-form-8')) {
    const hr = document.createElement('hr');
    hr.className = 'light-blue-divider';

    const form = document.createElement('form');
    form.id = 'milestones-form-8';
    form.className = 'blank-form';
    form.noValidate = true;

    const fields = document.createElement('div');
    fields.className = 'fields';

    // Cumpleaños (Fecha)
    {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.setAttribute('for', 'birthday');
      label.textContent = 'Cumpleaños';

      const input = document.createElement('input');
      input.id = 'birthday';
      input.name = 'birthday';
      input.type = 'date';
      input.placeholder = '15/06/1985';

      field.appendChild(label);
      field.appendChild(input);
      fields.appendChild(field);
    }

    // Aniversario (Fecha)
    {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.setAttribute('for', 'anniversary');
      label.textContent = 'Aniversario de Bodas (Si aplica)';

      const input = document.createElement('input');
      input.id = 'anniversary';
      input.name = 'anniversary';
      input.type = 'date';
      input.placeholder = '10/12/2012';

      field.appendChild(label);
      field.appendChild(input);
      fields.appendChild(field);
    }

    // Cumpleaños de hijos (una fila por hijo, tomada del screen de hijos)
    {
      const childrenField = document.querySelector('.field.repeatable[data-name="children"]');
      const childrenInputs = childrenField
        ? Array.from(childrenField.querySelectorAll('.items input'))
        : [];
      const namedChildren = childrenInputs
        .map(inp => ((inp.value || inp.placeholder || '').trim()))
        .filter(Boolean);

      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.textContent = 'Cumpleaños de hijos';
      field.appendChild(label);

      if (namedChildren.length) {
        const list = document.createElement('div');
        list.className = 'children-birthdays-list';

        namedChildren.forEach((name, idx) => {
          const row = document.createElement('div');
          row.className = 'children-birthday-row';

          const nameSpan = document.createElement('span');
          nameSpan.className = 'child-name';
          nameSpan.textContent = name;

          const dateInput = document.createElement('input');
          dateInput.type = 'date';
          dateInput.name = 'childrenBirthdays[]';
          dateInput.id = `childBirthday${idx + 1}`;

          row.appendChild(nameSpan);
          row.appendChild(dateInput);
          list.appendChild(row);
        });

        field.appendChild(list);
      } else {
        // Si no hay hijos, mostrar una caja tipo "Agregar hijo" pero N/A
        const naBox = document.createElement('button');
        naBox.type = 'button';
        naBox.className = 'na-box';
        naBox.textContent = 'N/A';
        naBox.disabled = true;
        field.appendChild(naBox);
      }

      fields.appendChild(field);
    }

    // Otros hitos (Texto libre)
    {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.setAttribute('for', 'otherMilestones');
      label.textContent = 'Otros';

      const textarea = document.createElement('textarea');
      textarea.id = 'otherMilestones';
      textarea.name = 'otherMilestones';
      textarea.rows = 3;
      textarea.placeholder = 'Día de matrimonio, logros, aniversarios especiales...';

      field.appendChild(label);
      field.appendChild(textarea);
      fields.appendChild(field);
    }

    form.appendChild(fields);
    s8c.appendChild(hr);
    s8c.appendChild(form);

    const next8 = document.createElement('button');
    next8.id = 'nextBtn8';
    next8.className = 'next-btn';
    next8.type = 'button';
    next8.setAttribute('aria-label', 'Continuar');
    next8.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    s8c.appendChild(next8);

    // Avanzar del screen 8 al 9
    next8.addEventListener('click', (e) => {
      e.preventDefault();
      const s8 = screen8();
      const s9 = screen9();
      if (s8 && s9) {
        s8.setAttribute('aria-hidden', 'true');
        s9.setAttribute('aria-hidden', 'false');
      }
      fade && requestAnimationFrame(() => fade.classList.add('step-9'));
      saveProgress();
    });
  }

  // ===== Screen 9: datos de la propiedad (villa/unidad) =====
  const s9c = screen9();
  if (s9c && !document.getElementById('milestones-form-9')) {
    const hr9 = document.createElement('hr');
    hr9.className = 'light-blue-divider';

    const form9 = document.createElement('form');
    form9.id = 'milestones-form-9';
    form9.className = 'blank-form';
    form9.noValidate = true;

    const fields9 = document.createElement('div');
    fields9.className = 'fields';

    // Nombre de villa / unidad (Texto)
    {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.setAttribute('for', 'villaName');
      label.textContent = 'Nombre de villa / unidad (Si aplica)';

      const input = document.createElement('input');
      input.id = 'villaName';
      input.name = 'villaName';
      input.type = 'text';
      input.placeholder = 'Villa #7 - Sapphire Island';

      field.appendChild(label);
      field.appendChild(input);
      fields9.appendChild(field);
    }

    // Fecha de firma de contrato (Fecha)
    {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.setAttribute('for', 'acquisitionDate');
      label.textContent = 'Fecha de firma de contrato';

      const input = document.createElement('input');
      input.id = 'acquisitionDate';
      input.name = 'acquisitionDate';
      input.type = 'date';
      input.placeholder = '12/02/2023';

      field.appendChild(label);
      field.appendChild(input);
      fields9.appendChild(field);
    }

    // Uso actual (Selector)
    {
      const field = document.createElement('div');
      field.className = 'field';
      field.style.display = 'none';

      const label = document.createElement('label');
      label.setAttribute('for', 'currentUse');
      label.textContent = 'Uso actual';
      field.appendChild(label);

      const selectWrap = document.createElement('div');
      selectWrap.className = 'select-wrap';

      const select = document.createElement('select');
      select.id = 'currentUse';
      select.name = 'currentUse';

      const optPlaceholder = document.createElement('option');
      optPlaceholder.value = '';
      optPlaceholder.disabled = true;
      optPlaceholder.selected = true;
      optPlaceholder.textContent = 'Seleccione.';
      select.appendChild(optPlaceholder);

      ['Propia', 'Renta', 'En desarrollo'].forEach(text => {
        const opt = document.createElement('option');
        opt.value = text;
        opt.textContent = text;
        select.appendChild(opt);
      });

      selectWrap.appendChild(select);

      // Chevron visual como en otros selects
      const chev = document.createElement('span');
      chev.className = 'select-chevron';
      chev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      selectWrap.appendChild(chev);
      field.appendChild(selectWrap);

      // Aplicar el mismo enhancer de selects que en el resto del formulario
      enhanceSelect(selectWrap);

      fields9.appendChild(field);
    }

    // Observaciones (Texto libre)
    {
      const field = document.createElement('div');
      field.className = 'field';
      field.style.display = 'none';

      const label = document.createElement('label');
      label.setAttribute('for', 'propertyNotes');
      label.textContent = 'Observaciones';

      const textarea = document.createElement('textarea');
      textarea.id = 'propertyNotes';
      textarea.name = 'propertyNotes';
      textarea.rows = 3;
      textarea.placeholder = 'Uso familiar mensual, comentarios...';

      field.appendChild(label);
      field.appendChild(textarea);
      fields9.appendChild(field);
    }

    form9.appendChild(fields9);
    s9c.appendChild(hr9);
    s9c.appendChild(form9);

    const next9 = document.createElement('button');
    next9.id = 'nextBtn9';
    next9.className = 'next-btn';
    next9.type = 'button';
    next9.setAttribute('aria-label', 'Continuar');
    next9.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
    s9c.appendChild(next9);

    // Avanzar del screen 9 al 10
    next9.addEventListener('click', (e) => {
      e.preventDefault();
      const s9 = screen9();
      const s10 = screen10();
      if (s9 && s10) {
        s9.setAttribute('aria-hidden', 'true');
        s10.setAttribute('aria-hidden', 'false');
      }
      fade && requestAnimationFrame(() => fade.classList.add('step-10'));
      saveProgress();
    });
  }

  // ===== Screen 10: contacto preferido =====
  const s10c = screen10();
  if (s10c && !document.getElementById('events-form-10')) {
    const hr10 = document.createElement('hr');
    hr10.className = 'light-blue-divider';

    const form10 = document.createElement('form');
    form10.id = 'events-form-10';
    form10.className = 'blank-form';
    form10.noValidate = true;

    const fields10 = document.createElement('div');
    fields10.className = 'fields';

    // Canal preferido (selector)
    {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.setAttribute('for', 'preferredChannel');
      label.textContent = 'Canal preferido';
      field.appendChild(label);

      const selectWrap = document.createElement('div');
      selectWrap.className = 'select-wrap';

      const select = document.createElement('select');
      select.id = 'preferredChannel';
      select.name = 'preferredChannel';

      const optPlaceholder = document.createElement('option');
      optPlaceholder.value = '';
      optPlaceholder.disabled = true;
      optPlaceholder.selected = true;
      optPlaceholder.textContent = 'Seleccione.';
      select.appendChild(optPlaceholder);

      ['WhatsApp', 'Email', 'Teléfono'].forEach((text) => {
        const opt = document.createElement('option');
        opt.value = text;
        opt.textContent = text;
        select.appendChild(opt);
      });

      selectWrap.appendChild(select);

      const chev = document.createElement('span');
      chev.className = 'select-chevron';
      chev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      selectWrap.appendChild(chev);

      enhanceSelect(selectWrap);

      field.appendChild(selectWrap);
      fields10.appendChild(field);
    }

    // Horario de contacto (selector)
    {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.setAttribute('for', 'contactSchedule');
      label.textContent = 'Horario de contacto';
      field.appendChild(label);

      const selectWrap = document.createElement('div');
      selectWrap.className = 'select-wrap';

      const select = document.createElement('select');
      select.id = 'contactSchedule';
      select.name = 'contactSchedule';

      const optPlaceholder = document.createElement('option');
      optPlaceholder.value = '';
      optPlaceholder.disabled = true;
      optPlaceholder.selected = true;
      optPlaceholder.textContent = 'Seleccione.';
      select.appendChild(optPlaceholder);

      ['Mañana', 'Tarde', 'Noche'].forEach((text) => {
        const opt = document.createElement('option');
        opt.value = text;
        opt.textContent = text;
        select.appendChild(opt);
      });

      selectWrap.appendChild(select);

      const chev = document.createElement('span');
      chev.className = 'select-chevron';
      chev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      selectWrap.appendChild(chev);

      enhanceSelect(selectWrap);

      field.appendChild(selectWrap);
      fields10.appendChild(field);
    }

    // Tono de comunicación (selector)
    {
      const field = document.createElement('div');
      field.className = 'field';
      field.style.display = 'none';

      const label = document.createElement('label');
      label.setAttribute('for', 'communicationTone');
      label.textContent = 'Tono de comunicación';
      field.appendChild(label);

      const selectWrap = document.createElement('div');
      selectWrap.className = 'select-wrap';

      const select = document.createElement('select');
      select.id = 'communicationTone';
      select.name = 'communicationTone';

      const optPlaceholder = document.createElement('option');
      optPlaceholder.value = '';
      optPlaceholder.disabled = true;
      optPlaceholder.selected = true;
      optPlaceholder.textContent = 'Seleccione.';
      select.appendChild(optPlaceholder);

      ['Formal', 'Cercano', 'Exclusivo'].forEach((text) => {
        const opt = document.createElement('option');
        opt.value = text;
        opt.textContent = text;
        select.appendChild(opt);
      });

      selectWrap.appendChild(select);

      const chev = document.createElement('span');
      chev.className = 'select-chevron';
      chev.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6 9l6 6 6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>';
      selectWrap.appendChild(chev);

      enhanceSelect(selectWrap);

      field.appendChild(selectWrap);
      fields10.appendChild(field);
    }

    // Comentarios adicionales (texto largo)
    {
      const field = document.createElement('div');
      field.className = 'field';

      const label = document.createElement('label');
      label.setAttribute('for', 'additionalComments');
      label.textContent = 'Comentarios adicionales';

      const textarea = document.createElement('textarea');
      textarea.id = 'additionalComments';
      textarea.name = 'additionalComments';
      textarea.rows = 3;
      textarea.placeholder = '“Aprecio los detalles discretos.”';

      field.appendChild(label);
      field.appendChild(textarea);
      fields10.appendChild(field);
    }

    form10.appendChild(fields10);
    s10c.appendChild(hr10);
    s10c.appendChild(form10);

    // Botón Finalizar y enviar
    const finishBtn = document.createElement('button');
    finishBtn.type = 'button';
    finishBtn.className = 'finish-btn';
    finishBtn.textContent = 'Finalizar y enviar';
    finishBtn.setAttribute('aria-label', 'Finalizar y enviar');
    s10c.appendChild(finishBtn);
    
    // Implementar funcionalidad de finalizar con envío a Sheets y pantalla de éxito
    finishBtn.addEventListener('click', async (e) => {
      e.preventDefault();
      
      // Recopilar todos los datos del formulario
      const formData = {
        // Pantalla 1
        fullName: document.getElementById('fullName')?.value,
        email: document.getElementById('email')?.value,
        phone: document.getElementById('phone')?.value,
        nationality: document.getElementById('nationality')?.value,
        residence: document.getElementById('residence')?.value,
        shirtSize: document.querySelector('input[name="shirtSize"]:checked')?.value,
        
        // Pantalla 2
        maritalStatus: document.getElementById('maritalStatus')?.value,
        partnerName: document.getElementById('partnerName')?.value,
        children: Array.from(document.querySelectorAll('[name="children[]"]')).map(inp => inp.value).filter(Boolean),
        pets: Array.from(document.querySelectorAll('[name="pets[]"]')).map(inp => inp.value).filter(Boolean),
        importantPeople: document.getElementById('importantPeople')?.value,
        
        // Pantalla 3 - Deportes
        sports: Array.from(document.querySelectorAll('[name="sports[]"]:checked')).map(inp => inp.value),
        
        // Pantalla 4 - Cultural
        cultural: Array.from(document.querySelectorAll('[name="cultural[]"]:checked')).map(inp => inp.value),
        
        // Pantalla 5 - Bebidas (nota: usa mismo name que cultural, necesita ajuste)
        // Pantalla 6 - Música (nota: usa mismo name que cultural, necesita ajuste)
        
        // Pantalla 7 - Viajes
        travelStyle: Array.from(document.querySelectorAll('[name="travelStyle[]"]:checked')).map(inp => inp.value),
        
        // Pantalla 8 - Fechas
        birthday: document.getElementById('birthday')?.value,
        anniversary: document.getElementById('anniversary')?.value,
        childrenBirthdays: Array.from(document.querySelectorAll('[name="childrenBirthdays[]"]')).map(inp => inp.value).filter(Boolean),
        otherMilestones: document.getElementById('otherMilestones')?.value,
        
        // Pantalla 9 - Propiedad
        villaName: document.getElementById('villaName')?.value,
        acquisitionDate: document.getElementById('acquisitionDate')?.value,
        currentUse: document.getElementById('currentUse')?.value,
        propertyNotes: document.getElementById('propertyNotes')?.value,
        
        // Pantalla 10 - Contacto
        preferredChannel: document.getElementById('preferredChannel')?.value,
        contactSchedule: document.getElementById('contactSchedule')?.value,
        additionalComments: document.getElementById('additionalComments')?.value
      };

      try {
        await sendToSheet(formData);
        showSuccessOverlay();
      } catch (err) {
        console.error('No se pudo enviar a la hoja:', err);
        alert('No pudimos enviar tus datos ahora. Intenta de nuevo o contacta soporte.');
      }
      
      // Limpiar progreso guardado y cerrar
      clearProgress();
      closeOverlay();
    });
  }
});




// ===== Envío a Google Sheets (configurar endpoint) =====
const SHEET_WEBHOOK_URL = 'https://script.google.com/macros/s/AKfycbxXXNTYYVgwBG54MHNWRpLvsiGTYYjofSPSHWFwt6ITWGNN6fpypeAK1EgqBPBLzLiJ/exec';

async function sendToSheet(payload) {
  if (!SHEET_WEBHOOK_URL) {
    console.warn('SHEET_WEBHOOK_URL no configurada. Datos no enviados.', payload);
    return;
  }

  // Intento normal (CORS habilitado en el WebApp). Si falla por preflight,
  // reintenta con un request simple sin CORS para que el envío no se bloquee.
  const simpleRequest = {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain;charset=utf-8' }, // simple request => sin preflight
    body: JSON.stringify(payload)
  };

  try {
    const res = await fetch(SHEET_WEBHOOK_URL, { ...simpleRequest, mode: 'cors' });
    if (res.ok) {
      return res.json().catch(() => ({}));
    }
    throw new Error('Sheets respondio ' + res.status);
  } catch (err) {
    console.warn('Fallo CORS, reintentando con no-cors:', err);
    await fetch(SHEET_WEBHOOK_URL, { ...simpleRequest, mode: 'no-cors' });
    // Respuesta opaca, no podemos leer estado, asumimos entregado.
    return {};
  }
}

function showSuccessOverlay() {
  const overlay = document.getElementById('successOverlay');
  if (!overlay) return;
  overlay.classList.add('is-visible');
  overlay.setAttribute('aria-hidden', 'false');
  setTimeout(() => {
    overlay.classList.remove('is-visible');
    overlay.setAttribute('aria-hidden', 'true');
  }, 2000);
}
