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

const clearFiltersBtn =
  document.getElementById("clearFiltersBtn");  


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
      `<p class="empty-message">
        No bookings found.
      </p>`;

    return;
  }


  bookingsContainer.innerHTML = "";


  bookings.forEach((booking) => {

    const bookingCard =
      document.createElement("div");

    bookingCard.className = "booking-card";


    const createdDate =
      booking.createdAt
        ? new Date(booking.createdAt).toLocaleString("en-IN")
        : "N/A";


    bookingCard.innerHTML = `

      <h3>${escapeHTML(booking.name || "Unknown Client")}</h3>

      <div class="booking-info">

        <div>
          <span>Phone</span>
          ${escapeHTML(booking.phone || "N/A")}
        </div>

        <div>
          <span>Event Type</span>
          ${escapeHTML(booking.eventType || "N/A")}
        </div>

        <div>
          <span>Event Date</span>
          ${escapeHTML(booking.date || "N/A")}
        </div>

        <div>
          <span>Location</span>
          ${escapeHTML(booking.location || "N/A")}
        </div>

        <div>
          <span>Service</span>
          ${escapeHTML(booking.service || "N/A")}
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
    `;


    bookingsContainer.appendChild(bookingCard);

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

  applyFilters();

});

 // =========================
// CLEAR FILTERS
// =========================

clearFiltersBtn.addEventListener("click", () => {

  bookingSearch.value = "";
  bookingDateFilter.value = "";

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