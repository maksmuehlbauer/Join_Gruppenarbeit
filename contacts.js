const STORAGE_TOKEN = "PMSYFRVR552SZW6MAG0T95301L1BCNVFHWSKVHMK";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";
let contacts = [];
let contactStatus = false;

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
  let phone = document.getElementById("phone").value;
  contacts.push({
    name: name,
    email: email,
    phone: phone,
  });
  await setItem("contacts", JSON.stringify(contacts));
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
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
    const parts = contact.name.split(" ");
    const lastName = parts[parts.length - 1];
    const secondLetter = lastName[0].toUpperCase();

    if (currentLetter !== firstLetter) {
      currentLetter = firstLetter;
      content += `
                <div>
                    <h4 class="contact-headline-letter">${currentLetter}</h4>
                    <div class="underline"></div>
                </div>`;
    }
    content += generateContacts(contact.email,contact.name,secondLetter,
      firstLetter,i);
    getRandomColor();
  }
  contactsContainer.innerHTML = content;
}

function generateContacts(email, name, secondLetter, firstLetter, i) {
  const contactHeaderColor = getRandomColor();
  return /*HTML*/ `
      <div class="contact" id="${i}" onclick="openContact(${i})">
          <div class="contact-header" style="background-color: ${contactHeaderColor};">
              <span>${firstLetter}${secondLetter}</span>
          </div> 
          <div class="contact-info">
              <div class="name">${name}</div>
              <div class="email-contact">${email}</div>
          </div>
      </div>
      `;
}

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function openContact(i) {
  if(!contactStatus) {
    contactsList.style.display = "none";
    addContactImg.style.display = "none";
    contact.style.display = "flex";
    showContact(i);
    document.getElementById('center-contacts').classList.remove('center');
    contact.style.backgroundColor = '#F6F7F8';
  }
  contactStatus = true;
}

function closeContact() {
  if(contactStatus){
    contactsList.style.display = "block";
  addContactImg.style.display = "flex";
  contact.style.display = "none";
  document.getElementById('center-contacts').classList.add('center');
  contact.style.backgroundColor = '#FFFFFF';
  }
  contactStatus = false;
}

function showContact(i) {
  let content = document.getElementById("contact");
  content.innerHTML = "";
  let contact = contacts[i];
  const firstLetter = contact.name[0].toUpperCase();
  const parts = contact.name.split(" ");
  const lastName = parts[parts.length - 1];
  const secondLetter = lastName[0].toUpperCase();
  const contactHeaderColor = getRandomColor();
  const name = contact.name;
  const phone = contact.telefon;
  const email = contact.email;
  content.innerHTML += 
  generateContact(firstLetter, secondLetter, name,
                  phone,email ,contactHeaderColor);
}

function generateContact(firstLetter, secondLetter, name, telefon,email ,contactHeaderColor) {
  return /*HTML*/ `
  <div class="contact-container">
    <div class="back-to-contacts-img">
    <img onclick="closeContact()" src="assets/img/back.png" alt="">
    </div>
  <h1>Contacts</h1>
  <span class="slogan-contact">Better with a Team</span>
  <div class="contact-underline"></div>
  <div class="name-container">
    <div class="contact-header contact-opened" style="background-color: ${contactHeaderColor};">
      <span><h3>${firstLetter}${secondLetter}</h3></span>
  </div>
      <div class="name"><h2>${name}</h2></div>
  </div> 
  <div>
  <h4>Contact Information</h4>
  <p class="email-contact-opened">Email</p>
      <div class="email-contact">${email}</div>
      <p class="email-contact-opened">Phone</p>
      <div class="phone-contact">${telefon}</div>
      
  </div>
   <div class="editContactImg" onclick="showEditOptions()">
   <img src="/assets/img/more_vert.png" alt="">
   </div>
</div>
    `;
}

