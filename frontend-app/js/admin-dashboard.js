
const token =
  localStorage.getItem("token");

const storedUser =
  localStorage.getItem("user");


/* =========================
   CHECK LOGIN
========================= */

if (!token) {

  window.location.href =
    "admin-login.html";

}


/* =========================
   ADMIN USER
========================= */

let adminUser = null;

try {

  adminUser =
    JSON.parse(storedUser);

} catch (error) {

  adminUser = null;

}


if (
  !adminUser ||
  adminUser.role !== "admin"
) {

  localStorage.removeItem("token");
  localStorage.removeItem("user");

  window.location.href =
    "admin-login.html";

}


/* =========================
   DISPLAY ADMIN
========================= */

if (adminUser) {

  document.getElementById(
    "adminName"
  ).textContent =
    adminUser.name || "Administrator";

  document.getElementById(
    "welcomeAdmin"
  ).textContent =
    `Welcome back, ${adminUser.name || "Administrator"}.`;

}


/* =========================
   LOAD PENDING TRANSFERS
========================= */

async function loadTransfers() {

  const container =
    document.getElementById(
      "transfersContainer"
    );

  try {

    const response =
      await fetch(
        "https://globalcrestc.com/api/transfers/pending",
        {
          headers: {
            Authorization:
              `Bearer ${token}`
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


    document.getElementById(
      "pendingTransfers"
    ).textContent =
      transfers.length;


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
        transfer => {

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
                  transfer.amount
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

    console.error(error);

    container.innerHTML = `
      <div class="loading">
        ${error.message}
      </div>
    `;

  }

}


/* =========================
   APPROVE TRANSFER
========================= */

async function approveTransfer(id) {

  try {

    const response =
      await fetch(
        `https://globalcrestc.com/api/transfers/${id}/approve`,
        {
          method: "PATCH",

          headers: {
            Authorization:
              `Bearer ${token}`
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

    alert(error.message);

  }

}


/* =========================
   DECLINE TRANSFER
========================= */

async function declineTransfer(id) {

  try {

    const response =
      await fetch(
        `https://globalcrestc.com/api/transfers/${id}/decline`,
        {
          method: "PATCH",

          headers: {
            Authorization:
              `Bearer ${token}`
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

    alert(error.message);

  }

}


/* =========================
   REFRESH
========================= */

document
  .getElementById("refreshTransfers")
  .addEventListener(
    "click",
    loadTransfers
  );


/* =========================
   LOGOUT
========================= */

document
  .getElementById("logoutButton")
  .addEventListener(
    "click",
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      window.location.href =
        "admin-login.html";

    }
  );


/* =========================
   START
========================= */

loadTransfers();
