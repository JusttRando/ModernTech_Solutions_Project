// Load employee info AND payroll data
Promise.all([
    fetch("employee_info.json").then(res => res.json()),
    fetch("payroll_data.json").then(res => res.json())
]).then(([employeesData, payrollData]) => {

    const employees = employeesData.employeeInformation;
    const payroll = payrollData.payrollData;
    const payrollTable = document.getElementById("payrollTable");

    // Assume an hourly rate calculation
    const HOURLY_RATE = 450; // you can adjust this value

    payroll.forEach(p => {
        const emp = employees.find(e => e.employeeId === p.employeeId);

        // Automated salary calculation
        const gross = p.hoursWorked * HOURLY_RATE;
        const leavePenalty = p.leaveDeductions * HOURLY_RATE;
        const finalSalary = gross - leavePenalty;

        // Add row
        payrollTable.innerHTML += `
            <tr>
                <td>${emp.name}</td>
                <td>${p.hoursWorked}</td>
                <td>${p.leaveDeductions}</td>
                <td>
                    <button onclick="generatePayslip('${emp.name}', '${emp.position}', '${p.hoursWorked}', '${p.leaveDeductions}', '${HOURLY_RATE}', '${finalSalary}')"
                        style="padding:6px 10px;border:none;background:#2763ff;color:white;border-radius:6px;cursor:pointer;">
                        Payslip
                    </button>
                </td>
            </tr>
        `;
    });

});


// --- Payslip Generator ---
window.generatePayslip = function(name, position, hours, deductions, rate, finalSalary) {

    const gross = hours * rate;
    const leaveCost = deductions * rate;

    document.getElementById("payslipContent").innerHTML = `
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Position:</strong> ${position}</p>

        <hr>

        <p><strong>Hourly Rate:</strong> R ${rate.toLocaleString()}</p>
        <p><strong>Hours Worked:</strong> ${hours}</p>
        <p><strong>Leave Deductions:</strong> ${deductions} hrs</p>

        <hr>

        <p><strong>Gross Salary:</strong> R ${gross.toLocaleString()}</p>
        <p><strong>Leave Deduction Cost:</strong> - R ${leaveCost.toLocaleString()}</p>

        <h3>Final Salary: R ${Number(finalSalary).toLocaleString()}</h3>
    `;

    document.getElementById("payslipModal").style.display = "flex";
};

window.closePayslip = function() {
    document.getElementById("payslipModal").style.display = "none";
};


// Search Filter
document.getElementById("searchPayroll").addEventListener("keyup", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#payrollTable tr");

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
