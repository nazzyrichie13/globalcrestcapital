// ============================
// ADMIN AUTHENTICATION
// ============================

const token = localStorage.getItem("adminToken");

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
  window.location.href = "admin-login.html";
}


// ============================
// ELEMENTS
// ============================

const usersContainer =
  document.getElementById("usersContainer");

const totalUsers =
  document.getElementById("totalUsers");

const activeUsers =
  document.getElementById("activeUsers");

const refreshBtn =
  document.getElementById("refreshBtn");


// ============================
// LOAD USERS
// ============================

async function loadUsers() {

  try {

    usersContainer.innerHTML = `
      <p>Loading users...</p>
    `;

    const response = await fetch(
      "https://api.globalcrestc.com/api/admin/users",
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
        "Unable to load users."
      );
    }

    const users =
      result.users || [];

    totalUsers.textContent =
      users.length;

    activeUsers.textContent =
      users.filter(
        user => user.status === "active"
      ).length;

    displayUsers(users);

  } catch (error) {

    console.error(
      "Load users error:",
      error
    );

    usersContainer.innerHTML = `
      <p>
        ${escapeHtml(
          error.message ||
          "Unable to load users."
        )}
      </p>
    `;
  }
}


// ============================
// DISPLAY USERS
// ============================

function displayUsers(users) {

  if (!users.length) {

    usersContainer.innerHTML = `
      <p>No users found.</p>
    `;

    return;
  }

  usersContainer.innerHTML = users
    .map(user => {

      return `
        <div class="user-card">

          <div class="user-icon">
            <i class="fa-solid fa-user"></i>
          </div>

          <div class="user-info">

            <h3>
              ${escapeHtml(
                user.fullName ||
                user.name ||
                "Unknown User"
              )}
            </h3>

            <p>
              Email:
              ${escapeHtml(
                user.email || "N/A"
              )}
            </p>

            <p>
              Account:
              ${escapeHtml(
                user.accountNumber || "N/A"
              )}
            </p>

            <p>
              Phone:
              ${escapeHtml(
                user.phone || "N/A"
              )}
            </p>

          </div>

          <div class="user-status">

            <span>
              ${escapeHtml(
                user.status || "active"
              )}
            </span>

          </div>

        </div>
      `;

    })
    .join("");
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

if (refreshBtn) {

  refreshBtn.addEventListener(
    "click",
    loadUsers
  );

}


// ============================
// INITIAL LOAD
// ============================

loadUsers();