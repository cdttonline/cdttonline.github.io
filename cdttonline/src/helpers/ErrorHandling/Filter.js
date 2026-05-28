import React from "react"
import {Input} from "reactstrap"
import {
    useAllTestsResultsTexts,
    useColumnFiltersLabels,
    useTestLabels
} from "../translations/i18nHelpers";

export const Filter = ({column}) => {
    return (
        <div style={{marginTop: 1, marginBottom: 1}}>
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

    const texts = useAllTestsResultsTexts();
    return (
        <Input className="px-2 py-1" style={{fontSize: '12px'}}
               value={filterValue || ""}
               onChange={e => {
                   setFilter(e.target.value || undefined)
               }}
               placeholder={texts.formPlaceholder[0]}
        />
    )
}

export const SelectColumnFilter = ({
                                       column: {filterValue, setFilter, preFilteredRows, id},
                                   }) => {
    const texts = useAllTestsResultsTexts();

    const options = React.useMemo(() => {
        const options = new Set()
        preFilteredRows.forEach(row => {
            options.add(row.values[id])
        })
        return [...options.values()]
    }, [id, preFilteredRows])

    return (
        <Input  style={{fontSize: '12px', height: '28px'}}
                type="select"
                className="custom-select form-select mt-0"
                value={filterValue}
                onChange={e => {
                    setFilter(e.target.value || undefined)
                }}
        >
            <option value="">{texts.formPlaceholder[1]}</option>
            {options.map((option) => (
                <option key={option} value={option}>
                    {option}
                </option>
            ))}
        </Input>
    )
}

export const BooleanColumnFilter = ({
                                        column: { filterValue, setFilter }
                                    }) => {
    const texts = useColumnFiltersLabels();

    return (
        <Input
            style={{ fontSize: '12px', height: '28px' }}
            type="select"
            className="custom-select form-select mt-0"
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">{texts.all}</option>
            <option value="true">{texts.true}</option>
            <option value="false">{texts.false}</option>
        </Input>
    )
}

export const UsersTypeColumnFilter = ({
                                        column: { filterValue, setFilter }
                                    }) => {
    const texts = useColumnFiltersLabels();

    return (
        <Input
            style={{fontSize: '12px', height: '28px'}}
            type="select"
            className="custom-select form-select mt-0"
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">{texts.all}</option>
            <option value="user">{texts.userType.user}</option>
            <option value="admin">{texts.userType.admin}</option>
            <option value="coop">{texts.userType.coop}</option>
        </Input>
    )
}

export const TalkerTypeColumnFilter = ({
                                          column: { filterValue, setFilter }
                                      }) => {
    const all = useAllTestsResultsTexts();
    const texts = useTestLabels();

    return (
        <Input
            style={{fontSize: '12px', height: '28px'}}
            type="select"
            className="custom-select form-select mt-0"
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">{all.formPlaceholder[1]}</option>
            <option value="female">{texts.talker.female}</option>
            <option value="male">{texts.talker.male}</option>
        </Input>
    )
}

export const TestConditionTypeColumnFilter = ({
                                           column: { filterValue, setFilter }
                                       }) => {
    const all = useAllTestsResultsTexts();
    const texts = useTestLabels();

    return (
        <Input
            style={{fontSize: '12px', height: '28px'}}
            type="select"
            className="custom-select form-select mt-0"
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">{all.formPlaceholder[1]}</option>
            <option value="diotic">{texts.testCondition.diotic}</option>
            <option value="antiphase">{texts.testCondition.antiphase}</option>
        </Input>
    )
}

export const ScoringTypeColumnFilter = ({
                                                  column: { filterValue, setFilter }
                                              }) => {
    const all = useAllTestsResultsTexts();
    const texts = useTestLabels();

    return (
        <Input
            style={{fontSize: '12px', height: '28px'}}
            type="select"
            className="custom-select form-select mt-0"
            value={filterValue || ""}
            onChange={e => {
                setFilter(e.target.value || undefined)
            }}
        >
            <option value="">{all.formPlaceholder[1]}</option>
            <option value="triplet">{texts.scoring.triplet}</option>
            <option value="all">{texts.scoring.all}</option>
        </Input>
    )
}