const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),

  secure:
    process.env.SMTP_SECURE === "true",

  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});


async function sendLoginOTP(email, otp) {

  await transporter.sendMail({

    from:
      `"GlobalCrest Capital" <${process.env.SMTP_USER}>`,

    to: email,

    subject:
      "GlobalCrest Capital Login Verification",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        background: #f5f7fb;
      ">

        <div style="
          background: white;
          padding: 30px;
          border-radius: 10px;
        ">

          <h2 style="color:#1264d8;">
            GlobalCrest Capital
          </h2>

          <p>
            A login attempt was made on your GlobalCrest
            Capital account.
          </p>

          <p>
            Your verification code is:
          </p>

          <div style="
            font-size: 32px;
            font-weight: bold;
            letter-spacing: 8px;
            padding: 15px;
            background: #f1f5ff;
            text-align: center;
            color: #1264d8;
          ">
            ${otp}
          </div>

          <p>
            This code expires in 10 minutes.
          </p>

          <p>
            If you did not attempt to log in, please
            secure your account.
          </p>

          <hr>

          <small>
            GlobalCrest Capital
          </small>

        </div>

      </div>
    `
  });
}


async function sendTransferOTP(email, otp) {

  await transporter.sendMail({

    from:
      `"GlobalCrest Capital" <${process.env.SMTP_USER}>`,

    to: email,

    subject:
      "GlobalCrest Capital Transfer Verification",

    html: `
      <h2>GlobalCrest Capital</h2>

      <p>
        Your transfer verification code is:
      </p>

      <h1>${otp}</h1>

      <p>
        This code expires in 10 minutes.
      </p>
    `
  });
}


module.exports = {
  sendLoginOTP,
  sendTransferOTP
};