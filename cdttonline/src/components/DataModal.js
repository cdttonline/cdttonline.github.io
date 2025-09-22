import {useEffect, useState} from "react";
import {Modal, Table} from "react-bootstrap";
import "../print.css"
import {exportTableToExcel} from "../Api";
// import XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
import ExcelExport, {ExportToCSV} from "../pages/ExcelExport";

export function DataModal({modalInfo, showModal, handleCloseModal, resultsId}) {

    const [showModals, setShowModal] = useState(showModal);

    const handleClose = () => {
        handleCloseModal();
    };

    // const ExcelExport = ({ data, fileName }) => {
    // const exportToExcel = () => {
    //   const worksheet = XLSX.utils.json_to_sheet(modalInfo);
    //   const workbook = XLSX.utils.book_new();
    //   XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    //   const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //   const blob = new Blob([excelBuffer], {type: 'application/octet-stream'});
    //   saveAs(blob, `${resultsId}.xlsx`);
    // };
    //   }

    useEffect(() => {
        console.log(modalInfo)
    }, [])

    const splitString = (myString) => {
        // const myString = 'Stimulus: 254 | User: 514';

        // Split the string by the pipe character (|) and remove spaces
        const parts = myString.split('|');
        const stimulusPart = parts[0].trim(); // "Stimulus: 254"
        const userPart = parts[1].trim(); // "User: 514"

        // Extract the numbers from each part
        const stimulusNumber = parseInt(stimulusPart.split(':')[1].trim(), 10); // 254
        const userNumber = parseInt(userPart.split(':')[1].trim(), 10); // 514
        console.log("stim= " + stimulusNumber + ", user: " + userNumber)
        return {stimulusNumber, userNumber}
    };

    const handlePrint = () => {
        window.print();
    }

    const [exportData, setExportdata] = useState(false);
    const handleExport = () => {
        const data = modalInfo;
        ExportToCSV(data, resultsId);
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
                fullscreen
            >
                <Modal.Header closeButton>
                    <Modal.Title>Test Results ({resultsId})</Modal.Title>
                </Modal.Header>
                <Modal.Body className="">
                    <div className="dataModal text-start ">
                        <table className="dataModalTable" style={{}}>
                            <td>
                                <h6>Results ID: {resultsId}</h6>
                                <h6 className="mb-2">Score: {modalInfo.score}</h6>
                                <h6>Performed on {modalInfo.dateAndTime}</h6>
                            </td>
                            <td>
                                <td>
                                    <button type="button" className="printBtn" id="printBtn"
                                            onClick={handleExport}>
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                             fill="currentColor" className="bi bi-box-arrow-in-up me-1" viewBox="0 0 16 17">
                                            <path fill-rule="evenodd"
                                                  d="M3.5 10a.5.5 0 0 1-.5-.5v-8a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 0 0 1h2A1.5 1.5 0 0 0 14 9.5v-8A1.5 1.5 0 0 0 12.5 0h-9A1.5 1.5 0 0 0 2 1.5v8A1.5 1.5 0 0 0 3.5 11h2a.5.5 0 0 0 0-1z"/>
                                            <path fill-rule="evenodd"
                                                  d="M7.646 4.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 5.707V14.5a.5.5 0 0 1-1 0V5.707L5.354 7.854a.5.5 0 1 1-.708-.708z"/>
                                        </svg>
                                        {/*<span*/}
                                        {/*className="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>*/}
                                        Export Data
                                    </button>

                                </td>
                                <td>
                                    <button type="button" className="printBtn" id="printBtn" onClick={handlePrint}><span
                                        className="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>Print
                                    </button>
                                </td>
                            </td>

                        </table>


                        <hr style={{borderColor: "#6c757d"}}/>
                        {/*<div className="testResults info d-flex ">*/}
                        <div className="testResults info d-flex flex-column align-content-start">

                            {/*<td>*/}
                                <h6 className="ms-2 mt-4 mb-1">Basic Information</h6>
                                <Table className="table w-auto text-start mb-2 p-0" responsive>
                                    <tbody>
                                        <tr>
                                            <th className="py-1 px-2">Language</th>
                                            <td className="py-1 px-2">{modalInfo.language}</td>

                                            <th className="py-1 px-2">Test Mode</th>
                                            <td className="py-1 px-2">{modalInfo.mode}</td>

                                            <th className="py-1 px-2">Scoring</th>
                                            <td className="py-1 px-2">{modalInfo.tripletType}</td>

                                            <th className="py-1 px-2">Starting SNR</th>
                                            <td className="py-1 px-2">{modalInfo.startingSNR}</td>

                                            <th className="py-1 px-2">Speech Cal</th>
                                            <td className="py-1 px-2">{modalInfo.speech}</td>
                                        </tr>

                                        <tr>
                                            <th className="py-1 px-2">Talker</th>
                                            <td className="py-1 px-2">{modalInfo.talker}</td>

                                            <th className="py-1 px-2">List #</th>
                                            <td className="py-1 px-2">{modalInfo.list}</td>

                                            <th className="py-1 px-2">Masker</th>
                                            <td className="py-1 px-2">{modalInfo.masker}</td>

                                            <th className="py-1 px-2">Test Condition</th>
                                            <td className="py-1 px-2">{modalInfo.testEar}</td>

                                            <th className="py-1 px-2">Noise Cal</th>
                                            <td className="py-1 px-2">{modalInfo.noise}</td>
                                        </tr>

                                    </tbody>
                                </Table>
                            {/*</td>*/}

                            {/*<td>*/}
                                <h6 className="ms-2 mt-3 mb-1">Adaptive Results</h6>
                                <Table className="table text-start mb-2 p-0" responsive>
                                    <tbody>
                                        <tr>
                                            <th className="py-1 px-2"># Reversal</th>
                                            <td className="py-1 px-2">{modalInfo.adaptiveTest.reversals}</td>
                                        </tr>
                                        <tr>
                                            <th className="py-1 px-2">SRT</th>
                                            <td className="py-1 px-2">{parseFloat(modalInfo.adaptiveTest.srt).toFixed(2)}</td>
                                        </tr>
                                        <tr>
                                            <th className="py-1 px-2">St. Dev.</th>
                                            <td className="py-1 px-2">{parseFloat(modalInfo.adaptiveTest.stDev).toFixed(2)}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                            {/*</td>*/}
                        </div>

                        <div className="subjectResultsInfo">
                            <h6 className="ms-2 mt-3 mb-1">Subject Info</h6>
                            <Table className="table text-start mb-2 p-0" responsive>
                                <tbody>
                                    <tr>
                                        <th className="py-1 px-2">Age</th>
                                        <td className="py-1 px-2">{modalInfo.subject.age === "" ? 'N/A' : modalInfo.subject.age}</td>
                                        <th className="py-1 px-2">Language Proficiency</th>
                                        <td className="py-1 px-2">{modalInfo.subject.languageProficiency === "" ? 'N/A' : modalInfo.subject.languageProficiency}</td>

                                    </tr>
                                    <tr>
                                        <th className="py-1 px-2">Better Ear</th>
                                        <td className="py-1 px-2">{modalInfo.subject.betterEar === "" ? 'N/A' : modalInfo.subject.betterEar}</td>
                                        <th className="py-1 px-2">Hearing</th>
                                        <td className="py-1 px-2">{modalInfo.subject.hearing === "" ? 'N/A' : modalInfo.subject.hearing}</td>
                                    </tr>
                                    <tr>
                                        <th className="py-1 px-2">Dominant Language</th>
                                        <td className="py-1 px-2">{modalInfo.subject.dominantLanguage === "" ? 'N/A' : modalInfo.subject.dominantLanguage}</td>
                                        <th className="py-1 px-2"></th>
                                        <td className="py-1 px-2"></td>
                                    </tr>
                                    <tr>
                                        <th className="py-1 px-2">Comments</th>
                                        <td className="py-1 px-2" colSpan={3}>{modalInfo.subject.comments === "" ? 'N/A' : modalInfo.subject.comments}</td>
                                    </tr>
                                    <tr>

                                    </tr>
                                </tbody>
                            </Table>
                        </div>
                        <div className="dataModalResults text-start">
                            <h6 className="ms-2 mt-3 mb-1">Extended Results</h6>
                            <Table className="ms-2 table w-auto  d-flex justify-content-start mb-2 p-0" bordered responsive>
                                <tbody>
                                <td style={{fontWeight: "bold"}}>
                                    <th className="mx-auto">Triplet</th>
                                    <tr style={{textAlign: "center"}}>Stimulus</tr>
                                    <tr style={{textAlign: "center"}}>User</tr>
                                    <tr style={{textAlign: "center"}}>SNR</tr>
                                </td>
                                {console.log(modalInfo.extendedResults)}
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