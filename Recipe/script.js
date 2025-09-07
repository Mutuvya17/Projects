// Interactivity: Like Button Feature
const likeBtn = document.getElementById("likeBtn");
const likeMessage = document.getElementById("likeMessage");

likeBtn.addEventListener("click", () => {
  likeMessage.classList.remove("hidden");
  likeBtn.disabled = true; // Prevent multiple likes
  likeBtn.textContent = "✔️ Liked";
});
