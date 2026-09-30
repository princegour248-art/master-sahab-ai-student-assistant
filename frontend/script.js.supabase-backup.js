// ======================================================
// MASTER SAHAB - SUPABASE CHAT HISTORY
// ======================================================

const API_BASE_URL = "http://127.0.0.1:8000";

// Get or create a permanent user ID for this browser
function getMasterSahabUserId() {
    let userId = localStorage.getItem("master_sahab_user_id");

    if (!userId) {
        userId = crypto.randomUUID();
        localStorage.setItem("master_sahab_user_id", userId);
    }

    return userId;
}

const MASTER_SAHAB_USER_ID = getMasterSahabUserId();

console.log("Master Sahab User ID:", MASTER_SAHAB_USER_ID);


// ======================================================
// LOAD CHAT HISTORY FROM BACKEND
// ======================================================

async function loadChatHistoryFromSupabase() {

    try {

        const response = await fetch(
            `${API_BASE_URL}/chat/history/${MASTER_SAHAB_USER_ID}`
        );

        if (!response.ok) {
            throw new Error(`History request failed: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success) {
            console.error("History loading failed:", data.error);
            return [];
        }

        console.log(
            "Chat history loaded:",
            data.history
        );

        return data.history || [];

    } catch (error) {

        console.error(
            "Could not load chat history:",
            error
        );

        return [];
    }
}




/* =====================================================
   PROFESSIONAL ICON HELPER (FONT AWESOME 6)
===================================================== */
function formatIcon(icon, defaultIcon = "fa-solid fa-book-open") {
    if (!icon) return `<i class="${defaultIcon}"></i>`;
    if (typeof icon !== "string") return icon;
    if (icon.startsWith("<i")) return icon;
    if (icon.startsWith("fa-")) return `<i class="${icon}"></i>`;
    
    const emojiMap = {
        "☕": "fa-brands fa-java",
        "🐍": "fa-brands fa-python",
        "💻": "fa-solid fa-laptop-code",
        "🗄️": "fa-solid fa-database",
        "🗄": "fa-solid fa-database",
        "📊": "fa-solid fa-chart-line",
        "🤖": "fa-solid fa-robot",
        "🌐": "fa-solid fa-globe",
        "📚": "fa-solid fa-book-open",
        "📘": "fa-solid fa-book",
        "📕": "fa-solid fa-file-pdf",
        "📖": "fa-solid fa-book-bookmark",
        "⚙️": "fa-solid fa-gear",
        "⚙": "fa-solid fa-gear",
        "🧮": "fa-solid fa-calculator",
        "🎯": "fa-solid fa-bullseye",
        "🔥": "fa-solid fa-fire",
        "⏱️": "fa-solid fa-stopwatch",
        "⏱": "fa-solid fa-stopwatch",
        "🏆": "fa-solid fa-trophy",
        "🎓": "fa-solid fa-graduation-cap",
        "💡": "fa-solid fa-lightbulb",
        "✨": "fa-solid fa-wand-magic-sparkles",
        "📝": "fa-solid fa-pen-to-square",
        "📋": "fa-solid fa-clipboard-list",
        "📁": "fa-solid fa-folder",
        "📂": "fa-solid fa-folder-open",
        "📄": "fa-solid fa-file-lines",
        "🖼️": "fa-solid fa-file-image",
        "🖼": "fa-solid fa-file-image",
        "🔗": "fa-solid fa-link",
        "⚡": "fa-solid fa-bolt",
        "💬": "fa-solid fa-comments",
        "🏠": "fa-solid fa-house",
        "🔍": "fa-solid fa-magnifying-glass",
        "🎤": "fa-solid fa-microphone",
        "📷": "fa-solid fa-camera",
        "📤": "fa-solid fa-cloud-arrow-up",
        "📥": "fa-solid fa-inbox",
        "🗑️": "fa-solid fa-trash-can",
        "🗑": "fa-solid fa-trash-can",
        "✏️": "fa-solid fa-pen",
        "✏": "fa-solid fa-pen",
        "👁️": "fa-solid fa-eye",
        "👁": "fa-solid fa-eye",
        "🧹": "fa-solid fa-broom",
        "💾": "fa-solid fa-floppy-disk",
        "✓": "fa-solid fa-check",
        "✅": "fa-solid fa-circle-check",
        "❌": "fa-solid fa-circle-xmark",
        "⚠️": "fa-solid fa-triangle-exclamation",
        "👑": "fa-solid fa-crown",
        "🌲": "fa-solid fa-tree",
        "🌌": "fa-solid fa-moon",
        "🌟": "fa-solid fa-star",
        "🎉": "fa-solid fa-gift",
        "💪": "fa-solid fa-dumbbell",
        "🧠": "fa-solid fa-brain",
        "🌱": "fa-solid fa-seedling",
        "🔔": "fa-solid fa-bell",
        "🏅": "fa-solid fa-award"
    };
    
    if (emojiMap[icon]) {
        return `<i class="${emojiMap[icon]}"></i>`;
    }
    return icon;
}

// =====================================================
// ALPHA - MAIN JAVASCRIPT
// Dashboard + Chat + History + Subjects + Goals + Progress
// =====================================================

const API_URL = "http://127.0.0.1:8000";


// =====================================================
// CHAT HISTORY SETTINGS
// =====================================================

const HISTORY_KEY = "master_sahab_chat_history";

let currentChat = [];
let currentChatId = null;


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageId, button = null) {

    const actualPageId = pageId + "-page";

    document.querySelectorAll(".page").forEach(page => {
        page.style.display = "none";
    });

    const selectedPage = document.getElementById(actualPageId);

    if (!selectedPage) {
        console.error("Page not found:", actualPageId);
        return;
    }

    selectedPage.style.display = "block";


    // Sidebar active button

    document.querySelectorAll(".nav-item").forEach(item => {
        item.classList.remove("active");
    });

    if (button) {
        button.classList.add("active");
    }


    // Chat page open hone par history show karo
    if (pageId === "chat") {
        renderHistory();
    } else if (pageId === "goals") {
        renderGoalsPage();
    } else if (pageId === "progress") {
        renderProgressPage();
    } else if (pageId === "homework") {
        renderHomeworkPage();
    }
}


// =====================================================
// GET ALL SAVED CHATS
// =====================================================

function getSavedChats() {

    try {

        const saved =
            localStorage.getItem(HISTORY_KEY);

        if (!saved) {
            return [];
        }

        return JSON.parse(saved);

    } catch (error) {

        console.error(
            "History load error:",
            error
        );

        return [];
    }
}


// =====================================================
// SAVE ALL CHATS
// =====================================================

function saveAllChats(chats) {

    try {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(chats)
        );

    } catch (error) {

        console.error(
            "History save error:",
            error
        );
    }
}


// =====================================================
// CREATE NEW CHAT ID
// =====================================================

function createChatId() {

    return (
        Date.now().toString() +
        Math.random()
            .toString(36)
            .substring(2, 8)
    );
}


// =====================================================
// FORMAT ANSWER
// =====================================================

function formatAnswer(text) {

    if (!text) return "";

    let html = text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");


    // Code blocks

    html = html.replace(
        /```([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>"
    );


    // Headings

    html = html.replace(
        /^### (.*)$/gm,
        "<h3>$1</h3>"
    );

    html = html.replace(
        /^## (.*)$/gm,
        "<h2>$1</h2>"
    );

    html = html.replace(
        /^# (.*)$/gm,
        "<h1>$1</h1>"
    );


    // Bold

    html = html.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );


    // Italic

    html = html.replace(
        /\*(.*?)\*/g,
        "<em>$1</em>"
    );


    // Bullet points

    html = html.replace(
        /^\s*[-•]\s+(.*)$/gm,
        "<li>$1</li>"
    );


    // Numbered points

    html = html.replace(
        /^\s*(\d+)\.\s+(.*)$/gm,
        "<li>$2</li>"
    );


    html = html.replace(
        /\n\n/g,
        "<br><br>"
    );

    html = html.replace(
        /\n/g,
        "<br>"
    );


    return html;
}


// =====================================================
// DISPLAY MESSAGE IN CHAT
// =====================================================

function displayMessage(
    role,
    text,
    save = false
) {

    const chatBox =
        document.getElementById("chat-box");

    if (!chatBox) return;


    const messageDiv =
        document.createElement("div");


    if (role === "user") {

        messageDiv.className =
            "message user-message";

        messageDiv.textContent =
            text;

    } else {

        messageDiv.className =
            "message bot-message";

        messageDiv.innerHTML =
            formatAnswer(text);
    }


    chatBox.appendChild(
        messageDiv
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// =====================================================
// CLEAR CURRENT CHAT SCREEN
// =====================================================

function clearCurrentChatScreen() {

    const chatBox =
        document.getElementById("chat-box");

    if (chatBox) {
        chatBox.innerHTML = "";
    }

    currentChat = [];
    currentChatId = null;
}


// =====================================================
// START NEW CHAT
// =====================================================

function startNewChat() {

    // Current screen clear

    clearCurrentChatScreen();


    // New chat ID

    currentChatId = createChatId();


    // Input clear

    const input =
        document.getElementById("message");

    if (input) {

        input.value = "";

        input.focus();
    }


    // Search clear

    const search =
        document.getElementById(
            "history-search"
        );

    if (search) {
        search.value = "";
    }


    renderHistory();
}


// =====================================================
// SAVE CURRENT CHAT TO HISTORY
// =====================================================

function saveCurrentChat() {

    if (!currentChatId) {
        return;
    }

    if (!currentChat.length) {
        return;
    }


    const chats =
        getSavedChats();


    const existingIndex =
        chats.findIndex(
            chat =>
                chat.id === currentChatId
        );


    // First user message becomes title

    const firstUserMessage =
        currentChat.find(
            message =>
                message.role === "user"
        );


    let title =
        firstUserMessage
            ? firstUserMessage.text
            : "New Chat";


    // Limit title length

    if (title.length > 45) {

        title =
            title.substring(0, 45) +
            "...";
    }


    const chatData = {

        id: currentChatId,

        title: title,

        messages: currentChat,

        updatedAt: new Date().toISOString()

    };


    if (existingIndex !== -1) {

        chats[existingIndex] =
            chatData;

    } else {

        chats.unshift(
            chatData
        );
    }


    saveAllChats(chats);

    renderHistory();
}


// =====================================================
// RENDER CHAT HISTORY
// =====================================================

function renderHistory(
    searchText = ""
) {

    const historyList =
        document.getElementById(
            "history-list"
        );

    if (!historyList) return;


    const chats =
        getSavedChats();


    historyList.innerHTML = "";


    let filteredChats =
        chats;


    // Search

    if (searchText.trim()) {

        const search =
            searchText
                .toLowerCase()
                .trim();


        filteredChats =
            chats.filter(chat =>
                chat.title
                    .toLowerCase()
                    .includes(search)
            );
    }


    // No chats

    if (!filteredChats.length) {

        const empty =
            document.createElement(
                "div"
            );

        empty.className =
            "history-empty";

        empty.innerHTML =
            chats.length
                ? "No chats found"
                : "No chat history yet";

        historyList.appendChild(
            empty
        );

        return;
    }


    // Create history items

    filteredChats.forEach(
        chat => {

            const item =
                document.createElement(
                    "div"
                );

            item.className =
                "history-item";


            if (
                chat.id ===
                currentChatId
            ) {

                item.classList.add(
                    "active"
                );
            }


            // Title

            const title =
                document.createElement(
                    "div"
                );

            title.className =
                "history-title";

            title.textContent =
                chat.title;


            // Date

            const date =
                document.createElement(
                    "div"
                );

            date.className =
                "history-date";

            date.textContent =
                formatHistoryDate(
                    chat.updatedAt
                );


            // Delete

            const deleteButton =
                document.createElement(
                    "button"
                );

            deleteButton.className =
                "history-delete";

            deleteButton.innerHTML =
                '<i class="fa-solid fa-trash-can"></i>';

            deleteButton.title =
                "Delete chat";


            deleteButton.onclick =
                function(event) {

                    event.stopPropagation();

                    deleteChat(
                        chat.id
                    );
                };


            item.appendChild(title);

            item.appendChild(date);

            item.appendChild(
                deleteButton
            );


            // Open chat

            item.onclick =
                function() {

                    loadChat(
                        chat.id
                    );
                };


            historyList.appendChild(
                item
            );
        }
    );
}


// =====================================================
// FORMAT HISTORY DATE
// =====================================================

function formatHistoryDate(
    dateString
) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    return date.toLocaleString(
        "en-IN",
        {
            day: "2-digit",
            month: "short",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// =====================================================
// SEARCH HISTORY
// =====================================================

function searchHistory() {

    const input =
        document.getElementById(
            "history-search"
        );


    if (!input) return;


    renderHistory(
        input.value
    );
}


// =====================================================
// LOAD OLD CHAT
// =====================================================

function loadChat(chatId) {

    const chats =
        getSavedChats();


    const selectedChat =
        chats.find(
            chat =>
                chat.id === chatId
        );


    if (!selectedChat) {
        return;
    }


    currentChatId =
        selectedChat.id;


    currentChat =
        Array.isArray(
            selectedChat.messages
        )
            ? [...selectedChat.messages]
            : [];


    const chatBox =
        document.getElementById(
            "chat-box"
        );


    if (!chatBox) {
        return;
    }


    chatBox.innerHTML = "";


    currentChat.forEach(
        message => {

            displayMessage(
                message.role,
                message.text
            );
        }
    );


    renderHistory();


    const input =
        document.getElementById(
            "message"
        );


    if (input) {
        input.focus();
    }
}


// =====================================================
// DELETE CHAT
// =====================================================

function deleteChat(chatId) {

    const chats =
        getSavedChats();


    const filteredChats =
        chats.filter(
            chat =>
                chat.id !== chatId
        );


    saveAllChats(
        filteredChats
    );


    // If current chat was deleted

    if (
        currentChatId ===
        chatId
    ) {

        clearCurrentChatScreen();

        currentChatId =
            createChatId();
    }


    renderHistory();
}


// =====================================================
// SEND MESSAGE
// =====================================================

// =====================================================
// SEND MESSAGE
// =====================================================

async function sendMessage() {

    const input =
        document.getElementById("message");

    const chatBox =
        document.getElementById("chat-box");


    if (!input || !chatBox) {

        console.error(
            "Chat elements not found."
        );

        return;
    }


    const message =
        input.value.trim();


    if (!message) {
        return;
    }


    // Create chat ID if needed

    if (!currentChatId) {
        currentChatId = createChatId();
    }


    // ================================================
    // SHOW USER MESSAGE
    // ================================================

    displayMessage(
        "user",
        message
    );


    // ================================================
    // SAVE USER MESSAGE
    // ================================================

    currentChat.push({

        role: "user",

        text: message

    });


    input.value = "";


    chatBox.scrollTop =
        chatBox.scrollHeight;


    // ================================================
    // THINKING MESSAGE
    // ================================================

    const thinking =
        document.createElement("div");


    thinking.className =
        "message bot-message";


    thinking.textContent =
        "Thinking...";


    chatBox.appendChild(
        thinking
    );


    chatBox.scrollTop =
        chatBox.scrollHeight;


    try {

        // ============================================
        // IMPORTANT
        // Convert frontend "text"
        // to backend "content"
        // ============================================

        const backendHistory =
            currentChat.map(item => ({

                role: item.role,

                content: item.text

            }));


        // ============================================
        // SEND TO FASTAPI
        // ============================================

        const response =
            await fetch(
                `${API_URL}/chat`,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body: JSON.stringify({

                        message: message,

                        history:
                            backendHistory

                    })
                }
            );


        // ============================================
        // ERROR CHECK
        // ============================================

        if (!response.ok) {

            let errorMessage =
                `Server error: ${response.status}`;


            try {

                const errorData =
                    await response.json();


                console.error(
                    "Backend error:",
                    errorData
                );


                if (
                    errorData.detail
                ) {

                    errorMessage =
                        JSON.stringify(
                            errorData.detail
                        );
                }

            } catch (error) {

                console.log(
                    "Could not read error response."
                );
            }


            throw new Error(
                errorMessage
            );
        }


        // ============================================
        // READ OLLAMA STREAM
        // ============================================

        if (!response.body) {

            throw new Error(
                "Streaming is not supported by this browser."
            );
        }


        const reader =
            response.body.getReader();


        const decoder =
            new TextDecoder();


        let buffer = "";

        let fullReply = "";

        let firstChunk = true;


        // ============================================
        // STREAM LOOP
        // ============================================

        while (true) {

            const {
                value,
                done
            } =
                await reader.read();


            if (done) {
                break;
            }


            buffer +=
                decoder.decode(
                    value,
                    {
                        stream: true
                    }
                );


            const lines =
                buffer.split("\n");


            buffer =
                lines.pop();


            for (
                const line of lines
            ) {

                if (!line.trim()) {
                    continue;
                }


                try {

                    const data =
                        JSON.parse(line);


                    if (
                        data.response
                    ) {

                        // Remove Thinking...

                        if (
                            firstChunk
                        ) {

                            thinking.textContent =
                                "";

                            firstChunk =
                                false;
                        }


                        fullReply +=
                            data.response;


                        thinking.innerHTML =
                            formatAnswer(
                                fullReply
                            );


                        chatBox.scrollTop =
                            chatBox.scrollHeight;
                    }


                } catch (error) {

                    console.log(
                        "Stream JSON error:",
                        error
                    );
                }
            }
        }


        // ============================================
        // PROCESS FINAL BUFFER
        // ============================================

        if (buffer.trim()) {

            try {

                const data =
                    JSON.parse(buffer);


                if (
                    data.response
                ) {

                    fullReply +=
                        data.response;


                    thinking.innerHTML =
                        formatAnswer(
                            fullReply
                        );
                }


            } catch (error) {

                console.log(
                    "Final buffer error:",
                    error
                );
            }
        }


        // ============================================
        // CHECK ANSWER
        // ============================================

        if (!fullReply.trim()) {

            thinking.textContent =
                "Alpha ne koi answer return nahi kiya.";

            return;
        }


        // ============================================
        // SAVE AI ANSWER
        // ============================================

        currentChat.push({

            role: "assistant",

            text: fullReply

        });


        // ============================================
        // SAVE CHAT TO HISTORY
        // ============================================

        saveCurrentChat();


    } catch (error) {

        console.error(
            "Chat error:",
            error
        );


        thinking.innerHTML =
            `<i class="fa-solid fa-circle-exclamation" style="color: #ef4444;"></i> Alpha se connection nahi ho pa raha.
             <br><br>
             <small>${error.message}</small>`;
    }


    chatBox.scrollTop =
        chatBox.scrollHeight;
}
// =====================================================
// ENTER KEY = SEND
// =====================================================

document.addEventListener(
    "keydown",
    function(event) {

        const input =
            document.getElementById(
                "message"
            );


        if (!input) {
            return;
        }


        if (
            event.key === "Enter" &&
            document.activeElement === input
        ) {

            event.preventDefault();

            sendMessage();
        }

    }
);


// =====================================================
// PLUS MENU
// =====================================================

function togglePlusMenu() {

    const menu =
        document.getElementById(
            "plus-menu"
        );


    if (!menu) {
        return;
    }


    menu.classList.toggle(
        "show"
    );
}


// =====================================================
// CLOSE PLUS MENU
// =====================================================

function closePlusMenu() {

    const menu =
        document.getElementById(
            "plus-menu"
        );


    if (!menu) {
        return;
    }


    menu.classList.remove(
        "show"
    );
}


// =====================================================
// VOICE INPUT
// =====================================================

function startVoiceInput() {

    closePlusMenu();


    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;


    if (!SpeechRecognition) {

        alert(
            "Voice input is not supported in this browser. Please use Google Chrome."
        );

        return;
    }


    const recognition =
        new SpeechRecognition();


    recognition.lang =
        "en-IN";


    recognition.continuous =
        false;


    recognition.interimResults =
        false;


    recognition.onstart =
        function() {

            const input =
                document.getElementById(
                    "message"
                );


            if (input) {

                input.placeholder =
                    "Listening...";
            }
        };


    recognition.onresult =
        function(event) {

            const transcript =
                event.results[0][0]
                    .transcript;


            const input =
                document.getElementById(
                    "message"
                );


            if (input) {

                input.value =
                    transcript;

                input.focus();
            }
        };


    recognition.onerror =
        function(event) {

            console.error(
                "Voice input error:",
                event.error
            );


            alert(
                "Microphone/voice input could not be started."
            );
        };


    recognition.onend =
        function() {

            const input =
                document.getElementById(
                    "message"
                );


            if (input) {

                input.placeholder =
                    "Ask Alpha anything...";
            }
        };


    recognition.start();
}


// =====================================================
// CAMERA / PHOTO
// =====================================================

function openCamera() {

    closePlusMenu();


    const photoInput =
        document.getElementById(
            "photo-input"
        );


    if (photoInput) {

        photoInput.click();
    }
}


// =====================================================
// PHOTO / DOCUMENT SELECTED
// =====================================================

document.addEventListener(
    "change",
    function(event) {


        // PHOTO

        if (
            event.target.id ===
            "photo-input"
        ) {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            console.log(
                "Photo selected:",
                file.name
            );


            alert(
                `Photo selected: ${file.name}`
            );
        }


        // DOCUMENT

        if (
            event.target.id ===
            "document-input"
        ) {

            const file =
                event.target.files[0];


            if (!file) {
                return;
            }


            console.log(
                "Document selected:",
                file.name
            );


            alert(
                `Document selected: ${file.name}`
            );
        }

    }
);


// =====================================================
// CLOSE PLUS MENU OUTSIDE CLICK
// =====================================================

document.addEventListener(
    "click",
    function(event) {

        const container =
            document.querySelector(
                ".plus-menu-container"
            );


        const menu =
            document.getElementById(
                "plus-menu"
            );


        if (
            !container ||
            !menu
        ) {
            return;
        }


        if (
            !container.contains(
                event.target
            )
        ) {

            menu.classList.remove(
                "show"
            );
        }

    }
);


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
// INITIAL PAGE
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Always start on Dashboard

        showPage(
            "dashboard"
        );


        // Date

        setTodayDate();


        // IMPORTANT:
        // Refresh par current chat blank rahega.
        // Saved history localStorage me rahegi.

        currentChat = [];

        currentChatId = null;

    }
);// =====================================================
// ALPHA - ENHANCED DASHBOARD
// =====================================================

const DASHBOARD_MOTIVATIONS = [
    "Small progress is still progress. Keep going!",
    "Your future self will thank you for studying today.",
    "One topic at a time. You can do this!",
    "Consistency is more powerful than perfection.",
    "Learn today. Build tomorrow. Grow every day.",
    "Every question you solve makes you better.",
    "Keep learning and keep building!"
];


// =====================================================
// DASHBOARD DATE
// =====================================================

function updateDashboardDate() {

    const dateElement =
        document.getElementById("dashboard-date");

    const dayElement =
        document.getElementById("dashboard-day");

    if (!dateElement || !dayElement) {
        return;
    }

    const now = new Date();

    dayElement.textContent =
        now.toLocaleDateString("en-IN", {
            weekday: "long"
        });

    dateElement.textContent =
        now.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric"
        });
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
// SUBJECTS
// =====================================================

function updateDashboardSubjects() {
    const container = document.getElementById("dashboard-subjects");
    const countElement = document.getElementById("dashboard-subject-count");
    if (!container) return;

    const data = getMasterData();
    const subjects = data.subjects || [];

    if (countElement) {
        countElement.textContent = subjects.length;
    }

    if (!subjects.length) {
        container.innerHTML = `
            <div class="dashboard-empty">
                <span><i class="fa-solid fa-book-open"></i></span>
                <p>No subjects added yet.</p>
            </div>
        `;
        return;
    }

    container.innerHTML = subjects.slice(0, 4).map((subject, index) => {
        const name = subject.name || `Subject ${index + 1}`;
        const icon = formatIcon(subject.icon, "fa-solid fa-book");
        const progress = calculateSubjectProgress(subject);

        return `
            <div
                class="dashboard-subject"
                onclick="${subject.id ? `openSubjectPage('${subject.id}')` : `showPage('subjects')`}">
                <div class="dashboard-subject-top">
                    <span class="dashboard-subject-icon">${icon}</span>
                    <span class="dashboard-subject-name">${escapeSubjectHTML(name)}</span>
                </div>
                <div class="dashboard-subject-progress">
                    <span style="width:${Math.min(progress, 100)}%"></span>
                </div>
            </div>
        `;
    }).join("");
}


// =====================================================
// ALPHA - INTELLIGENT DAILY GOALS & STUDY PLANNER
// =====================================================

const GOALS_META_KEY = "master_sahab_goals_meta";

let currentGoalFilter = "all"; // 'all' | 'pending' | 'completed'
let currentGoalSubjectFilter = "__all__";
let currentGoalCategoryFilter = "__all__";
let currentGoalPriorityFilter = "__all__";
let selectedGoalModalDuration = 25;

// Focus Timer State
let timerActiveGoalId = null;
let timerMode = "pomodoro"; // 'pomodoro' | 'shortBreak' | 'longBreak'
let timerRemainingSeconds = 25 * 60;
let timerInterval = null;
let timerIsRunning = false;

// Default Starter Goals for new sessions
function getDefaultStarterGoals() {
    const todayStr = new Date().toISOString().split("T")[0];
    return [
        {
            id: "goal_init_1",
            title: "Master OOPs Polymorphism & Interface Unit",
            subjectId: "subj_java_1",
            subjectName: "Java Programming",
            category: "theory",
            priority: "high",
            estimatedMinutes: 30,
            completed: false,
            completedAt: null,
            createdAt: Date.now() - 3600000,
            date: todayStr,
            focusMinutesLogged: 0,
            notes: "Understand runtime polymorphism vs method overloading with practical code examples."
        },
        {
            id: "goal_init_2",
            title: "Practice 5 SQL Joins & Aggregate Queries",
            subjectId: "subj_dbms_4",
            subjectName: "Database Management (DBMS)",
            category: "practice",
            priority: "medium",
            estimatedMinutes: 25,
            completed: true,
            completedAt: Date.now() - 1800000,
            createdAt: Date.now() - 7200000,
            date: todayStr,
            focusMinutesLogged: 25,
            notes: "Solve Inner Join, Left Join, and GROUP BY with HAVING clause problems."
        },
        {
            id: "goal_init_3",
            title: "Revise Python List Comprehensions & Lambdas",
            subjectId: "subj_py_2",
            subjectName: "Python Programming",
            category: "revision",
            priority: "normal",
            estimatedMinutes: 20,
            completed: false,
            completedAt: null,
            createdAt: Date.now() - 1800000,
            date: todayStr,
            focusMinutesLogged: 0,
            notes: "Write concise one-liners for filtering and mapping dictionary/list data."
        }
    ];
}

// Normalize legacy or incomplete goals
function normalizeGoals(goals) {
    if (!Array.isArray(goals)) return [];
    const todayStr = new Date().toISOString().split("T")[0];
    return goals.map((g, idx) => {
        const title = g.title || g.text || g.name || `Study Goal ${idx + 1}`;
        const completed = Boolean(g.completed === true || g.done === true);
        return {
            id: g.id || `goal_${Date.now()}_${idx}`,
            title: title,
            subjectId: g.subjectId || null,
            subjectName: g.subjectName || g.subject || "General Study",
            category: g.category || "theory",
            priority: g.priority || "medium",
            estimatedMinutes: parseInt(g.estimatedMinutes) || 25,
            completed: completed,
            completedAt: g.completedAt || (completed ? Date.now() : null),
            createdAt: g.createdAt || Date.now(),
            date: g.date || todayStr,
            focusMinutesLogged: g.focusMinutesLogged || 0,
            notes: g.notes || ""
        };
    });
}

function getGoalsMeta() {
    try {
        const raw = localStorage.getItem(GOALS_META_KEY);
        if (raw) return JSON.parse(raw);
    } catch (e) {}
    return {
        streak: 5,
        lastActiveDate: new Date().toISOString().split("T")[0],
        totalFocusMinutes: 45,
        reflection: ""
    };
}

function saveGoalsMeta(meta) {
    try {
        localStorage.setItem(GOALS_META_KEY, JSON.stringify(meta));
    } catch (e) {}
}

// =====================================================
// DASHBOARD GOALS UPDATE
// =====================================================

function updateDashboardGoals() {
    const list = document.getElementById("dashboard-goal-list");
    const progressBar = document.getElementById("dashboard-goal-progress");
    const percentage = document.getElementById("goal-percentage");
    const progressText = document.getElementById("goal-progress-text");
    const goalCount = document.getElementById("dashboard-goal-count");

    if (!list) return;

    const data = getMasterData();
    const goals = data.goals || [];

    if (!goals.length) {
        if (progressBar) progressBar.style.width = "0%";
        if (percentage) percentage.textContent = "0%";
        if (progressText) progressText.textContent = "0 of 0 completed";
        if (goalCount) goalCount.textContent = "0";

        list.innerHTML = `
            <div class="dashboard-empty">
                <span><i class="fa-solid fa-bullseye"></i></span>
                <p>No study goals planned for today yet.</p>
                <div style="display:flex; gap:8px; justify-content:center; flex-wrap:wrap; margin-top:8px;">
                    <button type="button" class="hero-action-btn ai" onclick="openAiGoalPlannerModal()"><i class="fa-solid fa-wand-magic-sparkles"></i> Auto-Plan with AI</button>
                    <button type="button" class="hero-action-btn primary" onclick="openAddGoalModal()">+ Add Goal</button>
                </div>
            </div>
        `;
        return;
    }

    const completed = goals.filter(g => g.completed).length;
    const total = goals.length;
    const percent = Math.round((completed / total) * 100);

    if (progressBar) progressBar.style.width = `${percent}%`;
    if (percentage) percentage.textContent = `${percent}%`;
    if (progressText) progressText.textContent = `${completed} of ${total} completed`;
    if (goalCount) goalCount.textContent = completed;

    const categoryIcons = {
        theory: '<i class="fa-solid fa-book-open"></i>',
        practice: '<i class="fa-solid fa-laptop-code"></i>',
        quiz: '<i class="fa-solid fa-circle-question"></i>',
        revision: '<i class="fa-solid fa-pen-to-square"></i>',
        assignment: '<i class="fa-solid fa-clipboard-list"></i>'
    };

    list.innerHTML = goals.slice(0, 5).map((goal) => {
        const catIcon = categoryIcons[goal.category] || '<i class="fa-solid fa-bullseye"></i>';
        return `
            <div class="dashboard-goal-item ${goal.completed ? "completed" : ""}" id="dash-goal-${goal.id}">
                <label class="goal-checkbox-label" onclick="event.stopPropagation()">
                    <input
                        type="checkbox"
                        ${goal.completed ? "checked" : ""}
                        onchange="toggleGoal('${goal.id}')">
                    <span class="custom-checkbox"></span>
                </label>
                <div class="dash-goal-text-wrap" onclick="showPage('goals')">
                    <span class="dash-goal-title">${escapeSubjectHTML(goal.title)}</span>
                    <div class="dash-goal-submeta">
                        <span class="dash-goal-pill cat">${catIcon} ${escapeSubjectHTML(goal.category)}</span>
                        <span class="dash-goal-pill subj">${escapeSubjectHTML(goal.subjectName)}</span>
                        <span class="dash-goal-pill time"><i class="fa-solid fa-stopwatch"></i> ${goal.estimatedMinutes}m</span>
                    </div>
                </div>
                <button type="button" class="dash-goal-focus-btn" onclick="startFocusOnGoal('${goal.id}')" title="Start Pomodoro focus session">
                    <i class="fa-solid fa-stopwatch"></i>
                </button>
            </div>
        `;
    }).join("");
}

function handleDashboardInlineGoalAdd() {
    const input = document.getElementById("dashboard-inline-goal-input");
    if (!input) return;
    const title = input.value.trim();
    if (!title) {
        showToast("Please enter a goal title!");
        return;
    }

    const data = getMasterData();
    const newGoal = {
        id: "goal_" + Date.now(),
        title: title,
        subjectId: null,
        subjectName: "General Study",
        category: "practice",
        priority: "medium",
        estimatedMinutes: 25,
        completed: false,
        completedAt: null,
        createdAt: Date.now(),
        date: new Date().toISOString().split("T")[0],
        focusMinutesLogged: 0,
        notes: ""
    };

    data.goals.unshift(newGoal);
    saveMasterData(data);
    input.value = "";
    updateDashboard();
    showToast(`Added: "${title}"`);
}

function focusChatInput() {
    showPage("chat");
    setTimeout(() => {
        const msg = document.getElementById("message");
        if (msg) {
            msg.focus();
        }
    }, 120);
}

function openQuickFocusTimer() {
    showPage("goals");
    setTimeout(() => {
        const data = getMasterData();
        const pendingGoal = (data.goals || []).find(g => !g.completed);
        if (pendingGoal) {
            startFocusOnGoal(pendingGoal.id);
        } else {
            const widget = document.getElementById("goal-timer-widget");
            if (widget) {
                widget.style.display = "flex";
                const titleEl = document.getElementById("timer-active-goal-title");
                if (titleEl) titleEl.textContent = "Goal: General Focus Session";
            }
        }
    }, 120);
}

// =====================================================
// GOAL TOGGLE (UNIVERSAL)
// =====================================================

function toggleGoal(goalId) {
    const data = getMasterData();
    const goal = data.goals.find(g => g.id === goalId);
    if (!goal) return;

    goal.completed = !goal.completed;
    goal.completedAt = goal.completed ? Date.now() : null;

    const meta = getGoalsMeta();
    const todayStr = new Date().toISOString().split("T")[0];

    if (goal.completed) {
        if (meta.lastActiveDate !== todayStr) {
            meta.streak = (meta.streak || 0) + 1;
            meta.lastActiveDate = todayStr;
        }
        showToast(`🎉 Great job! "${goal.title}" completed!`);

        if (Array.isArray(data.activities)) {
            data.activities.unshift({
                id: "act_" + Date.now(),
                type: "goal",
                title: `Completed Goal: ${goal.title}`,
                subject: goal.subjectName,
                timestamp: Date.now(),
                icon: "fa-solid fa-bullseye"
            });
            if (data.activities.length > 20) data.activities.pop();
        }
    }

    saveGoalsMeta(meta);
    saveMasterData(data);

    updateDashboard();
    renderGoalsPage();
}

// =====================================================
// GOALS PAGE RENDERING
// =====================================================

function renderGoalsPage() {
    const page = document.getElementById("goals-page");
    if (!page) return;

    const data = getMasterData();
    const goals = data.goals || [];
    const meta = getGoalsMeta();

    // 1. Calculate stats
    const total = goals.length;
    const completed = goals.filter(g => g.completed).length;
    const pending = total - completed;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    // 2. Ring Progress
    const ringCircle = document.getElementById("goals-ring-progress");
    const ringPercent = document.getElementById("goals-page-ring-percent");
    const completionCount = document.getElementById("goals-page-completion-count");
    const completionSub = document.getElementById("goals-page-completion-sub");

    if (ringCircle) {
        const circumference = 201.06;
        const offset = circumference * (1 - (percent / 100));
        ringCircle.style.strokeDashoffset = offset;
    }
    if (ringPercent) ringPercent.textContent = `${percent}%`;
    if (completionCount) completionCount.textContent = `${completed} of ${total} Completed`;
    if (completionSub) {
        if (percent === 100 && total > 0) {
            completionSub.innerHTML = '<i class="fa-solid fa-star" style="color:#f59e0b;"></i> Phenomenal! All daily targets achieved!';
        } else if (percent >= 50) {
            completionSub.innerHTML = '<i class="fa-solid fa-fire" style="color:#ef4444;"></i> Over halfway there! Keep the momentum!';
        } else {
            completionSub.textContent = "Keep pushing to complete your targets!";
        }
    }

    // 3. Focus Time & Streak
    const focusTimeEl = document.getElementById("goals-page-focus-time");
    const pomodoroCountEl = document.getElementById("goals-page-pomodoro-count");
    const streakCountEl = document.getElementById("goals-page-streak-count");

    const totalMins = meta.totalFocusMinutes || 0;
    if (focusTimeEl) focusTimeEl.textContent = `${totalMins} mins`;
    if (pomodoroCountEl) {
        const pomodoros = Math.floor(totalMins / 25);
        pomodoroCountEl.textContent = `${pomodoros} Pomodoro sessions logged`;
    }
    if (streakCountEl) streakCountEl.textContent = `${meta.streak || 1} Days`;

    // 4. Weekly Consistency Strip
    renderGoalsWeeklyPills(meta);

    // 5. Filter Counts
    const countAll = document.getElementById("count-filter-all");
    const countPending = document.getElementById("count-filter-pending");
    const countCompleted = document.getElementById("count-filter-completed");
    if (countAll) countAll.textContent = total;
    if (countPending) countPending.textContent = pending;
    if (countCompleted) countCompleted.textContent = completed;

    // 6. Populate Subject Filter and Quick Select
    populateGoalSubjectDropdowns(data.subjects || []);

    // 7. Filter & Render Goals List
    renderFilteredGoalsList(goals);

    // 8. Daily Reflection
    const reflectionArea = document.getElementById("daily-reflection-textarea");
    if (reflectionArea && meta.reflection) {
        reflectionArea.value = meta.reflection;
    }
}

function renderGoalsWeeklyPills(meta) {
    const container = document.getElementById("goals-weekly-pills-row");
    if (!container) return;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    // Monday as 0, Sunday as 6
    const currentDayIdx = (today.getDay() + 6) % 7;

    container.innerHTML = days.map((day, idx) => {
        const isToday = idx === currentDayIdx;
        const isPast = idx < currentDayIdx;
        const isDone = isPast || (isToday && (meta.streak || 0) > 0);

        return `
            <div class="weekly-pill ${isToday ? "today" : ""} ${isDone ? "done" : ""}">
                <span class="wp-day">${day}</span>
                <span class="wp-dot">${isDone ? "✓" : "•"}</span>
            </div>
        `;
    }).join("");
}

function populateGoalSubjectDropdowns(subjects) {
    const filterSelect = document.getElementById("goal-subject-filter");
    const quickSelect = document.getElementById("quick-goal-subject");

    const optionsHTML = subjects.map(s => `
        <option value="${escapeSubjectHTML(s.id)}">${escapeSubjectHTML(s.name)}</option>
    `).join("");

    if (filterSelect && filterSelect.options.length <= 1) {
        filterSelect.innerHTML = `<option value="__all__">All Subjects</option>` + optionsHTML;
    }
    if (quickSelect && quickSelect.options.length <= 1) {
        quickSelect.innerHTML = `<option value="">General Study</option>` + optionsHTML;
    }
}

function filterGoals(filterType, btn) {
    currentGoalFilter = filterType;
    document.querySelectorAll(".goal-filter-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
    applyGoalFilters();
}

function applyGoalFilters() {
    const subSelect = document.getElementById("goal-subject-filter");
    const catSelect = document.getElementById("goal-category-filter");
    const prioSelect = document.getElementById("goal-priority-filter");

    if (subSelect) currentGoalSubjectFilter = subSelect.value;
    if (catSelect) currentGoalCategoryFilter = catSelect.value;
    if (prioSelect) currentGoalPriorityFilter = prioSelect.value;

    const data = getMasterData();
    renderFilteredGoalsList(data.goals || []);
}

function renderFilteredGoalsList(goals) {
    const container = document.getElementById("goals-cards-list");
    if (!container) return;

    let filtered = goals.filter(g => {
        // Status filter
        if (currentGoalFilter === "pending" && g.completed) return false;
        if (currentGoalFilter === "completed" && !g.completed) return false;

        // Subject filter
        if (currentGoalSubjectFilter !== "__all__" && g.subjectId !== currentGoalSubjectFilter && g.subjectName !== currentGoalSubjectFilter) return false;

        // Category filter
        if (currentGoalCategoryFilter !== "__all__" && g.category !== currentGoalCategoryFilter) return false;

        // Priority filter
        if (currentGoalPriorityFilter !== "__all__" && g.priority !== currentGoalPriorityFilter) return false;

        return true;
    });

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="goals-empty-state">
                <div class="empty-icon"><i class="fa-solid fa-bullseye"></i></div>
                <h3>No Goals Found</h3>
                <p>No goals match the selected filter criteria. Create a new goal or click "AI Auto-Plan" to generate tailored targets!</p>
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <button type="button" class="hero-action-btn ai" onclick="openAiGoalPlannerModal()"><i class="fa-solid fa-wand-magic-sparkles"></i> AI Auto-Plan Today</button>
                    <button type="button" class="hero-action-btn primary" onclick="openAddGoalModal()">+ Create New Goal</button>
                </div>
            </div>
        `;
        return;
    }

    const categoryBadges = {
        theory: { icon: '<i class="fa-solid fa-book-open"></i>', label: "Theory & Concepts", cls: "cat-theory" },
        practice: { icon: '<i class="fa-solid fa-laptop-code"></i>', label: "Coding & Practice", cls: "cat-practice" },
        quiz: { icon: '<i class="fa-solid fa-circle-question"></i>', label: "Quiz & Revision", cls: "cat-quiz" },
        revision: { icon: '<i class="fa-solid fa-pen-to-square"></i>', label: "Quick Revision", cls: "cat-revision" },
        assignment: { icon: '<i class="fa-solid fa-clipboard-list"></i>', label: "Assignment", cls: "cat-assignment" }
    };

    const priorityBadges = {
        high: { icon: '<i class="fa-solid fa-circle" style="color:#ef4444;"></i>', label: "High Priority", cls: "prio-high" },
        medium: { icon: '<i class="fa-solid fa-circle" style="color:#f59e0b;"></i>', label: "Medium", cls: "prio-med" },
        normal: { icon: '<i class="fa-solid fa-circle" style="color:#22c55e;"></i>', label: "Normal", cls: "prio-norm" }
    };

    container.innerHTML = filtered.map(goal => {
        const cat = categoryBadges[goal.category] || categoryBadges.theory;
        const prio = priorityBadges[goal.priority] || priorityBadges.medium;

        return `
            <div class="goal-card ${goal.completed ? "completed" : ""}" id="goal-card-${goal.id}">
                <div class="goal-card-top">
                    <label class="goal-checkbox-label" onclick="event.stopPropagation()">
                        <input
                            type="checkbox"
                            ${goal.completed ? "checked" : ""}
                            onchange="toggleGoal('${goal.id}')">
                        <span class="custom-checkbox"></span>
                    </label>
                    <div class="goal-card-info">
                        <div class="goal-card-badges">
                            <span class="goal-badge ${cat.cls}">${cat.icon} ${cat.label}</span>
                            <span class="goal-badge ${prio.cls}">${prio.icon} ${prio.label}</span>
                            <span class="goal-badge subj-badge"><i class="fa-solid fa-book-open"></i> ${escapeSubjectHTML(goal.subjectName)}</span>
                            <span class="goal-badge time-badge"><i class="fa-solid fa-stopwatch"></i> ${goal.estimatedMinutes}m</span>
                        </div>
                        <h3 class="goal-title">${escapeSubjectHTML(goal.title)}</h3>
                        ${goal.notes ? `<p class="goal-notes">${escapeSubjectHTML(goal.notes)}</p>` : ""}
                    </div>
                </div>

                <div class="goal-card-actions">
                    <button type="button" class="goal-action-btn focus-btn" onclick="startFocusOnGoal('${goal.id}')" title="Start 25-minute Pomodoro focus session on this goal">
                        <i class="fa-solid fa-stopwatch"></i> Focus Session
                    </button>
                    <button type="button" class="goal-action-btn ai-btn" onclick="askAiAboutGoal('${goal.id}')" title="Ask Alpha for a step-by-step breakdown">
                        <i class="fa-solid fa-robot"></i> AI Tutor Plan
                    </button>
                    <button type="button" class="goal-action-btn edit-btn" onclick="openAddGoalModal('${goal.id}')" title="Edit Goal">
                        <i class="fa-solid fa-pen"></i> Edit
                    </button>
                    <button type="button" class="goal-action-btn delete-btn" onclick="deleteGoal('${goal.id}')" title="Delete Goal">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

// =====================================================
// QUICK INLINE GOAL ADD
// =====================================================

function handleQuickAddGoal() {
    const input = document.getElementById("quick-goal-input");
    const subSelect = document.getElementById("quick-goal-subject");
    const catSelect = document.getElementById("quick-goal-category");
    const timeSelect = document.getElementById("quick-goal-time");

    if (!input) return;
    const title = input.value.trim();
    if (!title) {
        showToast("Please enter a goal title!");
        return;
    }

    const data = getMasterData();
    const subjectId = subSelect ? subSelect.value : "";
    let subjectName = "General Study";

    if (subjectId) {
        const found = data.subjects.find(s => s.id === subjectId);
        if (found) subjectName = found.name;
    }

    const newGoal = {
        id: "goal_" + Date.now(),
        title: title,
        subjectId: subjectId || null,
        subjectName: subjectName,
        category: catSelect ? catSelect.value : "theory",
        priority: "medium",
        estimatedMinutes: timeSelect ? parseInt(timeSelect.value) : 25,
        completed: false,
        completedAt: null,
        createdAt: Date.now(),
        date: new Date().toISOString().split("T")[0],
        focusMinutesLogged: 0,
        notes: ""
    };

    data.goals.unshift(newGoal);
    saveMasterData(data);
    input.value = "";
    updateDashboard();
    renderGoalsPage();
    showToast(`🎯 Added goal: "${title}"`);
}

// =====================================================
// ADD / EDIT GOAL MODAL
// =====================================================

function addGoalForCurrentSubject() {
    if (!currentSubjectId) return;
    openAddGoalModal();
    const subSelect = document.getElementById("goal-modal-subject-select");
    if (subSelect) {
        subSelect.value = currentSubjectId;
    }
}

function openAddGoalModal(goalId = null) {
    const modal = document.getElementById("add-goal-modal");
    if (!modal) return;

    const idInput = document.getElementById("goal-modal-id");
    const titleInput = document.getElementById("goal-modal-title-input");
    const subSelect = document.getElementById("goal-modal-subject-select");
    const catSelect = document.getElementById("goal-modal-category-select");
    const prioSelect = document.getElementById("goal-modal-priority-select");
    const notesInput = document.getElementById("goal-modal-notes-input");
    const modalTitle = document.getElementById("add-goal-modal-title");

    const data = getMasterData();

    // Populate subject options
    if (subSelect) {
        subSelect.innerHTML = `<option value="">General Study (No specific subject)</option>` +
            (data.subjects || []).map(s => `<option value="${escapeSubjectHTML(s.id)}">${escapeSubjectHTML(s.name)}</option>`).join("");
    }

    if (goalId) {
        const goal = data.goals.find(g => g.id === goalId);
        if (goal) {
            if (modalTitle) modalTitle.textContent = "Edit Study Goal";
            if (idInput) idInput.value = goal.id;
            if (titleInput) titleInput.value = goal.title;
            if (subSelect) subSelect.value = goal.subjectId || "";
            if (catSelect) catSelect.value = goal.category || "theory";
            if (prioSelect) prioSelect.value = goal.priority || "medium";
            if (notesInput) notesInput.value = goal.notes || "";
            selectedGoalModalDuration = goal.estimatedMinutes || 25;
        }
    } else {
        if (modalTitle) modalTitle.textContent = "Create Daily Goal";
        if (idInput) idInput.value = "";
        if (titleInput) titleInput.value = "";
        if (subSelect) subSelect.value = "";
        if (catSelect) catSelect.value = "theory";
        if (prioSelect) prioSelect.value = "medium";
        if (notesInput) notesInput.value = "";
        selectedGoalModalDuration = 25;
    }

    // Update duration pills
    document.querySelectorAll("#goal-modal-duration-pills .qg-count-btn").forEach(btn => {
        const t = parseInt(btn.getAttribute("data-time"));
        btn.classList.toggle("active", t === selectedGoalModalDuration);
    });

    modal.classList.add("show");
    if (titleInput) titleInput.focus();
}

function closeAddGoalModal() {
    const modal = document.getElementById("add-goal-modal");
    if (modal) modal.classList.remove("show");
}

function setGoalModalDuration(minutes, btn) {
    selectedGoalModalDuration = minutes;
    document.querySelectorAll("#goal-modal-duration-pills .qg-count-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
}

function saveGoalModal() {
    const idInput = document.getElementById("goal-modal-id");
    const titleInput = document.getElementById("goal-modal-title-input");
    const subSelect = document.getElementById("goal-modal-subject-select");
    const catSelect = document.getElementById("goal-modal-category-select");
    const prioSelect = document.getElementById("goal-modal-priority-select");
    const notesInput = document.getElementById("goal-modal-notes-input");

    const title = titleInput ? titleInput.value.trim() : "";
    if (!title) {
        showToast("Please enter a goal title!");
        if (titleInput) titleInput.focus();
        return;
    }

    const data = getMasterData();
    const subjectId = subSelect ? subSelect.value : "";
    let subjectName = "General Study";
    if (subjectId) {
        const found = data.subjects.find(s => s.id === subjectId);
        if (found) subjectName = found.name;
    }

    const goalId = idInput ? idInput.value : "";

    if (goalId) {
        // Edit existing
        const goal = data.goals.find(g => g.id === goalId);
        if (goal) {
            goal.title = title;
            goal.subjectId = subjectId || null;
            goal.subjectName = subjectName;
            goal.category = catSelect ? catSelect.value : "theory";
            goal.priority = prioSelect ? prioSelect.value : "medium";
            goal.estimatedMinutes = selectedGoalModalDuration;
            goal.notes = notesInput ? notesInput.value.trim() : "";
        }
        showToast(`Updated goal: "${title}"`);
    } else {
        // Add new
        const newGoal = {
            id: "goal_" + Date.now(),
            title: title,
            subjectId: subjectId || null,
            subjectName: subjectName,
            category: catSelect ? catSelect.value : "theory",
            priority: prioSelect ? prioSelect.value : "medium",
            estimatedMinutes: selectedGoalModalDuration,
            completed: false,
            completedAt: null,
            createdAt: Date.now(),
            date: new Date().toISOString().split("T")[0],
            focusMinutesLogged: 0,
            notes: notesInput ? notesInput.value.trim() : ""
        };
        data.goals.unshift(newGoal);
        showToast(`Created goal: "${title}"`);
    }

    saveMasterData(data);
    closeAddGoalModal();
    updateDashboard();
    renderGoalsPage();
}

function deleteGoal(goalId) {
    if (!confirm("Are you sure you want to delete this study goal?")) return;

    const data = getMasterData();
    data.goals = (data.goals || []).filter(g => g.id !== goalId);
    saveMasterData(data);

    if (timerActiveGoalId === goalId) {
        closeTimerWidget();
    }

    updateDashboard();
    renderGoalsPage();
    showToast("Goal removed.");
}

function clearCompletedGoals() {
    const data = getMasterData();
    const beforeCount = (data.goals || []).length;
    data.goals = (data.goals || []).filter(g => !g.completed);
    const removed = beforeCount - data.goals.length;

    if (removed === 0) {
        showToast("No completed goals to clear!");
        return;
    }

    saveMasterData(data);
    updateDashboard();
    renderGoalsPage();
    showToast(`Cleared ${removed} completed goals.`);
}

function resetTodayGoals() {
    if (!confirm("Reset all goals to incomplete for a fresh study session?")) return;

    const data = getMasterData();
    (data.goals || []).forEach(g => {
        g.completed = false;
        g.completedAt = null;
    });

    saveMasterData(data);
    updateDashboard();
    renderGoalsPage();
    showToast("All daily goals reset!");
}

// =====================================================
// AI STUDY PLANNER (ALPHA)
// =====================================================

let currentAiSuggestedGoals = [];

function openAiGoalPlannerModal() {
    const modal = document.getElementById("ai-goal-planner-modal");
    if (!modal) return;
    modal.classList.add("show");
    regenerateAiPlan();
}

function closeAiGoalPlannerModal() {
    const modal = document.getElementById("ai-goal-planner-modal");
    if (modal) modal.classList.remove("show");
}

async function regenerateAiPlan() {
    const container = document.getElementById("ai-suggested-goals-list");
    const spinner = document.getElementById("ai-plan-spinner");
    const btnText = document.getElementById("ai-plan-btn-text");
    const quoteEl = document.getElementById("ai-planner-quote");

    const focusInput = document.querySelector('input[name="ai-plan-focus"]:checked');
    const focus = focusInput ? focusInput.value : "balanced";

    if (spinner) spinner.style.display = "inline-block";
    if (btnText) btnText.textContent = "Analyzing Subjects...";

    const data = getMasterData();
    const subjects = data.subjects || [];

    // Extract pending syllabus topics
    const pendingTopics = [];
    subjects.forEach(s => {
        if (Array.isArray(s.syllabus)) {
            s.syllabus.forEach(unit => {
                if (Array.isArray(unit.topics)) {
                    unit.topics.forEach(t => {
                        if (!t.completed) {
                            pendingTopics.push({ subject: s.name, subjectId: s.id, topic: t.name });
                        }
                    });
                }
            });
        }
    });

    let suggestions = null;

    // 1. Attempt Backend AI Generation
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`${API_URL}/goals/plan`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subjects: subjects.map(s => s.name),
                pending_topics: pendingTopics.slice(0, 8),
                focus: focus
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
            const json = await res.json();
            if (json && json.success && Array.isArray(json.goals) && json.goals.length > 0) {
                suggestions = json.goals;
                if (quoteEl && json.motivation) {
                    quoteEl.textContent = `"${json.motivation}"`;
                }
            }
        }
    } catch (e) {
        // Backend offline or timeout -> fall through to intelligent local planner
    }

    // 2. Intelligent Local Planner Fallback
    if (!suggestions || suggestions.length === 0) {
        suggestions = generateLocalAiGoals(subjects, pendingTopics, focus);
        if (quoteEl) {
            quoteEl.textContent = `"Structure creates freedom. Complete these key targets and you'll stay weeks ahead of exams!"`;
        }
    }

    currentAiSuggestedGoals = suggestions;

    if (spinner) spinner.style.display = "none";
    if (btnText) btnText.innerHTML = '<i class="fa-solid fa-rotate-right"></i> Refresh Suggestions';

    if (!container) return;

    container.innerHTML = suggestions.map((sug, idx) => {
        return `
            <label class="ai-suggested-item" for="sug-chk-${idx}">
                <input type="checkbox" id="sug-chk-${idx}" value="${idx}" checked>
                <div class="sug-item-content">
                    <div class="sug-item-top">
                        <span class="sug-subj">${escapeSubjectHTML(sug.subject || "Core")}</span>
                        <span class="sug-cat">${escapeSubjectHTML(sug.category || "theory")}</span>
                        <span class="sug-time"><i class="fa-solid fa-stopwatch"></i> ${sug.estimated_minutes || 25}m</span>
                        <span class="sug-prio">${sug.priority || "high"}</span>
                    </div>
                    <h4>${escapeSubjectHTML(sug.title)}</h4>
                    ${sug.notes ? `<p class="sug-notes">${escapeSubjectHTML(sug.notes)}</p>` : ""}
                </div>
            </label>
        `;
    }).join("");
}

function generateLocalAiGoals(subjects, pendingTopics, focus) {
    const goals = [];

    // Pedagogical selection based on student's actual subjects
    if (subjects.length > 0) {
        // 1. Concept Goal
        const topic1 = pendingTopics[0] || { subject: subjects[0].name, topic: "Core Architecture & Fundamentals" };
        goals.push({
            title: `Master Unit Concepts: ${topic1.topic}`,
            subject: topic1.subject,
            category: "theory",
            priority: "high",
            estimated_minutes: 30,
            notes: "Read lecture notes, highlight definitions, and summarize the key principles in your own words."
        });

        // 2. Practice/Coding Goal
        const topic2 = pendingTopics[1] || { subject: (subjects[1] || subjects[0]).name, topic: "Practical Implementation" };
        goals.push({
            title: `Solve & Code: ${topic2.topic}`,
            subject: topic2.subject,
            category: "practice",
            priority: "medium",
            estimated_minutes: 25,
            notes: "Write working code examples and verify with edge test cases."
        });

        // 3. Quiz & Self-Testing Goal
        const topic3 = pendingTopics[2] || { subject: (subjects[2] || subjects[0]).name, topic: "Important Exam Questions" };
        goals.push({
            title: `Practice Quiz: Test understanding of ${topic3.topic}`,
            subject: topic3.subject,
            category: "quiz",
            priority: "medium",
            estimated_minutes: 15,
            notes: "Take a 5-question quick quiz in the Practice Arena to reinforce retention."
        });

        // 4. Quick Revision
        goals.push({
            title: `15-Min Quick Formula & Syntax Revision`,
            subject: subjects[0].name,
            category: "revision",
            priority: "normal",
            estimated_minutes: 15,
            notes: "Review flashcards and active recall notes before wrapping up today."
        });
    } else {
        goals.push(
            {
                title: "Study Core Semester Concepts",
                subject: "General Study",
                category: "theory",
                priority: "high",
                estimated_minutes: 30,
                notes: "Focus on primary textbook chapter."
            },
            {
                title: "Solve 5 Practice Problems",
                subject: "General Study",
                category: "practice",
                priority: "medium",
                estimated_minutes: 25,
                notes: "Code solutions hands-on."
            }
        );
    }

    return goals;
}

function applySelectedAiGoals() {
    const checkboxes = document.querySelectorAll("#ai-suggested-goals-list input[type='checkbox']:checked");
    if (checkboxes.length === 0) {
        showToast("Please select at least one goal to add!");
        return;
    }

    const data = getMasterData();
    let count = 0;

    checkboxes.forEach(chk => {
        const idx = parseInt(chk.value);
        const sug = currentAiSuggestedGoals[idx];
        if (sug) {
            // Find corresponding subjectId if possible
            let subjectId = null;
            const matchedSubj = (data.subjects || []).find(s => s.name.toLowerCase() === (sug.subject || "").toLowerCase());
            if (matchedSubj) subjectId = matchedSubj.id;

            const newGoal = {
                id: "goal_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5),
                title: sug.title,
                subjectId: subjectId,
                subjectName: sug.subject || "General Study",
                category: sug.category || "theory",
                priority: sug.priority || "medium",
                estimatedMinutes: sug.estimated_minutes || 25,
                completed: false,
                completedAt: null,
                createdAt: Date.now(),
                date: new Date().toISOString().split("T")[0],
                focusMinutesLogged: 0,
                notes: sug.notes || ""
            };

            data.goals.unshift(newGoal);
            count++;
        }
    });

    saveMasterData(data);
    closeAiGoalPlannerModal();
    updateDashboard();
    renderGoalsPage();
    showToast(`🚀 Added ${count} AI-planned goals for today!`);
}

// =====================================================
// POMODORO FOCUS TIMER SYSTEM
// =====================================================

function startFocusOnGoal(goalId) {
    const data = getMasterData();
    const goal = data.goals.find(g => g.id === goalId);
    if (!goal) return;

    timerActiveGoalId = goal.id;

    // Switch to goals page if not already there
    showPage("goals");

    const widget = document.getElementById("goal-timer-widget");
    const goalTitleEl = document.getElementById("timer-active-goal-title");
    const modeLabelEl = document.getElementById("timer-mode-label");

    if (goalTitleEl) goalTitleEl.innerHTML = `<i class="fa-solid fa-bullseye"></i> Goal: ${escapeSubjectHTML(goal.title)}`;
    if (modeLabelEl) modeLabelEl.textContent = `Focusing on ${goal.subjectName} (${timerRemainingSeconds / 60}m)`;

    if (widget) {
        widget.style.display = "flex";
        widget.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    // Reset timer to 25 min
    setTimerMode("pomodoro");
    showToast(`Focus session started for: "${goal.title}"`);
}

function setTimerMode(mode) {
    timerMode = mode;
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerIsRunning = false;

    if (mode === "pomodoro") {
        timerRemainingSeconds = 25 * 60;
    } else if (mode === "shortBreak") {
        timerRemainingSeconds = 5 * 60;
    } else if (mode === "longBreak") {
        timerRemainingSeconds = 15 * 60;
    }

    updateTimerDisplay();

    // Mode buttons UI
    document.querySelectorAll(".timer-mode-buttons .t-mode-btn").forEach(btn => {
        btn.classList.remove("active");
    });
    const activeBtn = document.querySelector(`.timer-mode-buttons .t-mode-btn[onclick*="${mode}"]`);
    if (activeBtn) activeBtn.classList.add("active");

    const playBtn = document.getElementById("timer-play-btn");
    if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';
}

function updateTimerDisplay() {
    const display = document.getElementById("timer-digital-display");
    if (!display) return;
    const mins = Math.floor(timerRemainingSeconds / 60);
    const secs = timerRemainingSeconds % 60;
    display.textContent = `${String(mins).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
}

function toggleTimerPlay() {
    const playBtn = document.getElementById("timer-play-btn");

    if (timerIsRunning) {
        // Pause
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = null;
        timerIsRunning = false;
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Resume';
    } else {
        // Play
        timerIsRunning = true;
        if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-pause"></i> Pause';

        timerInterval = setInterval(() => {
            if (timerRemainingSeconds > 0) {
                timerRemainingSeconds--;
                updateTimerDisplay();
            } else {
                // Timer completed!
                clearInterval(timerInterval);
                timerInterval = null;
                timerIsRunning = false;
                if (playBtn) playBtn.innerHTML = '<i class="fa-solid fa-play"></i> Start';

                playTimerChime();

                // Log focus time
                const meta = getGoalsMeta();
                const sessionMins = timerMode === "pomodoro" ? 25 : (timerMode === "shortBreak" ? 5 : 15);
                meta.totalFocusMinutes = (meta.totalFocusMinutes || 0) + sessionMins;
                saveGoalsMeta(meta);

                if (timerActiveGoalId) {
                    const data = getMasterData();
                    const g = data.goals.find(goal => goal.id === timerActiveGoalId);
                    if (g) {
                        g.focusMinutesLogged = (g.focusMinutesLogged || 0) + sessionMins;
                        saveMasterData(data);
                    }
                }

                renderGoalsPage();
                showToast("🔔 Focus session complete! Take a well-deserved break!");
            }
        }, 1000);
    }
}

function resetTimer() {
    setTimerMode(timerMode);
}

function completeGoalFromTimer() {
    if (timerActiveGoalId) {
        toggleGoal(timerActiveGoalId);
        showToast("🎯 Goal marked as completed from timer!");
    }
}

function closeTimerWidget() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
    timerIsRunning = false;
    timerActiveGoalId = null;
    const widget = document.getElementById("goal-timer-widget");
    if (widget) widget.style.display = "none";
}

function playTimerChime() {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15);
        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.6);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {}
}

// =====================================================
// ASK AI ABOUT GOAL & DAILY REFLECTION
// =====================================================

function askAiAboutGoal(goalId) {
    const data = getMasterData();
    const goal = data.goals.find(g => g.id === goalId);
    if (!goal) return;

    showPage("chat");

    const input = document.getElementById("message");
    if (input) {
        input.value = `Alpha, mujhe aaj ke is daily goal ko achieve karne ke liye step-by-step guidance chahiye:\n\nTarget Goal: "${goal.title}"\nSubject: "${goal.subjectName}"\nCategory: "${goal.category}"\nEstimated Time: ${goal.estimatedMinutes} minutes\n\nKripya mujhe is topic ke most important exam concepts aur 30-minute ka quick action plan simple Hinglish me samjhao taki mai is goal ko 100% complete kar saku.`;
        input.focus();
        input.dispatchEvent(new Event("input", { bubbles: true }));
    }
}

let reflectionSaveTimeout = null;
function handleReflectionInput() {
    const textarea = document.getElementById("daily-reflection-textarea");
    const statusBadge = document.getElementById("reflection-save-status");
    if (!textarea) return;

    if (statusBadge) statusBadge.textContent = "Saving...";

    if (reflectionSaveTimeout) clearTimeout(reflectionSaveTimeout);
    reflectionSaveTimeout = setTimeout(() => {
        const meta = getGoalsMeta();
        meta.reflection = textarea.value;
        saveGoalsMeta(meta);
        if (statusBadge) statusBadge.innerHTML = '<i class="fa-solid fa-check"></i> Auto-saved';
    }, 600);
}



// =====================================================
// DASHBOARD STATS
// =====================================================

function updateDashboardStats() {
    const chatCount = document.getElementById("dashboard-chat-count");
    const streakEl = document.getElementById("dashboard-streak");

    if (streakEl) {
        try {
            const meta = getGoalsMeta();
            streakEl.textContent = meta.streak || 1;
        } catch (e) {
            streakEl.textContent = "1";
        }
    }

    if (!chatCount) {
        return;
    }

    try {
        const chats = JSON.parse(
            localStorage.getItem("master_sahab_chat_history") || "[]"
        );

        let messages = 0;
        chats.forEach(chat => {
            if (Array.isArray(chat.messages)) {
                messages += chat.messages.filter(
                    item => item.role === "user"
                ).length;
            }
        });

        chatCount.textContent = messages;
    } catch (error) {
        chatCount.textContent = "0";
    }
}


// =====================================================
// RECENT ACTIVITY
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
                            ${formatIcon(activity.icon, "fa-solid fa-clock")}
                        </div>

                        <div class="activity-text">

                            <strong>
                                ${activity.text || "Study activity"}
                            </strong>

                            <small>
                                ${activity.time || "Recently"}
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

        element.style.opacity = "1";

    }, 180);
}


// =====================================================
// AUTO UPDATE DASHBOARD
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        updateDashboard();

    }
);/* =====================================================
   ALPHA - SUBJECT MANAGEMENT SYSTEM
===================================================== */

const SUBJECT_DATA_KEY = "master_sahab_data";

let editingSubjectId = null;


/* =====================================================
   GET MASTER DATA
===================================================== */

function getMasterData() {

    let data = {};

    try {
        data = JSON.parse(
            localStorage.getItem(SUBJECT_DATA_KEY)
        ) || {};
    } catch (error) {
        data = {};
    }

    if (!Array.isArray(data.subjects) || data.subjects.length === 0) {
        data.subjects = getDefaultStarterSubjects();
        try {
            localStorage.setItem(SUBJECT_DATA_KEY, JSON.stringify(data));
        } catch (e) {}
    }

    if (!Array.isArray(data.goals) || data.goals.length === 0) {
        data.goals = getDefaultStarterGoals();
        try {
            localStorage.setItem(SUBJECT_DATA_KEY, JSON.stringify(data));
        } catch (e) {}
    } else {
        data.goals = normalizeGoals(data.goals);
    }

    if (!Array.isArray(data.activities)) {
        data.activities = [];
    }

    return data;
}


/* =====================================================
   SAVE MASTER DATA
===================================================== */

function saveMasterData(data) {fetch()

    localStorage.setItem(
        SUBJECT_DATA_KEY,
        JSON.stringify(data)
    );

}


/* =====================================================
   CREATE ID
===================================================== */

function createSubjectId() {

    return "subject_" +
        Date.now() +
        "_" +
        Math.random()
            .toString(36)
            .substring(2, 8);

}


/* =====================================================
   CALCULATE PROGRESS
===================================================== */

function calculateSubjectProgress(subject) {

    if (!subject.topics || subject.topics.length === 0) {
        return 0;
    }

    const completed = subject.topics.filter(
        topic => topic.completed
    ).length;

    return Math.round(
        (completed / subject.topics.length) * 100
    );

}


/* =====================================================
   RENDER SUBJECTS
===================================================== */

function renderSubjects(searchText = "") {

    const container =
        document.getElementById("subjects-container");

    const empty =
        document.getElementById("subjects-empty");

    const count =
        document.getElementById("subject-total-count");

    if (!container) return;

    const data = getMasterData();

    data.subjects.forEach(subject => {

        subject.progress =
            calculateSubjectProgress(subject);

    });

    saveMasterData(data);

    const query =
        searchText.trim().toLowerCase();

    const subjects =
        data.subjects.filter(subject =>
            subject.name
                .toLowerCase()
                .includes(query)
        );

    if (count) {
        count.textContent = data.subjects.length;
    }

    if (subjects.length === 0) {

        container.innerHTML = "";

        if (empty) {
            empty.style.display = "block";
        }

        return;
    }

    if (empty) {
        empty.style.display = "none";
    }

    container.innerHTML = subjects.map(subject => {

        const topicCount =
            subject.topics?.length || 0;

        const syllabusCount =
            subject.syllabus?.length || 0;

        const docCount =
            Array.isArray(subject.documents)
                ? subject.documents.length
                : 0;

        const progress =
            calculateSubjectProgress(subject);

        return `

        <div class="enhanced-subject-card" onclick="openSubjectPage('${subject.id}')" style="cursor: pointer;">

            <div class="enhanced-subject-top">

                <div class="enhanced-subject-icon">
                    ${formatIcon(subject.icon, "fa-solid fa-book-open")}
                </div>

                <div class="enhanced-subject-info">

                    <h2>${escapeSubjectHTML(subject.name)}</h2>

                    <p>
                        ${
                            escapeSubjectHTML(
                                subject.description ||
                                "No description added."
                            )
                        }
                    </p>

                </div>

                <div class="subject-menu">

                    <button
                        title="Edit"
                        onclick="event.stopPropagation(); editSubject('${subject.id}')"
                    >
                        <i class="fa-solid fa-pen"></i>
                    </button>

                    <button
                        class="delete-subject"
                        title="Delete"
                        onclick="event.stopPropagation(); deleteSubject('${subject.id}')"
                    >
                        <i class="fa-solid fa-trash-can"></i>
                    </button>

                </div>

            </div>


            <div class="subject-progress-section">

                <div class="subject-progress-top">

                    <span>Study Progress</span>

                    <strong>${progress}%</strong>

                </div>

                <div class="subject-progress-bar">

                    <span style="width:${progress}%"></span>

                </div>

            </div>


            <div class="subject-card-footer">

                <div class="subject-card-stat">
                    <i class="fa-solid fa-folder"></i> <strong>${docCount}</strong> Docs
                    &nbsp;•&nbsp;
                    <i class="fa-solid fa-book-bookmark"></i> <strong>${syllabusCount}</strong> Units
                    &nbsp;•&nbsp;
                    <i class="fa-solid fa-list-check"></i> <strong>${topicCount}</strong> Topics
                </div>

                <div class="subject-card-btns">
                    <button
                        type="button"
                        class="subject-quiz-btn"
                        onclick="event.stopPropagation(); openSubjectQuizDirect('${subject.id}')"
                        title="Take practice quiz for ${escapeSubjectHTML(subject.name)}"
                    >
                        <i class="fa-solid fa-circle-question"></i> Quiz
                    </button>
                    <button
                        type="button"
                        class="open-subject-btn"
                        onclick="event.stopPropagation(); openSubjectPage('${subject.id}')"
                    >
                        Workspace →
                    </button>
                </div>

            </div>

        </div>

        `;

    }).join("");

    if (window.BorderGlow) {
        window.BorderGlow.scan();
    }
}


/* =====================================================
   ESCAPE HTML
===================================================== */

function escapeSubjectHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* =====================================================
   SEARCH
===================================================== */

function searchSubjects() {

    const input =
        document.getElementById("subject-search");

    renderSubjects(
        input ? input.value : ""
    );

}


/* =====================================================
   OPEN ADD SUBJECT
===================================================== */

function openSubjectModal(subject = null) {

    const modal =
        document.getElementById("subject-modal");

    if (!modal) return;

    editingSubjectId =
        subject ? subject.id : null;

    const title =
        document.getElementById("subject-modal-title");

    const badge =
        document.getElementById("subject-modal-badge");

    const name =
        document.getElementById("subject-name-input");

    const icon =
        document.getElementById("subject-icon-input");

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

    if (subject) {

        title.textContent = "Edit Subject";
        badge.innerHTML = '<i class="fa-solid fa-pen"></i> EDIT SUBJECT';

        name.value = subject.name || "";
        icon.value = subject.icon || "fa-solid fa-book-open";
        description.value =
            subject.description || "";

        syllabus.innerHTML = "";

        (subject.syllabus || []).forEach(item => {
            addSyllabusInput(item);
        });

        topics.innerHTML = "";

        (subject.topics || []).forEach(item => {
            addTopicInput(item.name);
        });

    } else {

        title.textContent = "Add Subject";
        badge.innerHTML = '<i class="fa-solid fa-folder-plus"></i> NEW SUBJECT';

        name.value = "";
        icon.value = "fa-solid fa-book-open";
        description.value = "";

        syllabus.innerHTML = "";
        topics.innerHTML = "";

        addSyllabusInput();
        addTopicInput();

    }

    modal.classList.add("show");

    setTimeout(() => {
        name.focus();
    }, 100);

}


/* =====================================================
   CLOSE SUBJECT MODAL
===================================================== */

function closeSubjectModal() {

    const modal =
        document.getElementById("subject-modal");

    if (modal) {
        modal.classList.remove("show");
    }

    editingSubjectId = null;

}


/* =====================================================
   SELECT ICON
===================================================== */

function selectSubjectIcon(icon) {
    const input = document.getElementById("subject-icon-input");
    if (input) {
        input.value = icon;
    }
    const buttons = document.querySelectorAll(".emoji-selector button");
    buttons.forEach(btn => {
        btn.classList.remove("selected");
        const onclickAttr = btn.getAttribute("onclick") || "";
        if (onclickAttr.includes(icon)) {
            btn.classList.add("selected");
        }
    });
}


/* =====================================================
   ADD SYLLABUS INPUT
===================================================== */

function addSyllabusInput(value = "") {

    const container =
        document.getElementById(
            "syllabus-input-list"
        );

    if (!container) return;

    const row =
        document.createElement("div");

    row.className = "dynamic-input-row";

    row.innerHTML = `

        <input
            type="text"
            placeholder="Example: Unit 1 - Java Basics"
            value="${escapeSubjectHTML(value)}"
        >

        <button
            type="button"
            class="remove-input-btn"
            onclick="this.parentElement.remove()"
        >
            ×
        </button>

    `;

    container.appendChild(row);

}


/* =====================================================
   ADD TOPIC INPUT
===================================================== */

function addTopicInput(value = "") {

    const container =
        document.getElementById(
            "topic-input-list"
        );

    if (!container) return;

    const row =
        document.createElement("div");

    row.className = "dynamic-input-row";

    row.innerHTML = `

        <input
            type="text"
            placeholder="Example: Classes and Objects"
            value="${escapeSubjectHTML(value)}"
        >

        <button
            type="button"
            class="remove-input-btn"
            onclick="this.parentElement.remove()"
        >
            ×
        </button>

    `;

    container.appendChild(row);

}


/* =====================================================
   SAVE SUBJECT
===================================================== */

function saveSubject() {

    const name =
        document.getElementById(
            "subject-name-input"
        ).value.trim();

    const icon =
        document.getElementById(
            "subject-icon-input"
        ).value || "fa-solid fa-book-open";

    const description =
        document.getElementById(
            "subject-description-input"
        ).value.trim();


    if (!name) {

        alert("Please enter subject name.");

        return;

    }


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


    const data = getMasterData();


    if (editingSubjectId) {

        const subject =
            data.subjects.find(
                item =>
                    item.id === editingSubjectId
            );

        if (!subject) return;


        const oldTopics =
            subject.topics || [];


        subject.name = name;
        subject.icon = icon;
        subject.description = description;
        subject.syllabus = syllabus;


        subject.topics =
            topicNames.map(topicName => {

                const oldTopic =
                    oldTopics.find(
                        topic =>
                            topic.name === topicName
                    );

                return {
                    id:
                        oldTopic?.id ||
                        createSubjectId(),

                    name: topicName,

                    completed:
                        oldTopic?.completed ||
                        false
                };

            });


        subject.progress =
            calculateSubjectProgress(subject);


    } else {

        const newSubject = {

            id: createSubjectId(),

            name: name,

            icon: icon,

            description: description,

            syllabus: syllabus,

            topics: topicNames.map(
                topicName => ({
                    id: createSubjectId(),
                    name: topicName,
                    completed: false
                })
            ),

            progress: 0,

            createdAt:
                new Date().toISOString()

        };


        data.subjects.push(newSubject);

    }


    saveMasterData(data);

    closeSubjectModal();

    renderSubjects();

    updateDashboardAfterSubjectChange();

}


/* =====================================================
   EDIT SUBJECT
===================================================== */

function editSubject(subjectId) {

    const data = getMasterData();

    const subject =
        data.subjects.find(
            item => item.id === subjectId
        );

    if (!subject) return;

    openSubjectModal(subject);

}


/* =====================================================
   DELETE SUBJECT
===================================================== */

function deleteSubject(subjectId) {

    const data = getMasterData();

    const subject =
        data.subjects.find(
            item => item.id === subjectId
        );

    if (!subject) return;


    const confirmed =
        confirm(
            `Delete "${subject.name}"?\n\nThis will remove its syllabus and topics too.`
        );

    if (!confirmed) return;


    data.subjects =
        data.subjects.filter(
            item => item.id !== subjectId
        );


    saveMasterData(data);

    renderSubjects();

    updateDashboardAfterSubjectChange();

}


/* =====================================================
   INDEXEDDB HELPER FOR DOCUMENT STORAGE
   Provides unlimited, persistent storage for PDFs, notes and images
===================================================== */

const DOCS_DB_NAME = "MasterSahabDocsDB";
const DOCS_DB_VERSION = 1;
const DOCS_STORE_NAME = "doc_files";

function openDocsDB() {
    return new Promise((resolve) => {
        if (!window.indexedDB) {
            resolve(null);
            return;
        }
        try {
            const req = indexedDB.open(DOCS_DB_NAME, DOCS_DB_VERSION);
            req.onupgradeneeded = function(e) {
                const db = e.target.result;
                if (!db.objectStoreNames.contains(DOCS_STORE_NAME)) {
                    db.createObjectStore(DOCS_STORE_NAME, { keyPath: "id" });
                }
            };
            req.onsuccess = function(e) {
                resolve(e.target.result);
            };
            req.onerror = function() {
                resolve(null);
            };
        } catch (err) {
            resolve(null);
        }
    });
}

async function saveDocFileToDB(docId, fileData) {
    try {
        const db = await openDocsDB();
        if (!db) return false;
        return new Promise((resolve) => {
            const tx = db.transaction([DOCS_STORE_NAME], "readwrite");
            const store = tx.objectStore(DOCS_STORE_NAME);
            store.put({ id: docId, data: fileData });
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        });
    } catch (e) {
        return false;
    }
}

async function getDocFileFromDB(docId) {
    try {
        const db = await openDocsDB();
        if (!db) return null;
        return new Promise((resolve) => {
            const tx = db.transaction([DOCS_STORE_NAME], "readonly");
            const store = tx.objectStore(DOCS_STORE_NAME);
            const req = store.get(docId);
            req.onsuccess = () => resolve(req.result ? req.result.data : null);
            req.onerror = () => resolve(null);
        });
    } catch (e) {
        return null;
    }
}

async function deleteDocFileFromDB(docId) {
    try {
        const db = await openDocsDB();
        if (!db) return false;
        return new Promise((resolve) => {
            const tx = db.transaction([DOCS_STORE_NAME], "readwrite");
            const store = tx.objectStore(DOCS_STORE_NAME);
            store.delete(docId);
            tx.oncomplete = () => resolve(true);
            tx.onerror = () => resolve(false);
        });
    } catch (e) {
        return false;
    }
}


/* =====================================================
   SUBJECT DETAIL STATE & HELPERS
===================================================== */

let currentSubjectId = null;
let currentDocFilter = "all";
let currentViewingDoc = null;

function getDocIconAndClass(doc) {
    const t = (doc.type || "").toLowerCase();
    const ext = ((doc.name || "").split(".").pop() || "").toLowerCase();

    if (t === "pdf" || ext === "pdf") {
        return { icon: '<i class="fa-solid fa-file-pdf"></i>', badgeClass: "pdf", badge: "PDF" };
    }
    if (t === "doc" || t === "word" || ["doc", "docx"].includes(ext)) {
        return { icon: '<i class="fa-solid fa-file-word"></i>', badgeClass: "doc", badge: "DOC" };
    }
    if (t === "text" || t === "note" || ["txt", "md", "csv", "json"].includes(ext)) {
        return { icon: '<i class="fa-solid fa-file-lines"></i>', badgeClass: "text", badge: "NOTE" };
    }
    if (t === "image" || ["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
        return { icon: '<i class="fa-solid fa-file-image"></i>', badgeClass: "image", badge: "IMG" };
    }
    if (t === "link" || t === "url") {
        return { icon: '<i class="fa-solid fa-link"></i>', badgeClass: "link", badge: "LINK" };
    }
    return { icon: '<i class="fa-solid fa-file"></i>', badgeClass: "doc", badge: (ext || "FILE").toUpperCase() };
}

function formatDocSize(bytes) {
    if (!bytes || bytes === 0) return "0 B";
    const k = 1024;
    const sizes = ["B", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
}


/* =====================================================
   OPEN SUBJECT PAGE (MAIN ENTRY WHEN SUBJECT IS CLICKED)
===================================================== */

function openSubjectPage(subjectId) {
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === subjectId);
    if (!subject) return;

    if (!Array.isArray(subject.documents)) subject.documents = [];
    if (!Array.isArray(subject.syllabus)) subject.syllabus = [];
    if (!Array.isArray(subject.topics)) subject.topics = [];

    currentSubjectId = subjectId;
    currentDocFilter = "all";

    // Update Hero elements
    const iconEl = document.getElementById("detail-subject-icon");
    const nameEl = document.getElementById("detail-subject-name");
    const descEl = document.getElementById("detail-subject-desc");
    const breadcrumbName = document.getElementById("detail-breadcrumb-name");
    const progressBadge = document.getElementById("detail-progress-badge");
    const progressPct = document.getElementById("detail-progress-pct");
    const progressFill = document.getElementById("detail-progress-fill");

    const statDocs = document.getElementById("detail-stat-docs");
    const statUnits = document.getElementById("detail-stat-units");
    const statTopics = document.getElementById("detail-stat-topics");
    const tabDocsCount = document.getElementById("detail-tab-docs-count");
    const tabTopicsCount = document.getElementById("detail-tab-topics-count");

    const progress = calculateSubjectProgress(subject);

    if (iconEl) iconEl.innerHTML = formatIcon(subject.icon, "fa-solid fa-book-open");
    if (nameEl) nameEl.textContent = subject.name || "Subject";
    if (descEl) descEl.textContent = subject.description || "Comprehensive workspace for notes, syllabus, and study materials.";
    if (breadcrumbName) breadcrumbName.textContent = subject.name || "Subject";

    if (progressBadge) progressBadge.textContent = `${progress}% Completed`;
    if (progressPct) progressPct.textContent = `${progress}%`;
    if (progressFill) progressFill.style.width = `${progress}%`;

    if (statDocs) statDocs.textContent = subject.documents.length;
    if (statUnits) statUnits.textContent = subject.syllabus.length;
    if (statTopics) statTopics.textContent = subject.topics.length;
    if (tabDocsCount) tabDocsCount.textContent = subject.documents.length;
    if (tabTopicsCount) tabTopicsCount.textContent = subject.topics.length;

    const tabQuizCount = document.getElementById("detail-tab-quiz-count");
    if (tabQuizCount && typeof getQuizHistory === "function") {
        tabQuizCount.textContent = getQuizHistory(subjectId).length;
    }

    // Reset search & filters
    const searchInput = document.getElementById("doc-search-input");
    if (searchInput) searchInput.value = "";

    document.querySelectorAll(".doc-filter-pill").forEach(pill => {
        pill.classList.toggle("active", pill.getAttribute("data-filter") === "all");
    });

    // Render tabs
    renderSubjectDocuments();
    renderSubjectSyllabusAndTopics(subject);

    // Switch to Documents tab by default
    switchSubjectDetailTab("docs");

    // Open the page
    showPage("subject-detail");

    // Keep Subjects nav item highlighted
    document.querySelectorAll(".nav-item").forEach(item => {
        const onclickAttr = item.getAttribute("onclick") || "";
        if (onclickAttr.includes("'subjects'")) {
            item.classList.add("active");
        }
    });

    window.scrollTo({ top: 0, behavior: "smooth" });
}

// Backward-compatible alias for existing calls
function openSubjectDetails(subjectId) {
    openSubjectPage(subjectId);
}


/* =====================================================
   RENDER DOCUMENTS IN SUBJECT DETAIL PAGE
===================================================== */

function renderSubjectDocuments(searchText = "") {
    const grid = document.getElementById("subject-documents-grid");
    const empty = document.getElementById("subject-docs-empty");
    if (!grid) return;

    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject) return;

    if (!Array.isArray(subject.documents)) {
        subject.documents = [];
    }

    const query = searchText.trim().toLowerCase();

    const filtered = subject.documents.filter(doc => {
        const matchesQuery = !query ||
            (doc.name && doc.name.toLowerCase().includes(query)) ||
            (doc.description && doc.description.toLowerCase().includes(query));

        if (!matchesQuery) return false;

        if (currentDocFilter === "all") return true;
        if (currentDocFilter === "pdf") return doc.type === "pdf";
        if (currentDocFilter === "text") return doc.type === "text" || doc.type === "note";
        if (currentDocFilter === "image") return doc.type === "image";
        if (currentDocFilter === "link") return doc.type === "link";
        return true;
    });

    const tabDocsCount = document.getElementById("detail-tab-docs-count");
    const statDocs = document.getElementById("detail-stat-docs");
    if (tabDocsCount) tabDocsCount.textContent = subject.documents.length;
    if (statDocs) statDocs.textContent = subject.documents.length;

    if (filtered.length === 0) {
        grid.innerHTML = "";
        grid.style.display = "none";
        if (empty) empty.style.display = "block";
        return;
    }

    if (empty) empty.style.display = "none";
    grid.style.display = "grid";

    grid.innerHTML = filtered.map(doc => {
        const iconInfo = getDocIconAndClass(doc);
        return `
            <div class="doc-card" onclick="viewDocument('${doc.id}')">
                <div class="doc-card-top">
                    <div class="doc-icon-badge ${iconInfo.badgeClass}">
                        ${iconInfo.icon}
                    </div>
                    <div class="doc-info">
                        <h4 title="${escapeSubjectHTML(doc.name)}">${escapeSubjectHTML(doc.name)}</h4>
                        <p>${escapeSubjectHTML(doc.description || "Study material for " + subject.name)}</p>
                    </div>
                </div>

                <div class="doc-meta">
                    <span class="doc-meta-badge">${escapeSubjectHTML(doc.typeBadge || iconInfo.badge)}</span>
                    <span>${escapeSubjectHTML(doc.size || "")}</span>
                    <span>${escapeSubjectHTML(doc.uploadDate || "Recent")}</span>
                </div>

                <div class="doc-card-actions" onclick="event.stopPropagation()">
                    <button class="doc-btn view" onclick="viewDocument('${doc.id}')">
                        <i class="fa-solid fa-eye"></i> View
                    </button>
                    ${
                        doc.type === "link"
                        ? `<a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="doc-btn download" title="Open Link"><i class="fa-solid fa-up-right-from-square"></i></a>`
                        : `<button class="doc-btn download" onclick="downloadDocument('${doc.id}')" title="Download Document"><i class="fa-solid fa-download"></i></button>`
                    }
                    <button class="doc-btn delete" onclick="deleteDocument('${doc.id}')" title="Delete Document">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
            </div>
        `;
    }).join("");
}


/* =====================================================
   DOCUMENT UPLOAD & DRAG-AND-DROP HANDLERS
===================================================== */

function triggerDocUpload() {
    const input = document.getElementById("subject-doc-file-input");
    if (input) input.click();
}

async function handleDocFilesSelected(event) {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    await processUploadedFiles(Array.from(files));
    event.target.value = "";
}

function handleDocDragOver(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById("doc-drop-zone");
    if (zone) zone.classList.add("dragover");
}

function handleDocDragLeave(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById("doc-drop-zone");
    if (zone) zone.classList.remove("dragover");
}

async function handleDocDrop(event) {
    event.preventDefault();
    event.stopPropagation();
    const zone = document.getElementById("doc-drop-zone");
    if (zone) zone.classList.remove("dragover");

    if (event.dataTransfer && event.dataTransfer.files.length > 0) {
        await processUploadedFiles(Array.from(event.dataTransfer.files));
    }
}

async function processUploadedFiles(fileList) {
    if (!currentSubjectId) return;

    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject) return;

    if (!Array.isArray(subject.documents)) {
        subject.documents = [];
    }

    for (const file of fileList) {
        const docId = "doc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
        const ext = file.name.split(".").pop().toLowerCase();

        let type = "other";
        let typeBadge = ext.toUpperCase();
        if (ext === "pdf") {
            type = "pdf";
            typeBadge = "PDF";
        } else if (["doc", "docx"].includes(ext)) {
            type = "doc";
            typeBadge = "DOC";
        } else if (["txt", "md", "csv", "json"].includes(ext)) {
            type = "text";
            typeBadge = ext.toUpperCase();
        } else if (["png", "jpg", "jpeg", "webp", "gif"].includes(ext)) {
            type = "image";
            typeBadge = "IMG";
        }

        const sizeFormatted = formatDocSize(file.size);
        const dateFormatted = new Intl.DateTimeFormat('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        }).format(new Date());

        const fileDataUrl = await readFileAsDataURL(file);

        // Save file data to IndexedDB
        await saveDocFileToDB(docId, fileDataUrl);

        const docRecord = {
            id: docId,
            name: file.name,
            type: type,
            typeBadge: typeBadge,
            size: sizeFormatted,
            sizeBytes: file.size,
            uploadDate: dateFormatted,
            description: `Uploaded document for ${subject.name}`,
            inlineData: file.size < 150000 ? fileDataUrl : null
        };

        subject.documents.unshift(docRecord);
    }

    saveMasterData(data);
    renderSubjectDocuments();
    renderSubjects();
    showToast(`Uploaded ${fileList.length} document${fileList.length > 1 ? "s" : ""}!`);
}

function readFileAsDataURL(file) {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.onerror = () => resolve(null);
        reader.readAsDataURL(file);
    });
}


/* =====================================================
   DOCUMENT VIEWER MODAL
===================================================== */

async function viewDocument(docId) {
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject || !subject.documents) return;

    const doc = subject.documents.find(d => d.id === docId);
    if (!doc) return;

    currentViewingDoc = doc;

    const modal = document.getElementById("doc-viewer-modal");
    const titleEl = document.getElementById("viewer-doc-title");
    const metaEl = document.getElementById("viewer-doc-meta");
    const iconEl = document.getElementById("viewer-doc-icon");
    const bodyEl = document.getElementById("viewer-doc-body");
    const dlBtn = document.getElementById("viewer-download-btn");
    const extBtn = document.getElementById("viewer-external-btn");

    if (!modal || !bodyEl) return;

    const iconInfo = getDocIconAndClass(doc);
    if (iconEl) iconEl.textContent = iconInfo.icon;
    if (titleEl) titleEl.textContent = doc.name;
    if (metaEl) metaEl.textContent = `${doc.typeBadge || iconInfo.badge} • ${doc.size || ""} • Added ${doc.uploadDate || ""}`;

    let fileData = doc.inlineData || doc.url;
    if (!fileData && doc.type !== "link") {
        fileData = await getDocFileFromDB(doc.id);
    }

    if (dlBtn) {
        if (doc.type === "link") {
            dlBtn.style.display = "none";
        } else {
            dlBtn.style.display = "inline-flex";
            dlBtn.href = fileData || "#";
            dlBtn.download = doc.name;
        }
    }

    if (extBtn) {
        if (doc.type === "link") {
            extBtn.style.display = "inline-flex";
            extBtn.href = doc.url;
        } else if (doc.type === "pdf" && fileData) {
            extBtn.style.display = "inline-flex";
            extBtn.href = fileData;
        } else {
            extBtn.style.display = "none";
        }
    }

    if (doc.type === "pdf") {
        if (fileData) {
            bodyEl.innerHTML = `
                <iframe src="${fileData}" style="width: 100%; height: 75vh; border: none; border-radius: 12px; background: #fff;" title="${escapeSubjectHTML(doc.name)}"></iframe>
            `;
        } else {
            bodyEl.innerHTML = `
                <div class="doc-empty-state">
                    <div class="doc-empty-icon"><i class="fa-solid fa-file-pdf"></i></div>
                    <h3>PDF Document</h3>
                    <p>${escapeSubjectHTML(doc.name)}</p>
                    <button class="hero-action-btn primary" onclick="downloadDocument('${doc.id}')">Download PDF to View</button>
                </div>
            `;
        }
    } else if (doc.type === "image") {
        bodyEl.innerHTML = `
            <img src="${fileData}" alt="${escapeSubjectHTML(doc.name)}" style="max-width: 100%; max-height: 72vh; object-fit: contain; border-radius: 12px; box-shadow: 0 4px 20px rgba(0,0,0,0.15);" />
        `;
    } else if (doc.type === "link") {
        bodyEl.innerHTML = `
            <div class="doc-link-preview-box">
                <div class="link-icon"><i class="fa-solid fa-link"></i></div>
                <h3>${escapeSubjectHTML(doc.name)}</h3>
                <p>${escapeSubjectHTML(doc.url)}</p>
                ${doc.description ? `<p style="margin-bottom: 20px; color: var(--text-body); font-weight: 500;">${escapeSubjectHTML(doc.description)}</p>` : ""}
                <a href="${doc.url}" target="_blank" rel="noopener noreferrer" class="hero-action-btn primary" style="text-decoration:none; display:inline-flex;">
                    Open Link in New Tab ↗
                </a>
            </div>
        `;
    } else if (doc.type === "text" || doc.type === "note") {
        let textContent = doc.content || "";
        if (!textContent && fileData && fileData.startsWith("data:")) {
            try {
                const base64Part = fileData.split(",")[1];
                textContent = decodeURIComponent(escape(atob(base64Part)));
            } catch (e) {
                textContent = "Could not decode text file.";
            }
        }
        bodyEl.innerHTML = `
            <div style="width: 100%; display: flex; justify-content: flex-end; margin-bottom: 10px;">
                <button class="hero-action-btn secondary" onclick="navigator.clipboard.writeText(document.getElementById('doc-raw-text').innerText); showToast('Copied to clipboard!')">
                    <i class="fa-solid fa-copy"></i> Copy Text
                </button>
            </div>
            <pre class="doc-text-reader" id="doc-raw-text">${escapeSubjectHTML(textContent || doc.description || "No text content available.")}</pre>
        `;
    } else {
        bodyEl.innerHTML = `
            <div class="doc-empty-state">
                <div class="doc-empty-icon"><i class="fa-solid fa-file"></i></div>
                <h3>${escapeSubjectHTML(doc.name)}</h3>
                <p>${escapeSubjectHTML(doc.size || "")} • ${escapeSubjectHTML(doc.uploadDate || "")}</p>
                <button class="hero-action-btn primary" onclick="downloadDocument('${doc.id}')">
                    <i class="fa-solid fa-download"></i> Download File
                </button>
            </div>
        `;
    }

    modal.classList.add("show");
}

function closeDocViewer() {
    const modal = document.getElementById("doc-viewer-modal");
    if (modal) modal.classList.remove("show");
    const bodyEl = document.getElementById("viewer-doc-body");
    if (bodyEl) bodyEl.innerHTML = "";
    currentViewingDoc = null;
}


/* =====================================================
   DOWNLOAD & DELETE DOCUMENTS
===================================================== */

async function downloadDocument(docId) {
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject || !subject.documents) return;
    const doc = subject.documents.find(d => d.id === docId);
    if (!doc) return;

    if (doc.type === "link") {
        window.open(doc.url, "_blank");
        return;
    }

    let fileData = doc.inlineData;
    if (!fileData) {
        fileData = await getDocFileFromDB(doc.id);
    }

    if (!fileData) {
        alert("Document file data is not available.");
        return;
    }

    const a = document.createElement("a");
    a.href = fileData;
    a.download = doc.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    showToast(`Downloading "${doc.name}"...`);
}

async function deleteDocument(docId) {
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject || !subject.documents) return;
    const doc = subject.documents.find(d => d.id === docId);
    if (!doc) return;

    const confirmed = confirm(`Delete "${doc.name}" from this subject?`);
    if (!confirmed) return;

    subject.documents = subject.documents.filter(d => d.id !== docId);
    await deleteDocFileFromDB(docId);
    saveMasterData(data);

    renderSubjectDocuments();
    renderSubjects();
    showToast(`Deleted "${doc.name}".`);
}


/* =====================================================
   ADD NOTE / WEB LINK MODAL
===================================================== */

function openAddNoteModal() {
    const modal = document.getElementById("add-doc-modal");
    if (!modal) return;
    document.getElementById("add-doc-title").value = "";
    document.getElementById("add-doc-url").value = "";
    document.getElementById("add-doc-content").value = "";
    document.getElementById("add-doc-desc").value = "";
    updateDocModalForm();
    modal.classList.add("show");
    setTimeout(() => {
        document.getElementById("add-doc-title").focus();
    }, 100);
}

function closeAddDocModal() {
    const modal = document.getElementById("add-doc-modal");
    if (modal) modal.classList.remove("show");
}

function updateDocModalForm() {
    const checkedOpt = document.querySelector("input[name='doc-kind']:checked");
    const kind = checkedOpt ? checkedOpt.value : "note";
    const groupUrl = document.getElementById("group-doc-url");
    const groupContent = document.getElementById("group-doc-content");
    if (kind === "link") {
        if (groupUrl) groupUrl.style.display = "block";
        if (groupContent) groupContent.style.display = "none";
    } else {
        if (groupUrl) groupUrl.style.display = "none";
        if (groupContent) groupContent.style.display = "block";
    }
}

function saveManualDoc() {
    if (!currentSubjectId) return;
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject) return;
    if (!Array.isArray(subject.documents)) subject.documents = [];

    const checkedOpt = document.querySelector("input[name='doc-kind']:checked");
    const kind = checkedOpt ? checkedOpt.value : "note";
    const title = document.getElementById("add-doc-title").value.trim();
    const url = document.getElementById("add-doc-url").value.trim();
    const content = document.getElementById("add-doc-content").value.trim();
    const desc = document.getElementById("add-doc-desc").value.trim();

    if (!title) {
        alert("Please enter a title.");
        return;
    }

    const docId = "doc_" + Date.now() + "_" + Math.random().toString(36).substring(2, 8);
    const dateFormatted = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date());

    if (kind === "link") {
        if (!url) {
            alert("Please enter a valid link/URL.");
            return;
        }
        subject.documents.unshift({
            id: docId,
            name: title,
            type: "link",
            typeBadge: "LINK",
            url: url,
            size: "External",
            uploadDate: dateFormatted,
            description: desc || "Web link / study resource"
        });
    } else {
        if (!content && !desc) {
            alert("Please enter note content.");
            return;
        }
        subject.documents.unshift({
            id: docId,
            name: title,
            type: "note",
            typeBadge: "NOTE",
            content: content,
            size: formatDocSize(new Blob([content]).size),
            uploadDate: dateFormatted,
            description: desc || "Personal study notes"
        });
    }

    saveMasterData(data);
    closeAddDocModal();
    renderSubjectDocuments();
    renderSubjects();
    showToast(`Added "${title}" to documents!`);
}


/* =====================================================
   SAMPLE DOCUMENTS GENERATOR
===================================================== */

function addSampleDocsForSubject() {
    if (!currentSubjectId) return;
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject) return;
    if (!Array.isArray(subject.documents)) subject.documents = [];

    const dateFormatted = new Intl.DateTimeFormat('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    }).format(new Date());

    subject.documents.push({
        id: "doc_" + Date.now() + "_sample1",
        name: `${subject.name} - Quick Revision Notes & Formulas.txt`,
        type: "note",
        typeBadge: "NOTE",
        content: `ALPHA REVISION NOTES: ${subject.name.toUpperCase()}
==================================================
Subject: ${subject.name}
Date: ${dateFormatted}

1. CORE OVERVIEW & STRATEGY:
- Master the fundamental units before proceeding to advanced chapters.
- Solve textbook examples and past year questions.
- Ask Alpha tutor for any difficult doubt!

2. KEY SYLLABUS UNITS:
${(subject.syllabus || []).map((u, i) => `Unit ${i + 1}: ${u}`).join("\n") || "- Standard Curriculum"}

3. IMPORTANT TOPICS CHECKLIST:
${(subject.topics || []).map((t, i) => `[${t.completed ? "✓" : " "}] ${i + 1}. ${t.name}`).join("\n") || "- No topics added yet."}

4. STUDY TIPS:
- Spend 45 minutes of focused study followed by 10 minutes break (Pomodoro).
- Test yourself at the end of each session.
`,
        size: "1.5 KB",
        uploadDate: dateFormatted,
        description: `Essential revision formulas and syllabus highlights for ${subject.name}`
    });

    subject.documents.push({
        id: "doc_" + Date.now() + "_sample2",
        name: `${subject.name} - Online Documentation & Learning Resource`,
        type: "link",
        typeBadge: "LINK",
        url: "https://en.wikipedia.org/wiki/" + encodeURIComponent(subject.name),
        size: "External",
        uploadDate: dateFormatted,
        description: `Official encyclopedia and learning resource link for ${subject.name}`
    });

    saveMasterData(data);
    renderSubjectDocuments();
    renderSubjects();
    showToast(`Added sample study documents for ${subject.name}!`);
}


/* =====================================================
   TABS & DETAIL PAGE INTERACTIONS
===================================================== */

function switchSubjectDetailTab(tab) {
    const docsTabBtn = document.getElementById("tab-btn-docs");
    const syllabusTabBtn = document.getElementById("tab-btn-syllabus");
    const quizTabBtn = document.getElementById("tab-btn-quiz");

    const docsContent = document.getElementById("subject-tab-content-docs");
    const syllabusContent = document.getElementById("subject-tab-content-syllabus");
    const quizContent = document.getElementById("subject-tab-content-quiz");

    // Reset buttons
    if (docsTabBtn) docsTabBtn.classList.remove("active");
    if (syllabusTabBtn) syllabusTabBtn.classList.remove("active");
    if (quizTabBtn) quizTabBtn.classList.remove("active");

    // Reset contents
    if (docsContent) docsContent.style.display = "none";
    if (syllabusContent) syllabusContent.style.display = "none";
    if (quizContent) quizContent.style.display = "none";

    if (tab === "docs") {
        if (docsTabBtn) docsTabBtn.classList.add("active");
        if (docsContent) docsContent.style.display = "block";
    } else if (tab === "syllabus") {
        if (syllabusTabBtn) syllabusTabBtn.classList.add("active");
        if (syllabusContent) syllabusContent.style.display = "block";
    } else if (tab === "quiz") {
        if (quizTabBtn) quizTabBtn.classList.add("active");
        if (quizContent) quizContent.style.display = "block";
        if (typeof setupSubjectQuizTab === "function") {
            setupSubjectQuizTab();
        }
    }
}

function filterDocuments() {
    const input = document.getElementById("doc-search-input");
    renderSubjectDocuments(input ? input.value : "");
}

function setDocFilter(filterType, btn) {
    currentDocFilter = filterType;
    document.querySelectorAll(".doc-filter-pill").forEach(p => p.classList.remove("active"));
    if (btn) btn.classList.add("active");
    filterDocuments();
}

function askAiAboutSubject() {
    if (!currentSubjectId) return;
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject) return;

    showPage("chat");
    const msgInput = document.getElementById("message");
    if (msgInput) {
        msgInput.value = `Mujhe "${subject.name}" ke important concepts aur syllabus simple Hindi/Hinglish me samjhao.`;
        msgInput.focus();
    }
}

function editSubjectFromDetail() {
    if (!currentSubjectId) return;
    editSubject(currentSubjectId);
}

function renderSubjectSyllabusAndTopics(subject) {
    const syllabusList = document.getElementById("detail-syllabus-list");
    const topicsList = document.getElementById("detail-topics-list");

    if (syllabusList) {
        if (subject.syllabus && subject.syllabus.length > 0) {
            syllabusList.innerHTML = subject.syllabus.map((unit, index) => `
                <div class="syllabus-item">
                    <i class="fa-solid fa-book-bookmark"></i> <strong>Unit ${index + 1}:</strong> ${escapeSubjectHTML(unit)}
                </div>
            `).join("");
        } else {
            syllabusList.innerHTML = `<div class="dashboard-empty">No syllabus units added yet. Click "Edit" to add units.</div>`;
        }
    }

    if (topicsList) {
        if (subject.topics && subject.topics.length > 0) {
            topicsList.innerHTML = subject.topics.map(topic => `
                <label class="topic-item ${topic.completed ? "completed" : ""}">
                    <input
                        type="checkbox"
                        class="topic-check"
                        ${topic.completed ? "checked" : ""}
                        onchange="toggleSubjectTopicFromDetail('${subject.id}', '${topic.id}')"
                    >
                    <span>${escapeSubjectHTML(topic.name)}</span>
                </label>
            `).join("");
        } else {
            topicsList.innerHTML = `<div class="dashboard-empty">No topics added yet. Click "Edit" to add topics.</div>`;
        }
    }
}

function toggleSubjectTopicFromDetail(subjectId, topicId) {
    toggleSubjectTopic(subjectId, topicId);
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === subjectId);
    if (subject) {
        const progress = calculateSubjectProgress(subject);
        const progressBadge = document.getElementById("detail-progress-badge");
        const progressPct = document.getElementById("detail-progress-pct");
        const progressFill = document.getElementById("detail-progress-fill");
        if (progressBadge) progressBadge.textContent = `${progress}% Completed`;
        if (progressPct) progressPct.textContent = `${progress}%`;
        if (progressFill) progressFill.style.width = `${progress}%`;
        renderSubjectSyllabusAndTopics(subject);
    }
}

function showToast(message) {
    const existing = document.querySelector(".ms-toast");
    if (existing) existing.remove();

    // Clean any leading emoji
    const cleanMsg = (message || "").replace(/^\p{Extended_Pictographic}\s*/u, "");

    const toast = document.createElement("div");
    toast.className = "ms-toast";
    toast.innerHTML = `<span><i class="fa-solid fa-circle-check"></i></span> <span>${escapeSubjectHTML(cleanMsg || message)}</span>`;
    document.body.appendChild(toast);

    setTimeout(() => {
        toast.style.transition = "opacity 0.3s ease, transform 0.3s ease";
        toast.style.opacity = "0";
        toast.style.transform = "translateY(15px)";
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


/* =====================================================
   COMPLETE / UNCOMPLETE TOPIC
===================================================== */

function toggleSubjectTopic(subjectId, topicId) {
    const data = getMasterData();
    const subject = data.subjects.find(item => item.id === subjectId);
    if (!subject) return;

    const topic = subject.topics.find(item => item.id === topicId);
    if (!topic) return;

    topic.completed = !topic.completed;
    subject.progress = calculateSubjectProgress(subject);

    saveMasterData(data);
    renderSubjects();
    updateDashboardAfterSubjectChange();
}


/* =====================================================
   DASHBOARD SYNC
===================================================== */

function updateDashboardAfterSubjectChange() {
    try {
        if (typeof updateDashboard === "function") {
            updateDashboard();
        }
    } catch (error) {
        console.log("Dashboard sync:", error);
    }
}


/* =====================================================
   INITIALIZE SUBJECTS
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        renderSubjects();

    }
);


/* =====================================================
   CLOSE MODALS ON BACKGROUND CLICK
===================================================== */

document.addEventListener(
    "click",
    function(event) {
        const modals = [
            { id: "subject-modal", close: closeSubjectModal },
            { id: "doc-viewer-modal", close: closeDocViewer },
            { id: "add-doc-modal", close: closeAddDocModal },
            { id: "global-quiz-modal", close: typeof closeGlobalQuizModal === "function" ? closeGlobalQuizModal : null },
            { id: "add-goal-modal", close: typeof closeAddGoalModal === "function" ? closeAddGoalModal : null },
            { id: "ai-goal-planner-modal", close: typeof closeAiGoalPlannerModal === "function" ? closeAiGoalPlannerModal : null },
            { id: "ai-study-audit-modal", close: typeof closeAiStudyAuditModal === "function" ? closeAiStudyAuditModal : null }
        ];

        modals.forEach(({ id, close }) => {
            const modalEl = document.getElementById(id);
            if (modalEl && event.target === modalEl && typeof close === "function") {
                close();
            }
        });
    }
);


/* =====================================================
   ESC KEY - CLOSE ANY ACTIVE MODAL
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {
        if (event.key !== "Escape") return;

        if (typeof closeSubjectModal === "function") closeSubjectModal();
        if (typeof closeDocViewer === "function") closeDocViewer();
        if (typeof closeAddDocModal === "function") closeAddDocModal();
        if (typeof closeGlobalQuizModal === "function") closeGlobalQuizModal();
        if (typeof closeAddGoalModal === "function") closeAddGoalModal();
        if (typeof closeAiGoalPlannerModal === "function") closeAiGoalPlannerModal();
        if (typeof closeAiStudyAuditModal === "function") closeAiStudyAuditModal();
    }
);


/* =====================================================
   ALPHA THEME ENGINE
   Alpha Deep Purple (Default), Emerald Scholar, Obsidian Luxe
===================================================== */

function setAppTheme(themeName) {
    if (!themeName || themeName === "royal") themeName = "alpha";
    document.documentElement.setAttribute("data-theme", themeName);
    localStorage.setItem("master_sahab_theme", themeName);

    document.querySelectorAll(".theme-opt").forEach(btn => {
        const onclickAttr = btn.getAttribute("onclick") || "";
        if (onclickAttr.includes("'" + themeName + "'")) {
            btn.classList.add("active");
        } else {
            btn.classList.remove("active");
        }
    });
}

// Auto-initialize theme on load
(function() {
    let savedTheme = localStorage.getItem("master_sahab_theme") || "alpha";
    if (savedTheme === "royal") savedTheme = "alpha";
    document.documentElement.setAttribute("data-theme", savedTheme);

    window.addEventListener("DOMContentLoaded", () => {
        setAppTheme(savedTheme);
    });

    if (document.readyState === "complete" || document.readyState === "interactive") {
        setAppTheme(savedTheme);
    }
})();


/* =====================================================
   ALPHA - QUIZ & PRACTICE SYSTEM MODULE
   Interactive subject & topic quizzes with AI tutor explanations
===================================================== */

const QUIZ_HISTORY_KEY = "master_sahab_quiz_history";

let currentQuizState = null;
let currentQuizCount = 5;
let globalQuizCount = 5;

/* -----------------------------------------------------
   DEFAULT STARTER SUBJECTS (If database is empty)
----------------------------------------------------- */
function getDefaultStarterSubjects() {
    return [
        {
            id: "subject_java_default",
            name: "Java Programming",
            icon: "fa-brands fa-java",
            description: "Object-Oriented Programming, classes, inheritance, polymorphism, exceptions, and collections framework.",
            syllabus: [
                "Unit 1: Fundamentals of Java & Object-Oriented Principles",
                "Unit 2: Inheritance, Interfaces & Abstract Classes",
                "Unit 3: Exception Handling & File I/O Streams",
                "Unit 4: Java Collections Framework & Generics"
            ],
            topics: [
                { id: "top_j1", name: "Classes, Objects & Constructors", completed: true },
                { id: "top_j2", name: "Encapsulation & Access Modifiers", completed: true },
                { id: "top_j3", name: "Inheritance & Method Overriding", completed: false },
                { id: "top_j4", name: "Polymorphism & Dynamic Binding", completed: false },
                { id: "top_j5", name: "Abstract Classes vs Interfaces", completed: false },
                { id: "top_j6", name: "Exception Handling (try-catch-finally)", completed: false },
                { id: "top_j7", name: "Collections Framework (ArrayList, HashMap)", completed: false }
            ],
            documents: [],
            progress: 28
        },
        {
            id: "subject_python_default",
            name: "Python",
            icon: "fa-brands fa-python",
            description: "Modern Python programming: data structures, list comprehensions, functions, OOP, and file processing.",
            syllabus: [
                "Unit 1: Python Syntax, Variables & Control Flow",
                "Unit 2: Built-in Data Structures & Comprehensions",
                "Unit 3: Functions, Lambda & Functional Programming",
                "Unit 4: Object-Oriented Programming in Python"
            ],
            topics: [
                { id: "top_p1", name: "Python Data Types & Lists/Tuples", completed: true },
                { id: "top_p2", name: "Dictionaries & Set Operations", completed: true },
                { id: "top_p3", name: "List Comprehensions & Generator Expressions", completed: false },
                { id: "top_p4", name: "Functions, *args, **kwargs & Lambdas", completed: false },
                { id: "top_p5", name: "Classes, self & __init__ Constructors", completed: false },
                { id: "top_p6", name: "File Handling & Context Managers (with)", completed: false }
            ],
            documents: [],
            progress: 33
        },
        {
            id: "subject_webdev_default",
            name: "Web Development",
            icon: "fa-solid fa-globe",
            description: "Front-end and full-stack essentials: semantic HTML5, modern CSS3 Flexbox/Grid, and modern JavaScript ES6+.",
            syllabus: [
                "Unit 1: Semantic HTML5 & Modern Responsive CSS",
                "Unit 2: CSS Flexbox, Grid Layouts & Animations",
                "Unit 3: JavaScript ES6+ & DOM Manipulation",
                "Unit 4: Asynchronous JavaScript (Promises, async/await, Fetch)"
            ],
            topics: [
                { id: "top_w1", name: "Semantic HTML Elements & Forms", completed: true },
                { id: "top_w2", name: "CSS Box Model, Flexbox & Grid", completed: false },
                { id: "top_w3", name: "JavaScript ES6+ Syntax & Closures", completed: false },
                { id: "top_w4", name: "DOM Selection, Events & Event Bubbling", completed: false },
                { id: "top_w5", name: "Fetch API & REST JSON Integration", completed: false }
            ],
            documents: [],
            progress: 20
        },
        {
            id: "subject_dbms_default",
            name: "Database Management (DBMS)",
            icon: "fa-solid fa-database",
            description: "Relational data model, SQL queries, table joins, Normalization, ACID transactions, and indexing.",
            syllabus: [
                "Unit 1: Relational Data Model & ER Diagrams",
                "Unit 2: Structured Query Language (SQL) & Joins",
                "Unit 3: Functional Dependencies & Normalization",
                "Unit 4: Transactions, ACID Properties & Concurrency"
            ],
            topics: [
                { id: "top_d1", name: "Primary Key, Foreign Key & Integrity Constraints", completed: true },
                { id: "top_d2", name: "SQL Queries: SELECT, GROUP BY & HAVING", completed: true },
                { id: "top_d3", name: "SQL Joins (INNER, LEFT, RIGHT, FULL OUTER)", completed: false },
                { id: "top_d4", name: "Normalization (1NF, 2NF, 3NF, BCNF)", completed: false },
                { id: "top_d5", name: "ACID Properties & Transaction States", completed: false }
            ],
            documents: [],
            progress: 40
        }
    ];
}


/* -----------------------------------------------------
   CURATED HIGH-YIELD EDUCATIONAL QUESTION BANK
   Pedagogically verified questions for fast offline/fallback generation
----------------------------------------------------- */
const CURATED_QUIZ_BANK = {
    java: [
        {
            topic: "Classes, Objects & Constructors",
            difficulty: "easy",
            question: "Which keyword in Java is used to create a new instance of a class?",
            options: ["alloc", "create", "new", "instanceof"],
            correct_index: 2,
            explanation: "In Java, the 'new' keyword dynamically allocates memory on the heap for a new object and calls its constructor.",
            hint: "It is a 3-letter keyword also used in C++."
        },
        {
            topic: "Classes, Objects & Constructors",
            difficulty: "medium",
            question: "What happens if no constructor is defined in a Java class?",
            options: [
                "The code fails to compile with an error",
                "The Java compiler automatically generates a default no-argument constructor",
                "All member variables remain undefined",
                "Objects of that class cannot be instantiated"
            ],
            correct_index: 1,
            explanation: "The Java compiler provides an automatic default no-argument constructor that initializes primitive fields to defaults (0, false, null) if and only if no constructor is explicitly written.",
            hint: "The compiler helps you out so instantiation is still possible."
        },
        {
            topic: "Encapsulation & Access Modifiers",
            difficulty: "easy",
            question: "Which access modifier provides the highest level of restriction in Java?",
            options: ["public", "protected", "default (package-private)", "private"],
            correct_index: 3,
            explanation: "'private' members are only accessible within the same class declaration, hiding internal state from the outside world (Encapsulation).",
            hint: "Only accessible inside the declaring class itself."
        },
        {
            topic: "Encapsulation & Access Modifiers",
            difficulty: "medium",
            question: "How is encapsulation primarily achieved in Java?",
            options: [
                "By declaring class variables as public and methods as private",
                "By declaring class fields as private and providing public getter/setter methods",
                "By inheriting from multiple interfaces",
                "By declaring all methods static"
            ],
            correct_index: 1,
            explanation: "Encapsulation bundles data with code. Marking fields private and accessing them through public getters and setters ensures controlled validation and data hiding.",
            hint: "Think about getters and setters."
        },
        {
            topic: "Inheritance & Method Overriding",
            difficulty: "medium",
            question: "Which keyword is used by a child class to explicitly invoke the superclass constructor in Java?",
            options: ["this()", "parent()", "super()", "base()"],
            correct_index: 2,
            explanation: "The 'super()' call invokes the immediate parent class constructor and must be the very first statement inside the subclass constructor.",
            hint: "Refers to the 'super' class."
        },
        {
            topic: "Inheritance & Method Overriding",
            difficulty: "hard",
            question: "Can a static method in Java be overridden by a subclass?",
            options: [
                "Yes, polymorphism applies to both static and instance methods",
                "No, static methods are hidden (method hiding), not overridden dynamically",
                "Yes, provided the @Override annotation is added",
                "Only if the subclass method is declared abstract"
            ],
            correct_index: 1,
            explanation: "Static methods are bound at compile time based on the reference type (method hiding), so dynamic runtime dispatch (overriding) does not apply to static methods in Java.",
            hint: "Static methods belong to the class, not individual object instances."
        },
        {
            topic: "Polymorphism & Dynamic Binding",
            difficulty: "medium",
            question: "Which feature of Java determines method execution at runtime rather than compile time?",
            options: ["Static Binding", "Dynamic Method Dispatch", "Method Overloading", "Type Casting"],
            correct_index: 1,
            explanation: "Dynamic Method Dispatch is the mechanism by which a call to an overridden method is resolved at runtime based on the actual object's type on the heap.",
            hint: "Dynamic resolution happens at runtime."
        },
        {
            topic: "Abstract Classes vs Interfaces",
            difficulty: "medium",
            question: "Which statement is TRUE regarding Java interfaces starting from Java 8?",
            options: [
                "Interfaces can never contain method bodies",
                "Interfaces can contain default and static methods with implementation",
                "A class can only implement a single interface",
                "Interface variables are protected by default"
            ],
            correct_index: 1,
            explanation: "Since Java 8, interfaces can provide default methods (with 'default' keyword) and static utility methods with concrete implementations without breaking backward compatibility.",
            hint: "Look for default method implementations."
        },
        {
            topic: "Exception Handling (try-catch-finally)",
            difficulty: "medium",
            question: "Under which condition will the 'finally' block NOT execute in Java?",
            options: [
                "When an unhandled RuntimeException is thrown",
                "When a return statement is encountered in the try block",
                "When System.exit(0) is executed in the try or catch block",
                "When no catch block matches the exception"
            ],
            correct_index: 2,
            explanation: "'finally' always executes even after return statements or unhandled exceptions, EXCEPT when the JVM is terminated abruptly via System.exit() or a fatal JVM crash.",
            hint: "Think about terminating the entire JVM process."
        },
        {
            topic: "Collections Framework (ArrayList, HashMap)",
            difficulty: "medium",
            question: "What is the average time complexity for get() and put() operations in a well-distributed Java HashMap?",
            options: ["O(n)", "O(log n)", "O(1)", "O(n log n)"],
            correct_index: 2,
            explanation: "HashMap uses hash codes to index directly into array buckets, giving O(1) constant average time for retrieval and insertion when hash collisions are low.",
            hint: "Constant time lookup."
        }
    ],

    python: [
        {
            topic: "Python Data Types & Lists/Tuples",
            difficulty: "easy",
            question: "What is the primary difference between a Python list and a Python tuple?",
            options: [
                "Lists can store only integers; tuples store any type",
                "Lists are mutable (can be changed); tuples are immutable (read-only)",
                "Tuples use square brackets; lists use parentheses",
                "Tuples are slower than lists in all scenarios"
            ],
            correct_index: 1,
            explanation: "Lists are mutable, meaning elements can be added, updated, or deleted in place. Tuples are immutable once created, ensuring data integrity and hashability.",
            hint: "One can be modified in place, the other cannot."
        },
        {
            topic: "Dictionaries & Set Operations",
            difficulty: "medium",
            question: "What does the expression `set([1, 2, 2, 3, 3, 3])` evaluate to in Python?",
            options: ["[1, 2, 3]", "{1, 2, 3}", "(1, 2, 3)", "{1: 2, 2: 3}"],
            correct_index: 1,
            explanation: "Sets in Python are unordered collections of unique elements enclosed in curly braces {}. Passing a list with duplicates strips all duplicate entries.",
            hint: "Sets only store unique values inside curly braces."
        },
        {
            topic: "List Comprehensions & Generator Expressions",
            difficulty: "medium",
            question: "What is the output of `[x**2 for x in range(5) if x % 2 != 0]` in Python?",
            options: ["[0, 4, 16]", "[1, 9]", "[1, 4, 9]", "[1, 9, 25]"],
            correct_index: 1,
            explanation: "range(5) produces 0, 1, 2, 3, 4. The condition `x % 2 != 0` filters only odd numbers (1, 3). Squaring them yields 1**2 = 1 and 3**2 = 9, so [1, 9].",
            hint: "Only odd numbers from 0 to 4 are squared."
        },
        {
            topic: "Functions, *args, **kwargs & Lambdas",
            difficulty: "medium",
            question: "In a Python function definition, what does `**kwargs` capture?",
            options: [
                "Arbitrary positional arguments as a tuple",
                "Arbitrary keyword arguments as a dictionary",
                "Only default argument values",
                "Global environment variables"
            ],
            correct_index: 1,
            explanation: "`*args` collects extra positional arguments into a tuple, while `**kwargs` collects extra named keyword arguments into a dictionary.",
            hint: "kw stands for keyword arguments."
        },
        {
            topic: "Classes, self & __init__ Constructors",
            difficulty: "easy",
            question: "What is the purpose of the `self` parameter in Python instance methods?",
            options: [
                "It refers to the parent class of the current class",
                "It represents the current instance of the class",
                "It is a mandatory keyword reserved by the Python compiler",
                "It creates a new thread for method execution"
            ],
            correct_index: 1,
            explanation: "`self` is an explicit reference to the current object instance calling the method, allowing access to that instance's attributes and methods.",
            hint: "Refers to 'this' particular object instance."
        },
        {
            topic: "File Handling & Context Managers (with)",
            difficulty: "easy",
            question: "Why is the `with open(...)` construct recommended for reading/writing files in Python?",
            options: [
                "It automatically encrypts file contents",
                "It automatically closes the file even if exceptions occur",
                "It makes file I/O run in parallel on all CPU cores",
                "It creates backup copies of the file on disk"
            ],
            correct_index: 1,
            explanation: "The `with` statement utilizes the Context Manager protocol (`__enter__` and `__exit__`), guaranteeing that the file stream is closed properly even if an error is raised.",
            hint: "Guarantees resource cleanup."
        }
    ],

    webdev: [
        {
            topic: "Semantic HTML Elements & Forms",
            difficulty: "easy",
            question: "Which of the following is a semantic HTML5 element?",
            options: ["<div>", "<span>", "<article>", "<font>"],
            correct_index: 2,
            explanation: "<article> conveys meaningful semantic structure to browsers, search engines, and screen readers, whereas <div> and <span> are generic non-semantic wrappers.",
            hint: "Describes independent, self-contained content."
        },
        {
            topic: "CSS Box Model, Flexbox & Grid",
            difficulty: "medium",
            question: "What is the correct order of the CSS Box Model from inside to outside?",
            options: [
                "Content → Border → Padding → Margin",
                "Content → Padding → Border → Margin",
                "Padding → Content → Margin → Border",
                "Margin → Border → Padding → Content"
            ],
            correct_index: 1,
            explanation: "The Box Model consists of the innermost Content, surrounded by Padding (internal space), surrounded by Border, surrounded by Margin (external spacing).",
            hint: "Padding touches content; margin pushes other elements away."
        },
        {
            topic: "CSS Box Model, Flexbox & Grid",
            difficulty: "easy",
            question: "Which CSS Flexbox property aligns flex items along the cross axis?",
            options: ["justify-content", "align-items", "flex-direction", "flex-wrap"],
            correct_index: 1,
            explanation: "'justify-content' controls alignment along the main axis, while 'align-items' controls alignment along the cross axis.",
            hint: "Cross axis alignment uses 'align-'."
        },
        {
            topic: "JavaScript ES6+ Syntax & Closures",
            difficulty: "medium",
            question: "What is a closure in JavaScript?",
            options: [
                "A function that terminates the execution loop",
                "A function bundled with references to its surrounding lexical state",
                "A method to close browser tabs using JavaScript",
                "An encrypted JSON object"
            ],
            correct_index: 1,
            explanation: "A closure gives an inner function access to its outer scope variables even after the outer function has completed execution.",
            hint: "The inner function remembers variables from its outer scope."
        },
        {
            topic: "Fetch API & REST JSON Integration",
            difficulty: "medium",
            question: "What does the `fetch()` method in modern JavaScript return?",
            options: [
                "The raw parsed JSON data directly",
                "A Promise that resolves to a Response object",
                "A synchronous XMLHttpRequest instance",
                "A callback function"
            ],
            correct_index: 1,
            explanation: "`fetch()` is asynchronous and returns a Promise that resolves with a Response object. You typically call `.json()` on that response to extract JSON.",
            hint: "It returns a Promise."
        }
    ],

    dbms: [
        {
            topic: "Primary Key, Foreign Key & Integrity Constraints",
            difficulty: "easy",
            question: "What are the two fundamental requirements of a PRIMARY KEY in relational databases?",
            options: [
                "Can contain duplicate values and must not be NULL",
                "Must be unique and cannot contain NULL values",
                "Must be an encrypted string and can contain NULL",
                "Must match the name of the database table"
            ],
            correct_index: 1,
            explanation: "A Primary Key uniquely identifies each row in a database table. Therefore, it must be UNIQUE and NOT NULL.",
            hint: "Unique and never empty."
        },
        {
            topic: "SQL Queries: SELECT, GROUP BY & HAVING",
            difficulty: "medium",
            question: "What is the difference between the WHERE and HAVING clauses in SQL?",
            options: [
                "WHERE filters rows before grouping; HAVING filters aggregated groups after GROUP BY",
                "HAVING filters individual rows; WHERE filters aggregate groups",
                "WHERE and HAVING are completely interchangeable",
                "HAVING can only be used with primary keys"
            ],
            correct_index: 0,
            explanation: "WHERE filters individual rows prior to any aggregation. HAVING filters groups produced by GROUP BY and can evaluate aggregate functions like COUNT(), SUM(), AVG().",
            hint: "HAVING is used with aggregate functions."
        },
        {
            topic: "SQL Joins (INNER, LEFT, RIGHT, FULL OUTER)",
            difficulty: "medium",
            question: "Which SQL JOIN returns all rows from the left table, and matching rows from the right table?",
            options: ["INNER JOIN", "LEFT OUTER JOIN", "CROSS JOIN", "RIGHT OUTER JOIN"],
            correct_index: 1,
            explanation: "A LEFT OUTER JOIN returns every record from the left table, populated with matching right table columns, or NULL where no match exists.",
            hint: "Preserves everything from the LEFT table."
        },
        {
            topic: "Normalization (1NF, 2NF, 3NF, BCNF)",
            difficulty: "hard",
            question: "A table is in Second Normal Form (2NF) if and only if it is in 1NF and:",
            options: [
                "Has no transitive functional dependencies",
                "Has no partial functional dependency of non-prime attributes on a candidate key",
                "Every determinant is a super key",
                "All column values are unique"
            ],
            correct_index: 1,
            explanation: "2NF eliminates partial dependencies: every non-key attribute must depend on the whole primary key, not just a subset of a composite key.",
            hint: "No non-prime attribute should depend on only a part of a composite key."
        },
        {
            topic: "ACID Properties & Transaction States",
            difficulty: "easy",
            question: "What does the 'A' in ACID properties of database transactions stand for?",
            options: ["Accuracy", "Atomicity", "Availability", "Authentication"],
            correct_index: 1,
            explanation: "Atomicity ('All or Nothing') ensures that either all operations of a transaction succeed and are committed, or none of them take effect and the database rolls back.",
            hint: "All or nothing."
        }
    ]
};


/* -----------------------------------------------------
   PROCEDURAL QUESTION GENERATOR (Fallback for ANY Topic)
----------------------------------------------------- */
function generateProceduralQuestions(subjectName, topicName, difficulty, count, quizType) {
    const questions = [];
    const normalizedTopic = topicName || "Key Concepts";
    const cleanSubj = subjectName || "Subject";

    const questionTemplates = [
        {
            stem: `Which of the following statements best defines "${normalizedTopic}" in the context of ${cleanSubj}?`,
            getOptions: () => [
                `It represents the fundamental architecture and operational rule governing ${normalizedTopic}.`,
                `It is a deprecated legacy syntax that is no longer supported in modern ${cleanSubj}.`,
                `It is an optional visual styling feature used only for debugging user interfaces.`,
                `It is an external operating system utility unrelated to ${cleanSubj} execution.`
            ],
            correct: 0,
            exp: `In ${cleanSubj}, ${normalizedTopic} provides core principles and structured rules essential for building robust and maintainable solutions.`,
            hint: `Focus on the primary conceptual purpose of ${normalizedTopic}.`
        },
        {
            stem: `What is a primary advantage or best practice when working with "${normalizedTopic}"?`,
            getOptions: () => [
                `Avoiding all documentation and type checks to speed up runtime execution.`,
                `Improves code modularity, prevents common errors, and promotes maintainability.`,
                `Guarantees zero memory consumption regardless of input size.`,
                `Restricts code execution to single-threaded environments only.`
            ],
            correct: 1,
            exp: `Applying proper principles of ${normalizedTopic} enhances readability, modular design, and eases troubleshooting across ${cleanSubj} projects.`,
            hint: `Think about software quality and maintenance benefits.`
        },
        {
            stem: `When troubleshooting or designing solutions for "${normalizedTopic}", which factor is most crucial?`,
            getOptions: () => [
                `Randomly testing changes without validating requirements or edge cases.`,
                `Ignoring boundary conditions and potential runtime exceptions.`,
                `Ensuring proper validation, handling edge cases, and adhering to conventions in ${cleanSubj}.`,
                `Hardcoding configuration constants directly inside loop iterations.`
            ],
            correct: 2,
            exp: `Effective implementation of ${normalizedTopic} demands strict attention to edge cases, input validation, and established ${cleanSubj} design patterns.`,
            hint: `Reliability requires handling edge cases and conventions.`
        },
        {
            stem: `In ${cleanSubj}, what common mistake should students avoid regarding "${normalizedTopic}"?`,
            getOptions: () => [
                `Writing modular functions with clear naming conventions.`,
                `Failing to clean up resources, unhandled edge cases, or violating encapsulation.`,
                `Testing code with multiple distinct input test suites.`,
                `Consulting official documentation when encountering unfamiliar errors.`
            ],
            correct: 1,
            exp: `Neglecting resource management, missing edge conditions, or ignoring structure frequently causes bugs when dealing with ${normalizedTopic}.`,
            hint: `Identify the anti-pattern or bug source.`
        },
        {
            stem: `How does mastering "${normalizedTopic}" benefit a student preparing for examinations or technical interviews?`,
            getOptions: () => [
                `It enables rote memorization without needing to understand underlying principles.`,
                `It tests foundational understanding, problem-solving skills, and real-world system design.`,
                `It guarantees that compilers will auto-correct any syntax error in your programs.`,
                `It eliminates the need to learn any other topics in ${cleanSubj}.`
            ],
            correct: 1,
            exp: `Examiners and interviewers look for deep conceptual clarity regarding ${normalizedTopic} to evaluate a student's core competencies in ${cleanSubj}.`,
            hint: `Look for real-world problem solving and core understanding.`
        },
        {
            stem: `Which of the following is typically TRUE when applying "${normalizedTopic}" in practice?`,
            getOptions: () => [
                `Proper modular separation of concerns leads to scalable, reusable components.`,
                `It can only be executed in offline command-line environments.`,
                `All variables associated with ${normalizedTopic} must always be declared global.`,
                `It replaces all database and network protocols simultaneously.`
            ],
            correct: 0,
            exp: `Separation of concerns and modularity are cornerstone principles when implementing ${normalizedTopic} in ${cleanSubj}.`,
            hint: `Modularity and separation of concerns.`
        },
        {
            stem: `What is the expected outcome when correctly implementing "${normalizedTopic}" in a ${cleanSubj} program?`,
            getOptions: () => [
                `Predictable behavior, clean data flow, and minimal side effects.`,
                `System instability and unpredictable execution orders.`,
                `Incompatibility with all standard standard libraries.`,
                `Forced termination of background daemon threads.`
            ],
            correct: 0,
            exp: `Well-designed code following ${normalizedTopic} principles produces predictable results and clean maintainable logic.`,
            hint: `Predictability and clean flow.`
        },
        {
            stem: `What is the relationship between "${normalizedTopic}" and the overall syllabus of ${cleanSubj}?`,
            getOptions: () => [
                `It is completely isolated and shares no concepts with other units.`,
                `It connects foundational theory to practical application across multiple units.`,
                `It was created solely as an optional trick question for examinations.`,
                `It only applies to programming languages released before 1990.`
            ],
            correct: 1,
            exp: `In ${cleanSubj}, ${normalizedTopic} serves as a critical bridge between theoretical concepts and practical software development.`,
            hint: `Foundational theory meets practical application.`
        }
    ];

    for (let i = 0; i < count; i++) {
        const tmpl = questionTemplates[i % questionTemplates.length];
        const options = tmpl.getOptions();
        questions.push({
            id: i + 1,
            question: tmpl.stem,
            options: options,
            correct_index: tmpl.correct,
            explanation: tmpl.exp,
            hint: tmpl.hint
        });
    }

    return questions;
}


/* -----------------------------------------------------
   QUIZ HISTORY STORAGE
----------------------------------------------------- */
function getQuizHistory(subjectId = null) {
    try {
        const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
        const list = raw ? JSON.parse(raw) : [];
        if (!Array.isArray(list)) return [];
        if (subjectId) {
            return list.filter(item => item.subjectId === subjectId);
        }
        return list;
    } catch (e) {
        return [];
    }
}

function saveQuizResult(result) {
    try {
        const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
        const list = raw ? JSON.parse(raw) : [];
        list.unshift(result);
        // Keep last 50 quizzes
        if (list.length > 50) list.length = 50;
        localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(list));
    } catch (e) {
        console.error("Quiz history save error:", e);
    }
}

function clearSubjectQuizHistory() {
    if (!currentSubjectId) return;
    const confirmed = confirm("Are you sure you want to clear quiz history for this subject?");
    if (!confirmed) return;

    try {
        const raw = localStorage.getItem(QUIZ_HISTORY_KEY);
        const list = raw ? JSON.parse(raw) : [];
        const filtered = list.filter(item => item.subjectId !== currentSubjectId);
        localStorage.setItem(QUIZ_HISTORY_KEY, JSON.stringify(filtered));
        setupSubjectQuizTab();
        renderQuizHistory(currentSubjectId);
        showToast("Quiz history cleared.");
    } catch (e) {}
}


/* -----------------------------------------------------
   QUIZ TAB INITIALIZATION & SETUP
----------------------------------------------------- */
function setupSubjectQuizTab() {
    if (!currentSubjectId) return;
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject) return;

    // 1. Populate Topic Dropdown
    const topicSelect = document.getElementById("quiz-topic-select");
    const topicChips = document.getElementById("quiz-topic-chips");

    if (topicSelect) {
        let optsHtml = `
            <option value="__all__">Entire Subject (Comprehensive Mix of Topics)</option>
        `;

        if (Array.isArray(subject.topics) && subject.topics.length > 0) {
            subject.topics.forEach(t => {
                optsHtml += `<option value="${escapeSubjectHTML(t.name)}">${escapeSubjectHTML(t.name)}</option>`;
            });
        }

        if (Array.isArray(subject.syllabus) && subject.syllabus.length > 0) {
            subject.syllabus.forEach(u => {
                optsHtml += `<option value="${escapeSubjectHTML(u)}">${escapeSubjectHTML(u)}</option>`;
            });
        }

        optsHtml += `<option value="__custom__">Custom Topic / Keyword...</option>`;
        topicSelect.innerHTML = optsHtml;
        topicSelect.value = "__all__";
    }

    // 2. Populate Quick Topic Chips
    if (topicChips) {
        const topics = (subject.topics || []).slice(0, 8);
        if (topics.length > 0) {
            topicChips.innerHTML = topics.map(t => `
                <button type="button" class="qg-chip" onclick="selectQuizTopicChip('${escapeSubjectHTML(t.name)}', this)">
                    ${escapeSubjectHTML(t.name)}
                </button>
            `).join("");
        } else {
            topicChips.innerHTML = `
                <button type="button" class="qg-chip active" onclick="selectQuizTopicChip('__all__', this)">
                    All Concepts
                </button>
            `;
        }
    }

    // Hide custom input initially
    const customWrap = document.getElementById("quiz-custom-topic-wrap");
    if (customWrap) customWrap.style.display = "none";

    // 3. Update Quiz Stats & Badge
    const history = getQuizHistory(currentSubjectId);
    const statTotal = document.getElementById("quiz-stat-total");
    const statBest = document.getElementById("quiz-stat-best");
    const historyCount = document.getElementById("quiz-history-count");
    const tabCount = document.getElementById("detail-tab-quiz-count");

    if (statTotal) statTotal.textContent = history.length;
    if (historyCount) historyCount.textContent = history.length;
    if (tabCount) tabCount.textContent = history.length;

    if (statBest) {
        if (history.length > 0) {
            const best = Math.max(...history.map(h => h.pct || 0));
            statBest.textContent = `${best}%`;
        } else {
            statBest.textContent = "--";
        }
    }

    // Reset View if no active quiz running
    if (!currentQuizState) {
        switchQuizView("generate");
    }
}

function handleQuizTopicChange() {
    const select = document.getElementById("quiz-topic-select");
    const customWrap = document.getElementById("quiz-custom-topic-wrap");
    const customInput = document.getElementById("quiz-custom-topic-input");

    if (!select || !customWrap) return;

    if (select.value === "__custom__") {
        customWrap.style.display = "block";
        if (customInput) customInput.focus();
    } else {
        customWrap.style.display = "none";
    }

    // Update chips active state
    document.querySelectorAll(".qg-chip").forEach(chip => {
        chip.classList.toggle("active", chip.textContent.trim() === select.value);
    });
}

function selectQuizTopicChip(topicName, btn) {
    const select = document.getElementById("quiz-topic-select");
    if (select) {
        if (select.querySelector(`option[value="${topicName}"]`)) {
            select.value = topicName;
        } else {
            select.value = "__custom__";
            const customInput = document.getElementById("quiz-custom-topic-input");
            if (customInput) customInput.value = topicName;
        }
        handleQuizTopicChange();
    }

    document.querySelectorAll(".qg-chip").forEach(c => c.classList.remove("active"));
    if (btn) btn.classList.add("active");
}

function updateQuizDiffUI() {
    const checked = document.querySelector('input[name="quiz-diff"]:checked');
    const val = checked ? checked.value : "medium";
    ["easy", "medium", "hard"].forEach(d => {
        const el = document.getElementById(`diff-opt-${d}`);
        if (el) el.classList.toggle("active", d === val);
    });
}

function updateQuizFormatUI() {
    const checked = document.querySelector('input[name="quiz-type"]:checked');
    const val = checked ? checked.value : "mcq";
    const optMcq = document.getElementById("format-opt-mcq");
    const optFlash = document.getElementById("format-opt-flashcard");
    if (optMcq) optMcq.classList.toggle("active", val === "mcq");
    if (optFlash) optFlash.classList.toggle("active", val === "flashcard");
}

function setQuizCount(count, btn) {
    currentQuizCount = count;
    document.querySelectorAll(".qg-count-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
}

function switchQuizView(view) {
    const views = {
        generate: document.getElementById("quiz-generator-view"),
        player: document.getElementById("quiz-player-view"),
        results: document.getElementById("quiz-results-view"),
        history: document.getElementById("quiz-history-view")
    };

    Object.entries(views).forEach(([k, el]) => {
        if (el) el.style.display = (k === view) ? "block" : "none";
    });

    const btnGen = document.getElementById("btn-quiz-view-generate");
    const btnHist = document.getElementById("btn-quiz-view-history");
    if (btnGen) btnGen.classList.toggle("active", view === "generate" || view === "player");
    if (btnHist) btnHist.classList.toggle("active", view === "history");

    if (view === "history") {
        renderQuizHistory(currentSubjectId);
    }
}


/* -----------------------------------------------------
   QUIZ GENERATION (AI + LOCAL FALLBACK)
----------------------------------------------------- */
async function startQuizGeneration() {
    if (!currentSubjectId) return;
    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === currentSubjectId);
    if (!subject) return;

    const topicSelect = document.getElementById("quiz-topic-select");
    let chosenTopic = topicSelect ? topicSelect.value : "__all__";
    if (chosenTopic === "__custom__") {
        const customInput = document.getElementById("quiz-custom-topic-input");
        chosenTopic = (customInput && customInput.value.trim()) ? customInput.value.trim() : "Core Concepts";
    } else if (chosenTopic === "__all__") {
        chosenTopic = `Comprehensive ${subject.name}`;
    }

    const diffInput = document.querySelector('input[name="quiz-diff"]:checked');
    const difficulty = diffInput ? diffInput.value : "medium";

    const typeInput = document.querySelector('input[name="quiz-type"]:checked');
    const quizType = typeInput ? typeInput.value : "mcq";

    const btn = document.getElementById("btn-generate-quiz");
    const btnText = document.getElementById("generate-quiz-btn-text");
    const spinner = document.getElementById("generate-quiz-spinner");
    const tip = document.getElementById("quiz-generation-tip");

    if (btn) btn.disabled = true;
    if (spinner) spinner.style.display = "inline-block";
    if (btnText) btnText.textContent = "AI Tutor is crafting your questions...";
    if (tip) tip.innerHTML = '<i class="fa-solid fa-brain"></i> Alpha is selecting optimal questions and detailed solutions for your level...';

    let finalQuestions = null;

    // 1. Attempt AI Generation via Backend
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6000); // 6s fast threshold

        const res = await fetch(`${API_URL}/quiz/generate`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subject: subject.name,
                topic: chosenTopic,
                difficulty: difficulty,
                num_questions: currentQuizCount,
                quiz_type: quizType
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
            const json = await res.json();
            if (json && json.success && Array.isArray(json.questions) && json.questions.length > 0) {
                finalQuestions = json.questions;
            }
        }
    } catch (e) {
        // Backend offline or timeout -> fall through to intelligent local generator
    }

    // 2. If Backend AI was offline or returned no questions, use curated/procedural engine
    if (!finalQuestions || finalQuestions.length === 0) {
        finalQuestions = generateLocalSubjectQuiz(subject.name, chosenTopic, difficulty, currentQuizCount, quizType);
    }

    // Reset button UI
    if (btn) btn.disabled = false;
    if (spinner) spinner.style.display = "none";
    if (btnText) btnText.textContent = "Generate & Start Quiz";
    if (tip) tip.innerHTML = '<i class="fa-solid fa-lightbulb"></i> Alpha uses your syllabus topics to create high-yield practice questions.';

    // Start Quiz!
    startQuiz({
        subjectId: subject.id,
        subjectName: subject.name,
        topic: chosenTopic,
        difficulty: difficulty,
        quizType: quizType,
        questions: finalQuestions
    });
}

