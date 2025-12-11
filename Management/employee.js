//employee.js

// Load the employee JSON file
fetch("/Data/employee_info.json")
    .then(response => response.json())
    .then(data => { 
        const table = document.getElementById("employeeTable");

        data.employeeInformation.forEach(emp => {
            const row = `
                <tr>
                    <td>${emp.name}</td>
                    <td>${emp.position}</td>
                    <td>${emp.department}</td>
                    <td>R ${emp.salary.toLocaleString()}</td>
                    <td>${emp.contact}</td>
                </tr>
            `;``
            table.innerHTML += row;
        });
    });

// Search filter for employee table
document.getElementById("search").addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("#employeeTable tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

// Sidenav Slllllide    
function State() {
    const sidebar = document.querySelector(".sidebar");
    sidebar.classList.toggle("hidden");
}



