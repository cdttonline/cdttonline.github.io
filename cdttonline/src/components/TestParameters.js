import { Modal} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./components.css"
import { useEffect, useState } from "react";
import I18N from "../I18N.json"
import React from "react";
import { useNavigate } from "react-router-dom";
import services from "./services";
import {doc, getDoc} from "firebase/firestore";
import {internalCalibrationCollection} from "../firebase/Firebase";

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
        speech: 0.0,
        sliderMasker: 0.5,
        noise: 0.0,
        volume: "",
        maskerValueCalib: "",
        startingSNR: 0.0
    });

    useEffect(() => {
        const fetchData = async () => {
            // const collectionRef = collection(db, 'calibrations');
            const docRef = doc(internalCalibrationCollection, 'InternalCalibration');

            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Set state with loaded values
                    setCalibration({...calibration,
                        noise: data.noise ?? 0.5,
                        speech: data.speech ?? 0.5,
                        startingSNR: data.startingSNR ?? 0.0
                    })
                } else {
                    console.log("Document doesn't exist yet.");
                }
            } catch (error) {
                console.error('Error fetching document:', error);
            }
        };

        fetchData();
    }, []);

    const [languageList, setLanguageList] = useState([]);
    // useEffect(() => {
        // console.log("getting the different languages from github");
        // fetch('https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/')
        //     .then((res) => {
        //         res.json().then((list) => {
        //             list.forEach((data) => {
        //                 console.log(data)
        //                 let nameFolder = data.name;
        //                 const paramArray = nameFolder.split("-");
        //                 const findLanguage = languageList.find((val, idx) => { val == paramArray[0] });
        //                 if (findLanguage == undefined) {
        //                     // Langue ne se trouve pas
        //                     languageList.push(paramArray[0]);
        //                 }
        //             })
        //         })
        // })
            // var wavFile = new XMLHttpRequest();
            
            // wavFile.open('GET','https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/' , 
            //     true)
            //     wavFile.onload = function() {
            //         var data = JSON.parse(this.response);
                    
            //         // set the number of lists
            //         for (let i=0; i<data.length; i++) {
                        
            //             // Check if the name of the Triplet corresponds to any
            //             // of the list name
            //             // ex. Triplet_List-01-EN_CA-Female
            //             let nameFolder = data[i].name;
            //             const paramArray = nameFolder.split("-");
            //             // Array: [Language, Talker]
                        
            //             // Check if all the parameters of the folder correspond to the ones selected by the user
            //             if ((paramArray[0] == language) && (paramArray[1] == talker)){
            //                 // Found list
            //                 // Returns the path of folder to access it later on
            //                 getCorrectFile(data[i].url, list)
            //             }
                        
            //             // for debugging purpose
            //             // console.log(tempName);
            //             // console.log(paramArray);
            //             // console.log(data);
            //         }
            //     }
            //     wavFile.send();
        // }
    // , [])

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * I18N.list.length);
        console.log("random index is: " + randomIndex)
        console.log("list length is: " + I18N.list.length)
        setSelectedIndex(I18N.list[randomIndex]);
        parameters.list = I18N.list.find((val, idx) => idx === randomIndex);
    }, [I18N.list]);

    useEffect(() => {

        // const randomIndex = Math.floor(Math.random() * I18N.list.length);
        // setSelectedIndex(I18N.list[randomIndex]);
        parameters.language = I18N.language.find((val, idx) => idx === 0);
        parameters.talker = I18N.talker.find((val, idx) => idx === 0);
        // parameters.list = I18N.list.find((val, idx) => idx === I18N.list[randomIndex]);
        parameters.tripletType = I18N.tripletType.find((val, idx) => idx === 0);
        parameters.masker = I18N.masker;
        parameters.testMode = I18N.testMode;
        parameters.testEar = I18N.testEar.find((val, idx) => idx === 0);;
        parameters.isTestInQuiet = false;
    }, [])
    const audioRef = React.useRef(null);
    const [isAudioPaused, setIsAudioPaused] = useState(true)

    // Populate each dropdown lists
    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === "snr") {
            console.log(value + ".0 db")
            // parameters.startingSNR = value
            calibration.startingSNR = value

            calibration.speech = startingSpeechValue(parameters.startingSNR, calibration.sliderMasker)
            audioRef.current.volume = calibration.noise;
            document.getElementById("talkerDropDownList").disabled = false;
        } else if (name === "language" && (value !== "EN_GH" && value !== "TWI_GH")) {
            const listDropDown = document.getElementById("listDropDownList");

            // Add the fourth element of the dropdown list (04) using innerHTML only if
            // element is not already an element of the list
            if (listDropDown.options.length === 3) {
                listDropDown.innerHTML += '<option key="3">04</option>';
            }
            document.getElementById("talkerDropDownList").disabled = false;
        } else if (name === "language" && (value === "TWI_GH" || value === "EN_GH") ) {
            // Only female talker. No male talker.
            parameters.talker = 'Female';
            document.getElementById("talkerDropDownList").value = "Female"
            document.getElementById("talkerDropDownList").disabled = true;

            // Only 3 lists (01, 02, 03) available
            document.getElementById("listDropDownList").remove(3);

            // Generate new random list value between list values of: '01', '02' and '03'
            if (parameters.list === "04") {
                const randomIndex = Math.floor(Math.random() * (I18N.list.length - 1));
                console.log("Ghana: random index is: " + randomIndex)
                console.log("ghana: list length is: " + (I18N.list.length - 1))
                setSelectedIndex(I18N.list[randomIndex]);
                parameters.list = I18N.list.find((val, idx) => idx === randomIndex);
            }
        }
        setParameters({ ...parameters, [name]: value})

        console.log(value);
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
            return startingSpeechValue(calibration.startingSNR, calibration.sliderMasker);
        }
        console.log("slide masker: = " + calibration.sliderMasker)

        return speech.toFixed(3);
    }

    /**
     * This function is called when the user select the "Next" button, on
     * the main page. It hides the current frame and displays the test
     * practice frame.
     */
    const nextFrame = () => {
        
        // Stop sound in case it is still playing
        // handlePause();
        
        // Set the flag value to false 
        // setCalledCalibrationFrame(false);
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

    const handleSubmit =(e)=> {
        e.preventDefault();
        nextFrame();
        console.log("list value is:...")
        console.log(parameters)
    }

    const [selectedIndex, setSelectedIndex] = useState(null);
    return (
        <>
            <form onSubmit={handleSubmit}>
                {/* <legend>Test Parameters</legend> */}
                {/* Test Parameters table */}
                <div className="TestParameters" id="TestParameters">
                    <fieldset id="testParameterFrame">
                        <legend>Test your hearing by listening to digit sequences</legend>
                        <div className="text-center py-1 mx-2 mb-2"
                             style={{fontSize: '14px'}}>
                             {/*// style={{border: '1px solid gray', fontSize: '15px', color: 'gray'}}>*/}
                            {/*Test your hearing by*/}
                            {/*listening to digit sequences.<br/>*/}
                            For optimal results:<br/>
                            Use a high-quality pair of earphones or earbuds<br/>
                            Choose a quiet area
                        </div>
                    </fieldset>

                    <fieldset id="testParameterFrame">
                        <legend>Test Parameters</legend>
                        <table className="testParametersTable border-1">
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
                                    {/* Disable the drop down list as there's only one test mode type */}
                                    <select id="testModeDropDownList" disabled={true} name="testMode" onChange={handleInputChange}>
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
                                <td>Test Condition:</td>
                                {/* <!-- Drop-down list for the Test Ear, with the following options: 
                                    (0) Diotic, (1) Antiphase --> */}
                                <td>
                                    {/* Disable the drop down list as there's only one test ear type */}
                                    <select id="testEarDropDownList" name="testEar" onChange={handleInputChange}>
                                        {I18N.testEar.map((type, idx) => {
                                            return (<option key={idx}>{type}</option> )
                                        })}
                                    </select> 
                                </td>                            
                            </tr>
                            {/* <!-- Row 3 : List # and Triplet type --> */}
                            <tr>
                                <td>List #:</td>
                                <td>
                                    <select
                                        id="listDropDownList"
                                        name="list"
                                        value={selectedIndex ?? ''}
                                        onChange={(e) => {
                                            setSelectedIndex(e.target.value);
                                            handleInputChange(e);
                                        }}
                                    >
                                        {I18N.list.map((type, index) => (
                                            <option key={index} value={type}>
                                                {type}
                                            </option>
                                        ))}
                                    </select>
                                    {/*<select id="listDropDownList" variant="secondary" name="list" value={selectedIndex ?? ''}*/}
                                    {/*        onChange={(e) => {*/}
                                    {/*            setSelectedIndex(e.target.value);*/}
                                    {/*            handleInputChange(e);*/}
                                    {/*        }}*/}
                                    {/*>*/}
                                    {/*    {I18N.list.map((type, index) => {*/}
                                    {/*        // console.log(type)*/}
                                    {/*        return (<option key={index}>{type}</option>);*/}
                                    {/*    })}*/}
                                    {/*</select>*/}
                                </td>
                                <td>Scoring:</td>
                                {/* <!-- Drop-down list for the Triplet Type, with the following options: 
                                    (0) Triplet, (1) All Digit --> */}
                                <td>
                                    <select type="text" id="tripletTypeDropDownList" name="tripletType"
                                            onChange={handleInputChange}>
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
                                    {/* Disable the drop down list as there's only one masker type */}
                                    <select id="maskerDropDownList" variant="secondary" disabled={true} name="masker" onChange={handleInputChange}>
                                        <option>{I18N.masker}</option>
                                    </select>
                                </td>
                                {/* <td ><input type="checkbox" name="isTestInQuiet" id="testInQuiet" onclick="testInQuiet()" onChange={handleInputChange}/>Test in quiet</td>                  */}
                            </tr>
                            {/*//  <!-- Row 5: Starting SNR -->*/}
                            {/*// <tr>*/}
                            {/*//     <td>Starting SNR:</td>*/}
                            {/*//     /!* <!-- Slider range --> *!/*/}
                            {/*//     <td colspan="1">*/}
                            {/*//         <input type="range" min="-5" max="5" value={parameters.startingSNR} className="slider" id="startingSNRrange" name="snr" onChange={handleInputChange} />*/}
                            {/*//     </td>*/}
                            {/*//     /!* <!-- SNR label --> *!/*/}
                            {/*//     /!* <td><label id="startingSNRdB" style="font-size: 15px; margin-left: 5px;" for="startingSNRrange">dB</label></td>   *!/*/}
                            {/*//     <td><label id="startingSNRdB" for="startingSNRrange">{parameters.startingSNR}.0 dB</label></td>*/}
                            {/*// </tr>*/}
                        </tbody>
                    </table>
                </fieldset>

                {/*<fieldset id="calibrationValueFrame">*/}
                {/*    <legend>Internal Calibration Values</legend>*/}

                {/*    /!* <!-- Internal Calibration table --> *!/*/}
                {/*    <table className="calibrationParametersTable">*/}
                {/*        /!* <!-- Row 1: Speech, Speech Gain input box and Play Noise button --> *!/*/}
                {/*        <tbody>*/}
                {/*        <tr>*/}
                {/*            <td id="tdSpeechCalib" ><label id="speechLabelCalib">Speech:</label></td>*/}
                {/*            /!* <!-- Speech Gain input box disabled--> *!/*/}
                {/*            <td id="tdSpeechCalib" ><input id="speechCalib" value={calibration.speech} name="speech" onChange={handleCalibrationInputChange} disabled/></td>*/}
                {/*            <audio id="calibMaskerAudio" src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav" type="audio/wav" ref={audioRef}></audio>*/}
                {/*            <td colSpan="2" id="playMaskerBtn" className="mx-auto"><button type="button" onClick={() => {buttonCalibration(true);}} id="btnCalibMaskerPlay" className="btnPlay" hidden={!isAudioPaused}>Play Noise</button>*/}
                {/*            <button type="button" onClick={() => {buttonCalibration(false);}} id="btnCalibMaskerPlay" className="btnPause" hidden={isAudioPaused}>Stop Noise</button></td>*/}
                {/*            /!* <td></td> *!/*/}
                {/*            /!* <!-- Audio Masker --> *!/*/}
                {/*            */}
                {/*        </tr>*/}
                {/*        /!* <!-- Row 2: Noise --> *!/*/}
                {/*        <tr id="trMaskerCalib">*/}
                {/*            <td><label id="maskerLabelCalib">Noise:</label></td>*/}
                {/*            */}
                {/*            <td id="tdMaskerCalib">*/}
                {/*                /!* <!-- Masker slider --> *!/*/}
                {/*                <input type="range" min="0.1" max="0.9" value={calibration.sliderMasker} step="0.1" className="slider" name="volumeRangeMasker" onChange={handleCalibrationInputChange}/>                        */}
                {/*            </td>*/}
                {/*            <td id="tdMaskerCalib"><label id="maskerCalib" for="volumeRangeMasker">{calibration.noise}</label></td>*/}
                {/*            <td id="playMaskerBtn"></td>*/}
                {/*        */}
                {/*        </tr>*/}
                {/*        </tbody>*/}
                {/*    </table>*/}
                {/*</fieldset>*/}

                </div>
                {/* <!-- Button to go to the next frame --> */}
                <table>
                    <tr><td><center><button type="submit" id="btnNext"><b>Next</b></button></center></td></tr>
                </table>
            </form>

            {/*/!* <!-- This class shows a calibration modal, to let the user */}
            {/*know that he should increase the system sound of his */}
            {/*device in order to hear the audio files comfortably. --> *!/*/}
            {/*<Modal show={showModal} onHide={handleCloseModal}>*/}
            {/*    <Modal.Header>*/}
            {/*        <Modal.Title>Calibration</Modal.Title>*/}
            {/*    </Modal.Header>*/}
            {/*    <Modal.Body>*/}
            {/*        <p>Please make sure to adjust your device's volume so that you can hear the noise without it being too loud.</p>*/}
            {/*        <p id="maskerValueCalib">The current masker volume is set to : {calibration.noise}</p>*/}
            {/*    </Modal.Body>*/}
            {/*    <Modal.Footer>*/}
            {/*        <button type="button" id="doneMaskerCalib" onClick={handleCloseModal}>Continue</button>*/}

            {/*    </Modal.Footer>*/}
            {/*</Modal>*/}
            {/*    */}
        </>
    );
}

// export default TestParameters;