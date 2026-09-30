// =====================================================
// TODAY DATE
// =====================================================

function setTodayDate() {

    const dateElement =
        document.getElementById(
            "today-date"
        );


    if (!dateElement) {
        return;
    }


    const today =
        new Date();


    dateElement.textContent =
        today.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}


// =====================================================
// DASHBOARD MOTIVATIONS
// =====================================================

const DASHBOARD_MOTIVATIONS = [

    "Small progress is still progress. Keep going! 🚀",

    "Your future self will thank you for studying today. 📚",

    "One topic at a time. You can do this! 💪",

    "Consistency is more powerful than perfection. 🔥",

    "Learn today. Build tomorrow. Grow every day. 🌱",

    "Every question you solve makes you better. 🧠",

    "Keep learning and keep building! 💻"

];


// =====================================================
// DASHBOARD DATE
// =====================================================

function updateDashboardDate() {

    const dateElement =
        document.getElementById(
            "dashboard-date"
        );


    const dayElement =
        document.getElementById(
            "dashboard-day"
        );


    if (!dateElement || !dayElement) {
        return;
    }


    const now =
        new Date();


    dayElement.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                weekday: "long"
            }
        );


    dateElement.textContent =
        now.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric"
            }
        );
}


// =====================================================
// UPDATE DASHBOARD
// =====================================================

function updateDashboard() {

    updateDashboardDate();

    updateDashboardSubjects();

    updateDashboardGoals();

    updateDashboardStats();

    updateDashboardActivity();
}


// =====================================================
// DASHBOARD SUBJECTS
// =====================================================

function updateDashboardSubjects() {

    const container =
        document.getElementById(
            "dashboard-subjects"
        );


    const countElement =
        document.getElementById(
            "dashboard-subject-count"
        );


    if (!container) {
        return;
    }


    let subjects = [];


    try {

        if (
            typeof DEFAULT_DATA !== "undefined" &&
            Array.isArray(DEFAULT_DATA.subjects)
        ) {

            subjects =
                DEFAULT_DATA.subjects;
        }

    } catch (error) {

        console.log(
            "Subject data unavailable."
        );
    }


    // Load saved subjects

    try {

        const saved =
            localStorage.getItem(
                "master_sahab_data"
            );


        if (saved) {

            const data =
                JSON.parse(saved);


            if (
                data &&
                Array.isArray(data.subjects)
            ) {

                subjects =
                    data.subjects;
            }
        }

    } catch (error) {

        console.log(
            "Could not load saved subjects."
        );
    }


    if (countElement) {

        countElement.textContent =
            subjects.length;
    }


    if (!subjects.length) {

        container.innerHTML = `

            <div class="dashboard-empty">

                <span>📚</span>

                <p>No subjects added yet.</p>

            </div>

        `;

        return;
    }


    container.innerHTML =
        subjects
            .slice(0, 4)
            .map((subject, index) => {

                const name =
                    subject.name ||
                    `Subject ${index + 1}`;


                const icon =
                    subject.icon ||
                    "📘";


                const progress =
                    Number(
                        subject.progress || 0
                    );


                return `

                    <div
                        class="dashboard-subject"
                        onclick="openSubjectFromDashboard('${subject.id}')"
                        role="button"
                        tabindex="0"
                        title="View details for ${escapeHTML(name)}">

                        <div class="dashboard-subject-top">

                            <span class="dashboard-subject-icon">
                                ${escapeHTML(icon)}
                            </span>

                            <span class="dashboard-subject-name">
                                ${escapeHTML(name)}
                            </span>

                        </div>


                        <div class="dashboard-subject-progress">

                            <span
                                style="width:${Math.min(
                                    Math.max(progress, 0),
                                    100
                                )}%">
                            </span>

                        </div>

                    </div>

                `;

            })
            .join("");
}


// =====================================================
// DASHBOARD GOALS
// =====================================================

function updateDashboardGoals() {

    const list =
        document.getElementById(
            "dashboard-goal-list"
        );


    const progressBar =
        document.getElementById(
            "dashboard-goal-progress"
        );


    const percentage =
        document.getElementById(
            "goal-percentage"
        );


    const progressText =
        document.getElementById(
            "goal-progress-text"
        );


    const goalCount =
        document.getElementById(
            "dashboard-goal-count"
        );


    if (!list) {
        return;
    }


    let goals = [];


    try {

        const saved =
            localStorage.getItem(
                "master_sahab_data"
            );


        if (saved) {

            const data =
                JSON.parse(saved);


            if (
                data &&
                Array.isArray(data.goals)
            ) {

                goals =
                    data.goals;
            }
        }

    } catch (error) {

        console.log(
            "Goal data unavailable."
        );
    }


    if (!goals.length) {

        if (progressBar) {
            progressBar.style.width = "0%";
        }


        if (percentage) {
            percentage.textContent = "0%";
        }


        if (progressText) {

            progressText.textContent =
                "0 of 0 completed";
        }


        if (goalCount) {
            goalCount.textContent = "0";
        }


        list.innerHTML = `

            <div class="dashboard-empty">

                <span>🎯</span>

                <p>No goals added yet.</p>

                <button onclick="showPage('goals')">
                    Add Today's Goal
                </button>

            </div>

        `;

        return;
    }


    const completed =
        goals.filter(
            goal =>
                goal.completed === true ||
                goal.done === true
        ).length;


    const total =
        goals.length;


    const percent =
        Math.round(
            (completed / total) * 100
        );


    if (progressBar) {

        progressBar.style.width =
            `${percent}%`;
    }


    if (percentage) {

        percentage.textContent =
            `${percent}%`;
    }


    if (progressText) {

        progressText.textContent =
            `${completed} of ${total} completed`;
    }


    if (goalCount) {

        goalCount.textContent =
            completed;
    }


    list.innerHTML =
        goals
            .slice(0, 5)
            .map((goal, index) => {

                const text =
                    goal.title ||
                    goal.text ||
                    goal.name ||
                    `Goal ${index + 1}`;


                const done =
                    goal.completed === true ||
                    goal.done === true;


                return `

                    <div
                        class="dashboard-goal-item
                        ${done ? "completed" : ""}">

                        <input
                            type="checkbox"
                            ${done ? "checked" : ""}
                            onchange="toggleDashboardGoal(${index})">

                        <span>
                            ${escapeHTML(text)}
                        </span>

                    </div>

                `;

            })
            .join("");
}


