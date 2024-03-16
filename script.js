let menuEnabled = true;
let checkboxChecked = true;
let userObject;


async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
}


async function init() {
    loadUserDataBase()
    renderLogIn();
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


function getValueFromId(id) {
    return document.getElementById(id).value
}


function getHtmlElementById(id) {
    return document.getElementById(id);
}


async function login() {
    let email = getValueFromId('email');
    let password = getValueFromId('password');
  
    let searchedUser = userDataBase.find((user) => user['email'] === email && user['password'] === password);
    if (searchedUser) {
        localStorage.setItem('userId', searchedUser.id);
        window.location.href = 'welcome.html';
    } else {
      document.getElementById('password-dont-match').classList.remove('d-none')
      document.getElementById('password').classList.add('pw-dont-match-border')
    }
}


function skipToSummary() {
    console.log('Hallo')
}


function guestLogin(guestId) {
    localStorage.setItem('userId', guestId);
    window.location.href = 'welcome.html';
}


async function checkUserloggedIn() {
    const userId = localStorage.getItem('userId');
    if (userId) {
        await loadUserObject(userId);
    } else {
        window.location.href = 'index.html';
    }
}
  
async function loadUserObject(userId) {
    try {
        const userDataBase = JSON.parse(await getItem('userDataBase'));
        userObject = userDataBase.find((user) => user.id.toString() === userId);
        getInitials();
    } catch (e) {
        console.error('Loading error:', e);
    }
}


function userLogout() {
    localStorage.removeItem('userId')
}


function navigationHighlight(id) {
    let navigationElements = document.getElementById('navigation').children;
    for (let i = 0; i < navigationElements.length; i++) {
        navigationElements[i].classList.remove('navbox-bg-color')
        }
    document.getElementById(id).classList.add('navbox-bg-color');
}


function showMenu() {
    if (menuEnabled) {
        toggleHiddenBox();
        setTimeout(animateMenuSlider, 125)
        menuEnabled = false;
    } else {
        animateMenuSlider()
        setTimeout(toggleHiddenBox, 125)
        menuEnabled = true;
    }
}


function toggleHiddenBox() {
    document.getElementById('hidden-box').classList.toggle('d-none');
}


function animateMenuSlider() {
    document.getElementById('user-menu').classList.toggle('show-menu');
}


async function initPrivacy() {
    await includeHTML();
    checkLocalStorage()
    deleteDivElement('user-circle')
}


function checkLocalStorage() {
    let localStorageExist = localStorage.getItem('userId')
    if (!localStorageExist) {
        deleteDivElement('navigation')
    } 
}


function deleteDivElement(divId) {
    document.getElementById(divId).remove();
}


function linkToPreviousPage() {
    history.back()
}


function linkToPreviousPageLegalNotice() {
    history.back();
}


async function getInitials() {
    let initials = ''
    let splittedName = userObject.name.split(' ')
    for (let i = 0; i < splittedName.length; i++) {
        initials += splittedName[i].charAt(0).toUpperCase();
    }  
    document.getElementById('user-circle').innerHTML = `${initials}`
}


function changeCheckboxStatus() {
    if (checkboxChecked) {
        document.getElementById('checkbox-img').src = "./assets/img/checked.png"
        checkboxChecked = false;
    } else {
        document.getElementById('checkbox-img').src = "./assets/img/unchecked.png"
        checkboxChecked = true;
    }
}


function renderLogInHtml() {
    return /*html*/`
        <h1>Log in</h1>
        <div class="divider-line"></div>
        <form class="form-width" onsubmit="login(); return false">
            <div class="input-container" >
                <input required type="email" id="email" placeholder="Email" class="login-input">
                <img src="./assets/img/mail.png" alt="mail">
            </div>
            <div class="input-container">
                <input 
                required 
                type="password" 
                id="password" 
                placeholder="Password" 
                class="login-input" 
                minlength="8" 
                autocomplete="off" 
                onkeyup="changePasswordIcon('password', 'img-login-pw')" 
                onclick="hideDontMatchBox('password', 'password')">
                <img id="img-login-pw" src="./assets/img/lock.png" alt="password" onclick="showPassword('password', 'img-login-pw')">
                <div id="password-dont-match" class="d-none">
                    <span class="dont-match">Wrong password Ups! Try again.</span>
                </div>
            </div>
            <div id="checkbox-container">
                <label for="checkbox" class="checkbox-label">
                <img src="./assets/img/unchecked.png" id="checkbox-img">
                <input type="checkbox" id="checkbox" class="checkbox" onclick="changeCheckboxStatus()">
                Remember me</label>
            </div>
            <div class="button-box">
                <button class="button btn-login">Log in</button>
                <button class="button btn-gust-login" onclick="guestLogin('8')">Guest Log in</button>
                </div>
        </form>
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
    <form class="form-width" onsubmit="registerUser(); return false">
        <div class="input-container">
            <input required id="name" type="text" placeholder="Name" class="login-input" minlength="2">
            <img src="./assets/img/person.png" alt="person">
        </div>
        <div class="input-container">
            <input required id="email-sign" type="email" placeholder="Email" class="login-input">
            <img src="./assets/img/mail.png" alt="mail">
        </div>
        <div class="input-container">
            <input  
            id="password-signup"
            type="password" 
            placeholder="Password" 
            class="login-input" 
            autocomplete="off"
            minlength="8"
            pattern="^(?=.*[A-Z]).{8,}$"
            title="At least 8 chracters and 1 capital letter are required"
            required
            onkeyup="changePasswordIcon('password-signup', 'pw-signup-img')"
            onclick="hideDontMatchBox('password-signup', 'password-proof')"
            >
            <img src="./assets/img/lock.png" alt="password" id="pw-signup-img" onclick="showPassword('password-signup', 'pw-signup-img')">
        </div>
        <div class="input-container">
            <input 
            required 
            id="password-proof" 
            type="password" 
            placeholder="Confirm Password" 
            class="login-input" 
            autocomplete="off" 
            minlength="8" 
            required 
            onkeyup="changePasswordIcon('password-proof', 'pw-proof-lock-img')"
            onclick="hideDontMatchBox('password-proof', 'password-proof')"
            >
            <img src="./assets/img/lock.png" alt="password" id="pw-proof-lock-img" onclick="showPasswordProof('password-proof', 'pw-proof-lock-img')">
            <div id="password-dont-match" class="d-none">
                <span class="dont-match">Your Passwords don't match. Try again.</span>
            </div>
        </div>
        <div id="checkbox-container" class="align-center">
            <label for="checkbox" class="checkbox-label j-center">
                <img src="./assets/img/unchecked.png" id="checkbox-img">
                <input type="checkbox" id="checkbox" class="checkbox" onclick="changeCheckboxStatus()">I Accept the Privacy policy
            </label>
        </div>
        <div class="button-box">
            <button class="button btn-login">Sign up</button>
        </div>
    </form>
    `
}