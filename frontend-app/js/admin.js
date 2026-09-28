const transactionsContainer =
  document.getElementById("transactions");

const message = document.getElementById("message");

const token = localStorage.getItem("token");

async function getPendingTransfers() {
  try {
    const response = await fetch(
      "http://localhost:3000/api/transfers/pending",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    displayTransactions(data.transfers);

  } catch (error) {
    message.textContent = error.message;
  }
}


function displayTransactions(transfers) {

  if (transfers.length === 0) {
    transactionsContainer.innerHTML =
      "<p>No pending transfers.</p>";
    return;
  }

  transactionsContainer.innerHTML = "";

  transfers.forEach(transaction => {

    const div = document.createElement("div");

    div.className = "transaction";

    div.innerHTML = `
      <h3>₦${transaction.amount.toLocaleString()}</h3>

      <p>
        <strong>From:</strong>
        ${transaction.sender.name}
        (${transaction.sender.accountNumber})
      </p>

      <p>
        <strong>To:</strong>
        ${transaction.receiver.name}
        (${transaction.receiver.accountNumber})
      </p>

      <p>
        <strong>Status:</strong>
        ${transaction.status}
      </p>

      <button
        onclick="approveTransfer('${transaction._id}')">
        Approve
      </button>

      <button
        class="decline"
        onclick="declineTransfer('${transaction._id}')">
        Decline
      </button>
    `;

    transactionsContainer.appendChild(div);
  });
}


async function approveTransfer(id) {

  try {

    const response = await fetch(
      `http://localhost:3000/api/transfers/${id}/approve`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    message.textContent = data.message;

    getPendingTransfers();

  } catch (error) {
    message.textContent = error.message;
  }
}


async function declineTransfer(id) {

  try {

    const response = await fetch(
      `http://localhost:3000/api/transfers/${id}/decline`,
      {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message);
    }

    message.textContent = data.message;

    getPendingTransfers();

  } catch (error) {
    message.textContent = error.message;
  }
}


getPendingTransfers();