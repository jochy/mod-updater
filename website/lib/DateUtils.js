const months = {
    'Jan': '01', 'Feb': '02', 'Mar': '03', 'Apr': '04',
    'May': '05', 'Jun': '06', 'Jul': '07', 'Aug': '08',
    'Sep': '09', 'Oct': '10', 'Nov': '11', 'Dec': '12'
}

const monthsInt = {
    1: 'Jan', 2: 'Feb', 3: 'Mar', 4: 'Apr',
    5: 'May', 6: 'Jun', 7: 'Jul', 8: 'Aug',
    9: 'Sep', 10: 'Oct', 11: 'Nov', 12: 'Dec'
}
export default {
    dateToVersion: function (date) {
        if ((typeof date === 'string' || date instanceof String) && this.isDate(date)) {
            date = new Date(date);
        }
        if (date instanceof Date) {
            return `${date.getUTCFullYear()}.${date.getUTCMonth() + 1}.${date.getUTCDate()}`;
        }
        let dateReformatted = date.replace(/&nbsp;/g, " ")
            .replace("th", "")
            .replace("st", "")
            .replace("nd", "")
            .replace("rd", "")
            .replace(/ /g, " ")
            .trim();
        let tab = dateReformatted.split(' ');
        let newDate = new Date(tab[2], parseInt(months[tab[1]]) - 1, parseInt(tab[0]));
        return `${newDate.getUTCFullYear()}.${newDate.getUTCMonth() + 1}.${newDate.getUTCDate()}`;
    },

    isDate: function(date) {
        return (new Date(date) !== "Invalid Date") && !isNaN(new Date(date));
    },

    dateToString: function(date) {
        if ((typeof date === 'string' || date instanceof String) && this.isDate(date)) {
            date = new Date(date);
        }
        if (date instanceof Date &&  date !== "Invalid Date" && !isNaN(date)) {
            let ye = date.getFullYear();
            let mo = monthsInt[date.getMonth() + 1];
            let da = date.getDate();
            if (da === 1) {
                da = "1st";
            } else if (da === 2) {
                da = "2nd";
            } else if (da === 3) {
                da = "3rd";
            } else {
                da = da + "th";
            }

            date = `${da} ${mo} ${ye}`;
        }

        return date;
    }
}