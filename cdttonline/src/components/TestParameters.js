import { Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components.css"
import { useEffect, useState } from "react";
import I18N from "../I18N.json"
import React from "react";
import { useNavigate } from "react-router-dom";

export const TestParameters=()=> {
    
    const navigate = useNavigate();
    const [parameters, setParameters] = useState({
        language: "",
        talker: "",
        list: "",
        masker: "",
        startingSNR:0,
        testMode: "",
        testEar: "",
        tripletType: "",
        isTestInQuiet:""
    });

    const [calibration, setCalibration] = useState({
        speech: 0.500,
        sliderMasker: 0.5,
        noise: 0.5,
        volume: "",
        maskerValueCalib: ""
    });

    useEffect(() => {
        parameters.language = I18N.language.find((val, idx) => idx === 0);
        parameters.talker = I18N.talker.find((val, idx) => idx === 0);
        parameters.list = I18N.list.find((val, idx) => idx === 0);
        parameters.tripletType = I18N.tripletType.find((val, idx) => idx === 0);
        parameters.masker = I18N.masker;
        parameters.testMode = I18N.testMode;
        parameters.testEar = I18N.testEar;
        parameters.isTestInQuiet = false;
    }, [])
    const audioRef = React.useRef(null);
    const [isAudioPaused, setIsAudioPaused] = useState(true)

    // Populate each dropdown lists
    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name == "snr") {
            console.log(value + ".0 db")
            parameters.startingSNR = value
            calibration.speech = startingSpeechValue (parameters.startingSNR, calibration.sliderMasker)
            audioRef.current.volume = calibration.noise;
        }
        setParameters({ ...parameters, [name]: value})

        console.log(value)
    } 

    const startingSpeechValue = (SNRval, masker) => {
        let speech = (masker) * (Math.pow(10, (SNRval/20)));
        // Check if speech value is greater than 1.0
        if (speech > 1.0) {
            calibration.noise = calibration.noise - 0.1; // Decrement the masker value
            let tmpMaskerValue = parseFloat(calibration.noise);
            calibration.noise = tmpMaskerValue.toFixed(1);
            calibration.sliderMasker = calibration.sliderMasker - 0.1; 
            console.log("slide masker: = " + calibration.sliderMasker)

            // Recall the function until the speech is lower than 1.0
            return startingSpeechValue(parameters.startingSNR, calibration.sliderMasker);
        }
        console.log("slide masker: = " + calibration.sliderMasker)

        return speech.toFixed(3);
    }

    
    const handleCalibrationInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name == "volumeRangeMasker") {
            console.log(value + ".0 db")
            calibration.noise = value;
            calibration.sliderMasker = value;
            calibration.speech = startingSpeechValue (parameters.startingSNR, calibration.sliderMasker)
            audioRef.current.volume = calibration.noise;
        }
        setCalibration({ ...calibration, [name]: value})
    }

    const buttonCalibration = (isPlaying) => {
        if (isPlaying) {
            // Play masker and set text button to Pause
            audioRef.current.volume = calibration.noise;
            handlePlay();      
            
            playMasker(true)
        } else {
            // Pause masker 
            handlePause();

            playMasker(false)
        }
    }

    const handlePlay = () => {
        audioRef.current.play();
        setIsAudioPaused(false); // is playing
    }

    const handlePause = () => {
        audioRef.current.pause();
        setIsAudioPaused(true) ; // is paused
    }

    const [calledCalibrationFrame, setCalledCalibrationFrame] = useState(false);
    const playMasker = (play) => {
        // Is Masker playing or not.
        
        if (play) {
            
            // Masker playing, set the flag to true
            if (!calledCalibrationFrame) {
                
                // Reset the masker label inner html, found in the Calibration modal
                calibration.maskerValueCalib = I18N.CALIB_FRAME_MASKER + calibration.noise;
                    
                // Set the value to true so we can go to the next section
                setCalledCalibrationFrame(true);
                handleShowModal();
            } 
                       
        }
    }

    /**
     * This function is called when the user select the "Next" button, on
     * the main page. It hides the current frame and displays the test
     * practice frame.
     */
    const nextFrame = () => {
        
        // Stop sound in case it is still playing
        handlePause();
        
        // Set the flag value to false 
        setCalledCalibrationFrame(false);
        navigateToTest();

        // // Enable the "Practice Test" button, in case it was previously disabled
        // document.getElementById("btnPracticeTest").disabled = false;

        // // Hide the test parameters frame
        // document.getElementById("TestParameters").style.display = "none";

        // // Show the practice test frame
        // document.getElementById("practiceTest").style.display = "block";

        // // Display the frame used for the keyboard, with the keyboard still
        // // being hidden
        // document.getElementById("keyboardCDTT").style.display = "block";

        // document.getElementById("scorePracticeTest").innerHTML = ""; 
    }

    const navigateToTest = () => {

        const test = { parameters, calibration}
        console.log(test)
        navigate("/testMainFrame", 
            { state: {
                parameters: parameters, 
                calibration: calibration
            },
        })
    }
    
    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const handleSubmit =(e)=> {
        e.preventDefault();
        nextFrame();
    }
    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* <legend>Test Parameters</legend> */}
                {/* Test Parameters table */}
                <div class="TestParameters" id="TestParameters">
                <fieldset id="testParameterFrame">
                    <legend>Test Parameters</legend>
                    <table className="testParametersTable border-1" >
                        <tbody>
                            <tr>
                                <td>Language:</td>
                                {/* <!-- Drop-down list for the Test Language, with the following options: 
                                    (0) EN_CA, (1) FR_CA --> */}
                                <td>
                                    <select variant="secondary" name="language" onChange={handleInputChange}>
                                        {I18N.language.map((type, idx) => {
                                            // console.log(type)
                                            return(<option key={idx}>{type}</option>);
                                        })}
                                    </select>
                                </td>
                                    
                                {/* <td><select id="languageDropDownList"></select></td> */}
                                <td>Test Mode:</td>
                                {/* <!-- Drop-down list for the Test Mode, with the either fixed, 
                                    if a device doesn't support the program to change the audio 
                                    files' volume, like IOS, or Adaptive --> */}
                                <td>
                                    <select id="testModeDropDownList" name="testMode" onChange={handleInputChange}>
                                        <option>{I18N.testMode}</option>
                                    </select>
                                </td>
                            </tr>
                            {/* <!-- Row 2 : Talker and Test ear --> */}
                            <tr>
                                <td>Talker:</td>
                                {/* <!-- Drop-down list for the Test Talker, with the following options: 
                                    (0) Female, (1) Male --> */}
                                <td>
                                    <select id="talkerDropDownList" variant="secondary" name="talker" onChange={handleInputChange}>
                                        {I18N.talker.map((type, idx) => {
                                            // console.log(type.name)
                                            return(<option key={idx}>{type}</option>);
                                        })}
                                    </select>
                                </td>
                                <td>Test Ear:</td>
                                {/* <!-- Drop-down list for the Test Ear, with the following options: 
                                    (0) Diotic, (1) Antiphase --> */}
                                <td>
                                    <select id="testEarDropDownList" name="testEar" onChange={handleInputChange}>
                                        <option>{I18N.testEar}</option>
                                    </select> 
                                </td>                            
                            </tr>
                            {/* <!-- Row 3 : List # and Triplet type --> */}
                            <tr>
                                <td>List #:</td>
                                <td>
                                    <select id="listDropDownList" variant="secondary" name="list" onChange={handleInputChange}>
                                        {I18N.list.map((type, index) => {
                                            // console.log(type)
                                            return(<option key={index}>{type}</option>);
                                        })}
                                    </select>
                                </td>
                                <td>Triplet Type:</td>
                                {/* <!-- Drop-down list for the Triplet Type, with the following options: 
                                    (0) Triplet, (1) All Digit --> */}
                                <td>
                                    <select type="text" id="tripletTypeDropDownList" name="tripletType" onChange={handleInputChange}>
                                    {I18N.tripletType.map((type, index) => {
                                            // console.log(type)
                                            return(<option key={index}>{type}</option>);
                                        })}
                                    </select>
                                </td>                           
                            </tr>
                            {/* <!-- Row 4 : Masker and Test in quiet check box --> */}
                            <tr>
                                <td>Masker:</td>
                                <td>
                                    <select id="maskerDropDownList" variant="secondary" name="masker" onChange={handleInputChange}>
                                        <option>{I18N.masker}</option>
                                    </select>
                                </td>
                                <td ><input type="checkbox" name="isTestInQuiet" id="testInQuiet" onclick="testInQuiet()" onChange={handleInputChange}/>Test in quiet</td>                 
                            </tr>
                            {/* <!-- Row 5: Starting SNR --> */}
                            <tr>
                                <td>Starting SNR:</td>
                                {/* <!-- Slider range --> */}
                                <td colspan="1">
                                    <input type="range" min="-5" max="5" value={parameters.startingSNR} className="slider" id="startingSNRrange" name="snr" onChange={handleInputChange} />
                                </td>
                                {/* <!-- SNR label --> */}
                                {/* <td><label id="startingSNRdB" style="font-size: 15px; margin-left: 5px;" for="startingSNRrange">dB</label></td>   */}
                                <td><label id="startingSNRdB" for="startingSNRrange">{parameters.startingSNR}.0 dB</label></td>  
                            </tr>
                        </tbody>
                    </table>
                </fieldset>

                <fieldset id="calibrationValueFrame">
                    <legend>Internal Calibration Values</legend>

                    {/* <!-- Internal Calibration table --> */}
                    <table className="calibrationParametersTable">
                        {/* <!-- Row 1: Speech, Speech Gain input box and Play Noise button --> */}
                        <tbody>
                        <tr>
                            <td id="tdSpeechCalib" ><label id="speechLabelCalib">Speech:</label></td>
                            {/* <!-- Speech Gain input box disabled--> */}
                            <td id="tdSpeechCalib" ><input id="speechCalib" value={calibration.speech} name="speech" onChange={handleCalibrationInputChange} disabled/></td>
                            <audio id="calibMaskerAudio" src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav" type="audio/wav" ref={audioRef}></audio>
                            <td colSpan="2" id="playMaskerBtn" className="mx-auto"><button type="button" onClick={() => {buttonCalibration(true);}} id="btnCalibMaskerPlay" className="btnPlay" hidden={!isAudioPaused}>Play Noise</button>
                            <button type="button" onClick={() => {buttonCalibration(false);}} id="btnCalibMaskerPlay" className="btnPause" hidden={isAudioPaused}>Stop Noise</button></td>
                            {/* <td></td> */}
                            {/* <!-- Audio Masker --> */}
                            
                        </tr>
                        {/* <!-- Row 2: Noise --> */}
                        <tr id="trMaskerCalib">
                            <td><label id="maskerLabelCalib">Noise:</label></td>
                            
                            <td id="tdMaskerCalib">
                                {/* <!-- Masker slider --> */}
                                <input type="range" min="0.1" max="0.9" value={calibration.sliderMasker} step="0.1" className="slider" name="volumeRangeMasker" onChange={handleCalibrationInputChange}/>                        
                            </td>
                            <td id="tdMaskerCalib"><label id="maskerCalib" for="volumeRangeMasker">{calibration.noise}</label></td>
                            <td id="playMaskerBtn"></td>
                        
                        </tr>
                        </tbody>
                    </table>
                </fieldset>

                </div>
                {/* <!-- Button to go to the next frame --> */}
                <table>
                    <tr><td><center><button type="submit" id="btnNext"><b>Next</b></button></center></td></tr>
                </table>
            </form>

            {/* <!-- This class shows a calibration modal, to let the user 
            know that he should increase the system sound of his 
            device in order to hear the audio files comfortably. --> */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Calibration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please make sure to adjust your device's volume so that you can hear the noise without it being too loud.</p>
                    <p id="maskerValueCalib">Masker volume is set to : {calibration.noise}</p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" id="doneMaskerCalib" onClick={handleCloseModal}>Continue</button>

                </Modal.Footer>
            </Modal>
                
        </>
    );
}

// export default TestParameters;