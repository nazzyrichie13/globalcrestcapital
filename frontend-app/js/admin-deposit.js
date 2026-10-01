
const token = localStorage.getItem("adminToken");

const adminUser = JSON.parse(
  localStorage.getItem("admin") || "null"
);

// Check admin authentication
if (
  !token ||
  !adminUser ||
  String(adminUser.role).toLowerCase() !== "admin"
) {
  window.location.href = "admin-login.html";
}


// ===============================
// GET HTML ELEMENTS
// ===============================

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


// ===============================
// VERIFY CUSTOMER ACCOUNT
// ===============================

verifyAccount.addEventListener(
  "click",
  async () => {

    const number =
      accountNumber.value.trim();

    if (!number) {

      depositMessage.textContent =
        "Enter an account number.";

      accountBox.style.display = "none";

      return;
    }

    verifyAccount.disabled = true;
    verifyAccount.textContent = "Checking...";

    depositMessage.textContent = "";

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

      // Make sure user exists in response
      if (!result.user) {

        throw new Error(
          "Customer information was not returned."
        );
      }

      accountName.textContent =
        result.user.name || "N/A";

      verifiedAccountNumber.textContent =
        result.user.accountNumber || number;

      currentBalance.textContent =
        `₦${Number(
          result.user.balance || 0
        ).toLocaleString()}`;

      accountBox.style.display =
        "block";

      depositMessage.textContent =
        "Account verified successfully.";

    } catch (error) {

      accountBox.style.display =
        "none";

      depositMessage.textContent =
        error.message ||
        "Unable to verify account.";

      console.error(
        "Account verification error:",
        error
      );

    } finally {

      verifyAccount.disabled =
        false;

      verifyAccount.textContent =
        "Verify";
    }
  }
);


// ===============================
// DEPOSIT FUNDS
// ===============================

depositForm.addEventListener(
  "submit",
  async (event) => {

    event.preventDefault();

    const number =
      accountNumber.value.trim();

    const depositAmount =
      Number(amount.value);

    // Check account
    if (!number) {

      depositMessage.textContent =
        "Verify the customer account first.";

      return;
    }

    // Check amount
    if (
      !depositAmount ||
      depositAmount <= 0
    ) {

      depositMessage.textContent =
        "Enter a valid deposit amount.";

      return;
    }

    depositButton.disabled =
      true;

    depositButton.textContent =
      "Processing...";

    depositMessage.textContent =
      "";

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

      // Make sure backend returned updated user
      if (!result.user) {

        throw new Error(
          "Deposit completed, but updated account information was not returned."
        );
      }

      // Update displayed balance
      currentBalance.textContent =
        `₦${Number(
          result.user.balance || 0
        ).toLocaleString()}`;

      // Success message
      depositMessage.textContent =
        `Deposit successful. New balance: ₦${Number(
          result.user.balance || 0
        ).toLocaleString()}`;

      // Clear amount
      amount.value = "";

      // Keep account box visible
      accountBox.style.display =
        "block";

    } catch (error) {

      depositMessage.textContent =
        error.message ||
        "Deposit failed.";

      console.error(
        "Deposit error:",
        error
      );

    } finally {

      depositButton.disabled =
        false;

      depositButton.innerHTML =
        '<i class="fa-solid fa-plus"></i> Deposit Funds';
    }
  }
);
