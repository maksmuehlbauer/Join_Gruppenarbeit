let draggedCard = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

// Drag and Drop functions
function dragStart(event) {
    draggedCard = event.target;
    event.dataTransfer.setData("text", event.target.id);
    event.target.style.transform = "rotate(5deg)";
}

function removePlaceholderCard() {
    const placeholderCard = document.querySelector(".placeholder-card");
    if (placeholderCard) {
        placeholderCard.remove();
    }
}

// Touch functions
let dragTimer;

function handleTouchStart(event) {
    const touchedCard = event.target.closest(".task-card");
    if (!touchedCard) return;

    dragTimer = setTimeout(() => {
        event.preventDefault();
        setupDraggedCard(touchedCard, event.touches[0]);
    }, 200);
}

function handleTouchEnd(event) {
    clearTimeout(dragTimer);
}

function handleTouchMove(event) {
    event.preventDefault();
    if (!draggedCard) return;
    const touch = event.touches[0];
    moveAt(touch.pageX, touch.pageY);
    const elementUnderTouch = document.elementFromPoint(
        touch.clientX,
        touch.clientY
    );
    if (elementUnderTouch) {
        updatePlaceholderCard(
            elementUnderTouch.closest(".task-cards-container")
        );
    }
}

async function handleTouchEnd(event) {
    if (!draggedCard) return;
    const originalCard = document.getElementById(
        draggedCard.dataset.originalCard
    );
    resetOriginalCard(originalCard);
    removePlaceholderCard();
    await handleDrop(event.changedTouches[0], originalCard);
    draggedCard.remove();
    draggedCard = null;
}

// Helper functions
function setupDraggedCard(touchedCard, touch) {
    draggedCard = touchedCard.cloneNode(true);
    Object.assign(draggedCard.style, {
        position: "absolute",
        zIndex: 10,
        opacity: 0.8,
    });
    document.body.appendChild(draggedCard);
    touchOffsetX = touch.clientX - touchedCard.offsetLeft;
    touchOffsetY = touch.clientY - touchedCard.offsetTop;
    moveAt(touch.pageX, touch.pageY);
    Object.assign(touchedCard.style, { transform: "rotate(5deg)", opacity: 1 });
    draggedCard.dataset.originalCard = touchedCard.id;
    draggedCard.dataset.originalContainer = touchedCard.parentNode.id;
}

function resetOriginalCard(originalCard) {
    originalCard.style.transform = "";
    originalCard.style.opacity = 1;
}

async function handleDrop(touch, originalCard) {
    let taskCardsContainer = document
        .elementFromPoint(touch.clientX, touch.clientY)
        .closest(".task-cards-container");
    if (!taskCardsContainer) {
        taskCardsContainer = getContainerFromTouch(touch);
    }
    if (
        taskCardsContainer &&
        taskCardsContainer.id !== draggedCard.dataset.originalContainer
    ) {
        taskCardsContainer.appendChild(originalCard);
        await updateTaskStatus(originalCard.id, taskCardsContainer.id);
        document
            .querySelectorAll(".task-cards-container")
            .forEach(updateNoTasksMessage);
    } else {
        const originalContainer = document.getElementById(
            draggedCard.dataset.originalContainer
        );
        if (originalContainer) {
            originalContainer.appendChild(originalCard);
        }
    }
}

function getContainerFromTouch(touch) {
    const containers = document.querySelectorAll(".task-cards-container");
    for (const container of containers) {
        const rect = container.getBoundingClientRect();
        if (
            touch.clientX >= rect.left &&
            touch.clientX <= rect.right &&
            touch.clientY >= rect.top &&
            touch.clientY <= rect.bottom
        ) {
            return container;
        }
    }
    return null;
}

async function updateTaskStatus(originalCardId, containerId) {
    const task = userObject.tasks.find(
        (t) => t.id.toString() === originalCardId
    );
    if (!task) return;
    task.status = containerId;
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
        console.error("Fehler beim Speichern des aktualisierten Tasks:", error);
    }
}

// Helper functions
function moveAt(pageX, pageY) {
    draggedCard.style.left = `${pageX - touchOffsetX}px`;
    draggedCard.style.top = `${pageY - touchOffsetY}px`;
}

function createPlaceholderCard() {
    const placeholderCard = document.createElement("div");
    placeholderCard.className = "placeholder-card";
    placeholderCard.style.width = `${draggedCard.offsetWidth}px`;
    placeholderCard.style.height = `${draggedCard.offsetHeight}px`;
    return placeholderCard;
}

function updatePlaceholderCard() {
    const containers = document.querySelectorAll(".task-cards-container");
    const targetRect = draggedCard.getBoundingClientRect();

    containers.forEach((container) => {
        const containerRect = container.getBoundingClientRect();
        const existingPlaceholderCard =
            container.querySelector(".placeholder-card");
        const isWithinContainer =
            targetRect.top + targetRect.height / 2 < containerRect.bottom &&
            targetRect.top + targetRect.height / 2 > containerRect.top;

        if (isWithinContainer && !existingPlaceholderCard) {
            const placeholderCard = createPlaceholderCard();
            container.appendChild(placeholderCard);
        } else if (!isWithinContainer && existingPlaceholderCard) {
            existingPlaceholderCard.remove();
        }
    });
}

// Drag and Drop functions
const allowDrop = (ev) => {
    ev.preventDefault();
    const taskCardsContainer = ev.target.closest(".task-cards-container");

    if (taskCardsContainer) {
        const existingPlaceholderCard =
            taskCardsContainer.querySelector(".placeholder-card");

        if (!existingPlaceholderCard) {
            const placeholderCard = createPlaceholderCard();
            const taskCard = ev.target.closest(".task-card");

            if (taskCard) {
                taskCard.parentNode.insertBefore(
                    placeholderCard,
                    taskCard.nextSibling
                );
            } else {
                taskCardsContainer.appendChild(placeholderCard);
            }
        }
    }
};

const removeDragHighlight = (ev) => {
    const taskCardsContainer = ev.target.closest(".task-cards-container");

    if (taskCardsContainer) {
        const placeholderCard =
            taskCardsContainer.querySelector(".placeholder-card");
        if (placeholderCard && !taskCardsContainer.contains(ev.relatedTarget)) {
            placeholderCard.remove();
        }
    }
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
        element.style.transform = "";

        const task = userObject.tasks.find((t) => t.id.toString() === data);
        if (task) {
            task.status = dropTarget.id;
            await updateTaskStatus(data, dropTarget.id);
        }

        document
            .querySelectorAll(".task-cards-container")
            .forEach(updateNoTasksMessage);
    }
};

// Event listeners
document.querySelectorAll(".task-cards-container").forEach((column) => {
    column.addEventListener("dragover", allowDrop);
    column.addEventListener("dragleave", removeDragHighlight);
    column.addEventListener("drop", removeDragHighlight);
});

document.querySelectorAll(".task-cards-container").forEach((card) => {
    card.addEventListener("dragend", (event) => {
        event.target.style.transform = "rotate(0deg)";
    });
});

const updateNoTasksMessage = (taskCardsContainer) => {
    const noTasksElement = taskCardsContainer.querySelector(".no-tasks");
    const hasTasks =
        taskCardsContainer.querySelectorAll(".task-card").length > 0;

    noTasksElement.style.display = hasTasks ? "none" : "flex";
};
