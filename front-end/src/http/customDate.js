export const customDate = (apiTime) => {
    let year = apiTime.getFullYear().toString();
    year = year.substr(2);
    const month = apiTime.getMonth() + 1 < 10 ? "0" + (apiTime.getMonth() + 1) : (apiTime.getMonth() + 1);
    const day = apiTime.getDate() < 10 ? "0" + apiTime.getDate() : apiTime.getDate(); 
    let hour = apiTime.getHours();
    const minutes = apiTime.getMinutes() < 10 ? "0" + apiTime.getMinutes() : apiTime.getMinutes();
    let seconds =  apiTime.getSeconds() < 10 ? "0" + apiTime.getSeconds() : apiTime.getSeconds();
    seconds =  hour > 12 ? seconds + " PM" : seconds + " AM";
    hour = hour > 12 ? hour - 12 : hour;
    hour = hour < 10 ? "0" + hour : hour;

    const apiYMDHM = day + "-" + month + "-" + year + " " + hour + ":" + minutes + ":" + seconds;
    return apiYMDHM
}

export const dBToJSCustomDate = (apiTime) => {

    let newApiTime = apiTime = apiTime.substring(0, apiTime.lastIndexOf("."));
    newApiTime = new Date(newApiTime);

    return customDate(newApiTime)
}