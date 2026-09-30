// =========================================================
// ALPHA - AI STUDENT ASSISTANT
// Modular Script Loader / Fallback
// All modular section scripts are located in frontend/js/
// =========================================================

(function () {
    const modules = [
        "js/config.js",
        "js/navigation.js",
        "js/dashboard.js",
        "js/chat.js",
        "js/subjects.js",
        "js/assignments.js",
        "js/goals.js",
        "js/progress.js",
        "js/modals.js",
        "js/app.js"
    ];

    // If loaded as a standalone script tag without the modular tags:
    if (!window.__ALPHA_MODULES_LOADED__) {
        window.__ALPHA_MODULES_LOADED__ = true;

        // Check if config.js was already loaded directly
        if (typeof getMasterData === "undefined") {
            modules.forEach(src => {
                const s = document.createElement("script");
                s.src = src;
                s.async = false;
                document.head.appendChild(s);
            });
        }
    }
})();