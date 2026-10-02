// ========================================
// HOME JS CONNECTED
// ========================================

console.log("home is CONNECTED");


// ========================================
// API
// ========================================

const API = "https://api.globalcrestc.com";


// ========================================
// ELEMENTS
// ========================================


// ========================================
// LOGIN
// ========================================

const loginSection =
    document.getElementById("loginSection");

const dashboardSection =
    document.getElementById("dashboardSection");

const loginForm =
    document.getElementById("loginForm");

const message =
    document.getElementById("message");


// ========================================
// LOGOUT
// ========================================

const logoutButton =
    document.getElementById("logout");


// ========================================
// PROFILE
// ========================================

const profilePhoto =
    document.getElementById("profilePhoto");

const userName =
    document.getElementById("userName");

const accountNumber =
    document.getElementById("accountNumber");

const balance =
    document.getElementById("balance");

const userTier =
    document.getElementById("userTier");

const tierLimit =
    document.getElementById("tierLimit");


// ========================================
// BALANCE EYE
// ========================================

const toggleBalance =
    document.getElementById("toggleBalance");

let balanceVisible = true;


// ========================================
// TRANSACTIONS
// ========================================

const transactionsContainer =
    document.getElementById("transactions");


// ========================================
// TRANSFER ELEMENTS
// ========================================

const transferForm =
    document.getElementById("transferForm");

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


// ========================================
// TRANSFER RESULT
// ========================================

const transferResult =
    document.getElementById("transferResult");

const transferStatusTitle =
    document.getElementById("transferStatusTitle");

const transferStatusMessage =
    document.getElementById("transferStatusMessage");

const receiptButtons =
    document.getElementById("receiptButtons");

const receipt =
    document.getElementById("receipt");

const viewReceipt =
    document.getElementById("viewReceipt");

const downloadReceipt =
    document.getElementById("downloadReceipt");

const saveReceiptImage =
    document.getElementById("saveReceiptImage");

// ========================================
// TRANSFER OTP
// ========================================

const amountInput =
    document.getElementById("amount");

const transferSubmitBtn =
    document.getElementById(
        "transferSubmitBtn"
    );

const otpSection =
    document.getElementById(
        "otpSection"
    );

const requestOtpBtn =
    document.getElementById(
        "requestOtpBtn"
    );

const otpInputArea =
    document.getElementById(
        "otpInputArea"
    );

const transferOtp =
    document.getElementById(
        "transferOtp"
    );

const verifyOtpBtn =
    document.getElementById(
        "verifyOtpBtn"
    );

const otpStatus =
    document.getElementById(
        "otpStatus"
    );

const OTP_TRANSFER_LIMIT = 5000;

let otpVerified = false;
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
// SAFE JSON RESPONSE
// ========================================

async function getResponseData(response) {

    const text =
        await response.text();

    if (!text) {
        return {};
    }

    try {

        return JSON.parse(text);

    } catch (error) {

        console.error(
            "Server did not return JSON:",
            text
        );

        throw new Error(
            `Server returned an invalid response (${response.status}).`
        );
    }
}


// ========================================
// ESCAPE HTML
// ========================================

