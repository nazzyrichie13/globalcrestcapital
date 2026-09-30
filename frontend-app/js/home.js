// ========================================
// ELEMENTS
// ========================================
console.log("home is CONNECTED")
const slidecontainer = document.querySelector(".slides");
const slide = document.querySelectorAll(".slide");
let index = 0;
const loginSection =
  document.getElementById("loginSection");

const dashboardSection =
  document.getElementById("dashboardSection");

const loginForm =
  document.getElementById("loginForm");

const transferForm =
  document.getElementById("transferForm");

const message =
  document.getElementById("message");

const logoutButton =
  document.getElementById("logout");
// transfer
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

// PROFILE
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

document.getElementById("userTier").textContent =
  `Tier ${user.tier}`;

document.getElementById("tierLimit").textContent =
  `$${Number(user.tierLimit).toLocaleString()}`;
// TRANSFER RESULT
const transferResult =
  document.getElementById("transferResult");

const transferStatusTitle =
  document.getElementById(
    "transferStatusTitle"
  );

const transferStatusMessage =
  document.getElementById(
    "transferStatusMessage"
  );

const receiptButtons =
  document.getElementById("receiptButtons");

const receipt =
  document.getElementById("receipt");

const viewReceipt =
  document.getElementById("viewReceipt");

const downloadReceipt =
  document.getElementById("downloadReceipt");

const saveReceiptImage =
  document.getElementById(
    "saveReceiptImage"
  );
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

setInterval(() => {
  index = (index + 1)% slide.length;
  slidecontainer.style.transform = 
  ` translateX(-${index *  100}%)`;
}, 3000);

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
        throw new Error(data.message);
      }


      // SAVE TOKEN
      localStorage.setItem(
        "token",
        data.token
      );

      token = data.token;


      // SHOW DASHBOARD
      loginSection.style.display =
        "none";

      dashboardSection.style.display =
        "block";


      message.textContent = "";


      // LOAD USER DATA
      getProfile();

      getTransactions();

    } catch (error) {

      message.textContent =
        error.message;

    }

  }
);


// ========================================
// GET PROFILE
// ========================================

async function getProfile() {

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
      throw new Error(data.message);
    }


    const user =
      data.user;


    userName.textContent =
      user.name;

    accountNumber.textContent =
      user.accountNumber;

    balance.textContent =
      Number(user.balance)
        .toLocaleString();


    if (user.profilePhoto) {

      profilePhoto.src =
        user.profilePhoto;

    } else {

      profilePhoto.src =
        "default-profile.png";

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
      throw new Error(data.message);
    }


    transactionsContainer.innerHTML =
      "<h2>Transactions</h2>";


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
              ${transaction.type.toUpperCase()}
            </strong>
          </p>

          <p>
            Amount:
            ₦${Number(
              transaction.amount
            ).toLocaleString()}
          </p>

          <p>
            Status:
            ${transaction.status}
          </p>

          <p>
            Reference:
            ${transaction.reference}
          </p>

          <p>
            Date:
            ${new Date(
              transaction.createdAt
            ).toLocaleString()}
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
// TRANSFER
// ========================================
if (transferType) {

  transferType.addEventListener("change", () => {

    verifiedAccountBox.style.display = "none";

    if (transferType.value === "same-bank") {

      sameBankSection.style.display = "block";

      externalBankSection.style.display = "none";

    } else {

      sameBankSection.style.display = "none";

      externalBankSection.style.display = "block";

    }

  });

}
if (verifySameBank) {

  verifySameBank.addEventListener(
    "click",
    async () => {

      const accountNumber =
        document.getElementById(
          "sameBankAccount"
        ).value.trim();

      if (!accountNumber) {

        alert("Enter an account number");

        return;
      }

      try {

        const response = await fetch(
          "https://api.globalcrestc.com/api/transfers/verify-same-bank",
          {
            method: "POST",

            headers: {
              "Content-Type": "application/json",

              Authorization:
                `Bearer ${localStorage.getItem("token")}`
            },

            body: JSON.stringify({
              accountNumber
            })
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(result.message);
        }

        verifiedAccountBox.style.display =
          "block";

        verifiedAccountName.textContent =
          result.account.name;

        verificationStatus.textContent =
          "✓ Globalcrest account verified";

      } catch (error) {

        verifiedAccountBox.style.display =
          "none";

        alert(error.message);

      }

    }
  );

}
if (transferForm) {

transferForm.addEventListener(
  "submit",
  async (e) => {

    e.preventDefault();


    const data =
      new FormData(transferForm);


    const accountNumber =
      data.get("accountNumber");


    const amount =
      Number(data.get("amount"));


    // CLEAR OLD MESSAGE
    message.textContent = "";


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
              accountNumber,
              amount
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


      // TRANSFER IS PENDING
      const transaction =
        result.transaction;


      formReset();


      showTransferPending(
        transaction
      );


      // START CHECKING STATUS
      watchTransfer(
        transaction._id
      );


    } catch (error) {

      message.textContent =
        error.message;

    }

  }
)};


// ========================================
// RESET TRANSFER FORM
// ========================================

function formReset() {

  transferForm.reset();

}


// ========================================
// SHOW PENDING
// ========================================

