function loginUser(event) {
  event.preventDefault();

  let user = document.getElementById("username").value.trim();
  let pass = document.getElementById("password").value.trim();
  let error = document.getElementById("errorMsg");

  error.textContent = ""; // Clear previous errors

  if (user === "" || pass === "") {
    error.textContent = "Please fill in all fields.";
    return;
  }

  if (user !== "Admin") {
    error.textContent = "Username not found.";
    return;
  }

  if (pass !== "12345") {
    error.textContent = "Incorrect password.";
    return;
  }

  // Login success
  window.location.href = "/ideas_loyiso-1/employee.html"; 
}
