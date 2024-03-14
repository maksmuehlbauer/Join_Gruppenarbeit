const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentDate = new Date;



async function initSummary() {
    await includeHTML();
    await checkUserloggedIn();
    navigationHighlight('summary-link');
    renderSummary();
    noCssAnimationSummary();
    renderFirstLogin();
    noCssAnimationGreetings()
    changeGreeting();
    guestLogin()
}


async function initWelcome() {
    await includeHTML();
    await checkUserloggedIn();
    navigationHighlight('summary-link');
    renderSummary();
    renderFirstLogin();
    changeGreeting();
    guestLogin();
}


function renderFirstLogin() {
    let summaryContainer = document.getElementById('summary-content');
    summaryContainer.innerHTML += firstLoginHtml();
}


function renderSummary() {
    let summaryContainer = document.getElementById('summary-content');
    // summaryContainer.style.height = '0px';
    summaryContainer.innerHTML += renderSummaryHtml();
}

function noCssAnimationSummary() {
    document.getElementById('summary-overview').style.opacity = "1"
    document.getElementById('summary-overview').style.animation = "none"
}


function noCssAnimationGreetings() {
    document.getElementById('greetings').classList.add('hide-greetings')
    document.getElementById('greetings').style.animation = "none"
}


function displayDate() {
    let day = currentDate.getDate() +2 ;
    let monthIndex = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let formatedTime = month[monthIndex] + ' ' + day + ', ' + year;
    return formatedTime
}


function changeGreeting() {
    let currentHour = currentDate.getHours()
    if (currentHour >= 4 && currentHour < 12) {
        return document.getElementById('greet-user-time').innerHTML = 'Good morning,';
    }
    if (currentHour >= 12 && currentHour < 19) {
        return document.getElementById('greet-user-time').innerHTML = 'Good day,';
    }
    if (currentHour >= 19 && currentHour < 4) {
        return document.getElementById('greet-user-time').innerHTML = 'Good evening,';
    }
}

function getTasksLength(tasks, status) {
    return tasks.filter( task => task.status === status)
}


function tasksCount(status) {
    const feedbackCount = getTasksLength(userObject.tasks, status)
    return feedbackCount.length
}


function getPrioLength(tasks, status) {
    return tasks.filter( task => task.prio === status)
}


function prioCount(status) {
    const feedbackCount = getPrioLength(userObject.tasks, status)
    return feedbackCount.length
}

function guestLogin() {
    greet = changeGreeting()
    guestId = localStorage.getItem('userId');
    if (guestId === '8') {
        document.getElementById('greet-user-time').innerHTML = `${greet.slice(0, greet.length - 1)}`;
        document.getElementById('greet-user').remove()
    }
}


// HTML Template functionsa

function firstLoginHtml() {
    return /*html*/`
    <div class="align-center">
        <div id="greetings" class="greetings">
            <h2 id="greet-user-time" class="h2-desktop">Good morning,</h2>
            <h1 id="greet-user" class="h1-blue h1-tasks-numbers">${userObject.name}</h1>
        </div>
    </div>
    `
}


function renderSummaryHtml() {
    return /*html*/`
    <div id="summary-overview">
        <div class="topic-box">
            <h1 class="m-bot8 h1-desktop">Join 360</h1>
            <h4 class="h4-desktop">Key Metrics at a Glance</h4>
            <div class="divider-line"></div>
        </div>
        <div id="summary-box" class="desktop-width">
            <div id="task-row-1">
                <a href="board.html" class="task-card task-card-width-50">
                    <div class="img-box">
                        <div class="img-pencil">
                        </div>
                    </div>
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${tasksCount('toDo')}</h1>
                        <h5 class="h5-desktop-20px">To-do</h5>
                    </div>
                </a>
                <a href="board.html" class="task-card task-card-width-50 scale-left">
                    <div class="img-box">
                        <div class="img-check">
                        </div>
                    </div>
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${tasksCount('done')}</h1>
                        <h5 class="h5-desktop-20px">Done</h5>
                    </div>
                </a>

            </div>
            <div id="task-row-2">
                <a href="board.html" class="task-card task-card-width-100">
                    <div class="task-card-left">
                        <div class="img-box img-urgent">

                            <!-- <img src="./assets/img/urgent.png"> -->
                        </div>
                        <div class="card-info">
                            <h1 class="h1-tasks-numbers">${prioCount('high')}</h1>
                            <h5 class="h5-desktop-20px">Urgent</h5>
                        </div>
                    </div>
                    <div class="vertical-divider"></div>
                    <div class="task-card-right">
                        <span class="actual-date">${displayDate()}</span>
                        <h5 class="h5-desktop-16px">Upcoming Deadline</h5> 
                    </div>
                </a>
            </div>
            <div id="task-row-3">
                <a href="board.html" class="task-card task-card-width-33">
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${userObject.tasks.length}</h1>
                        <h5 class="h5-desktop-20px">Tasks in Board</h5>
                    </div>
                </a>
                <a href="board.html" class="task-card task-card-width-33 scale-center">
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${tasksCount('progress')}</h1>
                        <h5 class="h5-desktop-20px">Tasks in Progress</h5>
                    </div>
                </a>
                <a href="board.html" class="task-card task-card-width-33 scale-left">
                    <div class="card-info">
                        <h1 class="h1-tasks-numbers">${tasksCount('feedback')}</h1>
                        <h5 class="h5-desktop-20px">Awaiting Feedback</h5>
                    </div>
                </a>
            </div>
        </div>
    </div>
`
}
