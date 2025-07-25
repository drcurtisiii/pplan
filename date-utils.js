// Date utility functions for holiday calculations
class DateUtils {
    // Calculate Easter Sunday for a given year
    static calculateEaster(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }

    static getNextEaster() {
        const today = new Date();
        let year = today.getFullYear();
        let easter = this.calculateEaster(year);
        
        if (today > easter) {
            year++;
            easter = this.calculateEaster(year);
        }
        
        return easter;
    }

    static getThursdayBeforeEaster(year) {
        const easter = this.calculateEaster(year);
        const thursday = new Date(easter);
        thursday.setDate(easter.getDate() - 3);
        return thursday;
    }

    static getMondayAfterEaster(year) {
        const easter = this.calculateEaster(year);
        const monday = new Date(easter);
        monday.setDate(easter.getDate() + 1);
        return monday;
    }

    // Mother's Day calculations
    static getMothersDay(year) {
        const may1 = new Date(year, 4, 1);
        const firstSunday = new Date(may1);
        const daysUntilSunday = (7 - may1.getDay()) % 7;
        firstSunday.setDate(1 + daysUntilSunday);
        
        const mothersDay = new Date(firstSunday);
        mothersDay.setDate(firstSunday.getDate() + 7);
        return mothersDay;
    }

    static getNextMothersDay() {
        const today = new Date();
        let year = today.getFullYear();
        let mothersDay = this.getMothersDay(year);
        
        if (today > mothersDay) {
            year++;
            mothersDay = this.getMothersDay(year);
        }
        
        return mothersDay;
    }

    static getFridayBeforeMothersDay(year) {
        const mothersDay = this.getMothersDay(year);
        const friday = new Date(mothersDay);
        friday.setDate(mothersDay.getDate() - 2);
        return friday;
    }

    static getMondayAfterMothersDay(year) {
        const mothersDay = this.getMothersDay(year);
        const monday = new Date(mothersDay);
        monday.setDate(mothersDay.getDate() + 1);
        return monday;
    }

    // Father's Day calculations
    static getFathersDay(year) {
        const june1 = new Date(year, 5, 1);
        const firstSunday = new Date(june1);
        const daysUntilSunday = (7 - june1.getDay()) % 7;
        firstSunday.setDate(1 + daysUntilSunday);
        
        const fathersDay = new Date(firstSunday);
        fathersDay.setDate(firstSunday.getDate() + 14);
        return fathersDay;
    }

    static getNextFathersDay() {
        const today = new Date();
        let year = today.getFullYear();
        let fathersDay = this.getFathersDay(year);
        
        if (today > fathersDay) {
            year++;
            fathersDay = this.getFathersDay(year);
        }
        
        return fathersDay;
    }

    static getFridayBeforeFathersDay(year) {
        const fathersDay = this.getFathersDay(year);
        const friday = new Date(fathersDay);
        friday.setDate(fathersDay.getDate() - 2);
        return friday;
    }

    static getMondayAfterFathersDay(year) {
        const fathersDay = this.getFathersDay(year);
        const monday = new Date(fathersDay);
        monday.setDate(fathersDay.getDate() + 1);
        return monday;
    }

    // Thanksgiving calculations
    static getThanksgivingDay(year) {
        const november1 = new Date(year, 10, 1);
        let firstThursday = new Date(november1);
        const daysUntilThursday = (4 - november1.getDay() + 7) % 7;
        firstThursday.setDate(1 + daysUntilThursday);
        
        const thanksgiving = new Date(firstThursday);
        thanksgiving.setDate(firstThursday.getDate() + 21);
        
        return thanksgiving;
    }

    static getFridayBeforeThanksgiving(year) {
        const thanksgiving = this.getThanksgivingDay(year);
        const friday = new Date(thanksgiving);
        friday.setDate(thanksgiving.getDate() - 1);
        return friday;
    }

    static getMondayAfterThanksgiving(year) {
        const thanksgiving = this.getThanksgivingDay(year);
        const monday = new Date(thanksgiving);
        monday.setDate(thanksgiving.getDate() + 4);
        return monday;
    }

    static getNextThanksgivingBreakStart() {
        const today = new Date();
        let year = today.getFullYear();
        
        let startDate = this.getFridayBeforeThanksgiving(year);
        
        if (today > startDate) {
            year++;
            startDate = this.getFridayBeforeThanksgiving(year);
        }
        
        return startDate;
    }

    // Christmas calculations
    static getChristmasDay(year) {
        return new Date(year, 11, 25);
    }

    static getFirstMondayInJanuary(year) {
        const jan1 = new Date(year, 0, 1);
        let firstMonday = new Date(jan1);
        
        const daysUntilMonday = (1 - jan1.getDay() + 7) % 7;
        if (daysUntilMonday === 0 && jan1.getDay() === 1) {
            firstMonday.setDate(jan1.getDate() + 7);
        } else {
            firstMonday.setDate(jan1.getDate() + daysUntilMonday);
        }
        
        return firstMonday;
    }

    static getNextChristmasBreakStart() {
        const today = new Date();
        let year = today.getFullYear();
        
        let startDate = this.getChristmasBreakStartForYear(year);
        
        if (today > startDate) {
            year++;
            startDate = this.getChristmasBreakStartForYear(year);
        }
        
        return startDate;
    }

