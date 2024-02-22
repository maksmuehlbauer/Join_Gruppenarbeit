function init() {
    renderLogIn()
}

function renderSignUp() {
    document.getElementById('sign-up-box').classList.add('d-none')
    let logInBox = document.getElementById('login-container');
    logInBox.innerHTML = '';
    logInBox.innerHTML += renderSignUpHtml();
}


function renderLogIn() {
    document.getElementById('sign-up-box').classList.remove('d-none')
    let logInBox = document.getElementById('login-container');
    logInBox.innerHTML = '';
    logInBox.innerHTML += renderLogInHtml();
    
    let signUpBox = document.getElementById('sign-up-box');
    signUpBox.innerHTML = renderSignUpBoxHtml();
}


// HTML FUNCTIONS




function renderLogInHtml() {
    return /*html*/`
    <h1>Log in</h1>
    <div class="divider-line"></div>
    <div class="input-container">
        <input type="email" placeholder="Email" class="login-input">
        <img src="./assets/img/mail.png" alt="mail">
    </div>
    <div class="input-container">
        <input type="password" placeholder="Password" class="login-input">
        <img src="./assets/img/lock.png" alt="password">
    </div>
    <div id="checkbox-container">
        <input type="checkbox" id="checkbox" class="checkbox">
        <label for="checkbox">Remember me</label>
    </div>
    <div class="button-box">
        <button class="button btn-login">Log in</button>
        <button class="button btn-gust-login">Guest Log in</button>
    </div>
`
}


function renderSignUpBoxHtml() {
    return /*html*/`
    <h4>Not a Join user?</h4>
    <button class="button btn-login btn-signup" onclick="renderSignUp()">Sign up</button>
`
}

function renderSignUpHtml() {
    return /*html*/`
    <img src="./assets/img/arrow-left-line.png" class="arrow-left-line" onclick="renderLogIn()">
    <h1>Sign up</h1>
    <div class="divider-line"></div>
        <div class="input-container">
            <input type="text" placeholder="Name" class="login-input">
            <img src="./assets/img/person.png" alt="person">
        </div>
        <div class="input-container">
            <input type="email" placeholder="Email" class="login-input">
            <img src="./assets/img/mail.png" alt="mail">
        </div>
        <div class="input-container">
            <input type="password" placeholder="Password" class="login-input">
            <img src="./assets/img/lock.png" alt="password">
        </div>
        <div class="input-container">
            <input type="password" placeholder="Password" class="login-input">
            <img src="./assets/img/lock.png" alt="password">
        </div>
        <div id="checkbox-container align-center">
            <input type="checkbox" id="checkbox" class="checkbox">
            <label for="checkbox">I Accept the Privacy policy</label>
        </div>
        <div class="button-box">
            <button class="button btn-login">Sign up</button>
        </div>
    </div>
    `
}