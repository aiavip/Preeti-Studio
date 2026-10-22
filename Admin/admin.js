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
    ${booking.requestId
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

      <div class="booking-signature">
    <strong>Customer Signature</strong>
    ${booking.signature
        ? `<img
                    src="${booking.signature}"
                    alt="Customer signature"
                >`
        : `<p class="signature-missing">
                    No signature available for this booking.
                </p>`
      }
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
        String(booking.date || "").slice(0, 10) === selectedDate ||
        (Array.isArray(booking.events) &&
          booking.events.some(
            (event) =>
              String(event.date || "").slice(0, 10) === selectedDate
          ));



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
  console.log("Selected date:", selectedDate);

  console.table(
    allBookings.map((booking) => ({
      name: booking.name || booking.bookingPerson?.name,
      bookingDate: booking.date,
      events: JSON.stringify(booking.events)
    }))
  );


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

    const bookingDate = String(booking.date || "").slice(0, 10);

    const matchesSearch =
      !searchText ||
      name.includes(searchText) ||
      phone.includes(searchText) ||
      location.includes(searchText);




    const matchesDate =
      !selectedDate ||
      String(booking.date || "").slice(0, 10) === selectedDate ||
      (Array.isArray(booking.events) &&
        booking.events.some(
          (event) =>
            String(event.date || "").slice(0, 10) === selectedDate
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

// =========================
// yaha se add booking ke liye hai 
// =========================

/* =========================
   ADD BOOKING FORM
========================= */

const addBookingBtn = document.getElementById("addBookingBtn");
const addBookingModal = document.getElementById("addBookingModal");
const closeBookingModal = document.getElementById("closeBookingModal");
const cancelAddBooking = document.getElementById("cancelAddBooking");
const addBookingForm = document.getElementById("addBookingForm");
const addBookingError = document.getElementById("addBookingError");
const saveAddBookingBtn = document.getElementById("saveAddBookingBtn");
const addAnotherEventBtn = document.getElementById("addAnotherEventBtn");
const newBookingEvents = document.getElementById("newBookingEvents");

const addPersonName = document.getElementById("addPersonName");
const addPersonPhone = document.getElementById("addPersonPhone");
const addPersonEmail = document.getElementById("addPersonEmail");
const addEventSide = document.getElementById("addEventSide");
const addEventLocation = document.getElementById("addEventLocation");

const addGuardianIsSelf = document.getElementById("addGuardianIsSelf");
const addGuardianName = document.getElementById("addGuardianName");
const addGuardianPhone = document.getElementById("addGuardianPhone");
const addGuardianEmail = document.getElementById("addGuardianEmail");

const addBookingMessage = document.getElementById("addBookingMessage");

// ===============================
// Admin Booking Email OTP
// ===============================

const adminSendOtpBtn =
  document.getElementById("adminSendOtpBtn");

const adminEmailOtp =
  document.getElementById("adminEmailOtp");

const adminVerifyOtpBtn =
  document.getElementById("adminVerifyOtpBtn");

const adminEmailOtpStatus =
  document.getElementById("adminEmailOtpStatus");

let adminEmailVerificationToken = "";
let adminVerifiedEmail = "";


let adminOtpTargetEmail = "";

// Reset verification when the email address changes
function resetAdminEmailVerification() {
  const currentEmail = addPersonEmail.value.trim().toLowerCase();

  if (
    currentEmail !== adminOtpTargetEmail &&
    (adminOtpTargetEmail || adminEmailVerificationToken)
  ) {
    adminEmailVerificationToken = "";
    adminVerifiedEmail = "";
    adminOtpTargetEmail = "";
    adminEmailOtp.value = "";
    adminEmailOtpStatus.textContent =
      "Email changed. Please verify the new email address.";
  }
}

addPersonEmail.addEventListener("input", resetAdminEmailVerification);


// Send OTP
adminSendOtpBtn.addEventListener("click", async () => {
  const email = addPersonEmail.value.trim().toLowerCase();

  if (!email || !addPersonEmail.checkValidity()) {
    adminEmailOtpStatus.textContent =
      "Please enter a valid booking person email first.";
    addPersonEmail.focus();
    return;
  }

  adminSendOtpBtn.disabled = true;
  adminEmailOtpStatus.textContent = "Sending OTP...";

  try {
    // A fresh OTP requires fresh verification.
    adminEmailVerificationToken = "";
    adminVerifiedEmail = "";
    adminOtpTargetEmail = email;
    adminEmailOtp.value = "";

    const response = await fetch(`${API_URL}/api/email-otp/send`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email })
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      adminOtpTargetEmail = "";
      throw new Error(data.message || "Could not send OTP.");
    }

    adminEmailOtpStatus.textContent =
      "OTP sent. Please check the booking person's email inbox.";
    adminEmailOtp.focus();

  } catch (error) {
    adminEmailOtpStatus.textContent =
      error.message || "Unable to send OTP.";
  } finally {
    adminSendOtpBtn.disabled = false;
  }
});


// Verify OTP
adminVerifyOtpBtn.addEventListener("click", async () => {
  const email = addPersonEmail.value.trim().toLowerCase();
  const otp = adminEmailOtp.value.trim();

  if (!email || email !== adminOtpTargetEmail) {
    adminEmailOtpStatus.textContent =
      "Please send an OTP to the current email address first.";
    return;
  }

  if (!/^\d{6}$/.test(otp)) {
    adminEmailOtpStatus.textContent =
      "Please enter the 6-digit OTP.";
    adminEmailOtp.focus();
    return;
  }

  adminVerifyOtpBtn.disabled = true;
  adminEmailOtpStatus.textContent = "Verifying OTP...";

  try {
    const response = await fetch(`${API_URL}/api/email-otp/verify`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, otp })
    });

    const data = await response.json();

    if (!response.ok || !data.success || !data.verificationToken) {
      throw new Error(data.message || "OTP verification failed.");
    }

    adminEmailVerificationToken = data.verificationToken;
    adminVerifiedEmail = email;

    adminEmailOtpStatus.textContent =
      "Email verified successfully.";

  } catch (error) {
    adminEmailVerificationToken = "";
    adminVerifiedEmail = "";

    adminEmailOtpStatus.textContent =
      error.message || "OTP verification failed.";
  } finally {
    adminVerifyOtpBtn.disabled = false;
  }
});


