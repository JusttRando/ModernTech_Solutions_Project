// profile.js
// Loads employee_info.json, payroll_data.json and attendance.json, and localStorage time-off requests.
// Shows emoji avatar, contact, position, department, hoursWorked, leaveDeductions and all leave/timeoff requests.

Promise.all([
  fetch("employee_info.json").then(r => r.json()),       // employee info (uploaded). :contentReference[oaicite:2]{index=2}
  fetch("payroll_data.json").then(r => r.json()),        // payroll data (provided by you)
  fetch("attendance.json").then(r => r.json())          // attendance & leave (uploaded). :contentReference[oaicite:3]{index=3}
]).then(([empData, payrollData, attendanceData]) => {

  const employees = empData.employeeInformation || [];
  const payroll = payrollData.payrollData || [];
  const attendance = attendanceData.attendanceAndLeave || [];

  const select = document.getElementById("employeeSelect");
  const container = document.getElementById("profileContainer");
  const attendanceSummary = document.getElementById("attendanceSummary");

  // populate select
  employees.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.employeeId;
    opt.textContent = e.name;
    select.appendChild(opt);
  });

  // helper to format currency
  const fmtCurrency = (n) => {
    try {
      return "R " + n.toLocaleString();
    } catch (err) {
      return "R " + n;
    }
  };

  // render function
  function renderProfile(employeeId) {
    const emp = employees.find(x => x.employeeId == employeeId);
    if (!emp) {
      container.innerHTML = "<p>No employee selected</p>";
      return;
    }

    // payroll record
    const pay = payroll.find(p => p.employeeId == employeeId);
    const hoursWorked = pay ? pay.hoursWorked : 0;
    const leaveDeductions = pay ? pay.leaveDeductions : 0;
    const finalSalary = pay ? pay.finalSalary : null;

    // attendance record (from attendance.json)
    const att = attendance.find(a => a.employeeId == employeeId);
    const attendanceRecords = att ? (att.attendance || []) : [];
    const leaveRequestsFromAttendance = att ? (att.leaveRequests || []) : [];

    // time off requests stored in localStorage by your Time Off page
    const stored = JSON.parse(localStorage.getItem("timeOffRequests") || "[]");
    const myLocalRequests = stored.filter(r => r.name === emp.name);

    // Build HTML
    container.innerHTML = `
      <div class="profile-card">
        <div class="avatar" title="${emp.name}"> ${emojiFor(emp.name)} </div>
        <div class="meta">
          <h2>${emp.name}</h2>
          <p><strong>Position:</strong> ${emp.position}</p>
          <p><strong>Department:</strong> ${emp.department}</p>
          <p><strong>Contact:</strong> <a href="mailto:${emp.contact}">${emp.contact}</a></p>

          <div class="small-stats">
            <div class="stat">
              <div style="font-size:13px;color:#777">Hours Worked</div>
              <div style="font-weight:700;font-size:18px">${hoursWorked}</div>
            </div>
            <div class="stat">
              <div style="font-size:13px;color:#777">Leave Deductions (hrs)</div>
              <div style="font-weight:700;font-size:18px">${leaveDeductions}</div>
            </div>
            <div class="stat">
              <div style="font-size:13px;color:#777">Final Salary</div>
              <div style="font-weight:700;font-size:18px">${finalSalary ? fmtCurrency(finalSalary) : "N/A"}</div>
            </div>
          </div>

          <div class="note">Employment history: ${emp.employmentHistory || "—"}</div>
        </div>
      </div>

      <div class="requests">
        <h3>Leave requests (from attendance.json)</h3>
        ${leaveRequestsFromAttendance.length ? `<ul>${leaveRequestsFromAttendance.map(l => `<li>${l.date} — ${l.reason} (${l.status})</li>`).join("")}</ul>` : "<p>No leave requests found in attendance data.</p>"}

        <h3 style="margin-top:12px">Time Off requests (from Time Off page)</h3>
        ${myLocalRequests.length ? `<ul>${myLocalRequests.map(r => `<li>${r.start} → ${r.end} — ${r.reason} (${r.status})</li>`).join("")}</ul>` : "<p>No submitted time off requests found.</p>"}
      </div>
    `;

    // attendance summary table
    attendanceSummary.innerHTML = `
      <div class="table-wrapper" style="margin-top:14px;">
        <h3>Attendance (most recent entries)</h3>
        <table>
          <thead>
            <tr><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            ${attendanceRecords.slice(-12).reverse().map(a => `<tr><td>${a.date}</td><td>${statusBadge(a.status)}</td></tr>`).join("")}
          </tbody>
        </table>
      </div>
    `;
  }

  // helper: simple emoji generator from name (keeps it fun)
  function emojiFor(name) {
    // pick an emoji based on hash of name
    const pool = ["🧑‍💻","👩‍💼","🧑‍🔬","👨‍💼","🧑‍🎨","🧑‍🔧","👩‍🔧","👩‍🍳","🧑‍💼","👨‍🏫","👩‍💻"];
    let h = 0;
    for (let i=0;i<name.length;i++) h = (h*31 + name.charCodeAt(i)) >>> 0;
    return pool[h % pool.length];
  }

  function statusBadge(status) {
    const s = String(status).toLowerCase();
    if (s === "present") return `<span style="color:green;font-weight:600;">Present</span>`;
    if (s === "absent") return `<span style="color:#d64545;font-weight:600;">Absent</span>`;
    return status;
  }

  // initial render: first employee
  if (employees.length) {
    renderProfile(employees[0].employeeId);
    select.value = employees[0].employeeId;
  } else {
    container.innerHTML = "<p>No employees found.</p>";
  }

  // change handler
  select.addEventListener("change", () => {
    renderProfile(select.value);
  });

  // hookup open time off page button
  document.getElementById("openTimeoff").addEventListener("click", () => {
    window.location.href = "timeoff.html";
  });

  // search filter quick-wire (filters dropdown)
  document.getElementById("searchProfile").addEventListener("keyup", function () {
    const val = this.value.toLowerCase();
    // filter select options
    Array.from(select.options).forEach(opt => {
      opt.hidden = !opt.text.toLowerCase().includes(val);
    });
    // if current becomes hidden, pick first visible
    if (select.selectedOptions[0] && select.selectedOptions[0].hidden) {
      const firstVisible = Array.from(select.options).find(o => !o.hidden);
      if (firstVisible) select.value = firstVisible.value;
      renderProfile(select.value);
    }
  });

}).catch(err => {
  console.error("Failed to load profile data", err);
  document.getElementById("profileContainer").innerHTML = "<p>Error loading data — check console.</p>";
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
