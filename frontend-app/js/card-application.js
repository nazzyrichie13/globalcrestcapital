const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");


// ==============================
// MOBILE MENU
// ==============================

if (menuBtn && navLinks) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}


// ==============================
// CARD APPLICATION
// ==============================

const form = document.getElementById("cardApplicationForm");
const successSection = document.getElementById("successSection");
const formMessage = document.getElementById("formMessage");
const applicationReference = document.getElementById(
  "applicationReference"
);


if (form) {

  form.addEventListener("submit", async (event) => {

    event.preventDefault();


    // ==============================
    // GET AUTHENTICATED TOKEN
    // ==============================

    const adminToken = localStorage.getItem("adminToken");
    const userToken = localStorage.getItem("token");

    const adminUser = JSON.parse(
      localStorage.getItem("admin") || "null"
    );

    let token = null;


    // Admin login
    if (
      adminToken &&
      adminUser &&
      String(adminUser.role).toLowerCase() === "admin"
    ) {

      token = adminToken;

    }

    // Normal customer login
    else if (userToken) {

      token = userToken;

    }


    // No authenticated session
    if (!token) {

      window.location.href = "home.html";

      return;
    }


    // ==============================
    // SUBMIT BUTTON
    // ==============================

    const submitButton =
      form.querySelector(".submit-btn");


    // ==============================
    // FORM DATA
    // ==============================

    const formData = new FormData(form);

    const cardType =
      formData.get("cardType");

    const fullName =
      formData.get("fullName");

    const email =
      formData.get("email");

    const phone =
      formData.get("phone");

    const deliveryMethod =
      formData.get("deliveryMethod");

    const deliveryAddress =
      formData.get("deliveryAddress");


    // ==============================
    // LOADING STATE
    // ==============================

    submitButton.disabled = true;

    submitButton.innerHTML = `
      <i class="fa-solid fa-spinner fa-spin"></i>
      Processing...
    `;


    try {

      // ==============================
      // SEND APPLICATION
      // ==============================

      const response = await fetch(
        "https://api.globalcrestc.com/api/card-applications",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`
          },

          body: JSON.stringify({
            cardType,
            fullName,
            email,
            phone,
            deliveryMethod,
            deliveryAddress
          })
        }
      );


      const result = await response.json();


      // ==============================
      // HANDLE ERROR
      // ==============================

      if (!response.ok) {

        throw new Error(
          result.message ||
          "Card application failed."
        );

      }


      // ==============================
      // CREATE APPLICATION REFERENCE
      // ==============================

      const reference =
        "NT-CARD-" +
        result.application.id
          .slice(-8)
          .toUpperCase();


      applicationReference.textContent =
        reference;


      // ==============================
      // SHOW SUCCESS
      // ==============================

      form.style.display = "none";

      successSection.classList.add("show");

      successSection.scrollIntoView({
        behavior: "smooth"
      });


    } catch (error) {

      console.error(
        "Card application error:",
        error
      );

      formMessage.textContent =
        error.message ||
        "Unable to submit card application.";

      formMessage.style.display = "block";


    } finally {

      submitButton.disabled = false;

      submitButton.innerHTML = `
        Submit Card Application
        <i class="fa-solid fa-arrow-right"></i>
      `;

    }

  });

}