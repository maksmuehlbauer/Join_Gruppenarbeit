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
            } catch (error) {
                console.error(
                    "Fehler beim Speichern des aktualisierten Tasks:",
                    error
                );
            }
        }

        document
            .querySelectorAll(".task-cards-container")
            .forEach(updateNoTasksMessage);
    }
};

const updateNoTasksMessage = (taskCardsContainer) => {
    const noTasksElement = taskCardsContainer.querySelector(".no-tasks");
    const hasTasks =
        taskCardsContainer.querySelectorAll(".task-card").length > 0;

    noTasksElement.style.display = hasTasks ? "none" : "flex";
};

async function initTasks() {
    await useUserObject();
    const tasks = userObject.tasks;

    tasks.forEach((task, index) => {
        setTaskDefaults(task, index);
        const assignedHTML = createAssignedHTML(task);
        const assignedHTMLforOpenCard = createAssignedHTMLforOpenCard(task);
        const subtasksHTMLforOpenCard = createSubtasksHTMLforOpenCard(task);
        const card = createTaskCard(
            task,
            assignedHTML,
            assignedHTMLforOpenCard,
            subtasksHTMLforOpenCard
        );
        appendCardToParent(task, card);
    });
}

function setTaskDefaults(task, index) {
    task.status = task.status || "toDo";
    task.id = index;
    task.subtaskStatus = task.subtaskStatus || [];
}

function createAssignedHTML(task) {
    let assignedHTML = "";
    task.assignto.forEach((fullName, index) => {
        const initials = getInitialss(fullName);
        const color = task.assigntoColor[index];
        assignedHTML += `<div class="card-contacts" style="background-color: ${color}">${initials}</div>`;
    });
    return assignedHTML;
}

function createAssignedHTMLforOpenCard(task) {
    let assignedHTMLforOpenCard = "";
    task.assignto.forEach((fullName, index) => {
        const initials = getInitialss(fullName);
        const color = task.assigntoColor[index];
        assignedHTMLforOpenCard += `<div class="card-contacts-wrapper"><div class="card-contacts" style="background-color: ${color}">${initials}</div><div>${fullName}</div></div>`;
    });
    return assignedHTMLforOpenCard;
}

function createSubtasksHTMLforOpenCard(task) {
    let subtasksHTMLforOpenCard = "";
    task.subtask.forEach((subtask, index) => {
        const isChecked =
            task.subtaskStatus[index] === true ? "checked" : "unchecked";
        subtasksHTMLforOpenCard += `<div id="checkbox-container"><label for="checkbox${index}" class="checkbox-label"><img src="./assets/img/${isChecked}.png" id="checkbox-img${index}"><input type="checkbox" id="checkbox${index}" class="checkbox" onclick="toggleSubtaskStatus(${index}, ${task.id})"></label>${subtask}</div>`;
    });
    return subtasksHTMLforOpenCard;
}

function getInitialss(fullName) {
    if (fullName) {
        return fullName
            .split(" ")
            .filter((n) => n)
            .map((n) => n[0].toUpperCase())
            .join("");
    }
}

function createTaskCard(
    task,
    assignedHTML,
    assignedHTMLforOpenCard,
    subtasksHTMLforOpenCard
) {
    const card = document.createElement("div");
    card.className = "task-card";
    card.id = task.id;
    card.setAttribute("draggable", true);
    card.setAttribute("ondragstart", "drag(event)");
    card.setAttribute(
        "onclick",
        `openTask(this.id, '${assignedHTMLforOpenCard}', '${subtasksHTMLforOpenCard}')`
    );
    const trueCount = task.subtaskStatus.filter(
        (status) => status === true
    ).length;
    const completedPercentage = (trueCount / task.subtask.length) * 100;
    card.innerHTML = getCardHTML(
        task,
        assignedHTML,
        trueCount,
        completedPercentage
    );
    return card;
}

