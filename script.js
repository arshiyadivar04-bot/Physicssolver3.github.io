// Physics Solver - Static SPA (index.html + styles.css + app.js)
// No frameworks. Uses mathjs via CDN (global `math`).

// ---------------- Icons (inline SVG) ----------------
const Icons = {
  home: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 9l9-7 9 7"/><path d="M9 22V12h6v10"/><path d="M21 22H3"/></svg>`,
  calc: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="3" width="16" height="18" rx="2"/><line x1="8" y1="7" x2="16" y2="7"/><line x1="8" y1="11" x2="8" y2="11"/><line x1="12" y1="11" x2="12" y2="11"/><line x1="16" y1="11" x2="16" y2="11"/><line x1="8" y1="15" x2="8" y2="15"/><line x1="12" y1="15" x2="12" y2="15"/><line x1="16" y1="15" x2="16" y2="15"/></svg>`,
  list: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><circle cx="3" cy="6" r="1"/><circle cx="3" cy="12" r="1"/><circle cx="3" cy="18" r="1"/></svg>`,
  book: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M4 4v15.5A2.5 2.5 0 0 0 6.5 22H20V6a2 2 0 0 0-2-2H6.5A2.5 2.5 0 0 0 4 6.5"/></svg>`,
  bulb: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18h6"/><path d="M10 22h4"/><path d="M2 12a10 10 0 1 1 20 0c0 3.5-2 5-3 6H5c-1-1-3-2.5-3-6z"/></svg>`,
  help: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 1 1 5.83 1c0 2-3 2-3 4"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>`,
  access: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="7" r="4"/><path d="M6 21v-3a6 6 0 0 1 12 0v3"/></svg>`,
  layers: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>`,
  history: () => `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 3v5h5"/><path d="M3.05 13A9 9 0 1 0 6 5.3L3 8"/><path d="M12 7v5l4 2"/></svg>`,
};

