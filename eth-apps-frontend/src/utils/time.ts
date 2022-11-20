
export function roundNextHour(date: Date): Date {
    date.setHours(date.getHours() + 1);
    date.setMinutes(0, 0, 0);
    return date;
}