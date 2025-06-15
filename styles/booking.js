(() => {
  // Create modal and overlay dynamically (to keep html clean)
  const modalHtml = `
  <div class="overlay" id="modalOverlay" tabindex="-1" style="display:none;"></div>
  <div class="modal" role="dialog" aria-modal="true" aria-labelledby="modalTitle" id="bookingModal" style="display:none;">
    <div class="modal-content">
      <button class="close-btn" aria-label="Close booking form" id="closeModalBtn">&times;</button>
      <h2 id="modalTitle">Book a Service</h2>
      <form id="bookingForm" novalidate>
        <label for="serviceSelect">Select Service</label>
        <select id="serviceSelect" required>
          <option value="" disabled selected>Select a service</option>
          <option value="Towing/Recovery">Towing/Recovery</option>
          <option value="Mechanic Services">Mechanic Services</option>
          <option value="Salvage and Recovery">Salvage and Recovery</option>
          <option value="Inspection and Diagnostics">Inspection and Diagnostics</option>
        </select>

        <label for="descriptionInput">Description</label>
        <textarea id="descriptionInput" minlength="10" required placeholder="Enter at least 10 characters"></textarea>

        <label for="dateInput">Select Date</label>
        <input type="date" id="dateInput" required />

        <label for="timeSelect">Select Time Slot</label>
        <select id="timeSelect" required>
          <option value="" disabled selected>Select a time</option>
        </select>
        <div class="rate-info" id="rateInfo"></div>

        <button type="submit" class="btn-primary" disabled>Confirm Booking</button>
      </form>
    </div>
  </div>
  `;

  document.body.insertAdjacentHTML('beforeend', modalHtml);

  const openBtn = document.getElementById('openBookingBtn');
  const modal = document.getElementById('bookingModal');
  const overlay = document.getElementById('modalOverlay');
  const closeBtn = document.getElementById('closeModalBtn');
  const form = document.getElementById('bookingForm');

  const serviceSelect = document.getElementById('serviceSelect');
  const descriptionInput = document.getElementById('descriptionInput');
  const dateInput = document.getElementById('dateInput');
  const timeSelect = document.getElementById('timeSelect');
  const submitBtn = form.querySelector('button[type="submit"]');
  const rateInfo = document.getElementById('rateInfo');

  const DAY_RATE_END = 18; // 6 PM
  const START_HOUR = 9;
  const END_HOUR = 21;

  function openModal() {
    modal.style.display = 'flex';
    overlay.style.display = 'block';
    modal.setAttribute('aria-hidden', 'false');
    overlay.setAttribute('aria-hidden', 'false');
    form.reset();
    submitBtn.disabled = true;

    // Set date picker min to today
    const todayStr = new Date().toISOString().split('T')[0];
    dateInput.min = todayStr;

    populateTimeSlots(new Date());
    updateRateInfo('');
  }

  function closeModal() {
    modal.style.display = 'none';
    overlay.style.display = 'none';
    modal.setAttribute('aria-hidden', 'true');
    overlay.setAttribute('aria-hidden', 'true');
  }

  function populateTimeSlots(selectedDate) {
    timeSelect.innerHTML = '<option value="" disabled selected>Select a time</option>';
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const isToday = selectedDate.getTime() === today.getTime();

    for(let hour = START_HOUR; hour <= END_HOUR; hour++) {
      if(isToday && hour <= now.getHours()) continue;

      const displayHour = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const option = document.createElement('option');
      option.value = hour;
      option.textContent = `${displayHour}:00 ${ampm} (${hour >= DAY_RATE_END ? 'Night Rate' : 'Day Rate'})`;
      timeSelect.appendChild(option);
    }
  }

  function updateRateInfo(hourVal) {
    if (!hourVal) {
      rateInfo.textContent = '';
      return;
    }
    const hour = parseInt(hourVal, 10);
    rateInfo.textContent = hour >= DAY_RATE_END ? 'Selected time is Night Rate' : 'Selected time is Day Rate';
  }

  function validateForm() {
    const serviceValid = serviceSelect.value !== '';
    const descriptionValid = descriptionInput.value.trim().length >= 10;
    const dateValid = dateInput.value !== '';
    const timeValid = timeSelect.value !== '';

    submitBtn.disabled = !(serviceValid && descriptionValid && dateValid && timeValid);
  }

  openBtn.addEventListener('click', openModal);
  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', closeModal);

  dateInput.addEventListener('change', () => {
    if(dateInput.value) {
      populateTimeSlots(new Date(dateInput.value));
    }
    validateForm();
    updateRateInfo('');
  });

  timeSelect.addEventListener('change', (e) => {
    updateRateInfo(e.target.value);
    validateForm();
  });

  serviceSelect.addEventListener('change', validateForm);
  descriptionInput.addEventListener('input', validateForm);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(
      `Booking Confirmed!\n\n` +
      `Service: ${serviceSelect.value}\n` +
      `Description: ${descriptionInput.value.trim()}\n` +
      `Date: ${new Date(dateInput.value).toDateString()}\n` +
      `Time: ${timeSelect.options[timeSelect.selectedIndex].text}`
    );
    closeModal();
  });

  // Accessibility: Close modal on ESC
  document.addEventListener('keydown', (e) => {
    if(e.key === 'Escape' && modal.style.display === 'flex') {
      closeModal();
    }
  });
})();