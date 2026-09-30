// ========================================
// ELEMENTS
// ========================================
console.log("home is CONNECTED");


// ========================================
// API
// ========================================

const API = "https://api.globalcrestc.com/api";


// ========================================
// DOM ELEMENTS
// ========================================

// LOGIN / DASHBOARD
const loginSection =
  document.getElementById("loginSection");

const dashboardSection =
  document.getElementById("dashboardSection");

const loginForm =
  document.getElementById("loginForm");

const message =
  document.getElementById("message");

const logoutButton =
  document.getElementById("logout");


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
// PROFILE ELEMENTS
// ========================================

const profilePhoto =
  document.getElementById("profilePhoto");

const userName =
  document.getElementById("userName");

const accountNumber =
  document.getElementById("accountNumber");

const balance =
  document.getElementById("balance");

const transactionsContainer =
  document.getElementById("transactions");

const userTier =
  document.getElementById("userTier");

const tierLimit =
  document.getElementById("tierLimit");


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
// EDIT PROFILE
// ========================================

const editProfileBtn =
  document.getElementById("editProfileBtn");

const editProfileModal =
  document.getElementById("editProfileModal");

const closeProfileModal =
  document.getElementById("closeProfileModal");

const editProfileForm =
  document.getElementById("editProfileForm");

const profilePhotoInput =
  document.getElementById("profilePhotoInput");

const photoPreview =
  document.getElementById("photoPreview");

const profileMessage =
  document.getElementById("profileMessage");


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
            `${API}/auth/login`,
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
          message.textContent = "";
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
            error.message;
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
        `${API}/users/profile`,
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

const profilePhoto = document.getElementById("profilePhoto");

