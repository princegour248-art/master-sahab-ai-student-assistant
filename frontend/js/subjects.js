// =====================================================
// RENDER SUBJECTS
// =====================================================

function renderSubjects(searchText = "") {

    const container =
        document.getElementById(
            "subjects-container"
        );


    const empty =
        document.getElementById(
            "subjects-empty"
        );


    const count =
        document.getElementById(
            "subject-total-count"
        );


    if (!container) {
        return;
    }


    const data =
        getMasterData();


    // Update progress

    data.subjects.forEach(subject => {

        subject.progress =
            calculateSubjectProgress(
                subject
            );

    });


    saveMasterData(data);


    const query =
        searchText
            .trim()
            .toLowerCase();


    const subjects =
        data.subjects.filter(subject => {

            return String(
                subject.name || ""
            )
                .toLowerCase()
                .includes(query);

        });


    if (count) {

        count.textContent =
            data.subjects.length;
    }


    if (!subjects.length) {

        container.innerHTML = "";


        if (empty) {
            empty.style.display =
                "block";
        }


        return;
    }


    if (empty) {
        empty.style.display =
            "none";
    }


    container.innerHTML =
        subjects
            .map(subject => {

                const topicCount =
                    subject.topics?.length ||
                    0;


                const syllabusCount =
                    subject.syllabus?.length ||
                    0;


                const progress =
                    calculateSubjectProgress(
                        subject
                    );


                return `

                    <div
                        class="enhanced-subject-card"
                        onclick="openSubjectDetails('${subject.id}')"
                        role="button"
                        tabindex="0"
                        aria-label="View details for ${escapeSubjectHTML(subject.name)}"
                        onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();openSubjectDetails('${subject.id}');}"
                    >

                        <div class="enhanced-subject-top">

                            <div class="enhanced-subject-icon">
                                ${getSubjectIconSVG(subject.name, subject.icon, 24)}
                            </div>


                            <div class="enhanced-subject-info">

                                <h3>
                                    ${escapeSubjectHTML(
                                        subject.name
                                    )}
                                </h3>

                                <p>
                                    ${escapeSubjectHTML(
                                        subject.description ||
                                        "Click to view syllabus, topics and study materials."
                                    )}
                                </p>

                            </div>


                            <div class="subject-menu">

                                <button
                                    type="button"
                                    title="Edit Subject"
                                    onclick="event.stopPropagation(); editSubject('${subject.id}')">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                                </button>


                                <button
                                    type="button"
                                    class="delete-subject"
                                    title="Delete Subject"
                                    onclick="event.stopPropagation(); deleteSubject('${subject.id}')">
                                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                </button>

                            </div>

                        </div>


                        <div class="subject-progress-section">

                            <div class="subject-progress-top">

                                <span>
                                    Study Progress
                                </span>

                                <strong>
                                    ${progress}%
                                </strong>

                            </div>


                            <div class="subject-progress-bar">

                                <span
                                    style="width:${progress}%">
                                </span>

                            </div>

                        </div>


                        <div class="subject-card-footer">

                            <div class="subject-card-stat">

                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
                                <strong>
                                    ${syllabusCount}
                                </strong>
                                Units

                                &nbsp;•&nbsp;

                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                                <strong>
                                    ${topicCount}
                                </strong>
                                Topics

                            </div>


                            <button
                                type="button"
                                class="open-subject-btn"
                                onclick="event.stopPropagation(); openSubjectDetails('${subject.id}')">

                                <span>View Details</span><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" style="margin-left: 4px; vertical-align: -1px;"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>

                            </button>

                        </div>

                    </div>

                `;

            })
            .join("");
}


// =====================================================
// SEARCH SUBJECTS
// =====================================================

function searchSubjects() {

    const input =
        document.getElementById(
            "subject-search"
        );


    renderSubjects(
        input
            ? input.value
            : ""
    );
}


// =====================================================
// OPEN SUBJECT MODAL
// =====================================================

