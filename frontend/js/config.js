
// =====================================================
// ALPHA - AI STUDENT ASSISTANT - MAIN JAVASCRIPT
// Dashboard + Chat + History + Subjects + Assignments + Goals + Progress
// Clean White + Professional Blue Theme
// =====================================================


const API_URL = "http://127.0.0.1:8000";


// =====================================================
// CHAT HISTORY SETTINGS
// =====================================================

var HISTORY_KEY = "master_sahab_chat_history";
window.HISTORY_KEY = HISTORY_KEY;

var currentChat = [];
var currentChatId = null;
window.currentChat = currentChat;
window.currentChatId = currentChatId;



// =====================================================
// SUBJECT MANAGEMENT SYSTEM
// =====================================================

const SUBJECT_DATA_KEY =
    "master_sahab_data";

let editingSubjectId =
    null;

let activeSubjectDetailsId =
    null;

// Clean & professional SVG icon generator for academic subjects
function getSubjectIconSVG(name = "", iconEmoji = "", size = 20) {
    const n = String(name || "").toLowerCase();
    const e = String(iconEmoji || "");

    if (n.includes("java") || e === "☕" || e === "java") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`;
    }
    if (n.includes("python") || e === "🐍" || e === "python") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="4 17 10 11 4 5"/><line x1="12" y1="19" x2="20" y2="19"/></svg>`;
    }
    if (n.includes("web") || n.includes("frontend") || n.includes("html") || n.includes("css") || e === "🌐" || e === "web") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`;
    }
    if (n.includes("dbms") || n.includes("database") || n.includes("sql") || e === "🗄️" || e === "dbms" || e === "sql") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3"/><path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5"/></svg>`;
    }
    if (n.includes("data") || n.includes("ai") || n.includes("ml") || n.includes("brain") || n.includes("neural") || e === "🧠" || e === "ai") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>`;
    }
    if (n.includes("stat") || n.includes("chart") || n.includes("analytics") || e === "📊" || e === "stats") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>`;
    }
    if (n.includes("math") || n.includes("calculus") || n.includes("algebra") || n.includes("geometry") || e === "📐" || e === "math") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m2 22 1-1h18l1 1"/><path d="M21 21 8.5 8.5"/><path d="m3 3 7 7"/><circle cx="12" cy="5" r="2"/></svg>`;
    }
    if (n.includes("science") || n.includes("physics") || n.includes("chemistry") || n.includes("bio") || n.includes("lab") || e === "🔬" || e === "science") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 2v7.31L4.14 20.3A1 1 0 0 0 5 21.75h14a1 1 0 0 0 .86-1.45L14 9.31V2"/><path d="M8.5 2h7"/><path d="M7 16h10"/></svg>`;
    }
    if (n.includes("computer") || n.includes("system") || n.includes("tech") || n.includes("software") || e === "💻" || e === "computer") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`;
    }
    if (n.includes("english") || n.includes("history") || n.includes("literature") || n.includes("writing") || e === "📝" || e === "writing") {
        return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>`;
    }
    // Default fallback: Book open SVG
    return `<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1-2.5-2.5Z"/><path d="M6 6h10"/><path d="M6 10h10"/></svg>`;
}

