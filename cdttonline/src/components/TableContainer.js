import React, {Fragment} from "react"
import {useTable, useSortBy, useFilters, usePagination} from "react-table";
import {Button, Table} from "react-bootstrap";
import {DefaultColumnFilter, Filter} from "../helpers/Filter";
import {Col, Input, Row} from "reactstrap";
import {useAllTestsResultsTexts} from "../translations/i18nHelpers";

const TableContainer = ({columns, data}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        prepareRow,
        // below new props related to 'usePagination' hook
        canPreviousPage,
        canNextPage,
        pageOptions,
        pageCount,
        gotoPage,
        nextPage,
        previousPage,
        setPageSize,
        state: {pageIndex, pageSize}
    } = useTable(
        {
            columns,
            data,
            defaultColumn: {Filter: DefaultColumnFilter},
            initialState: {pageIndex: 0, pageSize: 10}
        },
        useFilters,
        useSortBy,
        usePagination
    )

    const texts = useAllTestsResultsTexts();

    const CaretUp = ({ active }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            fill="currentColor"
            viewBox="0 0 16 16"
            style={{ opacity: active ? 1 : 0.3 }}
        >
            <path d="M7.247 4.86 2.451 10.342C1.885 10.987 2.345 12 3.204 12h9.592a1 1 0 0 0 .753-1.659l-4.796-5.48a1 1 0 0 0-1.506 0z" />
        </svg>
    );

    const CaretDown = ({ active }) => (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            width="10"
            height="10"
            fill="currentColor"
            viewBox="0 0 16 16"
            style={{ opacity: active ? 1 : 0.3, marginTop: "-3px" }}
        >
            <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
        </svg>
    );

    const generateSortingIndicator = column => {
        if (column.disableSortBy) return null;
        const upActive = column.isSorted && !column.isSortedDesc;
        const downActive = column.isSorted && column.isSortedDesc;

        return (
            <span
                style={{
                    display: "inline-flex",
                    flexDirection: "column",
                    alignItems: "center",
                    lineHeight: "0.8",
                    marginLeft: "4px"
                }}
            >
                 { !upActive && !downActive ?
                     <>
                         <CaretUp active={true} />
                         <CaretDown active={true} />
                     </> :
                     <>
                         <CaretUp active={upActive} />
                         <CaretDown active={downActive} />
                     </>
                 }
            </span>
        );
    };

    const onChangeInSelect = event => {
        setPageSize(Number(event.target.value));
    }

    return (
        <Fragment>
            <div className={'d-flex align-items-center'} style={{fontSize: '14px'}}>
                {texts.sorting[0]}
                <Col md={2} sm={2} className={"w-auto ps-2 my-auto"}>
                    <Input type="select" value={pageSize} onChange={onChangeInSelect}  style={{fontSize: '12px', marginTop: 0}}>
                        >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                {pageSize}
                            </option>
                        ))}
                    </Input>
                </Col>
            </div>
            <Table className="table mx-auto table-bordered my-2  mb-0" responsive {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <>
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <>
                                    <th {...column.getHeaderProps()} style={{maxWidth: '100px'}}>
                                        <div
                                            className="text-center"
                                            {...column.getSortByToggleProps()}
                                            style={{
                                                fontSize: '14px',
                                                display: "flex",
                                                alignItems: "flex-end",
                                                justifyContent: "space-between",
                                                gap: "2px",
                                                minHeight: '30px'
                                            }}
                                        >
                                            <span style={{lineHeight:1.2, textAlign: 'start'}}>{column.render("Header")}</span>
                                            {generateSortingIndicator(column)}
                                        </div>
                                    </th>
                                </>
                            ))}
                        </tr>
                        <tr key={`filter_${headerGroup.id}`}>
                            {headerGroup.headers.map(column => (
                                <>

                                    <th {...column.getHeaderProps()} style={{maxWidth: '100px', minWidth: '20px', padding: '5px'}}>
                                        <div
                                            className="text-center"
                                            {...column.getSortByToggleProps()}
                                            style={{
                                                fontSize: '12px',
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                gap: "2px"
                                            }}
                                        >
                                        </div>
                                        <Filter column={column}/>
                                    </th>
                                </>
                            ))}
                        </tr>
                    </>
                ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                {page.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()} className={"px-2 py-1"}
                                           style={{fontSize: '12px'}}>{cell.render("Cell")}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </Table>
            <Row className="align-items-center border justify-content-center"
                 style={{margin: "0 auto", backgroundColor: '#edeeef'}}>
                <Col sm={3} xs={5}>
                    <Button
                        variant="light"
                        className="m-1"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M8.354 1.646a.5.5 0 0 1 0 .708L2.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                            <path fillRule="evenodd" d="M12.354 1.646a.5.5 0 0 1 0 .708L6.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                        </svg>
                    </Button>
                    <Button
                        variant="light"
                        className="m-1"
                        onClick={previousPage}
                        disabled={!canPreviousPage}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-left" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M11.354 1.646a.5.5 0 0 1 0 .708L5.707 8l5.647 5.646a.5.5 0 0 1-.708.708l-6-6a.5.5 0 0 1 0-.708l6-6a.5.5 0 0 1 .708 0"/>
                        </svg>
                    </Button>
                </Col>
                <Col className={"my-auto ps-1"} sm={3} xs={2} style={{marginTop: 7, fontSize: '12px'}}>
                    {texts.sorting[1]}{" "}
                    <strong>
                        {pageIndex + 1} {texts.sorting[2]} {pageOptions.length}
                    </strong>
                </Col>
                <Col sm={3} xs={5}>
                    <Button
                        variant="light"
                        className="m-1"
                        onClick={nextPage}
                        disabled={!canNextPage}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M4.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L10.293 8 4.646 2.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </Button>
                    <Button
                        variant="light"
                        className="m-1"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-right" viewBox="0 0 16 16">
                            <path fillRule="evenodd" d="M3.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L9.293 8 3.646 2.354a.5.5 0 0 1 0-.708"/>
                            <path fillRule="evenodd" d="M7.646 1.646a.5.5 0 0 1 .708 0l6 6a.5.5 0 0 1 0 .708l-6 6a.5.5 0 0 1-.708-.708L13.293 8 7.646 2.354a.5.5 0 0 1 0-.708"/>
                        </svg>
                    </Button>
                </Col>
            </Row>
        </Fragment>
    )
}

export default TableContainer