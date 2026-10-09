// =========================
// PREETI STUDIO ADMIN PANEL
// =========================

// Backend API URL
const API_URL =
  window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
    ? "http://localhost:3000"
    : "https://preeti-studio-backend.onrender.com";


// =========================
// ELEMENTS
// =========================

const loginCard = document.getElementById("loginCard");
const dashboard = document.getElementById("dashboard");

const loginForm = document.getElementById("loginForm");
const adminPassword = document.getElementById("adminPassword");
const loginError = document.getElementById("loginError");

const logoutBtn = document.getElementById("logoutBtn");
const refreshBtn = document.getElementById("refreshBtn");

const bookingsContainer =
  document.getElementById("bookingsContainer");

const totalBookings =
  document.getElementById("totalBookings");

const bookingSearch =
  document.getElementById("bookingSearch");

const bookingDateFilter =
  document.getElementById("bookingDateFilter");
const bookingDateDisplay =
  document.getElementById("bookingDateDisplay");

const clearFiltersBtn =
  document.getElementById("clearFiltersBtn");
const deleteModeBtn =
  document.getElementById("deleteModeBtn");
let deleteMode = false;
let selectedBookings = new Set();  
// const dateFilterText =
//   document.getElementById("dateFilterText");


// =========================
// ADMIN PASSWORD
// =========================

let currentPassword = "";


// =========================
// ALL BOOKINGS
// =========================

let allBookings = [];


// =========================
// LOGIN
// =========================

