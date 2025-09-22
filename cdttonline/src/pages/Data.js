import {useMemo, useState} from "react";
import {Button, Container, Table} from "react-bootstrap";
import fcts from "../Api";
import {Link, useLoaderData, useNavigate} from "react-router-dom";
import {DataModal} from "../components/DataModal";
import TableContainer from "../components/TableContainer";
import {NumberColumnFilter, SelectColumnFilter} from "../components/Filter";
// import "./NavPagesInformation.css";

export const loadResultsFromDataBase = async () => {
    const results = await fcts.getResultsFromDataBase();
    return results;
}

const Data = () => {
    const [sortConfig, setSortConfig] = useState({key: null, direction: null});
    const tmpData = useLoaderData();
    const dataId = tmpData.id;
    console.log("IDSS:", dataId)
    const data = tmpData.data;
    const navigate = useNavigate();

    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState('');
    const [modalId, setModalId] = useState('');

    const columns = useMemo(
        () => [
            {
                Header: 'Date & Time Completed',
                accessor: 'dateAndTime',
                Cell: ({cell}) => {
                    const {value} = cell;
                    const dateAndTime = (value) => {
                        const date = value.split('|');
                        return date[0];
                    };
                    return (
                        <div>{dateAndTime(value)}</div>
                    );
                }
            }, {
                Header: 'Language',
                accessor: 'language',
                Filter: SelectColumnFilter,
                filter: 'equals'

            }, {
                Header: 'Talker',
                accessor: 'talker',
                Filter: SelectColumnFilter,
                filter: 'equals'

            }, {
                Header: 'List #',
                accessor: 'list',
                Filter: SelectColumnFilter,
                filter: 'equals'
            },
            {
                Header: 'Masker',
                accessor: 'masker',
                // Filter: SelectColumnFilter,
                // filter: 'equals',
                disableFilters: true,
                Cell: ({cell}) => {
                    const {value} = cell;
                    return (
                        <td className="w-50">{value}</td>
                    )
                }
            },
            {
                Header: 'Mode',
                accessor: 'mode',
                // Filter: SelectColumnFilter,
                // filter: 'equals'
                disableFilters: true,
                Cell: ({cell}) => {
                    const {value} = cell;
                    return (
                        <td className="w-50">{value}</td>
                    )
                }
            },
            {
                Header: 'Test Condition',
                accessor: 'testEar',
                Filter: SelectColumnFilter,
                filter: 'equals'
            },
            {
                Header: 'Scoring',
                accessor: 'tripletType',
                Filter: SelectColumnFilter,
                filter: 'equals'
            },
            {
                Header: 'Starting SNR',
                accessor: 'startingSNR',
                Filter: SelectColumnFilter,
                filter: 'equals'
            },
            {
                Header: 'Reversal',
                accessor: 'adaptiveTest.reversals',
                Filter: SelectColumnFilter,
                filter: 'equals'
            },
            {
                Header: 'SRT',
                accessor: 'adaptiveTest.srt',
            },
            {
                Header: 'St. Dev',
                accessor: 'adaptiveTest.stDev',
            },
            {
                Header: 'Overall Score',
                accessor: 'score',
                Cell: ({cell}) => {
                    const {value} = cell;
                    return (
                        <td style={{maxWidth: "20px", width: "10px"}}>{value}</td>
                    )
                }
            },
            {
                Header: 'Action',
                accessor: '',
                disableSortBy: true,
                disableFilters: true,
                Cell: ({cell}) => {
                    return (
                        <Button className="dataMenuBtn py-1 px-2" style={{fontSize: '14px'}}
                                onClick={() => openModalData(cell.row)}>More</Button>
                    )
                }
            }
        ],
        []
    )

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const openModalData = (e) => {
        console.log("Modal to be openned with the following data:", e);
        setModalInfo(e.original);
        handleShowModal()
        console.log("ID MODAL will be: ", e.id)
        setModalId(dataId[e.id]);
        // const id = dataId[e.id];
        // navigate(`/data/${id}`)
        // console.log("Modal to be openned with the following data:", e);
        // setModalInfo(e.original);
        // handleShowModal()
        // console.log("ID MODAL will be: ", e.id)
        // setModalId(dataId[e.id]);
    }

    // Sorting function based on column
    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }

        setSortConfig({key, direction});
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
            <Container id="testResultsDataContainer">
                <h3 className="mt-3 fw-bold">Test Results Data</h3>

                {/*<h1 className="mt-3">Test Results Data</h1>*/}
                <TableContainer columns={columns} data={data}/>

                {modalInfo &&
                    showModal &&
                    modalId &&
                    <DataModal
                        showModal={showModal}
                        modalInfo={modalInfo}
                        handleCloseModal={handleCloseModal}
                        resultsId={modalId}
                    />
                }
                {/*{modalInfo &&*/}
                {/*    showModal &&*/}
                {/*    modalId &&*/}
                {/*    <Link*/}
                {/*        showModal={showModal}*/}
                {/*        modalInfo={modalInfo}*/}
                {/*        handleCloseModal={handleCloseModal}*/}
                {/*        resultsId={modalId}*/}
                {/*    />*/}
                {/*}*/}
            </Container>
        </>
    )
}

export default Data;