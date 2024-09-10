import React, { useState } from 'react';
import { usersCollection } from '../Firebase';
import { getDoc, getDocs, query, where } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';

function Login ({ setIsLoggedIn, setUserInfo }) {
    const navigate = useNavigate();
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
    
    const [loginInfo, setLoginInfo] = useState({
        username: '',
        password: ''
    });

    const [formDataError, setFormDataError] = useState('');

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

                //  Navigate back to main page
                navigate("/");
            } else {
            }
            console.log(info);

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

        // setIsLoggedIn(true);

        getLoginInfo();


        // const querySnapshot = await userRef
        // .where('username', '==', username)
        // .where('password', '==', password)
        // .limit(1) // Limit to the first matching document
        // .get();

    //   if (querySnapshot.empty) {
    //     setUserFound(null); // No user found
    //   } else {
    //     const doc = querySnapshot.docs[0].data();
    //     setUserFound(doc); // Set the found user
    //   }
    };

    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const handleChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if (name == "name") {
            setFirstName(value)
        } else {
        // if ( name == "lastName") {
        //     setLastName(value)
        // }
        setLoginInfo({...loginInfo, [name]: value});
            // setUserInfo({...userInfo, [name]: value});
        }
    }

    

    return (
        <>
            <div>
                <h2>Login Page</h2>
                <form>
                    <label>
                    Username:
                    <input type="text" name="username" onChange={handleChange} />
                    </label>
                    <br />
                    <label>
                    Password:
                    <input type="password" name="password" onChange={handleChange} />
                    </label>
                    {formDataError != "" ? (
                                <div className="invalidInput" style={{ color: "red" }}>{formDataError}</div>
                            ) : (
                                <></>
                            )}
                    <br />
                    <button type="submit" onClick={handleLogin} >Login</button>
                </form>
            </div>
        </>
    )
}

export default Login;