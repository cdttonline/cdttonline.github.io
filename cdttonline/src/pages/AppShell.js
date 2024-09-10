import { Outlet } from "react-router-dom"
import NavBar from "./NavBar"
import React, { useState } from 'react';

export const AppShell=({ isLoggedIn, setIsLoggedIn, user })=>{
    return (
        <div>
            <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user} />

            <Outlet/>
        </div>
    )
}