function escapeHtml(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// ========================================
// PROFILE IMAGE URL
// ========================================

function getProfileImageUrl(path) {

    if (!path) {
        return "default-profile.png";
    }

    if (
        path.startsWith("http://") ||
        path.startsWith("https://")
    ) {
        return path;
    }

    if (path.startsWith("/")) {
        return `${API}${path}`;
    }

    return `${API}/${path}`;
}


// ========================================
// BALANCE TOGGLE
// ========================================

if (toggleBalance && balance) {

    toggleBalance.addEventListener(
        "click",
        () => {

            if (balanceVisible) {

                /*
                 * Save the current displayed balance
                 * before hiding it.
                 */
                balance.dataset.balance =
                    balance.textContent;

                balance.textContent =
                    "••••••";

                toggleBalance.innerHTML =
                    '<i class="fa-solid fa-eye-slash"></i>';

                toggleBalance.setAttribute(
                    "aria-label",
                    "Show balance"
                );

                balanceVisible = false;

            } else {

                balance.textContent =
                    balance.dataset.balance || "0";

                toggleBalance.innerHTML =
                    '<i class="fa-solid fa-eye"></i>';

                toggleBalance.setAttribute(
                    "aria-label",
                    "Hide balance"
                );

                balanceVisible = true;
            }
        }
    );
}


// ========================================
// SLIDER
// ========================================



// ========================================
// LOGIN
// ========================================

if (loginForm) {

    const loginOtpSection =
        document.getElementById(
            "loginOtpSection"
        );

    const loginOtp =
        document.getElementById(
            "loginOtp"
        );

    const verifyLoginOtpButton =
        document.getElementById(
            "verifyLoginOtpButton"
        );

    const loginOtpMessage =
        document.getElementById(
            "loginOtpMessage"
        );

    const loginButton =
        document.getElementById(
            "loginButton"
        );


    // Temporary login challenge
    let pendingLoginChallengeId = "";


    // ======================================
    // LOGIN
    // ======================================

    loginForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const formData =
                new FormData(
                    loginForm
                );


            const email =
                formData.get("email");


            const password =
                formData.get("password");


            try {

                if (loginButton) {

                    loginButton.disabled =
                        true;

                    loginButton.textContent =
                        "Checking...";

                }


                const response =
                    await fetch(
                        `${API}/api/auth/login`,
                        {

                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body:
                                JSON.stringify({

                                    email,

                                    password

                                })

                        }
                    );


                const data =
                    await getResponseData(
                        response
                    );


                if (!response.ok) {

                    throw new Error(

                        data.message ||
                        "Login failed"

                    );

                }


                // ==================================
                // OTP REQUIRED
                // ==================================

                if (
                    data.requiresOtp
                ) {

                    pendingLoginChallengeId =
                        data.challengeId;


                    if (
                        loginForm
                    ) {

                        loginForm.style.display =
                            "none";

                    }


                    if (
                        loginOtpSection
                    ) {

                        loginOtpSection.style.display =
                            "block";

                    }


                    if (
                        loginOtpMessage
                    ) {

                        loginOtpMessage.textContent =
                            data.message ||
                            "A verification code has been sent to your registered email.";

                    }


                    if (
                        loginOtp
                    ) {

                        loginOtp.value =
                            "";

                        loginOtp.focus();

                    }


                    return;

                }


            } catch (error) {

                console.error(
                    "Login error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message ||
                        "Login failed";

                }

            } finally {

                if (loginButton) {

                    loginButton.disabled =
                        false;

                    loginButton.textContent =
                        "Login";

                }

            }

        }
    );


    // ======================================
    // VERIFY LOGIN OTP
    // ======================================

    if (
        verifyLoginOtpButton
    ) {

        verifyLoginOtpButton.addEventListener(
            "click",
            async () => {

                const otp =
                    loginOtp.value.trim();


                if (!pendingLoginChallengeId) {

                    loginOtpMessage.textContent =
                        "Your login session has expired. Please log in again.";

                    return;

                }


                if (!/^\d{6}$/.test(otp)) {

                    loginOtpMessage.textContent =
                        "Enter the 6-digit verification code.";

                    return;

                }


                try {

                    verifyLoginOtpButton.disabled =
                        true;

                    verifyLoginOtpButton.textContent =
                        "Verifying...";


                    const response =
                        await fetch(

                            `${API}/api/auth/verify-login-otp`,

                            {

                                method: "POST",

                                headers: {

                                    "Content-Type":
                                        "application/json"

                                },

                                body:
                                    JSON.stringify({

                                        challengeId:
                                            pendingLoginChallengeId,

                                        otp

                                    })

                            }

                        );


                    const data =
                        await getResponseData(
                            response
                        );


                    if (!response.ok) {

                        throw new Error(

                            data.message ||
                            "Verification failed."

                        );

                    }


                    if (!data.token) {

                        throw new Error(
                            "Verification succeeded but no login token was returned."
                        );

                    }


                    // ==================================
                    // LOGIN COMPLETED
                    // ==================================

                    localStorage.setItem(
                        "token",
                        data.token
                    );


                    token =
                        data.token;


                    pendingLoginChallengeId =
                        "";


                    if (
                        loginOtpMessage
                    ) {

                        loginOtpMessage.textContent =
                            "Login successful.";

                    }


                    if (
                        loginSection
                    ) {

                        loginSection.style.display =
                            "none";

                    }


                    if (
                        loginOtpSection
                    ) {

                        loginOtpSection.style.display =
                            "none";

                    }


                    if (
                        dashboardSection
                    ) {

                        dashboardSection.style.display =
                            "block";

                    }


                    if (message) {

                        message.textContent =
                            "";

                    }


                    // Load existing dashboard data
                    getProfile();

                    getTransactions();


                } catch (error) {

                    console.error(
                        "Login OTP error:",
                        error
                    );


                    if (
                        loginOtpMessage
                    ) {

                        loginOtpMessage.textContent =
                            error.message ||
                            "Verification failed.";

                    }

                } finally {

                    verifyLoginOtpButton.disabled =
                        false;

                    verifyLoginOtpButton.textContent =
                        "Verify Code";

                }

            }
        );

    }

}


