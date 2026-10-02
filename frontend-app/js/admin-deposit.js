
// ========================================
// ADMIN AUTHENTICATION
// ========================================

const token = localStorage.getItem("adminToken");

let adminUser = null;

try {
  adminUser = JSON.parse(
    localStorage.getItem("admin") || "null"
  );
} catch (error) {
  console.error("Invalid admin data in localStorage:", error);
  adminUser = null;
}


// ========================================
// CHECK ADMIN AUTHENTICATION
// ========================================

if (
  !token ||
  !adminUser ||
  String(adminUser.role || "").toLowerCase() !== "admin"
) {
  window.location.href = "admin-login.html";
}


// ========================================
// VERIFIED ACCOUNT
// ========================================

let verifiedAccountNumber = "";


// ========================================
// GET HTML ELEMENTS
// ========================================

const accountNumber =
  document.getElementById("accountNumber");

const verifyAccount =
  document.getElementById("verifyAccount");

const accountBox =
  document.getElementById("accountBox");

const accountName =
  document.getElementById("accountName");

const verifiedAccountNumberElement =
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


// ========================================
// CHECK REQUIRED HTML ELEMENTS
// ========================================

if (
  !accountNumber ||
  !verifyAccount ||
  !accountBox ||
  !accountName ||
  !verifiedAccountNumberElement ||
  !currentBalance ||
  !depositForm ||
  !amount ||
  !depositButton ||
  !depositMessage
) {
  console.error(
    "Admin deposit page error: One or more required HTML elements are missing."
  );
}


// ========================================
// HELPER: SAFELY READ JSON RESPONSE
// ========================================

async function getResponseData(response) {

  const contentType =
    response.headers.get("content-type") || "";

  if (
    contentType.includes("application/json")
  ) {

    return await response.json();

  }

  // Backend returned HTML/text instead of JSON
  const text = await response.text();

  return {
    message:
      text ||
      `Server returned ${response.status} ${response.statusText}`
  };
}


// ========================================
// VERIFY CUSTOMER ACCOUNT
// ========================================

if (verifyAccount) {

  verifyAccount.addEventListener(
    "click",
    async () => {

      const number =
        accountNumber.value.trim();


      // --------------------------------------
      // CHECK ACCOUNT NUMBER
      // --------------------------------------

      if (!number) {

        depositMessage.textContent =
          "Enter an account number.";

        accountBox.style.display =
          "none";

        verifiedAccountNumber = "";

        return;
      }


      // --------------------------------------
      // BUTTON LOADING
      // --------------------------------------

      verifyAccount.disabled =
        true;

      verifyAccount.textContent =
        "Checking...";

      depositMessage.textContent =
        "";


      try {

        // ------------------------------------
        // VERIFY ACCOUNT
        // ------------------------------------

        const response =
          await fetch(
            "https://api.globalcrestc.com/api/admin/deposit/verify",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({
                accountNumber: number
              })
            }
          );


        // ------------------------------------
        // SAFELY READ RESPONSE
        // ------------------------------------

        const result =
          await getResponseData(response);


        // ------------------------------------
        // CHECK RESPONSE
        // ------------------------------------

        if (!response.ok) {

          throw new Error(
            result.message ||
            `Account verification failed (${response.status}).`
          );

        }


        // ------------------------------------
        // CHECK USER DATA
        // ------------------------------------

        if (!result.user) {

          throw new Error(
            "Customer information was not returned."
          );

        }


        // ------------------------------------
        // SAVE VERIFIED ACCOUNT NUMBER
        // ------------------------------------

        verifiedAccountNumber =
          result.user.accountNumber;


        if (!verifiedAccountNumber) {

          throw new Error(
            "Verified account number was not returned."
          );

        }


        // ------------------------------------
        // DISPLAY CUSTOMER INFORMATION
        // ------------------------------------

        accountName.textContent =
          result.user.name || "N/A";


        verifiedAccountNumberElement.textContent =
          result.user.accountNumber || number;


        currentBalance.textContent =
          `₦${Number(
            result.user.balance || 0
          ).toLocaleString()}`;


        // ------------------------------------
        // SHOW ACCOUNT BOX
        // ------------------------------------

        accountBox.style.display =
          "block";


        depositMessage.textContent =
          "Account verified successfully.";


      } catch (error) {

        // Clear verified account
        verifiedAccountNumber =
          "";


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

}


// ========================================
// DEPOSIT FUNDS
// ========================================

if (depositForm) {

  depositForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      // --------------------------------------
      // MAKE SURE ACCOUNT WAS VERIFIED
      // --------------------------------------

      if (!verifiedAccountNumber) {

        depositMessage.textContent =
          "Verify the customer account first.";

        return;
      }


      // --------------------------------------
      // GET AMOUNT
      // --------------------------------------

      const depositAmount =
        Number(amount.value);


      // --------------------------------------
      // CHECK AMOUNT
      // --------------------------------------

      if (
        !Number.isFinite(depositAmount) ||
        depositAmount <= 0
      ) {

        depositMessage.textContent =
          "Enter a valid deposit amount.";

        return;
      }


      // --------------------------------------
      // BUTTON LOADING
      // --------------------------------------

      depositButton.disabled =
        true;

      depositButton.textContent =
        "Processing...";

      depositMessage.textContent =
        "";


      try {

        // ------------------------------------
        // SEND DEPOSIT
        // ------------------------------------

        const response =
          await fetch(
            "https://api.globalcrestc.com/api/admin/deposit",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({

                accountNumber:
                  verifiedAccountNumber,

                amount:
                  depositAmount

              })
            }
          );


        // ------------------------------------
        // SAFELY READ RESPONSE
        // ------------------------------------

        const result =
          await getResponseData(response);


        // ------------------------------------
        // CHECK RESPONSE
        // ------------------------------------

        if (!response.ok) {

          throw new Error(
            result.message ||
            `Deposit failed (${response.status}).`
          );

        }


        // ------------------------------------
        // CHECK UPDATED USER
        // ------------------------------------

        if (!result.user) {

          throw new Error(
            "Deposit completed, but updated account information was not returned."
          );

        }


        // ------------------------------------
        // UPDATE BALANCE
        // ------------------------------------

        currentBalance.textContent =
          `₦${Number(
            result.user.balance || 0
          ).toLocaleString()}`;


        // ------------------------------------
        // SUCCESS MESSAGE
        // ------------------------------------

        depositMessage.textContent =
          `Deposit successful. New balance: ₦${Number(
            result.user.balance || 0
          ).toLocaleString()}`;


        // ------------------------------------
        // CLEAR AMOUNT
        // ------------------------------------

        amount.value =
          "";


        // ------------------------------------
        // KEEP ACCOUNT BOX VISIBLE
        // ------------------------------------

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

}

