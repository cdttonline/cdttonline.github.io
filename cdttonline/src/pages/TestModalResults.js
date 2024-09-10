import { useEffect, useState } from "react";
import Table, { processUserAnswer } from "../components/Table";
import { Button, Modal } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const TestModalResults =({ language, talker, list, mode, tripletType, testEar, masker, startingSNR, SRT, STDEV, 
    numberReversal, testDate, testDuration, startTestTime, numberTriplets, correctAnswer, userAnswerSubmit, completedTriplet })=> {
    // const [isActive, setIsActive] = useState(false);
    const [hideResultModal, setHideResultModal] = useState(true);
    const [hideModalAskViewResults, setHideModalAskViewResults] = useState(false);
    const [showTable, setShowTable] = useState(true);
    const [userAnswer, setUserAnswer] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        // TMP FUNCTION!
        console.log("Result triplets");
        console.log(correctAnswer);
        console.log(userAnswerSubmit);
        console.log(completedTriplet);
    }, [correctAnswer, userAnswerSubmit, completedTriplet])

    const showUSerTestResults = (tmpUserAnswerArray) => {
        navigate("/userTestResults", {
            state: {
                language: language,
                talker: talker,
                list: list,
                mode: mode,
                tripletType: tripletType,
                testEar: testEar,
                masker: masker,
                startingSNR: startingSNR,
                SRT: SRT,
                STDEV: STDEV,
                numberReversal: numberReversal,
                testDate: testDate,
                testDuration: testDuration,
                startTestTime: startTestTime,
                numberTriplets: numberTriplets,
                correctAnswer: correctAnswer,
                userAnswer: tmpUserAnswerArray,
                completedTriplet: completedTriplet
            }
        })
    }

    const handleViewResults = () => {
        // Close current modal and open next one with the results
        setHideModalAskViewResults(true);
        setHideResultModal(false);

        // ModalResults.bodyOverflowVisible(false);
    
        showExtendedResults();


    
        // Add the used language to the end of the innerHTML for the Language Proficieny question
        // let getLanguage = language;
        // if (getLanguage == "EN_CA") {
        //     // Is in English
        //     document.getElementById("qlanguageProficiency").innerHTML = I18N.LANGUAGE_PROF_ENGLISH;
        // } else {
        //     // French
        //     document.getElementById("qlanguageProficiency").innerHTML = I18N.LANGUAGE_PROF_FRENCH;
        // }
    
        // Get the comboboxes questions options
        // if (!Settings.FLAG_OPEN_DETAILED_RESULTS) {
        //     Settings.ddlLanguageProficieny();
        //     Settings.ddlHearingList();
        //     Settings.ddlHearingList2();
            
        //     // Set the flag to true to not call the functions again
        //     Settings.FLAG_OPEN_DETAILED_RESULTS = true;
        // }
    }

    
    const showExtendedResults = () => {
        // Delete old extended results table
        // ModalResults.deleteExtendedResultsTable();

        // On the first triplet, only record the right answer
        const tmpUserAnswerArray = processUserAnswer(correctAnswer, userAnswerSubmit);
        showUSerTestResults(tmpUserAnswerArray);

        // setUserAnswer(tmpUserAnswerArray);
        setShowTable(false);        
    }
    
    

    return (
        <>  
            {/* <table>

            </table> */}
            {/* <!-- Show first Modal -- Ask user if wants to view Results --> */}
            <Modal 
                id="modalAskViewResults" 
                className="modal AskViewResults" 
                show={!hideModalAskViewResults} 
                onHide={() => setHideModalAskViewResults(true)}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header closeButton>
                    <Modal.Title>View Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {/* <div className="modal-content">     */}
                        
                        {/* <div className="container"> */}
                            {/* <h1>View Results</h1> */}
                            <p>Would you like to access your results?</p>
                            
                        {/* </div>   */}
                    {/* </div> */}
                </Modal.Body>
                <Modal.Footer>
                    {/* <!-- Do not view Results button --> */}
                    <Button type="button" className="btnNotViewResults" id="btnNotViewResults" onClick={() => setHideModalAskViewResults(true)}>Cancel</Button>                    
                                                
                    {/* <!-- View Results button --> */}
                    <Button type="button" className="btnViewResults" id="btnViewResults" onClick={handleViewResults}>View</Button> 
                        
                </Modal.Footer>
                
            </Modal>

            {/* <!--The following div will display the test results in a modal, when
                the test is completed. The user can send his/her results to a 
                database, or can go back to the main page--> */}
            
        </>
    )
}