// ========================================
// GET PROFILE
// ========================================

async function getProfile() {

    if (!token) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/api/users/profile`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await getResponseData(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load profile"
            );
        }


        const user =
            data.user;


        if (!user) {

            throw new Error(
                "User information was not returned"
            );
        }


        // ========================================
        // NAME
        // ========================================

        if (userName) {

            userName.textContent =
                user.name ||
                "Customer";
        }


        // ========================================
        // ACCOUNT NUMBER
        // ========================================

        if (accountNumber) {

            accountNumber.textContent =
                user.accountNumber ||
                "---";
        }


        // ========================================
        // BALANCE
        // ========================================

        if (balance) {

            const formattedBalance =
                Number(
                    user.balance || 0
                ).toLocaleString();


            /*
             * Always keep the real formatted
             * balance stored in data-balance.
             */
            balance.dataset.balance =
                formattedBalance;


            /*
             * Only display it if the eye
             * is currently open.
             */
            if (balanceVisible) {

                balance.textContent =
                    formattedBalance;
            }
        }


        // ========================================
        // PROFILE PHOTO
        // ========================================

        if (profilePhoto) {

            if (user.profilePhoto) {

                profilePhoto.src =
                    getProfileImageUrl(
                        user.profilePhoto
                    );

            } else {

                profilePhoto.src =
                    "default-profile.png";
            }
        }


        // ========================================
        // ACCOUNT TIER
        // ========================================

        if (userTier) {

            userTier.textContent =
                `Tier ${user.tier || 1}`;
        }


        // ========================================
        // TIER LIMIT
        // ========================================

        if (tierLimit) {

            tierLimit.textContent =
                `₦${Number(
                    user.tierLimit || 0
                ).toLocaleString()}`;
        }


        // ========================================
        // OTHER DASHBOARD NAME
        // ========================================

        const welcomeName =
            document.getElementById(
                "welcomeName"
            );


        if (welcomeName) {

            welcomeName.textContent =
                user.name ||
                "Customer";
        }


        // ========================================
        // CARD HOLDER
        // ========================================

        const cardHolderName =
            document.getElementById(
                "cardHolderName"
            );


        if (cardHolderName) {

            cardHolderName.textContent =
                user.name ||
                "YOUR NAME";
        }


        // ========================================
        // CONNECTED ACCOUNT
        // ========================================

        const connectedAccount =
            document.getElementById(
                "connectedAccount"
            );


        if (connectedAccount) {

            const acc =
                String(
                    user.accountNumber || ""
                );


            connectedAccount.textContent =
                acc.slice(-4) ||
                "----";
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

    if (!token) {
        return;
    }


    if (!transactionsContainer) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/api/users/transactions`,
                {
                    headers: {
                        Authorization:
                            `Bearer ${token}`
                    }
                }
            );


        const data =
            await getResponseData(response);


        if (!response.ok) {

            throw new Error(
                data.message ||
                "Unable to load transactions"
            );
        }


        transactionsContainer.innerHTML =
            "<h2>Transactions</h2>";


        const transactions =
            Array.isArray(
                data.transactions
            )
                ? data.transactions
                : [];


        if (transactions.length === 0) {

            const emptyMessage =
                document.createElement(
                    "p"
                );

            emptyMessage.textContent =
                "No transactions yet.";

            transactionsContainer.appendChild(
                emptyMessage
            );

            return;
        }


        transactions.forEach(
            (transaction) => {

                const item =
                    document.createElement(
                        "div"
                    );


                item.classList.add(
                    "transaction-item"
                );


                const type =
                    escapeHtml(
                        String(
                            transaction.type || ""
                        ).toUpperCase()
                    );


                const amount =
                    Number(
                        transaction.amount || 0
                    ).toLocaleString();


                const status =
                    escapeHtml(
                        transaction.status ||
                        "---"
                    );


                const reference =
                    escapeHtml(
                        transaction.reference ||
                        "---"
                    );


                const date =
                    transaction.createdAt
                        ? new Date(
                            transaction.createdAt
                        ).toLocaleString()
                        : "---";


                item.innerHTML = `
                    <p>
                        <strong>
                            ${type}
                        </strong>
                    </p>

                    <p>
                        Amount:
                        ₦${amount}
                    </p>

                    <p>
                        Status:
                        ${status}
                    </p>

                    <p>
                        Reference:
                        ${reference}
                    </p>

                    <p>
                        Date:
                        ${escapeHtml(date)}
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
// TRANSFER TYPE
// ========================================

if (transferType) {

    transferType.addEventListener(
        "change",
        () => {

            if (verifiedAccountBox) {

                verifiedAccountBox.style.display =
                    "none";
            }


            if (
                transferType.value ===
                "same-bank"
            ) {

                if (sameBankSection) {

                    sameBankSection.style.display =
                        "block";
                }


                if (externalBankSection) {

                    externalBankSection.style.display =
                        "none";
                }


            } else {

                if (sameBankSection) {

                    sameBankSection.style.display =
                        "none";
                }


                if (externalBankSection) {

                    externalBankSection.style.display =
                        "block";
                }
            }
        }
    );
}


// ========================================
// VERIFY SAME BANK
// ========================================

if (verifySameBank) {

    verifySameBank.addEventListener(
        "click",
        async () => {

            const sameBankAccount =
                document.getElementById(
                    "sameBankAccount"
                );


            if (!sameBankAccount) {

                console.error(
                    "sameBankAccount element not found"
                );

                return;
            }


            const customerAccount =
                sameBankAccount.value.trim();


            if (!customerAccount) {

                alert(
                    "Enter an account number"
                );

                return;
            }


            if (!token) {

                alert(
                    "Please login again."
                );

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API}/api/transfers/verify-same-bank`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                accountNumber:
                                    customerAccount
                            })
                        }
                    );


                const result =
                    await getResponseData(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Account verification failed"
                    );
                }


                if (verifiedAccountBox) {

                    verifiedAccountBox.style.display =
                        "block";
                }


                if (verifiedAccountName) {

                    verifiedAccountName.textContent =
                        result.account?.name ||
                        result.user?.name ||
                        "Account verified";
                }


                if (verificationStatus) {

                    verificationStatus.textContent =
                        "✓ Globalcrest account verified";
                }


            } catch (error) {

                console.error(
                    "Account verification error:",
                    error
                );


                if (verifiedAccountBox) {

                    verifiedAccountBox.style.display =
                        "none";
                }
                resetOTPState();


                alert(
                    error.message ||
                    "Unable to verify account"
                );
            }
        }
    );
}


