/*
    Version 3

    Day of week prediction algorithm - given (date [1-31], month [1-12], year [1900+])
    the function will return a correct name (e.g. Monday) as the result returned

    Basic Understanding:
    1. Leap year is a year that divisible by 4, but not all of them
    2. If the year is also divisible by 100, it must also be divisible by 400 to be a leap year

    Concept
    1. 1 Jan 1900 is Monday
    2. Given date, month, year input in numerical, calculate how many days it is ahead
    of 1 Jan 1900
    3. Modulo the difference with 7, then cycling the days to get result
*/

/*
    date: [1-31]
    month: [1-12]
    year: [1900+]
*/
export default (date, month, year) => {
    // Input validation
    if (!valid(date, month, year)) return Error('Validation failed')

    // Determine how many dates of the given input ahead of 1 Jan 1900
    let dateDiff = {
        // Get number of dates from 1900 to year - 1
        fullYear: dateBeforeYear(year),
        // Get the number of dates from 1 Jan of the given year to the input date
        fraction: dateAheadFraction(date, month, year)
    }
    let totalDateDiff = dateDiff.fullYear + dateDiff.fraction

    // Find minimum shift cycle required
    let shift = totalDateDiff % 7

    // Since 1 Jan 1900 is Monday so the map start with Monday
    let dayMapping = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday']
    return dayMapping[shift]
}

// Accumulate how many days ahead of 1900
function dateBeforeYear(year) {
    const startYear = 1900

    let result = 0
    for (let i = startYear; i < year; i++) {
        if (isLeapYear(i)) result += 366
        else result += 365
    }
    return result
}

// Calculate fraction date difference of that year
function dateAheadFraction(date, month, year) {
    let dateBeforeMonth = 0

    let monthDayArray = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
    for (let i = 1; i < month; i++) {
        if (i === 2 && isLeapYear(year)) dateBeforeMonth += 1
        dateBeforeMonth += monthDayArray[i]
    }
    return date - 1 + dateBeforeMonth
}

// Function to determine if the given year is a leap year or not
function isLeapYear(year) {

    // A year is a leap year if it is divisible by 4
    if (year % 4 == 0) {

        // but if it is divisible by 100
        if (year % 100 == 0) {

            // it must also be divisible by 400 to be a leap year
            if (year % 400 == 0) return true

            // Otherwise it is not
            else return false

        } else {
            // so if it is divisible by 4 and not by 100, it is a leap year
            return true
        }
    } else {
        // if it is not divisible by 4, it is not a leap year
        return false
    }

}


/*
    Validate Section
*/

function valid(date, month, year) {
    // date, month, year must be number
    if ( isNaN(Number(date)) || isNaN(Number(month)) || isNaN(Number(year)) ) return false
    // Date must be within 1-31
    if ( date < 1 || date > 31 ) return false
    // Month must be within 1-12
    if ( month < 1 || month > 12 ) return false
    // Year must be at least 1900
    if ( year < 1900 ) return false
    // on february
    if ( month == 2 ) {
        // in leap year
        if (isLeapYear(year)) {
            // date cannot be larger than 29
            if (date > 29) return false
        } else {
            // otherwise date cannot be larger than 28
            if (date > 28) return false
        }
    }
    // on month 4,6,9,11
    if ([4,6,9,11].includes(month)) {
        // date cannot exceed 30
        if (date > 30) return false
    }
    return true
}

/*
    Unit Test
*/
let testCase = () => {
    let date = new Date(1900, 0, 1)
    for (let i = 1; i < 10000; i++) {
        let d = date.getDate()
        let m = date.getMonth()
        let y = date.getYear()

        let testValue = dayOfWeek(d, m, y)
        let referenceValue = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][ (new Date(y, m, d)).getDay() ]

        if (testValue == referenceValue) console.log('Not Pass', date, testValue, referenceValue)
        else console.log('Pass', date)
        date.setDate(date.getDate() + 1)
    }
}
