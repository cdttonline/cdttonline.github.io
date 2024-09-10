/**
 * @class PracticeTest
 * 
 * This class is called when the participant starts a practice test.
 */
class PracticeTest {

    constructor(language, talker, list, mode, testEar, speechLevel, maskerLevel) {
        this.language = language;
        this.talker = talker;
        this.list = list;
        this.mode = mode;   
        this.testEar = testEar;
        this.speechLevel = speechLevel;
        this.maskerLevel = maskerLevel;
    }

    /**
     * This method returns a random list number to perform the practice 
     * test. If the random list number is the same as the list number 
     * chosen by the user in the test parameters, the getRandomList() 
     * method is called again. Otherwise, the return value is the random 
     * list number chosen by the program. 
     * 
     * @param {Number} list List number in the test parameters
     * @returns random list number
     */
    getRandomList(list) {
        
        // Get the list that is used for the test
        // Do not use the same list, will chose random list between the other 3 lists
        // Return integer number between 1 and 4 (both included)
        let randomList = Math.floor(Math.random() * 4) + 1;
        let tmpList = list.split(""); // list 0X

        if (randomList == tmpList[1]) {
            return this.getRandomList(list);
        }
        return randomList;
    }


    /**
     * This method calls the getRandomList() function
     * where a random list number is chosen, to 
     * perform the practice test. The getListOfFile()
     * function is called to retrieve all .wav files
     * in the random list chosen.
     * 
     * @param {Number} list 
     */
    showList(list) {
        let tmp = this.getRandomList(list);
        
        // Get the file
        CDTT.getListOfFile(this.language, this.talker, tmp);
        
    }
}