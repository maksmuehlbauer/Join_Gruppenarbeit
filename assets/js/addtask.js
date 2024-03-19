let assignedContacts = [];
let assignedContactsID = [];
let assignedContactColor = [];
let prioButtonsColor = document.querySelectorAll('.prio-container button');
let prioButtonsColorFont = document.querySelectorAll('.prio-container button div');
let categoryMenuOpen = false;
let category = '';
let assignedToMenuOpen = false;
let priority = 'medium';
let initialCircles = [];
let subtasksArray = [];
let contacts;
let taskEditNr = 0;
let taskEditStatus = 'toDo';
let subtaskStatus = [];


/**
 * function to initialize the addtask-page
 */
async function initAddTaskPage() {
    checkUserloggedIn();
    loadContacts();
    await includeHTML();
    navigationHighlight('addtask-link');
    subtaskEvents();
}
/**
 * Function to load the userdatabase from the webserver and generate the contacts
 * 
 */
async function loadContacts() {
    try {
        const result = await getItem("userDataBase");
        userDataBase = JSON.parse(result);
        contacts = userDataBase[userObject.id].contacts;
        renderContactsList();
    } catch (e) {
        console.error("Loading error:", e);
        contacts = [];
    }
}
/**
 * this function is getting the task, that the user wants to edit from the board.html
 * 
 * 
 * @param {object} task - task to be edited 
 */
async function sendTaskToEdit(task) {
    taskEditNr = task.id;
    await initAddTaskPage();
    await editTaskpage(task);
}

/**
 * function assigns the values of the edited task into the inputfields of the addtask-site
 * 
 * 
 * @param {object} task - task to be edited 
 */
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
    taskEditStatus = task.status;
    priority = '';
    setPriority(task.prio);
    refreshSubtasks();
    changeButtonText();
}



/**
 * function takes the name of a contact and generates the initials
 * 
 * 
 * @param {number} contactNr - number of the contact in the contact list
 * @returns - initials of the contact in capital letters
 */
function generateInitials(contactNr) {
    let fullname = contacts[contactNr].name;
    return splitAndUpperCaseInitials(fullname);
}

/**
 * splits the name of the contact to get the first letters
 *  
 * @param {string} fullname - name of the contact
 * @returns - initials of the contact
 */
function splitAndUpperCaseInitials(fullname) {
    let name = fullname.split(' ');
    let initials = "";
    for (let i = 0; i < name.length; i++) {
        name[i] = name[i].charAt(0).toUpperCase();
        initials += name[i];
    }
    return initials;
}

/**
 * function sets the color and the priority of the pressed button
 * 
 * 
 * @param {string} pressedButton - prio of the pressed button 
 */
function setPriority(pressedButton) {
    prioButtonsColor = document.querySelectorAll('.prio-container button');
    prioButtonsColorFont = document.querySelectorAll('.prio-container button div');
    resetButton();
    if (pressedButton == 'high') {
        setHighPriority()
    }
    else if (pressedButton == 'medium') {
        setMediumPriority()

    }
    else if (pressedButton == 'low') {
        setLowPriority()
    }
}

