const token = localStorage.getItem("adminToken");

const adminUser =
  JSON.parse(localStorage.getItem("admin") || "null");

if (
  !token ||
  !adminUser ||
  String(adminUser.role).toLowerCase() !== "admin"
) {
  window.location.href = "admin-login.html";
}777
const accountNumber =
  document.getElementById("accountNumber");

const verifyAccount =
  document.getElementById("verifyAccount");

const accountBox =
  document.getElementById("accountBox");

const accountName =
  document.getElementById("accountName");

const verifiedAccountNumber =
  document.getElementById("verifiedAccountNumber");

const currentBalance =
  document.getElementById("currentBalance");

const depositForm =
  document.getElementById("depositForm");

const amount =
  document.getElementById("amount");

const depositButton =
  document.getElementById("depositButton");

const depositMessage =
  document.getElementById("depositMessage");


verifyAccount.addEventListener(
  "click",
  async () => {

    const number =
      accountNumber.value.trim();

    if (!number) {
      depositMessage.textContent =
        "Enter an account number.";

      return;
    }

    verifyAccount.disabled = true;
    verifyAccount.textContent = "Checking...";

    try {

      const response =
        await fetch(
          "https://api.globalcrestc.com/api/admin/deposit/verify",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
              accountNumber: number
            })
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Account not found."
        );
      }

      accountName.textContent =
        result.user.name;

      verifiedAccountNumber.textContent =
        result.user.accountNumber;

      currentBalance.textContent =
        `₦${Number(result.user.balance).toLocaleString()}`;

      accountBox.style.display = "block";

      depositMessage.textContent =
        "Account verified successfully.";

    } catch (error) {

      accountBox.style.display = "none";

      depositMessage.textContent =
        error.message;

    } finally {

      verifyAccount.disabled = false;
      verifyAccount.textContent = "Verify";

    }
  }
);


depositForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const number =
      accountNumber.value.trim();

    const depositAmount =
      Number(amount.value);

    if (!number) {
      depositMessage.textContent =
        "Verify the customer account first.";

      return;
    }

    if (!depositAmount || depositAmount <= 0) {
      depositMessage.textContent =
        "Enter a valid deposit amount.";

      return;
    }

    depositButton.disabled = true;
    depositButton.textContent =
      "Processing...";

    try {

      const response =
        await fetch(
          "https://api.globalcrestc.com/api/admin/deposit",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`
            },

            body: JSON.stringify({
              accountNumber: number,
              amount: depositAmount
            })
          }
        );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
          "Deposit failed."
        );
      }

      depositMessage.textContent =
        `Deposit successful. New balance: ₦${Number(
          result.user.balance
        ).toLocaleString()}`;

      currentBalance.textContent =
        `₦${Number(
          result.user.balance
        ).toLocaleString()}`;

      amount.value = "";

    } catch (error) {

      depositMessage.textContent =
        error.message;

    } finally {

      depositButton.disabled = false;

      depositButton.innerHTML =
        '<i class="fa-solid fa-plus"></i> Deposit Funds';

    }
  }
);