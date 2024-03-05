// const STORAGE_TOKEN = "PMSYFRVR552SZW6MAG0T95301L1BCNVFHWSKVHMK";
// const STORAGE_URL = "https://remote-storage.developerakademie.org/item";
let contacts = [];
let contactStatus = false;
let showEditOptionsStatus;
let contactOpenedStatus = false;
let contactIndex;

// async function setItem(key, value) {
//   const payload = { key, value, token: STORAGE_TOKEN };
//   return fetch(STORAGE_URL, {
//     method: "POST",
//     body: JSON.stringify(payload),
//   }).then((res) => res.json());
// }

// async function getItem(key) {
//   const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
//   return fetch(url)
//     .then((res) => res.json())
//     .then((res) => {
//       if (res.data) {
//         return res.data.value;
//       }
//       throw `Could not find data with key "${key}".`;
//     });
// }

async function initContacts() {
  renderContacts();
  await includeHTML();
  navigationHighlight('contact-link');
  checkUserloggedIn();
  loadContacts();
}
let userDataBase;
async function loadContacts() {
  try {
    const result = await getItem("userDataBase");
    userDataBase = JSON.parse(result);
    contacts = userDataBase[userObject["id"]].contacts;
  } catch (e) {
    console.error("Loading error:", e);
    contacts = [];
  }
  renderContacts();
}

async function createContact() {
  createContactBtn.disabled = true;
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  let contact = {
      name: name,
      email: email,
      phone: phone,
  }
  userDataBase[userObject["id"]].contacts.push(contact);
  await setItem("userDataBase", JSON.stringify(userDataBase));
  renderContacts();
  closeAddContactCard();
  clearForm();
}

function clearForm() {
  let saveBtn = document.getElementById('saveBtn');
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
      content += generateHeadline(currentLetter);
    }
    content += generateContacts(contact.email,contact.name,secondLetter,firstLetter,i);
  }
  contactsContainer.innerHTML = content;
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
  if (!contactStatus) {
    contactsList.style.display = "none";
    addContactImg.style.display = "none";
    contact.style.display = "flex";
    showContact(i);
    document.getElementById("center-contacts").classList.remove("center");
    contact.style.backgroundColor = "#F6F7F8";
  }
  contactStatus = true;
}

function showContact(i) {
  contactIndex = i;
  contactOpenedStatus = true;
  let content = document.getElementById("contact");
  content.innerHTML = "";
  let contact = contacts[i];
  const firstLetter = contact.name[0].toUpperCase();
  const parts = contact.name.split(" ");
  const lastName = parts[parts.length - 1];
  const secondLetter = lastName[0].toUpperCase();
  const contactHeaderColor = getRandomColor();
  const name = contact.name;
  const phone = contact.phone;
  const email = contact.email;
  content.innerHTML += generateContact(firstLetter,secondLetter,name,phone,email,contactHeaderColor,i);
}


function closeContact() {
  if (contactStatus) {
    contactsList.style.display = "block";
    addContactImg.style.display = "flex";
    contact.style.display = "none";
    document.getElementById("center-contacts").classList.add("center");
    contact.style.backgroundColor = "#FFFFFF";
  }
  contactStatus = false;
  contactOpenedStatus = false;
}

function showEditOptions() {
  let editOptions = document.getElementById("editContactOptions");
  editOptions.classList.add("edit-contacts-options-active");
  editContactImg.style.display = "none";
  showEditOptionsStatus = false;
}

function closeEditContactCard() {
  document.getElementById("centerEditCard").classList.remove("active");
  document.getElementById("editContactCard").classList.remove("active");
  editContactCard.classList.remove("active");
  editContactOptions.style.display = 'flex';
  setTimeout(() => {
    centerEditCard.classList.remove("active");
    editContactImg.classList.add("flex");
    overlayContacts.style.display = 'none';}, 500); 
}

function openEditContact(contactIndex) {
  document.getElementById("centerEditCard").classList.add("active");
  document.getElementById("editContactCard").classList.add("active");
  editContactOptions.style.display = 'none';
  addContactImg.style.display = 'none';
  overlayContacts.style.display = 'block';
  document.getElementById("edit-name").value = contacts[contactIndex].name;
  document.getElementById("edit-email").value = contacts[contactIndex].email;
  document.getElementById("edit-phone").value = contacts[contactIndex].phone;
}

async function updateContact() {
  let name = document.getElementById("edit-name").value;
  let email = document.getElementById("edit-email").value;
  let phone = document.getElementById("edit-phone").value;
  contacts[contactIndex] = {name, email, phone};
  await setItem("contacts", JSON.stringify(contacts)); 
  renderContacts();
  closeEditContactCard();

}
async function deleteContact() {
    contacts.splice(contactIndex, 1)
    await setItem("contacts", JSON.stringify(contacts)); 
    renderContacts();
    closeContact();
}

function openAddContact() {
  document.getElementById("center-add-card").classList.add("active");
  document.getElementById("addContactCard").classList.add("active");
  addContactImg.style.display = 'none';
  overlayContacts.style.display = 'block';
}

function closeAddContactCard() {
  const addContactCard = document.getElementById("addContactCard");
  const centerAddCard = document.getElementById("center-add-card");
  addContactCard.classList.remove("active");
  setTimeout(() => {
    centerAddCard.classList.remove("active");
    addContactImg.style.display = 'flex';
    overlayContacts.style.display = 'none';}, 500); 
}

document.addEventListener("click", function (event) {
  if (contactOpenedStatus) {
    let isClickInsideOptions = document.getElementById("editContactOptions").contains(event.target);
    let isClickInsideImg = document.getElementById("editContactImg").contains(event.target);
    if ((editContactOptions.style.display = "flex" && !isClickInsideImg)) {
      if (!isClickInsideOptions && !showEditOptionsStatus) {
        document.getElementById("editContactOptions").classList.remove("edit-contacts-options-active");
        editContactImg.style.display = "flex";
        showEditOptionsStatus = true;
      }
    }
  }
});

/* Templates*/

function generateHeadline(currentLetter) {
  return /*HTML*/ `
    <div>
                    <h4 class="contact-headline-letter">${currentLetter}</h4>
                    <div class="underline"></div>
                </div>
  `;
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

function generateContact(firstLetter,secondLetter,name,phone,email,contactHeaderColor,i) {
  return /*HTML*/ `
  <div class="contact-container" id=${i}>
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
      <div id="contactOpenedName" class="name"><h2>${name}</h2></div>
  </div> 
  <div>
  <h4>Contact Information</h4>
  <p class="email-contact-opened">Email</p>
      <div id="contactOpenedEmail" class="email-contact">${email}</div>
      <p class="email-contact-opened">Phone</p>
      <div id="contactOpenedPhone" class="phone-contact">${phone}</div>
  </div>
   <div id="editContactImg" class="editContactImg" onclick="showEditOptions()">
   <img src="/assets/img/more_vert.png" alt="">
   </div>
   <div class="edit-contacts-options" id="editContactOptions">
    <div onclick="openEditContact(${contactIndex})" class="edit-image-contact"><img src="/assets/img/edit-task.png" alt="">Edit</div>
    <div onclick="deleteContact()"><img src="/assets/img/delete.png" alt="">Delete</div>
   </div>
</div>
    `;
}