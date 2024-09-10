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
        // const q = query(usersCollection, 
        //     where("firstName", "==", firstName),
        //     where("lastName", "==", lastName));
    
        // const querySnapshot = await getDocs(q);
        // const info = querySnapshot.docs.find((val, idx) => idx === 0);
        if (!docSnap.exists()) {
            // User does not exists. Log out. 
            console.log("DOESNT EXIST")
            localStorage.setItem('isLoggedIn', 'false');
            navigate("/")
        } else{
            setCurrentUserId(userId);

        }
    }

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const [modalInfo, setModalInfo] = useState('');
    const [modalId, setModalId] = useState('');
    const openModalData = (e, key) => {
        setModalInfo(e);
        handleShowModal()
        console.log("data id: ",dataId);
        setModalId(dataId[key]);
        console.log("is: ", dataId[key])
    }

    const [disableUserInfo, setDisableUserInfo] = useState(true);
    const modifyUserData = (e, key) => {
        setDisableUserInfo(false);
    }

    const [showRmModal, setshowRmModal] = useState(false);
    const [rmAccessPers, setRmAccessPers] = useState([]);
    const [rmAccessPersId, setRmAccessPersId] = useState("");
    const removeUserData = (e, key) => {
        setshowRmModal(true);
        setRmAccessPers(e);
        setRmAccessPersId(dataId[key])
        

        // goBackToPage()

    }

    // const removeDoc()

    const setHideModalAskViewResults = () => {
        setshowRmModal(false);
    }
    // const saveUserData = (e, key) => {
    //     set
    // }

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
        // console.log()
        // Check if the key is 'column3' and extract the nested 'answer' property
        
        aValue = a[sortConfig.key];
        bValue = b[sortConfig.key];
        // if (sortConfig.key) {

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
              }
              if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
              }
            // if (a[sortConfig.key] < b[sortConfig.key]) {
            //     return sortConfig.direction === 'ascending' ? -1 : 1;
            // }
            // if (a[sortConfig.key] > b[sortConfig.key]) {
            //     return sortConfig.direction === 'ascending' ? 1 : -1;
            // }
        // }
        return 0;
    })

    // Sort data based on the current sort configuration

    const removeUserFromDb = async () => {

        console.log("removing this user from db: ", rmAccessPers)
        console.log("data id: " + rmAccessPersId)

        await deleteDoc(doc(db, "Users", rmAccessPersId));
        setHideModalAskViewResults();
        goBackToPage();
        // localStorage.setItem('isLoggedIn', 'false');

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
    const addUser = () => {
        // Add user to database
        setAddingUser(true);
    }

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
                <h1>Users that have access to database</h1>
                {/* <div style={{textAlign: "left"}}> */}
                    <Button className="dataMenuBtn" onClick={addUser} hidden={addingUser}>+ Add User</Button>
                {/* </div> */}
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
                        {/* <div className="text-start">
                            {formDataError[3] != "" ? (
                                <div className="invalidInput" style={{ color: "red" }}>
                                    {formDataError[3]}
                                    </div>
                            ) : (
                                <></>
                            )}
                        </div> */}
                    </div>
                    <div>
                    <Button variant="secondary" className="border-0" onClick={goBackToPage}>Cancel</Button>
                    <Button className="btnViewResults" onClick={addNewUserToDB}>Add new User</Button>

                    </div>
                    {/* <div className="d-grid gap-2 d-sm-flex m-3">
                        <div className="text-start w-100">
                            <label htmlFor="name" className="form-label">
                                Added By
                            </label>
                            <Form.Control
                                type="text"
                                className="form-control border"
                                id="addedBy"
                                name="addedBy"
                                value={addNewUser.addedBy}
                                onChange={handleAddNewUserChange}
                            />
                        </div>
                        <div className="text-start w-100">
                            <label htmlFor="nomFamille" className="form-label">
                                Date Added
                            </label>
                            <Form.Control
                                type="text"
                                className="form-control border"
                                id="dateAdded"
                                name="dateAdded"
                                value={addNewUser.dateAdded}
                                onChange={handleAddNewUserChange}
                            />
                        </div>
                    </div> */}
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
                            {/* <th colSpan={3}>Date & Time Completed</th> */}
                            {/* <th>Language</th> */}
                            <th onClick={() => sortData('firstName')} style={{ cursor: 'pointer' }}>
                            Name {sortConfig.key === 'firstName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            {/* <th>Talker</th> */}
                            <th onClick={() => sortData('lastName')} style={{ cursor: 'pointer' }}>
                            Last Name {sortConfig.key === 'lastName' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            {/* <th>List #</th> */}
                            <th onClick={() => sortData('type')} style={{ cursor: 'pointer' }}>
                            Type {sortConfig.key === 'type' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('dateAdded')} style={{ cursor: 'pointer' }}>
                            Date Added {sortConfig.key === 'dateAdded' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            {/* <th>Masker</th> */}
                            <th onClick={() => sortData('addedBy')} style={{ cursor: 'pointer' }}>
                            Added By {sortConfig.key === 'addedBy' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            {/* <th>Mode</th> */}

                            {/* <th>Starting SNR</th> */}
                            <th onClick={() => sortData('finishedRegistering')} style={{ cursor: 'pointer' }}>
                            Finished Registering {sortConfig.key === 'finishedRegistering' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> 
                            {/* {data.map((data, key) => { */}
                            {sortedData.map((data, key) => {
                                
                            return (
                                
                                <tr key={key}>
                                    {/* <td>{key + 1}</td> */}
                                    {disableUserInfo ?
                                    
                                // return (
                                    <>
                                    <td colSpan={2}>{data.email}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td>{data.type}</td>
                                    <td>{data.dateAdded}</td>
                                    <td>{data.addedBy}</td>
                                    <td>{(data.finishedRegistering) ? "True" : "False"}</td>
                                    <td>
                                        {/* <Button className="dataMenuBtn" onClick={() => modifyUserData(data, key)}>Modify
                                        </Button> */}
                                        <Button className="dataMenuBtn" onClick={() => removeUserData(data, key)} hidden={currentUserId==dataId[key]}>Delete
                                        {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-trash" viewBox="0 0 16 16">
                                            <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                                            <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                                        </svg> */}
                                        </Button>
                                    </td>
                                    </>
                                // )
                                 :
                                
                                    <>
                                    {/* <td><input type="text" disabled value={data.email}/></td>
                                    <td><input type="text" disabled value={data.firstName} /></td>
                                    <td><input type="text" disabled value={data.lastName} /> </td> */}
                                    <td colSpan={2}>{data.email}</td>
                                    <td>{data.firstName}</td>
                                    <td>{data.lastName}</td>
                                    <td><input type="text" disabled value={data.type} /></td>
                                    <td>{data.dateAdded}</td>
                                    <td>{data.addedBy}</td>
                                    <td>{(data.finishedRegistering) ? "True" : "False"}</td>
                                    {/* <td>
                                        <Button className="dataMenuBtn" onClick={() => saveUserData(data, key)}>Save
                                        </Button>
                                    </td> */}
                                    {/* <td><input type="text" disabled value={data.dateAdded} /></td>
                                    <td><input type="text" disabled value={data.addedBy} /></td>
                                    <td><input type="text" disabled value={(data.finishedRegistering) ? "True" : "False"} /></td> */}
                                    </>
                                }
                                    
                                    
                                    {/* {modalInfo && showModal && modalId && <DataModal showModal={showModal} modalInfo={modalInfo} handleCloseModal={handleCloseModal} resultsId={modalId}/>} */}
                                    {/* <td><Button onClick={() => {
                                        return (
                                            <>
                                            <DataModal showModal={showModal} handleCloseModal={handleCloseModal} modalInfo={data} />
                                            
                                            </>
                                        )
                                    }}>More</Button></td> */}

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
                    {/* <div className="modal-content">     */}
                        
                        {/* <div className="container"> */}
                            {/* <h1>View Results</h1> */}
                            <p>Are you sure you want to remove access to {rmAccessPers.firstName} {rmAccessPers.lastName}?</p>
                            <p>This action cannot be undone.</p>
                        {/* </div>   */}
                    {/* </div> */}
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