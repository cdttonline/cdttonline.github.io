import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "./Navbar.css"
import { useEffect, useState } from "react";
import { useHistory } from 'react-router-dom';
import { auth, db } from "../Firebase";
const NavBar = ( { isLoggedIn, setIsLoggedIn, user }) => {

    // const [loggedIn, setLoggedIn] = useState(isLoggedIn);
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
        // localStorage.removeItem('isLoggedIn');
    }
    const navigate = useNavigate();
    const history = useNavigate();

    const [userTmp, setUserTmp] = useState(null);

    // useEffect(() => {
    //     // Listen to authentication state
    //     const unsubscribeAuth = auth.onAuthStateChanged(async (currentUser) => {
    //         if (currentUser) {
    //             setUserTmp(currentUser);

    //         // Add a listener to check if the user's rights have been revoked
    //         const userRef = db.collection('Users').doc(currentUser.uid); // Replace with your Firestore path
    //         const unsubscribeDb = userRef.onSnapshot((doc) => {
    //             if (doc.exists) {
    //                 const userData = doc.data();
    //                 if (!userData.hasAccess) {
    //                     // If the user no longer has access, log them out and redirect to login
    //                     auth.signOut().then(() => {
    //                         setUserTmp(null);
    //                     history.push('/');  // Redirect to login page
    //                     });
    //                 }
    //             }
    //         });

    //         return () => unsubscribeDb();  // Cleanup on component unmount
    //         } else {
    //             setUserTmp(null);
    //         }
    //     });

    //     return () => unsubscribeAuth();  // Cleanup on component unmount
    // }, [history]);
    
    const [activeMainPage, setActiveMainPage] = useState(true);
    const [activeTest, setActiveTest] = useState(false);
    const [activeContact, setContact] = useState(false);
    const [activeLogin, setActiveLogin] = useState(false);
    const [activeState, setActiveState] = useState('');

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
        resetActiveState();
        setActiveState(1)
        setActiveMainPage(true);
        navigate('/');
    }

    const navigateToTest = () => {
        resetActiveState();
        setActiveTest(true)
        setActiveState(2)
        navigate("/test");
    }

    const navigateToContact = () => {
        resetActiveState();
        setContact(true);
        setActiveState(3)
        navigate("/contact");
    }

    const resetActiveState = () => {
        setActiveMainPage(false);
        setActiveTest(false);
        setContact(false);
        setActiveLogin(false);
    }

    const navigateToLogin = () => {
        navigate("/login");
        isUserLoggedIn(true);
    }

    const [loggedIn, isUserLoggedIn] = useState(false);
    const [loggedOut, isUserLoggedOut] = useState(true);
    const navigateToLogout = () => {
        isUserLoggedIn(false);
    }

    const navigateToDate = () => {
        navigate("/testData");
    }

    const navigateToMyProfile = () => {
        // navigate("/myProfile", {state: {user}});
        navigate("/myProfile");

    }

    const navigateToUsers = () => {
        navigate("/usersData");
    }

    return (
        <>
            <Navbar bg="light" expand="md" data-bs-theme="light">
                <Container>
                    <Navbar.Brand onClick={navigateBackToMainPage} style={{cursor:'pointer'}}>        
                        <img alt="DTT logo"
                        src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-DTT.png"
                        width="50"
                        height="50"
                        />
                    </Navbar.Brand>

                    <Navbar.Toggle aria-controls="navbarScroll" />
                    <Navbar.Collapse id="navbarScroll">
                        {/* <Nav
                            className="me-auto my-2 my-lg-0"
                            style={{ maxHeight: '100px' }}
                            navbarScroll
                        ></Nav> */}
                        <Nav 
                            className="me-auto" 
                            navbarScroll
                            variant="underline"
                        >
                            <Nav.Link 
                                active={activeMainPage} 
                                onClick={navigateBackToMainPage}
                            >About</Nav.Link>
                            <Nav.Link 
                                active={activeTest} 
                                onClick={navigateToTest}
                            >Test</Nav.Link>
                            <Nav.Link 
                                active={activeContact} 
                                onClick={navigateToContact}
                            >Contact</Nav.Link>
                            {isLoggedIn ? (
                                <>
                                    <Nav.Link onClick={navigateToDate}>Data</Nav.Link>
                                    <Nav.Link onClick={navigateToUsers}>Users</Nav.Link>
                                </>
                                ) : <></>
                            }
                        </Nav>
                        <Nav>
                            {/* <Button className="glyphicon glyphicon-log-in" style={{backgroundColor: "#3f48cc", border: "no"}}><span className="glyphicon glyphicon-log-in"></span> Login</Button> */}
                            <Nav.Link>FR</Nav.Link>
                            <Nav.Link disabled>|</Nav.Link>
                            {isLoggedIn ? (
                                <>
                                    <div className="text-end me-3">
                                        <p className="my-auto align-content-center">{user.firstName}, {user.lastName}</p>
                                    </div>
                                    <Nav.Link onClick={navigateToMyProfile}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" style={{cursor:"pointer"}} fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                            <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                            <path fill-rule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                        </svg>
                                    </Nav.Link>
                                    
                                        
                                    <Nav.Link onClick={handleLogout}>Logout</Nav.Link>

                                    

                                </>
                            ) : (
                                <Nav.Link onClick={navigateToLogin}>Login</Nav.Link>
                            )}
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </>
    )

    
}

export default NavBar;