export function currentDate(date) {
    return ((date.getDate() < 10)?"0":"") + date.getDate() +"-"+(((date.getMonth()+1) < 10)?"0":"") + (date.getMonth()+1) +"-"+ date.getFullYear();
}

export function currentTime(time) {
    return ((time.getHours() < 10)?"0":"") + time.getHours() + ":" + ((time.getMinutes() < 10)?"0":"") + time.getMinutes() + ":" + ((time.getSeconds() < 10)?"0":"") + time.getSeconds();
}

export function convertMilliSecToTime(duration) {

    // Convert the time to seconds and minutes
    let seconds = Math.floor(duration/1000) % 60;
    let minutes = Math.floor(duration/ (1000*60));

    seconds = (seconds < 10) ? "0" + seconds : seconds;
    minutes = (minutes < 10) ? "0" + minutes : minutes;

    return minutes + "min " + seconds + "s";
}