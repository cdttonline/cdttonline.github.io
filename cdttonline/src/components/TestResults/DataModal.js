import React, {useEffect, useState} from "react";
import {Button, Form, Modal, Table} from "react-bootstrap";
import "../dataModelPrint.css"
import {ExportToCSV} from "../pages/ExcelExport";
import {db} from "../firebase/Firebase";
import {doc, updateDoc} from "firebase/firestore";
import {
    useAllTestsResultsTexts,
    useBtnLabels, useSubjectInfoLabels, useTestLabels,
    useTestParametersLabels,
    useTestResultsModalTexts
} from "../translations/i18nHelpers";

export function DataModal({modalInfo, showModal, handleCloseModal, resultsId, setUpdated}) {

    const handleClose = () => {
        handleCloseModal();
    };

    const texts = useAllTestsResultsTexts();
    const modal = useTestResultsModalTexts();
    const param = useTestParametersLabels();
    const btn = useBtnLabels();
    const valueLabels = useTestLabels();
    const subjectLabels = useSubjectInfoLabels();

    const [participantId, setParticipantId] = useState("");

    useEffect(() => {
        console.log(modalInfo)
        setParticipantId(modalInfo.participantUUID)
    }, [modalInfo])

    const splitString = (myString) => {
        // Split the string by the pipe character (|) and remove spaces
        const parts = myString.split('|');
        const stimulusPart = parts[0].trim(); // "Stimulus: 254"
        const userPart = parts[1].trim(); // "User: 514"

        // Extract the numbers from each part
        const stimulusNumber = parseInt(stimulusPart.split(':')[1].trim(), 10); // 254
        const userNumber = parseInt(userPart.split(':')[1].trim(), 10); // 514
        return {stimulusNumber, userNumber}
    };

    const handlePrint = () => {
        window.print();
    }

    const handleExport = () => {
        ExportToCSV(modalInfo, resultsId);
    }

    const [editParticipantId, setEditParticipantId] = useState(false)
    const handleEditParticipantID = () => {
        setEditParticipantId(true)
    }

    const cancelEditParticipantId = () => {
        setEditParticipantId(false)
        setParticipantId(modalInfo.participantUUID)
    }

    const saveEditParticipantId = async (e) => {
        e.preventDefault();
        setEditParticipantId(false)

        await updateParticipantId()
        modalInfo.participantUUID = participantId
        setUpdated()
    }

    async function updateParticipantId() {
        const docRef = doc(db, "testResults", resultsId);
        await updateDoc(docRef, {
            participantUUID: participantId
        });
        console.log("Document updated!");
    }

    const handleParticipantIdChange = (event) => {
        const target = event.target;
        const value = target.value;
        setParticipantId((prev) => value)
        console.log("participant id: = " + value)
    }

    return (
        <>
            <Modal
                show={showModal}
                onHide={handleClose}
                size="lg"
                backdrop="static"
                keyboard={false}
                scrollable
            >
                <Modal.Header closeButton>
                    <Modal.Title>{modal.header} ({resultsId})</Modal.Title>
                </Modal.Header>
                <Modal.Body className="mb-2">
                    <div className="dataModal text-start ">
                        <table className="dataModalTable" style={{}}>
                            <td>
                                <h6>{modal.subHeaders[0]}: {resultsId}</h6>
                                {!editParticipantId
                                    ?
                                    <h6 className="mb-2">{modal.subHeaders[1]}: {participantId ?? texts.undefined}</h6>
                                    : <>
                                        <div className="d-flex justify-content-start align-items-center">
                                            <h6 className="mb-2 me-2">{modal.subHeaders[1]}:</h6>
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    className="form-control border"
                                                    name="participantId"
                                                    id="participantId"
                                                    value={participantId}
                                                    maxlength="20"
                                                    onChange={handleParticipantIdChange}
                                                />
                                            </Form.Group>
                                            <Button variant={'danger'} onClick={cancelEditParticipantId}
                                                    className='ms-2 me-1' style={{height: '36px'}}>{btn.cancel}</Button>
                                            <Button variant={'success'}
                                                    disabled={participantId === modalInfo.participantUUID}
                                                    onClick={saveEditParticipantId}>{btn.update}</Button>
                                        </div>
                                    </>
                                }

                                <h6>{modal.subHeaders[2]} {modalInfo.dateAndTime}</h6>
                            </td>
                            <td>
                                {!editParticipantId
                                    ?
                                    <Button variant={'success'} className='mb-1 ms-1'
                                            onClick={handleEditParticipantID}>{btn.edit}
                                        <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12"
                                             fill="currentColor"
                                             className="ms-2 bi bi-pencil-fill" viewBox="0 0 18 18">
                                            <path
                                                d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                                        </svg>
                                    </Button>
                                    : <></>
                                }
                            </td>
                        </table>

                        <hr style={{borderColor: "#6c757d"}}/>

                        <div className="d-flex justify-content-end">
                            <Button type={"button"} className='mt-1 mb-1' variant={'dark'} id={'printBtn'}
                                    onClick={handleExport}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                     fill="currentColor" className="bi bi-box-arrow-in-up me-1"
                                     viewBox="0 0 16 17">
                                    <path fillRule="evenodd"
                                          d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/>
                                    <path fillRule="evenodd"
                                          d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"/>
                                </svg>
                                {btn.export}
                            </Button>
                            <Button type="button" variant={'light'} className="printBtn border-black ms-1 mt-1 mb-1"
                                    id="printBtn" onClick={handlePrint}>
                                <span className="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>{btn.print}
                            </Button>
                        </div>
                        <div>
                            <div className="d-flex align-items-end justify-content-between">
                                <h6 className="ms-2 mt-0 mb-1">{modal.basicInfo.header}</h6>
                            </div>


                            <Table className="table text-start mb-2 p-0" responsive>
                                <tbody>
                                <tr>
                                    <th className="py-1 px-2">{param.language}</th>
                                    <td className="py-1 px-2">{valueLabels.language[modalInfo.language] || modalInfo.language}</td>

                                    <th className="py-1 px-2">{param.test_mode}</th>
                                    <td className="py-1 px-2">{valueLabels.testMode[modalInfo.mode] || modalInfo.mode}</td>

                                    <th className="py-1 px-2">{param.scoring}</th>
                                    <td className="py-1 px-2">{valueLabels.scoring[modalInfo.tripletType] || modalInfo.tripletType}</td>

                                    <th className="py-1 px-2">{modal.basicInfo.labels.startingSNR}</th>
                                    <td className="py-1 px-2">{modalInfo.startingSNR}</td>

                                    <th className="py-1 px-2">{modal.basicInfo.labels.speechCal}</th>
                                    <td className="py-1 px-2">{modalInfo.speech ?? "N/A"}</td>
                                </tr>

                                <tr>
                                    <th className="py-1 px-2">{param.talker}</th>
                                    <td className="py-1 px-2">{valueLabels.talker[modalInfo.talker] || modalInfo.talker}</td>

                                    <th className="py-1 px-2">{param.list}</th>
                                    <td className="py-1 px-2">{modalInfo.list}</td>

                                    <th className="py-1 px-2">{param.masker}</th>
                                    <td className="py-1 px-2">{modalInfo.masker}</td>

                                    <th className="py-1 px-2">{param.test_condition}</th>
                                    <td className="py-1 px-2">{valueLabels.testCondition[modalInfo.testEar] || modalInfo.testEar}</td>

                                    <th className="py-1 px-2">{modal.basicInfo.labels.noiseCal}</th>
                                    <td className="py-1 px-2">{modalInfo.noise ?? "N/A"}</td>
                                </tr>

                                </tbody>
                            </Table>
                        </div>
                        <div>
                            <h6 className="ms-2 mt-4 mb-1">{modal.adaptiveResults.header}</h6>
                            <Table className="table text-start mb-2 p-0" responsive>
                                <tbody>
                                <tr>
                                    <th className="py-1 px-2 col-2">{modal.adaptiveResults.labels.reversals}</th>
                                    <th className="py-1 px-2 col-2">{modal.adaptiveResults.labels.srt}</th>
                                    <th className="py-1 px-2 col-2">{modal.adaptiveResults.labels.stDev}</th>

                                </tr>
                                <tr>
                                    <td className="py-1 px-2">{modalInfo.adaptiveTest.reversals}</td>
                                    <td className="py-1 px-2">{parseFloat(modalInfo.adaptiveTest.srt).toFixed(2)}</td>
                                    <td className="py-1 px-2">{parseFloat(modalInfo.adaptiveTest.stDev).toFixed(2)}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>

                        <div>
                            <h6 className="ms-2 mt-4 mb-1">{modal.subjectInfo.header}</h6>
                            <Table className="table text-start mb-2 p-0" responsive>
                                <tbody>
                                <tr>
                                    <th className="py-1 px-2">{modal.subjectInfo.labels.age}</th>
                                    <td className="py-1 px-2">{modalInfo.subject.age === "" ? 'N/A' : modalInfo.subject.age}</td>
                                    <th className="py-1 px-2">{modal.subjectInfo.labels.languageProficiency}</th>
                                    <td className="py-1 px-2">{subjectLabels.language_proficiency[modalInfo.subject.languageProficiency] ?? 'N/A'}</td>

                                </tr>
                                <tr>
                                    <th className="py-1 px-2">{modal.subjectInfo.labels.betterEar}</th>
                                    <td className="py-1 px-2">{subjectLabels.hearing2[modalInfo.subject.betterEar] ?? 'N/A'}</td>
                                    <th className="py-1 px-2">{modal.subjectInfo.labels.hearing}</th>
                                    <td className="py-1 px-2">{subjectLabels.hearing1[modalInfo.subject.hearing] ?? 'N/A'}</td>
                                </tr>
                                <tr>
                                    <th className="py-1 px-2">{modal.subjectInfo.labels.dominiantLanguage}</th>
                                    <td className="py-1 px-2">{modalInfo.subject.dominantLanguage === "" ? 'N/A' : modalInfo.subject.dominantLanguage}</td>
                                    <th className="py-1 px-2"></th>
                                    <td className="py-1 px-2"></td>
                                </tr>
                                <tr>
                                    <th className="py-1 px-2">{modal.subjectInfo.labels.comments}</th>
                                    <td className="py-1 px-2"
                                        colSpan={3}>{modalInfo.subject.comments === "" ? 'N/A' : modalInfo.subject.comments}</td>
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div className="dataModalResults text-start">
                            <h6 className="ms-2 mt-4 mb-1">{modal.extendedResults.header}</h6>
                            <Table className="table w-auto  d-flex justify-content-start mb-2 p-0" bordered
                                   responsive>
                                <tbody>
                                <td style={{fontWeight: "bold"}}>
                                    <th className="mx-auto">{modal.extendedResults.adminTableHeaders[0]}</th>
                                    <tr style={{textAlign: "center"}}>{modal.extendedResults.adminTableHeaders[1]}</tr>
                                    <tr style={{textAlign: "center"}}>{modal.extendedResults.adminTableHeaders[2]}</tr>
                                    <tr style={{textAlign: "center"}}>{modal.extendedResults.adminTableHeaders[3]}</tr>
                                </td>
                                {modalInfo.extendedResults.map((res, key) => {
                                    const {stimulusNumber, userNumber} = splitString(res);
                                    return (
                                        <td key={key + 1}>
                                            <th>{key + 1}</th>
                                            <tr>{stimulusNumber}</tr>
                                            <tr style={{backgroundColor: (stimulusNumber === userNumber) ? "green" : "red"}}>{userNumber}</tr>
                                            <tr>{modalInfo.SNRarray[key]}</tr>
                                        </td>
                                    );
                                })}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    )
}