class CustomHolidayManager {
    constructor() {
        this.customHolidays = new Map(); // Use Map to store holidays by ID
        this.maxHolidays = 6;
        this.currentEditingId = null;
        this.currentEditingHoliday = null; // Store the current holiday being edited
        this.initializeModal();
        this.bindEvents();
    }

    initializeModal() {
        // Modal should already exist in HTML, but we'll set up the content
        const modal = document.getElementById('customHolidayModal');
        if (!modal) {
            console.error('Custom holiday modal not found in HTML');
            return;
        }
    }

    bindEvents() {
        // Add Holiday button
        const addHolidayBtn = document.getElementById('addCustomHoliday');
        const addNewHolidayBtn = document.getElementById('addNewHolidayBtn');
        
        if (addHolidayBtn) {
            addHolidayBtn.addEventListener('click', () => {
                this.openAddHolidayModal();
            });
        }
        
        if (addNewHolidayBtn) {
            addNewHolidayBtn.addEventListener('click', () => {
                this.openAddHolidayModal();
            });
        }

        // Modal buttons
        const saveBtn = document.getElementById('saveCustomHoliday');
        const deleteBtn = document.getElementById('deleteCustomHoliday');
        const cancelBtn = document.getElementById('cancelCustomHoliday');
        const closeBtn = document.getElementById('closeModal');
        const modal = document.getElementById('customHolidayModal');

        if (saveBtn) {
            saveBtn.addEventListener('click', () => {
                this.saveCustomHoliday();
            });
        }

        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
                this.deleteCustomHoliday();
            });
        }

        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => {
                this.closeModal();
            });
        }

        // Close modal when clicking outside
        if (modal) {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal();
                }
            });
        }
    }

    openAddHolidayModal() {
        if (this.customHolidays.size >= this.maxHolidays) {
            alert(`Maximum of ${this.maxHolidays} custom holidays allowed.`);
            return;
        }

        this.currentEditingId = null;
        const modalTitle = document.getElementById('modalTitle');
        const deleteBtn = document.getElementById('deleteCustomHoliday');
        
        if (modalTitle) modalTitle.textContent = 'Add New Holiday';
        if (deleteBtn) deleteBtn.style.display = 'none';
        
        // Create a temporary holiday for the form
        const tempHoliday = new CustomHoliday(this.getNextAvailableId());
        this.currentEditingHoliday = tempHoliday;
        
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = tempHoliday.generateModalForm();
            // Set up event listeners for the form, including notes button
            tempHoliday.setupModalEventListeners();
        }
        
        this.showModal();
    }

    openEditHolidayModal(holidayId) {
        const holiday = this.customHolidays.get(holidayId);
        if (!holiday) return;

        this.currentEditingId = holidayId;
        this.currentEditingHoliday = holiday;
        const modalTitle = document.getElementById('modalTitle');
        const deleteBtn = document.getElementById('deleteCustomHoliday');
        
        if (modalTitle) modalTitle.textContent = `Edit ${holiday.config.name}`;
        if (deleteBtn) deleteBtn.style.display = 'inline-block';
        
        const modalBody = document.getElementById('modalBody');
        if (modalBody) {
            modalBody.innerHTML = holiday.generateModalForm();
            // Set up event listeners for the form, including notes button
            holiday.setupModalEventListeners();
        }
        
        this.showModal();
    }

    showModal() {
        const modal = document.getElementById('customHolidayModal');
        if (modal) {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scrolling
        }
    }

    closeModal() {
        const modal = document.getElementById('customHolidayModal');
        if (modal) {
            modal.style.display = 'none';
            document.body.style.overflow = ''; // Restore scrolling
        }
        this.currentEditingId = null;
        this.currentEditingHoliday = null;
    }

    saveCustomHoliday() {
        const nameEl = document.getElementById('customName');
        const observedEl = document.getElementById('customObserved');
        const startDateEl = document.getElementById('customStartDate');
        const endDateEl = document.getElementById('customEndDate');

        // Validation
        if (!nameEl || !nameEl.value.trim()) {
            alert('Please enter a holiday name.');
            return;
        }

        if (!startDateEl || !startDateEl.value) {
            alert('Please select a start date.');
            return;
        }

        if (!endDateEl || !endDateEl.value) {
            alert('Please select an end date.');
            return;
        }

        const startDate = new Date(startDateEl.value);
        const endDate = new Date(endDateEl.value);

        if (endDate < startDate) {
            alert('End date must be after start date.');
            return;
        }

        // Check for name conflicts (except current editing holiday)
        const name = nameEl.value.trim();
        for (let [id, holiday] of this.customHolidays) {
            if (id !== this.currentEditingId && holiday.config.name === name) {
                alert('A holiday with this name already exists.');
                return;
            }
        }

        let holiday;
        if (this.currentEditingId) {
            // Editing existing holiday
            holiday = this.customHolidays.get(this.currentEditingId);
            holiday.updateFromModal();
        } else {
            // Creating new holiday
            const id = this.getNextAvailableId();
            holiday = new CustomHoliday(id);
            holiday.updateFromModal();
            this.customHolidays.set(id, holiday);
        }

        this.updateCustomHolidaysList();
        this.closeModal();
        
        // Notify main calendar to update
        if (window.timesharingCalendar && window.timesharingCalendar.generateCalendar) {
            window.timesharingCalendar.generateCalendar();
        }
        
        // Update overnight statistics
        if (window.timesharingCalendar && window.timesharingCalendar.updateOvernightStats) {
            window.timesharingCalendar.updateOvernightStats();
        }
    }

    deleteCustomHoliday() {
        if (!this.currentEditingId) return;

        const holiday = this.customHolidays.get(this.currentEditingId);
        if (!holiday) return;

        if (confirm(`Are you sure you want to delete "${holiday.config.name}"?`)) {
            this.customHolidays.delete(this.currentEditingId);
            this.updateCustomHolidaysList();
            this.closeModal();
            
            // Notify main calendar to update
            if (window.timesharingCalendar && window.timesharingCalendar.generateCalendar) {
                window.timesharingCalendar.generateCalendar();
            }
            
            // Update overnight statistics
            if (window.timesharingCalendar && window.timesharingCalendar.updateOvernightStats) {
                window.timesharingCalendar.updateOvernightStats();
            }
        }
    }

    updateCustomHolidaysList() {
        const container = document.getElementById('customHolidaysList');
        if (!container) return;

        container.innerHTML = '';

        if (this.customHolidays.size === 0) {
            container.innerHTML = '<p style="color: #6b7280; font-style: italic;">No custom holidays created yet.</p>';
            return;
        }

        for (let [id, holiday] of this.customHolidays) {
            const holidayItem = document.createElement('div');
            holidayItem.className = 'custom-holiday-item';
            holidayItem.style.cursor = 'pointer';
            
            const statusIndicator = holiday.config.observed ? '✅' : '❌';
            const statusText = holiday.config.observed ? 'Active' : 'Inactive';
            const hasNotes = holiday.config.additionalNotes && holiday.config.additionalNotes.trim() !== '';
            const notesIndicator = hasNotes ? ' 📝' : '';
            
            let dateRange = '';
            if (holiday.config.startDate && holiday.config.endDate) {
                const startDateStr = holiday.config.startDate.toLocaleDateString();
                const endDateStr = holiday.config.endDate.toLocaleDateString();
                if (startDateStr === endDateStr) {
                    dateRange = startDateStr;
                } else {
                    dateRange = `${startDateStr} - ${endDateStr}`;
                }
            }

            holidayItem.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <div class="custom-holiday-name">${statusIndicator} ${holiday.config.name}${notesIndicator}</div>
                        <div class="custom-holiday-dates">${dateRange} • ${statusText}</div>
                    </div>
                    <div style="font-size: 18px;">🎯</div>
                </div>
            `;

            holidayItem.addEventListener('click', () => {
                this.openEditHolidayModal(id);
            });

            container.appendChild(holidayItem);
        }
    }

    getNextAvailableId() {
        for (let i = 1; i <= this.maxHolidays; i++) {
            if (!this.customHolidays.has(i)) {
                return i;
            }
        }
        return null;
    }

    // Get holiday info for a specific date
    getInfoForDate(date) {
        for (let [id, holiday] of this.customHolidays) {
            const info = holiday.getInfoForDate(date);
            if (info) {
                return info; // Return first matching holiday
            }
        }
        return null;
    }

    // Export/Import for save/load functionality
    exportConfig() {
        const config = {};
        for (let [id, holiday] of this.customHolidays) {
            config[id] = holiday.exportConfig();
        }
        return config;
    }

    importConfig(configData) {
        if (!configData) return;
        
        this.customHolidays.clear();
        
        for (let [id, holidayConfig] of Object.entries(configData)) {
            const holiday = new CustomHoliday(parseInt(id));
            holiday.importConfig(holidayConfig);
            this.customHolidays.set(parseInt(id), holiday);
        }
        
        this.updateCustomHolidaysList();
    }

    // Initialize the custom holidays list when the tab is first shown
    initializeTab() {
        this.updateCustomHolidaysList();
    }
}