function generateLocalSubjectQuiz(subjectName, topicName, difficulty, count, quizType) {
    const sLower = (subjectName || "").toLowerCase();
    let bankKey = null;

    if (sLower.includes("java") && !sLower.includes("script")) bankKey = "java";
    else if (sLower.includes("python")) bankKey = "python";
    else if (sLower.includes("web") || sLower.includes("html") || sLower.includes("css") || sLower.includes("script")) bankKey = "webdev";
    else if (sLower.includes("dbms") || sLower.includes("sql") || sLower.includes("data") && sLower.includes("base")) bankKey = "dbms";

    let selectedQuestions = [];

    if (bankKey && CURATED_QUIZ_BANK[bankKey]) {
        let pool = CURATED_QUIZ_BANK[bankKey];

        // Filter by topic if not "All"
        if (topicName && !topicName.includes("Comprehensive")) {
            const tLower = topicName.toLowerCase();
            const matched = pool.filter(q => q.topic.toLowerCase().includes(tLower) || tLower.includes(q.topic.toLowerCase()));
            if (matched.length > 0) {
                pool = matched;
            }
        }

        // Shuffle pool
        const shuffled = [...pool].sort(() => 0.5 - Math.random());
        selectedQuestions = shuffled.slice(0, count);
    }

    // If pool didn't have enough questions, fill the rest procedurally
    if (selectedQuestions.length < count) {
        const needed = count - selectedQuestions.length;
        const procedural = generateProceduralQuestions(subjectName, topicName, difficulty, needed, quizType);
        selectedQuestions = selectedQuestions.concat(procedural);
    }

    // Ensure IDs are 1..count
    return selectedQuestions.map((q, idx) => ({
        ...q,
        id: idx + 1
    }));
}