// ---------------- Data ----------------
const EQUATIONS = [
  {
    id: "wave-speed",
    title: "Wave speed",
    topic: "Waves",
    formula: "c = f · λ",
    variables: [
      { key: "c", label: "Speed", unit: "m/s", isConstant: true, defaultValue: 3e8 },
      { key: "f", label: "Frequency", unit: "Hz" },
      { key: "lambda", label: "Wavelength (λ)", unit: "m" },
    ],
    rearrangements: { c: "f * lambda", f: "c / lambda", lambda: "c / f" },
  },
  {
    id: "newton-2nd",
    title: "Newton's Second Law",
    topic: "Mechanics",
    formula: "F = m a",
    variables: [
      { key: "F", label: "Force", unit: "N" },
      { key: "m", label: "Mass", unit: "kg" },
      { key: "a", label: "Acceleration", unit: "m/s^2" },
    ],
    rearrangements: { F: "m * a", m: "F / a", a: "F / m" },
  },
  {
    id: "ohms-law",
    title: "Ohm's Law",
    topic: "Electricity",
    formula: "V = I R",
    variables: [
      { key: "V", label: "Voltage", unit: "V" },
      { key: "I", label: "Current", unit: "A" },
      { key: "R", label: "Resistance", unit: "Ω" },
    ],
    rearrangements: { V: "I * R", I: "V / R", R: "V / I" },
  },
  {
    id: "photon-energy",
    title: "Photon energy",
    topic: "Quantum",
    formula: "E = h f",
    variables: [
      { key: "E", label: "Energy", unit: "J" },
      { key: "h", label: "Planck constant", unit: "J·s", isConstant: true, defaultValue: 6.626e-34 },
      { key: "f", label: "Frequency", unit: "Hz" },
    ],
    rearrangements: { E: "h * f", f: "E / h", h: "E / f" },
  },
  {
    id: "suvat-v2",
    title: "SUVAT (v² = u² + 2as)",
    topic: "Mechanics",
    formula: "v^2 = u^2 + 2 a s",
    variables: [
      { key: "v", label: "Final speed", unit: "m/s" },
      { key: "u", label: "Initial speed", unit: "m/s" },
      { key: "a", label: "Acceleration", unit: "m/s^2" },
      { key: "s", label: "Displacement", unit: "m" },
    ],
    rearrangements: {
      v: "sqrt(u^2 + 2 * a * s)",
      u: "sqrt(v^2 - 2 * a * s)",
      a: "(v^2 - u^2) / (2 * s)",
      s: "(v^2 - u^2) / (2 * a)",
    },
  },
  {
    id: "gravitation",
    title: "Newton's Law of Gravitation",
    topic: "Mechanics",
    formula: "F = G m1 m2 / r^2",
    variables: [
      { key: "F", label: "Force", unit: "N" },
      { key: "G", label: "Gravitational constant", unit: "N·m^2/kg^2", isConstant: true, defaultValue: 6.674e-11 },
      { key: "m1", label: "Mass 1 (m1)", unit: "kg" },
      { key: "m2", label: "Mass 2 (m2)", unit: "kg" },
      { key: "r", label: "Distance", unit: "m" },
    ],
    rearrangements: {
      F: "G * m1 * m2 / (r^2)",
      G: "F * (r^2) / (m1 * m2)",
      m1: "F * (r^2) / (G * m2)",
      m2: "F * (r^2) / (G * m1)",
      r: "sqrt(G * m1 * m2 / F)",
    },
  },
  {
    id: "g-field-strength",
    title: "Gravitational Field Strength",
    topic: "Mechanics",
    formula: "g = F / m",
    variables: [
      { key: "g", label: "Field strength", unit: "N/kg" },
      { key: "F", label: "Force", unit: "N" },
      { key: "m", label: "Mass", unit: "kg" },
    ],
    rearrangements: { g: "F / m", F: "g * m", m: "F / g" },
  },
  {
    id: "kinetic-energy",
    title: "Kinetic Energy",
    topic: "Mechanics",
    formula: "KE = ½mv²",
    variables: [
      { key: "KE", label: "Kinetic Energy", unit: "J" },
      { key: "m", label: "Mass", unit: "kg" },
      { key: "v", label: "Velocity", unit: "m/s" },
    ],
    rearrangements: { 
      KE: "0.5 * m * v^2", 
      m: "2 * KE / (v^2)", 
      v: "sqrt(2 * KE / m)" 
    },
  },
  {
    id: "photoelectric-equation",
    title: "Photoelectric Equation",
    topic: "Quantum Physics",
    formula: "hf = ϕ + Ek(max)",
    variables: [
      { key: "h", label: "Planck's constant", unit: "J·s", isConstant: true, defaultValue: 6.62607015e-34 },
      { key: "f", label: "Frequency", unit: "Hz" },
      { key: "phi", label: "Work function", unit: "J" },
      { key: "Ek", label: "Max kinetic energy", unit: "J" },
    ],
    rearrangements: {
      f: "(phi + Ek) / h",
      phi: "h * f - Ek",
      Ek: "h * f - phi",
    },
  },
];

const TOPICS = [
  { key: "Electricity", title: "Electricity" },
  { key: "Waves", title: "Waves" },
  { key: "Mechanics", title: "Mechanics" },
  { key: "Quantum", title: "Quantum" },
];

// ---------------- History Store (localStorage) ----------------
const HistoryStore = (() => {
  const KEY = "ps_history";
  return {
    all() {
      try { const raw = localStorage.getItem(KEY); return raw ? JSON.parse(raw) : []; } catch { return []; }
    },
    add(entry) {
      const list = HistoryStore.all();
      list.unshift(entry);
      localStorage.setItem(KEY, JSON.stringify(list.slice(0, 200)));
    },
    clear() { localStorage.removeItem(KEY); },
  };
})();

