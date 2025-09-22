import {Button, Form, Modal} from "react-bootstrap";
import React, {useEffect, useState} from "react";
import ValidateFn from "./ValidationFn";
import {doPasswordChange} from "../firebase/auth";
import {doc, setDoc} from "firebase/firestore";
import {usersCollection} from "../firebase/Firebase";
import {useNavigate} from "react-router-dom";

function ModalRegistering() {

    const navigate = useNavigate();

    const [formPwdChgError, setFormPwdChgError] = useState('');
    const loggedInUserId = localStorage.getItem('userId');

    const [changePwd, setChangePwd] = useState({
        oldPwd: '',
        newPwd: '',
        confirmNewPwd: ""
    });

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
            if (validatePwdChg[i] !== "") {
                flag = true;
            }
        }

        if (!flag) {

            // Make sure to change the password for the authentication
            await doPasswordChange(changePwd.newPwd).then((r) => {
                // Finished registering
                const docRef = doc(usersCollection, loggedInUserId);
                setDoc(docRef, {'finishedRegistering': true}, {merge: true});
                // Close modal
                localStorage.setItem('isUserNotDoneRegistering', 'false')
                // Navigate back to the main page
                navigate("/");
            }).catch((e) => {
                console.error("There was an error. Cannot complete password change", e);
            })

        }
    }

    const handleModalClose = () => {
        localStorage.setItem('isUserNotDoneRegistering', 'false')
    };

    return (
        <>
            <Modal
                show={localStorage.getItem('isUserNotDoneRegistering') === 'true'}
                size="lg"
                onHide={handleModalClose}
                backdrop="static"
                keyboard={false}
                scrollable
            >
                <Modal.Body className="">
                    <h3 className='mt-3 fw-bold text-center' id="usersDataContainer">Action Required</h3>
                    <h6 className="mt-3 mx-md-2">To complete your registration, please change your
                        password.</h6>
                    <h6 className="mt-3 mx-md-2 mb-0 fw-normal">The new password must respects the following
                        requirements:</h6>
                    <ul className="mx-md-2 mt-1 text-start">
                        <li className="">Must be more than 6 characters</li>
                        <li>Must have at least 1 digit</li>
                        <li>Must have at least 1 lowercase letter</li>
                        <li>Must contain at least one of following special character: !@#$%^&*
                        </li>
                    </ul>
                    <div className=" d-flex flex-column">
                        <tr className='text-start mt-2 mx-md-2'>
                            <label htmlFor="newPwd" className="form-label text-start fw-medium">New password</label>
                            <Form.Control
                                type="password"
                                className="form-control border"
                                id="newPwd"
                                name="newPwd"
                                value={changePwd.newPwd}
                                onChange={handlePwdChange}
                            />
                            {formPwdChgError[0] !== "" ? (
                                <div className="invalidInput mt-1" style={{color: "red"}}>{formPwdChgError[0]}</div>
                            ) : (
                                <></>
                            )}
                        </tr>
                        <tr className='text-start mt-3 mx-md-2'>
                            <label htmlFor="confirmNewPwd" className="form-label text-start fw-medium">Confirm new
                                password</label>
                            <Form.Control
                                type="password"
                                className="form-control border"
                                id="confirmNewPwd"
                                name="confirmNewPwd"
                                value={changePwd.confirmNewPwd}
                                onChange={handlePwdChange}
                            />
                            {formPwdChgError[1] !== "" ? (
                                <div className="invalidInput mt-1" style={{color: "red"}}>{formPwdChgError[1]}</div>
                            ) : (
                                <></>
                            )}
                        </tr>
                        <tr className='text-start mt-4 mx-md-2'>
                            <Button className='m-0 mt-0 dataMenuBtn w-100' type="submit"
                                    onClick={handlePwdChgSubmit}>Finish Registration</Button>
                        </tr>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}

export default ModalRegistering;