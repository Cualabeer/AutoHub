document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openBookingBtn');

  openBtn.addEventListener('click', () => {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'booking-overlay';

    // Create modal container
    const modal = document.createElement('div');
    modal.className = 'booking-modal';

    // Close button
    const closeBtn = document.createElement('button');
    closeBtn.className = 'close-btn';
    closeBtn.setAttribute('aria-label', 'Close booking form');
    closeBtn.innerHTML = '&times;';

    // Title
    const title = document.createElement('h3');
    title.textContent = 'Book a Service';

    // Booking form markup
    modal.innerHTML += `
      <form class="booking-form" id="bookingForm" novalidate>
        <label for="fullName">Full Name *</label>
        <input type="text" id="fullName" name="fullName" placeholder="Your full name" required />

        <label for="email">Email *</label>
        <input type="email" id="email" name="email" placeholder="Your email address" required />

        <label for="phone">Phone Number *</label>
        <input type="tel" id="phone" name="phone" placeholder="Your phone number" required />

        <label for="serviceType">Service Type *</label>
        <select id="serviceType" name="serviceType" required>
          <option value="" disabled selected>Select a service</option>
          <option value="towing">Towing</option>
          <option value="mechanic">Mechanic</option>
          <option value="inspection">Inspection</option>
          <option value="recovery">Recovery</option>
        </select>

        <label for="date">Preferred Date *</label>
        <input type="date" id="date" name="date" required />

        <label for="details">Additional Details</label>
        <textarea id="details" name="details" rows="3" placeholder="Tell us more..."></textarea>

        <button type="submit">Submit Booking</button>
      </form>
    `;

    // Insert close button and title at top of modal
    modal.prepend(closeBtn);
    modal.insertBefore(title, modal.querySelector('.booking-form'));

    // Append modal to overlay, then overlay to body
    overlay.appendChild(modal);
    document.body.appendChild(overlay);

    // Focus first input
    document.getElementById('fullName').focus();

    // Close modal handler
    const closeModal = () => {
      overlay.remove();
      openBtn.focus();
    };

    closeBtn.addEventListener('click', closeModal);

    // Close modal on outside click
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) closeModal();
    });

    // Keyboard navigation - ESC closes modal
    document.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', escHandler);
      }
    });

    // Form submission
    const form = document.getElementById('bookingForm');
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      // Gather form data
      const formData = {
        fullName: form.fullName.value.trim(),
        email: form.email.value.trim(),
        phone: form.phone.value.trim(),
        serviceType: form.serviceType.value,
        date: form.date.value,
        details: form.details.value.trim(),
      };

      // For demo, just alert the data and close modal
      alert(
        `Booking Submitted!\n
Name: ${formData.fullName}
Email: ${formData.email}
Phone: ${formData.phone}
Service: ${formData.serviceType}
Date: ${formData.date}
Details: ${formData.details || 'N/A'}
`
      );

      closeModal();
    });
  });
});
