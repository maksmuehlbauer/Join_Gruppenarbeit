let userDataBase = [

];

let id;
let showPwEnabled = true;
let showPwProoEnabled = true;


async function loadUserDataBase() {
    try {
        userDataBase = JSON.parse(await getItem('userDataBase'));
    } catch(e) {
        console.error('Loading error:', e)
    }
}


async function deleteItemFromDatabase() {
    console.log(userDataBase)
    userDataBase.splice(3);
    await setItem('userDataBase', JSON.stringify(userDataBase));
}


function passworVerification() {
    let password = getValueFromId('password-signup');
    let confirmPassword = getValueFromId('password-proof')
    
    if (password !== confirmPassword) {
        document.getElementById('password-dont-match').classList.remove('d-none')
        document.getElementById('password-proof').classList.add('pw-dont-match-border')
        return false;
    }
    return true;
}

function hideDontMatchBox(id, redBorderId) {
    let selectedElement = getHtmlElementById(id)
    let redBorderInput = getHtmlElementById(redBorderId)
    
    selectedElement.addEventListener('click', function() {
        document.getElementById('password-dont-match').classList.add('d-none');
        document.getElementById(redBorderId).classList.remove('pw-dont-match-border');
    })

}

function changePasswordIcon(pwId, imgId) {
    let password = getValueFromId(pwId);
    let element = getHtmlElementById(imgId)
    let passwordType = getHtmlElementById(pwId)
    
    if (password.length >= 1 && passwordType.type === "password") {
        element.src = "./assets/img/visibility_off.png"
    }    

    if (password.length === 0) { 
        element.src = "./assets/img/lock.png"
        passwordType.type = "password";
        showPwEnabled = true;
        showPwProoEnabled = true;
    }
}


function showPassword(pwId, imgId) {
    let element = getHtmlElementById(imgId)
    if (showPwEnabled) {
        element.src = "./assets/img/visibility.png";
        showPwEnabled = false;
        togglePassword(pwId);
    } else {
        element.src = "./assets/img/visibility_off.png";
        showPwEnabled = true;
        togglePassword(pwId);
    }
}

function showPasswordProof(pwId, imgId) {
    let element = getHtmlElementById(imgId)
    if (showPwProoEnabled) {
        element.src = "./assets/img/visibility.png";
        showPwProoEnabled = false;
        togglePassword(pwId);
    } else {
        element.src = "./assets/img/visibility_off.png";
        showPwProoEnabled = true;
        togglePassword(pwId);
    }
}


function togglePassword(pwId) {
    let passwordInput = getHtmlElementById(pwId)
    if (passwordInput.type === "password") {
      passwordInput.type = "text";
    } else {
      passwordInput.type = "password";
    }
  }





async function registerUser() {
    if (!passworVerification()) {
        return;
    }

    let emailSign = getValueFromId('email-sign');
    let emailExists = userDataBase.find(user => user['email'] === emailSign);
    if (emailExists) {
        alert('E-Mail-Adresse bereits registriert');
    } else {
        id = userDataBase[userDataBase.length - 1]['id'];
        let user = {
            "id": id += 1,
            "name": getValueFromId('name'),
            "email": emailSign,
            "password": getValueFromId('password-signup'),
            "tasks": [],
            "contacts": [],
        };
        userDataBase.push(user);
        await setItem('userDataBase', JSON.stringify(userDataBase));
        resetForm();
        renderRegSuccesInfo();
    }
}


function renderRegSuccesInfo() {
    let content = document.getElementById('content');
    content.innerHTML += renderRegSuccesInfoHtml();
    setTimeout(FadeInOutRegSuccesBox, 250);
    
}

function FadeInOutRegSuccesBox() {
    document.getElementById('registration-succes-box').classList.add('show-reg-box')
    setTimeout(removeQuickinfo, 2000); 
    setTimeout(renderLogIn, 2000)
}


function removeQuickinfo() {
    let div = document.getElementById('animation-box')
    div.remove()
}


function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email-sign').value = '';
    document.getElementById('password-signup').value = '';
    document.getElementById('password-proof').value = '';
}


function renderRegSuccesInfoHtml() {
    return /*html*/ `
        <div id="animation-box" class="animation-box">
            <div id="registration-succes-box" class="registration-succes-box">
                <h4>You Signed Up successfully</h4>
            </div>
        </div>
    `;
}



