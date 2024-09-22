import React, { useState } from 'react';
import { usersCollection } from '../Firebase';
import { doc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { Container, Form, Modal } from 'react-bootstrap';
import ValidateFn from '../components/ValidationFn';

function Login ({ setIsLoggedIn, setUserInfo }) {
    const navigate = useNavigate();
    const loggedInUserId = localStorage.getItem('userId');

    const [user, setUser] = useState([])
    
    const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: ''
    });

    const [changePwd, setChangePwd] = useState( {
        oldPwd: '',
        newPwd: '',
        confirmNewPwd: ""
    });

    const [formDataError, setFormDataError] = useState('');
    const [formPwdChgError, setFormPwdChgError] = useState('');
    const [isUserNotDoneRegistering, setUserNotDoneRegistering] = useState(false);
    
    const getLoginInfo = async () => {
        try {
            const q = query(usersCollection, 
                where("email", "==", loginInfo.username),
                where("password", "==", loginInfo.password));
        
            const querySnapshot = await getDocs(q);
            const info = querySnapshot.docs.find((val, idx) => idx === 0);
            if (info.data() != null) {
                setUser(info.data());

                console.log("user id in login is: " + info.id)
                const firstName = info.data().firstName;
                const lastName = info.data().lastName;
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userId', info.id );
                localStorage.setItem('firstName', firstName);
                localStorage.setItem('lastName', lastName);
                setUserInfo({ firstName, lastName });
                setIsLoggedIn(true);

                // Check it its the first time the user logs in 
                if (!info.data().finishedRegistering) {
                    // Finish registering 
                    setUserNotDoneRegistering(true);
                } else {
                    navigate("/");
                }
            }

        } catch (e) {
            console.error("Error occured. ", e);
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.setItem('userId', '' );
            localStorage.setItem('firstName', '');
            localStorage.setItem('lastName', '');
            setFormDataError('The credentials entered are invalid.')

        }
    }

    const handleLogin = (event) => {
        event.preventDefault();
        getLoginInfo();
    };

    const handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setLoginInfo({...loginInfo, [name]: value});
    }

    const handleModalClose = () => { setUserNotDoneRegistering(false); };
    
    const handlePwdChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setChangePwd({...changePwd, [name]: value});
    }

    const handlePwdChgSubmit = (e) => {
        e.preventDefault();
        pwdChgSubmit();
    }

    const pwdChgSubmit = async () => {
        const validatePwdChg = ValidateFn.validatePwdChange(changePwd);
        setFormPwdChgError(validatePwdChg);

        let flag = false;

        for (let i = 0; i < validatePwdChg.length; i++) {
            if (validatePwdChg[i] != "") {
                flag = true;
            }
        }

        if (!flag) {
            // Save new password to database
            const docRef = doc(usersCollection, loggedInUserId);
            // const docSnap = await getDoc(docRef);
            setDoc(docRef, 
            {
                'password': changePwd.newPwd,
                'finishedRegistering': true

            }, {merge: true});
            // Close modal
            setUserNotDoneRegistering(false);
            // Navigate back to the main page
            navigate("/");
        }
    }

    return (
        <>
            <Container>
                <h1 className='mt-3'>Login Page</h1>
                <form className="loginPage align-middle  border p-2">
                    <div className=" d-flex flex-column">
                        <tr className='text-start mx-md-2'>
                            <label htmlFor="username" className="form-label text-start">Username</label>
                            <Form.Control
                                type="text"
                                className="form-control border"
                                id="username"
                                name="username"
                                value={loginInfo.username}
                                onChange={handleChange}
                            />
                        </tr>
                        <tr className='text-start mt-3 mx-md-2'>
                            <label htmlFor="password" className="form-label">Password</label>
                            <Form.Control
                                type="password"
                                className="form-control border"
                                id="password"
                                name="password"
                                value={loginInfo.password}
                                onChange={handleChange}
                            />
                            {formDataError != "" ? (
                                <div className="invalidInput mt-1" style={{ color: "red" }}>{formDataError}</div>
                            ) : (
                                <></>
                            )}
                        </tr>
                    </div>
                    <button className='mt-4' type="submit" onClick={handleLogin} >Login</button>
                </form>            
            </Container>

            <Modal 
                show={isUserNotDoneRegistering} 
                onHide={handleModalClose} 
                size="lg" 
                backdrop="static" 
                keyboard={false}
                scrollable
            >   
                <Modal.Header>
                    <Modal.Title>Action Required</Modal.Title>
                </Modal.Header>
                <Modal.Body className="text-center">
                    <h5>To complete your registration, please change your password.</h5>
                    <div className=" d-flex flex-column">
                        <tr className='text-start mt-3 mx-md-2'>
                            <label htmlFor="newPwd" className="form-label">New password</label>
                            <Form.Control
                                type="password"
                                className="form-control border"
                                id="newPwd"
                                name="newPwd"
                                value={changePwd.newPwd}
                                onChange={handlePwdChange}
                            />
                            {formPwdChgError[0] != "" ? (
                                <div className="invalidInput mt-1" style={{ color: "red" }}>{formPwdChgError[0]}</div>
                            ) : (
                                <></>
                            )}
                        </tr>
                        <tr className='text-start mt-3 mx-md-2'>
                            <label htmlFor="confirmNewPwd" className="form-label">Confirm new password</label>
                            <Form.Control
                                type="password"
                                className="form-control border"
                                id="confirmNewPwd"
                                name="confirmNewPwd"
                                value={changePwd.confirmNewPwd}
                                onChange={handlePwdChange}
                            />
                            {formPwdChgError[1] != "" ? (
                                <div className="invalidInput mt-1" style={{ color: "red" }}>{formPwdChgError[1]}</div>
                            ) : (
                                <></>
                            )}
                        </tr>
                    </div>
                    <button className='mt-3 mb-3' type='submit' onClick={handlePwdChgSubmit}>Finish Registration</button>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default Login;