const availableEventTypes = [
  "Engagement",
  "Tilak/Chheka",
  "Haldi",
  "Mehandi",
  "Wedding (Shadi)",
  "Reception",
  "Pre-Wedding",
  "Other"
];

const availableServices = [
  "Photography",
  "Videography",
  "Drone Shoot",
  "Crane Live Show",
  "Only Pendrive",
  "Album & Pendrive"

];
// ===============================
// Admin Add Booking Signature
// ===============================

const adminSignatureCanvas =
  document.getElementById("adminSignatureCanvas");

const adminSignatureCtx =
  adminSignatureCanvas.getContext("2d");

const signatureUpload =
  document.getElementById("signatureUpload");

const clearSignatureBtn =
  document.getElementById("clearSignature");

const signatureDrawTab =
  document.getElementById("signatureDrawTab");

const adminSignatureConsent =
  document.getElementById("adminSignatureConsent");

const signatureStatus =
  document.getElementById("signatureStatus");

let adminSignatureData = "";
let adminSignatureMode = "draw";
let signatureDrawing = false;
let signatureHasDrawing = false;

function clearAdminSignature() {
  adminSignatureCtx.clearRect(
    0,
    0,
    adminSignatureCanvas.width,
    adminSignatureCanvas.height
  );

  adminSignatureData = "";
  adminSignatureMode = "draw";
  signatureHasDrawing = false;
  signatureUpload.value = "";

  signatureStatus.textContent =
    "Customer/guardian se yahan signature karwayein.";
}

function getSignaturePosition(event) {
  const rect = adminSignatureCanvas.getBoundingClientRect();

  return {
    x: (event.clientX - rect.left) *
      adminSignatureCanvas.width / rect.width,

    y: (event.clientY - rect.top) *
      adminSignatureCanvas.height / rect.height
  };
}

adminSignatureCanvas.addEventListener("pointerdown", (event) => {
  if (adminSignatureMode !== "draw") return;

  event.preventDefault();

  signatureDrawing = true;
  adminSignatureCanvas.setPointerCapture(event.pointerId);

  const pos = getSignaturePosition(event);

  adminSignatureCtx.beginPath();
  adminSignatureCtx.moveTo(pos.x, pos.y);
  adminSignatureCtx.lineWidth = 4;
  adminSignatureCtx.lineCap = "round";
  adminSignatureCtx.lineJoin = "round";
  adminSignatureCtx.strokeStyle = "#111";

  adminSignatureCtx.lineTo(pos.x + 0.1, pos.y + 0.1);
  adminSignatureCtx.stroke();

  signatureHasDrawing = true;
});

