/**
 * ClimaCore – Interactive features
 * Airco Check · Price configurator · FAQ · Forms
 */

document.addEventListener('DOMContentLoaded', () => {
  initWizard();
  initFAQ();
  initPriceCalc();
  initMobileNav();
});

function initWizard() {
  const steps = document.querySelectorAll('.wizard-step');
  const progressBar = document.querySelector('.wizard-progress-bar');
  const stepLabel = document.querySelector('.wizard-step-label');
  const totalSteps = steps.length - 1;
  let current = 0;
  const answers = {};

  function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle('active', i === index));
    const pct = (index / totalSteps) * 100;
    if (progressBar) progressBar.style.width = Math.min(pct, 100) + '%';
    if (stepLabel && index < totalSteps) {
      stepLabel.textContent = 'Stap ' + (index + 1) + ' van ' + totalSteps;
    }
    current = index;
  }

  document.querySelectorAll('.wizard-option').forEach(function(opt) {
    opt.addEventListener('click', function() {
      const step = opt.closest('.wizard-step');
      const name = step.dataset.name;
      step.querySelectorAll('.wizard-option').forEach(function(o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      answers[name] = opt.dataset.value;

      setTimeout(function() {
        if (current < totalSteps - 1) showStep(current + 1);
        else showResult();
      }, 220);
    });
  });

  document.querySelectorAll('[data-wizard-next]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (current < totalSteps - 1) showStep(current + 1);
      else showResult();
    });
  });
  document.querySelectorAll('[data-wizard-prev]').forEach(function(btn) {
    btn.addEventListener('click', function() {
      if (current > 0) showStep(current - 1);
    });
  });

  function showResult() {
    showStep(totalSteps);
    if (stepLabel) stepLabel.textContent = 'Jouw resultaat';
    const resultEl = document.getElementById('wizard-result-content');
    if (!resultEl) return;

    const rooms = answers.rooms || '1';
    const size = answers.size || '20-35';
    const heat = answers.heat || 'nee';
    const priority = answers.priority || 'prijs';

    let system = 'Single-split';
    let units = '1 binnenunit + 1 buitenunit';
    let reason = 'Voor één ruimte is een single-split systeem meestal de meest efficiënte en prijsbewuste keuze.';
    let tags = [];

    if (rooms === '2' || rooms === '3' || rooms === 'meerdere') {
      system = 'Multi-split';
      units = rooms === '2' ? '2 binnenunits + 1 buitenunit' :
              rooms === '3' ? '3 binnenunits + 1 buitenunit' :
              'Meerdere binnenunits + 1 of meer buitenunits';
      reason = 'Omdat je meerdere ruimtes onafhankelijk wilt kunnen regelen, is een multi-split oplossing vaak interessanter dan aparte single-split systemen.';
    }

    if (heat === 'ja' || heat === 'weet-niet') tags.push('Koelen + verwarmen');
    else tags.push('Primair koelen');

    if (priority === 'stilte') tags.push('Focus op stille units');
    if (priority === 'design') tags.push('Esthetische afwerking');
    if (priority === 'energie') tags.push('Maximale energie-efficiëntie');
    if (priority === 'beide') tags.push('Koelen én verwarmen');

    let tagsHtml = tags.map(function(t) { return '<li>' + t + '</li>'; }).join('');

    resultEl.innerHTML =
      '<div class="result-header">' +
        '<p class="result-label">Jouw situatie</p>' +
        '<h3>Waarschijnlijk interessant: ' + system + ' airco</h3>' +
      '</div>' +
      '<div class="result-config"><ul>' +
        '<li>' + units + '</li>' +
        '<li>Aangepast aan ca. ' + size + ' m²</li>' +
        tagsHtml +
        '<li>Energiezuinige werking mogelijk (A+++ klasse)</li>' +
      '</ul></div>' +
      '<p class="result-why"><strong>Waarom?</strong> ' + reason + '</p>' +
      '<p class="disclaimer">Dit is een indicatie op basis van jouw antwoorden. De definitieve keuze en prijs hangen af van een technische beoordeling ter plaatse (leidinglengte, bereikbaarheid, isolatie, elektrische voorzieningen, enz.).</p>' +
      '<div class="result-ctas">' +
        '<a href="#foto" class="btn btn-primary btn-lg">Stuur foto’s van mijn woning →</a>' +
        '<a href="#contact" class="btn btn-secondary btn-lg">Vraag persoonlijk advies →</a>' +
      '</div>';
  }

  showStep(0);
}

function initPriceCalc() {
  const form = document.getElementById('price-config-form');
  if (!form) return;

  const resultBox = document.getElementById('price-result');
  const rangeEl = document.getElementById('price-range');

  const base = {
    '1': { min: 1800, max: 2800 },
    '2': { min: 3200, max: 4800 },
    '3': { min: 4500, max: 6800 },
    '4+': { min: 6000, max: 9500 }
  };

  function calculate() {
    const rooms = form.querySelector('[name="rooms"]').value;
    const heat = form.querySelector('[name="heat"]').value;
    const complexity = form.querySelector('[name="complexity"]').value;

    let min = (base[rooms] || base['1']).min;
    let max = (base[rooms] || base['1']).max;

    if (heat === 'yes') { min = Math.round(min * 1.05); max = Math.round(max * 1.08); }
    if (complexity === 'complex') { min = Math.round(min * 1.15); max = Math.round(max * 1.25); }
    if (complexity === 'simple') { min = Math.round(min * 0.95); max = Math.round(max * 0.98); }

    rangeEl.textContent = '€ ' + min.toLocaleString('nl-BE') + ' – € ' + max.toLocaleString('nl-BE');
    resultBox.classList.remove('hidden');
  }

  form.addEventListener('change', calculate);
  var calcBtn = form.querySelector('[data-calc]');
  if (calcBtn) {
    calcBtn.addEventListener('click', function(e) {
      e.preventDefault();
      calculate();
    });
  }
}

function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(function(btn) {
    btn.addEventListener('click', function() {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function initMobileNav() {
  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function() {
    nav.classList.toggle('open');
  });
}
