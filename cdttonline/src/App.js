import logo from './logo.svg';
import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider, useNavigate } from "react-router-dom";
import './App.css';
import { HomePage } from './pages/HomePage';
import TestMainFrame from './pages/TestMainFrame';
import { AppShell } from './pages/AppShell';
import UserTestResults from './pages/UserTestResults';
import Test from './pages/Test';
import Contact from './pages/Contact';
import Login from './pages/Login';
import React, { useEffect, useState } from 'react';
import UserProfile from './pages/UserProfile';
import Data, { loadResultsFromDataBase } from './pages/Data';
import Users, { loadUsers } from './pages/Users';
import { auth, db } from './Firebase';
import { doc, getDoc } from 'firebase/firestore';

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({
        id: '',
        name: '',
        lastName: ''
    })
    // const history = useNavigate();
    
    const [userTmp, setUserTmp] = useState(null);
    const loggedInStatus = localStorage.getItem('isLoggedIn');

    useEffect(() => {
        const id = localStorage.getItem('userId');
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        if (loggedInStatus === 'true') {
            setIsLoggedIn(true);
            setUserInfo ( { id, firstName, lastName })
        } else {
        console.log("LOGGED OUT")

        }

    }, []);

    useEffect(() => {
        // Listen to authentication state


        // const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
        //     if (currentUser) {
        //         setUserTmp(currentUser);

        //     // Add a listener to check if the user's rights have been revoked

        //     const userRef = db.collection('Users').doc(currentUser.uid); // Replace with your Firestore path
        //     const unsubscribeDb = userRef.onSnapshot((doc) => {
        //         if (doc.exists) {
        //             const userData = doc.data();
        //             if (!userData.hasAccess) {
        //                 // If the user no longer has access, log them out and redirect to login
        //                 auth.signOut().then(() => {
        //                     setUserTmp(null);
        //                     console.log("User doesn't exists anymore")
        //                 // history.push('/');  // Redirect to login page
        //                 setIsLoggedIn(false)
        //                 });
        //             }
        //         } else {
        //             console.log("User doesn't exists anymore")
        //                 // history.push('/');  // Redirect to login page
        //                 setIsLoggedIn(false)
        //         }
        //     });

        //     return () => unsubscribeDb();  // Cleanup on component unmount
        //     } else {
        //         setUserTmp(null);
        //     }
        // });

        // return () => unsubscribeAuth();  // Cleanup on component unmount
        const idUser = localStorage.getItem('userId')
        if (idUser != "") {
            getCurrentUserData(idUser)

        }
    }, [loggedInStatus]);


    const getCurrentUserData = async(userId) => {
        const docSnap = await getDoc(doc(db, "Users", userId))
        // const q = query(usersCollection, 
        //     where("firstName", "==", firstName),
        //     where("lastName", "==", lastName));
    
        // const querySnapshot = await getDocs(q);
        // const info = querySnapshot.docs.find((val, idx) => idx === 0);
        if (!docSnap.exists()) {
            // User does not exists. Log out. 
            console.log("IN APP: DOESNT EXIT")
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('userId', '');
            localStorage.setItem('firstName', '');
            localStorage.setItem('lastName', '');

            setUserInfo({
                id: '',
                name: '',
                lastName: ''
            })
            setIsLoggedIn(false);
            // navigate("/")
        } else{
            // setCurrentUserId(userId);

        }
    }

    // useEffect(() => {
    //     const checkAuthorization = async () => {
    //       const user = auth.currentUser;
    //       if (user) {
    //         const userDoc = await db.collection('Users').doc(user.uid).get();
    //         if (userDoc.exists && !userDoc.data().isAuthorized) {
    //           auth.signOut();
    //           window.location.href = '/';
    //         }
    //       }
    //     };
    
    //     const intervalId = setInterval(checkAuthorization, 300000); // Check every 5 minutes
    
    //     return () => clearInterval(intervalId); // Cleanup on unmount
    //   }, []);

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<AppShell isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={userInfo} />}>
            <Route index element={<HomePage/>}/>
            <Route path='test' element={<Test/>} />
            <Route path='contact' element={<Contact/>} />
            <Route path='testMainFrame' element={<TestMainFrame/>} />
            <Route path='userTestResults' element={<UserTestResults/>} />
            <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo}/>} />
            <Route path='myProfile' element={<UserProfile userId={userInfo.id}/>} />
            <Route path='testData' loader={loadResultsFromDataBase} element={<Data/>} />
            <Route path='usersData' loader={loadUsers} element={<Users/>} />
            </Route>
        )
    )
    
    return <RouterProvider router={router} />;

}

export default App;