// ========================================
// VERIFY EXTERNAL BANK
// ========================================

if (verifyExternalBank) {

    verifyExternalBank.addEventListener(
        "click",
        () => {

            console.log(
                "External bank verification is not configured in home.js."
            );

        }
    );
}

// ========================================
// RESET OTP STATE
// ========================================

function resetOTPState() {

    otpVerified = false;


    if (otpSection) {

        otpSection.style.display =
            "none";
    }


    if (otpInputArea) {

        otpInputArea.style.display =
            "none";
    }


    if (transferOtp) {

        transferOtp.value = "";
    }


    if (otpStatus) {

        otpStatus.textContent = "";
    }


    if (requestOtpBtn) {

        requestOtpBtn.disabled = false;

        requestOtpBtn.textContent =
            "Send Verification Code";
    }


    if (verifyOtpBtn) {

        verifyOtpBtn.disabled = false;
    }


    if (transferSubmitBtn) {

        transferSubmitBtn.disabled =
            false;
    }
}
// ========================================
// CHECK OTP REQUIREMENT
// ========================================

function updateOTPRequirement() {

    const amount =
        Number(
            amountInput?.value
        );


    if (
        !Number.isFinite(amount) ||
        amount <= OTP_TRANSFER_LIMIT
    ) {

        resetOTPState();

        return;
    }


    // ========================================
    // LARGE TRANSFER
    // ========================================

    otpVerified = false;


    if (otpSection) {

        otpSection.style.display =
            "block";
    }


    if (otpInputArea) {

        otpInputArea.style.display =
            "none";
    }


    if (transferSubmitBtn) {

        transferSubmitBtn.disabled =
            true;
    }


    if (otpStatus) {

        otpStatus.textContent =
            "Verification is required before this transfer can be submitted.";
    }
}
// ========================================
// AMOUNT CHANGE
// ========================================

