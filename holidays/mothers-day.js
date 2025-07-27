class MothersDay {
    constructor() {
        this.config = {
            observed: false,
            startDate: null,
            startTime: '15:00',
            endDate: null,
            endTime: '08:00',
            additionalNotes: '' // Add this field for notes
        };
        this.initializeDefaults();
    }

    initializeDefaults() {
        // Set default dates based on Mother's Day rules
        const mothersDay = DateUtils.getNextMothersDay();
        const startDate = DateUtils.getFridayBeforeMothersDay(mothersDay.getFullYear());
        const endDate = DateUtils.getMondayAfterMothersDay(mothersDay.getFullYear());
        
        this.config.startDate = startDate;
        this.config.endDate = endDate;
    }

    generateForm() {
        const hasNotes = this.config.additionalNotes && this.config.additionalNotes.trim() !== '';
        const notesButtonText = hasNotes ? '📝 View/Edit Notes' : '➕ Add Notes';
        
        return `
            <div class="holiday-config">
                <!-- Holiday Observed Checkbox -->
                <div class="config-row">
                    <div style="display: flex; align-items: center; justify-content: space-between;">
                        <label class="checkbox-container">
                            <input type="checkbox" id="mothersObserved" class="holiday-checkbox" ${this.config.observed ? 'checked' : ''}>
                            <span class="checkmark"></span>
                            Holiday is Observed
                        </label>
                        <button id="mothersNotesBtn" class="section1-button" style="padding: 6px 12px; font-size: 12px;">
                            ${notesButtonText}
                        </button>
                    </div>
                </div>
                
                <!-- Start Date and Time -->
                <div class="config-row">
                    <label class="config-label">Start Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="mothersStartDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.startDate)}">
                        <input type="time" id="mothersStartTime" class="config-time-input" value="${this.config.startTime}">
                    </div>
                </div>
                
                <!-- End Date and Time -->
                <div class="config-row">
                    <label class="config-label">End Date & Time:</label>
                    <div class="datetime-container">
                        <input type="date" id="mothersEndDate" class="config-date-input" value="${DateUtils.dateToISOString(this.config.endDate)}">
                        <input type="time" id="mothersEndTime" class="config-time-input" value="${this.config.endTime}">
                    </div>
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        // Observed checkbox
        const observedEl = document.getElementById('mothersObserved');
        if (observedEl) {
            observedEl.addEventListener('change', (e) => {
                this.config.observed = e.target.checked;
                this.onConfigChange();
            });
        }

        // Notes button
        const notesBtn = document.getElementById('mothersNotesBtn');
        if (notesBtn) {
            notesBtn.addEventListener('click', () => {
                this.openNotesModal();
            });
        }

        // Start date
        const startDateEl = document.getElementById('mothersStartDate');
        if (startDateEl) {
            startDateEl.addEventListener('change', (e) => {
                this.config.startDate = new Date(e.target.value + 'T00:00:00');
                this.onConfigChange();
            });
        }

        // End date
        const endDateEl = document.getElementById('mothersEndDate');
        if (endDateEl) {
            endDateEl.addEventListener('change', (e) => {
                this.config.endDate = new Date(e.target.value + 'T00:00:00');
                this.onConfigChange();
            });
        }

        // Start time
        const startTimeEl = document.getElementById('mothersStartTime');
        if (startTimeEl) {
            startTimeEl.addEventListener('change', (e) => {
                this.config.startTime = e.target.value;
                this.onConfigChange();
            });
        }

        // End time
        const endTimeEl = document.getElementById('mothersEndTime');
        if (endTimeEl) {
            endTimeEl.addEventListener('change', (e) => {
                this.config.endTime = e.target.value;
                this.onConfigChange();
            });
        }
    }

    openNotesModal() {
		if (window.timesharingCalendar && window.timesharingCalendar.openNotesModal) {
			// Use the same pattern as other holidays
			window.timesharingCalendar.currentNotesContext = 'holiday-mothersDay';
			window.timesharingCalendar.openNotesModal(
				'holiday-mothersDay',
				"Mother's Day - Additional Notes",
				this.config.additionalNotes
			);
			
			// Override save function to handle this holiday's notes
			const originalSave = window.timesharingCalendar.saveNotesFromModal;
			window.timesharingCalendar.saveNotesFromModal = () => {
				const textarea = document.getElementById('notesTextarea');
				if (textarea) {
					this.config.additionalNotes = textarea.value;
					this.updateNotesButton();
					this.onConfigChange();
				}
				window.timesharingCalendar.closeNotesModal();
				window.timesharingCalendar.saveNotesFromModal = originalSave;
			};
		}
	}

updateNotesButton() {
    const notesBtn = document.getElementById('mothersNotesBtn');
    if (notesBtn) {
        notesBtn.textContent = this.config.additionalNotes ? '📝 View/Edit Notes' : '➕ Add Notes';
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
        // Check if Mother's Day is observed
        if (!this.config.observed) {
            return null;
        }

        const startDate = this.config.startDate;
        const endDate = this.config.endDate;

        if (!startDate || !endDate) {
            return null;
        }

        // Check if date is within Mother's Day period
        if (date < startDate || date > endDate) {
            return null;
        }

        // Mother always gets the holiday when observed
        const motherGetsHoliday = true;

        const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
        const startDateOnly = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
        const endDateOnly = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

        // Check if this is a same-day celebration
        if (startDateOnly.getTime() === endDateOnly.getTime()) {
            // Same day celebration
            if (dateOnly.getTime() === startDateOnly.getTime()) {
                const parent = motherGetsHoliday ? 'Mother' : 'Father';
                const colorClass = motherGetsHoliday ? 'mother-day' : 'father-day';
                const startTime = DateUtils.formatTime(this.config.startTime);
                const endTime = DateUtils.formatTime(this.config.endTime);
                
                return {
                    statusText: `With ${parent} From ${startTime} to ${endTime}`,
                    time: null,
                    colorClass: colorClass,
                    icon: '👩'
                };
            }
        } else {
            // Multi-day celebration
            const parent = motherGetsHoliday ? 'Mother' : 'Father';

            if (dateOnly.getTime() === startDateOnly.getTime()) {
                // Start date - transition to holiday parent
                let currentParentRegular = 'Father'; // Default fallback
                if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                    const regularSchedule = window.timesharingCalendar.getScheduleForDate(date);
                    currentParentRegular = regularSchedule.status.includes('Fx') ? 'Father' : 'Mother';
                }
                
                const colorClass = this.getTransitionColorClass(currentParentRegular, parent);
                return {
                    statusText: `To ${parent} for Mother's Day`,
                    time: this.config.startTime,
                    colorClass: colorClass,
                    icon: '👩'
                };
            } else if (dateOnly > startDateOnly && dateOnly < endDateOnly) {
                // Between start and end
                const colorClass = motherGetsHoliday ? 'mother-day' : 'father-day';
                return {
                    statusText: `With ${parent} for Mother's Day`,
                    time: null,
                    colorClass: colorClass,
                    icon: '👩'
                };
            } else if (dateOnly.getTime() === endDateOnly.getTime()) {
                // End date - check what regular schedule would be after
                const nextDayDate = new Date(endDate);
                nextDayDate.setDate(nextDayDate.getDate() + 1);
                
                let nextParent = 'Father'; // Default fallback
                if (window.timesharingCalendar && window.timesharingCalendar.getScheduleForDate) {
                    const nextDaySchedule = window.timesharingCalendar.getScheduleForDate(nextDayDate);
                    nextParent = nextDaySchedule.status.includes('Fx') ? 'Father' : 'Mother';
                }
                
                const colorClass = this.getTransitionColorClass(parent, nextParent);
                return {
                    statusText: `To ${nextParent} (Mother's Day Ends)`,
                    time: this.config.endTime,
                    colorClass: colorClass,
                    icon: '👩'
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
            ...this.config,
            startDate: this.config.startDate ? this.config.startDate.toISOString() : null,
            endDate: this.config.endDate ? this.config.endDate.toISOString() : null
        };
    }

    importConfig(configData) {
        if (configData) {
            this.config = {
                ...configData,
                startDate: configData.startDate ? new Date(configData.startDate) : null,
                endDate: configData.endDate ? new Date(configData.endDate) : null
            };
        }
    }
}