let userDataBase = [
    {
        "id": 1,
        "name": "name",
        "email": "m.muehlbauer@kkkk.de",
        "password": "Test123",
        "tasks": [
            {
                "title": "Titel Muster",
                "descripton": "Hier muss der Text hin",
                "assignto": [],
                "category": "cat",
                "dueDate": "DueDate",
                "prio": "",
                "subtask": [],

            }
        ],
        "contacts": [
            {
                "name": "Malte Klose",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Heiko Nevoigt ",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Stefan",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Eva Maria Kunze",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
        ],
    }
]
let assignedContacts = [];
let assignedContactsID = [];
let prioButtonsColor = document.querySelectorAll('.prio-container button');
let prioButtonsColorFont = document.querySelectorAll('.prio-container button div');
let assignedToMenuOpen = false;
let priority = '';
let initialCircles = [];
let subtasksArray = ["waschen", "kochen"];

function generateInitials(contactNr) {
    let fullname = userDataBase[0].contacts[contactNr].name;
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

document.addEventListener('click', function (event) {
    if (event.target.id !== 'assigned-to-btn' && event.target.parentNode.className !== 'listItem' && event.target.className !== 'nameFrame' && event.target.className !== 'contact-circle') {
        document.getElementById('contacts-to-assign-container').classList.add('d-none');
        document.getElementById('assigned-to-btn').classList.remove('blue-border');
        assignedToMenuOpen = false;
    }
});

function renderAddTaskPage() {
    let assignedToList = document.getElementById('contacts-to-assign-list');
    for (let i = 0; i < userDataBase[0].contacts.length; i++) {
        let firstAndLastLetter = generateInitials(i);
        assignedToList.innerHTML +=
            `<div class="listItem">
                <li class="clickable" id="contactID${i}" onclick="assignContact('${userDataBase[0].contacts[i].name}', 'contactID${i}', 'checkButtonID${i}')">
                    <div class="nameFrame">
                        <div class="contact-circle">
                            ${firstAndLastLetter}
                        </div>${userDataBase[0].contacts[i].name}
                    </div>
                    <img id="checkButtonID${i}" src="./assets/img/check_button.png"> 
                </li>
            </div>`
    };
}

function addCirclesToContainer() {
    initialCircles = assignedContacts.map((element) => {
        return splitAndUpperCaseInitials(element);
    })
    let circle = document.getElementById("contact-circles-container");
    circle.innerHTML = '';

    for (let i = 0; i < initialCircles.length; i++) {
        circle.innerHTML += `<div class="contact-circle">${initialCircles[i]}</div>`

    }
}

function assignContact(contactName, contactID, checkButtonID) {
    highlightSelectedContact(contactName, contactID, checkButtonID);
    changeButtonText(contactID);

}

function highlightSelectedContact(contactName, contactID, checkButtonID) {
    let index = assignedContacts.indexOf(contactName);
    if (index === -1) {
        assignedContacts.push(contactName);
        assignedContactsID.push(contactID);
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
    for (let i = 0; i < assignedContacts.length; i++) {
        buttonText.innerHTML += `<div class="assigned-contacts-button">${assignedContacts[i]}
                                    <button onclick="removeContactInList(event, '${assignedContacts[i]}', '${assignedContactsID[i]}')">
                                        <img src="assets/img/close.png">
                                    </button>
                                 </div>`;
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
    document.getElementById(id).classList.remove('checked');
}

document.getElementById('subtasks').addEventListener('keypress', function (event) {
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

function createTask() {
    let task = userDataBase[0].tasks[0];
    let title = document.getElementById('title');
    let dueDate = document.getElementById('dueDate');
    let category = document.getElementById('category');

    checkRequiredFields(task, title);
    checkRequiredFields(task, dueDate);
    checkRequiredFields(task, category);

    if (title.value !== '' && dueDate.value !== '' && category.value !== '') {
        task.descripton = document.getElementById('description').value;
        task.category = category.value;
        task.prio = priority;
        task.subtask = subtasksArray
        task.title = title.value;
        task.dueDate = dueDate.value;
        task.assignto = assignedContacts;
        console.log(task);
        resetEverything(title, dueDate, category, description);
    }
}

function resetEverything(title, dueDate, category, description) {
    title.value = '';
    dueDate.value = '';
    category.value = '';
    description.value = '';
    priority = 0;
    subtasksArray = [];
    assignedContacts = [];
    assignedContactsID = [];
    refreshSubtasks();
    changeButtonText();
    resetButton();
}



function checkRequiredFields(task, inputField) {
    if (inputField.value === '') {
        document.getElementById(inputField.id).classList.add("red-border");
        document.getElementById(inputField.id + "-required").classList.remove("d-none");
    }
    else {
        document.getElementById(inputField.id).classList.remove("red-border");
        document.getElementById(inputField.id + "-required").classList.add("d-none");
    }
}