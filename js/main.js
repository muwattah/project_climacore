/**
 * ClimaCore – Interactive suite
 * Airco Check · Premium Price Wizard · FAQ · Forms
 */

/* ========== CENTRAL PRICE CONFIG (DEMO – replace with real values) ========== */
var CLIMACORE_PRICE_CONFIG = {
  baseByUnits: {
    '1':  { min: 1800, max: 2800 },
    '2':  { min: 3200, max: 4800 },
    '3':  { min: 4500, max: 6800 },
    '4+': { min: 6000, max: 9500 }
  },
  sizeMultiplier: {
    '<20': 0.92, '20-35': 1.0, '35-50': 1.08, '50-75': 1.18, '75+': 1.28
  },
  heatSurcharge: { cool: 1.0, both: 1.06, unknown: 1.03 },
  complexitySurcharge: { easy: 0.95, medium: 1.0, complex: 1.18, unknown: 1.05 },
  isDemo: true
};

document.addEventListener('DOMContentLoaded', function () {
  initWizard();
  initFAQ();
  initPriceWizard();
  initMobileNav();
  initPhotoForm();
  initContactForm();
});

function initWizard() {
  var steps = document.querySelectorAll('.wizard-step');
  if (!steps.length) return;
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
      units = rooms === '2' ? '2 binnenunits + 1 buitenunit' : rooms === '3' ? '3 binnenunits + 1 buitenunit' : 'Meerdere binnenunits + 1 of meer buitenunits';
      reason = 'Omdat je meerdere ruimtes onafhankelijk wilt kunnen regelen, is een multi-split oplossing vaak interessanter.';
    }
    if (heat === 'ja' || heat === 'weet-niet') tags.push('Koelen + verwarmen');
    else tags.push('Primair koelen');
    if (priority === 'stilte') tags.push('Focus op stille units');
    if (priority === 'design') tags.push('Esthetische afwerking');
    if (priority === 'energie') tags.push('Maximale energie-efficiëntie');
    var tagsHtml = tags.map(function (t) { return '<li>' + t + '</li>'; }).join('');
    el.innerHTML = '<div class="result-header"><p class="result-label">Jouw situatie</p><h3>Waarschijnlijk interessant: ' + system + ' airco</h3></div><div class="result-config"><ul><li>' + units + '</li><li>Aangepast aan ca. ' + size + ' m²</li>' + tagsHtml + '<li>Energiezuinige werking mogelijk (A+++ klasse)</li></ul></div><p class="result-why"><strong>Waarom?</strong> ' + reason + '</p><p class="disclaimer">Dit is een indicatie. De definitieve keuze en prijs hangen af van een technische beoordeling ter plaatse.</p><div class="result-ctas"><a href="#foto" class="btn btn-primary btn-lg">Stuur foto’s van mijn woning →</a><a href="#contact" class="btn btn-secondary btn-lg">Vraag persoonlijk advies →</a></div>';
  }
  showStep(0);
}

