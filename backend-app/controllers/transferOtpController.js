const crypto = require("crypto");

const User = require("../models/User");
const TransferOTP = require("../models/TransferOTP");

const {
    sendTransferOTP
} = require("../services/emailService");


const OTP_TRANSFER_LIMIT = 5000;

const OTP_EXPIRATION_MINUTES = 10;

const MAX_ATTEMPTS = 5;


// ========================================
// HASH OTP
// ========================================

function hashOTP(otp) {

    return crypto
        .createHash("sha256")
        .update(otp)
        .digest("hex");
}


// ========================================
// REQUEST OTP
// ========================================

const requestTransferOTP = async (req, res) => {

    try {

        const {
            accountNumber,
            amount
        } = req.body;


        const transferAmount =
            Number(amount);


        // ========================================
        // VALIDATE AMOUNT
        // ========================================

        if (
            !Number.isFinite(
                transferAmount
            ) ||
            transferAmount <= 0
        ) {

            return res.status(400).json({
                message:
                    "Enter a valid transfer amount."
            });
        }


        // ========================================
        // OTP ONLY ABOVE 5,000
        // ========================================

        if (
            transferAmount <=
            OTP_TRANSFER_LIMIT
        ) {

            return res.status(400).json({
                message:
                    "OTP verification is only required for transfers above 5,000."
            });
        }


        // ========================================
        // ACCOUNT REQUIRED
        // ========================================

        if (!accountNumber) {

            return res.status(400).json({
                message:
                    "Recipient account number is required."
            });
        }


        // ========================================
        // CHECK USER
        // ========================================

        const user =
            await User.findById(
                req.user._id
            );


        if (!user) {

            return res.status(404).json({
                message:
                    "User account not found."
            });
        }


        // ========================================
        // CHECK TIER LIMIT
        // ========================================

        if (
            transferAmount >
            user.tierLimit
        ) {

            return res.status(400).json({
                message:
                    `Transfer exceeds your Tier ${user.tier} limit of ₦${Number(
                        user.tierLimit
                    ).toLocaleString()}.`
            });
        }


        // ========================================
        // CHECK BALANCE
        // ========================================

        if (
            user.balance <
            transferAmount
        ) {

            return res.status(400).json({
                message:
                    "Insufficient balance."
            });
        }


        // ========================================
        // CHECK RECIPIENT
        // ========================================

        const receiver =
            await User.findOne({
                accountNumber:
                    String(accountNumber).trim()
            });


        if (!receiver) {

            return res.status(404).json({
                message:
                    "Recipient account not found."
            });
        }


        // ========================================
        // CANNOT SEND TO SELF
        // ========================================

        if (
            receiver._id.equals(
                user._id
            )
        ) {

            return res.status(400).json({
                message:
                    "You cannot transfer money to your own account."
            });
        }


        // ========================================
        // DELETE OLD OTPs
        // ========================================

        await TransferOTP.deleteMany({
            user: user._id,
            verifiedAt: null
        });


        // ========================================
        // GENERATE SECURE OTP
        // ========================================

        const otp =
            crypto.randomInt(
                100000,
                1000000
            ).toString();


        const otpHash =
            hashOTP(otp);


        const expiresAt =
            new Date(
                Date.now() +
                OTP_EXPIRATION_MINUTES *
                60 *
                1000
            );


        // ========================================
        // SAVE OTP
        // ========================================

        await TransferOTP.create({
            user: user._id,

            accountNumber:
                user.accountNumber,

            amount:
                transferAmount,

            recipientAccountNumber:
                receiver.accountNumber,

            otpHash,

            expiresAt
        });


        // ========================================
        // SEND EMAIL
        // ========================================

        await sendTransferOTP(
            user.email,
            otp
        );


        return res.status(200).json({
            success: true,

            message:
                "A verification code has been sent to your registered email address."
        });


    } catch (error) {

        console.error(
            "Request transfer OTP error:",
            error
        );


        return res.status(500).json({
            message:
                "Unable to send verification code."
        });
    }
};


// ========================================
// VERIFY OTP
// ========================================

const verifyTransferOTP = async (
    req,
    res
) => {

    try {

        const {
            accountNumber,
            amount,
            otp
        } = req.body;


        const transferAmount =
            Number(amount);


        // ========================================
        // VALIDATION
        // ========================================

        if (
            !accountNumber ||
            !Number.isFinite(
                transferAmount
            ) ||
            !otp
        ) {

            return res.status(400).json({
                message:
                    "Account number, amount and verification code are required."
            });
        }


        if (
            transferAmount <=
            OTP_TRANSFER_LIMIT
        ) {

            return res.status(400).json({
                message:
                    "OTP verification is not required for this transfer."
            });
        }


        // ========================================
        // FIND OTP
        // ========================================

        const otpRecord =
            await TransferOTP.findOne({
                user: req.user._id,

                recipientAccountNumber:
                    String(accountNumber).trim(),

                amount:
                    transferAmount,

                verifiedAt: null
            }).sort({
                createdAt: -1
            });


        if (!otpRecord) {

            return res.status(400).json({
                message:
                    "No active verification code was found. Request a new code."
            });
        }


        // ========================================
        // CHECK EXPIRATION
        // ========================================

        if (
            new Date() >
            otpRecord.expiresAt
        ) {

            await TransferOTP.deleteOne({
                _id: otpRecord._id
            });

            return res.status(400).json({
                message:
                    "Verification code has expired. Request a new code."
            });
        }


        // ========================================
        // CHECK ATTEMPTS
        // ========================================

        if (
            otpRecord.attempts >=
            MAX_ATTEMPTS
        ) {

            await TransferOTP.deleteOne({
                _id: otpRecord._id
            });

            return res.status(400).json({
                message:
                    "Too many incorrect attempts. Request a new code."
            });
        }


        // ========================================
        // CHECK OTP
        // ========================================

        const submittedHash =
            hashOTP(
                String(otp).trim()
            );


        if (
            submittedHash !==
            otpRecord.otpHash
        ) {

            otpRecord.attempts += 1;

            await otpRecord.save();

            return res.status(400).json({
                message:
                    `Incorrect verification code. ${
                        Math.max(
                            0,
                            MAX_ATTEMPTS -
                            otpRecord.attempts
                        )
                    } attempts remaining.`
            });
        }


        // ========================================
        // MARK VERIFIED
        // ========================================

        otpRecord.verifiedAt =
            new Date();


        await otpRecord.save();


        return res.status(200).json({
            success: true,

            message:
                "Transfer verification successful."
        });


    } catch (error) {

        console.error(
            "Verify transfer OTP error:",
            error
        );


        return res.status(500).json({
            message:
                "Unable to verify the code."
        });
    }
};


module.exports = {
    requestTransferOTP,
    verifyTransferOTP
};