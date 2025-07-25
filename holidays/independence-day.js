class IndependenceDay {
    constructor() {
        this.config = {
            observed: false,
            startDate: null,
            startTime: '17:00',
            exchangeDate: null,
            exchangeTime: '17:00',
            endDate: null,
            endTime: '17:00',
            firstHalfParent: 'Father',
            firstHalfYears: 'Even',
            secondHalfParent: 'Mother',
            secondHalfYears: 'Even'
        };
        this.initializeDefaults();
    }

    initializeDefaults() {
        // Set default dates based on Independence Day rules
        const july3 = DateUtils.getNextJuly3rd();
        const year = july3.getFullYear();
        const july4 = new Date(year, 6, 4); // July 4th
        const july5 = DateUtils.getJuly5th(year);
        
        this.config.startDate = july3;
        this.config.exchangeDate = july4;
        this.config.endDate = july5;
    }

    generateForm() {
        return `
            <div class="holiday-config">
                <!-- Holiday Observed Checkbox -->
                <div class="config-row">
                    <label class="checkbox-container">
                        <input type="checkbox" id="independenceObserved" class="holiday-checkbox" ${this.config.observed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Holiday is Observed
                    </label>
                </div>
                
                <!-- Start Date and Time -->
                <div class="config-row">
                    <label class="config-label">Start Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="independenceStartDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.startDate)}">
                        <input type="time" id="independenceStartTime" class="config-time-input" value="${this.config.startTime}">
                    </div>
                </div>
                
                <!-- Exchange Date and Time -->
                <div class="config-row">
                    <label class="config-label">Exchange Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="independenceExchangeDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.exchangeDate)}">
                        <input type="time" id="independenceExchangeTime" class="config-time-input" value="${this.config.exchangeTime}">
                    </div>
                </div>
                
                <!-- End Date and Time -->
                <div class="config-row">
                    <label class="config-label">End Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="independenceEndDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.endDate)}">
                        <input type="time" id="independenceEndTime" class="config-time-input" value="${this.config.endTime}">
                    </div>
                </div>
                
                <!-- 1st Half Assignment -->
                <div class="config-row">
                    <label class="config-label">1st Half Goes to:</label>
                    <div class="dropdown-container">
                        <select id="independenceFirstHalfParent" class="config-select">
                            <option value="Mother" ${this.config.firstHalfParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.firstHalfParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="independenceFirstHalfYears" class="config-select">
                            <option value="Odd" ${this.config.firstHalfYears === 'Odd' ? 'selected' : ''}>Odd</option>
                            <option value="Even" ${this.config.firstHalfYears === 'Even' ? 'selected' : ''}>Even</option>
                            <option value="All" ${this.config.firstHalfYears === 'All' ? 'selected' : ''}>All</option>
                        </select>
                        <span class="dropdown-text">Years</span>
                    </div>
                </div>
                
                <!-- 2nd Half Assignment -->
                <div class="config-row">
                    <label class="config-label">2nd Half Goes to:</label>
                    <div class="dropdown-container">
                        <select id="independenceSecondHalfParent" class="config-select">
                            <option value="Mother" ${this.config.secondHalfParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.secondHalfParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="independenceSecondHalfYears" class="config-select">
                            <option value="Odd" ${this.config.secondHalfYears === 'Odd' ? 'selected' : ''}>Odd</option>
                            <option value="Even" ${this.config.secondHalfYears === 'Even' ? 'selected' : ''}>Even</option>
                            <option value="All" ${this.config.secondHalfYears === 'All' ? 'selected' : ''}>All</option>
                        </select>
                        <span class="dropdown-text">Years</span>
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Observed checkbox
        const observedEl = document.getElementById('independenceObserved');
        if (observedEl) {
            observedEl.addEventListener('change', (e) => {
                this.config.observed = e.target.checked;
                this.onConfigChange();
            });
        }

        // Start date - auto-calculate other dates
        const startDateEl = document.getElementById('independenceStartDate');
        if (startDateEl) {
            startDateEl.addEventListener('change', (e) => {
                const newStartDate = new Date(e.target.value + 'T00:00:00');
                this.config.startDate = newStartDate;
                
                // Recalculate exchange and end dates based on the year
                const year = newStartDate.getFullYear();
                const july4 = new Date(year, 6, 4);
                const july5 = DateUtils.getJuly5th(year);
                
                this.config.exchangeDate = july4;
                this.config.endDate = july5;
                
                // Update form fields
                document.getElementById('independenceExchangeDate').value = DateUtils.dateToISOString(july4);
                document.getElementById('independenceEndDate').value = DateUtils.dateToISOString(july5);
                
                this.onConfigChange();
            });
        }

        // Exchange date - auto-calculate end date
        const exchangeDateEl = document.getElementById('independenceExchangeDate');
        if (exchangeDateEl) {
            exchangeDateEl.addEventListener('change', (e) => {
                const newExchangeDate = new Date(e.target.value + 'T00:00:00');
                this.config.exchangeDate = newExchangeDate;
                
                // Recalculate end date
                const year = newExchangeDate.getFullYear();
                const july5 = DateUtils.getJuly5th(year);
                this.config.endDate = july5;
                
                document.getElementById('independenceEndDate').value = DateUtils.dateToISOString(july5);
                
                this.onConfigChange();
            });
        }

        // End date
        const endDateEl = document.getElementById('independenceEndDate');
        if (endDateEl) {
            endDateEl.addEventListener('change', (e) => {
                this.config.endDate = new Date(e.target.value + 'T00:00:00');
                this.onConfigChange();
            });
        }

        // Time fields
        ['independenceStartTime', 'independenceExchangeTime', 'independenceEndTime'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const field = id.replace('independence', '');
                    const configField = field.charAt(0).toLowerCase() + field.slice(1);
                    this.config[configField] = e.target.value;
                    this.onConfigChange();
                });
            }
        });

        // Dropdown fields
        ['independenceFirstHalfParent', 'independenceFirstHalfYears', 'independenceSecondHalfParent', 'independenceSecondHalfYears'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const field = id.replace('independence', '').charAt(0).toLowerCase() + id.replace('independence', '').slice(1);
                    this.config[field] = e.target.value;
                    this.onConfigChange();
                });
            }
        });
    }

    onConfigChange() {
        // Notify the main calendar to update
        if (window.timesharingCalendar && window.timesharingCalendar.generateCalendar) {
            window.timesharingCalendar.generateCalendar();
        }
        
        // Update overnight statistics
        if (window.timesharingCalendar && window.timesharingCalendar.updateOvernightStats) {
            window.timesharingCalendar.updateOvernightStats();
        }
    }

    getInfoForDate(date) {
        // Check if Independence Day is observed
        if (!this.config.observed) {
            return null;
        }

        const startDate = this.config.startDate;
        const exchangeDate = this.config.exchangeDate;
        const endDate = this.config.endDate;

        if (!startDate || !exchangeDate || !endDate) {
            return null;
        }

        // Check if date is within Independence Day period
        if (date < startDate || date > endDate) {
            return null;
        }

        // Determine if it's an odd or even year
        const year = date.getFullYear();
        const isEvenYear = year % 2 === 0;

        // Determine which parent gets first half and second half
        let firstHalfParent, secondHalfParent;
        
        if (this.config.firstHalfYears === 'All' || 
            (this.config.firstHalfYears === 'Even' && isEvenYear) ||
            (this.config.firstHalfYears === 'Odd' && !isEvenYear)) {
            firstHalfParent = this.config.firstHalfParent;
        } else {
            firstHalfParent = this.config.firstHalfParent === 'Mother' ? 'Father' : 'Mother';
        }

        if (this.config.secondHalfYears === 'All' || 
            (this.config.secondHalfYears === 'Even' && isEvenYear) ||
            (this.config.secondHalfYears === 'Odd' && !isEvenYear)) {
            secondHalfParent = this.config.secondHalfParent;
        } else {
            secondHalfParent = this.config.secondHalfParent === 'Mother' ? 'Father' : 'Mother';
        }

        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const exchangeDateOnly = new Date(exchangeDate.getFullYear(), exchangeDate.getMonth(), exchangeDate.getDate());
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        // Determine the phase and return appropriate info
        if (dateOnly.getTime() === startDateOnly.getTime()) {
            // Start date - check what regular schedule would be for this day
            let currentParentRegular = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
                currentParentRegular = regularSchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            const colorClass = this.getTransitionColorClass(currentParentRegular, firstHalfParent);
            return {
                statusText: `To ${firstHalfParent} for Independence Day`,
                time: this.config.startTime,
                colorClass: colorClass,
                icon: '🎆'
            };
        } else if (dateOnly > startDateOnly && dateOnly < exchangeDateOnly) {
            // Between start and exchange
            const colorClass = firstHalfParent === 'Father' ? 'father-day' : 'mother-day';
            return {
                statusText: `With ${firstHalfParent} for Independence Day`,
                time: null,
                colorClass: colorClass,
                icon: '🎆'
            };
        } else if (dateOnly.getTime() === exchangeDateOnly.getTime()) {
            // Exchange date - transition from first half parent to second half parent
            const colorClass = this.getTransitionColorClass(firstHalfParent, secondHalfParent);
            return {
                statusText: `To ${secondHalfParent} for Independence Day`,
                time: this.config.exchangeTime,
                colorClass: colorClass,
                icon: '🎆'
            };
        } else if (dateOnly > exchangeDateOnly && dateOnly < endDateOnly) {
            // Between exchange and end
            const colorClass = secondHalfParent === 'Father' ? 'father-day' : 'mother-day';
            return {
                statusText: `With ${secondHalfParent} for Independence Day`,
                time: null,
                colorClass: colorClass,
                icon: '🎆'
            };
        } else if (dateOnly.getTime() === endDateOnly.getTime()) {
            // End date - check what regular schedule would be the next day
            const nextDayDate = new Date(endDate);
            nextDayDate.setDate(nextDayDate.getDate() + 1);
            
            // Get the regular schedule for the day after Independence Day ends
            let nextParent = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            const colorClass = this.getTransitionColorClass(secondHalfParent, nextParent);
            return {
                statusText: `To ${nextParent} (Independence Day Ends)`,
                time: this.config.endTime,
                colorClass: colorClass,
                icon: '🎆'
            };
        }

        return null;
    }

    getTransitionColorClass(fromParent, toParent) {
        if (fromParent === 'Father' && toParent === 'Mother') {
            return 'exchange-to-mother';
        } else if (fromParent === 'Mother' && toParent === 'Father') {
            return 'exchange-to-father';
        } else if (fromParent === toParent) {
            return toParent === 'Father' ? 'father-day' : 'mother-day';
        }
        return 'exchange-to-father';
    }

    // Export/Import for save/load functionality
    exportConfig() {
        return {
            ...this.config,
            startDate: this.config.startDate ? this.config.startDate.toISOString() : null,
            exchangeDate: this.config.exchangeDate ? this.config.exchangeDate.toISOString() : null,
            endDate: this.config.endDate ? this.config.endDate.toISOString() : null
        };
    }

    importConfig(configData) {
        if (configData) {
            this.config = {
                ...configData,
                startDate: configData.startDate ? new Date(configData.startDate) : null,
                exchangeDate: configData.exchangeDate ? new Date(configData.exchangeDate) : null,
                endDate: configData.endDate ? new Date(configData.endDate) : null
            };
        }
    }
}