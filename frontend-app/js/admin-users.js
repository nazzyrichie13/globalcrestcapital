// ============================
// ADMIN AUTHENTICATION
// ============================

const token = localStorage.getItem("adminToken");

const adminUser = JSON.parse(
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
  window.location.href = "admin-login.html";
}


// ============================
// ELEMENTS
// ============================

const usersTableBody =
  document.getElementById("usersTableBody");

const totalUsers =
  document.getElementById("totalUsers");

const activeUsers =
  document.getElementById("activeUsers");

const tierOneUsers =
  document.getElementById("tierOneUsers");

const totalBalance =
  document.getElementById("totalBalance");

const refreshBtn =
  document.getElementById("refreshBtn");

const searchInput =
  document.getElementById("searchInput");

const emptyState =
  document.getElementById("emptyState");


// ============================
// USERS DATA
// ============================

let allUsers = [];


// ============================
// LOAD USERS
// ============================

async function loadUsers() {

  try {

    usersTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="loading">
            <i class="fa-solid fa-spinner fa-spin"></i>
            Loading users...
          </div>
        </td>
      </tr>
    `;


    const response = await fetch(
      "https://api.globalcrestc.com/api/admin/users",
      {
        method: "GET",

        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );


    const result =
      await response.json();


    if (!response.ok) {

      throw new Error(
        result.message ||
        "Unable to load users."
      );

    }


    const users =
      result.users || [];


    allUsers = users;


    // ============================
    // TOTAL USERS
    // ============================

    totalUsers.textContent =
      result.totalUsers ??
      users.length;


    // ============================
    // ACTIVE USERS
    // ============================

    activeUsers.textContent =
      result.activeUsers ??
      users.filter(
        user => user.isActive === true
      ).length;


    // ============================
    // TIER 1 USERS
    // ============================

    tierOneUsers.textContent =
      users.filter(
        user => Number(user.tier) === 1
      ).length;


    // ============================
    // TOTAL BALANCE
    // ============================

    const balance =
      users.reduce(
        (total, user) =>
          total +
          Number(user.balance || 0),
        0
      );


    totalBalance.textContent =
      `₦${balance.toLocaleString(
        "en-NG",
        {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        }
      )}`;


    displayUsers(users);

  } catch (error) {

    console.error(
      "Load users error:",
      error
    );


    usersTableBody.innerHTML = `
      <tr>
        <td colspan="8">
          <div class="loading">
            ${escapeHtml(
              error.message ||
              "Unable to load users."
            )}
          </div>
        </td>
      </tr>
    `;

  }

}


// ============================
// DISPLAY USERS
// ============================

function displayUsers(users) {

  if (!users.length) {

    usersTableBody.innerHTML = "";

    emptyState.style.display =
      "block";

    return;

  }


  emptyState.style.display =
    "none";


  usersTableBody.innerHTML =
    users.map(user => {

      const status =
        user.isActive === true
          ? "Active"
          : "Inactive";


      const statusClass =
        user.isActive === true
          ? "active"
          : "inactive";


      const joined =
        user.createdAt
          ? new Date(
              user.createdAt
            ).toLocaleDateString()
          : "N/A";


      return `
        <tr>

          <td>

            <div class="customer-cell">

              <div class="user-icon">
                <i class="fa-solid fa-user"></i>
              </div>

              <div>

                <strong>
                  ${escapeHtml(
                    user.name ||
                    "Unknown User"
                  )}
                </strong>

              </div>

            </div>

          </td>


          <td>
            ${escapeHtml(
              user.email ||
              "N/A"
            )}
          </td>


          <td>
            ${escapeHtml(
              user.accountNumber ||
              "N/A"
            )}
          </td>


          <td>
            ₦${Number(
              user.balance || 0
            ).toLocaleString(
              "en-NG",
              {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2
              }
            )}
          </td>


          <td>
            Tier ${escapeHtml(
              user.tier || 1
            )}
          </td>


          <td>

            <span class="${statusClass}">
              ${status}
            </span>

          </td>


          <td>
            ${joined}
          </td>


          <td>

            <button
              class="view-user-btn"
              onclick="viewUser('${user._id}')"
            >
              <i class="fa-solid fa-eye"></i>
              View
            </button>

          </td>

        </tr>
      `;

    }).join("");

}


// ============================
// SEARCH USERS
// ============================

if (searchInput) {

  searchInput.addEventListener(
    "input",
    () => {

      const search =
        searchInput.value
          .trim()
          .toLowerCase();


      if (!search) {

        displayUsers(allUsers);

        return;

      }


      const filteredUsers =
        allUsers.filter(user => {

          const name =
            String(
              user.name || ""
            ).toLowerCase();


          const email =
            String(
              user.email || ""
            ).toLowerCase();


          const accountNumber =
            String(
              user.accountNumber || ""
            ).toLowerCase();


          return (
            name.includes(search) ||
            email.includes(search) ||
            accountNumber.includes(search)
          );

        });


      displayUsers(
        filteredUsers
      );

    }
  );

}


// ============================
// VIEW USER
// ============================

function viewUser(userId) {

  const user =
    allUsers.find(
      user =>
        String(user._id) ===
        String(userId)
    );


  if (!user) {
    return;
  }


  const userModal =
    document.getElementById(
      "userModal"
    );


  document.getElementById(
    "modalName"
  ).textContent =
    user.name || "User";


  document.getElementById(
    "modalEmail"
  ).textContent =
    user.email || "—";


  document.getElementById(
    "modalAccountNumber"
  ).textContent =
    user.accountNumber || "—";


  document.getElementById(
    "modalBalance"
  ).textContent =
    `₦${Number(
      user.balance || 0
    ).toLocaleString(
      "en-NG",
      {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }
    )}`;


  document.getElementById(
    "modalTier"
  ).textContent =
    `Tier ${user.tier || 1}`;


  document.getElementById(
    "modalStatus"
  ).textContent =
    user.isActive === true
      ? "Active"
      : "Inactive";


  document.getElementById(
    "modalJoined"
  ).textContent =
    user.createdAt
      ? new Date(
          user.createdAt
        ).toLocaleDateString()
      : "—";


  document.getElementById(
    "modalUpdated"
  ).textContent =
    user.updatedAt
      ? new Date(
          user.updatedAt
        ).toLocaleDateString()
      : "—";


  userModal.style.display =
    "flex";

}


// ============================
// CLOSE MODAL
// ============================

const closeModal =
  document.getElementById(
    "closeModal"
  );


if (closeModal) {

  closeModal.addEventListener(
    "click",
    () => {

      document.getElementById(
        "userModal"
      ).style.display =
        "none";

    }
  );

}


// ============================
// CLICK OUTSIDE MODAL
// ============================

const userModal =
  document.getElementById(
    "userModal"
  );


if (userModal) {

  userModal.addEventListener(
    "click",
    event => {

      if (
        event.target ===
        userModal
      ) {

        userModal.style.display =
          "none";

      }

    }
  );

}


// ============================
// REFRESH
// ============================

if (refreshBtn) {

  refreshBtn.addEventListener(
    "click",
    loadUsers
  );

}


// ============================
// SECURITY
// ============================

function escapeHtml(value) {

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
// INITIAL LOAD
// ============================

loadUsers();