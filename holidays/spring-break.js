class SpringBreak {
    constructor() {
        this.config = {
            observed: false,
            startDate: null,
            startTime: '15:00',
            exchangeDate: null,
            exchangeTime: '18:00',
            endDate: null,
            endTime: '08:00',
            firstHalfParent: 'Mother',
            firstHalfYears: 'Even',
            secondHalfParent: 'Father',
            secondHalfYears: 'Even'
        };
        this.initializeDefaults();
    }

    initializeDefaults() {
        // Set default dates based on "second Friday in March" rule
        const startDate = DateUtils.getNextSecondFridayInMarch();
        const exchangeDate = DateUtils.getNextWednesday(startDate);
        const endDate = DateUtils.getNextMonday(exchangeDate);
        
        this.config.startDate = startDate;
        this.config.exchangeDate = exchangeDate;
        this.config.endDate = endDate;
    }

    generateForm() {
        return `
            <div class="holiday-config">
                <!-- Holiday Observed Checkbox -->
                <div class="config-row">
                    <label class="checkbox-container">
                        <input type="checkbox" id="springObserved" class="holiday-checkbox" ${this.config.observed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Holiday is Observed
                    </label>
                </div>
                
                <!-- Start Date and Time -->
                <div class="config-row">
                    <label class="config-label">Start Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="springStartDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.startDate)}">
                        <input type="time" id="springStartTime" class="config-time-input" value="${this.config.startTime}">
                    </div>
                </div>
                
                <!-- Exchange Date and Time -->
                <div class="config-row">
                    <label class="config-label">Exchange Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="springExchangeDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.exchangeDate)}">
                        <input type="time" id="springExchangeTime" class="config-time-input" value="${this.config.exchangeTime}">
                    </div>
                </div>
                
                <!-- End Date and Time -->
                <div class="config-row">
                    <label class="config-label">End Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="springEndDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.endDate)}">
                        <input type="time" id="springEndTime" class="config-time-input" value="${this.config.endTime}">
                    </div>
                </div>
                
                <!-- 1st Half Assignment -->
                <div class="config-row">
                    <label class="config-label">1st Half Goes to:</label>
                    <div class="dropdown-container">
                        <select id="springFirstHalfParent" class="config-select">
                            <option value="Mother" ${this.config.firstHalfParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.firstHalfParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="springFirstHalfYears" class="config-select">
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
                        <select id="springSecondHalfParent" class="config-select">
                            <option value="Mother" ${this.config.secondHalfParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.secondHalfParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="springSecondHalfYears" class="config-select">
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
        const observedEl = document.getElementById('springObserved');
        if (observedEl) {
            observedEl.addEventListener('change', (e) => {
                this.config.observed = e.target.checked;
                this.onConfigChange();
            });
        }

        // Start date - auto-calculate other dates
        const startDateEl = document.getElementById('springStartDate');
        if (startDateEl) {
            startDateEl.addEventListener('change', (e) => {
                const newStartDate = new Date(e.target.value + 'T00:00:00');
                this.config.startDate = newStartDate;
                
                // Recalculate exchange and end dates
                const exchangeDate = DateUtils.getNextWednesday(newStartDate);
                const endDate = DateUtils.getNextMonday(exchangeDate);
                
                this.config.exchangeDate = exchangeDate;
                this.config.endDate = endDate;
                
                // Update form fields
                document.getElementById('springExchangeDate').value = DateUtils.dateToISOString(exchangeDate);
                document.getElementById('springEndDate').value = DateUtils.dateToISOString(endDate);
                
                this.onConfigChange();
            });
        }

        // Exchange date - auto-calculate end date
        const exchangeDateEl = document.getElementById('springExchangeDate');
        if (exchangeDateEl) {
            exchangeDateEl.addEventListener('change', (e) => {
                const newExchangeDate = new Date(e.target.value + 'T00:00:00');
                this.config.exchangeDate = newExchangeDate;
                
                // Recalculate end date
                const endDate = DateUtils.getNextMonday(newExchangeDate);
                this.config.endDate = endDate;
                
                document.getElementById('springEndDate').value = DateUtils.dateToISOString(endDate);
                
                this.onConfigChange();
            });
        }

        // End date
        const endDateEl = document.getElementById('springEndDate');
        if (endDateEl) {
            endDateEl.addEventListener('change', (e) => {
                this.config.endDate = new Date(e.target.value + 'T00:00:00');
                this.onConfigChange();
            });
        }

        // Time fields
        ['springStartTime', 'springExchangeTime', 'springEndTime'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const field = id.replace('spring', '');
                    const configField = field.charAt(0).toLowerCase() + field.slice(1);
                    this.config[configField] = e.target.value;
                    this.onConfigChange();
                });
            }
        });

        // Dropdown fields
        ['springFirstHalfParent', 'springFirstHalfYears', 'springSecondHalfParent', 'springSecondHalfYears'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const field = id.replace('spring', '').charAt(0).toLowerCase() + id.replace('spring', '').slice(1);
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
        // Check if Spring Break is observed
        if (!this.config.observed) {
            return null;
        }

        const startDate = this.config.startDate;
        const exchangeDate = this.config.exchangeDate;
        const endDate = this.config.endDate;

        if (!startDate || !exchangeDate || !endDate) {
            return null;
        }

        // Check if date is within Spring Break period
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
                statusText: `To ${firstHalfParent} for Spring Break`,
                time: this.config.startTime,
                colorClass: colorClass,
                icon: '🌸'
            };
        } else if (dateOnly > startDateOnly && dateOnly < exchangeDateOnly) {
            // Between start and exchange
            const colorClass = firstHalfParent === 'Father' ? 'father-day' : 'mother-day';
            return {
                statusText: `With ${firstHalfParent} for Spring Break`,
                time: null,
                colorClass: colorClass,
                icon: '🌸'
            };
        } else if (dateOnly.getTime() === exchangeDateOnly.getTime()) {
            // Exchange date - transition from first half parent to second half parent
            const colorClass = this.getTransitionColorClass(firstHalfParent, secondHalfParent);
            return {
                statusText: `To ${secondHalfParent} for Spring Break`,
                time: this.config.exchangeTime,
                colorClass: colorClass,
                icon: '🌸'
            };
        } else if (dateOnly > exchangeDateOnly && dateOnly < endDateOnly) {
            // Between exchange and end
            const colorClass = secondHalfParent === 'Father' ? 'father-day' : 'mother-day';
            return {
                statusText: `With ${secondHalfParent} for Spring Break`,
                time: null,
                colorClass: colorClass,
                icon: '🌸'
            };
        } else if (dateOnly.getTime() === endDateOnly.getTime()) {
            // End date - check what regular schedule would be the next day
            const nextDayDate = new Date(endDate);
            nextDayDate.setDate(nextDayDate.getDate() + 1);
            
            // Get the regular schedule for the day after Spring Break ends
            let nextParent = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            const colorClass = this.getTransitionColorClass(secondHalfParent, nextParent);
            return {
                statusText: `To ${nextParent} (Spring Break Ends)`,
                time: this.config.endTime,
                colorClass: colorClass,
                icon: '🌸'
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