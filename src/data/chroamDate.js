class ChroamDate {
    static serializeDate(date) {
        return date.toJSON();
    }

    static deserializeDate(str) {
        if (str)
            return new Date(str);
        else
            return null;
    }

    static parseDate(str) {
        const match = str.match(/[0-3]?\d\.[0-1]?\d\.(20)?\d\d/g);
        if (match) {
            const dateNumbers = match[0].split('.').map(s => +s);
            dateNumbers[1]--;
            if (dateNumbers[2] < 80) {
                dateNumbers[2] += 2000;
            }
            const parsed = new Date(Date.UTC(...dateNumbers.reverse()));
            if (isNaN(parsed.valueOf())) {
                return null;
            }
            else {
                return parsed;
            }
        }
        else {
            return null;
        }
    }

    static stringifyDate(date, long = false) {
        return date.toLocaleDateString('de', {
            weekday: long ? 'long' : 'short',
            day: 'numeric',
            month: long ? 'long' : 'numeric',
            year: 'numeric',
        });
    }
}

export default ChroamDate;
