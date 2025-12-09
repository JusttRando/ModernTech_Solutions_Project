// Load JSON and build dropdowns
fetch("/Data/attendance.json")
    .then(res => res.json())
    .then(data => {
        const container = document.getElementById("accordionContainer");

        data.attendanceAndLeave.forEach(emp => {

            const item = document.createElement("div");
            item.classList.add("accordion-item");

        item.innerHTML = `
            <div class="accordion-header">
                <span>${emp.name}</span>
                <span class="chevron">▶</span>
            </div>

            <div class="accordion-body">

                <div class="attendance-section">
                    <h3>Attendance</h3>
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${emp.attendance.map(a => `
                                <tr>
                                    <td>${a.date}</td>
                                    <td>${a.status}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>

                <div class="leave-section" style="margin-top:20px;">
                    <h3>Leave Requests</h3>
                    <table>
                        <thead>
                            <tr><th>Date</th><th>Reason</th><th>Status</th></tr>
                        </thead>
                        <tbody>
                            ${emp.leaveRequests.map(l => `
                                <tr>
                                    <td>${l.date}</td>
                                    <td>${l.reason}</td>
                                    <td>${l.status}</td>
                                </tr>
                            `).join("")}
                        </tbody>
                    </table>
                </div>

            </div>
        `;
            container.appendChild(item);
        });

        // Add click expanding
        document.querySelectorAll(".accordion-header").forEach(header => {
            header.addEventListener("click", () => {
                const body = header.nextElementSibling;
                const chevron = header.querySelector(".chevron");

                body.style.display = body.style.display === "block" ? "none" : "block";
                chevron.classList.toggle("rotate");
            });
        });
    });


// Search for employees
document.getElementById("searchAttendance").addEventListener("keyup", function () {
    const filter = this.value.toLowerCase();
    const items = document.querySelectorAll(".accordion-item");

    items.forEach(item => {
        const name = item.querySelector(".accordion-header span").innerText.toLowerCase();
        item.style.display = name.includes(filter) ? "" : "none";
    });
});


// ========== VIEW TOGGLE BUTTONS ==========
const attendanceTables = document.querySelectorAll(".attendance-section");
const leaveTables = document.querySelectorAll(".leave-section");

document.getElementById("showAttendanceBtn").addEventListener("click", () => {
    document.querySelectorAll(".attendance-section").forEach(sec => sec.style.display = "block");
    document.querySelectorAll(".leave-section").forEach(sec => sec.style.display = "none");
});

document.getElementById("showLeaveBtn").addEventListener("click", () => {
    document.querySelectorAll(".attendance-section").forEach(sec => sec.style.display = "none");
    document.querySelectorAll(".leave-section").forEach(sec => sec.style.display = "block");
});

document.getElementById("showBothBtn").addEventListener("click", () => {
    document.querySelectorAll(".attendance-section").forEach(sec => sec.style.display = "block");
    document.querySelectorAll(".leave-section").forEach(sec => sec.style.display = "block");
});

// Sidenav Slide
function State() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("hidden");
}