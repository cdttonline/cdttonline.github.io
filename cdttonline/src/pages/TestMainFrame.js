import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import {mean, sum, stdDev} from "./DSPutils";
import {processUserAnswer} from "../components/Table"
import TestModalResults from "./TestModalResults";
import InputMask from 'react-input-mask';
import { convertMilliSecToTime, currentDate, currentTime } from "../components/DateTimeHelperFn";

function TestMainFrame ()  {
    const { state } = useLocation();

    const [initialValues, setInitialValues] = useState({
        language: state.parameters.language,
        talker: state.parameters.talker,
        list: state.parameters.list,
        mode: state.parameters.testMode,
        testEar: state.parameters.testEar,
        speechLevel: state.calibration.speech,
        maskerLevel: state.calibration.sliderMasker,
        initialVolume: state.calibration.speech,
        currentSNR: state.parameters.startingSNR,
        list_wav: [],
        testInQuiet: state.parameters.isTestInQuiet,
        masker: state.parameters.masker,
        tripletType: state.parameters.tripletType
    });

    // Variables
    const [inputUserText, setInputUserText] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState([])
    const [userAnswerSubmit, setUserAnswerSubmit]=useState([]);
    const [list_wav, setList_wav] = useState([]);
    const [bDisableDelete, setBDisableDelete] = useState(true)
    const [bDisableSubmit, setBDisableSubmit] = useState(true);
    const [bNotReadyForAnswer, setbNotReadyForAnswer] = useState(true);
    const [disableKeys, setDisableKeys] = useState(false);
    const [ixCurrentTriplet, setIxCurrentTriplet] = useState(0);

    const clearKeyboard =()=> {
        // Clear keyboard
        let clearKeyboard = inputUserText;
        clearKeyboard = "";
        updateTextFieldKeyboard(clearKeyboard);
    }

    /**
     * This function updates the textfield keyboard.
     * @param {String} answer 
     */
    const updateTextFieldKeyboard =(answer)=> {
        // First, trim the answer if we got more digits than we need
        if (answer.length > 3) {
            answer = answer.substring(0, 3);
        }

        if (answer.length == 0) {
            // Disable delete button
            setBDisableDelete(true);  
            setBDisableSubmit(true); 
        } else if (answer.length == 3) { 
            // Enable the submit button
            setBDisableSubmit(false); 
            setDisableKeys(true)    
        } else if (answer.length > 0) {
            setBDisableDelete(false)
            setBDisableSubmit(true); 
        }

        // The current answer replaces the text area value 
        setInputUserText(answer);
    }

    const [numCorrectTriplet, setNumCorrectTriplet] = useState(0);
    const [submitBtnTestVal, setSubmitBtnTestVal] = useState(0);
    const [audioIsOn, setAudioIsOn] = useState(false);
    
    /**
     * This function makes a practice test for the participant. It creates a PracticeTest() object, where a random list is chosen 
     * to perform the practice test. With the chosen random list, the CDTT.getListOfFile() static method is called to return the 
     * path of the folder where all .wav files are stored. This function also keeps track of the number of triplets that have 
     * been completed, when a .wav file is played.
     */
    const startPracticeTest =()=> {

        // Clear keypad
        clearKeyboard();
        setAudioIsOn(true);
        setDisableKeys(false);
        setShowScorePracticeTest(false);
        
        if (ixCurrentTriplet == 0) {
            // Set the submit button value to 1
            setSubmitBtnTestVal(1);
            // Choose a random list to perform the practice test
            let tmp = getRandomList(initialValues.list);
            // Get the file
            getListOfFile(initialValues.language, initialValues.talker, tmp);
            // Make the keyboard visible
            handleVisibilityKeyboard(false);
        } else {
            // Play audio file
            playAudio(list_wav.find((val, idx) => idx === ixCurrentTriplet), speechVolume); 
        }
    }

    const getListOfFile =(language, talker, list)=> {
        var wavFile = new XMLHttpRequest();
        
        wavFile.open('GET','https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/' , 
            true)
            wavFile.onload = function() {
                var data = JSON.parse(this.response);
                
                // set the number of lists
                for (let i=0; i<data.length; i++) {
                    
                    // Check if the name of the Triplet corresponds to any
                    // of the list name
                    // ex. Triplet_List-01-EN_CA-Female
                    let nameFolder = data[i].name;
                    const paramArray = nameFolder.split("-");
                    // Array: [Language, Talker]
                    
                    // Check if all the parameters of the folder correspond to the ones selected by the user
                    if ((paramArray[0] == language) && (paramArray[1] == talker)){
                        // Found list
                        // Returns the path of folder to access it later on
                        getCorrectFile(data[i].url, list)
                    }
                    
                    // for debugging purpose
                    // console.log(tempName);
                    // console.log(paramArray);
                    // console.log(data);
                }
            }
            wavFile.send();
    }

    const [maskerAudioWav, setMaskerAudioWav] = useState("https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav"); // default wav

    const getCorrectFile =(url, list)=> {
        var file = new XMLHttpRequest();
        let maskerUrl = "";
        file.open('GET', url , true)
        file.onload = function() {
            var data = JSON.parse(this.response);
            // set the number of lists
            for (let i=0; i<data.length; i++) {
                
                // Check if the name of the Triplet corresponds to any
                // of the list name
                // ex. Triplet_List-01
                let nameFolder = data[i].name;

                // Check for masker 
                if (nameFolder == "SSNOISE.wav") {
                    maskerUrl = data[i].download_url;
                } 
                else {
                    const paramArray = nameFolder.substring(13); 
                    
                    // Check if all the parameters of the folder correspond to the ones selected by the user
                    if (paramArray == list){ 
                        // Found list
                        // Returns the path of folder to access it later on
                        if (maskerUrl == "") {
                            maskerUrl="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav"
                        }
                        setMaskerAudioWav(maskerUrl);
                        getWavFolder(data[i].url, maskerUrl);
                    }
                }
            }
        }
        file.send();
    }

    const getWavFolder=(url, maskerUrl)=>{
        // Get the folders in a list
        var wavFiles = new XMLHttpRequest();
        
        wavFiles.open('GET', url, true)
        wavFiles.onload = function() {
            var data = JSON.parse(this.response);
            
            // returns random index between 0 and data.length, then pushes 
            // the selected index number to the list, to create a random triplet
            // selection

            let i = 0;
            var tmpCorrectAnswer = [];
            // Returns a random integer between 0 and data.length
            // Mix the order of the triplets randomly
            while (data.length > 0) {
                let random = Math.floor(Math.random() * data.length);
                list_wav.push(data[random].download_url);

                // Get the correct answer triplet
                tmpCorrectAnswer[i] = data[random].name;
                // Delete .wav, keep the triplet digits
                correctAnswer.push(tmpCorrectAnswer[i].substring(0,3));
                data.splice(random, 1);
                i++; 
            }
            playAudio(list_wav.find((val, idx) => idx === 0), speechVolume);
        }
        wavFiles.send();
    }

    const [numberReversal, setNumberReversal] = useState(0);
    const [btestQuiet, setBTestQuiet] = useState(state.parameters.isTestInQuiet);
    const [initVal, setInitVal] =useState(initialValues.initialVolume);
    const [speechVolume, setSpeechVolume] = useState(initialValues.speechLevel);
    const [currentSNR, setCurrentSNR]=useState(initialValues.currentSNR);

    useEffect(() => {
        console.log("======================================================")
        console.log('| iteration: '+ ixCurrentTriplet + ', SNR = ' + currentSNR);
        console.log('| Reversal = ' + numberReversal); 
        console.log("======================================================")

    }, [ixCurrentTriplet, numberReversal, currentSNR]);

    const playAudio=(wavFile, speechVolume)=> { 
        // Create triplet and masker audio object
        var audio = new Audio(wavFile);
        var maskerNOISE = new Audio(maskerAudioWav);

        // Set the crossOrigin to 'anonymous', or else 
        // we have a CORS policy error
        audio.crossOrigin = 'anonymous';
        maskerNOISE.crossOrigin = 'anonymous';
        try {
            // Set the volume for audio
            if (initialValues.mode == "Adaptive") {
                audio.volume = speechVolume;
            } else {
                // Audio volume stays the same
                audio.volume = initialValues.speechLevel;
            }

            // Set the volume for masker
            maskerNOISE.volume = initialValues.maskerLevel;
            // No masker, test in quiet
            if (btestQuiet===true) {
                maskerNOISE.volume = 0.0;
            }
            
            // Play audio
            maskerNOISE.play();
            audio.play();

            setAudioIsOn(true);

            console.log("volume audio=" + speechVolume + " | volume masker="+ maskerNOISE.volume );

            let stopBtn = document.getElementById("btnStopTest");
            stopBtn.addEventListener("click", function () {
                // Stop audio
                maskerNOISE.pause();
                audio.pause();
            });

            // Check if user clicked on the skip to test button
            let skipBtn = document.getElementById("btnSkipToTest");
            skipBtn.addEventListener("click", function() {
                // Stop audio
                maskerNOISE.pause();
                audio.pause();
            });  

        } catch (err) {
            console.log("failed to play " + err);
        }

        // Audio is done playing
        audio.onended = function() {
            // stop audio
            maskerNOISE.pause();

            // Change value of keyboard to false
            setbNotReadyForAnswer(false);

            // Reset the practice button
            setAudioIsOn(false);
        };
    }

    // let isCorrectAnswer = false;
    const [bCorrectAnswer, setbCorrectAnswer] = useState(false);
    const [dBSTEP, setDBStep] = useState(parseFloat(0.0));
    const [nmisses, setNMisses] = useState(0);

    const gainVolume=(prevVolume, initVal)=> {
        // Gain is greater than 1.0, therefore abort test run
        if ( submitBtnTestVal == 2) {
            if (initVal > 1.00) {
                initVal = prevVolume;
                alert("The maximum volume has been reached. \nThe test run is aborted.");
                stopTest();
                return false;
            } 
    
            // If the user reached 5 misses in a row, test run is aborted.
            if (nmisses >= 5) {
                alert("The maximum number of misses have been reached. \nThe test run is aborted.");
                stopTest();
                return false;
            }
        } else {
            if (initVal > 1.00) {
                initVal = prevVolume;
            }
        }     
        return true;
    }

    const [enableKeyboard, setEnableKeyboard] = useState(true)

    const stopTest=()=> {
        setDisableStartBtn(false); // Disable stop button, enable start button
        // Set the submit button value back to zero
        setSubmitBtnTestVal(0);
        // Hide the keyboard
        setEnableKeyboard(true);
        // Clear keyboard
        clearKeyboard();
        resetKeyboardKeys();
        // Hide the status bar
        setHideTextProgress(true);
    }

    const resetKeyboardKeys = () => {
        setBDisableDelete(true);
        setBDisableSubmit(true);
        setbNotReadyForAnswer(true);
        setDisableKeys(false);
        setIxCurrentTriplet(0);
    }

    const getRandomList =(list)=> {
        // Get the list that is used for the test
        // Do not use the same list, will chose random list between the other 3 lists
        // Return integer number between 1 and 4 (both included)
        let randomList = Math.floor(Math.random() * 4) + 1;
        let tmpList = list.split(""); // list 0X

        if (randomList == tmpList[1]) {
            return getRandomList(list);
        }
        return randomList;
    }

    const keypadDigitListener =(val)=> {
        // Check if text area is already at max length or at min length
        // Don't worry about limiting the answer length,
        // this will get done when we update the text field.
        let tmpUserAnswer = inputUserText;
        let newAnswer = tmpUserAnswer.concat("", val);

        setInputUserText(newAnswer)
    
        // Update the text field and GUI buttons
        updateTextFieldKeyboard(newAnswer);
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

    const scoreCurrentTriplet =(correctAnswer, userAnswerSubmit)=> {
        if (state.parameters.tripletType == "Triplet") {
            console.log("   SCORE: correct answer: " + correctAnswer + ", user submit: " + userAnswerSubmit)
            return userAnswerSubmit == correctAnswer
        }
        return (userAnswerSubmit == correctAnswer) || scoreTestAllDigits(correctAnswer, userAnswerSubmit); 
    }

    const scoreTestAllDigits=(correctAnswer, userAnswerSubmit)=>{
        // Allow scoring with permutation
        let tmpNumCorrectDigit = 0;
        // Split the answers into arrays 
        let tmpCorrectAnswer = correctAnswer.split("");
        let tmpUserAnswer = userAnswerSubmit.split("");
    
        for (let ix = 0; ix < 3; ix++) {
            for (let jx = 0; jx < 3; jx++) {
    
                // Check if the stimulus Digit is the same as the digit entered by the user
                if (tmpCorrectAnswer[ix] == tmpUserAnswer[jx]) {
    
                    // Change the current digit value to -1 in case the same digit is 
                    // repeated more than one in the answer
                    tmpUserAnswer[jx] = -1;
    
                    // Update the number of correct digits in this triplet
                    tmpNumCorrectDigit += 1;
                    break;
                }
            }
        }
        return tmpNumCorrectDigit == 3; // for 3 correct digits
    }

    const [scorePracticeTest, setScorePracticeTest]=useState('');
    const [showScorePracticeTest, setShowScorePracticeTest]=useState(false);
    let testProgress = 0;
    let bNextDigit = true;

    const moveToTheNextTriplet=()=> {    
        // Update the progress
        progress(ixCurrentTriplet);
    
        // Return true as long as we haven't reached the end
        return (ixCurrentTriplet <= (list_wav.length-1));
    }

    const testMoveToTheNextTriplet=(currentTriplet)=> {
        // Update the progress
        progress(currentTriplet);
    
        // Return true as long as we haven't reached the end
        return (currentTriplet <= (list_wav.length-1));
    }

    const progress=(currentTriplet)=> {
        testProgress = currentTriplet;
        return testProgress;
    }

    const [resultsTriplet, setResultsTriplet]=useState({
        correctAnswer: [],
        userAnswer: [],
        completedTriplet: 0
    });

    const [testDuration, setTestDuration] = useState('');
    const [startTestTime, setStartTestTime] = useState('');
    const [testDate, setTestDate] = useState('');
    const [hideTestModalResults, setHideTestModalResults]=useState(true);

    const keypadSubmitListener =()=> {
        
        userAnswerSubmit.push(inputUserText);
        let newUserAnswer = userAnswerSubmit.find((val, i) => i === userAnswerSubmit.length-1);
    
        // Scores the answer of the current triplet
        const scoreTripletBool = scoreCurrentTriplet(correctAnswer.find((val,idx)=>idx ===ixCurrentTriplet), newUserAnswer);
        setbCorrectAnswer(scoreTripletBool);
        const tmpDBStep = computeCurrentSNR(scoreTripletBool);
        
        // Clear the previously saved subject answer
        clearKeyboard();
    
        // Practice test
        if (submitBtnTestVal == 1) {
            console.log("submit test 1" + bCorrectAnswer + ", " + scoreTripletBool)
            setDisableKeys(true);
            
            // Show the score for this triplet
            if (scoreTripletBool) {
                setScorePracticeTest("Correct Answer.");
            } else {
                setScorePracticeTest("Incorrect Answer.\nParticipant Answer: " + userAnswerSubmit.find((val,i)=>i===ixCurrentTriplet) + "\nCorrect Answer: " + correctAnswer.find((val,i)=> i===ixCurrentTriplet));
            }
            setShowScorePracticeTest(true);
            
            // Move to the next triplet
            let moveToNextTriplet = moveToTheNextTriplet();
            bNextDigit = moveToNextTriplet;
        } else {
            // console.log("submit not test 1")
            setDisableKeys(false);
            var tempVolume = 0.0;
            // Check if its the first triplet and incorrect
            if ((ixCurrentTriplet == 0) && (scoreTripletBool == false)) {
                // Repeat the first triplet
                // Play audio file and update status bar
                updateProgressStatusBar();
                tempVolume = Math.pow(10, tmpDBStep/20);
                const oldSpeechVal = speechVolume;
                setSpeechVolume((prevVolume) => tempVolume * prevVolume);
                var tmpspeechVolume = tempVolume * oldSpeechVal
                var setVolume = gainVolume(oldSpeechVal, tmpspeechVolume);
                if (setVolume) {
                    playAudio(list_wav.find((val, idx) => idx == ixCurrentTriplet), tmpspeechVolume); 
                }
            } else {
                const newCurrentTriplet = ixCurrentTriplet+1;
                var newCorrectTriplet = numCorrectTriplet;
                setIxCurrentTriplet( (i)=> i + 1);
                if (scoreTripletBool) {
                    var newCorrectTriplet = numCorrectTriplet +1;
                    setNumCorrectTriplet(numCorrectTriplet+1);
                    tempVolume = Math.pow(10, -(tmpDBStep)/20);
                    const oldSpeechVal = speechVolume;
                    setSpeechVolume((prevVolume) => tempVolume * prevVolume);
                    var tmpspeechVolume = tempVolume * oldSpeechVal
                    var setVolume = gainVolume(oldSpeechVal, tmpspeechVolume);
                } else {
                    tempVolume = Math.pow(10, tmpDBStep/20);
                    const oldSpeechVal = speechVolume;
                    setSpeechVolume((prevVolume) => tempVolume * prevVolume);
                    var tmpspeechVolume = tempVolume * oldSpeechVal
                    var setVolume = gainVolume(oldSpeechVal, tmpspeechVolume);
      
                }
    
                // Move to the next triplet
                let moveToNextTriplet = testMoveToTheNextTriplet(newCurrentTriplet);
                bNextDigit = moveToNextTriplet;

                console.log("# of correct triplet: " + newCorrectTriplet + ", # of triplets completed: " + newCurrentTriplet); 
                if (!bNextDigit || ixCurrentTriplet == 5) {
                        
                    // Update status bar
                    updateProgressStatusBar();
                    setHideTextProgress(true);
                
                    let endTime = new Date(); 
                    setResultsTriplet({
                        ...resultsTriplet,
                        correctAnswer: correctAnswer,
                        userAnswer: userAnswerSubmit,
                        completedTriplet: ixCurrentTriplet
                    });

                    // Display a message prompt that we're done. This breaks the thread execution allowing the subject to pass control to the operator
                    console.log("correct answer: " + correctAnswer + " || user: " + userAnswerSubmit + " || completed: " + ixCurrentTriplet);
                    
                    // Compute test results
                    endOfSession(bCorrectAnswer);

                    // Get the test duration and convert it to the format: min-sec
                    let duration = Math.abs(endTime.getTime() - startDateTime.getTime());
                    setTestDuration(convertMilliSecToTime(duration));
                    setTestDate(currentDate(startDateTime));
                    setStartTestTime(currentTime(startDateTime));                    
                    setHideTestModalResults(false);
                } else {  
                    // Play audio file and update status bar
                    updateProgressStatusBar();                    
                    if (setVolume) {
                        playAudio(list_wav.find((val, idx) => idx == newCurrentTriplet), tmpspeechVolume); 
                    }
                } 
            }
        }
    }

    useEffect(() => {
        const test = processUserAnswer(resultsTriplet.correctAnswer, resultsTriplet.userAnswer);
    }, [resultsTriplet])

    const [SRT, setSRT]=useState(parseFloat(0.0));
    const [STDEV, setSTDEV]=useState(parseFloat(0.0));
    const [numReversals, setnumReversals]=useState(0);

    const endOfSession=(bCorrectAnswer)=> {

        // Compute the last SNR value: this is the value that the next
        // triplet would have been presented at based on the answer to
        // te last triplet presented.
        computeCurrentSNR(bCorrectAnswer);
               
        // Compute the SRT
        // Compute the mean SNR over a given number of iterations
        setSRT(mean(SNR, 4.0, SNR.length-1));
    
        // Compute STDEV
        // Compute the standard deviation over a given number of iterations
        setSTDEV(stdDev(SNR, 4.0, SNR.length-1));
    
        // Compute the number of reversals
        // Compute then mean SNR over a given number of iterationss
        setnumReversals(sum(reversal, 4.0, reversal.length-1));
    }

    const [reversal, setReversalArray]=useState([]);

    const [textProgress, setTextProgress]=useState('');
    const [hideTextProgress, setHideTextProgress]=useState(true);
    const updateProgressStatusBar=()=> {
        setTextProgress("Set " + (testProgress + 1) + " / 24");
    }

    const [firstCorrectAnswer, setFirstCorrectAnswer] = useState(false)
    const [SNR, setSNRArray] = useState([]);
    const getSNR=(idx)=> {return parseFloat(SNR.find((val, i) => i === idx));}
    
    const detectReversal =(isCorrectAnswer, SNR)=> {
        let bReversal = false;
        let currentSNR = parseFloat(SNR);
        // Detect reversal only if we've done at least 2 iterations already
        if (ixCurrentTriplet > 1) {
            console.log("ix current triplet GREAT THAN 1")
            // Get the SNR from the previous iteration
            let previousSNR = parseInt(getSNR(ixCurrentTriplet - 2));
            // If previous SNR was ascending, look for correct answer
            // If previous SNR was descending, look for incorrect answer
            if (((currentSNR > previousSNR) && isCorrectAnswer) || ((currentSNR < previousSNR) && !isCorrectAnswer)) {
    
                // Update the reversals array with a value of 1 at current index
                const oldReversalNum = numberReversal;
                setNumberReversal((prevNumReversal) => prevNumReversal + 1);
                reversal.push(oldReversalNum+1);
                // Set return value to true
                bReversal = true;
            }
        }
        return bReversal;
    }

    const [bFirstReversal, setbFirstReversal] = useState(false);
    const computeCurrentSNR =(isCorrectAnswer)=> {

        // Initialize the SNR to the value used just before we got here
        // var currentSNR = speechVolume - initialValues.maskerLevel;
    
        if (isCorrectAnswer && firstCorrectAnswer) {
            // Set the SNR before reversal value when the first correct answer is entered
            setFirstCorrectAnswer(false);
        }
    
        // Detect if a reversal was encountered
        const tmpFirstReversal = (bFirstReversal | detectReversal(isCorrectAnswer, currentSNR));
        setbFirstReversal(tmpFirstReversal);
    
        // Set the step size for the current and future iterations
        if (!tmpFirstReversal) {
            
            setDBStep(4.0);
            var tmpDBStep = parseFloat(4.0);
        } else {
            setDBStep(2.0);
            var tmpDBStep = parseFloat(2.0);
        }
    
        // Compute the current SNR based
        if (isCorrectAnswer) {
            // Answer was correct, decrease SNR
            const oldSNR = currentSNR;
            setCurrentSNR((prevSNR) => (oldSNR - tmpDBStep));
            var tmpCurrentSNR = oldSNR - tmpDBStep;
            // Set the number of misses in a row back to zero
            setNMisses(0);
        } else {
    
            // Answer was incorrect, increase SNR
            const oldSNR = currentSNR;
            console.log("oldSNR= " + oldSNR)

            setCurrentSNR((prevSNR) => (oldSNR + tmpDBStep));
            var tmpCurrentSNR = oldSNR + tmpDBStep;
            console.log("oldSNR = "+oldSNR +", tmpDbStep = " + tmpDBStep + ", oldSNR + tmpDBSTEP = " + tmpCurrentSNR)

            // Increment the number of misses in a row
            setNMisses(nmisses+1);
        }
    
        // Update the SNR array  with the new value we just compiled
        SNR.push(parseFloat(tmpCurrentSNR));
        return tmpDBStep;
    }

    const handleVisibilityKeyboard =(val)=>{
        setEnableKeyboard(val)
    }

    const [showInstructionBtn, setInstructionBtnDisplay] = useState(false);
    const [showStartCDTT, setShowStartCDTT]=useState(false);

    const showInstructions=()=> {
        setInstructionBtnDisplay(!showInstructionBtn);
    }

    const [hidePracticeTest, setHidePracticeTest]=useState(false);

    const skipToTest=()=> {
        setHidePracticeTest(true);
        // Hide keypad
        setEnableKeyboard(true);
        // Show the start CDTT test frame
        setShowStartCDTT(true);
    }
    const [startDateTime, setStartDateTime]=useState(null);
    const [disableStartBtn, setDisableStartBtn] = useState(false);

    const startTest=()=>{
        setDisableStartBtn(true); // Disable start button, enable stop button
        // Set the submit button value to 2
        setSubmitBtnTestVal(2);
        // Start with the first triplet
        setIxCurrentTriplet(0);
        // Submit button won't be enabled until the next 
        // audio file is done playing 
        setbNotReadyForAnswer(true);
        setInitVal(initialValues.initialVolume);
        // Clear keyboard
        clearKeyboard();
        // Return the current Date & Time
        setStartDateTime(new Date());
            
        setNumCorrectTriplet(0);
        setFirstCorrectAnswer(true);
        setbCorrectAnswer(false);
        setbFirstReversal(false);
        setSRT(0.0);
        setSTDEV(0.0);
        setReversalArray([]);
        testProgress = 0;
        setAudioIsOn(false);
        setCurrentSNR(0.0);
        setDBStep(0.0);
        setNumberReversal(0);
    
        // Set the number of misses in a row to zero
        setNMisses(0);
    
        // Show progress bar
        setHideTextProgress(false);
        
        // Set the progress and progress status bar
        progress(ixCurrentTriplet);
        updateProgressStatusBar();
        setEnableKeyboard(false);
        show();
    
        // Get the list of wav files
        getListOfFile(initialValues.language, initialValues.talker, initialValues.list);
    } 

    const show=() => {
        console.log(initialValues.language + ", " + initialValues.talker + ", " + initialValues.list + ", " + initialValues.maskerLevel + ", " + initialValues.mode + ", " + initialValues.testEar + ", " + initialValues.speechLevel + ", " + initialValues.masker
        + ", " + initialValues.testInQuiet + ", " + initialValues.tripletType);
        // output on console: EN_CA, Female, 01, SSNOISE, Fix Level, Left, 65, 65, false, Triplet       (when checkbox not selected for test in quiet)
    }

    const keyboardListener = (event) => {

        // Grab the data from the text area before updating the textfield 
        const target = event.target;
        const currentAnswer = target.value
    
        // Update the text field and GUI buttons
        updateTextFieldKeyboard(currentAnswer);            
    }

    
    return (
        <>
            {!hideTestModalResults ? 
            <TestModalResults language={initialValues.language} talker={initialValues.talker} list={initialValues.list} mode={initialValues.mode} tripletType={initialValues.tripletType} testEar={initialValues.testEar} 
            masker={initialValues.masker} startingSNR={initialValues.currentSNR} SRT={SRT} STDEV={STDEV} numberReversal={numberReversal} testDate={testDate} testDuration={testDuration} startTestTime={startTestTime}
            numberTriplets={ixCurrentTriplet} correctAnswer={correctAnswer} userAnswerSubmit={userAnswerSubmit} completedTriplet={ixCurrentTriplet}/>
            : <></>}
            
            {/* <!-- This class is called when the user selects the "Next" button, on the main page. 
            It allows the user to either start a practice test, show/hide the test instructions, 
            or skip the practice test and proceed to the test 
            When the user selects the "Show Instructions" button, the button's inner HTML is 
            changed to "Hide Instructions". --> */}
            <div id="practiceTest" class="practiceTest" hidden={hidePracticeTest}>
                {/* <!-- Display the buttons to either start the practice test, see the test
                    instructions or to skip to the Test --> */}
                <table class="practiceTestBtnClass">
                    <tr id="testBtnRow">
                        {/* <!-- Start the practice test -->                         */}
                        <td><center><button type="button" id="btnPracticeTest" onClick={startPracticeTest} disabled={audioIsOn}><b>Practice</b></button></center></td>
                        {/* <!-- Show/Hide Test Instructions button--> */}
                        <td>
                            <center><button type="button" id="btnInstructions" onClick={showInstructions} hidden={!showInstructionBtn}><b>Show Instructions</b></button></center>
                            <center><button type="button" id="btnInstructions" onClick={showInstructions} hidden={showInstructionBtn}><b>Hide Instructions</b></button></center>
                        </td>
                        {/* <!-- Skip to Test Button --> */}
                        <td><center><button type="button" id="btnSkipToTest" onClick={skipToTest}><b>Skip Practice</b></button></center></td>
                    </tr>
                </table>
                
                {/* <!-- This class is called when the "Show Instructions" button
                    was selected. It shows the test instructions --> */}
                <div id="testInstructions" hidden={showInstructionBtn}>
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
                <div id="scorePracticeTest" hidden={!showScorePracticeTest}>
                    {scorePracticeTest.split("\n").map((i,key) => {
                        return <div key={key}>{i}</div>;
                    })}
                </div>

            </div>
            
            {/* <!-- This class is called when the user select the "Skip Practice Test" button.  --> */}
            <div id="startCDTT" class="startCDTT" hidden={!showStartCDTT}>
                <table>
                    <tr>
                        {/* <!-- Start Test button --> */}
                        <td><center><button type="button" id="btnStartTest" onClick={startTest} disabled={disableStartBtn}><b>Start Test</b></button></center></td>
                        {/* <!-- Stop Test button
                            By default, this button is disabled. It will be 
                            enabled once the "Start Test" button is pressed. --> */}
                        <td><center><button type="button" id="btnStopTest" onClick={stopTest} disabled={!disableStartBtn}><b>Stop Test</b></button></center></td>
                    </tr>
                </table>

                
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
                    <tr>
                        <th colspan="3">
                            <InputMask 
                                className="inputUserKeyboard" 
                                name="inputUserText" 
                                id="inputUserText" 
                                mask="999" 
                                maskChar={""} 
                                value={inputUserText} 
                                onChange={keyboardListener} 
                                disabled={!bDisableSubmit || disableKeys}
                            ></InputMask>
                        </th>
                    </tr>
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
                        <td><center><button class="keyboardBtn btnSubmit" id="btnSubmitTest" onClick={keypadSubmitListener} disabled={(bDisableSubmit || bNotReadyForAnswer) || audioIsOn}><img src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-enter.png" id="iconEnter" alt="Submit"/></button></center></td>
                    </tr>
                </table>                
           </div>

           <div className="scoreLabel">
                {/* <!-- Progress bar labels --> */}
                <p id="labelProgress" hidden={hideTextProgress}>{textProgress}</p>
           </div>    
        </>
    );
}

export default TestMainFrame;