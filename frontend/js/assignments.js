// =====================================================
// HOMEWORK & ASSIGNMENTS MANAGER
// =====================================================

let currentAssignmentFilter = "all";

function setAssignmentFilter(filter) {
    currentAssignmentFilter = filter;

    const filterButtons = {
        all: "assign-filter-all",
        pending: "assign-filter-pending",
        completed: "assign-filter-completed",
        soon: "assign-filter-soon"
    };

    Object.keys(filterButtons).forEach(key => {
        const btn = document.getElementById(filterButtons[key]);
        if (btn) {
            btn.classList.toggle("active", key === filter);
        }
    });

    renderAssignmentsPage(filter);
}

function calculateDueDateDays(dateString) {
    if (!dateString) return null;
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const due = new Date(dateString);
    due.setHours(0, 0, 0, 0);
    const diffTime = due.getTime() - now.getTime();
    return Math.round(diffTime / (1000 * 60 * 60 * 24));
}

function getDueDateBadge(dateString, isCompleted = false) {
    if (isCompleted) {
        return { text: "Completed", className: "due-badge-done", days: 0 };
    }
    const days = calculateDueDateDays(dateString);
    if (days === null) {
        return { text: "No Date", className: "due-badge-normal", days: 999 };
    }

    if (days < 0) {
        const past = Math.abs(days);
        return {
            text: `Overdue by ${past} day${past > 1 ? "s" : ""}`,
            className: "due-badge-overdue",
            days: days
        };
    } else if (days === 0) {
        return { text: "Due Today", className: "due-badge-today", days: 0 };
    } else if (days === 1) {
        return { text: "Due Tomorrow", className: "due-badge-urgent", days: 1 };
    } else if (days <= 3) {
        return { text: `Due in ${days} days`, className: "due-badge-soon", days: days };
    } else {
        const dateObj = new Date(dateString);
        const formatted = dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" });
        return { text: `Due ${formatted}`, className: "due-badge-normal", days: days };
    }
}

