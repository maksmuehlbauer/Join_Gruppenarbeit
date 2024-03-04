let userDataBase = [

];

let id;


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

function passwordCheck() {
    firstPw = getValueFromId('password');
    secondPw = getValueFromId('password-proof');
    if (secondPw === firstPw) {
        alert('STIMMT')
    } else {
        alert('stimmt nicht')
    }
}


async function registerUser() {

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
            "password": getValueFromId('password'),
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

// default setTimeout(renderLogIn, 2000)

function removeQuickinfo() {
    let div = document.getElementById('animation-box')
    div.remove()
}


function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email-sign').value = '';
    document.getElementById('password').value = '';
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



