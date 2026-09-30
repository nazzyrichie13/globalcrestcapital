const adminLoginForm = document.getElementById("adminLoginForm");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const togglePassword = document.getElementById("togglePassword");
const loginMessage = document.getElementById("loginMessage");
const loginButton = document.getElementById("loginButton");
const loginButtonText = document.getElementById("loginButtonText");

const API_URL = "https://api.globalcrestc.com";

// Show / hide password
togglePassword.addEventListener("click", () => {
const isPassword = passwordInput.type === "password";

passwordInput.type = isPassword ? "text" : "password";

togglePassword.innerHTML = isPassword
? '<i class="fa-solid fa-eye-slash"></i>'
: '<i class="fa-solid fa-eye"></i>';

togglePassword.setAttribute(
"aria-label",
isPassword ? "Hide password" : "Show password"
);
});

// Admin login
adminLoginForm.addEventListener("submit", async (event) => {
event.preventDefault();

const email = emailInput.value.trim();
const password = passwordInput.value;

loginMessage.textContent = "";
loginButton.disabled = true;
loginButtonText.textContent = "Signing in...";

try {
const response = await fetch(`${API_URL}/api/admin/login`, {
method: "POST",
headers: {
"Content-Type": "application/json"
},
body: JSON.stringify({
email,
password
})
});

const result = await response.json();


console.log("FULL ADMIN LOGIN RESPONSE:", result);
if (!response.ok) {
  loginMessage.textContent =
    result.message || "Invalid admin credentials.";
  return;
}

if (!result.token) {
  loginMessage.textContent = "Login succeeded, but no token was returned.";
  return;
}

localStorage.setItem("adminToken", result.token);

if (result.admin) {
  localStorage.setItem("admin", JSON.stringify(result.admin));
}

loginMessage.textContent = "Login successful.";

window.location.href = "admin-dashboard.html";


} catch (error) {
console.error("Admin login error:", error);


loginMessage.textContent =
  "Unable to connect to the server. Please try again.";


} finally {
loginButton.disabled = false;
loginButtonText.textContent = "Sign In";
}
});
