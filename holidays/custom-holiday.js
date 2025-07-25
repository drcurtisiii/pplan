class CustomHoliday {
    constructor(id, config = {}) {
        this.id = id;
        this.config = {
            observed: false,
            name: config.name || `Custom Holiday ${id}`,
            startDate: config.startDate || null,
            startTime: config.startTime || '15:00',
            exchangeDate: config.exchangeDate || null,
            exchangeTime: config.exchangeTime || '18:00',
            endDate: config.endDate || null,
            endTime: config.endTime || '08:00',
            firstHalfParent: config.firstHalfParent || 'Mother',
            firstHalfYears: config.firstHalfYears || 'All',
            secondHalfParent: config.secondHalfParent || 'Father',
            secondHalfYears: config.secondHalfYears || 'All',
            ...config
        };
    }

    generateModalForm() {
        return `
            <div class="holiday-config">
                <!-- Holiday Name -->
                <div class="config-row">
                    <label class="config-label">Holiday Name:</label>
                    <input type="text" id="customName" class="config-text-input" value="${this.config.name}" placeholder="Enter holiday name" maxlength="50">
                </div>
                
                <!-- Holiday Observed Checkbox -->
                <div class="config-row">
                    <label class="checkbox-container">
                        <input type="checkbox" id="customObserved" class="holiday-checkbox" ${this.config.observed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Holiday is Observed
                    </label>
                </div>
                
                <!-- Start Date and Time -->
                <div class="config-row">
                    <label class="config-label">Start Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="customStartDate" class="config-date-input" value="${this.config.startDate ? DateUtils.dateToISOString(new Date(this.config.startDate)) : ''}">
                        <input type="time" id="customStartTime" class="config-time-input" value="${this.config.startTime}">
                    </div>
                </div>
                
                <!-- Exchange Date and Time -->
                <div class="config-row">
                    <label class="config-label">Exchange Date & Time (Optional):</label>
                    <div class="datetime-container">
                        <input type="date" id="customExchangeDate" class="config-date-input" value="${this.config.exchangeDate ? DateUtils.dateToISOString(new Date(this.config.exchangeDate)) : ''}">
                        <input type="time" id="customExchangeTime" class="config-time-input" value="${this.config.exchangeTime}">
                    </div>
                </div>
                
                <!-- End Date and Time -->
                <div class="config-row">
                    <label class="config-label">End Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="customEndDate" class="config-date-input" value="${this.config.endDate ? DateUtils.dateToISOString(new Date(this.config.endDate)) : ''}">
                        <input type="time" id="customEndTime" class="config-time-input" value="${this.config.endTime}">
                    </div>
                </div>
                
                <!-- 1st Half Assignment -->
                <div class="config-row">
                    <label class="config-label">1st Half Goes to:</label>
                    <div class="dropdown-container">
                        <select id="customFirstHalfParent" class="config-select">
                            <option value="Mother" ${this.config.firstHalfParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.firstHalfParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="customFirstHalfYears" class="config-select">
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
                        <select id="customSecondHalfParent" class="config-select">
                            <option value="Mother" ${this.config.secondHalfParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.secondHalfParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="customSecondHalfYears" class="config-select">
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

    updateFromModal() {
        // Get values from modal form
        const nameEl = document.getElementById('customName');
        const observedEl = document.getElementById('customObserved');
        const startDateEl = document.getElementById('customStartDate');
        const startTimeEl = document.getElementById('customStartTime');
        const exchangeDateEl = document.getElementById('customExchangeDate');
        const exchangeTimeEl = document.getElementById('customExchangeTime');
        const endDateEl = document.getElementById('customEndDate');
        const endTimeEl = document.getElementById('customEndTime');
        const firstHalfParentEl = document.getElementById('customFirstHalfParent');
        const firstHalfYearsEl = document.getElementById('customFirstHalfYears');
        const secondHalfParentEl = document.getElementById('customSecondHalfParent');
        const secondHalfYearsEl = document.getElementById('customSecondHalfYears');

        if (nameEl) this.config.name = nameEl.value || `Custom Holiday ${this.id}`;
        if (observedEl) this.config.observed = observedEl.checked;
        if (startDateEl && startDateEl.value) this.config.startDate = new Date(startDateEl.value + 'T00:00:00');
        if (startTimeEl) this.config.startTime = startTimeEl.value;
        if (exchangeDateEl && exchangeDateEl.value) {
            this.config.exchangeDate = new Date(exchangeDateEl.value + 'T00:00:00');
        } else {
            this.config.exchangeDate = null;
        }
        if (exchangeTimeEl) this.config.exchangeTime = exchangeTimeEl.value;
        if (endDateEl && endDateEl.value) this.config.endDate = new Date(endDateEl.value + 'T00:00:00');
        if (endTimeEl) this.config.endTime = endTimeEl.value;
        if (firstHalfParentEl) this.config.firstHalfParent = firstHalfParentEl.value;
        if (firstHalfYearsEl) this.config.firstHalfYears = firstHalfYearsEl.value;
        if (secondHalfParentEl) this.config.secondHalfParent = secondHalfParentEl.value;
        if (secondHalfYearsEl) this.config.secondHalfYears = secondHalfYearsEl.value;
    }

    getInfoForDate(date) {
        // Check if custom holiday is observed
        if (!this.config.observed) {
            return null;
        }

        const startDate = this.config.startDate;
        const exchangeDate = this.config.exchangeDate;
        const endDate = this.config.endDate;

        if (!startDate || !endDate) {
            return null;
        }

        // Check if date is within custom holiday period
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
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        // If no exchange date, treat as single-period holiday
        if (!exchangeDate) {
            if (dateOnly.getTime() === startDateOnly.getTime()) {
                // Start date - check what regular schedule would be for this day
                let currentParentRegular = 'Father'; // Default fallback
                if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                    const regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
                    currentParentRegular = regularSchedule.status.includes('Fx') ? 'Father' : 'Mother';
                }
                
                const colorClass = this.getTransitionColorClass(currentParentRegular, firstHalfParent);
                return {
                    statusText: `To ${firstHalfParent} for ${this.config.name}`,
                    time: this.config.startTime,
                    colorClass: colorClass,
                    icon: '🎯'
                };
            } else if (dateOnly > startDateOnly && dateOnly < endDateOnly) {
                // Between start and end
                const colorClass = firstHalfParent === 'Father' ? 'father-day' : 'mother-day';
                return {
                    statusText: `With ${firstHalfParent} for ${this.config.name}`,
                    time: null,
                    colorClass: colorClass,
                    icon: '🎯'
                };
            } else if (dateOnly.getTime() === endDateOnly.getTime()) {
                // End date - check what regular schedule would be the next day
                const nextDayDate = new Date(endDate);
                nextDayDate.setDate(nextDayDate.getDate() + 1);
                
                let nextParent = 'Father'; // Default fallback
                if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                    const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                    nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
                }
                
                const colorClass = this.getTransitionColorClass(firstHalfParent, nextParent);
                return {
                    statusText: `To ${nextParent} (${this.config.name} Ends)`,
                    time: this.config.endTime,
                    colorClass: colorClass,
                    icon: '🎯'
                };
            }
        } else {
            // Two-period holiday with exchange
            const exchangeDateOnly = new Date(exchangeDate.getFullYear(), exchangeDate.getMonth(), exchangeDate.getDate());

            if (dateOnly.getTime() === startDateOnly.getTime()) {
                // Start date
                let currentParentRegular = 'Father'; // Default fallback
                if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                    const regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
                    currentParentRegular = regularSchedule.status.includes('Fx') ? 'Father' : 'Mother';
                }
                
                const colorClass = this.getTransitionColorClass(currentParentRegular, firstHalfParent);
                return {
                    statusText: `To ${firstHalfParent} for ${this.config.name}`,
                    time: this.config.startTime,
                    colorClass: colorClass,
                    icon: '🎯'
                };
            } else if (dateOnly > startDateOnly && dateOnly < exchangeDateOnly) {
                // Between start and exchange
                const colorClass = firstHalfParent === 'Father' ? 'father-day' : 'mother-day';
                return {
                    statusText: `With ${firstHalfParent} for ${this.config.name}`,
                    time: null,
                    colorClass: colorClass,
                    icon: '🎯'
                };
            } else if (dateOnly.getTime() === exchangeDateOnly.getTime()) {
                // Exchange date
                const colorClass = this.getTransitionColorClass(firstHalfParent, secondHalfParent);
                return {
                    statusText: `To ${secondHalfParent} for ${this.config.name}`,
                    time: this.config.exchangeTime,
                    colorClass: colorClass,
                    icon: '🎯'
                };
            } else if (dateOnly > exchangeDateOnly && dateOnly < endDateOnly) {
                // Between exchange and end
                const colorClass = secondHalfParent === 'Father' ? 'father-day' : 'mother-day';
                return {
                    statusText: `With ${secondHalfParent} for ${this.config.name}`,
                    time: null,
                    colorClass: colorClass,
                    icon: '🎯'
                };
            } else if (dateOnly.getTime() === endDateOnly.getTime()) {
                // End date
                const nextDayDate = new Date(endDate);
                nextDayDate.setDate(nextDayDate.getDate() + 1);
                
                let nextParent = 'Father'; // Default fallback
                if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                    const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                    nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
                }
                
                const colorClass = this.getTransitionColorClass(secondHalfParent, nextParent);
                return {
                    statusText: `To ${nextParent} (${this.config.name} Ends)`,
                    time: this.config.endTime,
                    colorClass: colorClass,
                    icon: '🎯'
                };
            }
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
            id: this.id,
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