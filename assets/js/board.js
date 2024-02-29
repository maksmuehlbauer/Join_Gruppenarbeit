'use strict';

const allowDrop = (ev) => {
  ev.preventDefault();
};

const drag = (ev) => {
  ev.dataTransfer.setData('text', ev.target.id);
};

const drop = (ev) => {
  ev.preventDefault();
  const data = ev.dataTransfer.getData('text');
  let dropTarget = ev.target;

  while (
    !dropTarget.classList.contains('task-cards-container') &&
    dropTarget.parentNode
  ) {
    dropTarget = dropTarget.parentNode;
  }

  if (dropTarget.classList.contains('task-cards-container')) {
    const element = document.getElementById(data);
    dropTarget.appendChild(element);
    document
      .querySelectorAll('.task-cards-container')
      .forEach(updateNoTasksMessage);
  }
};

const updateNoTasksMessage = (taskCardsContainer) => {
  const noTasksElement = taskCardsContainer.querySelector('.no-tasks');
  const hasTasks = taskCardsContainer.querySelectorAll('.task-card').length > 0;

  noTasksElement.style.display = hasTasks ? 'none' : 'flex';
};