const DEFAULT_INITIAL_SUBJECTS = [
    {
        id: "subject_java_core",
        name: "Java Programming",
        icon: "☕",
        description: "Core Java concepts, Object-Oriented Programming, Collections Framework, Exception Handling, and Multithreading.",
        syllabus: [
            "Unit 1: Java Syntax, Data Types & Control Flow",
            "Unit 2: OOP Principles - Classes, Inheritance & Polymorphism",
            "Unit 3: Java Collections Framework & Generics",
            "Unit 4: Multithreading, Concurrency & Stream API"
        ],
        topics: [
            { id: "top_j1", name: "Classes, Objects & Constructors", completed: true },
            { id: "top_j2", name: "Inheritance & Method Overriding", completed: true },
            { id: "top_j3", name: "Abstract Classes & Interfaces", completed: true },
            { id: "top_j4", name: "Exception Handling with try-catch", completed: false },
            { id: "top_j5", name: "ArrayList, HashMap & HashSets", completed: false },
            { id: "top_j6", name: "Lambda Expressions & Streams", completed: false }
        ],
        progress: 50,
        materials: [
            { id: "mat_j1", name: "Java_OOP_CheatSheet.pdf", type: "PDF", icon: "📄", size: "1.8 MB", date: "Recent" }
        ],
        createdAt: new Date().toISOString()
    },
    {
        id: "subject_python_ai",
        name: "Python & Data Science",
        icon: "🐍",
        description: "Python programming fundamentals, NumPy arrays, Pandas data manipulation, and introductory machine learning algorithms.",
        syllabus: [
            "Unit 1: Python Fundamentals, Functions & Modules",
            "Unit 2: Data Structures - Lists, Dicts, Tuples & Sets",
            "Unit 3: Numerical Computing with NumPy & Pandas",
            "Unit 4: Data Visualization & ML Model Basics"
        ],
        topics: [
            { id: "top_p1", name: "Variables, Loops & Functions", completed: true },
            { id: "top_p2", name: "List Comprehensions & Dictionaries", completed: true },
            { id: "top_p3", name: "NumPy Arrays & Matrix Operations", completed: false },
            { id: "top_p4", name: "Pandas DataFrames & Data Cleaning", completed: false },
            { id: "top_p5", name: "Matplotlib & Seaborn Visualizations", completed: false }
        ],
        progress: 40,
        materials: [
            { id: "mat_p1", name: "Python_Data_Structures_Summary.pdf", type: "PDF", icon: "📄", size: "2.1 MB", date: "Recent" }
        ],
        createdAt: new Date().toISOString()
    },
    {
        id: "subject_web_dev",
        name: "Full Stack Web Development",
        icon: "🌐",
        description: "Modern frontend and backend development covering semantic HTML5, CSS3, modern JavaScript ES6+, APIs, and Node.js.",
        syllabus: [
            "Unit 1: HTML5 Semantics & Responsive CSS3 (Flexbox/Grid)",
            "Unit 2: JavaScript ES6+, DOM Manipulation & Events",
            "Unit 3: Asynchronous JS, Fetch API & REST Endpoints",
            "Unit 4: Full Stack Architecture & State Management"
        ],
        topics: [
            { id: "top_w1", name: "Responsive Layouts with Flexbox & Grid", completed: true },
            { id: "top_w2", name: "JavaScript DOM Traversal & Event Handling", completed: true },
            { id: "top_w3", name: "Promises, Async/Await & REST APIs", completed: false },
            { id: "top_w4", name: "Component Architecture & State", completed: false }
        ],
        progress: 50,
        materials: [],
        createdAt: new Date().toISOString()
    },
    {
        id: "subject_dbms",
        name: "Database Management Systems",
        icon: "🗄️",
        description: "Relational database concepts, SQL querying, schema normalization (1NF-BCNF), transactions, ACID properties, and indexing.",
        syllabus: [
            "Unit 1: Relational Data Model & ER Diagrams",
            "Unit 2: SQL DDL, DML, Joins & Subqueries",
            "Unit 3: Normalization & Functional Dependencies",
            "Unit 4: Transaction Management & Concurrency Control"
        ],
        topics: [
            { id: "top_d1", name: "Entity-Relationship (ER) Modeling", completed: true },
            { id: "top_d2", name: "Complex SQL Joins & Group By", completed: false },
            { id: "top_d3", name: "Normalization: 1NF, 2NF, 3NF, BCNF", completed: false },
            { id: "top_d4", name: "ACID Properties & Transaction Isolation", completed: false }
        ],
        progress: 25,
        materials: [],
        createdAt: new Date().toISOString()
    }
];

