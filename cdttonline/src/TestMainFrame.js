import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PracticeTest from "./PracticeTest";
// import CDTT from "./CDTT";

export const TestMainFrame = () => {
    const { state } = useLocation();
    const [inputUserText, setInputUserText] = useState("");
    useEffect(() => {
        console.log(state);


    }, []);

    const [initialValues, setInitialValues] = useState({
        language: state.parameters.language,
        talker: state.parameters.talker,
        list: state.parameters.list,
        mode: state.parameters.testMode,
        testEar: state.parameters.testEar,
        speechLevel: state.calibration.speech,
        maskerLevel: state.calibration.sliderMasker,
        initialVolume: state.calibration.volume,
        currentSNR: state.parameters.startingSNR,
        list_wav: []
    });


    const clearKeyboard =()=> {
        // Clear keyboard
        let clearKeyboard = inputUserText;
        clearKeyboard = "";
        updateTextFieldKeyboard(clearKeyboard);
    }

    const [bDisableDelete, setBDisableDelete] = useState(true)
    const [bDisableSubmit, setBDisableSubmit] = useState(true);
    const [bNotReadyForAnswer, setbNotReadyForAnswer] = useState(true);
    const [disableKeys, setDisableKeys] = useState(false);
    const [ixCurrentTriplet, setIxCurrentTriplet] = useState(0);

    /**
     * This function updates the textfield keyboard.
     * @param {String} answer 
     */
    const updateTextFieldKeyboard =(answer)=> {

        // First, trim the answer if we got more digits than we need
        if (answer.length > 3) {
            answer = answer.substring(0, 3);
        }

        if (answer.length == 0) 
        {
            // Disable delete button
            setBDisableDelete(true);  
            // setBDisableSubmit(true);     
            setBDisableSubmit(true); 

        } 
        else if (answer.length == 3) 
        { 
            // Enable the submit button
            setBDisableSubmit(false); 
            setDisableKeys(true)    
        }else if (answer.length > 0) {
            setBDisableDelete(false)
            setBDisableSubmit(true); 

        }

        // The current answer replaces the text area value 
        setInputUserText(answer);
        
        // If the audio is done playing and all 3 numbers are entered on keypad,
        // then enable the submit button, otherwise, disable
    }

    const [submitBtnTestVal, setSubmitBtnTestVal] = useState(0)
    /**
     * This function makes a practice test for the participant. It creates a
     * PracticeTest() object, where a random list is chosen to perform the 
     * practice test. With the chosen random list, the CDTT.getListOfFile()
     * static method is called to return the path of the folder where all 
     * .wav files are stored. 
     * This function also keeps track of the number of triplets that have 
     * been completed, when a .wav file is played.
     */
    const startPracticeTest =()=> {

        // Clear keypad
        clearKeyboard();

        if (ixCurrentTriplet == 0) {

        //     // Set the submit button value to 1
            setSubmitBtnTestVal(1);

        //     // Gets all values selected from the combo boxes and from the textboxes
        //     language = document.getElementById("languageDropDownList").value;
        //     talker = document.getElementById("talkerDropDownList").value;
        //     list = document.getElementById("listDropDownList").value;
        //     mode = document.getElementById("testModeDropDownList").value;
        //     testEar = document.getElementById("testEarDropDownList").selectedIndex;
        //     speechLevel =(document.getElementById("speechCalib").value);
        //     maskerLevel = (document.getElementById("maskerCalib").innerHTML);
        //     initialVolume = document.getElementById("speechCalib").value;

        //     // Create a practice test object
        let practiceTest = new PracticeTest(
            initialValues.language,
            initialValues.talker,
            initialValues.list,
            initialValues.mode,
            initialValues.testEar,
            initialValues.speechLevel,
            initialValues.maskerLevel,
            initialValues.currentSNR
        );      
        
        let tmp = practiceTest.getRandomList(initialValues.list);
        
        //     // Choose a random list to perform the practice test
            // let tmp = practiceTest.getRandomList(list);
            
        //     // Get the file
            CDTT.getListOfFile(initialValues.language, initialValues.talker, tmp);
            
        //     // Make the keyboard visible
            // CDTT.enableKeyboard("visible");
            handleVisibilityKeyboard();
        // } else {

        //     // Play audio file
            CDTT.playAudio(initialValues.list_wav[ixCurrentTriplet]); 
        }
    }

    const keypadDigitListener =(val)=> {
        // Check if text area is already at max length or at min length
        // Don't worry about limiting the answer length,
        // this will get done when we update the text field.
        let tmpUserAnswer = inputUserText;
        let newAnswe = tmpUserAnswer.concat("", val);

        setInputUserText(newAnswe)
    
        // Update the text field and GUI buttons
        updateTextFieldKeyboard(newAnswe);
    }

    const keypadDeleteListener=() =>{

        // Get the answer already in the text field
        let currentAnswer = inputUserText;
        setDisableKeys(false)

        // Implement backspace
        if (currentAnswer.length > 1) {
    
            // Remove the last digit in the answer text field
            currentAnswer = currentAnswer.substring(0, currentAnswer.length-1);
        } else {
            // Clear the text
            currentAnswer = "";
        }
    
        // Update the text field and GUI buttons
        updateTextFieldKeyboard(currentAnswer);
    }


    // const scoreCurrentTriplet =(correctAnswer, userAnswerSubmit)=> {
    //     if (state.parameters.tripletType == "Triplet") {
    //         return userAnswerSubmit == correctAnswer
    //     }
    //     return (userAnswerSubmit == correctAnswer) || scoreTestAllDigits(correctAnswer, userAnswerSubmit); 
    // }
    // const keypadSubmitListener =()=> {
    
    //     // Get the answer already in the text field
    //     let userAnswerSubmit = []
    //     let correctAnswer = []
    //     userAnswerSubmit[ixCurrentTriplet] = inputUserText;
    
    //     // Submit button won't be enabled until the next 
    //     // audio file is done playing 
    //     setbNotReadyForAnswer(true);
        
    //     // Scores the answer of the current triplet
    //     bCorrectAnswer = scoreCurrentTriplet(correctAnswer[ixCurrentTriplet], userAnswerSubmit[ixCurrentTriplet]);
        
    //     computeCurrentSNR(bCorrectAnswer);
        
    //     // Clear the previously saved subject answer
    //     clearKeyboard();
    
    //     // Practice test
    //     if (Settings.SUBMIT_BTN_TEST == 1) {
    
    //         // Disable the keyboard
    //         enableKeyboardKeys(false, true);
            
    //         // Enable the "Test Practice" button
    //         document.getElementById("btnPracticeTest").disabled = false;
    
    //         let scorePracticeTest;
    //         // Show the score for this triplet
    //         if (bCorrectAnswer) {
    //             scorePracticeTest = "<b>Correct Answer.</b>";
    //         } else {
    //             scorePracticeTest = "<b>Incorrect Answer.</b><br>Participant Answer: " + userAnswerSubmit[ixCurrentTriplet] + "<br>Correct Answer: " + correctAnswer[ixCurrentTriplet];
    //         }
    
    //         // Display the score 
    //         document.getElementById("scorePracticeTest").innerHTML = scorePracticeTest;
    
    //         // Move to the next triplet
    //         bNextDigit = moveToTheNextTriplet();
    
    //         // Executing test
    //     } else {
    //         // Check if its the first triplet and incorrect
    //         if ((ixCurrentTriplet == 0) && (bCorrectAnswer == false)) {
    //             // Repeat the first triplet
    //         } else {
    //             if (bCorrectAnswer) {
                    
    //                 // Increment the number of correct triplet
    //                 numCorrectTriplet++;
    //             }
    
    //             // Move to the next triplet
    //             bNextDigit = moveToTheNextTriplet();
    //         }
    
    //         console.log("# of correct triplet: " + numCorrectTriplet + ", # of triplets completed: " + ixCurrentTriplet); 
            
    //         // Check if we have reached the end of session
    //         if (!bNextDigit) {
                
    //             // Update status bar
    //             updateProgressStatusBar();
    //             document.getElementById("labelProgress").style.visibility = "hidden";
            
    //             disableTestParameters(false);
    
    //             endTime = new Date(); 
    
    //             // Set the global variable values
    //             resultsTriplet.correctAnswer = correctAnswer;
    //             resultsTriplet.userAnswer = userAnswerSubmit;
    //             resultsTriplet.completedTriplet = ixCurrentTriplet;
    
    //             // Display a message prompt that we're done. This breaks the thread
    //             // execution allowing the subject to pass control to the operator
    //             showResultsGlobal();
                
    //             // Compute test results
    //             endOfSession(bCorrectAnswer);
    
    //             // Get the test duration and convert it to the format: min-sec
    //             let duration = Math.abs(endTime.getTime() - startDateTime.getTime());
    //             let testDuration = convertMilliSecToTime(duration);
    //             let testDate = currentDate(startDateTime);
    //             let startTestTime = currentTime(startDateTime);
               
    //             // Hide and dispose the keypad and stop test
    //             // Notify the main thread that final iteration is done
    
    //             // Open modal with the results
    //             document.getElementById('modalAskViewResults').style.display = 'block';
    
    //             // Get the number of triplets 
    //             let numberTriplets = ixCurrentTriplet;
                
    //             // Create an object to show on the modal --> results page
    //             var showResults = new ModalResults(language, talker, list, mode, tripletType, testEar, masker, startingSNR, SRT, STDEV, numberReversal, testDate, testDuration, startTestTime, numberTriplets);
    //             showResults.showModalResults();
    //             showResults.show();  
                
    //             showResultsGlobal();
    //             // stop test to reset the parameters
    //             stopTest();
    
    //         } else {  
    //             // Play audio file and update status bar
    //             updateProgressStatusBar();
    //             CDTT.playAudio(list_wav[ixCurrentTriplet]); 
    //         } 
    //     }
    // }

    // const [firstCorrectAnswer, setFirstCorrectAnswer] = useState(null)

    // const detectReversal =(bCorrectAnswer, SNR)=> {
    //     let bReversal = false;
    //     let currentSNR = parseFloat(SNR);
    //     // Detect reversal only if we've done at least 2 iterations already
    //     if (ixCurrentTriplet > 1) {
    
    //         // Get the SNR from the previous iteration
    //         // let previousSNR = parseInt(getSNR(ixCurrentTriplet - 2));
    
    //         // If previous SNR was ascending, look for correct answer
    //         // If previous SNR was descending, look for incorrect answer
    //         if (((currentSNR > previousSNR) && bCorrectAnswer) || ((currentSNR < previousSNR) && !bCorrectAnswer)) {
    
    //             // Update the reversals array with a value of 1 at current index
    //             //setReversal(ixCurrentTriplet, 1);
    //             numberReversal++;
    
    //             // Set return value to true
    //             bReversal = true;
    //         }
    //     }
    //     return bReversal;
    // }


    // const computeCurrentSNR =(bCorrectAnswer)=> {

    //     // Initialize the SNR to the value used just before we got here
    //     //var currentSNR = speechLevelVal - maskerLevelVal;
    
    //     // Set a temporary variable in case the maximum level is reached
    //     let tmpSNR = state.parameters.startingSNR;
    
    //     if (bCorrectAnswer && firstCorrectAnswer) {
            
    //         // Set the SNR before reversal value when the first correct answer is entered
    //         firstCorrectAnswer = false;
    //     }
    
    //     // Detect if a reversal was encountered
    //     let bFirstReversal;
    //     bFirstReversal |= detectReversal(bCorrectAnswer, tmpSNR);
    
    //     // Set the step size for the current and future iterations
    //     if (!bFirstReversal) {
    //         dBSTEP = 4.0;
    //     } else {
    //         dBSTEP = 2.0;
    //     }
    
    //     // Compute the current SNR based
    //     if (bCorrectAnswer) {
    
    //         // Answer was correct, decrease SNR
    //         currentSNR -= dBSTEP;
    
    //         // Set the number of misses in a row back to zero
    //         nmisses = 0;
    //     } else {
    
    //         // Answer was incorrect, increase SNR
    //         currentSNR += dBSTEP;
    
    //         // Increment the number of misses in a row
    //         nmisses++;
    //     }
    
    //     // Update the SNR array  with the new value we just compiled
    //     setSNR(ixCurrentTriplet, currentSNR);
    // }

    const [enableKeyboard, setEnableKeyboard] = useState(true)
    const handleVisibilityKeyboard =()=>{
        setEnableKeyboard(true)
    }
    
    return (
        <>
            {/* <!-- This class is called when the user selects the "Next" button, on the main page. 
            It allows the user to either start a practice test, show/hide the test instructions, 
            or skip the practice test and proceed to the test 
            When the user selects the "Show Instructions" button, the button's inner HTML is 
            changed to "Hide Instructions". --> */}
            <div id="practiceTest" class="practiceTest">
                {/* <!-- Display the buttons to either start the practice test, see the test
                    instructions or to skip to the Test --> */}
                <table class="practiceTestBtnClass">
                    <tr id="testBtnRow">
                        {/* <!-- Start the practice test -->                         */}
                        <td><center><button type="button" id="btnPracticeTest" onClick={startPracticeTest}><b>Practice</b></button></center></td>
                        {/* <!-- Show/Hide Test Instructions button--> */}
                        <td><center><button type="button" id="btnInstructions" onclick="showInstructions()"><b>Show Instructions</b></button></center></td>
                        {/* <!-- Skip to Test Button --> */}
                        <td><center><button type="button" id="btnSkipToTest" onclick="skipToTest()"><b>Skip Practice</b></button></center></td>
                    </tr>
                </table>
                
                {/* <!-- This class is called when the "Show Instructions" button
                    was selected. It shows the test instructions --> */}
                <div id="testInstructions">
                    <fieldset>
                        <legend>Test Instructions</legend>
                        {/* <!-- <h4 style="margin-block-end: 2px;margin-block-start: 10px;"><u>Test Instructions</u></h4> -->
                        <!-- List the instructions using bullet points --> */}
                        <ul id="testInstructions">
                            <li>You will hear 24 sets of 3 digits in noise</li>
                            <li>After each set, enter the three digits heard using the on-screen keypad. You can use the backspace key if you want to change your answer</li>
                            <li>To submit your answer, select the enter key (when green) and the following set will be played</li>
                            <li>To stop a test before completion, select the "Stop Test" button in the upper right corner</li>
                            <li>You can see your results once the test is completed</li>
                            <li><u>Practice:</u></li>
                            <ul>
                                <li>Select this button if you want to practice before the test</li>
                                <li>Adjust the volume of your device if necessary</li>
                                <li>To play a new set, select the "Practice" button again</li>
                            </ul>
                        </ul>
                    </fieldset>
                </div>
                
                {/* <!-- Show the score of the triplet for the practice test --> */}
                <p id="scorePracticeTest"></p>
            </div>

            {/* <!-- This class creates the on-screen keypad for the user. 
                By default, its display is set to none and its visibility 
                is set to hidden as we only wwant the on-screen keypad to 
                be displayed once the Practice Test or the CDTT Test has 
                started. --> */}
            {/* <!-- Create keyboard to enter the answers --> */}
            <div id="keyboardCDTT" class="keyboardCDTT" name="keyboardCDTT">
                
                {/* <!-- On-Screen keypad table --> */}
                <table class="tableKeyboard" id="tableKeyboard" hidden={enableKeyboard}>
                    {/* <!-- Row 1: Text input --> */}
                    <tr><th colspan="3"><input type="text" class="inputUserKeyboard" name="inputUserText" id="inputUserText" value={inputUserText} maxlength="3" onkeyup="keyboardListener(event)" disabled={!bDisableSubmit}/></th></tr>
                    {/* <!-- Row 2: 1-2-3 buttons --> */}
                    <tr>    
                        <td><center><button class="keyboardBtn" id="btn1" onClick={() => {keypadDigitListener(1)}} disabled={disableKeys}>1</button></center></td>
                        <td><center><button class="keyboardBtn" id="btn2" onClick={() => {keypadDigitListener(2)}} disabled={disableKeys}>2</button></center></td>
                        <td><center><button class="keyboardBtn" id="btn3" onClick={() => {keypadDigitListener(3)}} disabled={disableKeys}>3</button></center></td>
                    </tr>
                    {/* <!-- Row 3: 4-5-6 buttons --> */}
                    <tr>
                        <td><center><button class="keyboardBtn" id="btn4" onClick={() => {keypadDigitListener(4)}} disabled={disableKeys}>4</button></center></td>
                        <td><center><button class="keyboardBtn" id="btn5" onClick={() => {keypadDigitListener(5)}} disabled={disableKeys}>5</button></center></td>
                        <td><center><button class="keyboardBtn" id="btn6" onClick={() => {keypadDigitListener(6)}} disabled={disableKeys}>6</button></center></td>
                    </tr>
                    {/* <!-- Row 4: 7-8-9 buttons --> */}
                    <tr>
                        <td><center><button class="keyboardBtn" id="btn7" onClick={() => {keypadDigitListener(7)}} disabled={disableKeys}>7</button></center></td>
                        <td><center><button class="keyboardBtn" id="btn8" onClick={() => {keypadDigitListener(8)}} disabled={disableKeys}>8</button></center></td>
                        <td><center><button class="keyboardBtn" id="btn9" onClick={() => {keypadDigitListener(9)}} disabled={disableKeys}>9</button></center></td>
                    </tr>
                    {/* <!-- Row 5: Delete-0-Submit buttons --> */}
                    <tr>
                        {/* <!-- Delete button --> */}
                        <td><center><button class="keyboardBtn btnDelete" id="btnDelete" onClick={keypadDeleteListener} disabled={bDisableDelete}><a><img src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-delete.png" id="iconDelete" alt="Delete"/></a></button></center></td>
                        <td><center><button class="keyboardBtn" id="btn0" onClick={() => {keypadDigitListener(0)}} disabled={disableKeys}>0</button></center></td>
                        {/* <!-- Submit button --> */}
                        <td><center><button class="keyboardBtn btnSubmit" id="btnSubmitTest" onclick="keypadSubmitListener()" disabled={bDisableSubmit && bNotReadyForAnswer}><img src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-enter.png" id="iconEnter" alt="Submit"/></button></center></td>
                    </tr>
                </table>
                
                {/* <!-- Progress bar labels --> */}
                <p id="labelProgress"></p>
           </div>
        </>
    );
}

export default TestMainFrame;