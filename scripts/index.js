// Toggle mobile menu
const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('show');
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    nav.classList.remove('show'); // close menu on mobile after click
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});

// Date and time picker for #pickup_datetime

const pickupDatetimeInput = document.getElementById('pickup_datetime');

pickupDatetimeInput.addEventListener('click', () => {
  openDateTimePicker();
});

function openDateTimePicker() {
  // Create overlay
  const overlay = document.createElement('div');
  overlay.style = `
    position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
    background: rgba(0,0,0,0.5); display: flex; justify-content: center; align-items: center;
    z-index: 10000;
  `;

  // Create picker container
  const picker = document.createElement('div');
  picker.style = `
    background: white; border-radius: 8px; max-width: 350px; width: 90%;
    padding: 1rem; box-shadow: 0 2px 12px rgba(0,0,0,0.3);
  `;

  // Title
  const title = document.createElement('h3');
  title.innerText = 'Select Date and Time';
  title.style.marginBottom = '1rem';
  picker.appendChild(title);

  // Date input
  const dateInput = document.createElement('input');
  dateInput.type = 'date';
  dateInput.min = new Date().toISOString().split('T')[0]; // Today
  dateInput.style.width = '100%';
  dateInput.style.marginBottom = '1rem';
  picker.appendChild(dateInput);

  // Time slot selector
  const timeLabel = document.createElement('label');
  timeLabel.innerText = 'Select Time Slot';
  timeLabel.style.fontWeight = '600';
  picker.appendChild(timeLabel);

  const timeSelect = document.createElement('select');
  timeSelect.style.width = '100%';
  timeSelect.style.marginTop = '0.5rem';
  timeSelect.style.marginBottom = '1rem';

  // Populate time slots 9am to 6pm - day rate
  // then after 6pm - night rate
  // 1-hour slots

  function populateTimeSlots(selectedDate) {
    timeSelect.innerHTML = '';
    if (!selectedDate) return;
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const isToday = selectedDate === todayStr;

    // Start from 9:00
    for (let hour = 9; hour <= 21; hour++) {
      // If today, filter out past hours
      if (isToday && hour <= now.getHours()) continue;

      // Format display text and value
      const hourStr = hour.toString().padStart(2, '0');
      const displayHour = hour > 12 ? hour - 12 : hour;
      const ampm = hour >= 12 ? 'PM' : 'AM';
      const rate = hour < 18 ? 'Day Rate' : 'Night Rate';
      const optionText = `${displayHour}:00 ${ampm} (${rate})`;

      const option = document.createElement('option');
      option.value = `${hourStr}:00`;
      option.innerText = optionText;
      timeSelect.appendChild(option);
    }
  }

  // Initial populate with today selected by default
  dateInput.value = new Date().toISOString().split('T')[0];
  populateTimeSlots(dateInput.value);

  dateInput.addEventListener('change', () => {
    populateTimeSlots(dateInput.value);
  });

  picker.appendChild(timeSelect);

  // Buttons container
  const buttonsDiv = document.createElement('div');
  buttonsDiv.style.textAlign = 'right';

  // Cancel button
  const cancelBtn = document.createElement('button');
  cancelBtn.type = 'button';
  cancelBtn.innerText = 'Cancel';
  cancelBtn.style.marginRight = '1rem';
  cancelBtn.addEventListener('click', () => {
    document.body.removeChild(overlay);
  });
  buttonsDiv.appendChild(cancelBtn);

  // Confirm button
  const confirmBtn = document.createElement('button');
  confirmBtn.type = 'button';
  confirmBtn.innerText = 'Confirm';
  confirmBtn.style.backgroundColor = '#f39c12';
  confirmBtn.style.color = 'white';
  confirmBtn.style.border = 'none';
  confirmBtn.style.padding = '0.5rem 1rem';
  confirmBtn.style.borderRadius = '4px';
  confirmBtn.style.cursor = 'pointer';

  confirmBtn.addEventListener('click', () => {
    if (!dateInput.value) {
      alert('Please select a date.');
      return;
    }
    if (!timeSelect.value) {
      alert('Please select a time slot.');
      return;
    }
    // Format: YYYY-MM-DD HH:MM
    pickupDatetimeInput.value = `${dateInput.value} ${timeSelect.value}`;
    document.body.removeChild(overlay);
  });
  buttonsDiv.appendChild(confirmBtn);

  picker.appendChild(buttonsDiv);
  overlay.appendChild(picker);
  document.body.appendChild(overlay);
}

// Form submit handler (basic validation + alert)
const form = document.getElementById('recovery');
form.addEventListener('submit', e => {
  e.preventDefault();

  // Simple form validation (fields have required attribute, so mostly safe)
  const serviceType = form.querySelector('#service_type').value;
  const contactName = form.querySelector('#contact_name').value.trim();
  const contactPhone = form.querySelector('#contact_phone').value.trim();
  const location = form.querySelector('#pickup_location').value.trim();
  const description = form.querySelector('#service_description').value.trim();
  const datetime = form.querySelector('#pickup_datetime').value.trim();

  if (!serviceType || !contactName || !contactPhone || !location || !description || !datetime) {
    alert('Please fill all required fields before submitting.');
    return;
  }

  // Here you could send the data via fetch/AJAX to your backend or API
  alert(`Service request received!\n
Service: ${serviceType}
Name: ${contactName}
Phone: ${contactPhone}
Location: ${location}
Date & Time: ${datetime}\n
We will contact you shortly!`);

  form.reset();
  pickupDatetimeInput.value = '';
});
