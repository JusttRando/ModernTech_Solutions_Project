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
            `;``
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

// Sidenav Slide
function State() {
    const icon = document.getElementById("icon");
    const logo = document.getElementById("logoImg");
    const sidebar = document.querySelector(".sidebar");

    sidebar.classList.toggle("collapsed");
    icon.classList.toggle("rotate");

<<<<<<< HEAD
=======
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
>>>>>>> 4aa3dd703de26213e91ece8b55901f7158eec610
}
// SORTING FUNCTION
const table = document.getElementById("employeeTable");
let currentSort = { column: "", order: "asc" };

document.querySelectorAll("th[data-sort]").forEach(header => {
    header.style.cursor = "pointer";

    header.addEventListener("click", () => {
        const column = header.dataset.sort;

        // Toggle ASC/DESC
        if (currentSort.column === column) {
            currentSort.order = currentSort.order === "asc" ? "desc" : "asc";
        } else {
            currentSort.column = column;
            currentSort.order = "asc";
        }

        sortTable(column, currentSort.order);
    });
});

function sortTable(column, order) {
    let rows = Array.from(table.querySelectorAll("tr"));

    rows.sort((a, b) => {
        const cellA = a.children[getColumnIndex(column)].innerText;
        const cellB = b.children[getColumnIndex(column)].innerText;

        if (column === "salary") {
            // Remove currency formatting and convert to number
            const numA = parseFloat(cellA.replace(/[R\s,]/g, ""));
            const numB = parseFloat(cellB.replace(/[R\s,]/g, ""));
            return order === "asc" ? numA - numB : numB - numA;
        }

        // alphabetic sort
        return order === "asc"
            ? cellA.localeCompare(cellB)
            : cellB.localeCompare(cellA);
    });

    // Put rows back in the DOM
    rows.forEach(row => table.appendChild(row));
}

function getColumnIndex(column) {
    switch (column) {
        case "name": return 0;
        case "position": return 1;
        case "department": return 2;
        case "salary": return 3;
        default: return 0;
    }
}
