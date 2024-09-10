import { useEffect } from "react";
import DataTable from "react-data-table-component"

function Table({correctAnswer, userAnswer, ixCurrentTriplet}) {

    // const columns = [
    //     {
    //         name: "Triplet #",
    //         selector: (row) => row
    //     },
    //     {
    //         name: "Stimulus Digit",
    //         selector: (row) => row
    //     },
    //     {
    //         name: "User Answer",
    //         selector: (row) => row
    //     }
    // ]
    // return (
    //     <>
    //         <div className="container my-5">
    //             <DataTable />
    //         </div>
    //     </>
    // )

    // useEffect(() => {
    //     for (let id = 0; id <= ixCurrentTriplet; id++) {
            
    //     }
    // }, [])

    

    return (
        <>  
            <tr key={0} >
                <th style={{textAlign:"center"}}>Triplet #</th>
                <th colSpan={3} style={{textAlign:"center"}}>Stimulus Digit</th>
                <th colSpan={3} style={{textAlign:"center"}}>User Answer</th>

            </tr>
            {correctAnswer.map((val, id) => {
                let tmpVal = val.split('');
                return(
                <tr key={id+1}>{id+1}
                    
                    <td>{tmpVal[0]}</td>
                    <td>{tmpVal[1]}</td>
                    <td>{tmpVal[2]}</td>
                    {userAnswer.map((answer, idx) => {
                        if (idx == id) {
                            let tmpUserVal = answer.split('');
                            return(
                                <>
                                    <td>{tmpUserVal[0]}</td>
                                    <td>{tmpUserVal[1]}</td>
                                    <td>{tmpUserVal[2]}</td>
                                </>
                            )
                        }
                    })}
                </tr>
                )
            })}
        </>
    )    
            // {correctAnswer.find((val, idx) => {
            //     if (idx == id) {
            //         let tmpVal = val.split('');
            //         return(
            //             <>
            //                 <td>{tmpVal[0]}</td>
            //                 <td>{tmpVal[1]}</td>
            //                 <td>{tmpVal[2]}</td>
            //             </>
            //         )
            //     }    
            // })
            // }
            // {userAnswer.find((val, idx) => {
            //     if (idx == id) {
            //         let tmpVal = val.split('');
            //         return(
            //             <>
            //                 <td>{tmpVal[0]}</td>
            //                 <td>{tmpVal[1]}</td>
            //                 <td>{tmpVal[2]}</td>
            //             </>
            //         )
            //     }
            // })}
        
   
}

export default Table;


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

// export function slicingUserAnswer (cAnswerVal, uAnswerVal, idx) {
//     if (cAnswerVal !== uAnswerVal) {
//         return uAnswerVal.slice(idx+1)
//     }
//     return uAnswerVal;
// }

