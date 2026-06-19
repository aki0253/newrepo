// Import the functions you need from the Firebase SDK
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";

import {
  getDatabase,
  ref,
  set,
  get,
  update,
  remove,
} from "https://www.gstatic.com/firebasejs/11.6.0/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCjZaAqWCzC0MuIhy5X4D8qhRAQD0ibJME",
  authDomain: "mobileapp-aki.firebaseapp.com",
  projectId: "mobileapp-aki",
  storageBucket: "mobileapp-aki.firebasestorage.app",
  messagingSenderId: "355173802928",
  appId: "1:355173802928:web:d43405378aeea04c64ec75",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

console.log("Database Connected:", db);

// ======================================================
// SET DATA (CREATE USERS)
// ======================================================

function writeUserData(
  userId,
  firstname,
  lastname,
  age,
  email,
  phone,
  address,
  gender,
  occupation,
  country,
) {
  set(ref(db, "users/" + userId), {
    firstname: firstname,
    lastname: lastname,
    age: age,
    email: email,
    phone: phone,
    address: address,
    gender: gender,
    occupation: occupation,
    country: country,
  })
    .then(() => {
      console.log(`User ${userId} added successfully`);
    })

    .catch((error) => {
      console.error("Error adding user:", error);
    });
}

// ======================================================
// ADD 10 USERS WITH 10 FIELDS
// ======================================================

writeUserData(
  1,
  "Meow Meow",
  "Biralo",
  21,
  "meowbiralo@gmail.com",
  "9800000001",
  "Kathmandu",
  "Male",
  "Student",
  "Nepal",
);

writeUserData(
  2,
  "John",
  "Doe",
  25,
  "john@gmail.com",
  "9800000002",
  "New York",
  "Male",
  "Engineer",
  "USA",
);

writeUserData(
  3,
  "Emma",
  "Watson",
  22,
  "emma@gmail.com",
  "9800000003",
  "London",
  "Female",
  "Designer",
  "UK",
);

writeUserData(
  4,
  "Michael",
  "Jordan",
  35,
  "michael@gmail.com",
  "9800000004",
  "Chicago",
  "Male",
  "Athlete",
  "USA",
);

writeUserData(
  5,
  "Sophia",
  "Smith",
  19,
  "sophia@gmail.com",
  "9800000005",
  "Toronto",
  "Female",
  "Student",
  "Canada",
);

writeUserData(
  6,
  "Daniel",
  "Lee",
  28,
  "daniel@gmail.com",
  "9800000006",
  "Seoul",
  "Male",
  "Developer",
  "South Korea",
);

writeUserData(
  7,
  "Olivia",
  "Brown",
  24,
  "olivia@gmail.com",
  "9800000007",
  "Sydney",
  "Female",
  "Teacher",
  "Australia",
);

writeUserData(
  8,
  "James",
  "Wilson",
  31,
  "james@gmail.com",
  "9800000008",
  "Berlin",
  "Male",
  "Architect",
  "Germany",
);

writeUserData(
  9,
  "Ava",
  "Taylor",
  20,
  "ava@gmail.com",
  "9800000009",
  "Paris",
  "Female",
  "Artist",
  "France",
);

writeUserData(
  10,
  "Noah",
  "Anderson",
  27,
  "noah@gmail.com",
  "9800000010",
  "Tokyo",
  "Male",
  "Manager",
  "Japan",
);

// ======================================================
// GET DATA (READ USERS)
// ======================================================

function readUsers() {
  // ref(db, 'users') points to all users
  const userRef = ref(db, "users");

  // get() reads data from Firebase
  get(userRef)
    .then((snapshot) => {
      if (snapshot.exists()) {
        console.log("Users Data:");

        // Loop through each user
        snapshot.forEach((childSnapshot) => {
          console.log(childSnapshot.key, childSnapshot.val());
        });
      } else {
        console.log("No data found");
      }
    })
    .catch((error) => {
      console.error("Error reading data:", error);
    });
}

// Call function
readUsers();

// ======================================================
// UPDATE DATA
// ======================================================

function updateUserData(userId, updatedData) {
  // Reference to a specific user
  const userRef = ref(db, "users/" + userId);

  // update() updates only specified fields
  update(userRef, updatedData)
    .then(() => {
      console.log(`User ${userId} updated successfully`);
    })
    .catch((error) => {
      console.error("Error updating user:", error);
    });
}

// Updating user 3
updateUserData(3, {
  firstname: "Emily",
  age: 23,
});

// Updating user 7
updateUserData(7, {
  lastname: "Johnson",
  email: "oliviajohnson@gmail.com",
});

// ======================================================
// REMOVE DATA (DELETE USER)
// ======================================================

function deleteUserData(userId) {
  // Reference to specific user
  const userRef = ref(db, "users/" + userId);

  // remove() deletes data
  remove(userRef)
    .then(() => {
      console.log(`User ${userId} deleted successfully`);
    })
    .catch((error) => {
      console.error("Error deleting user:", error);
    });
}

// Delete user 5
deleteUserData(5);

// ======================================================
// FINAL CHECK
// ======================================================

// Read users again after update and delete
setTimeout(() => {
  console.log("Updated Database:");
  readUsers();
}, 3000);
