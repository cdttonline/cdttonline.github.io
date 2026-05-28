import React, { useEffect, useState } from "react";
import {Button, Card, Container, Form} from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { usersCollection } from "../firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import "./UserProfile.css";
import ValidateFn from "../helpers/ValidationFn";
import {doPasswordChange} from "../firebase/auth";

const UserProfile = ({ userId }) => {
    const loggedInUserId = localStorage.getItem('userId');
    const [user, setUser] = useState([]);
    const [userPwdChange, setUserPwdChange] = useState({
        newPwd: '',
        confirmNewPwd: ''
    });
    const [formDataError, setFormDataError] = useState('');

    useEffect(() => {
        // Get the user profile from database
        getUserProfile();
    }, [userId!==undefined]);

    const getUserProfile = async () => {
        const docRef = doc(usersCollection, loggedInUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            setUser(docSnap.data());
        } else {
            console.log("No such document!");
        }
    }

    const cancelPwdChange = () => {
        setUserPwdChange({
            newPwd: '',
            confirmNewPwd: ''
        });
        setFormDataError(''); // reset the password errors
        setPwdDisabled(true);
    }

    const verifyPwdChange = async () => {
        // Add the current date for the current of the user
        const validationResult = ValidateFn.validatePwdChange(userPwdChange);
        setFormDataError(validationResult);

        // flag used to track whether we submit to backend or we wait for user to fix its errors
        let flag = false;

        for (let i = 0; i < validationResult.length; i++) {
            if (validationResult[i] !== "") {
                flag = true;
            }
        }

        if (flag === false) {
            await doPasswordChange(userPwdChange.newPwd).then((pwd) => {
                cancelPwdChange(); // reset the value of the password slots
            }).catch((e) => {
                console.error("Error. Password given cannot be used", e);
            })
        }
    }

    const [isPwdDisabled, setPwdDisabled] = useState(true);

    const modifyPassword = () => { setPwdDisabled(false); }

    const handlePwdChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        setUserPwdChange({...userPwdChange, [name]: value});
    }
    
    return (
        <>
            <Container>
                <div className="d-md-flex justify-content-center">
                    <div className="col-sm-12 col-md-auto">
                        <Card className="m-2">
                            <Card.Body>
                                <div className="text-start p-2">
                                    {/*<Image src="holder.js/171x180" roundedCircle/>*/}
                                    <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50"
                                         fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                                        <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                                        <path fill-rule="evenodd"
                                              d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                                    </svg>
                                    <h4 className=" mb-1 mt-3">{user.firstName} {user.lastName}</h4>
                                    <p className="text-muted fw-lighter mb-1">{user.type}</p>
                                    <p className="mb-1">{user.email}</p>
                                    <p className="mb-1"><i>{new Date(user.dateAdded).toLocaleString()}</i></p>
                                    {isPwdDisabled ?
                                        // <Button className={"dataMenuBtn text-center px-2 py-1 "} style={{fontSize: '14px'}}
                                        <Button onClick={modifyPassword} className="dataMenuBtn mb-0 ms-0">Edit
                                            <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                                 fill="currentColor" className="ms-2 bi bi-pencil-fill"
                                                 viewBox="0 0 18 18">
                                                <path
                                                    d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                            </svg>
                                        </Button> :
                                        <div className="d-flex">
                                            <Button onClick={verifyPwdChange} className="dataMenuBtn mb-0 ms-0">Save
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="ms-2 bi bi-check-circle"
                                                     viewBox="0 0 18 18">
                                                    <path
                                                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                    <path
                                                        d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                                                </svg>
                                            </Button>
                                            <Button onClick={cancelPwdChange} className="mb-0 ms-0" variant={"secondary"}>Cancel
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                     fill="currentColor" className="ms-2 bi bi-x-circle"
                                                     viewBox="0 0 18 18">
                                                <path
                                                        d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                    <path
                                                        d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                                </svg>
                                            </Button>
                                        </div>
                                    }
                                </div>
                            </Card.Body>
                        </Card>
                    </div>


                    {/* User Profile & Password Card */}
                    <div className="d-flex flex-column col-md-10 col-lg-8 col-sm-12">
                        <form>
                            <Card className="m-2 mb-3">
                                <Card.Body>
                                    <div className="align-middle my-2 mb-2 p-2">
                                        <h3 className="mb-4">User Profile</h3>
                                        <div className="d-grid gap-2 d-sm-flex m-3">
                                            <div className="text-start w-100">
                                                <label htmlFor="name" className="form-label fw-medium">
                                                    Name
                                                </label>
                                                <Form.Control
                                                    disabled
                                                    type="text"
                                                    className="form-control border"
                                                    id="firstName"
                                                    name="firstName"
                                                    value={user.firstName}
                                                />
                                            </div>
                                            <div className="text-start w-100">
                                                <label htmlFor="nomFamille" className="form-label fw-medium">
                                                    Last Name
                                                </label>
                                                <Form.Control
                                                    disabled
                                                    type="text"
                                                    className="form-control border"
                                                    id="lastName"
                                                    name="lastName"
                                                    value={user.lastName}
                                                />
                                            </div>
                                        </div>
                                        <div className="d-grid gap-2 d-md-flex m-3 mb-4">
                                            <div className="text-start w-100">
                                                <label htmlFor="email" className="form-label fw-medium">
                                                    Email
                                                </label>
                                                <Form.Control
                                                    disabled
                                                    type="email"
                                                    className="form-control border"
                                                    id="email"
                                                    name="email"
                                                    value={user.email}
                                                />
                                            </div>
                                        </div>

                                        {/* Section separator */}
                                        <hr/>

                                        {/* Unchangeable elements in the user profile */}
                                        <div className="d-grid gap-2 d-sm-flex m-3">
                                            <div className="text-start col-5">
                                                <label htmlFor="dateCreated" className="form-label fw-medium">
                                                    Date Created
                                                </label>
                                                <Form.Control
                                                    disabled
                                                    type="text"
                                                    className="form-control border"
                                                    id="dateCreated"
                                                    name="dateCreated"
                                                    value={new Date(user.dateAdded).toLocaleString()}
                                                />
                                            </div>

                                            <div className="text-start col-4">
                                                <label htmlFor="name" className="form-label fw-medium">
                                                    Added By
                                                </label>
                                                <Form.Control
                                                    disabled
                                                    type="text"
                                                    className="form-control border"
                                                    id="addedBy"
                                                    name="addedBy"
                                                    value={user.addedBy}
                                                />
                                            </div>
                                            <div className="text-start col-2">
                                                <label htmlFor="roleEmploye" className="form-label fw-medium">
                                                    Type
                                                </label>
                                                {/*<br/>*/}
                                                <Form.Control
                                                    disabled
                                                    type="text"
                                                    className="form-control border"
                                                    id="roleEmploye"
                                                    name="roleEmploye"
                                                    value={user.type}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </Card.Body>
                            </Card>

                            {!isPwdDisabled ?
                                <Card className="m-2 mt-3">
                                    <Card.Body>
                                        <div className="align-middle my-2 mb-2 p-2">

                                            <h3 className="mb-4">Password</h3>
                                            <div className="d-grid gap-2 d-md-flex m-3 mt-0 align-items-end">
                                                <div className="text-start w-100">
                                                    <label htmlFor="newPwd" className="form-label fw-medium">
                                                    New Password
                                                </label>
                                                <Form.Control
                                                    disabled={isPwdDisabled}
                                                    type="password"
                                                    className="form-control border"
                                                    id="newPwd"
                                                    name="newPwd"
                                                    value={userPwdChange.newPwd}
                                                    onChange={handlePwdChange}
                                                />
                                                {formDataError[0] !== "" ? (
                                                    <div className="invalidInput mt-1" style={{ color: "red" }}>{formDataError[0]}</div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                        <div className="d-grid gap-2 d-md-flex m-3 mt-0 align-items-end">

                                            <div className="text-start w-100">
                                                <label htmlFor="confirmNewPwd" className="form-label fw-medium">
                                                    Confirm New Password
                                                </label>
                                                <Form.Control
                                                    disabled={isPwdDisabled}
                                                    type="password"
                                                    className="form-control border"
                                                    id="confirmNewPwd"
                                                    name="confirmNewPwd"
                                                    value={userPwdChange.confirmNewPwd}
                                                    onChange={handlePwdChange}
                                                />
                                                {formDataError[1] !== "" ? (
                                                    <div className="invalidInput mt-1" style={{ color: "red" }}>{formDataError[1]}</div>
                                                ) : (
                                                    <></>
                                                )}
                                            </div>
                                        </div>
                                        </div>
                                </Card.Body>
                            </Card>
                                : <div></div>
                            }
                        </form>
                    </div>
                </div>
            </Container>
        </>
    )
}

export default UserProfile;