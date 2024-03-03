let menuEnabled = true;
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

async function initContacts() {
    loadContacts();
    renderContacts();
    await includeHTML();
    navigationHighlight('contact-link');
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


function login() {
    let email = getValueFromId('email');
    let password = getValueFromId('password');
  
    let searchedUser = userDataBase.find((user) => user['email'] === email && user['password'] === password);
    if (searchedUser) {
      localStorage.setItem('userId', searchedUser.id);
      window.location.href = 'welcome.html';
    } else {
      alert('Email Adresse und Passwort stimmen nicht überein');
    }
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
    // window.location.href = 'index.html';
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

function getUrl() {
    let x = document.URL
    localStorage.setItem('URL', x);
}


function linkToPreviousPage() {
    let localStorageExist = localStorage.getItem('userId')
    if (!localStorageExist) {
        window.location.href = 'index.html';
    } else {
        url = localStorage.getItem('URL')
        window.location.href = url;
        localStorage.removeItem('URL')
    }
}

// HTML FUNCTIONS


function renderLogInHtml() {
    return /*html*/`
    <h1>Log in</h1>
    <div class="divider-line"></div>
    <form class="width-100" onsubmit="login(); return false">
        <div class="input-container" >
            <input required type="email" id="email" placeholder="Email" class="login-input">
            <img src="./assets/img/mail.png" alt="mail">
        </div>
        <div class="input-container">
            <input required type="password" id="password" placeholder="Password" class="login-input" minlength="8" autocomplete="off">
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
    </form>
`
}


function renderSignUpBoxHtml() {
    return /*html*/`
    <h4>Not a Join user?</h4>
    <button class="button btn-login btn-signup" onclick="renderSignUp()">Sign up</button>
`
}


//pattern="(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}"

function renderSignUpHtml() {
    return /*html*/`
    <img src="./assets/img/arrow-left-line.png" class="arrow-left-line" onclick="renderLogIn()">
    <h1>Sign up</h1>
    <div class="divider-line"></div>
    <form class="width-100" onsubmit="registerUser(); return false">
        <div class="input-container">
            <input required id="name" type="text" placeholder="Name" class="login-input" minlength="2">
            <img src="./assets/img/person.png" alt="person">
        </div>
        <div class="input-container">
            <input required id="email-sign" type="email" placeholder="Email" class="login-input">
            <img src="./assets/img/mail.png" alt="mail">
        </div>
        <div class="input-container">
            <input required 
            id="password"
            type="password" 
            placeholder="Password" 
            class="login-input" 
            autocomplete="off"
            
            title="Enter an Password that contains 8 characters at least, 1 special character, 1 capital letter, 1 digit"
            >
            
            <img src="./assets/img/lock.png" alt="password">
        </div>
        <div class="input-container">
            <input required id="password-proof" type="password" placeholder="Password" class="login-input" autocomplete="off" minlength="8">
            <img src="./assets/img/lock.png" alt="password">
        </div>
        <div id="checkbox-container" class="align-center">
            <input required type="checkbox" id="checkbox" class="checkbox">
            <label for="checkbox">I Accept the Privacy policy</label>
        </div>
        <div class="button-box">
            <button class="button btn-login">Sign up</button>
        </div>
    </form>

    `
}