let userDataBase = [];

let id = 20;


async function loadUserDataBase() {
    try {
        userDataBase = JSON.parse(await getItem('userDataBase'));
    } catch(e) {
        console.error('Loading error:', e)
    }
}

// async function deleteItemFromDatabase() {
//     userDataBase.slice(4)
//     await setItem('userDataBase', JSON.stringify(userDataBase));
// }


async function registerUser() {
    let emailSign = getValueFromId('email-sign');
    let emailExists = userDataBase.find(user => user['email'] === emailSign);
    if (emailExists) {
        alert('E-Mail-Adresse bereits registriert');
    } else {
        let user = {
            "id": id++,
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
    content.innerHTML += /*html*/ `
        <div id="animation-box">
            <div id="registration-succes-box" class="registration-succes-box">
                <h4>You Signed Up successfully</h4>
            </div>
        </div>
    `;
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
    document.getElementById('password').value = '';
    document.getElementById('password-proof').value = '';
}



