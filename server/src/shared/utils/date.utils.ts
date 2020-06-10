export class DateUtils {
    static getNow(): Date {
        return new Date();
    }

    static getNowTimestamp(): number {
        const now = new Date();
        return now.getTime();
    }
}
