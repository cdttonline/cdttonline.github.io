import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../components/Table";
import I18N from "../I18N.json"

// import { addDoc } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';

import ValidateFn from "../components/ValidationFn";
import { Badge, Button } from "react-bootstrap";
import "./print.css"
import { resultsCollection } from "../Firebase";
import { addDoc } from "firebase/firestore";


// import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-app.js';
// import { getFirestore, collection, Timestamp } from 'https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js';
const UserTestResults = () => {

//     // Your web app's Firebase configuration
// // For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//     apiKey: "AIzaSyDuKnaBoKS1M6sZVC5Nht4lfUJwCj9C9cY",
//     authDomain: "cdtt-dc538.firebaseapp.com",
//     projectId: "cdtt-dc538",
//     storageBucket: "cdtt-dc538.appspot.com",
//     messagingSenderId: "110118431025",
//     appId: "1:110118431025:web:0a93184db381462d41e810",
//     measurementId: "G-9M8V21CJ3J"
// };

// const firebaseApp = initializeApp(firebaseConfig);
// const db = getFirestore(firebaseApp);


// const resultsCollection = collection(db, 'Results');

    const { state } = useLocation();
    const navigate = useNavigate();
    const [hideSaveResultQ, setHideSaveResultQ] = useState(true);
    const [languageLabel, setLanguageLabel] = useState('');
    const [results, setResults] = useState({
        language: "",
        talker: "",
        list: "",
        mode: "",
        tripletType: "",
        testEar: "",
        masker: "",
        startingSNR: "",
        SRT: "",
        STDEV: "",
        numberReversal: "",
        testDate: "",
        testDuration: "",
        startTestTime: "",
        numberTriplets: "",
        correctAnswer: [],
        userAnswer: [],
        completedTriplet: "",
        languageProficiency: '',
        age: '',
        hearing1: '',
        hearing2: '',
        dominantLanguage: '',
        comment: '',
        termsChecked: false
    });
    var [characterLimit, setCharacterLimit] = useState(350)
    var [termsChecked, setTermsChecked] = useState(false);

    useEffect(() => {
        setResults({
            ...results,
            language: state.language,
            talker: state.talker,
            list: state.list,
            mode: state.mode,
            tripletType: state.tripletType,
            testEar: state.testEar,
            masker: state.masker,
            startingSNR: state.startingSNR,
            SRT: state.SRT,
            STDEV: state.STDEV,
            numberReversal: state.numberReversal,
            testDate: state.testDate,
            testDuration: state.testDuration,
            startTestTime: state.startTestTime,
            numberTriplets: state.numberTriplets,
            correctAnswer: state.correctAnswer,
            userAnswer: state.userAnswer,
            completedTriplet: state.completedTriplet
        });
        console.log(state)

        if (state.language == "EN_CA") {
            setLanguageLabel("English");
        } else {
            setLanguageLabel("French");
        }

        const tmpDateAndTime = (state.testDate + ", " + state.startTestTime + " | " + state.testDuration);
        setDateAndTime(tmpDateAndTime);
    }, [])

    const [resultScore, setResultScore] = useState('');
    const handlePrint = () => {
        window.print();
    }

    const navigateToMainWindow = () => {
        navigate("/");
    }

    const displayExtraSection = () => {
        setHideSaveResultQ(false); // hide save result question


    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if ( name == "age" ) {
            const newValue = event.target.value.replace(/\D/, "");
            setResults({ ...results, [name]: newValue });
        } else {
            setResults({ ...results, [name]: value})
            console.log(value)
        }
    } 
    const [formDataError, setFormDataError] = useState([]);

    const [dateAndTime, setDateAndTime] = useState('');
    const submitResults = async (e) => {
        e.preventDefault();
        const validationResult = ValidateFn.validateTestUserResults(results);
        setFormDataError(validationResult);

        // if (!chckbxTerms.checked) {
        // if (!termsChecked) {

        // } else 
            
        //     // Do not continue
        //     // Show error!
        //     error.style.display = "block";
        //     chckbxTerms.style.color = "red";
    
        //     // Red border color for the Results Frame
        //     extraResultsFrame.style.border = "4px solid red";
            
        //     // Cannot submit! Change color of checkbox border to let the user know
        //     chckbxTerms.style.outline = "2px solid #ff2851";
        let flag = false;

        for (let i = 0; i < validationResult.length; i++) {
        if (validationResult[i] != "") {
            flag = true;
        }
        }

        if (flag == true) {
        console.log("there are still errors to fix");
        } else {
            // Access results from results file and store them in Firebase
            // var language = document.getElementById("resultLanguage").innerHTML;
            // var talker = document.getElementById("resultTalker").innerHTML;
            // var list = document.getElementById("resultListNumber").innerHTML;
            // var mode = document.getElementById("resultMode").innerHTML;
            // var tripletType = document.getElementById("resultTripletType").innerHTML;
            // var testEar = document.getElementById("resultTestEar").innerHTML;
            // var masker = document.getElementById("resultMasker").innerHTML;
            // var startingSNR = document.getElementById("resultStartingSNR").innerHTML;
            // var srt = document.getElementById("resultSRT").innerHTML;
            // var stDev = document.getElementById("resultStDev").innerHTML;
            // var numReversals = document.getElementById("resultReversals").innerHTML;
            // var date_time = document.getElementById("resultDateTime").innerHTML;
    
            // var age = document.getElementById("age").value + "";
            // var languageProficiency = document.getElementById("languageProficiencyDropDownList").value + "";
            // var hearing = document.getElementById("hearingDropDownList").value + "";
            // var ear = document.getElementById("hearing2DropDownList").value + "";
            // var dominantLanguage = document.getElementById("dominantLanguageTextBox").value + "";
            // var comments = document.getElementById("comments").value + "";
            
            //create object
            getResultsExtendedResults();
            // var firebase = new Results(language, talker, list, mode, tripletType, testEar, masker, startingSNR, srt, stDev, numReversals, date_time, age, languageProficiency, hearing, ear, dominantLanguage, comments, resultsTripletList); //stimTripletList, userTripletList);
            addNewDocument();
            // ModalResults.displayExtraSection(false);
            // ModalResults.clearQuestions();
    
            // // Delete extended results table
            // ModalResults.deleteExtendedResultsTable();
            
            // document.getElementById("showResultsModal").style.display = "none";
            
            // // Show the next modal to let the user know the answer was submitted succesfully
            // loadNextPage();
            // navigate back to the main page
            // navigate("/");
            
        }
    }

    const addNewDocument = () => {
        addDoc(resultsCollection, {

            adaptiveTest: {
                reversals: results.numberReversal,
                srt: results.SRT,
                stDev: results.STDEV
            },
            dateAndTime: dateAndTime, 
            language: results.language,
            list: results.list,
            masker: results.masker,
            mode: results.mode,
            startingSNR: results.startingSNR,
            subject: {
                age: results.age,
                hearing: results.hearing1,
                betterEar: results.hearing2,
                languageProficiency: results.languageProficiency,
                dominantLanguage: results.dominantLanguage,
                comments: results.comment
            },
            talker: results.talker,
            testEar: results.testEar,
            tripletType: results.tripletType,
            extendedResults: resultsTripletList,
            score: resultScore
        });
    }

    const [resultsTripletList, setresultsTripletList] = useState([]);
    const getResultsExtendedResults = () => {
        // Get Results
        // Try to obtain the table
        const table = document.getElementById("tableExtendedResults"); 
        console.log("num of triplet = " + results.numberTriplets)
        let score = 0;
        for (let idx = 0; idx < results.numberTriplets; idx++) {
            const stimulus = results.correctAnswer.find((val, i) => i === idx);
            const user = results.userAnswer.find((Val, i) => i === idx );
            const triplet = ("Stimulus: " + stimulus + "\t|\tUser: " + user);
            if ( stimulus === user ) {
                score++;
            }
            resultsTripletList.push(triplet);
            console.log("triplet in extnded res: " + triplet);
            console.log(resultsTripletList)
        }
        const overallScore = (score + "/" + results.numberTriplets);
        setResultScore(overallScore);
        // let tmpStimList = [];
        // let tmpUserList = [];
        // if (table.className == "tableExtendedResults") { // element found
        //     // ROW: Start at row 1 because we don't want the headers
        //     // CELL: Start at cell 1 because we don't want to include the triplet number
        //     //       Append the cells values 
        //     for (let i=1; i<4; i++) {
        //         let cell = table.rows[i].cells;
        //         for (let j=1; j<7; j++) {
        //             // Append the cells for the stimTriplet list
        //             if (j < 4) {
        //                 tmpStimList[j-1] = cell[j].innerHTML;
        //             }
    
        //             // Append the cells for the userTriplet list
        //             if (j > 3) {
        //                 tmpUserList[j-4] = cell[j].innerHTML;
        //             }
        //         }

        //         const triplet = ("Stimulus: " + tmpStimList.join("") + "\t|\tUser: " + tmpUserList.join(""));
        //         resultsTripletList.push(triplet);
        //         console.log("triplet in extnded res: " + triplet);
        //         console.log(resultsTripletList)
        //         // resultsTripletList[i-1] = "Stimulus: " + tmpStimList.join("") + "\t|\tUser: " + tmpUserList.join("");
        //     } 
    
        // } else {
        //     console.log("table NOT found!");  
        // }
    }

    const handleCheckChange = (event) => {
        if (event.target.checked) {
            console.log('✅ Checkbox is checked');
        } else {
            console.log('⛔️ Checkbox is NOT checked');
        }

        const prevTermsCheck = results.termsChecked;
        setResults({
            ...results,
            termsChecked: !prevTermsCheck
        });
    }

    return (
        // <div id="showResultsModal" class="modal showResults" hidden={hideResultModal}> 
        <div>                
            {/* <!-- x button to close modal --> */}
            {/* <span class="close" onclick="ModalResults.closeResultsModal('showResultsModal')">x</span> */}
            
            {/* <!-- Modal content --> */}
            <div>
            {/* <div class="modal-content" style={{opacity: "1"}} id="contentResultsModal"> */}
                <div class="container" id="showResultsContainer">
                    
                    {/* <!-- Printing option, will print the results page --> */}
                    <table className="tableModal_btn">
                        {/* <!-- Handle a print button --> */}
                        <tr>
                            <td><button type="button" class="printBtn" id="printBtn" onClick={handlePrint}> <span class="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>Print</button></td>
                        </tr>
                    </table>
                
                    {/* <!--Display the table Results title--> */}
                    <h1>Test Results</h1>
                    
                    {/* <!-- Table showing all the results from the test -->
                    <!-- For debugging purposes, we will just use random test parameters --> */}
                    <section>
                        <h4>Test Parameters</h4>
                        <table class="tableResults" style={{borderCollapse: "collapse"}}>

                            {/* <!-- Row 1: Date and Time the test started and the duration of the test --> */}
                            <tr >
                                <th class="results" style={{borderBottom: "1pt solid black"}}>Date & Time:</th>
                                <td class="results" style={{borderBottom: "1pt solid black"}} id="resultDateTime">{dateAndTime}</td>
                            </tr>
                            {/* <!-- Row 2: Test language --> */}
                            <tr>
                                <th class="results">Language:</th>
                                <td class="results" id="resultLanguage">{results.language}</td>                                
                            </tr>
                            {/* <!-- Row 3: Test talker --> */}
                            <tr>
                                <th class="results">Talker:</th>
                                <td class="results" id="resultTalker">{results.talker}</td>
                            </tr>
                            {/* <!-- Row 4: Test list --> */}
                            <tr>
                                <th class="results">List #:</th>
                                <td class="results" id="resultListNumber">{results.list}</td>
                            </tr>
                            {/* <!-- Row 5: Test mode 
                                By Default, its always adaptive. However, if a device doesn't support
                                the program to change the audio files' volume, like IOS, then the test
                                mode will be Fixed --> */}
                            <tr>
                                <th class="results">Mode:</th>
                                <td class="results" id="resultMode">{results.mode}</td>
                            </tr>
                            {/* <!-- Row 6: Test triplet type --> */}
                            <tr>
                                <th class="results">Triplet Type:</th>
                                <td class="results" id="resultTripletType">{results.tripletType}</td>
                            </tr>
                            {/* <!-- Row 7: Test ear --> */}
                            <tr>
                                <th class="results">Test Ear:</th>
                                <td class="results" id="resultTestEar">{results.testEar}</td>
                            </tr>
                            {/* <!-- Row 8: Masker file used (Always SSNOISE) --> */}
                            <tr>
                                <th class="results">Masker:</th>
                                <td class="results" id="resultMasker">{results.masker}</td>
                            </tr>
                            {/* <!-- Row 9: Starting SNR calculated --> */}
                            <tr>
                                <th class="results" style={{borderBottom: "1pt solid black"}}>Starting SNR:</th>
                                <td class="results" style={{borderBottom: "1pt solid black"}} id="resultStartingSNR">{results.startingSNR} dB</td>
                            </tr>                        
                        </table>

                        {/* <!-- Display the Adpative subtitle --> */}
                        <h4>Adaptive Test</h4>

                        {/* <!-- SubTable to display the adaptive results --> */}
                        <table class="adaptiveResults">
                            {/* <!-- Row 1: Calculated SRT --> */}
                            <tr>
                                <th class="results">SRT:</th>
                                <td class="results" id="resultSRT">{results.SRT}</td>
                            </tr>
                            {/* <!-- Row 2: Calculated Standard Deviation --> */}
                            <tr>
                                <th class="results">St. Dev.</th>
                                <td class="results" id="resultStDev">{results.STDEV}</td>
                            </tr>
                            {/* <!-- Row 3: Total number of reversals --> */}
                            <tr>
                                <th class="results">Reversals:</th>
                                <td class="results" id="resultReversals">{results.numberReversal}</td>
                            </tr>
                        </table>
                    </section>
                    
                    {/* <!-- Leave some space between the end of the table and 
                        the next section --> */}
                    <br/>
                    
                    {/* <!--The following class will show the detailed Results 
                        table. All of the correct triplet answers and all of 
                        the triplets answered by the user will be displayed--> */}
                    <div class="showDetailedResults" id="showDetailedResults">
                        
                        {/* <!-- Extended Results subtite --> */}
                        <h4>Extended Results</h4>

                        <table id="tableExtendedResults" className="tableExtendedResults border-black">
                            <Table correctAnswer={results.correctAnswer} userAnswer={results.userAnswer}/>
                        </table>

                    </div>

                    {/* <!-- Leave some space between the end of the table and the 
                        next section --> */}
                    <br/>
                    <br/>

                    {/* <!-- Ask if user wants to save results or not --> */}
                    <div class="saveResultsQ">
                        <h2>Save Results</h2>
                        <p>Do you allow your results to be saved anonymously for research purpose in the CDTT database?</p>       
                        
                        <div class="clearfix">
                            
                            {/* <!-- Do not show extra section and go back to main page button --> */}
                            {/* <button type="button" onClick={navigateToMainWindow} class="modalButton cancelbtn">Cancel</button> */}
                            <button type="button" onClick={navigateToMainWindow} className="cancelbtn">Cancel</button>
                            
                            {/* <!-- Show extra section button --> */}
                            {/* <button type="button" onClick={displayExtraSection} class="modalButton allowBtn">Allow</button> */}
                            <button type="button" onClick={displayExtraSection} className="allowBtn">Allow</button>

                        </div>
                    </div>
                    
                    <section>
                        {/* <!--This class will be displayed, if the user selected the 'Allow'
                            button, in the "saveResultsQ" class above. The optional questions 
                            and the terms and conditions will be displayed on the Results modal--> */}
                        <div class="allowSaveExtraSection" hidden={hideSaveResultQ}>
                            {/* <!-- Insert a new line --> */}
                            <br/>

                            {/* <!-- Optional questions for the user to answer --> */}
                            <p class="pNoteSaveResults"> Please answer the following questions. Required fields are followed by *.</p>
                            <form>
                                <fieldset>
                                    <legend style={{textAlign:"left", fontSize: "14px"}}>Extra Questions (Optional)</legend>
                                    
                                    {/* <!-- Question 1: Age
                                        A number input is given for the user to enter their age, 
                                        with a minimum value of 1 and a maximum value of 150  --> */}
                                    <p class="qResults">What is your age?
                                        <input type="number" 
                                            name="age" 
                                            id="age" 
                                            value={results.age} 
                                            style={{width:"60px", marginLeft:"20px"}} 
                                            max="150" 
                                            min="1" 
                                            maxlength="3" 
                                            onChange={handleInputChange} 
                                        />
                                        {formDataError[0] != "" ? (
                                            <div className="invalidInput" style={{ color: "red" }}>{formDataError[0]}</div>
                                        ) : (
                                            <></>
                                        )}
                                    </p>
                                    {/* <!-- Question 2: Hearing 
                                        A drop-down list is given, with the following otions: 
                                        (0) blank, (1) Good, (2) Fair, (3) Poor --> */}
                                    <p class="qResults">How is your hearing?
                                        <select id="hearingDropDownList" style={{marginLeft:"20px"}} name="hearing1" onChange={handleInputChange} >
                                            {I18N.HEARING_1.map((type, index) => {
                                                return ( <option key={index}>{type}</option> )
                                            })}
                                        </select>
                                    </p>
                                    {/* <!-- Question 3: Better ear 
                                        A drop-down list is given, with the following options
                                        (0) blank, (1) Both ears are the same, (2) Left ear is better, (3) Right ear is better --> */}
                                    <p class="qResults">Is one ear better than the other?
                                        <select id="hearing2DropDownList" style={{marginLeft:"20px"}} name="hearing2" onChange={handleInputChange}>
                                            {I18N.HEARING_2.map((type, index) => {
                                                return ( <option key={index}>{type}</option> )
                                            })}
                                        </select>
                                    </p>
                                    {/* <!-- Question 4: Language proficiency 
                                        A drop-down list is given, with the following options
                                        (0) blank, (1) Native Speaker, (2) Advanced, (3) Intermediate, (4) Beginner --> */}
                                    <p class="qResults"><label id="qlanguageProficiency">What is your level of language proficiency in {languageLabel}?</label>
                                        <select id="languageProficiencyDropDownList" style={{marginLeft:"20px"}} name="languageProficiency" onChange={handleInputChange}>
                                            {I18N.LANGUAGE_PROFICIENCY.map((type, index) => {
                                                return(<option key={index}>{type}</option>);
                                            })}
                                        </select>
                                    </p>
                                    {/* <!-- Question 5: Dominant language --> */}
                                    <p class="qResults">What is your dominant language?<input type="text" name="dominantLanguage" id="dominantLanguageTextBox" style={{marginLeft:"20px"}} value={results.dominantLanguage} onChange={handleInputChange} /><br/></p>
                                    {/* <!-- Comments --> */}
                                    <p class="qResults">Any comments?</p>
                                    <textarea 
                                        id="comments" 
                                        name="comment" 
                                        rows="4" 
                                        cols="50" 
                                        style={{resize:"none", width:"95%", padding:"5px"}} 
                                        maxlength="352" 
                                        onChange={handleInputChange}
                                        value={results.comment}
                                    ></textarea>
                                    {formDataError[1] != "" ? (
                                            <div className="invalidInput" style={{ color: "red" }}>{formDataError[1]}</div>
                                        ) : (
                                            <></>
                                        )}
                                    {/* <!-- Show the number of characters entered in the text area : x/350 --> */}
                                    {/* <p class="maxSizeTextArea" id="maxSizeTextArea"></p> */}
                                    <Badge className='mx-auto mb-2' bg={results.comment.length > characterLimit ? 'danger' : 'light'} text="dark">
                                        {results.comment.length}/{characterLimit}
                                    </Badge>
                                </fieldset>
                                
                                {/* <!-- Insert a new line --> */}
                                <br/>
                            
                                {/* <!--Terms and conditions class. To move to the next section,
                                    the terms and conditions checkbox needs to be checked.
                                    Otherwise, an error message will be displayed.--> */}
                                <fieldset id="termsAndConditionFrame">
                                    <legend style={{textAlign:"left", fontSize:"14px"}}>Terms and Conditions </legend>
                                    {/* <!-- Terms and Conditions --> */}
                                    <div class="termsAndConditions" id="termsAndConditions">
                                        <p>
                                            <input 
                                                type="checkbox" 
                                                name="termsChecked" 
                                                id="termsChecked" 
                                                value={results.termsChecked} 
                                                style={{marginRight:"10px"}} 
                                                required 
                                                onChange={handleCheckChange}
                                            />
                                            
                                            <strong><span >*</span></strong>
                                            I understand the results will be held anonymously.
                                        </p>
                                        {formDataError[2] != "" ? (
                                                <div className="invalidInput" style={{ color: "red" }}>{formDataError[2]}</div>
                                            ) : (
                                                <></>
                                            )}
                                    </div>
                                </fieldset>

                                {/* <!-- Insert a new line --> */}
                                <br/>  
                            </form>
                            {/* <!-- Submit the results to the firebase --> */}
                            <button type="button" className="submitResultsBtn mb-5" id="submitResultsBtn" onClick={submitResults}>Submit Results</button>
                        </div>
                    </section>
                </div>          
            </div>
        </div>
    )
}

export default UserTestResults;