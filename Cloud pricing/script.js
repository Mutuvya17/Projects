// Select all buttons
const buttons = document.querySelectorAll(".choose-plan");

buttons.forEach(button => {
  button.addEventListener("click", () => {
    alert(`You selected the ${button.textContent.replace("Choose ", "")} plan!`);
  });
});
