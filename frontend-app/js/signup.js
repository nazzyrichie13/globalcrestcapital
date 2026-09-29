

const signupForm =
  document.getElementById("signupForm");

const message =
  document.getElementById("message");


signupForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const formData =
      new FormData(signupForm);

    const name =
      formData.get("name");

    const email =
      formData.get("email");

    const password =
      formData.get("password");
      const profilePhoto = formData.get("profilePhoto");


    try {

      const response = await fetch(
        "https://globalcrestc.com/api/auth/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json"
          },

          body: JSON.stringify({
            name,
            email,
            password,
            profilePhoto
          })
        }
      );


      const data =
        await response.json();


      if (!response.ok) {

        message.textContent =
          data.message;

        return;
      }


      message.textContent =
        "Account created successfully!";


      signupForm.reset();


      setTimeout(() => {

        window.location.href =
          "home.html";

      }, 1000);


    } catch (error) {

      message.textContent =
        "Could not connect to server.";

    }

  }
);