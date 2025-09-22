import React, {useEffect, useState} from 'react';
import {usersCollection} from '../firebase/Firebase';
import {doc, getDocs, query, setDoc, where} from 'firebase/firestore';
import {useNavigate} from 'react-router-dom';
import {Button, Container, Form, Modal} from 'react-bootstrap';
import ValidateFn from '../components/ValidationFn';
import {doPasswordChange, doSignInWithEmailAndPassword, updateUserDisplayName} from "../firebase/auth";
import {useAuth} from "../contexts/authContext";
import ModalRegistering from "../components/ModalRegistering";

function Login({setIsLoggedIn, setUserInfo}) {
    const navigate = useNavigate();
    const loggedInUserId = localStorage.getItem('userId');

    const [user, setUser] = useState([])
    const [userId, setUserId] = useState('')

    const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: ''
    });

    const [changePwd, setChangePwd] = useState({
        oldPwd: '',
        newPwd: '',
        confirmNewPwd: ""
    });

    const [isSigningIn, setIsSigningIn] = useState(false);
    const [formDataError, setFormDataError] = useState('');

    const getUserInfo = async (user) => {
        try {
            const q = query(usersCollection,
                where("email", "==", user.email));
            const querySnapshot = await getDocs(q);

            // Get the first instance
            const info = querySnapshot.docs.find((val, idx) => idx === 0);

            if (info.data() != null) {

                const userData = info.data();
                setUser(userData)
                setUserId(info.id)
                console.log("info.id = ", info.id)

                if (!info.data().finishedRegistering) {
                    localStorage.setItem('isUserNotDoneRegistering', 'true')
                    console.log("TEST THAT WE ARE NOT DONE REGISTERING...")
                } else {
                    console.log("user id in login is: " + info.id)
                    const firstName = info.data().firstName;
                    const lastName = info.data().lastName;
                    const displayName = (lastName + ", " + firstName);
                    const type = info.data().type;
                    setUserInfo({displayName, type});
                    setIsLoggedIn(true);
                    // setIsLoggedIn(true);
                    // localStorage.setItem('isLoggedIn', 'true');
                    localStorage.setItem('displayedName', displayName);
                    localStorage.setItem('type', type);
                    localStorage.setItem('userId', info.id); // to later get access to the user
                    localStorage.setItem('firstName', firstName);
                    localStorage.setItem('lastName', lastName);
                    // setUserInfo({ firstName, lastName})
                    localStorage.setItem('isUserNotDoneRegistering', 'false')
                }
            }

        } catch (e) {
            console.error("Error occured. ", e);
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('userId', '');
            localStorage.setItem('displayedName', '');
            localStorage.setItem('type', '');

            setLoginInfo({
                username: '',
                password: ''
            })
            setFormDataError('The credentials entered are invalid.')
        }


    }
    let registerDone = false;

    useEffect(() => {
        if (registerDone) {
            console.log("Register done was set to true")
        } else {
            console.log("REGISTER: ", registerDone)
        }
    }, [registerDone]);

    const [showSignIn, setShowSignIn] = useState(true);

    const handleLogin = async (event) => {
        event.preventDefault();
        if (!isSigningIn) {
            try {
                const userInfo = await doSignInWithEmailAndPassword(loginInfo.username, loginInfo.password);
                console.log("OK. IT WORKS", userInfo)
                setIsSigningIn(true);
                await getUserInfo(userInfo.user).then(() => {
                    console.log("are we not done registering? : ", localStorage.getItem('isUserNotDoneRegistering'))
                    setShowSignIn(false);
                })
            } catch (e) {
                // error occured. Do something
                // Reset the login placeholders
                setLoginInfo({
                    username: '',
                    password: ''
                })
                setFormDataError('The credentials entered are invalid.')
            }
        }
    };

    const handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setLoginInfo({...loginInfo, [name]: value});
    }

    return (
        <>
            <Container>

                {showSignIn ?
                    <>
                        <form className="loginPage align-middle border p-2">

                            <h3 className='mt-3 fw-bold' id="usersDataContainer">Sign In</h3>
                            <div className=" d-flex flex-column">
                                <tr className='text-start mx-md-2'>
                                    <label
                                        htmlFor="username"
                                        className="form-label text-start fw-medium"
                                    >Email address</label>
                                    <Form.Control
                                        type="text"
                                        className="form-control border"
                                        id="username"
                                        name="username"
                                        placeholder={"Enter email"}
                                        value={loginInfo.username}
                                        onChange={handleChange}
                                    />
                                </tr>
                                <tr className='text-start mt-3 mb-0 mx-md-2'>
                                    <label htmlFor="password" className="form-label fw-medium">Password</label>
                                    <Form.Control
                                        type="password"
                                        className="form-control border"
                                        id="password"
                                        name="password"
                                        placeholder={"Enter password"}
                                        value={loginInfo.password}
                                        onChange={handleChange}
                                    />
                                    {formDataError !== "" ? (
                                        <div className="invalidInput mt-1 ps-1"
                                             style={{color: "red"}}>{formDataError}</div>
                                    ) : (
                                        <></>
                                    )}
                                    {/*<p className={"text-end mt-2"}*/}
                                    {/*   style={{fontSize: '14px', cursor: 'pointer', color: '#3f48cc'}}*/}
                                    {/*   onClick={forgotPassword}>Forgot Password?</p>*/}
                                </tr>
                                <tr className='text-start mt-4 mx-md-2'>
                                    <Button className='m-0 mt-0 dataMenuBtn w-100' type="submit"
                                            onClick={handleLogin}>Login</Button>
                                </tr>

                            </div>
                        </form>

                    </> :
                    <>
                        {/*Show the form if the user is not done registering. The password must be changed. */}
                        {(localStorage.getItem('isUserNotDoneRegistering') === 'true') ?
                            <ModalRegistering/> :
                            <div className="mt-5 text-center" id="welcomeBackContainer">
                                <h3 className="mt-5 pt-5">Welcome Back {user.firstName} {user.lastName}!</h3>
                                <tr className='text-center mt-4 mx-md-2'>
                                    <Button className='text-center m-0 mt-2 dataMenuBtn w-100' type="submit"
                                            onClick={() => {
                                                navigate("/")
                                            }}>Go To Main Page</Button>
                                </tr>
                            </div>}
                    </>}
            </Container>
        </>
    )
}

export default Login;