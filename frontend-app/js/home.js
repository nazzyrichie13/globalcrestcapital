// ========================================
// HOME JS CONNECTED
// ========================================

console.log("home is CONNECTED");


// ========================================
// ELEMENTS
// ========================================

const slidecontainer =
  document.querySelector(".slides");

const slide =
  document.querySelectorAll(".slide");

let index = 0;


// LOGIN
const loginSection =
  document.getElementById("loginSection");

const dashboardSection =
  document.getElementById("dashboardSection");

const loginForm =
  document.getElementById("loginForm");

const message =
  document.getElementById("message");


// LOGOUT
const logoutButton =
  document.getElementById("logout");


// PROFILE
const profilePhoto =
  document.getElementById("profilePhoto");

const userName =
  document.getElementById("userName");

const accountNumber =
  document.getElementById("accountNumber");

const balance =
  document.getElementById("balance");

const userTier =
  document.getElementById("userTier");

const tierLimit =
  document.getElementById("tierLimit");


// TRANSACTIONS
const transactionsContainer =
  document.getElementById("transactions");


// ========================================
// TRANSFER ELEMENTS
// ========================================

const transferForm =
  document.getElementById("transferForm");

const transferType =
  document.getElementById("transferType");

const sameBankSection =
  document.getElementById("sameBankSection");

const externalBankSection =
  document.getElementById("externalBankSection");

const verifySameBank =
  document.getElementById("verifySameBank");

const verifyExternalBank =
  document.getElementById("verifyExternalBank");

const verifiedAccountBox =
  document.getElementById("verifiedAccountBox");

const verifiedAccountName =
  document.getElementById("verifiedAccountName");

const verificationStatus =
  document.getElementById("verificationStatus");


// ========================================
// TRANSFER RESULT
// ========================================

const transferResult =
  document.getElementById("transferResult");

const transferStatusTitle =
  document.getElementById("transferStatusTitle");

const transferStatusMessage =
  document.getElementById("transferStatusMessage");

const receiptButtons =
  document.getElementById("receiptButtons");

const receipt =
  document.getElementById("receipt");

const viewReceipt =
  document.getElementById("viewReceipt");

const downloadReceipt =
  document.getElementById("downloadReceipt");

const saveReceiptImage =
  document.getElementById("saveReceiptImage");


// ========================================
// TOKEN
// ========================================

let token =
  localStorage.getItem("token");


// ========================================
// TRANSFER WATCHER
// ========================================

let transferCheckInterval = null;


// ========================================
// SLIDER
// ========================================

if (
  slidecontainer &&
  slide.length > 0
) {

  setInterval(() => {

    index =
      (index + 1) % slide.length;

    slidecontainer.style.transform =
      `translateX(-${index * 100}%)`;

  }, 3000);

}


// ========================================
// LOGIN
// ========================================

if (loginForm) {

  loginForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();

      const formData =
        new FormData(loginForm);

      const email =
        formData.get("email");

      const password =
        formData.get("password");


      try {

        const response =
          await fetch(
            "https://api.globalcrestc.com/api/auth/login",
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json"
              },

              body: JSON.stringify({
                email,
                password
              })
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          throw new Error(
            data.message ||
            "Login failed"
          );

        }


        // SAVE TOKEN
        localStorage.setItem(
          "token",
          data.token
        );

        token =
          data.token;


        // SHOW DASHBOARD
        if (loginSection) {

          loginSection.style.display =
            "none";

        }


        if (dashboardSection) {

          dashboardSection.style.display =
            "block";

        }


        if (message) {

          message.textContent =
            "";

        }


        // LOAD USER DATA
        getProfile();

        getTransactions();


      } catch (error) {

        console.error(
          "Login error:",
          error
        );

        if (message) {

          message.textContent =
            error.message ||
            "Login failed";

        }

      }

    }
  );

}


// ========================================
// GET PROFILE
// ========================================

