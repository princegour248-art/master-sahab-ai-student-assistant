// =====================================================
// CHAT HISTORY - GET
// =====================================================

function getSavedChats() {

    try {

        const saved = localStorage.getItem(HISTORY_KEY);

        if (!saved) {
            return [];
        }

        const chats = JSON.parse(saved);

        return Array.isArray(chats) ? chats : [];

    } catch (error) {

        console.error("History load error:", error);

        return [];
    }
}


// =====================================================
// CHAT HISTORY - SAVE
// =====================================================

function saveAllChats(chats) {

    try {

        localStorage.setItem(
            HISTORY_KEY,
            JSON.stringify(chats)
        );

    } catch (error) {

        console.error("History save error:", error);
    }
}


// =====================================================
// CREATE CHAT ID
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
// FORMAT AI ANSWER
// =====================================================

function formatAnswer(text) {

    if (!text) {
        return "";
    }


    // Escape HTML first

    let html = String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");


    // Code blocks

    html = html.replace(
        /```(?:[a-zA-Z0-9_+-]+)?\n?([\s\S]*?)```/g,
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
        /(?<!\*)\*([^*\n]+)\*(?!\*)/g,
        "<em>$1</em>"
    );


    // Inline code

    html = html.replace(
        /`([^`\n]+)`/g,
        "<code>$1</code>"
    );


    // Bullet points

    html = html.replace(
        /^\s*[-•]\s+(.*)$/gm,
        "<li>$1</li>"
    );


    // Numbered points

    html = html.replace(
        /^\s*\d+\.\s+(.*)$/gm,
        "<li>$1</li>"
    );


    // Line breaks

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
// HIDE & DISABLE CHAT WELCOME / EXAMPLES
// =====================================================

function hideChatWelcome() {
    const welcome = document.querySelector(".chat-welcome");
    if (welcome) {
        welcome.querySelectorAll("button").forEach(btn => {
            btn.disabled = true;
        });
        welcome.classList.add("hidden");
        welcome.remove();
    }
}


// =====================================================
// SHOW CHAT WELCOME / EXAMPLES
// =====================================================

function showWelcomeScreen() {
    const chatBox = document.getElementById("chat-box");
    if (!chatBox) return;

    if (chatBox.querySelector(".chat-welcome")) {
        return;
    }

    chatBox.innerHTML = `
        <div class="chat-welcome" id="chat-welcome">
            <div class="chat-welcome-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
            </div>

            <h1>How can I help you today?</h1>

            <p>Ask Alpha anything about your syllabus, homework, or exam prep.</p>

            <div class="chat-suggestions">
                <button
                    type="button"
                    onclick="useChatSuggestion('Explain Python in simple words')"
                >
                    <span class="suggestion-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>
                    </span>
                    <strong>Explain Python</strong>
                    <small>in simple words</small>
                </button>

                <button
                    type="button"
                    onclick="useChatSuggestion('Help me prepare for my exam')"
                >
                    <span class="suggestion-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>
                    </span>
                    <strong>Exam Preparation</strong>
                    <small>Create a study plan</small>
                </button>

                <button
                    type="button"
                    onclick="useChatSuggestion('Explain this topic with an example')"
                >
                    <span class="suggestion-icon">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z"/></svg>
                    </span>
                    <strong>Learn a Topic</strong>
                    <small>With simple examples</small>
                </button>
            </div>
        </div>
    `;
}


// =====================================================
// DISPLAY CHAT MESSAGE
// =====================================================

function displayMessage(role, text) {

    const chatBox =
        document.getElementById("chat-box");

    if (!chatBox) {
        return;
    }

    // Disable and remove examples when any message is displayed
    hideChatWelcome();


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


    chatBox.appendChild(messageDiv);

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// =====================================================
// CLEAR CURRENT CHAT
// =====================================================

function clearCurrentChatScreen() {
    const chatBox = document.getElementById("chat-box");
    if (chatBox) {
        chatBox.innerHTML = "";
    }

    window.currentChat = [];
    currentChat = [];
    window.currentChatId = null;
    currentChatId = null;
}
window.clearCurrentChatScreen = clearCurrentChatScreen;


// =====================================================
// START NEW CHAT
// =====================================================

function startNewChat() {
    const chatList = Array.isArray(window.currentChat) ? window.currentChat : (Array.isArray(currentChat) ? currentChat : []);
    if (chatList.length > 0) {
        saveCurrentChat();
    }

    clearCurrentChatScreen();
    showWelcomeScreen();

    const newId = createChatId();
    window.currentChatId = newId;
    currentChatId = newId;

    const input = document.getElementById("message");
    if (input) {
        input.value = "";
        input.focus();
    }

    const search = document.getElementById("history-search");
    if (search) {
        search.value = "";
    }

    if (typeof renderHistory === "function") {
        renderHistory();
    }
}
window.startNewChat = startNewChat;


// =====================================================
// REFRESH CHAT (BACKUP & RELOAD)
// =====================================================

function refreshChat() {
    // 1. Back up current chat in history if there are any messages
    try {
        const chatList = Array.isArray(window.currentChat) ? window.currentChat : (Array.isArray(currentChat) ? currentChat : []);
        if (chatList.length > 0) {
            if (!window.currentChatId && !currentChatId) {
                const newId = createChatId();
                window.currentChatId = newId;
                currentChatId = newId;
            }
            saveCurrentChat();
        }
    } catch (err) {
        console.error("Error backing up chat:", err);
    }

    // 2. Immediately reset UI & re-render history so previous chat is visibly backed up
    try {
        if (typeof renderHistory === "function") {
            renderHistory();
        }
        clearCurrentChatScreen();
        showWelcomeScreen();
    } catch (err) {
        console.error("Error resetting chat UI:", err);
    }

    // 3. Set active page across all persistence layers (session, local, and hash)
    try {
        sessionStorage.setItem("active_page", "chat");
        localStorage.setItem("active_page", "chat");
    } catch (e) {
        console.error("Storage error:", e);
    }

    // 4. Reload the page
    try {
        window.location.hash = "chat";
        window.location.reload();
    } catch (e) {
        console.error("Reload error:", e);
    }
}
window.refreshChat = refreshChat;


// =====================================================
// SAVE CURRENT CHAT
// =====================================================

function saveCurrentChat() {
    const chatList = Array.isArray(window.currentChat) ? window.currentChat : (Array.isArray(currentChat) ? currentChat : []);

    if (!chatList.length) {
        return;
    }

    if (!window.currentChatId && !currentChatId) {
        const newId = createChatId();
        window.currentChatId = newId;
        currentChatId = newId;
    }
    const chatId = window.currentChatId || currentChatId;

    const chats = getSavedChats();
    const existingIndex = chats.findIndex(chat => chat.id === chatId);

    // First user message = title
    const firstUserMessage = chatList.find(message => message.role === "user");

    let title = (firstUserMessage && firstUserMessage.text)
        ? firstUserMessage.text
        : (chatList[0] && chatList[0].text ? chatList[0].text : "New Chat");

    if (title.length > 45) {
        title = title.substring(0, 45) + "...";
    }

    const chatData = {
        id: chatId,
        title: title,
        messages: [...chatList],
        updatedAt: new Date().toISOString()
    };

    if (existingIndex !== -1) {
        chats[existingIndex] = chatData;
    } else {
        chats.unshift(chatData);
    }

    saveAllChats(chats);

    if (typeof renderHistory === "function") {
        renderHistory();
    }
}
window.saveCurrentChat = saveCurrentChat;


// =====================================================
// RENDER CHAT HISTORY
// =====================================================

function renderHistory(searchText = "") {

    const historyList =
        document.getElementById(
            "history-list"
        );

    if (!historyList) {
        return;
    }


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
            chats.filter(chat => {

                const title =
                    String(chat.title || "")
                        .toLowerCase();

                return title.includes(search);
            });
    }


    // Empty state

    if (!filteredChats.length) {

        const empty =
            document.createElement("div");

        empty.className =
            "history-empty";

        empty.textContent =
            chats.length
                ? "No chats found"
                : "No chat history yet";

        historyList.appendChild(empty);

        return;
    }


    // History items

    filteredChats.forEach(chat => {

        const item =
            document.createElement("div");

        item.className =
            "history-item";


        if (chat.id === currentChatId) {

            item.classList.add("active");
        }


        // Title

        const title =
            document.createElement("div");

        title.className =
            "history-title";

        title.textContent =
            chat.title || "New Chat";


        // Date

        const date =
            document.createElement("div");

        date.className =
            "history-date";

        date.textContent =
            formatHistoryDate(
                chat.updatedAt
            );


        // Delete button

        const deleteButton =
            document.createElement("button");

        deleteButton.className =
            "history-delete";

        deleteButton.innerHTML =
            `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>`;

        deleteButton.title =
            "Delete chat";


        deleteButton.onclick =
            function(event) {

                event.stopPropagation();

                deleteChat(chat.id);
            };


        item.appendChild(title);

        item.appendChild(date);

        item.appendChild(deleteButton);


        // Open chat

        item.onclick =
            function() {

                loadChat(chat.id);
            };


        historyList.appendChild(item);

    });
}


// =====================================================
// FORMAT HISTORY DATE
// =====================================================

function formatHistoryDate(dateString) {

    if (!dateString) {
        return "";
    }


    const date =
        new Date(dateString);


    if (Number.isNaN(date.getTime())) {
        return "";
    }


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
// SEARCH CHAT HISTORY
// =====================================================

function searchHistory() {

    const input =
        document.getElementById(
            "history-search"
        );

    if (!input) {
        return;
    }


    renderHistory(input.value);
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
        Array.isArray(selectedChat.messages)
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


    currentChat.forEach(message => {

        displayMessage(
            message.role,
            message.text
        );

    });


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


    saveAllChats(filteredChats);


    if (currentChatId === chatId) {

        clearCurrentChatScreen();

        currentChatId =
            createChatId();
    }


    renderHistory();
}


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


    // Disable and remove examples when asking any question
    hideChatWelcome();


    // Create chat ID

    if (!currentChatId) {

        currentChatId =
            createChatId();
    }


    // Display user message

    displayMessage(
        "user",
        message
    );


    // Save user message

    currentChat.push({

        role: "user",

        text: message

    });


    input.value = "";


    // Thinking message

    const thinking =
        document.createElement("div");

    thinking.className =
        "message bot-message";

    thinking.textContent =
        "Thinking...";


    chatBox.appendChild(thinking);


    chatBox.scrollTop =
        chatBox.scrollHeight;


    try {

        // Backend history

        const backendHistory =
            currentChat.map(item => ({

                role: item.role,

                content: item.text

            }));


        // API request

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


        // Error check

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


                if (errorData.detail) {

                    errorMessage =
                        typeof errorData.detail === "string"
                            ? errorData.detail
                            : JSON.stringify(
                                errorData.detail
                            );
                }

            } catch (error) {

                console.log(
                    "Could not read error response."
                );
            }


            throw new Error(errorMessage);
        }


        // Streaming check

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


        // Stream loop

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


            for (const line of lines) {

                if (!line.trim()) {
                    continue;
                }


                try {

                    const data =
                        JSON.parse(line);


                    if (data.response) {

                        if (firstChunk) {

                            thinking.textContent = "";

                            firstChunk = false;
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


        // Process final buffer

        if (buffer && buffer.trim()) {

            try {

                const data =
                    JSON.parse(buffer);


                if (data.response) {

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


        // No answer

        if (!fullReply.trim()) {

            thinking.textContent =
                "Alpha ne koi answer return nahi kiya.";

            return;
        }


        // Save AI response

        currentChat.push({

            role: "assistant",

            text: fullReply

        });


        // Save history

        saveCurrentChat();


        // Dashboard update

        if (
            typeof updateDashboardStats ===
            "function"
        ) {
            updateDashboardStats();
        }


    } catch (error) {

        console.error(
            "Chat error:",
            error
        );


        thinking.innerHTML =
            `❌ Alpha se connection nahi ho pa raha.<br><br>
             <small>${escapeHTML(error.message)}</small>`;
    }


    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    return String(text || "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
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


    menu.classList.toggle("show");
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


    menu.classList.remove("show");
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


    try {

        recognition.start();

    } catch (error) {

        console.error(
            "Voice start error:",
            error
        );
    }
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
// CLOSE PLUS MENU - OUTSIDE CLICK
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


        if (!container || !menu) {
            return;
        }


        if (
            !container.contains(
                event.target
            )
        ) {

            menu.classList.remove("show");
        }

    }
);



function useChatSuggestion(text) {
    const messageInput = document.getElementById("message");

    if (!messageInput) return;

    messageInput.value = text;

    messageInput.focus();

    messageInput.style.height = "auto";
    messageInput.style.height =
        Math.min(messageInput.scrollHeight, 140) + "px";
}

// Global window attachments
window.useChatSuggestion = useChatSuggestion;
window.hideChatWelcome = hideChatWelcome;
window.showWelcomeScreen = showWelcomeScreen;
window.sendMessage = sendMessage;
window.startNewChat = startNewChat;
window.refreshChat = refreshChat;
window.saveCurrentChat = saveCurrentChat;
window.loadChat = loadChat;
window.deleteChat = deleteChat;
window.searchHistory = searchHistory;

// Explicit event binding for safety across all browsers
document.addEventListener("DOMContentLoaded", function () {
    const refreshBtn = document.querySelector(".chat-refresh-btn");
    if (refreshBtn) {
        refreshBtn.onclick = function (e) {
            e.preventDefault();
            refreshChat();
        };
    }
});