// ---------------- Router Helpers ----------------
function parseHash() {
  const hash = location.hash || "#/";
  const [path, query = ""] = hash.replace(/^#/, '').split('?');
  const route = path.startsWith('/') ? path.slice(1) : path; // e.g. "solve"
  const params = Object.fromEntries(new URLSearchParams(query));
  return { route: route || '', params };
}

function navigate(to) { location.hash = to; }

// ---------------- Rendering ----------------
const app = document.getElementById('app');

function iconBadge(svg, label) {
  return `<div class="icon-badge" aria-hidden="true">${svg}</div><div><div class="tile-title">${label}</div><div class="tile-desc">Open</div></div>`;
}

function renderHome() {
  app.innerHTML = `
    <section class="section">
      <h1 class="h1">Physics Solver</h1>
      <p class="muted">Select a section to get started.</p>
    </section>

    <div class="grid cols-3">
      <a class="tile" href="#/solve">${iconBadge(Icons.calc(), 'Solve Equation')}</a>
      <a class="tile" href="#/topics">${iconBadge(Icons.list(), 'Browse Topics')}</a>
      <a class="tile" href="#/history">${iconBadge(Icons.history(), 'History')}</a>
      <a class="tile" href="#/examples">${iconBadge(Icons.book(), 'Examples')}</a>
      <a class="tile" href="#/guidance">${iconBadge(Icons.book(), 'Guidance')}</a>
      <a class="tile" href="#/tips">${iconBadge(Icons.bulb(), 'Usage Tips')}</a>
      <a class="tile" href="#/help">${iconBadge(Icons.help(), 'Help')}</a>
      <a class="tile" href="#/accessibility">${iconBadge(Icons.access(), 'Accessibility')}</a>
      <a class="tile" href="#/expand">${iconBadge(Icons.layers(), 'Expand')}</a>
    </div>
  `;
}

function render404() {
  app.innerHTML = `
    <div class="full-center">
      <div class="card" style="max-width:520px;width:100%">
        <div class="card-content center">
          <h2 class="h1">404</h2>
          <p class="muted mb-3">Oops! Page not found.</p>
          <a href="#/" class="btn">${Icons.home()} Home</a>
        </div>
      </div>
    </div>
  `;
}

function renderSimplePage({ title, bodyHTML }) {
  app.innerHTML = `
    <section class="section row space-between">
      <div>
        <h1 class="h1">${title}</h1>
        <p class="muted">${bodyHTML}</p>
      </div>
      <a class="btn btn-outline" href="#/">${Icons.home()} Home</a>
    </section>
  `;
}

function groupByTopic() {
  return TOPICS.map(t => ({ topic: t.title, equations: EQUATIONS.filter(e => e.topic === t.title) }))
               .filter(g => g.equations.length > 0);
}

function renderTopics() {
  const groups = groupByTopic();
  app.innerHTML = `
    <section class="section row space-between">
      <div>
        <h1 class="h1">Browse Topics</h1>
        <p class="muted">Open a topic to see supported equations and jump to the solver.</p>
      </div>
      <a class="btn btn-outline" href="#/">${Icons.home()} Home</a>
    </section>

    <div class="grid cols-2">
      ${groups.map(g => `
        <div class="card">
          <div class="card-header">
            <div class="card-title">${g.topic}</div>
            <div class="card-desc">${g.equations.length} equation(s)</div>
          </div>
          <div class="card-content">
            ${g.equations.map(eq => `
              <div class="row space-between mb-3">
                <div>
                  <div class="tile-title">${eq.title}</div>
                  <div class="tile-desc">${eq.formula}</div>
                </div>
                <a class="btn btn-outline" href="#/solve?id=${eq.id}">Solve →</a>
              </div>
            `).join('')}
          </div>
        </div>
      `).join('')}
    </div>
  `;
}

function renderHistory() {
  const list = HistoryStore.all();
  app.innerHTML = `
    <section class="section row space-between">
      <div>
        <h1 class="h1">History</h1>
        <p class="muted">Your past calculations stored locally in this browser.</p>
      </div>
      <a class="btn btn-outline" href="#/">${Icons.home()} Home</a>
    </section>

    ${list.length === 0 ? `
      <div class="card"><div class="card-content">No history yet.</div></div>
    ` : `
      <div class="card">
        <div class="card-content">
          <div class="row mb-3">
            <button id="exportJson" class="btn">Export JSON</button>
            <button id="clearHistory" class="btn btn-outline">Clear</button>
          </div>
          <div class="p-2" style="overflow:auto">
            <table class="table">
              <thead>
                <tr>
                  <th>Time</th><th>Equation</th><th>Solve For</th><th>Inputs</th><th>Result</th>
                </tr>
              </thead>
              <tbody>
                ${list.map(it => {
                  const time = new Date(it.timestamp).toLocaleString();
                  const inputs = Object.entries(it.inputs).map(([k,v]) => `${k}=${v}`).join(', ');
                  const unit = it.unit ? ` ${it.unit}` : '';
                  return `<tr><td>${time}</td><td>${it.equationTitle}</td><td>${it.solveFor}</td><td>${inputs}</td><td>${Number(it.result.toPrecision(6))}${unit}</td></tr>`;
                }).join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `}
  `;

  const clearBtn = document.getElementById('clearHistory');
  if (clearBtn) clearBtn.addEventListener('click', () => { HistoryStore.clear(); renderHistory(); });
  const exportBtn = document.getElementById('exportJson');
  if (exportBtn) exportBtn.addEventListener('click', () => {
    const data = JSON.stringify(HistoryStore.all(), null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'physics-solver-history.json';
    a.click(); URL.revokeObjectURL(url);
  });
}

function renderSolve(params) {
  // State
  let selected = EQUATIONS.find(e => e.id === params.id) || EQUATIONS[0];
  let solveFor = selected.variables[0].key;
  let values = {}; // map of input values
  // seed defaults
  selected.variables.forEach(v => { if (v.defaultValue !== undefined) values[v.key] = String(v.defaultValue); });

  function updateUI() {
    const expr = selected.rearrangements[solveFor];
    app.innerHTML = `
      <section class="section row space-between">
        <div>
          <h1 class="h1">Solve Equation</h1>
          <p class="muted">Select a formula and enter known values.</p>
        </div>
        <a class="btn btn-outline" href="#/">${Icons.home()} Home</a>
      </section>

      <div class="card">
        <div class="card-header">
          <div class="card-title">Equation</div>
          <div class="card-desc">${selected.formula}</div>
        </div>
        <div class="card-content">
          <div class="grid cols-2">
            <div>
              <label class="label" for="eq-select">Formula</label>
              <select id="eq-select" class="select mt-2">
                ${EQUATIONS.map(e => `<option value="${e.id}" ${e.id===selected.id?'selected':''}>${e.title}</option>`).join('')}
              </select>
            </div>
            <div>
              <label class="label" for="solve-select">Solve for</label>
              <select id="solve-select" class="select mt-2">
                ${selected.variables.map(v => `<option value="${v.key}" ${v.key===solveFor?'selected':''}>${v.label} (${v.key})</option>`).join('')}
              </select>
            </div>
          </div>

          <div class="grid cols-2 mt-4">
            ${selected.variables.filter(v => v.key !== solveFor).map(v => `
              <div>
                <label class="label" for="in-${v.key}">
                  ${v.label}${v.unit?` <span class="small">(${v.unit})</span>`:''}
                  ${v.isConstant?` <span class="badge">constant</span>`:''}
                </label>
                <input id="in-${v.key}" class="input" placeholder="${v.defaultValue ?? '0'}" value="${values[v.key] ?? (v.defaultValue ?? '')}" inputmode="decimal" />
              </div>
            `).join('')}
          </div>

          <div class="row mt-4">
            <button id="calc" class="btn">Calculate</button>
            <div id="result" class="small" aria-live="polite"></div>
          </div>
        </div>
      </div>
    `;

    document.getElementById('eq-select').addEventListener('change', (e) => {
      const id = e.target.value; selected = EQUATIONS.find(x => x.id === id) || selected; solveFor = selected.variables[0].key; values = {}; selected.variables.forEach(v => { if (v.defaultValue !== undefined) values[v.key] = String(v.defaultValue); }); updateUI();
    });
    document.getElementById('solve-select').addEventListener('change', (e) => { solveFor = e.target.value; updateUI(); });

    selected.variables.filter(v => v.key !== solveFor).forEach(v => {
      const input = document.getElementById(`in-${v.key}`);
      input.addEventListener('input', (e) => { values[v.key] = e.target.value; });
    });

    document.getElementById('calc').addEventListener('click', () => {
      try {
        const scope = {};
        selected.variables.forEach(v => {
          if (v.key === solveFor) return;
          const raw = values[v.key];
          const num = raw !== undefined && raw !== '' ? Number(raw) : NaN;
          if (Number.isNaN(num)) throw new Error(`Missing or invalid ${v.label}`);
          scope[v.key] = num;
        });
        Object.keys(values).forEach(k => { if (!(k in scope) && k !== solveFor) { const num = Number(values[k]); if (!Number.isNaN(num)) scope[k] = num; } });
        const out = math.evaluate(expr, scope);
        const outNum = typeof out === 'number' ? out : Number(out);
        if (!Number.isFinite(outNum)) throw new Error('Calculation failed');
        const unit = (selected.variables.find(v => v.key === solveFor) || {}).unit;
        document.getElementById('result').innerHTML = `Result (${solveFor}): <strong style="color:hsl(var(--primary))">${Number(outNum.toPrecision(6))}</strong>${unit?` <span style="color:hsl(var(--primary))">${unit}</span>`:''}`;

        HistoryStore.add({
          id: (crypto && crypto.randomUUID ? crypto.randomUUID() : String(Date.now())),
          timestamp: Date.now(),
          equationId: selected.id,
          equationTitle: selected.title,
          solveFor,
          inputs: scope,
          result: outNum,
          unit,
        });
      } catch (err) {
        alert(err && err.message ? err.message : 'Unable to calculate. Check your inputs.');
      }
    });
  }

  updateUI();
}

// ---------------- Main Router ----------------
function router() {
  const { route, params } = parseHash();
  switch (route) {
    case '':
    case '/':
      renderHome();
      break;
    case 'solve':
      renderSolve(params);
      break;
    case 'topics':
      renderTopics();
      break;
    case 'history':
      renderHistory();
      break;
    case 'examples':
      renderSimplePage({ title: 'Example Problems', bodyHTML: 'A curated bank of AQA-style questions with worked solutions is coming soon.' });
      break;
    case 'guidance':
      renderSimplePage({ title: 'Guidance', bodyHTML: 'Study techniques, units, and calculator tips will appear here. Stay tuned.' });
      break;
    case 'tips':
      renderSimplePage({ title: 'Usage Tips', bodyHTML: '<ul><li>Choose the equation first, then pick which variable to solve for.</li><li>Use standard constants or override them if needed.</li><li>Results display with up to 6 significant figures for clarity.</li></ul>' });
      break;
    case 'help':
      renderSimplePage({ title: 'Help', bodyHTML: 'Need assistance? Start with Usage Tips or Browse Topics. More guides will be added soon.' });
      break;
    case 'accessibility':
      renderSimplePage({ title: 'Accessibility', bodyHTML: '<ul><li>High-contrast dark navy theme with clear type hierarchy.</li><li>Keyboard navigable controls with visible focus rings.</li><li>Semantic HTML throughout.</li></ul>' });
      break;
    case 'expand':
      renderSimplePage({ title: 'Expand', bodyHTML: 'Future add-ons include account sync, graphing tools, and symbolic manipulation.' });
      break;
    default:
      render404();
  }
}

window.addEventListener('hashchange', router);
window.addEventListener('load', () => { if (!location.hash) navigate('#/'); router(); });
