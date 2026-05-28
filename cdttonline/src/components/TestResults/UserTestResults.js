import React, {useEffect, useRef, useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExtendedResultsTable from "../components/TestResults/ExtendedResultsTable";
import I18N from "../I18N.json"
import ValidateFn from "../helpers/ValidationFn";
import {Badge, Button, Card, Form, Accordion} from "react-bootstrap";
import "./print.css"
import "./userTestResults.css"
import { resultsCollection } from "../firebase/Firebase";
import { addDoc } from "firebase/firestore";
import {
    useBtnLabels, useSubjectInfoLabels,
    useTestParametersLabels,
    useTestResultsModalTexts,
    useUserTestResultsTexts
} from "../translations/i18nHelpers";

const UserTestResults = () => {
    const { state } = useLocation();
    const navigate = useNavigate();

    const btn = useBtnLabels();
    const texts = useUserTestResultsTexts();
    const test = useTestResultsModalTexts();
    const parameters = useTestParametersLabels();
    const subjectLabels = useSubjectInfoLabels();

    const [hideSaveResultQ, setHideSaveResultQ] = useState(true);
    const [results, setResults] = useState({
        language: state.language,
        talker: state.talker,
        list: state.list,
        mode: state.mode,
        tripletType: state.tripletType,
        testEar: state.testEar,
        masker: state.masker,
        startingSNR: state.startingSNR,
        speech: state.speech,
        noise: state.noise,
        SRT: state.SRT.toFixed(2),
        STDEV: state.STDEV.toFixed(2),
        numberReversal: state.numberReversal,
        testDate: state.testDate,
        testDuration: state.testDuration,
        startTestTime: state.startTestTime,
        numberTriplets: state.numberTriplets,
        correctAnswer: state.correctAnswer,
        userAnswer: state.userAnswer,
        completedTriplet: state.completedTriplet,
        languageProficiency: '',
        age: '',
        hearing1: '',
        hearing2: '',
        dominantLanguage: '',
        comment: '',
        participantID: '',
        termsChecked: false
    });

    const [submitted, setSubmitted] = useState(false);
    const characterLimit = 350;

    useEffect(() => {
        const tmpDateAndTime = (state.testDate + ", " + state.startTestTime);
        setDateAndTime(tmpDateAndTime);
        setTestDuration(state.testDuration)
    }, [])

    const handlePrint = () => { window.print(); }
    const navigateToMainWindow = () => { navigate("/"); }

    const displayExtraSection = () => {
        setHideSaveResultQ(false); // hide save result question
        setAccordionActiveKey((prevKey) => {
            const nextKey = null;
            if (accordionRef.current) {
                accordionRef.current.scrollIntoView({
                    behavior: "smooth",
                    block: "start",
                });
            }
            return nextKey;
        });
    }

    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;
        if ( name === "age" ) {
            const newValue = event.target.value.replace(/\D/, "");
            setResults({ ...results, [name]: newValue });
        } else {
            setResults({ ...results, [name]: value})
            console.log(value)
        }
    }

    const [formDataError, setFormDataError] = useState([]);
    const [dateAndTime, setDateAndTime] = useState('');
    const [testDuration, setTestDuration] = useState('');

    const submitResults = async (e) => {
        e.preventDefault();
        const validationResult = ValidateFn.validateTestUserResults(results);
        setFormDataError(validationResult);
        setSubmitted(true)

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
            getResultsExtendedResults();
            addNewDocument();
            navigateToMainWindow();
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
            speech: results.speech,
            noise: results.noise,
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
            participantUUID: results.participantID || generateNewParticipantId(),
            SNRarray: state.SNRarray
        });
    }

    const generateNewParticipantId =() => {
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        // Generate 3 random characters
        let randomPart = "";
        for (let i = 0; i < 3; i++) {
            randomPart += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        const now = new Date();
        const pad = (n) => n.toString().padStart(2, "0");
        const day = pad(now.getDate());
        const month = pad(now.getMonth() + 1);
        const year = now.getFullYear().toString().slice(-2);
        const hours = pad(now.getHours());
        const minutes = pad(now.getMinutes());
        const seconds = pad(now.getSeconds());

        const timestamp = `${day}${month}${year}${hours}${minutes}${seconds}`;

        return `${randomPart}${timestamp}`;
    }

    const [resultsTripletList, setresultsTripletList] = useState([]);
    const getResultsExtendedResults = () => {
        // Get Results
        let score = 0;
        for (let idx = 0; idx < results.numberTriplets; idx++) {
            const stimulus = results.correctAnswer.find((val, i) => i === idx);
            const user = results.userAnswer.find((Val, i) => i === idx );
            const triplet = ("Stimulus: " + stimulus + "\t|\tUser: " + user);
            if ( stimulus === user ) {
                score++;
            }
            setresultsTripletList(prev => [...prev, triplet]);
            // console.log("triplet in extended res: " + triplet);
            // console.log(resultsTripletList)
        }
        // const overallScore = (score + "/" + results.numberTriplets);
    }

    const handleCheckChange = (event) => {
        const prevTermsCheck = results.termsChecked;
        setResults({
            ...results,
            termsChecked: !prevTermsCheck
        });
    }

    const isInvalid = results.age !== "" && (results.age < 1 || results.age > 150);
    const commentIsInvalid = results.comment !== "" && results.comment.length > 350;
    const [accordionActiveKey, setAccordionActiveKey] = useState("0");
    const accordionRef = useRef(null);
    const handleSelect = (eventKey) => {
        setAccordionActiveKey((prevKey) =>
            prevKey === eventKey ? null : eventKey
        );
    };
    return (
        <div>
            <div>
                <div className="container" id="showResultsContainer">
                    {/* <!-- Printing option, will print the results page --> */}
                    <table className="tableModal_btn">
                        {/* <!-- Handle a print button --> */}
                        <tr>
                            <td>
                                <Button type="button" variant={'light'} className="printBtn border-black" id="printBtn" onClick={handlePrint}><span
                                    className="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>{btn.print}
                                </Button>
                            </td>
                        </tr>
                    </table>

                    {/* <!--Display the table Results title--> */}
                    <h1>{texts.title}</h1>

                    {/* <!-- Table showing all the results from the test -->
                    <!-- For debugging purposes, we will just use random test parameters --> */}
                    <div className="accordionParameters" ref={accordionRef}>
                    <Accordion activeKey={accordionActiveKey} onSelect={handleSelect} >
                        <Accordion.Item eventKey={"0"}>
                            <Accordion.Header>{test.basicInfo.header}</Accordion.Header>
                            <Accordion.Body>
                                <h4>{test.basicInfo.header}</h4>
                                <table className="tableResults" style={{borderCollapse: "collapse"}}>

                                    {/* <!-- Row 1: Date and Time the test started and the duration of the test --> */}
                                    <tr>
                                        <th className="results">{test.basicInfo.labels.dateAndTime}:</th>
                                        <td className="results" id="resultDateTime">{dateAndTime}</td>
                                    </tr>
                                    <tr>
                                        <th className="results" style={{borderBottom: "1pt solid black"}}>{test.basicInfo.labels.testDuration}:</th>
                                        <td className="results" style={{borderBottom: "1pt solid black"}}
                                            id="resultDateTime">{testDuration}</td>
                                    </tr>

                                    {/* <!-- Row 2: Test language --> */}
                                    <tr>
                                        <th className="results">{parameters.language}:</th>
                                        <td className="results" id="resultLanguage">{results.language}</td>
                                    </tr>
                                    {/* <!-- Row 3: Test talker --> */}
                                    <tr>
                                        <th className="results">{parameters.talker}:</th>
                                        <td className="results" id="resultTalker">{results.talker}</td>
                                    </tr>
                                    {/* <!-- Row 4: Test list --> */}
                                    <tr>
                                        <th className="results">{parameters.list}:</th>
                                        <td className="results" id="resultListNumber">{results.list}</td>
                                    </tr>
                                    {/* <!-- Row 5: Test mode
                                    By Default, its always adaptive. However, if a device doesn't support
                                    the program to change the audio files' volume, like IOS, then the test
                                    mode will be Fixed --> */}
                                    <tr>
                                        <th className="results">{parameters.test_mode}:</th>
                                        <td className="results" id="resultMode">{results.mode}</td>
                                    </tr>
                                    {/* <!-- Row 6: Test triplet type --> */}
                                    <tr>
                                        <th className="results">{parameters.scoring}:</th>
                                        <td className="results" id="resultTripletType">{results.tripletType}</td>
                                    </tr>
                                    {/* <!-- Row 7: Test ear --> */}
                                    <tr>
                                        <th className="results">{parameters.test_condition}:</th>
                                        <td className="results" id="resultTestEar">{results.testEar}</td>
                                    </tr>
                                    {/* <!-- Row 8: Masker file used (Always SSNOISE) --> */}
                                    <tr>
                                        <th className="results">{parameters.masker}:</th>
                                        <td className="results" id="resultMasker">{results.masker}</td>
                                    </tr>
                                    {/* <!-- Row 9: Starting SNR calculated --> */}
                                    <tr>
                                        <th className="results" style={{borderBottom: "1pt solid black"}}>{test.basicInfo.labels.startingSNR}:</th>
                                        <td className="results" style={{borderBottom: "1pt solid black"}}
                                            id="resultStartingSNR">{results.startingSNR} dB
                                        </td>
                                    </tr>
                                </table>

                                {/* <!-- Display the Adpative subtitle --> */}
                                <h4>{test.adaptiveResults.header}</h4>

                                {/* <!-- SubTable to display the adaptive results --> */}
                                <table className="adaptiveResults">
                                    {/* <!-- Row 1: Calculated SRT --> */}
                                    <tr>
                                        <th className="results">{test.adaptiveResults.labels.srt}:</th>
                                        <td className="results" id="resultSRT">{results.SRT}</td>
                                    </tr>
                                    {/* <!-- Row 2: Calculated Standard Deviation --> */}
                                    <tr>
                                        <th className="results">{test.adaptiveResults.labels.stDev}</th>
                                        <td className="results" id="resultStDev">{results.STDEV}</td>
                                    </tr>
                                    {/* <!-- Row 3: Total number of reversals --> */}
                                    <tr>
                                        <th className="results">{test.adaptiveResults.labels.reversals}:</th>
                                        <td className="results" id="resultReversals">{results.numberReversal}</td>
                                    </tr>
                                </table>
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey={"1"}>
                            <Accordion.Header>{test.extendedResults.view}</Accordion.Header>
                            <Accordion.Body>
                                {/* <!--The following class will show the detailed Results table. All of the correct triplet answers and all of
                                the triplets answered by the user will be displayed--> */}
                                {/* <!-- Extended Results subtitle --> */}
                                <h4>{test.extendedResults.header}</h4>
                                <ExtendedResultsTable
                                    correctAnswer={results.correctAnswer}
                                    userAnswer={results.userAnswer}
                                    SNRarray={state.SNRarray}
                                />
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>
                    </div>

                    <Card className="mt-4 mb-2" hidden={!hideSaveResultQ}>
                        <Card.Body>
                            {/* <!-- Ask if user wants to save results or not --> */}
                            <div className="saveResultsQ text-start">
                                <h3 className="mt-2 ">{texts.saveResults.title}</h3>

                                <label className="form-label">{texts.saveResults.question}</label>
                                {!hideSaveResultQ ? <hr/> : <></>}
                                <div className="clearfix" hidden={!hideSaveResultQ}>
                                    {/* <!-- Do not show extra section and go back to main page button --> */}
                                    <Button type={'button'} variant={'secondary'} onClick={navigateToMainWindow}
                                            className="mt-2 mx-1" style={{width: '50%'}}>{texts.btn.cancel}</Button>

                                    {/* <!-- Show extra section button --> */}
                                    <Button type={'button'} variant={'success'} onClick={displayExtraSection}
                                            className="mt-2 mx-1" style={{width: '50%'}}>{texts.btn.allow}</Button>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>

                    {!hideSaveResultQ ?
                        <div>
                            <div className={`saveResultsQ ${!hideSaveResultQ ? 'visible' : 'hidden'} text-start mt-4`}>
                                <h4 className="mt-2 ">{texts.savingResults.title}</h4>
                                <hr/>
                                <label className="text-start form-label mt-2 mb-4">{texts.savingResults.paragraph}</label>
                            </div>
                        </div>
                        : <></>
                    }

                    <section>
                        {/* <!--This class will be displayed, if the user selected the 'Allow'
                            button, in the "saveResultsQ" class above. The optional questions
                            and the terms and conditions will be displayed on the Results modal--> */}
                        <div className={`allowSaveExtraSection ${!hideSaveResultQ ? 'visible' : 'hidden'}`} hidden={hideSaveResultQ}>
                            {/* <!-- Optional questions for the user to answer --> */}
                            <Form>
                                <Card>
                                    <Card.Body>
                                        <h6 className="text-center mb-3">{texts.savingResults.questions.title}</h6>
                                        <div className="d-grid gap-2">
                                            <div className="d-flex align-items-baseline flex-wrap gap-2 text-start">
                                                <label className="form-label" htmlFor="age">{texts.savingResults.questions.age}</label>
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        inputMode="numeric"
                                                        className="form-control border"
                                                        name="age"
                                                        pattern="[0-9]*"
                                                        id="age"
                                                        value={results.age}
                                                        max="150"
                                                        min="1"
                                                        maxlength="3"
                                                        style={{width: '80px'}}
                                                        onChange={handleInputChange}
                                                        isInvalid={isInvalid }
                                                    />
                                                    {formDataError[0] || isInvalid ? (
                                                        <Form.Control.Feedback
                                                            type="invalid">{texts.savingResults.err.age}
                                                        </Form.Control.Feedback>
                                                    ) : (
                                                        <></>
                                                    )}
                                                </Form.Group>
                                            </div>

                                            {/* <!-- Question 2: Hearing
                                            A drop-down list is given, with the following otions:
                                            (0) blank, (1) Good, (2) Fair, (3) Poor --> */}
                                            <div className="d-flex align-items-baseline flex-wrap gap-2">
                                                <label className="form-label" htmlFor="hearing1">{texts.savingResults.questions.howIsHearing}</label>
                                                <Form.Group>
                                                    <Form.Select
                                                        name="hearing1"
                                                        id="hearingDropDownList"
                                                        onChange={handleInputChange}
                                                    >
                                                        {I18N.HEARING_1.map((type, index) => {
                                                            return (<option key={index} value={type}>{subjectLabels.hearing1[type]}</option>)
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>

                                            {/* <!-- Question 3: Better ear
                                            A drop-down list is given, with the following options
                                            (0) blank, (1) Both ears are the same, (2) Left ear is better, (3) Right ear is better --> */}
                                            <div className="d-flex align-items-baseline flex-wrap gap-2">
                                                <label className="form-label" htmlFor="hearing2">{texts.savingResults.questions.oneEarBetter}</label>
                                                <Form.Group>
                                                    <Form.Select
                                                        name="hearing2"
                                                        id="hearing2DropDownList"
                                                        onChange={handleInputChange}
                                                    >
                                                        {I18N.HEARING_2.map((type, index) => {
                                                            return (<option key={index} value={type}>{subjectLabels.hearing2[type]}</option>)
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>


                                            {/* <!-- Question 4: Language proficiency
                                            A drop-down list is given, with the following options
                                            (0) blank, (1) Native Speaker, (2) Advanced, (3) Intermediate, (4) Beginner --> */}
                                            <div className="d-flex align-items-baseline flex-wrap gap-2">
                                                <label className="form-label" htmlFor="languageProficiency">{texts.savingResults.questions.languageProficiency}</label>
                                                <Form.Group>
                                                    <Form.Select
                                                        name="languageProficiency"
                                                        id="languageProficiencyDropDownList"
                                                        onChange={handleInputChange}
                                                    >
                                                        {I18N.LANGUAGE_PROFICIENCY.map((type, index) => {
                                                            return (<option key={index} value={type}>{subjectLabels.language_proficiency[type]}</option>)
                                                        })}
                                                    </Form.Select>
                                                </Form.Group>
                                            </div>

                                            {/* <!-- Question 5: Dominant language --> */}
                                            <div className="d-flex align-items-baseline flex-wrap gap-2">
                                                <label className="form-label" htmlFor="dominantLanguage">{texts.savingResults.questions.dominantLanguage}</label>
                                                <Form.Group>
                                                    <Form.Control
                                                        name="dominantLanguage"
                                                        id="dominantLanguageTextBox"
                                                        type="text"
                                                        className="form-control border"
                                                        value={results.dominantLanguage}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </div>

                                            {/* <!-- Comments --> */}
                                            <div>
                                                <div className="text-start">
                                                    <label className="form-label" htmlFor="comment">{texts.savingResults.questions.comments}</label>
                                                    <Form.Group>
                                                        <Form.Control
                                                            as="textarea"
                                                            name="comment"
                                                            id="comments"
                                                            className="form-control border"
                                                            rows={6}
                                                            cols="50"
                                                            maxLength={352}
                                                            value={results.comment}
                                                            onChange={handleInputChange}
                                                            isInvalid={commentIsInvalid}
                                                        />
                                                        {formDataError[1] !== "" || commentIsInvalid ? (
                                                            <Form.Control.Feedback type="invalid">{texts.savingResults.err.comment}</Form.Control.Feedback>
                                                        ) : (
                                                            <></>
                                                        )}
                                                    </Form.Group>
                                                </div>

                                                {/* <!-- Show the number of characters entered in the text area : x/350 --> */}
                                                <div className="d-flex justify-content-end mt-2">
                                                    {!commentIsInvalid ?
                                                        <Badge className='mb-1'
                                                               bg={results.comment.length > characterLimit ? 'danger' : 'light'}
                                                               text="dark">
                                                            {results.comment.length}/{characterLimit}
                                                        </Badge> : <></>
                                                    }
                                                </div>
                                            </div>

                                            {/* Question 6 - Participant ID */}
                                            <div className="d-flex align-items-baseline flex-wrap gap-2">
                                                <label className="form-label" htmlFor="participantID">{texts.savingResults.questions.participantId}</label>
                                                <Form.Group>
                                                    <Form.Control
                                                        type="text"
                                                        className="form-control border"
                                                        name="participantID"
                                                        id="participantID"
                                                        value={results.participantID}
                                                        maxlength="10"
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            </div>
                                        </div>
                                    </Card.Body>
                                </Card>

                                {/* <!-- Insert space between boxes --> */}
                                <br/>

                                <Card>
                                    <Card.Body>
                                        <h6 className="text-center mb-3 d-flex gap-1 justify-content-center">{texts.savingResults.termsConditions.title} <div style={{color: 'red'}}><strong>*</strong></div></h6>
                                        {/* <!-- Terms and Conditions --> */}
                                        <div className="text-start">
                                            <Form.Group>
                                                <Form.Check
                                                    inline
                                                    type={'checkbox'}
                                                    name="termsChecked"
                                                    id="termsChecked"
                                                    checked={results.termsChecked}
                                                    required
                                                    onChange={handleCheckChange}
                                                    label={texts.savingResults.termsConditions.checkbox}
                                                    isInvalid={!results.termsChecked && submitted}
                                                />
                                            </Form.Group>

                                        </div>
                                    </Card.Body>
                                </Card>

                                <div className="d-flex justify-content-between mt-4 mb-4">
                                    <Button type={'button'} variant={'secondary'}
                                            onClick={navigateToMainWindow}>{texts.btn.cancel}</Button>
                                    <Button type={'submit'} variant={'success'} onClick={submitResults}>{texts.btn.submit}</Button>

                                </div>
                            </Form>

                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default UserTestResults;