loginForm.addEventListener("submit", async (event) => {

  event.preventDefault();

  const password = adminPassword.value.trim();

  if (!password) {
    loginError.textContent = "Please enter your admin password.";
    return;
  }

  loginError.textContent = "Checking password...";

  try {

    const response = await fetch(
      `${API_URL}/api/admin/bookings`,
      {
        method: "GET",

        headers: {
          "x-admin-password": password
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {

      loginError.textContent =
        data.message || "Invalid admin password.";

      return;
    }

    // Password is kept only in memory
    currentPassword = password;

    // Store all bookings
    allBookings = data.bookings || [];
    totalBookings.textContent = allBookings.length;

    // Show dashboard
    loginCard.hidden = true;
    dashboard.hidden = false;

    loginError.textContent = "";

    // Display bookings
    displayBookings(allBookings);

  } catch (error) {

    console.error(error);

    loginError.textContent =
      "Unable to connect to the server.";
  }

});


// =========================
// LOAD BOOKINGS
// =========================

async function loadBookings() {

  if (!currentPassword) {
    return;
  }

  bookingsContainer.innerHTML =
    `<p class="loading-message">Loading bookings...</p>`;

  try {

    const response = await fetch(
      `${API_URL}/api/admin/bookings`,
      {
        method: "GET",

        headers: {
          "x-admin-password": currentPassword
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {

      bookingsContainer.innerHTML =
        `<p class="empty-message">${data.message || "Failed to load bookings."}</p>`;

      return;
    }

    // Update all bookings
    allBookings = data.bookings || [];
    totalBookings.textContent = allBookings.length;

    // Display all bookings
    displayBookings(allBookings);

  } catch (error) {

    console.error(error);

    bookingsContainer.innerHTML =
      `<p class="empty-message">
        Unable to connect to the server.
      </p>`;
  }

}


// =========================
// DISPLAY BOOKINGS
// =========================


function displayBookings(bookings) {
  if (!bookings || bookings.length === 0) {
    bookingsContainer.innerHTML =
      `<p class="empty-message">No bookings found.</p>`;
    return;
  }

  bookingsContainer.innerHTML = "";

  bookings.forEach((booking) => {
    const bookingCard = document.createElement("div");
    bookingCard.className = "booking-card";

    const createdDate = booking.createdAt
      ? new Date(booking.createdAt).toLocaleString("en-IN")
      : "N/A";

    const checkboxHTML = deleteMode
      ? `
        <label class="booking-select">
          <input
            type="checkbox"
            class="booking-checkbox"
            data-id="${escapeHTML(booking._id || "")}"
            ${selectedBookings.has(booking._id) ? "checked" : ""}
          >
          <span>Select</span>
        </label>
      `
      : "";

    const events = Array.isArray(booking.events)
      ? booking.events
      : [];

    const eventHTML = events.length
      ? events.map((event, index) => {
          const services = Array.isArray(event.services)
            ? event.services.join(", ")
            : "N/A";

          return `
            <div class="event-detail">
              <h4>Event ${index + 1}: ${escapeHTML(event.type || "N/A")}</h4>
              <div>
                <span>Event Date</span>
                ${escapeHTML(event.date || "N/A")}
              </div>
              <div>
                <span>Start Time</span>
                ${escapeHTML(event.startTime || "N/A")}
              </div>
              <div>
                <span>End Date</span>
                ${escapeHTML(event.endDate || "N/A")}
              </div>
              <div>
                <span>End Time</span>
                ${escapeHTML(event.endTime || "N/A")}
              </div>
              <div>
                <span>Selected Services</span>
                ${escapeHTML(services)}
              </div>
            </div>
          `;
        }).join("")
      : `
        <p class="empty-message">
          Detailed event information is not available for this booking.
        </p>
      `;

    const guardian = booking.guardian || {};
    const bookingPerson = booking.bookingPerson || {};

    bookingCard.innerHTML = `
      ${checkboxHTML}

      <h3>${escapeHTML(booking.name || bookingPerson.name || "Unknown Client")}</h3>

      <div class="booking-info">
      
<div style="grid-column: 1 / -1;">
  <span>Unique Request ID</span>
  <div style="display: flex; align-items: center; gap: 10px; flex-wrap: wrap;">
    <code style="color: var(--gold); overflow-wrap: anywhere;">${escapeHTML(booking.requestId || "Not available")}</code>
    ${
      booking.requestId
        ? `<button
             type="button"
             class="copy-request-id-btn"
             data-request-id="${escapeHTML(booking.requestId)}"
             style="padding: 6px 10px; border: 1px solid var(--border); border-radius: 6px; background: #222; color: white; cursor: pointer;"
           >Copy ID</button>`
        : ""
    }
  </div>
</div>

        <div>
          <span>Booking Person Name</span>
          ${escapeHTML(bookingPerson.name || booking.name || "N/A")}
        </div>

        <div>
          <span>Phone</span>
          ${escapeHTML(booking.phone || bookingPerson.phone || "N/A")}
        </div>

        <div>
          <span>Booking Email</span>
          ${escapeHTML(booking.bookingEmail || bookingPerson.email || "N/A")}
        </div>

        <div>
          <span>Event Side</span>
          ${escapeHTML(booking.eventSide || "N/A")}
        </div>

        <div>
          <span>Event Location</span>
          ${escapeHTML(booking.eventLocation || booking.location || "N/A")}
        </div>

        <div>
          <span>Guardian Is Booking Person</span>
          ${guardian.isSelf === true ? "Yes" : guardian.isSelf === false ? "No" : "N/A"}
        </div>

        <div>
          <span>Guardian Name</span>
          ${escapeHTML(guardian.name || "N/A")}
        </div>

        <div>
          <span>Guardian Phone</span>
          ${escapeHTML(guardian.phone || "N/A")}
        </div>

        <div>
          <span>Guardian Email</span>
          ${escapeHTML(guardian.email || "N/A")}
        </div>

        <div>
          <span>Booking Created</span>
          ${escapeHTML(createdDate)}
        </div>

        <div style="grid-column: 1 / -1;">
          <span>Message</span>
          ${escapeHTML(booking.message || "No message")}
        </div>
      </div>

      <h4 class="events-heading">Event Schedule & Services</h4>
      <div class="events-list">
        ${eventHTML}
      </div>

      <button
        type="button"
        class="delete-booking-btn"
        data-id="${escapeHTML(booking._id || "")}"
      >Delete Booking</button>
    `;

    bookingsContainer.appendChild(bookingCard);
    
const copyIdBtn = bookingCard.querySelector(".copy-request-id-btn");

if (copyIdBtn) {
  copyIdBtn.addEventListener("click", async () => {
    const requestId = copyIdBtn.dataset.requestId;

    try {
      await navigator.clipboard.writeText(requestId);
      copyIdBtn.textContent = "Copied!";
      setTimeout(() => {
        copyIdBtn.textContent = "Copy ID";
      }, 1500);
    } catch (error) {
      alert("ID copy nahi hua. Please manually copy karein.");
    }
  });
}


    const checkbox = bookingCard.querySelector(".booking-checkbox");

    if (checkbox) {
      checkbox.addEventListener("change", () => {
        if (checkbox.checked) {
          selectedBookings.add(booking._id);
        } else {
          selectedBookings.delete(booking._id);
        }

        if (selectedBookings.size === 0) {
          deleteMode = false;
          selectedBookings.clear();
          displayBookings(getFilteredBookings());
          updateDeleteButton();
          return;
        }

        updateDeleteButton();
      });
    }

    const deleteBtn = bookingCard.querySelector(".delete-booking-btn");

    deleteBtn.addEventListener("click", async () => {
      const confirmed = confirm(
        `Are you sure you want to delete the booking of ${booking.name || "this client"}?`
      );

      if (!confirmed) return;

      deleteBtn.disabled = true;
      deleteBtn.textContent = "Deleting...";

      try {
        const response = await fetch(
          `${API_URL}/api/admin/bookings/${encodeURIComponent(booking._id)}`,
          {
            method: "DELETE",
            headers: {
              "x-admin-password": currentPassword
            }
          }
        );

        
        const responseText = await response.text();
        
        let data;
        
        try {
          data = JSON.parse(responseText);
        } catch (error) {
          console.error("Delete API response:", {
            status: response.status,
            url: response.url,
            response: responseText
          });
        
          throw new Error(
            `Server returned HTML instead of JSON. HTTP status: ${response.status}. Check browser Console.`
          );
        }


        if (!response.ok) {
          throw new Error(data.message || "Failed to delete booking.");
        }

        allBookings = allBookings.filter(
          (item) => item._id !== booking._id
        );

        selectedBookings.delete(booking._id);
        totalBookings.textContent = allBookings.length;

        applyFilters();
        updateDeleteButton();

        alert("Booking deleted successfully.");
      } catch (error) {
        console.error(error);
        alert(error.message || "Unable to connect to the server.");
        deleteBtn.disabled = false;
        deleteBtn.textContent = "Delete Booking";
      }
    });
  });
}



// =========================
// SEARCH + DATE FILTER
// =========================

function applyFilters() {

  const searchText =
    bookingSearch.value.trim().toLowerCase();

  const selectedDate =
    bookingDateFilter.value;


  const filteredBookings =
    allBookings.filter((booking) => {

      const name =
        String(booking.name || "").toLowerCase();

      const phone =
        String(booking.phone || "").toLowerCase();

      const location =
        String(booking.location || "").toLowerCase();

      const bookingDate =
        String(booking.date || "");


      const matchesSearch =
        !searchText ||
        name.includes(searchText) ||
        phone.includes(searchText) ||
        location.includes(searchText);


      const matchesDate =
        !selectedDate ||
        bookingDate === selectedDate;


      return matchesSearch && matchesDate;

    });


  displayBookings(filteredBookings);

}


bookingSearch.addEventListener("input", () => {

  applyFilters();

});


bookingDateFilter.addEventListener("change", () => {

  if (bookingDateFilter.value) {

    const parts =
      bookingDateFilter.value.split("-");

    bookingDateDisplay.value =
      `${parts[2]}/${parts[1]}/${parts[0]}`;

  } else {

    bookingDateDisplay.value = "";

  }

  applyFilters();

});

// =========================
// CLEAR FILTERS
// =========================

clearFiltersBtn.addEventListener("click", () => {

  bookingSearch.value = "";
  bookingDateFilter.value = "";
  bookingDateDisplay.value = "";

  displayBookings(allBookings);

});
// =========================
// REFRESH BUTTON
// =========================

refreshBtn.addEventListener("click", () => {

  loadBookings();

});


// =========================
// LOGOUT
// =========================

logoutBtn.addEventListener("click", () => {

  currentPassword = "";

  allBookings = [];

  adminPassword.value = "";

  bookingSearch.value = "";

  dashboard.hidden = true;
  loginCard.hidden = false;

  loginError.textContent = "";

  bookingsContainer.innerHTML =
    `<p class="empty-message">No bookings found.</p>`;

  totalBookings.textContent = "0";

});


// =========================
// SECURITY HELPER
// =========================

// Prevent booking data from being interpreted as HTML
function escapeHTML(value) {

  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");

}

 // =========================
// UPDATE DELETE BUTTON
// =========================

function updateDeleteButton() {
  const count = selectedBookings.size;

  if (deleteMode && count > 0) {
    deleteModeBtn.textContent =
      `Delete ${count} Booking${count > 1 ? "s" : ""}`;
  } else if (deleteMode) {
    deleteModeBtn.textContent = "Delete 0 Bookings";
  } else {
    deleteModeBtn.textContent = "Delete Booking";
  }
}


 // =========================
// FILTERED BOOKINGS
// =========================

function getFilteredBookings() {
  const searchText = bookingSearch.value.trim().toLowerCase();
  const selectedDate = bookingDateFilter.value;

  return allBookings.filter((booking) => {
    const name = String(
      booking.name || booking.bookingPerson?.name || ""
    ).toLowerCase();

    const phone = String(
      booking.phone || booking.bookingPerson?.phone || ""
    ).toLowerCase();

    const location = String(
      booking.location || booking.eventLocation || ""
    ).toLowerCase();

    const bookingDate = String(booking.date || "");

    const matchesSearch =
      !searchText ||
      name.includes(searchText) ||
      phone.includes(searchText) ||
      location.includes(searchText);

    const matchesDate =
      !selectedDate ||
      bookingDate === selectedDate ||
      (Array.isArray(booking.events) &&
        booking.events.some(
          (event) => String(event.date || "") === selectedDate
        ));

    return matchesSearch && matchesDate;
  });
}


 // =========================
// BULK DELETE MODE
// =========================

deleteModeBtn.addEventListener("click", async () => {
  if (!deleteMode) {
    deleteMode = true;
    selectedBookings.clear();
    displayBookings(getFilteredBookings());
    updateDeleteButton();
    return;
  }

  if (selectedBookings.size === 0) {
    deleteMode = false;
    selectedBookings.clear();
    displayBookings(getFilteredBookings());
    updateDeleteButton();
    return;
  }

  const bookingIds = [...selectedBookings];

  const confirmed = confirm(
    `Are you sure you want to delete ${bookingIds.length} selected booking(s)?`
  );

  if (!confirmed) return;

  deleteModeBtn.disabled = true;
  deleteModeBtn.textContent = "Deleting...";

  try {
    for (const bookingId of bookingIds) {
      const response = await fetch(
        `${API_URL}/api/admin/bookings/${encodeURIComponent(bookingId)}`,
        {
          method: "DELETE",
          headers: {
            "x-admin-password": currentPassword
          }
        }
      );

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `Invalid server response. HTTP status: ${response.status}`
        );
      }

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete booking.");
      }
    }

    allBookings = allBookings.filter(
      booking => !bookingIds.includes(booking._id)
    );

    selectedBookings.clear();
    deleteMode = false;
    totalBookings.textContent = allBookings.length;

    displayBookings(getFilteredBookings());
    updateDeleteButton();

    alert("Selected bookings deleted successfully.");
  } catch (error) {
    console.error(error);
    alert(error.message || "Unable to delete bookings.");
    await loadBookings();
  } finally {
    deleteModeBtn.disabled = false;
    updateDeleteButton();
  }
});
  
 // =========================
// DATE PICKER OPEN
// =========================

bookingDateDisplay.addEventListener("click", () => {
  if (typeof bookingDateFilter.showPicker === "function") {
    bookingDateFilter.showPicker();
  } else {
    bookingDateFilter.focus();
    bookingDateFilter.click();
  }
});






 