adminSignatureCanvas.addEventListener("pointermove", (event) => {
  if (!signatureDrawing || adminSignatureMode !== "draw") return;

  event.preventDefault();

  const pos = getSignaturePosition(event);

  adminSignatureCtx.lineTo(pos.x, pos.y);
  adminSignatureCtx.stroke();
});

function finishAdminSignature() {
  if (!signatureDrawing) return;

  signatureDrawing = false;

  if (signatureHasDrawing) {
    adminSignatureData =
      adminSignatureCanvas.toDataURL("image/png");

    adminSignatureMode = "draw";

    signatureStatus.textContent = "Signature ready.";
  }
}

adminSignatureCanvas.addEventListener(
  "pointerup",
  finishAdminSignature
);

adminSignatureCanvas.addEventListener(
  "pointercancel",
  finishAdminSignature
);

adminSignatureCanvas.addEventListener(
  "lostpointercapture",
  finishAdminSignature
);

clearSignatureBtn.addEventListener("click", () => {
  clearAdminSignature();
});

signatureDrawTab.addEventListener("click", () => {
  clearAdminSignature();
});


signatureUpload.addEventListener("change", () => {
  const file = signatureUpload.files[0];

  if (!file) return;

  const allowedTypes = [
    "image/png",
    "image/jpeg",
    "image/webp"
  ];

  if (!allowedTypes.includes(file.type) || file.size > 5 * 1024 * 1024) {
    alert("Please upload a PNG, JPG, JPEG or WEBP image up to 5 MB.");
    signatureUpload.value = "";
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    const image = new Image();

    image.onload = () => {
      clearAdminSignature();

      adminSignatureCtx.fillStyle = "#fff";
      adminSignatureCtx.fillRect(
        0,
        0,
        adminSignatureCanvas.width,
        adminSignatureCanvas.height
      );

      const scale = Math.min(
        (adminSignatureCanvas.width - 30) / image.width,
        (adminSignatureCanvas.height - 30) / image.height
      );

      const width = image.width * scale;
      const height = image.height * scale;

      adminSignatureCtx.drawImage(
        image,
        (adminSignatureCanvas.width - width) / 2,
        (adminSignatureCanvas.height - height) / 2,
        width,
        height
      );

      // Convert every accepted format to PNG for the existing backend.
      adminSignatureData =
        adminSignatureCanvas.toDataURL("image/png");

      adminSignatureMode = "upload";
      signatureHasDrawing = true;

      signatureStatus.textContent =
        "Signature image uploaded successfully.";
    };

    image.onerror = () => {
      clearAdminSignature();
      signatureUpload.value = "";
      alert("The selected image could not be loaded.");
    };

    image.src = reader.result;
  };

  reader.onerror = () => {
    signatureUpload.value = "";
    alert("Could not read the selected file.");
  };

  reader.readAsDataURL(file);
});


let newEventCounter = 0;

function openAddBookingModal() {
  if (!currentPassword) {
    alert("Please log in to the Admin Portal first.");
    return;
  }

  addBookingForm.reset();
  adminEmailVerificationToken = "";
  adminVerifiedEmail = "";
  adminOtpTargetEmail = "";

  if (adminEmailOtp) {
    adminEmailOtp.value = "";
  }

  if (adminEmailOtpStatus) {
    adminEmailOtpStatus.textContent = "";
  }
  newBookingEvents.innerHTML = "";
  addBookingError.textContent = "";
  clearAdminSignature();
  adminSignatureConsent.checked = false;
  saveAddBookingBtn.disabled = false;
  saveAddBookingBtn.textContent = "Save Booking";
  addGuardianIsSelf.checked = true;

  syncGuardianFields();
  addEventCard();

  addBookingModal.hidden = false;
  addPersonName.focus();
}

function closeAddBookingModal() {
  if (saveAddBookingBtn.disabled) return;

  addBookingModal.hidden = true;
  addBookingError.textContent = "";
}

addBookingBtn.addEventListener("click", openAddBookingModal);
closeBookingModal.addEventListener("click", closeAddBookingModal);
cancelAddBooking.addEventListener("click", closeAddBookingModal);

addBookingModal.addEventListener("click", (event) => {
  if (event.target === addBookingModal) {
    closeAddBookingModal();
  }
});