/* -----------------------------------------------------
   ACTIVE QUIZ PLAYER LOGIC
----------------------------------------------------- */
function startQuiz(quizData) {
    currentQuizState = {
        ...quizData,
        currentIndex: 0,
        userAnswers: {},
        startTime: Date.now(),
        elapsedSeconds: 0,
        timerInterval: null
    };

    // Start Timer
    if (currentQuizState.timerInterval) clearInterval(currentQuizState.timerInterval);
    const timerDisplay = document.getElementById("qp-timer-display");
    currentQuizState.timerInterval = setInterval(() => {
        if (!currentQuizState) return;
        currentQuizState.elapsedSeconds++;
        const mins = String(Math.floor(currentQuizState.elapsedSeconds / 60)).padStart(2, "0");
        const secs = String(currentQuizState.elapsedSeconds % 60).padStart(2, "0");
        if (timerDisplay) timerDisplay.innerHTML = `<i class="fa-solid fa-stopwatch"></i> ${mins}:${secs}`;
    }, 1000);

    // Switch to Player View
    switchQuizView("player");

    // Render First Question
    renderQuizQuestion(0);
}

function renderQuizQuestion(index) {
    if (!currentQuizState || !currentQuizState.questions[index]) return;
    currentQuizState.currentIndex = index;

    const q = currentQuizState.questions[index];
    const total = currentQuizState.questions.length;

    // Update Header Pill Displays
    const topicDisplay = document.getElementById("qp-topic-display");
    const diffDisplay = document.getElementById("qp-diff-display");
    const curIdxEl = document.getElementById("qp-current-idx");
    const totalIdxEl = document.getElementById("qp-total-idx");
    const progressFill = document.getElementById("qp-progress-fill");

    if (topicDisplay) topicDisplay.textContent = currentQuizState.topic;
    if (diffDisplay) diffDisplay.textContent = currentQuizState.difficulty.toUpperCase();
    if (curIdxEl) curIdxEl.textContent = index + 1;
    if (totalIdxEl) totalIdxEl.textContent = total;
    if (progressFill) progressFill.style.width = `${Math.round(((index + 1) / total) * 100)}%`;

    // Question Text
    const qText = document.getElementById("qp-question-text");
    if (qText) qText.textContent = q.question;

    // Hint Setup
    const hintWrap = document.getElementById("qp-hint-wrapper");
    const hintText = document.getElementById("qp-hint-text");
    const hintContent = document.getElementById("qp-hint-content");
    if (hintContent) hintContent.style.display = "none";
    if (q.hint) {
        if (hintWrap) hintWrap.style.display = "block";
        if (hintText) hintText.textContent = q.hint;
    } else {
        if (hintWrap) hintWrap.style.display = "none";
    }

    // MCQ vs Flashcard View
    const optList = document.getElementById("qp-options-list");
    const flashBox = document.getElementById("qp-flashcard-box");
    const flashAnswer = document.getElementById("qp-flashcard-answer");
    const flashAnswerText = document.getElementById("qp-flashcard-answer-text");
    const revealBtn = document.getElementById("qp-reveal-btn");

    const letters = ["A", "B", "C", "D", "E"];

    if (currentQuizState.quizType === "flashcard") {
        if (optList) optList.style.display = "none";
        if (flashBox) flashBox.style.display = "block";
        if (flashAnswer) flashAnswer.style.display = "none";
        if (revealBtn) revealBtn.innerHTML = '<i class="fa-solid fa-eye"></i> Reveal Explanation & Answer';
        if (flashAnswerText) {
            flashAnswerText.innerHTML = `
                <div style="font-weight: 700; color: var(--primary); margin-bottom: 6px;">
                    Correct Answer: ${escapeSubjectHTML(q.options[q.correct_index] || "")}
                </div>
                <div>${escapeSubjectHTML(q.explanation || "No explanation provided.")}</div>
            `;
        }
        // Auto-mark flashcard as reviewed
        currentQuizState.userAnswers[index] = q.correct_index;
    } else {
        if (flashBox) flashBox.style.display = "none";
        if (optList) {
            optList.style.display = "flex";
            const selectedIdx = currentQuizState.userAnswers[index];
            optList.innerHTML = q.options.map((opt, oIdx) => {
                const isSelected = selectedIdx === oIdx;
                return `
                    <div class="qp-option-card ${isSelected ? "selected" : ""}" onclick="selectQuizOption(${oIdx})">
                        <div class="qp-option-radio">
                            <span class="qp-option-letter">${letters[oIdx] || oIdx + 1}</span>
                        </div>
                        <div class="qp-option-text">${escapeSubjectHTML(opt)}</div>
                    </div>
                `;
            }).join("");
        }
    }

    // Update Navigation Buttons
    const btnPrev = document.getElementById("qp-btn-prev");
    const btnNext = document.getElementById("qp-btn-next");
    const btnSubmit = document.getElementById("qp-btn-submit");
    const statusText = document.getElementById("qp-answered-status");

    if (btnPrev) btnPrev.disabled = (index === 0);

    const isLast = (index === total - 1);
    if (btnNext) btnNext.style.display = isLast ? "none" : "inline-flex";
    if (btnSubmit) btnSubmit.style.display = isLast ? "inline-flex" : "none";

    // Answer status
    const answeredCount = Object.keys(currentQuizState.userAnswers).length;
    if (statusText) {
        statusText.textContent = `${answeredCount} of ${total} answered`;
    }
}