function getCardHTML(task, assignedHTML, trueCount, completedPercentage) {
    return `
        <div class="card-category" style="${
            task.category === "Technical Task"
                ? "background-color: #1FD7C1;"
                : ""
        }">${task.category}</div>
        <div class="card-titel">${task.title}</div>
        <div class="card-description">${task.description}</div>
        <div class="card-progress" style="display: ${
            task.subtask.length < 1 ? "none" : ""
        };">
            <div class="card-progressbar-container">
                <div class="card-progressbar" style="width: ${completedPercentage}%;"></div>
            </div>
            <div class="card-subtasks"> ${trueCount} / ${
        task.subtask.length
    } Subtasks</div>
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
}

function appendCardToParent(task, card) {
    const parentDiv = document.getElementById(task.status);
    parentDiv.appendChild(card);
    document
        .querySelectorAll(".task-cards-container")
        .forEach(updateNoTasksMessage);
}

function openTask(id, assignedHTML, subtasksHTMLforOpenCard) {
    const overlayTask = document.querySelector(".overlay-task");
    const task = userObject.tasks[id];
    const dateString = task.dueDate;
    const date = new Date(dateString);
    const usDate = date.toLocaleDateString("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    });
    sendTaskToEdit(task, id)
    const taskCardOpenHTML = `
    <div class="task-card-open">
      <div class="card-category-wrapper">
        <div class="card-category" style="${
            task.category === "Technical Task"
                ? "background-color: #1FD7C1;"
                : ""
        }">${task.category}</div>
        <img src="./assets/img/close_black.png" alt="close icon" class="card-close" onclick="closeTask()" />
      </div>
      <div class="card-titel">${task.title}</div>
      <div class="card-description">${task.description}</div>
      <div class="card-due-date"><span class="txt-gray">Due date:</span> ${usDate}</div>
      <div class="card-priority">
        <span class="txt-gray">Priority:</span> ${task.prio}
        <img src="./assets/img/${task.prio}.png" alt="priority icon" />
      </div>
      <div class="card-assigned" style="display: ${
          task.assignto.length === 0 ? "none" : ""
      };">
        <div class="txt-gray">Assigned To:</div>
        <div class="card-assigned">${assignedHTML}</div>
      </div>
      <div class="card-subtasks" style="display: ${
          task.subtask.length === 0 ? "none" : ""
      };">
        <div class="txt-gray">Subtasks</div>${subtasksHTMLforOpenCard}
      </div>
      <div class="card-edit">
        <div onclick="deleteTask(${id})">
          <img src="./assets/img/delete.png" alt="delete icon" /><span>Delete</span>
        </div>
        <div class="card-line"></div>
        <div onclick="openEditMenu()">
          <img src="./assets/img/edit-task.png" alt="edit icon" /><span>Edit</span>
        </div>
      </div>
    </div>`;

    overlayTask.innerHTML = taskCardOpenHTML;
    overlayTask.style.display = "flex";
}

function openEditMenu(){
document.querySelector('.overlay-task-edit').classList.remove('d-none');
document.querySelector('.overlay-task').classList.add('d-none');
}

function closeTask() {
    const overlayTask = document.querySelector(".overlay-task");
    const taskCardOpen = document.querySelector(".task-card-open");
    taskCardOpen.style.animation = "slideOutToRight 0.1s ease-in-out forwards";
    taskCardOpen.addEventListener("animationend", () => {
        overlayTask.style.display = "none";
        taskCardOpen.style.animation = "";
    });
    location.reload();
}

const overlayTask = document.querySelector(".overlay-task");
overlayTask.addEventListener("click", (event) => {
    const taskCardOpen = document.querySelector(".task-card-open");
    if (!taskCardOpen.contains(event.target)) {
        closeTask();
    }
});

async function deleteTask(id) {
    try {
        const userDataBase = JSON.parse(await getItem("userDataBase"));
        const userIndex = userDataBase.findIndex(
            (user) => user.id.toString() === userObject.id.toString()
        );
        if (userIndex !== -1) {
            userObject.tasks = userObject.tasks.filter(
                (task, index) => index !== id
            );
            userDataBase[userIndex] = userObject;
        }

        await setItem("userDataBase", userDataBase);
    } catch (error) {
        console.error("Error while deleting the task:", error);
    }
    location.reload();
}

async function toggleSubtaskStatus(subtaskIndex, taskId) {
    let checkboxImg = document.getElementById(`checkbox-img${subtaskIndex}`);
    try {
        const userDataBase = JSON.parse(await getItem("userDataBase"));
        const userIndex = userDataBase.findIndex(
            (user) => user.id.toString() === userObject.id.toString()
        );
        if (userIndex !== -1) {
            const task = userObject.tasks[taskId];
            const isSubtaskChecked = task.subtaskStatus[subtaskIndex];
            task.subtaskStatus[subtaskIndex] = !isSubtaskChecked;
            checkboxImg.src = isSubtaskChecked
                ? "./assets/img/unchecked.png"
                : "./assets/img/checked.png";
            userDataBase[userIndex] = userObject;
        }

        await setItem("userDataBase", userDataBase);
        console.log("Subtask status successfully updated");
    } catch (error) {
        console.error("Error updating subtask status:", error);
    }
}

function searchTask() {
    const input = document.getElementById("searchbar");
    const filter = input.value.toUpperCase();
    const taskCards = Array.from(document.getElementsByClassName("task-card"));
    const columns = Array.from(document.getElementsByClassName("column"));

    taskCards.forEach((taskCard) => {
        const title = taskCard.getElementsByClassName("card-titel")[0];
        const description =
            taskCard.getElementsByClassName("card-description")[0];
        let titleText = title ? title.innerText : "";
        let descriptionText = description ? description.innerText : "";

        taskCard.style.display =
            titleText.toUpperCase().includes(filter) ||
            descriptionText.toUpperCase().includes(filter)
                ? ""
                : "none";
    });

    columns.forEach((column) => {
        const columnCards = Array.from(
            column.getElementsByClassName("task-card")
        );
        const noTasks = column.getElementsByClassName("no-tasks")[0];
        const allCardsHidden = columnCards.every(
            (card) => card.style.display === "none"
        );

        if (noTasks) {
            noTasks.style.display = allCardsHidden ? "flex" : "none";
        }
    });
}

function goToAddTask() {
    window.location.href = "addtask.html";
}
