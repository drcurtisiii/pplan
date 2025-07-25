class SummerBreak {
    constructor() {
        this.config = {
            observed: false,
            type: 'vacation-period', // vacation-period, week-on-off, two-weeks-on-off, split-summer, custom
            startDate: null,
            startTime: '18:00',
            endDate: null,
            endTime: '08:00',
            
            // For vacation period model
            vacationDays: 14,
            maxConsecutiveDays: 14,
            notificationDeadline: 'April 1st',
            conflictResolution: 'father-odd', // father-odd, mother-odd
            
            // For week/two-week rotation
            firstWeekParent: 'Father',
            firstWeekYears: 'Odd',
            
            // For split summer model
            exchangeDate: null,
            exchangeTime: '18:00',
            firstHalfParent: 'Father',
            firstHalfYears: 'Odd',
            secondHalfParent: 'Mother',
            secondHalfYears: 'Odd',
            
            // For custom model
            customInstructions: '',
            customOvernightsParent: 'Father',
            customOvernightsCount: 35
        };
        this.initializeDefaults();
    }

    initializeDefaults() {
        // Set default summer break dates based on new rules
        const today = new Date();
        let year = today.getFullYear();
        
        // Calculate start date: First Sunday in June
        let startDate = this.getFirstSundayInJune(year);
        
        // Calculate end date: First Monday following August 3
        let endDate = this.getFirstMondayAfterAugust3(year);
        
        // If we're past summer break for this year, use next year
        if (today > endDate) {
            year++;
            startDate = this.getFirstSundayInJune(year);
            endDate = this.getFirstMondayAfterAugust3(year);
        }
        
        this.config.startDate = startDate;
        this.config.endDate = endDate;
        this.config.startTime = '18:00'; // 6 PM
        this.config.endTime = '08:00'; // 8 AM
        
        // Set exchange date to middle of summer for split model
        const midSummer = new Date(this.config.startDate);
        midSummer.setDate(this.config.startDate.getDate() + 
            Math.floor((this.config.endDate - this.config.startDate) / (1000 * 60 * 60 * 24) / 2));
        this.config.exchangeDate = midSummer;
    }

    getFirstSundayInJune(year) {
        const june1 = new Date(year, 5, 1); // June 1st
        let firstSunday = new Date(june1);
        const daysUntilSunday = (7 - june1.getDay()) % 7;
        firstSunday.setDate(1 + daysUntilSunday);
        return firstSunday;
    }

    getFirstMondayAfterAugust3(year) {
        let endDate = new Date(year, 7, 4); // August 4th
        while (endDate.getDay() !== 1) { // Monday is day 1
            endDate.setDate(endDate.getDate() + 1);
        }
        return endDate;
    }

    generateForm() {
        return `
            <div class="holiday-config">
                <!-- Holiday Observed Checkbox -->
                <div class="config-row">
                    <label class="checkbox-container">
                        <input type="checkbox" id="summerObserved" class="holiday-checkbox" ${this.config.observed ? 'checked' : ''}>
                        <span class="checkmark"></span>
                        Summer Break is Observed
                    </label>
                </div>
                
                <!-- Summer Break Type Selection -->
                <div class="config-row">
                    <label class="config-label">Summer Break Format:</label>
                    <select id="summerType" class="config-select" style="width: 100%;">
                        <option value="vacation-period" ${this.config.type === 'vacation-period' ? 'selected' : ''}>Vacation Period Model</option>
                        <option value="week-on-off" ${this.config.type === 'week-on-off' ? 'selected' : ''}>Week On / Week Off</option>
                        <option value="two-weeks-on-off" ${this.config.type === 'two-weeks-on-off' ? 'selected' : ''}>Two Weeks On / Two Weeks Off</option>
                        <option value="split-summer" ${this.config.type === 'split-summer' ? 'selected' : ''}>Split Summer (Two Halves)</option>
                        <option value="custom" ${this.config.type === 'custom' ? 'selected' : ''}>Custom Schedule</option>
                    </select>
                </div>
                
                <!-- Common Fields: Start and End Dates -->
                <div class="config-row">
                    <label class="config-label">Summer Break Start Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="summerStartDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.startDate)}">
                        <input type="time" id="summerStartTime" class="config-time-input" value="${this.config.startTime}">
                    </div>
                </div>
                
                <div class="config-row">
                    <label class="config-label">Summer Break End Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="summerEndDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.endDate)}">
                        <input type="time" id="summerEndTime" class="config-time-input" value="${this.config.endTime}">
                    </div>
                </div>
                
                <!-- Dynamic Configuration Area -->
                <div id="summerTypeConfig">
                    ${this.generateTypeSpecificConfig()}
                </div>
            </div>
        `;
    }

    generateTypeSpecificConfig() {
        switch (this.config.type) {
            case 'vacation-period':
                return this.generateVacationPeriodConfig();
            case 'week-on-off':
                return this.generateWeekOnOffConfig();
            case 'two-weeks-on-off':
                return this.generateTwoWeeksOnOffConfig();
            case 'split-summer':
                return this.generateSplitSummerConfig();
            case 'custom':
                return this.generateCustomConfig();
            default:
                return '';
        }
    }

    generateVacationPeriodConfig() {
        return `
            <div class="config-section" style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                <h4 style="font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 15px;">Vacation Period Settings</h4>
                
                <div class="config-row">
                    <label class="config-label">Vacation Days Per Parent:</label>
                    <input type="number" id="vacationDays" class="config-text-input" value="${this.config.vacationDays}" min="1" max="60" style="width: 100px;">
                    <span style="font-size: 14px; color: #6b7280; margin-left: 8px;">days</span>
                </div>
                
                <div class="config-row">
                    <label class="config-label">Maximum Consecutive Days:</label>
                    <input type="number" id="maxConsecutiveDays" class="config-text-input" value="${this.config.maxConsecutiveDays}" min="1" max="60" style="width: 100px;">
                    <span style="font-size: 14px; color: #6b7280; margin-left: 8px;">days</span>
                </div>
                
                <div class="config-row">
                    <label class="config-label">Notification Deadline:</label>
                    <input type="text" id="notificationDeadline" class="config-text-input" value="${this.config.notificationDeadline}" placeholder="e.g., April 1st">
                </div>
                
                <div class="config-row">
                    <label class="config-label">Conflict Resolution:</label>
                    <div class="dropdown-container">
                        <select id="conflictResolution" class="config-select">
                            <option value="father-odd" ${this.config.conflictResolution === 'father-odd' ? 'selected' : ''}>Father's choice trumps in Odd years</option>
                            <option value="mother-odd" ${this.config.conflictResolution === 'mother-odd' ? 'selected' : ''}>Mother's choice trumps in Odd years</option>
                        </select>
                    </div>
                </div>
                
                <div style="font-size: 13px; color: #6b7280; font-style: italic; margin-top: 10px;">
                    Note: Regular timesharing schedule continues except during designated vacation periods.
                </div>
            </div>
        `;
    }

    generateWeekOnOffConfig() {
        return `
            <div class="config-section" style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                <h4 style="font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 15px;">Week On/Week Off Settings</h4>
                
                <div class="config-row">
                    <label class="config-label">First Week Goes to:</label>
                    <div class="dropdown-container">
                        <select id="firstWeekParent" class="config-select">
                            <option value="Mother" ${this.config.firstWeekParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.firstWeekParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="firstWeekYears" class="config-select">
                            <option value="Odd" ${this.config.firstWeekYears === 'Odd' ? 'selected' : ''}>Odd</option>
                            <option value="Even" ${this.config.firstWeekYears === 'Even' ? 'selected' : ''}>Even</option>
                            <option value="All" ${this.config.firstWeekYears === 'All' ? 'selected' : ''}>All</option>
                        </select>
                        <span class="dropdown-text">Years</span>
                    </div>
                </div>
                
                <div style="font-size: 13px; color: #6b7280; font-style: italic; margin-top: 10px;">
                    Alternates weekly between parents for the entire summer break period.
                </div>
            </div>
        `;
    }

    generateTwoWeeksOnOffConfig() {
        return `
            <div class="config-section" style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                <h4 style="font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 15px;">Two Weeks On/Off Settings</h4>
                
                <div class="config-row">
                    <label class="config-label">First Two Weeks Go to:</label>
                    <div class="dropdown-container">
                        <select id="firstTwoWeeksParent" class="config-select">
                            <option value="Mother" ${this.config.firstWeekParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.firstWeekParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="firstTwoWeeksYears" class="config-select">
                            <option value="Odd" ${this.config.firstWeekYears === 'Odd' ? 'selected' : ''}>Odd</option>
                            <option value="Even" ${this.config.firstWeekYears === 'Even' ? 'selected' : ''}>Even</option>
                            <option value="All" ${this.config.firstWeekYears === 'All' ? 'selected' : ''}>All</option>
                        </select>
                        <span class="dropdown-text">Years</span>
                    </div>
                </div>
                
                <div style="font-size: 13px; color: #6b7280; font-style: italic; margin-top: 10px;">
                    Alternates every two weeks between parents for the entire summer break period.
                </div>
            </div>
        `;
    }

    generateSplitSummerConfig() {
        return `
            <div class="config-section" style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                <h4 style="font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 15px;">Split Summer Settings</h4>
                
                <!-- Exchange Date and Time -->
                <div class="config-row">
                    <label class="config-label">Exchange Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="summerExchangeDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.exchangeDate)}">
                        <input type="time" id="summerExchangeTime" class="config-time-input" value="${this.config.exchangeTime}">
                    </div>
                </div>
                
                <!-- 1st Half Assignment -->
                <div class="config-row">
                    <label class="config-label">1st Half Goes to:</label>
                    <div class="dropdown-container">
                        <select id="summerFirstHalfParent" class="config-select">
                            <option value="Mother" ${this.config.firstHalfParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.firstHalfParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="summerFirstHalfYears" class="config-select">
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
                        <select id="summerSecondHalfParent" class="config-select">
                            <option value="Mother" ${this.config.secondHalfParent === 'Mother' ? 'selected' : ''}>Mother</option>
                            <option value="Father" ${this.config.secondHalfParent === 'Father' ? 'selected' : ''}>Father</option>
                        </select>
                        <span class="dropdown-text">in</span>
                        <select id="summerSecondHalfYears" class="config-select">
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

    generateCustomConfig() {
        const totalOvernights = this.getTotalSummerOvernights();
        const remainingOvernights = totalOvernights - this.config.customOvernightsCount;
        const otherParent = this.config.customOvernightsParent === 'Father' ? 'Mother' : 'Father';
        
        return `
            <div class="config-section" style="border-top: 1px solid #e2e8f0; padding-top: 15px; margin-top: 15px;">
                <h4 style="font-size: 16px; font-weight: 600; color: #374151; margin-bottom: 15px;">Custom Schedule</h4>
                
                <div class="config-row">
                    <label class="config-label">Custom Summer Instructions:</label>
                    <textarea id="customInstructions" class="config-text-input" 
                              style="width: 100%; height: 320px; resize: vertical;" 
                              placeholder="Type Out Your Custom Summer Instructions Here">${this.config.customInstructions}</textarea>
                </div>
                
                <div class="config-row">
                    <label class="config-label">Summer Overnights to:</label>
                    <div class="dropdown-container">
                        <select id="customOvernightsParent" class="config-select">
                            <option value="Father" ${this.config.customOvernightsParent === 'Father' ? 'selected' : ''}>Father</option>
                            <option value="Mother" ${this.config.customOvernightsParent === 'Mother' ? 'selected' : ''}>Mother</option>
                        </select>
                        <input type="number" id="customOvernightsCount" class="config-text-input" 
                               value="${this.config.customOvernightsCount}" min="0" max="${totalOvernights}" 
                               style="width: 80px; margin-left: 8px;">
                        <span style="font-size: 14px; color: #6b7280; margin-left: 8px;">nights</span>
                    </div>
                </div>
                
                <div class="config-row">
                    <label class="config-label">Summer Overnights to ${otherParent}:</label>
                    <span style="font-size: 16px; font-weight: 600; color: #374151;">${Math.max(0, remainingOvernights)} nights</span>
                </div>
                
                <div style="font-size: 13px; color: #6b7280; font-style: italic; margin-top: 10px;">
                    Total Summer Overnights: ${totalOvernights} nights
                </div>
            </div>
        `;
    }

    getTotalSummerOvernights() {
        if (!this.config.startDate || !this.config.endDate) {
            return 0;
        }
        return Math.floor((this.config.endDate - this.config.startDate) / (1000 * 60 * 60 * 24));
    }

    setupEventListeners() {
        // Observed checkbox
        const observedEl = document.getElementById('summerObserved');
        if (observedEl) {
            observedEl.addEventListener('change', (e) => {
                this.config.observed = e.target.checked;
                this.onConfigChange();
            });
        }

        // Summer type dropdown
        const typeEl = document.getElementById('summerType');
        if (typeEl) {
            typeEl.addEventListener('change', (e) => {
                this.config.type = e.target.value;
                this.updateTypeSpecificConfig();
                this.onConfigChange();
            });
        }

        // Start and end dates/times
        const startDateEl = document.getElementById('summerStartDate');
        if (startDateEl) {
            startDateEl.addEventListener('change', (e) => {
                this.config.startDate = new Date(e.target.value + 'T00:00:00');
                this.updateExchangeDate();
                this.updateCustomConfig();
                this.onConfigChange();
            });
        }

        const endDateEl = document.getElementById('summerEndDate');
        if (endDateEl) {
            endDateEl.addEventListener('change', (e) => {
                this.config.endDate = new Date(e.target.value + 'T00:00:00');
                this.updateExchangeDate();
                this.updateCustomConfig();
                this.onConfigChange();
            });
        }

        const startTimeEl = document.getElementById('summerStartTime');
        if (startTimeEl) {
            startTimeEl.addEventListener('change', (e) => {
                this.config.startTime = e.target.value;
                this.onConfigChange();
            });
        }

        const endTimeEl = document.getElementById('summerEndTime');
        if (endTimeEl) {
            endTimeEl.addEventListener('change', (e) => {
                this.config.endTime = e.target.value;
                this.onConfigChange();
            });
        }

        // Setup type-specific listeners
        this.setupTypeSpecificListeners();
    }

    updateTypeSpecificConfig() {
        const container = document.getElementById('summerTypeConfig');
        if (container) {
            container.innerHTML = this.generateTypeSpecificConfig();
            this.setupTypeSpecificListeners();
        }
    }

    updateCustomConfig() {
        if (this.config.type === 'custom') {
            this.updateTypeSpecificConfig();
        }
    }

    updateExchangeDate() {
        // Auto-calculate exchange date as midpoint for split summer
        if (this.config.type === 'split-summer' && this.config.startDate && this.config.endDate) {
            const midpoint = new Date(this.config.startDate);
            const daysBetween = Math.floor((this.config.endDate - this.config.startDate) / (1000 * 60 * 60 * 24));
            midpoint.setDate(this.config.startDate.getDate() + Math.floor(daysBetween / 2));
            this.config.exchangeDate = midpoint;
            
            const exchangeDateEl = document.getElementById('summerExchangeDate');
            if (exchangeDateEl) {
                exchangeDateEl.value = DateUtils.dateToISOString(this.config.exchangeDate);
            }
        }
    }

    setupTypeSpecificListeners() {
        // Vacation Period listeners
        const vacationDaysEl = document.getElementById('vacationDays');
        if (vacationDaysEl) {
            vacationDaysEl.addEventListener('change', (e) => {
                this.config.vacationDays = parseInt(e.target.value) || 14;
                this.onConfigChange();
            });
        }

        const maxConsecutiveEl = document.getElementById('maxConsecutiveDays');
        if (maxConsecutiveEl) {
            maxConsecutiveEl.addEventListener('change', (e) => {
                this.config.maxConsecutiveDays = parseInt(e.target.value) || 14;
                this.onConfigChange();
            });
        }

        const notificationEl = document.getElementById('notificationDeadline');
        if (notificationEl) {
            notificationEl.addEventListener('change', (e) => {
                this.config.notificationDeadline = e.target.value;
                this.onConfigChange();
            });
        }

        const conflictEl = document.getElementById('conflictResolution');
        if (conflictEl) {
            conflictEl.addEventListener('change', (e) => {
                this.config.conflictResolution = e.target.value;
                this.onConfigChange();
            });
        }

        // Week on/off listeners
        const firstWeekParentEl = document.getElementById('firstWeekParent');
        if (firstWeekParentEl) {
            firstWeekParentEl.addEventListener('change', (e) => {
                this.config.firstWeekParent = e.target.value;
                this.onConfigChange();
            });
        }

        const firstWeekYearsEl = document.getElementById('firstWeekYears');
        if (firstWeekYearsEl) {
            firstWeekYearsEl.addEventListener('change', (e) => {
                this.config.firstWeekYears = e.target.value;
                this.onConfigChange();
            });
        }

        // Two weeks listeners (reuse firstWeek variables for simplicity)
        const firstTwoWeeksParentEl = document.getElementById('firstTwoWeeksParent');
        if (firstTwoWeeksParentEl) {
            firstTwoWeeksParentEl.addEventListener('change', (e) => {
                this.config.firstWeekParent = e.target.value;
                this.onConfigChange();
            });
        }

        const firstTwoWeeksYearsEl = document.getElementById('firstTwoWeeksYears');
        if (firstTwoWeeksYearsEl) {
            firstTwoWeeksYearsEl.addEventListener('change', (e) => {
                this.config.firstWeekYears = e.target.value;
                this.onConfigChange();
            });
        }

        // Split summer listeners
        const exchangeDateEl = document.getElementById('summerExchangeDate');
        if (exchangeDateEl) {
            exchangeDateEl.addEventListener('change', (e) => {
                this.config.exchangeDate = new Date(e.target.value + 'T00:00:00');
                this.onConfigChange();
            });
        }

        const exchangeTimeEl = document.getElementById('summerExchangeTime');
        if (exchangeTimeEl) {
            exchangeTimeEl.addEventListener('change', (e) => {
                this.config.exchangeTime = e.target.value;
                this.onConfigChange();
            });
        }

        ['summerFirstHalfParent', 'summerFirstHalfYears', 'summerSecondHalfParent', 'summerSecondHalfYears'].forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('change', (e) => {
                    const field = id.replace('summer', '').charAt(0).toLowerCase() + id.replace('summer', '').slice(1);
                    this.config[field] = e.target.value;
                    this.onConfigChange();
                });
            }
        });

        // Custom listeners
        const customInstructionsEl = document.getElementById('customInstructions');
        if (customInstructionsEl) {
            customInstructionsEl.addEventListener('change', (e) => {
                this.config.customInstructions = e.target.value;
                this.onConfigChange();
            });
        }

        const customOvernightsParentEl = document.getElementById('customOvernightsParent');
        if (customOvernightsParentEl) {
            customOvernightsParentEl.addEventListener('change', (e) => {
                this.config.customOvernightsParent = e.target.value;
                this.updateTypeSpecificConfig();
                this.onConfigChange();
            });
        }

        const customOvernightsCountEl = document.getElementById('customOvernightsCount');
        if (customOvernightsCountEl) {
            customOvernightsCountEl.addEventListener('change', (e) => {
                const maxOvernights = this.getTotalSummerOvernights();
                let newCount = parseInt(e.target.value) || 0;
                
                // Ensure count doesn't exceed total
                if (newCount > maxOvernights) {
                    newCount = maxOvernights;
                    e.target.value = newCount;
                }
                if (newCount < 0) {
                    newCount = 0;
                    e.target.value = newCount;
                }
                
                this.config.customOvernightsCount = newCount;
                this.updateTypeSpecificConfig();
                this.onConfigChange();
            });
        }
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
        // Check if Summer Break is observed
        if (!this.config.observed) {
            return null;
        }

        const startDate = this.config.startDate;
        const endDate = this.config.endDate;

        if (!startDate || !endDate) {
            return null;
        }

        // Check if date is within Summer Break period
        if (date < startDate || date > endDate) {
            return null;
        }

        // Handle different summer break types
        switch (this.config.type) {
            case 'vacation-period':
                return this.getVacationPeriodInfo(date);
            case 'week-on-off':
                return this.getWeekOnOffInfo(date);
            case 'two-weeks-on-off':
                return this.getTwoWeeksOnOffInfo(date);
            case 'split-summer':
                return this.getSplitSummerInfo(date);
            case 'custom':
                return this.getCustomInfo(date);
            default:
                return null;
        }
    }

    getVacationPeriodInfo(date) {
        // For vacation period model, we show regular schedule with red asterisk
        // Get the regular schedule for this date
        let regularSchedule = { status: 'Cx with Fx', time: '18:00' }; // Default fallback
        if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
            regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
        }

        // Convert regular schedule to display format
        const statusText = window.timesharingCalendar ? 
            window.timesharingCalendar.getStatusDisplayText(regularSchedule.status) : 
            (regularSchedule.status.includes('Fx') ? 'With Father' : 'With Mother');

        // Apply regular color classes
        let colorClass = 'father-day';
        if (regularSchedule.status === 'Cx with Fx') {
            colorClass = 'father-day';
        } else if (regularSchedule.status === 'Cx with Mx') {
            colorClass = 'mother-day';
        } else if (regularSchedule.status === 'Cx --> Fx') {
            colorClass = 'exchange-to-father';
        } else if (regularSchedule.status === 'Cx --> Mx') {
            colorClass = 'exchange-to-mother';
        }

        return {
            statusText: statusText,
            time: regularSchedule.status.includes('-->') ? regularSchedule.time : null,
            colorClass: colorClass,
            icon: '*' // Red asterisk instead of holiday icon
        };
    }

    getWeekOnOffInfo(date) {
        const startDate = this.config.startDate;
        const endDate = this.config.endDate;
        const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
        const weekNumber = Math.floor(daysSinceStart / 7);
        
        // Determine if it's an odd or even year
        const year = date.getFullYear();
        const isEvenYear = year % 2 === 0;
        
        // Determine starting parent
        let startingParent;
        if (this.config.firstWeekYears === 'All' || 
            (this.config.firstWeekYears === 'Even' && isEvenYear) ||
            (this.config.firstWeekYears === 'Odd' && !isEvenYear)) {
            startingParent = this.config.firstWeekParent;
        } else {
            startingParent = this.config.firstWeekParent === 'Mother' ? 'Father' : 'Mother';
        }
        
        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        // Handle start date
        if (dateOnly.getTime() === startDateOnly.getTime()) {
            let currentParentRegular = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
                currentParentRegular = regularSchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            const colorClass = this.getTransitionColorClass(currentParentRegular, startingParent);
            return {
                statusText: `To ${startingParent} for Summer Break`,
                time: this.config.startTime,
                colorClass: colorClass,
                icon: '☀️'
            };
        }

        // Handle end date
        if (dateOnly.getTime() === endDateOnly.getTime()) {
            const currentParent = weekNumber % 2 === 0 ? startingParent : 
                                 (startingParent === 'Father' ? 'Mother' : 'Father');
            
            const nextDayDate = new Date(endDate);
            nextDayDate.setDate(nextDayDate.getDate() + 1);
            
            let nextParent = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            const colorClass = this.getTransitionColorClass(currentParent, nextParent);
            return {
                statusText: `To ${nextParent} (Summer Break Ends)`,
                time: this.config.endTime,
                colorClass: colorClass,
                icon: '☀️'
            };
        }

        // Handle weekly exchanges (every Sunday at start time, except start date)
        if (date.getDay() === 0 && daysSinceStart > 0) { // Sunday and not start date
            // The parent we're transitioning TO is determined by the week number
            const transitionToParent = weekNumber % 2 === 0 ? startingParent : 
                                      (startingParent === 'Father' ? 'Mother' : 'Father');
            const transitionFromParent = (weekNumber - 1) % 2 === 0 ? startingParent :
                                        (startingParent === 'Father' ? 'Mother' : 'Father');
            
            const colorClass = this.getTransitionColorClass(transitionFromParent, transitionToParent);
            return {
                statusText: `To ${transitionToParent} for Summer Break`,
                time: this.config.startTime,
                colorClass: colorClass,
                icon: '☀️'
            };
        }
        
        // Regular days during summer
        const currentParent = weekNumber % 2 === 0 ? startingParent : 
                             (startingParent === 'Father' ? 'Mother' : 'Father');
        
        const colorClass = currentParent === 'Father' ? 'father-day' : 'mother-day';
        
        return {
            statusText: `With ${currentParent} for Summer Break`,
            time: null,
            colorClass: colorClass,
            icon: '☀️'
        };
    }

    getTwoWeeksOnOffInfo(date) {
        const startDate = this.config.startDate;
        const endDate = this.config.endDate;
        const daysSinceStart = Math.floor((date - startDate) / (1000 * 60 * 60 * 24));
        const twoWeekPeriod = Math.floor(daysSinceStart / 14);
        
        // Determine if it's an odd or even year
        const year = date.getFullYear();
        const isEvenYear = year % 2 === 0;
        
        // Determine starting parent
        let startingParent;
        if (this.config.firstWeekYears === 'All' || 
            (this.config.firstWeekYears === 'Even' && isEvenYear) ||
            (this.config.firstWeekYears === 'Odd' && !isEvenYear)) {
            startingParent = this.config.firstWeekParent;
        } else {
            startingParent = this.config.firstWeekParent === 'Mother' ? 'Father' : 'Mother';
        }

        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        // Handle start date
        if (dateOnly.getTime() === startDateOnly.getTime()) {
            let currentParentRegular = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
                currentParentRegular = regularSchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            const colorClass = this.getTransitionColorClass(currentParentRegular, startingParent);
            return {
                statusText: `To ${startingParent} for Summer Break`,
                time: this.config.startTime,
                colorClass: colorClass,
                icon: '☀️'
            };
        }

        // Handle end date
        if (dateOnly.getTime() === endDateOnly.getTime()) {
            const currentParent = twoWeekPeriod % 2 === 0 ? startingParent : 
                                 (startingParent === 'Father' ? 'Mother' : 'Father');
            
            const nextDayDate = new Date(endDate);
            nextDayDate.setDate(nextDayDate.getDate() + 1);
            
            let nextParent = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            const colorClass = this.getTransitionColorClass(currentParent, nextParent);
            return {
                statusText: `To ${nextParent} (Summer Break Ends)`,
                time: this.config.endTime,
                colorClass: colorClass,
                icon: '☀️'
            };
        }

        // Handle two-week exchanges (every other Sunday at start time, except start date)
        if (date.getDay() === 0 && daysSinceStart > 0 && daysSinceStart % 14 === 0) { // Every 2nd Sunday
            // The parent we're transitioning TO is determined by the two-week period number
            const transitionToParent = twoWeekPeriod % 2 === 0 ? startingParent : 
                                      (startingParent === 'Father' ? 'Mother' : 'Father');
            const transitionFromParent = (twoWeekPeriod - 1) % 2 === 0 ? startingParent :
                                        (startingParent === 'Father' ? 'Mother' : 'Father');
            
            const colorClass = this.getTransitionColorClass(transitionFromParent, transitionToParent);
            return {
                statusText: `To ${transitionToParent} for Summer Break`,
                time: this.config.startTime,
                colorClass: colorClass,
                icon: '☀️'
            };
        }
        
        // Regular days during summer
        const currentParent = twoWeekPeriod % 2 === 0 ? startingParent : 
                             (startingParent === 'Father' ? 'Mother' : 'Father');
        
        const colorClass = currentParent === 'Father' ? 'father-day' : 'mother-day';
        
        return {
            statusText: `With ${currentParent} for Summer Break`,
            time: null,
            colorClass: colorClass,
            icon: '☀️'
        };
    }

    getSplitSummerInfo(date) {
        // Similar to other holiday split logic
        const startDate = this.config.startDate;
        const exchangeDate = this.config.exchangeDate;
        const endDate = this.config.endDate;

        if (!exchangeDate) {
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
            let currentParentRegular = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
                currentParentRegular = regularSchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            return {
                statusText: `To ${firstHalfParent} for Summer Break`,
                time: this.config.startTime,
                colorClass: this.getTransitionColorClass(currentParentRegular, firstHalfParent),
                icon: '☀️'
            };
        } else if (dateOnly > startDateOnly && dateOnly < exchangeDateOnly) {
            const colorClass = firstHalfParent === 'Father' ? 'father-day' : 'mother-day';
            return {
                statusText: `With ${firstHalfParent} for Summer Break`,
                time: null,
                colorClass: colorClass,
                icon: '☀️'
            };
        } else if (dateOnly.getTime() === exchangeDateOnly.getTime()) {
            const colorClass = this.getTransitionColorClass(firstHalfParent, secondHalfParent);
            return {
                statusText: `To ${secondHalfParent} for Summer Break`,
                time: this.config.exchangeTime,
                colorClass: colorClass,
                icon: '☀️'
            };
        } else if (dateOnly > exchangeDateOnly && dateOnly < endDateOnly) {
            const colorClass = secondHalfParent === 'Father' ? 'father-day' : 'mother-day';
            return {
                statusText: `With ${secondHalfParent} for Summer Break`,
                time: null,
                colorClass: colorClass,
                icon: '☀️'
            };
        } else if (dateOnly.getTime() === endDateOnly.getTime()) {
            const nextDayDate = new Date(endDate);
            nextDayDate.setDate(nextDayDate.getDate() + 1);
            
            let nextParent = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            return {
                statusText: `To ${nextParent} (Summer Break Ends)`,
                time: this.config.endTime,
                colorClass: this.getTransitionColorClass(secondHalfParent, nextParent),
                icon: '☀️'
            };
        }

        return null;
    }

    getCustomInfo(date) {
        const startDate = this.config.startDate;
        const endDate = this.config.endDate;

        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        // Handle start date
        if (dateOnly.getTime() === startDateOnly.getTime()) {
            let currentParentRegular = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
                currentParentRegular = regularSchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            return {
                statusText: `Summer Break Begins`,
                time: this.config.startTime,
                colorClass: 'summer-custom',
                icon: '☀️'
            };
        }

        // Handle end date
        if (dateOnly.getTime() === endDateOnly.getTime()) {
            const nextDayDate = new Date(endDate);
            nextDayDate.setDate(nextDayDate.getDate() + 1);
            
            let nextParent = 'Father'; // Default fallback
            if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
            }
            
            return {
                statusText: `To ${nextParent} (Summer Break Ends)`,
                time: this.config.endTime,
                colorClass: this.getTransitionColorClass('Custom', nextParent),
                icon: '☀️'
            };
        }

        // Regular days during custom summer
        return {
            statusText: 'Custom Summer Schedule',
            time: null,
            colorClass: 'summer-custom',
            icon: '☀️'
        };
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