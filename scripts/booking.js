// Booking modal and calendar/time slots functionality

document.addEventListener("DOMContentLoaded", () => {
  const openBtn = document.getElementById("openBookingBtn");
  const modal = document.getElementById("bookingModal");
  const closeBtn = document.getElementById("closeBookingBtn");
  const bookingForm = document.getElementById("bookingForm");

  const serviceSelect = document.getElementById("serviceSelect");
  const descriptionInput = document.getElementById("descriptionInput");

  const monthYearDisplay = document.getElementById("monthYear");
  const prevMonthBtn = document.getElementById("prevMonthBtn");
  const nextMonthBtn = document.getElementById("nextMonthBtn");
  const calendarBody = document.getElementById("calendarBody");

  const timeslotsContainer = document.getElementById("timeslotsContainer");
  const submitBtn = document.getElementById("submitBookingBtn");

  let selectedDate = null;
  let selectedTime = null;

  let currentYear, currentMonth;

  // Constants
  const DAY_RATE_START = 9; // 9 AM
  const DAY_RATE_END = 18; // 6 PM

  // Open modal
  openBtn.addEventListener("click", () => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    bookingForm.reset();
    selectedDate = null;
    selectedTime = null;
    updateSubmitButton();
    renderCalendar(currentYear, currentMonth);
    timeslotsContainer.innerHTML = '<p>Select a date to see available time slots.</p>';
    serviceSelect.focus();
  });

  // Close modal
  closeBtn.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("show")) {
      closeModal();
    }
  });

  function closeModal() {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  }

  // Initialize to current date
  const today = new Date();
  currentYear = today.getFullYear();
  currentMonth = today.getMonth();

  // Render calendar
  function renderCalendar(year, month) {
    monthYearDisplay.textContent = new Date(year, month).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    calendarBody.innerHTML = "";

    // Weekday headers
    const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    weekdays.forEach(day => {
      const dayDiv = document.createElement("div");
      dayDiv.textContent = day;
      dayDiv.style.fontWeight = "700";
      dayDiv.style.backgroundColor = "#dcdde1";
      dayDiv.style.cursor = "default";
      calendarBody.appendChild(dayDiv);
    });

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDayIndex = firstDay.getDay();

    // Fill blank days before the first
    for (let i = 0; i < startDayIndex; i++) {
      const blank = document.createElement("div");
      blank.classList.add("disabled");
      calendarBody.appendChild(blank);
    }

    // Fill days
    for (let day = 1; day <= lastDay.getDate(); day++) {
      const dateDiv = document.createElement("div");
      dateDiv.tabIndex = 0;
      dateDiv.textContent = day;

      const dateObj = new Date(year, month, day);
      dateDiv.dataset.date = dateObj.toISOString();

      // Disable past dates (before today)
      if (dateObj < today.setHours(0,0,0,0)) {
        dateDiv.classList.add("disabled");
        dateDiv.tabIndex = -1;
      } else {
        dateDiv.addEventListener("click", () => {
          selectDate(dateDiv, dateObj);
        });
        dateDiv.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            selectDate(dateDiv, dateObj);
          }
        });
      }

      calendarBody.appendChild(dateDiv);
    }
  }

  function selectDate(element, dateObj) {
    // Clear previous selection
    [...calendarBody.querySelectorAll(".selected")].forEach(el => el.classList.remove("selected"));

    element.classList.add("selected");
    selectedDate = dateObj;
    selectedTime = null;
    renderTimeSlots(dateObj);
    updateSubmitButton();
  }

  function renderTimeSlots(date) {
    timeslotsContainer.innerHTML = "";
    const container = timeslotsContainer;

    const slots = [];

    // Create slots from 9AM to 6PM (day rate)
    for (let hour = DAY_RATE_START; hour < DAY_RATE_END; hour++) {
      slots.push({ hour, rate: "day" });
    }
    // Create slots from 6PM to 11PM (night rate)
    for (let hour = DAY_RATE_END; hour <= 23; hour++) {
      slots.push({ hour, rate: "night" });
    }

    container.appendChild(createTimeSlotsButtons(slots));
  }

  function createTimeSlotsButtons(slots) {
    const fragment = document.createDocumentFragment();

    slots.forEach(({ hour, rate }) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.classList.add(rate === "day" ? "day-rate" : "night-rate");
      btn.textContent = formatHour(hour) + (rate === "night" ? " (Night rate)" : "");
      btn.dataset.hour = hour;

      btn.addEventListener("click", () => {
        // Deselect previous
        [...timeslotsContainer.querySelectorAll("button.selected")].forEach(el => el.classList.remove("selected"));
        btn.classList.add("selected");
        selectedTime = hour;
        updateSubmitButton();
      });

      fragment.appendChild(btn);
    });

    return fragment;
  }

  function formatHour(h) {
    const ampm = h >= 12 ? "PM" : "AM";
    let hour12 = h % 12;
    hour12 = hour12 === 0 ? 12 : hour12;
    return `${hour12}:00 ${ampm}`;
  }

  // Month navigation
  prevMonthBtn.addEventListener("click", () => {
    if (currentMonth === 0) {
      currentMonth = 11;
      currentYear--;
    } else {
      currentMonth--;
    }
    renderCalendar(currentYear, currentMonth);
  });

  nextMonthBtn.addEventListener("click", () => {
    if (currentMonth === 11) {
      currentMonth = 0;
      currentYear++;
    } else {
      currentMonth++;
    }
    renderCalendar(currentYear, currentMonth);
  });

  // Enable submit button only if all fields selected/filled
  function updateSubmitButton() {
    const serviceSelected = serviceSelect.value !== "";
    const descriptionFilled = descriptionInput.value.trim() !== "";
    const dateSelected = selectedDate !== null;
    const timeSelected = selectedTime !== null;

    submitBtn.disabled = !(serviceSelected && descriptionFilled && dateSelected && timeSelected);
  }

  // Update submit button on form inputs change
  serviceSelect.addEventListener("change", updateSubmitButton);
  descriptionInput.addEventListener("input", updateSubmitButton);

  // Handle form submit
  bookingForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (submitBtn.disabled) return;

    // Format booking data
    const booking = {
      service: serviceSelect.value,
      description: descriptionInput.value.trim(),
      date: selectedDate.toISOString().split("T")[0],
      time: formatHour(selectedTime),
      rate: selectedTime >= DAY_RATE_END ? "night" : "day"
    };

    alert(
      `Booking confirmed:\n` +
      `Service: ${booking.service}\n` +
      `Description: ${booking.description}\n` +
      `Date: ${booking.date}\n` +
      `Time: ${booking.time} (${booking.rate} rate)`
    );

    // Here you would typically send data to backend

    closeModal();
  });
});