async function getProfile() {

  if (!token) {

    return;

  }


  try {

    const response =
      await fetch(
        "https://api.globalcrestc.com/api/users/profile",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to load profile"
      );

    }


    const user =
      data.user;


    if (!user) {

      throw new Error(
        "User information was not returned"
      );

    }


    // NAME
    if (userName) {

      userName.textContent =
        user.name || "Customer";

    }


    // ACCOUNT NUMBER
    if (accountNumber) {

      accountNumber.textContent =
        user.accountNumber || "---";

    }


    // BALANCE
    if (balance) {

      balance.textContent =
        Number(
          user.balance || 0
        ).toLocaleString();

    }


    // PROFILE PHOTO
    if (profilePhoto) {

      if (user.profilePhoto) {

        profilePhoto.src =
          user.profilePhoto;

      } else {

        profilePhoto.src =
          "default-profile.png";

      }

    }


    // ACCOUNT TIER
    if (userTier) {

      userTier.textContent =
        `Tier ${user.tier || 1}`;

    }


    // TIER LIMIT
    if (tierLimit) {

      tierLimit.textContent =
        `₦${Number(
          user.tierLimit || 0
        ).toLocaleString()}`;

    }


    // OTHER DASHBOARD NAME
    const welcomeName =
      document.getElementById(
        "welcomeName"
      );

    if (welcomeName) {

      welcomeName.textContent =
        user.name || "Customer";

    }


    // CARD HOLDER
    const cardHolderName =
      document.getElementById(
        "cardHolderName"
      );

    if (cardHolderName) {

      cardHolderName.textContent =
        user.name || "YOUR NAME";

    }


    // CONNECTED ACCOUNT
    const connectedAccount =
      document.getElementById(
        "connectedAccount"
      );

    if (connectedAccount) {

      const acc =
        String(
          user.accountNumber || ""
        );

      connectedAccount.textContent =
        acc.slice(-4) || "----";

    }


  } catch (error) {

    console.error(
      "Profile error:",
      error
    );

  }

}


// ========================================
// GET TRANSACTIONS
// ========================================

async function getTransactions() {

  if (!token) {

    return;

  }


  if (!transactionsContainer) {

    return;

  }


  try {

    const response =
      await fetch(
        "https://api.globalcrestc.com/api/users/transactions",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    const data =
      await response.json();


    if (!response.ok) {

      throw new Error(
        data.message ||
        "Unable to load transactions"
      );

    }


    transactionsContainer.innerHTML =
      "<h2>Transactions</h2>";


    const transactions =
      Array.isArray(
        data.transactions
      )
        ? data.transactions
        : [];


    transactions.forEach(
      (transaction) => {

        const item =
          document.createElement(
            "div"
          );


        item.classList.add(
          "transaction-item"
        );


        item.innerHTML = `
          <p>
            <strong>
              ${String(
                transaction.type || ""
              ).toUpperCase()}
            </strong>
          </p>

          <p>
            Amount:
            ₦${Number(
              transaction.amount || 0
            ).toLocaleString()}
          </p>

          <p>
            Status:
            ${transaction.status || "---"}
          </p>

          <p>
            Reference:
            ${transaction.reference || "---"}
          </p>

          <p>
            Date:
            ${
              transaction.createdAt
                ? new Date(
                    transaction.createdAt
                  ).toLocaleString()
                : "---"
            }
          </p>
        `;


        transactionsContainer.appendChild(
          item
        );

      }
    );


  } catch (error) {

    console.error(
      "Transactions error:",
      error
    );

  }

}


// ========================================
// TRANSFER TYPE
// ========================================

if (transferType) {

  transferType.addEventListener(
    "change",
    () => {

      if (verifiedAccountBox) {

        verifiedAccountBox.style.display =
          "none";

      }


      if (
        transferType.value ===
        "same-bank"
      ) {

        if (sameBankSection) {

          sameBankSection.style.display =
            "block";

        }

        if (externalBankSection) {

          externalBankSection.style.display =
            "none";

        }

      } else {

        if (sameBankSection) {

          sameBankSection.style.display =
            "none";

        }

        if (externalBankSection) {

          externalBankSection.style.display =
            "block";

        }

      }

    }
  );

}


// ========================================
// VERIFY SAME BANK
// ========================================

if (verifySameBank) {

  verifySameBank.addEventListener(
    "click",
    async () => {

      const sameBankAccount =
        document.getElementById(
          "sameBankAccount"
        );


      if (!sameBankAccount) {

        console.error(
          "sameBankAccount element not found"
        );

        return;

      }


      const customerAccount =
        sameBankAccount.value.trim();


      if (!customerAccount) {

        alert(
          "Enter an account number"
        );

        return;

      }


      try {

        const response =
          await fetch(
            "https://api.globalcrestc.com/api/transfers/verify-same-bank",
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
                  customerAccount
              })
            }
          );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.message ||
            "Account verification failed"
          );

        }


        if (verifiedAccountBox) {

          verifiedAccountBox.style.display =
            "block";

        }


        if (verifiedAccountName) {

          verifiedAccountName.textContent =
            result.account?.name ||
            result.user?.name ||
            "Account verified";

        }


        if (verificationStatus) {

          verificationStatus.textContent =
            "✓ Globalcrest account verified";

        }


      } catch (error) {

        if (verifiedAccountBox) {

          verifiedAccountBox.style.display =
            "none";

        }

        alert(
          error.message ||
          "Unable to verify account"
        );

      }

    }
  );

}


// ========================================
// TRANSFER FORM
// ========================================

