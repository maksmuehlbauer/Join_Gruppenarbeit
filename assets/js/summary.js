const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const currentDate = new Date;

async function initWelcome() {
    await includeHTML();
    await checkUserloggedIn();
    loadUserDataBase();
    navigationHighlight('summary-link');
    firstLoginHtml();
    setTimeout(initSummary, 3000)
}


async function initSummary() {
    await includeHTML();
    await checkUserloggedIn();
    loadUserDataBase();
    navigationHighlight('summary-link');
    renderSummary();
}


function renderSummary() {
    let summaryContainer = document.getElementById('summary-content');
    summaryContainer.style.height = '0px'
    summaryContainer.innerHTML = renderSummaryHtml();
}


function displayDate() {
    let day = currentDate.getDate();
    let monthIndex = currentDate.getMonth();
    let year = currentDate.getFullYear();
    let formatedTime = month[monthIndex] + ' ' + day + ', ' + year;
    return formatedTime
}


// HTML Template functions

function firstLoginHtml() {
    let content = document.getElementById('summary-content');
    content.innerHTML += /*html*/`
    <div class="align-center">
        <div class="greetings">
            <h2>Good morning,</h2>
            <h1 id="greet-user" class="h1-blue">${userObject.name}</h1>
        </div>
    </div>
    `
}


function renderSummaryHtml() {
    return /*html*/`
    <h1 class="m-bot8">Join 360</h1>
    <h4>Key Metrics at a Glance</h4>
    <div class="divider-line"></div>
    <div id="task-row-1">
        <div class="task-card task-card-width-50">
            <div class="img-box">
                <img src="./assets/img/pencil-new.png">
            </div>
            <div class="card-info">
                <h1>${userObject.tasks.length}</h1>
                <h5>To-do</h5>
            </div>
        </div>
        <div class="task-card task-card-width-50">
            <div class="img-box">
                <img src="./assets/img/check-new.png">
            </div>
            <div class="card-info">
                <h1>${userObject.tasks.length}</h1>
                <h5>Done</h5>
            </div>
        </div>

    </div>
    <div id="task-row-2">
        <div class="task-card task-card-width-100">
            <div class="task-card-left">
                <div class="img-box">
                    <img src="./assets/img/urgent.png">
                </div>
                <div class="card-info">
                    <h1>${userObject.tasks.length}</h1>
                    <h5>Urgent</h5>
                </div>
            </div>
            <div class="vertical-divider"></div>
            <div class="task-card-right">
                <span class="actual-date">${displayDate()}</span>
                <h5>Upcoming Deadline</h5> 
            </div>

        </div>
    </div>
    <div id="task-row-3">
        <div class="task-card task-card-width-33">
            <div class="card-info">
                <h1>${userObject.tasks.length}</h1>
                <h5>Tasks in Board</h5>
            </div>
        </div>
        <div class="task-card task-card-width-33">
            <div class="card-info">
                <h1>${userObject.tasks.length}</h1>
                <h5>Tasks in Progress</h5>
            </div>
        </div>
        <div class="task-card task-card-width-33">
            <div class="card-info">
                <h1>${userObject.tasks.length}</h1>
                <h5>Awaiting Feedback</h5>
            </div>
        </div>

    </div>
`
}
