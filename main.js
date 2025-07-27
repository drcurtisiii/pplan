class TimesharingCalendar {
    constructor() {
        this.caseName = 'Party v. Party - ___________ County - Case Number:  ___________';
        this.startDate = new Date();
        this.regularSchedule = this.createDefaultSchedule();
        this.regularScheduleNotes = ''; // Additional notes for regular schedule
        this.currentNotesContext = null; // Track which notes we're editing
        this.init();
    }

    createDefaultSchedule() {
        return [
            { status: 'Cx --> Fx', time: '18:00' },  // Day 1: To Father
            { status: 'Cx with Fx', time: '18:00' }, // Day 2: With Father
            { status: 'Cx with Fx', time: '18:00' }, // Day 3: With Father
            { status: 'Cx with Fx', time: '18:00' }, // Day 4: With Father
            { status: 'Cx with Fx', time: '18:00' }, // Day 5: With Father
            { status: 'Cx with Fx', time: '18:00' }, // Day 6: With Father
            { status: 'Cx with Fx', time: '18:00' }, // Day 7: With Father
            { status: 'Cx --> Mx', time: '18:00' },  // Day 8: To Mother
            { status: 'Cx with Mx', time: '18:00' }, // Day 9: With Mother
            { status: 'Cx with Mx', time: '18:00' }, // Day 10: With Mother
            { status: 'Cx with Mx', time: '18:00' }, // Day 11: With Mother
            { status: 'Cx with Mx', time: '18:00' }, // Day 12: With Mother
            { status: 'Cx with Mx', time: '18:00' }, // Day 13: With Mother
            { status: 'Cx with Mx', time: '18:00' }  // Day 14: With Mother
        ];
    }

    init() {
        this.setDefaultStartDate();
        this.setDefaultCaseName();
        this.generateScheduleGrid();
        this.bindEvents();
        this.generateCalendar();
        this.updateOvernightStats();
        
        // Initialize holidays after everything else is working
        this.initializeHolidays();
        
        // Initialize notes modal system
        this.initializeNotesModal();
    }

    initializeNotesModal() {
		// Modal elements
		const modal = document.getElementById('notesModal');
		const closeBtn = document.getElementById('closeNotesModal');
		const saveBtn = document.getElementById('saveNotesBtn');
		const cancelBtn = document.getElementById('cancelNotesBtn');
		const textarea = document.getElementById('notesTextarea');

		console.log('🔍 Initializing Notes Modal:');
		console.log('Modal element:', modal);
		console.log('Close button:', closeBtn);
		console.log('Save button:', saveBtn);
		console.log('Cancel button:', cancelBtn);
		console.log('Textarea:', textarea);

		if (closeBtn) {
			closeBtn.addEventListener('click', () => {
				console.log('❌ Close button clicked');
				this.closeNotesModal();
			});
		} else {
			console.log('⚠️ Close button not found!');
		}

		if (cancelBtn) {
			cancelBtn.addEventListener('click', () => {
				console.log('🚫 Cancel button clicked');
				this.closeNotesModal();
			});
		} else {
			console.log('⚠️ Cancel button not found!');
		}

		if (saveBtn) {
			saveBtn.addEventListener('click', () => {
				console.log('💾 Save button clicked');
				this.saveNotesFromModal();
			});
		} else {
			console.log('⚠️ Save button not found!');
		}

		// Close modal when clicking outside
		if (modal) {
			modal.addEventListener('click', (e) => {
				console.log('🖱️ Modal background clicked', e.target === modal);
				if (e.target === modal) {
					this.closeNotesModal();
				}
			});
		}
	}

    openNotesModal(context, title, currentNotesOrCallback) {
		this.currentNotesContext = context;
		const modal = document.getElementById('notesModal');
		const modalTitle = document.getElementById('notesModalTitle');
		const textarea = document.getElementById('notesTextarea');

		if (modalTitle) {
			modalTitle.textContent = title;
		}

		// Check if third parameter is a function (callback) or string (notes)
		if (typeof currentNotesOrCallback === 'function') {
			// It's a callback function - don't set it as the textarea value!
			this.currentNotesCallback = currentNotesOrCallback;
			textarea.value = ''; // Clear the textarea
		} else {
			// It's the actual notes content
			this.currentNotesCallback = null;
			textarea.value = currentNotesOrCallback || '';
		}

		if (modal) {
			modal.style.display = 'block';
			document.body.style.overflow = 'hidden';
			
			// Make sure close functionality works
			this.setupModalEventListeners();
			
			// Focus on textarea after modal opens
			setTimeout(() => textarea && textarea.focus(), 100);
		}
	}

	setupModalEventListeners() {
		const modal = document.getElementById('notesModal');
		const closeBtn = document.getElementById('closeNotesModal');
		const saveBtn = document.getElementById('saveNotesBtn');
		const cancelBtn = document.getElementById('cancelNotesBtn');
		
		// Clear existing listeners by cloning
		if (closeBtn) {
			const newCloseBtn = closeBtn.cloneNode(true);
			closeBtn.parentNode.replaceChild(newCloseBtn, closeBtn);
			newCloseBtn.addEventListener('click', () => this.closeNotesModal());
		}
		
		if (cancelBtn) {
			const newCancelBtn = cancelBtn.cloneNode(true);
			cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
			newCancelBtn.addEventListener('click', () => this.closeNotesModal());
		}
		
		if (saveBtn) {
			const newSaveBtn = saveBtn.cloneNode(true);
			saveBtn.parentNode.replaceChild(newSaveBtn, saveBtn);
			newSaveBtn.addEventListener('click', () => this.saveNotesFromModal());
		}
		
		// Modal background click
		const modalClickHandler = (e) => {
			if (e.target === modal) {
				this.closeNotesModal();
			}
		};
		modal.removeEventListener('click', modalClickHandler);
		modal.addEventListener('click', modalClickHandler);
	}

	saveNotesFromModal() {
		const textarea = document.getElementById('notesTextarea');
		if (!textarea) return;

		const notes = textarea.value;

		// If we have a callback, use it
		if (this.currentNotesCallback) {
			this.currentNotesCallback(notes);
		} else {
			// Otherwise, handle based on context
			if (this.currentNotesContext === 'regular') {
				this.regularScheduleNotes = notes;
			} else if (this.currentNotesContext && this.currentNotesContext.startsWith('holiday-')) {
				// This will be handled by individual holiday classes
			}
		}

		this.closeNotesModal();
	}

    closeNotesModal() {
		console.log('🔴 closeNotesModal called');
		const modal = document.getElementById('notesModal');
		if (modal) {
			console.log('✅ Modal found, hiding it');
			modal.style.display = 'none';
			document.body.style.overflow = '';
		} else {
			console.log('❌ Modal not found!');
		}
		this.currentNotesContext = null;
	}

    saveNotesFromModal() {
        const textarea = document.getElementById('notesTextarea');
        if (!textarea || !this.currentNotesContext) return;

        const notes = textarea.value;

        // Save notes based on context
        if (this.currentNotesContext === 'regular') {
            this.regularScheduleNotes = notes;
        } else if (this.currentNotesContext.startsWith('holiday-')) {
            // Handle holiday notes (to be implemented in holiday files)
            const holidayType = this.currentNotesContext.replace('holiday-', '');
            // This will be handled by individual holiday classes
        }

        this.closeNotesModal();
    }

    initializeHolidays() {
        try {
            this.holidays = {};
            
            // Initialize Spring Break if available
            // Initialize Spring Break if available
			if (typeof SpringBreak !== 'undefined') {
				console.log('🔍 SpringBreak class found, creating instance...');
				try {
					this.holidays.springBreak = new SpringBreak();
					console.log('✅ Spring Break loaded successfully');
					console.log('Spring Break config:', this.holidays.springBreak.config);
				} catch (error) {
					console.error('❌ Spring Break initialization error:', error);
				}
			} else {
				console.log('❌ SpringBreak class not found');
			}
            
            // Initialize Thanksgiving Break if available
            if (typeof ThanksgivingBreak !== 'undefined') {
                this.holidays.thanksgivingBreak = new ThanksgivingBreak();
                console.log('✅ Thanksgiving Break loaded');
            } else {
                console.log('❌ ThanksgivingBreak class not found');
            }
            
            // Initialize Christmas Break if available
            if (typeof ChristmasBreak !== 'undefined') {
                this.holidays.christmasBreak = new ChristmasBreak();
                console.log('✅ Christmas Break loaded');
            } else {
                console.log('❌ ChristmasBreak class not found');
            }
            
            // Initialize Easter Break if available
            if (typeof EasterBreak !== 'undefined') {
                this.holidays.easterBreak = new EasterBreak();
                console.log('✅ Easter Break loaded');
            } else {
                console.log('❌ EasterBreak class not found');
            }
            
            // Initialize Memorial Day Break if available
            if (typeof MemorialDayBreak !== 'undefined') {
                this.holidays.memorialDayBreak = new MemorialDayBreak();
                console.log('✅ Memorial Day Break loaded');
            } else {
                console.log('❌ MemorialDayBreak class not found');
            }
            
            // Initialize Mother's Day if available
            if (typeof MothersDay !== 'undefined') {
                this.holidays.mothersDay = new MothersDay();
                console.log('✅ Mother\'s Day loaded');
            } else {
                console.log('❌ MothersDay class not found');
            }
            
            // Initialize Father's Day if available
            if (typeof FathersDay !== 'undefined') {
                this.holidays.fathersDay = new FathersDay();
                console.log('✅ Father\'s Day loaded');
            } else {
                console.log('❌ FathersDay class not found');
            }
            
            // Initialize Independence Day if available
            if (typeof IndependenceDay !== 'undefined') {
                this.holidays.independenceDay = new IndependenceDay();
                console.log('✅ Independence Day loaded');
            } else {
                console.log('❌ IndependenceDay class not found');
            }
            
            // Initialize Summer Break if available
            if (typeof SummerBreak !== 'undefined') {
                this.holidays.summerBreak = new SummerBreak();
                console.log('✅ Summer Break loaded');
            } else {
                console.log('❌ SummerBreak class not found');
            }
            
            // Initialize Custom Holiday Manager if available
            if (typeof CustomHolidayManager !== 'undefined') {
                this.customHolidayManager = new CustomHolidayManager();
                console.log('✅ Custom Holiday Manager loaded');
            } else {
                console.log('❌ CustomHolidayManager class not found');
            }
            
            window.timesharingCalendar = this;
            console.log('Holidays initialized successfully:', Object.keys(this.holidays));
        } catch (error) {
            console.log('Holiday initialization failed - running in basic mode:', error);
            this.holidays = {};
        }
    }

    setDefaultStartDate() {
        const today = new Date();
        let sundayPrior = new Date(today);
        
        // If today is Sunday (day 0), use today
        // Otherwise, go back to the previous Sunday
        if (today.getDay() === 0) {
            sundayPrior = today;
        } else {
            sundayPrior.setDate(today.getDate() - today.getDay());
        }
        
        // Set to midnight to avoid timezone issues
        sundayPrior.setHours(0, 0, 0, 0);
        
        const dateStr = sundayPrior.toISOString().split('T')[0];
        document.getElementById('startDate').value = dateStr;
        this.startDate = sundayPrior;
    }

    setDefaultCaseName() {
        // Update the input field with the default case name
        document.getElementById('caseName').value = this.caseName;
    }

    generateScheduleGrid() {
        const container = document.getElementById('scheduleGrid');
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        
        container.innerHTML = '';
        
        const startDayOfWeek = this.startDate.getDay();
        
        // Add title and notes button
        const headerRow = document.createElement('div');
        headerRow.style.display = 'flex';
        headerRow.style.justifyContent = 'space-between';
        headerRow.style.alignItems = 'center';
        headerRow.style.marginBottom = '15px';
        
        const notesButton = document.createElement('button');
        notesButton.className = 'section1-button';
        notesButton.textContent = this.regularScheduleNotes ? '📝 View/Edit Notes' : '➕ Add Notes';
        notesButton.style.fontSize = '12px';
        notesButton.style.padding = '6px 12px';
        notesButton.onclick = () => {
            this.openNotesModal('regular', 'Regular Schedule - Additional Notes', this.regularScheduleNotes);
        };
        
        headerRow.appendChild(document.createElement('div')); // Empty div for spacing
        headerRow.appendChild(notesButton);
        container.appendChild(headerRow);
        
        // Generate schedule grid
        for (let i = 0; i < 14; i++) {
            const dayRow = document.createElement('div');
            dayRow.className = 'day-row';
            
            const dayOfWeekIndex = (startDayOfWeek + i) % 7;
            const dayName = dayNames[dayOfWeekIndex];
            
            const dayLabel = document.createElement('div');
            dayLabel.className = 'day-label';
            dayLabel.textContent = `Day ${i + 1} (${dayName})`;
            
            const statusSelect = document.createElement('select');
            statusSelect.className = 'status-select';
            statusSelect.dataset.day = i;
            
            const statusOptions = [
                { value: 'Cx with Fx', text: 'With Father' },
                { value: 'Cx with Mx', text: 'With Mother' },
                { value: 'Cx --> Fx', text: 'Exchange to Father' },
                { value: 'Cx --> Mx', text: 'Exchange to Mother' }
            ];
            
            statusOptions.forEach(option => {
                const optionEl = document.createElement('option');
                optionEl.value = option.value;
                optionEl.textContent = option.text;
                optionEl.selected = option.value === this.regularSchedule[i].status;
                statusSelect.appendChild(optionEl);
            });
            
            const timeInput = document.createElement('input');
            timeInput.type = 'time';
            timeInput.className = 'time-input';
            timeInput.value = this.regularSchedule[i].time;
            timeInput.dataset.day = i;
            timeInput.step = '900';
            
            timeInput.addEventListener('change', (e) => {
                const time = e.target.value;
                const [hours, minutes] = time.split(':');
                const roundedMinutes = Math.round(parseInt(minutes) / 15) * 15;
                const newTime = `${hours}:${String(roundedMinutes).padStart(2, '0')}`;
                e.target.value = newTime;
            });
            
            dayRow.appendChild(dayLabel);
            dayRow.appendChild(statusSelect);
            dayRow.appendChild(timeInput);
            container.appendChild(dayRow);
        }
    }

    bindEvents() {
        document.getElementById('caseName').addEventListener('input', (e) => {
            this.caseName = e.target.value;
        });

        document.getElementById('startDate').addEventListener('change', (e) => {
            this.startDate = new Date(e.target.value + 'T00:00:00');
            this.generateScheduleGrid();
            this.generateCalendar();
            this.updateOvernightStats();
        });

        document.getElementById('scheduleGrid').addEventListener('change', (e) => {
            const day = parseInt(e.target.dataset.day);
            if (e.target.classList.contains('status-select')) {
                this.regularSchedule[day].status = e.target.value;
                this.generateCalendar();
                this.updateOvernightStats();
            } else if (e.target.classList.contains('time-input')) {
                this.regularSchedule[day].time = e.target.value;
                this.generateCalendar();
                this.updateOvernightStats();
            }
        });

        // Tab navigation
        document.querySelectorAll('.tab-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const tabId = e.target.dataset.tab;
                this.switchTab(tabId);
            });
        });

        // Save/Load functionality
        this.setupSaveLoadButtons();
        
        // Print functionality
        this.setupPrintButton();
    }

    setupSaveLoadButtons() {
        const saveButton = document.getElementById('saveCalendar');
        const loadButton = document.getElementById('loadCalendar');
        const fileInput = document.getElementById('fileInput');

        saveButton.addEventListener('click', () => {
            this.saveCalendar();
        });

        loadButton.addEventListener('click', () => {
            fileInput.click();
        });

        fileInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                this.loadCalendar(e.target.files[0]);
            }
        });
    }

    setupPrintButton() {
        // Add print button to the UI - we'll add this to the section1-buttons area
        const buttonsContainer = document.querySelector('.section1-buttons');
        if (buttonsContainer) {
            const printButton = document.createElement('button');
            printButton.className = 'section1-button';
            printButton.id = 'printCalendar';
            printButton.textContent = 'Print to PDF';
            printButton.addEventListener('click', () => {
                this.printCalendar();
            });
            buttonsContainer.appendChild(printButton);
        }
    }

    printCalendar() {
        // Clean up any existing print content
        const existingPrintDiv = document.getElementById('printContent');
        if (existingPrintDiv) {
            existingPrintDiv.remove();
        }
        
        // Create print content
        const printContent = this.generatePrintContent();
        
        // Create a hidden div for print content
        const printDiv = document.createElement('div');
        printDiv.id = 'printContent';
        printDiv.className = 'print-only';
        document.body.appendChild(printDiv);
        
        printDiv.innerHTML = printContent;
        
        // Trigger print
        window.print();
        
        // Clean up print content after a short delay
        setTimeout(() => {
            const cleanupDiv = document.getElementById('printContent');
            if (cleanupDiv) {
                cleanupDiv.remove();
            }
        }, 1000);
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    generatePrintContent() {
        const activeHolidays = this.getActiveHolidays();
        
        return `
            <div class="print-container">
                <!-- Page 1: Regular Schedule + Active Holidays -->
                <div class="print-page print-page-first">
                    <div class="print-header">
                        <h1>${this.caseName}</h1>
                        <h2>Timesharing Schedule</h2>
                        <p>Schedule Start Date: ${this.startDate.toLocaleDateString('en-US', { 
                            weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                        })}</p>
                    </div>
                    
                    <div class="print-schedule-section">
                        <h3>Regular Schedule (2-Week Rotation)</h3>
                        ${this.generatePrintSchedule()}
                        ${this.regularScheduleNotes ? `
                            <div style="margin-top: 15px; padding: 10px; background: #f0f8ff; border: 1px solid #cce5ff; border-radius: 4px;">
                                <strong>Additional Notes:</strong>
                                <div style="margin-top: 5px; white-space: pre-wrap; font-size: 12px;">${this.escapeHtml(this.regularScheduleNotes)}</div>
                            </div>
                        ` : ''}
                    </div>
                    
                    <div class="print-holidays-section">
                        <h3>Active Holidays</h3>
                        ${activeHolidays.length > 0 ? this.generateActiveHolidaysList(activeHolidays) : '<p>No holidays currently observed.</p>'}
                    </div>
                </div>
                
                <!-- Pages 2-13: Monthly Calendars -->
                ${this.generatePrintCalendars()}
            </div>
        `;
    }

    generatePrintSchedule() {
		const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
		const startDayOfWeek = this.startDate.getDay();
		
		// Create table with days of week as columns
		let scheduleHTML = `
			<table class="print-schedule-table" style="width: 100%; border-collapse: collapse; margin-bottom: 20px;">
				<thead>
					<tr>
						<th style="border: 1px solid #333; padding: 8px; background: #f5f5f5; font-weight: bold;"></th>
		`;
		
		// Add day headers
		dayNames.forEach(day => {
			scheduleHTML += `<th style="border: 1px solid #333; padding: 8px; background: #f5f5f5; font-weight: bold;">${day}</th>`;
		});
		scheduleHTML += '</tr></thead><tbody>';
		
		// Calculate the first Sunday on or after the start date
		const firstSunday = new Date(this.startDate);
		const daysUntilSunday = (7 - startDayOfWeek) % 7;
		if (daysUntilSunday > 0) {
			firstSunday.setDate(firstSunday.getDate() + daysUntilSunday);
		}
		
		// Week 1 row - show the week containing the first Sunday
		scheduleHTML += `
			<tr>
				<td style="border: 1px solid #333; padding: 8px; font-weight: bold; background: #f9f9f9;">Week One</td>
		`;
		
		for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
			// Calculate which day in the 14-day cycle this corresponds to
			const daysFromStart = daysUntilSunday + dayOfWeek - 7;
			
			// Always show the schedule, even for days before start
			// Use modulo to wrap negative numbers correctly
			let scheduleIndex = daysFromStart % 14;
			if (scheduleIndex < 0) {
				scheduleIndex += 14;
			}
			
			const schedule = this.regularSchedule[scheduleIndex];
			const statusText = this.getStatusDisplayText(schedule.status);
			const timeText = schedule.status.includes('-->') ? `<br><small>${DateUtils.formatTime(schedule.time)}</small>` : '';
			
			scheduleHTML += `
				<td style="border: 1px solid #333; padding: 8px; text-align: center;">
					${statusText}${timeText}
				</td>
			`;
		}
		scheduleHTML += '</tr>';
		
		// Week 2 row - the following week
		scheduleHTML += `
			<tr>
				<td style="border: 1px solid #333; padding: 8px; font-weight: bold; background: #f9f9f9;">Week Two</td>
		`;
		
		for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
			// Calculate which day in the 14-day cycle this corresponds to
			const daysFromStart = daysUntilSunday + dayOfWeek;
			const scheduleIndex = daysFromStart % 14;
			const schedule = this.regularSchedule[scheduleIndex];
			const statusText = this.getStatusDisplayText(schedule.status);
			const timeText = schedule.status.includes('-->') ? `<br><small>${DateUtils.formatTime(schedule.time)}</small>` : '';
			
			scheduleHTML += `
				<td style="border: 1px solid #333; padding: 8px; text-align: center;">
					${statusText}${timeText}
				</td>
			`;
		}
		scheduleHTML += '</tr>';
		
		scheduleHTML += '</tbody></table>';
		
		return scheduleHTML;
	}

    getActiveHolidays() {
        const activeHolidays = [];
        
        // Check built-in holidays
        if (this.holidays) {
            if (this.holidays.springBreak && this.holidays.springBreak.config.observed) {
                activeHolidays.push({ name: 'Spring Break', icon: '🌸', config: this.holidays.springBreak.config });
            }
            if (this.holidays.thanksgivingBreak && this.holidays.thanksgivingBreak.config.observed) {
                activeHolidays.push({ name: 'Thanksgiving Break', icon: '🦃', config: this.holidays.thanksgivingBreak.config });
            }
            if (this.holidays.christmasBreak && this.holidays.christmasBreak.config.observed) {
                activeHolidays.push({ name: 'Christmas Break', icon: '🎄', config: this.holidays.christmasBreak.config });
            }
            if (this.holidays.easterBreak && this.holidays.easterBreak.config.observed) {
                activeHolidays.push({ name: 'Easter Weekend', icon: '🐰', config: this.holidays.easterBreak.config });
            }
            if (this.holidays.memorialDayBreak && this.holidays.memorialDayBreak.config.observed) {
                activeHolidays.push({ name: 'Memorial Day Weekend', icon: '🎖️', config: this.holidays.memorialDayBreak.config });
            }
            if (this.holidays.mothersDay && this.holidays.mothersDay.config.observed) {
                activeHolidays.push({ name: 'Mother\'s Day', icon: '👩', config: this.holidays.mothersDay.config });
            }
            if (this.holidays.fathersDay && this.holidays.fathersDay.config.observed) {
                activeHolidays.push({ name: 'Father\'s Day', icon: '👨', config: this.holidays.fathersDay.config });
            }
            if (this.holidays.independenceDay && this.holidays.independenceDay.config.observed) {
                activeHolidays.push({ name: 'Independence Day', icon: '🎆', config: this.holidays.independenceDay.config });
            }
            if (this.holidays.summerBreak && this.holidays.summerBreak.config.observed) {
                activeHolidays.push({ name: 'Summer Break', icon: '☀️', config: this.holidays.summerBreak.config });
            }
        }
        
        // Check custom holidays
        if (this.customHolidayManager && this.customHolidayManager.customHolidays) {
            for (let [id, holiday] of this.customHolidayManager.customHolidays) {
                if (holiday.config.observed) {
                    activeHolidays.push({ name: holiday.config.name, icon: '🎯', config: holiday.config });
                }
            }
        }
        
        return activeHolidays;
    }

    generateActiveHolidaysList(holidays) {
        let html = '<div class="print-holidays-list">';
        
        holidays.forEach(holiday => {
            // Skip custom holidays for now - they need special handling
            if (holiday.icon === '🎯') {
                html += this.generateCustomHolidayPrint(holiday);
                return;
            }
            
            // Handle summer break specially
            if (holiday.name === 'Summer Break') {
                html += this.generateSummerBreakPrint(holiday);
                return;
            }
            
            // Generate enhanced description for other holidays
            html += this.generateEnhancedHolidayPrint(holiday);
        });
        
        html += '</div>';
        return html;
    }

    generateEnhancedHolidayPrint(holiday) {
        const config = holiday.config;
        
        // Determine if it's a split holiday (has exchange date)
        const hasSplit = config.exchangeDate && config.exchangeDate !== config.startDate;
        
        let html = `
            <div class="print-holiday-item" style="margin-bottom: 25px; page-break-inside: avoid;">
                <div class="print-holiday-header" style="border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 12px;">
                    <span class="print-holiday-icon" style="font-size: 18px;">${holiday.icon}</span>
                    <span class="print-holiday-name" style="font-weight: bold; font-size: 16px; margin-left: 8px;">${holiday.name}</span>
                </div>
        `;
        
        if (hasSplit) {
            // Split holiday description
            const startDayName = this.getDayName(config.startDate);
            const exchangeDayName = this.getDayName(config.exchangeDate);
            const endDayName = this.getDayName(config.endDate);
            
            html += `
                <div style="margin-bottom: 15px; font-size: 14px; line-height: 1.5;">
                    <strong>${holiday.name}:</strong> In subsequent years, although the dates (and in some cases the number of overnights) will differ from what's shown below, the format remains the same, to wit: the ${config.firstHalfParent} will have the children from ${startDayName} at ${DateUtils.formatTime(config.startTime)} until ${exchangeDayName} at ${DateUtils.formatTime(config.exchangeTime)} in ${config.firstHalfYears} years, and the ${config.secondHalfParent} will have the children from ${exchangeDayName} at ${DateUtils.formatTime(config.exchangeTime)} until ${endDayName} at ${DateUtils.formatTime(config.endTime)} in ${config.secondHalfYears} years.
                </div>
            `;
        } else {
            // Single period holiday description
            const startDayName = this.getDayName(config.startDate);
            const endDayName = this.getDayName(config.endDate);
            
            // Determine which parent gets it (for Mother's Day/Father's Day)
            let holidayParent = 'the designated parent';
            if (holiday.name.includes("Mother's")) {
                holidayParent = 'the Mother';
            } else if (holiday.name.includes("Father's")) {
                holidayParent = 'the Father';
            }
            
            html += `
                <div style="margin-bottom: 15px; font-size: 14px; line-height: 1.5;">
                    <strong>${holiday.name}:</strong> In subsequent years, although the dates (and in some cases the number of overnights) will differ from what's shown below, the format remains the same, to wit: ${holidayParent} will have the children from ${startDayName} at ${DateUtils.formatTime(config.startTime)} until ${endDayName} at ${DateUtils.formatTime(config.endTime)}.
                </div>
            `;
        }
        
        // Current year details
        html += this.generateCurrentHolidayDetails(holiday);
        
        // Add additional notes if they exist
        if (config.additionalNotes) {
            html += `
                <div style="margin-top: 10px; padding: 10px; background: #f0f8ff; border: 1px solid #cce5ff; border-radius: 4px;">
                    <strong>Additional Notes:</strong>
                    <div style="margin-top: 5px; white-space: pre-wrap; font-size: 12px;">${this.escapeHtml(config.additionalNotes)}</div>
                </div>
            `;
        }
        
        html += '</div>';
        
        return html;
    }

    generateCurrentHolidayDetails(holiday) {
        const config = holiday.config;
        const startDate = config.startDate ? new Date(config.startDate).toLocaleDateString() : 'Not set';
        const endDate = config.endDate ? new Date(config.endDate).toLocaleDateString() : 'Not set';
        const exchangeDate = config.exchangeDate ? new Date(config.exchangeDate).toLocaleDateString() : null;
        
        let html = `
            <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                <div style="font-weight: bold; margin-bottom: 8px; color: #333;">Current Year Details:</div>
                <div style="font-size: 13px; color: #666; line-height: 1.4;">
                    <div><strong>Start:</strong> ${startDate} at ${DateUtils.formatTime(config.startTime)}</div>
        `;
        
        if (exchangeDate && exchangeDate !== startDate) {
            html += `<div><strong>Exchange:</strong> ${exchangeDate} at ${DateUtils.formatTime(config.exchangeTime)}</div>`;
        }
        
        html += `
                    <div><strong>End:</strong> ${endDate} at ${DateUtils.formatTime(config.endTime)}</div>
                </div>
            </div>
        `;
        
        return html;
    }

    generateSummerBreakPrint(holiday) {
        const config = holiday.config;
        
        let html = `
            <div class="print-holiday-item" style="margin-bottom: 25px; page-break-inside: avoid;">
                <div class="print-holiday-header" style="border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 12px;">
                    <span class="print-holiday-icon" style="font-size: 18px;">☀️</span>
                    <span class="print-holiday-name" style="font-weight: bold; font-size: 16px; margin-left: 8px;">Summer Break</span>
                </div>
                
                <div style="margin-bottom: 15px;">
                    <div style="font-weight: bold; margin-bottom: 8px;">Summer Break Format: ${this.getSummerBreakTypeDisplayName(config.type)}</div>
                    <div style="font-size: 14px; margin-bottom: 12px;">
                        <strong>Duration:</strong> ${config.startDate ? new Date(config.startDate).toLocaleDateString() : 'Not set'} at ${DateUtils.formatTime(config.startTime)} 
                        through ${config.endDate ? new Date(config.endDate).toLocaleDateString() : 'Not set'} at ${DateUtils.formatTime(config.endTime)}
                    </div>
                </div>
        `;
        
        // Add type-specific details
        switch (config.type) {
            case 'vacation-period':
                html += this.generateVacationPeriodPrint(config);
                break;
            case 'week-on-off':
                html += this.generateWeekOnOffPrint(config);
                break;
            case 'two-weeks-on-off':
                html += this.generateTwoWeeksOnOffPrint(config);
                break;
            case 'split-summer':
                html += this.generateSplitSummerPrint(config);
                break;
            case 'custom':
                html += this.generateCustomSummerPrint(config);
                break;
        }
        
        // Add additional notes if they exist
        if (config.additionalNotes) {
            html += `
                <div style="margin-top: 10px; padding: 10px; background: #f0f8ff; border: 1px solid #cce5ff; border-radius: 4px;">
                    <strong>Additional Notes:</strong>
                    <div style="margin-top: 5px; white-space: pre-wrap; font-size: 12px;">${this.escapeHtml(config.additionalNotes)}</div>
                </div>
            `;
        }
        
        html += '</div>';
        return html;
    }

    getSummerBreakTypeDisplayName(type) {
        switch (type) {
            case 'vacation-period': return 'Vacation Period Model';
            case 'week-on-off': return 'Week On / Week Off';
            case 'two-weeks-on-off': return 'Two Weeks On / Two Weeks Off';
            case 'split-summer': return 'Split Summer (Two Halves)';
            case 'custom': return 'Custom Schedule';
            default: return type;
        }
    }

    generateVacationPeriodPrint(config) {
        return `
            <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                <div style="font-weight: bold; margin-bottom: 8px;">Vacation Period Settings:</div>
                <div style="font-size: 13px; line-height: 1.4;">
                    <div><strong>Vacation Days Per Parent:</strong> ${config.vacationDays} days</div>
                    <div><strong>Maximum Consecutive Days:</strong> ${config.maxConsecutiveDays} days</div>
                    <div><strong>Notification Deadline:</strong> ${config.notificationDeadline}</div>
                    <div><strong>Conflict Resolution:</strong> ${config.conflictResolution === 'father-odd' ? "Father's choice trumps in Odd years" : "Mother's choice trumps in Odd years"}</div>
                    <div style="margin-top: 8px; font-style: italic;">Note: Regular timesharing schedule continues except during designated vacation periods.</div>
                </div>
            </div>
        `;
    }

    generateWeekOnOffPrint(config) {
        return `
            <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                <div style="font-weight: bold; margin-bottom: 8px;">Week On/Week Off Settings:</div>
                <div style="font-size: 13px; line-height: 1.4;">
                    <div><strong>First Week Goes to:</strong> ${config.firstWeekParent} in ${config.firstWeekYears} years</div>
                    <div style="margin-top: 8px; font-style: italic;">Alternates weekly between parents for the entire summer break period. Exchanges occur on Sundays at ${DateUtils.formatTime(config.startTime)}.</div>
                </div>
            </div>
        `;
    }

    generateTwoWeeksOnOffPrint(config) {
        return `
            <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                <div style="font-weight: bold; margin-bottom: 8px;">Two Weeks On/Off Settings:</div>
                <div style="font-size: 13px; line-height: 1.4;">
                    <div><strong>First Two Weeks Go to:</strong> ${config.firstWeekParent} in ${config.firstWeekYears} years</div>
                    <div style="margin-top: 8px; font-style: italic;">Alternates every two weeks between parents for the entire summer break period. Exchanges occur every other Sunday at ${DateUtils.formatTime(config.startTime)}.</div>
                </div>
            </div>
        `;
    }

    generateSplitSummerPrint(config) {
        const exchangeDate = config.exchangeDate ? new Date(config.exchangeDate).toLocaleDateString() : 'Not set';
        const exchangeDayName = this.getDayName(config.exchangeDate);
        
        return `
            <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                <div style="font-weight: bold; margin-bottom: 8px;">Split Summer Settings:</div>
                <div style="font-size: 13px; line-height: 1.4;">
                    <div><strong>Exchange Date & Time:</strong> ${exchangeDate} at ${DateUtils.formatTime(config.exchangeTime)}</div>
                    <div><strong>1st Half Goes to:</strong> ${config.firstHalfParent} in ${config.firstHalfYears} years</div>
                    <div><strong>2nd Half Goes to:</strong> ${config.secondHalfParent} in ${config.secondHalfYears} years</div>
                    <div style="margin-top: 8px; font-style: italic;">Summer is divided into two periods with an exchange on ${exchangeDayName}.</div>
                </div>
            </div>
        `;
    }

    generateCustomSummerPrint(config) {
        const totalOvernights = config.endDate && config.startDate ? 
            Math.floor((new Date(config.endDate) - new Date(config.startDate)) / (1000 * 60 * 60 * 24)) : 0;
        const remainingOvernights = totalOvernights - config.customOvernightsCount;
        const otherParent = config.customOvernightsParent === 'Father' ? 'Mother' : 'Father';
        
        return `
            <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                <div style="font-weight: bold; margin-bottom: 8px;">Custom Schedule:</div>
                <div style="font-size: 13px; line-height: 1.4; margin-bottom: 12px;">
                    <div><strong>Summer Overnights to ${config.customOvernightsParent}:</strong> ${config.customOvernightsCount} nights</div>
                    <div><strong>Summer Overnights to ${otherParent}:</strong> ${Math.max(0, remainingOvernights)} nights</div>
                    <div><strong>Total Summer Overnights:</strong> ${totalOvernights} nights</div>
                </div>
                ${config.customInstructions ? `
                    <div style="margin-top: 12px;">
                        <div style="font-weight: bold; margin-bottom: 8px;">Custom Instructions:</div>
                        <div style="background: white; padding: 8px; border: 1px solid #ddd; border-radius: 4px; white-space: pre-wrap; font-size: 12px;">${config.customInstructions}</div>
                    </div>
                ` : ''}
            </div>
        `;
    }

    generateCustomHolidayPrint(holiday) {
        // For custom holidays, show basic info since they're user-defined
        const config = holiday.config;
        const startDate = config.startDate ? new Date(config.startDate).toLocaleDateString() : 'Not set';
        const endDate = config.endDate ? new Date(config.endDate).toLocaleDateString() : 'Not set';
        const exchangeDate = config.exchangeDate ? new Date(config.exchangeDate).toLocaleDateString() : null;
        
        let html = `
            <div class="print-holiday-item" style="margin-bottom: 25px; page-break-inside: avoid;">
                <div class="print-holiday-header" style="border-bottom: 2px solid #333; padding-bottom: 8px; margin-bottom: 12px;">
                    <span class="print-holiday-icon" style="font-size: 18px;">🎯</span>
                    <span class="print-holiday-name" style="font-weight: bold; font-size: 16px; margin-left: 8px;">${config.name}</span>
                </div>
                
                <div style="background: #f9f9f9; padding: 12px; border-radius: 6px; border: 1px solid #ddd;">
                    <div style="font-size: 13px; color: #666; line-height: 1.4;">
                        <div><strong>Start:</strong> ${startDate} at ${DateUtils.formatTime(config.startTime)}</div>
        `;
        
        if (exchangeDate && exchangeDate !== startDate) {
            html += `<div><strong>Exchange:</strong> ${exchangeDate} at ${DateUtils.formatTime(config.exchangeTime)}</div>`;
        }
        
        html += `
                        <div><strong>End:</strong> ${endDate} at ${DateUtils.formatTime(config.endTime)}</div>
                        <div style="margin-top: 8px;"><strong>1st Half:</strong> ${config.firstHalfParent} in ${config.firstHalfYears} years</div>
                        <div><strong>2nd Half:</strong> ${config.secondHalfParent} in ${config.secondHalfYears} years</div>
                    </div>
                </div>
        `;
        
        // Add additional notes if they exist
        if (config.additionalNotes) {
            html += `
                <div style="margin-top: 10px; padding: 10px; background: #f0f8ff; border: 1px solid #cce5ff; border-radius: 4px;">
                    <strong>Additional Notes:</strong>
                    <div style="margin-top: 5px; white-space: pre-wrap; font-size: 12px;">${this.escapeHtml(config.additionalNotes)}</div>
                </div>
            `;
        }
        
        html += '</div>';
        
        return html;
    }

    getDayName(date) {
        if (!date) return 'Unknown';
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        return dayNames[new Date(date).getDay()];
    }

    generatePrintCalendars() {
        let calendarsHTML = '';
        const startDate = new Date(this.startDate);
        
        for (let month = 0; month < 12; month++) {
            const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);
            calendarsHTML += this.generatePrintMonthCalendar(monthDate, month + 2); // Page numbers 2-13
        }
        
        return calendarsHTML;
    }

    generatePrintMonthCalendar(monthDate, pageNumber) {
        const monthName = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        const startPadding = firstDay.getDay();
        
        let calendarHTML = `
            <div class="print-page print-calendar-page">
                <div class="print-calendar-header">
                    <h2>${monthName}</h2>
                </div>
                <div class="print-calendar-grid">
                    <div class="print-calendar-day-header">Sun</div>
                    <div class="print-calendar-day-header">Mon</div>
                    <div class="print-calendar-day-header">Tue</div>
                    <div class="print-calendar-day-header">Wed</div>
                    <div class="print-calendar-day-header">Thu</div>
                    <div class="print-calendar-day-header">Fri</div>
                    <div class="print-calendar-day-header">Sat</div>
        `;
        
        // Add padding days
        for (let i = 0; i < startPadding; i++) {
            calendarHTML += '<div class="print-calendar-day print-calendar-day-empty"></div>';
        }
        
        // Add actual days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            calendarHTML += this.generatePrintDayElement(dayDate, day);
        }
        
        calendarHTML += `
                </div>
            </div>
        `;
        
        return calendarHTML;
    }

    generatePrintDayElement(date, dayNumber) {
        let dayHTML = `<div class="print-calendar-day">`;
        dayHTML += `<div class="print-day-number">${dayNumber}</div>`;
        
        // Check if before start date
        if (date < this.startDate) {
            dayHTML += `<div class="print-day-status">Before Start</div>`;
            dayHTML += `</div>`;
            return dayHTML;
        }
        
        // Check for holidays
        let holidayInfo = null;
        
        if (this.holidays) {
            // Check custom holidays first
            if (!holidayInfo && this.customHolidayManager && this.customHolidayManager.getInfoForDate) {
                holidayInfo = this.customHolidayManager.getInfoForDate(date);
            }
            
            // Check other holidays
            if (!holidayInfo && this.holidays.mothersDay && this.holidays.mothersDay.getInfoForDate) {
                holidayInfo = this.holidays.mothersDay.getInfoForDate(date);
            }
            if (!holidayInfo && this.holidays.fathersDay && this.holidays.fathersDay.getInfoForDate) {
                holidayInfo = this.holidays.fathersDay.getInfoForDate(date);
            }
            if (!holidayInfo && this.holidays.springBreak && this.holidays.springBreak.getInfoForDate) {
                holidayInfo = this.holidays.springBreak.getInfoForDate(date);
            }
            if (!holidayInfo && this.holidays.easterBreak && this.holidays.easterBreak.getInfoForDate) {
                holidayInfo = this.holidays.easterBreak.getInfoForDate(date);
            }
            if (!holidayInfo && this.holidays.memorialDayBreak && this.holidays.memorialDayBreak.getInfoForDate) {
                holidayInfo = this.holidays.memorialDayBreak.getInfoForDate(date);
            }
            if (!holidayInfo && this.holidays.independenceDay && this.holidays.independenceDay.getInfoForDate) {
                holidayInfo = this.holidays.independenceDay.getInfoForDate(date);
            }
            if (!holidayInfo && this.holidays.summerBreak && this.holidays.summerBreak.getInfoForDate) {
                holidayInfo = this.holidays.summerBreak.getInfoForDate(date);
            }
            if (!holidayInfo && this.holidays.thanksgivingBreak && this.holidays.thanksgivingBreak.getInfoForDate) {
                holidayInfo = this.holidays.thanksgivingBreak.getInfoForDate(date);
            }
            if (!holidayInfo && this.holidays.christmasBreak && this.holidays.christmasBreak.getInfoForDate) {
                holidayInfo = this.holidays.christmasBreak.getInfoForDate(date);
            }
        }
        
        if (holidayInfo) {
            dayHTML += `<div class="print-day-status">${holidayInfo.statusText}</div>`;
            if (holidayInfo.time) {
                dayHTML += `<div class="print-day-time">${DateUtils.formatTime(holidayInfo.time)}</div>`;
            }
            dayHTML += `<div class="print-day-icon">${holidayInfo.icon}</div>`;
        } else {
            // Regular schedule
            const scheduleInfo = this.getScheduleForDate(date);
            const statusText = this.getStatusDisplayText(scheduleInfo.status);
            dayHTML += `<div class="print-day-status">${statusText}</div>`;
            
            if (scheduleInfo.status.includes('-->')) {
                dayHTML += `<div class="print-day-time">${DateUtils.formatTime(scheduleInfo.time)}</div>`;
            }
        }
        
        dayHTML += `</div>`;
        return dayHTML;
    }

    saveCalendar() {
        const calendarData = {
            caseName: this.caseName,
            startDate: this.startDate.toISOString(),
            regularSchedule: this.regularSchedule,
            regularScheduleNotes: this.regularScheduleNotes, // Include notes in save
            version: "2.1", // Updated version to indicate notes support
            timestamp: new Date().toISOString()
        };

        // Only save holiday data if holidays are initialized
        if (this.holidays) {
            calendarData.holidays = {};
            
            if (this.holidays.springBreak && this.holidays.springBreak.exportConfig) {
                calendarData.holidays.springBreak = this.holidays.springBreak.exportConfig();
            }
            
            if (this.holidays.thanksgivingBreak && this.holidays.thanksgivingBreak.exportConfig) {
                calendarData.holidays.thanksgivingBreak = this.holidays.thanksgivingBreak.exportConfig();
            }
            
            if (this.holidays.christmasBreak && this.holidays.christmasBreak.exportConfig) {
                calendarData.holidays.christmasBreak = this.holidays.christmasBreak.exportConfig();
            }
            
            if (this.holidays.easterBreak && this.holidays.easterBreak.exportConfig) {
                calendarData.holidays.easterBreak = this.holidays.easterBreak.exportConfig();
            }
            
            if (this.holidays.memorialDayBreak && this.holidays.memorialDayBreak.exportConfig) {
                calendarData.holidays.memorialDayBreak = this.holidays.memorialDayBreak.exportConfig();
            }
            
            if (this.holidays.mothersDay && this.holidays.mothersDay.exportConfig) {
                calendarData.holidays.mothersDay = this.holidays.mothersDay.exportConfig();
            }
            
            if (this.holidays.fathersDay && this.holidays.fathersDay.exportConfig) {
                calendarData.holidays.fathersDay = this.holidays.fathersDay.exportConfig();
            }
            
            if (this.holidays.independenceDay && this.holidays.independenceDay.exportConfig) {
                calendarData.holidays.independenceDay = this.holidays.independenceDay.exportConfig();
            }
            
            if (this.holidays.summerBreak && this.holidays.summerBreak.exportConfig) {
                calendarData.holidays.summerBreak = this.holidays.summerBreak.exportConfig();
            }
            
            // Save custom holidays
            if (this.customHolidayManager && this.customHolidayManager.exportConfig) {
                calendarData.customHolidays = this.customHolidayManager.exportConfig();
            }
        }

        const dataStr = JSON.stringify(calendarData, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        
        const link = document.createElement('a');
        link.href = URL.createObjectURL(dataBlob);
        
        // Create filename with case name and date
        const fileName = `${this.caseName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.json`;
        link.download = fileName;
        
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        URL.revokeObjectURL(link.href);
    }

    async loadCalendar(file) {
        try {
            const text = await file.text();
            const calendarData = JSON.parse(text);
            
            // Validate the data structure
            if (!calendarData.caseName || !calendarData.startDate || !calendarData.regularSchedule) {
                alert('Invalid calendar file format.');
                return;
            }
            
            // Load the data
            this.caseName = calendarData.caseName;
            this.startDate = new Date(calendarData.startDate);
            this.regularSchedule = calendarData.regularSchedule;
            this.regularScheduleNotes = calendarData.regularScheduleNotes || ''; // Load notes
            
            // Load holiday configurations if they exist and holidays are initialized
            if (calendarData.holidays && this.holidays) {
                if (calendarData.holidays.springBreak && this.holidays.springBreak) {
                    this.holidays.springBreak.importConfig(calendarData.holidays.springBreak);
                }
                
                if (calendarData.holidays.thanksgivingBreak && this.holidays.thanksgivingBreak) {
                    this.holidays.thanksgivingBreak.importConfig(calendarData.holidays.thanksgivingBreak);
                }
                
                if (calendarData.holidays.christmasBreak && this.holidays.christmasBreak) {
                    this.holidays.christmasBreak.importConfig(calendarData.holidays.christmasBreak);
                }
                
                if (calendarData.holidays.easterBreak && this.holidays.easterBreak) {
                    this.holidays.easterBreak.importConfig(calendarData.holidays.easterBreak);
                }
                
                if (calendarData.holidays.memorialDayBreak && this.holidays.memorialDayBreak) {
                    this.holidays.memorialDayBreak.importConfig(calendarData.holidays.memorialDayBreak);
                }
                
                if (calendarData.holidays.mothersDay && this.holidays.mothersDay) {
                    this.holidays.mothersDay.importConfig(calendarData.holidays.mothersDay);
                }
                
                if (calendarData.holidays.fathersDay && this.holidays.fathersDay) {
                    this.holidays.fathersDay.importConfig(calendarData.holidays.fathersDay);
                }
                
                if (calendarData.holidays.independenceDay && this.holidays.independenceDay) {
                    this.holidays.independenceDay.importConfig(calendarData.holidays.independenceDay);
                }
                
                if (calendarData.holidays.summerBreak && this.holidays.summerBreak) {
                    this.holidays.summerBreak.importConfig(calendarData.holidays.summerBreak);
                }
            }
            
            // Load custom holidays if they exist
            if (calendarData.customHolidays && this.customHolidayManager) {
                this.customHolidayManager.importConfig(calendarData.customHolidays);
            }
            
            // Update the UI
            document.getElementById('caseName').value = this.caseName;
            document.getElementById('startDate').value = this.startDate.toISOString().split('T')[0];
            
            // Regenerate the schedule grid and calendar
            this.generateScheduleGrid();
            this.generateCalendar();
            this.updateOvernightStats();
            
            // Regenerate holiday forms with loaded data if available
            if (this.holidays) {
                if (this.holidays.springBreak) {
                    this.generateSpringBreakForm();
                }
                if (this.holidays.thanksgivingBreak) {
                    this.generateThanksgivingBreakForm();
                }
                if (this.holidays.christmasBreak) {
                    this.generateChristmasBreakForm();
                }
                if (this.holidays.easterBreak) {
                    this.generateEasterBreakForm();
                }
                if (this.holidays.memorialDayBreak) {
                    this.generateMemorialDayBreakForm();
                }
                if (this.holidays.mothersDay) {
                    this.generateMothersForm();
                }
                if (this.holidays.fathersDay) {
                    this.generateFathersForm();
                }
                if (this.holidays.independenceDay) {
                    this.generateIndependenceDayForm();
                }
                if (this.holidays.summerBreak) {
                    this.generateSummerBreakForm();
                }
            }
            
            // Clear the file input
            document.getElementById('fileInput').value = '';
            
            alert('Calendar loaded successfully!');
        } catch (error) {
            alert('Error loading calendar file: ' + error.message);
        }
    }

    switchTab(tabId) {
        // Update button states
        document.querySelectorAll('.tab-button').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-tab="${tabId}"]`).classList.add('active');

        // Update content visibility
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });
        const targetTab = document.getElementById(`tab-${tabId}`);
        if (targetTab) {
            targetTab.classList.add('active');
        }

        // Generate holiday-specific forms when tabs are switched (if holidays are available)
        if (tabId === 'spring' && this.holidays && this.holidays.springBreak) {
            this.generateSpringBreakForm();
        } else if (tabId === 'thanksgiving' && this.holidays && this.holidays.thanksgivingBreak) {
            this.generateThanksgivingBreakForm();
        } else if (tabId === 'christmas' && this.holidays && this.holidays.christmasBreak) {
            this.generateChristmasBreakForm();
        } else if (tabId === 'easter' && this.holidays && this.holidays.easterBreak) {
            this.generateEasterBreakForm();
        } else if (tabId === 'memorial' && this.holidays && this.holidays.memorialDayBreak) {
            console.log('🎯 Memorial Day tab clicked!');
            this.generateMemorialDayBreakForm();
        } else if (tabId === 'mothers' && this.holidays && this.holidays.mothersDay) {
            this.generateMothersForm();
        } else if (tabId === 'fathers' && this.holidays && this.holidays.fathersDay) {
            this.generateFathersForm();
        } else if (tabId === 'independence' && this.holidays && this.holidays.independenceDay) {
            this.generateIndependenceDayForm();
        } else if (tabId === 'summer' && this.holidays && this.holidays.summerBreak) {
            this.generateSummerBreakForm();
        } else if (tabId === 'custom' && this.customHolidayManager) {
			// This will show all existing custom holidays when the tab is clicked
			this.customHolidayManager.updateCustomHolidaysList();
		} else {
            console.log('🔍 Tab switched to:', tabId, 'Available holidays:', Object.keys(this.holidays || {}));
        }
    }

    generateSpringBreakForm() {
        const container = document.getElementById('springBreakConfig');
        if (container && this.holidays && this.holidays.springBreak) {
            container.innerHTML = this.holidays.springBreak.generateForm();
            this.holidays.springBreak.setupEventListeners();
        }
    }

    generateThanksgivingBreakForm() {
        const container = document.getElementById('thanksgivingBreakConfig');
        if (container && this.holidays && this.holidays.thanksgivingBreak) {
            container.innerHTML = this.holidays.thanksgivingBreak.generateForm();
            this.holidays.thanksgivingBreak.setupEventListeners();
        }
    }

    generateChristmasBreakForm() {
        const container = document.getElementById('christmasBreakConfig');
        if (container && this.holidays && this.holidays.christmasBreak) {
            container.innerHTML = this.holidays.christmasBreak.generateForm();
            this.holidays.christmasBreak.setupEventListeners();
        }
    }

    generateEasterBreakForm() {
        const container = document.getElementById('easterConfig');
        if (container && this.holidays && this.holidays.easterBreak) {
            container.innerHTML = this.holidays.easterBreak.generateForm();
            this.holidays.easterBreak.setupEventListeners();
        }
    }

    generateMemorialDayBreakForm() {
        console.log('🔍 Attempting to generate Memorial Day form...');
        const container = document.getElementById('memorialConfig');
        console.log('📦 Memorial Day container:', container);
        
        if (container && this.holidays && this.holidays.memorialDayBreak) {
            console.log('✅ Generating Memorial Day form');
            container.innerHTML = this.holidays.memorialDayBreak.generateForm();
            this.holidays.memorialDayBreak.setupEventListeners();
        } else {
            console.log('❌ Memorial Day form generation failed:', {
                container: !!container,
                holidays: !!this.holidays,
                memorialDayBreak: !!(this.holidays && this.holidays.memorialDayBreak)
            });
        }
    }

    generateMothersForm() {
        const container = document.getElementById('mothersConfig');
        if (container && this.holidays && this.holidays.mothersDay) {
            container.innerHTML = this.holidays.mothersDay.generateForm();
            this.holidays.mothersDay.setupEventListeners();
        }
    }

    generateFathersForm() {
        const container = document.getElementById('fathersConfig');
        if (container && this.holidays && this.holidays.fathersDay) {
            container.innerHTML = this.holidays.fathersDay.generateForm();
            this.holidays.fathersDay.setupEventListeners();
        }
    }

    generateIndependenceDayForm() {
        const container = document.getElementById('independenceConfig');
        if (container && this.holidays && this.holidays.independenceDay) {
            container.innerHTML = this.holidays.independenceDay.generateForm();
            this.holidays.independenceDay.setupEventListeners();
        }
    }

    generateSummerBreakForm() {
        const container = document.getElementById('summerConfig');
        if (container && this.holidays && this.holidays.summerBreak) {
            container.innerHTML = this.holidays.summerBreak.generateForm();
            this.holidays.summerBreak.setupEventListeners();
        }
    }

    generateCalendar() {
        const container = document.getElementById('calendarContainer');
        container.innerHTML = '';
        
        const startDate = new Date(this.startDate);
        
        for (let month = 0; month < 12; month++) {
            const monthDate = new Date(startDate.getFullYear(), startDate.getMonth() + month, 1);
            const monthGrid = this.createMonthGrid(monthDate);
            container.appendChild(monthGrid);
        }
    }

    createMonthGrid(monthDate) {
        const monthContainer = document.createElement('div');
        monthContainer.style.marginBottom = '30px';

        const monthHeader = document.createElement('h3');
        monthHeader.textContent = monthDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
        monthHeader.style.marginBottom = '15px';
        monthHeader.style.fontSize = '20px';
        monthHeader.style.fontWeight = '600';
        monthHeader.style.color = '#374151';
        monthContainer.appendChild(monthHeader);

        const grid = document.createElement('div');
        grid.className = 'calendar-grid';

        const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        dayHeaders.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day-header';
            header.textContent = day;
            grid.appendChild(header);
        });

        const firstDay = new Date(monthDate.getFullYear(), monthDate.getMonth(), 1);
        const lastDay = new Date(monthDate.getFullYear(), monthDate.getMonth() + 1, 0);
        const startPadding = firstDay.getDay();

        // Add padding days
        for (let i = 0; i < startPadding; i++) {
            const emptyDay = document.createElement('div');
            emptyDay.className = 'calendar-day';
            grid.appendChild(emptyDay);
        }

        // Add actual days
        for (let day = 1; day <= lastDay.getDate(); day++) {
            const dayDate = new Date(monthDate.getFullYear(), monthDate.getMonth(), day);
            const dayEl = this.createDayElement(dayDate, day);
            grid.appendChild(dayEl);
        }

        monthContainer.appendChild(grid);
        return monthContainer;
    }

    createDayElement(date, dayNumber) {
        const dayEl = document.createElement('div');
        dayEl.className = 'calendar-day';

        const dayNum = document.createElement('div');
        dayNum.className = 'day-number';
        dayNum.textContent = dayNumber;

        const dayStatus = document.createElement('div');
        dayStatus.className = 'day-status';

        const dayTime = document.createElement('div');
        dayTime.className = 'day-time';

        // Check if before start date
        if (date < this.startDate) {
            dayEl.classList.add('before-start');
            dayStatus.textContent = 'Before Start';
        } else {
            // Check for active holidays first (check all holidays with priority)
            let holidayInfo = null;
            
            // Check holidays in order of priority (shortest duration first, or by preference)
            if (this.holidays) {
                // Check custom holidays first (highest priority)
                if (!holidayInfo && this.customHolidayManager && this.customHolidayManager.getInfoForDate) {
                    holidayInfo = this.customHolidayManager.getInfoForDate(date);
                }
                
                // Check Mother's Day (only if no other holiday is active)
                if (!holidayInfo && this.holidays.mothersDay && this.holidays.mothersDay.getInfoForDate) {
                    holidayInfo = this.holidays.mothersDay.getInfoForDate(date);
                }
                
                // Check Father's Day (only if no other holiday is active)
                if (!holidayInfo && this.holidays.fathersDay && this.holidays.fathersDay.getInfoForDate) {
                    holidayInfo = this.holidays.fathersDay.getInfoForDate(date);
                }
                
                // Check Spring Break
                if (!holidayInfo && this.holidays.springBreak && this.holidays.springBreak.getInfoForDate) {
                    holidayInfo = this.holidays.springBreak.getInfoForDate(date);
                }
                
                // Check Easter Break (only if no other holiday is active)
                if (!holidayInfo && this.holidays.easterBreak && this.holidays.easterBreak.getInfoForDate) {
                    holidayInfo = this.holidays.easterBreak.getInfoForDate(date);
                }
                
                // Check Memorial Day Break (only if no other holiday is active)
                if (!holidayInfo && this.holidays.memorialDayBreak && this.holidays.memorialDayBreak.getInfoForDate) {
                    holidayInfo = this.holidays.memorialDayBreak.getInfoForDate(date);
                }
                
                // Check Independence Day (only if no other holiday is active)
                if (!holidayInfo && this.holidays.independenceDay && this.holidays.independenceDay.getInfoForDate) {
                    holidayInfo = this.holidays.independenceDay.getInfoForDate(date);
                }
                
                // Check Summer Break (only if no other holiday is active)
                if (!holidayInfo && this.holidays.summerBreak && this.holidays.summerBreak.getInfoForDate) {
                    holidayInfo = this.holidays.summerBreak.getInfoForDate(date);
                }
                
                // Check Thanksgiving Break (only if no other holiday is active)
                if (!holidayInfo && this.holidays.thanksgivingBreak && this.holidays.thanksgivingBreak.getInfoForDate) {
                    holidayInfo = this.holidays.thanksgivingBreak.getInfoForDate(date);
                }
                
                // Check Christmas Break (only if no other holiday is active)
                if (!holidayInfo && this.holidays.christmasBreak && this.holidays.christmasBreak.getInfoForDate) {
                    holidayInfo = this.holidays.christmasBreak.getInfoForDate(date);
                }
            }
            
            if (holidayInfo) {
                // Holiday is active for this date
                dayStatus.textContent = holidayInfo.statusText;
                
                if (holidayInfo.time) {
                    dayTime.textContent = this.formatTime(holidayInfo.time);
                }
                
                // Add holiday icon
                const holidayIcon = document.createElement('div');
                holidayIcon.textContent = holidayInfo.icon;
                holidayIcon.style.fontSize = '12px';
                holidayIcon.style.position = 'absolute';
                holidayIcon.style.top = '2px';
                holidayIcon.style.right = '2px';
                dayEl.appendChild(holidayIcon);
                
                // Apply holiday color class
                dayEl.classList.add(holidayInfo.colorClass);
            } else {
                // Regular schedule
                const scheduleInfo = this.getScheduleForDate(date);
                const statusText = this.getStatusDisplayText(scheduleInfo.status);
                dayStatus.textContent = statusText;

                if (scheduleInfo.status.includes('-->')) {
                    dayTime.textContent = this.formatTime(scheduleInfo.time);
                }

                // Apply regular color classes
                if (scheduleInfo.status === 'Cx with Fx') {
                    dayEl.classList.add('father-day');
                } else if (scheduleInfo.status === 'Cx with Mx') {
                    dayEl.classList.add('mother-day');
                } else if (scheduleInfo.status === 'Cx --> Fx') {
                    dayEl.classList.add('exchange-to-father');
                } else if (scheduleInfo.status === 'Cx --> Mx') {
                    dayEl.classList.add('exchange-to-mother');
                }
            }
        }

        dayEl.appendChild(dayNum);
        dayEl.appendChild(dayStatus);
        dayEl.appendChild(dayTime);

        return dayEl;
    }

    getScheduleForDate(date) {
        const daysSinceStart = Math.floor((date - this.startDate) / (1000 * 60 * 60 * 24));
        const scheduleIndex = daysSinceStart % 14;
        return this.regularSchedule[scheduleIndex];
    }

    getStatusDisplayText(status) {
        const statusMap = {
            'Cx with Fx': 'With Father',
            'Cx with Mx': 'With Mother',
            'Cx --> Fx': 'To Father',
            'Cx --> Mx': 'To Mother'
        };
        return statusMap[status] || status;
    }

    formatTime(time24) {
        const [hours, minutes] = time24.split(':');
        const hour = parseInt(hours);
        const ampm = hour >= 12 ? 'PM' : 'AM';
        const hour12 = hour % 12 || 12;
        return `${hour12}:${minutes} ${ampm}`;
    }

	updateOvernightStats() {
		const startDate = new Date(this.startDate);
		const endDate = new Date(startDate);
		endDate.setFullYear(startDate.getFullYear() + 1);
		
		let fatherNights = 0;
		let motherNights = 0;
		let holidayNights = 0;
		
		// For debugging
		let debugInfo = {
			regularFather: 0,
			regularMother: 0,
			holidayFather: 0,
			holidayMother: 0
		};
		
		const currentDate = new Date(startDate);
		
		while (currentDate < endDate) {
			// Check for holidays first
			let holidayInfo = null;
			
			if (this.holidays) {
				// Check all holidays in priority order
				if (!holidayInfo && this.customHolidayManager) {
					holidayInfo = this.customHolidayManager.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.mothersDay) {
					holidayInfo = this.holidays.mothersDay.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.fathersDay) {
					holidayInfo = this.holidays.fathersDay.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.springBreak) {
					holidayInfo = this.holidays.springBreak.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.easterBreak) {
					holidayInfo = this.holidays.easterBreak.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.memorialDayBreak) {
					holidayInfo = this.holidays.memorialDayBreak.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.independenceDay) {
					holidayInfo = this.holidays.independenceDay.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.summerBreak) {
					holidayInfo = this.holidays.summerBreak.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.thanksgivingBreak) {
					holidayInfo = this.holidays.thanksgivingBreak.getInfoForDate(currentDate);
				}
				if (!holidayInfo && this.holidays.christmasBreak) {
					holidayInfo = this.holidays.christmasBreak.getInfoForDate(currentDate);
				}
			}
			
			if (holidayInfo) {
				// Holiday day - determine parent from status
				holidayNights++;
				const statusText = holidayInfo.statusText || '';
				
				// Special case for vacation period summer
				if (holidayInfo.icon === '*') {
					// Use regular schedule
					const regularSchedule = this.getScheduleForDate(currentDate);
					if (regularSchedule.status.includes('Fx')) {
						fatherNights++;
						debugInfo.regularFather++;
					} else {
						motherNights++;
						debugInfo.regularMother++;
					}
				} else if (statusText.includes('With Father') || statusText.includes('To Father')) {
					fatherNights++;
					debugInfo.holidayFather++;
				} else if (statusText.includes('With Mother') || statusText.includes('To Mother')) {
					motherNights++;
					debugInfo.holidayMother++;
				} else if (statusText.includes('Custom Summer')) {
					// Handle custom summer
					if (this.holidays.summerBreak && this.holidays.summerBreak.config.type === 'custom') {
						const config = this.holidays.summerBreak.config;
						const summerStart = new Date(config.startDate);
						const daysSinceStart = Math.floor((currentDate - summerStart) / (1000 * 60 * 60 * 24));
						
						if (daysSinceStart < config.customOvernightsCount) {
							if (config.customOvernightsParent === 'Father') {
								fatherNights++;
								debugInfo.holidayFather++;
							} else {
								motherNights++;
								debugInfo.holidayMother++;
							}
						} else {
							if (config.customOvernightsParent === 'Father') {
								motherNights++;
								debugInfo.holidayMother++;
							} else {
								fatherNights++;
								debugInfo.holidayFather++;
							}
						}
					}
				}
			} else {
				// Regular schedule day
				const regularSchedule = this.getScheduleForDate(currentDate);
				if (regularSchedule.status.includes('Fx')) {
					fatherNights++;
					debugInfo.regularFather++;
				} else {
					motherNights++;
					debugInfo.regularMother++;
				}
			}
			
			currentDate.setDate(currentDate.getDate() + 1);
		}
		
		// Debug output
		console.log('Overnight calculation debug:', {
			totalDays: fatherNights + motherNights,
			fatherTotal: fatherNights,
			motherTotal: motherNights,
			holidayDays: holidayNights,
			breakdown: debugInfo
		});
		
		// Calculate percentages
		const totalNights = fatherNights + motherNights;
		const fatherPercent = totalNights > 0 ? Math.round((fatherNights / totalNights) * 100) : 0;
		const motherPercent = totalNights > 0 ? Math.round((motherNights / totalNights) * 100) : 0;
		
		// Update display
		const statsEl = document.getElementById('overnightStats');
		
		if (Math.abs(fatherPercent - motherPercent) <= 1) {
			statsEl.textContent = `Approx. Overnights: 50/50 Equal Timesharing (Father: ${fatherNights} days/year | Mother: ${motherNights} days/year)`;
		} else {
			statsEl.textContent = `Approx. Overnights: Father: ${fatherPercent}% (${fatherNights} days/year) | Mother: ${motherPercent}% (${motherNights} days/year)`;
		}
	}
}

// Initialize the application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TimesharingCalendar();
});