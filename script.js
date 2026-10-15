const nav = document.querySelector('.nav');
document.querySelector('.menu').addEventListener('click', () => nav.classList.toggle('open'));
document.querySelectorAll('.nav nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));

const filters = document.querySelectorAll('.filter');
const items = document.querySelectorAll('.gallery-item');

filters.forEach(btn => {
    btn.addEventListener('click', () => {
        filters.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const f = btn.dataset.filter;

        items.forEach(item => {
            item.style.display = (f === 'all' || item.classList.contains(f)) ? 'block' : 'none';
        });
    });
});

document.getElementById('year').textContent = new Date().getFullYear();


/* =========================
   BOOKING FORM
========================= */

const openBookingButtons = document.querySelectorAll(".openBooking");
const closeBooking = document.getElementById("closeBooking");
const bookingOverlay = document.getElementById("bookingOverlay");


// Open Booking Form
openBookingButtons.forEach(button => {

    button.addEventListener("click", function (e) {

        e.preventDefault();

        bookingOverlay.classList.add("active");

        document.body.style.overflow = "hidden";

    });

});


// Close Booking Form
closeBooking.addEventListener("click", function () {

    bookingOverlay.classList.remove("active");

    document.body.style.overflow = "";
});


// Close when clicking outside the form
bookingOverlay.addEventListener("click", function (e) {

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
/* ===================================
   Customer Signature Start
=================================== */

/* =========================
   CUSTOMER SIGNATURE
========================= */

const signatureCanvas = document.getElementById("signatureCanvas");
const signatureContext = signatureCanvas.getContext("2d");

const signatureDrawTab = document.getElementById("signatureDrawTab");
const signatureUploadTab = document.getElementById("signatureUploadTab");

const signatureDrawPanel = document.getElementById("signatureDrawPanel");
const signatureUploadPanel = document.getElementById("signatureUploadPanel");

const clearSignatureBtn = document.getElementById("clearSignatureBtn");
const signatureFile = document.getElementById("signatureFile");
const signatureUploadPreview = document.getElementById("signatureUploadPreview");
const removeUploadedSignature = document.getElementById("removeUploadedSignature");
const signatureStatus = document.getElementById("signatureStatus");

let signatureMode = "draw";
let signatureIsDrawing = false;
let signatureHasDrawing = false;
let uploadedSignatureData = "";

signatureContext.lineWidth = 3;
signatureContext.lineCap = "round";
signatureContext.lineJoin = "round";
signatureContext.strokeStyle = "#111111";

function setSignatureMode(mode) {
    signatureMode = mode;

    signatureDrawPanel.hidden = mode !== "draw";
    signatureUploadPanel.hidden = mode !== "upload";

    signatureDrawTab.classList.toggle("active", mode === "draw");
    signatureUploadTab.classList.toggle("active", mode === "upload");

    signatureStatus.textContent =
        mode === "draw"
            ? "Draw your signature in the box above."
            : "Choose a clear PNG or JPG signature image.";
}

signatureDrawTab.addEventListener("click", () => {
    setSignatureMode("draw");
});

signatureUploadTab.addEventListener("click", () => {
    setSignatureMode("upload");
});

function getCanvasPosition(event) {
    const rect = signatureCanvas.getBoundingClientRect();

    return {
        x: (event.clientX - rect.left) *
            (signatureCanvas.width / rect.width),

        y: (event.clientY - rect.top) *
            (signatureCanvas.height / rect.height)
    };
}

signatureCanvas.addEventListener("pointerdown", event => {
    event.preventDefault();

    signatureIsDrawing = true;
    signatureHasDrawing = true;

    signatureCanvas.setPointerCapture(event.pointerId);

    const position = getCanvasPosition(event);

    signatureContext.beginPath();
    signatureContext.moveTo(position.x, position.y);
    signatureContext.lineTo(position.x + 0.1, position.y + 0.1);
    signatureContext.stroke();

    signatureStatus.textContent = "Signature drawn.";
});

signatureCanvas.addEventListener("pointermove", event => {
    if (!signatureIsDrawing) return;

    event.preventDefault();

    const position = getCanvasPosition(event);

    signatureContext.lineTo(position.x, position.y);
    signatureContext.stroke();
});

function stopSignatureDrawing() {
    signatureIsDrawing = false;
    signatureContext.beginPath();
}

signatureCanvas.addEventListener("pointerup", stopSignatureDrawing);
signatureCanvas.addEventListener("pointercancel", stopSignatureDrawing);
signatureCanvas.addEventListener("lostpointercapture", stopSignatureDrawing);

clearSignatureBtn.addEventListener("click", () => {
    signatureContext.clearRect(
        0, 0, signatureCanvas.width, signatureCanvas.height
    );

    signatureHasDrawing = false;
    signatureStatus.textContent = "Drawn signature cleared.";
});

signatureFile.addEventListener("change", () => {
    const file = signatureFile.files[0];

    uploadedSignatureData = "";
    signatureUploadPreview.hidden = true;

    if (!file) return;

    if (!["image/png", "image/jpeg"].includes(file.type)) {
        alert("Please choose a PNG or JPG image.");
        signatureFile.value = "";
        return;
    }

    if (file.size > 1024 * 1024) {
        alert("Signature image must be 1 MB or smaller.");
        signatureFile.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = () => {
        const image = new Image();

        image.onload = () => {
            const scale = Math.min(
                1,
                1200 / image.naturalWidth,
                400 / image.naturalHeight
            );

            const outputCanvas = document.createElement("canvas");

            outputCanvas.width = Math.max(
                1, Math.round(image.naturalWidth * scale)
            );

            outputCanvas.height = Math.max(
                1, Math.round(image.naturalHeight * scale)
            );

            const outputContext = outputCanvas.getContext("2d");

            outputContext.drawImage(
                image,
                0, 0,
                outputCanvas.width,
                outputCanvas.height
            );

            uploadedSignatureData = outputCanvas.toDataURL("image/png");

            signatureUploadPreview.src = uploadedSignatureData;
            signatureUploadPreview.hidden = false;

            signatureStatus.textContent = "Signature image ready.";
        };

        image.onerror = () => {
            alert("Image could not be read. Please choose another image.");
            signatureFile.value = "";
        };

        image.src = reader.result;
    };

    reader.onerror = () => {
        alert("Could not read the selected file. Please try again.");
        signatureFile.value = "";
    };

    reader.readAsDataURL(file);
});

removeUploadedSignature.addEventListener("click", () => {
    uploadedSignatureData = "";
    signatureFile.value = "";
    signatureUploadPreview.removeAttribute("src");
    signatureUploadPreview.hidden = true;
    signatureStatus.textContent = "Uploaded signature removed.";
});

function getCurrentSignatureData() {
    if (signatureMode === "draw" && signatureHasDrawing) {
        return signatureCanvas.toDataURL("image/png");
    }

    if (signatureMode === "upload") {
        return uploadedSignatureData;
    }

    return "";
}

/* ===================================
   Customer Signature end
=================================== */

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

            <div class="event-header-actions">
                <button type="button" class="add-event-inline-btn">
                    + Add Event
                </button>
                <button type="button" class="remove-event-btn">
                    Remove
                </button>
            </div>
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
                <label>Start Time (Optional)</label>
                <input type="time" class="event-start">
            </div>

            <div class="form-group">
                <label>End Date (Optional)</label>
                <input type="date" class="event-end-date">
            </div>

            <div class="form-group">
                <label>End Time (Optional)</label>
                <input type="time" class="event-end">
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

    // Past event dates are not selectable.
    const today = new Date();

    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    dateInput.min = localToday;
    endDateInput.min = localToday;

    // Add another event from this event's header.

    card.querySelector(".add-event-inline-btn")
        .addEventListener("click", () => {
            createEventCard();

            const newCard = eventList.lastElementChild;
            const formBox = document.querySelector(".booking-form-box");

            if (newCard && formBox) {
                requestAnimationFrame(() => {
                    const boxRect = formBox.getBoundingClientRect();
                    const cardRect = newCard.getBoundingClientRect();

                    const targetScrollTop =
                        formBox.scrollTop +
                        cardRect.top -
                        boxRect.top -
                        20;

                    formBox.scrollTo({
                        top: Math.max(0, targetScrollTop),
                        behavior: "smooth"
                    });
                });
            }
        });


    // Remove this event.
    card.querySelector(".remove-event-btn")
        .addEventListener("click", () => {
            if (eventList.querySelectorAll(".event-card").length <= 1) {
                return;
            }

            card.remove();
            updateEventTitles();
        });

    eventList.appendChild(card);
    updateEventTitles();
}


function updateEventTitles() {
    const cards = eventList.querySelectorAll(".event-card");

    cards.forEach((card, index) => {
        card.querySelector(".event-title").textContent =
            `Event ${index + 1}`;

        // Event 1 has no inline Add Event button.
        // Event 2 onwards have the inline Add Event button.
        const inlineAddButton =
            card.querySelector(".add-event-inline-btn");

        inlineAddButton.style.display =
            index === 0 ? "none" : "inline-block";

        // Keep Remove available, but disable it if only one event remains.
        const removeButton =
            card.querySelector(".remove-event-btn");

        removeButton.disabled = cards.length === 1;
        removeButton.style.opacity =
            cards.length === 1 ? "0.45" : "1";

        removeButton.style.cursor =
            cards.length === 1 ? "not-allowed" : "pointer";
    });
}


// addEventBtn.addEventListener("click", createEventCard);

addEventBtn.addEventListener("click", () => {
    createEventCard();

    const newCard = eventList.lastElementChild;
    const formBox = document.querySelector(".booking-form-box");

    if (!newCard || !formBox) return;

    requestAnimationFrame(() => {
        const cardTop = newCard.getBoundingClientRect().top;
        const boxTop = formBox.getBoundingClientRect().top;

        formBox.scrollTo({
            top: formBox.scrollTop + cardTop - boxTop - 20,
            behavior: "smooth"
        });
    });
});


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


        const hasStartTime = Boolean(event.startTime);
        const hasEndDate = Boolean(event.endDate);
        const hasEndTime = Boolean(event.endTime);

        // End Date cannot be earlier than Event Date.
        if (hasEndDate && event.endDate < event.date) {
            alert(`Event ${i + 1}: End Date cannot be earlier than Event Date.`);
            cards[i].querySelector(".event-end-date").focus();
            return;
        }

        // If End Date is empty or the same as Event Date,
        // End Time must be later than Start Time.
        const isSameDay = !hasEndDate || event.endDate === event.date;

        if (isSameDay && hasStartTime && hasEndTime) {
            if (event.endTime <= event.startTime) {
                alert(
                    `Event ${i + 1}: For a same-day event, End Time must be later than Start Time.`
                );
                cards[i].querySelector(".event-end").focus();
                return;
            }
        }


    }
    // customer signature start

    
const signatureData = getCurrentSignatureData();

if (!signatureData) {
    alert("Please draw or upload your signature before submitting.");

    document.getElementById("signatureSection")
        .scrollIntoView({ behavior: "smooth", block: "center" });

    return;
}


    // customer signature end

    // Frontend preview only. No booking is sent to the backend yet.
    console.log("Signature mode:", signatureMode);
console.log("Signature data exists:", !!signatureData);
console.log("Signature data length:", signatureData?.length || 0);
console.log("Signature consent:", document.getElementById("signatureConsent").checked);

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
         message: bookingMessage.value.trim(),
         signature: signatureData,
         signatureMode: signatureMode,
         signatureConsent: document.getElementById("signatureConsent").checked
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
            "https://preeti-studio-backend.onrender.com/api/bookings",
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