document.addEventListener('DOMContentLoaded', () => {
  const openBtn = document.getElementById('openBookingBtn');
  if (openBtn) {
    openBtn.addEventListener('click', showBookingModal);
  }
});

function showBookingModal() {
  if (document.getElementById('bookingModal')) {
    document.getElementById('bookingModal').style.display = 'flex';
    return;
  }

  const modal = document.createElement('div');
  modal.id = 'bookingModal';
  modal.classList.add('booking-modal');
  modal.innerHTML = `
    <div class="modal-content">
      <span class="close-btn" id="closeBooking">&times;</span>
      <h2>Book a Service</h2>
      <p>Please describe your issue or what you need:</p>
      <textarea placeholder="E.g. Tow needed from M25, breakdown after 5PM..."></textarea>
      <button class="btn-primary">Confirm Booking</button>
    </div>
  `;
  document.body.appendChild(modal);

  document.getElementById('closeBooking').addEventListener('click', () => {
    modal.style.display = 'none';
  });
}