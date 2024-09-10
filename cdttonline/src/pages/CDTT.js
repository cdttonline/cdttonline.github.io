// import React from "react";
// /**
//  * CLASS
//  */
// var correctAnswer = [];                 // Array of correct triplets for each triplet
// var maskerAudioWav = "";        // Masker Audio .wav file (download url)
// let ixCurrentTriplet=0;                 // Triplet index: keeps track of current triplet
// var numberReversal;             // Number of reversals for adaptive procedure

// class CDTT extends React.Component {

//     // Constructor
//     constructor(language, talker, list, masker, mode, testEar, speechLevel, maskerLevel, btestQuiet, tripletType, currentSNR, list_wav, initialVolume) {
//         this.language = language;
//         this.talker = talker;
//         this.list = list;
//         this.masker = masker;
//         this.mode = mode;
//         this.testEar = testEar;
//         this.speechLevel = speechLevel;
//         this.maskerLevel = maskerLevel;
//         this.btestQuiet = btestQuiet;
//         this.tripletType = tripletType;
//         this.currentSNR = currentSNR;
//         this.list_wav = list_wav;
//         this.initialVolume = initialVolume;
//     }


//     show() {
//         console.log(this.language + ", " + this.talker + ", " + this.list + ", " + this.masker + ", " + this.mode + ", " + this.testEar + ", " + this.speechLevel + ", " + this.maskerLevel
//         + ", " + this.btestQuiet + ", " + this.tripletType + ", " + this.currentSNR);
//         // output on console: EN_CA, Female, 01, SSNOISE, Fix Level, Left, 65, 65, false, Triplet       (when checkbox not selected for test in quiet)
//     }

//     /**
//      * This method gets the path to the folder on Github that
//      * meets all the requirements
//      * @param {String} language 
//      * @param {String} talker 
//      * @param {string} list 
//      */
    // static getListOfFile (language, talker, list) {
    //     var wavFile = new XMLHttpRequest();
        
    //     wavFile.open('GET','https://api.github.com/repos/MelinaRochon/CDTT_lists/contents/' , 
    //         true)
    //         wavFile.onload = function() {
    //             var data = JSON.parse(this.response);
                
    //             // set the number of lists
    //             for (let i=0; i<data.length; i++) {
                    
    //                 // Check if the name of the Triplet corresponds to any
    //                 // of the list name
    //                 // ex. Triplet_List-01-EN_CA-Female
    //                 let nameFolder = data[i].name;
    //                 const paramArray = nameFolder.split("-");
    //                 // Array: [Language, Talker]
                    
    //                 // Check if all the parameters of the folder correspond to the ones selected by the user
    //                 if ((paramArray[0] == language) && (paramArray[1] == talker)){
    //                     // Found list
    //                     // Returns the path of folder to access it later on
    //                     CDTT.getCorrectFile(data[i].url, list)
    //                 }
                    
    //                 // for debugging purpose
    //                 //console.log(tempName);
    //                 //console.log(paramArray);
    //                 //console.log(data);
    //             }
    //         }
    //         wavFile.send();
    // }


//     /**
//      * This method gets the path to the folder on Github that
//      * meets all the requirements 
//      */
    // static getCorrectFile (url, list) {
    //     var file = new XMLHttpRequest();
    //     let maskerUrl = "";
    //     file.open('GET', url , true)
    //     file.onload = function() {
    //             var data = JSON.parse(this.response);
    //             // set the number of lists
    //             for (let i=0; i<data.length; i++) {
                    
    //                 // Check if the name of the Triplet corresponds to any
    //                 // of the list name
    //                 // ex. Triplet_List-01
    //                 let nameFolder = data[i].name;

    //                 // Check for masker 
    //                 if (nameFolder == "SSNOISE.wav") {
    //                     maskerUrl = data[i].download_url;
    //                 } 
    //                 else {
    //                     const paramArray = nameFolder.substring(13); 
                      
    //                     // Check if all the parameters of the folder correspond to the ones selected by the user
    //                     if (paramArray == list){ 
    //                         // Found list
    //                         // Returns the path of folder to access it later on
    //                         if (maskerUrl == "") {
    //                             maskerUrl="https://raw.githubusercontent.com/MelinaRochon/CDTT_lists/main/Maskers/SSNOISE.wav"
    //                         }
    //                         CDTT.getWavFolder(data[i].url, maskerUrl);
    //                     }
    //                 }
    //             }
    //         }
    //         file.send();
    // }


//     /**
//      * This static method sets the on-screen keyboard to visible or hidden.
//      * @param {boolean} visible 
//      */
//     static enableKeyboard(visible) {
//         document.getElementById("tableKeyboard").style.visibility = visible;
//     }