function initPriceWizard() {
  var root = document.getElementById('price-wizard');
  if (!root) return;

  var answers = {};
  var current = 1;
  var total = 6;
  var bar = document.getElementById('pw-bar');
  var label = document.getElementById('pw-label');

  function showStep(n) {
    root.querySelectorAll('.pw-step').forEach(function (s) {
      s.classList.toggle('active', s.getAttribute('data-pw') === String(n));
    });
    if (n === 'result') {
      if (bar) bar.style.width = '100%';
      if (label) label.textContent = 'Resultaat';
    } else {
      current = n;
      if (bar) bar.style.width = ((n - 1) / total * 100) + '%';
      if (label) label.textContent = n + ' / ' + total;
    }
  }

  root.querySelectorAll('.pw-card').forEach(function (card) {
    card.addEventListener('click', function () {
      var key = card.dataset.key;
      var val = card.dataset.value;
      var step = card.closest('.pw-step');
      step.querySelectorAll('.pw-card').forEach(function (c) { c.classList.remove('selected'); });
      card.classList.add('selected');
      answers[key] = val;

      if (key === 'heat') {
        var hint = document.getElementById('pw-heat-hint');
        if (hint) hint.style.display = val === 'unknown' ? 'block' : 'none';
      }

      var stepNum = parseInt(step.getAttribute('data-pw'), 10);
      setTimeout(function () {
        if (stepNum < total) showStep(stepNum + 1);
      }, 220);
    });
  });

  root.querySelectorAll('[data-pw-prev]').forEach(function (btn) {
    btn.addEventListener('click', function () {
      if (current > 1) showStep(current - 1);
    });
  });

  var showBtn = document.getElementById('pw-show-result');
  if (showBtn) {
    showBtn.addEventListener('click', function () {
      var gemeente = document.getElementById('pw-gemeente');
      answers.gemeente = gemeente ? gemeente.value.trim() : '';
      renderResult();
      showStep('result');
    });
  }

  var leadBtn = document.getElementById('pw-show-lead');
  if (leadBtn) {
    leadBtn.addEventListener('click', function () {
      var lead = document.getElementById('pw-lead');
      if (lead) {
        lead.style.display = 'block';
        lead.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        var g = document.getElementById('pw-lead-gemeente');
        if (g && answers.gemeente) g.value = answers.gemeente;
      }
    });
  }

  var leadForm = document.getElementById('pw-lead-form');
  if (leadForm) {
    leadForm.addEventListener('submit', function (e) {
      e.preventDefault();
      console.log('Price lead:', Object.assign({}, answers, Object.fromEntries(new FormData(leadForm))));
      leadForm.classList.add('hidden');
      var success = document.getElementById('pw-lead-success');
      if (success) success.classList.remove('hidden');
    });
  }

  function renderResult() {
    var cfg = CLIMACORE_PRICE_CONFIG;
    var units = answers.units || answers.rooms || '1';
    if (units === '4+') units = '4+';
    var base = cfg.baseByUnits[units] || cfg.baseByUnits['1'];
    var sizeMul = cfg.sizeMultiplier[answers.size] || 1;
    var heatMul = cfg.heatSurcharge[answers.heat] || 1;
    var compMul = cfg.complexitySurcharge[answers.complexity] || 1;

    var min = Math.round(base.min * sizeMul * heatMul * compMul);
    var max = Math.round(base.max * sizeMul * heatMul * compMul);

    var rangeEl = document.getElementById('pw-price-range');
    if (rangeEl) rangeEl.textContent = '€ ' + min.toLocaleString('nl-BE') + ' – € ' + max.toLocaleString('nl-BE');

    var heatLabel = { cool: 'Alleen koelen', both: 'Koelen + verwarmen', unknown: 'Nog te bepalen' };
    var compLabel = { easy: 'Eenvoudig', medium: 'Gemiddeld', complex: 'Complex', unknown: 'Nog te beoordelen' };
    var systemLabel = (units === '1') ? 'Single-split' : 'Multi-split';

    var summary = document.getElementById('pw-summary');
    if (summary) {
      summary.innerHTML =
        '<p style="font-weight:500;margin-bottom:10px">Op basis van jouw antwoorden:</p><ul>' +
        '<li>✓ ' + (answers.units || answers.rooms || '1') + ' binnenunit(s)</li>' +
        '<li>✓ ' + (heatLabel[answers.heat] || '—') + '</li>' +
        '<li>✓ ' + (answers.size || '—') + ' m² belangrijkste ruimte</li>' +
        '<li>✓ ' + (compLabel[answers.complexity] || '—') + ' installatiecomplexiteit</li>' +
        (answers.gemeente ? '<li>✓ Regio ' + answers.gemeente + '</li>' : '') +
        '</ul>';
    }

    var breakdown = document.getElementById('pw-breakdown');
    if (breakdown) {
      breakdown.innerHTML =
        '<div><span>Aantal binnenunits</span><strong>' + (answers.units || '—') + '</strong></div>' +
        '<div><span>Systeem</span><strong>' + systemLabel + '</strong></div>' +
        '<div><span>Gebruik</span><strong>' + (heatLabel[answers.heat] || '—') + '</strong></div>' +
        '<div><span>Oppervlakte</span><strong>' + (answers.size || '—') + ' m²</strong></div>' +
        '<div><span>Installatie</span><strong>' + (compLabel[answers.complexity] || '—') + '</strong></div>' +
        '<div><span>Afwerking</span><strong>Standaard</strong></div>';
    }
  }

  showStep(1);
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
    form.classList.add('hidden');
    var s = document.getElementById('photo-success');
    if (s) s.classList.remove('hidden');
  });
}

function initContactForm() {
  var form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    form.classList.add('hidden');
    var s = document.getElementById('contact-success');
    if (s) s.classList.remove('hidden');
  });
}
