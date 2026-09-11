/**
 * ClimaCore – Full interactive suite
 * Airco Check · Price configurator · FAQ · Forms · Mobile nav
 */
document.addEventListener('DOMContentLoaded', function () {
  initWizard();
  initFAQ();
  initPriceCalc();
  initMobileNav();
  initPhotoForm();
  initContactForm();
});

function initWizard() {
  var steps = document.querySelectorAll('.wizard-step');
  var progressBar = document.querySelector('.wizard-progress-bar');
  var stepLabel = document.querySelector('.wizard-step-label');
  var totalSteps = steps.length - 1;
  var current = 0;
  var answers = {};

  function showStep(index) {
    steps.forEach(function (s, i) { s.classList.toggle('active', i === index); });
    if (progressBar) progressBar.style.width = Math.min((index / totalSteps) * 100, 100) + '%';
    if (stepLabel && index < totalSteps) stepLabel.textContent = 'Stap ' + (index + 1) + ' van ' + totalSteps;
    current = index;
  }

  document.querySelectorAll('.wizard-option').forEach(function (opt) {
    opt.addEventListener('click', function () {
      var step = opt.closest('.wizard-step');
      var name = step.dataset.name;
      step.querySelectorAll('.wizard-option').forEach(function (o) { o.classList.remove('selected'); });
      opt.classList.add('selected');
      answers[name] = opt.dataset.value;
      setTimeout(function () {
        if (current < totalSteps - 1) showStep(current + 1);
        else showResult();
      }, 200);
    });
  });

  document.querySelectorAll('[data-wizard-next]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (current < totalSteps - 1) showStep(current + 1);
      else showResult();
    });
  });
  document.querySelectorAll('[data-wizard-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (current > 0) showStep(current - 1);
    });
  });

  function showResult() {
    showStep(totalSteps);
    if (stepLabel) stepLabel.textContent = 'Jouw resultaat';
    var el = document.getElementById('wizard-result-content');
    if (!el) return;

    var rooms = answers.rooms || '1';
    var size = answers.size || '20-35';
    var heat = answers.heat || 'nee';
    var priority = answers.priority || 'prijs';

    var system = 'Single-split';
    var units = '1 binnenunit + 1 buitenunit';
    var reason = 'Voor één ruimte is een single-split systeem meestal de meest efficiënte en prijsbewuste keuze.';
    var tags = [];

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

    var tagsHtml = tags.map(function (t) { return '<li>' + t + '</li>'; }).join('');

    el.innerHTML =
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
      '<p class="disclaimer">Dit is een indicatie. De definitieve keuze en prijs hangen af van een technische beoordeling ter plaatse (leidinglengte, bereikbaarheid, isolatie, elektrische voorzieningen, enz.).</p>' +
      '<div class="result-ctas">' +
        '<a href="#foto" class="btn btn-primary btn-lg">Stuur foto’s van mijn woning →</a>' +
        '<a href="#contact" class="btn btn-secondary btn-lg">Vraag persoonlijk advies →</a>' +
      '</div>';
  }

  showStep(0);
}

function initPriceCalc() {
  var form = document.getElementById('price-config-form');
  if (!form) return;
  var resultBox = document.getElementById('price-result');
  var rangeEl = document.getElementById('price-range');

  var base = {
    '1': { min: 1800, max: 2800 },
    '2': { min: 3200, max: 4800 },
    '3': { min: 4500, max: 6800 },
    '4+': { min: 6000, max: 9500 }
  };

  function calculate() {
    var rooms = form.querySelector('[name="rooms"]').value;
    var heat = form.querySelector('[name="heat"]').value;
    var complexity = form.querySelector('[name="complexity"]').value;
    var min = (base[rooms] || base['1']).min;
    var max = (base[rooms] || base['1']).max;

    if (heat === 'yes') { min = Math.round(min * 1.05); max = Math.round(max * 1.08); }
    if (complexity === 'complex') { min = Math.round(min * 1.15); max = Math.round(max * 1.25); }
    if (complexity === 'simple') { min = Math.round(min * 0.95); max = Math.round(max * 0.98); }

    rangeEl.textContent = '€ ' + min.toLocaleString('nl-BE') + ' – € ' + max.toLocaleString('nl-BE');
    resultBox.classList.remove('hidden');
  }

  form.addEventListener('change', calculate);
  var btn = form.querySelector('[data-calc]');
  if (btn) btn.addEventListener('click', function (e) { e.preventDefault(); calculate(); });
}

function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var item = btn.closest('.faq-item');
      var wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function (i) { i.classList.remove('open'); });
      if (!wasOpen) item.classList.add('open');
    });
  });
}

function initMobileNav() {
  var toggle = document.querySelector('.mobile-toggle');
  var nav = document.querySelector('.nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', function () { nav.classList.toggle('open'); });
}

function initPhotoForm() {
  var form = document.getElementById('photo-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var success = document.getElementById('photo-success');
    if (success) {
      form.classList.add('hidden');
      success.classList.remove('hidden');
    }
  });
}

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var success = document.getElementById('contact-success');
    if (success) {
      form.classList.add('hidden');
      success.classList.remove('hidden');
    }
  });
}
