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
                "DueDate": "DueDate",
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
let prioButtonsColor = document.querySelectorAll('.prio-container button');
let assignedToMenuOpen = false;

function setPriority(priority) {
    for (let i = 0; i < 3; i++) {
        prioButtonsColor[i].style.backgroundColor = 'white';
    }
    if (priority == 'high') {
        userDataBase[0].tasks.prio = 2;
        document.getElementById('highPrioButton').style.backgroundColor = 'rgba(255, 61, 0, 1)';
    }
    else if (priority == 'medium') {
        userDataBase[0].tasks.prio = 2;
        document.getElementById('mediumPrioButton').style.backgroundColor = 'rgba(255, 168, 0, 1)';
    }
    else if (priority == 'low') {
        userDataBase[0].tasks.prio = 2;
        document.getElementById('lowPrioButton').style.backgroundColor = 'rgba(122, 226, 41, 1)';
    }
}


function openAssignContainer() {
    if (assignedToMenuOpen == false) {
        document.getElementById('contacts-to-assign-container').classList.remove('d-none');
        assignedToMenuOpen = true;
    }
    else {
        document.getElementById('contacts-to-assign-container').classList.add('d-none');
        assignedToMenuOpen = false;
    }
}

function renderAddTaskPage() {
    let assignedToList = document.getElementById('contacts-to-assign-list');
    for (let i = 0; i < userDataBase[0].contacts.length; i++) {
        assignedToList.innerHTML += `<li class="" id="contact${i}" onclick="assignContact('${userDataBase[0].contacts[i].name}', 'contact${i}')">${userDataBase[0].contacts[i].name}</li>`
    };
}

function assignContact(contactName, contactID) {

    let index = assignedContacts.indexOf(contactName);
    if (index === -1) {
        assignedContacts.push(contactName);
        document.getElementById(contactID).classList.add('checked');
    }
    else {
        assignedContacts.splice(index, 1);
        document.getElementById(contactID).classList.remove('checked');
    }
    let buttonText = document.getElementById('buttontext');
    if (assignedContacts.length == 0) {
        buttonText.innerHTML = `Select contacts to assign`;
    }
    else {
        buttonText.innerHTML = ``;
    }

    for (let i = 0; i < assignedContacts.length; i++) {
        buttonText.innerHTML += `<div class="assigned-contacts-button">${assignedContacts[i]}</div>`;
    }


}
