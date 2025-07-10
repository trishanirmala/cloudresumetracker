import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBwanhThBXB_D1D84RIL8ChmMmUe-mhUXA",
  authDomain: "cloudresumetracker.firebaseapp.com",
  projectId: "cloudresumetracker",
  storageBucket: "cloudresumetracker.appspot.com",
  messagingSenderId: "493749746776",
  appId: "1:493749746776:web:904dced2d76f3c46241e2d"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Add Application
const form = document.getElementById("applicationForm");
if (form) {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const company = form.company.value.trim();
    const role = form.role.value.trim();
    const date = form.date.value;
    const status = form.status.value;

    if (company && role && date && status) {
      try {
        await addDoc(collection(db, "applications"), {
          company,
          role,
          date,
          status
        });
        alert("✅ Thank you! Your application has been saved.");
        form.reset();
      } catch (err) {
        alert("Error adding application: " + err.message);
      }
    } else {
      alert("Please fill out all fields.");
    }
  });
}

// View Applications
const container = document.getElementById("applicationList");
if (container) {
  async function loadApplications() {
    const querySnapshot = await getDocs(collection(db, "applications"));
    container.innerHTML = "";
    if (querySnapshot.empty) {
      container.innerHTML = "<p>No applications found.</p>";
    } else {
      querySnapshot.forEach((docSnap) => {
        const data = docSnap.data();
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
          <h3>🏢 ${data.company}</h3>
          <p><strong>Role:</strong> ${data.role}</p>
          <p><strong>Date:</strong> ${data.date}</p>
          <p><strong>Status:</strong> ${data.status}</p>
          <button class="delete-btn" onclick="removeApplication('${docSnap.id}')">Delete</button>
        `;
        container.appendChild(card);
      });
    }
  }
  loadApplications();
}

// Delete Application
window.removeApplication = async function (id) {
  if (confirm("Are you sure you want to delete this application?")) {
    await deleteDoc(doc(db, "applications", id));
    alert("Deleted successfully");
    location.reload();
  }
};
