import { useState } from "react";
import { processUserAnswer } from "./TestResults/ExtendedResultsTable";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";
import {useUserTestResultsTexts} from "../translations/i18nHelpers";

const ShowUserTestResults =({ language, talker, list, mode, tripletType, testEar, masker, startingSNR, speech, noise, SRT, STDEV,
    numberReversal, testDate, testDuration, startTestTime, numberTriplets, correctAnswer, userAnswerSubmit, completedTriplet, SNRarray })=> {

    const [hideModalAskViewResults, setHideModalAskViewResults] = useState(false);
    const navigate = useNavigate();

    const texts = useUserTestResultsTexts();

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
                speech: speech,
                noise: noise,
                SRT: SRT,
                STDEV: STDEV,
                numberReversal: numberReversal,
                testDate: testDate,
                testDuration: testDuration,
                startTestTime: startTestTime,
                numberTriplets: numberTriplets,
                correctAnswer: correctAnswer,
                userAnswer: tmpUserAnswerArray,
                completedTriplet: completedTriplet,
                SNRarray: SNRarray
            }
        })
    }

    const handleViewResults = () => {
        // Close current modal and open next one with the results
        setHideModalAskViewResults(true);
        showExtendedResults();
    }


    const showExtendedResults = () => {
        // On the first triplet, only record the right answer
        const tmpUserAnswerArray = processUserAnswer(correctAnswer, userAnswerSubmit);
        showUSerTestResults(tmpUserAnswerArray);
    }

    return (
        <>
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
                    <Modal.Title>{texts.viewResultsModal.header}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>{texts.viewResultsModal.body}</p>
                </Modal.Body>
                <Modal.Footer>
                    {/* <!-- Do not view Results button --> */}
                    <Button type="button" variant={'secondary'} className="btnNotViewResults" id="btnNotViewResults"
                            onClick={() => setHideModalAskViewResults(true)}>{texts.btn.cancel}</Button>

                    {/* <!-- View Results button --> */}
                    <Button type="button" variant={'success'} className="btnViewResults" id="btnViewResults"
                            onClick={handleViewResults}>{texts.btn.view}</Button>

                </Modal.Footer>
            </Modal>
        </>
    )
}

export default ShowUserTestResults;