// =====================================================
// MASTER SAHAB - MAIN JAVASCRIPT
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
                ? "🔍 No chats found"
                : "💬 No chat history yet";

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

            deleteButton.textContent =
                "🗑️";

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
                "Master Sahab ne koi answer return nahi kiya.";

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
            `❌ Master Sahab se connection nahi ho pa raha.
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
                    "Ask Master Sahab anything...";
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
// MASTER SAHAB - ENHANCED DASHBOARD
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


    if (
        !subjects.length &&
        typeof localStorage !== "undefined"
    ) {

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
                "Could not load subjects."
            );
        }
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
                        onclick="showPage('subjects')">

                        <div class="dashboard-subject-top">

                            <span class="dashboard-subject-icon">
                                ${icon}
                            </span>

                            <span class="dashboard-subject-name">
                                ${name}
                            </span>

                        </div>

                        <div class="dashboard-subject-progress">
                            <span
                                style="width:${Math.min(progress,100)}%">
                            </span>
                        </div>

                    </div>
                `;

            })
            .join("");
}


// =====================================================
// GOALS
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
        goals.filter(goal =>
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
                            ${text}
                        </span>

                    </div>
                `;

            })
            .join("");
}


// =====================================================
// GOAL TOGGLE
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
            JSON.parse(
                localStorage.getItem(
                    "master_sahab_chat_history"
                ) || "[]"
            );


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
                            ${activity.icon || "📚"}
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
   MASTER SAHAB - SUBJECT MANAGEMENT SYSTEM
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

    if (!Array.isArray(data.subjects)) {
        data.subjects = [];
    }

    if (!Array.isArray(data.goals)) {
        data.goals = [];
    }

    if (!Array.isArray(data.activities)) {
        data.activities = [];
    }

    return data;
}


/* =====================================================
   SAVE MASTER DATA
===================================================== */

function saveMasterData(data) {

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

        const progress =
            calculateSubjectProgress(subject);

        return `

        <div class="enhanced-subject-card">

            <div class="enhanced-subject-top">

                <div class="enhanced-subject-icon">
                    ${subject.icon || "📚"}
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
                        ✏️
                    </button>

                    <button
                        class="delete-subject"
                        title="Delete"
                        onclick="event.stopPropagation(); deleteSubject('${subject.id}')"
                    >
                        🗑️
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
                    📖 <strong>${syllabusCount}</strong> Units
                    &nbsp;•&nbsp;
                    📝 <strong>${topicCount}</strong> Topics
                </div>

                <button
                    class="open-subject-btn"
                    onclick="openSubjectDetails('${subject.id}')"
                >
                    View →
                </button>

            </div>

        </div>

        `;

    }).join("");

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
        badge.textContent = "✏️ EDIT SUBJECT";

        name.value = subject.name || "";
        icon.value = subject.icon || "📚";
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
        badge.textContent = "📚 NEW SUBJECT";

        name.value = "";
        icon.value = "📚";
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

    const input =
        document.getElementById("subject-icon-input");

    if (input) {
        input.value = icon;
    }

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
        ).value || "📚";

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
   OPEN SUBJECT DETAILS
===================================================== */

function openSubjectDetails(subjectId) {

    const data = getMasterData();

    const subject =
        data.subjects.find(
            item => item.id === subjectId
        );

    if (!subject) return;


    const modal =
        document.getElementById(
            "subject-details-modal"
        );

    const content =
        document.getElementById(
            "subject-details-content"
        );

    const progress =
        calculateSubjectProgress(subject);


    content.innerHTML = `

        <div class="subject-detail-header">

            <div class="subject-detail-icon">
                ${subject.icon || "📚"}
            </div>

            <div>

                <h2>
                    ${escapeSubjectHTML(subject.name)}
                </h2>

                <p>
                    ${
                        escapeSubjectHTML(
                            subject.description ||
                            "No description added."
                        )
                    }
                </p>

            </div>

        </div>


        <div class="detail-progress">

            <div class="detail-progress-top">

                <span>Overall Progress</span>

                <strong>${progress}%</strong>

            </div>

            <div class="subject-progress-bar">

                <span style="width:${progress}%"></span>

            </div>

        </div>


        <div class="detail-section">

            <h3>
                📖 Syllabus
            </h3>

            ${
                subject.syllabus?.length
                ?
                subject.syllabus.map(
                    (unit, index) => `
                        <div class="syllabus-item">
                            📘
                            ${index + 1}.
                            ${escapeSubjectHTML(unit)}
                        </div>
                    `
                ).join("")
                :
                `
                    <div class="dashboard-empty">
                        No syllabus added.
                    </div>
                `
            }

        </div>


        <div class="detail-section">

            <h3>
                📝 Topics
            </h3>

            ${
                subject.topics?.length
                ?
                subject.topics.map(
                    topic => `
                        <label
                            class="topic-item ${
                                topic.completed
                                ? "completed"
                                : ""
                            }"
                        >

                            <input
                                type="checkbox"
                                class="topic-check"
                                ${
                                    topic.completed
                                    ? "checked"
                                    : ""
                                }
                                onchange="toggleSubjectTopic(
                                    '${subject.id}',
                                    '${topic.id}'
                                )"
                            >

                            <span>
                                ${escapeSubjectHTML(topic.name)}
                            </span>

                        </label>
                    `
                ).join("")
                :
                `
                    <div class="dashboard-empty">
                        No topics added.
                    </div>
                `
            }

        </div>

    `;


    modal.classList.add("show");

}


/* =====================================================
   CLOSE DETAILS
===================================================== */

function closeSubjectDetails() {

    const modal =
        document.getElementById(
            "subject-details-modal"
        );

    if (modal) {
        modal.classList.remove("show");
    }

}


/* =====================================================
   COMPLETE / UNCOMPLETE TOPIC
===================================================== */

function toggleSubjectTopic(
    subjectId,
    topicId
) {

    const data = getMasterData();

    const subject =
        data.subjects.find(
            item => item.id === subjectId
        );

    if (!subject) return;


    const topic =
        subject.topics.find(
            item => item.id === topicId
        );

    if (!topic) return;


    topic.completed =
        !topic.completed;


    subject.progress =
        calculateSubjectProgress(subject);


    saveMasterData(data);

    openSubjectDetails(subjectId);

    renderSubjects();

    updateDashboardAfterSubjectChange();

}


/* =====================================================
   DASHBOARD SYNC
===================================================== */

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

    } catch (error) {

        console.log(
            "Dashboard sync:",
            error
        );

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

        const subjectModal =
            document.getElementById(
                "subject-modal"
            );

        const detailsModal =
            document.getElementById(
                "subject-details-modal"
            );


        if (
            event.target === subjectModal
        ) {
            closeSubjectModal();
        }


        if (
            event.target === detailsModal
        ) {
            closeSubjectDetails();
        }

    }
);


/* =====================================================
   ESC KEY
===================================================== */

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key !== "Escape") return;

        closeSubjectModal();
        closeSubjectDetails();

    }
);


/* =====================================================
   THEME SWITCHER SYSTEM
   Imperial Royal (Default), Emerald Scholar, Obsidian Luxe
===================================================== */

function setAppTheme(themeName) {
    if (!themeName) themeName = "royal";
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
    const savedTheme = localStorage.getItem("master_sahab_theme") || "royal";
    document.documentElement.setAttribute("data-theme", savedTheme);

    window.addEventListener("DOMContentLoaded", () => {
        setAppTheme(savedTheme);
    });

    if (document.readyState === "complete" || document.readyState === "interactive") {
        setAppTheme(savedTheme);
    }
})();