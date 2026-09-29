const menuBtn =
  document.getElementById("menuBtn");

const navLinks =
  document.getElementById("navLinks");


if (menuBtn) {

  menuBtn.addEventListener(
    "click",
    () => {

      navLinks.classList.toggle("show");

    }
  );

}


// ==============================
// CARD APPLICATION
// ==============================

const form =
  document.getElementById(
    "cardApplicationForm"
  );

const successSection =
  document.getElementById(
    "successSection"
  );

const formMessage =
  document.getElementById(
    "formMessage"
  );

const applicationReference =
  document.getElementById(
    "applicationReference"
  );


if (form) {



        const form =
  document.getElementById(
    "cardApplicationForm"
  );

const successSection =
  document.getElementById(
    "successSection"
  );

const formMessage =
  document.getElementById(
    "formMessage"
  );

const applicationReference =
  document.getElementById(
    "applicationReference"
  );


if (form) {

  form.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const token =
        localStorage.getItem("token");

      if (!token) {
        window.location.href =
          "home.html";

        return;
      }


      const submitButton =
        form.querySelector(
          ".submit-btn"
        );


      const formData =
        new FormData(form);


      const cardType =
        formData.get("cardType");

      const fullName =
        formData.get("fullName");

      const email =
        formData.get("email");

      const phone =
        formData.get("phone");

      const deliveryMethod =
        formData.get(
          "deliveryMethod"
        );

      const deliveryAddress =
        formData.get(
          "deliveryAddress"
        );


      submitButton.disabled =
        true;

      submitButton.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin"></i>
        Processing...
      `;


      try {

        const response =
          await fetch(
            "https://globalcrestc.com/api/card-applications",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
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


        const result =
          await response.json();


        if (!response.ok) {
          throw new Error(
            result.message
          );
        }


        // Create display reference
        const reference =
          "NT-CARD-" +
          result.application.id
            .slice(-8)
            .toUpperCase();


        applicationReference.textContent =
          reference;


        form.style.display =
          "none";


        successSection.classList.add(
          "show"
        );


        successSection.scrollIntoView({
          behavior: "smooth"
        });


      } catch (error) {

        formMessage.textContent =
          error.message;

        formMessage.style.display =
          "block";

      } finally {

        submitButton.disabled =
          false;

        submitButton.innerHTML = `
          Submit Card Application
          <i class="fa-solid fa-arrow-right"></i>
        `;
      }

    }
  );
}


    

    }


