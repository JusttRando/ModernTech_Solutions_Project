// Load employees into dropdown
fetch("employee_info.json")
    .then(res => res.json())
    .then(data => {
        const select = document.getElementById("employeeName");

        data.employeeInformation.forEach(emp => {
            const opt = document.createElement("option");
            opt.value = emp.name;
            opt.textContent = emp.name;
            select.appendChild(opt);
        });
    });


// Load existing requests from localStorage
function loadRequests() {
    const requests = JSON.parse(localStorage.getItem("timeOffRequests")) || [];
    const table = document.getElementById("requestsTable");

    table.innerHTML = "";

    requests.forEach(req => {
        const row = `
            <tr>
                <td>${req.name}</td>
                <td>${req.start}</td>
                <td>${req.end}</td>
                <td>${req.reason}</td>
                <td>${req.status}</td>
            </tr>
        `;
        table.innerHTML += row;
    });
}

loadRequests();


// Handle form submission
document.getElementById("timeOffForm").addEventListener("submit", e => {
    e.preventDefault();

    const newRequest = {
        name: document.getElementById("employeeName").value,
        start: document.getElementById("startDate").value,
        end: document.getElementById("endDate").value,
        reason: document.getElementById("reason").value,
        status: "Pending"
    };

    const requests = JSON.parse(localStorage.getItem("timeOffRequests")) || [];
    requests.push(newRequest);
    localStorage.setItem("timeOffRequests", JSON.stringify(requests));

    loadRequests();
    e.target.reset();
});


// Search requests
document.getElementById("searchRequests").addEventListener("keyup", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#requestsTable tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
});

// Sidenav Slide
function State() {
    const icon = document.getElementById("icon");
    const logo = document.getElementById("logoImg");
    const sidebar = document.querySelector(".sidebar");

    sidebar.classList.toggle("collapsed");
    icon.classList.toggle("rotate");

    // Swap logo for smaller one only when collapsed AND on desktop
    if (window.innerWidth > 900) {
        logo.src = sidebar.classList.contains("collapsed")
            ? "ModernTech_Solutions_Logo-s.png"
            : "ModernTech_Solutions_Logo.png";
    }
}
