// =====================================================
// GOALS SECTION LOGIC
// =====================================================

let currentGoalFilter = 'all';

function setGoalFilter(filter) {
    currentGoalFilter = filter;
    ['all', 'active', 'completed'].forEach(f => {
        const btn = document.getElementById(`goal-filter-${f}`);
        if (btn) {
            btn.classList.toggle('active', f === filter);
        }
    });
    renderGoalsPage(filter);
}

function focusGoalInput() {
    const input = document.getElementById("new-goal-text");
    if (input) {
        input.scrollIntoView({ behavior: "smooth", block: "center" });
        input.focus();
    }
}

function populateGoalCategoryDropdown() {
    const select = document.getElementById("new-goal-category");
    if (!select) return;
    const data = getMasterData();
    const subjects = Array.isArray(data.subjects) ? data.subjects : [];

    const currentValue = select.value || "General Study";

    let optionsHtml = `<option value="General Study">📚 General Study</option>`;
    subjects.forEach(sub => {
        optionsHtml += `<option value="${escapeSubjectHTML(sub.name)}">${sub.icon || "📖"} ${escapeSubjectHTML(sub.name)}</option>`;
    });
    optionsHtml += `<option value="Exam Prep">📝 Exam Prep</option>`;
    optionsHtml += `<option value="AI Practice & Quizzes">💡 AI Practice & Quizzes</option>`;

    select.innerHTML = optionsHtml;
    select.value = currentValue;
}