function selectQuizOption(optionIndex) {
    if (!currentQuizState) return;
    const qIdx = currentQuizState.currentIndex;
    currentQuizState.userAnswers[qIdx] = optionIndex;

    // Update UI option cards
    document.querySelectorAll(".qp-option-card").forEach((card, idx) => {
        card.classList.toggle("selected", idx === optionIndex);
    });

    const answeredCount = Object.keys(currentQuizState.userAnswers).length;
    const statusText = document.getElementById("qp-answered-status");
    if (statusText) {
        statusText.textContent = `${answeredCount} of ${currentQuizState.questions.length} answered`;
    }
}

function toggleQuizHint() {
    const hintContent = document.getElementById("qp-hint-content");
    if (!hintContent) return;
    hintContent.style.display = (hintContent.style.display === "none") ? "block" : "none";
}

function toggleFlashcardAnswer() {
    const flashAnswer = document.getElementById("qp-flashcard-answer");
    const revealBtn = document.getElementById("qp-reveal-btn");
    if (!flashAnswer) return;
    const isHidden = flashAnswer.style.display === "none";
    flashAnswer.style.display = isHidden ? "block" : "none";
    if (revealBtn) {
        revealBtn.innerHTML = isHidden ? '<i class="fa-solid fa-eye-slash"></i> Hide Explanation' : '<i class="fa-solid fa-eye"></i> Reveal Explanation & Answer';
    }
}

