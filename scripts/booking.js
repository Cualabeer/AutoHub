function showBookingModal() {
  const modal = document.createElement('div');
  modal.classList.add('booking-modal');
  modal.innerHTML = `
    <div class="modal-overlay"></div>
    <div class="modal-content">
      <h2>Book a Service</h2>

      <label for="serviceType">Service Type</label>
      <select id="serviceType">
        <option value="">-- Select a Service --</option>
        <option value="towing">Towing</option>
        <option value="recovery">Recovery</option>
        <option value="collection">Collection</option>
        <option value="mechanic">Mechanic</option>
        <option value="inspection">Inspection</option>
      </select>

      <div id="locationSection">
        <label>Location</label>
        <button id="useGPS" class="btn-secondary" type="button">Use My Location (GPS)</button>
        <p id="gpsStatus" class="small-text"></p>
        <input type="text" id="manualAddress" placeholder="Or enter address manually" />
      </div>

      <label for="bookingDate">Select Date</label>
      <input type="date" id="bookingDate" />

      <label for="bookingTime">Select Time</label>
      <select id="bookingTime">
        <option value="09:00">9:00</option>
        <option value="10:00">10:00</option>
        <option value="11:00">11:00</option>
        <option value="12:00">12:00</option>
        <option value="13:00">13:00</option>
        <option value="14:00">14:00</option>
        <option value="15:00">15:00</option>
        <option value="16:00">16:00</option>
        <option value="17:00">17:00</option>
        <option value="18:00">18:00 (Night Rate)</option>
        <option value="19:00">19:00 (Night Rate)</option>
        <option value="20:00">20:00 (Night Rate)</option>
        <option value="21:00">21:00 (Night Rate)</option>
        <option value="22:00">22:00 (Night Rate)</option>
      </select>

      <label for="bookingDescription">Description</label>
      <textarea id="bookingDescription" placeholder="Describe your issue or request..."></textarea>

      <button id="submitBooking" class="btn-primary">Confirm Booking</button>
      <button class="btn-secondary" id="closeModal">Cancel</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('useGPS').addEventListener('click', () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        pos => {
          const { latitude, longitude } = pos.coords;
          document.getElementById('gpsStatus').textContent = `📍 Location: ${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
        },
        () => {
          document.getElementById('gpsStatus').textContent = 'Unable to retrieve GPS location.';
        }
      );
    } else {
      document.getElementById('gpsStatus').textContent = 'Geolocation is not supported by your browser.';
    }
  });

  document.getElementById('submitBooking').addEventListener('click', () => {
    const serviceType = document.getElementById('serviceType').value;
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const description = document.getElementById('bookingDescription').value;
    const addressInput = document.getElementById('manualAddress').value;
    const gpsStatus = document.getElementById('gpsStatus').textContent;

    if (!serviceType || !date || !time) {
      alert('Please select a service type, date, and time.');
      return;
    }

    let location = '';
    if (gpsStatus.includes('Location:')) {
      location = gpsStatus.replace('📍 Location: ', '').trim();
    } else if (addressInput) {
      location = addressInput.trim();
    }

    const bookingData = {
      serviceType,
      date,
      time,
      description,
      location
    };

    console.log('📦 Booking Data:', bookingData);
    alert(`Booking confirmed!\\n\\n${JSON.stringify(bookingData, null, 2)}`);

    document.body.removeChild(document.querySelector('.booking-modal'));
  });

  document.getElementById('closeModal').addEventListener('click', () => {
    document.body.removeChild(document.querySelector('.booking-modal'));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('openBookingBtn');
  if (btn) btn.addEventListener('click', showBookingModal);
});