function setHighPriority() {
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

function setMediumPriority() {
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

function setLowPriority() {
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

/**
 * function resets the style of the not-pressed buttons
 *  
 */
function resetButton() {
    for (let i = 0; i < 3; i++) {
        prioButtonsColor[i].setAttribute('class', '');
        prioButtonsColorFont[i].setAttribute('class', '');
    }
}

/**
 * opens and closes the assign list 
 */
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

/**
 * opens and closes the category list
 */
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

/**
 * sets the category of the task and gives it the correct style
 * 
 * @param {string} categorySelected - name of the selected task-category
 */
function selectCategory(categorySelected) {
    closeCategoryAndRemoveBorder()
    category = categorySelected;
    document.getElementById('category-selected').innerText = categorySelected;
    document.getElementById('category-selected').classList.add('font-black');
}

document.addEventListener('click', function (event) {
    if (event.target.id !== 'category-selected' && event.target.id !== 'category-btn') {
        closeCategoryAndRemoveBorder()
    }
});

function closeCategoryAndRemoveBorder() {
    document.getElementById('category-dropdown-menu').classList.add('d-none');
    document.getElementById('category-btn').classList.remove('blue-border');
    categoryMenuOpen = false;
}


/**
 * eventlistener to close the container with the contacts when clicked outside
 */
document.addEventListener('click', function (event) {
    if (event.target.id !== 'assigned-to-btn' && event.target.id !== 'buttontext' && event.target.parentNode.className !== 'listItem' && event.target.className !== 'nameFrame' &&
        event.target.className !== 'contactAssignCheck' && event.target.className !== 'contact-circle') {
        document.getElementById('contacts-to-assign-container').classList.add('d-none');
        document.getElementById('assigned-to-btn').classList.remove('blue-border');
        assignedToMenuOpen = false;
    }
});

/**
 * renders the list of the contact-container and check if contact is already assigned to a task
 */
function renderContactsList() {
    let assignedToList = document.getElementById('contacts-to-assign-list');
    assignedToList.innerHTML = '';
    for (let i = 0; i < contacts.length; i++) {
        let firstAndLastLetter = generateInitials(i);
        let backgroundColor = contacts[i].bgrColor;
        assignedToList.innerHTML += renderContactsListHTML(firstAndLastLetter, backgroundColor, i);
        if (assignedContacts.includes(contacts[i].name)) {
            document.getElementById('contactID' + i).classList.add('checked');
            document.getElementById('checkButtonID' + i).src = './assets/img/check_button_checked.png';
        }
    };
}

/**
 * renders the html code for the Contactlist
 * 
 * 
 * @param {string} firstAndLastLetter - first and last letter of the contact 
 * @param {string} backgroundColor - backgroundcolor of the contact
 * @param {number} i - position of the contact in the object
 * @returns 
 */
function renderContactsListHTML(firstAndLastLetter, backgroundColor, i) {
    return `<div class="listItem">
                <li class="clickable" id="contactID${i}" onclick="assignContact('${contacts[i].name}', 'contactID${i}', 'checkButtonID${i}', '${backgroundColor}')">
                    <div class="nameFrame">
                 <div class="contact-circle" style="background-color: ${backgroundColor}">
                    ${firstAndLastLetter}
                </div>${contacts[i].name}
                </div>
                    <img class="contactAssignCheck" id="checkButtonID${i}" src="./assets/img/check_button.png"> 
                </li>
            </div>`
}


/**
 * assignes the selected contact to the task
 * 
 * @param {string} contactName - name of the selected contact
 * @param {string} contactID - id of the selected contact
 * @param {string} checkButtonID - id of the check button
 * @param {string} color - backgroundcolor of the contact
 */
function assignContact(contactName, contactID, checkButtonID, color) {
    highlightSelectedContact(contactName, contactID, checkButtonID, color);
    changeButtonText(contactID);

}


/**
 * pushes the assigned contacts into an array of all selected contacts of removes it 
 * 
 * @param {string} contactName - name of the selected contact
 * @param {string} contactID - id of the selected contact
 * @param {string} checkButtonID - id of the check button
 * @param {string} color - backgroundcolor of the contact
 */
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

/**
 * changes the text of "Select contacts to assign" button
 */
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

/**
 * adds the colored circles for the initials under the assign-field
 */
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

/**
 * removes the assigned contacts from the array
 * 
 * @param {event} event - event to prevent closing of the container
 * @param {string} name - name of the contact in the array
 * @param {string} id - id of the contact in the array
 */
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


/**
 * function to add subtasks into subtask-array
 * 
 * @returns nothing if no subtask is added
 */
function addSubtasks() {
    let subtask = document.getElementById('subtasks');
    if (subtask.value == '') {
        return;
    }
    subtasksArray.push(subtask.value);
    subtask.value = '';
    refreshSubtasks();
}

/**
 * refreshes the subtask list if something is added or removed
 */
function refreshSubtasks() {
    let subtaskList = document.getElementById('subtasks-list');
    subtaskList.innerHTML = '';
    for (let i = 0; i < subtasksArray.length; i++) {
        subtaskList.innerHTML += generateSubtaskHTML(i)
    }
}

/**
 * generates the HTML code of the subtask-list
 * 
 * @param {number} i - position of the subtask in the subtaskarray
 * @returns HTML code of the subtask-list
 */
function generateSubtaskHTML(i) {
    return `<div id="subtaskID${i}" class="input-button-container">
                <span id="subtaskID${i}">${subtasksArray[i]}
                </span>
                    <div class="subtask-button-container">
                        <button onclick="editSubtask(${i}, 'subtaskID${i}')"><img src="assets/img/edit-task.png"></button>
                            <div id="separator" class="separator"></div>
                        <button onclick="deleteSubtask(${i})"><img src="assets/img/delete.png"></button>
                    </div>
            </div>`
}


/**
 * function to remove subtasks from subtask-array
 * 
 * @param {number} position -  position of the subtask in the subtaskarray
 */
function deleteSubtask(position) {
    subtasksArray.splice(position, 1);
    refreshSubtasks();
}

/**
 * function to generate the editable subtask list
 * 
 * @param {*} position - position of the subtask in the array
 * @param {*} ID - id of the subtask in the html file
 */
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

/**
 * changes the value of the subtask in the array
 * 
 * @param {number} position - position of the subtask in the array
 */
function changeSubtask(position) {
    let changedText = document.getElementById('subtaskChangeInput');
    subtasksArray[position] = changedText.value;
    refreshSubtasks();
}

/**
 * events to change the style of the subtasks when hovering
 */
function subtaskEvents() {
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
    document.querySelector('.input-button-container #subtasks').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            addSubtasks();
        }
    })
}


