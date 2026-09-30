
// =========================
// ADMIN AUTHENTICATION
// =========================

const adminToken =
  localStorage.getItem("adminToken");

const storedAdmin =
  localStorage.getItem("admin");


// =========================
// CHECK ADMIN LOGIN
// =========================

if (!adminToken) {

  window.location.href =
    "admin-login.html";

}


// =========================
// GET ADMIN INFORMATION
// =========================

let adminUser = null;

try {

  adminUser =
    JSON.parse(storedAdmin);

} catch (error) {

  adminUser = null;

}


// =========================
// CHECK ADMIN ROLE
// =========================

if (
  !adminUser ||
  adminUser.role !== "admin"
) {

  localStorage.removeItem("adminToken");
  localStorage.removeItem("admin");

  window.location.href =
    "admin-login.html";

}


// =========================
// DISPLAY ADMIN
// =========================

if (adminUser) {

  const adminName =
    document.getElementById("adminName");

  const welcomeAdmin =
    document.getElementById("welcomeAdmin");


  if (adminName) {

    adminName.textContent =
      adminUser.name || "Administrator";

  }


  if (welcomeAdmin) {

    welcomeAdmin.textContent =
      `Welcome back, ${
        adminUser.name || "Administrator"
      }.`;

  }

}


// =========================
// LOAD PENDING TRANSFERS
// =========================

async function loadTransfers() {

  const container =
    document.getElementById(
      "transfersContainer"
    );

  try {

    const response =
      await fetch(
        "https://api.globalcrestc.com/api/transfers/pending",
        {
          headers: {
            Authorization:
              `Bearer ${adminToken}`
          }
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Could not load transfers"
      );

    }


    const transfers =
      result.transactions ||
      result.transfers ||
      [];


    const pendingTransfers =
      document.getElementById(
        "pendingTransfers"
      );


    if (pendingTransfers) {

      pendingTransfers.textContent =
        transfers.length;

    }


    if (!transfers.length) {

      container.innerHTML = `
        <div class="loading">
          No pending transfers.
        </div>
      `;

      return;

    }


    container.innerHTML =
      transfers.map(
        (transfer) => {

          const sender =
            transfer.sender?.name ||
            "Unknown";

          const receiver =
            transfer.receiver?.name ||
            "Unknown";


          return `
            <div class="transfer-row">

              <div>

                <strong>
                  ${sender}
                </strong>

                <small>
                  → ${receiver}
                </small>

              </div>


              <strong>
                ₦${Number(
                  transfer.amount || 0
                ).toLocaleString()}
              </strong>


              <div>

                <button
                  class="approve-button"
                  onclick="approveTransfer('${transfer._id}')"
                >
                  Approve
                </button>


                <button
                  class="reject-button"
                  onclick="declineTransfer('${transfer._id}')"
                >
                  Decline
                </button>

              </div>

            </div>
          `;

        }
      ).join("");


  } catch (error) {

    console.error(
      "Load transfers error:",
      error
    );


    container.innerHTML = `
      <div class="loading">
        ${error.message}
      </div>
    `;

  }

}


// =========================
// APPROVE TRANSFER
// =========================

async function approveTransfer(id) {

  try {

    const response =
      await fetch(
        `https://api.globalcrestc.com/api/transfers/${id}/approve`,
        {
          method: "PATCH",

          headers: {
            Authorization:
              `Bearer ${adminToken}`
          }
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Could not approve transfer"
      );

    }


    await loadTransfers();


  } catch (error) {

    console.error(error);

    alert(error.message);

  }

}


// =========================
// DECLINE TRANSFER
// =========================

async function declineTransfer(id) {

  try {

    const response =
      await fetch(
        `https://api.globalcrestc.com/api/transfers/${id}/decline`,
        {
          method: "PATCH",

          headers: {
            Authorization:
              `Bearer ${adminToken}`
          }
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Could not decline transfer"
      );

    }


    await loadTransfers();


  } catch (error) {

    console.error(error);

    alert(error.message);

  }

}


// =========================
// REFRESH TRANSFERS
// =========================

const refreshButton =
  document.getElementById(
    "refreshTransfers"
  );


if (refreshButton) {

  refreshButton.addEventListener(
    "click",
    loadTransfers
  );

}


// =========================
// LOGOUT
// =========================

const logoutButton =
  document.getElementById(
    "logoutButton"
  );


if (logoutButton) {

  logoutButton.addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "adminToken"
      );

      localStorage.removeItem(
        "admin"
      );

      window.location.href =
        "admin-login.html";

    }
  );

}


// =========================
// START DASHBOARD
// =========================

loadTransfers();