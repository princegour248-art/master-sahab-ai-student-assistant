// =====================================================
// APP BOOTSTRAPPER & MASTER INITIALIZER
// Source: frontend/js/app.js
// =====================================================

document.addEventListener("DOMContentLoaded", function () {
    // 1. Show saved active page or default page (Dashboard)
    let initialPage = "dashboard";
    try {
        const hash = window.location.hash.replace("#", "").trim();
        if (hash === "chat" || hash === "workspace" || hash === "assignments" || hash === "subjects" || hash === "goals" || hash === "progress") {
            initialPage = hash;
        } else {
            const savedLocal = localStorage.getItem("active_page");
            const savedSession = sessionStorage.getItem("active_page");
            if (savedLocal) initialPage = savedLocal;
            else if (savedSession) initialPage = savedSession;
        }
    } catch (e) {
        console.warn("Storage error:", e);
    }

    if (typeof showPage === "function") {
        showPage(initialPage);
    }

    // 2. Set today's date
    if (typeof setTodayDate === "function") {
        setTodayDate();
    }

    // 3. Update dashboard widgets
    if (typeof updateDashboard === "function") {
        updateDashboard();
    }

    // 4. Render subjects
    if (typeof renderSubjects === "function") {
        renderSubjects();
    }

    // 5. Chat starts blank after refresh
    window.currentChat = [];
    currentChat = [];
    window.currentChatId = null;
    currentChatId = null;

    // 6. Prime chat history
    if (typeof renderHistory === "function") {
        renderHistory();
    }

    // 7. Prime goals & assignments & progress in background
    if (typeof renderGoalsPage === "function") {
        renderGoalsPage();
    }
    if (typeof renderAssignmentsPage === "function") {
        renderAssignmentsPage();
    }
    if (typeof renderProgressPage === "function") {
        renderProgressPage();
    }
});

// Window Load Safety Update
window.addEventListener("load", function () {
    if (typeof updateDashboard === "function") {
        updateDashboard();
    }
    if (typeof renderSubjects === "function") {
        renderSubjects();
    }
    if (typeof renderHistory === "function") {
        renderHistory();
    }
});