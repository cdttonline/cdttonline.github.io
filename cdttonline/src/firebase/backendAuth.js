// const functions = require("firebase-functions");
// const admin = require("firebase-admin");
//
// admin.initializeApp();
//
// exports.listUsers = functions.https.onRequest(async (req, res) => {
//     try {
//         const users = [];
//         let nextPageToken;
//
//         do {
//             const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
//             listUsersResult.users.forEach((userRecord) => {
//                 users.push(userRecord.toJSON());
//             });
//             nextPageToken = listUsersResult.pageToken;
//         } while (nextPageToken);
//
//         res.status(200).json(users);
//     } catch (error) {
//         res.status(500).send(error.message);
//     }
// });