function openSubjectModal(subject = null) {

    const modal =
        document.getElementById(
            "subject-modal"
        );


    if (!modal) {
        return;
    }


    editingSubjectId =
        subject
            ? subject.id
            : null;


    const title =
        document.getElementById(
            "subject-modal-title"
        );


    const badge =
        document.getElementById(
            "subject-modal-badge"
        );


    const name =
        document.getElementById(
            "subject-name-input"
        );


    const icon =
        document.getElementById(
            "subject-icon-input"
        );


    const description =
        document.getElementById(
            "subject-description-input"
        );


    const syllabus =
        document.getElementById(
            "syllabus-input-list"
        );


    const topics =
        document.getElementById(
            "topic-input-list"
        );


    if (
        !title ||
        !badge ||
        !name ||
        !icon ||
        !description ||
        !syllabus ||
        !topics
    ) {
        console.error(
            "Subject modal elements missing."
        );

        return;
    }


    if (subject) {

        title.textContent =
            "Edit Subject";


        badge.textContent =
            "EDIT SUBJECT";


        name.value =
            subject.name || "";


        icon.value =
            subject.icon || "📚";


        description.value =
            subject.description || "";


        syllabus.innerHTML =
            "";


        (subject.syllabus || [])
            .forEach(item => {

                addSyllabusInput(item);

            });


        topics.innerHTML =
            "";


        (subject.topics || [])
            .forEach(item => {

                addTopicInput(
                    item.name
                );

            });

    } else {

        title.textContent =
            "Add Subject";


        badge.textContent =
            "NEW SUBJECT";


        name.value =
            "";


        icon.value =
            "📚";


        description.value =
            "";


        syllabus.innerHTML =
            "";


        topics.innerHTML =
            "";


        addSyllabusInput();

        addTopicInput();
    }

    selectSubjectIcon(icon.value || "📚");

    modal.classList.add("show");


    setTimeout(() => {

        name.focus();

    }, 100);
}


// =====================================================
// CLOSE SUBJECT MODAL
// =====================================================

function closeSubjectModal() {

    const modal =
        document.getElementById(
            "subject-modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );
    }


    editingSubjectId =
        null;
}


// =====================================================
// SELECT SUBJECT ICON
// =====================================================

function selectSubjectIcon(icon, btnElement = null) {

    const input =
        document.getElementById(
            "subject-icon-input"
        );


    if (input) {

        input.value =
            icon;
    }

    document.querySelectorAll(".icon-picker button").forEach(btn => {
        btn.classList.remove("active");
    });

    if (btnElement) {
        btnElement.classList.add("active");
    } else {
        const targetBtn = document.querySelector(`.icon-picker button[data-icon="${icon}"]`);
        if (targetBtn) {
            targetBtn.classList.add("active");
        }
    }
}


// =====================================================
// ADD SYLLABUS INPUT
// =====================================================

function addSyllabusInput(value = "") {

    const container =
        document.getElementById(
            "syllabus-input-list"
        );


    if (!container) {
        return;
    }


    const row =
        document.createElement("div");


    row.className =
        "dynamic-input-row";


    row.innerHTML = `

        <input
            type="text"
            placeholder="Example: Unit 1 - Java Basics"
            value="${escapeSubjectHTML(value)}"
        >


        <button
            type="button"
            class="remove-input-btn"
            onclick="this.parentElement.remove()">

            ×

        </button>

    `;


    container.appendChild(row);
}


// =====================================================
// ADD TOPIC INPUT
// =====================================================

function addTopicInput(value = "") {

    const container =
        document.getElementById(
            "topic-input-list"
        );


    if (!container) {
        return;
    }


    const row =
        document.createElement("div");


    row.className =
        "dynamic-input-row";


    row.innerHTML = `

        <input
            type="text"
            placeholder="Example: Classes and Objects"
            value="${escapeSubjectHTML(value)}"
        >


        <button
            type="button"
            class="remove-input-btn"
            onclick="this.parentElement.remove()">

            ×

        </button>

    `;


    container.appendChild(row);
}


// =====================================================
// SAVE SUBJECT
// =====================================================