const DEFAULT_INITIAL_GOALS = [
    {
        id: "goal_init_1",
        text: "Complete Java Exception Handling unit & practice try-catch",
        category: "Java Programming",
        priority: "high",
        completed: false,
        createdAt: new Date().toISOString()
    },
    {
        id: "goal_init_2",
        text: "Practice 5 SQL queries on Primary & Foreign Keys",
        category: "Database Systems",
        priority: "medium",
        completed: true,
        createdAt: new Date().toISOString()
    },
    {
        id: "goal_init_3",
        text: "Build a responsive flexbox card grid with modern CSS",
        category: "Full Stack Web Development",
        priority: "normal",
        completed: false,
        createdAt: new Date().toISOString()
    }
];

const DEFAULT_INITIAL_ASSIGNMENTS = [
    {
        id: "assign_init_1",
        title: "OOP Polymorphism & Abstract Classes Lab",
        subject: "Java Programming",
        dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        type: "Homework",
        priority: "high",
        progress: 65,
        status: "pending",
        notes: "Implement Vehicle and ElectricCar inheritance hierarchy with unit tests in JUnit 5.",
        createdAt: new Date().toISOString()
    },
    {
        id: "assign_init_2",
        title: "Pandas Data Cleaning & Titanic Dataset Analysis",
        subject: "Python for Data Science",
        dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        type: "Project",
        priority: "urgent",
        progress: 30,
        status: "pending",
        notes: "Handle missing values, perform exploratory data analysis, and produce 4 correlation charts.",
        createdAt: new Date().toISOString()
    },
    {
        id: "assign_init_3",
        title: "Responsive Dashboard Layout using CSS Grid",
        subject: "Full Stack Web Development",
        dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
        type: "Assignment",
        priority: "medium",
        progress: 100,
        status: "completed",
        notes: "Designed fluid container queries and verified cross-browser compatibility.",
        createdAt: new Date().toISOString()
    }
];

// =====================================================
// GET MASTER DATA
// =====================================================

function getMasterData() {

    let data = {};

    try {

        data =
            JSON.parse(
                localStorage.getItem(
                    SUBJECT_DATA_KEY
                )
            ) || {};

    } catch (error) {

        data = {};
    }

    if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
        data.subjects = JSON.parse(JSON.stringify(DEFAULT_INITIAL_SUBJECTS));
        saveMasterData(data);
    }

    if (!Array.isArray(data.goals)) {
        data.goals = JSON.parse(JSON.stringify(DEFAULT_INITIAL_GOALS));
        saveMasterData(data);
    }

    if (!Array.isArray(data.assignments)) {
        data.assignments = JSON.parse(JSON.stringify(DEFAULT_INITIAL_ASSIGNMENTS));
        saveMasterData(data);
    }

    if (!Array.isArray(data.activities)) {
        data.activities = [];
    }

    return data;
}


// =====================================================
// SAVE MASTER DATA
// =====================================================

function saveMasterData(data) {

    localStorage.setItem(
        SUBJECT_DATA_KEY,
        JSON.stringify(data)
    );
}


// =====================================================
// CREATE SUBJECT ID
// =====================================================

function createSubjectId() {

    return (
        "subject_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


// =====================================================
// CALCULATE SUBJECT PROGRESS
// =====================================================

function calculateSubjectProgress(subject) {

    if (
        !subject.topics ||
        subject.topics.length === 0
    ) {
        return 0;
    }


    const completed =
        subject.topics.filter(
            topic =>
                topic.completed === true
        ).length;


    return Math.round(
        (completed /
            subject.topics.length) *
        100
    );
}


// =====================================================
// ESCAPE SUBJECT HTML
// =====================================================

function escapeSubjectHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}



// =====================================================
// TOAST NOTIFICATION HELPER
// =====================================================

function showToast(message) {
    let toast = document.querySelector(".subject-toast-msg");
    if (!toast) {
        toast = document.createElement("div");
        toast.className = "subject-toast-msg";
        document.body.appendChild(toast);
    }

    toast.innerHTML = `<span>✨</span> <span>${escapeSubjectHTML(message)}</span>`;
    toast.style.display = "flex";

    if (window._subjectToastTimeout) {
        clearTimeout(window._subjectToastTimeout);
    }

    window._subjectToastTimeout = setTimeout(() => {
        if (toast) {
            toast.style.display = "none";
        }
    }, 3200);
}

