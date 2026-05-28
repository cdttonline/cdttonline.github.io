import { useEffect, useState } from "react";
import {Container, Modal, Table} from "react-bootstrap";
import "../print.css"
import { exportTableToExcel } from "../Api";
import {useNavigate, useParams} from "react-router-dom";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase/Firebase";
import {ExportToCSV} from "./ExcelExport";


export const DataFromTest = () => {

    const {dataId} = useParams();
    const [testInfo, setTestInfo] = useState('');

    useEffect(() => {
        console.log("From Data From Test page: ",dataId);

        // find the correct value from the database
        getCurrentData(dataId)
    },[])

    const getCurrentData = async (testID) => {
        const docSnap = await getDoc(doc(db, "testResults", testID))
        if (!docSnap.exists()) {
            // User does not exist. Log out.
            return null;
        } else{
            console.log("okkk", docSnap.data())
            setTestInfo(docSnap.data());
        }
    }

    const handlePrint = () => {
        window.print();
    }

    const [exportData, setExportdata] = useState(false);
    const handleExport = () => {
        ExportToCSV(testInfo, dataId);
    }

    return (
        <>  <Container>
            <div className="dataModal text-start">
                <h3>Results for : {dataId}</h3>
                <table className="dataModalTable">
                    <td>
                        <p className="mt-0 mb-0"><strong>Results ID:</strong> {dataId}</p>
                        <p className="mt-0 mb-0"><strong>Score:</strong> {testInfo.score}</p>
                        <p className="mt-0 mb-0"><strong>Performed on</strong> {testInfo.dateAndTime}</p>
                    </td>
                    <td>
                        <td>
                            <button type="button" className="printBtn" id="printBtn" onClick={handleExport}><span
                                className="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>Export Data
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
                <div className="testResults info d-flex">
                    <td>
                        <h5>Basic Information</h5>
                        <Table className="table w-auto mb-3" responsive>
                            <tbody>
                            <tr>
                                <th>Language</th>
                                <td>{testInfo.language}</td>
                                <th>Talker</th>
                                <td>{testInfo.talker}</td>
                            </tr>
                            <tr>
                                <th>List #</th>
                                <td>{testInfo.list}</td>
                                <th>Masker</th>
                                <td>{testInfo.masker}</td>
                            </tr>
                            <tr>
                                <th>Mode</th>
                                <td>{testInfo.mode}</td>
                                <th>Starting SNR</th>
                                <td>{testInfo.startingSNR}</td>
                            </tr>
                            <tr>
                                <th>Test Ear</th>
                                <td>{testInfo.testEar}</td>
                                <th>Scoring</th>
                                <td>{testInfo.tripletType}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </td>

                    <td>
                        <h5>Adaptive Results</h5>
                        <Table className="table w-auto mb-3" responsive>
                            <tbody>
                            <tr>
                                <th># Reversal</th>
                                <td>{testInfo.reversals}</td>
                            </tr>
                            <tr>
                                <th>SRT</th>
                                <td>{parseFloat(testInfo.srt).toFixed(2)}</td>
                            </tr>
                            <tr>
                                <th>St. Dev.</th>
                                <td>{parseFloat(testInfo.stDev).toFixed(2)}</td>
                            </tr>
                            </tbody>
                        </Table>
                    </td>
                </div>

                <div className="subjectResultsInfo">
                    <h5>Subject Info</h5>
                    <Table className="table w-auto mb-3" responsive>
                        <tbody>
                        <tr>
                            <th>Age</th>
                            <td>{testInfo.age === "" ? 'N/A' : testInfo.age}</td>
                            <th>Language Proficiency</th>
                            <td>{testInfo.languageProficiency === "" ? 'N/A' : testInfo.languageProficiency}</td>

                        </tr>
                        <tr>
                            <th>Better Ear</th>
                            <td>{testInfo.betterEar === "" ? 'N/A' : testInfo.betterEar}</td>
                            <th>Hearing</th>
                            <td>{testInfo.hearing === "" ? 'N/A' : testInfo.hearing}</td>
                        </tr>
                        <tr>
                            <th>Dominant Language</th>
                            <td>{testInfo.dominantLanguage === "" ? 'N/A' : testInfo.dominantLanguage}</td>
                            <th></th>
                            <td></td>
                        </tr>
                        <tr>
                            <th>Comments</th>
                            <td colSpan={3}>{testInfo.comments === "" ? 'N/A' : testInfo.comments}</td>
                        </tr>
                        <tr>

                        </tr>
                        </tbody>
                    </Table>
                </div>
                <div className="dataModalResults">
                    <h5>Extended Results</h5>
                    <Table className="w-auto mb-3" bordered responsive>
                        <tbody>
                        <td style={{fontWeight: "bold"}}>
                            <th className="mx-auto">Triplet ID</th>
                            <tr style={{textAlign: "center"}}>Stimulus</tr>
                            <tr style={{textAlign: "center"}}>User</tr>
                            <tr style={{textAlign: "center"}}>SNR</tr>
                        </td>
                        </tbody>
                    </Table>
                </div>

            </div>
        </Container>
        </>
    )
}