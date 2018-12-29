import moment from 'moment';

export class Gen {
    static objectCopy(obj) {
        return JSON.parse(JSON.stringify(obj));
    }

    static round(num) {
        return Math.round(num);
    }

    static getTimeFromISODate(date) {
        return moment(date).format("hh:mm");
    }

    static getDateFromISODate(date) {
        return moment(date).format("YYYY-MM-DD");
    }

    static getDayFromISODate(date) {
        return date ? Gen.getDayFromNumber(moment(date).day()) : Gen.getDayFromNumber(moment().day());
    }

    static isUserAdmin(user) {
        return user && user.role && (user.role === 'admin');
    }

    static isUserManagerOrAdmin(user) {
        return user && user.role && (user.role === 'manager' || user.role === 'admin');
    }

    static baseName(str) {
        let base = new String(str).substring(str.lastIndexOf('/') + 1);
        if(base.lastIndexOf(".") !== -1)
            base = base.substring(0, base.lastIndexOf("."));
        return base;
    }

    static getFormattedGMTDifference(gmtDifference) {
        let hours = Math.floor(Math.abs(gmtDifference) / 60);
        let minutes = Math.abs(Math.abs(gmtDifference) % 60);

        if(minutes < 10)
            minutes = "0" + minutes;

        if(hours < 10)
            hours = "0" + hours;

        if(gmtDifference < 0)
            return "-" + hours + ":" + minutes;
        return "+" + hours + ":" + minutes;
    }

    static mergeArray(a1, a2) {
        const newArray = Gen.objectCopy(a1);
        a2.map(item => {
            if(newArray.indexOf(item)<0) {
                newArray.push(item);
            }
        });
        return newArray;
    }

    static getBrowserTimeOffset() {
        const d = new Date();
        return -1 * d.getTimezoneOffset();
    }

    static getCurrentTimeinTimeZone(timezone) {
        return moment.utc().add(timezone, 'minutes').format('YY-MM-DD HH:mm:ss');
    }

    static isValidTimeZoneString(value) {
        if (value.length !== 6 || !['+','-'].includes(value[0])  || isNaN(value[1]) || isNaN(value[2]) || isNaN(value[4]) || isNaN(value[5]) || value[3] !== ':') {
            return false;
        }
        return true;
    }

    static getTimeZoneInMinutesFromString(timeZoneString) {
        const hours = Number(timeZoneString[1] + timeZoneString[2]);
        const minutes = Number(timeZoneString[4] + timeZoneString[5]);
        let timeZone = 60*hours + minutes;
        if(timeZoneString[0] === '-') {
            return  -1 *timeZone
        }
        return timeZone;
    }

    static getTimeZoneDifferenceFromBrowser(GMTDifference) {
        const browserTimeZoneOffset = Gen.getBrowserTimeOffset();
        const diff = GMTDifference - browserTimeZoneOffset;
        let timeDiff = Gen.getFormattedGMTDifference(diff);
        if(diff > 0) {
            return timeDiff.substring(1) + " ahead of browser's time";
        } else if(diff < 0){
            return timeDiff.substring(1) + " behind the browser's time";
        } else {
            return "Same timezone as browser";
        }
    }

    static isGreen(GMTDifference) {
        const browserTimeZoneOffset = Gen.getBrowserTimeOffset();
        return GMTDifference < browserTimeZoneOffset;
    }

    static getMonthFromNumber(month) {
        switch(month) {
            case "01":
                return "Jan";
            case "02":
                return "Feb";
            case "03":
                return "Mar";
            case "04":
                return "Apr";
            case "05":
                return "May";
            case "06":
                return "June";
            case "07":
                return "July";
            case "08":
                return "Aug";
            case "09":
                return "Sep";
            case "10":
                return "Oct";
            case "11":
                return "Nov";
            case "12":
                return "Dec";
            default:
                return "-"
        }
    }

    static getDayFromNumber(day) {
        switch(day) {
            case "1":
                return "Mondday";
            case "2":
                return "Tuesday";
            case "3":
                return "Wednesday";
            case "4":
                return "Thursday";
            case "5":
                return "Friday";
            case "6":
                return "Saturday";
            case "7":
                return "Sunday";
            default:
                return "Monday"
        }
    }
}
