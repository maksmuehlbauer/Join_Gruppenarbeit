"use strict";

async function init() {
  await includeHTML();
  await checkUserloggedIn();
  await initTasks();
  navigationHighlight("board-link");
}

async function useUserObject() {
  if (userObject !== null) {
  } else {
    setTimeout(useUserObject, 3000);
  }
}

const allowDrop = (ev) => {
  ev.preventDefault();
};

const drag = (ev) => {
  ev.dataTransfer.setData("text", ev.target.id);
};

const drop = async (ev) => {
  ev.preventDefault();
  const data = ev.dataTransfer.getData("text");
  let dropTarget = ev.target;

  while (
    !dropTarget.classList.contains("task-cards-container") &&
    dropTarget.parentNode
  ) {
    dropTarget = dropTarget.parentNode;
  }

  if (dropTarget.classList.contains("task-cards-container")) {
    const element = document.getElementById(data);
    dropTarget.appendChild(element);

    const task = userObject.tasks.find((t) => t.id.toString() === data);
    if (task) {
      task.status = dropTarget.id;
      try {
        const userDataBase = JSON.parse(await getItem("userDataBase"));
        const userIndex = userDataBase.findIndex(
          (user) => user.id.toString() === userObject.id.toString()
        );
        if (userIndex !== -1) {
          userDataBase[userIndex] = userObject;
        }

        await setItem("userDataBase", userDataBase);
        console.log("Task erfolgreich aktualisiert und gespeichert.");
      } catch (error) {
        console.error("Fehler beim Speichern des aktualisierten Tasks:", error);
      }
    }

    document
      .querySelectorAll(".task-cards-container")
      .forEach(updateNoTasksMessage);
  }
};

const updateNoTasksMessage = (taskCardsContainer) => {
  const noTasksElement = taskCardsContainer.querySelector(".no-tasks");
  const hasTasks = taskCardsContainer.querySelectorAll(".task-card").length > 0;

  noTasksElement.style.display = hasTasks ? "none" : "flex";
};

async function initTasks() {
  await useUserObject();
  const tasks = userObject.tasks;

  tasks.forEach((task, index) => {
    if (!task.status) {
      task.status = "toDo";
      task.id = index;
    }
    const parentDiv = document.getElementById(task.status);
    const card = document.createElement("div");
    card.className = "task-card";
    card.id = task.id;
    card.setAttribute("draggable", true);
    card.setAttribute("ondragstart", "drag(event)");

    const colorPalette = ["#ff7a00", "#1fd7c1", "#462f8a"];
    let assignedHTML = "";
    task.assignto.forEach((fullName, index) => {
      const initials = fullName
        .split(" ")
        .filter((n) => n)
        .map((n) => n[0].toUpperCase())
        .join("");
      const color = colorPalette[index % colorPalette.length];
      assignedHTML += `<div class="card-contacts" style="background-color: ${color}">${initials}</div>`;
    });

    card.innerHTML = `
    <div class="card-category" style="${
      task.category === "Technical Task" ? "background-color: #1FD7C1;" : ""
    }">${task.category}</div>
    <div class="card-titel">${task.title}</div>
    <div class="card-description">${task.descripton}</div>
    <div class="card-progress">
      <div class="card-progressbar-container">
        <div class="card-progressbar"></div>
      </div>
      <div class="card-subtasks">${task.subtask.length} Subtasks</div>
    </div>
    <div class="card-footer">
      <div class="card-assigned">
      ${assignedHTML}
      </div>
      <div class="card-priority">
        <img src="./assets/img/${task.prio}.png" alt="priority icon" />
      </div>
    </div>
  `;

    parentDiv.appendChild(card);
    document
      .querySelectorAll(".task-cards-container")
      .forEach(updateNoTasksMessage);
  });
}
