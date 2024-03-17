let assignedContacts = [];
let assignedContactsID = [];
let assignedContactColor = [];
let prioButtonsColor;
let prioButtonsColorFont;
let categoryMenuOpen = false;
let category = '';
let assignedToMenuOpen = false;
let priority = '';
let initialCircles = [];
let subtasksArray = [];
let contacts;
let taskEditNr = 0;

async function initAddTaskPage() {
    checkUserloggedIn();
    loadContacts();
    await includeHTML();
    navigationHighlight('addtask-link');
    subtaskEvents();
}

async function loadContacts() {
    try {
        const result = await getItem("userDataBase");
        userDataBase = JSON.parse(result);
        contacts = userDataBase[userObject.id].contacts;
        renderAddTaskPage();
    } catch (e) {
        console.error("Loading error:", e);
        contacts = [];
    }
}

async function sendTaskToEdit(task) {
    taskEditNr = task.id;
    await initAddTaskPage();
    await editTaskpage(task);
    console.log(task)
}

function editTaskpage(task) {
    document.getElementById('title').value = task.title;
    document.getElementById('dueDate').value = task.dueDate;
    document.getElementById('description').value = task.description;
    document.getElementById('category-selected').innerText = task.category;
    category = task.category;
    assignedContacts = task.assignto;
    assignedContactsID = task.assigntoID;
    assignedContactColor = task.assigntoColor;
    initialCircles = task.initialCircles;
    subtasksArray = task.subtasksArray;
    setPriority(task.prio);
    refreshSubtasks();
    changeButtonText();
}




function generateInitials(contactNr) {
    let fullname = contacts[contactNr].name;
    return splitAndUpperCaseInitials(fullname);
}

function splitAndUpperCaseInitials(fullname) {
    let name = fullname.split(' ');
    let initials = "";
    for (let i = 0; i < name.length; i++) {
        name[i] = name[i].charAt(0).toUpperCase();
        initials += name[i];
    }
    return initials;
}

