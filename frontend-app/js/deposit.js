const form = document.getElementById("depositForm");

const message = document.getElementById("message");

const token = localStorage.getItem("token");


form.addEventListener("submit", async (e) => {

  e.preventDefault();

  const data = new FormData(form);

  const accountNumber =
    data.get("accountNumber");

  const amount =
    Number(data.get("amount"));


  try {

    const response = await fetch(
      "http://localhost:3000/api/admin/deposit",
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",

          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({
          accountNumber,
          amount
        })
      }
    );


    const result = await response.json();


    if (!response.ok) {
      throw new Error(result.message);
    }


    message.textContent =
      `${result.message}. New balance: ₦${result.balance.toLocaleString()}`;

    form.reset();


  } catch (error) {

    message.textContent =
      error.message;

  }

});