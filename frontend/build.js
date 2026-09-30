/**
 * ALPHA - AI STUDENT ASSISTANT
 * Automatic Section Synchronizer & Builder
 * 
 * Usage:
 *   node build.js         -> Stitches all sections/*.html into index.html once
 *   node build.js --watch -> Watches sections/ and rebuilds index.html automatically on file save
 */

const fs = require('fs');
const path = require('path');

const SECTIONS_DIR = path.join(__dirname, 'sections');
const OUTPUT_FILE = path.join(__dirname, 'index.html');

function readSection(fileName) {
    const filePath = path.join(SECTIONS_DIR, fileName);
    if (!fs.existsSync(filePath)) {
        console.warn(`[Warning] Section file not found: ${fileName}`);
        return '';
    }
    return fs.readFileSync(filePath, 'utf8').trim();
}

function buildIndexHtml() {
    const sidebar = readSection('sidebar.html');
    const dashboard = readSection('dashboard.html');
    const chat = readSection('chat.html');
    const subjects = readSection('subjects.html');
    const assignments = readSection('assignments.html');
    const goals = readSection('goals.html');
    const progress = readSection('progress.html');
    const modals = readSection('modals.html');

    const htmlContent = `<!DOCTYPE html>
<html lang="en" data-theme="royal">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>Alpha - AI Student Assistant</title>

    <!-- =====================================================
         MODULAR STYLESHEETS (Organized by Feature/Section)
         ===================================================== -->
    <link rel="stylesheet" href="css/main.css?v=3.5">
    <link rel="stylesheet" href="css/layout.css?v=3.5">
    <link rel="stylesheet" href="css/dashboard.css?v=3.5">
    <link rel="stylesheet" href="css/chat.css?v=3.5">
    <link rel="stylesheet" href="css/subjects.css?v=3.5">
    <link rel="stylesheet" href="css/assignments.css?v=3.5">
    <link rel="stylesheet" href="css/goals.css?v=3.5">
    <link rel="stylesheet" href="css/progress.css?v=3.5">
    <link rel="stylesheet" href="css/modals.css?v=3.5">
    <!-- Backward compatibility fallback -->
    <link rel="stylesheet" href="style.css?v=3.5">
</head>


<body>

    <!-- =====================================================
         APP CONTAINER
         ===================================================== -->
    <div class="app-container">

        <!-- =================================================
             1. SIDEBAR (Source: frontend/sections/sidebar.html)
             ================================================= -->
${sidebar.split('\n').map(l => '        ' + l).join('\n')}


        <!-- =================================================
             MAIN CONTENT WRAPPER
             ================================================= -->
        <main class="main-content">

            <!-- =================================================
                 2. DASHBOARD (Source: frontend/sections/dashboard.html)
                 ================================================= -->
${dashboard.split('\n').map(l => '            ' + l).join('\n')}


            <!-- =================================================
                 3. AI CHAT (Source: frontend/sections/chat.html)
                 ================================================= -->
${chat.split('\n').map(l => '            ' + l).join('\n')}


            <!-- =================================================
                 4. SUBJECTS (Source: frontend/sections/subjects.html)
                 ================================================= -->
${subjects.split('\n').map(l => '            ' + l).join('\n')}


            <!-- =================================================
                 5. ASSIGNMENTS (Source: frontend/sections/assignments.html)
                 ================================================= -->
${assignments.split('\n').map(l => '            ' + l).join('\n')}


            <!-- =================================================
                 6. DAILY GOALS (Source: frontend/sections/goals.html)
                 ================================================= -->
${goals.split('\n').map(l => '            ' + l).join('\n')}


            <!-- =================================================
                 7. PROGRESS & ANALYTICS (Source: frontend/sections/progress.html)
                 ================================================= -->
${progress.split('\n').map(l => '            ' + l).join('\n')}

        </main>

    </div>


    <!-- =====================================================
         8. MODALS & POPUPS (Source: frontend/sections/modals.html)
         ===================================================== -->
${modals.split('\n').map(l => '    ' + l).join('\n')}


    <!-- =====================================================
         MODULAR JAVASCRIPT ARCHITECTURE
         Separated by section for clean maintainability
         ===================================================== -->
    <script src="js/config.js?v=3.5"></script>
    <script src="js/navigation.js?v=3.5"></script>
    <script src="js/dashboard.js?v=3.5"></script>
    <script src="js/chat.js?v=3.5"></script>
    <script src="js/subjects.js?v=3.5"></script>
    <script src="js/assignments.js?v=3.5"></script>
    <script src="js/goals.js?v=3.5"></script>
    <script src="js/progress.js?v=3.5"></script>
    <script src="js/modals.js?v=3.5"></script>
    <script src="js/app.js?v=3.5"></script>

</body>

</html>
`;

    fs.writeFileSync(OUTPUT_FILE, htmlContent, 'utf8');
    console.log(`[Success] index.html updated successfully at ${new Date().toLocaleTimeString()}!`);
}

// Check arguments
const isWatch = process.argv.includes('--watch');

buildIndexHtml();

if (isWatch) {
    console.log('[Watch Mode] Watching frontend/sections/ for changes...');
    fs.watch(SECTIONS_DIR, (eventType, fileName) => {
        if (fileName && fileName.endsWith('.html')) {
            console.log(`[Change Detected] ${fileName} modified. Rebuilding index.html...`);
            try {
                buildIndexHtml();
            } catch (err) {
                console.error('[Error rebuilding]', err);
            }
        }
    });
}
