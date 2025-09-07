// Smooth scrolling for nav links
document.querySelectorAll('.nav-links a').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const targetId = link.getAttribute('href');
    document.querySelector(targetId).scrollIntoView({ 
      behavior: 'smooth' 
    });
  });
});

// Pricing button alerts
const buttons = document.querySelectorAll(".choose-plan");
buttons.forEach(button => {
  button.addEventListener("click", () => {
    alert(`You selected the ${button.textContent.replace("Select ", "")} plan!`);
  });
});

// Contact form handler
const form = document.getElementById('contact-form');
form.addEventListener('submit', e => {
  e.preventDefault();
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  alert(`Thanks ${name}! We'll get back to you at ${email} soon.`);
  form.reset();
});
