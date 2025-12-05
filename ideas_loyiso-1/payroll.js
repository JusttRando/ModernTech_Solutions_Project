// Load employee info AND payroll data
Promise.all([
    fetch("employee_info.json").then(res => res.json()),
    fetch("payroll_data.json").then(res => res.json())
]).then(([employees, payroll]) => {

    const payrollTable = document.getElementById("payrollTable");

    payroll.payrollData.forEach(pay => {
        const emp = employees.employeeInformation.find(e => e.employeeId === pay.employeeId);

        const row = `
            <tr>
                <td>${emp ? emp.name : "Unknown Employee"}</td>
                <td>${pay.hoursWorked}</td>
                <td>${pay.leaveDeductions}</td>
                <td>R ${pay.finalSalary.toLocaleString()}</td>
            </tr>
        `;

        payrollTable.innerHTML += row;
    });
});


// Search Filter
document.getElementById("searchPayroll").addEventListener("keyup", function () {
    const filter = this.value.toLowerCase();
    const rows = document.querySelectorAll("#payrollTable tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(filter) ? "" : "none";
    });
});