function showTransferPending(
  transaction
) {

  transferResult.style.display =
    "block";


  transferStatusTitle.textContent =
    "Transfer Submitted";


  transferStatusMessage.textContent =
    "Your transfer has been submitted and is waiting for approval.";


  receiptButtons.style.display =
    "none";


  receipt.style.display =
    "none";


  message.textContent =
    `Reference: ${transaction.reference}`;

}


// ========================================
// WATCH TRANSFER
// ========================================

function watchTransfer(
  transactionId
) {

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

  transferResult.style.display =
    "block";


  transferStatusTitle.textContent =
    "✓ Transfer Successful";


  transferStatusMessage.textContent =
    "Your transfer has been approved successfully.";


  receiptButtons.style.display =
    "block";


  receipt.style.display =
    "none";


  // AMOUNT
  document.getElementById(
    "receiptAmount"
  ).textContent =
    Number(
      transaction.amount
    ).toLocaleString();


  // SENDER
  document.getElementById(
    "receiptSender"
  ).textContent =
    transaction.sender.name;


  // SENDER ACCOUNT
  document.getElementById(
    "receiptSenderAccount"
  ).textContent =
    transaction.sender.accountNumber;


  // RECEIVER
  document.getElementById(
    "receiptReceiver"
  ).textContent =
    transaction.receiver.name;


  // RECEIVER ACCOUNT
  document.getElementById(
    "receiptReceiverAccount"
  ).textContent =
    transaction.receiver.accountNumber;


  // REFERENCE
  document.getElementById(
    "receiptReference"
  ).textContent =
    transaction.reference;


  // STATUS
  document.getElementById(
    "receiptStatus"
  ).textContent =
    transaction.status.toUpperCase();


  // DATE
  document.getElementById(
    "receiptDate"
  ).textContent =
    new Date(
      transaction.createdAt
    ).toLocaleString();


  message.textContent =
    `Reference: ${transaction.reference}`;

}


// ========================================
// TRANSFER DECLINED
// ========================================

function showTransferDeclined(
  transaction
) {

  transferResult.style.display =
    "block";


  transferStatusTitle.textContent =
    "Transfer Declined";


  transferStatusMessage.textContent =
    "Your transfer was declined by the administrator.";


  receiptButtons.style.display =
    "none";


  receipt.style.display =
    "none";


  message.textContent =
    `Reference: ${transaction.reference}`;

}


// ========================================
// VIEW RECEIPT
// ========================================

viewReceipt.addEventListener( "click",() => {

    receipt.style.display =
      "block";


    receipt.scrollIntoView({
      behavior: "smooth"
    });

  }
);


// ========================================
// DOWNLOAD PDF
// ========================================

downloadReceipt.addEventListener(
  "click",
  async () => {

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


    const width = 190;


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


// ========================================
// SAVE RECEIPT IMAGE
// ========================================

saveReceiptImage.addEventListener(
  "click",
  async () => {

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


// ========================================
// LOGOUT
// ========================================

logoutButton.addEventListener(
  "click",
  () => {

    // Stop transfer checking
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


    dashboardSection.style.display =
      "none";


    loginSection.style.display =
      "block";


    loginForm.reset();

  }
);


// ========================================
// PAGE LOAD
// ========================================

if (token) {

  loginSection.style.display =
    "none";

  dashboardSection.style.display =
    "block";


  getProfile();

  getTransactions();

} else {

  loginSection.style.display =
    "block";

  dashboardSection.style.display =
    "none";

}




// ===============================
// OPEN EDIT PROFILE
// ===============================

editProfileBtn.addEventListener("click", () => {

    editProfileModal.style.display = "flex";

});


// ===============================
// CLOSE EDIT PROFILE
// ===============================

closeProfileModal.addEventListener("click", () => {

    editProfileModal.style.display = "none";

    profileMessage.textContent = "";

    photoPreview.innerHTML = "";

    editProfileForm.reset();

});


// ===============================
// PHOTO PREVIEW
// ===============================

profilePhotoInput.addEventListener(
    "change",
    () => {

        const file =
            profilePhotoInput.files[0];

        if (!file) {
            return;
        }

        const imageUrl =
            URL.createObjectURL(file);

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
);


// ===============================
// UPLOAD PROFILE PHOTO
// ===============================

editProfileForm.addEventListener(
    "submit",
    async (event) => {

        event.preventDefault();

        const file =
            profilePhotoInput.files[0];

        if (!file) {

            profileMessage.textContent =
                "Please choose a photo.";

            return;
        }
const API ="https://api.globalcrestc.com/api";

        const formData =
            new FormData();

        formData.append(
            "profilePhoto",
            file
        );


        try {

            profileMessage.textContent =
                "Uploading...";


            const response =
                await fetch(
                    `${API_URL}/api/users/profile/photo`,
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

                profileMessage.textContent =
                    data.message ||
                    "Upload failed.";

                return;
            }


            profileMessage.textContent =
                "Profile photo uploaded successfully!";


            // Update photo immediately
            if (data.user?.profilePhoto) {

                profilePhoto.src =
                    data.user.profilePhoto;

            }


            setTimeout(() => {

                editProfileModal.style.display =
                    "none";

                profileMessage.textContent = "";

                editProfileForm.reset();

            }, 1500);


        } catch (error) {

            console.error(
                "Profile upload error:",
                error
            );

            profileMessage.textContent =
                "Could not connect to server.";

        }

    }
);