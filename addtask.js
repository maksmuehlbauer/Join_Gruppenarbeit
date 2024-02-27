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
                "prio": "prio",
                "subtask": [],

            }
        ],
        "contacts": [
            {
                "name": "Malte",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Kai",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Stefan",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Eva",
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


function setPriority(priority) {
    console.log(prioButtonsColorFont);
    for (let i = 0; i < 3; i++) {
        prioButtonsColor[i].setAttribute('class', '');
        prioButtonsColorFont[i].setAttribute('class', '');
    }
    if (priority == 'high') {
        userDataBase[0].tasks[0].prio = 'urgent';
        document.getElementById('highPrioButton').classList.add('prioHigh')
        document.getElementById('highPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
    }
    else if (priority == 'medium') {
        userDataBase[0].tasks[0].prio = 'medium';
        document.getElementById('mediumPrioButton').classList.add('prioMedium')
        document.getElementById('mediumPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
    }
    else if (priority == 'low') {
        userDataBase[0].tasks[0].prio = 'low';
        document.getElementById('lowPrioButton').classList.add('prioLow')
        document.getElementById('lowPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
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

function renderAddTaskPage() {
    let assignedToList = document.getElementById('contacts-to-assign-list');
    for (let i = 0; i < userDataBase[0].contacts.length; i++) {
        assignedToList.innerHTML +=
            `<div class="listItem">
            <li class="" id="contactID${i}" onclick="assignContact('${userDataBase[0].contacts[i].name}', 'contactID${i}', 'checkButtonID${i}')">
            <div class="nameFrame">
            <img src="./assets/img/profile_badge_template.png">${userDataBase[0].contacts[i].name}
            </div>
            <img id="checkButtonID${i}" src="./assets/img/check_button.png"> </li></div>`
    };
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

function changeButtonText(contactID) {
    let buttonText = document.getElementById('buttontext');
    if (assignedContacts.length == 0) {
        buttonText.innerHTML = `Select contacts to assign`;
    }
    else {
        buttonText.innerHTML = `An:`;
    }
    for (let i = 0; i < assignedContacts.length; i++) {
        buttonText.innerHTML += `<div class="assigned-contacts-button">${assignedContacts[i]}<button onclick="removeContactInList(event, '${assignedContacts[i]}', '${assignedContactsID[i]}')">X</button></div>`;
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

function createTask() {
    let task = userDataBase[0].tasks[0];
    task.title = document.getElementById('title').value;
    task.descripton = document.getElementById('description').value;
    task.dueDate = document.getElementById('due-date').value;
    task.category = document.getElementById('category').value;
    task.subtask = document.getElementById('subtasks').value;




}

