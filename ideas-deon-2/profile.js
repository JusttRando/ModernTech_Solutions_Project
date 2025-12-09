// profile.js
Promise.all([
  fetch("employee_info.json").then(r => r.json()),
  fetch("payroll_data.json").then(r => r.json()),
  fetch("attendance.json").then(r => r.json())
]).then(([empData, payrollData, attendanceData]) => {

  const employees = empData.employeeInformation || [];
  const payroll = payrollData.payrollData || [];
  const attendance = attendanceData.attendanceAndLeave || [];

  const select = document.getElementById("employeeSelect");
  const container = document.getElementById("profileContainer");
  const attendanceSummary = document.getElementById("attendanceSummary");

  employees.forEach(e => {
    const opt = document.createElement("option");
    opt.value = e.employeeId;
    opt.textContent = e.name;
    select.appendChild(opt);
  });

  const fmtCurrency = (n) => {
    try { return "R " + n.toLocaleString(); } 
    catch { return "R " + n; }
  };

  function renderProfile(employeeId) {
    const emp = employees.find(x => x.employeeId == employeeId);
    if (!emp) { container.innerHTML = "<p>No employee selected</p>"; return; }

    const pay = payroll.find(p => p.employeeId == employeeId);
    const hoursWorked = pay ? pay.hoursWorked : 0;
    const leaveDeductions = pay ? pay.leaveDeductions : 0;
    const finalSalary = pay ? pay.finalSalary : null;

    const att = attendance.find(a => a.employeeId == employeeId);
    const attendanceRecords = att ? (att.attendance || []) : [];
    const leaveRequestsFromAttendance = att ? (att.leaveRequests || []) : [];

    const stored = JSON.parse(localStorage.getItem("timeOffRequests") || "[]");
    const myLocalRequests = stored.filter(r => r.name === emp.name);

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

    // Attendance table
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

    // Attendance histogram
    const statusCounts = { Present: 0, Absent: 0 };
    attendanceRecords.forEach(a => {
      const s = String(a.status).toLowerCase();
      if (s === "present") statusCounts.Present++;
      if (s === "absent") statusCounts.Absent++;
    });

    if (window.attendanceChartInstance) window.attendanceChartInstance.destroy();
    const ctx = document.getElementById('attendanceChart').getContext('2d');
    window.attendanceChartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Present', 'Absent'],
        datasets: [{
          label: 'Attendance Count',
          data: [statusCounts.Present, statusCounts.Absent],
          backgroundColor: ['#4caf50', '#f44336'],
          borderRadius: 6,
          barPercentage: 0.6
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
          tooltip: { enabled: true }
        },
        scales: {
          y: { beginAtZero: true, precision:0 },
          x: { grid: { display: false } }
        }
      }
    });
  }

  function emojiFor(name) {
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

  if (employees.length) {
    renderProfile(employees[0].employeeId);
    select.value = employees[0].employeeId;
  } else { container.innerHTML = "<p>No employees found.</p>"; }

  select.addEventListener("change", () => { renderProfile(select.value); });
  document.getElementById("openTimeoff").addEventListener("click", () => { window.location.href = "timeoff.html"; });

  document.getElementById("searchProfile").addEventListener("keyup", function () {
    const val = this.value.toLowerCase();
    Array.from(select.options).forEach(opt => { opt.hidden = !opt.text.toLowerCase().includes(val); });
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
