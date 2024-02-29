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

  while (!dropTarget.classList.contains('column') && dropTarget.parentNode) {
    dropTarget = dropTarget.parentNode;
  }

  if (dropTarget.classList.contains('column')) {
    const element = document.getElementById(data);
    dropTarget.appendChild(element);

    document.querySelectorAll('.column').forEach(updateNoTasksMessage);
  }
};

const updateNoTasksMessage = (column) => {
  const noTasksElement = column.querySelector('.no-tasks');
  const hasTasks = column.querySelectorAll('.task-card').length > 0;

  noTasksElement.style.display = hasTasks ? 'none' : 'flex';
};
