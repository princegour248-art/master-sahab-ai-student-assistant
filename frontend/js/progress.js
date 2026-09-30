// =====================================================
// PROGRESS SECTION LOGIC
// =====================================================

function calculateProgressMetrics(data) {
    const subjects = Array.isArray(data.subjects) ? data.subjects : [];
    const goals = Array.isArray(data.goals) ? data.goals : [];
    const chats = getSavedChats();

    let totalTopics = 0;
    let completedTopics = 0;
    let totalUnits = 0;
    let totalMaterials = 0;

    subjects.forEach(sub => {
        if (Array.isArray(sub.topics)) {
            totalTopics += sub.topics.length;
            completedTopics += sub.topics.filter(t => t.completed === true).length;
        }
        if (Array.isArray(sub.syllabus)) {
            totalUnits += sub.syllabus.length;
        }
        if (Array.isArray(sub.materials)) {
            totalMaterials += sub.materials.length;
        }
    });

    const topicPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const totalGoals = goals.length;
    const completedGoals = goals.filter(g => g.completed === true || g.done === true).length;
    const goalPercent = totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0;

    // Overall curriculum mastery
    const overallMastery = topicPercent;

    // Determine Academic Rank
    let rankName = "Explorer";
    let rankEmoji = "🌱";
    let rankStage = 1;
    let rankBadgeClass = "rank-explorer";
    if (overallMastery >= 76) {
        rankName = "Master";
        rankEmoji = "👑";
        rankStage = 4;
        rankBadgeClass = "rank-master";
    } else if (overallMastery >= 51) {
        rankName = "Scholar";
        rankEmoji = "📘";
        rankStage = 3;
        rankBadgeClass = "rank-scholar";
    } else if (overallMastery >= 26) {
        rankName = "Apprentice";
        rankEmoji = "⚡";
        rankStage = 2;
        rankBadgeClass = "rank-apprentice";
    }

    // Find smart focus: lowest progress subject with unfinished topics
    let focusSubject = null;
    let focusTopic = null;
    let minProgress = 999;

    subjects.forEach(sub => {
        const subProg = typeof sub.progress === "number" ? sub.progress : calculateSubjectProgress(sub);
        if (subProg < 100 && subProg < minProgress) {
            minProgress = subProg;
            focusSubject = sub;
            if (Array.isArray(sub.topics)) {
                focusTopic = sub.topics.find(t => !t.completed);
            }
        }
    });

    return {
        subjectsCount: subjects.length,
        totalTopics,
        completedTopics,
        remainingTopics: Math.max(0, totalTopics - completedTopics),
        topicPercent,
        totalUnits,
        totalMaterials,
        totalGoals,
        completedGoals,
        goalPercent,
        overallMastery,
        rankName,
        rankEmoji,
        rankStage,
        rankBadgeClass,
        focusSubject,
        focusTopic,
        chatCount: chats.length
    };
}

