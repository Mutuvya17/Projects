// Form validation
const form = document.getElementById("surveyForm");
const successMessage = document.getElementById("successMessage");

form.addEventListener("submit", (e) => {
  e.preventDefault(); // Prevent default submit for validation

  // Check at least one checkbox selected
  const interests = document.querySelectorAll("input[name='interest']:checked");
  if (interests.length === 0) {
    alert("Please select at least one interest.");
    return;
  }

  // Check if age is reasonable
  const age = document.getElementById("age").value;
  if (age < 10 || age > 100) {
    alert("Please enter an age between 10 and 100.");
    return;
  }

  // If all good, show success message
  successMessage.classList.remove("hidden");
  form.reset();
});
