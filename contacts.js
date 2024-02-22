const STORAGE_TOKEN = 'PMSYFRVR552SZW6MAG0T95301L1BCNVFHWSKVHMK';
const STORAGE_URL = 'https://remote-storage.developerakademie.org/item';
let contacts = [
    // {
    //     'name' : 'Okan Kaplan',
    //     'telefon' : '+49 176 12345678',
    //     'email' : 'okan149@gmail.com'
    // }
];



async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, { method: 'POST', body: JSON.stringify(payload) })
        .then(res => res.json());
}

async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url).then(res => res.json()).then(res => {
        // Verbesserter code
        if (res.data) { 
            return res.data.value;
        } throw `Could not find data with key "${key}".`;
    });
}
async function init(){
    loadContacts();
}
async function loadContacts(){
    try {
        const result = await getItem('contacts');
        contacts = JSON.parse(result);
    } catch(e){
        console.error('Loading error:', e);
        contacts = []; // Initialisiere contacts als leeres Array, wenn der Schlüssel nicht gefunden wird
    }
}

async function register() {
    saveBtn.disabled = true;
    let name = document.getElementById('name').value;
    let email = document.getElementById('email').value;
    let telefon = document.getElementById('telefon').value;

    contacts.push({
        name: name,
        email: email,
        telefon: telefon,
    });
    await setItem('contacts', JSON.stringify(contacts));
}

