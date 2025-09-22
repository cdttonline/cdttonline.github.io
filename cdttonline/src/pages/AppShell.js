import {Link, Outlet} from "react-router-dom"
import NavBar from "./NavBar"
import React, {useState} from 'react';

export const AppShell = ({isLoggedIn, setIsLoggedIn, user}) => {
    return (
        <div className={"d-flex flex-column min-vh-100"}>
            <div className="">
                <NavBar isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} user={user}/>

                {/* Body - All pages information will be dealt here */}
                <Outlet/>
            </div>

            {/* Footer */}
            <footer className="mt-auto text-center align-bottom text-lg-start bg-body-tertiary text-muted">
                <div className="text-center p-4" style={{backgroundColor: 'rgba(0, 0, 0, 0.05)', fontSize: '12px'}}>
                    <div className="d-flex flex-row flex-wrap align-items-center justify-content-center mb-2 pt-1">
                        <div className="">
                            <Link className="me-3" to={"/"}>
                                <img alt="DTT logo"
                                     src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-DTT.png"
                                     width="20"
                                     height="20"
                                /></Link>
                            <Link className="me-3" to="/">About</Link>
                            <Link className="me-3 text-wrap" to={"/researchPlatform"}>Research Platform</Link>
                            <Link className="me-3" to={"/test"}>Online Testing</Link>
                            <Link className="me-3" to={"/contact"}>Contact</Link>
                        </div>
                    </div>
                    © 2025 Canadian Digit Triplet Test, <i>University of Ottawa.</i> All Rights Reserved.
                </div>
            </footer>
        </div>
    )
}