if (amountInput) {

    amountInput.addEventListener(
        "input",
        () => {

            updateOTPRequirement();

        }
    );
}
// ========================================
// REQUEST OTP
// ========================================

if (requestOtpBtn) {

    requestOtpBtn.addEventListener(
        "click",
        async () => {

            const amount =
                Number(
                    amountInput?.value
                );


            const sameBankAccount =
                document.getElementById(
                    "sameBankAccount"
                );


            const customerAccount =
                sameBankAccount
                    ? sameBankAccount.value.trim()
                    : "";


            if (
                !Number.isFinite(amount) ||
                amount <= OTP_TRANSFER_LIMIT
            ) {

                if (otpStatus) {

                    otpStatus.textContent =
                        "OTP is only required for transfers above 5,000.";
                }

                return;
            }


            if (!customerAccount) {

                if (otpStatus) {

                    otpStatus.textContent =
                        "Verify the recipient account first.";
                }

                return;
            }


            if (!token) {

                if (otpStatus) {

                    otpStatus.textContent =
                        "Please login again.";
                }

                return;
            }


            try {

                requestOtpBtn.disabled =
                    true;


                requestOtpBtn.textContent =
                    "Sending...";


                const response =
                    await fetch(
                        `${API}/api/transfers/otp/request`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify({
                                    accountNumber:
                                        customerAccount,

                                    amount
                                })
                        }
                    );


                const result =
                    await getResponseData(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Unable to send verification code."
                    );
                }


                if (otpInputArea) {

                    otpInputArea.style.display =
                        "block";
                }


                if (otpStatus) {

                    otpStatus.textContent =
                        "Verification code sent to your registered email.";
                }


                requestOtpBtn.textContent =
                    "Code Sent";


            } catch (error) {

                console.error(
                    "OTP request error:",
                    error
                );


                requestOtpBtn.disabled =
                    false;


                requestOtpBtn.textContent =
                    "Send Verification Code";


                if (otpStatus) {

                    otpStatus.textContent =
                        error.message ||
                        "Unable to send verification code.";
                }
            }
        }
    );
}
// ========================================
// VERIFY OTP
// ========================================

