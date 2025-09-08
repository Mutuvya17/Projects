// Select elements
const startBtn = document.getElementById("start-btn");
const targetDateInput = document.getElementById("target-date");
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");
const messageEl = document.getElementById("message");

let countdownInterval;

startBtn.addEventListener("click", () => {
  // Clear any existing countdowns
  clearInterval(countdownInterval);

  const targetDate = new Date(targetDateInput.value).getTime();
  if (isNaN(targetDate)) {
    alert("⚠️ Please select a valid date and time!");
    return;
  }

  countdownInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance <= 0) {
      clearInterval(countdownInterval);
      daysEl.textContent = 0;
      hoursEl.textContent = 0;
      minutesEl.textContent = 0;
      secondsEl.textContent = 0;
      messageEl.textContent = "🎉 Time's up!";
      return;
    }

    // Time calculations
    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor(
      (distance % (1000 * 60 * 60)) / (1000 * 60)
    );
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    // Update UI
    daysEl.textContent = days;
    hoursEl.textContent = hours;
    minutesEl.textContent = minutes;
    secondsEl.textContent = seconds;
    messageEl.textContent = "";
  }, 1000);
});
