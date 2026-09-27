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

const openBooking = document.getElementById("openBooking");
const closeBooking = document.getElementById("closeBooking");
const bookingOverlay = document.getElementById("bookingOverlay");


// Open Booking Form
openBooking.addEventListener("click", function(e) {

    e.preventDefault();

    bookingOverlay.classList.add("active");

    // Page scroll lock
    document.body.style.overflow = "hidden";
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
// Booking Form Submit → WhatsApp

document.getElementById("bookingForm").addEventListener("submit", function(e) {
    e.preventDefault();

    const name = document.getElementById("bookingName").value;
    const phone = document.getElementById("bookingPhone").value;
    const eventType = document.getElementById("bookingEvent").value;
    const date = document.getElementById("bookingDate").value;
    const location = document.getElementById("bookingLocation").value;
    const service = document.getElementById("bookingService").value;
    const message = document.getElementById("bookingMessage").value;

    const whatsappNumber = "916306911551";

    const whatsappMessage =
        `📸 *NEW BOOKING ENQUIRY*%0A%0A` +
        `👤 *Name:* ${name}%0A` +
        `📱 *Mobile:* ${phone}%0A` +
        `🎉 *Event:* ${eventType}%0A` +
        `📅 *Date:* ${date}%0A` +
        `📍 *Location:* ${location}%0A` +
        `📷 *Service:* ${service}%0A` +
        `📝 *Additional Details:* ${message}`;

    const whatsappURL =
        `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

    window.open(whatsappURL, "_blank");
});
const openBookingButtons = document.querySelectorAll(".openBooking");

openBookingButtons.forEach(button => {
    button.addEventListener("click", function(e) {
        e.preventDefault();
        bookingOverlay.classList.add("active");
        document.body.style.overflow = "hidden";
    });
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