if (verifyOtpBtn) {

    verifyOtpBtn.addEventListener(
        "click",
        async () => {

            const amount =
                Number(
                    amountInput?.value
                );


            const sameBankAccount =
                document.getElementById(
                    "sameBankAccount"
                );


            const customerAccount =
                sameBankAccount
                    ? sameBankAccount.value.trim()
                    : "";


            const otp =
                transferOtp
                    ? transferOtp.value.trim()
                    : "";


            if (!otp) {

                if (otpStatus) {

                    otpStatus.textContent =
                        "Enter the verification code.";
                }

                return;
            }


            if (
                !/^\d{6}$/.test(
                    otp
                )
            ) {

                if (otpStatus) {

                    otpStatus.textContent =
                        "Enter the 6-digit verification code.";
                }

                return;
            }


            if (
                !customerAccount ||
                !Number.isFinite(amount)
            ) {

                if (otpStatus) {

                    otpStatus.textContent =
                        "Enter the transfer details first.";
                }

                return;
            }


            try {

                verifyOtpBtn.disabled =
                    true;


                verifyOtpBtn.textContent =
                    "Verifying...";


                const response =
                    await fetch(
                        `${API}/api/transfers/otp/verify`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body:
                                JSON.stringify({
                                    accountNumber:
                                        customerAccount,

                                    amount,

                                    otp
                                })
                        }
                    );


                const result =
                    await getResponseData(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        "Verification failed."
                    );
                }


                otpVerified =
                    true;


                if (otpStatus) {

                    otpStatus.textContent =
                        "✓ Transfer verified successfully.";
                }


                verifyOtpBtn.textContent =
                    "Verified";


                verifyOtpBtn.disabled =
                    true;


                if (transferSubmitBtn) {

                    transferSubmitBtn.disabled =
                        false;
                }


            } catch (error) {

                console.error(
                    "OTP verification error:",
                    error
                );


                verifyOtpBtn.disabled =
                    false;


                verifyOtpBtn.textContent =
                    "Verify Code";


                if (otpStatus) {

                    otpStatus.textContent =
                        error.message ||
                        "Verification failed.";
                }
            }
        }
    );
}
// ========================================
// TRANSFER FORM
// ========================================

if (transferForm) {

    transferForm.addEventListener(
        "submit",
        async (e) => {

            e.preventDefault();


            const formData =
                new FormData(
                    transferForm
                );


            const customerAccount =
                formData.get(
                    "accountNumber"
                );


            const amount =
                Number(
                    formData.get("amount")
                );

// ========================================
// OTP CHECK
// ========================================

if (
    amount > OTP_TRANSFER_LIMIT &&
    !otpVerified
) {

    if (message) {

        message.textContent =
            "Please verify the transfer with the code sent to your email.";
    }

    return;
}
// ========================================
// RECIPIENT CHANGE
// ========================================

const sameBankAccountInput =
    document.getElementById(
        "sameBankAccount"
    );


if (sameBankAccountInput) {

    sameBankAccountInput.addEventListener(
        "input",
        () => {

            const amount =
                Number(
                    amountInput?.value
                );


            if (
                amount >
                OTP_TRANSFER_LIMIT
            ) {

                otpVerified =
                    false;


                if (transferSubmitBtn) {

                    transferSubmitBtn.disabled =
                        true;
                }


                if (otpStatus) {

                    otpStatus.textContent =
                        "Recipient changed. Please request a new verification code.";
                }


                if (otpInputArea) {

                    otpInputArea.style.display =
                        "none";
                }


                if (transferOtp) {

                    transferOtp.value =
                        "";
                }


                if (requestOtpBtn) {

                    requestOtpBtn.disabled =
                        false;

                    requestOtpBtn.textContent =
                        "Send Verification Code";
                }
            }

        }
    );
}
            if (message) {

                message.textContent =
                    "";
            }


            if (
                !customerAccount ||
                !Number.isFinite(amount) ||
                amount <= 0
            ) {

                if (message) {

                    message.textContent =
                        "Enter a valid account number and amount.";
                }

                return;
            }


            if (!token) {

                if (message) {

                    message.textContent =
                        "Please login again.";
                }

                return;
            }


            try {

                const response =
                    await fetch(
                        `${API}/api/transfers`,
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json",

                                Authorization:
                                    `Bearer ${token}`
                            },

                            body: JSON.stringify({
                                accountNumber:
                                    customerAccount,

                                amount
                            })
                        }
                    );


                const result =
                    await getResponseData(
                        response
                    );


                if (!response.ok) {

                    throw new Error(
                        result.message ||
                        result.error ||
                        "Transfer failed"
                    );
                }


                const transaction =
                    result.transaction;


                if (!transaction) {

                    throw new Error(
                        "Transfer was created but no transaction was returned."
                    );
                }


                formReset();
          
              resetOTPState();

           showTransferPending(
               transaction
             );

                watchTransfer(
                    transaction._id
                );


            } catch (error) {

                console.error(
                    "Transfer error:",
                    error
                );


                if (message) {

                    message.textContent =
                        error.message ||
                        "Transfer failed";
                }
            }
        }
    );
}


