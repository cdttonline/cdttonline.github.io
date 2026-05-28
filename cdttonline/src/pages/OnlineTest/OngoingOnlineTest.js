import React, {useEffect, useRef, useState} from "react";
import {useLocation} from "react-router-dom";
import {mean, stdDev, sum} from "../helpers/DSPutils";
import {processUserAnswer} from "../components/TestResults/ExtendedResultsTable"
import Keypad from "../components/Keypad"
import {convertMilliSecToTime, currentDate, currentTime} from "../helpers/DateTimeHelperFn";
import {Button, Card, Modal} from "react-bootstrap";
import "../App.css"
import "../components/components.css"
import {useTestMainFrameTexts} from "../translations/i18nHelpers";
import {Trans} from "react-i18next";
import ShowUserTestResults from "../components/TestResults/ShowUserTestResults";

function OngoingOnlineTest() {
    const {state} = useLocation();
    const texts = useTestMainFrameTexts();

    const initialValues = {
        language: state.parameters.language,
        talker: state.parameters.talker,
        list: state.parameters.list,
        mode: state.parameters.testMode,
        testEar: state.parameters.testEar,
        speechLevel: state.calibration.speech,
        maskerLevel: state.calibration.sliderMasker,
        initialVolume: state.calibration.speech,
        currentSNR: state.calibration.startingSNR,
        list_wav: [],
        testInQuiet: state.parameters.isTestInQuiet,
        masker: state.parameters.masker,
        tripletType: state.parameters.tripletType
    };

    // Variables
    const [inputUserText, setInputUserText] = useState("");
    const [correctAnswer, setCorrectAnswer] = useState([])
    const [userAnswerSubmit, setUserAnswerSubmit] = useState([]);
    const [list_wav, setList_wav] = useState([]);
    const [bDisableDelete, setBDisableDelete] = useState(true)
    const [bDisableSubmit, setBDisableSubmit] = useState(true);
    const [bNotReadyForAnswer, setbNotReadyForAnswer] = useState(true);
    const [disableKeys, setDisableKeys] = useState(false);
    const [ixCurrentTriplet, setIxCurrentTriplet] = useState(0);

    const clearKeyboard = () => {
        // Clear keyboard
        let clearKeyboard = inputUserText;
        clearKeyboard = "";
        updateTextFieldKeyboard(clearKeyboard);
    }

    /**
     * This function updates the textfield keyboard.
     * @param {String} answer
     */
    const updateTextFieldKeyboard = (answer) => {
        // First, trim the answer if we got more digits than we need
        if (answer.length > 3) {
            answer = answer.substring(0, 3);
        }

        if (answer.length === 0) {
            // Disable delete button
            setBDisableDelete(true);
            setBDisableSubmit(true);
        } else if (answer.length === 3) {
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
    const startPracticeTest = () => {

        // Clear keypad
        clearKeyboard();
        setAudioIsOn(true);
        setDisableKeys(false);
        setShowScorePracticeTest(false);

        if (ixCurrentTriplet === 0) {
            // Set the submit button value to 1
            setSubmitBtnTestVal(1);
            // Choose a random list to perform the practice test
            let tmp = getRandomList(initialValues.list);
            // Get the file
            console.log('init val: language', initialValues.language, ' talker:', initialValues.talker, ' list: ', tmp)
            getListOfFile(initialValues.language, initialValues.talker, tmp, initialValues.testEar);
            // Make the keyboard visible
            handleVisibilityKeyboard(false);
        } else {
            // Play audio file
            playAudio(list_wav.find((val, idx) => idx === ixCurrentTriplet), speechVolume);
        }
    }

    /**
     * Returns the number of lists offered in the dropdown triplet List
     * */
    const numOfTripletList = () => {
        if ((state.parameters.language === "EN_GH") || (state.parameters.language === "TWI_GH")) {
            // return a length of 3
            return 3;
        } else {
            // returns a length of 4 - four lists available
            return 4;
        }
    }

    const getListOfFile = (language, talker, list, inphase) => {
        var wavFile = new XMLHttpRequest();

        wavFile.open('GET', 'https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/',
            true)
        wavFile.onload = function () {
            var data = JSON.parse(this.response);

            // set the number of lists
            for (let i = 0; i < data.length; i++) {

                // Check if the name of the Triplet corresponds to any
                // of the list name
                // ex. Triplet_List-01-EN_CA-Female
                let nameFolder = data[i].name;
                const paramArray = nameFolder.split("-");
                // Array: [Language, Talker]

                // Check if all the parameters of the folder correspond to the ones selected by the user
                if ((paramArray[0] === language) && (paramArray[1].toString().toLowerCase() === talker)) {
                    // Found list
                    // Returns the path of folder to access it later on
                    getCorrectFile(data[i].url, list, inphase)
                }

                // // for debugging purpose
                // console.log(nameFolder);
                // console.log(paramArray);
                // console.log(data);
            }
        }
        wavFile.send();
    }

    const maskerAudioRef = useRef();

    const getCorrectFile = async (url, list, inphase) => {
        var file = new XMLHttpRequest();
        let maskerUrl = "";

        file.open('GET', url, true)
        file.onload = function () {
            var data = JSON.parse(this.response);
            console.log(data)
            // set the number of lists
            for (let i = 0; i < data.length; i++) {

                // Check if the name of the Triplet corresponds to any
                // of the list name
                // ex. Triplet_List-01
                let nameFolder = data[i].name;
                console.log("Processing folder/file: ", nameFolder)

                // Check for masker
                if (nameFolder === "SSNOISE.wav") {

                    maskerUrl = data[i].download_url;
                    maskerAudioRef.current = maskerUrl
                } else {
                    const paramArray = nameFolder.substring(13);

                    // Check if all the parameters of the folder correspond to the ones selected by the user
                    if (paramArray === list) {
                        // Found list
                        getPhaseType(data[i].url, inphase);
                    }
                }
            }
        }
        file.send();
    }

    const getPhaseType = (url, inphase) => {
        // Get the folders in a list
        const phaseType = new XMLHttpRequest();

        phaseType.open('GET', url, true)
        phaseType.onload = function () {
            var data = JSON.parse(this.response);

            // returns random index between 0 and data.length, then pushes
            // the selected index number to the list, to create a random triplet
            // selection
            let phaseType = 1; // Inphase
            // Check if name of file is Antiphase
            if (inphase === 'antiphase') {
                phaseType = 0
            }
            getWavFolder(data[phaseType].url);
        }

        phaseType.send()
    }

    const getWavFolder = (url) => {
        // Get the folders in a list
        const wavFiles = new XMLHttpRequest();
        wavFiles.open('GET', url, true)
        wavFiles.onload = function () {
            var data = JSON.parse(this.response);

            const newListWav = [];
            const newCorrectAnswers = [];

            // Returns a random integer between 0 and data.length
            // Mix the order of the triplets randomly
            while (data.length > 0) {
                let random = Math.floor(Math.random() * data.length);
                const url = data[random]?.download_url;
                if (url) {
                    newListWav.push(url);
                }

                const name = data[random]?.name;
                const value = name?.substring(0, 3);
                if (value) {
                    newCorrectAnswers.push(value);
                }
                data.splice(random, 1);
            }

            // Update state ONCE
            setList_wav(newListWav);
            setCorrectAnswer(newCorrectAnswers);

            // Use the fresh local array (NOT state)
            playAudio(newListWav[0], initialValues.speechLevel);
        }
        wavFiles.send();
    }

    const [numberReversal, setNumberReversal] = useState(0);
    const [speechVolume, setSpeechVolume] = useState(initialValues.speechLevel);
    const [currentSNR, setCurrentSNR] = useState(initialValues.currentSNR);

    useEffect(() => {
        console.log("=======================")
        console.log('| iteration: ' + ixCurrentTriplet + ', SNR = ' + currentSNR);
        console.log('| Reversal = ' + numberReversal);
        console.log("=======================")

    }, [ixCurrentTriplet, numberReversal, currentSNR]);

    const playAudio = (wavFile, speechVolume) => {
        // Create triplet and masker audio object
        var audio = new Audio(wavFile);
        var maskerNOISE = new Audio(maskerAudioRef.current);

        // Set the crossOrigin to 'anonymous', or else
        // we have a CORS policy error
        audio.crossOrigin = 'anonymous';
        maskerNOISE.crossOrigin = 'anonymous';
        try {
            // Set the volume for audio
            if (initialValues.mode === "adaptive") {
                audio.volume = speechVolume;
            } else {
                // Audio volume stays the same
                audio.volume = initialValues.speechLevel;
            }

            // Set the volume for masker
            maskerNOISE.volume = initialValues.maskerLevel;
            // No masker, test in quiet
            if (state.parameters.isTestInQuiet === true) {
                maskerNOISE.volume = 0.0;
            }

            // Wait about 1 second before playing the sound
            setTimeout(() => {
                // Play audio
                maskerNOISE.play();
                audio.play();
            }, 1000);

            setAudioIsOn(true);
            console.log("volume audio=" + speechVolume + " | volume masker=" + maskerNOISE.volume);

            let stopBtn = document.getElementById("btnStopTest");
            stopBtn.addEventListener("click", function () {
                // Stop audio
                maskerNOISE.pause();
                audio.pause();
            });

            // Check if user clicked on the skip to test button
            let skipBtn = document.getElementById("btnSkipToTest");
            skipBtn.addEventListener("click", function () {
                // Stop audio
                maskerNOISE.pause();
                audio.pause();
            });

            document.addEventListener('visibilitychange', function () {
                maskerNOISE.pause();
                audio.pause();
            });
        } catch (err) {
            console.log("failed to play " + err);
        }

        // Audio is done playing
        audio.onended = function () {
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
    const [nmisses, setNMisses] = useState(0);

    const [showAbortModal, setShowAbortModal] = useState(false);
    const [stringAbortModal, setStringAbortModal] = useState(0);
    const handleCloseModal = () => {
        setShowAbortModal(false);
    }
    const gainVolume = (prevVolume, initVal) => {
        // Gain is greater than 1.0, therefore abort test run
        if (submitBtnTestVal === 2) {
            if (initVal > 1.00) {
                setShowAbortModal(true);
                setStringAbortModal(0)
                stopTest();
                return false;
            }

            // If the user reached 5 misses in a row, test run is aborted.
            if (nmisses >= 5) {
                setShowAbortModal(true);
                setStringAbortModal(1)
                stopTest();
                return false;
            }
        }
        return true;
    }

    const [enableKeyboard, setEnableKeyboard] = useState(true)

    const stopTest = () => {
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

    const getRandomList = (list) => {
        // Get the list that is used for the test
        // Do not use the same list, will chose random list between the other 3 lists
        // Return integer number between 1 and 4 (both included)
        const listLength = numOfTripletList();
        console.log("list length is: ", listLength)
        let randomList = Math.floor(Math.random() * listLength) + 1;
        let tmpList = list.split(""); // list 0X
        if (randomList === tmpList[1]) {
            return getRandomList(list);
        }
        return '0' + randomList;
    }

    const keypadDigitListener = (val) => {
        // Check if text area is already at max length or at min length
        // Don't worry about limiting the answer length,
        // this will get done when we update the text field.
        let newAnswer = inputUserText.concat("", val);
        setInputUserText(newAnswer)

        // Update the text field and GUI buttons
        updateTextFieldKeyboard(newAnswer);
    }

    const keypadDeleteListener = () => {

        // Get the answer already in the text field
        let currentAnswer = inputUserText;
        setDisableKeys(false)

        // Implement backspace
        if (currentAnswer.length > 1) {
            // Remove the last digit in the answer text field
            currentAnswer = currentAnswer.substring(0, currentAnswer.length - 1);
        } else {
            // Clear the text
            currentAnswer = "";
        }

        // Update the text field and GUI buttons
        updateTextFieldKeyboard(currentAnswer);
    }

    const scoreCurrentTriplet = (correctAnswer, userAnswerSubmit) => {
        if (state.parameters.tripletType === "triplet") {
            return userAnswerSubmit === correctAnswer
        }
        return (userAnswerSubmit === correctAnswer) || scoreTestAllDigits(correctAnswer, userAnswerSubmit);
    }

    const scoreTestAllDigits = (correctAnswer, userAnswerSubmit) => {
        // Allow scoring with permutation
        let tmpNumCorrectDigit = 0;
        // Split the answers into arrays
        let tmpCorrectAnswer = correctAnswer.split("");
        let tmpUserAnswer = userAnswerSubmit.split("");

        for (let ix = 0; ix < 3; ix++) {
            for (let jx = 0; jx < 3; jx++) {

                // Check if the stimulus Digit is the same as the digit entered by the user
                if (tmpCorrectAnswer[ix] === tmpUserAnswer[jx]) {

                    // Change the current digit value to -1 in case the same digit is
                    // repeated more than one in the answer
                    tmpUserAnswer[jx] = -1;

                    // Update the number of correct digits in this triplet
                    tmpNumCorrectDigit += 1;
                    break;
                }
            }
        }
        return tmpNumCorrectDigit === 3; // for 3 correct digits
    }

    const [scorePracticeTest, setScorePracticeTest] = useState('');
    const [showScorePracticeTest, setShowScorePracticeTest] = useState(false);
    let testProgress = 0;
    let bNextDigit = true;

    const moveToTheNextTriplet = () => {
        // Update the progress
        if (ixCurrentTriplet >= (list_wav.length - 1)) {
            // Change the current triplet back to 0
            setIxCurrentTriplet(0);
        } else {
            setIxCurrentTriplet((triplet) => triplet + 1);
        }

        // Return true as long as we haven't reached the end
        return (ixCurrentTriplet <= (list_wav.length - 1));
    }

    const testMoveToTheNextTriplet = (currentTriplet) => {
        // Update the progress
        progress(currentTriplet);

        // Return true as long as we haven't reached the end
        return (currentTriplet <= (list_wav.length - 1));
    }

    const progress = (currentTriplet) => {
        testProgress = currentTriplet;
        return testProgress;
    }

    const [resultsTriplet, setResultsTriplet] = useState({
        correctAnswer: [],
        userAnswer: [],
        completedTriplet: 0
    });

    const [testDuration, setTestDuration] = useState('');
    const [startTestTime, setStartTestTime] = useState('');
    const [testDate, setTestDate] = useState('');
    const [hideTestModalResults, setHideTestModalResults] = useState(true);

    const keypadSubmitListener = () => {
        setUserAnswerSubmit(prev => [...prev, inputUserText]);

        // Scores the answer of the current triplet
        const scoreTripletBool = scoreCurrentTriplet(correctAnswer.find((val, idx) => idx === ixCurrentTriplet), inputUserText);
        // console.log("The answer submitted is " + scoreTripletBool)
        // console.log("The bCorrectAnswer is " + bCorrectAnswer)
        setbCorrectAnswer(scoreTripletBool);

        // Clear the previously saved subject answer
        clearKeyboard();

        // Practice test
        if (submitBtnTestVal === 1) {
            console.log("submit test 1" + bCorrectAnswer + ", " + scoreTripletBool)
            setDisableKeys(true);

            // Show the score for this triplet
            if (scoreTripletBool) {
                setScorePracticeTest(true); // Correct answer
            } else {
                setScorePracticeTest(false); // Incorrect answer
            }
            setShowScorePracticeTest(true);

            // Move to the next triplet
            let moveToNextTriplet = moveToTheNextTriplet();
            console.log("move to the next triplet value is equal to: " + moveToNextTriplet)
            bNextDigit = moveToNextTriplet;

        } else {
            const tmpDBStep = computeCurrentSNR(scoreTripletBool);
            setDisableKeys(false);
            var tempVolume = 0.0;
            // Check if its the first triplet and incorrect
            if ((ixCurrentTriplet === 0) && (scoreTripletBool === false)) {
                // Repeat the first triplet
                // Play audio file and update status bar
                tempVolume = Math.pow(10, tmpDBStep / 20);
                const oldSpeechVal = speechVolume;
                setSpeechVolume((prevVolume) => tempVolume * prevVolume);
                var tmpspeechVolume = tempVolume * oldSpeechVal
                var setVolume = gainVolume(oldSpeechVal, tmpspeechVolume);
                if (setVolume) {
                    playAudio(list_wav.find((val, idx) => idx === ixCurrentTriplet), tmpspeechVolume);
                }
            } else {
                const newCurrentTriplet = ixCurrentTriplet + 1;
                setIxCurrentTriplet((i) => i + 1);
                if (scoreTripletBool) {
                    setNumCorrectTriplet(numCorrectTriplet + 1);
                    tempVolume = Math.pow(10, -(tmpDBStep) / 20);
                    const oldSpeechVal = speechVolume;
                    setSpeechVolume((prevVolume) => tempVolume * prevVolume);
                    var tmpspeechVolume = tempVolume * oldSpeechVal
                    var setVolume = gainVolume(oldSpeechVal, tmpspeechVolume);
                } else {
                    tempVolume = Math.pow(10, tmpDBStep / 20);
                    const oldSpeechVal = speechVolume;
                    setSpeechVolume((prevVolume) => tempVolume * prevVolume);
                    var tmpspeechVolume = tempVolume * oldSpeechVal
                    var setVolume = gainVolume(oldSpeechVal, tmpspeechVolume);
                }

                // Move to the next triplet
                bNextDigit = testMoveToTheNextTriplet(newCurrentTriplet);

                if (!bNextDigit) {

                    // Update status bar
                    setHideTextProgress(true);

                    let endTime = new Date();
                    setResultsTriplet({
                        ...resultsTriplet,
                        correctAnswer: correctAnswer,
                        userAnswer: userAnswerSubmit,
                        completedTriplet: ixCurrentTriplet
                    });

                    // Compute test results
                    endOfSession(scoreTripletBool);

                    // Get the test duration and convert it to the format: min-sec
                    let duration = Math.abs(endTime.getTime() - startDateTime.getTime());
                    setTestDuration(convertMilliSecToTime(duration));
                    setTestDate(currentDate(startDateTime));
                    setStartTestTime(currentTime(startDateTime));
                    setHideTestModalResults(false);
                } else {
                    // Play audio file and update status bar
                    if (setVolume) {
                        playAudio(list_wav.find((val, idx) => idx === newCurrentTriplet), tmpspeechVolume);
                    }
                }
            }
        }
    }

    useEffect(() => {
        const test = processUserAnswer(resultsTriplet.correctAnswer, resultsTriplet.userAnswer);
    }, [resultsTriplet])

    const [SRT, setSRT] = useState(parseFloat(0.0));
    const [STDEV, setSTDEV] = useState(parseFloat(0.0));

    const endOfSession = (bCorrectAnswer) => {

        // Compute the SRT
        // Compute the mean SNR over a given number of iterations
        setSRT(mean(SNR, 4.0, SNR.length - 1));
        computeLastCurrentSNR(bCorrectAnswer)
        setSRT(mean(SNR, 4.0, SNR.length - 1));

        // Compute STDEV
        // Compute the standard deviation over a given number of iterations
        setSTDEV(stdDev(SNR, 4.0, SNR.length - 1));

        // Compute the number of reversals
        // Compute then mean SNR over a given number of iterationss
        setNumberReversal(sum(reversalArray, 4.0, reversalArray.length - 1));
    }

    const [reversalArray, setReversal] = useState([])

    const [hideTextProgress, setHideTextProgress] = useState(true);

    const getListLength = () => {
        if ((initialValues.language === "TWI_GH") || (initialValues.language === "EN_GH")) {
            return 27;
        }
        return 24;
    }

    const [firstCorrectAnswer, setFirstCorrectAnswer] = useState(false)
    const [SNR, setSNRArray] = useState([]);
    const getSNR = (idx) => {
        return parseFloat(SNR.find((val, i) => i === idx));
    }

    const detectReversal = (isCorrectAnswer, SNR) => {
        let bReversal = false;
        let currentSNR = parseFloat(SNR);
        // Detect reversal only if we've done at least 2 iterations already
        if (ixCurrentTriplet > 1) {
            // Get the SNR from the previous iteration
            let previousSNR = parseInt(getSNR(ixCurrentTriplet - 1));
            console.log(("currentSNR = " + currentSNR + " , previousSNR = " + previousSNR))
            console.log("isCorrectAnswer = " + isCorrectAnswer)
            // If previous SNR was ascending, look for correct answer
            // If previous SNR was descending, look for incorrect answer
            if (((currentSNR > previousSNR) && isCorrectAnswer) || ((currentSNR < previousSNR) && !isCorrectAnswer)) {
                // Update the reversals array with a value of 1 at current index
                console.log("reversal = " + (numberReversal + 1))

                setNumberReversal((prevNumReversal) => prevNumReversal + 1);
                setReversal(prev => [...prev, 1]);
                // Set return value to true
                bReversal = true;
            } else {
                setReversal(prev => [...prev, 0]);
            }
        } else {
            if (isCorrectAnswer) {
                setReversal(prev => [...prev, 0]);
            }
        }
        return bReversal;
    }

    const [bFirstReversal, setbFirstReversal] = useState(false);
    const computeCurrentSNR = (isCorrectAnswer) => {
        if (isCorrectAnswer && firstCorrectAnswer) {
            // Set the SNR before reversal value when the first correct answer is entered
            setFirstCorrectAnswer(false);
        }

        const tmpFirstReversal = (bFirstReversal | detectReversal(isCorrectAnswer, currentSNR));
        setbFirstReversal(tmpFirstReversal);

        // Set the step size for the current and future iterations
        if (!tmpFirstReversal) {
            var tmpDBStep = parseFloat(4.0);
        } else {
            var tmpDBStep = parseFloat(2.0);
        }

        // Compute the current SNR based
        const oldSNR = currentSNR;
        if (isCorrectAnswer) {
            // Answer was correct, decrease SNR
            setCurrentSNR((prevSNR) => (prevSNR - tmpDBStep));

            // Set the number of misses in a row back to zero
            setNMisses(0);
        } else {

            // Answer was incorrect, increase SNR
            setCurrentSNR((prevSNR) => (prevSNR + tmpDBStep));

            // Increment the number of misses in a row
            setNMisses(nmisses + 1);
        }

        // Update the SNR array  with the new value we just compiled
        if ((ixCurrentTriplet === 0) && !isCorrectAnswer) {
            console.log("Triplet " + (ixCurrentTriplet + 1) + " : SNR =" + oldSNR)
            return tmpDBStep;
        }
        setSNRArray(prevSNR => [...prevSNR, parseFloat(oldSNR)]);
        return tmpDBStep;
    }

    const computeLastCurrentSNR = (isCorrectAnswer) => {

        if (isCorrectAnswer && firstCorrectAnswer) {
            // Set the SNR before reversal value when the first correct answer is entered
            setFirstCorrectAnswer(false);
        }

        // Detect if a reversal was encountered
        const tmpFirstReversal = (bFirstReversal | detectReversal(isCorrectAnswer, currentSNR));
        setbFirstReversal(tmpFirstReversal);

        // Set the step size for the current and future iterations
        if (!tmpFirstReversal) {
            var tmpDBStep = parseFloat(4.0);
        } else {
            var tmpDBStep = parseFloat(2.0);
        }

        // Compute the current SNR based
        const oldSNR = currentSNR;
        if (isCorrectAnswer) {
            // Answer was correct, decrease SNR
            setSNRArray(prev => [...prev, parseFloat(oldSNR - tmpDBStep)]);

            // Set the number of misses in a row back to zero
            setNMisses(0);
        } else {
            // Answer was incorrect, increase SNR
            setSNRArray(prev => [...prev, parseFloat(oldSNR + tmpDBStep)]);

            // Increment the number of misses in a row
            setNMisses(nmisses + 1);
        }

        return tmpDBStep;
    }

    const handleVisibilityKeyboard = (val) => {
        setEnableKeyboard(val)
    }

    const [showInstructionBtn, setInstructionBtnDisplay] = useState(false);
    const [showPracticeInstructionBtn, setPracticeInstructionBtnDisplay] = useState(false);

    const [showStartCDTT, setShowStartCDTT] = useState(false);

    const showInstructions = () => {
        setInstructionBtnDisplay(!showInstructionBtn);
    }

    const showPracticeInstructions = () => {
        setPracticeInstructionBtnDisplay(!showPracticeInstructionBtn);
    }

    const [hidePracticeTest, setHidePracticeTest] = useState(false);

    const skipToTest = () => {
        setShowScorePracticeTest(false); // hide the practice test score
        setHidePracticeTest(true);
        // Hide keypad
        setEnableKeyboard(true);
        // Show the start CDTT test frame
        setShowStartCDTT(true);
        clearKeyboard();
        resetKeyboardKeys(); // reset the counters and buttons
    }
    const [startDateTime, setStartDateTime] = useState(null);
    const [disableStartBtn, setDisableStartBtn] = useState(false);

    const startTest = () => {
        setDisableStartBtn(true); // Disable start button, enable stop button
        // Set the submit button value to 2
        setSubmitBtnTestVal(2);
        // Start with the first triplet
        setIxCurrentTriplet(0);
        // Submit button won't be enabled until the next
        // audio file is done playing
        setbNotReadyForAnswer(true);

        // Reset the list of wav files
        setList_wav([]);
        setCorrectAnswer([]);

        // Enable the keyboard's keys
        setEnableKeyboard(false);
        // Clear keyboard
        clearKeyboard();
        // Return the current Date & Time
        setStartDateTime(new Date());
        setSpeechVolume(initialValues.speechLevel);
        setCurrentSNR(initialValues.currentSNR);
        setNumCorrectTriplet(0);

        setFirstCorrectAnswer(true);
        setbCorrectAnswer(false);
        setbFirstReversal(false);

        setSRT(0.0);
        setSTDEV(0.0);

        setAudioIsOn(false);
        setCurrentSNR(0.0);
        setNumberReversal(0);

        // Set the number of misses in a row to zero
        setNMisses(0);

        // Show progress bar
        setHideTextProgress(false);

        // Set the progress and progress status bar
        progress(ixCurrentTriplet);
        setEnableKeyboard(false);
        show();

        // Get the list of wav files
        getListOfFile(initialValues.language, initialValues.talker, initialValues.list, initialValues.testEar);
    }

    const show = () => {
        console.log(initialValues.language + ", " + initialValues.talker + ", " + initialValues.list + ", " + initialValues.maskerLevel + ", " + initialValues.mode + ", " + initialValues.testEar + ", " + initialValues.speechLevel + ", " + initialValues.masker
            + ", " + initialValues.testInQuiet + ", " + initialValues.tripletType);
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
                <ShowUserTestResults language={initialValues.language} talker={initialValues.talker}
                                  list={initialValues.list} mode={initialValues.mode}
                                  tripletType={initialValues.tripletType} testEar={initialValues.testEar}
                                  masker={initialValues.masker} startingSNR={initialValues.currentSNR}
                                  speech={initialValues.speechLevel} noise={initialValues.maskerLevel} SRT={SRT}
                                  STDEV={STDEV} numberReversal={numberReversal} testDate={testDate}
                                  testDuration={testDuration} startTestTime={startTestTime}
                                  numberTriplets={ixCurrentTriplet} correctAnswer={correctAnswer}
                                  userAnswerSubmit={userAnswerSubmit} completedTriplet={ixCurrentTriplet}
                                  SNRarray={SNR}/>
                : <></>}

            {/* <!-- This class is called when the user selects the "Next" button, on the main page.
            It allows the user to either start a practice test, show/hide the test instructions,
            or skip the practice test and proceed to the test
            When the user selects the "Show Instructions" button, the button's inner HTML is
            changed to "Hide Instructions". --> */}
            <div id="practiceTest" className="practiceTest" hidden={hidePracticeTest}>
                {/* <!-- Display the buttons to either start the practice test, see the test
                    instructions or to skip to the Test --> */}
                <div className="clearfix mt-2" style={{maxWidth: '600px'}}>
                    {/* <!-- Do not show extra section and go back to main page button --> */}
                    <Button type={'button'} variant={'secondary'} className="mt-2 mx-1" style={{width: '50%'}} onClick={startPracticeTest}
                            disabled={audioIsOn}>{texts.btn.practice.label}</Button>
                    <Button type={'button'} variant={'outline-secondary'} className="mt-2 mx-1" style={{width: '50%'}} onClick={showPracticeInstructions}
                            hidden={!showPracticeInstructionBtn}>{texts.btn.practice.show}</Button>
                    <Button type={'button'} variant={'outline-secondary'} className="mt-2 mx-1" style={{width: '50%'}} onClick={showPracticeInstructions}
                            hidden={showPracticeInstructionBtn}>{texts.btn.practice.hide}</Button>
                    <Button type={'button'} variant={'success'} className="mt-2 mx-1" style={{width: '50%'}} onClick={skipToTest}>{texts.btn.practice.skip}</Button>
                </div>
            </div>

            {/* <!-- This class is called when the user select the "Skip Practice Test" button.  --> */}
            <div id="startCDTT" className="startCDTT" hidden={!showStartCDTT}>
                <div className="clearfix mt-2" style={{maxWidth: '600px'}}>
                    {/* <!-- Do not show extra section and go back to main page button --> */}
                    <Button type={'button'} variant={'success'} className="mt-2 mx-1" style={{width: '50%'}}
                            onClick={startTest}
                            id="btnStartTest"
                            disabled={disableStartBtn}>{texts.btn.test.start}</Button>
                    <Button type={'button'} variant={'outline-secondary'} className="mt-2 mx-1" style={{width: '50%'}}
                            onClick={showInstructions}
                            id="btnInstructions"
                            hidden={!showInstructionBtn}>{texts.btn.test.show}</Button>
                    <Button type={'button'} variant={'outline-secondary'} className="mt-2 mx-1" style={{width: '50%'}}
                            onClick={showInstructions}
                            id="btnInstructions"
                            hidden={showInstructionBtn}>{texts.btn.test.hide}</Button>
                    <Button type={'button'} variant={'danger'} className="mt-2 mx-1" style={{width: '50%'}}
                            id="btnStopTest"
                            onClick={stopTest}
                            disabled={!disableStartBtn}>{texts.btn.test.stop}</Button>
                </div>
            </div>

            {/* <!-- This class creates the on-screen keypad for the user.
                By default, its display is set to none and its visibility
                is set to hidden as we only wwant the on-screen keypad to
                be displayed once the Practice Test or the CDTT Test has
                started. --> */}
            {/* <!-- Create keyboard to enter the answers --> */}
            <div id="keyboardCDTT" className="keyboardCDTT mb-2" name="keyboardCDTT">
                <Keypad
                    inputUserText={inputUserText}
                    keyboardListener={keyboardListener}
                    keypadDigitListener={keypadDigitListener}
                    keypadDeleteListener={keypadDeleteListener}
                    keypadSubmitListener={keypadSubmitListener}
                    disableKeys={disableKeys}
                    enableKeyboard={enableKeyboard}
                    bDisableDelete={bDisableDelete}
                    bDisableSubmit={bDisableSubmit}
                    bNotReadyForAnswer={bNotReadyForAnswer}
                    audioIsOn={audioIsOn}
                />

                {/* <!-- Show the score of the triplet for the practice test --> */}
                <div id="scorePracticeTest" className="text-center mt-2" hidden={!showScorePracticeTest}>
                    {scorePracticeTest === true ?
                        <div style={{color: "green", fontSize: "18px"}} className="fw-bold">{texts.answerLabels.is_correct}
                        </div> :
                        <div style={{color: "red", fontSize: "18px"}} className="fw-bold">
                            {texts.answerLabels.incorrect}
                            <br/>
                            {texts.answerLabels.user} {userAnswerSubmit.find((val, i) => i === (ixCurrentTriplet - 1))}
                            <br/>
                            {texts.answerLabels.correct} {correctAnswer.find((val, i) => i === (ixCurrentTriplet - 1))}
                        </div>}
                </div>
                <div className="scoreLabel">
                    {/* <!-- Progress bar labels --> */}
                    <p id="labelProgress" hidden={hideTextProgress} style={{fontSize: "13px"}}>
                        {texts.progressLabel(progress(ixCurrentTriplet+1), getListLength())}
                    </p>
                </div>
            </div>

            {/* <!-- This class is called when the "Show Instructions" button
                was selected. It shows the test instructions --> */}
            <div id="testInstructions" hidden={showInstructionBtn || !showStartCDTT} className="my-3 mx-2 pe-2">
                <Card className="mt-4 mb-2 mx-auto w-auto" style={{maxWidth: '600px'}}>
                    <Card.Body>
                        <div className="text-start">
                            <h6>{texts.testInstructions.title}</h6>
                            <ul className="pt-1 mb-0" style={{fontSize: '14px'}}>
                                <li>{texts.testInstructions.bulletPts[0]}</li>
                                <ul>
                                    <li>
                                        <Trans
                                            i18nKey={texts.testInstructions.subBulletPts[0]}
                                            components={{
                                                src: ( <img
                                                    src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-delete.png"
                                                    id="iconDelete" alt="Delete" width={20} height={14} />)
                                            }}
                                        />
                                    </li>
                                    <li>
                                        <Trans
                                            i18nKey={texts.testInstructions.subBulletPts[1]}
                                            components={{
                                                src: (<img
                                                    src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-enter.png"
                                                    id="iconEnter" alt="Submit" width={15} height={15}/>)
                                            }}
                                        />
                                    </li>
                                    <li>{texts.testInstructions.subBulletPts[2]}</li>
                                </ul>
                                <li>{texts.testInstructions.bulletPts[1]}</li>
                            </ul>
                        </div>
                    </Card.Body>
                </Card>
            </div>

            <div id="testInstructions" hidden={showPracticeInstructionBtn || hidePracticeTest} className="my-3 mx-2 pe-2">
                <Card className="mt-4 mb-2 mx-auto w-auto" style={{maxWidth: '600px'}}>
                    <Card.Body>
                        <div className="text-start">
                            <h6>{texts.practiceInstructions.title}</h6>
                            <ul className="pt-1 mb-0" style={{fontSize: '14px'}}>
                                <li>{texts.practiceInstructions.bulletPts[0]}</li>
                                <ul>
                                    <li>{texts.practiceInstructions.subBulletPts[0]}</li>
                                    <li>{texts.practiceInstructions.subBulletPts[1]}</li>
                                    <li>
                                        <Trans
                                            i18nKey={texts.practiceInstructions.subBulletPts[2]}
                                            components={{
                                                src: (<img
                                                    src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-delete.png"
                                                    id="iconDelete" alt="Delete" width={20} height={14}/>)
                                            }}
                                        />
                                    </li>
                                    <li>
                                        <Trans
                                            i18nKey={texts.practiceInstructions.subBulletPts[3]}
                                            components={{
                                                src: (<img
                                                    src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Script/Images/icon-enter.png"
                                                    id="iconEnter" alt="Submit" width={15} height={15}/>)
                                            }}
                                        />
                                    </li>
                                </ul>
                                <li>{texts.practiceInstructions.bulletPts[1]}</li>
                                <ul>
                                    <li>{texts.practiceInstructions.subBulletPts[4]}</li>
                                </ul>
                                <li>{texts.practiceInstructions.bulletPts[2]}</li>
                                <li>{texts.practiceInstructions.bulletPts[3]}</li>
                            </ul>
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <Modal
                show={showAbortModal}
                onHide={handleCloseModal}
                backdrop="static"
                keyboard={false}
            >
                <Modal.Header>
                    <Modal.Title>{texts.abortModal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="">
                    {texts.abortModal.err[stringAbortModal]}
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" onClick={handleCloseModal}>{texts.btn.ok}</button>

                </Modal.Footer>
            </Modal>
        </>
    );
}

export default OngoingOnlineTest;