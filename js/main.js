/**
 * ClimaCore – Interactive features
 * Airco Check wizard · FAQ accordion · Price form · Savings calculator
 */

document.addEventListener('DOMContentLoaded', () => {
  initWizard();
  initFAQ();
  initStickyCTA();
});

/* ========== AIRCO CHECK WIZARD ========== */
function initWizard() {
  const steps = document.querySelectorAll('.wizard-step');
  const progressBar = document.querySelector('.wizard-progress-bar');
  const totalSteps = steps.length - 1; // last is result
  let current = 0;
  const answers = {};

  function showStep(index) {
    steps.forEach((s, i) => s.classList.toggle('active', i === index));
    const pct = (index / totalSteps) * 100;
    if (progressBar) progressBar.style.width = `${Math.min(pct, 100)}%`;
    current = index;
  }

  document.querySelectorAll('.wizard-option').forEach(opt => {
    opt.addEventListener('click', () => {
      const step = opt.closest('.wizard-step');
      const name = step.dataset.name;
      step.querySelectorAll('.wizard-option').forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');
      answers[name] = opt.dataset.value;

      // Auto advance after short delay
      setTimeout(() => {
        if (current < totalSteps - 1) {
          showStep(current + 1);
        } else {
          showResult();
        }
      }, 280);
    });
  });

  // Manual next/prev if present
  document.querySelectorAll('[data-wizard-next]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current < totalSteps - 1) showStep(current + 1);
      else showResult();
    });
  });
  document.querySelectorAll('[data-wizard-prev]').forEach(btn => {
    btn.addEventListener('click', () => {
      if (current > 0) showStep(current - 1);
    });
  });

  function showResult() {
    showStep(totalSteps);
    const resultEl = document.getElementById('wizard-result-content');
    if (!resultEl) return;

    const rooms = answers.rooms || '1';
    const size = answers.size || '20-35';
    const heat = answers.heat || 'nee';
    const priority = answers.priority || 'prijs';

    let system = 'single-split';
    let units = '1 binnenunit + 1 buitenunit';
    let desc = 'Een single-split airco is vaak de meest efficiënte en prijsbewuste oplossing voor één ruimte.';

    if (rooms === '2' || rooms === '3' || rooms === 'meerdere') {
      system = 'multi-split';
      units = rooms === '2' ? '2 binnenunits + 1 buitenunit' :
              rooms === '3' ? '3 binnenunits + 1 buitenunit' :
              'Meerdere binnenunits + 1 of meer buitenunits';
      desc = 'Een multi-split systeem laat je meerdere ruimtes onafhankelijk koelen (en verwarmen) met één buitenunit.';
    }

    const heatText = heat === 'ja' || heat === 'weet-niet'
      ? 'Geschikt voor koelen én verwarmen'
      : 'Primair gericht op koelen';

    resultEl.innerHTML = `
      <h3>Jouw situatie lijkt geschikt voor een ${system} oplossing</h3>
      <p class="text-muted" style="margin-bottom:20px">${desc}</p>
      <div class="result-config">
        <ul>
          <li>${units}</li>
          <li>${heatText}</li>
          <li>Aangepast aan ruimte van ca. ${size} m²</li>
          <li>Energiezuinige werking (A+++ klasse mogelijk)</li>
          ${priority === 'stilte' ? '<li>Focus op stille binnenunits</li>' : ''}
          ${priority === 'design' ? '<li>Esthetische afwerking en designunits</li>' : ''}
          ${priority === 'energie' ? '<li>Maximale energie-efficiëntie</li>' : ''}
        </ul>
      </div>
      <p class="disclaimer">
        Dit is een indicatie op basis van jouw antwoorden. De definitieve keuze hangt af van een technische beoordeling ter plaatse (leidinglengte, bereikbaarheid, elektrische voorzieningen, isolatie, etc.).
      </p>
      <a href="#contact" class="btn btn-primary btn-lg">Ontvang vrijblijvend advies voor jouw woning →</a>
    `;
  }

  // Start
  showStep(0);
}

/* ========== FAQ ACCORDION ========== */
function initFAQ() {
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const wasOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!wasOpen) item.classList.add('open');
    });
  });
}

/* ========== STICKY MOBILE ========== */
function initStickyCTA() {
  // Already CSS-driven; optional hide on scroll up etc. can be added later
}