function renderProgressPage() {
    const data = getMasterData();
    const metrics = calculateProgressMetrics(data);

    // 1. Overall Mastery KPI Card
    const masteryEl = document.getElementById("progress-overall-mastery");
    if (masteryEl) masteryEl.textContent = `${metrics.overallMastery}%`;

    const masteryBar = document.getElementById("progress-overall-bar");
    if (masteryBar) masteryBar.style.width = `${metrics.overallMastery}%`;

    const masteryBadge = document.getElementById("progress-mastery-level-badge");
    if (masteryBadge) {
        masteryBadge.textContent = metrics.rankName;
        masteryBadge.className = `kpi-badge ${metrics.rankBadgeClass}`;
    }

    // 2. Topics KPI Card
    const topicsRatio = document.getElementById("progress-topics-ratio");
    if (topicsRatio) topicsRatio.textContent = `${metrics.completedTopics} / ${metrics.totalTopics}`;

    const topicsBar = document.getElementById("progress-topics-bar");
    if (topicsBar) topicsBar.style.width = `${metrics.topicPercent}%`;

    const topicsPill = document.getElementById("progress-topics-percent-pill");
    if (topicsPill) topicsPill.textContent = `${metrics.topicPercent}% Done`;

    const topicsRemaining = document.getElementById("progress-topics-remaining");
    if (topicsRemaining) {
        topicsRemaining.textContent = `${metrics.remainingTopics} topic${metrics.remainingTopics !== 1 ? 's' : ''} remaining to master`;
    }

    // 3. Subjects KPI Card
    const subCount = document.getElementById("progress-subject-count");
    if (subCount) subCount.textContent = metrics.subjectsCount;

    const unitsCount = document.getElementById("progress-units-count");
    if (unitsCount) unitsCount.textContent = metrics.totalUnits;

    const materialsCount = document.getElementById("progress-materials-count");
    if (materialsCount) materialsCount.textContent = metrics.totalMaterials;

    // 4. Goals KPI Card
    const goalCount = document.getElementById("progress-goal-count");
    if (goalCount) goalCount.textContent = metrics.completedGoals;

    const goalsBar = document.getElementById("progress-goals-bar");
    if (goalsBar) goalsBar.style.width = `${metrics.goalPercent}%`;

    const goalsRatioPill = document.getElementById("progress-goals-ratio-pill");
    if (goalsRatioPill) goalsRatioPill.textContent = `${metrics.completedGoals} of ${metrics.totalGoals} Done`;

    const goalsRateText = document.getElementById("progress-goals-rate-text");
    if (goalsRateText) goalsRateText.textContent = `${metrics.goalPercent}% daily goal success rate`;

    // 5. Academic Rank & Milestones Journey
    const rankChip = document.getElementById("current-rank-chip");
    if (rankChip) {
        rankChip.innerHTML = `
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span id="current-rank-text">Rank: ${metrics.rankName}</span>
        `;
    }

    // Highlight Stepper Stages
    for (let i = 1; i <= 4; i++) {
        const step = document.getElementById(`stage-step-${i}`);
        if (step) {
            step.classList.toggle('active', i === metrics.rankStage);
            step.classList.toggle('completed', i < metrics.rankStage);
        }
        if (i < 4) {
            const conn = document.getElementById(`stage-conn-${i}`);
            if (conn) {
                conn.classList.toggle('active', i < metrics.rankStage);
            }
        }
    }

    // Dynamic Motivational Quote
    const quoteEl = document.getElementById("journey-quote-text");
    if (quoteEl) {
        if (metrics.overallMastery >= 90) {
            quoteEl.textContent = "Alpha Mastery Level: Exceptional! You have mastered almost your entire curriculum.";
        } else if (metrics.overallMastery >= 50) {
            quoteEl.textContent = "Solid momentum! Over half of your curriculum is mastered. Keep revising daily!";
        } else if (metrics.overallMastery > 0) {
            quoteEl.textContent = "Steady progress! Each topic you tick off gets you closer to the Scholar rank.";
        } else {
            quoteEl.textContent = "Welcome! Check off topics in your Subjects section to unlock rank badges and climb higher.";
        }
    }

    // 6. Smart Next-Step Recommendation Card
    const focusBox = document.getElementById("focus-recommendation-content");
    if (focusBox) {
        if (metrics.focusSubject) {
            const sub = metrics.focusSubject;
            const subProg = typeof sub.progress === "number" ? sub.progress : calculateSubjectProgress(sub);
            const topicText = metrics.focusTopic ? metrics.focusTopic.name : "Review syllabus units";

            focusBox.innerHTML = `
                <div class="focus-subject-row">
                    <span class="focus-icon">${getSubjectIconSVG(sub.name, sub.icon, 22)}</span>
                    <div>
                        <strong class="focus-title">${escapeSubjectHTML(sub.name)}</strong>
                        <span class="focus-prog-text">${subProg}% complete • ${sub.topics ? sub.topics.length : 0} topics</span>
                    </div>
                </div>

                <div class="focus-topic-highlight">
                    <span class="focus-topic-label">RECOMMENDED NEXT TOPIC:</span>
                    <strong class="focus-topic-name">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 14 14"/></svg>
                        ${escapeSubjectHTML(topicText)}
                    </strong>
                </div>

                <button 
                    type="button" 
                    class="focus-action-btn"
                    onclick="openSubjectDetails('${sub.id}')"
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
                    <span>Resume Study &amp; Open Topic</span>
                </button>
            `;
        } else {
            focusBox.innerHTML = `
                <div class="focus-empty-all-done">
                    <span class="focus-done-icon">
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>
                    </span>
                    <strong>All subjects are 100% completed!</strong>
                    <p>Outstanding job! You have mastered every topic in your curriculum.</p>
                    <button type="button" class="focus-action-btn" onclick="showPage('subjects')">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>
                        <span>Explore Subjects</span>
                    </button>
                </div>
            `;
        }
    }

    // 7. Visual Analytics Bar Graph
    renderProgressBarChart(data);

    // 8. Enrolled Subjects Grid
    renderProgressSubjectsGrid(data);

    // 9. Achievements & Badges
    renderAchievements(metrics);
}

