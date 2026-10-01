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
    items.forEach(item=>item.style.display=(f==='all'||item.classList.contains(f))?'block':'none');
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

        // Page scroll lock
        document.body.style.overflow = "hidden";

    });

});


// Close Booking Form
closeBooking.addEventListener("click", function() {

    bookingOverlay.classList.remove("active");

    // Page scroll unlock
    document.body.style.overflow = "";
});


// Close when clicking outside the form
bookingOverlay.addEventListener("click", function(e) {

    if (e.target === bookingOverlay) {

        bookingOverlay.classList.remove("active");

        document.body.style.overflow = "";
    }

});
// Booking Form Submit → Backend

// Booking Form Submit → Backend

document.getElementById("bookingForm").addEventListener("submit", async function(e) {

    e.preventDefault();

    const form = this;

    // Submit button
    const submitButton = document.getElementById("bookingSubmit");

    // Prevent multiple clicks
    if (submitButton.disabled) {
        return;
    }

    const name = document.getElementById("bookingName").value.trim();
    const phone = document.getElementById("bookingPhone").value.trim();
    const eventType = document.getElementById("bookingEvent").value;
    const date = document.getElementById("bookingDate").value;
    const location = document.getElementById("bookingLocation").value.trim();
    const service = document.getElementById("bookingService").value;
    const message = document.getElementById("bookingMessage").value.trim();

    // Save original button text
    const originalButtonText = submitButton.textContent;

    // Immediately disable button
    submitButton.disabled = true;
    submitButton.textContent = "Sending Request...";

    try {

        const response = await fetch(
            "https://preeti-studio-backend.onrender.com/api/bookings",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    name: name,
                    phone: phone,
                    eventType: eventType,
                    date: date,
                    location: location,
                    service: service,
                    message: message
                })
            }
        );

        const data = await response.json();

        if (data.success) {

    alert("Booking request successfully received!");

    form.reset();

    submitButton.disabled = false;
    submitButton.textContent = originalButtonText;

    bookingOverlay.classList.remove("active");

    document.body.style.overflow = "";



        } else {

            alert("Booking submit nahi ho payi.");

            // Allow retry
            submitButton.disabled = false;
            submitButton.textContent = originalButtonText;
        }

    } catch (error) {

        console.error("Backend Error:", error);

        alert("Server se connection nahi ho pa raha hai.");

        // Allow retry
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
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