// =====================================================
// DASHBOARD GOAL TOGGLE
// =====================================================

function toggleDashboardGoal(index) {

    try {

        const saved =
            localStorage.getItem(
                "master_sahab_data"
            );


        if (!saved) {
            return;
        }


        const data =
            JSON.parse(saved);


        if (
            !data ||
            !Array.isArray(data.goals) ||
            !data.goals[index]
        ) {
            return;
        }


        const goal =
            data.goals[index];


        if (
            typeof goal.completed !==
            "undefined"
        ) {

            goal.completed =
                !goal.completed;

        } else {

            goal.done =
                !goal.done;
        }


        localStorage.setItem(
            "master_sahab_data",
            JSON.stringify(data)
        );


        updateDashboard();

        if (typeof renderGoalsPage === "function") {
            renderGoalsPage();
        }

        if (typeof renderProgressPage === "function") {
            renderProgressPage();
        }

    } catch (error) {

        console.error(
            "Goal update error:",
            error
        );
    }
}


// =====================================================
// DASHBOARD STATS
// =====================================================

function updateDashboardStats() {

    const chatCount =
        document.getElementById(
            "dashboard-chat-count"
        );


    if (!chatCount) {
        return;
    }


    try {

        const chats =
            getSavedChats();


        let messages = 0;


        chats.forEach(chat => {

            if (
                Array.isArray(
                    chat.messages
                )
            ) {

                messages +=
                    chat.messages.filter(
                        item =>
                            item.role === "user"
                    ).length;
            }

        });


        chatCount.textContent =
            messages;

    } catch (error) {

        chatCount.textContent =
            "0";
    }
}


// =====================================================
// DASHBOARD ACTIVITY
// =====================================================

function updateDashboardActivity() {

    const container =
        document.getElementById(
            "dashboard-activity"
        );


    if (!container) {
        return;
    }


    let activities = [];


    try {

        const saved =
            localStorage.getItem(
                "master_sahab_data"
            );


        if (saved) {

            const data =
                JSON.parse(saved);


            if (
                Array.isArray(
                    data.activities
                )
            ) {

                activities =
                    data.activities;
            }
        }

    } catch (error) {

        console.log(
            "Activity data unavailable."
        );
    }


    if (!activities.length) {

        container.innerHTML = `

            <div class="activity-empty">

                Start studying to see your activity here.

            </div>

        `;

        return;
    }


    container.innerHTML =
        activities
            .slice(-5)
            .reverse()
            .map(activity => {

                return `

                    <div class="activity-item">

                        <div class="activity-icon">
                            ${escapeHTML(
                                activity.icon || "📚"
                            )}
                        </div>

                        <div class="activity-text">

                            <strong>
                                ${escapeHTML(
                                    activity.text ||
                                    "Study activity"
                                )}
                            </strong>

                            <small>
                                ${escapeHTML(
                                    activity.time ||
                                    "Recently"
                                )}
                            </small>

                        </div>

                    </div>

                `;

            })
            .join("");
}


// =====================================================
// MOTIVATION
// =====================================================

function changeMotivation() {

    const element =
        document.getElementById(
            "dashboard-motivation"
        );


    if (!element) {
        return;
    }


    const randomIndex =
        Math.floor(
            Math.random() *
            DASHBOARD_MOTIVATIONS.length
        );


    element.style.opacity = "0";


    setTimeout(() => {

        element.textContent =
            DASHBOARD_MOTIVATIONS[
                randomIndex
            ];


        element.style.opacity =
            "1";

    }, 180);
}



// =====================================================
// DASHBOARD SYNC
// =====================================================

function updateDashboardAfterSubjectChange() {

    try {

        if (
            typeof updateDashboard ===
            "function"
        ) {

            updateDashboard();
        }


        if (
            typeof updateDashboardSubjects ===
            "function"
        ) {

            updateDashboardSubjects();
        }


        if (
            typeof updateDashboardStats ===
            "function"
        ) {

            updateDashboardStats();
        }


        if (
            typeof renderGoalsPage ===
            "function"
        ) {

            renderGoalsPage();
        }


        if (
            typeof renderProgressPage ===
            "function"
        ) {

            renderProgressPage();
        }

    } catch (error) {

        console.log(
            "Dashboard sync:",
            error
        );
    }
}

