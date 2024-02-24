const STORAGE_TOKEN = "PMSYFRVR552SZW6MAG0T95301L1BCNVFHWSKVHMK";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";
let contacts = [];

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

async function setItem(key, value) {
  const payload = { key, value, token: STORAGE_TOKEN };
  return fetch(STORAGE_URL, {
    method: "POST",
    body: JSON.stringify(payload),
  }).then((res) => res.json());
}

async function getItem(key) {
  const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
  return fetch(url)
    .then((res) => res.json())
    .then((res) => {
      // Verbesserter code
      if (res.data) {
        return res.data.value;
      }
      throw `Could not find data with key "${key}".`;
    });
}
async function init() {
  loadContacts();
  renderContacts();
  await includeHTML();
}
async function loadContacts() {
  try {
    const result = await getItem("contacts");
    contacts = JSON.parse(result);
  } catch (e) {
    console.error("Loading error:", e);
    contacts = [];
  }
  renderContacts();
}

async function save() {
  saveBtn.disabled = true;
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let telefon = document.getElementById("telefon").value;
  contacts.push({
    name: name,
    email: email,
    telefon: telefon,
  });
  await setItem("contacts", JSON.stringify(contacts));
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("telefon").value = "";
  saveBtn.disabled = false;
}

function renderContacts() {
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  const contactsContainer = document.getElementById("contactsList");

  let content = "";
  let currentLetter = "";

  for (let i = 0; i < sortedContacts.length; i++) {
    const contact = sortedContacts[i];
    const firstLetter = contact.name[0].toUpperCase();
    const parts = contact.name.split(' ');
    const lastName = parts[parts.length - 1];
    const secondLetter = lastName[0].toUpperCase();

    if (currentLetter !== firstLetter) {
      currentLetter = firstLetter;
      content += `
                <div>
                    <h4>${currentLetter}</h4>
                    <div class="underline"></div>
                </div>`;
    }
    content += generateContacts(contact.email, contact.name, secondLetter,firstLetter);
    getRandomColor();
  }
  contactsContainer.innerHTML = content;
}

function generateContacts(email, name, secondLetter, firstLetter) {
    const contactHeaderColor = getRandomColor(); 
    return /*HTML*/ `
      <div class="contact">
          <div class="contact-header" style="background-color: ${contactHeaderColor};">
              <span>${firstLetter}${secondLetter}</span>
          </div> 
          <div class="contact-info">
              <div class="name">${name}</div>
              <div class="email">${email}</div>
          </div>
      </div>
      `;
  }
  
  function getRandomColor() {
      const letters = '0123456789ABCDEF';
      let color = '#';
      for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
      }
      return color;
  }