// ============================
// ADMIN AUTHENTICATION
// ============================

const token =
  localStorage.getItem("adminToken");

const adminUser =
  JSON.parse(
    localStorage.getItem("admin") || "null"
  );


// ============================
// CHECK ADMIN LOGIN
// ============================

if (
  !token ||
  !adminUser ||
  String(adminUser.role).toLowerCase() !== "admin"
) {
  window.location.href =
    "admin-login.html";
}


// ============================
// ELEMENTS
// ============================

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
          method: "GET",

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
        "Unable to load card applications."
      );

    }


    const applications =
      result.applications || [];


    updateStats(
      applications
    );


    displayApplications(
      applications
    );


  } catch (error) {

    console.error(
      "Load applications error:",
      error
    );


    applicationsContainer.innerHTML = `
      <div class="empty">
        <p>
          ${escapeHtml(
            error.message ||
            "Unable to load applications."
          )}
        </p>
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

        <p>
          No card applications yet.
        </p>

      </div>
    `;

    return;
  }


  applicationsContainer.innerHTML =
    applications
      .map(app => {

        const applicant =
          app.applicant || {};


        const date =
          app.createdAt
            ? new Date(
                app.createdAt
              ).toLocaleString()
            : "N/A";


        return `

          <div class="application">

            <div class="application-top">

              <div>

                <div class="customer-name">
                  ${escapeHtml(
                    app.fullName ||
                    "Unknown Customer"
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
                class="status ${escapeHtml(
                  app.status || "pending"
                )}">

                ${escapeHtml(
                  app.status || "pending"
                )}

              </span>

            </div>


            <div class="application-grid">

              <div class="detail">

                <span>
                  Card Type
                </span>

                <strong>
                  ${escapeHtml(
                    app.cardType ||
                    "N/A"
                  )}
                </strong>

              </div>


              <div class="detail">

                <span>
                  Email
                </span>

                <strong>
                  ${escapeHtml(
                    app.email ||
                    "N/A"
                  )}
                </strong>

              </div>


              <div class="detail">

                <span>
                  Phone
                </span>

                <strong>
                  ${escapeHtml(
                    app.phone ||
                    "N/A"
                  )}
                </strong>

              </div>


              <div class="detail">

                <span>
                  Delivery
                </span>

                <strong>
                  ${escapeHtml(
                    app.deliveryMethod ||
                    "N/A"
                  )}
                </strong>

              </div>


              <div class="detail">

                <span>
                  Address
                </span>

                <strong>
                  ${escapeHtml(
                    app.deliveryAddress ||
                    "N/A"
                  )}
                </strong>

              </div>


              <div class="detail">

                <span>
                  Submitted
                </span>

                <strong>
                  ${escapeHtml(
                    date
                  )}
                </strong>

              </div>

            </div>


            ${
              app.status === "pending"
                ? `

                  <div
                    class="application-actions">

                    <button
                      type="button"
                      class="approve-btn"
                      onclick="approveApplication('${app._id}')">

                      <i
                        class="fa-solid fa-check">
                      </i>

                      Approve

                    </button>


                    <button
                      type="button"
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

      })
      .join("");

}


// ============================
// APPROVE APPLICATION
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
        result.message ||
        "Unable to approve application."
      );

    }


    alert(
      "Card application approved."
    );


    await loadApplications();


  } catch (error) {

    console.error(
      "Approve application error:",
      error
    );

    alert(
      error.message
    );

  }

}


// ============================
// REJECT APPLICATION
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
            adminNote:
              adminNote.trim()
          })
        }
      );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Unable to reject application."
      );

    }


    alert(
      "Card application rejected."
    );


    await loadApplications();


  } catch (error) {

    console.error(
      "Reject application error:",
      error
    );

    alert(
      error.message
    );

  }

}


// ============================
// SECURITY
// ============================

function escapeHtml(
  value
) {

  return String(value)
    .replaceAll(
      "&",
      "&amp;"
    )
    .replaceAll(
      "<",
      "&lt;"
    )
    .replaceAll(
      ">",
      "&gt;"
    )
    .replaceAll(
      '"',
      "&quot;"
    )
    .replaceAll(
      "'",
      "&#039;"
    );

}


// ============================
// REFRESH
// ============================

if (refreshBtn) {

  refreshBtn.addEventListener(
    "click",
    loadApplications
  );

}


// ============================
// INITIAL LOAD
// ============================

loadApplications();