// ========================================
// RESET TRANSFER FORM
// ========================================

function formReset() {

    if (transferForm) {

        transferForm.reset();
    }
}


// ========================================
// SHOW TRANSFER PENDING
// ========================================

function showTransferPending(
    transaction
) {

    if (transferResult) {

        transferResult.style.display =
            "block";
    }


    if (transferStatusTitle) {

        transferStatusTitle.textContent =
            "Transfer Submitted";
    }


    if (transferStatusMessage) {

        transferStatusMessage.textContent =
            "Your transfer has been submitted and is waiting for approval.";
    }


    if (receiptButtons) {

        receiptButtons.style.display =
            "none";
    }


    if (receipt) {

        receipt.style.display =
            "none";
    }


    if (message) {

        message.textContent =
            `Reference: ${
                transaction.reference ||
                "---"
            }`;
    }
}


// ========================================
// WATCH TRANSFER
// ========================================

function watchTransfer(
    transactionId
) {

    if (!transactionId) {
        return;
    }


    if (transferCheckInterval) {

        clearInterval(
            transferCheckInterval
        );
    }


    checkTransferStatus(
        transactionId
    );


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

    if (!token) {
        return;
    }


    try {

        const response =
            await fetch(
                `${API}/api/users/transactions/${transactionId}`,
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
            await getResponseData(
                response
            );


        const transaction =
            data.transaction;


        if (!transaction) {
            return;
        }


        console.log(
            "Transfer status:",
            transaction.status
        );


        // ========================================
        // APPROVED
        // ========================================

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


            getProfile();

            getTransactions();
        }


        // ========================================
        // DECLINED
        // ========================================

        if (
            transaction.status ===
            "rejected"
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

    if (transferResult) {

        transferResult.style.display =
            "block";
    }


    if (transferStatusTitle) {

        transferStatusTitle.textContent =
            "✓ Transfer Successful";
    }


    if (transferStatusMessage) {

        transferStatusMessage.textContent =
            "Your transfer has been approved successfully.";
    }


    if (receiptButtons) {

        receiptButtons.style.display =
            "block";
    }


    if (receipt) {

        receipt.style.display =
            "none";
    }


    // ========================================
    // RECEIPT AMOUNT
    // ========================================

    const receiptAmount =
        document.getElementById(
            "receiptAmount"
        );


    if (receiptAmount) {

        receiptAmount.textContent =
            Number(
                transaction.amount || 0
            ).toLocaleString();
    }


    // ========================================
    // RECEIPT SENDER
    // ========================================

    const receiptSender =
        document.getElementById(
            "receiptSender"
        );


    if (receiptSender) {

        receiptSender.textContent =
            transaction.sender?.name ||
            "---";
    }


    // ========================================
    // RECEIPT SENDER ACCOUNT
    // ========================================

    const receiptSenderAccount =
        document.getElementById(
            "receiptSenderAccount"
        );


    if (receiptSenderAccount) {

        receiptSenderAccount.textContent =
            transaction.sender?.accountNumber ||
            "---";
    }


    // ========================================
    // RECEIPT RECEIVER
    // ========================================

    const receiptReceiver =
        document.getElementById(
            "receiptReceiver"
        );


    if (receiptReceiver) {

        receiptReceiver.textContent =
            transaction.receiver?.name ||
            "---";
    }


    // ========================================
    // RECEIPT RECEIVER ACCOUNT
    // ========================================

    const receiptReceiverAccount =
        document.getElementById(
            "receiptReceiverAccount"
        );


    if (receiptReceiverAccount) {

        receiptReceiverAccount.textContent =
            transaction.receiver?.accountNumber ||
            "---";
    }


    // ========================================
    // RECEIPT REFERENCE
    // ========================================

    const receiptReference =
        document.getElementById(
            "receiptReference"
        );


    if (receiptReference) {

        receiptReference.textContent =
            transaction.reference ||
            "---";
    }


    // ========================================
    // RECEIPT STATUS
    // ========================================

    const receiptStatus =
        document.getElementById(
            "receiptStatus"
        );


    if (receiptStatus) {

        receiptStatus.textContent =
            String(
                transaction.status || ""
            ).toUpperCase();
    }


    // ========================================
    // RECEIPT DATE
    // ========================================

    const receiptDate =
        document.getElementById(
            "receiptDate"
        );


    if (receiptDate) {

        receiptDate.textContent =
            transaction.createdAt
                ? new Date(
                    transaction.createdAt
                ).toLocaleString()
                : "---";
    }


    if (message) {

        message.textContent =
            `Reference: ${
                transaction.reference ||
                "---"
            }`;
    }
}


// ========================================
// TRANSFER DECLINED
// ========================================

function showTransferDeclined(
    transaction
) {

    if (transferResult) {

        transferResult.style.display =
            "block";
    }


    if (transferStatusTitle) {

        transferStatusTitle.textContent =
            "Transfer Declined";
    }


    if (transferStatusMessage) {

        transferStatusMessage.textContent =
            "Your transfer was declined by the administrator.";
    }


    if (receiptButtons) {

        receiptButtons.style.display =
            "none";
    }


    if (receipt) {

        receipt.style.display =
            "none";
    }


    if (message) {

        message.textContent =
            `Reference: ${
                transaction.reference ||
                "---"
            }`;
    }
}


// ========================================
// VIEW RECEIPT
// ========================================

if (viewReceipt) {

    viewReceipt.addEventListener(
        "click",
        () => {

            if (!receipt) {
                return;
            }


            receipt.style.display =
                "block";


            receipt.scrollIntoView({
                behavior: "smooth"
            });
        }
    );
}


// ========================================
// DOWNLOAD PDF
// ========================================

if (downloadReceipt) {

    downloadReceipt.addEventListener(
        "click",
        async () => {

            if (!receipt) {
                return;
            }


            if (
                typeof html2canvas ===
                "undefined"
            ) {

                console.error(
                    "html2canvas is not loaded."
                );

                return;
            }


            if (
                !window.jspdf ||
                !window.jspdf.jsPDF
            ) {

                console.error(
                    "jsPDF is not loaded."
                );

                return;
            }


            try {

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
                } =
                    window.jspdf;


                const pdf =
                    new jsPDF();


                const width =
                    190;


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


            } catch (error) {

                console.error(
                    "PDF generation error:",
                    error
                );
            }
        }
    );
}


// ========================================
// SAVE RECEIPT IMAGE
// ========================================

if (saveReceiptImage) {

    saveReceiptImage.addEventListener(
        "click",
        async () => {

            if (!receipt) {
                return;
            }


            if (
                typeof html2canvas ===
                "undefined"
            ) {

                console.error(
                    "html2canvas is not loaded."
                );

                return;
            }


            try {

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
                    document.createElement(
                        "a"
                    );


                link.href =
                    image;


                link.download =
                    "transfer-receipt.png";


                link.click();


            } catch (error) {

                console.error(
                    "Receipt image error:",
                    error
                );
            }
        }
    );
}


// ========================================
// LOGOUT
// ========================================

if (logoutButton) {

    logoutButton.addEventListener(
        "click",
        () => {

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


            token =
                null;


            if (dashboardSection) {

                dashboardSection.style.display =
                    "none";
            }


            if (loginSection) {

                loginSection.style.display =
                    "block";
            }


            if (loginForm) {

                loginForm.reset();
            }
        }
    );
}


// ========================================
// PAGE LOAD
// ========================================

if (token) {

    if (loginSection) {

        loginSection.style.display =
            "none";
    }


    if (dashboardSection) {

        dashboardSection.style.display =
            "block";
    }


    getProfile();

    getTransactions();

} else {

    if (loginSection) {

        loginSection.style.display =
            "block";
    }


    if (dashboardSection) {

        dashboardSection.style.display =
            "none";
    }
}