import React, {Fragment} from "react"
import {useTable, useSortBy, useFilters, usePagination} from "react-table";
import {Button, Table} from "react-bootstrap";
import {DefaultColumnFilter, Filter} from "./Filter";
import {Col, Input, Row} from "reactstrap";

const TableContainer = ({columns, data}) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        page,
        rows,
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

    const generateSortingIndicator = column => {
        return column.isSorted ? (column.isSortedDesc ? " ▼" : " ▲") : "";
    }


    const onChangeInSelect = event => {
        setPageSize(Number(event.target.value));
    }

    const onChangeInInput = event => {
        const page = event.target.value ? Number(event.target.value) - 1 : 0;
        gotoPage(page);
    }

    return (
        <Fragment>
            <Table className="table mx-auto table-bordered my-2  mb-0" responsive {...getTableProps()}>
                <thead>
                {headerGroups.map(headerGroup => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map(column => (
                            <th {...column.getHeaderProps()} style={{maxWidth: '100px'}}>
                                <div  className="text-center" {...column.getSortByToggleProps()}>
                                    {column.render("Header")}
                                    {generateSortingIndicator(column)}
                                </div>
                                <Filter column={column}/>
                            </th>
                        ))}
                    </tr>
                ))}
                </thead>

                <tbody {...getTableBodyProps()}>
                {page.map(row => {
                    prepareRow(row)
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => {
                                return <td {...cell.getCellProps()} className={"px-2 py-1"} style={{fontSize: '15px'}}>{cell.render("Cell")}</td>
                            })}
                        </tr>
                    )
                })}
                </tbody>
            </Table>
            {/*<Table className="table mx-auto table-bordered my-2 w-auto mb-0" responsive>*/}
            <Row className="align-items-center border justify-content-center" style={{margin: "0 auto", textAlign: "center", backgroundColor: '#edeeef'}}>
                <Col md={3} sm={12}>
                    <Button
                        className="mx-0"
                        color="light"
                        variant="light"
                        onClick={() => gotoPage(0)}
                        disabled={!canPreviousPage}
                    >
                        {"<<"}
                    </Button>
                    <Button
                        variant="light"
                        color="light"
                        onClick={previousPage}
                        disabled={!canPreviousPage}
                    >
                        {"<"}
                    </Button>
                </Col>
                <Col className={"my-auto ps-1"} md={2} sm={12} style={{marginTop: 7}}>
                    Page{" "}
                    <strong>
                        {pageIndex + 1} of {pageOptions.length}
                    </strong>
                </Col>
                <Col md={2} sm={1} className={"w-auto my-auto"}>
                    <Input
                        className={""}
                        type="number"
                        min={1}
                        style={{width: 70}}
                        max={pageOptions.length}
                        defaultValue={pageIndex + 1}
                        onChange={onChangeInInput}
                    />
                </Col>
                <Col md={2} sm={2} className={"w-auto my-auto"}>
                    <Input type="select" value={pageSize} onChange={onChangeInSelect}>
                        >
                        {[10, 20, 30, 40, 50].map(pageSize => (
                            <option key={pageSize} value={pageSize}>
                                Show {pageSize}
                            </option>
                        ))}
                    </Input>
                </Col>
                <Col md={3} sm={12}>
                    <Button
                        variant="light"
                        className="mx-0"
                        color="light"
                        onClick={nextPage}
                        disabled={!canNextPage}
                    >
                        {">"}
                    </Button>
                    <Button
                        variant="light"
                        // className=" btn-light btn-dark"
                        color="light"
                        onClick={() => gotoPage(pageCount - 1)}
                        disabled={!canNextPage}
                    >
                        {">>"}
                    </Button>
                </Col>
            </Row>
            {/*</Table>*/}
        </Fragment>
    )
}

export default TableContainer