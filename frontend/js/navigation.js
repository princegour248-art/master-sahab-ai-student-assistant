// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageId, button = null) {

    if (pageId === "workspace") {
        pageId = "assignments";
    }

    const actualPageId = pageId + "-page";

    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active");
        page.style.display = "none";
    });

    const selectedPage = document.getElementById(actualPageId);

    if (!selectedPage) {
        console.error("Page not found:", actualPageId);
        return;
    }

    selectedPage.classList.add("active");
    selectedPage.style.display = "block";

    // Remember active page for refresh/reload
    try {
        sessionStorage.setItem("active_page", pageId);
        localStorage.setItem("active_page", pageId);
    } catch (e) {
        console.warn("Could not save active page:", e);
    }


    // Sidebar active button

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    } else {
        const correspondingBtn =
            document.querySelector(`.nav-item[onclick*="'${pageId}'"]`) ||
            (pageId === "assignments" ? document.querySelector(`.nav-item[data-title="Workspace"]`) : null);

        if (correspondingBtn) {
            correspondingBtn.classList.add("active");
        }
    }


    // Chat history

    if (pageId === "chat") {
        renderHistory();
    }


    // Refresh subjects when opened

    if (
        pageId === "subjects" &&
        typeof renderSubjects === "function"
    ) {
        renderSubjects();
    }


    // Refresh dashboard

    if (
        pageId === "dashboard" &&
        typeof updateDashboard === "function"
    ) {
        updateDashboard();
    }


    // Refresh goals

    if (
        pageId === "goals" &&
        typeof renderGoalsPage === "function"
    ) {
        renderGoalsPage();
    }


    // Refresh assignments

    if (
        pageId === "assignments" &&
        typeof renderAssignmentsPage === "function"
    ) {
        renderAssignmentsPage();
    }


    // Refresh progress

    if (
        pageId === "progress" &&
        typeof renderProgressPage === "function"
    ) {
        renderProgressPage();
    }
}

window.showPage = showPage;

