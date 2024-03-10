let contacts = [];
let contactStatus = false;
let showEditOptionsStatus;
let contactOpenedStatus = false;
let contactIndex;
let userDataBase;
let lastClickedContactId = null;

async function initContacts() {
  renderContacts();
  await includeHTML();
  navigationHighlight("contact-link");
  checkUserloggedIn();
  loadContacts();
  getScreenSize();
}

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

 async function addValueToContact() {
  let name = document.getElementById("name").value;
  let email = document.getElementById("email").value;
  let phone = document.getElementById("phone").value;
  const bgrColor = getRandomColor();
  let contact = {
    name: name,
    email: email,
    phone: phone,
    bgrColor: bgrColor,
  };
  userDataBase[userObject["id"]].contacts.push(contact);
  await setItem("userDataBase", JSON.stringify(userDataBase));
}

async function createContact() {
  createContactBtn.disabled = true;
  addValueToContact();
  renderContacts();
  closeAddContactCard();
  clearForm();
  createContactAnimation();
}

function createContactAnimation() {
  document.getElementById("centerAddContactAnimation").classList.add("active");
  document.getElementById("createContactAnimation").classList.add("active");
  setTimeout(function () {
    document
      .getElementById("centerAddContactAnimation")
      .classList.remove("active");
    document
      .getElementById("createContactAnimation")
      .classList.remove("active");
  }, 2500);
}

function clearForm() {
  document.getElementById("name").value = "";
  document.getElementById("email").value = "";
  document.getElementById("phone").value = "";
}

function extractInitials(contact) {
  const firstLetter = contact.name[0].toUpperCase();
  const parts = contact.name.split(" ");
  const lastName = parts[parts.length - 1];
  const secondLetter = lastName[0].toUpperCase();
  return { firstLetter, secondLetter };
}

