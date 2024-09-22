import { Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"
import { useState } from "react";

const NavBar = ( { isLoggedIn, setIsLoggedIn, user }) => {

    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.setItem('isLoggedIn', 'false');
        setUserInfo({
            nas: '',
            prenom: '',
            nomFamille: '',
            numero: '',
            rue: '',
            ville: '',
            province: '',
            pays: '',
            codePostal: ''
        });
        navigate("/");
    }
    const navigate = useNavigate();
    
    const [userInfo, setUserInfo] = useState({
        nas: '',
        prenom: '',
        nomFamille: '',
        numero: '',
        rue: '',
        ville: '',
        province: '',
        pays: '',
        codePostal: ''
    });

    const navigateBackToMainPage = () => {
        // navigates the user back to the main page
        navigate('/');
    }

    const navigateToTest = () => {
        navigate("/test");
    }

    const navigateToContact = () => {
        navigate("/contact");
    }


    const navigateToLogin = () => {
        navigate("/login");
        isUserLoggedIn(true);
    }

    const [loggedIn, isUserLoggedIn] = useState(false);

    const navigateToDate = () => { navigate("/testData"); }
    const navigateToMyProfile = () => { navigate("/myProfile"); }
    const navigateToUsers = () => { navigate("/usersData"); }

    return (
        <>
            <Navbar bg="light" expand="md" data-bs-theme="light" collapseOnSelect >
                <Container>
                    <Navbar.Brand onClick={navigateBackToMainPage} style={{cursor:'pointer'}}>        
                        <img alt="DTT logo"
                        src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-DTT.png"
                        width="50"
                        height="50"
                        />
                    </Navbar.Brand>

                    {/* <Navbar.Toggle aria-controls="navbarScroll" /> */}
                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />
                    <Navbar.Collapse id="responsive-navbar-nav">
                        <Nav 
                            className="me-auto" 
                            navbarScroll
                        >
                            <Nav.Link 
                                eventKey={1}
                                onClick={navigateBackToMainPage}
                            >About</Nav.Link>
                            <Nav.Link 
                                eventKey={2}
                                onClick={navigateToTest}
                            >Test</Nav.Link>
                            <Nav.Link 
                                eventKey={3}
                                onClick={navigateToContact}
                            >Contact</Nav.Link>
                            {isLoggedIn ? (
                                <>
                                    <Nav.Link eventKey={4} onClick={navigateToDate}>Data</Nav.Link>
                                    <Nav.Link eventKey={5} onClick={navigateToUsers}>Users</Nav.Link>
                                </>
                                ) : <></>
                            }
                        </Nav>
                        <Nav className="userNavBar">                            
                            {isLoggedIn ? (
                                <>
                                    <div className="secondNavBar">
                                        <Nav.Link eventKey={6} id="navBarLanguage">FR</Nav.Link>
                                        <Nav.Link eventKey={7} id="separatorNavBar" disabled>|</Nav.Link>

                                        <div className="text-end text-center mx-2" style={{fontSize: '1.0rem', paddingBottom: '4.0px', paddingTop: '0.5rem', color: 'GrayText'}}>{user.lastName}, {user.firstName}
                                        </div>
                                        <Nav.Link eventKey={8} onClick={navigateToMyProfile}>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style={{cursor:"pointer"}} fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                            </svg>
                                        </Nav.Link>
                                    </div>
                                    
                                    <div className="logoutNavBar">
                                        <Nav.Link eventKey={9} onClick={handleLogout}>Logout</Nav.Link>
                                    </div>

                                </>
                            ) : (
                                <>
                                    <div className="secondNavBar">
                                        <Nav.Link eventKey={6} id="navBarLanguage">FR</Nav.Link>
                                        <Nav.Link eventKey={7} id="separatorNavBar" disabled>|</Nav.Link>
                                        <Nav.Link className="loginNavBar" eventKey={9} onClick={navigateToLogin}>Login</Nav.Link>
                                    </div>
                                </>
                                
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )
}

export default NavBar;