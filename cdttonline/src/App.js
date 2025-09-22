import {Route, createBrowserRouter, createRoutesFromElements, RouterProvider} from "react-router-dom";
import './App.css';
import {HomePage} from './pages/HomePage';
import TestMainFrame from './pages/TestMainFrame';
import {AppShell} from './pages/AppShell';
import UserTestResults from './pages/UserTestResults';
import Test from './pages/Test';
import Contact from './pages/Contact';
import Login from './pages/Login';
import React, {useEffect, useState} from 'react';
import UserProfile from './pages/UserProfile';
import Data, {loadResultsFromDataBase} from './pages/Data';
import Users, {loadUsers} from './pages/Users';
import {ResearchPlatform} from "./pages/ResearchPlatform";
import {onAuthStateChanged} from "firebase/auth";
import {auth} from "./firebase/Firebase";
import {DataModal} from "./components/DataModal";
import {DataFromTest} from "./pages/DataFromTest";
import ModalRegistering from "./components/ModalRegistering";
import {InternalCalibrationValues} from "./components/InternalCalibrationValues";
// import {useTranslation} from "react-i18next";

function App() {

    // const { t, i18n } = useTranslation()

    // const changeLanguage  = (lng) => {
    //     i18n.changeLanguage(lng); // Change language dynamically
    // }

    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({
        id: '',
        displayName: '',
        type: ''
    })

    // const [userInfo, setUserInfo] = useState({
    //     id: '',
    //     name: '',
    //     lastName: ''
    // })

    // const loggedInStatus = localStorage.getItem('isLoggedIn');
    const [notDoneRegistering, setNotDoneRegistering] = useState('');
    useEffect(() => {
        const id = localStorage.getItem('userId');
        // const firstName = localStorage.getItem('firstName');
        // const lastName = localStorage.getItem('lastName');
        const type = localStorage.getItem('type');
        // const displayName = localStorage.getItem('displayedName');
        // if (loggedInStatus === 'true') {
        //     setIsLoggedIn(true);
        //     // setUserInfo({id, displayName, type })
        //     setUserInfo({id, firstName, lastName})
        //     console.log("USER looooo", userInfo)
        //
        // } else {
        //     console.log("LOGGED OUT")
        //
        // }

        const displayName = localStorage.getItem('displayedName');
        const finishedRegistering = localStorage.getItem('isUserNotDoneRegistering');
        // setNotDoneRegistering(finishedRegistering);
        console.log("display Name=" + displayName)
        console.log("user id=" + id)
        // console.log("FROM APP:, is user not done register:", finishedRegistering)
        onAuthStateChanged(auth, (user) => {
            if (user) {
                setIsLoggedIn(true);
                setUserInfo({id, displayName, type })
                console.log(" USER : " + user.email + " is signed in.");
                if (finishedRegistering) {
                    setNotDoneRegistering(true)
                }

            } else {
                console.log("user is logged out.... ")
                localStorage.setItem('isUserNotDoneRegistering', 'false')
            }
        })



    }, []);

    const showModal = () => {
        ModalRegistering();
    }

    const router = createBrowserRouter(
        createRoutesFromElements(
            <Route path="/" element={<AppShell isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={userInfo}/>}>
                <Route index element={<HomePage/>}/>
                <Route path='researchPlatform' element={<ResearchPlatform/>}/>

                <Route path='test' element={<Test/>}/>
                <Route path='contact' element={<Contact/>}/>
                <Route path='testMainFrame' element={<TestMainFrame/>}/>
                <Route path='userTestResults' element={<UserTestResults/>}/>
                <Route path="login" element={<Login setIsLoggedIn={setIsLoggedIn} setUserInfo={setUserInfo}/>}/>
                <Route path='myProfile' element={<UserProfile userId={userInfo.id}/>}/>
                <Route path='testData' loader={loadResultsFromDataBase} element={<Data/>}/>
                <Route path='usersData' loader={loadUsers} element={<Users/>}/>
                <Route path='data/:dataId' element={<DataFromTest/>}/>
                <Route path='internalCalibration' element={<InternalCalibrationValues/>} />
            </Route>
        )
    )

    return <RouterProvider router={router}/>;

}

export default App;
