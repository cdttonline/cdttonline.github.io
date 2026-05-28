import {Container, Nav, Navbar, NavDropdown} from "react-bootstrap";
import {useNavigate} from "react-router-dom";
import "../pages/Navbar.css"
import React, {useEffect, useState} from "react";
import {doSignOut, getUserAuthentication} from "../firebase/auth";
import {auth} from "../firebase/Firebase";
import ModalRegistering from "./ModalRegistering";
import {useTranslation} from "react-i18next";
import {useNavBarTexts} from "../translations/i18nHelpers";

const NavBar = ({isLoggedIn, setIsLoggedIn, user}) => {
    const { i18n } = useTranslation();
    const texts = useNavBarTexts();

    useEffect(() => {
        console.log("user isss: ", user)
        if (auth) {
            console.log("Someone is logged in. ", getUserAuthentication());
        } else {
            console.log("No one is logged in..")
        }
    }, []);

    const swapLanguage = () => {
        if (i18n.language === 'fr') {
            changeLanguage('en');
        } else {
            changeLanguage('fr');
        }
    };

    const changeLanguage = (lng) => {
        i18n.changeLanguage(lng); // Change language dynamically
    }

    const handleLogout = async () => {
        if (isLoggedIn) {
            // Logout user
            await doSignOut();
            console.log("LOGGED UT")
            setIsLoggedIn(false);
        }
        localStorage.setItem('isLoggedIn', 'false');
        localStorage.removeItem('displayedName')
        localStorage.removeItem('type')
        localStorage.removeItem('userId')
        localStorage.removeItem('firstName')
        localStorage.removeItem('lastName')
        localStorage.removeItem('isUserNotDoneRegistering')

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

    const navigateToResearchPlatform = () => {
        navigate("/researchPlatform");
    }

    const navigateToContact = () => {
        navigate("/contact");
    }

    const navigateToLogin = () => {
        navigate("/login");
        isUserLoggedIn(true);
    }

    const [loggedIn, isUserLoggedIn] = useState(false);

    const navigateToData = () => {
        navigate("/testData");
    }
    const navigateToMyProfile = () => {
        navigate("/myProfile");
    }
    const navigateToUsers = () => {
        navigate("/usersData");
    }
    const navigateToInternalCalibration = () => {
        navigate("/internalCalibration");
    }

    return (
        <>
            {(localStorage.getItem('isUserNotDoneRegistering') === 'true') ?
                <ModalRegistering/> : <></>}
            <Navbar bg="light" expand="lg" data-bs-theme="light" collapseOnSelect>
                <Container id="navbarContainer">
                    <Navbar.Brand onClick={navigateBackToMainPage} style={{cursor: 'pointer'}}>
                        <img alt="DTT logo"
                             src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-DTT.png"
                             width="50"
                             height="50"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="responsive-navbar-nav"/>
                    <Navbar.Collapse id="responsive-navbar-nav" col>
                        <Nav
                            className="me-auto"
                            navbarScroll
                        >
                            <Nav.Link
                                eventKey={1}
                                onClick={navigateBackToMainPage}
                            >{texts.about}</Nav.Link>
                            <Nav.Link id="barForNav" className={"px-1"} disabled={true}>|</Nav.Link>

                            <Nav.Link
                                eventKey={2}
                                onClick={navigateToResearchPlatform}
                            >{texts.researchPlatform}</Nav.Link>
                            <Nav.Link id="barForNav" className={"px-1"} disabled={true}>|</Nav.Link>

                            <Nav.Link
                                eventKey={3}
                                onClick={navigateToTest}
                            >{texts.test}</Nav.Link>
                            <Nav.Link id="barForNav" className={"px-1"} disabled={true}>|</Nav.Link>

                            <Nav.Link
                                eventKey={4}
                                onClick={navigateToContact}
                            >{texts.contact}</Nav.Link>
                            {(isLoggedIn && (user.type === 'Admin')) ? (
                                <>
                                    <Nav.Link id="barForNav" className={"px-1"} disabled={true}>|</Nav.Link>
                                    <NavDropdown title={texts.dataSubTitle.data} style={{maxWidth: '150px'}} className="mx-auto" id="basic-nav-dropdown">
                                        <NavDropdown.Item>
                                            <Nav.Link
                                                eventKey={5}
                                                className={"m-0 p-0"}
                                                onClick={navigateToData}
                                                style={{fontSize: '14px'}}
                                            >
                                                {texts.dataSubTitle.results}
                                            </Nav.Link>
                                        </NavDropdown.Item>
                                        <NavDropdown.Item>
                                            <Nav.Link
                                                eventKey={5}
                                                className={"m-0 p-0"}
                                                onClick={navigateToInternalCalibration}
                                                style={{fontSize: '14px'}}
                                            >
                                                {texts.dataSubTitle.internalCalibration}
                                            </Nav.Link>
                                        </NavDropdown.Item>
                                    </NavDropdown>
                                    <Nav.Link id="barForNav" className={"px-1"} disabled={true}>|</Nav.Link>

                                    <Nav.Link eventKey={7}
                                              onClick={navigateToUsers}>{texts.users}</Nav.Link>
                                </>
                            ) : <></>
                            }
                        </Nav>
                        <Nav className="userNavBar">
                            {isLoggedIn ? (
                                <>
                                    {/* Flex Profile */}
                                    <div className="secondNavBar secondFlexNavBar">
                                        <div className={"d-flex"}>
                                            <Nav.Link eventKey={8} id="navBarLanguage"
                                                      onClick={() => swapLanguage()}>{texts.language}</Nav.Link>
                                            <Nav.Link eventKey={9} id="separatorNavBar" className={"px-1"}
                                                      disabled>|</Nav.Link>
                                            <div className="text-end text-center mx-2" style={{
                                                fontSize: '1.0rem',
                                                paddingBottom: '4.0px',
                                                paddingTop: '0.5rem',
                                                color: 'GrayText'
                                            }}>{user.displayName}
                                            </div>
                                            <Nav.Link eventKey={10} onClick={navigateToMyProfile}>
                                                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                     style={{cursor: "pointer"}} fill="currentColor"
                                                     className="bi bi-person-circle" viewBox="0 0 16 16">
                                                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                    <path fill-rule="evenodd"
                                                          d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                                </svg>
                                            </Nav.Link>
                                        </div>
                                        <div className="logoutNavBar">
                                            <Nav.Link eventKey={11}
                                                      onClick={handleLogout}>{texts.logout}</Nav.Link>
                                        </div>
                                    </div>

                                    {/* DropDown Profile */}
                                    <div className="secondDropDownNavBar">
                                        <Nav.Link eventKey={12} id="navBarLanguage"
                                                  onClick={() => swapLanguage()}>{texts.language}</Nav.Link>
                                        <Nav.Link id="separatorNavBar" className={"px-1"}
                                                  disabled={true}>|</Nav.Link>

                                        <NavDropdown title={
                                            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25"
                                                 style={{cursor: "pointer", color: 'rgba(0,0,0, 0.65)'}}
                                                 fill="currentColor"
                                                 className="bi bi-person-circle" viewBox="0 0 16 16">
                                                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                                <path fill-rule="evenodd"
                                                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                            </svg>
                                        } id="basic-nav-dropdown" align="end">

                                            <NavDropdown.Item disabled={true} className={"m-0 py-0"}>
                                                <div className="my-0 py-1" style={{
                                                    fontSize: '1.0rem',
                                                    color: 'GrayText'
                                                }}>{user.displayName}</div>
                                            </NavDropdown.Item>
                                            <NavDropdown.Item><Nav.Link eventKey={10} className={"m-0 p-0"}
                                                                        style={{fontSize: '14px'}}
                                                                        onClick={navigateToMyProfile}>{texts.profile}</Nav.Link></NavDropdown.Item>
                                            <NavDropdown.Item>
                                                <div className="logoutNavBar">
                                                    <Nav.Link eventKey={10} className={"m-0 p-0"}
                                                              style={{fontSize: '14px'}}
                                                              onClick={handleLogout}>{texts.logout}</Nav.Link>
                                                </div>
                                            </NavDropdown.Item>
                                        </NavDropdown>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="secondNavBar">
                                        <Nav.Link eventKey={7}
                                                  id="navBarLanguage">{texts.language}</Nav.Link>
                                        <Nav.Link eventKey={8} id="separatorNavBar" disabled>|</Nav.Link>
                                        <Nav.Link className="loginNavBar" eventKey={9}
                                                  onClick={navigateToLogin}>{texts.login}</Nav.Link>
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