function renderProgressSubjectsGrid(data) {
    const grid = document.getElementById("progress-subjects-grid");
    if (!grid) return;

    const subjects = Array.isArray(data.subjects) ? data.subjects : [];
    if (!subjects.length) {
        grid.innerHTML = `
            <div class="panel-empty-state">
                <span class="empty-icon-wrap"><svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg></span>
                <h4>No subjects enrolled yet</h4>
                <p>Add subjects in the Subjects tab to view detailed curriculum progress.</p>
                <button type="button" class="empty-action-add-btn" onclick="showPage('subjects')">
                    + Add Subject
                </button>
            </div>
        `;
        return;
    }

    grid.innerHTML = subjects.map(sub => {
        const progress = typeof sub.progress === "number" ? sub.progress : calculateSubjectProgress(sub);
        const topics = Array.isArray(sub.topics) ? sub.topics : [];
        const doneTopics = topics.filter(t => t.completed).length;
        const totalTopics = topics.length;
        const nextTopic = topics.find(t => !t.completed);
        const materialsCount = Array.isArray(sub.materials) ? sub.materials.length : 0;

        let statusClass = "in-progress";
        let statusText = "In Progress";
        if (progress === 100) {
            statusClass = "completed";
            statusText = "Mastered";
        } else if (progress === 0) {
            statusClass = "pending";
            statusText = "Not Started";
        }

        return `
            <div class="progress-subject-card">
                <div class="prog-card-top">
                    <div class="prog-card-title-group">
                        <span class="prog-card-icon">${getSubjectIconSVG(sub.name, sub.icon, 22)}</span>
                        <div>
                            <h3 class="prog-card-name">${escapeSubjectHTML(sub.name)}</h3>
                            <span class="prog-card-units">${sub.syllabus ? sub.syllabus.length : 0} Syllabus Units • ${materialsCount} File${materialsCount !== 1 ? 's' : ''}</span>
                        </div>
                    </div>
                    <span class="prog-status-pill ${statusClass}">${statusText}</span>
                </div>

                <div class="prog-bar-section">
                    <div class="prog-bar-header">
                        <span class="prog-bar-label">Completion</span>
                        <strong class="prog-bar-val">${progress}%</strong>
                    </div>
                    <div class="prog-track">
                        <div class="prog-fill" style="width: ${progress}%;"></div>
                    </div>
                </div>

                <div class="prog-card-topics-info">
                    <span class="prog-topic-count">
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="20 6 9 17 4 12"/></svg>
                        ${doneTopics} of ${totalTopics} topics mastered
                    </span>
                    ${nextTopic ? `
                        <div class="prog-next-topic">
                            <span class="next-tag">Next:</span>
                            <span class="next-title">${escapeSubjectHTML(nextTopic.name)}</span>
                        </div>
                    ` : `
                        <div class="prog-all-mastered">
                            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                            All topics completed!
                        </div>
                    `}
                </div>

                <button 
                    type="button" 
                    class="prog-view-subject-btn"
                    onclick="openSubjectDetails('${sub.id}')"
                >
                    View Syllabus &amp; Materials →
                </button>
            </div>
        `;
    }).join("");
}

