const token =
  localStorage.getItem("token");

const applicationsContainer =
  document.getElementById(
    "applicationsContainer"
  );

const totalApplications =
  document.getElementById(
    "totalApplications"
  );

const pendingApplications =
  document.getElementById(
    "pendingApplications"
  );

const approvedApplications =
  document.getElementById(
    "approvedApplications"
  );

const rejectedApplications =
  document.getElementById(
    "rejectedApplications"
  );

const refreshBtn =
  document.getElementById(
    "refreshBtn"
  );


// ============================
// CHECK LOGIN
// ============================

if (!token) {

  window.location.href =
    "home.html";

}


// ============================
// LOAD APPLICATIONS
// ============================

async function loadApplications() {

  try {

    applicationsContainer.innerHTML = `
      <div class="loading">
        <i class="fa-solid fa-spinner fa-spin"></i>
        Loading applications...
      </div>
    `;


    const response =
      await fetch(
        "https://api.globalcrestc.com/api/card-applications/admin/all",
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
        result.message
      );

    }


    const applications =
      result.applications;


    updateStats(
      applications
    );


    displayApplications(
      applications
    );


  } catch (error) {

    applicationsContainer.innerHTML = `
      <div class="empty">
        <p>${error.message}</p>
      </div>
    `;

  }

}


// ============================
// STATS
// ============================

function updateStats(
  applications
) {

  totalApplications.textContent =
    applications.length;


  pendingApplications.textContent =
    applications.filter(
      app =>
        app.status === "pending"
    ).length;


  approvedApplications.textContent =
    applications.filter(
      app =>
        app.status === "approved"
    ).length;


  rejectedApplications.textContent =
    applications.filter(
      app =>
        app.status === "rejected"
    ).length;

}


// ============================
// DISPLAY APPLICATIONS
// ============================

function displayApplications(
  applications
) {

  if (!applications.length) {

    applicationsContainer.innerHTML = `
      <div class="empty">
        <i class="fa-regular fa-credit-card"></i>
        <p>No card applications yet.</p>
      </div>
    `;

    return;
  }


  applicationsContainer.innerHTML =
    applications.map(
      app => {

        const applicant =
          app.applicant || {};


        const date =
          new Date(
            app.createdAt
          ).toLocaleString();


        return `

          <div class="application">

            <div class="application-top">

              <div>

                <div class="customer-name">
                  ${escapeHtml(
                    app.fullName
                  )}
                </div>

                <div class="account-number">
                  Account:
                  ${escapeHtml(
                    applicant.accountNumber ||
                    "N/A"
                  )}
                </div>

              </div>


              <span
                class="status ${app.status}">
                ${app.status}
              </span>

            </div>


            <div class="application-grid">

              <div class="detail">
                <span>Card Type</span>
                <strong>
                  ${escapeHtml(
                    app.cardType
                  )}
                </strong>
              </div>


              <div class="detail">
                <span>Email</span>
                <strong>
                  ${escapeHtml(
                    app.email
                  )}
                </strong>
              </div>


              <div class="detail">
                <span>Phone</span>
                <strong>
                  ${escapeHtml(
                    app.phone
                  )}
                </strong>
              </div>


              <div class="detail">
                <span>Delivery</span>
                <strong>
                  ${escapeHtml(
                    app.deliveryMethod
                  )}
                </strong>
              </div>


              <div class="detail">
                <span>Address</span>
                <strong>
                  ${escapeHtml(
                    app.deliveryAddress ||
                    "N/A"
                  )}
                </strong>
              </div>


              <div class="detail">
                <span>Submitted</span>
                <strong>
                  ${date}
                </strong>
              </div>

            </div>


            ${
              app.status === "pending"
                ? `

                  <div
                    class="application-actions">

                    <button
                      class="approve-btn"
                      onclick="approveApplication('${app._id}')">

                      <i
                        class="fa-solid fa-check">
                      </i>

                      Approve

                    </button>


                    <button
                      class="reject-btn"
                      onclick="rejectApplication('${app._id}')">

                      <i
                        class="fa-solid fa-xmark">
                      </i>

                      Reject

                    </button>

                  </div>

                `
                : ""
            }

          </div>

        `;

      }
    ).join("");

}


// ============================
// APPROVE
// ============================

async function approveApplication(
  id
) {

  const confirmed =
    confirm(
      "Approve this card application?"
    );


  if (!confirmed) {
    return;
  }


  try {

    const response =
      await fetch(
        `https://api.globalcrestc.com/api/card-applications/admin/${id}/approve`,
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
        result.message
      );

    }


    alert(
      "Card application approved."
    );


    loadApplications();


  } catch (error) {

    alert(error.message);

  }

}


// ============================
// REJECT
// ============================

async function rejectApplication(
  id
) {

  const adminNote =
    prompt(
      "Enter a reason for rejecting this application:"
    );


  if (adminNote === null) {
    return;
  }


  try {

    const response =
      await fetch(
        `https://api.globalcrestc.com/api/card-applications/admin/${id}/reject`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`
          },

          body: JSON.stringify({
            adminNote
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


    alert(
      "Card application rejected."
    );


    loadApplications();


  } catch (error) {

    alert(error.message);

  }

}


// ============================
// SECURITY
// ============================

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// ============================
// REFRESH
// ============================

refreshBtn.addEventListener(
  "click",
  loadApplications
);


// Initial load
loadApplications();