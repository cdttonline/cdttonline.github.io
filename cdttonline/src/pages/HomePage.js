import { useEffect, useState } from "react";
import InternalCalibrationValues from "../components/InternalCalibrationValues";
import { TestParameters } from "../components/TestParameters";
// import {CDTTTest} from "../../../src/CDTT.html"
// import CDTTTest from "../CDTT.html";

export const HomePage=()=> {
    // const [htmlContent, setHtmlContent] = useState('');
    // const perf = require('../CDTT.html')
    // useEffect(() => {
    //     fetch(CDTTTest).then(response => response.text()).then(data => setHtmlContent(data)).catch(er =>console.error("error loading html file", er));
    // }, [])
    return (
        <> 
            {/* <div dangerouslySetInnerHTML={{__html: CDTTTest}} />                */}
            {/* <iframe src={perf}></iframe> */}
            <h1>ABOUT</h1>
             {/*<InternalCalibrationValues/> */}
                    {/* <!-- <p id="testISIOS">hh</p> -->
                    <!-- <button type="button" id="btn" onclick="openAskViewModal()">Show Modal</button> -->

                    <!-- Show first Modal -- Ask user if wants to view Results --> */}
            {/* <div class="main" id="mainButton">
                <button onclick="loadTest()">Load CDTT test</button> 
            </div> */}
        </>
    );
}