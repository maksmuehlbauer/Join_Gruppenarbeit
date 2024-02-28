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
                "name": "Stefan Tieze",
                "email": "m.malte@web.de",
                "phone": "+49 172 334 556 87"
            },
            {
                "name": "Eva Kunze",
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

function generateInitials(contactNr) {
    let fullname = userDataBase[0].contacts[contactNr].name;
    let name = fullname.split(' ');
    let initials = "";
    for (let i = 0; i < name.length; i++) {
        name[i] = name[i].charAt(0).toUpperCase();
        initials += name[i];
    }
    return initials;
}

function setPriority(pressedButton) {
    for (let i = 0; i < 3; i++) {
        prioButtonsColor[i].setAttribute('class', '');
        prioButtonsColorFont[i].setAttribute('class', '');
    }
    if (pressedButton == 'high') {
        priority = 'high';
        document.getElementById('highPrioButton').classList.add('prioHigh')
        document.getElementById('highPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
    }
    else if (pressedButton == 'medium') {
        priority = 'medium';
        document.getElementById('mediumPrioButton').classList.add('prioMedium')
        document.getElementById('mediumPrioButtonFont').classList.add('colored-white', 'font-weight-clicked')
    }
    else if (pressedButton == 'low') {
        priority = 'low';
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
        let firstAndLastLetter = generateInitials(i);
        assignedToList.innerHTML +=
            `<div class="listItem">
            <li class="" id="contactID${i}" onclick="assignContact('${userDataBase[0].contacts[i].name}', 'contactID${i}', 'checkButtonID${i}')">
            <div class="nameFrame">
            <div class="contact-circle">${firstAndLastLetter}</div>${userDataBase[0].contacts[i].name}
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
    let title = document.getElementById('title');
    let dueDate = document.getElementById('dueDate');
    let category = document.getElementById('category');

    checkRequiredFields(task, title);
    checkRequiredFields(task, dueDate);
    checkRequiredFields(task, category);

    if (title.value !== '' && dueDate.value !== '' && category.value !== '') {
        task.descripton = document.getElementById('description').value;
        task.category = document.getElementById('category').value;
        task.prio = priority;
        task.subtask = document.getElementById('subtasks').value;
        task.assignto = assignedContacts;
        console.log(task);
    }

}

function checkRequiredFields(task, inputField) {
    if (inputField.value === '') {
        document.getElementById(inputField.id).classList.add("red-border");
        document.getElementById(inputField.id + "-required").classList.remove("d-none");
    }
    else {
        document.getElementById(inputField.id).classList.remove("red-border");
        document.getElementById(inputField.id + "-required").classList.add("d-none");
        task.title = document.getElementById(inputField.id).value;
    }
}