function syncGuardianFields() {
  const isSelf = addGuardianIsSelf.checked;

  if (isSelf) {
    addGuardianName.value = addPersonName.value.trim();
    addGuardianPhone.value = addPersonPhone.value.trim();
    addGuardianEmail.value = addPersonEmail.value.trim();

    addGuardianName.readOnly = true;
    addGuardianPhone.readOnly = true;
    addGuardianEmail.readOnly = true;
  } else {
    addGuardianName.readOnly = false;
    addGuardianPhone.readOnly = false;
    addGuardianEmail.readOnly = false;
  }
}

[
  addPersonName,
  addPersonPhone,
  addPersonEmail
].forEach((field) => {
  field.addEventListener("input", () => {
    if (addGuardianIsSelf.checked) {
      syncGuardianFields();
    }
  });
});

addGuardianIsSelf.addEventListener("change", syncGuardianFields);

function addEventCard() {
  const eventId = ++newEventCounter;
  const card = document.createElement("div");
  card.className = "new-event-card";
  card.dataset.eventId = String(eventId);

  const eventOptions = availableEventTypes.map((type) =>
    `<option value="${escapeHTML(type)}">${escapeHTML(type)}</option>`
  ).join("");

  const serviceOptions = availableServices.map((service) => `
    <label class="service-option">
      <input type="checkbox" value="${escapeHTML(service)}">
      <span>${escapeHTML(service)}</span>
    </label>
  `).join("");

  card.innerHTML = `
    
<div class="new-event-card-header">
  <h4>Event ${newBookingEvents.children.length + 1}</h4>

  <div class="event-header-actions">
    ${newBookingEvents.children.length >= 1
      ? `<button type="button" class="add-event-inline-btn">+ Add Event</button>`
      : ""
    }

    <button type="button" class="remove-event-btn">Remove Event</button>
  </div>
</div>


    <div class="add-form-grid">
      <div class="add-form-field">
        <label>Event Type *</label>
        <select class="new-event-type" required>
          <option value="">Select event</option>
          ${eventOptions}
        </select>
      </div>

      <div class="add-form-field">
        <label>Custom Event Name</label>
        <input type="text" class="new-event-custom"
          placeholder="Only for Other" maxlength="80" disabled>
      </div>

      <div class="add-form-field">
        <label>Event Date *</label>
        <input type="date" class="new-event-date" required>
      </div>

      <div class="add-form-field">
        <label>Start Time </label>
        <input type="time" class="new-event-start-time">
      </div>

      <div class="add-form-field">
        <label>End Date </label>
        <input type="date" class="new-event-end-date">
      </div>

      <div class="add-form-field">
        <label>End Time </label>
        <input type="time" class="new-event-end-time">
      </div>

      <div class="add-form-field full-width">
        <label>Services * (Select at least one)</label>
        <div class="service-options">${serviceOptions}</div>
      </div>
    </div>
  `;

  const typeSelect = card.querySelector(".new-event-type");
  const customInput = card.querySelector(".new-event-custom");

  typeSelect.addEventListener("change", () => {
    const isOther = typeSelect.value === "Other";
    customInput.disabled = !isOther;
    customInput.required = isOther;

    if (!isOther) customInput.value = "";
  });

  card.querySelector(".remove-event-btn").addEventListener("click", () => {
    if (newBookingEvents.children.length <= 1) {
      addBookingError.textContent =
        "At least one event is required.";
      return;
    }

    card.remove();
    updateNewEventNumbers();
  });

  const addInlineEventBtn = card.querySelector(".add-event-inline-btn");

  if (addInlineEventBtn) {
    addInlineEventBtn.addEventListener("click", () => {
      addBookingError.textContent = "";
      addEventCard();

      const lastEvent = newBookingEvents.lastElementChild;

      if (lastEvent) {
        setTimeout(() => {
          lastEvent.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });

          window.scrollBy({
            top: 180,
            behavior: "smooth"
          });
        }, 100);
      }
    });
  }


  newBookingEvents.appendChild(card);
  updateNewEventNumbers();
}

function updateNewEventNumbers() {
  [...newBookingEvents.children].forEach((card, index) => {
    card.querySelector("h4").textContent = `Event ${index + 1}`;
  });
}


addAnotherEventBtn.addEventListener("click", () => {
  addBookingError.textContent = "";

  // Add new event at the bottom
  addEventCard();

  // Always scroll to the last event
  const lastEvent = newBookingEvents.lastElementChild;

  if (lastEvent) {
    setTimeout(() => {
      lastEvent.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

      // Scroll a little further down
      window.scrollBy({
        top: 180,
        behavior: "smooth"
      });
    }, 100);
  }
});