function goToPrevQuestion() {
    if (!currentQuizState || currentQuizState.currentIndex <= 0) return;
    renderQuizQuestion(currentQuizState.currentIndex - 1);
}

function goToNextQuestion() {
    if (!currentQuizState || currentQuizState.currentIndex >= currentQuizState.questions.length - 1) return;
    renderQuizQuestion(currentQuizState.currentIndex + 1);
}

function confirmExitQuiz() {
    const confirmed = confirm("Are you sure you want to leave this quiz? Your progress in this session will not be saved.");
    if (!confirmed) return;

    if (currentQuizState && currentQuizState.timerInterval) {
        clearInterval(currentQuizState.timerInterval);
    }
    currentQuizState = null;
    switchQuizView("generate");
}


/* -----------------------------------------------------
   SUBMIT QUIZ & RESULTS DISPLAY
----------------------------------------------------- */
function submitCurrentQuiz() {
    if (!currentQuizState) return;

    // Stop Timer
    if (currentQuizState.timerInterval) {
        clearInterval(currentQuizState.timerInterval);
    }

    const total = currentQuizState.questions.length;
    let correct = 0;

    currentQuizState.questions.forEach((q, idx) => {
        const userChoice = currentQuizState.userAnswers[idx];
        if (userChoice !== undefined && userChoice === q.correct_index) {
            correct++;
        }
    });

    const wrong = total - correct;
    const pct = Math.round((correct / total) * 100);

    const mins = Math.floor(currentQuizState.elapsedSeconds / 60);
    const secs = currentQuizState.elapsedSeconds % 60;
    const timeFormatted = `${mins > 0 ? mins + "m " : ""}${secs}s`;

    // Save Result Record
    const resultRecord = {
        id: "quiz_" + Date.now(),
        date: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        subjectId: currentQuizState.subjectId,
        subjectName: currentQuizState.subjectName,
        topic: currentQuizState.topic,
        difficulty: currentQuizState.difficulty,
        total: total,
        correct: correct,
        wrong: wrong,
        pct: pct,
        timeFormatted: timeFormatted,
        questions: currentQuizState.questions,
        userAnswers: { ...currentQuizState.userAnswers }
    };

    saveQuizResult(resultRecord);

    // Sync with Alpha Dashboard Activity
    try {
        const mData = getMasterData();
        if (Array.isArray(mData.activities)) {
            mData.activities.push({
                icon: "fa-solid fa-bullseye",
                text: `Scored ${pct}% on ${currentQuizState.subjectName} (${currentQuizState.topic})`,
                time: "Just now"
            });
            saveMasterData(mData);
            updateDashboardAfterSubjectChange();
        }
    } catch (e) {}

    // Update Result View UI
    const scorePct = document.getElementById("qr-score-pct");
    const scoreFraction = document.getElementById("qr-score-fraction");
    const headline = document.getElementById("qr-headline");
    const summaryText = document.getElementById("qr-summary-text");
    const trophy = document.getElementById("qr-trophy-icon");

    const statCorrect = document.getElementById("qr-stat-correct");
    const statWrong = document.getElementById("qr-stat-wrong");
    const statTime = document.getElementById("qr-stat-time");

    if (scorePct) scorePct.textContent = `${pct}%`;
    if (scoreFraction) scoreFraction.textContent = `${correct} of ${total} Correct`;
    if (statCorrect) statCorrect.textContent = correct;
    if (statWrong) statWrong.textContent = wrong;
    if (statTime) statTime.textContent = timeFormatted;

    // Update Result Score Display
    const scoreVal = document.getElementById("qr-score-val");
    const scoreTotal = document.getElementById("qr-score-total");
    const pctVal = document.getElementById("qr-pct-val");
    const progressFill = document.getElementById("qr-progress-fill");

    const correctCount = correct;
    const totalQuestions = total;

    if (scoreVal) scoreVal.textContent = correctCount;
    if (scoreTotal) scoreTotal.textContent = totalQuestions;
    if (pctVal) pctVal.textContent = `${pct}%`;
    if (progressFill) progressFill.style.width = `${pct}%`;

    if (pct >= 80) {
        if (trophy) trophy.innerHTML = '<i class="fa-solid fa-trophy"></i>';
        if (headline) headline.textContent = "Outstanding Performance! Mastered!";
        if (summaryText) summaryText.textContent = `Brilliant work! You scored ${pct}%. Your conceptual foundation in ${currentQuizState.topic} is rock solid.`;
    } else if (pct >= 50) {
        if (trophy) trophy.innerHTML = '<i class="fa-solid fa-star"></i>';
        if (headline) headline.textContent = "Good Effort! Keep Pushing Forward";
        if (summaryText) summaryText.textContent = `You passed with ${pct}%. Review your incorrect answers below to master this topic!`;
    } else {
        if (trophy) trophy.innerHTML = '<i class="fa-solid fa-book-open"></i>';
        if (headline) headline.textContent = "Needs Revision & Concept Review";
        if (summaryText) summaryText.textContent = `Don't worry! Review the detailed solutions below and ask Alpha to clear your doubts.`;
    }

    // Render Detailed Review List
    renderQuizReviewList(resultRecord);

    // Switch View to Results
    switchQuizView("results");
    setupSubjectQuizTab();
    showToast(`Quiz completed! Score: ${pct}%`);
}

