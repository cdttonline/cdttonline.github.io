import { resultsCollection, usersCollection } from "./Firebase";
import { getDocs } from "firebase/firestore";
const fcts = {};

const getResultsFromDataBase = async() => {
    let res = {
        id: [],
        data: []
    };
    try {
        const querySnapshot = await getDocs(resultsCollection);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            res.id.push(doc.id);
            res.data.push(doc.data());
            
            // res.push(doc.data());
        })
        // console.log(querySnapshot.docs)
        // res = querySnapshot;
    } catch (e) {
        console.log("Error occures", e);
    }
    return res;
}

const getUsersFromDataBase = async() => {
    let res = {
        id: [],
        data: []
    };
    try {
        const querySnapshot = await getDocs(usersCollection);
        querySnapshot.forEach((doc) => {
            // console.log(doc.id, " => ", doc.data());
            res.id.push(doc.id);
            res.data.push(doc.data());
            
            // res.push(doc.data());
        })
        // console.log(querySnapshot.docs)
        // res = querySnapshot;
    } catch (e) {
        console.log("Error occures", e);
    }
    return res;
}

export const exportTableToExcel = (table) => {
    // Get the table HTML
    // const table = document.getElementById('my-table');
    if (!table) return;

    const tableHTML = table.outerHTML.replace(/ /g, '%20');

    // Specify the data type
    const dataType = 'application/vnd.ms-excel';

    // Define the file name
    const fileName = 'table.xls';

    // Create a download link element
    const downloadLink = document.createElement('a');

    // Browser check to support Microsoft Excel file download
    if (navigator.msSaveOrOpenBlob) {
      const blob = new Blob(['\ufeff', tableHTML], {
        type: dataType
      });
      navigator.msSaveOrOpenBlob(blob, fileName);
    } else {
      // Create a link to the file
      downloadLink.href = `data:${dataType}, ${tableHTML}`;

      // Setting the file name
      downloadLink.download = fileName;

      // Triggering the function
      downloadLink.click();
    }
  };


fcts.getResultsFromDataBase = async() => {
    const res = await getResultsFromDataBase();
    return res;
}

fcts.loadUsers = async() => {
    const res = await getUsersFromDataBase();
    return res;
}

export default fcts;