function saveSubject() {

    const nameInput =
        document.getElementById(
            "subject-name-input"
        );


    const iconInput =
        document.getElementById(
            "subject-icon-input"
        );


    const descriptionInput =
        document.getElementById(
            "subject-description-input"
        );


    if (
        !nameInput ||
        !iconInput ||
        !descriptionInput
    ) {
        console.error(
            "Subject form elements missing."
        );

        return;
    }


    const name =
        nameInput.value.trim();


    const icon =
        iconInput.value ||
        "📚";


    const description =
        descriptionInput.value.trim();


    if (!name) {

        alert(
            "Please enter subject name."
        );

        return;
    }


    // Syllabus

    const syllabusInputs =
        document.querySelectorAll(
            "#syllabus-input-list input"
        );


    const syllabus = [];


    syllabusInputs.forEach(input => {

        const value =
            input.value.trim();


        if (value) {
            syllabus.push(value);
        }

    });


    // Topics

    const topicInputs =
        document.querySelectorAll(
            "#topic-input-list input"
        );


    const topicNames = [];


    topicInputs.forEach(input => {

        const value =
            input.value.trim();


        if (value) {
            topicNames.push(value);
        }

    });


    const data =
        getMasterData();


    // Edit

    if (editingSubjectId) {

        const subject =
            data.subjects.find(
                item =>
                    item.id ===
                    editingSubjectId
            );


        if (!subject) {
            return;
        }


        const oldTopics =
            subject.topics || [];


        subject.name =
            name;


        subject.icon =
            icon;


        subject.description =
            description;


        subject.syllabus =
            syllabus;


        subject.topics =
            topicNames.map(
                topicName => {

                    const oldTopic =
                        oldTopics.find(
                            topic =>
                                topic.name ===
                                topicName
                        );


                    return {

                        id:
                            oldTopic?.id ||
                            createSubjectId(),

                        name:
                            topicName,

                        completed:
                            oldTopic?.completed ||
                            false

                    };

                }
            );


        subject.progress =
            calculateSubjectProgress(
                subject
            );


    } else {

        // New subject

        const newSubject = {

            id:
                createSubjectId(),

            name:
                name,

            icon:
                icon,

            description:
                description,

            syllabus:
                syllabus,

            topics:
                topicNames.map(
                    topicName => ({

                        id:
                            createSubjectId(),

                        name:
                            topicName,

                        completed:
                            false

                    })
                ),

            progress:
                0,

            createdAt:
                new Date().toISOString()

        };


        data.subjects.push(
            newSubject
        );
    }


    saveMasterData(data);


    closeSubjectModal();


    renderSubjects();


    updateDashboardAfterSubjectChange();
}


// =====================================================
// EDIT SUBJECT
// =====================================================

function editSubject(subjectId) {

    const data =
        getMasterData();


    const subject =
        data.subjects.find(
            item =>
                item.id ===
                subjectId
        );


    if (!subject) {
        return;
    }


    openSubjectModal(subject);
}


// =====================================================
// DELETE SUBJECT
// =====================================================

function deleteSubject(subjectId) {

    const data =
        getMasterData();


    const subject =
        data.subjects.find(
            item =>
                item.id ===
                subjectId
        );


    if (!subject) {
        return;
    }


    const confirmed =
        confirm(
            `Delete "${subject.name}"?\n\nThis will remove its syllabus and topics too.`
        );


    if (!confirmed) {
        return;
    }


    data.subjects =
        data.subjects.filter(
            item =>
                item.id !==
                subjectId
        );


    saveMasterData(data);


    renderSubjects();


    updateDashboardAfterSubjectChange();
}


// =====================================================
// OPEN SUBJECT FROM DASHBOARD
// =====================================================

function openSubjectFromDashboard(subjectId) {
    showPage('subjects');
    setTimeout(() => {
        openSubjectDetails(subjectId);
    }, 80);
}


// =====================================================
// OPEN SUBJECT DETAILS MODAL (PROFESSIONAL POPUP BOX)
// =====================================================