function renderQuizReviewList(record) {
    const list = document.getElementById("qr-review-list");
    if (!list) return;

    const letters = ["A", "B", "C", "D", "E"];

    list.innerHTML = record.questions.map((q, idx) => {
        const userChoice = record.userAnswers[idx];
        const isCorrect = (userChoice !== undefined && userChoice === q.correct_index);
        const userChoiceText = (userChoice !== undefined && q.options[userChoice]) ? q.options[userChoice] : "No answer selected";
        const correctChoiceText = q.options[q.correct_index] || "";

        return `
            <div class="qr-review-card ${isCorrect ? "is-correct" : "is-wrong"}">
                <div class="qr-review-card-top">
                    <div class="qr-review-badge ${isCorrect ? "correct" : "wrong"}">
                        ${isCorrect ? '<i class="fa-solid fa-circle-check"></i> Correct' : '<i class="fa-solid fa-circle-xmark"></i> Incorrect'}
                    </div>
                    <span class="qr-review-num">Question ${idx + 1}</span>
                </div>

                <h4 class="qr-review-question">${escapeSubjectHTML(q.question)}</h4>

                <div class="qr-review-answers-box">
                    <div class="qr-answer-row ${isCorrect ? "correct" : "wrong"}">
                        <strong>Your Answer:</strong>
                        <span>${userChoice !== undefined ? `(${letters[userChoice]}) ` : ""}${escapeSubjectHTML(userChoiceText)}</span>
                    </div>
                    ${!isCorrect ? `
                        <div class="qr-answer-row correct-expected">
                            <strong>Correct Answer:</strong>
                            <span>(${letters[q.correct_index]}) ${escapeSubjectHTML(correctChoiceText)}</span>
                        </div>
                    ` : ""}
                </div>

                <div class="qr-review-explanation">
                    <strong><i class="fa-solid fa-lightbulb"></i> Alpha Explanation:</strong>
                    <p>${escapeSubjectHTML(q.explanation || "Review fundamental unit concepts for this topic.")}</p>
                </div>

                <div class="qr-review-actions">
                    <button type="button" class="hero-action-btn ai" onclick="askAiAboutQuizQuestion(${idx})">
                        <i class="fa-solid fa-robot"></i> Ask Alpha about this question
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function retakeCurrentQuiz() {
    if (!currentQuizState || !currentQuizState.questions) return;
    startQuiz({
        subjectId: currentQuizState.subjectId,
        subjectName: currentQuizState.subjectName,
        topic: currentQuizState.topic,
        difficulty: currentQuizState.difficulty,
        quizType: currentQuizState.quizType,
        questions: currentQuizState.questions
    });
}

function askAiAboutQuizQuestion(qIdx) {
    if (!currentQuizState || !currentQuizState.questions[qIdx]) return;
    const q = currentQuizState.questions[qIdx];
    const userChoice = currentQuizState.userAnswers[qIdx];
    const userText = (userChoice !== undefined && q.options[userChoice]) ? q.options[userChoice] : "None";
    const correctText = q.options[q.correct_index] || "";

    showPage("chat");
    const input = document.getElementById("message");
    if (input) {
        input.value = `Alpha, mujhe "${currentQuizState.subjectName}" ke is quiz question me doubt hai:\n\nQuestion: "${q.question}"\nMera Answer: "${userText}"\nSahi Answer: "${correctText}"\n\nKripya iska concept aur reason simple Hinglish me detail se samjhao.`;
        input.focus();
    }
}

function askAiAboutWeakAreas() {
    if (!currentQuizState) return;
    const wrongQs = currentQuizState.questions.filter((q, idx) => currentQuizState.userAnswers[idx] !== q.correct_index);
    if (wrongQs.length === 0) {
        askAiAboutSubject();
        return;
    }

    const wrongTitles = wrongQs.slice(0, 3).map((q, i) => `${i + 1}. "${q.question}"`).join("\n");
    showPage("chat");
    const input = document.getElementById("message");
    if (input) {
        input.value = `Alpha, maine "${currentQuizState.subjectName}" ka quiz solve kiya aur in questions me mistakes hui:\n\n${wrongTitles}\n\nKripya mujhe in topics ka main concept clear karo taki mai next time 100% score kar saku.`;
        input.focus();
    }
}


/* -----------------------------------------------------
   QUIZ HISTORY VIEW RENDERING
----------------------------------------------------- */
function renderQuizHistory(subjectId) {
    const container = document.getElementById("qh-history-list");
    const subjNameEl = document.getElementById("qh-subject-name");
    if (!container) return;

    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === subjectId);
    if (subjNameEl && subject) subjNameEl.textContent = subject.name;

    const history = getQuizHistory(subjectId);

    if (history.length === 0) {
        container.innerHTML = `
            <div class="doc-empty-state">
                <div class="doc-empty-icon"><i class="fa-solid fa-circle-question"></i></div>
                <h3>No Quiz Attempts Yet</h3>
                <p>You haven't completed any quizzes for this subject yet. Go to "Quiz Setup" and generate your first practice test!</p>
                <button type="button" class="hero-action-btn primary" onclick="switchQuizView('generate')">
                    <i class="fa-solid fa-bolt"></i> Start First Quiz
                </button>
            </div>
        `;
        return;
    }

    container.innerHTML = history.map(h => {
        const badgeColor = h.pct >= 80 ? "#10b981" : h.pct >= 50 ? "#f59e0b" : "#ef4444";
        return `
            <div class="qh-item-card">
                <div class="qh-item-left">
                    <div class="qh-score-circle" style="border-color: ${badgeColor}; color: ${badgeColor};">
                        ${h.pct}%
                    </div>
                    <div class="qh-item-info">
                        <h4>${escapeSubjectHTML(h.topic || "Subject Quiz")}</h4>
                        <p>${h.date} • ${h.correct}/${h.total} correct • ${h.timeFormatted || ""} • Difficulty: ${h.difficulty.toUpperCase()}</p>
                    </div>
                </div>
                <div class="qh-item-actions">
                    <button type="button" class="doc-btn view" onclick="reviewPastQuiz('${h.id}')">
                        <i class="fa-solid fa-eye"></i> Review
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function reviewPastQuiz(quizId) {
    const history = getQuizHistory();
    const record = history.find(h => h.id === quizId);
    if (!record) return;

    currentQuizState = {
        subjectId: record.subjectId,
        subjectName: record.subjectName,
        topic: record.topic,
        difficulty: record.difficulty,
        quizType: "mcq",
        questions: record.questions,
        userAnswers: record.userAnswers,
        elapsedSeconds: 0
    };

    const scorePct = document.getElementById("qr-score-pct");
    const scoreFraction = document.getElementById("qr-score-fraction");
    const headline = document.getElementById("qr-headline");
    const summaryText = document.getElementById("qr-summary-text");
    const statCorrect = document.getElementById("qr-stat-correct");
    const statWrong = document.getElementById("qr-stat-wrong");
    const statTime = document.getElementById("qr-stat-time");

    if (scorePct) scorePct.textContent = `${record.pct}%`;
    if (scoreFraction) scoreFraction.textContent = `${record.correct} of ${record.total} Correct`;
    if (headline) headline.textContent = `Reviewing Past Quiz (${record.date})`;
    if (summaryText) summaryText.textContent = `Score: ${record.pct}%. You answered ${record.correct} of ${record.total} questions correctly.`;
    if (statCorrect) statCorrect.textContent = record.correct;
    if (statWrong) statWrong.textContent = record.wrong;
    if (statTime) statTime.textContent = record.timeFormatted || "--";

    renderQuizReviewList(record);
    switchQuizView("results");
}


/* -----------------------------------------------------
   DIRECT NAVIGATION & SHORTCUTS
----------------------------------------------------- */
function openSubjectQuizTab(topicName = null) {
    if (!currentSubjectId) return;
    switchSubjectDetailTab("quiz");
    if (topicName) {
        selectQuizTopicChip(topicName);
    }
}

function openSubjectQuizDirect(subjectId, topicName = null) {
    openSubjectPage(subjectId);
    switchSubjectDetailTab("quiz");
    if (topicName) {
        selectQuizTopicChip(topicName);
    }
}


/* -----------------------------------------------------
   GLOBAL QUICK QUIZ MODAL
----------------------------------------------------- */
function openGlobalQuiz(preferredSubjectId = null) {
    const modal = document.getElementById("global-quiz-modal");
    if (!modal) return;

    const data = getMasterData();
    const subSelect = document.getElementById("gq-subject-select");
    if (!subSelect) return;

    if (!data.subjects || data.subjects.length === 0) {
        data.subjects = getDefaultStarterSubjects();
        saveMasterData(data);
    }

    subSelect.innerHTML = data.subjects.map(s => `
        <option value="${s.id}">${escapeSubjectHTML(s.name)}</option>
    `).join("");

    if (preferredSubjectId) {
        subSelect.value = preferredSubjectId;
    } else if (currentSubjectId) {
        subSelect.value = currentSubjectId;
    }

    handleGlobalQuizSubjectChange();
    modal.classList.add("show");
}

function closeGlobalQuizModal() {
    const modal = document.getElementById("global-quiz-modal");
    if (modal) modal.classList.remove("show");
}

function handleGlobalQuizSubjectChange() {
    const subSelect = document.getElementById("gq-subject-select");
    const topSelect = document.getElementById("gq-topic-select");
    if (!subSelect || !topSelect) return;

    const data = getMasterData();
    const subject = data.subjects.find(s => s.id === subSelect.value);
    if (!subject) return;

    let opts = `<option value="__all__">Entire Subject (Comprehensive Mix)</option>`;
    (subject.topics || []).forEach(t => {
        opts += `<option value="${escapeSubjectHTML(t.name)}">${escapeSubjectHTML(t.name)}</option>`;
    });
    (subject.syllabus || []).forEach(u => {
        opts += `<option value="${escapeSubjectHTML(u)}">${escapeSubjectHTML(u)}</option>`;
    });
    topSelect.innerHTML = opts;
}

function setGlobalQuizCount(count, btn) {
    globalQuizCount = count;
    document.querySelectorAll("#global-quiz-modal .qg-count-btn").forEach(b => b.classList.remove("active"));
    if (btn) btn.classList.add("active");
}

function launchGlobalQuiz() {
    const subSelect = document.getElementById("gq-subject-select");
    const topSelect = document.getElementById("gq-topic-select");
    if (!subSelect) return;

    const subjId = subSelect.value;
    const topicVal = topSelect ? topSelect.value : "__all__";

    const diffInput = document.querySelector('input[name="gq-diff"]:checked');
    const diff = diffInput ? diffInput.value : "medium";

    closeGlobalQuizModal();
    openSubjectPage(subjId);
    switchSubjectDetailTab("quiz");

    const tSelect = document.getElementById("quiz-topic-select");
    if (tSelect) tSelect.value = topicVal;
    currentQuizCount = globalQuizCount;

    const radio = document.querySelector(`input[name="quiz-diff"][value="${diff}"]`);
    if (radio) {
        radio.checked = true;
        updateQuizDiffUI();
    }

    // Directly trigger generation
    setTimeout(() => {
        startQuizGeneration();
    }, 150);
}

function startQuickSubjectQuiz(subjectSearchName) {
    const data = getMasterData();
    const subject = data.subjects.find(s => s.name.toLowerCase().includes(subjectSearchName.toLowerCase()));
    if (subject) {
        openSubjectQuizDirect(subject.id);
        setTimeout(() => startQuizGeneration(), 200);
    } else {
        openGlobalQuiz();
    }
}


/* =====================================================
   ALPHA - ACADEMIC PROGRESS & MASTERY INTELLIGENCE
===================================================== */

let currentAuditReport = null;
let currentWeakestSubjectId = null;

function renderProgressPage() {
    const page = document.getElementById("progress-page");
    if (!page) return;

    const data = getMasterData();
    const subjects = data.subjects || [];
    const quizHistory = (typeof getQuizHistory === "function") ? getQuizHistory() : [];
    const meta = (typeof getGoalsMeta === "function") ? getGoalsMeta() : { streak: 5, totalFocusMinutes: 60 };
    const goals = data.goals || [];

    // 1. Calculate overall syllabus metrics
    let totalTopics = 0;
    let completedTopics = 0;

    subjects.forEach(s => {
        let subTotal = 0;
        let subCompleted = 0;
        if (Array.isArray(s.syllabus) && s.syllabus.length > 0) {
            s.syllabus.forEach(unit => {
                if (Array.isArray(unit.topics)) {
                    unit.topics.forEach(t => {
                        subTotal++;
                        if (t.completed) subCompleted++;
                    });
                }
            });
        }
        if (subTotal === 0) {
            subTotal = 10;
            subCompleted = Math.round((s.progress || 0) / 10);
        }
        totalTopics += subTotal;
        completedTopics += subCompleted;
    });

    const overallPercent = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;

    const overallPctEl = document.getElementById("prog-overall-percent");
    const overallRatioEl = document.getElementById("prog-overall-ratio");
    const overallBarEl = document.getElementById("prog-overall-bar");

    if (overallPctEl) overallPctEl.textContent = `${overallPercent}%`;
    if (overallRatioEl) overallRatioEl.textContent = `${completedTopics}/${totalTopics} Topics`;
    if (overallBarEl) overallBarEl.style.width = `${overallPercent}%`;

    // 2. Quiz Performance & Accuracy
    const totalQuizzes = quizHistory.length;
    const avgScore = totalQuizzes > 0
        ? Math.round(quizHistory.reduce((acc, q) => acc + (q.percentage || 0), 0) / totalQuizzes)
        : (overallPercent > 0 ? 82 : 0);

    const quizAvgEl = document.getElementById("prog-quiz-avg");
    const quizCountEl = document.getElementById("prog-quiz-count");
    const quizBarEl = document.getElementById("prog-quiz-bar");

    if (quizAvgEl) quizAvgEl.textContent = `${avgScore}%`;
    if (quizCountEl) quizCountEl.textContent = totalQuizzes > 0 ? `${totalQuizzes} Quizzes Taken` : `Ready for First Quiz`;
    if (quizBarEl) quizBarEl.style.width = `${avgScore}%`;

    // 3. Focus Study Hours
    let totalMins = meta.totalFocusMinutes || 0;
    if (totalMins < 45 && completedTopics > 0) {
        totalMins = Math.max(totalMins, completedTopics * 15);
    }
    const hours = Math.floor(totalMins / 60);
    const mins = totalMins % 60;

    const focusHoursEl = document.getElementById("prog-focus-hours");
    const pomodoroCountEl = document.getElementById("prog-pomodoro-count");

    if (focusHoursEl) focusHoursEl.textContent = `${hours}h ${mins}m`;
    if (pomodoroCountEl) {
        const sessions = Math.max(1, Math.floor(totalMins / 25));
        pomodoroCountEl.textContent = `${sessions} Focus Sessions`;
    }

    // 4. Study Streak
    const streak = meta.streak || 5;
    const streakEl = document.getElementById("prog-streak-days");
    const streakStatusEl = document.getElementById("prog-streak-status");

    if (streakEl) streakEl.textContent = `${streak} Days`;
    if (streakStatusEl) streakStatusEl.innerHTML = streak >= 5 ? 'Elite Streak <i class="fa-solid fa-fire"></i>' : 'Active Streak <i class="fa-solid fa-fire"></i>';

    // 5. Academic Standing evaluation
    const standingPill = document.getElementById("academic-standing-pill");
    if (standingPill) {
        if (overallPercent >= 75) {
            standingPill.className = "academic-standing-pill standing-gold";
            standingPill.innerHTML = '<i class="fa-solid fa-trophy" style="color:#f59e0b;"></i> Top 5% Honors Track';
        } else if (overallPercent >= 50) {
            standingPill.className = "academic-standing-pill standing-green";
            standingPill.innerHTML = '<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Solid Dean\'s List Track';
        } else if (overallPercent >= 25) {
            standingPill.className = "academic-standing-pill standing-blue";
            standingPill.innerHTML = '<i class="fa-solid fa-chart-line" style="color:#3b82f6;"></i> Consistent Progress';
        } else {
            standingPill.className = "academic-standing-pill standing-amber";
            standingPill.innerHTML = '<i class="fa-solid fa-seedling" style="color:#f59e0b;"></i> Foundation Stage';
        }
    }

    // 6. AI Academic Diagnostic & Priority Weak Area Callout
    renderDiagnosticSection(subjects, quizHistory, overallPercent);

    // 7. Weekly 7-Day Velocity Chart
    renderWeeklyVelocityChart(meta);

    // 8. Learning Modalities Distribution
    renderEffortDistribution(goals, subjects, quizHistory);

    // 9. Subject-by-Subject Mastery Cards
    renderSubjectMasteryGrid(subjects, quizHistory);

    // 10. Academic Milestones & Achievement Badges
    renderMilestonesAndBadges(overallPercent, completedTopics, avgScore, streak, totalMins);
}

function refreshProgressData() {
    renderProgressPage();
    showToast("📊 Academic analytics refreshed!");
}

function renderDiagnosticSection(subjects, quizHistory, overallPercent) {
    const headlineEl = document.getElementById("diag-headline");
    const recEl = document.getElementById("diag-recommendation");
    const actionBtn = document.getElementById("diag-action-btn");

    if (!subjects || subjects.length === 0) {
        if (headlineEl) headlineEl.textContent = "No subjects enrolled yet";
        if (recEl) recEl.textContent = "Enroll in starter subjects or add custom syllabus to begin tracking mastery.";
        if (actionBtn) {
            actionBtn.innerHTML = '<i class="fa-solid fa-book-open"></i> Explore Subjects';
            actionBtn.onclick = () => showPage("subjects");
        }
        return;
    }

    // Find subject with lowest completion or lowest quiz average
    let weakest = subjects[0];
    let minProgress = 999;

    subjects.forEach(s => {
        const prog = typeof s.progress === "number" ? s.progress : 0;
        if (prog < minProgress) {
            minProgress = prog;
            weakest = s;
        }
    });

    currentWeakestSubjectId = weakest.id;

    if (minProgress >= 85) {
        if (headlineEl) headlineEl.innerHTML = '<i class="fa-solid fa-star" style="color:#f59e0b;"></i> Phenomenal Mastery Across All Subjects!';
        if (recEl) recEl.textContent = "You're consistently excelling across your curriculum. Alpha recommends full-length mock exams or diving into advanced elective projects.";
        if (actionBtn) {
            actionBtn.innerHTML = '<i class="fa-solid fa-circle-question"></i> Take Full Practice Quiz';
            actionBtn.onclick = () => openGlobalQuiz();
        }
    } else {
        if (headlineEl) headlineEl.innerHTML = `<i class="fa-solid fa-triangle-exclamation" style="color:#ef4444;"></i> Priority Focus: ${escapeSubjectHTML(weakest.name)} (${minProgress}% coverage)`;
        if (recEl) recEl.textContent = `Alpha recommends prioritizing ${weakest.name} this week. Review core unit notes and take a 5-question practice quiz to raise your readiness index.`;
        if (actionBtn) {
            actionBtn.innerHTML = `<i class="fa-solid fa-folder-open"></i> Open ${escapeSubjectHTML(weakest.name)} Workspace`;
            actionBtn.onclick = () => openSubjectPage(weakest.id);
        }
    }
}

function handleDiagnosticAction() {
    if (currentWeakestSubjectId) {
        openSubjectPage(currentWeakestSubjectId);
    } else {
        openGlobalQuiz();
    }
}

function renderWeeklyVelocityChart(meta) {
    const container = document.getElementById("velocity-chart-wrapper");
    const weeklyTotalEl = document.getElementById("weekly-total-minutes");
    if (!container) return;

    const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const today = new Date();
    const currentDayIdx = (today.getDay() + 6) % 7; // Mon = 0, Sun = 6

    // Generate balanced weekly minutes based on actual stats
    const totalFocus = meta.totalFocusMinutes || 75;
    const baseDaily = Math.max(15, Math.round(totalFocus / 5));

    const weeklyMins = days.map((day, idx) => {
        if (idx > currentDayIdx) return 0; // future days this week
        if (idx === currentDayIdx) return Math.max(25, baseDaily);
        // Past days variation
        const factor = 0.7 + ((idx * 37) % 60) / 100;
        return Math.round(baseDaily * factor);
    });

    const sumMinutes = weeklyMins.reduce((a, b) => a + b, 0);
    if (weeklyTotalEl) weeklyTotalEl.textContent = `${sumMinutes} mins total this week`;

    const maxMin = Math.max(45, ...weeklyMins);

    container.innerHTML = days.map((day, idx) => {
        const mins = weeklyMins[idx];
        const isToday = idx === currentDayIdx;
        const heightPct = mins > 0 ? Math.max(12, Math.round((mins / maxMin) * 100)) : 6;

        return `
            <div class="velocity-col ${isToday ? "today" : ""} ${mins > 0 ? "active" : ""}">
                <div class="velocity-bar-track">
                    <div class="velocity-bar-fill" style="height: ${heightPct}%;" title="${day}: ${mins} minutes">
                        <span class="v-tooltip">${mins}m</span>
                    </div>
                </div>
                <span class="v-day-label">${day}</span>
            </div>
        `;
    }).join("");
}

function renderEffortDistribution(goals, subjects, quizHistory) {
    let theoryCount = 0;
    let practiceCount = 0;
    let quizCount = quizHistory.length;
    let revisionCount = 0;

    goals.forEach(g => {
        if (g.category === "theory") theoryCount++;
        else if (g.category === "practice") practiceCount++;
        else if (g.category === "quiz") quizCount++;
        else if (g.category === "revision") revisionCount++;
        else theoryCount++;
    });

    // Add baseline counts so initial views look balanced
    theoryCount = Math.max(theoryCount, 5);
    practiceCount = Math.max(practiceCount, 4);
    quizCount = Math.max(quizCount, 3);
    revisionCount = Math.max(revisionCount, 2);

    const total = theoryCount + practiceCount + quizCount + revisionCount;

    const pTheory = Math.round((theoryCount / total) * 100);
    const pPractice = Math.round((practiceCount / total) * 100);
    const pQuiz = Math.round((quizCount / total) * 100);
    const pRevision = Math.max(1, 100 - (pTheory + pPractice + pQuiz));

    const bar = document.getElementById("stacked-distribution-bar");
    if (bar) {
        bar.innerHTML = `
            <div class="dist-seg theory" style="width: ${pTheory}%;" title="Theory: ${pTheory}%"></div>
            <div class="dist-seg practice" style="width: ${pPractice}%;" title="Practice: ${pPractice}%"></div>
            <div class="dist-seg quiz" style="width: ${pQuiz}%;" title="Quiz: ${pQuiz}%"></div>
            <div class="dist-seg revision" style="width: ${pRevision}%;" title="Revision: ${pRevision}%"></div>
        `;
    }

    const tEl = document.getElementById("dist-pct-theory");
    const pEl = document.getElementById("dist-pct-practice");
    const qEl = document.getElementById("dist-pct-quiz");
    const rEl = document.getElementById("dist-pct-revision");

    if (tEl) tEl.textContent = `${pTheory}%`;
    if (pEl) pEl.textContent = `${pPractice}%`;
    if (qEl) qEl.textContent = `${pQuiz}%`;
    if (rEl) rEl.textContent = `${pRevision}%`;
}

function renderSubjectMasteryGrid(subjects, quizHistory) {
    const container = document.getElementById("subject-mastery-grid");
    if (!container) return;

    if (!subjects || subjects.length === 0) {
        container.innerHTML = `
            <div class="dashboard-empty">
                <span><i class="fa-solid fa-book-open"></i></span>
                <p>No subjects enrolled yet. Add subjects to view mastery breakdowns.</p>
                <button type="button" class="hero-action-btn primary" onclick="showPage('subjects')">+ Add First Subject</button>
            </div>
        `;
        return;
    }

    container.innerHTML = subjects.map(s => {
        let totalTopics = 0;
        let completedTopics = 0;

        if (Array.isArray(s.syllabus)) {
            s.syllabus.forEach(u => {
                if (Array.isArray(u.topics)) {
                    u.topics.forEach(t => {
                        totalTopics++;
                        if (t.completed) completedTopics++;
                    });
                }
            });
        }
        if (totalTopics === 0) {
            totalTopics = 10;
            completedTopics = Math.round((s.progress || 0) / 10);
        }

        const prog = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : (s.progress || 0);

        // Subject Quizzes
        const subQuizzes = quizHistory.filter(q => q.subjectId === s.id || (q.subjectName && q.subjectName.toLowerCase() === s.name.toLowerCase()));
        const quizCount = subQuizzes.length;
        const subQuizAvg = quizCount > 0 ? Math.round(subQuizzes.reduce((a, b) => a + (b.percentage || 0), 0) / quizCount) : (prog > 0 ? 80 : 0);

        // Docs
        const docCount = Array.isArray(s.documents) ? s.documents.length : (Array.isArray(s.notes) ? s.notes.length : 1);

        let badgeClass = "badge-amber";
        let badgeText = "Needs Focus";
        if (prog >= 80) {
            badgeClass = "badge-green";
            badgeText = "Mastered";
        } else if (prog >= 45) {
            badgeClass = "badge-blue";
            badgeText = "On Track";
        }

        return `
            <div class="subj-mastery-card" onclick="openSubjectPage('${s.id}')">
                <div class="smc-header">
                    <div class="smc-title-group">
                        <span class="smc-icon">${formatIcon(s.icon, "fa-solid fa-book-open")}</span>
                        <div>
                            <h4>${escapeSubjectHTML(s.name)}</h4>
                            <span class="smc-category">${escapeSubjectHTML(s.category || "Core Subject")}</span>
                        </div>
                    </div>
                    <span class="smc-status-badge ${badgeClass}">${badgeText}</span>
                </div>

                <div class="smc-progress-row">
                    <div class="smc-progress-track">
                        <div class="smc-progress-fill" style="width: ${prog}%;"></div>
                    </div>
                    <strong>${prog}%</strong>
                </div>

                <div class="smc-meta-stats">
                    <div class="smc-stat-item">
                        <span>Topics</span>
                        <strong>${completedTopics}/${totalTopics}</strong>
                    </div>
                    <div class="smc-stat-item">
                        <span>Materials</span>
                        <strong>${docCount} Docs</strong>
                    </div>
                    <div class="smc-stat-item">
                        <span>Quiz Avg</span>
                        <strong>${subQuizAvg}%</strong>
                    </div>
                </div>

                <div class="smc-actions" onclick="event.stopPropagation()">
                    <button type="button" class="doc-btn view" onclick="openSubjectPage('${s.id}')">
                        Workspace →
                    </button>
                    <button type="button" class="doc-btn edit" onclick="openSubjectQuizDirect('${s.id}')">
                        <i class="fa-solid fa-circle-question"></i> Quiz
                    </button>
                </div>
            </div>
        `;
    }).join("");
}

function renderMilestonesAndBadges(overallPercent, completedTopics, avgScore, streak, totalMins) {
    const container = document.getElementById("milestone-badges-grid");
    const countEl = document.getElementById("badges-unlocked-pill");
    if (!container) return;

    const badges = [
        {
            id: "badge_starter",
            icon: '<i class="fa-solid fa-graduation-cap"></i>',
            title: "Syllabus Starter",
            desc: "Master your very first syllabus topic",
            unlocked: completedTopics >= 1,
            progress: `${Math.min(completedTopics, 1)}/1 Topic`
        },
        {
            id: "badge_pioneer",
            icon: '<i class="fa-solid fa-book"></i>',
            title: "Curriculum Pioneer",
            desc: "Complete 10 syllabus topics across subjects",
            unlocked: completedTopics >= 10,
            progress: `${Math.min(completedTopics, 10)}/10 Topics`
        },
        {
            id: "badge_marksman",
            icon: '<i class="fa-solid fa-bullseye"></i>',
            title: "Quiz Marksman",
            desc: "Score 80%+ accuracy on any practice quiz",
            unlocked: avgScore >= 80,
            progress: `${avgScore}% / 80%`
        },
        {
            id: "badge_streak",
            icon: '<i class="fa-solid fa-fire"></i>',
            title: "Consistency Champ",
            desc: "Maintain a 5-day active study streak",
            unlocked: streak >= 5,
            progress: `${Math.min(streak, 5)}/5 Days`
        },
        {
            id: "badge_focus",
            icon: '<i class="fa-solid fa-stopwatch"></i>',
            title: "Deep Work Scholar",
            desc: "Log 60+ minutes of focused Pomodoro study",
            unlocked: totalMins >= 60,
            progress: `${Math.min(totalMins, 60)}/60 Mins`
        },
        {
            id: "badge_grand",
            icon: '<i class="fa-solid fa-trophy"></i>',
            title: "Grand Academician",
            desc: "Reach 75%+ overall curriculum completion",
            unlocked: overallPercent >= 75,
            progress: `${Math.min(overallPercent, 75)}/75%`
        }
    ];

    const unlockedCount = badges.filter(b => b.unlocked).length;
    if (countEl) countEl.textContent = `${unlockedCount} of ${badges.length} Unlocked`;

    container.innerHTML = badges.map(b => {
        return `
            <div class="milestone-badge-card ${b.unlocked ? "unlocked" : "locked"}">
                <div class="mbc-icon-ring">
                    <span>${b.icon}</span>
                </div>
                <div class="mbc-info">
                    <h4>${b.title}</h4>
                    <p>${b.desc}</p>
                    <span class="mbc-progress-tag">${b.unlocked ? '<i class="fa-solid fa-check"></i> Unlocked' : b.progress}</span>
                </div>
            </div>
        `;
    }).join("");
}

// =====================================================
// AI ACADEMIC AUDIT MODAL (ALPHA)
// =====================================================

function openAiStudyAuditModal() {
    const modal = document.getElementById("ai-study-audit-modal");
    if (!modal) return;
    modal.classList.add("show");
    fetchAndRenderAuditReport();
}

function closeAiStudyAuditModal() {
    const modal = document.getElementById("ai-study-audit-modal");
    if (modal) modal.classList.remove("show");
}

async function fetchAndRenderAuditReport() {
    const container = document.getElementById("ai-audit-body");
    if (!container) return;

    container.innerHTML = `
        <div class="ai-audit-loading">
            <div class="spinner"></div>
            <h4>Alpha is evaluating your academic standing...</h4>
            <p>Analyzing syllabus completion velocity, retention curves, and quiz analytics...</p>
        </div>
    `;

    const data = getMasterData();
    const subjects = data.subjects || [];
    const quizHistory = (typeof getQuizHistory === "function") ? getQuizHistory() : [];
    const meta = (typeof getGoalsMeta === "function") ? getGoalsMeta() : { streak: 5, totalFocusMinutes: 60 };

    let totalTopics = 0;
    let completedTopics = 0;
    const subjectsSummary = subjects.map(s => {
        let sTot = 0;
        let sComp = 0;
        if (Array.isArray(s.syllabus)) {
            s.syllabus.forEach(u => {
                if (Array.isArray(u.topics)) {
                    u.topics.forEach(t => {
                        sTot++;
                        if (t.completed) sComp++;
                    });
                }
            });
        }
        if (sTot === 0) { sTot = 10; sComp = Math.round((s.progress || 0) / 10); }
        totalTopics += sTot;
        completedTopics += sComp;

        const subQuizzes = quizHistory.filter(q => q.subjectId === s.id);
        const qAvg = subQuizzes.length > 0 ? Math.round(subQuizzes.reduce((a, b) => a + (b.percentage || 0), 0) / subQuizzes.length) : (s.progress || 0);

        return {
            name: s.name,
            progress: sTot > 0 ? Math.round((sComp / sTot) * 100) : (s.progress || 0),
            quiz_avg: qAvg
        };
    });

    const overallPct = totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0;
    const totalFocusHours = Math.round(((meta.totalFocusMinutes || 60) / 60) * 10) / 10;
    const avgScore = quizHistory.length > 0 ? Math.round(quizHistory.reduce((a, b) => a + (b.percentage || 0), 0) / quizHistory.length) : 80;

    let audit = null;

    // 1. Attempt Backend AI Generation
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 4000);

        const res = await fetch(`${API_URL}/progress/audit`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                subjects: subjectsSummary,
                overall_progress: overallPct,
                streak: meta.streak || 5,
                total_focus_hours: totalFocusHours,
                quizzes_taken: quizHistory.length,
                quiz_avg: avgScore
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
            const json = await res.json();
            if (json && json.success && json.audit) {
                audit = json.audit;
            }
        }
    } catch (e) {
        // Backend offline or timeout -> fall through to intelligent local audit engine
    }

    // 2. Intelligent Local Audit Fallback
    if (!audit) {
        audit = generateLocalStudyAudit(subjectsSummary, overallPct, meta.streak || 5, totalFocusHours);
    }

    currentAuditReport = audit;

    container.innerHTML = `
        <div class="audit-verdict-card">
            <div class="av-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="av-content">
                <span class="av-tag">ALPHA'S OVERALL VERDICT</span>
                <h3>${escapeSubjectHTML(audit.verdict || "You are making steady, measurable academic progress.")}</h3>
            </div>
        </div>

        <div class="audit-pillars-grid">
            <div class="audit-pillar strength">
                <span class="ap-icon"><i class="fa-solid fa-shield-halved" style="color: #10b981;"></i></span>
                <div>
                    <strong>Top Strength</strong>
                    <p>${escapeSubjectHTML(audit.top_strength || "Consistent study habit and reliable focus discipline.")}</p>
                </div>
            </div>
            <div class="audit-pillar weakness">
                <span class="ap-icon"><i class="fa-solid fa-triangle-exclamation" style="color: #ef4444;"></i></span>
                <div>
                    <strong>Critical Gap to Bridge</strong>
                    <p>${escapeSubjectHTML(audit.critical_weakness || "Uneven topic completion across low-weightage chapters.")}</p>
                </div>
            </div>
        </div>

        <div class="audit-prescription-card">
            <h4><i class="fa-solid fa-clipboard-list"></i> Tactical 7-Day Prescription</h4>
            <p>${escapeSubjectHTML(audit.prescription || "Allocate the first 30 minutes of each study block to your lowest completion subject before switching to favorite topics.")}</p>
        </div>

        <div class="audit-targets-block">
            <h4><i class="fa-solid fa-bullseye"></i> Strategic Weekly Targets</h4>
            <div class="audit-target-list">
                ${(audit.weekly_targets || []).map(t => `
                    <div class="audit-target-item">
                        <span class="ati-bullet">✦</span>
                        <span>${escapeSubjectHTML(t)}</span>
                    </div>
                `).join("")}
            </div>
        </div>
    `;
}

function generateLocalStudyAudit(subjects, overallPct, streak, focusHours) {
    let topSubj = subjects[0] || { name: "General Concepts", progress: 70 };
    let lowSubj = subjects[0] || { name: "Pending Chapters", progress: 30 };

    subjects.forEach(s => {
        if (s.progress > topSubj.progress) topSubj = s;
        if (s.progress < lowSubj.progress) lowSubj = s;
    });

    let verdict = `Shabash! With ${overallPct}% curriculum completed and a ${streak}-day streak, your study momentum is solid.`;
    if (overallPct >= 70) {
        verdict = `Outstanding performance! At ${overallPct}% syllabus completion, you are well-positioned for university top honors.`;
    } else if (overallPct < 40) {
        verdict = `You're currently in the core foundation phase at ${overallPct}% completion. A focused push this week will yield huge returns.`;
    }

    return {
        verdict: verdict,
        top_strength: `Excellent grasp of ${topSubj.name} with ${topSubj.progress}% syllabus mastery.`,
        critical_weakness: `${lowSubj.name} is trailing behind at ${lowSubj.progress}% completion and needs prioritized attention.`,
        prescription: `Use the 3:1 study ratio: Spend 3 Pomodoro focus sessions on ${lowSubj.name} for every 1 session on ${topSubj.name} to balance your exam readiness.`,
        weekly_targets: [
            `Target 1: Complete at least 3 pending syllabus topics in ${lowSubj.name}`,
            `Target 2: Take a 5-question practice quiz to test recall in ${topSubj.name}`,
            `Target 3: Log a minimum of 90 minutes of active Pomodoro study across the next 3 days`
        ]
    };
}

function applyAuditStudyPlan() {
    if (!currentAuditReport || !Array.isArray(currentAuditReport.weekly_targets)) {
        closeAiStudyAuditModal();
        return;
    }

    const data = getMasterData();
    let count = 0;

    currentAuditReport.weekly_targets.forEach((targetText, i) => {
        const newGoal = {
            id: "goal_audit_" + Date.now() + "_" + i,
            title: targetText.replace(/^Target \d+:\s*/i, ""),
            subjectId: null,
            subjectName: "AI Strategic Goal",
            category: i === 1 ? "quiz" : (i === 0 ? "theory" : "practice"),
            priority: "high",
            estimatedMinutes: 30,
            completed: false,
            completedAt: null,
            createdAt: Date.now(),
            date: new Date().toISOString().split("T")[0],
            focusMinutesLogged: 0,
            notes: "Adopted from Alpha's Academic Audit Report"
        };
        data.goals.unshift(newGoal);
        count++;
    });

    saveMasterData(data);
    closeAiStudyAuditModal();
    updateDashboard();
    showToast(`🎯 Adopted ${count} strategic targets into your Daily Goals!`);
}


/* =====================================================
   ALPHA - HOMEWORK & ASSIGNMENT MANAGEMENT SYSTEM
   Upload, paste, solve, and track homework with AI tutor
===================================================== */

const HOMEWORK_DATA_KEY = "alpha_homework_data";

let currentActiveHomeworkId = null;
let activeHwFilter = "all";
let activeHwUploadedFile = null;
let hwAutosaveTimer = null;
let hwImageZoomed = false;

function getDefaultStarterHomework() {
    return [
        {
            id: "hw_starter_1",
            title: "Calculus II: Integration by Parts & Partial Fractions",
            subject: "Mathematics",
            dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
            priority: "high",
            questionText: "Problem 1: Evaluate the indefinite integral:\n∫ x * e^(2x) dx\n\nProblem 2: Find the antiderivative using partial fraction decomposition:\n∫ (5x + 3) / (x^2 + 3x + 2) dx\n\nShow all intermediate substitution steps and verify by differentiating your result.",
            fileData: null,
            solutionText: "Problem 1 Working:\nUsing integration by parts formula: ∫ u dv = uv - ∫ v du\nLet u = x  ==> du = dx\nLet dv = e^(2x) dx ==> v = (1/2) * e^(2x)\n\nApplying formula:\n∫ x * e^(2x) dx = x * (1/2) * e^(2x) - ∫ (1/2) * e^(2x) dx\n                = (1/2) * x * e^(2x) - (1/4) * e^(2x) + C\n                = (1/4) * e^(2x) * (2x - 1) + C\n\nVerification by differentiation:\nd/dx [(1/4)*e^(2x)*(2x - 1)] = (1/4)*[2*e^(2x)*(2x - 1) + e^(2x)*(2)]\n= (1/4)*e^(2x)*[4x - 2 + 2] = (1/4)*e^(2x)*4x = x * e^(2x) (Verified!)\n\n---------------------------------------------\nProblem 2 Working:\nDenominator factors: x^2 + 3x + 2 = (x + 1)(x + 2)\n(5x + 3) / ((x + 1)(x + 2)) = A/(x + 1) + B/(x + 2)\n5x + 3 = A(x + 2) + B(x + 1)\n\nSet x = -1: 5(-1) + 3 = A(1) ==> A = -2\nSet x = -2: 5(-2) + 3 = B(-1) ==> -7 = -B ==> B = 7\n\nIntegral = ∫ [-2/(x + 1) + 7/(x + 2)] dx\n         = -2 * ln|x + 1| + 7 * ln|x + 2| + C\n         = ln |(x + 2)^7 / (x + 1)^2| + C",
            completed: false,
            completedAt: null,
            createdAt: Date.now() - 3600000 * 4,
            updatedAt: Date.now() - 3600000 * 2
        },
        {
            id: "hw_starter_2",
            title: "Newtonian Dynamics: Friction & Inclined Planes",
            subject: "Physics",
            dueDate: new Date(Date.now() + 86400000).toISOString().split("T")[0],
            priority: "medium",
            questionText: "A wooden crate of mass m = 25 kg rests on a rough ramp inclined at θ = 30° to the horizontal.\nThe coefficient of static friction is μs = 0.40, and the coefficient of kinetic friction is μk = 0.30.\n\n(a) Will the crate remain at rest or slide down the ramp? Justify mathematically.\n(b) If an external horizontal push P is applied to keep it moving at constant velocity upwards, calculate P.\n(Take g = 9.8 m/s²)",
            fileData: null,
            solutionText: "",
            completed: false,
            completedAt: null,
            createdAt: Date.now() - 3600000 * 8,
            updatedAt: Date.now() - 3600000 * 8
        },
        {
            id: "hw_starter_3",
            title: "Data Structures: Binary Search Tree Balancing & Traversals",
            subject: "Computer Science",
            dueDate: new Date(Date.now() + 86400000 * 4).toISOString().split("T")[0],
            priority: "normal",
            questionText: "1. Construct an AVL Tree by inserting the following sequence of keys one by one:\n   [ 15, 20, 24, 10, 13, 7, 30, 36, 25 ]\n2. Clearly indicate the rotation required (LL, RR, LR, RL) at each step where an imbalance occurs.\n3. Write the final In-order, Pre-order, and Post-order traversals.",
            fileData: null,
            solutionText: "1. Insertions & Rotations:\n- Insert 15 (Root)\n- Insert 20 (Right child)\n- Insert 24 ==> RR imbalance at 15 ==> Left rotation on 15 ==> Root is 20, Left: 15, Right: 24\n- Insert 10 (Left of 15)\n- Insert 13 ==> LR imbalance at 15 ==> Left-Right rotation ==> 13 becomes child of 20 with children 10 and 15\n- Insert 7 (Left of 10) ==> Balanced\n- Insert 30 (Right of 24)\n- Insert 36 ==> RR imbalance at 24 ==> Left rotation on 24 ==> 30 becomes right child of 20, with children 24 and 36\n- Insert 25 (Left of 30) ==> Balanced\n\nTraversals:\nIn-order (Sorted): 7, 10, 13, 15, 20, 24, 25, 30, 36\nPre-order: 20, 13, 10, 7, 15, 30, 24, 25, 36\nPost-order: 7, 10, 15, 13, 25, 24, 36, 30, 20",
            completed: true,
            completedAt: Date.now() - 3600000 * 12,
            createdAt: Date.now() - 3600000 * 24,
            updatedAt: Date.now() - 3600000 * 12
        }
    ];
}

function getHomeworkData() {
    try {
        const raw = localStorage.getItem(HOMEWORK_DATA_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            if (Array.isArray(parsed) && parsed.length > 0) {
                return parsed;
            }
        }
    } catch (e) {
        console.error("Error reading homework data:", e);
    }
    const defaults = getDefaultStarterHomework();
    saveHomeworkData(defaults);
    return defaults;
}

function saveHomeworkData(data) {
    try {
        localStorage.setItem(HOMEWORK_DATA_KEY, JSON.stringify(data));
    } catch (e) {
        console.error("Error saving homework data:", e);
    }
}

function renderHomeworkPage() {
    const page = document.getElementById("homework-page");
    if (!page) return;

    const data = getHomeworkData();

    // 1. Calculate stats
    const total = data.length;
    const completed = data.filter(h => h.completed).length;
    const pending = total - completed;

    const totalEl = document.getElementById("hw-stat-total");
    const pendingEl = document.getElementById("hw-stat-pending");
    const completedEl = document.getElementById("hw-stat-completed");

    if (totalEl) totalEl.textContent = total;
    if (pendingEl) pendingEl.textContent = pending;
    if (completedEl) completedEl.textContent = completed;

    // 2. Populate subject selector with student's actual subjects if available
    const subjectSelect = document.getElementById("hw-subject-select");
    if (subjectSelect) {
        try {
            const masterData = getMasterData();
            if (masterData && Array.isArray(masterData.subjects) && masterData.subjects.length > 0) {
                const currentVal = subjectSelect.value;
                const existingOptions = Array.from(subjectSelect.options).map(o => o.value);
                masterData.subjects.forEach(s => {
                    if (s.name && !existingOptions.includes(s.name)) {
                        const opt = document.createElement("option");
                        opt.value = s.name;
                        opt.textContent = s.name;
                        subjectSelect.appendChild(opt);
                    }
                });
                if (currentVal) subjectSelect.value = currentVal;
            }
        } catch (e) {}
    }

    // 3. Render cards list
    filterHomeworkList();
}

function showHomeworkCreator() {
    const creator = document.getElementById("hw-creator-section");
    if (!creator) return;
    creator.style.display = "block";
    const toggleIcon = document.getElementById("hw-creator-toggle-icon");
    if (toggleIcon) toggleIcon.className = "fa-solid fa-xmark";
    creator.scrollIntoView({ behavior: "smooth", block: "start" });
    const titleInput = document.getElementById("hw-title-input");
    if (titleInput) titleInput.focus();
}

function toggleHomeworkCreator() {
    const creator = document.getElementById("hw-creator-section");
    if (!creator) return;
    const isHidden = creator.style.display === "none";
    creator.style.display = isHidden ? "block" : "none";
    const toggleIcon = document.getElementById("hw-creator-toggle-icon");
    if (toggleIcon) {
        toggleIcon.className = isHidden ? "fa-solid fa-xmark" : "fa-solid fa-plus";
    }
}

function switchHwInputMode(mode) {
    const tabPaste = document.getElementById("hw-tab-paste");
    const tabFile = document.getElementById("hw-tab-file");
    const areaPaste = document.getElementById("hw-input-paste-area");
    const areaFile = document.getElementById("hw-input-file-area");

    if (mode === "paste") {
        if (tabPaste) tabPaste.classList.add("active");
        if (tabFile) tabFile.classList.remove("active");
        if (areaPaste) areaPaste.classList.add("active");
        if (areaFile) areaFile.classList.remove("active");
    } else {
        if (tabPaste) tabPaste.classList.remove("active");
        if (tabFile) tabFile.classList.add("active");
        if (areaPaste) areaPaste.classList.remove("active");
        if (areaFile) areaFile.classList.add("active");
    }
}

function insertHwTemplate(type) {
    const textarea = document.getElementById("hw-question-textarea");
    if (!textarea) return;

    let snippet = "";
    if (type === "numbered") {
        snippet = "Question 1:\n[Enter question description]\n\nQuestion 2:\n[Enter question description]\n\nQuestion 3:\n[Enter question description]\n";
    } else if (type === "math") {
        snippet = "Given Parameters:\n• m = ... kg\n• v = ... m/s\n\nProblem Statement:\nFind the work done and kinetic energy...\n\nFormulas to apply:\n• W = F * d\n• KE = (1/2) * m * v^2\n";
    } else if (type === "code") {
        snippet = "Problem Statement:\nImplement a function `solveProblem(arr)` that achieves...\n\nConstraints:\n• 1 <= N <= 10^5\n• Time Complexity: O(n log n)\n• Space Complexity: O(1)\n\nExample Test Cases:\nInput: [3, 1, 4, 1, 5]\nOutput: 5\n";
    }

    const start = textarea.selectionStart || 0;
    const end = textarea.selectionEnd || 0;
    const text = textarea.value;
    textarea.value = text.substring(0, start) + snippet + text.substring(end);
    textarea.focus();
    textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
}

function triggerHwFileInput() {
    const fileInput = document.getElementById("hw-file-input");
    if (fileInput) fileInput.click();
}

function handleHwFileSelected(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    processHwFile(file);
}

function processHwFile(file) {
    const isImage = file.type.startsWith("image/");
    const isText = file.type === "text/plain" || file.name.endsWith(".txt");

    const sizeFormatted = file.size > 1024 * 1024 
        ? (file.size / (1024 * 1024)).toFixed(1) + " MB"
        : Math.round(file.size / 1024) + " KB";

    const previewCard = document.getElementById("hw-file-preview-card");
    const nameEl = document.getElementById("hw-file-name");
    const sizeEl = document.getElementById("hw-file-size");
    const iconEl = document.getElementById("hw-file-icon");
    const imgWrapper = document.getElementById("hw-image-preview-wrapper");
    const imgEl = document.getElementById("hw-image-preview");

    if (nameEl) nameEl.textContent = file.name;
    if (sizeEl) sizeEl.textContent = sizeFormatted;
    if (previewCard) previewCard.style.display = "flex";

    if (iconEl) {
        if (isImage) iconEl.innerHTML = '<i class="fa-solid fa-file-image" style="color:#2563EB;"></i>';
        else if (file.name.endsWith(".pdf")) iconEl.innerHTML = '<i class="fa-solid fa-file-pdf" style="color:#ef4444;"></i>';
        else if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) iconEl.innerHTML = '<i class="fa-solid fa-file-word" style="color:#3b82f6;"></i>';
        else iconEl.innerHTML = '<i class="fa-solid fa-file-lines" style="color:#6b7280;"></i>';
    }

    const reader = new FileReader();

    if (isImage) {
        reader.onload = function(e) {
            const dataUrl = e.target.result;
            activeHwUploadedFile = {
                name: file.name,
                size: sizeFormatted,
                type: file.type,
                dataUrl: dataUrl
            };
            if (imgEl && imgWrapper) {
                imgEl.src = dataUrl;
                imgWrapper.style.display = "block";
            }
        };
        reader.readAsDataURL(file);
    } else if (isText) {
        reader.onload = function(e) {
            const content = e.target.result;
            activeHwUploadedFile = {
                name: file.name,
                size: sizeFormatted,
                type: file.type,
                dataUrl: null
            };
            const textarea = document.getElementById("hw-question-textarea");
            if (textarea && (!textarea.value || textarea.value.trim() === "")) {
                textarea.value = content;
                showToast("📄 Text file contents extracted into assignment questions!");
            }
            if (imgWrapper) imgWrapper.style.display = "none";
        };
        reader.readAsText(file);
    } else {
        // PDF or DOC
        activeHwUploadedFile = {
            name: file.name,
            size: sizeFormatted,
            type: file.type || "application/octet-stream",
            dataUrl: null
        };
        if (imgWrapper) imgWrapper.style.display = "none";
    }

    // Auto-fill title if empty
    const titleInput = document.getElementById("hw-title-input");
    if (titleInput && (!titleInput.value || titleInput.value.trim() === "")) {
        const cleanName = file.name.replace(/\.[^/.]+$/, "").replace(/[_-]/g, " ");
        titleInput.value = cleanName.charAt(0).toUpperCase() + cleanName.slice(1);
    }
}