if (transferForm) {

  transferForm.addEventListener(
    "submit",
    async (e) => {

      e.preventDefault();


      const data =
        new FormData(
          transferForm
        );


      const customerAccount =
        data.get(
          "accountNumber"
        );


      const amount =
        Number(
          data.get("amount")
        );


      if (message) {

        message.textContent =
          "";

      }


      if (
        !customerAccount ||
        !Number.isFinite(amount) ||
        amount <= 0
      ) {

        if (message) {

          message.textContent =
            "Enter a valid account number and amount.";

        }

        return;

      }


      try {

        const response =
          await fetch(
            "https://api.globalcrestc.com/api/transfers",
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
                  customerAccount,
                amount
              })
            }
          );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.message ||
            result.error ||
            "Transfer failed"
          );

        }


        const transaction =
          result.transaction;


        if (!transaction) {

          throw new Error(
            "Transfer was created but no transaction was returned."
          );

        }


        formReset();


        showTransferPending(
          transaction
        );


        watchTransfer(
          transaction._id
        );


      } catch (error) {

        console.error(
          "Transfer error:",
          error
        );

        if (message) {

          message.textContent =
            error.message ||
            "Transfer failed";

        }

      }

    }
  );

}


// ========================================
// RESET TRANSFER FORM
// ========================================

function formReset() {

  if (transferForm) {

    transferForm.reset();

  }

}


// ========================================
// SHOW TRANSFER PENDING
// ========================================

function showTransferPending(
  transaction
) {

  if (transferResult) {

    transferResult.style.display =
      "block";

  }


  if (transferStatusTitle) {

    transferStatusTitle.textContent =
      "Transfer Submitted";

  }


  if (transferStatusMessage) {

    transferStatusMessage.textContent =
      "Your transfer has been submitted and is waiting for approval.";

  }


  if (receiptButtons) {

    receiptButtons.style.display =
      "none";

  }


  if (receipt) {

    receipt.style.display =
      "none";

  }


  if (message) {

    message.textContent =
      `Reference: ${
        transaction.reference || "---"
      }`;

  }

}


// ========================================
// WATCH TRANSFER
// ========================================

function watchTransfer(
  transactionId
) {

  if (!transactionId) {

    return;

  }


  if (transferCheckInterval) {

    clearInterval(
      transferCheckInterval
    );

  }


  checkTransferStatus(
    transactionId
  );


  transferCheckInterval =
    setInterval(
      () => {

        checkTransferStatus(
          transactionId
        );

      },
      5000
    );

}


// ========================================
// CHECK TRANSFER STATUS
// ========================================

async function checkTransferStatus(
  transactionId
) {

  if (!token) {

    return;

  }


  try {

    const response =
      await fetch(
        `https://api.globalcrestc.com/api/users/transactions/${transactionId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`
          }
        }
      );


    if (!response.ok) {

      return;

    }


    const data =
      await response.json();


    const transaction =
      data.transaction;


    if (!transaction) {

      return;

    }


    console.log(
      "Transfer status:",
      transaction.status
    );


    if (
      transaction.status ===
      "approved"
    ) {

      clearInterval(
        transferCheckInterval
      );

      transferCheckInterval =
        null;


      showTransferSuccess(
        transaction
      );


      getProfile();

      getTransactions();

    }


    if (
      transaction.status ===
      "declined"
    ) {

      clearInterval(
        transferCheckInterval
      );

      transferCheckInterval =
        null;


      showTransferDeclined(
        transaction
      );

    }


  } catch (error) {

    console.error(
      "Status check error:",
      error
    );

  }

}


// ========================================
// TRANSFER SUCCESS
// ========================================

function showTransferSuccess(
  transaction
) {

  if (transferResult) {

    transferResult.style.display =
      "block";

  }


  if (transferStatusTitle) {

    transferStatusTitle.textContent =
      "✓ Transfer Successful";

  }


  if (transferStatusMessage) {

    transferStatusMessage.textContent =
      "Your transfer has been approved successfully.";

  }


  if (receiptButtons) {

    receiptButtons.style.display =
      "block";

  }


  if (receipt) {

    receipt.style.display =
      "none";

  }


  const receiptAmount =
    document.getElementById(
      "receiptAmount"
    );

  if (receiptAmount) {

    receiptAmount.textContent =
      Number(
        transaction.amount || 0
      ).toLocaleString();

  }


  const receiptSender =
    document.getElementById(
      "receiptSender"
    );

  if (receiptSender) {

    receiptSender.textContent =
      transaction.sender?.name ||
      "---";

  }


  const receiptSenderAccount =
    document.getElementById(
      "receiptSenderAccount"
    );

  if (receiptSenderAccount) {

    receiptSenderAccount.textContent =
      transaction.sender?.accountNumber ||
      "---";

  }


  const receiptReceiver =
    document.getElementById(
      "receiptReceiver"
    );

  if (receiptReceiver) {

    receiptReceiver.textContent =
      transaction.receiver?.name ||
      "---";

  }


  const receiptReceiverAccount =
    document.getElementById(
      "receiptReceiverAccount"
    );

  if (receiptReceiverAccount) {

    receiptReceiverAccount.textContent =
      transaction.receiver?.accountNumber ||
      "---";

  }


  const receiptReference =
    document.getElementById(
      "receiptReference"
    );

  if (receiptReference) {

    receiptReference.textContent =
      transaction.reference ||
      "---";

  }


  const receiptStatus =
    document.getElementById(
      "receiptStatus"
    );

  if (receiptStatus) {

    receiptStatus.textContent =
      String(
        transaction.status || ""
      ).toUpperCase();

  }


  const receiptDate =
    document.getElementById(
      "receiptDate"
    );

  if (receiptDate) {

    receiptDate.textContent =
      transaction.createdAt
        ? new Date(
            transaction.createdAt
          ).toLocaleString()
        : "---";

  }


  if (message) {

    message.textContent =
      `Reference: ${
        transaction.reference || "---"
      }`;

  }

}


