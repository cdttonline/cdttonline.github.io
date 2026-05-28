import {useExtendedResultsTableTexts} from "../translations/i18nHelpers";

function ExtendedResultsTable({correctAnswer, userAnswer, SNRarray}) {
    const texts = useExtendedResultsTableTexts();

    return (
        <table className="tableExtendedResults border-black">
            <thead>
            <tr key={0} >
                <th style={{textAlign:"center"}}>{texts.headers[0]}</th>
                <th colSpan={3} style={{textAlign:"center"}}>{texts.headers[1]}</th>
                <th colSpan={3} style={{textAlign:"center"}}>{texts.headers[2]}</th>
                <th colSpan={3} style={{textAlign:"center"}}>{texts.headers[3]}</th>
            </tr>
            </thead>
            <tbody>
            {correctAnswer.map((val, id) => {
                let tmpVal = val.split('');
                return(
                    <tr key={id+1}>
                        <td className="text-center">{id + 1}</td>


                        <td>{tmpVal[0]}</td>
                        <td>{tmpVal[1]}</td>
                        <td>{tmpVal[2]}</td>
                        {userAnswer.map((answer, idx) => {
                            if (idx === id) {
                                let tmpUserVal = answer.split('');
                                return(
                                    <>
                                        <td>{tmpUserVal[0]}</td>
                                        <td>{tmpUserVal[1]}</td>
                                        <td>{tmpUserVal[2]}</td>
                                        <td className="text-center">{SNRarray[idx]}</td>
                                    </>
                                )
                            }
                        })}
                    </tr>
                )
            })}
            </tbody>
        </table>
    )
}


export default ExtendedResultsTable;

export function processUserAnswer(cAnswer, uAnswer) {
    var tmpArray = uAnswer;
    for (let idx = 0; idx < uAnswer.length-1; idx++) {
        if (cAnswer[0] !== uAnswer[idx] ) {
            tmpArray = uAnswer.slice(idx+1)
        } else {
            return tmpArray;
        }
    }
    return tmpArray ; // not found 
}