if (user.profilePhoto) {
    profilePhoto.src = user.profilePhoto;
} else {
    profilePhoto.src = "default-profile.png";
};
    // NAME
    if (userName) {
      userName.textContent =
        user.name || "";
    }


    // ACCOUNT NUMBER
    if (accountNumber) {
      accountNumber.textContent =
        user.accountNumber || "";
    }


    // BALANCE
    if (balance) {
      balance.textContent =
        Number(
          user.balance || 0
        ).toLocaleString();
    }


    // TIER
    if (userTier) {
      userTier.textContent =
        `Tier ${user.tier || 1}`;
    }


    // TIER LIMIT
    if (tierLimit) {
      tierLimit.textContent =
        `$${Number(
          user.tierLimit || 0
        ).toLocaleString()}`;
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
        `${API}/users/transactions`,
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


    if (!data.transactions) {
      return;
    }


    data.transactions.forEach(
      (transaction) => {

        const item =
          document.createElement("div");


        item.classList.add(
          "transaction-item"
        );


        item.innerHTML = `
          <p>
            <strong>
              ${transaction.type
                ? transaction.type.toUpperCase()
                : ""}
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
            ${transaction.status || ""}
          </p>

          <p>
            Reference:
            ${transaction.reference || ""}
          </p>

          <p>
            Date:
            ${
              transaction.createdAt
                ? new Date(
                    transaction.createdAt
                  ).toLocaleString()
                : ""
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
// VERIFY SAME BANK ACCOUNT
// ========================================

if (verifySameBank) {

  verifySameBank.addEventListener(
    "click",
    async () => {

      const accountInput =
        document.getElementById(
          "sameBankAccount"
        );


      if (!accountInput) {
        alert(
          "Account number field not found."
        );
        return;
      }


      const accountNumber =
        accountInput.value.trim();


      if (!accountNumber) {

        alert(
          "Enter an account number"
        );

        return;
      }


      try {

        const response =
          await fetch(
            `${API}/transfers/verify-same-bank`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({
                accountNumber
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
            "";
        }


        if (verificationStatus) {
          verificationStatus.textContent =
            "✓ GlobalCrest account verified";
        }

      } catch (error) {

        if (verifiedAccountBox) {
          verifiedAccountBox.style.display =
            "none";
        }

        alert(
          error.message
        );

      }

    }
  );

}


// ========================================
// EXTERNAL BANK VERIFICATION
// ========================================

if (verifyExternalBank) {

  verifyExternalBank.addEventListener(
    "click",
    () => {

      alert(
        "External bank verification is not connected yet."
      );

    }
  );

}


// ========================================
// TRANSFER
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


      const accountNumber =
        data.get(
          "accountNumber"
        );


      const amount =
        Number(
          data.get("amount")
        );


      if (!accountNumber) {

        if (message) {
          message.textContent =
            "Enter an account number.";
        }

        return;
      }


      if (!amount || amount <= 0) {

        if (message) {
          message.textContent =
            "Enter a valid amount.";
        }

        return;
      }


      if (message) {
        message.textContent = "";
      }


      try {

        const response =
          await fetch(
            `${API}/transfers`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body: JSON.stringify({
                accountNumber,
                amount
              })
            }
          );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.message ||
            "Transfer failed"
          );

        }


        const transaction =
          result.transaction;


        formReset();


        showTransferPending(
          transaction
        );


        // START CHECKING STATUS
        if (transaction?._id) {

          watchTransfer(
            transaction._id
          );

        }

      } catch (error) {

        console.error(
          "Transfer error:",
          error
        );

        if (message) {
          message.textContent =
            error.message;
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
// SHOW PENDING TRANSFER
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
        transaction.reference || ""
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


  // STOP OLD WATCHER
  if (transferCheckInterval) {

    clearInterval(
      transferCheckInterval
    );

  }


  // CHECK IMMEDIATELY
  checkTransferStatus(
    transactionId
  );


  // CHECK EVERY 5 SECONDS
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

  try {

    const response =
      await fetch(
        `${API}/users/transactions/${transactionId}`,
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


    // ====================================
    // APPROVED
    // ====================================

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


      // REFRESH BALANCE
      getProfile();


      // REFRESH TRANSACTIONS
      getTransactions();

    }


    // ====================================
    // DECLINED
    // ====================================

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


  // AMOUNT
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


  // SENDER
  const receiptSender =
    document.getElementById(
      "receiptSender"
    );

  if (receiptSender) {
    receiptSender.textContent =
      transaction.sender?.name ||
      "";
  }


  // SENDER ACCOUNT
  const receiptSenderAccount =
    document.getElementById(
      "receiptSenderAccount"
    );

  if (receiptSenderAccount) {
    receiptSenderAccount.textContent =
      transaction.sender?.accountNumber ||
      "";
  }


  // RECEIVER
  const receiptReceiver =
    document.getElementById(
      "receiptReceiver"
    );

  if (receiptReceiver) {
    receiptReceiver.textContent =
      transaction.receiver?.name ||
      "";
  }


  // RECEIVER ACCOUNT
  const receiptReceiverAccount =
    document.getElementById(
      "receiptReceiverAccount"
    );

  if (receiptReceiverAccount) {
    receiptReceiverAccount.textContent =
      transaction.receiver?.accountNumber ||
      "";
  }


  // REFERENCE
  const receiptReference =
    document.getElementById(
      "receiptReference"
    );

  if (receiptReference) {
    receiptReference.textContent =
      transaction.reference ||
      "";
  }


  // STATUS
  const receiptStatus =
    document.getElementById(
      "receiptStatus"
    );

  if (receiptStatus) {
    receiptStatus.textContent =
      transaction.status
        ? transaction.status.toUpperCase()
        : "";
  }


  // DATE
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
        : "";
  }


  if (message) {
    message.textContent =
      `Reference: ${
        transaction.reference || ""
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
        transaction.reference || ""
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

      if (receipt) {

        receipt.style.display =
          "block";

        receipt.scrollIntoView({
          behavior: "smooth"
        });

      }

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
      } = window.jspdf;


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
        document.createElement("a");


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

      // STOP TRANSFER CHECKING
      if (transferCheckInterval) {

        clearInterval(
          transferCheckInterval
        );

        transferCheckInterval =
          null;

      }


      // REMOVE TOKEN
      localStorage.removeItem(
        "token"
      );


      token =
        null;


      // SHOW LOGIN
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


// ========================================
// OPEN EDIT PROFILE
// ========================================

if (editProfileBtn) {

  editProfileBtn.addEventListener(
    "click",
    () => {

      if (editProfileModal) {
        editProfileModal.style.display =
          "flex";
      }

    }
  );

}


// ========================================
// CLOSE EDIT PROFILE
// ========================================

if (closeProfileModal) {

  closeProfileModal.addEventListener(
    "click",
    () => {

      if (editProfileModal) {
        editProfileModal.style.display =
          "none";
      }


      if (profileMessage) {
        profileMessage.textContent =
          "";
      }


      if (photoPreview) {
        photoPreview.innerHTML =
          "";
      }


      if (editProfileForm) {
        editProfileForm.reset();
      }

    }
  );

}


// ========================================
// PHOTO PREVIEW
// ========================================

if (profilePhotoInput) {

  profilePhotoInput.addEventListener(
    "change",
    () => {

      const file =
        profilePhotoInput.files[0];


      if (!file) {
        return;
      }


      const imageUrl =
        URL.createObjectURL(
          file
        );


      if (photoPreview) {

        photoPreview.innerHTML = `
          <img
            src="${imageUrl}"
            alt="Photo preview"
            style="
              width:120px;
              height:120px;
              object-fit:cover;
              border-radius:50%;
            "
          >
        `;

      }

    }
  );

}


// ========================================
// UPLOAD PROFILE PHOTO
// ========================================

if (editProfileForm) {

  editProfileForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();


      if (!profilePhotoInput) {
        return;
      }


      const file =
        profilePhotoInput.files[0];


      if (!file) {

        if (profileMessage) {
          profileMessage.textContent =
            "Please choose a photo.";
        }

        return;
      }


      const formData =
        new FormData();


      formData.append(
        "profilePhoto",
        file
      );


      try {

        if (profileMessage) {
          profileMessage.textContent =
            "Uploading...";
        }


        const response =
          await fetch(
            `${API}/users/profile/photo`,
            {
              method: "PUT",

              headers: {
                Authorization:
                  `Bearer ${token}`
              },

              body: formData
            }
          );


        const data =
          await response.json();


        if (!response.ok) {

          if (profileMessage) {
            profileMessage.textContent =
              data.message ||
              "Upload failed.";
          }

          return;
        }


        if (profileMessage) {
          profileMessage.textContent =
            "Profile photo uploaded successfully!";
        }


        // UPDATE PHOTO IMMEDIATELY
        if (
          data.user?.profilePhoto &&
          profilePhoto
        ) {

          profilePhoto.src =
            data.user.profilePhoto;

        }


        setTimeout(
          () => {

            if (editProfileModal) {
              editProfileModal.style.display =
                "none";
            }


            if (profileMessage) {
              profileMessage.textContent =
                "";
            }


            editProfileForm.reset();

          },
          1500
        );


      } catch (error) {

        console.error(
          "Profile upload error:",
          error
        );


        if (profileMessage) {
          profileMessage.textContent =
            "Could not connect to server.";
        }

      }

    }
  );

}