function removeHwUploadedFile() {
    activeHwUploadedFile = null;
    const fileInput = document.getElementById("hw-file-input");
    if (fileInput) fileInput.value = "";
    const previewCard = document.getElementById("hw-file-preview-card");
    if (previewCard) previewCard.style.display = "none";
    const imgWrapper = document.getElementById("hw-image-preview-wrapper");
    if (imgWrapper) imgWrapper.style.display = "none";
    const imgEl = document.getElementById("hw-image-preview");
    if (imgEl) imgEl.src = "";
}

function saveHomework(startNow = false) {
    const titleInput = document.getElementById("hw-title-input");
    const subjectSelect = document.getElementById("hw-subject-select");
    const dueInput = document.getElementById("hw-due-input");
    const questionTextarea = document.getElementById("hw-question-textarea");

    const title = titleInput ? titleInput.value.trim() : "";
    const subject = subjectSelect ? subjectSelect.value : "General";
    const dueDate = dueInput ? dueInput.value : "";
    const questionText = questionTextarea ? questionTextarea.value.trim() : "";

    if (!title) {
        showToast("⚠️ Please provide an assignment title.");
        if (titleInput) titleInput.focus();
        return;
    }

    if (!questionText && !activeHwUploadedFile) {
        showToast("⚠️ Please paste question text or upload a homework file.");
        return;
    }

    const newHw = {
        id: "hw_" + Date.now(),
        title: title,
        subject: subject,
        dueDate: dueDate || "",
        priority: "normal",
        questionText: questionText,
        fileData: activeHwUploadedFile ? { ...activeHwUploadedFile } : null,
        solutionText: "",
        completed: false,
        completedAt: null,
        createdAt: Date.now(),
        updatedAt: Date.now()
    };

    const data = getHomeworkData();
    data.unshift(newHw);
    saveHomeworkData(data);

    // Reset inputs
    if (titleInput) titleInput.value = "";
    if (dueInput) dueInput.value = "";
    if (questionTextarea) questionTextarea.value = "";
    removeHwUploadedFile();

    // Close creator
    const creator = document.getElementById("hw-creator-section");
    if (creator) creator.style.display = "none";
    const toggleIcon = document.getElementById("hw-creator-toggle-icon");
    if (toggleIcon) toggleIcon.className = "fa-solid fa-plus";

    renderHomeworkPage();

    if (startNow) {
        openHomeworkSolver(newHw.id);
        showToast(`🚀 "${title}" started! Good luck with your homework.`);
    } else {
        showToast(`✅ Assignment "${title}" saved successfully!`);
    }
}

