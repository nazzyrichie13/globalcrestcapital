// const dns = require("dns");

// // ======================================
// // DNS
// // ======================================

// dns.setServers([
//     "1.1.1.1",
//     "8.8.8.8",
//     "8.8.4.4"
// ]);


// // ======================================
// // ENV
// // ======================================

// require("dotenv").config();


// // ======================================
// // PACKAGES
// // ======================================

// const mongoose = require("mongoose");
// const bcrypt = require("bcryptjs");

// const User = require("./models/User");


// // ======================================
// // ADMIN DETAILS
// // ======================================

// const ADMIN_EMAIL =
//     "admin@globalcrestc.com";

// const ADMIN_PASSWORD =
//     "shocker120";

// const ADMIN_NAME =
//     "GlobalCrest Admin";

// const ADMIN_ACCOUNT_NUMBER =
//     "ADMIN000001";


// // ======================================
// // CREATE / UPDATE ADMIN
// // ======================================

// async function createAdmin() {

//     try {

//         console.log(
//             "Connecting to MongoDB..."
//         );


//         await mongoose.connect(
//             process.env.MONGO_URI,
//             {
//                 serverSelectionTimeoutMS: 15000
//             }
//         );


//         console.log(
//             "MongoDB connected"
//         );


//         // ==================================
//         // FIND EXISTING ADMIN
//         // ==================================

//         let admin =
//             await User.findOne({
//                 $or: [
//                     {
//                         email:
//                             ADMIN_EMAIL
//                     },
//                     {
//                         accountNumber:
//                             ADMIN_ACCOUNT_NUMBER
//                     }
//                 ]
//             });


//         // ==================================
//         // HASH PASSWORD
//         // ==================================

//         const hashedPassword =
//             await bcrypt.hash(
//                 ADMIN_PASSWORD,
//                 10
//             );


//         // ==================================
//         // EXISTING ACCOUNT
//         // ==================================

//         if (admin) {

//             console.log(
//                 "Existing account found."
//             );

//             console.log(
//                 "Existing email:",
//                 admin.email
//             );

//             console.log(
//                 "Existing account number:",
//                 admin.accountNumber
//             );


//             // Update existing account

//             admin.name =
//                 ADMIN_NAME;

//             admin.email =
//                 ADMIN_EMAIL;

//             admin.password =
//                 hashedPassword;

//             admin.role =
//                 "admin";

//             admin.isActive =
//                 true;


//             await admin.save();


//             console.log(
//                 "--------------------------------"
//             );

//             console.log(
//                 "ADMIN ACCOUNT UPDATED"
//             );

//         }


//         // ==================================
//         // NO ACCOUNT EXISTS
//         // ==================================

//         else {

//             admin =
//                 await User.create({

//                     name:
//                         ADMIN_NAME,

//                     email:
//                         ADMIN_EMAIL,

//                     password:
//                         hashedPassword,

//                     accountNumber:
//                         ADMIN_ACCOUNT_NUMBER,

//                     balance:
//                         0,

//                     tier:
//                         1,

//                     tierLimit:
//                         0,

//                     role:
//                         "admin",

//                     isActive:
//                         true

//                 });


//             console.log(
//                 "--------------------------------"
//             );

//             console.log(
//                 "NEW ADMIN ACCOUNT CREATED"
//             );

//         }


//         // ==================================
//         // SHOW RESULTS
//         // ==================================

//         console.log(
//             "--------------------------------"
//         );

//         console.log(
//             "Email:",
//             admin.email
//         );

//         console.log(
//             "Account:",
//             admin.accountNumber
//         );

//         console.log(
//             "Role:",
//             admin.role
//         );

//         console.log(
//             "Active:",
//             admin.isActive
//         );

//         console.log(
//             "Password:",
//             ADMIN_PASSWORD
//         );

//         console.log(
//             "--------------------------------"
//         );


//         // ==================================
//         // DISCONNECT
//         // ==================================

//         await mongoose.disconnect();

//         console.log(
//             "MongoDB disconnected."
//         );


//         process.exit(0);


//     } catch (error) {

//         console.error(
//             "Admin creation error:"
//         );

//         console.error(error);


//         try {

//             await mongoose.disconnect();

//         } catch (disconnectError) {

//             console.error(
//                 disconnectError
//             );

//         }


//         process.exit(1);

//     }

// }


// // ======================================
// // RUN
// // ======================================

// createAdmin();