function renderAchievements(metrics) {
    const grid = document.getElementById("achievements-grid");
    const summaryBadge = document.getElementById("achievements-summary-badge");
    if (!grid) return;

    const badges = [
        {
            id: "badge_first_step",
            iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>`,
            title: "First Step",
            description: "Enroll in your first subject or set a daily goal",
            unlocked: metrics.subjectsCount > 0 || metrics.totalGoals > 0,
            progressText: metrics.subjectsCount > 0 || metrics.totalGoals > 0 ? "Unlocked!" : "0/1 Action"
        },
        {
            id: "badge_goal_crusher",
            iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>`,
            title: "Goal Crusher",
            description: "Complete 2 or more daily study goals",
            unlocked: metrics.completedGoals >= 2,
            progressText: `${Math.min(metrics.completedGoals, 2)} / 2 Goals`
        },
        {
            id: "badge_topic_sprinter",
            iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>`,
            title: "Topic Sprinter",
            description: "Master 4 or more syllabus curriculum topics",
            unlocked: metrics.completedTopics >= 4,
            progressText: `${Math.min(metrics.completedTopics, 4)} / 4 Topics`
        },
        {
            id: "badge_knowledge_seeker",
            iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`,
            title: "Knowledge Pioneer",
            description: "Enroll in 3 or more academic subjects",
            unlocked: metrics.subjectsCount >= 3,
            progressText: `${Math.min(metrics.subjectsCount, 3)} / 3 Subjects`
        },
        {
            id: "badge_ai_companion",
            iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="10" rx="2"/><circle cx="12" cy="5" r="2"/><path d="M12 7v4"/><line x1="8" y1="16" x2="8" y2="16"/><line x1="16" y1="16" x2="16" y2="16"/></svg>`,
            title: "AI Study Partner",
            description: "Interact with Alpha AI for tutoring",
            unlocked: metrics.chatCount > 0,
            progressText: metrics.chatCount > 0 ? "Unlocked!" : "Ask 1 question"
        },
        {
            id: "badge_scholar_rank",
            iconSvg: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>`,
            title: "Mastery Elite",
            description: "Achieve 50% or higher overall curriculum mastery",
            unlocked: metrics.overallMastery >= 50,
            progressText: `${metrics.overallMastery}% / 50%`
        }
    ];

    const unlockedCount = badges.filter(b => b.unlocked).length;
    if (summaryBadge) {
        summaryBadge.textContent = `${unlockedCount} / ${badges.length} Unlocked`;
    }

    grid.innerHTML = badges.map(badge => `
        <div class="achievement-card ${badge.unlocked ? 'is-unlocked' : 'is-locked'}">
            <div class="achievement-icon-wrap">
                <span class="achievement-icon">${badge.iconSvg}</span>
                ${badge.unlocked ? `<span class="achievement-star">★</span>` : ''}
            </div>
            <div class="achievement-body">
                <div class="achievement-header-line">
                    <h4 class="achievement-title">${badge.title}</h4>
                    <span class="achievement-status-tag ${badge.unlocked ? 'tag-unlocked' : 'tag-locked'}">
                        ${badge.unlocked ? 'UNLOCKED' : badge.progressText}
                    </span>
                </div>
                <p class="achievement-desc">${badge.description}</p>
            </div>
        </div>
    `).join("");
}


// =====================================================
// PROGRESS PAGE - VISUAL ANALYTICS BAR GRAPH
// =====================================================

