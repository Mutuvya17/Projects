/* Digital Clock
  - Updates every second
  - Supports 12h/24h toggle
  - Timezone selection (local, UTC, Africa/Nairobi, etc.)
  - Start / Stop controls
  - Uses Intl.DateTimeFormat for safe timezone formatting
*/

const timeEl = document.getElementById('time');
const ampmEl = document.getElementById('ampm');
const dateEl = document.getElementById('date');

const formatToggle = document.getElementById('formatToggle');
const tzSelect = document.getElementById('tzSelect');
const startBtn = document.getElementById('startBtn');
const stopBtn = document.getElementById('stopBtn');

let timerId = null;

// Helper: returns a Date-like object adjusted for timezone using Intl
function getZonedParts(timeZone, use24Hour) {
  // We will format components using Intl.DateTimeFormat parts to be precise and localizable
  const options = {
    hour: 'numeric',
    minute: '2-digit',
    second: '2-digit',
    hour12: !use24Hour,
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone
  };

  const dtf = new Intl.DateTimeFormat(undefined, options);
  const parts = dtf.formatToParts(new Date());
  // Convert parts array to a map for easy access
  const map = {};
  parts.forEach(p => map[p.type] = p.value);
  return map;
}

function updateClock() {
  const use24 = formatToggle.checked; // checkbox = 24-hour if checked
  const tzValue = tzSelect.value === 'local' ? undefined : tzSelect.value;

  // We ask Intl to format with specified timeZone (undefined => local)
  const parts = getZonedParts(tzValue, use24);

  // Compose time string. If hour is not present (some locales), fallback.
  let hour = parts.hour ?? '00';
  let minute = parts.minute ?? '00';
  let second = parts.second ?? '00';
  let weekday = parts.weekday ?? '';
  let month = parts.month ?? '';
  let day = parts.day ?? '';
  let year = parts.year ?? '';

  // Ensure zero-padding where necessary (Intl may already pad minute/second)
  if (minute.length === 1) minute = '0' + minute;
  if (second.length === 1) second = '0' + second;

  // Show AM/PM if using 12h format
  if (!use24) {
    const dayPeriod = parts.dayPeriod ?? ''; // "AM" / "PM" depending on locale
    ampmEl.textContent = dayPeriod;
    ampmEl.style.display = 'inline-block';
  } else {
    ampmEl.style.display = 'none';
  }

  timeEl.textContent = `${hour}:${minute}:${second}`;
  dateEl.textContent = `${weekday}, ${month} ${day}, ${year}`;
}

// Start and Stop helpers
function startClock() {
  if (timerId) return; // already running
  updateClock(); // immediate update
  timerId = setInterval(updateClock, 1000);
  startBtn.disabled = true;
  stopBtn.disabled = false;
}

function stopClock() {
  if (!timerId) return;
  clearInterval(timerId);
  timerId = null;
  startBtn.disabled = false;
  stopBtn.disabled = true;
}

// Wire up controls
formatToggle.addEventListener('change', () => updateClock());
tzSelect.addEventListener('change', () => updateClock());
startBtn.addEventListener('click', startClock);
stopBtn.addEventListener('click', stopClock);

// Initialize: start running by default
stopBtn.disabled = false;
startClock();