// ========================================
// TRANSFER DECLINED
// ========================================

function showTransferDeclined(
  transaction
) {

  if (transferResult) {

    transferResult.style.display =
      "block";

  }


  if (transferStatusTitle) {

    transferStatusTitle.textContent =
      "Transfer Declined";

  }


  if (transferStatusMessage) {

    transferStatusMessage.textContent =
      "Your transfer was declined by the administrator.";

  }


  if (receiptButtons) {

    receiptButtons.style.display =
      "none";

  }


  if (receipt) {

    receipt.style.display =
      "none";

  }


  if (message) {

    message.textContent =
      `Reference: ${
        transaction.reference || "---"
      }`;

  }

}


// ========================================
// VIEW RECEIPT
// ========================================

if (viewReceipt) {

  viewReceipt.addEventListener(
    "click",
    () => {

      if (!receipt) {

        return;

      }


      receipt.style.display =
        "block";


      receipt.scrollIntoView({
        behavior: "smooth"
      });

    }
  );

}


// ========================================
// DOWNLOAD PDF
// ========================================

if (downloadReceipt) {

  downloadReceipt.addEventListener(
    "click",
    async () => {

      if (!receipt) {

        return;

      }


      if (
        typeof html2canvas ===
        "undefined"
      ) {

        console.error(
          "html2canvas is not loaded."
        );

        return;

      }


      if (
        !window.jspdf ||
        !window.jspdf.jsPDF
      ) {

        console.error(
          "jsPDF is not loaded."
        );

        return;

      }


      receipt.style.display =
        "block";


      const canvas =
        await html2canvas(
          receipt
        );


      const imageData =
        canvas.toDataURL(
          "image/png"
        );


      const {
        jsPDF
      } =
        window.jspdf;


      const pdf =
        new jsPDF();


      const width =
        190;


      const height =
        (
          canvas.height *
          width
        ) /
        canvas.width;


      pdf.addImage(
        imageData,
        "PNG",
        10,
        10,
        width,
        height
      );


      pdf.save(
        "transfer-receipt.pdf"
      );

    }
  );

}


// ========================================
// SAVE RECEIPT IMAGE
// ========================================

if (saveReceiptImage) {

  saveReceiptImage.addEventListener(
    "click",
    async () => {

      if (!receipt) {

        return;

      }


      if (
        typeof html2canvas ===
        "undefined"
      ) {

        console.error(
          "html2canvas is not loaded."
        );

        return;

      }


      receipt.style.display =
        "block";


      const canvas =
        await html2canvas(
          receipt
        );


      const image =
        canvas.toDataURL(
          "image/png"
        );


      const link =
        document.createElement(
          "a"
        );


      link.href =
        image;


      link.download =
        "transfer-receipt.png";


      link.click();

    }
  );

}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    () => {

      if (transferCheckInterval) {

        clearInterval(
          transferCheckInterval
        );

        transferCheckInterval =
          null;

      }


      localStorage.removeItem(
        "token"
      );


      token = null;


      if (dashboardSection) {

        dashboardSection.style.display =
          "none";

      }


      if (loginSection) {

        loginSection.style.display =
          "block";

      }


      if (loginForm) {

        loginForm.reset();

      }

    }
  );

}


// ========================================
// PAGE LOAD
// ========================================

if (token) {

  if (loginSection) {

    loginSection.style.display =
      "none";

  }


  if (dashboardSection) {

    dashboardSection.style.display =
      "block";

  }


  getProfile();

  getTransactions();

} else {

  if (loginSection) {

    loginSection.style.display =
      "block";

  }


  if (dashboardSection) {

    dashboardSection.style.display =
      "none";

  }

}