export default TestModalResults;
// 

            // <div id="showResultsModal" class="modal showResults" hidden={hideResultModal}>   
                
            //     {/* <!-- x button to close modal --> */}
            //     <span class="close" onclick="ModalResults.closeResultsModal('showResultsModal')">x</span>
                
            //     {/* <!-- Modal content --> */}
            //     {/* <div class="modal-content" style="opacity: 1;" id="contentResultsModal"> */}
            //     <div class="modal-content" style={{opacity: "1"}} id="contentResultsModal">
            //         <div class="container" id="showResultsContainer">
                        
            //             {/* <!-- Printing option, will print the results page --> */}
            //             <table class="tableModal_btn">
            //                 {/* <!-- Handle a print button --> */}
            //                 <tr>
            //                     <td><button type="button" class="printBtn" id="printBtn" onclick="handlePrint()"> <span class="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>Print</button></td>
            //                 </tr>
            //             </table>
                    
            //             {/* <!--Display the table Results title--> */}
            //             <h1>Test Results</h1>
                        
            //             {/* <!-- Table showing all the results from the test -->
            //             <!-- For debugging purposes, we will just use random test parameters --> */}
            //             <section>
            //                 <h4>Test Parameters</h4>
            //                 <table class="tableResults" style={{borderCollapse: "collapse"}}>

            //                     {/* <!-- Row 1: Date and Time the test started and the duration of the test --> */}
            //                     <tr >
            //                         <th class="results" style={{borderBottom: "1pt solid black"}}>Date & Time:</th>
            //                         <td class="results" style={{borderBottom: "1pt solid black"}} id="resultDateTime">2023-03-08, 3:27:03 PM | 00min 19s</td>
            //                     </tr>
            //                     {/* <!-- Row 2: Test language --> */}
            //                     <tr>
            //                         <th class="results">Language:</th>
            //                         <td class="results" id="resultLanguage">{language}</td>                                
            //                     </tr>
            //                     {/* <!-- Row 3: Test talker --> */}
            //                     <tr>
            //                         <th class="results">Talker:</th>
            //                         <td class="results" id="resultTalker">{talker}</td>
            //                     </tr>
            //                     {/* <!-- Row 4: Test list --> */}
            //                     <tr>
            //                         <th class="results">List #:</th>
            //                         <td class="results" id="resultListNumber">{list}</td>
            //                     </tr>
            //                     {/* <!-- Row 5: Test mode 
            //                         By Default, its always adaptive. However, if a device doesn't support
            //                         the program to change the audio files' volume, like IOS, then the test
            //                         mode will be Fixed --> */}
            //                     <tr>
            //                         <th class="results">Mode:</th>
            //                         <td class="results" id="resultMode">{mode}</td>
            //                     </tr>
            //                     {/* <!-- Row 6: Test triplet type --> */}
            //                     <tr>
            //                         <th class="results">Triplet Type:</th>
            //                         <td class="results" id="resultTripletType">{tripletType}</td>
            //                     </tr>
            //                     {/* <!-- Row 7: Test ear --> */}
            //                     <tr>
            //                         <th class="results">Test Ear:</th>
            //                         <td class="results" id="resultTestEar">{testEar}</td>
            //                     </tr>
            //                     {/* <!-- Row 8: Masker file used (Always SSNOISE) --> */}
            //                     <tr>
            //                         <th class="results">Masker:</th>
            //                         <td class="results" id="resultMasker">{masker}</td>
            //                     </tr>
            //                     {/* <!-- Row 9: Starting SNR calculated --> */}
            //                     <tr>
            //                         <th class="results" style={{borderBottom: "1pt solid black"}}>Starting SNR:</th>
            //                         <td class="results" style={{borderBottom: "1pt solid black"}} id="resultStartingSNR">{startingSNR} dB</td>
            //                     </tr>                        
            //                 </table>

            //                 {/* <!-- Display the Adpative subtitle --> */}
            //                 <h4>Adaptive Test</h4>

            //                 {/* <!-- SubTable to display the adaptive results --> */}
            //                 <table class="adaptiveResults">
            //                     {/* <!-- Row 1: Calculated SRT --> */}
            //                     <tr>
            //                         <th class="results">SRT:</th>
            //                         <td class="results" id="resultSRT">{SRT}</td>
            //                     </tr>
            //                     {/* <!-- Row 2: Calculated Standard Deviation --> */}
            //                     <tr>
            //                         <th class="results">St. Dev.</th>
            //                         <td class="results" id="resultStDev">{STDEV}</td>
            //                     </tr>
            //                     {/* <!-- Row 3: Total number of reversals --> */}
            //                     <tr>
            //                         <th class="results">Reversals:</th>
            //                         <td class="results" id="resultReversals">{numberReversal}</td>
            //                     </tr>
            //                 </table>
            //             </section>
                        
            //             {/* <!-- Leave some space between the end of the table and 
            //                 the next section --> */}
            //             <br/>
            //             <br/>
                        
            //             {/* <!--The following class will show the detailed Results 
            //                 table. All of the correct triplet answers and all of 
            //                 the triplets answered by the user will be displayed--> */}
            //             <div class="showDetailedResults" id="showDetailedResults">
                            
            //                 {/* <!-- Extended Results subtite --> */}
            //                 <h3>Extended Results</h3>

            //                 <table hidden={showTable} className="tableExtendedResults border-black">
            //                     <Table correctAnswer={correctAnswer} userAnswer={userAnswer}/>
            //                 </table>

            //             </div>

            //             {/* <!-- Leave some space between the end of the table and the 
            //                 next section --> */}
            //             <br/>
            //             <br/>

            //             {/* <!-- Ask if user wants to save results or not --> */}
            //             <div class="saveResultsQ">
            //                 <h2>Save Results</h2>
            //                 <p>Do you allow your results to be saved anonymously for research purpose in the CDTT database?</p>       
                            
            //                 <div class="clearfix">
                                
            //                     {/* <!-- Do not show extra section and go back to main page button --> */}
            //                     <button type="button" onclick="ModalResults.closeResultsModal('showResultsModal')" class="modalButton cancelbtn">Cancel</button>
                                
            //                     {/* <!-- Show extra section button --> */}
            //                     <button type="button" onclick="ModalResults.displayExtraSection(true)" class="modalButton allowBtn">Allow</button>
            //                 </div>
            //             </div>
                        
            //             <section>
            //                 {/* <!--This class will be displayed, if the user selected the 'Allow'
            //                     button, in the "saveResultsQ" class above. The optional questions 
            //                     and the terms and conditions will be displayed on the Results modal--> */}
            //                 <div class="allowSaveExtraSection" style={{display:"none"}}>
            //                     {/* <!-- Insert a new line --> */}
            //                     <br/>

            //                     {/* <!-- Optional questions for the user to answer --> */}
            //                     <p class="pNoteSaveResults"> Please answer the following questions. Required fields are followed by *.</p>
            //                     <form>
            //                         <fieldset>
            //                             <legend style={{textAlign:"left", fontSize: "14px"}}>Extra Questions (Optional)</legend>
                                        
            //                             {/* <!-- Question 1: Age
            //                                 A number input is given for the user to enter their age, 
            //                                 with a minimum value of 1 and a maximum value of 150  --> */}
            //                             <p class="qResults">What is your age?<input type="number" name="age" id="age" value="" style={{width:"40px", marginLeft:"20px"}} max="150" min="1" maxlength="3" />
            //                                 {/* <!-- Insert a new line --> */}
            //                                 <br/>
            //                             </p>
            //                             {/* <!-- Question 2: Hearing 
            //                                 A drop-down list is given, with the following otions: 
            //                                 (0) blank, (1) Good, (2) Fair, (3) Poor --> */}
            //                             <p class="qResults">How is your hearing?<select id="hearingDropDownList" style={{marginLeft:"20px"}}></select></p>
            //                             {/* <!-- Question 3: Better ear 
            //                                 A drop-down list is given, with the following options
            //                                 (0) blank, (1) Both ears are the same, (2) Left ear is better, (3) Right ear is better --> */}
            //                             <p class="qResults">Is one ear better than the other?<select id="hearing2DropDownList" style={{marginLeft:"20px"}}></select></p>
            //                             {/* <!-- Question 4: Language proficiency 
            //                                 A drop-down list is given, with the following options
            //                                 (0) blank, (1) Native Speaker, (2) Advanced, (3) Intermediate, (4) Beginner --> */}
            //                             <p class="qResults"><label id="qlanguageProficiency">What is your level of language proficiency in </label><select id="languageProficiencyDropDownList" style={{marginLeft:"20px"}}></select></p>
            //                             {/* <!-- Question 5: Dominant language --> */}
            //                             <p class="qResults">What is your dominant language?<input type="text" name="dominantLanguageTextBox" id="dominantLanguageTextBox" style={{marginLeft:"20px"}} /><br/></p>
            //                             {/* <!-- Comments --> */}
            //                             <p class="qResults">Any comments?</p>
            //                             <textarea id="comments" rows="4" cols="50" style={{resize:"none", width:"95%", padding:"5px"}} maxlength="350"></textarea>
            //                             {/* <!-- Show the number of characters entered in the text area : x/350 --> */}
            //                             <p class="maxSizeTextArea" id="maxSizeTextArea"></p>
            //                         </fieldset>
                                    
            //                         {/* <!-- Insert a new line --> */}
            //                         <br/>
                                
            //                         {/* <!--Terms and conditions class. To move to the next section,
            //                             the terms and conditions checkbox needs to be checked.
            //                             Otherwise, an error message will be displayed.--> */}
            //                         <fieldset id="termsAndConditionFrame">
            //                             <legend style={{textAlign:"left", fontSize:"14px"}}>Terms and Conditions </legend>
            //                             {/* <!-- Terms and Conditions --> */}
            //                             <div class="termsAndConditions" id="termsAndConditions">
            //                                 <p><input type="checkbox" name="modalResultsTerms" id="modalResultsTerms" style={{marginRight:"10px"}} required />
            //                                     <strong><span >*</span></strong>
            //                                     I understand the results will be held anonymously.
            //                                 </p>
            //                             </div>
            //                         </fieldset>

            //                         {/* <!-- Insert a new line --> */}
            //                         <br/>  
            //                     </form>
            //                     {/* <!-- Submit the results to the firebase --> */}
            //                     <button type="button" class="submitResultsBtn" id="submitResultsBtn">Submit Results</button>
            //                 </div>
            //             </section>
            //         </div>          
            //     </div>
            // </div>

            // {/* <!-- This class is called when the user submits his results to the database. 
            //     It closes the "Results" window and displays this new modal window, where 
            //     the progress of the data saving is displayed with a loading bar. Once the 
            //     results have been successfully saved to the database, a message is displayed 
            //     informing the user that he will be redirected to the main page.--> */}
            // <div id="resultsSavedModal" class="modal resultsSaved" style={{display:"none"}}>
            //     {/* <!-- Modal Content-->             */}
            //     <div class="modal-content">
                    
            //         <div class="container">

            //             {/* <!-- Loading bar --> */}
            //             <div class="loading" id="loading">
            //                 <div class="loader" id="loader"></div>  
            //                 <h1>Saving Results</h1>
            //             </div>
                        
            //             {/* <!-- Results saved successfully, returning to the main page --> */}
            //             <div id="loaded" style={{display:"none"}}>
            //                 <h1>Results saved successfully.</h1>
            //                 <p>Returning to main page.</p>       
            //                 <div class="clearfix">
            //                     <button type="button" class="modalButton okBtn" id="btnReturningMainP">OK</button>
            //                 </div>
            //             </div>                   
            //         </div>          
            //     </div>
            // </div>