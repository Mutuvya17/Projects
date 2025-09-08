/* ============================
   To-Do List App Logic
   Features:
   - Add tasks
   - Mark tasks complete
   - Delete tasks
   - Clear all
   - Persist with localStorage
   ============================ */

const taskForm = document.getElementById("task-form");
const taskInput = document.getElementById("task-input");
const taskList = document.getElementById("task-list");
const clearBtn = document.getElementById("clear-btn");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

/* -------- Render tasks -------- */
function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = "task-item";

    const span = document.createElement("span");
    span.textContent = task.text;
    span.className = "task-text";
    if (task.completed) span.classList.add("completed");

    // Toggle complete
    span.addEventListener("click", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    // Delete button
    const delBtn = document.createElement("button");
    delBtn.textContent = "Delete";
    delBtn.className = "delete-btn";
    delBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    li.appendChild(span);
    li.appendChild(delBtn);
    taskList.appendChild(li);
  });
}

/* -------- Save to localStorage -------- */
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

/* -------- Add task -------- */
taskForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({ text, completed: false });
  saveTasks();
  renderTasks();
  taskForm.reset();
});

/* -------- Clear all tasks -------- */
clearBtn.addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
});

/* -------- Initialize -------- */
renderTasks();
