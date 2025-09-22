import React, { useEffect, useState } from "react";
import "../App.css"
import I18N from "../I18N.json";
import {Button, Container, Modal} from "react-bootstrap";
import "./components.css"
import {addDoc, doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {internalCalibrationCollection} from "../firebase/Firebase";

export const InternalCalibrationValues=()=> {

    useEffect(() => {


        fetchData();
    }, []);

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
                    startingSNR: data.startingSNR ?? 0.0,
                    defaultNoise: data.defaultNoise ?? 0.5,
                    defaultSpeech: data.defaultSpeech ?? 0.5,
                    defaultStartingSNR: data.defaultStartingSNR ?? 0.0
                })
            } else {
                console.log("Document doesn't exist yet.");
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

    const audioRef = React.useRef(null);
    const [isAudioPaused, setIsAudioPaused] = useState(true)

    const [calibration, setCalibration] = useState({
        speech: 0.500,
        sliderMasker: 0.5,
        noise: 0.5,
        volume: "",
        maskerValueCalib: "",
        startingSNR: 0.0,
        defaultNoise: 0.5,
        defaultSpeech: 0.5,
        defaultStartingSNR: 0.0
    });

    const startingSpeechValue = (SNRval, masker) => {
        let speech = (masker) * (Math.pow(10, (SNRval / 20)));
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

    const setToDefaultValues = (e) => {
        const newSpeech = startingSpeechValue(calibration.defaultStartingSNR, calibration.defaultNoise)
        setCalibration({...calibration,
            noise: calibration.defaultNoise,
            speech: newSpeech,
            sliderMasker: calibration.defaultNoise,
            startingSNR: calibration.defaultStartingSNR
        })
        audioRef.current.volume = calibration.defaultNoise
        calibration.speech = newSpeech
        calibration.noise = calibration.defaultNoise
        calibration.startingSNR = calibration.defaultStartingSNR
        setIsDisabled(true)

        // Make the change in the database
        try {
            saveInternalCalibration(e)
        } catch {
            console.log("Error when saving the calibrations to the default values")
        }
    }

    const handleCalibrationInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === "volumeRangeMasker") {
            console.log(value + ".0 db")
            calibration.noise = value;
            calibration.sliderMasker = value;
            calibration.speech = startingSpeechValue(calibration.startingSNR, calibration.sliderMasker)
            audioRef.current.volume = calibration.noise;
        } else if (name === "snr") {
            console.log(value + ".0 db")
            // parameters.startingSNR = value
            calibration.startingSNR = value

            calibration.speech = startingSpeechValue(calibration.startingSNR, calibration.sliderMasker)
            audioRef.current.volume = calibration.noise;
        }
        setCalibration({...calibration, [name]: value})
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name === "snr") {
            console.log(value + ".0 db")
            // parameters.startingSNR = value
            calibration.startingSNR = value

            calibration.speech = startingSpeechValue(calibration.startingSNR, calibration.sliderMasker)
            audioRef.current.volume = calibration.noise;
        }

    }

    const cancelChanges = async () => {
        fetchData()
        setIsDisabled(true)
    }

    const handlePlay = () => {
        audioRef.current.play();
        setIsAudioPaused(false); // is playing
    }

    const handlePause = () => {
        audioRef.current.pause();
        setIsAudioPaused(true); // is paused
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

    const [showModal, setShowModal] = useState(false);

    const [calledCalibrationFrame, setCalledCalibrationFrame] = useState(false);
    const handleShowModal = () => setShowModal(true);
    const handleCloseModal = () => setShowModal(false);
    const [isDisabled, setIsDisabled] = useState(true)

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

    const saveInternalCalibration = async (e) => {
        e.preventDefault()
        const docRef = doc(internalCalibrationCollection, "InternalCalibration");
        const speechNumber = parseFloat(calibration.speech);
        const noiseNumber = parseFloat(calibration.noise);
        const startingSNR = parseFloat(calibration.startingSNR)

        try {
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // Document doesn't exist, create it first
                await setDoc(docRef, {
                    speech: speechNumber,
                    noise: noiseNumber,
                    startingSNR: startingSNR,
                    defaultSpeech: calibration.defaultSpeech,
                    defaultNoise: calibration.defaultNoise,
                    defaultStartingSNR: calibration.defaultStartingSNR
                });
                console.log("Document created with initial values.");
            } else {
                // Document exists, update it
                await updateDoc(docRef, {
                    speech: speechNumber,
                    noise: noiseNumber,
                    startingSNR: startingSNR
                });
                console.log("Document updated with new values.");
            }
        } catch (error) {
            console.error("Error accessing or updating Firestore:", error);
        }

        setIsDisabled(true)
    };

    return (
        <>
            <Container>
                <div className="TestParameters" id="TestParameters">
                    <h3 className="mt-3 fw-bold mb-3">Internal Calibration Values</h3>
                    <div className="calibBtn d-flex justify-content-between">
                        {isDisabled ?
                            <Button onClick={() => {
                                setIsDisabled(false)
                            }} className="dataMenuBtn m-0">Edit
                                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                     fill="currentColor" className="ms-2 bi bi-pencil-fill"
                                     viewBox="0 0 18 18">
                                    <path
                                        d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                </svg>
                            </Button> :
                            <>
                                <div></div>
                            </>
                        }
                        <Button onClick={setToDefaultValues} className="btn btn-dark m-0">Reset to Default</Button>
                    </div>
                            <form onSubmit={saveInternalCalibration}>
                                <fieldset id="calibrationValueFrame">

                                    {/* <!-- Internal Calibration table --> */}
                                    <table className="calibrationParametersTable">
                                        {/* <!-- Row 1: Speech, Speech Gain input box and Play Noise button --> */}
                                        <tbody>
                                        {/* <!-- Row 5: Starting SNR --> */}
                                        <tr>
                                            <td>Starting SNR:</td>
                                            <td colspan="1" id="tdMaskerCalib">
                                                <input type="range" min="-5" max="5" value={calibration.startingSNR}
                                                       className="slider" id="startingSNRrange" name="snr"
                                                       onChange={handleCalibrationInputChange} disabled={isDisabled}/>
                                            </td>
                                            {/* <!-- SNR label --> */}
                                            {/* <td><label id="startingSNRdB" style="font-size: 15px; margin-left: 5px;" for="startingSNRrange">dB</label></td>   */}
                                            <td id="tdMaskerCalib"><label id="startingSNRdB" for="startingSNRrange"
                                                                          className="mx-auto">{calibration.startingSNR}.0
                                                dB</label></td>
                                        </tr>
                                        <tr>
                                            <td id="tdSpeechCalib" className="mx-auto"><label
                                                id="speechLabelCalib">Speech:</label></td>
                                            {/* <!-- Speech Gain input box disabled--> */}
                                            <td colSpan="2" id="tdSpeechCalib" className="mx-auto"><input
                                                id="speechCalib"
                                                value={calibration.speech}
                                                name="speech"
                                                onChange={handleCalibrationInputChange}
                                                disabled/>
                                            </td>
                                            <audio id="calibMaskerAudio"
                                                   src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav"
                                                   type="audio/wav" ref={audioRef}></audio>
                                            <td colSpan="2" id="playMaskerBtn" className="mx-auto">
                                                <button type="button" onClick={() => {
                                                    buttonCalibration(true);
                                                }} id="btnCalibMaskerPlay" className="btnPlay" hidden={!isAudioPaused}>Play
                                                    Noise
                                                </button>
                                                <button type="button" onClick={() => {
                                                    buttonCalibration(false);
                                                }} id="btnCalibMaskerPlay" className="btnPause" hidden={isAudioPaused}>Stop
                                                    Noise
                                                </button>
                                            </td>
                                            {/* <td></td> */}
                                            {/* <!-- Audio Masker --> */}

                                        </tr>
                                        {/* <!-- Row 2: Noise --> */}
                                        <tr id="trMaskerCalib">
                                            <td><label id="maskerLabelCalib">Noise:</label></td>

                                            <td id="tdMaskerCalib">
                                                {/* <!-- Masker slider --> */}
                                                <input type="range" min="0.1" max="0.9" value={calibration.sliderMasker}
                                                       step="0.1"
                                                       className="slider" name="volumeRangeMasker"
                                                       onChange={handleCalibrationInputChange} disabled={isDisabled}/>
                                            </td>
                                            <td id="tdMaskerCalib"><label id="maskerCalib"
                                                                          for="volumeRangeMasker">{calibration.noise}</label>
                                            </td>
                                            <td id="playMaskerBtn"></td>

                                        </tr>
                                        </tbody>
                                    </table>
                                </fieldset>

                                {/*<button type="submit">Save Values</button>*/}
                                {/*<button type="submit">Cancel</button>*/}
                                {/*<button type="submit">Edit</button>*/}
                                {/*<button type="submit">Reset to Default</button>*/}
                                {!isDisabled ?
                                    <div className="d-flex justify-content-center">
                                        <Button type="submit" className="dataMenuBtn mb-0 ms-0">Save Values
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="ms-2 bi bi-check-circle"
                                                 viewBox="0 0 18 18">
                                                <path
                                                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                <path
                                                    d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                                            </svg>
                                        </Button>
                                        <Button onClick={cancelChanges} className="mb-0 ms-0" variant={"secondary"}>Cancel
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="ms-2 bi bi-x-circle"
                                                 viewBox="0 0 18 18">
                                                <path
                                                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                <path
                                                    d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708"/>
                                            </svg>
                                        </Button>
                                    </div> : <></>
                                }
                            </form>
                </div>
            </Container>

            {/* <!-- This class shows a calibration modal, to let the user
            know that he should increase the system sound of his
            device in order to hear the audio files comfortably. --> */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>Calibration</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Please make sure to adjust your device's volume so that you can hear the noise without it
                        being too loud.</p>
                    <p id="maskerValueCalib">The current masker volume is set to : {calibration.noise}</p>
                </Modal.Body>
                <Modal.Footer>
                    <button type="button" id="doneMaskerCalib" onClick={handleCloseModal}>Continue</button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

// export default InternalCalibrationValues;