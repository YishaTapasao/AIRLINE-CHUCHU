// ✅ Navbar active link
const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll(".navbar a");
navLinks.forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

// ✅ Search Flight Page → Redirect to booking.html
const searchFlightForm = document.getElementById('searchFlightForm');
if (searchFlightForm) {
  searchFlightForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = "booking.html";
  });
}

// ✅ Show or hide return date based on trip type
const tripTypeSelect = document.getElementById('tripType');
const returnGroup = document.getElementById('returnGroup');

if (tripTypeSelect && returnGroup) {
  tripTypeSelect.addEventListener('change', function() {
    if (this.value === 'round-trip') {
      returnGroup.style.display = 'block';
    } else {
      returnGroup.style.display = 'none';
      document.getElementById('return').value = '';
    }
  });
}

// ✅ Flight booking form logic
const flightBookingForm = document.getElementById('flightBookingForm');
if (flightBookingForm) {
  flightBookingForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const from = document.getElementById('from').value;
    const to = document.getElementById('to').value;
    const departure = document.getElementById('departure').value;
    const passengers = document.getElementById('passengers').value;
    const tripType = document.getElementById('tripType').value;
    const returnDate = tripType === 'round-trip' ? document.getElementById('return').value : '';

    // Save booking to localStorage
    const booking = { from, to, departure, returnDate, passengers, tripType };
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));

    alert(`✅ Booking Added!\n\nFrom: ${from}\nTo: ${to}\nDeparture: ${departure}\nReturn: ${returnDate || "N/A"}\nPassengers: ${passengers}\nTrip Type: ${tripType === 'round-trip' ? 'Round Trip' : 'One Way'}`);

    flightBookingForm.reset();
    returnGroup.style.display = 'none'; // hide again after submission
  });
}

// ✅ Display Bookings on mybookings.html
const bookingsList = document.getElementById('bookingsList');
if (bookingsList) {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];

  if (bookings.length === 0) {
    bookingsList.innerHTML = "<p>No bookings found.</p>";
  } else {
    bookings.forEach((b, index) => {
      const div = document.createElement('div');
      div.classList.add('booking-card');
      div.innerHTML = `
        <h3>Flight ${index + 1} (${b.tripType === 'round-trip' ? 'Round Trip' : 'One Way'})</h3>
        <p><strong>From:</strong> ${b.from}</p>
        <p><strong>To:</strong> ${b.to}</p>
        <p><strong>Departure:</strong> ${b.departure}</p>
        ${b.tripType === 'round-trip' ? `<p><strong>Return:</strong> ${b.returnDate}</p>` : ''}
        <p><strong>Passengers:</strong> ${b.passengers}</p>
        <button class="deleteBooking" data-index="${index}">Delete</button>
      `;
      bookingsList.appendChild(div);
    });

    // Delete booking button
    document.querySelectorAll('.deleteBooking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const index = e.target.getAttribute('data-index');
        let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
        bookings.splice(index, 1);
        localStorage.setItem('bookings', JSON.stringify(bookings));
        location.reload();
      });
    });
  }
}
