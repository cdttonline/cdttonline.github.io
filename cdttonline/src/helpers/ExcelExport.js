export function ExportToCSV (data, resultsId, valueLabels, subjectLabels) {

    // Step 1: Flatten the nested object in column3 and prepare the CSV data
    const flattenedData = {
        id: resultsId,
        dateAndTime: data.dateAndTime,
        language: valueLabels.language[data.language],
        talker: valueLabels.talker[data.talker],
        list: data.list,
        mode: valueLabels.testMode[data.mode],
        masker: data.masker,
        startingSNR: data.startingSNR,
        testEar: valueLabels.testCondition[data.testEar],
        tripletType: valueLabels.scoring[data.tripletType],
        reversals: data.adaptiveTest.reversals,
        srt: data.adaptiveTest.srt,
        stDev: data.adaptiveTest.stDev,
        participantId: data.score ?? 'Undefined',
        extendedResults: data.extendedResults, 
        subjectAge: data.subject.age ?? 'N/A',
        subjectLangProf: subjectLabels.language_proficiency[data.subject.languageProficiency] ?? 'N/A',
        subjectBetterEar: subjectLabels.hearing2[data.subject.betterEar] ?? 'N/A',
        subjectHearing: subjectLabels.hearing1[data.subject.hearing] ?? 'N/A',
        subjectDomLang: data.subject.dominantLanguage ?? 'N/A',
        subjectComment: data.subject.comments ?? 'N/A',
        speechCal: data.speech ?? 'N/A',
        noiseCal: data.noise ?? 'N/A',
        snrArray: data.SNRarray
    };

    // Step 2: Create CSV content
    const headerResultId = ['Results ID', flattenedData.id];
    const headerParticipantID = ['Participant ID', flattenedData.participantId];
    const headersDateAndTime = ['Date', 'Time', 'Duration'];
    const headersBasicInfo = ['Language', 'Talker', 'List #', 'Test Mode', 'Masker', 'Starting SNR', 'Test Condition', 'Scoring', 'Speech Cal', 'Noise Cal'];
    const headersAdaptiveRes = ['Reversals', 'SRT', 'St. Dev'];
    const headerExtendedRes = ['ID', 'Stimulus', 'User', 'SNR'];
    const headerSubjectInfo = ['Age', 'Language Proficiency', 'Better Ear', 'Hearing', 'Dominant Language', 'Comments'];
    
    /* Get the date and time */
    let dateAndTime = flattenedData.dateAndTime;
    const tmpDate = dateAndTime.split('|');
    let [day, month, yearAndTime] = tmpDate[0].split('-');
    let [year, time] = yearAndTime.split(', ');
    const newDateAndTime = `${year}-${month}-${day},${time}`
    const duration = tmpDate[1]

    const rowDateAndTime = [newDateAndTime, duration]

    const rowBasicInfoHeader = ['Basic Information']
    const rowBasicInfo = [flattenedData.language, flattenedData.talker, flattenedData.list, flattenedData.mode, flattenedData.masker, flattenedData.startingSNR, flattenedData.testEar, flattenedData.tripletType, flattenedData.speechCal, flattenedData.noiseCal]

    const rowAdaptiveResHeader = ['Adaptive Results']
    const rowAdaptiveRes = [flattenedData.reversals, flattenedData.srt, flattenedData.stDev];

    const rowExtendedResHeader = ['Extended Results']
    const rowExtendedRes = flattenedData.extendedResults.map((item, idx) => {
        const parts = item.split('|');
        const stimulusPart = parts[0].trim(); // "Stimulus: XXX"
        const userPart = parts[1].trim(); // "User: XXX"

        // Extract the numbers from each part
        const stimulusNumber = parseInt(stimulusPart.split(':')[1].trim(), 10);
        const userNumber = parseInt(userPart.split(':')[1].trim(), 10);
        const snr = flattenedData.snrArray.at(idx)
        return [(idx+1), stimulusNumber, userNumber, snr].join(",");
    });

    const rowSubjectInfoHeader = ['Subject Info']
    const rowSubjectInfo = [flattenedData.subjectAge, flattenedData.subjectLangProf, flattenedData.subjectBetterEar, flattenedData.subjectHearing, flattenedData.subjectDomLang, flattenedData.subjectComment];

    const csvContent = [headerResultId.join(','), headerParticipantID.join(','), [''].join(','), headersDateAndTime.join(','), rowDateAndTime.join(','), [''].join(','), rowBasicInfoHeader.join(','), headersBasicInfo.join(','), rowBasicInfo.join(','), [''].join(','), rowAdaptiveResHeader.join(','), headersAdaptiveRes.join(','), rowAdaptiveRes.join(','), [''].join(','), rowSubjectInfoHeader.join(','), headerSubjectInfo.join(','), rowSubjectInfo.join(','), [''].join(','), rowExtendedResHeader.join(','), headerExtendedRes.join(','), ...rowExtendedRes].join('\n');

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