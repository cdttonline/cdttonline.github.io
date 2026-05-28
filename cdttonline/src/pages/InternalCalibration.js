import React, { useEffect, useState } from "react";
import "../App.css"
import I18N from "../I18N.json";
import {Button, Card, Container, Form, Modal} from "react-bootstrap";
import "../components/components.css"
import {doc, getDoc, setDoc, updateDoc} from "firebase/firestore";
import {internalCalibrationCollection} from "../firebase/Firebase";
import ValidateFn from "../helpers/ValidationFn";
import {useInternalCalibrationsTexts} from "../translations/i18nHelpers";

export const InternalCalibrationValues=()=> {
    const texts = useInternalCalibrationsTexts()

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        const docRef = doc(internalCalibrationCollection, 'InternalCalibration');

        try {
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
                const data = docSnap.data();
                setNumMissesInRow(data.num_of_misses_in_a_row ?? 5)

                // Set state with loaded values
                setCalibration((prev) => ({
                    ...prev,
                    antiphase: {
                        ...prev.antiphase,
                        speech: data.antiphase_speech ?? 0.5,
                        noise: data.antiphase_noise ?? 0.5,
                        starting_SNR: data.antiphase_starting_SNR ?? 0.0,
                        default_noise: data.antiphase_default_noise ?? 0.5,
                        default_speech: data.antiphase_default_speech ?? 0.5,
                        default_starting_SNR: data.antiphase_default_starting_SNR ?? 0.0
                    },
                    diotic: {
                        ...prev.diotic,
                        speech: data.diotic_speech ?? 0.5,
                        noise: data.diotic_noise ?? 0.5,
                        starting_SNR: data.diotic_starting_SNR ?? 0.0,
                        default_noise: data.diotic_default_noise ?? 0.5,
                        default_speech: data.diotic_default_speech ?? 0.5,
                        default_starting_SNR: data.diotic_default_starting_SNR ?? 0.0
                    },
                    numOfMisses: data.num_of_misses_in_a_row ?? 5,
                    defaultNumOfMisses: data.default_num_of_misses_in_a_row ?? 5
                }));
            } else {
                console.log("Document doesn't exist yet.");
            }
        } catch (error) {
            console.error('Error fetching document:', error);
        }
    };

    const audioRef = React.useRef(null);
    const [isAudioPaused, setIsAudioPaused] = useState(true)

    const [calibType, setCalibType] = useState(null); // Get first element of test Ear {Diotic, Antiphase}
    const [pendingCalibType, setPendingCalibType] = useState(I18N.testEar[0]); // saved value

    const calibTypeMap = {
        Diotic: "diotic",
        Antiphase: "antiphase",
    };

    const activeCalibKey = calibTypeMap[calibType];

    const [calibration, setCalibration] = useState({
        antiphase: {
            speech: 0.500,
            sliderMasker: 0.5,
            noise: 0.5,
            volume: 0.5,
            maskerValueCalib: "",
            starting_SNR: 0.0,
            default_noise: 0.5,
            default_speech: 0.5,
            default_starting_SNR: 0.0,
        },
        diotic: {
            speech: 0.500,
            sliderMasker: 0.5,
            noise: 0.5,
            volume: 0.5,
            maskerValueCalib: "",
            starting_SNR: 0.0,
            default_noise: 0.5,
            default_speech: 0.5,
            default_starting_SNR: 0.0,
        },
        numOfMisses: 5,
        defaultNumOfMisses: 5
    });

    const startingSpeechValue = (SNRval, masker) => {
        let speech = (masker) * (Math.pow(10, (SNRval / 20)));
        // Check if speech value is greater than 1.0
        if (speech > 1.0) {
            calibration[activeCalibKey].noise = calibration[activeCalibKey].noise - 0.1; // Decrement the masker value
            let tmpMaskerValue = parseFloat(calibration[activeCalibKey].noise);
            calibration[activeCalibKey].noise = tmpMaskerValue.toFixed(1);
            calibration[activeCalibKey].sliderMasker = calibration[activeCalibKey].sliderMasker - 0.1;
            console.log("(diotic) masker: = " + calibration[activeCalibKey].sliderMasker)

            // Recall the function until the speech is lower than 1.0
            return startingSpeechValue(calibration[activeCalibKey].starting_SNR, calibration[activeCalibKey].sliderMasker);
        }
        console.log(`(${calibType}) slide masker: = ` + calibration[activeCalibKey].sliderMasker)

        return speech.toFixed(3);
    }

    const setToDefaultValues = (e) => {
        // Change to the default speech value of the current calibration type
        const newSpeech = startingSpeechValue(calibration[activeCalibKey].default_starting_SNR, calibration[activeCalibKey].default_noise)

        /** Reset the calibration value to default */
        setCalibration((prev) => ({
            ...prev,
            [activeCalibKey]: {
                ...prev[activeCalibKey],
                speech: newSpeech,
                sliderMasker: calibration[activeCalibKey].default_noise,
                noise: calibration[activeCalibKey].default_noise,
                starting_SNR: calibration[activeCalibKey].default_starting_SNR
            }
        }));

        audioRef.current.volume = calibration[activeCalibKey].default_noise
        calibration[activeCalibKey].speech = newSpeech
        calibration[activeCalibKey].noise = calibration[activeCalibKey].default_noise
        calibration[activeCalibKey].starting_SNR = calibration[activeCalibKey].default_starting_SNR

        setIsDisabled(true)

        // Make the change in the database
        try {
            saveInternalCalibration(e)
        } catch {
            console.log("Error when saving the calibrations to the default values")
        }
    }

    const setToDefaultNumOfMissesInARow = (e) => {
        setCalibration((prev) => ({
            ...prev,
            numOfMisses: calibration.defaultNumOfMisses
        }));

        calibration.numOfMisses = calibration.defaultNumOfMisses
        // numOfMissesInRow = calibration.defaultNumOfMisses
        console.log("new calibration.defaultNumOfMisses = " + calibration.defaultNumOfMisses)
        console.log("numOfMisses = " + calibration.numOfMisses)
        try {
            saveNumOfMissesInternalCalibration(e)
        } catch {
            console.log("Error when saving the calibrations to the default values")
        }

        console.log("after saving = new calibration.defaultNumOfMisses = " + calibration.defaultNumOfMisses)
        console.log("numOfMisses = " + numOfMissesInRow)
    }

    const handleCalibrationInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        console.log(`calibration[${activeCalibKey}].speech = ${calibration[activeCalibKey].speech}`)
        console.log(`calibration[${activeCalibKey}].noise = ${calibration[activeCalibKey].noise}`)

        if (name === "volumeRangeMasker") {
            console.log(value + ".0 db")
            calibration[activeCalibKey].noise = value;
            calibration[activeCalibKey].sliderMasker = value;
            calibration[activeCalibKey].speech = startingSpeechValue(calibration[activeCalibKey].starting_SNR, calibration[activeCalibKey].sliderMasker)
            audioRef.current.volume = calibration[activeCalibKey].noise;
        } else if (name === "snr") {
            console.log(value + ".0 db")
            // parameters.startingSNR = value
            calibration[activeCalibKey].starting_SNR = value

            calibration[activeCalibKey].speech = startingSpeechValue(calibration[activeCalibKey].starting_SNR, calibration[activeCalibKey].sliderMasker)
            audioRef.current.volume = calibration[activeCalibKey].noise;
        }

        setCalibration((prev) => ({
            ...prev,
            [activeCalibKey]:
                {
                    ...prev[activeCalibKey],
                    [name]: value
                }
        }))
    }

    const handlePendingCalibrationTypeChange = (event) => {
        const target = event.target;
        const value = target.value;

        // Set the calibration type to the new value
        setPendingCalibType(value);

        // Set the commited calibration value to null if the value is different
        // from current value being used
        if (value !== calibType) {
            setCalibType(null)
            setIsAudioPaused(true);
        }

        // Reset the edit button to false, in case the user was editing the values
        cancelChanges()
    }

    const handleChangeNumOfMisses = (event) => {
        const target = event.target;

        // Change the number of misses in a row
        const newValue = event.target.value.replace(/\D/, "");
        setNumMissesInRow(newValue)
        setCalibration((prev) => ({
            ...prev,
            numOfMisses: newValue
        }));
    }

    const handleCalibrationTypeChange = () => {
        setCalibType(pendingCalibType); // commit changes
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
            audioRef.current.volume = calibration[activeCalibKey].noise;
            handlePlay();
            playMasker(true)
        } else if (!isPlaying) {
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
                calibration[activeCalibKey].maskerValueCalib = I18N.CALIB_FRAME_MASKER + calibration[activeCalibKey].noise;

                // Set the value to true so we can go to the next section
                setCalledCalibrationFrame(true);
                handleShowModal();
            }
        }
    }

    const saveInternalCalibration = async (e) => {
        e.preventDefault()
        const docRef = doc(internalCalibrationCollection, "InternalCalibration");
        const diotic_speechNumber = parseFloat(calibration["diotic"].speech);
        const diotic_noiseNumber = parseFloat(calibration["diotic"].noise);
        const diotic_startingSNR = parseFloat(calibration["diotic"].starting_SNR)
        const antiphase_speechNumber = parseFloat(calibration["antiphase"].speech);
        const antiphase_noiseNumber = parseFloat(calibration["antiphase"].noise);
        const antiphase_startingSNR = parseFloat(calibration["antiphase"].starting_SNR)

        try {
            const docSnap = await getDoc(docRef);

            if (!docSnap.exists()) {
                // Document doesn't exist, create it first
                await setDoc(docRef, {
                    antiphase_speech: antiphase_speechNumber,
                    antiphase_noise: antiphase_noiseNumber,
                    antiphase_starting_SNR: antiphase_startingSNR,
                    antiphase_default_noise: calibration["antiphase"].default_noise,
                    antiphase_default_speech: calibration["antiphase"].default_speech,
                    antiphase_default_starting_SNR: calibration["antiphase"].default_starting_SNR,
                    diotic_speech: diotic_speechNumber,
                    diotic_noise: diotic_noiseNumber,
                    diotic_starting_SNR: diotic_startingSNR,
                    diotic_default_noise: calibration["diotic"].default_noise,
                    diotic_default_speech: calibration["diotic"].default_speech,
                    diotic_default_starting_SNR: calibration["diotic"].default_starting_SNR
                });
                console.log("Document created with initial values.");
            } else {
                /** Document exists, update it */

                // Update if the current calibration type is antiphase
                if (activeCalibKey === "diotic") {
                    // Update if current calibration type is diotic
                    await updateDoc(docRef, {
                        diotic_speech: diotic_speechNumber,
                        diotic_noise: diotic_noiseNumber,
                        diotic_starting_SNR: diotic_startingSNR,
                    });
                } else if (activeCalibKey === "antiphase") {
                    // Update if current calibration type is diotic
                    await updateDoc(docRef, {
                        antiphase_speech: antiphase_speechNumber,
                        antiphase_noise: antiphase_noiseNumber,
                        antiphase_starting_SNR: antiphase_startingSNR
                    });
                }
                console.log("Document updated with new values.");
            }
        } catch (error) {
            console.error("Error accessing or updating Firestore:", error);
        }

        setIsDisabled(true)
    };

    const [formDataError, setFormDataError] = useState([]);

    const isInvalid = calibration.numOfMisses !== "" && (calibration.numOfMisses < 1 || calibration.numOfMisses > 10)

    const saveNumOfMissesInternalCalibration = async (e) => {
        e.preventDefault()
        console.log("calibration num of mises = ", calibration.numOfMisses)
        const validationResult = ValidateFn.validateNumberOfMissesInARow(calibration);
        setFormDataError(validationResult);

        let flag = false;
        for (let i = 0; i < validationResult.length; i++) {
            console.log(`validationResults[${i}] = ${validationResult[i]}`)
            if (validationResult[i] !== "") {
                console.log(`-- Flag for [i]=${i} = true`)
                flag = true;
            }
        }

        if (flag === true) {
            console.log("there are still errors to fix");
        } else {
            const docRef = doc(internalCalibrationCollection, "InternalCalibration");
            if (formDataError[0] === true) {
                console.log("there are still errors to fix");
            } else {
                try {
                    const docSnap = await getDoc(docRef);

                    if (!docSnap.exists()) {
                        // Document doesn't exist, create it first
                        await setDoc(docRef, {
                            num_of_misses_in_a_row: numOfMissesInRow,
                            default_num_of_misses_in_a_row: calibration.defaultNumOfMisses
                        });
                        console.log("Document created with initial values.");
                    } else {
                        /** Document exists, update it */
                        await updateDoc(docRef, {
                            num_of_misses_in_a_row: calibration.numOfMisses
                        });
                    }
                } catch (error) {
                    console.error("Error accessing or updating Firestore:", error);
                }

                setIsDisabled(true);
            }
        }
    };

    const [numOfMissesInRow, setNumMissesInRow] = useState(null)

    return (
        <>
            <Container>
                <div className="TestParameters" id="TestParameters">
                    <h3 className="mt-3 fw-bold mb-3">{texts.title}</h3>

                    <form onSubmit={saveInternalCalibration}>
                        <Card className="m-2 mb-3">
                            <Card.Body id="calibrationValueFrame" className="diotic" disabled>
                                <div className="text-start">
                                    <label htmlFor="numOfMisses"
                                           className="form-label mb-0 fw-medium mb-2">{texts.label.num_misses_row}</label>

                                    <div className="d-flex align-items-baseline flex-wrap gap-2 gap-md-4 text-start">

                                        <Form.Group>
                                            <Form.Control
                                                type="text"
                                                inputMode="numeric"
                                                className="form-control border"
                                                name="numOfMisses"
                                                pattern="[0-9]*"
                                                id="numOfMisses"
                                                min="2"
                                                max="10"
                                                maxLength="2"
                                                style={{maxWidth: '100px'}}
                                                value={calibration.numOfMisses}
                                                onChange={handleChangeNumOfMisses}
                                                isInvalid={isInvalid}
                                            />
                                            { isInvalid ? (
                                                <Form.Control.Feedback type="invalid">
                                                    {formDataError[0] ?? texts.invalid.numMissesRow}
                                                </Form.Control.Feedback>
                                                ) : (
                                                <></>
                                            )}

                                        </Form.Group>

                                        <Button className="dataMenuBtn m-0"
                                                onClick={saveNumOfMissesInternalCalibration}>{texts.btn.numMissesRow.save}</Button>
                                        <Button className="btn btn-dark m-0"
                                                onClick={setToDefaultNumOfMissesInARow}>{texts.btn.numMissesRow.reset}</Button>
                                    </div>
                                </div>

                            </Card.Body>
                        </Card>
                        <Card className="m-2 mb-3">
                            <Card.Body id="calibrationValueFrame" className="diotic" disabled>
                                <div className="d-grid gap-2 gap-md-4 d-flex align-items-center w-auto">
                                    <label htmlFor="calibrationType"
                                           className="form-label mb-0 fw-medium">{texts.label.type}</label>

                                    <Form.Select
                                        id="calibrationType"
                                        name="calibrationType"
                                        value={pendingCalibType}
                                        onChange={handlePendingCalibrationTypeChange}
                                        style={{maxWidth: '130px'}}
                                    >
                                        <option value={I18N.testEar[0]}>{I18N.testEar[0]}</option>
                                        <option value={I18N.testEar[1]}>{I18N.testEar[1]}</option>
                                    </Form.Select>

                                    <Button className="dataMenuBtn m-0"
                                            onClick={handleCalibrationTypeChange}>{texts.btn.go}</Button>
                                </div>

                                {calibType != null ?
                                    <div>
                                        <div className="mt-3 d-flex justify-content-between">
                                            {isDisabled ?
                                                <Button onClick={() => {
                                                    setIsDisabled(false)
                                                }} className="dataMenuBtn m-0">{texts.btn.edit}
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
                                            <Button
                                                onClick={setToDefaultValues}
                                                className="btn btn-dark m-0"
                                            >
                                                {texts.btn.reset(calibType)}
                                            </Button>
                                        </div>

                                        <hr className="my-3"/>
                                        <h5 className="text-center mb-2">{calibType}</h5>

                                        {/* <!-- Internal Calibration table --> */}
                                        <div className="d-md-flex col-sm-12">
                                            <table className="calibrationParametersTable col-md-9">
                                                <tbody>
                                                <tr>
                                                    <td className="form-label fw-medium">Starting SNR:</td>
                                                    <td colSpan="2" id="tdMaskerCalib">
                                                        <div className="d-flex align-items-center flex-row">
                                                            <Form.Range
                                                                type="range"
                                                                min="-6"
                                                                max="6"
                                                                value={calibration[activeCalibKey].starting_SNR}
                                                                className="form-range slider pe-1"
                                                                id="startingSNRrange"
                                                                name="snr"
                                                                onChange={handleCalibrationInputChange}
                                                                disabled={isDisabled}
                                                            />
                                                            <label id="startingSNRdB" htmlFor="snr_diotic"
                                                                   className="ps-1">{calibration[activeCalibKey].starting_SNR}.0
                                                                dB</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td id="tdSpeechCalib" className="form-label fw-medium"><label
                                                        id="speechLabelCalib">Speech:</label></td>
                                                    {/* <!-- Speech Gain input box disabled--> */}
                                                    <td colSpan="2" id="tdSpeechCalib">
                                                        <Form.Control
                                                            disabled
                                                            id="speechCalib"
                                                            value={calibration[activeCalibKey].speech}
                                                            name="speech"
                                                            style={{fontSize: "14px"}}
                                                            className="form-control border p-1"
                                                            onChange={handleCalibrationInputChange}
                                                        />
                                                    </td>
                                                    <audio id="calibMaskerAudio"
                                                           src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav"
                                                           type="audio/wav" ref={audioRef}></audio>
                                                </tr>
                                                {/* <!-- Row 2: Noise --> */}
                                                <tr>
                                                    <td className="form-label fw-medium">Noise:</td>

                                                    <td colSpan="2" id="tdMaskerCalib">
                                                        {/* <!-- Masker slider --> */}
                                                        <div className="d-flex align-items-center flex-row">
                                                            <Form.Range
                                                                type="range"
                                                                min="0.1"
                                                                max="0.9"
                                                                step="0.1"
                                                                value={calibration[activeCalibKey].sliderMasker}
                                                                className="form-range slider pe-1"
                                                                id="startingSNRrange"
                                                                name="volumeRangeMasker"
                                                                onChange={handleCalibrationInputChange}
                                                                disabled={isDisabled}
                                                            />
                                                            <label id="maskerCalib" className="ps-1"
                                                                   htmlFor="volumeRangeMasker">{calibration[activeCalibKey].noise}</label>
                                                        </div>
                                                    </td>
                                                </tr>
                                                </tbody>
                                            </table>
                                            <div id="playMaskerBtn" className="mx-auto my-auto">
                                                <Button type="button" variant={"success"} onClick={() => {
                                                    buttonCalibration(true);
                                                }} id="btnCalibMaskerPlay" className="btnPlay"
                                                        hidden={!isAudioPaused}>{texts.btn.noise.play}
                                                </Button>
                                                <Button type="button" variant={"danger"} onClick={() => {
                                                    buttonCalibration(false);
                                                }} id="btnCalibMaskerPlay"
                                                        hidden={isAudioPaused}>{texts.btn.noise.stop}
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    : <></>}

                                {!isDisabled ?
                                    <div className="d-flex justify-content-center mt-3">
                                        <Button type="submit"
                                                className="dataMenuBtn mb-0 ms-0 me-1">{texts.btn.save}
                                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                                 fill="currentColor" className="ms-2 bi bi-check-circle"
                                                 viewBox="0 0 18 18">
                                                <path
                                                    d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16"/>
                                                <path
                                                    d="m10.97 4.97-.02.022-3.473 4.425-2.093-2.094a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05"/>
                                            </svg>
                                        </Button>
                                        <Button onClick={cancelChanges} className="mb-0 ms-1"
                                                variant={"secondary"}>{texts.btn.cancel}
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
                            </Card.Body>
                        </Card>
                    </form>
                </div>
            </Container>

            {/* <!-- This class shows a calibration modal, to let the user
            know that he should increase the system sound of his
            device in order to hear the audio files comfortably. --> */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header>
                    <Modal.Title>{texts.modal.title}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{texts.modal.body1}</p>
                    <p id="maskerValueCalib">
                        {texts.modal.body2(activeCalibKey ? `${calibration[activeCalibKey]?.noise ?? "NaN"}` : "NaN")}
                    </p>
                </Modal.Body>
                <Modal.Footer>
                    <Button type="button" id="doneMaskerCalib" className="dataMenuBtn" onClick={handleCloseModal}>{texts.btn.continue}</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}