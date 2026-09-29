const API_URL =
  "https://api.globalcrestc.com";

const token =
  localStorage.getItem("token");


if (!token) {

  window.location.href =
    "login.html";

}


// =============================
// ELEMENTS
// =============================

const applicationsList =
  document.getElementById(
    "applicationsList"
  );

const pendingCount =
  document.getElementById(
    "pendingCount"
  );

const requestedAmount =
  document.getElementById(
    "requestedAmount"
  );

const applicationStatus =
  document.getElementById(
    "applicationStatus"
  );

const refreshBtn =
  document.getElementById(
    "refreshBtn"
  );

const reviewModal =
  document.getElementById(
    "reviewModal"
  );

const closeModal =
  document.getElementById(
    "closeModal"
  );

const loanDetails =
  document.getElementById(
    "loanDetails"
  );

const adminNote =
  document.getElementById(
    "adminNote"
  );

const approveBtn =
  document.getElementById(
    "approveBtn"
  );

const rejectBtn =
  document.getElementById(
    "rejectBtn"
  );

const modalMessage =
  document.getElementById(
    "modalMessage"
  );


let selectedLoanId = null;


// =============================
// FORMAT MONEY
// =============================

function formatMoney(value) {

  return "$" +
    Number(value).toLocaleString(
      "en-US",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    );

}


// =============================
// LOAD PENDING LOANS
// =============================

async function loadPendingLoans() {

  applicationStatus.textContent =
    "Loading...";


  try {

    const response =
      await fetch(
        `${API_URL}/api/loans/admin/pending`,
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
        "Could not load applications"
      );

    }


    const loans =
      result.loans || [];


    pendingCount.textContent =
      loans.length;


    const total =
      loans.reduce(
        (sum, loan) =>
          sum + Number(loan.amount),
        0
      );


    requestedAmount.textContent =
      formatMoney(total);


    applicationStatus.textContent =
      `${loans.length} pending`;


    displayApplications(
      loans
    );


  } catch (error) {

    console.error(error);

    applicationStatus.textContent =
      error.message;

    applicationsList.innerHTML = `

      <div style="
        padding:40px;
        text-align:center;
        color:#b91c1c;
      ">

        <i class="fa-solid fa-triangle-exclamation"></i>

        <p>
          ${error.message}
        </p>

      </div>

    `;

  }

}


// =============================
// DISPLAY APPLICATIONS
// =============================

function displayApplications(
  loans
) {

  if (!loans.length) {

    applicationsList.innerHTML = `

      <div style="
        text-align:center;
        padding:60px 20px;
        color:#667085;
      ">

        <i
          class="fa-solid fa-circle-check"
          style="
            font-size:40px;
            color:#1769ff;
            margin-bottom:15px;
          "
        ></i>

        <h3>
          No pending applications
        </h3>

        <p>
          There are currently no loan
          applications waiting for review.
        </p>

      </div>

    `;

    return;
  }


  applicationsList.innerHTML =
    loans.map((loan) => {

      const applicant =
        loan.applicant || {};


      return `

        <div class="application-card">

          <div class="applicant-info">

            <h3>
              ${escapeHtml(
                applicant.name ||
                "Unknown Applicant"
              )}
            </h3>

            <p>
              ${escapeHtml(
                applicant.email ||
                ""
              )}
            </p>

            <p>
              Account:
              ${escapeHtml(
                applicant.accountNumber ||
                "N/A"
              )}
            </p>

          </div>


          <div class="application-info">

            <div class="info-item">

              <span>
                LOAN TYPE
              </span>

              <strong>
                ${escapeHtml(
                  loan.loanType
                )}
              </strong>

            </div>


            <div class="info-item">

              <span>
                AMOUNT
              </span>

              <strong>
                ${formatMoney(
                  loan.amount
                )}
              </strong>

            </div>


            <div class="info-item">

              <span>
                TERM
              </span>

              <strong>
                ${loan.termMonths}
                Months
              </strong>

            </div>


            <div class="info-item">

              <span>
                STATUS
              </span>

              <strong class="status">
                Pending
              </strong>

            </div>

          </div>


          <button
            class="review-btn"
            onclick="openReview('${loan._id}')"
          >

            Review

            <i class="fa-solid fa-arrow-right"></i>

          </button>

        </div>

      `;

    }).join("");

}


