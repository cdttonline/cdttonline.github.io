import React from 'react';
import saveAs from 'file-saver';
import * as XLSX from 'xlsx';

// const ExcelExport = ({ data, resultsId }) => {
//   const exportToExcel = () => {
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     const blob = new Blob([excelBuffer], {type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8"});
//     FileSaver.saveAs(blob, `${fileName}.xlsx`);
//   };

//   return (
//     <button onClick={exportToExcel}>Export to Excel</button>
//   );

    
export function ExportToCSV (data, resultsId) {
    console.log(data)
    // Step 1: Flatten the nested object in column3 and prepare the CSV data
    const flattenedData = {
        id: resultsId,
        dateAndTime: data.dateAndTime,
        language: data.language,
        talker: data.talker,
        list: data.list,
        mode: data.mode,
        masker: data.masker,
        startingSNR: data.startingSNR,
        testEar: data.testEar,
        tripletType: data.tripletType,
        reversals: data.adaptiveTest.reversals,
        srt: data.adaptiveTest.srt,
        stDev: data.adaptiveTest.stDev,
        score: data.score,
        extendedResults: data.extendedResults  
    };

    // Step 2: Create CSV content
    const headers = ['Results ID', 'Date', 'Time'];
    const headers1 = ['Language', 'Talker', 'List', 'Mode', 'Masker', 'Starting SNR', 'Test Ear', 'Triplet Type', 'Score']; 
    const headers2 = ['Reversals', 'SRT', 'St. Dev'];
    const rows = [[flattenedData.id, flattenedData.dateAndTime, flattenedData.language, flattenedData.talker, flattenedData.list]];
    const rows1 = [flattenedData.language, flattenedData.talker, flattenedData.list, flattenedData.mode, flattenedData.masker, flattenedData.startingSNR, flattenedData.testEar, flattenedData.tripletType, flattenedData.score];
    const rows2 = [flattenedData.reversals, flattenedData.srt, flattenedData.stDev];
        
    const header3 = ['ID', 'Stimulus', 'User'];
    const rows3 = flattenedData.extendedResults.map((item, idx) => {
        const parts = item.split('|');
        const stimulusPart = parts[0].trim(); // "Stimulus: 254"
        const userPart = parts[1].trim(); // "User: 514"

        // Extract the numbers from each part
        const stimulusNumber = parseInt(stimulusPart.split(':')[1].trim(), 10); // 254
        const userNumber = parseInt(userPart.split(':')[1].trim(), 10); // 514
        return [(idx+1), stimulusNumber, userNumber].join(",");
    });
    const csvContent = [headers.join(','), rows.join(','),  headers1.join(','), rows1.join(','), headers2.join(','), rows2.join(','), header3.join(','), ...rows3].join('\n');

    // Step 3: Create a Blob from the CSV content and trigger download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${resultsId}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
};