import { useEffect, useState } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useLocation } from "react-router-dom";
import { db, resultsCollection, usersCollection } from "../Firebase";
import { doc, getDoc, getDocs, setDoc } from "firebase/firestore";



const UserProfile = ({ userId }) => {
    const state = useLocation();
    const loggedInUserId = localStorage.getItem('userId');
    // const [user, setUser] = useState({
    //     email: '',
    //     password: '',
    //     firstName: '',
    //     lastName: '',
    //     type: '',
    //     addedBy: '',
    //     dateAdded: '',
    //     finishedRegistering: ''
    // });
    const [user, setUser] = useState([])
    useEffect(() => {
        console.log("user ID is: " + loggedInUserId);
        getUserProfile();
        // Get the user profile from database

        console.log(state);
    }, [userId!=undefined]);

    const getUserProfile = async () => {
        const docRef = doc(usersCollection, loggedInUserId);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            setUser(docSnap.data());
        } else {
            console.log("No such document!");
        }
    }
    const [formDataError, setFormDataError] = useState([]);

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setUser({...user, [name]: value});
    }

    const [isPwdDisabled, setPwdDisabled] = useState(true);

    const modifyPassword = () => {
        setPwdDisabled(false);
    }

    const updatePassword = () => {
        setPwdDisabled(false);
        // Update password in database
    }

    const [pwd, setPwd] = useState('')
    const handlePwdChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setUser({...user, [name]: value});
    }
    const updatePwdDataBase = async () => {
//         const cityRef = doc(db, 'cities', 'BJ');
// setDoc(cityRef, { capital: true }, { merge: true });
        const docRef = doc(usersCollection, loggedInUserId);
        // const docSnap = await getDoc(docRef);
        setDoc(docRef, {'password': user.password}, {merge: true});
        setPwdDisabled(true)
        // if (docSnap.exists()) {
        //     console.log("Document data:", docSnap.data());
        //     setUser(docSnap.data());
        // } else {
        //     console.log("No such document!");
        // }

    }
    
    return (
        <>
            <Container>
            <h1>User Profile</h1>
            <form className="align-middle mx-5 my-2 mb-5 border p-2">
                <div className="d-grid gap-2 d-sm-flex m-3">
                    <div className="text-start w-100">
                        <label htmlFor="name" className="form-label">
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
                        <label htmlFor="nomFamille" className="form-label">
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
                <div className="d-grid gap-2 d-md-flex m-3">
                    <div className="text-start w-100">
                        <label htmlFor="email" className="form-label">
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
                <div className="d-grid gap-2 d-md-flex m-3 align-items-end">
                    <div className="text-start">
                        <label htmlFor="roleEmploye" className="form-label">
                            Type
                        </label>
                        <br />
                        
                        <Form.Select 
                            disabled
                            id="type"
                            name="type"
                            value={user.type}
                        >
                            <option value="admin">Admin</option>
                            <option value="user">User</option>
                            <option value="coop">CO-OP</option>
                        </Form.Select>
                    </div>
                    <div className="text-start">
                        <label htmlFor="password" className="form-label">
                            Password
                        </label>
                        <Form.Control
                            disabled={isPwdDisabled}
                            type="password"
                            className="form-control border"
                            id="password"
                            name="password"
                            value={user.password}
                            onChange={handlePwdChange}
                        />
                    </div>
                    <div>
                        {isPwdDisabled ?
                        <Button onClick={modifyPassword} className="mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                            </svg>
                        </Button> :
                        <Button onClick={updatePwdDataBase} className="mb-0">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-lg" viewBox="0 0 16 16">
                                <path d="M12.736 3.97a.733.733 0 0 1 1.047 0c.286.289.29.756.01 1.05L7.88 12.01a.733.733 0 0 1-1.065.02L3.217 8.384a.757.757 0 0 1 0-1.06.733.733 0 0 1 1.047 0l3.052 3.093 5.4-6.425z"/>
                            </svg>
                        </Button>
                        }
                    </div>
                </div>
                <div className="d-grid gap-2 d-sm-flex m-3">
                    <div className="text-start w-100">
                        <label htmlFor="name" className="form-label">
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
                    <div className="text-start w-100">
                        <label htmlFor="nomFamille" className="form-label">
                            Date Added
                        </label>
                        <Form.Control
                            disabled
                            type="text"
                            className="form-control border"
                            id="dateAdded"
                            name="dateAdded"
                            value={user.dateAdded}
                        />
                    </div>
                </div>
            </form>

            </Container>
        </>
    )
}

export default UserProfile;