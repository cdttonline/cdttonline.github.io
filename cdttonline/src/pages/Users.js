import {useEffect, useMemo, useState} from "react";
import fcts from "../Api";
import { useLoaderData, useNavigate } from "react-router-dom";
import {AlertHeading, Badge, Button, Container, Form, Modal, Table} from "react-bootstrap";
import { addDoc, deleteDoc, doc, getDoc, getDocs, query, where } from "firebase/firestore";
import { db, usersCollection } from "../firebase/Firebase";
import ValidateFn from "../components/ValidationFn";
import {doCreateUserWithEmailAndPassword, getListOfUsers} from "../firebase/auth";
import {SelectBooleanFilter, SelectColumnFilter} from "../components/Filter";
import TableContainer from "../components/TableContainer";
import Alert from 'react-bootstrap/Alert';

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
        getTest();
        // const fetchUsers = async () => {
        //     try {
        //         const response = await fetch(
        //             "https://localhost:3000/users"
        //         );
        //         if (!response.ok) {
        //             throw new Error("Failed to fetch users");
        //         }
        //         const data = await response.json();
        //         console.log("TESTTTTTTT,", data);
        //         // setUsers(data);
        //     } catch (err) {
        //         console.log("FUCKUNG ERRORRRR,", err);
        //
        //         // setError(err.message);
        //     }
        // };

        // fetchUsers();
        // Get document that is ours, so we can't delete our own. 
        const userId = localStorage.getItem('userId');
        getCurrentUserData(userId);

    }, []);

    const getTest = async () => {
        await getListOfUsers().then((e) => {
            e.users.forEach((userRecord) => {
                console.log('user ##:', userRecord);
            })
        }).catch(e => {console.log("ERIR, ", e)})
    }
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
        // Remove user authentication/credentials from database


        // Remove user data from database
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

    const columns = useMemo(
        () => [
            {
                Header: 'Email',
                accessor: 'email',
                Cell: ({cell}) => {
                    const {value} = cell;
                    const dateAndTime = (value) => {
                        const date = value.split('|');
                        return date[0];
                    };
                    return (
                        <div>{dateAndTime(value)}</div>
                    );
                }
            }, {
                Header: 'Name',
                accessor: 'firstName',


            }, {
                Header: 'Last Name',
                accessor: 'lastName',


            }, {
                Header: 'Type',
                accessor: 'type',
                Filter: SelectColumnFilter,
                filter: 'equals'
            },
            {
                Header: 'Date Added',
                accessor: 'dateAdded',
                Cell: ({cell}) => {
                    const {value} = cell;
                    return (
                        <div>{new Date(value).toLocaleString()}</div>
                    )
                }
            },
            {
                Header: 'Added By',
                accessor: 'addedBy',
            },
            {
                Header: 'Finished Registering',
                accessor: 'finishedRegistering',
                Cell: ({cell}) => {
                    const {value} = cell;
                    return (
                        <div className={"text-center"}>{value === true ? <Badge bg="success" key={'true'} value={'true'}>true</Badge> : <Badge bg="danger" key={'false'}>false</Badge>}</div>
                    )
                },
            },
            // {
            //     Header: 'Action',
            //     accessor: '',
            //     disableSortBy: true,
            //     disableFilters: true,
            //     Cell: ({cell}) => {
            //         // const {value} = cell;
            //         return (
            //             <div className="text-center">
            //                 <Button className={"dataMenuBtn text-center px-2 py-1 "} style={{fontSize: '14px'}} onClick={() => {console.log("MODIFY",cell)}}>Modify</Button>
            //
            //             </div>
            //         )
            //     },
            // },


        ],
        []
    )

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
            if (validationResult[i] !== "") {
                flag = true;
            }
        }
        console.log("pkk")
        if (!flag) {
            console.log("flag===false")

            addNewDocument();
            goBackToPage();

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

    // Alerts configurations
    const [showAlert, setShowAlert] = useState(false);
    const [alertType, setAlertType] = useState('');
    const [alertMsg, setAlertMsg] = useState('');

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
            // password: addNewUser.password,
            type: addNewUser.type
        }).then(data => {
            // Add new user to database, using authentication
            doCreateUserWithEmailAndPassword(addNewUser.email, addNewUser.password, addNewUser.firstName, addNewUser.lastName).then(r => {
                console.log("TEST NEW USER ADDED: ", r)
                setShowAlert(true);
                setAlertType('success');
                setAlertMsg('User was successfully added to the database')
            }).catch((e) => {
                console.error(e);
                setShowAlert(true);
                setAlertType('danger');
                setAlertMsg('Error when trying to add user to the database')
            })
        });
    }

    const goToAuthenticatorInDB = () => {
        // Check if this is secure --> Can only be accessed by people who are registered in the firebase !!!!
        window.open("https://console.firebase.google.com/project/cdtt-dc538/authentication/users", "_blank");
    }

    return (
        <>
            {/*{!showAlert ?*/}
            {/*    <Alert variant={'success'}  onClose={() => setShowAlert(false)} dismissible >*/}
            {/*        Oh snap! You got an error!*/}
            {/*    </Alert> : <></>}*/}
            <Container className="containerUser">
                <h3 className="mt-3 fw-bold" id="usersDataContainer">Users with Access</h3>

                {/*<h1 className="mt-3">Users with Access</h1>*/}
                {addingUser ?
                    <form className="align-middle mx-5 my-2 mb-5 border p-2">
                        <h5 className="mt-3 fw-bold text-center" id="usersDataContainer">Adding a new user</h5>
                        <div className="d-grid gap-2 d-sm-flex m-3">
                            <div className="text-start w-100">
                                <label htmlFor="firstName" className="form-label fw-medium">
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
                                {formDataError[0] !== "" ? (
                                    <div className="invalidInput ps-1" style={{color: "red"}}>{formDataError[0]}</div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="text-start w-100">
                                <label htmlFor="lastName" className="form-label fw-medium">
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
                                {formDataError[1] !== "" ? (
                                    <div className="invalidInput ps-1" style={{color: "red"}}>{formDataError[1]}</div>
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div className="d-grid gap-2 d-md-flex m-3">
                            <div className="text-start col-md-10">
                                <label htmlFor="email" className="form-label fw-medium">
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
                                {formDataError[2] !== "" ? (
                                    <div className="invalidInput ps-1" style={{color: "red"}}>{formDataError[2]}</div>
                                ) : (
                                    <></>
                                )}
                            </div>
                            <div className="text-start">
                                <label htmlFor="roleEmploye" className="form-label fw-medium">
                                    Type
                                </label>
                                <br/>

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

                            <div className="text-start">
                                <label htmlFor="password" className="form-label fw-medium">
                                    Temporary Password
                                </label>
                                <Form.Control
                                    type="password"
                                    className="form-control border w-auto"
                                    id="password"
                                    name="password"
                                    value={addNewUser.password}
                                    // style={{width: '300px'}}
                                    onChange={handleAddNewUserChange}
                                />
                                {formDataError[3] !== "" ? (
                                    <div className="invalidInput ps-1" style={{color: "red"}}>{formDataError[3]}</div>
                                ) : (
                                    <></>
                                )}
                            </div>

                        </div>
                        <Button variant="secondary" className="border-0" onClick={goBackToPage}>Cancel</Button>
                        <Button className="dataMenuBtn" onClick={addNewUserToDB}>Add new User</Button>
                    </form>
                    : <></>}
                <div id="usersDataContainer">
                    <TableContainer columns={columns} data={data}/>
                    <div className="text-start">
                        <Button className="dataMenuBtn ms-0 mt-2" onClick={addUser} hidden={addingUser}>+ Add User</Button>
                        <Button className="mt-2" variant={"danger"} onClick={goToAuthenticatorInDB}>Remove Access to a User</Button>

                    </div>
                </div>

                {/*<Table className="table mx-auto table-bordered my-2 w-auto mb-1" responsive>*/}
                {/*    <thead>*/}
                {/*    <tr className="text-center">*/}
                {/*        /!* <th className="col">#</th>*/}
                {/*            <th colSpan={3} onClick={() => sortData('id')} style={{ cursor: 'pointer' }}>*/}
                {/*                # {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}*/}
                {/*            </th> *!/*/}
                {/*        <th colSpan={2} onClick={() => sortData('email')} style={{cursor: 'pointer'}}>*/}
                {/*            Email {sortConfig.key === 'email' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}*/}
                {/*        </th>*/}
                {/*https://icra-audiology.org/Resources/multilingual-speech-materials*/}

                {/*        <th onClick={() => sortData('firstName')} style={{cursor: 'pointer'}}>*/}
                {/*            Name {sortConfig.key === 'firstName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}*/}
                {/*        </th>*/}

                {/*        <th onClick={() => sortData('lastName')} style={{cursor: 'pointer'}}>*/}
                {/*            Last*/}
                {/*            Name {sortConfig.key === 'lastName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}*/}
                {/*        </th>*/}

                {/*        <th onClick={() => sortData('type')} style={{cursor: 'pointer'}}>*/}
                {/*            Type {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}*/}
                {/*        </th>*/}

                {/*        <th onClick={() => sortData('dateAdded')} style={{cursor: 'pointer'}}>*/}
                {/*            Date*/}
                {/*            Added {sortConfig.key === 'dateAdded' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}*/}
                {/*        </th>*/}

                {/*        <th onClick={() => sortData('addedBy')} style={{cursor: 'pointer'}}>*/}
                {/*            Added*/}
                {/*            By {sortConfig.key === 'addedBy' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}*/}
                {/*        </th>*/}

                {/*        <th onClick={() => sortData('finishedRegistering')} style={{cursor: 'pointer'}}>*/}
                {/*            Finished*/}
                {/*            Registering {sortConfig.key === 'finishedRegistering' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}*/}
                {/*        </th>*/}
                {/*        /!*<th></th>*!/*/}
                {/*    </tr>*/}
                {/*    </thead>*/}
                {/*    <tbody>*/}
                {/*    {sortedData.map((data, key) => {*/}
                {/*        return (*/}
                {/*            <tr key={key}>*/}
                {/*                {disableUserInfo ?*/}
                {/*                    <>*/}
                {/*                        <td colSpan={2}>{data.email}</td>*/}
                {/*                        <td>{data.firstName}</td>*/}
                {/*                        <td>{data.lastName}</td>*/}
                {/*                        <td>{data.type}</td>*/}
                {/*                        <td>{new Date(data.dateAdded).toLocaleString()}</td>*/}
                {/*                        <td>{data.addedBy}</td>*/}
                {/*                        <td className="text-center">{(data.finishedRegistering) ? <Badge bg="success">True</Badge> : <Badge bg="danger">False</Badge>}</td>*/}
                {/*                        /!*<td>*!/*/}
                {/*                        /!*    <Button className="dataMenuBtn" onClick={() => removeUserData(data, key)} hidden={currentUserId===dataId[key]}>Delete</Button>*!/*/}
                {/*                        /!*</td>*!/*/}
                {/*                    </>*/}
                {/*                    :*/}
                {/*                    <>*/}
                {/*                        <td colSpan={2}>{data.email}</td>*/}
                {/*                        <td>{data.firstName}</td>*/}
                {/*                        <td>{data.lastName}</td>*/}
                {/*                        <td><input type="text" disabled value={data.type}/></td>*/}
                {/*                        <td>{data.dateAdded}</td>*/}
                {/*                        <td>{data.addedBy}</td>*/}
                {/*                        <td>{(data.finishedRegistering) ? "True" : "False"}</td>*/}
                {/*                    </>*/}
                {/*                }*/}
                {/*            </tr>*/}
                {/*        )*/}
                {/*    })}*/}
                {/*    </tbody>*/}
                {/*    */}
                {/*</Table>*/}


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