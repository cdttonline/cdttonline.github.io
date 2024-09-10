import { useEffect, useState } from "react";
import { Button, Container, Modal, Table } from "react-bootstrap";
import { resultsCollection } from "../Firebase";
import { getDocs } from "firebase/firestore";
import fcts from "../Api";
import { useLoaderData } from "react-router-dom";
import { DataModal } from "../components/DataModal";

export const loadResultsFromDataBase = async() => {
    const results = await fcts.getResultsFromDataBase();
    return results;
}

const Data = () => {

    const [sortConfig, setSortConfig] = useState({ key: null, direction: null });
    const tmpData = useLoaderData();
    const dataId = tmpData.id;
    const data = tmpData.data;

    useEffect(() => {
console.log(tmpData) 
console.log(dataId)   }, []);

    const [showModal, setShowModal] = useState(false);

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const [modalInfo, setModalInfo] = useState('');
    const [modalId, setModalId] = useState('');
    const openModalData = (e, key) => {
        setModalInfo(e);
        handleShowModal()
        console.log("data id: ",dataId);
        setModalId(dataId[key]);
        console.log("is: ", dataId[key])
    }

    // Sorting function based on column
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
        direction = 'descending';
        }

        setSortConfig({ key, direction });
    };
    const sortedData = [...data].sort((a, b) => {
        let aValue, bValue;
        // console.log()
        // Check if the key is 'column3' and extract the nested 'answer' property
        if (sortConfig.key === 'adaptiveTest.reversals') {
            aValue = a.adaptiveTest.reversals;
            bValue = b.adaptiveTest.reversals;
        } else if (sortConfig.key === 'adaptiveTest.srt') {
            aValue = a.adaptiveTest.srt;
            bValue = b.adaptiveTest.srt; 
        } else if (sortConfig.key === 'adaptiveTest.stDev') {
            aValue = a.adaptiveTest.stDev;
            bValue = b.adaptiveTest.stDev; 
        } else {
            aValue = a[sortConfig.key];
            bValue = b[sortConfig.key];
        }
        // if (sortConfig.key) {

            if (aValue < bValue) {
                return sortConfig.direction === 'ascending' ? -1 : 1;
              }
              if (aValue > bValue) {
                return sortConfig.direction === 'ascending' ? 1 : -1;
              }
            // if (a[sortConfig.key] < b[sortConfig.key]) {
            //     return sortConfig.direction === 'ascending' ? -1 : 1;
            // }
            // if (a[sortConfig.key] > b[sortConfig.key]) {
            //     return sortConfig.direction === 'ascending' ? 1 : -1;
            // }
        // }
        return 0;
    })

    // Sort data based on the current sort configuration
    

    return (
        <>
            <Container>
                <h1>DATA</h1>
                <Table className="table mx-auto table-bordered my-2 w-auto mb-5" responsive>
                    <thead>
                        <tr className="text-center">
                            
                            {/* <th className="col">#</th>
                            <th colSpan={3} onClick={() => sortData('id')} style={{ cursor: 'pointer' }}>
                                # {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th> */}
                            <th colSpan={3} onClick={() => sortData('dateAndTime')} style={{ cursor: 'pointer' }}>
                                Date & Time Completed {sortConfig.key === 'dateAndTime' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            {/* <th colSpan={3}>Date & Time Completed</th> */}
                            {/* <th>Language</th> */}
                            <th onClick={() => sortData('language')} style={{ cursor: 'pointer' }}>
                            Language {sortConfig.key === 'language' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            {/* <th>Talker</th> */}
                            <th onClick={() => sortData('talker')} style={{ cursor: 'pointer' }}>
                            Talker {sortConfig.key === 'talker' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            {/* <th>List #</th> */}
                            <th onClick={() => sortData('list')} style={{ cursor: 'pointer' }}>
                            List # {sortConfig.key === 'list' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            {/* <th>Masker</th> */}
                            <th onClick={() => sortData('masker')} style={{ cursor: 'pointer' }}>
                            Masker {sortConfig.key === 'masker' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            {/* <th>Mode</th> */}
                            <th onClick={() => sortData('mode')} style={{ cursor: 'pointer' }}>
                            Mode {sortConfig.key === 'mode' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            {/* <th>Starting SNR</th> */}
                            <th onClick={() => sortData('startingSNR')} style={{ cursor: 'pointer' }}>
                            Starting SNR {sortConfig.key === 'startingSNR' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            {/* <th>Reversal</th> */}
                            <th onClick={() => sortData('adaptiveTest.reversals')} style={{ cursor: 'pointer' }}>
                            Reversal {sortConfig.key === 'adaptiveTest.reversals' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            {/* <th>SRT</th> */}
                            <th onClick={() => sortData('adaptiveTest.srt')} style={{ cursor: 'pointer' }}>
                            SRT {sortConfig.key === 'adaptiveTest.srt' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            {/* <th>St. Dev</th> */}
                            <th onClick={() => sortData('adaptiveTest.stDev')} style={{ cursor: 'pointer' }}>
                            St. Dev {sortConfig.key === 'adaptiveTest.stDev' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            {/* <th>Overall Score</th> */}
                            <th onClick={() => sortData('score')} style={{ cursor: 'pointer' }}>
                            Overall Score {sortConfig.key === 'score' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody> 
                            {/* {data.map((data, key) => { */}
                            {sortedData.map((data, key) => {
                                
                            return (
                                <tr key={key}>
                                    {/* <td>{key + 1}</td> */}
                                    <td colSpan={3}>{data.dateAndTime}</td>
                                    <td>{data.language}</td>
                                    <td>{data.talker}</td>
                                    <td>{data.list}</td>
                                    <td>{data.masker}</td>
                                    <td>{data.mode}</td>
                                    <td>{data.startingSNR}</td>
                                    <td>{data.adaptiveTest.reversals}</td>
                                    <td>{data.adaptiveTest.srt}</td>
                                    <td>{data.adaptiveTest.stDev}</td>
                                    <td>{data.score}</td>
                                    <td><Button className="dataMenuBtn" onClick={() => openModalData(data, key)}>More</Button></td>
                                    {modalInfo && showModal && modalId && <DataModal showModal={showModal} modalInfo={modalInfo} handleCloseModal={handleCloseModal} resultsId={modalId}/>}
                                    {/* <td><Button onClick={() => {
                                        return (
                                            <>
                                            <DataModal showModal={showModal} handleCloseModal={handleCloseModal} modalInfo={data} />
                                            
                                            </>
                                        )
                                    }}>More</Button></td> */}

                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>

            {/* Modal to show more information on data */}
            {/* <Modal show={showModal} onHide={handleCloseModal} size="lg">
                <Modal.Body className="mx-auto">
                    <h3>Adaptive Test</h3>
                    <Table className="table w-auto mb-5" responsive>
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
                            <tr>
                                <th>Date & Time</th>
                                <td>{modalInfo.dateAndTime}</td>
                            </tr>
                            <tr>
                                <th>Language</th>
                                <td>{modalInfo.language}</td>
                                <th>Talker</th>
                                <th>{modalInfo.talker}</th>
                            </tr>
                            
                        </tbody>
                    </Table>
                </Modal.Body>
            </Modal> */}
        </>
    )
}


export default Data;