function renderContacts() {
  const sortedContacts = contacts.sort((a, b) => a.name.localeCompare(b.name));
  const contactsContainer = document.getElementById("contactsList");
  let content = "";
  let currentLetter = "";
  for (let i = 0; i < sortedContacts.length; i++) {
    const contact = sortedContacts[i];
    const { firstLetter, secondLetter } = extractInitials(contact);
    if (currentLetter !== firstLetter) {
      currentLetter = firstLetter;
      content += generateHeadline(currentLetter);
    }
    content += generateContacts(contact.email,contact.name,secondLetter,firstLetter,i,contact.bgrColor);
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

function closeContactList() {
  contactsList.style.display = "none";
  addContactImg.style.display = "none";
  contact.style.display = "flex";
  document.getElementById("center-contacts").classList.remove("center");
  contact.style.backgroundColor = "#F6F7F8";
}
let screenSize;
window.addEventListener("resize", getScreenSize);

function getScreenSize() {
  screenSize = window.innerWidth;
  console.log(screenSize);
}

function openContact(i) {
  if (!contactStatus) {
    closeContactList();
    showContact(i);
    addBgrColorContact(i);
    if (screenSize <= 1440) {
      contactStatus = true;
    }
  }
}
function addBgrColorContact(i) {
  if (screenSize > 1440) {
    document.getElementById("sloganContainerDesktop").classList.add("d-none");
    if (lastClickedContactId !== null) {
      let lastContactElement = document.getElementById(lastClickedContactId);
      if (lastContactElement) {
        lastContactElement.classList.remove("contact-background-color-clicked");
      }
    }
    let contactElement = document.getElementById(i.toString());
    if (contactElement) {
      contactElement.classList.add("contact-background-color-clicked");
      lastClickedContactId = i.toString();
    }
  }
}

function showContact(i) {
  contactIndex = i;
  contactOpenedStatus = true;
  let content = document.getElementById("contact");
  content.innerHTML = "";
  let contact = contacts[i];
  const { firstLetter, secondLetter } = extractInitials(contact);
  const name = contact.name;
  const phone = contact.phone;
  const email = contact.email;
  const bgrColor = contact.bgrColor;
  content.innerHTML += generateContact(firstLetter,secondLetter,name,phone,email,i,bgrColor
  );
}

function closeContactStyles() {
  contactsList.style.display = "block";
  addContactImg.style.display = "flex";
  contact.style.display = "none";
  document.getElementById("center-contacts").classList.add("center");
  contact.style.backgroundColor = "#FFFFFF";
  document.getElementById(contactIndex.toString()).classList.remove('contact-background-color-clicked');
}

function closeContact() {
  if (contactStatus || screenSize <= 1440 || screenSize >= 1440) {
   closeContactStyles();
  }
  if (screenSize > 1440) {
    document.getElementById("sloganContainerDesktop").classList.remove("d-none");
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
  document.getElementById("editContactCard").classList.remove("active");
  editContactCard.classList.remove("active");
  editContactOptions.style.display = "flex";
  setTimeout(() => {
    centerEditCard.classList.remove("active");
    editContactImg.classList.add("flex");
    overlayContacts.style.display = "none";
  }, 500);
}

function openEditContactCard(contactIndex) {
  document.getElementById("centerEditCard").classList.add("active");
  document.getElementById("editContactCard").classList.add("active");
  editContactOptions.style.display = "none";
  addContactImg.style.display = "none";
  overlayContacts.style.display = "block";
  document.getElementById("edit-name").value = contacts[contactIndex].name;
  document.getElementById("edit-email").value = contacts[contactIndex].email;
  document.getElementById("edit-phone").value = contacts[contactIndex].phone;
}

async function updateContact() {
  let name = document.getElementById("edit-name").value;
  let email = document.getElementById("edit-email").value;
  let phone = document.getElementById("edit-phone").value;
  contacts[contactIndex] = { name, email, phone, bgrColor };
  userDataBase[userObject["id"]].contacts = contacts;
  await setItem("userDataBase", JSON.stringify(userDataBase));
  renderContacts();
  closeEditContactCard();
  showContact(contactIndex);
}

async function deleteContact() {
  contacts.splice(contactIndex, 1);
  await setItem("userDataBase", JSON.stringify(userDataBase));
  renderContacts();
  closeContact();
  closeEditContactCard();
}

function openAddContact() {
  document.getElementById("center-add-card").classList.add("active");
  document.getElementById("addContactCard").classList.add("active");
  addContactImg.style.display = "none";
  overlayContacts.style.display = "block";
}

function closeAddContactCard() {
  const addContactCard = document.getElementById("addContactCard");
  const centerAddCard = document.getElementById("center-add-card");
  addContactCard.classList.remove("active");
  setTimeout(() => {
    centerAddCard.classList.remove("active");
    addContactImg.style.display = "flex";
    overlayContacts.style.display = "none";
  }, 500);
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

function generateContacts(email, name, secondLetter, firstLetter, i, bgrColor) {
  return /*HTML*/ `
      <div class="contact" id="${i}" onclick="openContact(${i})">
          <div class="contact-header" style="background-color: ${bgrColor};">
              <span>${firstLetter}${secondLetter}</span>
          </div> 
          <div class="contact-info">
              <div class="name">${name}</div>
              <div class="email-contact">${email}</div>
          </div>
      </div>
      `;
}

function generateContact(
  firstLetter,
  secondLetter,
  name,
  phone,
  email,
  i,
  bgrColor
) {
  return /*HTML*/ `
  <div class="contact-container" id=${i}>
    <div class="back-to-contacts-img">
    <img onclick="closeContact()" src="assets/img/back.png" alt="">
    </div>
    <div>
      
    </div>
    <div class="slogan-show-contact">
      <h1>Contacts</h1>
      <div class="contact-line-desktop"  style="display: none"></div>
      <span class="slogan-contact">Better with a Team</span>
      <div class="contact-underline"></div>
    </div>
  
  <div class="name-container">
    <div class="contact-header contact-opened" style="background-color: ${bgrColor};">
      <span><h3>${firstLetter}${secondLetter}</h3></span>
  </div>
  <div>
<div id="contactOpenedName" class="name">
        <h2>${name}</h2>
      </div>
      <div class="edit-delete-desktop">
      <div onclick="openEditContactCard(${contactIndex})" class="edit-image-contact">
        <img src="/assets/img/edit-task.png" alt="">Edit
      </div>
      <div class="center-img-text" onclick="deleteContact()">
        <img src="/assets/img/delete.png" alt=""> Delete
      </div>
  </div>
      
    </div>
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
    <div onclick="openEditContactCard(${contactIndex})" class="edit-image-contact"><img src="/assets/img/edit-task.png" alt="">Edit</div>
    <div onclick="deleteContact()"><img src="/assets/img/delete.png" alt="">Delete</div>
   </div>
</div>
    `;
}