function setPriority(pressedButton) {
    prioButtonsColor = document.querySelectorAll('.prio-container button');
    prioButtonsColorFont = document.querySelectorAll('.prio-container button div');

    resetButton();
    if (pressedButton == 'high') {
        if (priority == 'high') {
            resetButton();
            priority = '';
        }
        else {
            priority = 'high';
            document.getElementById('highPrioButton').classList.add('prioHigh')
            document.getElementById('highPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
        }
    }
    else if (pressedButton == 'medium') {
        if (priority == 'medium') {
            resetButton();
            priority = '';
        }
        else {
            priority = 'medium';
            document.getElementById('mediumPrioButton').classList.add('prioMedium')
            document.getElementById('mediumPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
        }

    }
    else if (pressedButton == 'low') {
        if (priority == 'low') {
            resetButton();
            priority = '';
        }
        else {
            priority = 'low';
            document.getElementById('lowPrioButton').classList.add('prioLow')
            document.getElementById('lowPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
        }

    }
}

function resetButton() {
    for (let i = 0; i < 3; i++) {
        prioButtonsColor[i].setAttribute('class', '');
        prioButtonsColorFont[i].setAttribute('class', '');
    }
}


function openAssignContainer() {

    if (assignedToMenuOpen == false) {
        document.getElementById('contacts-to-assign-container').classList.remove('d-none');
        document.getElementById('assigned-to-btn').classList.add('blue-border');
        assignedToMenuOpen = true;

    }
    else {
        document.getElementById('contacts-to-assign-container').classList.add('d-none');
        document.getElementById('assigned-to-btn').classList.remove('blue-border');
        assignedToMenuOpen = false;
    }
}

function openCategoryContainer() {
    if (categoryMenuOpen == false) {
        document.getElementById('category-dropdown-menu').classList.remove('d-none');
        document.getElementById('category-btn').classList.add('blue-border');
        categoryMenuOpen = true;
    }
    else {
        document.getElementById('category-dropdown-menu').classList.add('d-none');
        document.getElementById('category-btn').classList.remove('blue-border');
        categoryMenuOpen = false;
    }
}

function selectCategory(categorySelected) {
    document.getElementById('category-dropdown-menu').classList.add('d-none');
    document.getElementById('category-btn').classList.remove('blue-border');
    categoryMenuOpen = false;
    category = categorySelected;
    document.getElementById('category-selected').innerText = categorySelected;
    document.getElementById('category-selected').classList.add('font-black');
}

document.addEventListener('click', function (event) {
    if (event.target.id !== 'category-selected' && event.target.id !== 'category-btn') {
        document.getElementById('category-dropdown-menu').classList.add('d-none');
        document.getElementById('category-btn').classList.remove('blue-border');
        categoryMenuOpen = false;
    }
});

document.addEventListener('click', function (event) {
    if (event.target.id !== 'assigned-to-btn' && event.target.id !== 'buttontext' && event.target.parentNode.className !== 'listItem' && event.target.className !== 'nameFrame' &&
        event.target.className !== 'contactAssignCheck' && event.target.className !== 'contact-circle') {
        document.getElementById('contacts-to-assign-container').classList.add('d-none');
        document.getElementById('assigned-to-btn').classList.remove('blue-border');
        assignedToMenuOpen = false;
    }
});

function renderAddTaskPage() {
    let assignedToList = document.getElementById('contacts-to-assign-list');
    assignedToList.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let firstAndLastLetter = generateInitials(i);
        let backgroundColor = contacts[i].bgrColor;
        assignedToList.innerHTML +=
            `<div class="listItem">
                <li class="clickable" id="contactID${i}" onclick="assignContact('${contacts[i].name}', 'contactID${i}', 'checkButtonID${i}', '${backgroundColor}')">
                    <div class="nameFrame">
                        <div class="contact-circle" style="background-color: ${backgroundColor}">
                            ${firstAndLastLetter}
                        </div>${contacts[i].name}
                    </div>
                    <img class="contactAssignCheck" id="checkButtonID${i}" src="./assets/img/check_button.png"> 
                </li>
            </div>`
        if (assignedContacts.includes(contacts[i].name)) {
            document.getElementById('contactID' + i).classList.add('checked');
            document.getElementById('checkButtonID' + i).src = './assets/img/check_button_checked.png';
        }
    };
}



function assignContact(contactName, contactID, checkButtonID, color) {
    highlightSelectedContact(contactName, contactID, checkButtonID, color);
    changeButtonText(contactID);

}

function highlightSelectedContact(contactName, contactID, checkButtonID, color) {
    let index = assignedContacts.indexOf(contactName);
    if (index === -1) {
        assignedContacts.push(contactName);
        assignedContactsID.push(contactID);
        assignedContactColor.push(color);
        document.getElementById(contactID).classList.add('checked');
        document.getElementById(checkButtonID).src = './assets/img/check_button_checked.png';
    }
    else {
        removeContactInArray(index, contactID);
        document.getElementById(checkButtonID).src = './assets/img/check_button.png';

    }
}

function changeButtonText() {
    addCirclesToContainer();
    let buttonText = document.getElementById('buttontext');
    if (assignedContacts.length == 0) {
        buttonText.innerHTML = `Select contacts to assign`;
    }
    else {
        buttonText.innerHTML = `An:`;
    }
}

function addCirclesToContainer() {
    initialCircles = assignedContacts.map((element) => {
        return splitAndUpperCaseInitials(element);
    })
    let circle = document.getElementById("contact-circles-container");
    circle.innerHTML = '';

    for (let i = 0; i < initialCircles.length; i++) {
        circle.innerHTML += `<div class="contact-circle" style="background-color: ${assignedContactColor[i]}">${initialCircles[i]}</div>`
    }
}

function removeContactInList(event, name, id) {
    event.stopPropagation();
    let index = assignedContacts.indexOf(name);
    removeContactInArray(index, id);
    changeButtonText(id);
}

function removeContactInArray(index, id) {
    assignedContacts.splice(index, 1);
    assignedContactsID.splice(index, 1);
    assignedContactColor.splice(index, 1);
    document.getElementById(id).classList.remove('checked');
    document.querySelector(`#${id} img`).src = './assets/img/check_button.png';
}


function addSubtasks() {
    let subtask = document.getElementById('subtasks');
    if (subtask.value == '') {
        return;
    }
    subtasksArray.push(subtask.value);
    subtask.value = '';
    refreshSubtasks();
}

function refreshSubtasks() {
    let subtaskList = document.getElementById('subtasks-list');
    subtaskList.innerHTML = '';
    for (let i = 0; i < subtasksArray.length; i++) {
        subtaskList.innerHTML += `<div id="subtaskID${i}" class="input-button-container">
                                            <span id="subtaskID${i}">${subtasksArray[i]}
                                            </span>
                                    <div class="subtask-button-container">
                                            <button onclick="editSubtask(${i}, 'subtaskID${i}')"><img src="assets/img/edit-task.png"></button>
                                            <div id="separator" class="separator"></div>
                                            <button onclick="deleteSubtask(${i})"><img src="assets/img/delete.png"></button>
                                    </div>
                                  </div>`
    }
}

function deleteSubtask(position) {
    subtasksArray.splice(position, 1);
    refreshSubtasks();
}

function editSubtask(position, ID) {
    refreshSubtasks();
    document.getElementById(ID).innerHTML = `<div class="input-button-container">
                                                <input id="subtaskChangeInput" type="text"></input>
                                                <button onclick="changeSubtask(${position})">
                                                <img src="assets/img/tick.png">
                                                </button>
                                            </div>`
    document.getElementById('subtaskChangeInput').value = subtasksArray[position];
    document.getElementById(ID).style.backgroundColor = "white";
    document.getElementById('subtaskChangeInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            changeSubtask(position);
        }
    })
}

