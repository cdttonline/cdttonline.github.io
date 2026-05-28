import "bootstrap/dist/css/bootstrap.min.css";
import "./components.css"
import {useEffect, useState} from "react";
import I18N from "../I18N.json"
import React from "react";
import {useNavigate} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {internalCalibrationCollection} from "../firebase/Firebase";
import {Button, Card, Form} from "react-bootstrap";
import "./components.css"
import {useBtnLabels, useOnlineTestTexts, useTestLabels, useTestParametersLabels} from "../translations/i18nHelpers";

export const TestParameters = () => {

    const texts = useTestParametersLabels();
    const btns = useBtnLabels();
    const info = useOnlineTestTexts();
    const labels = useTestLabels();

    const navigate = useNavigate();
    const [parameters, setParameters] = useState({
        language: "",
        talker: "",
        list: "",
        masker: "",
        startingSNR: 0,
        testMode: "",
        testEar: "",
        tripletType: "",
        isTestInQuiet: ""
    });

    const availableLists =
        parameters.language === "EN_GH" || parameters.language === "TWI_GH"
            ? I18N.list.slice(0, 3)   // only 01,02,03
            : I18N.list;              // 01,02,03,04

    const [isTalkerDisabled, setIsTalkerDisabled] = useState(false);

    const resetParameters = () => {
        setParameters(prev => ({
            ...prev,
            language: I18N.language[0],
            talker: I18N.talker[0],
            list: I18N.list[0],
            masker: I18N.masker,
            testMode: I18N.testMode,
            testEar: I18N.testEar[0],
            tripletType: I18N.tripletType[0],
            isTestInQuiet: false
        }));
    };

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
            const docRef = doc(internalCalibrationCollection, 'InternalCalibration');
            try {
                const docSnap = await getDoc(docRef);
                if (docSnap.exists()) {
                    const data = docSnap.data();
                    // Set state with loaded values
                    setCalibration({
                        ...calibration,
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

    useEffect(() => {
        const randomIndex = Math.floor(Math.random() * I18N.list.length);
        setParameters(prev => ({
            ...prev,
            list: I18N.list[randomIndex]
        }));
    }, [I18N.list]);

    useEffect(() => {
        setParameters(prev => ({
            ...prev,
            language: I18N.language[0],
            talker: I18N.talker[0],
            tripletType: I18N.tripletType[0],
            masker: I18N.masker,
            testMode: I18N.testMode,
            testEar: I18N.testEar[0],
            isTestInQuiet: false
        }));
    }, [])

    useEffect(() => {

        if (
            (parameters.language === "EN_GH" || parameters.language === "TWI_GH") &&
            parameters.list === "04"
        ) {
            setParameters(prev => ({
                ...prev,
                list: I18N.list[0]
            }));
        }

    }, [parameters.language]);
    const audioRef = React.useRef(null);

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
            setIsTalkerDisabled(false);
            setParameters(prev => ({
                ...prev,
                language: value
            }));
        } else if (name === "language" && (value === "TWI_GH" || value === "EN_GH")) {
            setIsTalkerDisabled(true);
            setParameters(prev => ({
                ...prev,
                language: value,
                talker: I18N.talker[0]
            }));

            // Generate new random list value between list values of: '01', '02' and '03'
            if (parameters.list === "04") {
                const randomIndex = Math.floor(Math.random() * (I18N.list.length - 1));
                setParameters(prev => ({
                    ...prev,
                    list: I18N.list[randomIndex]
                }));
            }
        }
        setParameters({...parameters, [name]: value})
        console.log(value);
    }

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

    /**
     * This function is called when the user select the "Next" button, on
     * the main page. It hides the current frame and displays the test
     * practice frame.
     */
    const nextFrame = () => {
        const test = {parameters, calibration}
        console.log(test)
        navigate("/testMainFrame",
            {
                state: {
                    parameters: parameters,
                    calibration: calibration
                },
            })
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        nextFrame();
        console.log("list value is:...")
        console.log(parameters)
    }

    const handleReset = (e) => {
        e.preventDefault();
        console.log("handling reset")
        resetParameters();
        setIsTalkerDisabled(false);
    }

    return (
        <>
            <form onSubmit={handleSubmit} onReset={handleReset}>
                {/* Test Parameters table */}
                <div className="TestParameters" id="TestParameters">
                    <Card className="mt-4 mb-2">
                        <Card.Body>
                            <div className="text-start">
                                <h6>{info.infoBox.title}</h6>
                                <div className="pt-1" style={{fontSize: '14px'}}>
                                    {info.infoBox.label}
                                    <ul className="mb-0">
                                        <li>{info.infoBox.bullet_pts[0]}</li>
                                        <li>{info.infoBox.bullet_pts[1]}</li>
                                    </ul>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    <Card className="mt-4 mb-2">
                        <Card.Body>
                            <div className="text-start">
                                <h6>{info.testParamBox.title}</h6>
                                <table className="testParametersTable border-1">
                                    <tbody>
                                    <tr>
                                        <td>{texts.language}:</td>
                                        {/* <!-- Drop-down list for the Test Language, with the following options: (0) EN_CA, (1) FR_CA --> */}
                                        <td>
                                            <Form.Group>
                                                <Form.Select
                                                    name="language"
                                                    id="language"
                                                    style={{width: "110px", fontSize: "12px"}}
                                                    onChange={handleInputChange}
                                                    value={parameters.language}
                                                >
                                                    {I18N.language.map((type, idx) => {
                                                        return (<option key={idx}
                                                                        value={type}>{labels.language[type]}</option>);
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </td>
                                        <td>{texts.test_mode}:</td>
                                        {/* <!-- Drop-down list for the Test Mode, with the either fixed,
                                    if a device doesn't support the program to change the audio
                                    files' volume, like IOS, or Adaptive --> */}
                                        <td>
                                            {/* Disable the dropdown list as there's only one test mode type */}
                                            <Form.Group>
                                                <Form.Select
                                                    name="testMode"
                                                    id="testModeDropDownList"
                                                    style={{width: "110px"}}
                                                    onChange={handleInputChange}
                                                    disabled={true}
                                                    value={parameters.testMode}
                                                >
                                                    <option
                                                        value={I18N.testMode}>{labels.testMode[I18N.testMode]}</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </td>
                                    </tr>
                                    {/* <!-- Row 2 : Talker and Test ear --> */}
                                    <tr>
                                        <td>{texts.talker}:</td>
                                        {/* <!-- Drop-down list for the Test Talker, with the following options:
                                    (0) Female, (1) Male --> */}
                                        <td>
                                            <Form.Group>
                                                <Form.Select
                                                    name="talker"
                                                    id="talkerDropDownList"
                                                    style={{width: "110px"}}
                                                    onChange={handleInputChange}
                                                    value={parameters.talker}
                                                    disabled={isTalkerDisabled}
                                                >
                                                    {I18N.talker.map((type, idx) => {
                                                        return (<option key={idx}
                                                                        value={type}>{labels.talker[type]}</option>);
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </td>
                                        <td>{texts.test_condition}:</td>
                                        {/* <!-- Drop-down list for the Test Ear, with the following options:
                                    (0) Diotic, (1) Antiphase --> */}
                                        <td>
                                            {/* Disable the drop down list as there's only one test ear type */}
                                            <Form.Group>
                                                <Form.Select
                                                    name="testEar"
                                                    id="testEarDropDownList"
                                                    style={{width: "110px"}}
                                                    onChange={handleInputChange}
                                                    value={parameters.testEar}
                                                >
                                                    {I18N.testEar.map((type, idx) => {
                                                        return (<option key={idx}
                                                                        value={type}>{labels.testCondition[type]}</option>)
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </td>
                                    </tr>
                                    {/* <!-- Row 3 : List # and Triplet type --> */}
                                    <tr>
                                        <td>{texts.list}:</td>
                                        <td>
                                            <Form.Group>
                                                <Form.Select
                                                    name="list"
                                                    id="listDropDownList"
                                                    style={{width: "70px"}}
                                                    value={parameters.list}
                                                    onChange={(e) => {
                                                        handleInputChange(e);
                                                    }}
                                                >
                                                    {availableLists.map((type, index) => (
                                                        <option key={index} value={type}>
                                                            {type}
                                                        </option>
                                                    ))}
                                                </Form.Select>

                                            </Form.Group>
                                        </td>
                                        <td>{texts.scoring}:</td>
                                        {/* <!-- Drop-down list for the Triplet Type, with the following options:
                                    (0) Triplet, (1) All Digit --> */}
                                        <td>
                                            <Form.Group>
                                                <Form.Select
                                                    name="tripletType"
                                                    id="tripletTypeDropDownList"
                                                    style={{width: "110px"}}
                                                    onChange={handleInputChange}
                                                    value={parameters.tripletType}
                                                >
                                                    {I18N.tripletType.map((type, index) => {
                                                        return (<option key={index}
                                                                        value={type}>{labels.scoring[type]}</option>);
                                                    })}
                                                </Form.Select>
                                            </Form.Group>
                                        </td>
                                    </tr>
                                    {/* <!-- Row 4 : Masker and Test in quiet check box --> */}
                                    <tr>
                                        <td>{texts.masker}:</td>
                                        <td>
                                            {/* Disable the drop down list as there's only one masker type */}
                                            <Form.Group>
                                                <Form.Select
                                                    name="masker"
                                                    id="maskerDropDownList"
                                                    style={{width: "110px"}}
                                                    onChange={handleInputChange}
                                                    disabled={true}
                                                    value={parameters.masker}
                                                >
                                                    <option>{I18N.masker}</option>
                                                </Form.Select>
                                            </Form.Group>
                                        </td>
                                    </tr>
                                    </tbody>
                                </table>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className="d-flex mt-1 mb-4">
                        <Button type={'submit'} className="me-2 mt-2" variant={'success'}>{btns.continue}</Button>
                        <Button type={'reset'} className="mt-2" variant={'outline-secondary'}>{btns.reset}</Button>
                    </div>
                </div>
            </form>
        </>
    );
}