function collectNewEvents() {
  const events = [];

  for (const card of newBookingEvents.children) {
    const typeValue = card.querySelector(".new-event-type").value;
    const customType = card.querySelector(".new-event-custom").value.trim();

    const event = {
      type: typeValue === "Other" ? customType : typeValue,
      date: card.querySelector(".new-event-date").value,
      startTime: card.querySelector(".new-event-start-time").value,
      endDate: card.querySelector(".new-event-end-date").value,
      endTime: card.querySelector(".new-event-end-time").value,
      services: [
        ...card.querySelectorAll(".service-options input:checked")
      ].map((input) => input.value)
    };

    if (
      !event.type ||
      !event.date ||
      event.services.length === 0
    ) {
      throw new Error(
        "Har event ka type, event date aur kam se kam ek service select karo."
      );
    }



    // Check the event duration only when all optional
    // date/time fields have been supplied.
    if (event.startTime && event.endDate && event.endTime) {
      const start = new Date(`${event.date}T${event.startTime}`);
      const end = new Date(`${event.endDate}T${event.endTime}`);

      if (
        Number.isNaN(start.getTime()) ||
        Number.isNaN(end.getTime()) ||
        end <= start
      ) {
        throw new Error(
          "End date/time, start date/time ke baad hona chahiye."
        );
      }
    }

    events.push(event);
  }

  if (events.length === 0) {
    throw new Error("At least one event is required.");
  }

  return events;
}

addBookingForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  addBookingError.textContent = "";

  if (!currentPassword) {
    addBookingError.textContent =
      "Session expired. Please log in again.";
    return;
  }

  const personName = addPersonName.value.trim();
  const personPhone = addPersonPhone.value.trim();
  const personEmail = addPersonEmail.value.trim();
  const guardianName = addGuardianName.value.trim();
  const guardianPhone = addGuardianPhone.value.trim();
  const guardianEmail = addGuardianEmail.value.trim();
  
  // Verify booking person's email before saving
  if (
    !adminEmailVerificationToken ||
    !adminVerifiedEmail ||
    adminVerifiedEmail !== personEmail.toLowerCase() ||
    adminOtpTargetEmail !== personEmail.toLowerCase()
  ) {
    addBookingError.textContent =
      "Please verify the booking person's email before saving.";
    return;
  }

  if (
    !personName ||
    !personPhone ||
    !personEmail ||
    !guardianName ||
    !guardianPhone ||
    !addEventSide.value ||
    !addEventLocation.value.trim()
  ) {
    addBookingError.textContent =
      "Please fill in all required booking details.";
    return;
  }

  let events;

  try {
    events = collectNewEvents();
  } catch (error) {
    addBookingError.textContent = error.message;
    return;
  }

  // Validate customer/guardian signature
  if (!adminSignatureData) {
    addBookingError.textContent =
      "Please take the customer/guardian signature first.";
    return;
  }

  if (!adminSignatureConsent.checked) {
    addBookingError.textContent =
      "Please confirm customer/guardian consent.";
    return;
  }

  const requestId =
    `PS-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;

  const payload = {
    requestId,
    bookingPerson: {
      name: personName,
      phone: personPhone,
      email: personEmail
    },
    guardian: {
      isSelf: addGuardianIsSelf.checked,
      name: guardianName,
      phone: guardianPhone,
      email: guardianEmail
    },
    eventSide: addEventSide.value,
    eventLocation: addEventLocation.value.trim(),
    events,
    message: addBookingMessage.value.trim(),
    signature: adminSignatureData,
    signatureMode: adminSignatureMode,
    signatureConsent: adminSignatureConsent.checked,
    emailVerificationToken: adminEmailVerificationToken
  };

  saveAddBookingBtn.disabled = true;
  saveAddBookingBtn.textContent = "Saving...";

  try {

    const response = await fetch(`${API_URL}/api/admin/bookings`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-admin-password": currentPassword
      },
      body: JSON.stringify(payload)
    });


    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      throw new Error(
        `Invalid server response. HTTP status: ${response.status}`
      );
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || "Booking could not be saved.");
    }

    addBookingModal.hidden = true;
    addBookingForm.reset();
    await loadBookings();
    displayBookings(getFilteredBookings());

    alert("Booking saved successfully!");

  } catch (error) {
    console.error("Add booking failed:", error);
    addBookingError.textContent =
      error.message || "Unable to connect to the server.";
  } finally {
    saveAddBookingBtn.disabled = false;
    saveAddBookingBtn.textContent = "Save Booking";
  }
});