function renderGoalsPage(filter = currentGoalFilter) {
    const data = getMasterData();
    const goals = Array.isArray(data.goals) ? data.goals : [];

    populateGoalCategoryDropdown();

    // Update today's date chip
    const dateDisplay = document.getElementById("goals-today-date-display");
    if (dateDisplay) {
        const now = new Date();
        dateDisplay.textContent = now.toLocaleDateString("en-US", { weekday: 'short', month: 'short', day: 'numeric' });
    }

    const total = goals.length;
    const completed = goals.filter(g => g.completed === true || g.done === true).length;
    const active = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // Update Top KPIs
    const percentEl = document.getElementById("goal-percentage-page");
    if (percentEl) percentEl.textContent = `${percent}%`;

    const fractionEl = document.getElementById("goal-fraction-page");
    if (fractionEl) fractionEl.textContent = `${completed} of ${total} done`;

    const progressBar = document.getElementById("goals-page-progress");
    if (progressBar) progressBar.style.width = `${percent}%`;

    const activeCountEl = document.getElementById("goals-active-count");
    if (activeCountEl) activeCountEl.textContent = active;

    const completedCountEl = document.getElementById("goals-completed-count");
    if (completedCountEl) completedCountEl.textContent = completed;

    const meterStatusEl = document.getElementById("goal-meter-status-text");
    if (meterStatusEl) {
        if (total === 0) {
            meterStatusEl.textContent = "Add your first study goal to kick off your streak!";
        } else if (percent === 100) {
            meterStatusEl.textContent = "🎉 Outstanding! You've achieved all your study goals for today!";
        } else if (percent >= 50) {
            meterStatusEl.textContent = "⚡ Superb momentum! More than halfway through today's goals.";
        } else {
            meterStatusEl.textContent = "Keep pushing forward! Every completed task builds mastery.";
        }
    }

    // Filter counts
    const countAllEl = document.getElementById("count-filter-all");
    if (countAllEl) countAllEl.textContent = total;
    const countActiveEl = document.getElementById("count-filter-active");
    if (countActiveEl) countActiveEl.textContent = active;
    const countDoneEl = document.getElementById("count-filter-completed");
    if (countDoneEl) countDoneEl.textContent = completed;

    // Filter list
    let filtered = goals;
    if (filter === 'active') {
        filtered = goals.filter(g => !g.completed && !g.done);
    } else if (filter === 'completed') {
        filtered = goals.filter(g => g.completed === true || g.done === true);
    }

    const listContainer = document.getElementById("goals-page-list");
    if (!listContainer) return;

    if (!filtered.length) {
        let emptyTitle = "No goals found";
        let emptyDesc = "Add a new daily goal above to keep your study schedule on track.";
        if (filter === 'active' && total > 0) {
            emptyTitle = "All goals conquered! 🏆";
            emptyDesc = "You have completed all active study goals. Ready to add a new challenge?";
        } else if (filter === 'completed' && total > 0) {
            emptyTitle = "No completed goals yet";
            emptyDesc = "Check off your first study goal when you complete it!";
        }

        listContainer.innerHTML = `
            <div class="goals-feed-empty-state">
                <div class="empty-icon-bubble">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
                </div>
                <h3>${emptyTitle}</h3>
                <p>${emptyDesc}</p>
                <button type="button" class="empty-action-add-btn" onclick="focusGoalInput()">
                    + Add a Goal
                </button>
            </div>
        `;
        return;
    }

    listContainer.innerHTML = filtered.map(goal => {
        const isDone = goal.completed === true || goal.done === true;
        const text = goal.text || goal.title || goal.name || "Untitled Goal";
        const priority = (goal.priority || "normal").toLowerCase();
        const category = goal.category || "General Study";

        let priorityLabel = "Normal";
        let priorityClass = "normal";
        if (priority === "high") {
            priorityLabel = "High Priority";
            priorityClass = "high";
        } else if (priority === "medium") {
            priorityLabel = "Medium Priority";
            priorityClass = "medium";
        }

        return `
            <div class="goal-item-row ${isDone ? 'is-completed' : ''}" data-goal-id="${goal.id}">
                <label class="goal-checkbox-label">
                    <input 
                        type="checkbox" 
                        class="goal-checkbox-input"
                        ${isDone ? 'checked' : ''}
                        onchange="toggleGoalPageItem('${goal.id}')"
                    >
                    <span class="custom-goal-checkmark"></span>
                </label>

                <div class="goal-content-body">
                    <div class="goal-title-wrap">
                        <span class="goal-text ${isDone ? 'strikethrough' : ''}">${escapeSubjectHTML(text)}</span>
                    </div>

                    <div class="goal-badges-row">
                        <span class="goal-badge-priority ${priorityClass}">
                            <span class="priority-dot"></span> ${priorityLabel}
                        </span>
                        <span class="goal-badge-category">
                            ${escapeSubjectHTML(category)}
                        </span>
                        ${goal.createdAt ? `
                            <span class="goal-time-badge">
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg> ${new Date(goal.createdAt).toLocaleDateString("en-US", { month: 'short', day: 'numeric' })}
                            </span>
                        ` : ''}
                    </div>
                </div>

                <div class="goal-actions-end">
                    <button 
                        type="button" 
                        class="goal-delete-btn" 
                        onclick="deleteGoalItem('${goal.id}')" 
                        title="Delete this goal"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function handleNewGoalSubmit(e) {
    if (e) e.preventDefault();
    const input = document.getElementById("new-goal-text");
    if (!input) return;
    const text = input.value.trim();
    if (!text) {
        showToast("Please enter a goal description.");
        input.focus();
        return;
    }

    const categorySelect = document.getElementById("new-goal-category");
    const category = categorySelect ? categorySelect.value : "General Study";

    const priorityInput = document.querySelector('input[name="goal-priority"]:checked');
    const priority = priorityInput ? priorityInput.value : "normal";

    addGoal(text, category, priority);
    input.value = "";
    input.focus();
}

function addGoal(text, category = "General Study", priority = "normal") {
    if (!text || !text.trim()) return;
    const data = getMasterData();
    if (!Array.isArray(data.goals)) {
        data.goals = [];
    }

    const newGoal = {
        id: "goal_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        text: text.trim(),
        category: category,
        priority: priority,
        completed: false,
        createdAt: new Date().toISOString()
    };

    data.goals.unshift(newGoal);
    saveMasterData(data);

    renderGoalsPage();
    updateDashboardGoals();
    renderProgressPage();

    showToast("🎯 Study goal added!");
}

function quickAddGoal(text, category = "General Study", priority = "normal") {
    addGoal(text, category, priority);
}

function toggleGoalPageItem(goalId) {
    const data = getMasterData();
    if (!Array.isArray(data.goals)) return;

    const goal = data.goals.find(g => g.id === goalId);
    if (!goal) return;

    if (typeof goal.completed !== "undefined") {
        goal.completed = !goal.completed;
    } else {
        goal.done = !goal.done;
    }

    saveMasterData(data);

    renderGoalsPage();
    updateDashboardGoals();
    renderProgressPage();

    const isNowDone = goal.completed || goal.done;
    showToast(isNowDone ? "✨ Goal completed! Great job!" : "Goal marked in progress.");
}

function deleteGoalItem(goalId) {
    const data = getMasterData();
    if (!Array.isArray(data.goals)) return;

    data.goals = data.goals.filter(g => g.id !== goalId);
    saveMasterData(data);

    renderGoalsPage();
    updateDashboardGoals();
    renderProgressPage();

    showToast("Goal removed.");
}

function clearCompletedGoals() {
    const data = getMasterData();
    if (!Array.isArray(data.goals)) return;

    const doneCount = data.goals.filter(g => g.completed === true || g.done === true).length;
    if (doneCount === 0) {
        showToast("No completed goals to clear.");
        return;
    }

    data.goals = data.goals.filter(g => !g.completed && !g.done);
    saveMasterData(data);

    renderGoalsPage();
    updateDashboardGoals();
    renderProgressPage();

    showToast(`Cleared ${doneCount} completed goal${doneCount > 1 ? 's' : ''}.`);
}

