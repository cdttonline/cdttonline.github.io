import { useState } from "react";
import { processUserAnswer } from "../components/Table";
import { useNavigate } from "react-router-dom";
import { Button, Modal } from "react-bootstrap";

const TestModalResults =({ language, talker, list, mode, tripletType, testEar, masker, startingSNR, SRT, STDEV, 
    numberReversal, testDate, testDuration, startTestTime, numberTriplets, correctAnswer, userAnswerSubmit, completedTriplet })=> {
    
    const [hideResultModal, setHideResultModal] = useState(true);
    const [hideModalAskViewResults, setHideModalAskViewResults] = useState(false);
    const [showTable, setShowTable] = useState(true);
    const navigate = useNavigate();

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
                SRT: SRT,
                STDEV: STDEV,
                numberReversal: numberReversal,
                testDate: testDate,
                testDuration: testDuration,
                startTestTime: startTestTime,
                numberTriplets: numberTriplets,
                correctAnswer: correctAnswer,
                userAnswer: tmpUserAnswerArray,
                completedTriplet: completedTriplet
            }
        })
    }

    const handleViewResults = () => {
        // Close current modal and open next one with the results
        setHideModalAskViewResults(true);
        setHideResultModal(false);    
        showExtendedResults();
    }

    
    const showExtendedResults = () => {
        // On the first triplet, only record the right answer
        const tmpUserAnswerArray = processUserAnswer(correctAnswer, userAnswerSubmit);
        showUSerTestResults(tmpUserAnswerArray);

        setShowTable(false);        
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
                    <Modal.Title>View Results</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Would you like to access your results?</p>
                </Modal.Body>
                <Modal.Footer>
                    {/* <!-- Do not view Results button --> */}
                    <Button type="button" className="btnNotViewResults" id="btnNotViewResults" onClick={() => setHideModalAskViewResults(true)}>Cancel</Button>                    
                                                
                    {/* <!-- View Results button --> */}
                    <Button type="button" className="btnViewResults" id="btnViewResults" onClick={handleViewResults}>View</Button> 
                        
                </Modal.Footer> 
            </Modal>            
        </>
    )
}

export default TestModalResults;