    static getChristmasBreakStartForYear(year) {
        const christmas = new Date(year, 11, 25);
        let startDate = new Date(christmas);
        
        while (true) {
            startDate.setDate(startDate.getDate() - 1);
            
            if (startDate.getDay() === 5) {
                const daysDiff = Math.floor((christmas - startDate) / (1000 * 60 * 60 * 24));
                if (daysDiff >= 3) {
                    break;
                }
            }
        }
        
        return startDate;
    }

    // Christmas calculations
    static getChristmasDay(year) {
        return new Date(year, 11, 25);
    }

    static getFirstMondayInJanuary(year) {
        const jan1 = new Date(year, 0, 1);
        let firstMonday = new Date(jan1);
        
        const daysUntilMonday = (1 - jan1.getDay() + 7) % 7;
        if (daysUntilMonday === 0 && jan1.getDay() === 1) {
            firstMonday.setDate(jan1.getDate() + 7);
        } else {
            firstMonday.setDate(jan1.getDate() + daysUntilMonday);
        }
        
        return firstMonday;
    }

    static getNextChristmasBreakStart() {
        const today = new Date();
        let year = today.getFullYear();
        
        let startDate = this.getChristmasBreakStartForYear(year);
        
        if (today > startDate) {
            year++;
            startDate = this.getChristmasBreakStartForYear(year);
        }
        
        return startDate;
    }

    static getChristmasBreakStartForYear(year) {
        const christmas = new Date(year, 11, 25);
        let startDate = new Date(christmas);
        
        while (true) {
            startDate.setDate(startDate.getDate() - 1);
            
            if (startDate.getDay() === 5) {
                const daysDiff = Math.floor((christmas - startDate) / (1000 * 60 * 60 * 24));
                if (daysDiff >= 3) {
                    break;
                }
            }
        }
        
        return startDate;
    }

    // Spring Break calculations
    static getNextSecondFridayInMarch() {
        const today = new Date();
        let year = today.getFullYear();
        
        let secondFriday = this.getSecondFridayInMarch(year);
        
        if (today > secondFriday) {
            year++;
            secondFriday = this.getSecondFridayInMarch(year);
        }
        
        return secondFriday;
    }

    static getSecondFridayInMarch(year) {
        const marchFirst = new Date(year, 2, 1);
        let firstFriday = new Date(marchFirst);
        
        const daysUntilFriday = (5 - marchFirst.getDay() + 7) % 7;
        firstFriday.setDate(1 + daysUntilFriday);
        
        const secondFriday = new Date(firstFriday);
        secondFriday.setDate(firstFriday.getDate() + 7);
        
        return secondFriday;
    }

    static getNextWednesday(date) {
        const wednesday = new Date(date);
        const daysUntilWednesday = (3 - date.getDay() + 7) % 7;
        if (daysUntilWednesday === 0) {
            wednesday.setDate(date.getDate() + 7);
        } else {
            wednesday.setDate(date.getDate() + daysUntilWednesday);
        }
        return wednesday;
    }

    static getNextMonday(date) {
        const monday = new Date(date);
        const daysUntilMonday = (1 - date.getDay() + 7) % 7;
        if (daysUntilMonday === 0) {
            monday.setDate(date.getDate() + 7);
        } else {
            monday.setDate(date.getDate() + daysUntilMonday);
        }
        return monday;
    }

    // Independence Day calculations
    static getNextJuly3rd() {
        const today = new Date();
        let year = today.getFullYear();
        let july3 = new Date(year, 6, 3);
        
        if (today > july3) {
            year++;
            july3 = new Date(year, 6, 3);
        }
        
        return july3;
    }

    static getJuly5th(year) {
        return new Date(year, 6, 5);
    }

    // Memorial Day calculations (last Monday in May)
    static getMemorialDay(year) {
        // Memorial Day is the last Monday in May
        const may31 = new Date(year, 4, 31); // May 31st
        let lastMonday = new Date(may31);
        
        // Find last Monday by going backwards from May 31st
        while (lastMonday.getDay() !== 1) { // Monday is day 1
            lastMonday.setDate(lastMonday.getDate() - 1);
        }
        
        return lastMonday;
    }

    static getNextMemorialDay() {
        const today = new Date();
        let year = today.getFullYear();
        let memorialDay = this.getMemorialDay(year);
        
        if (today > memorialDay) {
            year++;
            memorialDay = this.getMemorialDay(year);
        }
        
        return memorialDay;
    }

    static getFridayBeforeMemorialDay(year) {
        const memorialDay = this.getMemorialDay(year);
        const friday = new Date(memorialDay);
        friday.setDate(memorialDay.getDate() - 3); // 3 days before Monday
        return friday;
    }

    static getSundayBeforeMemorialDay(year) {
        const memorialDay = this.getMemorialDay(year);
        const sunday = new Date(memorialDay);
        sunday.setDate(memorialDay.getDate() - 1); // 1 day before Monday
        return sunday;
    }

    static getTuesdayAfterMemorialDay(year) {
        const memorialDay = this.getMemorialDay(year);
        const tuesday = new Date(memorialDay);
        tuesday.setDate(memorialDay.getDate() + 1); // 1 day after Monday
        return tuesday;
    }

    // General utility functions
    static formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

    static dateToISOString(date) {
        if (!date) return '';
        return date.toISOString().split('T')[0];
    }
}