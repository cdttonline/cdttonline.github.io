import { useEffect, useState } from "react";
import fcts from "../Api";
import { useLoaderData, useNavigate } from "react-router-dom";
import { Button, Container, Form, Modal, Table } from "react-bootstrap";
import { addDoc, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, usersCollection } from "../Firebase";
import ValidateFn from "../components/ValidationFn";

export const loadUsers = async() => {
    const results = await fcts.loadUsers();
    return results;
}

const Users = () => {
    const navigate = useNavigate();
    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const tmpData = useLoaderData();
    const dataId = tmpData.id;
    const data = tmpData.data;

    useEffect(() => {
        console.log(tmpData) 
        console.log(dataId)  
        
        // Get document that is ours, so we can't delete our own. 
        const userId = localStorage.getItem('userId');
        getCurrentUserData(userId);

    }, []);
    const [currentUserId, setCurrentUserId] = useState("");
    const getCurrentUserData = async(userId) => {
        const docSnap = await getDoc(doc(db, "Users", userId))
        if (!docSnap.exists()) {
            // User does not exists. Log out. 
            localStorage.setItem('isLoggedIn', 'false');
            navigate("/")
        } else{
            setCurrentUserId(userId);
        }
    }

    const [showModal, setShowModal] = useState(false);
    const [disableUserInfo, setDisableUserInfo] = useState(true);
    const [showRmModal, setshowRmModal] = useState(false);
    const [rmAccessPers, setRmAccessPers] = useState([]);
    const [rmAccessPersId, setRmAccessPersId] = useState("");

    const removeUserData = (e, key) => {
        setshowRmModal(true);
        setRmAccessPers(e);
        setRmAccessPersId(dataId[key])
    }

    const setHideModalAskViewResults = () => { setshowRmModal(false); }

    // Sorting function based on column
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
        }

        setSortConfig({ key, direction });
    };

    const sortedData = [...data].sort((a, b) => {
        let aValue, bValue;
        // Check the key and extract the nested 'answer' property
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
            
        return 0;
    })

    const removeUserFromDb = async () => {
        await deleteDoc(doc(db, "Users", rmAccessPersId));
        setHideModalAskViewResults();
        goBackToPage();
        navigate("/usersData");
    }

    const [addNewUser, setAddUser] = useState({
        firstName: '',
        lastName: '',
        email: '',        
        type: 'Admin',
        password: '',
        addedBy: '',
        dateAdded: '',
        finishedRegistering: false
    });

    const [addingUser, setAddingUser] = useState(false);

    const addUser = () => { setAddingUser(true); }

    const handleAddNewUserChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        setAddUser({...addNewUser, [name]:value});
    }
    
    const addNewUserToDB = () => {
        console.log("add new user: ", addNewUser);
        // Add the current date for the current of the user
        const validationResult = ValidateFn.validateAddingUser(addNewUser);
        setFormDataError(validationResult);

        // flag used to track whether we submit to backend or we wait for user to fix its errors
        let flag = false;

        for (let i = 0; i < validationResult.length; i++) {
            if (validationResult[i] != "") {
                flag = true;
            }
        }

        if (flag == false) {
            goBackToPage();
            addNewDocument();
            navigate("/usersData")
        }
    }

    const [formDataError, setFormDataError] = useState([]);

    const goBackToPage = () => {
        // Reset the values 
        setAddUser({
            firstName: '',
            lastName: '',
            email: '',            
            type: 'Admin',
            password: '',
            addedBy: '',
            dateAdded: '',
            finishedRegistering: false
        });

        setAddingUser(false);
        setFormDataError([])
    }

    const addNewDocument = () => {
        const firstName = localStorage.getItem('firstName');
        const lastName = localStorage.getItem('lastName');
        const addedBy = firstName + " " + lastName;
        addDoc(usersCollection, {
            addedBy: addedBy,
            dateAdded: new Date().toString(),
            email: addNewUser.email,
            finishedRegistering: false,
            firstName: addNewUser.firstName,
            lastName: addNewUser.lastName,
            password: addNewUser.password,
            type: addNewUser.type
        });
    }

    return (
        <>
            <Container className="containerUser">
                <h1 className="mt-3">Users with access</h1>
                <Button className="dataMenuBtn" onClick={addUser} hidden={addingUser}>+ Add User</Button>
                {addingUser ?
                <form className="align-middle mx-5 my-2 mb-5 border p-2">
                    <h4>Adding a new user</h4>
                    <div className="d-grid gap-2 d-sm-flex m-3">
                        <div className="text-start w-100">
                            <label htmlFor="firstName" className="form-label">
                                Name
                            </label>
                            <Form.Control
                                
                                type="text"
                                className="form-control border"
                                id="firstName"
                                name="firstName"
                                value={addNewUser.firstName}
                                onChange={handleAddNewUserChange}
                            />
                            {formDataError[0] != "" ? (
                                <div className="invalidInput" style={{ color: "red" }}>{formDataError[0]}</div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="text-start w-100">
                            <label htmlFor="lastName" className="form-label">
                                Last Name
                            </label>
                            <Form.Control
                                type="text"
                                className="form-control border"
                                id="lastName"
                                name="lastName"
                                value={addNewUser.lastName}
                                onChange={handleAddNewUserChange}
                            />
                            {formDataError[1] != "" ? (
                                <div className="invalidInput" style={{ color: "red" }}>{formDataError[1]}</div>
                            ) : (
                                <></>
                            )}
                        </div>
                    </div>
                    <div className="d-grid gap-2 d-md-flex m-3">
                        <div className="text-start col-md-10">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <Form.Control
                                type="email"
                                className="form-control border"
                                id="email"
                                name="email"
                                value={addNewUser.email}
                                onChange={handleAddNewUserChange}
                            />
                            {formDataError[2] != "" ? (
                                <div className="invalidInput" style={{ color: "red" }}>{formDataError[2]}</div>
                            ) : (
                                <></>
                            )}
                        </div>
                        <div className="text-start">
                            <label htmlFor="roleEmploye" className="form-label">
                                Type
                            </label>
                            <br />
                            
                            <Form.Select 
                                id="type"
                                name="type"
                                value={addNewUser.type}
                                onChange={handleAddNewUserChange}
                            >
                                <option value="Admin">Admin</option>
                                <option value="User">User</option>
                                <option value="CO-OP">CO-OP</option>
                            </Form.Select>
                        </div>
                    </div>
                    <div className="d-grid gap-2 d-md-flex m-3 align-items-end">
                        
                        <div className="text-start col-md-5">
                            <label htmlFor="password" className="form-label">
                                Temporary Password
                            </label>
                            <Form.Control
                                type="password"
                                className="form-control border"
                                id="password"
                                name="password"
                                value={addNewUser.password}
                                onChange={handleAddNewUserChange}
                            />
                            
                            
                        </div>
                    </div>
                    <div>
                    <Button variant="secondary" className="border-0" onClick={goBackToPage}>Cancel</Button>
                    <Button className="btnViewResults" onClick={addNewUserToDB}>Add new User</Button>

                    </div>
                </form>
                : <></>}
                <Table className="table mx-auto table-bordered my-2 w-auto mb-5" responsive>
                    <thead>
                        <tr className="text-center">
                            {/* <th className="col">#</th>
                            <th colSpan={3} onClick={() => sortData('id')} style={{ cursor: 'pointer' }}>
                                # {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th> */}
                            <th colSpan={2} onClick={() => sortData('email')} style={{ cursor: 'pointer' }}>
                                Email {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('firstName')} style={{ cursor: 'pointer' }}>
                            Name {sortConfig.key === 'firstName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('lastName')} style={{ cursor: 'pointer' }}>
                            Last Name {sortConfig.key === 'lastName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('type')} style={{ cursor: 'pointer' }}>
                            Type {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('dateAdded')} style={{ cursor: 'pointer' }}>
                            Date Added {sortConfig.key === 'dateAdded' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('addedBy')} style={{ cursor: 'pointer' }}>
                            Added By {sortConfig.key === 'addedBy' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('finishedRegistering')} style={{ cursor: 'pointer' }}>
                            Finished Registering {sortConfig.key === 'finishedRegistering' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> 
                        {sortedData.map((data, key) => {     
                            return (
                                <tr key={key}>
                                    {disableUserInfo ?
                                    <>
                                        <td colSpan={2}>{data.email}</td>
                                        <td>{data.firstName}</td>
                                        <td>{data.lastName}</td>
                                        <td>{data.type}</td>
                                        <td>{data.dateAdded}</td>
                                        <td>{data.addedBy}</td>
                                        <td>{(data.finishedRegistering) ? "True" : "False"}</td>
                                        <td>
                                            <Button className="dataMenuBtn" onClick={() => removeUserData(data, key)} hidden={currentUserId==dataId[key]}>Delete</Button>
                                        </td>
                                    </>
                                 :
                                    <>
                                        <td colSpan={2}>{data.email}</td>
                                        <td>{data.firstName}</td>
                                        <td>{data.lastName}</td>
                                        <td><input type="text" disabled value={data.type} /></td>
                                        <td>{data.dateAdded}</td>
                                        <td>{data.addedBy}</td>
                                        <td>{(data.finishedRegistering) ? "True" : "False"}</td>
                                    </>
                                }
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
                
            </Container>
            
            <Modal 
                id="modalAskViewResults" 
                className="modal AskViewResults" 
                show={showRmModal} 
                onHide={setHideModalAskViewResults}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>Removing Access</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Are you sure you want to remove access to {rmAccessPers.firstName} {rmAccessPers.lastName}?</p>
                    <p>This action cannot be undone.</p>
                </Modal.Body>
                <Modal.Footer>
                    {/* <!-- Do not view Results button --> */}
                    <Button type="button" className="btnNotViewResults" id="btnNotViewResults" onClick={setHideModalAskViewResults}>Cancel</Button>                    
                                                
                    {/* <!-- View Results button --> */}
                    <Button type="button" className="btnViewResults" id="btnViewResults" onClick={removeUserFromDb}>Delete</Button>            
                </Modal.Footer>
            </Modal>
        </>
    )
}

export default Users;