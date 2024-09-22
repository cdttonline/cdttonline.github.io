import { useState } from "react";
import { Button, Container, Table } from "react-bootstrap";
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

    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState('');
    const [modalId, setModalId] = useState('');

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);
    
    const openModalData = (e, key) => {
        setModalInfo(e);
        handleShowModal()
        setModalId(dataId[key]);
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

        if (aValue < bValue) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        
        if (aValue > bValue) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
    })

    return (
        <>
            <Container>
                <h1 className="mt-3">Data</h1>
                <Table className="table mx-auto table-bordered my-2 w-auto mb-5" responsive>
                    <thead>
                        <tr className="text-center">
                            {/*<th colSpan={3} onClick={() => sortData('id')} style={{ cursor: 'pointer' }}>
                                # {sortConfig.key === 'id' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th> */}
                            <th colSpan={3} onClick={() => sortData('dateAndTime')} style={{ cursor: 'pointer' }}>
                                Date & Time Completed {sortConfig.key === 'dateAndTime' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            <th onClick={() => sortData('language')} style={{ cursor: 'pointer' }}>
                            Language {sortConfig.key === 'language' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>
                            <th onClick={() => sortData('talker')} style={{ cursor: 'pointer' }}>
                            Talker {sortConfig.key === 'talker' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('list')} style={{ cursor: 'pointer' }}>
                            List # {sortConfig.key === 'list' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('masker')} style={{ cursor: 'pointer' }}>
                            Masker {sortConfig.key === 'masker' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('mode')} style={{ cursor: 'pointer' }}>
                            Mode {sortConfig.key === 'mode' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('startingSNR')} style={{ cursor: 'pointer' }}>
                            Starting SNR {sortConfig.key === 'startingSNR' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('adaptiveTest.reversals')} style={{ cursor: 'pointer' }}>
                            Reversal {sortConfig.key === 'adaptiveTest.reversals' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('adaptiveTest.srt')} style={{ cursor: 'pointer' }}>
                            SRT {sortConfig.key === 'adaptiveTest.srt' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('adaptiveTest.stDev')} style={{ cursor: 'pointer' }}>
                            St. Dev {sortConfig.key === 'adaptiveTest.stDev' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th onClick={() => sortData('score')} style={{ cursor: 'pointer' }}>
                            Overall Score {sortConfig.key === 'score' ? (sortConfig.direction === 'ascending' ? '▲' : '▼') : ''}
                            </th>

                            <th></th>
                        </tr>
                    </thead>
                    <tbody> 
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
                                    <td>{parseFloat(data.adaptiveTest.srt).toFixed(2)}</td>
                                    <td>{parseFloat(data.adaptiveTest.stDev).toFixed(2)}</td>
                                    <td>{data.score}</td>
                                    <td><Button className="dataMenuBtn" onClick={() => openModalData(data, key)}>More</Button></td>
                                    { modalInfo && 
                                      showModal && 
                                      modalId && 
                                      <DataModal 
                                        showModal={showModal} 
                                        modalInfo={modalInfo} 
                                        handleCloseModal={handleCloseModal} 
                                        resultsId={modalId}
                                      />
                                    }
                                </tr>
                            )
                        })}
                    </tbody>
                </Table>
            </Container>
        </>
    )
}

export default Data;