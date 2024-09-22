   
export function ExportToCSV (data, resultsId) {
    
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
        extendedResults: data.extendedResults, 
        subjectAge: data.subject.age,
        subjectLangProf: data.subject.languageProficiency,
        subjectBetterEar: data.subject.betterEar,
        subjectHearing: data.subject.hearing,
        subjectDomLang: data.subject.dominantLanguage,
        subjectComment: data.subject.comments
    };

    // Step 2: Create CSV content
    const headers = ['Results ID', 'Date', 'Time'];
    const headers1 = ['Language', 'Talker', 'List', 'Mode', 'Masker', 'Starting SNR', 'Test Ear', 'Triplet Type', 'Score']; 
    const headers2 = ['Reversals', 'SRT', 'St. Dev'];
    const header3 = ['ID', 'Stimulus', 'User'];
    const header4 = ['Age', 'Language Proficiency', 'Better Ear', 'Hearing', 'Dominant Language', 'Comments'];
    const rows = [flattenedData.id, flattenedData.dateAndTime];
    const rows1 = [flattenedData.language, flattenedData.talker, flattenedData.list, flattenedData.mode, flattenedData.masker, flattenedData.startingSNR, flattenedData.testEar, flattenedData.tripletType, flattenedData.score];
    const rows2 = [flattenedData.reversals, flattenedData.srt, flattenedData.stDev];
        
    const rows3 = flattenedData.extendedResults.map((item, idx) => {
        const parts = item.split('|');
        const stimulusPart = parts[0].trim(); // "Stimulus: XXX"
        const userPart = parts[1].trim(); // "User: XXX"

        // Extract the numbers from each part
        const stimulusNumber = parseInt(stimulusPart.split(':')[1].trim(), 10); 
        const userNumber = parseInt(userPart.split(':')[1].trim(), 10); 
        return [(idx+1), stimulusNumber, userNumber].join(",");
    });

    const rows4 = [flattenedData.subjectAge, flattenedData.subjectLangProf, flattenedData.subjectBetterEar, flattenedData.subjectHearing, flattenedData.subjectDomLang, flattenedData.subjectComment];
    const csvContent = [headers.join(','), rows.join(','), headers1.join(','), rows1.join(','), headers2.join(','), rows2.join(','), header4.join(','), rows4.join(','), header3.join(','), ...rows3].join('\n');

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