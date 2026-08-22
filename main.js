const taskInput = document.querySelector('.js-text-box');
const dateInput = document.querySelector('.js-date-box');
const addButton = document.querySelector('.js-add-button');
const taskList = document.querySelector('.js-task-list');

let tasks = [];

const savedTasks = JSON.parse(localStorage.getItem("tasks"));

if (savedTasks) {
  tasks = savedTasks;
}

addButton.addEventListener('click', () => {
  const task = taskInput.value.trim();
  const date = dateInput.value;

  if (task === "") {
    return;
  }

  if (date === "") {
    return;
  }

  if (task && date) {
    tasks.push({
      id: Date.now(),
      text: task,
      date: date,
      completed: false
    });

    saveTasks();

    taskInput.value = "";
    dateInput.value = "";

    taskInput.focus();

    displayTasks();
  }
});

function displayTasks() {
  let taskHtml = "";

  if (tasks.length === 0) {
    taskList.innerHTML = `
      <p class="empty-message">
        No tasks yet - add something to do!
      </p>
    `;
    return;
  }

  tasks.forEach((task) => {
    taskHtml += `
      <div class="task-item">

        <input 
          class="task-checkbox"
          type="checkbox"
          data-id="${task.id}"
          ${task.completed ? "checked" : ""}
        >

        <span class="task-text ${task.completed ? "completed" : ""}">
          ${task.text}
        </span>

        <span class="task-date">
        ${formatDate(task.date)}</span>

        <button 
          class="delete-button" 
          data-id="${task.id}"
        >
          Delete
        </button>

      </div>
    `;
  });

  taskList.innerHTML = taskHtml;

  const deleteButtons = document.querySelectorAll('.delete-button');

  deleteButtons.forEach((button) => {
    button.addEventListener('click', () => {

      const taskId = Number(button.dataset.id);

      tasks = tasks.filter((task) => {
        return task.id !== taskId;
      });

      saveTasks();
      displayTasks();
    });
  });

  const checkboxes = document.querySelectorAll(".task-checkbox");

  checkboxes.forEach((checkbox) => {
    checkbox.addEventListener('change', () => {

      const taskId = Number(checkbox.dataset.id);

      const selectedTask = tasks.find((task) => {
        return task.id === taskId;
      });

      selectedTask.completed = checkbox.checked;

      saveTasks();
      displayTasks();
    });
  });
}

function saveTasks() {
  localStorage.setItem(
    "tasks",
    JSON.stringify(tasks)
  );
}

function formatDate(date) {
  const [year, month, day] = date.split("-");

  return `${day}/${month}/${year}`;
}

displayTasks();