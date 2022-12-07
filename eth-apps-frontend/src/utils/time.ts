
export function roundNextHour(date: Date): Date {
    date.setHours(date.getHours() + 1);
    date.setMinutes(0, 0, 0);
    return date;
}

export function formatToSimpleDateTime(date: Date | number | undefined): string {
    if (date === undefined) return ""
    if (typeof date === 'number') {
        date = new Date(date)
    }
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, 
    ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
}