// =============================
// OPEN REVIEW
// =============================

async function openReview(id) {

  selectedLoanId = id;

  modalMessage.textContent = "";

  adminNote.value = "";


  try {

    const response =
      await fetch(
        `${API_URL}/api/loans/admin/pending`,
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


    const loan =
      result.loans.find(
        item =>
          item._id === id
      );


    if (!loan) {

      throw new Error(
        "Loan application no longer exists"
      );

    }


    const applicant =
      loan.applicant || {};


    loanDetails.innerHTML = `

      <div class="detail-row">

        <span>
          Applicant
        </span>

        <strong>
          ${escapeHtml(
            applicant.name ||
            "N/A"
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Email
        </span>

        <strong>
          ${escapeHtml(
            applicant.email ||
            "N/A"
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Account Number
        </span>

        <strong>
          ${escapeHtml(
            applicant.accountNumber ||
            "N/A"
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Loan Type
        </span>

        <strong>
          ${escapeHtml(
            loan.loanType
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Amount
        </span>

        <strong>
          ${formatMoney(
            loan.amount
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Term
        </span>

        <strong>
          ${loan.termMonths}
          Months
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Monthly Income
        </span>

        <strong>
          ${formatMoney(
            loan.monthlyIncome
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Employment
        </span>

        <strong>
          ${escapeHtml(
            loan.employmentStatus
          )}
        </strong>

      </div>


      <div class="detail-row">

        <span>
          Purpose
        </span>

        <strong>
          ${escapeHtml(
            loan.purpose
          )}
        </strong>

      </div>

    `;


    reviewModal.classList.add(
      "show"
    );


  } catch (error) {

    alert(error.message);

  }

}


// =============================
// APPROVE
// =============================

approveBtn.addEventListener(
  "click",
  async () => {

    if (!selectedLoanId) {
      return;
    }


    approveBtn.disabled = true;

    modalMessage.textContent =
      "Approving application...";


    try {

      const response =
        await fetch(
          `${API_URL}/api/loans/admin/${selectedLoanId}/approve`,
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


      modalMessage.textContent =
        "Loan application approved.";

      modalMessage.style.color =
        "#15803d";


      setTimeout(() => {

        reviewModal.classList.remove(
          "show"
        );

        loadPendingLoans();

      }, 800);


    } catch (error) {

      modalMessage.textContent =
        error.message;

      modalMessage.style.color =
        "#b91c1c";

    } finally {

      approveBtn.disabled = false;

    }

  }
);


// =============================
// REJECT
// =============================

rejectBtn.addEventListener(
  "click",
  async () => {

    if (!selectedLoanId) {
      return;
    }


    rejectBtn.disabled = true;

    modalMessage.textContent =
      "Rejecting application...";


    try {

      const response =
        await fetch(
          `${API_URL}/api/loans/admin/${selectedLoanId}/reject`,
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
                adminNote.value.trim()
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


      modalMessage.textContent =
        "Loan application rejected.";

      modalMessage.style.color =
        "#b91c1c";


      setTimeout(() => {

        reviewModal.classList.remove(
          "show"
        );

        loadPendingLoans();

      }, 800);


    } catch (error) {

      modalMessage.textContent =
        error.message;

      modalMessage.style.color =
        "#b91c1c";

    } finally {

      rejectBtn.disabled = false;

    }

  }
);


// =============================
// CLOSE MODAL
// =============================

closeModal.addEventListener(
  "click",
  () => {

    reviewModal.classList.remove(
      "show"
    );

  }
);


reviewModal.addEventListener(
  "click",
  (event) => {

    if (
      event.target ===
      reviewModal
    ) {

      reviewModal.classList.remove(
        "show"
      );

    }

  }
);


// =============================
// REFRESH
// =============================

refreshBtn.addEventListener(
  "click",
  loadPendingLoans
);


// =============================
// BASIC HTML ESCAPING
// =============================

function escapeHtml(value) {

  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");

}


// =============================
// INITIAL LOAD
// =============================

loadPendingLoans();