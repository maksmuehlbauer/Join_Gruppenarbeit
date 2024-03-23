let draggedCard = null;
let touchOffsetX = 0;
let touchOffsetY = 0;

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

let dragTimer;

function handleTouchStart(event) {
    const touchedCard = event.target.closest(".task-card");
    if (!touchedCard) return;
    dragTimer = setTimeout(() => {
        event.preventDefault();
        setupDraggedCard(touchedCard, event.touches[0]);
        document.body.style.overflow = "hidden";
    }, 200);
}

function handleTouchMove(event) {
    if (!draggedCard) return;
    if (event.cancelable) {
        event.preventDefault();
    }
    const touch = event.touches[0];
    moveAt(touch.pageX, touch.pageY, touch.clientX, touch.clientY);
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

window.addEventListener("touchmove", function (event) {
    const touch = event.touches[0];
    const threshold = 50;
    const scrollAmount = 10;

    if (touch.clientY < threshold) {
        window.scrollBy(0, -scrollAmount);
    } else if (window.innerHeight - touch.clientY < threshold) {
        window.scrollBy(0, scrollAmount);
    }
});

async function handleTouchEnd(event) {
    if (!draggedCard) return;
    const originalCard = document.getElementById(
        draggedCard.dataset.originalCard
    );
    resetOriginalCard(originalCard);
    removePlaceholderCard();
    document.body.style.overflow = "auto";
    await handleDrop(event.changedTouches[0], originalCard);
    draggedCard.remove();
    draggedCard = null;
}

function setupDraggedCard(touchedCard, touch) {
    draggedCard = touchedCard.cloneNode(true);
    Object.assign(draggedCard.style, {
        position: "fixed",
        zIndex: 0,
        opacity: 0.8,
    });
    document.body.appendChild(draggedCard);
    touchOffsetX = touch.clientX - touchedCard.getBoundingClientRect().left;
    touchOffsetY = touch.clientY - touchedCard.getBoundingClientRect().top;

    draggedCard.style.left = `${
        touchedCard.getBoundingClientRect().left + window.scrollX
    }px`;
    draggedCard.style.top = `${
        touchedCard.getBoundingClientRect().top + window.scrollY
    }px`;

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

function moveAt(pageX, pageY, clientX, clientY) {
    draggedCard.style.left = `${clientX - touchOffsetX}px`;
    draggedCard.style.top = `${clientY - touchOffsetY}px`;
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
