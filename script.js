// Simple interactivity for fun: Scroll alert
document.addEventListener("scroll", () => {
  const scrollPos = window.scrollY;
  if (scrollPos > 200) {
    console.log("You’ve scrolled down the page. Keep reading, Eric!");
  }
});

// Contact button idea for future interactivity
console.log("Blog loaded successfully. Welcome, Eric!");
