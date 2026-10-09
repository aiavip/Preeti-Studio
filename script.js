const nav=document.querySelector('.nav');
document.querySelector('.menu').addEventListener('click',()=>nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

const filters=document.querySelectorAll('.filter');
const items=document.querySelectorAll('.gallery-item');

filters.forEach(btn=>{
  btn.addEventListener('click',()=>{
    filters.forEach(b=>b.classList.remove('active'));
    btn.classList.add('active');

    const f=btn.dataset.filter;

    items.forEach(item=>{
      item.style.display=(f==='all'||item.classList.contains(f))?'block':'none';
    });
  });
});

document.getElementById('year').textContent=new Date().getFullYear();


/* =========================
   BOOKING FORM
========================= */

const openBookingButtons = document.querySelectorAll(".openBooking");
const closeBooking = document.getElementById("closeBooking");
const bookingOverlay = document.getElementById("bookingOverlay");


// Open Booking Form
openBookingButtons.forEach(button => {

    button.addEventListener("click", function(e) {

        e.preventDefault();

        bookingOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    });

});


// Close Booking Form
closeBooking.addEventListener("click", function() {

    bookingOverlay.classList.remove("active");

    document.body.style.overflow = "";
});


// Close when clicking outside the form
bookingOverlay.addEventListener("click", function(e) {

    if (e.target === bookingOverlay) {

        bookingOverlay.classList.remove("active");

        document.body.style.overflow = "";
    }

});



/* ===================================
   MULTI-EVENT BOOKING FORM - FRONTEND
=================================== */

const bookingForm = document.getElementById("bookingForm");
const eventList = document.getElementById("eventList");
const addEventBtn = document.getElementById("addEventBtn");

const bookingName = document.getElementById("bookingName");
const bookingPhone = document.getElementById("bookingPhone");
const bookingEmail = document.getElementById("bookingEmail");

const guardianIsSelf = document.getElementById("guardianIsSelf");
const guardianName = document.getElementById("guardianName");
const guardianPhone = document.getElementById("guardianPhone");
const guardianEmail = document.getElementById("guardianEmail");

const bookingMessage = document.getElementById("bookingMessage");
const bookingSubmit = document.getElementById("bookingSubmit");

const eventLocationInput = document.getElementById("commonEventLocation");

const eventSideInputs = document.querySelectorAll(
    'input[name="eventSide"]'
);


let eventCounter = 0;

function syncGuardianDetails() {
    if (guardianIsSelf.checked) {
        guardianName.value = bookingName.value;
        guardianPhone.value = bookingPhone.value;
        guardianEmail.value = bookingEmail.value;

        guardianName.readOnly = true;
        guardianPhone.readOnly = true;
        guardianEmail.readOnly = true;
    } else {
        guardianName.readOnly = false;
        guardianPhone.readOnly = false;
        guardianEmail.readOnly = false;
    }
}

[bookingName, bookingPhone, bookingEmail].forEach(input => {
    input.addEventListener("input", () => {
        if (guardianIsSelf.checked) {
            syncGuardianDetails();
        }
    });
});

guardianIsSelf.addEventListener("change", syncGuardianDetails);

function createEventCard() {
    eventCounter++;

    const card = document.createElement("div");
    card.className = "event-card";

    card.innerHTML = `
        <div class="event-card-heading">
            <h4 class="event-title">Event ${eventCounter}</h4>
            <button type="button" class="remove-event-btn">Remove</button>
        </div>

        <div class="event-fields">
            <div class="form-group">
                <label>Event Type *</label>
                <select class="event-type" required>
                    <option value="">Select event</option>
                    <option>Wedding</option>
                    <option>Engagement</option>
                    <option>Haldi</option>
                    <option>Mehandi</option>
                    <option>Chheka / Tilak</option>
                    <option>Pre-Wedding</option>
                    <option>Birthday</option>
                    <option>Anniversary</option>
                    <option>Other</option>
                </select>
            </div>
            

            <div class="form-group">
                <label>Event Date *</label>
                <input type="date" class="event-date" required>
            </div>

            <div class="form-group">
                <label>Start Time *</label>
                <input type="time" class="event-start" required>
            </div>

           
            <div class="form-group">
                <label>End Date *</label>
                <input type="date" class="event-end-date" required>
            </div>
            
            <div class="form-group">
                <label>End Time *</label>
                <input type="time" class="event-end" required>
            </div>
            
        </div>

        <p class="service-title">Required Services * (Select at least one)</p>

        <div class="service-options">
            <label class="service-option">
                <input type="checkbox" value="Photography" class="event-service">
                <span>Photography</span>
            </label>

            <label class="service-option">
                <input type="checkbox" value="Videography" class="event-service">
                <span>Videography</span>
            </label>

            <label class="service-option">
                <input type="checkbox" value="Drone Shoot" class="event-service">
                <span>Drone Shoot</span>
            </label>

            <label class="service-option">
                <input type="checkbox" value="Crane / Live Show" class="event-service">
                <span>Crane / Live Show</span>
            </label>
        </div>
    `;

    const dateInput = card.querySelector(".event-date");
    const endDateInput = card.querySelector(".event-end-date");

    // Past dates are not selectable.
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;
    endDateInput.min = localToday;

    card.querySelector(".remove-event-btn").addEventListener("click", () => {
        card.remove();
        updateEventTitles();
    });

    eventList.appendChild(card);
    updateEventTitles();
}

function updateEventTitles() {
    const cards = eventList.querySelectorAll(".event-card");

    cards.forEach((card, index) => {
        card.querySelector(".event-title").textContent = `Event ${index + 1}`;

        const removeButton = card.querySelector(".remove-event-btn");
        removeButton.disabled = cards.length === 1;
        removeButton.style.opacity = cards.length === 1 ? "0.45" : "1";
        removeButton.style.cursor = cards.length === 1 ? "not-allowed" : "pointer";
    });
}

addEventBtn.addEventListener("click", createEventCard);

guardianIsSelf.checked = true;
createEventCard();
syncGuardianDetails();

bookingForm.addEventListener("submit", async function (e) {
    e.preventDefault();

    syncGuardianDetails();

    if (!bookingForm.reportValidity()) {
        return;
    }

    const phonePattern = /^[0-9]{10}$/;

    if (!phonePattern.test(bookingPhone.value.trim())) {
        alert("Please enter a valid 10-digit booking mobile number.");
        bookingPhone.focus();
        return;
    }

    if (!guardianIsSelf.checked &&
        !phonePattern.test(guardianPhone.value.trim())) {
        alert("Please enter a valid 10-digit guardian mobile number.");
        guardianPhone.focus();
        return;
    }
    
const selectedEventSide = document.querySelector(
    'input[name="eventSide"]:checked'
);

if (!selectedEventSide) {
    alert("Please select whether the event is for Bride (Girls) or Groom (Boys).");
    document.querySelector(".event-common-details")
        ?.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
}

const eventSide = selectedEventSide.value;
const eventLocation = eventLocationInput.value.trim();

if (!eventLocation) {
    alert("Please enter the event location.");
    eventLocationInput.focus();
    return;
}


    const cards = [...eventList.querySelectorAll(".event-card")];

    const events = cards.map(card => {
       const start = card.querySelector(".event-start").value;
       const endDate = card.querySelector(".event-end-date").value;
       const end = card.querySelector(".event-end").value;

        const services = [
            ...card.querySelectorAll(".event-service:checked")
        ].map(input => input.value);

        return {
            type: card.querySelector(".event-type").value,
            date: card.querySelector(".event-date").value,
            startTime: start,
            endDate: endDate,
            endTime: end,
            services
        };
    });

    for (let i = 0; i < events.length; i++) {
        const event = events[i];

        if (event.services.length === 0) {
            alert(`Please select at least one service for Event ${i + 1}.`);
            cards[i].scrollIntoView({ behavior: "smooth", block: "center" });
            return;
        }

       const eventStart = new Date(`${event.date}T${event.startTime}`);
       const eventEnd = new Date(`${event.endDate}T${event.endTime}`);

       if (eventEnd <= eventStart) {
           alert(`Event ${i + 1}: End date and time must be later than start date and time.`);
           cards[i].querySelector(".event-end-date").focus();
           return;
}
    }

    // Frontend preview only. No booking is sent to the backend yet.
   

const bookingPreview = {
    requestId: crypto.randomUUID(),

    bookingPerson: {
        name: bookingName.value.trim(),
        phone: bookingPhone.value.trim(),
        email: bookingEmail.value.trim()
    },

    guardian: {
        isSelf: guardianIsSelf.checked,
        name: guardianName.value.trim(),
        phone: guardianPhone.value.trim(),
        email: guardianEmail.value.trim()
    },

    eventSide: eventSide,
    eventLocation: eventLocation,
    events,
    message: bookingMessage.value.trim()
};

const submitButton =
    e.submitter || bookingForm.querySelector('[type="submit"]');

const originalButtonText = submitButton
    ? submitButton.textContent
    : "";

if (submitButton) {
    submitButton.disabled = true;
    submitButton.textContent = "Sending Request...";
}

try {
   
const response = await fetch(
    "http://localhost:3000/api/bookings",
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(bookingPreview)
    }
);


    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(
            result.message || "Booking submission failed."
        );
    }

    alert(
        "Booking request successfully submitted!\n\n" +
        "Events: " + events.length +
        "\nYour booking request has been received."
    );

    console.log("Booking API response:", result);

} catch (error) {
    console.error("Booking submission failed:", error);

    alert(
        "Booking submit nahi ho payi.\n\n" +
        (error.message || "Please try again.")
    );

} finally {
    if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
    }
}
});




