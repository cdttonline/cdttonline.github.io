import {useMemo, useState} from "react";
import {Button, Container} from "react-bootstrap";
import fcts from "../Api";
import {useLoaderData, useRevalidator} from "react-router-dom";
import {DataModal} from "../components/TestResults/DataModal";
import TableContainer from "../components/TableContainer";
import {
    ScoringTypeColumnFilter,
    SelectColumnFilter,
    TalkerTypeColumnFilter,
    TestConditionTypeColumnFilter
} from "../helpers/Filter";
import "./CustomStyle.css"
import {convertMilliSecToTime, currentDate, currentTime} from "../helpers/DateTimeHelperFn";
import ShowUserTestResults from "../components/TestResults/ShowUserTestResults";
import {useAllTestsResultsTexts, useTestLabels} from "../translations/i18nHelpers";

export const loadResultsFromDataBase = async () => {
    const results = await fcts.getResultsFromDataBase();
    return results;
}

const Data = () => {
    const tmpData = useLoaderData();
    const valueLabels = useTestLabels();
    const dataId = tmpData.id;
    const data = tmpData.data;

    const texts = useAllTestsResultsTexts();

    const [showModal, setShowModal] = useState(false);
    const [modalInfo, setModalInfo] = useState('');
    const [modalId, setModalId] = useState('');
    const [showTestDataResults, setShowTestDataResults] = useState(false)
    const { revalidate } = useRevalidator();

    const columns = useMemo(
        () => [
            {
                Header: texts.headers[0],
                accessor: row => {
                    const value = row.dateAndTime;
                    const tmpDate = value.split('|');
                    let [day, month, yearAndTime] = tmpDate[0].split('-');
                    let [year, time] = yearAndTime.split(',');
                    return `${year}-${month}-${day},${time}`;
                },
            }, {
                Header: texts.headers[1],
                accessor: 'language',
                Filter: SelectColumnFilter,
                filter: 'equals',
            }, {
                Header: texts.headers[2],
                accessor: 'talker',
                Filter: TalkerTypeColumnFilter,
                filter: 'equals',
                Cell: ({ value }) => valueLabels.talker[value]
            }, {
                Header: texts.headers[3],
                accessor: 'list',
                Filter: SelectColumnFilter,
                filter: 'equals'
            },
            // {
            //     Header: 'Masker',
            //     accessor: 'masker',
            //     // Filter: SelectColumnFilter,
            //     // filter: 'equals',
            //     disableFilters: true,
            //     Cell: ({cell}) => {
            //         const {value} = cell;
            //         return (
            //             <td className="w-50">{value}</td>
            //         )
            //     }
            // },
            // {
            //     Header: 'Test Mode',
            //     accessor: 'mode',
            //     // Filter: SelectColumnFilter,
            //     // filter: 'equals'
            //     disableFilters: true,
            //     Cell: ({cell}) => {
            //         const {value} = cell;
            //         return (
            //             <td className="w-50">{value}</td>
            //         )
            //     }
            // },
            {
                Header: texts.headers[4],
                accessor: 'testEar',
                Filter: TestConditionTypeColumnFilter,
                filter: 'equals',
                Cell: ({ value }) => valueLabels.testCondition[value]
            },
            {
                Header: texts.headers[5],
                accessor: 'tripletType',
                Filter: ScoringTypeColumnFilter,
                filter: 'equals',
                Cell: ({ value }) => {
                    return valueLabels.scoring[value]
                }
            },
            {
                Header: texts.headers[6],
                accessor: 'startingSNR',
                Filter: SelectColumnFilter,
                filter: 'equals',
                Cell: ({cell}) => {
                    const {value} = cell;
                    return (
                        <td style={{minWidth: '105px', fontSize: '12px'}}>{value}</td>
                    )
                }
            },
            {
                Header: texts.headers[7],
                accessor: 'adaptiveTest.reversals',
                Filter: SelectColumnFilter,
                filter: 'equals'
            },
            {
                Header: texts.headers[8],
                accessor: 'adaptiveTest.srt',
            },
            {
                Header: texts.headers[9],
                accessor: 'adaptiveTest.stDev',
                Cell: ({cell}) => {
                    const {value} = cell;
                    return (
                        <td style={{minWidth: '70px', fontSize: '12px'}}>{value}</td>
                    )
                }
            },
            {
                Header: texts.headers[10],
                accessor: 'participantUUID',
                Cell: ({cell}) => {
                    const {value} = cell;
                    return (
                        <td style={{minWidth: "115px", fontSize: '12px'}}>{value}</td>
                    )
                }
            },
            {
                Header: texts.headers[11],
                accessor: '',
                disableSortBy: true,
                disableFilters: true,
                Cell: ({cell}) => {
                    return (
                        <div>
                        <Button className="dataMenuBtn py-1 px-2" style={{fontSize: '14px'}}
                                onClick={() => openModalData(cell.row)}>{texts.btn.more}</Button>

                        <Button onClick={() => openDataResults()}>Open Data Results</Button>
                        </div>
                    )
                }
            }
        ],
        [valueLabels]
    )

    const openDataResults = () => {
        setShowTestDataResults(true)
    }

    const handleCloseModal = () => setShowModal(false);
    const handleShowModal = () => setShowModal(true);

    const openModalData = (e) => {
        setModalInfo(e.original);
        handleShowModal()
        setModalId(dataId[e.id]);
    }

    return (
        <>
            <Container id="testResultsDataContainer">
                <h3 className="mt-3 fw-bold">{texts.title}</h3>

                <TableContainer columns={columns} data={data}/>

                {modalInfo &&
                    showModal &&
                    modalId &&
                    <DataModal
                        showModal={showModal}
                        modalInfo={modalInfo}
                        handleCloseModal={handleCloseModal}
                        resultsId={modalId}
                        setUpdated={revalidate}
                    />
                }

                {showTestDataResults ?
                    <ShowUserTestResults language={"EN_CA"} talker={"Female"}
                                      list={"01"} mode={"Adaptive"}
                                      tripletType={"Triplet"} testEar={"Diotic"}
                                      masker={"SSNOISE"} startingSNR={0}
                                      speech={0.5} noise={0.5} SRT={-12.95}
                                      STDEV={1.63} numberReversal={15} testDate={currentDate(new Date)}
                                      testDuration={convertMilliSecToTime(3000)} startTestTime={currentTime(new Date)}
                                      numberTriplets={23} correctAnswer={["941", "368", "698", "496", "632", "813", "539", "513", "851", "126", "254", "982", "863", "149", "482", "315", "346", "154", "291", "524", "689", "425", "935", "268"]}
                                      userAnswerSubmit={["941", "368", "698", "496", "513", "813", "532", "416", "853", "126", "254", "845", "863", "143", "483", "315", "346", "153", "291", "532", "689", "421", "935", "468"]} completedTriplet={23}
                                      SNRarray={[-4, -8, -12, -16, -14, -16, -14, -12, -10, -12, -14, -12, -14, -12, -10, -12, -14, -12, -14, -12, -14, -12, -14, -12, -16]}/>
                : <></>
                }
           </Container>
        </>
    )
}

export default Data;