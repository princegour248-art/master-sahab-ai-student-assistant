// =====================================================
// CLOSE MODALS ON BACKGROUND CLICK
// =====================================================

document.addEventListener(
    "click",
    function(event) {

        const subjectModal =
            document.getElementById(
                "subject-modal"
            );


        const detailsModal =
            document.getElementById(
                "subject-details-modal"
            );


        if (
            event.target ===
            subjectModal
        ) {

            closeSubjectModal();
        }


        if (
            event.target ===
            detailsModal
        ) {

            closeSubjectDetails();
        }

    }
);


// =====================================================
// ESC KEY - CLOSE MODALS
// =====================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") {
            return;
        }


        closeSubjectModal();

        closeSubjectDetails();

        closePlusMenu();
    }
);


// =====================================================
// THEME SYSTEM
// Sage Green + Warm Cream ONLY
// Dark / Obsidian theme completely removed
// =====================================================

const MASTER_SAHAB_THEME =
    "sage";


function setAppTheme() {

    // Always use Sage Green theme

    document.documentElement.setAttribute(
        "data-theme",
        MASTER_SAHAB_THEME
    );


    // Remove old dark theme if it exists

    localStorage.setItem(
        "master_sahab_theme",
        MASTER_SAHAB_THEME
    );


    // Update theme buttons if present

    document
        .querySelectorAll(".theme-opt")
        .forEach(button => {

            const onclickAttr =
                button.getAttribute(
                    "onclick"
                ) || "";


            if (
                onclickAttr.includes(
                    "'sage'"
                )
            ) {

                button.classList.add(
                    "active"
                );

            } else {

                button.classList.remove(
                    "active"
                );
            }

        });
}


// =====================================================
// FORCE SAGE THEME
// =====================================================

(function initializeMasterSahabTheme() {

    // Remove old saved Obsidian theme

    const savedTheme =
        localStorage.getItem(
            "master_sahab_theme"
        );


    if (
        savedTheme === "obsidian" ||
        savedTheme === "dark" ||
        savedTheme === "royal"
    ) {

        localStorage.setItem(
            "master_sahab_theme",
            MASTER_SAHAB_THEME
        );
    }


    // Always Sage

    document.documentElement.setAttribute(
        "data-theme",
        MASTER_SAHAB_THEME
    );


    window.addEventListener(
        "DOMContentLoaded",
        function() {

            setAppTheme();

        }
    );


    if (
        document.readyState ===
            "complete" ||
        document.readyState ===
            "interactive"
    ) {

        setAppTheme();
    }

})();