// Enquiry Popup

const enquiryBtn = document.getElementById('enquireBtn');
const enquiryOverlay = document.getElementById('enquiryOverlay');
const enquiryClose = document.getElementById('enquiryClose');
const enquiryForm = document.getElementById('enquiryForm');

enquiryBtn.addEventListener('click', (e) => {

    e.preventDefault();

    enquiryOverlay.classList.add('show');

});

enquiryClose.addEventListener('click', () => {

    enquiryOverlay.classList.remove('show');

});

enquiryOverlay.addEventListener('click', (e) => {

    if (e.target === enquiryOverlay) {

        enquiryOverlay.classList.remove('show');

    }

});

enquiryForm.addEventListener('submit', (e) => {

    e.preventDefault();

    const name = document.getElementById('enquiryName').value.trim();
    const phone = document.getElementById('enquiryPhone').value.trim();
    const location = document.getElementById('enquiryLocation').value.trim();

    const message =
        `Hello Preeti Studio,%0A%0A` +
        `I want to make an enquiry.%0A%0A` +
        `Name: ${encodeURIComponent(name)}%0A` +
        `Mobile: ${encodeURIComponent(phone)}%0A` +
        `Location: ${encodeURIComponent(location)}`;

    window.open(
        `https://wa.me/916306911551?text=${message}`,
        '_blank'
    );

    enquiryForm.reset();

    enquiryOverlay.classList.remove('show');

});