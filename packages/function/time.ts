export function timeReferNow(date: Date | number | string) {
    date = new Date(date);
    let num = Date.now() - date.getTime();
    num = (num / 1000) | 0;
    if (num < 20) {
        return "刚刚";
    }
    if (num < 60) {
        return num + "秒前";
    }
    num = num / 60;
    if (num < 60) {
        return (num | 0) + "分钟前";
    }
    num = num / 60;
    if (num < 24) {
        return (num | 0) + "小时前";
    }
    num = num / 24;
    if (num < 60) {
        return (num | 0) + "天前";
    }

    return date.toLocaleDateString();
}

export function timeSpec(date: Date) {
    date = new Date(date);
    return date.toLocaleDateString() + date.toLocaleTimeString();
}

export function getMonthDays(year, month) {
    if (month === 2) {
        if (year % 4 === 0) return 29;
        return 28;
    }
    if (month === 4 || month === 6 || month === 9 || month === 11) return 30;
    return 31;
}
