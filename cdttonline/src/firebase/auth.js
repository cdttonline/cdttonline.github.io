import {auth, firebaseApp} from "./Firebase";
import {
    getAuth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
    updatePassword,
    sendEmailVerification,
    updateProfile,
    deleteUser
} from "firebase/auth";
import {initializeApp} from "firebase/app";
// import admin from "firebase-admin";

export const doCreateUserWithEmailAndPassword = async (email, password, firstName, lastName) => {
    const user = createUserWithEmailAndPassword(auth, email, password);
    user.then((userData) => {
        userData.user.displayName = (lastName + ", " + firstName); // Adding the name of the user
    });
    return user;
}

export const doSignInWithEmailAndPassword = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

export const doSignOut = () => {
    return auth.signOut();
};

export const getUserAuthentication = () => {
    return getAuth();
}

export const doPasswordReset = (email) => {
    return sendPasswordResetEmail(auth, email);
};

export const doPasswordChange = (password) => {

    console.log("current user:", auth.currentUser)
    return updatePassword(auth.currentUser, password);
};

export const updateUserDisplayName = (newDisplayName) => {
    const user = auth.currentUser;
    if (user) {
        updateProfile(user, {
            displayName: newDisplayName
        }).then(() => {
            console.log("Display name is: ", user.displayName);
        }).catch((error) => {
            console.error("Error updating the display name: ", error);
        })
    }
}

// export const removeUser = (firstName, lastName, email) => {
//     // With the data passed in the parameter, find the user to be deleted
//     const userName = (lastName + ", " + firstName);
//
//     // const user = firebase.auth().listUsers();
//
//     // delete user from database authenticator
//     getAuth().getUserByEmail(email).then((r) => {
//         deleteUser()
//     })
//     return deleteUser();
// }

export const getListOfUsers = async (token) => {
    // const defaultApp = initializeApp(firebaseApp);
    // im { getAuth } = require('firebase-admin/auth');
    // return listUsers(1000, token);
    // getAuth().
    // try {
    //     const users = [];
    //     let nextPageToken;
    //
    //     do {
    //         const listUsersResult = await admin.auth().listUsers(1000, nextPageToken);
    //         listUsersResult.users.forEach((userRecord) => {
    //             users.push(userRecord.toJSON());
    //             console.log("user test, ", userRecord)
    //         });
    //         nextPageToken = listUsersResult.pageToken;
    //     } while (nextPageToken);
    //
    //     // res.status(200).json(users);
    // } catch (error) {
    //     // res.status(500).send(error.message);
    // }

}

export const doSendEmailVerification = () => {
    return sendEmailVerification(auth.currentUser, {
        url: `${window.location.origin}/home`,
    });
}