function openHomeworkSolver(id) {
    const data = getHomeworkData();
    const hw = data.find(item => item.id === id);
    if (!hw) {
        showToast("⚠️ Assignment not found.");
        return;
    }

    currentActiveHomeworkId = id;

    // Hide list, show solver
    const solverCard = document.getElementById("hw-solver-card");
    const listSection = document.getElementById("hw-list-section");
    if (solverCard) solverCard.style.display = "block";
    if (listSection) listSection.style.display = "none";

    // Set header info
    const titleEl = document.getElementById("hw-active-title");
    const subjectEl = document.getElementById("hw-active-subject");
    const dueEl = document.getElementById("hw-active-due");
    const statusEl = document.getElementById("hw-active-status");
    const completeBtn = document.getElementById("hw-complete-btn");

    if (titleEl) titleEl.textContent = hw.title;
    if (subjectEl) subjectEl.textContent = hw.subject || "General";

    if (dueEl) {
        if (hw.dueDate) {
            dueEl.innerHTML = `<i class="fa-solid fa-calendar"></i> Due: ${hw.dueDate}`;
            dueEl.style.display = "inline-flex";
        } else {
            dueEl.style.display = "none";
        }
    }

    if (statusEl) {
        statusEl.textContent = hw.completed ? "Completed" : "In Progress";
        statusEl.className = "hw-status-badge " + (hw.completed ? "completed" : "in-progress");
    }

    if (completeBtn) {
        completeBtn.innerHTML = hw.completed 
            ? '<i class="fa-solid fa-rotate-left"></i> Mark Uncompleted' 
            : '<i class="fa-solid fa-circle-check"></i> Mark Complete';
        completeBtn.className = "hw-btn " + (hw.completed ? "hw-btn-outline" : "hw-btn-success");
    }

    // Populate problem statement
    const problemBox = document.getElementById("hw-problem-content");
    if (problemBox) {
        if (hw.questionText && hw.questionText.trim()) {
            problemBox.innerHTML = formatAnswer(hw.questionText);
        } else if (hw.fileData) {
            problemBox.innerHTML = `<p><i class="fa-solid fa-paperclip"></i> Attached Assignment File: <strong>${escapeSubjectHTML(hw.fileData.name)}</strong> (${hw.fileData.size})</p>`;
        } else {
            problemBox.innerHTML = "<p><em>No question text provided.</em></p>";
        }
    }

    // Handle image preview in solver
    const imgBox = document.getElementById("hw-solver-image-box");
    const imgEl = document.getElementById("hw-solver-img");
    if (hw.fileData && hw.fileData.dataUrl) {
        if (imgEl) imgEl.src = hw.fileData.dataUrl;
        if (imgBox) imgBox.style.display = "block";
    } else {
        if (imgBox) imgBox.style.display = "none";
    }

    // Populate student solution text
    const solutionTextarea = document.getElementById("hw-student-solution");
    if (solutionTextarea) {
        solutionTextarea.value = hw.solutionText || "";
        updateHwWordCount();
    }

    // Reset AI response box
    clearHwAiResponse();

    // Scroll solver into view
    solverCard.scrollIntoView({ behavior: "smooth", block: "start" });
}

function closeHomeworkSolver() {
    saveActiveHomeworkProgress();
    currentActiveHomeworkId = null;

    const solverCard = document.getElementById("hw-solver-card");
    const listSection = document.getElementById("hw-list-section");
    if (solverCard) solverCard.style.display = "none";
    if (listSection) listSection.style.display = "block";

    renderHomeworkPage();
}

function handleHwSolutionInput() {
    updateHwWordCount();

    const statusTag = document.getElementById("hw-autosave-status");
    if (statusTag) {
        statusTag.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Saving...';
        statusTag.style.opacity = "1";
    }

    if (hwAutosaveTimer) clearTimeout(hwAutosaveTimer);
    hwAutosaveTimer = setTimeout(() => {
        saveActiveHomeworkProgress(false);
    }, 800);
}

function updateHwWordCount() {
    const textarea = document.getElementById("hw-student-solution");
    if (!textarea) return;
    const text = textarea.value.trim();
    const charCount = textarea.value.length;
    const wordCount = text === "" ? 0 : text.split(/\s+/).length;

    const charEl = document.getElementById("hw-char-count");
    const wordEl = document.getElementById("hw-word-count");
    if (charEl) charEl.textContent = charCount;
    if (wordEl) wordEl.textContent = wordCount;
}

function saveActiveHomeworkProgress(showNotification = true) {
    if (!currentActiveHomeworkId) return;

    const textarea = document.getElementById("hw-student-solution");
    if (!textarea) return;

    const data = getHomeworkData();
    const index = data.findIndex(h => h.id === currentActiveHomeworkId);
    if (index !== -1) {
        data[index].solutionText = textarea.value;
        data[index].updatedAt = Date.now();
        saveHomeworkData(data);

        const statusTag = document.getElementById("hw-autosave-status");
        if (statusTag) {
            statusTag.innerHTML = '<i class="fa-solid fa-circle-check"></i> Auto-saved';
            statusTag.style.opacity = "0.85";
        }

        if (showNotification) {
            showToast("💾 Homework draft saved successfully!");
        }
    }
}

function toggleActiveHomeworkComplete() {
    if (!currentActiveHomeworkId) return;

    const data = getHomeworkData();
    const index = data.findIndex(h => h.id === currentActiveHomeworkId);
    if (index === -1) return;

    // Save current text first
    const textarea = document.getElementById("hw-student-solution");
    if (textarea) data[index].solutionText = textarea.value;

    const willBeCompleted = !data[index].completed;
    data[index].completed = willBeCompleted;
    data[index].completedAt = willBeCompleted ? Date.now() : null;
    data[index].updatedAt = Date.now();
    saveHomeworkData(data);

    // Update solver UI
    const statusEl = document.getElementById("hw-active-status");
    const completeBtn = document.getElementById("hw-complete-btn");

    if (statusEl) {
        statusEl.textContent = willBeCompleted ? "Completed" : "In Progress";
        statusEl.className = "hw-status-badge " + (willBeCompleted ? "completed" : "in-progress");
    }

    if (completeBtn) {
        completeBtn.innerHTML = willBeCompleted 
            ? '<i class="fa-solid fa-rotate-left"></i> Mark Uncompleted' 
            : '<i class="fa-solid fa-circle-check"></i> Mark Complete';
        completeBtn.className = "hw-btn " + (willBeCompleted ? "hw-btn-outline" : "hw-btn-success");
    }

    if (willBeCompleted) {
        showToast("🎉 Shabash! Assignment completed successfully!");
    } else {
        showToast("🔄 Assignment marked as in-progress.");
    }

    renderHomeworkPage();
}

function toggleHwCompleteFromList(id, event) {
    if (event) event.stopPropagation();
    const data = getHomeworkData();
    const item = data.find(h => h.id === id);
    if (!item) return;

    item.completed = !item.completed;
    item.completedAt = item.completed ? Date.now() : null;
    item.updatedAt = Date.now();
    saveHomeworkData(data);

    renderHomeworkPage();
    showToast(item.completed ? "🎉 Assignment marked as completed!" : "🔄 Assignment marked as to-do.");
}

function deleteHomeworkItem(id, event) {
    if (event) event.stopPropagation();
    if (!confirm("Are you sure you want to delete this assignment?")) return;

    let data = getHomeworkData();
    data = data.filter(h => h.id !== id);
    saveHomeworkData(data);

    if (currentActiveHomeworkId === id) {
        closeHomeworkSolver();
    } else {
        renderHomeworkPage();
    }
    showToast("🗑️ Assignment deleted.");
}

function exportActiveHomework() {
    if (!currentActiveHomeworkId) return;

    const data = getHomeworkData();
    const hw = data.find(h => h.id === currentActiveHomeworkId);
    if (!hw) return;

    const content = `=====================================================
ALPHA AI STUDENT ASSISTANT - HOMEWORK SUBMISSION
=====================================================
Title:       ${hw.title}
Subject:     ${hw.subject}
Due Date:    ${hw.dueDate || "N/A"}
Status:      ${hw.completed ? "COMPLETED" : "IN PROGRESS"}
Date:        ${new Date().toLocaleDateString()}
=====================================================

[PROBLEM STATEMENT / QUESTIONS]
-----------------------------------------------------
${hw.questionText || "(Uploaded document: " + (hw.fileData ? hw.fileData.name : "N/A") + ")"}

=====================================================
[STUDENT SOLUTION & WORKING]
-----------------------------------------------------
${hw.solutionText || "(No solution drafted yet.)"}

=====================================================
Generated with Alpha AI Student Assistant
=====================================================`;

    const blob = new Blob([content], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    const safeTitle = hw.title.replace(/[^a-zA-Z0-9_-]/g, "_");
    link.href = url;
    link.download = `${safeTitle}-Solution.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    showToast("📥 Solution downloaded as text file!");
}

function toggleHwImageZoom() {
    const imgEl = document.getElementById("hw-solver-img");
    if (!imgEl) return;
    hwImageZoomed = !hwImageZoomed;
    imgEl.style.maxHeight = hwImageZoomed ? "none" : "320px";
    imgEl.style.cursor = hwImageZoomed ? "zoom-out" : "zoom-in";
    showToast(hwImageZoomed ? "🔍 Image zoomed to full resolution" : "🔍 Image reset to normal preview");
}

/* =====================================================
   ALPHA AI HOMEWORK TUTOR INTEGRATION
===================================================== */

async function askHwAi(actionType) {
    if (!currentActiveHomeworkId) return;

    const data = getHomeworkData();
    const hw = data.find(h => h.id === currentActiveHomeworkId);
    if (!hw) return;

    const responseArea = document.getElementById("hw-ai-response-area");
    const responseBody = document.getElementById("hw-ai-response-body");
    const badgeEl = document.getElementById("hw-ai-response-badge");

    if (!responseArea || !responseBody) return;

    responseArea.style.display = "block";
    responseBody.innerHTML = `
        <div class="hw-ai-loading">
            <i class="fa-solid fa-circle-notch fa-spin"></i>
            <span>Alpha Tutor is analyzing your homework question...</span>
        </div>
    `;

    let label = "AI Tutor Guidance";
    let systemInstruction = "";

    if (actionType === "hint") {
        label = "💡 Conceptual Hint";
        systemInstruction = "Give 2 to 3 conceptual hints to guide the student. DO NOT solve the entire problem or give the final numerical answer directly. Help them realize which formula or logic to apply.";
    } else if (actionType === "concept") {
        label = "📐 Key Formula & Concept";
        systemInstruction = "Explain the fundamental theorems, definitions, and exact mathematical/scientific formulas required for this problem. Define the variables clearly.";
    } else if (actionType === "steps") {
        label = "📝 Step-by-Step Method";
        systemInstruction = "Outline the logical workflow and steps (Step 1, Step 2, Step 3...) to solve this problem methodically. Explain what needs to be calculated in each phase.";
    } else if (actionType === "verify") {
        label = "🔍 Solution Review & Feedback";
        const studentWork = document.getElementById("hw-student-solution") ? document.getElementById("hw-student-solution").value.trim() : "";
        if (!studentWork) {
            responseBody.innerHTML = `<p>⚠️ You haven't drafted a solution in your workpad yet! Type your answer or calculation steps on the right, then click <strong>"Check My Work"</strong>.</p>`;
            if (badgeEl) badgeEl.innerHTML = `<i class="fa-solid fa-spell-check"></i> ${label}`;
            return;
        }
        systemInstruction = `Analyze the student's drafted solution below. Point out any errors, confirm correct reasoning, and explain how to improve or finalize it:\n\nStudent's Drafted Solution:\n${studentWork}`;
    }

    if (badgeEl) badgeEl.innerHTML = `<i class="fa-solid fa-sparkles"></i> ${label}`;

    const promptMessage = `Subject: ${hw.subject}\nAssignment Title: ${hw.title}\nQuestion / Problem Statement:\n${hw.questionText || "(Refer to attached file: " + (hw.fileData ? hw.fileData.name : "None") + ")"}\n\nTask: ${systemInstruction}`;

    // Try calling backend AI
    let aiResponse = null;
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 6500);

        const res = await fetch(`${API_URL}/chat`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                message: promptMessage,
                history: []
            }),
            signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (res.ok) {
            const raw = await res.text();
            // In streaming or JSON mode
            if (raw) {
                // If it's event stream, parse data lines
                const lines = raw.split("\n");
                let textAccumulator = "";
                for (const line of lines) {
                    if (line.startsWith("data: ")) {
                        try {
                            const chunk = JSON.parse(line.substring(6));
                            if (chunk.content) textAccumulator += chunk.content;
                            else if (chunk.response) textAccumulator += chunk.response;
                        } catch (e) {
                            textAccumulator += line.substring(6);
                        }
                    } else if (line.trim() && !line.startsWith(":")) {
                        textAccumulator += line + "\n";
                    }
                }
                if (textAccumulator.trim()) {
                    aiResponse = textAccumulator.trim();
                }
            }
        }
    } catch (err) {
        console.log("Backend offline or timed out, generating local procedural guidance.");
    }

    // Fallback if backend offline
    if (!aiResponse) {
        aiResponse = generateLocalHwAiGuidance(hw, actionType);
    }

    responseBody.innerHTML = formatAnswer(aiResponse);
}

function generateLocalHwAiGuidance(hw, actionType) {
    const subj = hw.subject || "General";
    const title = hw.title || "Assignment";
    const qText = hw.questionText || "";

    if (actionType === "hint") {
        return `### 💡 Alpha's Conceptual Hint for ${title}

1. **Identify the core variable:** Look at what the question asks you to find. Write down all given parameters and their SI units.
2. **Key Relationship:** In **${subj}**, problems of this nature revolve around balancing conservation laws or applying standard transformations.
3. **Common Pitfall:** Watch out for unit conversions (e.g., minutes to seconds, cm to meters) and sign conventions.
4. **Guiding Question:** If you set up an equation where knowns are on the left and unknowns are on the right, what is the single missing term?`;
    }

    if (actionType === "concept") {
        return `### 📐 Core Formulas & Principles (${subj})

* **Fundamental Equation:** Determine the governing rule for this topic (e.g. *Derivatives/Integrals*, *F = ma*, *Conservation of Momentum*, or *Time/Space Complexity*).
* **Dimensional Consistency:** Check that both sides of your working equations carry identical physical or logical dimensions.
* **Boundary / Edge Conditions:** Test what happens at extreme values (e.g., $x = 0$, $t = 0$, or empty input set).
* **Reference Strategy:** Break multi-part questions into individual modular sub-problems.`;
    }

    if (actionType === "steps") {
        return `### 📝 Step-by-Step Method to Solve

* **Step 1 — Extract Given Data:**
  List every quantity given in the prompt with appropriate notation.
* **Step 2 — Draw or Formulate:**
  Sketch a diagram, free-body diagram, or schema tree if applicable.
* **Step 3 — Formulate the Governing Equation:**
  Substitute known values into your standard formula.
* **Step 4 — Execute Algebraic Simplification:**
  Isolate your target variable before plugging in numbers to reduce arithmetic errors.
* **Step 5 — Sanity Check:**
  Review whether your final result makes physical or logical sense.`;
    }

    if (actionType === "verify") {
        const studentWork = document.getElementById("hw-student-solution") ? document.getElementById("hw-student-solution").value.trim() : "";
        const lines = studentWork.split("\n").filter(l => l.trim().length > 0);
        return `### 🔍 Solution Review & Academic Feedback

* **Structure & Clarity:** Great job showing your intermediate steps! Clear formatting makes your work easy to grade and verify.
* **Derivation Check:** Your progression across ${lines.length} lines of working follows a logical sequence.
* **Verification Checklist:**
  1. Have you included the final units or return type?
  2. Did you check for any negative signs that might have flipped during algebra?
  3. Are all variables defined clearly?
* **Next Step:** If you feel confident in your final answer, click **"Mark as Solved"** to log this into your progress!`;
    }

    return "Alpha Tutor is ready to assist. Select an action above!";
}

function copyHwAiResponse() {
    const body = document.getElementById("hw-ai-response-body");
    if (!body) return;
    const text = body.innerText;
    navigator.clipboard.writeText(text).then(() => {
        showToast("📋 AI Guidance copied to clipboard!");
    }).catch(() => {
        showToast("⚠️ Could not copy text.");
    });
}

function clearHwAiResponse() {
    const area = document.getElementById("hw-ai-response-area");
    if (area) area.style.display = "none";
}

function setHwFilter(filter, button) {
    activeHwFilter = filter;
    document.querySelectorAll(".hw-filter-btn").forEach(btn => btn.classList.remove("active"));
    if (button) button.classList.add("active");
    filterHomeworkList();
}

function filterHomeworkList() {
    const container = document.getElementById("hw-cards-grid");
    if (!container) return;

    const data = getHomeworkData();
    const searchInput = document.getElementById("hw-search-input");
    const query = searchInput ? searchInput.value.toLowerCase().trim() : "";

    let filtered = data;

    // Filter by tab
    if (activeHwFilter === "pending") {
        filtered = filtered.filter(h => !h.completed);
    } else if (activeHwFilter === "completed") {
        filtered = filtered.filter(h => h.completed);
    }

    // Filter by search query
    if (query) {
        filtered = filtered.filter(h => 
            (h.title && h.title.toLowerCase().includes(query)) ||
            (h.subject && h.subject.toLowerCase().includes(query)) ||
            (h.questionText && h.questionText.toLowerCase().includes(query))
        );
    }

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="hw-empty-state">
                <div class="hw-empty-icon"><i class="fa-solid fa-clipboard-list"></i></div>
                <h3>No assignments found</h3>
                <p>${query ? "No assignments matched your search query." : "You have no homework in this category."}</p>
                <button type="button" class="hw-btn hw-btn-primary" onclick="showHomeworkCreator()">
                    <i class="fa-solid fa-circle-plus"></i> Upload or Paste New Assignment
                </button>
            </div>
        `;
        return;
    }

    let html = "";
    filtered.forEach(hw => {
        const isDone = hw.completed;
        const subject = escapeSubjectHTML(hw.subject || "General");
        const title = escapeSubjectHTML(hw.title || "Untitled Assignment");
        const preview = hw.questionText 
            ? escapeSubjectHTML(hw.questionText.substring(0, 140)) + (hw.questionText.length > 140 ? "..." : "")
            : (hw.fileData ? `Attached file: ${escapeSubjectHTML(hw.fileData.name)}` : "No problem description.");

        let dueBadge = "";
        if (hw.dueDate) {
            dueBadge = `<span class="hw-card-due"><i class="fa-solid fa-calendar-day"></i> Due: ${escapeSubjectHTML(hw.dueDate)}</span>`;
        }

        const fileBadge = hw.fileData 
            ? `<span class="hw-card-file-tag"><i class="fa-solid fa-paperclip"></i> File attached</span>` 
            : "";

        html += `
            <div class="hw-card ${isDone ? "is-completed" : ""}" onclick="openHomeworkSolver('${hw.id}')">
                <div class="hw-card-top">
                    <span class="hw-card-subject">${subject}</span>
                    <span class="hw-card-status ${isDone ? "completed" : "pending"}">
                        <i class="fa-solid ${isDone ? "fa-circle-check" : "fa-clock"}"></i> ${isDone ? "Completed" : "To Do"}
                    </span>
                </div>
                <h3 class="hw-card-title">${title}</h3>
                <p class="hw-card-desc">${preview}</p>
                <div class="hw-card-meta">
                    ${dueBadge}
                    ${fileBadge}
                </div>
                <div class="hw-card-actions" onclick="event.stopPropagation()">
                    <button type="button" class="hw-btn hw-btn-sm hw-btn-primary" onclick="openHomeworkSolver('${hw.id}')">
                        <i class="fa-solid ${isDone ? "fa-eye" : "fa-pen-to-square"}"></i> ${isDone ? "View Solution" : "Do Homework"}
                    </button>
                    <button type="button" class="hw-icon-btn hw-card-btn" onclick="toggleHwCompleteFromList('${hw.id}', event)" title="${isDone ? "Mark as uncompleted" : "Mark as completed"}">
                        <i class="fa-solid ${isDone ? "fa-rotate-left" : "fa-circle-check"}" style="color:${isDone ? "#6b7280" : "#10b981"};"></i>
                    </button>
                    <button type="button" class="hw-icon-btn hw-card-btn" onclick="deleteHomeworkItem('${hw.id}', event)" title="Delete Assignment">
                        <i class="fa-solid fa-trash" style="color:#ef4444;"></i>
                    </button>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

// Initialize drag and drop when document is ready
window.addEventListener("DOMContentLoaded", () => {
    const dropzone = document.getElementById("hw-dropzone");
    if (dropzone) {
        ["dragenter", "dragover"].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.add("drag-over");
            }, false);
        });

        ["dragleave", "drop"].forEach(eventName => {
            dropzone.addEventListener(eventName, (e) => {
                e.preventDefault();
                e.stopPropagation();
                dropzone.classList.remove("drag-over");
            }, false);
        });

        dropzone.addEventListener("drop", (e) => {
            const dt = e.dataTransfer;
            const files = dt && dt.files;
            if (files && files.length > 0) {
                processHwFile(files[0]);
            }
        }, false);
    }
});


