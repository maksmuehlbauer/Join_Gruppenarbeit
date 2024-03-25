"use strict";

/**
 * Initializes the board.
 *
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function init() {
    await includeHTML();
    await checkUserloggedIn();
    await initTasks();
    navigationHighlight("board-link");
    addEventListenersToCards();
}

/**
 * Initializes tasks by using the user object and creating task cards for each task.
 * @returns {Promise<void>} A promise that resolves when the tasks are initialized.
 */
async function initTasks() {
    await useUserObject();
    userObject.tasks.forEach((task, index) => {
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

/**
 * Uses the user object.
 * If the user object is not available, it will retry after 3 seconds.
 * @returns {Promise<void>}
 */
async function useUserObject() {
    if (!userObject) setTimeout(useUserObject, 3000);
}

/**
 * Sets default values for a task object.
 *
 * @param {Object} task - The task object to set defaults for.
 * @param {number} index - The index of the task.
 * @returns {void}
 */
function setTaskDefaults(task, index) {
    task.status = task.status || "toDo";
    task.id = index;
    task.subtaskStatus = task.subtaskStatus || [];
}

/**
 * Creates HTML for displaying assigned users' initials.
 * @param {Object} task - The task object containing assigned users' information.
 * @returns {string} - The HTML string representing the assigned users' initials.
 */
function createAssignedHTML(task) {
    let assignedHTML = "";
    const maxInitials = 5;
    const assignedCount = task.assignto.length;

    task.assignto.forEach((fullName, index) => {
        if (index < maxInitials) {
            const initials = getInitialss(fullName);
            const color = task.assigntoColor[index];
            assignedHTML += `<div class="card-contacts" style="background-color: ${color}">${initials}</div>`;
        }
    });

    if (assignedCount > maxInitials) {
        const remainingCount = assignedCount - maxInitials;
        assignedHTML += `<div class="card-contacts-more">+${remainingCount}</div>`;
    }

    return assignedHTML;
}

/**
 * Creates HTML for displaying assigned users on an open card.
 * @param {Object} task - The task object containing assigned users.
 * @returns {string} - The HTML string representing the assigned users.
 */
function createAssignedHTMLforOpenCard(task) {
    return task.assignto
        .map((fullName, index) => {
            const initials = getInitialss(fullName);
            const color = task.assigntoColor[index];
            return `<div class="card-contacts-wrapper"><div class="card-contacts" style="background-color: ${color}">${initials}</div><div>${fullName}</div></div>`;
        })
        .join("");
}

/**
 * Creates HTML markup for displaying subtasks of an open card.
 * @param {Object} task - The task object containing subtasks and their statuses.
 * @returns {string} - The HTML markup for displaying subtasks.
 */
function createSubtasksHTMLforOpenCard(task) {
    return task.subtask
        .map((subtask, index) => {
            const isChecked =
                task.subtaskStatus[index] === true ? "checked" : "unchecked";
            return `<div id="checkbox-container"><label for="checkbox${index}" class="checkbox-label"><img src="./assets/img/${isChecked}.png" id="checkbox-img${index}"><input type="checkbox" id="checkbox${index}" class="checkbox" onclick="toggleSubtaskStatus(${index}, ${task.id})"></label>${subtask}</div>`;
        })
        .join("");
}

/**
 * Returns the initials of a full name.
 *
 * @param {string} fullName - The full name.
 * @returns {string} The initials of the full name.
 */
function getInitialss(fullName) {
    return fullName
        ?.split(" ")
        .filter(Boolean)
        .map((n) => n[0].toUpperCase())
        .join("");
}

/**
 * Adds event listeners to the task cards.
 */
function addEventListenersToCards() {
    document.querySelectorAll(".task-card").forEach((card) => {
        card.addEventListener("dragstart", dragStart);
        card.addEventListener("touchstart", handleTouchStart, false);
        card.addEventListener("touchmove", handleTouchMove, false);
        card.addEventListener("touchend", handleTouchEnd, false);
    });
}

/**
 * Creates a task card element.
 *
 * @param {Object} task - The task object.
 * @param {string} assignedHTML - The HTML content for assigned users.
 * @param {string} assignedHTMLforOpenCard - The HTML content for assigned users in the open card view.
 * @param {string} subtasksHTMLforOpenCard - The HTML content for subtasks in the open card view.
 * @returns {HTMLElement} The created task card element.
 */
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
    card.setAttribute("ondragstart", "dragStart(event)");
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

/**
 * Generates the HTML markup for a card based on the provided task object.
 *
 * @param {Object} task - The task object containing information about the card.
 * @param {string} assignedHTML - The HTML markup for the assigned users.
 * @param {number} trueCount - The number of completed subtasks.
 * @param {number} completedPercentage - The percentage of completed subtasks.
 * @returns {string} The HTML markup for the card.
 */
function getCardHTML(task, assignedHTML, trueCount, completedPercentage) {
    return `
        <div class="card-category-wrapper">
            <div class="card-category" style="${
                task.category === "Technical Task"
                    ? "background-color: #1FD7C1;"
                    : ""
            }">${task.category}</div>
            <img src="./assets/img/drag.png" alt="drag icon" class="drag-icon" />
        </div>
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

/**
 * Appends a card to the parent element based on the task status.
 *
 * @param {Object} task - The task object.
 * @param {HTMLElement} card - The card element to be appended.
 */
function appendCardToParent(task, card) {
    const parentDiv = document.getElementById(task.status);
    parentDiv.appendChild(card);
    document
        .querySelectorAll(".task-cards-container")
        .forEach(updateNoTasksMessage);
}

/**
 * Opens a task and displays its details in an overlay.
 * @param {string} id - The ID of the task to be opened.
 * @param {string} assignedHTML - The HTML content for the assigned users.
 * @param {string} subtasksHTMLforOpenCard - The HTML content for the subtasks.
 */
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
    sendTaskToEdit(task);
    const taskCardOpenHTML = `
    <div class="task-card-open">
      <div class="card-category-wrapper">
        <div class="card-category" style="${
            task.category === "Technical Task"
                ? "background-color: #1FD7C1;"
                : ""
        }">${task.category}</div>
        <div class="card-close" onclick="closeTask()">
        <img src="./assets/img/close_black.png" alt="close icon"/>
        </div>
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

/**
 * Opens the edit menu for a task.
 */
function openEditMenu() {
    document.querySelector(".overlay-task-edit").classList.remove("d-none");
    document.querySelector(".overlay-task").classList.add("d-none");
}

/**
 * Closes the edit menu and shows the task overlay.
 */
function closeEditMenu() {
    document.querySelector(".overlay-task-edit").classList.add("d-none");
    document.querySelector(".overlay-task").classList.remove("d-none");
}

/**
 * Clears the task containers by setting their innerHTML to a message indicating no tasks to do.
 */
function clearTaskContainer() {
    const containers = document.querySelectorAll(".task-cards-container");
    containers.forEach((container) => {
        container.innerHTML = `<div class="no-tasks" style="display: flex;">No tasks To do</div>`;
    });
}

/**
 * Hides all task cards on the board.
 * @returns {Promise} A promise that resolves after a timeout of 0 milliseconds.
 */
function hideTaskCards() {
    const taskCards = document.getElementsByClassName("task-card");
    Array.from(taskCards).forEach((card) => {
        card.classList.add("hidden");
    });
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, 0);
    });
}