function changeSubtask(position) {
    let changedText = document.getElementById('subtaskChangeInput');
    subtasksArray[position] = changedText.value;
    refreshSubtasks();
}

function subtaskEvents() {
    document.querySelector('.input-button-container #subtasks').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addSubtasks();
        }
    })

    document.getElementById('subtasks').addEventListener('focus', function (event) {
        document.getElementById('subtasks-input-button-container').classList.add('blue-border');
        document.getElementById('erase-subtask').classList.remove('d-none');
        document.getElementById('separator').classList.remove('d-none');

    })

    document.getElementById('subtasks').addEventListener('blur', function (event) {
        document.getElementById('subtasks-input-button-container').classList.remove('blue-border');
        document.getElementById('erase-subtask').classList.add('d-none');
        document.getElementById('separator').classList.add('d-none');
    })
}



async function createTask(timeframe) {
    let task = {};
    let title = document.getElementById('title');
    let dueDate = document.getElementById('dueDate');

    checkRequiredFields(title);
    checkRequiredFields(dueDate);
    checkCategoryField();

    if (title.value !== '' && dueDate.value !== '' && category !== '') {
        task.description = document.getElementById('description').value;
        task.category = category;
        task.prio = priority;
        task.subtask = subtasksArray
        task.title = title.value;
        task.dueDate = dueDate.value;
        task.assignto = assignedContacts;
        task.assigntoID = assignedContactsID;
        task.assigntoColor = assignedContactColor;
        task.initialCircles = initialCircles;
        task.subtasksArray = subtasksArray;

        if (timeframe === 'new') {
            userDataBase[userObject.id].tasks.push(task);
            document.getElementById('task-created-container').classList.remove('d-none')
            redirectToBoard();
        }
        else if (timeframe === 'edit') {
            userDataBase[userObject.id].tasks[taskEditNr] = task;
            document.querySelector('.overlay-task-edit').classList.add('d-none');
        }

        await setItem("userDataBase", JSON.stringify(userDataBase));
        if (timeframe === 'edit') {
            location.reload();
        }
        resetEverything();
    }
}




function resetEverything() {
    document.getElementById('title').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('description').value = '';
    priority = '';
    subtasksArray = [];
    assignedContacts = [];
    assignedContactsID = [];
    assignedContactColor = [];
    initialCircles = [];
    subtasksArray = [];
    refreshSubtasks();
    changeButtonText();
    resetButton();
    resetCategoryAndButton();
    renderAddTaskPage();
}

function redirectToBoard() {
    setTimeout(() => {
        document.getElementById('task-created-container').classList.add('d-none')
        window.location.href = "./board.html"
    }, 1500);
}

function resetCategoryAndButton() {
    document.getElementById('category-selected').innerText = 'Select task category';
    document.getElementById('category-selected').classList.remove('font-black');
    document.getElementById('mediumPrioButton').classList.add('prioMedium');
    document.getElementById('mediumPrioButtonFont').classList.add('colored-white', 'font-weight-clicked');
}

function checkRequiredFields(inputField) {
    if (inputField.value === '') {
        document.getElementById(inputField.id).classList.add("red-border");
        document.getElementById(inputField.id + "-required").classList.remove("d-none");
    }
    else {
        document.getElementById(inputField.id).classList.remove("red-border");
        document.getElementById(inputField.id + "-required").classList.add("d-none");
    }
}

function checkCategoryField() {
    if (category === '') {
        document.getElementById('category-btn').classList.add("red-border");
        document.getElementById('category' + "-required").classList.remove("d-none");
    }
    else {
        document.getElementById('category-btn').classList.remove("red-border");
        document.getElementById('category' + "-required").classList.add("d-none");
    }
}