function renderProgressBarChart(data) {
    const container = document.getElementById("analytics-bar-chart-container");
    if (!container) return;

    const subjects = Array.isArray(data.subjects) ? data.subjects : [];
    const highestChip = document.getElementById("graph-highest-subject-chip");
    const lowestChip = document.getElementById("graph-lowest-subject-chip");
    const averageBadge = document.getElementById("graph-average-badge");

    if (!subjects.length) {
        if (highestChip) highestChip.textContent = "🏆 Top: None";
        if (lowestChip) lowestChip.textContent = "⚡ Focus: None";
        if (averageBadge) averageBadge.textContent = "Curriculum Average: 0%";
        container.innerHTML = `
            <div class="graph-empty-state">
                <span class="graph-empty-icon">📊</span>
                <h4>No Subjects Enrolled</h4>
                <p>Add your academic subjects in the Subjects tab to generate live mastery analytics and visual bar charts.</p>
                <button type="button" class="empty-action-add-btn" onclick="showPage('subjects')">
                    + Add Subject
                </button>
            </div>
        `;
        return;
    }

    // Process each subject's progress & topics
    const subjectsData = subjects.map(sub => {
        let prog = 0;
        let completedTopics = 0;
        const totalTopics = Array.isArray(sub.topics) ? sub.topics.length : 0;

        if (totalTopics > 0) {
            completedTopics = sub.topics.filter(t => t.completed).length;
            prog = Math.round((completedTopics / totalTopics) * 100);
        } else if (typeof sub.progress === "number") {
            prog = Math.min(100, Math.max(0, Math.round(sub.progress)));
        }

        return {
            id: sub.id,
            name: sub.name || "Untitled",
            icon: sub.icon || "📚",
            progress: prog,
            completedTopics,
            totalTopics
        };
    });

    // Summary statistics
    const totalProg = subjectsData.reduce((acc, s) => acc + s.progress, 0);
    const avgProg = Math.round(totalProg / subjectsData.length);

    // Sort to find top and lowest
    const sortedByProg = [...subjectsData].sort((a, b) => b.progress - a.progress);
    const topSub = sortedByProg[0];
    const lowSub = [...subjectsData].sort((a, b) => a.progress - b.progress)[0];

    if (highestChip) {
        const shortTop = topSub.name.length > 15 ? topSub.name.slice(0, 14) + "…" : topSub.name;
        highestChip.textContent = `Top: ${shortTop} (${topSub.progress}%)`;
    }
    if (lowestChip) {
        const shortLow = lowSub.name.length > 15 ? lowSub.name.slice(0, 14) + "…" : lowSub.name;
        lowestChip.textContent = `Focus: ${shortLow} (${lowSub.progress}%)`;
    }
    if (averageBadge) {
        averageBadge.textContent = `Curriculum Average: ${avgProg}%`;
    }

    // Benchmark line at 80%
    const benchmarkTarget = 80;

    // Render Bar Chart UI
    let chartHtml = `
        <div class="bar-chart-visual-wrapper">
            <!-- Y-Axis Grid Lines -->
            <div class="chart-y-axis">
                <div class="y-axis-mark"><span>100%</span></div>
                <div class="y-axis-mark"><span>75%</span></div>
                <div class="y-axis-mark"><span>50%</span></div>
                <div class="y-axis-mark"><span>25%</span></div>
                <div class="y-axis-mark"><span>0%</span></div>
            </div>

            <!-- Chart Plot Area -->
            <div class="chart-plot-area">
                <!-- Grid Horizontal Lines -->
                <div class="chart-grid-lines">
                    <div class="grid-line" style="bottom: 100%;"></div>
                    <div class="grid-line" style="bottom: 75%;"></div>
                    <div class="grid-line" style="bottom: 50%;"></div>
                    <div class="grid-line" style="bottom: 25%;"></div>
                    <div class="grid-line" style="bottom: 0%;"></div>
                </div>

                <!-- 80% Benchmark Reference Line -->
                <div class="chart-benchmark-line" style="bottom: ${benchmarkTarget}%;" title="Target Benchmark (80%)">
                    <span class="benchmark-tag">Target: 80%</span>
                </div>

                <!-- Bars Column Group -->
                <div class="chart-bars-group">
    `;

    subjectsData.forEach(sub => {
        let barColorClass = "bar-emerald";
        let statusBadge = "Mastered";
        if (sub.progress < 30) {
            barColorClass = "bar-rose";
            statusBadge = "Needs Attention";
        } else if (sub.progress < 60) {
            barColorClass = "bar-amber";
            statusBadge = "In Progress";
        } else if (sub.progress < 80) {
            barColorClass = "bar-blue";
            statusBadge = "On Track";
        }

        const heightPercent = Math.max(sub.progress, 4); // Keep minimum 4% so baseline is visible
        const topicsInfo = sub.totalTopics > 0 
            ? `${sub.completedTopics}/${sub.totalTopics} Topics Completed` 
            : `${sub.progress}% Syllabus Complete`;

        chartHtml += `
            <div class="chart-bar-column" onclick="openSubjectDetails('${sub.id}')" title="Click to view ${escapeSubjectHTML(sub.name)} details">
                <!-- Bar Column Inner with Height Track -->
                <div class="bar-track-wrapper">
                    <!-- Tooltip -->
                    <div class="bar-tooltip">
                        <strong class="tooltip-title">${escapeSubjectHTML(sub.name)}</strong>
                        <span class="tooltip-score">${sub.progress}% Mastery</span>
                        <span class="tooltip-sub">${topicsInfo}</span>
                        <span class="tooltip-tag ${barColorClass}">${statusBadge}</span>
                    </div>

                    <!-- Value Pill above Bar -->
                    <span class="bar-val-pill" style="bottom: calc(${heightPercent}% + 6px);">
                        ${sub.progress}%
                    </span>

                    <!-- Animated Bar Fill -->
                    <div class="bar-fill ${barColorClass}" style="height: ${heightPercent}%;"></div>
                </div>

                <!-- X-Axis Label -->
                <div class="chart-x-label">
                    <span class="x-sub-icon">${getSubjectIconSVG(sub.name, sub.icon, 14)}</span>
                    <span class="x-sub-title" title="${escapeSubjectHTML(sub.name)}">${escapeSubjectHTML(sub.name)}</span>
                </div>
            </div>
        `;
    });

    chartHtml += `
                </div>
            </div>
        </div>
    `;

    container.innerHTML = chartHtml;
}

