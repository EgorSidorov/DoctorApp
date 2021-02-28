export function dateTimeToString(date : any) : string{
    return date.toLocaleString("en-CA", {hourCycle: "h24"}).replace(',', '').slice(0,19);
}

export function dateToString(date : any) : string{
    return date.toLocaleString("en-CA", ).replace(',', '').slice(0,10);
}