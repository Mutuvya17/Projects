/* ===============================
   Simple Calculator Logic
   - Two-operand model with chaining
   - Keyboard support
   - Divide-by-zero handling
   =============================== */

const screen = document.getElementById('screen');
const historyEl = document.getElementById('history');

let a = null;           // first operand (number)
let b = null;           // second operand (number)
let op = null;          // operator: +, −, ×, ÷
let enteringB = false;  // whether we're typing the second operand
let justEvaluated = false;

const MAX_LEN = 16;

// Utilities
const asNumber = (str) => Number(str);
const format = (num) => {
  if (!Number.isFinite(num)) return 'Error';
  // limit precision without trailing zeros
  const s = Math.round((num + Number.EPSILON) * 1e12) / 1e12;
  let out = s.toString();
  if (out.length > MAX_LEN) {
    // fallback to exponential for very large/small
    out = s.toExponential(10);
  }
  return out;
};

const setScreen = (text) => { screen.textContent = text; };
const setHistory = (text) => { historyEl.textContent = text; };

// Current displayed string getter/setter
const getDisplay = () => screen.textContent;
const setDisplayDigit = (digit) => {
  if (justEvaluated && !enteringB && !op) {
    // start fresh after equals if no operator is chosen
    setScreen('0');
  }
  justEvaluated = false;

  let cur = getDisplay();
  if (cur === '0' && digit !== '.') cur = '';
  if (cur.length >= MAX_LEN) return;
  setScreen(cur + digit);
};

const addDecimal = () => {
  let cur = getDisplay();
  if (justEvaluated && !enteringB && !op) {
    cur = '0';
    justEvaluated = false;
  }
  if (!cur.includes('.')) {
    if (cur === '' || cur === '0') cur = '0';
    setScreen(cur + '.');
  }
};

const negate = () => {
  let cur = getDisplay();
  if (cur.startsWith('-')) cur = cur.slice(1);
  else if (cur !== '0') cur = '-' + cur;
  setScreen(cur);
};

const backspace = () => {
  let cur = getDisplay();
  if (justEvaluated && !enteringB && !op) return; // do nothing after equals
  if (cur.length <= 1 || (cur.length === 2 && cur.startsWith('-'))) {
    setScreen('0');
  } else {
    setScreen(cur.slice(0, -1));
  }
};

const clearEntry = () => {
  setScreen('0');
};

const clearAll = () => {
  a = b = null;
  op = null;
  enteringB = false;
  justEvaluated = false;
  setHistory('');
  setScreen('0');
};

const chooseOperator = (symbol) => {
  const displayVal = asNumber(getDisplay());

  if (a === null) {
    a = displayVal;
  } else if (enteringB) {
    // if user taps operator again, compute previous op first (chaining)
    b = displayVal;
    const result = compute(a, b, op);
    a = result;
    setScreen(format(result));
  } else {
    // user changed operator before entering b
  }

  op = symbol;
  enteringB = true;
  justEvaluated = false;
  setHistory(`${format(a)} ${op}`);
  setScreen('0');
};

const equals = () => {
  if (op === null) return;

  const displayVal = asNumber(getDisplay());
  b = displayVal;

  const result = compute(a, b, op);
  setHistory(`${format(a)} ${op} ${format(b)} =`);
  setScreen(format(result));

  a = result;
  enteringB = false;
  justEvaluated = true;
  // keep op so user can press equals repeatedly to repeat last op if desired
};

function compute(x, y, operator) {
  // divide by zero guard
  if (operator === '÷' && y === 0) return Infinity; // will show "Error"
  switch (operator) {
    case '+': return x + y;
    case '−': return x - y;
    case '×': return x * y;
    case '÷': return x / y;
    default: return y;
  }
}

/* ---------- Click handlers ---------- */
document.querySelectorAll('[data-digit]').forEach(btn => {
  btn.addEventListener('click', () => setDisplayDigit(btn.dataset.digit));
});

document.querySelector('[data-action="decimal"]').addEventListener('click', addDecimal);
document.querySelector('[data-action="negate"]').addEventListener('click', negate);
document.querySelector('[data-action="backspace"]').addEventListener('click', backspace);
document.querySelector('[data-action="clear-entry"]').addEventListener('click', clearEntry);
document.querySelector('[data-action="clear-all"]').addEventListener('click', clearAll);
document.querySelector('[data-action="equals"]').addEventListener('click', equals);

document.querySelectorAll('[data-op]').forEach(btn => {
  btn.addEventListener('click', () => chooseOperator(btn.dataset.op));
});

/* ---------- Keyboard support ---------- */
window.addEventListener('keydown', (e) => {
  const k = e.key;

  if (/\d/.test(k)) {
    setDisplayDigit(k);
    return;
  }
  if (k === '.' ) { addDecimal(); return; }

  if (k === '+' || k === '-') {
    chooseOperator(k === '+' ? '+' : '−'); return;
  }
  if (k === '*' || k.toLowerCase() === 'x') { chooseOperator('×'); return; }
  if (k === '/') { chooseOperator('÷'); return; }

  if (k === 'Enter' || k === '=') { e.preventDefault(); equals(); return; }
  if (k === 'Backspace') { backspace(); return; }
  if (k.toLowerCase() === 'c') { clearEntry(); return; }
  if (k.toLowerCase() === 'a') { clearAll(); return; }
  if (k === '_') { negate(); return; } // optional
});

/* ---------- Initialize ---------- */
clearAll();