//     /**
//      * This function gets the url for the correct folder on Github and
//      * gets all .wav files in the folder, to play the triplets. 
//      * 
//      * @param url path of the wav folder
//      */
    // static getWavFolder(url, maskerUrl) {
    //     // Get the folders in a list
    //     var wavFiles = new XMLHttpRequest();
    //     let maskerAudioWav = maskerUrl;
    //     wavFiles.open('GET', url, true)
    //     wavFiles.onload = function() {
    //         var data = JSON.parse(this.response);
            
    //         // returns random index between 0 and data.length, then pushes 
    //         // the selected index number to the list, to create a random triplet
    //         // selection

    //         let i = 0;
    //         var tmpCorrectAnswer = [];
    //         // Returns a random integer between 0 and data.length
    //         // Mix the order of the triplets randomly
    //         while (data.length > 0) {
    //             let random = Math.floor(Math.random() * data.length);
    //             this.list_wav[i] = data[random].download_url;

    //             // Get the correct answer triplet
    //             tmpCorrectAnswer[i] = data[random].name;
                
    //             // Delete .wav, keep the triplet digits
    //             correctAnswer[i] = tmpCorrectAnswer[i].substring(0,3);
    //             data.splice(random, 1);
    //             i++; 
    //         }

    //         // play masker if !testInQuiet
    //         CDTT.playAudio(this.list_wav[0]);
    //     }
    //     wavFiles.send();
    // }

    
//     /**
//      * This function plays each triplets. It sets the volume of each audio file
//      * according to the gain (from dB). 
//      * 
//      * @param {String} wavFile 
//      */
//     static playAudio(wavFile) { 
        
//         // Create triplet and masker audio object
//         var audio = new Audio(wavFile);
//         var maskerNOISE = new Audio(maskerAudioWav);

//         // Set the crossOrigin to 'anonymous', or else 
//         // we have a CORS policy error
//         audio.crossOrigin = 'anonymous';
//         maskerNOISE.crossOrigin = 'anonymous';
//         try {

//             console.log('iteration: '+ ixCurrentTriplet + ', SNR = ' + this.currentSNR);
//             console.log('Reversal = ' + numberReversal); 
            
//             // Calculate the gain volume
//             let setVolume = CDTT.gainVolume();
            
//             // Play the triplet and the masker only if the 
//             // gain value is between 0.0 and 1.0
//             if (setVolume) {
                
//                 // Set the volume for audio
//                 //audio.volume = initialVolume;
//                 if (this.mode == "Adaptive") {
//                     audio.volume = this.initialVolume;
//                 } else {
//                     // Audio volume stays the same
//                     audio.volume = document.getElementById("speechCalib").value;
//                 }

//                 // Set the volume for masker
//                 maskerNOISE.volume = document.getElementById("maskerCalib").innerHTML;
//                 // No masker, test in quiet
//                 if (this.btestQuiet===true) {
//                     maskerNOISE.volume = 0.0;
//                 }
                
//                 // Play audio
//                 maskerNOISE.play();
//                 audio.play();

//                 console.log("volume audio=" + audio.volume + " | volume masker="+ maskerNOISE.volume );
//             }
            
//             // check if user clicked on "stop button"
//             // if so, stop sound
//             let stopBtn = document.getElementById("btnStopTest");
//             stopBtn.addEventListener("click", function () {
//                 // Stop audio
//                 maskerNOISE.pause();
//                 audio.pause();
//             })

//             // Check if user clicked on the skip to test button
//             let skipBtn = document.getElementById("btnSkipToTest");
//             skipBtn.addEventListener("click", function() {
//                 // Stop audio
//                 maskerNOISE.pause();
//                 audio.pause();
//             });   

//         } catch (err) {
//             console.log("failed to play " + err);
//         }

//         // Audio is done playing
//         audio.onended = function() {
//             // stop audio
//             maskerNOISE.pause();

//             // Change value of keyboard to false
//             // bNotReadyForAnswer = false;

//             // check if all 3 digits are already entered on keyboard
//             let tmpInputValue = document.getElementById('inputUserText').value;

//             // Update the textfield
//             // if (tmpInputValue.length == 3) {
//             //     updateTextFieldKeyboard(tmpInputValue);
//             // }      
//         };
//     }

    
//     /**
//      * This function calculates the volume gain.
//      * @returns 
//      */
//     static gainVolume() {
        
//         // 1.0 ==> 100%
//         // We will want to change volume according to the gain 
//         var gainVolume = 0;
//         var tempVolume = 0.0; // temp value to store the current audio file volume

//         // Temporary value to old the previous volume
//         var prevVolume = this.initialVolume;

//         // Calculate the gain
//         if (bCorrectAnswer == true) {
//             tempVolume = Math.pow(10, -(dBSTEP)/20);
//         } else {
//             tempVolume = Math.pow(10, dBSTEP/20);
//         }

//         this.initialVolume = tempVolume * this.initialVolume;

//         // Gain is greater than 1.0, therefore abort test run
//         if (Settings.SUBMIT_BTN_TEST == 2) {
//             if (this.initialVolume > 1.00) {
//                 this.initialVolume = prevVolume;
//                 alert("The maximum volume has been reached. \nThe test run is aborted.");
//                 stopTest();
//                 return false;
//             } 
    
//             // If the user reached 5 misses in a row, test run is aborted.
//             if (nmisses >= 5) {
//                 alert("The maximum number of misses have been reached. \nThe test run is aborted.");
//                 stopTest();
//                 return false;
//             }
//         } else {
//             if (this.initialVolume > 1.00) {
//                 this.initialVolume = prevVolume;
//             }
//         }     
//         return true;
//     }
// }

// export default CDTT;