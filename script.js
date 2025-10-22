const currentPage = window.location.pathname.split("/").pop();
const navLinks = document.querySelectorAll(".navbar a");
navLinks.forEach(link => {
  if (link.getAttribute("href") === currentPage) {
    link.classList.add("active");
  }
});

const searchFlightForm = document.getElementById('searchFlightForm');
if (searchFlightForm) {
  searchFlightForm.addEventListener('submit', (e) => {
    e.preventDefault();
    window.location.href = "booking.html";
  });
}

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
    const booking = { from, to, departure, returnDate, passengers, tripType };
    let bookings = JSON.parse(localStorage.getItem('bookings')) || [];
    bookings.push(booking);
    localStorage.setItem('bookings', JSON.stringify(bookings));
    alert(`Booking Added!\n\nFrom: ${from}\nTo: ${to}\nDeparture: ${departure}\nReturn: ${returnDate || "N/A"}\nPassengers: ${passengers}\nTrip Type: ${tripType === 'round-trip' ? 'Round Trip' : 'One Way'}`);
    flightBookingForm.reset();
    returnGroup.style.display = 'none';
  });
}

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

const flights = {
  oneway: [
    { flightNo: "5J 560", from: "Cebu", to: "Manila", departDate: "2025-10-25", time: "08:00 AM", price: 2500, seats: 20, hours: 1.5, fareType: "Promo Fare" },
    { flightNo: "PR 890", from: "Cebu", to: "Davao", departDate: "2025-10-26", time: "10:30 AM", price: 3000, seats: 15, hours: 2, fareType: "Regular" },
    { flightNo: "Z2 345", from: "Cebu", to: "Iloilo", departDate: "2025-10-27", time: "01:00 PM", price: 2200, seats: 10, hours: 1, fareType: "Promo Fare" }
  ],
  roundtrip: [
    { flightNo: "5J 561", from: "Manila", to: "Cebu", departDate: "2025-10-25", returnDate: "2025-10-28", time: "09:00 AM / 06:00 PM", price: 4500, seats: 25, hours: 1.5, fareType: "Promo Fare" },
    { flightNo: "PR 891", from: "Davao", to: "Cebu", departDate: "2025-10-26", returnDate: "2025-10-29", time: "11:00 AM / 07:30 PM", price: 5000, seats: 18, hours: 2, fareType: "Regular" },
    { flightNo: "Z2 350", from: "Iloilo", to: "Cebu", departDate: "2025-10-27", returnDate: "2025-10-30", time: "02:00 PM / 05:30 PM", price: 4000, seats: 12, hours: 1, fareType: "Promo Fare" }
  ]
};

const flightList = document.getElementById("flightList");
if (flightList) {
  const bookings = JSON.parse(localStorage.getItem('bookings')) || [];
  if (bookings.length === 0) {
    flightList.innerHTML = `<p>No bookings found. Please book a flight first.</p>`;
  } else {
    flightList.innerHTML = "";
    bookings.forEach((b, index) => {
      const type = b.tripType === 'round-trip' ? 'roundtrip' : 'oneway';
      const available = flights[type].filter(f => 
        f.from.toLowerCase() === b.from.toLowerCase() && 
        f.to.toLowerCase() === b.to.toLowerCase()
      );
      const results = available.length > 0 ? available : [flights[type][0]];
      const section = document.createElement('div');
      section.classList.add('booking-match');
      section.innerHTML = `<h2>Booking ${index + 1}: ${b.from} → ${b.to}</h2>`;
      results.forEach(f => {
        const card = document.createElement("div");
        card.classList.add("flight-card");
        card.innerHTML = `
          <h3>${f.flightNo} - ${f.from} → ${f.to}</h3>
          <p><strong>Departure:</strong> ${f.departDate} ${f.time.split("/")[0] || f.time}</p>
          ${type === "roundtrip" ? `<p><strong>Return:</strong> ${f.returnDate} ${f.time.split("/")[1]}</p>` : ""}
          <p><strong>Price:</strong> ₱${f.price}</p>
          <p><strong>Seats:</strong> ${f.seats}</p>
          <p><strong>Duration:</strong> ${f.hours} hrs</p>
          <p><strong>Fare Type:</strong> ${f.fareType}</p>
          <button class="select-btn">Select</button>
        `;
        section.appendChild(card);
        card.querySelector(".select-btn").addEventListener("click", () => {
          const selected = { booking: b, flight: f };
          localStorage.setItem('selectedFlight', JSON.stringify(selected));
          window.location.href = "receipt.html";
        });
      });
      flightList.appendChild(section);
    });
  }
}

const receiptContainer = document.getElementById('receiptContainer');
if (receiptContainer) {
  const selected = JSON.parse(localStorage.getItem('selectedFlight'));
  if (!selected) {
    receiptContainer.innerHTML = `<p>No selected flight found. Please go back and choose a flight.</p>`;
  } else {
    receiptContainer.innerHTML = `
      <h1>Flight Receipt</h1>
      <div class="flight-card">
        <h3>${selected.flight.flightNo} - ${selected.flight.from} → ${selected.flight.to}</h3>
        <p><strong>Passenger(s):</strong> ${selected.booking.passengers}</p>
        <p><strong>Trip Type:</strong> ${selected.booking.tripType}</p>
        <p><strong>Departure:</strong> ${selected.flight.departDate} ${selected.flight.time.split("/")[0]}</p>
        ${selected.booking.tripType === 'round-trip' ? `<p><strong>Return:</strong> ${selected.flight.returnDate} ${selected.flight.time.split("/")[1]}</p>` : ""}
        <p><strong>Fare Type:</strong> ${selected.flight.fareType}</p>
        <p><strong>Total Price:</strong> ₱${selected.flight.price}</p>
        <hr>
        <p><em>Thank you for booking with SkyVoyage!</em></p>
      </div>
      <button id="backHome">Back to Home</button>
    `;
    document.getElementById("backHome").addEventListener("click", () => {
      window.location.href = "index.html";
    });
  }
}
