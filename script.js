function init() {

}

function renderSignUp() {
    let logInBox = document.getElementById('login-container');
    document.getElementById('sign-up-box').classList.add('d-none')
    
    document.getElementById('checkbox-container').style.alignSelf = "initial"
    
    
    logInBox.innerHTML = '';

    

    logInBox.innerHTML += /*html*/`
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