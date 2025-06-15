document.addEventListener("DOMContentLoaded", () => {
  const users = ["John Doe", "Sarah Khan", "Ali Hussain", "Maria Patel"];

  const jobs = [
    {
      id: 1,
      service: "Recovery",
      date: "2025-06-16",
      time: "10:00",
      address: "123 Main St, London",
      description: "Flat tyre near A406",
      rate: "Standard",
      assignedTo: ""
    },
    {
      id: 2,
      service: "Towing",
      date: "2025-06-16",
      time: "20:00",
      address: "456 Kings Road, Leeds",
      description: "Engine failure",
      rate: "Night",
      assignedTo: ""
    }
  ];

  const tbody = document.getElementById("bookingTableBody");

  jobs.forEach(job => {
    const row = document.createElement("tr");

    const userOptions = users.map(
      user => `<option value="${user}" ${job.assignedTo === user ? "selected" : ""}>${user}</option>`
    ).join("");

    row.innerHTML = `
      <td>${job.service}</td>
      <td>${job.date}</td>
      <td>${job.time}</td>
      <td>${job.address}</td>
      <td>${job.description}</td>
      <td>${job.rate}</td>
      <td>
        <select class="user-dropdown" data-id="${job.id}">
          <option value="">Assign</option>
          ${userOptions}
        </select>
      </td>
    `;

    tbody.appendChild(row);
  });

  tbody.addEventListener("change", (e) => {
    if (e.target.classList.contains("user-dropdown")) {
      const jobId = parseInt(e.target.dataset.id);
      const selectedUser = e.target.value;
      const job = jobs.find(j => j.id === jobId);
      if (job) {
        job.assignedTo = selectedUser;
        console.log(`Job #${jobId} assigned to ${selectedUser}`);
      }
    }
  });
});