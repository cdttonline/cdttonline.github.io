import { Route, createBrowserRouter, createRoutesFromElements, RouterProvider } from "react-router-dom";
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

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userInfo, setUserInfo] = useState({
        id: '',
        name: '',
        lastName: ''
    })
    
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