/**
 * Shows all task cards by removing the "hidden" class from each card.
 */
function showTaskCards() {
    const taskCards = document.getElementsByClassName("task-card");
    Array.from(taskCards).forEach((card) => {
        card.classList.remove("hidden");
    });
}

/**
 * Reloads the tasks on the board.
 * Clears the task container, hides task cards, initializes tasks,
 * searches for tasks, shows task cards, and adds touch event listeners to task cards.
 * @returns {Promise<void>} A promise that resolves when the tasks are reloaded.
 */
async function reloadTasks() {
    clearTaskContainer();
    await hideTaskCards();
    await initTasks();
    searchTask();
    showTaskCards();
    const taskCards = document.getElementsByClassName("task-card");
    Array.from(taskCards).forEach((card) => {
        card.addEventListener("touchstart", handleTouchStart);
        card.addEventListener("touchend", handleTouchEnd);
        card.addEventListener("touchmove", handleTouchMove);
    });
}

/**
 * Closes the task and performs necessary cleanup actions.
 */
function closeTask() {
    const overlayTask = document.querySelector(".overlay-task");
    const taskCardOpen = document.querySelector(".task-card-open");
    taskCardOpen.style.animation = "slideOutToRight 0.1s ease-in-out forwards";
    taskCardOpen.addEventListener("animationend", () => {
        overlayTask.style.display = "none";
        taskCardOpen.style.animation = "";
    });
    const taskCards = document.getElementsByClassName("task-card");
    Array.from(taskCards).forEach((card) => {
        card.removeEventListener("touchstart", handleTouchStart);
        card.removeEventListener("touchend", handleTouchEnd);
        card.removeEventListener("touchmove", handleTouchMove);
    });
    if (draggedCard) {
        draggedCard.remove();
        draggedCard = null;
    }
    reloadTasks();
}

const overlayTask = document.querySelector(".overlay-task");
overlayTask.addEventListener("click", (event) => {
    /**
     * Represents the task card open element.
     * @type {HTMLElement}
     */
    const taskCardOpen = document.querySelector(".task-card-open");
    if (!taskCardOpen.contains(event.target)) {
        closeTask();
    }
});

/**
 * Deletes a task from the user's task list.
 * @param {number} id - The ID of the task to be deleted.
 * @returns {Promise<void>} - A promise that resolves when the task is deleted.
 */
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

/**
 * Toggles the status of a subtask for a given task.
 *
 * @param {number} subtaskIndex - The index of the subtask to toggle.
 * @param {number} taskId - The ID of the task containing the subtask.
 * @returns {Promise<void>} - A promise that resolves when the subtask status is successfully updated.
 */
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
/**
 * Searches for tasks based on the input value and filters the task cards and columns accordingly.
 */
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

/**
 * Redirects the user to the "addtask.html" page.
 */
function goToAddTask() {
    window.location.href = "addtask.html";
}
