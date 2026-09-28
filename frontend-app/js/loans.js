const API_URL = "http://localhost:3000";


// =========================
// MOBILE MENU
// =========================

const menuBtn =
  document.getElementById("menuBtn");

const navLinks =
  document.getElementById("navLinks");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
  });
}


// =========================
// LOAN ELEMENTS
// =========================

const loanForm =
  document.getElementById("loanForm");

const loanType =
  document.getElementById("loanType");

const amount =
  document.getElementById("amount");

const amountDisplay =
  document.getElementById("amountDisplay");

const termMonths =
  document.getElementById("termMonths");

const summaryAmount =
  document.getElementById("summaryAmount");

const summaryTerm =
  document.getElementById("summaryTerm");

const monthlyPayment =
  document.getElementById("monthlyPayment");

const loanMessage =
  document.getElementById("loanMessage");

const loanApplications =
  document.getElementById("loanApplications");


// =========================
// FORMAT MONEY
// =========================

function formatMoney(value) {
  return "$" + Number(value).toLocaleString(
    "en-US",
    {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }
  );
}


// =========================
// UPDATE CALCULATOR
// =========================

function updateLoanCalculator() {

  const loanAmount =
    Number(amount.value);

  const months =
    Number(termMonths.value);

  const payment =
    loanAmount / months;

  amountDisplay.textContent =
    formatMoney(loanAmount);

  summaryAmount.textContent =
    formatMoney(loanAmount);

  summaryTerm.textContent =
    `${months} Months`;

  monthlyPayment.textContent =
    formatMoney(payment);
}


if (amount) {
  amount.addEventListener(
    "input",
    updateLoanCalculator
  );
}


if (termMonths) {
  termMonths.addEventListener(
    "change",
    updateLoanCalculator
  );
}


updateLoanCalculator();


// =========================
// SELECT LOAN TYPE
// =========================

const selectLoanButtons =
  document.querySelectorAll(
    ".select-loan"
  );

selectLoanButtons.forEach((button) => {

  button.addEventListener(
    "click",
    () => {

      const selectedLoan =
        button.dataset.loan;

      loanType.value =
        selectedLoan;

      document
        .getElementById("loanApplication")
        .scrollIntoView({
          behavior: "smooth"
        });

    }
  );

});


// =========================
// SUBMIT APPLICATION
// =========================

if (loanForm) {

  loanForm.addEventListener(
    "submit",
    async (event) => {

      event.preventDefault();

      const token =
        localStorage.getItem("token");

      if (!token) {

        loanMessage.textContent =
          "Please log in before applying for a loan.";

        loanMessage.style.color =
          "#dc2626";

        return;
      }


      const formData =
        new FormData(loanForm);


      const data = {

        loanType:
          formData.get("loanType"),

        amount:
          Number(formData.get("amount")),

        termMonths:
          Number(formData.get("termMonths")),

        monthlyIncome:
          Number(formData.get("monthlyIncome")),

        purpose:
          formData.get("purpose"),

        employmentStatus:
          formData.get("employmentStatus")

      };


      loanMessage.textContent =
        "Submitting application...";

      loanMessage.style.color =
        "#1769ff";


      try {

        const response =
          await fetch(
            `${API_URL}/api/loans`,
            {
              method: "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`
              },

              body:
                JSON.stringify(data)
            }
          );


        const result =
          await response.json();


        if (!response.ok) {

          throw new Error(
            result.message ||
            "Could not submit application"
          );

        }


        loanMessage.textContent =
          result.message ||
          "Loan application submitted successfully.";

        loanMessage.style.color =
          "#15803d";


        loanForm.reset();

        amount.value = 10000;

        termMonths.value = 12;

        updateLoanCalculator();


        loadMyLoans();


      } catch (error) {

        console.error(error);

        loanMessage.textContent =
          error.message;

        loanMessage.style.color =
          "#dc2626";

      }

    }
  );

}


// =========================
// LOAD MY APPLICATIONS
// =========================

async function loadMyLoans() {

  const token =
    localStorage.getItem("token");


  if (!token) {
    return;
  }


  try {

    const response =
      await fetch(
        `${API_URL}/api/loans/my-loans`,
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


    displayLoans(
      result.loans || []
    );


  } catch (error) {

    console.error(
      "Could not load loans:",
      error
    );

  }

}


// =========================
// DISPLAY LOANS
// =========================

function displayLoans(loans) {

  if (!loanApplications) {
    return;
  }


  if (!loans.length) {

    loanApplications.innerHTML = `

      <div class="empty-loans">

        <i class="fa-solid fa-folder-open"></i>

        <h3>No applications yet</h3>

        <p>
          Your submitted loan applications
          will appear here.
        </p>

      </div>

    `;

    return;
  }


  loanApplications.innerHTML =
    loans.map((loan) => {

      const status =
        loan.status.toLowerCase();


      const statusClass =
        `status-${status}`;


      const date =
        new Date(
          loan.createdAt
        ).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric"
          }
        );


      return `

        <div class="loan-application-card">

          <div class="loan-card-top">

            <div>

              <h3>
                ${loan.loanType}
              </h3>

              <span class="loan-date">
                Applied ${date}
              </span>

            </div>

            <span class="loan-status ${statusClass}">
              ${capitalize(status)}
            </span>

          </div>


          <div class="loan-card-details">

            <div>

              <span>Amount</span>

              <strong>
                ${formatMoney(loan.amount)}
              </strong>

            </div>


            <div>

              <span>Term</span>

              <strong>
                ${loan.termMonths} Months
              </strong>

            </div>


            <div>

              <span>Monthly Income</span>

              <strong>
                ${formatMoney(
                  loan.monthlyIncome
                )}
              </strong>

            </div>

          </div>

          ${
            loan.adminNote
              ? `
                <p style="
                  margin-top:20px;
                  color:#667085;
                  font-size:14px;
                ">
                  <strong>Admin Note:</strong>
                  ${loan.adminNote}
                </p>
              `
              : ""
          }

        </div>

      `;

    }).join("");

}


// =========================
// CAPITALIZE
// =========================

function capitalize(value) {

  return value.charAt(0).toUpperCase() +
    value.slice(1);

}


// =========================
// LOAD ON PAGE OPEN
// =========================

loadMyLoans();