function renderAssignmentsPage(filter = currentAssignmentFilter) {
    const data = getMasterData();
    const assignments = Array.isArray(data.assignments) ? data.assignments : [];
    const container = document.getElementById("assignments-grid-container");

    // 1. Calculate KPI Metrics
    const totalCount = assignments.length;
    const completedCount = assignments.filter(a => a.status === "completed" || a.progress >= 100).length;
    const pendingCount = totalCount - completedCount;

    const dueSoonCount = assignments.filter(a => {
        if (a.status === "completed" || a.progress >= 100) return false;
        const days = calculateDueDateDays(a.dueDate);
        return days !== null && days <= 3;
    }).length;

    // Update KPI Stat Cards
    const totalEl = document.getElementById("assignment-stat-total");
    const pendingEl = document.getElementById("assignment-stat-pending");
    const completedEl = document.getElementById("assignment-stat-completed");
    const dueSoonEl = document.getElementById("assignment-stat-duesoon");

    if (totalEl) totalEl.textContent = totalCount;
    if (pendingEl) pendingEl.textContent = pendingCount;
    if (completedEl) completedEl.textContent = completedCount;
    if (dueSoonEl) dueSoonEl.textContent = dueSoonCount;

    // Update Filter Tab Count Badges
    const countAllEl = document.getElementById("assign-filter-count-all");
    const countPendingEl = document.getElementById("assign-filter-count-pending");
    const countDoneEl = document.getElementById("assign-filter-count-done");
    const countSoonEl = document.getElementById("assign-filter-count-soon");

    if (countAllEl) countAllEl.textContent = totalCount;
    if (countPendingEl) countPendingEl.textContent = pendingCount;
    if (countDoneEl) countDoneEl.textContent = completedCount;
    if (countSoonEl) countSoonEl.textContent = dueSoonCount;

    if (!container) return;

    // 2. Filter Assignments
    let filtered = assignments;
    if (filter === "pending") {
        filtered = assignments.filter(a => a.status !== "completed" && a.progress < 100);
    } else if (filter === "completed") {
        filtered = assignments.filter(a => a.status === "completed" || a.progress >= 100);
    } else if (filter === "soon") {
        filtered = assignments.filter(a => {
            if (a.status === "completed" || a.progress >= 100) return false;
            const days = calculateDueDateDays(a.dueDate);
            return days !== null && days <= 3;
        });
    }

    if (!filtered.length) {
        let emptyTitle = "No assignments found";
        let emptyDesc = "You're all caught up! Click below to create a new homework or project assignment.";
        if (filter === "completed") {
            emptyTitle = "No completed assignments yet";
            emptyDesc = "Finish pending assignments or mark them completed to see your achievements here.";
        } else if (filter === "soon") {
            emptyTitle = "No urgent deadlines!";
            emptyDesc = "Great job! None of your pending assignments have deadlines due within the next 3 days.";
        }

        container.innerHTML = `
            <div class="assignments-empty-state">
                <div class="empty-icon-wrap">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="m9 14 2 2 4-4"/></svg>
                </div>
                <h3>${emptyTitle}</h3>
                <p>${emptyDesc}</p>
                <button type="button" class="assignments-header-add-btn" onclick="openAssignmentModal()">
                    <span>+</span> Add Assignment
                </button>
            </div>
        `;
        return;
    }

    // 3. Render Cards
    container.innerHTML = filtered.map(item => {
        const isDone = item.status === "completed" || item.progress >= 100;
        const dueInfo = getDueDateBadge(item.dueDate, isDone);
        const priority = item.priority || "normal";
        const progressVal = typeof item.progress === "number" ? Math.min(100, Math.max(0, item.progress)) : (isDone ? 100 : 0);

        let priorityPill = `<span class="priority-pill priority-normal">Normal</span>`;
        if (priority === "urgent") {
            priorityPill = `<span class="priority-pill priority-urgent">Urgent</span>`;
        } else if (priority === "high") {
            priorityPill = `<span class="priority-pill priority-high">High</span>`;
        } else if (priority === "medium") {
            priorityPill = `<span class="priority-pill priority-medium">Medium</span>`;
        }

        // Color coding for progress bar
        let progressFillClass = "progress-fill-blue";
        if (isDone) progressFillClass = "progress-fill-green";
        else if (progressVal < 30) progressFillClass = "progress-fill-rose";
        else if (progressVal < 70) progressFillClass = "progress-fill-amber";

        return `
            <div class="assignment-card ${isDone ? "is-completed" : ""}" id="assignment-card-${item.id}">
                <!-- Card Header -->
                <div class="assign-card-header">
                    <div class="assign-card-tags">
                        <span class="assign-subject-tag">${escapeSubjectHTML(item.subject || "General")}</span>
                        <span class="assign-type-pill">${escapeSubjectHTML(item.type || "Homework")}</span>
                        ${priorityPill}
                    </div>

                    <button 
                        type="button" 
                        class="assign-quick-check-btn ${isDone ? "checked" : ""}" 
                        onclick="toggleAssignmentStatus('${item.id}')"
                        title="${isDone ? "Mark as In Progress" : "Mark as Completed"}"
                    >
                        ${isDone 
                            ? `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>` 
                            : `<span class="check-circle-empty"></span>`
                        }
                    </button>
                </div>

                <!-- Title & Due Date -->
                <div class="assign-card-body">
                    <h3 class="assign-card-title ${isDone ? "title-done" : ""}">${escapeSubjectHTML(item.title)}</h3>
                    
                    <div class="assign-due-row">
                        <span class="assign-due-tag ${dueInfo.className}">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            ${dueInfo.text}
                        </span>
                        <span class="assign-due-date-raw">${item.dueDate || "No date set"}</span>
                    </div>

                    ${item.notes ? `<p class="assign-card-notes">${escapeSubjectHTML(item.notes)}</p>` : ""}
                </div>

                <!-- Progress Section -->
                <div class="assign-progress-section">
                    <div class="assign-prog-label-row">
                        <span class="assign-prog-label">Progress</span>
                        <div class="assign-prog-val-wrap">
                            <span class="assign-prog-val">${progressVal}%</span>
                            <span class="assign-status-text ${isDone ? "status-done" : "status-active"}">
                                ${isDone ? "Completed" : "In Progress"}
                            </span>
                        </div>
                    </div>

                    <div class="assign-prog-bar-track">
                        <div class="assign-prog-bar-fill ${progressFillClass}" style="width: ${progressVal}%;"></div>
                    </div>

                    <!-- Inline Quick Progress Steppers -->
                    <div class="assign-prog-steppers">
                        <button type="button" class="prog-step-btn" onclick="updateAssignmentProgress('${item.id}', -20)" title="Decrease progress 20%">-20%</button>
                        <button type="button" class="prog-step-btn" onclick="updateAssignmentProgress('${item.id}', 20)" title="Increase progress 20%">+20%</button>
                        <button type="button" class="prog-step-btn full-btn" onclick="updateAssignmentProgress('${item.id}', 100)" title="Set to 100%">100%</button>
                    </div>
                </div>

                <!-- Card Actions -->
                <div class="assign-card-footer">
                    <button 
                        type="button" 
                        class="assign-action-btn alpha-btn" 
                        onclick="askAlphaAssignmentHelp('${item.id}')"
                        title="Ask Alpha for assistance or guidance on this assignment"
                    >
                        <span>α</span> Ask Alpha
                    </button>

                    <div class="assign-footer-right">
                        <button 
                            type="button" 
                            class="assign-action-btn edit-btn" 
                            onclick="openAssignmentModal('${item.id}')"
                            title="Edit assignment details"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                            Edit
                        </button>
                        <button 
                            type="button" 
                            class="assign-action-btn delete-btn" 
                            onclick="deleteAssignment('${item.id}')"
                            title="Delete assignment"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join("");
}

function populateAssignmentSubjectDropdown(selectedSubject = "") {
    const select = document.getElementById("assignment-subject-select");
    if (!select) return;

    const data = getMasterData();
    const subjects = Array.isArray(data.subjects) ? data.subjects : [];

    let optionsHtml = "";
    if (subjects.length === 0) {
        optionsHtml = `<option value="General Study">General Study</option>`;
    } else {
        subjects.forEach(sub => {
            const isSel = sub.name === selectedSubject ? "selected" : "";
            optionsHtml += `<option value="${escapeSubjectHTML(sub.name)}" ${isSel}>${escapeSubjectHTML(sub.name)}</option>`;
        });
        optionsHtml += `<option value="General & Other" ${selectedSubject === "General & Other" ? "selected" : ""}>General &amp; Other</option>`;
    }

    select.innerHTML = optionsHtml;
}

function openAssignmentModal(assignmentId = null) {
    const modal = document.getElementById("assignment-modal");
    if (!modal) return;

    const idInput = document.getElementById("assignment-edit-id");
    const titleInput = document.getElementById("assignment-title-input");
    const typeSelect = document.getElementById("assignment-type-select");
    const dateInput = document.getElementById("assignment-due-date-input");
    const prioritySelect = document.getElementById("assignment-priority-select");
    const progressSlider = document.getElementById("assignment-progress-slider");
    const progressDisplay = document.getElementById("assignment-progress-val-display");
    const notesInput = document.getElementById("assignment-notes-input");
    const modalTitle = document.getElementById("assignment-modal-title");
    const modalBadge = document.getElementById("assignment-modal-badge");
    const submitBtn = document.getElementById("assignment-submit-btn");

    const data = getMasterData();
    const assignments = Array.isArray(data.assignments) ? data.assignments : [];

    if (assignmentId) {
        const item = assignments.find(a => a.id === assignmentId);
        if (!item) return;

        if (idInput) idInput.value = item.id;
        if (titleInput) titleInput.value = item.title || "";
        populateAssignmentSubjectDropdown(item.subject || "");
        if (typeSelect) typeSelect.value = item.type || "Homework";
        if (dateInput) dateInput.value = item.dueDate || "";
        if (prioritySelect) prioritySelect.value = item.priority || "normal";
        if (progressSlider) progressSlider.value = typeof item.progress === "number" ? item.progress : 0;
        if (progressDisplay) progressDisplay.textContent = `${progressSlider ? progressSlider.value : 0}%`;
        if (notesInput) notesInput.value = item.notes || "";

        if (modalTitle) modalTitle.textContent = "Edit Assignment";
        if (modalBadge) modalBadge.textContent = "UPDATE TASK";
        if (submitBtn) submitBtn.textContent = "Update Assignment";
    } else {
        if (idInput) idInput.value = "";
        if (titleInput) titleInput.value = "";
        populateAssignmentSubjectDropdown();
        if (typeSelect) typeSelect.value = "Homework";
        // Default due date: tomorrow
        const tomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString().split("T")[0];
        if (dateInput) dateInput.value = tomorrow;
        if (prioritySelect) prioritySelect.value = "normal";
        if (progressSlider) progressSlider.value = 0;
        if (progressDisplay) progressDisplay.textContent = "0%";
        if (notesInput) notesInput.value = "";

        if (modalTitle) modalTitle.textContent = "Add Assignment";
        if (modalBadge) modalBadge.textContent = "TASK & DEADLINE";
        if (submitBtn) submitBtn.textContent = "Save Assignment";
    }

    modal.classList.add("active");
    modal.style.display = "flex";
    if (titleInput) {
        setTimeout(() => titleInput.focus(), 100);
    }
}

function closeAssignmentModal() {
    const modal = document.getElementById("assignment-modal");
    if (!modal) return;
    modal.classList.remove("active");
    modal.style.display = "none";
}

function handleSaveAssignment(event) {
    if (event) event.preventDefault();

    const idInput = document.getElementById("assignment-edit-id");
    const titleInput = document.getElementById("assignment-title-input");
    const subjectSelect = document.getElementById("assignment-subject-select");
    const typeSelect = document.getElementById("assignment-type-select");
    const dateInput = document.getElementById("assignment-due-date-input");
    const prioritySelect = document.getElementById("assignment-priority-select");
    const progressSlider = document.getElementById("assignment-progress-slider");
    const notesInput = document.getElementById("assignment-notes-input");

    const title = titleInput ? titleInput.value.trim() : "";
    if (!title) {
        showToast("Please enter an assignment title.");
        if (titleInput) titleInput.focus();
        return;
    }

    const editId = idInput ? idInput.value.trim() : "";
    const subject = subjectSelect ? subjectSelect.value : "General";
    const type = typeSelect ? typeSelect.value : "Homework";
    const dueDate = dateInput ? dateInput.value : "";
    const priority = prioritySelect ? prioritySelect.value : "normal";
    const progress = progressSlider ? parseInt(progressSlider.value, 10) : 0;
    const notes = notesInput ? notesInput.value.trim() : "";
    const status = progress >= 100 ? "completed" : "pending";

    const data = getMasterData();
    if (!Array.isArray(data.assignments)) {
        data.assignments = [];
    }

    if (editId) {
        const index = data.assignments.findIndex(a => a.id === editId);
        if (index !== -1) {
            data.assignments[index] = {
                ...data.assignments[index],
                title,
                subject,
                type,
                dueDate,
                priority,
                progress,
                status,
                notes,
                updatedAt: new Date().toISOString()
            };
            showToast("Assignment updated successfully!");
        }
    } else {
        const newAssignment = {
            id: "assign_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            title,
            subject,
            type,
            dueDate,
            priority,
            progress,
            status,
            notes,
            createdAt: new Date().toISOString()
        };
        data.assignments.unshift(newAssignment);
        showToast("New assignment added!");
    }

    saveMasterData(data);
    closeAssignmentModal();
    renderAssignmentsPage();
}

function toggleAssignmentStatus(assignmentId) {
    const data = getMasterData();
    if (!Array.isArray(data.assignments)) return;

    const item = data.assignments.find(a => a.id === assignmentId);
    if (!item) return;

    const isDone = item.status === "completed" || item.progress >= 100;
    if (isDone) {
        item.status = "pending";
        item.progress = item.progress === 100 ? 50 : item.progress;
        showToast(`Marked "${item.title}" as In Progress`);
    } else {
        item.status = "completed";
        item.progress = 100;
        showToast(`🎉 "${item.title}" marked as Completed!`);
    }

    item.updatedAt = new Date().toISOString();
    saveMasterData(data);
    renderAssignmentsPage();
}

function updateAssignmentProgress(assignmentId, deltaOrValue) {
    const data = getMasterData();
    if (!Array.isArray(data.assignments)) return;

    const item = data.assignments.find(a => a.id === assignmentId);
    if (!item) return;

    let currentVal = typeof item.progress === "number" ? item.progress : 0;
    let nextVal = currentVal;

    if (deltaOrValue === 100) {
        nextVal = 100;
    } else {
        nextVal = Math.min(100, Math.max(0, currentVal + deltaOrValue));
    }

    item.progress = nextVal;
    item.status = nextVal >= 100 ? "completed" : "pending";
    item.updatedAt = new Date().toISOString();

    saveMasterData(data);
    renderAssignmentsPage();
    showToast(`Progress updated to ${nextVal}%`);
}

function deleteAssignment(assignmentId) {
    const data = getMasterData();
    if (!Array.isArray(data.assignments)) return;

    const item = data.assignments.find(a => a.id === assignmentId);
    const title = item ? item.title : "Assignment";

    data.assignments = data.assignments.filter(a => a.id !== assignmentId);
    saveMasterData(data);
    renderAssignmentsPage();
    showToast(`Deleted "${title}".`);
}

function askAlphaAssignmentHelp(assignmentId) {
    const data = getMasterData();
    const item = (data.assignments || []).find(a => a.id === assignmentId);
    if (!item) return;

    const prompt = `Hi Alpha! I need help with my ${item.type || 'assignment'}: "${item.title}" for ${item.subject || 'my subject'}.${item.notes ? ` Here are the assignment notes: "${item.notes}".` : ''} Can you help me break down the steps, explain the core concepts, and guide me on how to approach this task effectively?`;

    showPage("chat");

    const chatInput = document.getElementById("message");
    if (chatInput) {
        chatInput.value = prompt;
        chatInput.focus();
        if (typeof autoResizeTextarea === "function") {
            autoResizeTextarea(chatInput);
        }
    }

    showToast(`Loaded "${item.title}" into Alpha Chat!`);
}

// Close assignment modal on backdrop click
document.addEventListener("DOMContentLoaded", () => {
    const assignModal = document.getElementById("assignment-modal");
    if (assignModal) {
        assignModal.addEventListener("click", (e) => {
            if (e.target === assignModal) {
                closeAssignmentModal();
            }
        });
    }
});