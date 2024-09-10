import { useEffect, useState } from "react";

export const InternalCalibrationValues=() => {

    const [calibration, setCalibration] = useState({
        speech: "",
        noise: ""
    });

    
    const handleInputChange = (event) => {
        const target = event.target;
        const value = target.value;
        const name = target.name;

        if (name == "volumeRangeMasker") {
            console.log(value + ".0 db")
            calibration.noise = value;
        }
        setCalibration({ ...calibration, [name]: value})
    }

    return (
        <>
            <fieldset id="calibrationValueFrame">
                <legend>Internal Calibration Values</legend>

                {/* <!-- Internal Calibration table --> */}
                <table class="calibrationParametersTable">
                    {/* <!-- Row 1: Speech, Speech Gain input box and Play Noise button --> */}
                    <tr>
                        <td id="tdSpeechCalib" ><label id="speechLabelCalib">Speech:</label></td>
                        {/* <!-- Speech Gain input box disabled--> */}
                        <td id="tdSpeechCalib" ><input id="speechCalib" value={calibration.speech} disabled/></td>
                        {/* <!-- Audio Masker --> */}
                        <audio id="calibMaskerAudio" src="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav" type="audio/wav"></audio>
                        <td colspan="2" id="playMaskerBtn"><button type="button" onclick="buttonCalibration()" id="btnCalibMaskerPlay" class="btnPlay">Play Noise</button></td>
                    </tr>
                    {/* <!-- Row 2: Noise --> */}
                    <tr id="trMaskerCalib">
                        <td><label id="maskerLabelCalib">Noise:</label></td>
                        
                        <td id="tdMaskerCalib">
                            {/* <!-- Masker slider --> */}
                            <input type="range" min="0.1" max="0.9" value={calibration.noise} step="0.1" class="slider" name="volumeRangeMasker" oninput="updateMaskerSliderValue()"/>
                        
                        </td>
                        <td id="tdMaskerCalib"><label id="maskerCalib" for="volumeRangeMasker">{calibration.noise}</label></td>
                    </tr>
                </table>
            </fieldset>
        </>
    );
}

export default InternalCalibrationValues;