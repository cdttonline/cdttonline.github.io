import { useState } from "react";
import { Modal, Table } from "react-bootstrap";
import "../print.css"
import { exportTableToExcel } from "../Api";
// import XLSX from 'xlsx';
// import { saveAs } from 'file-saver';
import ExcelExport, { ExportToCSV } from "../pages/ExcelExport";

export function DataModal ({ modalInfo, showModal, handleCloseModal, resultsId}) {

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
        return { stimulusNumber, userNumber }
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
                <div className="dataModal">
                    <table className="dataModalTable" style={{}}>
                        <td>
                            <h6>Results ID: {resultsId}</h6>
                            <h6 className="mb-2">Score: {modalInfo.score}</h6>
                            <h6>Performed on {modalInfo.dateAndTime}</h6>
                        </td>
                        <button type="button" class="printBtn" id="printBtn" onClick={handleExport}> <span class="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>Export Data</button>
        {/* {exportData && <ExportToCSV data={modalInfo} resultsId={resultsId} /> } */}
        {/* {exportData ? <ExportToCSV /> : <></>} */}
                        
                        <td></td>
                        <td>
                            <button type="button" class="printBtn" id="printBtn" onClick={handlePrint}> <span class="glyphicon" style={{marginRight: "5px"}}>&#x1f5b6;</span>Print</button>
                        </td>
                    </table>

                    
                    <hr style={{borderColor: "#6c757d"}}/>
                    <div className="dataModalResults">
                        <h5>Basic Information</h5>
                        <Table className="table w-auto mb-3" responsive>
                            <tbody> 
                                <tr>
                                    <th>Language</th>
                                    <td>{modalInfo.language}</td>
                                    <th>Talker</th>
                                    <td>{modalInfo.talker}</td>
                                </tr>
                                <tr>
                                    <th>List #</th>
                                    <td>{modalInfo.list}</td>
                                    <th>Masker</th>
                                    <td>{modalInfo.masker}</td>
                                </tr>
                                <tr>
                                    <th>Mode</th>
                                    <td>{modalInfo.mode}</td>
                                    <th>Starting SNR</th>
                                    <td>{modalInfo.startingSNR}</td>
                                </tr>
                                <tr>
                                    <th>Test Ear</th>
                                    <td>{modalInfo.testEar}</td>
                                    <th>Triplet Type</th>
                                    <td>{modalInfo.tripletType}</td>
                                </tr>                        
                            </tbody>
                        </Table>
                        
                        <h5>Adaptive Results</h5>
                        <Table className="table w-auto mb-3" responsive>
                            <tbody>
                                <tr>
                                    <th># Reversal</th>
                                    <td>{modalInfo.adaptiveTest.reversals}</td>
                                </tr>
                                <tr>
                                    <th>SRT</th>
                                    <td>{modalInfo.adaptiveTest.srt}</td>
                                </tr>
                                <tr>
                                    <th>St. Dev.</th>
                                    <td>{modalInfo.adaptiveTest.stDev}</td>
                                </tr>                
                            </tbody>
                        </Table>

                        <h5>Extended Results</h5>
                        {/* <Table className="table-bordered w-auto mb-5" responsive>
                            <thead>
                                <tr>
                                    <th></th>
                                    <th>Stimulus</th>
                                    <th>User</th>
                                </tr>
                            </thead>
                            <tbody>
                                {console.log(modalInfo.extendedResults)}
                                {modalInfo.extendedResults.map((res, key) => {
                                    const { stimulusNumber, userNumber} = splitString(res);
                                    return(
                                        <tr key={key}>
                                            <th>{key+1}</th>
                                            <td>{stimulusNumber}</td>
                                            <td style={{backgroundColor: (stimulusNumber==userNumber) ? "green" : "red"}}>{userNumber}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table> */}
                        <Table className="w-auto mb-3" bordered responsive>
                            <tbody>
                                <td style={{fontWeight: "bold"}}>
                                    <th className="mx-auto">Triplet ID</th>
                                    <tr style={{textAlign: "center"}}>Stimulus</tr>
                                    <tr style={{textAlign: "center"}}>User</tr>
                                </td>
                                {console.log(modalInfo.extendedResults)}
                                {modalInfo.extendedResults.map((res, key) => {
                                    const { stimulusNumber, userNumber} = splitString(res);
                                    return(
                                        <td key={key + 1}>
                                            <th>{key+1}</th>
                                            <tr>{stimulusNumber}</tr>
                                            <tr style={{backgroundColor: (stimulusNumber==userNumber) ? "green" : "red"}}>{userNumber}</tr>
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