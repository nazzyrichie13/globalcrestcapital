

const signupForm = document.getElementById("signupForm");

const message = document.getElementById("message");

signupForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const formData = new FormData(signupForm);

  const name = formData.get("name");
  const email = formData.get("email");
  const password = formData.get("password");
  const tier = formData.get("tier");

  try {
    const response = await fetch(
      "https://api.globalcrestc.com/api/auth/register",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json"
        },

        body: JSON.stringify({
          name,
          email,
          password,
          tier
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      message.textContent =
        data.message || "Account creation failed.";

      return;
    }

    // Get the generated account number
    const accountNumber = data.user.accountNumber;

    // Display success message + account number
    message.innerHTML = `
      <strong>Account created successfully!</strong><br><br>
      Your Account Number is:<br>
      <strong>${accountNumber}</strong>
    `;

    signupForm.reset();

    // Give user time to see account number
    setTimeout(() => {
      window.location.href = "home.html";
    }, 5000);

  } catch (error) {
    console.error("Signup error:", error);

    message.textContent =
      "Could not connect to server.";
  }
});