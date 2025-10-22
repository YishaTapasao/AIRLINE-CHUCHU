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
    { flightNo: "5J 560", destination: "Cebu → Manila", departDate: "2025-10-25", time: "08:00 AM", price: 2500, seats: 20, hours: 1.5, fareType: "Promo Fare" },
    { flightNo: "PR 890", destination: "Cebu → Davao", departDate: "2025-10-26", time: "10:30 AM", price: 3000, seats: 15, hours: 2, fareType: "None" },
    { flightNo: "Z2 345", destination: "Cebu → Iloilo", departDate: "2025-10-27", time: "01:00 PM", price: 2200, seats: 10, hours: 1, fareType: "Promo Fare" }
  ],
  roundtrip: [
    { flightNo: "5J 561", destination: "Manila ↔ Cebu", departDate: "2025-10-25", returnDate: "2025-10-28", time: "09:00 AM / 06:00 PM", price: 4500, seats: 25, hours: 1.5, fareType: "Promo Fare" },
    { flightNo: "PR 891", destination: "Davao ↔ Cebu", departDate: "2025-10-26", returnDate: "2025-10-29", time: "11:00 AM / 07:30 PM", price: 5000, seats: 18, hours: 2, fareType: "None" },
    { flightNo: "Z2 350", destination: "Iloilo ↔ Cebu", departDate: "2025-10-27", returnDate: "2025-10-30", time: "02:00 PM / 05:30 PM", price: 4000, seats: 12, hours: 1, fareType: "Promo Fare" }
  ]
};

const tripTypeRadios = document.querySelectorAll('input[name="tripType"]');
const departDateInput = document.getElementById("departDate");
const returnDateInput = document.getElementById("returnDate");
const returnLabel = document.getElementById("returnLabel");
const flightList = document.getElementById("flightList");
const searchBtn = document.getElementById("searchBtn");

tripTypeRadios.forEach(radio => {
  radio.addEventListener("change", () => {
    returnLabel.style.display = (radio.value === "roundtrip") ? "inline-block" : "none";
  });
});

searchBtn.addEventListener("click", () => {
  const tripType = document.querySelector('input[name="tripType"]:checked').value;
  const departDate = departDateInput.value;
  const returnDate = returnDateInput.value;
  showFlights(tripType, departDate, returnDate);
});

function showFlights(type, departDate, returnDate) {
  flightList.innerHTML = "";
  const available = flights[type].filter(f =>
    type === "oneway"
      ? (!departDate || f.departDate === departDate)
      : ((!departDate || f.departDate === departDate) && (!returnDate || f.returnDate === returnDate))
  );

  if (available.length === 0) {
    flightList.innerHTML = `<p>No flights found for the selected dates.</p>`;
    return;
  }

  available.forEach(f => {
    const card = document.createElement("div");
    card.classList.add("flight-card");
    card.innerHTML = `
      <h3>${f.flightNo} - ${f.destination}</h3>
      <div class="flight-details">
        <p><strong>Depart:</strong> ${f.departDate} ${f.time.split("/")[0] || f.time}</p>
        ${type === "roundtrip" ? `<p><strong>Return:</strong> ${f.returnDate} ${f.time.split("/")[1]}</p>` : ""}
        <p><strong>Price:</strong> ₱${f.price}</p>
        <p><strong>Seats Available:</strong> ${f.seats}</p>
        <p><strong>Hours of Travel:</strong> ${f.hours} hrs</p>
        <p><strong>Fare Type:</strong> ${f.fareType}</p>
      </div>
      <button class="select-btn">Select</button>
    `;
    card.querySelector(".select-btn").addEventListener("click", () => {
      alert(`You selected flight ${f.flightNo}`);
    });
    flightList.appendChild(card);
  });
}