function openSubjectDetails(subjectId) {

    const data =
        getMasterData();


    const subject =
        data.subjects.find(
            item =>
                item.id ===
                subjectId
        );


    if (!subject) {
        console.warn("Subject not found:", subjectId);
        return;
    }

    activeSubjectDetailsId = subjectId;

    const modal =
        document.getElementById(
            "subject-details-modal"
        );


    const container =
        document.getElementById(
            "subject-details-dynamic-wrapper"
        );


    if (!modal || !container) {
        return;
    }


    const topics = Array.isArray(subject.topics) ? subject.topics : [];
    const syllabus = Array.isArray(subject.syllabus) ? subject.syllabus : [];
    const materials = Array.isArray(subject.materials) ? subject.materials : [];

    const completedTopics = topics.filter(t => t.completed === true).length;
    const totalTopics = topics.length;
    const remainingTopics = Math.max(0, totalTopics - completedTopics);
    const progress = calculateSubjectProgress(subject);


    container.innerHTML = `
        <!-- Modal Header -->
        <div class="subject-modal-header">
            <div class="subject-modal-header-left">
                <span class="subject-modal-badge">
                    <span class="badge-dot"></span> SUBJECT OVERVIEW &amp; STUDY HUB
                </span>
                <h2 id="subject-details-modal-title" class="subject-modal-title">
                    <span class="subject-modal-header-icon">${getSubjectIconSVG(subject.name, subject.icon, 24)}</span>
                    ${escapeSubjectHTML(subject.name)}
                </h2>
            </div>
            <div class="subject-modal-header-actions">
                <button
                    type="button"
                    class="subject-header-btn"
                    onclick="openSubjectEditFromDetails('${subject.id}')"
                    title="Edit Subject Information"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    <span>Edit Subject</span>
                </button>
                <button
                    type="button"
                    class="modal-close"
                    onclick="closeSubjectDetails()"
                    title="Close details"
                    aria-label="Close"
                >
                    ×
                </button>
            </div>
        </div>

        <!-- Modal Body Scrollable -->
        <div class="subject-modal-body">

            <!-- Hero Overview Card -->
            <div class="subject-hero-card">
                <div class="subject-hero-top">
                    <div class="subject-hero-icon-wrap">
                        <span>${getSubjectIconSVG(subject.name, subject.icon, 36)}</span>
                    </div>
                    <div class="subject-hero-info">
                        <div class="subject-hero-title-row">
                            <h3>${escapeSubjectHTML(subject.name)}</h3>
                            <span class="subject-status-pill ${progress === 100 ? 'completed' : progress > 0 ? 'in-progress' : 'not-started'}">
                                ${progress === 100 ? '100% Mastered' : progress > 0 ? `${progress}% In Progress` : 'Ready to Start'}
                            </span>
                        </div>
                        <p class="subject-hero-desc">
                            ${escapeSubjectHTML(subject.description || "Track your curriculum, check off learning milestones, and keep your notes and AI tools organized in one place.")}
                        </p>
                    </div>
                </div>

                <!-- Quick Action Pills -->
                <div class="subject-quick-actions">
                    <button
                        type="button"
                        class="quick-action-pill quiz-pill"
                        onclick="startSubjectQuiz('${subject.id}')"
                        title="Practice AI quiz on ${escapeSubjectHTML(subject.name)}"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
                        <span>Practice AI Quiz</span>
                    </button>
                    <button
                        type="button"
                        class="quick-action-pill tutor-pill"
                        onclick="askSubjectDoubt('${subject.id}')"
                        title="Ask Alpha doubts about this subject"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                        <span>Ask Alpha</span>
                    </button>
                    <button
                        type="button"
                        class="quick-action-pill upload-pill"
                        onclick="triggerSubjectFileUpload('${subject.id}', 'pdf')"
                        title="Attach PDF notes"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="12" y1="18" x2="12" y2="12"/><line x1="9" y1="15" x2="15" y2="15"/></svg>
                        <span>+ Add PDF Notes</span>
                    </button>
                    <button
                        type="button"
                        class="quick-action-pill upload-pill"
                        onclick="triggerSubjectFileUpload('${subject.id}', 'image')"
                        title="Attach study diagrams"
                    >
                        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                        <span>+ Add Diagrams</span>
                    </button>
                </div>
            </div>

            <!-- Learning Progress & Stats Bar -->
            <div class="subject-stats-card">
                <div class="subject-progress-header">
                    <div class="progress-title-wrap">
                        <span class="progress-icon">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                        </span>
                        <span class="progress-label">Study Progress &amp; Mastery</span>
                    </div>
                    <span class="progress-percent-badge">${progress}% Complete</span>
                </div>
                <div class="subject-progress-track">
                    <div class="subject-progress-fill" style="width: ${progress}%;"></div>
                </div>

                <div class="subject-metric-grid">
                    <div class="metric-card">
                        <span class="metric-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/></svg>
                        </span>
                        <div class="metric-details">
                            <strong>${syllabus.length}</strong>
                            <span>Syllabus Units</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <span class="metric-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                        </span>
                        <div class="metric-details">
                            <strong>${totalTopics}</strong>
                            <span>Total Topics</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <span class="metric-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                        </span>
                        <div class="metric-details">
                            <strong>${completedTopics}</strong>
                            <span>Completed</span>
                        </div>
                    </div>
                    <div class="metric-card">
                        <span class="metric-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                        </span>
                        <div class="metric-details">
                            <strong>${remainingTopics}</strong>
                            <span>Remaining</span>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Two Column Section: Topics on Left, Syllabus on Right -->
            <div class="subject-details-grid">

                <!-- Left: Topics Checklist -->
                <div class="subject-panel-card">
                    <div class="panel-card-header">
                        <div class="panel-card-title">
                            <span class="panel-header-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
                            </span>
                            <div>
                                <h4>Topics &amp; Milestones</h4>
                                <p class="panel-card-subtitle">Check off topics as you study</p>
                            </div>
                        </div>
                        <span class="panel-count-tag">${completedTopics}/${totalTopics} Done</span>
                    </div>

                    <div class="subject-topics-list">
                        ${topics.length ? topics.map(topic => `
                            <label class="subject-topic-row ${topic.completed ? 'is-completed' : ''}">
                                <input
                                    type="checkbox"
                                    class="subject-topic-checkbox"
                                    ${topic.completed ? 'checked' : ''}
                                    onchange="toggleSubjectTopic('${subject.id}', '${topic.id}')"
                                />
                                <span class="topic-label-text">${escapeSubjectHTML(topic.name)}</span>
                                <span class="topic-state-badge ${topic.completed ? 'done' : 'todo'}">
                                    ${topic.completed ? 'Done' : 'Pending'}
                                </span>
                            </label>
                        `).join('') : `
                            <div class="panel-empty-state">
                                <span class="empty-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg></span>
                                <p>No topics added to this subject yet.</p>
                                <button type="button" class="btn-subtle" onclick="openSubjectEditFromDetails('${subject.id}')">
                                    + Add Topics
                                </button>
                            </div>
                        `}
                    </div>
                </div>

                <!-- Right: Syllabus Units -->
                <div class="subject-panel-card">
                    <div class="panel-card-header">
                        <div class="panel-card-title">
                            <span class="panel-header-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                            </span>
                            <div>
                                <h4>Syllabus &amp; Chapters</h4>
                                <p class="panel-card-subtitle">Course curriculum breakdown</p>
                            </div>
                        </div>
                        <span class="panel-count-tag">${syllabus.length} Units</span>
                    </div>

                    <div class="subject-syllabus-list">
                        ${syllabus.length ? syllabus.map((unit, index) => `
                            <div class="subject-syllabus-item">
                                <span class="syllabus-unit-badge">Unit ${index + 1}</span>
                                <span class="syllabus-unit-text">${escapeSubjectHTML(unit)}</span>
                            </div>
                        `).join('') : `
                            <div class="panel-empty-state">
                                <span class="empty-icon-wrap"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg></span>
                                <p>No syllabus units added yet.</p>
                                <button type="button" class="btn-subtle" onclick="openSubjectEditFromDetails('${subject.id}')">
                                    + Add Syllabus
                                </button>
                            </div>
                        `}
                    </div>
                </div>

            </div>

            <!-- Attached Study Materials Section -->
            <div class="subject-panel-card full-width">
                <div class="panel-card-header">
                    <div class="panel-card-title">
                        <span class="panel-header-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                        </span>
                        <div>
                            <h4>Study Materials &amp; Notes</h4>
                            <p class="panel-card-subtitle">PDFs, lecture notes, and study images</p>
                        </div>
                    </div>
                    <div class="panel-header-actions" style="display: flex; gap: 8px;">
                        <button
                            type="button"
                            class="material-upload-btn"
                            onclick="triggerSubjectFileUpload('${subject.id}', 'pdf')"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
                            <span>Upload PDF</span>
                        </button>
                        <button
                            type="button"
                            class="material-upload-btn"
                            onclick="triggerSubjectFileUpload('${subject.id}', 'image')"
                        >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                            <span>Upload Image</span>
                        </button>
                    </div>
                </div>

                <div class="subject-materials-container">
                    ${materials.length ? `
                        <div class="subject-materials-grid">
                            ${materials.map(mat => `
                                <div class="material-card-item">
                                    <div class="material-card-icon ${mat.type === 'PDF' ? 'pdf-type' : 'img-type'}">
                                        ${mat.type === 'PDF'
                                            ? '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'
                                            : '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>'
                                        }
                                    </div>
                                    <div class="material-card-info">
                                        <strong title="${escapeSubjectHTML(mat.name)}">${escapeSubjectHTML(mat.name)}</strong>
                                        <span>${escapeSubjectHTML(mat.type || 'Document')} • ${escapeSubjectHTML(mat.size || 'File')} • ${escapeSubjectHTML(mat.date || 'Saved')}</span>
                                    </div>
                                    <div class="material-card-actions">
                                        ${mat.url ? `
                                            <a href="${mat.url}" target="_blank" download="${escapeSubjectHTML(mat.name)}" class="mat-action-btn" title="View or Download">
                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                                            </a>
                                        ` : ''}
                                        <button
                                            type="button"
                                            class="mat-action-btn delete"
                                            onclick="removeSubjectMaterial('${subject.id}', '${mat.id}')"
                                            title="Delete Material"
                                        >
                                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                                        </button>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="materials-empty-box">
                            <div class="materials-empty-icon">
                                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                            </div>
                            <div class="materials-empty-text">
                                <strong>No study materials uploaded yet</strong>
                                <p>Upload your notes, question banks, or diagrams to keep everything organized with this subject.</p>
                            </div>
                            <div class="materials-empty-buttons">
                                <button type="button" class="btn-subtle" onclick="triggerSubjectFileUpload('${subject.id}', 'pdf')">
                                    Upload PDF
                                </button>
                                <button type="button" class="btn-subtle" onclick="triggerSubjectFileUpload('${subject.id}', 'image')">
                                    Upload Image
                                </button>
                            </div>
                        </div>
                    `}
                </div>
            </div>

        </div>

        <!-- Modal Footer -->
        <div class="subject-modal-footer">
            <div class="modal-footer-stats">
                <span class="footer-progress-icon">
                    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </span>
                <span><strong>${completedTopics} of ${totalTopics} topics</strong> completed (${progress}%)</span>
            </div>
            <div class="modal-footer-btns">
                <button
                    type="button"
                    class="danger-btn-subtle"
                    onclick="deleteSubjectFromDetails('${subject.id}')"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    <span>Delete</span>
                </button>
                <button
                    type="button"
                    class="secondary-btn"
                    onclick="openSubjectEditFromDetails('${subject.id}')"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                    <span>Edit Subject</span>
                </button>
                <button
                    type="button"
                    class="primary-btn"
                    onclick="closeSubjectDetails()"
                >
                    Done
                </button>
            </div>
        </div>
    `;

    modal.classList.add("show");
    document.body.style.overflow = "hidden";
}


// =====================================================
// CLOSE SUBJECT DETAILS
// =====================================================

function closeSubjectDetails() {

    const modal =
        document.getElementById(
            "subject-details-modal"
        );


    if (modal) {

        modal.classList.remove(
            "show"
        );
    }

    document.body.style.overflow = "";
    activeSubjectDetailsId = null;
}


// =====================================================
// HANDLE BACKDROP CLICK
// =====================================================

function handleSubjectModalBackdrop(event) {
    if (event.target && event.target.id === "subject-details-modal") {
        closeSubjectDetails();
    }
}


// =====================================================
// TOGGLE SUBJECT TOPIC
// =====================================================

function toggleSubjectTopic(
    subjectId,
    topicId
) {

    const data =
        getMasterData();


    const subject =
        data.subjects.find(
            item =>
                item.id ===
                subjectId
        );


    if (!subject) {
        return;
    }

    if (!Array.isArray(subject.topics)) {
        subject.topics = [];
    }


    const topic =
        subject.topics.find(
            item =>
                item.id ===
                topicId
        );


    if (!topic) {
        return;
    }


    topic.completed =
        !topic.completed;


    subject.progress =
        calculateSubjectProgress(
            subject
        );


    saveMasterData(data);


    openSubjectDetails(
        subjectId
    );


    renderSubjects();


    updateDashboardAfterSubjectChange();
}


// =====================================================
// SUBJECT FILE UPLOADS
// =====================================================

function triggerSubjectFileUpload(subjectId, fileType) {
    activeSubjectDetailsId = subjectId;
    const fileInput = document.getElementById("subject-dynamic-file-input");
    if (!fileInput) return;

    if (fileType === "pdf") {
        fileInput.accept = ".pdf,application/pdf";
    } else {
        fileInput.accept = "image/*";
    }

    fileInput.onchange = function (event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        const data = getMasterData();
        const subject = data.subjects.find(item => item.id === subjectId);
        if (!subject) return;

        if (!Array.isArray(subject.materials)) {
            subject.materials = [];
        }

        const sizeFormatted = file.size < 1024 * 1024
            ? `${(file.size / 1024).toFixed(1)} KB`
            : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

        let fileUrl = "";
        try {
            fileUrl = URL.createObjectURL(file);
        } catch (e) {
            fileUrl = "";
        }

        const newMat = {
            id: "mat_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
            name: file.name,
            type: fileType === "pdf" ? "PDF" : "Image",
            icon: fileType === "pdf" ? "📄" : "🖼️",
            size: sizeFormatted,
            date: "Added today",
            url: fileUrl
        };

        subject.materials.push(newMat);
        saveMasterData(data);

        openSubjectDetails(subjectId);
        showToast(`Uploaded "${file.name}" to ${subject.name}!`);

        event.target.value = "";
    };

    fileInput.click();
}


// =====================================================
// REMOVE SUBJECT MATERIAL
// =====================================================

function removeSubjectMaterial(subjectId, materialId) {
    const data = getMasterData();
    const subject = data.subjects.find(item => item.id === subjectId);
    if (!subject || !Array.isArray(subject.materials)) return;

    subject.materials = subject.materials.filter(m => m.id !== materialId);
    saveMasterData(data);

    openSubjectDetails(subjectId);
    showToast("Study material removed.");
}


// =====================================================
// AI STUDY TOOLS (QUIZ & ASK TUTOR)
// =====================================================

function startSubjectQuiz(subjectId) {
    const data = getMasterData();
    const subject = data.subjects.find(item => item.id === subjectId);
    if (!subject) return;

    const topicsText = Array.isArray(subject.topics) && subject.topics.length
        ? subject.topics.map(t => t.name).slice(0, 5).join(", ")
        : subject.name;

    const prompt = `Hi Alpha! Please generate a practice quiz for me on '${subject.name}' covering key topics (${topicsText}). Include 5 multiple-choice questions with 4 options each (A, B, C, D), and provide the correct answers with clear explanations!`;

    closeSubjectDetails();
    showPage("chat");

    const chatInput = document.getElementById("message");
    if (chatInput) {
        chatInput.value = prompt;
        chatInput.focus();
        if (typeof autoResizeTextarea === "function") {
            autoResizeTextarea(chatInput);
        }
    }

    showToast(`Quiz prompt for ${subject.name} loaded into Chat!`);
}

function askSubjectDoubt(subjectId) {
    const data = getMasterData();
    const subject = data.subjects.find(item => item.id === subjectId);
    if (!subject) return;

    const prompt = `Hi Alpha! I'm studying '${subject.name}'. Can you provide a clear summary of the core concepts, common exam questions, and key points to remember?`;

    closeSubjectDetails();
    showPage("chat");

    const chatInput = document.getElementById("message");
    if (chatInput) {
        chatInput.value = prompt;
        chatInput.focus();
        if (typeof autoResizeTextarea === "function") {
            autoResizeTextarea(chatInput);
        }
    }

    showToast(`Study query for ${subject.name} loaded into Chat!`);
}


// =====================================================
// EDIT / DELETE ACTIONS FROM DETAILS MODAL
// =====================================================

function openSubjectEditFromDetails(subjectId) {
    closeSubjectDetails();
    editSubject(subjectId);
}

function deleteSubjectFromDetails(subjectId) {
    if (confirm("Are you sure you want to delete this subject?")) {
        closeSubjectDetails();
        deleteSubject(subjectId);
    }
}



// Backward compatibility alias for openSubjectDetail
function openSubjectDetail(subjectNameOrId) {
    const data = getMasterData();
    const subject = data.subjects.find(
        s => s.id === subjectNameOrId || s.name.toLowerCase() === String(subjectNameOrId).toLowerCase()
    );
    if (subject) {
        openSubjectDetails(subject.id);
    }
}