/**
 * function to create the task and save into the database
 * 
 * @param {string} timeframe - value, whether task is new or edited
 */
async function createTask(timeframe) {
    let task = {};
    let title = document.getElementById('title');
    let dueDate = document.getElementById('dueDate');
    checkRequiredFields(title);
    checkRequiredFields(dueDate);
    checkCategoryField();
    if (title.value !== '' && dueDate.value !== '' && category !== '') {
        createTheTaskObject(task, title, dueDate);
        checkTaskStatus(task, timeframe);
        await setItem("userDataBase", JSON.stringify(userDataBase));
        if (timeframe === 'edit') {
            location.reload();
        }
        resetEverything();
    }
}

/**
 * creating the task-object 
 */
function createTheTaskObject(task, title, dueDate){
    task.description = document.getElementById('description').value;
    task.category = category;
    task.prio = priority;
    task.status = taskEditStatus;
    task.subtask = subtasksArray;
    task.title = title.value;
    task.dueDate = dueDate.value;
    task.assignto = assignedContacts;
    task.assigntoID = assignedContactsID;
    task.assigntoColor = assignedContactColor;
    task.initialCircles = initialCircles;
    task.subtasksArray = subtasksArray;
    task.subtaskStatus = subtaskStatus;
}

/**
 * creates a new task or changes an existing one
 * 
 * @param {object} task - task-object
 * @param {string} timeframe - value, whether task is new or edited
 */
function checkTaskStatus(task, timeframe){
    if (timeframe === 'new') {
        userDataBase[userObject.id].tasks.push(task);
        document.getElementById('task-created-container').classList.remove('d-none')
        redirectToBoard();
    }
    else if (timeframe === 'edit') {
        userDataBase[userObject.id].tasks[taskEditNr] = task;
        document.querySelector('.overlay-task-edit').classList.add('d-none');
    }
}



/**
 * function to reset all the inputs from the add-task-form
 */
function resetEverything() {
    document.getElementById('title').value = '';
    document.getElementById('dueDate').value = '';
    document.getElementById('description').value = '';
    priority = 'medium';
    taskEditStatus = 'toDo'
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
    renderContactsList();
}

/**
 * function to redirect to board.html if new task is created
 */
function redirectToBoard() {
    setTimeout(() => {
        document.getElementById('task-created-container').classList.add('d-none')
        window.location.href = "./board.html"
    }, 1500);
}

/**
 * function to reset the form of the category-field
 */
function resetCategoryAndButton() {
    document.getElementById('category-selected').innerText = 'Select task category';
    document.getElementById('category-selected').classList.remove('font-black');
    document.getElementById('mediumPrioButton').classList.add('prioMedium');
    document.getElementById('mediumPrioButtonFont').classList.add('colored-white', 'font-weight-clicked');
}

/**
 * function to check if all required fields have a value
 */
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

/**
 * function to check if category field has a value
 */
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