import React from "react"
import {Input} from "reactstrap"
import InputMask from "react-input-mask";

export const Filter = ({column}) => {
    return (
        <div style={{marginTop: 5}}>
            {column.canFilter && column.render("Filter")}
        </div>
    )
}

export const DefaultColumnFilter = ({
                                        column: {
                                            filterValue,
                                            setFilter,
                                            preFilteredRows: {length},
                                        },
                                    }) => {
    return (
        <Input className="px-2 py-1" style={{fontSize: '14px'}}
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
            placeholder={`find...`}
        />
    )
}

export const SelectColumnFilter = ({
                                       column: {filterValue, setFilter, preFilteredRows, id},
                                   }) => {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <Input  style={{fontSize: '14px', height: '31px'}}
            id="custom-select"
            type="select"
            value={filterValue}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">All</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </Input>
    )
}

export const SelectBooleanFilter = ({
                                       column: {filterValue, setFilter, preFilteredRows, id},
                                   }) => {
    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <Input  style={{fontSize: '14px', height: '32px'}}
                id="custom-select"
                type="select"
                value={filterValue}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
        >
            <option value="">All</option>
            <option value='true' key={'true'}>true</option>
            <option value='false'>false</option>

        </Input>
    )
}

export const NumberColumnFilter = ({
                                        column: {
                                            filterValue,
                                            setFilter,
                                            preFilteredRows: {length},
                                        },
                                    }) => {
    return (
        <Input className="px-2 py-1" style={{fontSize: '14px'}}
               value={filterValue || ""}
               type="number"
               onChange={e => {
                   setFilter(e.target.value || undefined)
               }}
               placeholder={`0`}
        />
    )
}
//
// export const SRTColumnFilter = ({
//                                        column: {
//                                            filterValue,
//                                            setFilter,
//                                            preFilteredRows: {length},
//                                        },
//                                    }) => {
//     return (
//         <InputMask className="px-2 py-1" style={{fontSize: '15px'}}
//                value={filterValue || ""}
//                onChange={e => {
//                    setFilter(e.target.value || undefined)
//                }}
//                placeholder={`0`}
//         />
//     )
// }