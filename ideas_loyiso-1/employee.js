// Load the employee JSON file
fetch("employee_info.json")
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
            `;
            table.innerHTML += row;
        });
    });

// Search filter
document.getElementById("search").addEventListener("keyup", function () {
    const value = this.value.toLowerCase();
    const rows = document.querySelectorAll("#employeeTable tr");

    rows.forEach(row => {
        row.style.display = row.innerText.toLowerCase().includes(value) ? "" : "none";
    });
});

function State()
{
    const icon = document.getElementById("icon");
    const logo = document.getElementById("logoImg");
    const button = document.getElementById("state");
    const sidebar = document.querySelector("aside");
    const dash = document.querySelectorAll("nav a")[0];
    const attain = document.querySelectorAll("nav a")[1];
    const pay = document.querySelectorAll("nav a")[2];
    const leave = document.querySelectorAll("nav a")[3];
    const profile = document.querySelectorAll("nav a")[4];

    const currentWidth = getComputedStyle(sidebar).width;

    if (currentWidth === "230px")
    {
        logo.src = "ModernTech_Solutions_Logo-s.png"
        logo.style.width = "50px"
        dash.innerText = "📃"
        attain.innerText = "👥"
        pay.innerText = "💵"
        leave.innerText = "🕑"
        profile.innerText = "👤"
        sidebar.style.width = "50px"
        icon.classList.toggle("rotate")
        button.style.backgroundColor = "cadetblue"
    }
    else
    {
        logo.src = "ModernTech_Solutions_Logo.png"
        logo.style.width = "220px"
        dash.innerText = "📃 Dashboard"
        attain.innerText = "👥 Attendance"
        pay.innerText = "💵 Payroll"
        leave.innerText = "🕑 Time Off"
        profile.innerText = " 👤Profile"
        sidebar.style.width = "230px"
        icon.classList.toggle("rotate")
        button.style.backgroundColor = "wheat"

    }
}
