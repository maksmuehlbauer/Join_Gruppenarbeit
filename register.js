let userDataBase = [];

let id = 20;


async function loadUserDataBase() {
    try {
        userDataBase = JSON.parse(await getItem('userDataBase'));
    } catch(e) {
        console.error('Loading error:', e)
    }
}


async function registerUser() {
    let emailSign = getValueFromId('email-sign');
    console.log(emailSign);

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
    }
}


function resetForm() {
    document.getElementById('name').value = '';
    document.getElementById('email-sign').value = '';
    document.getElementById('password').value = '';
    document.getElementById('password-proof').value = '';
}



