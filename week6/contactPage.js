import { initializeApp } from "https://www.gstatic.com/firebasejs/12.14.0/firebase-app.js";
import {
  getDatabase,
  ref,
  set,
  get,
  remove,
} from "https://www.gstatic.com/firebasejs/12.14.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyDGdA-9SNUTcTsEVrgDnMoU65WRBiGsymw",
  authDomain: "contact-page-41e61.firebaseapp.com",
  projectId: "contact-page-41e61",
  storageBucket: "contact-page-41e61.firebasestorage.app",
  messagingSenderId: "580370746274",
  appId: "1:580370746274:web:9a98e978a8fba4579580fb",
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Firebase Database Connected:", db);

// ==========================================
// CLEANUP UTILITIES
// ==========================================
function clearFormInputs() {
  document.getElementById("form-id").value = "";
  document.getElementById("form-username").value = "";
  document.getElementById("form-email").value = "";
  document.getElementById("form-contact").value = "";
  document.getElementById("form-address").value = "";
}

// ==========================================
// ACTION 1: SUBMIT AND DISPLAY DATA TREE
// ==========================================
function submitContactForm(userId, username, email, contact, address) {
  // Strict Guard: Prevents writing to an undefined or empty root directory
  if (!userId || userId.trim() === "") return alert("Error: User ID is blank!");

  set(ref(db, "users/" + userId.trim()), {
    userId: userId,
    username: username,
    email: email,
    contact: contact,
    address: address,
  })
    .then(() => {
      alert("User added successfully");

      console.log(
        `%c[NODE CREATED] Node: users / Child Node: ${userId}`,
        "color: #28a745; font-weight: bold;",
      );
      console.groupCollapsed(
        `Inspect Fields - Child Node: ${userId} (${username})`,
      );
      console.log(
        `userId: ${userId}\n` +
          `username: "${username}"\n` +
          `email: "${email}"\n` +
          `contact: "${contact}"\n` +
          `address: "${address}"`,
      );
      console.groupEnd();

      clearFormInputs();
    })
    .catch((error) => console.error("Submission Error:", error));
}

// ==========================================
// ACTION 2: DISPLAY ALL DROP DOWNS
// ==========================================
function readAllUsers() {
  get(ref(db, "users")).then((snapshot) => {
    if (!snapshot.exists()) {
      console.log("Database path 'users/' is empty.");
      return;
    }

    console.log(
      `%c--- Reading Whole Database Tree Node: users ---`,
      "color: #0056b3; font-weight: bold;",
    );
    snapshot.forEach((childsnapshot) => {
      const data = childsnapshot.val();

      console.groupCollapsed(
        `Node: users / Child Node: ${childsnapshot.key} (${data.username})`,
      );
      console.log(
        `userId: ${data.userId}\n` +
          `username: "${data.username}"\n` +
          `email: "${data.email}"\n` +
          `contact: "${data.contact}"\n` +
          `address: "${data.address}"`,
      );
      console.groupEnd();
    });
  });
}

// ==========================================
// ACTION 3: VIEW FULL DISPLAY BY USER ID
// ==========================================
function viewFullForm(userId) {
  if (!userId || userId.trim() === "")
    return alert("Please enter a User ID first.");

  get(ref(db, "users/" + userId.trim())).then((snapshot) => {
    const displayBox = document.getElementById("display-result");
    if (snapshot.exists()) {
      const data = snapshot.val();

      console.log(
        `%c[READ ACTION] Node: users / Child Node: ${userId}`,
        "color: #17a2b8; font-weight: bold;",
      );

      displayBox.innerText =
        `Node: users / Child Node: ${userId}\n` +
        `-----------------------------------------\n` +
        `userId: ${data.userId}\n` +
        `username: ${data.username}\n` +
        `email: ${data.email}\n` +
        `contact: ${data.contact}\n` +
        `address: ${data.address}`;
      displayBox.style.display = "block";
    } else {
      displayBox.innerText = `Child Node ${userId} not found in database path 'users/'.`;
      displayBox.style.display = "block";
    }
  });
}

// ==========================================
// ACTION 4: VIEW ONLY CONDENSED CONTACT INFO
// ==========================================
function viewQuickContact(userId) {
  if (!userId || userId.trim() === "")
    return alert("Please enter a User ID first.");

  get(ref(db, "users/" + userId.trim())).then((snapshot) => {
    const displayBox = document.getElementById("display-result");
    if (snapshot.exists()) {
      const data = snapshot.val();

      console.log(
        `%c[READ QUICK VIEW] Node: users / Child Node: ${userId}`,
        "color: #17a2b8; font-weight: bold;",
      );

      displayBox.innerText =
        `Node: users / Child Node: ${userId} (Quick View)\n` +
        `-----------------------------------------\n` +
        `username: ${data.username}\n` +
        `contact: ${data.contact}\n` +
        `email: ${data.email}`;
      displayBox.style.display = "block";
    } else {
      displayBox.innerText = `Child Node ${userId} not found in database path 'users/'.`;
      displayBox.style.display = "block";
    }
  });
}

// ==========================================
// ACTION 5: SAFE REMOVE SUBMITTED FIELD
// ==========================================
function removeForm(userId) {
  // CRITICAL GUARD RAIL: Clean and validate the string to block root space elimination
  if (!userId || userId.trim() === "") {
    return alert("Please specify a valid User ID to remove!");
  }

  const targetId = userId.trim();
  const userRef = ref(db, "users/" + targetId);

  get(userRef).then((snapshot) => {
    if (!snapshot.exists()) {
      alert(`User ID ${targetId} does not exist inside the database.`);
      return;
    }

    remove(userRef)
      .then(() => {
        console.log(
          `%c[DELETED NODE] Node: users / Child Node: ${targetId}`,
          "color: #dc3545; font-weight: bold;",
        );
        alert(`User ${targetId} deleted successfully`);

        // Clear out UI search and removal boxes cleanly
        document.getElementById("display-result").style.display = "none";
        document.getElementById("remove-id").value = "";
        document.getElementById("search-id").value = "";
      })
      .catch((error) => console.error("Deletion Error:", error));
  });
}

// ==========================================
// DOM INTERACTION BRIDGE
// ==========================================
function handleSubmitForm() {
  const id = document.getElementById("form-id").value;
  const name = document.getElementById("form-username").value;
  const mail = document.getElementById("form-email").value;
  const phone = document.getElementById("form-contact").value;
  const addr = document.getElementById("form-address").value;

  if (!id || id.trim() === "") return alert("You must provide a User ID!");

  submitContactForm(id, name, mail, phone, addr);
}

window.handleSubmitForm = handleSubmitForm;
window.readAllUsers = readAllUsers;
window.viewFullForm = viewFullForm;
window.viewQuickContact = viewQuickContact;
window.removeForm = removeForm;
