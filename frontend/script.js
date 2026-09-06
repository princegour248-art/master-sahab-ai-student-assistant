// =====================================================
// MASTER SAHAB - MAIN JAVASCRIPT
// Dashboard + AI Chat + Voice + Photo + Document
// =====================================================


// =====================================================
// PAGE NAVIGATION
// =====================================================

function showPage(pageName, clickedButton = null) {

    // Hide all pages
    document.querySelectorAll(".page").forEach(page => {
        page.classList.remove("active-page");
    });

    // Show selected page
    const selectedPage = document.getElementById(pageName + "-page");

    if (selectedPage) {
        selectedPage.classList.add("active-page");
    }

    // Remove active state from all navigation buttons
    document.querySelectorAll(".nav-item").forEach(button => {
        button.classList.remove("active");
    });

    // Add active state
    if (clickedButton) {
        clickedButton.classList.add("active");
    } else {

        // Find matching navigation button
        document.querySelectorAll(".nav-item").forEach(button => {

            const onclickText = button.getAttribute("onclick") || "";

            if (onclickText.includes(`showPage('${pageName}'`)) {
                button.classList.add("active");
            }
        });
    }

    // Close plus menu if open
    closePlusMenu();
}


// =====================================================
// DATE
// =====================================================

function loadTodayDate() {

    const dateElement = document.getElementById("today-date");

    if (!dateElement) return;

    const today = new Date();

    const options = {
        weekday: "long",
        day: "numeric",
        month: "short",
        year: "numeric"
    };

    dateElement.textContent =
        today.toLocaleDateString("en-IN", options);
}

loadTodayDate();


// =====================================================
// CHAT STORAGE
// =====================================================

let chatHistory = [];

try {
    chatHistory = JSON.parse(
        localStorage.getItem("masterSahabChat")
    ) || [];
} catch (error) {
    chatHistory = [];
}


// =====================================================
// CHAT ELEMENTS
// =====================================================

const chatBox = document.getElementById("chat-box");
const messageInput = document.getElementById("message");
const sendButton = document.getElementById("send-btn");


// =====================================================
// ESCAPE HTML
// =====================================================

function escapeHTML(text) {

    return String(text)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}


// =====================================================
// FORMAT AI ANSWER
// =====================================================

function formatAnswer(text) {

    let formatted = escapeHTML(text);

    // Code blocks
    formatted = formatted.replace(
        /```([\s\S]*?)```/g,
        "<pre><code>$1</code></pre>"
    );

    // Bold
    formatted = formatted.replace(
        /\*\*(.*?)\*\*/g,
        "<strong>$1</strong>"
    );

    // Headings
    formatted = formatted.replace(
        /^### (.*)$/gm,
        "<h4>$1</h4>"
    );

    formatted = formatted.replace(
        /^## (.*)$/gm,
        "<h3>$1</h3>"
    );

    formatted = formatted.replace(
        /^# (.*)$/gm,
        "<h2>$1</h2>"
    );

    // New lines
    formatted = formatted.replace(/\n/g, "<br>");

    return formatted;
}


// =====================================================
// ADD MESSAGE TO CHAT
// =====================================================

function addMessage(text, sender) {

    if (!chatBox) return;

    const messageDiv = document.createElement("div");

    messageDiv.classList.add("message");

    if (sender === "user") {
        messageDiv.classList.add("user-message");
    } else {
        messageDiv.classList.add("bot-message");
    }

    messageDiv.innerHTML =
        sender === "user"
            ? escapeHTML(text)
            : formatAnswer(text);

    chatBox.appendChild(messageDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}


// =====================================================
// THINKING ANIMATION
// =====================================================

function showThinking() {

    if (!chatBox) return;

    const thinkingDiv = document.createElement("div");

    thinkingDiv.id = "thinking";
    thinkingDiv.className = "message bot-message";

    thinkingDiv.innerHTML = `
        <span>Master Sahab is thinking</span>
        <span class="thinking-dots">...</span>
    `;

    chatBox.appendChild(thinkingDiv);

    chatBox.scrollTop = chatBox.scrollHeight;
}


function removeThinking() {

    const thinking = document.getElementById("thinking");

    if (thinking) {
        thinking.remove();
    }
}


// =====================================================
// SEND MESSAGE
// =====================================================

async function sendMessage() {

    if (!messageInput || !chatBox) return;

    const message = messageInput.value.trim();

    if (!message) return;

    // Add user message
    addMessage(message, "user");

    // Clear input
    messageInput.value = "";

    // Save user message
    chatHistory.push({
        role: "user",
        content: message
    });

    localStorage.setItem(
        "masterSahabChat",
        JSON.stringify(chatHistory)
    );

    // Thinking
    showThinking();

    try {

        const response = await fetch(
            "http://127.0.0.1:8000/chat",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: message,
                    history: chatHistory.slice(-12)
                })
            }
        );

        if (!response.ok) {
            throw new Error(
                "Server error: " + response.status
            );
        }

        removeThinking();

        // Create AI message container
        const botMessage = document.createElement("div");

        botMessage.className =
            "message bot-message";

        chatBox.appendChild(botMessage);

        // Streaming response
        const reader =
            response.body.getReader();

        const decoder =
            new TextDecoder();

        let buffer = "";
        let fullReply = "";

        while (true) {

            const { value, done } =
                await reader.read();

            if (done) break;

            buffer += decoder.decode(
                value,
                { stream: true }
            );

            const lines =
                buffer.split("\n");

            buffer = lines.pop();

            for (const line of lines) {

                if (!line.trim()) continue;

                try {

                    const data =
                        JSON.parse(line);

                    if (data.response) {

                        fullReply += data.response;

                        botMessage.innerHTML =
                            formatAnswer(fullReply);

                        chatBox.scrollTop =
                            chatBox.scrollHeight;
                    }

                } catch (error) {
                    console.log(
                        "Streaming parse error:",
                        error
                    );
                }
            }
        }

        // Process remaining buffer
        if (buffer.trim()) {

            try {

                const data =
                    JSON.parse(buffer);

                if (data.response) {

                    fullReply += data.response;

                    botMessage.innerHTML =
                        formatAnswer(fullReply);
                }

            } catch (error) {
                console.log(
                    "Final parse error:",
                    error
                );
            }
        }

        // Save AI response
        if (fullReply.trim()) {

            chatHistory.push({
                role: "assistant",
                content: fullReply
            });

            localStorage.setItem(
                "masterSahabChat",
                JSON.stringify(chatHistory)
            );
        }

    } catch (error) {

        removeThinking();

        console.error(error);

        addMessage(
            "Sorry, Master Sahab server se connection nahi ho pa raha. Check karo ki backend/Uvicorn aur Ollama dono running hain.",
            "bot"
        );
    }
}


// =====================================================
// ENTER KEY
// =====================================================

if (messageInput) {

    messageInput.addEventListener(
        "keydown",
        function(event) {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendMessage();
            }
        }
    );
}


// =====================================================
// CLEAR CHAT
// =====================================================

function clearChat() {

    if (!chatBox) return;

    const confirmClear =
        confirm("Are you sure you want to clear the chat?");

    if (!confirmClear) return;

    chatHistory = [];

    localStorage.removeItem(
        "masterSahabChat"
    );

    chatBox.innerHTML = "";

    addMessage(
        "Hello! 👋 Main Master Sahab hoon. Aaj kya padhna hai?",
        "bot"
    );
}


// =====================================================
// LOAD CHAT
// =====================================================

function loadChat() {

    if (!chatBox) return;

    chatBox.innerHTML = "";

    if (chatHistory.length === 0) {

        addMessage(
            "Hello! 👋 Main Master Sahab hoon. Aaj kya padhna hai?",
            "bot"
        );

        return;
    }

    chatHistory.forEach(message => {

        if (message.role === "user") {

            addMessage(
                message.content,
                "user"
            );

        } else if (
            message.role === "assistant"
        ) {

            addMessage(
                message.content,
                "bot"
            );
        }
    });
}

loadChat();


// =====================================================
// PLUS MENU
// =====================================================

function togglePlusMenu() {

    const menu =
        document.getElementById("plus-menu");

    if (!menu) return;

    menu.classList.toggle("show");
}


function closePlusMenu() {

    const menu =
        document.getElementById("plus-menu");

    if (!menu) return;

    menu.classList.remove("show");
}


// Prevent menu click from closing itself
const plusMenu =
    document.getElementById("plus-menu");

if (plusMenu) {

    plusMenu.addEventListener(
        "click",
        function(event) {
            event.stopPropagation();
        }
    );
}


// Close menu when clicking outside
document.addEventListener(
    "click",
    function(event) {

        const container =
            document.querySelector(
                ".plus-menu-container"
            );

        if (
            container &&
            !container.contains(event.target)
        ) {
            closePlusMenu();
        }
    }
);


// =====================================================
// VOICE INPUT
// =====================================================

let recognition = null;

function startVoiceInput() {

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    if (!SpeechRecognition) {

        alert(
            "Voice input is not supported in this browser. Chrome use karo."
        );

        return;
    }

    recognition =
        new SpeechRecognition();

    recognition.lang = "en-IN";

    recognition.continuous = false;

    recognition.interimResults = true;

    recognition.onstart = function() {

        if (messageInput) {
            messageInput.placeholder =
                "Listening...";
        }
    };

    recognition.onresult =
        function(event) {

            let transcript = "";

            for (
                let i = event.resultIndex;
                i < event.results.length;
                i++
            ) {

                transcript +=
                    event.results[i][0].transcript;
            }

            if (messageInput) {
                messageInput.value =
                    transcript;
            }
        };

    recognition.onerror =
        function(event) {

            console.error(
                "Voice error:",
                event.error
            );

            if (messageInput) {
                messageInput.placeholder =
                    "Ask Master Sahab anything...";
            }
        };

    recognition.onend = function() {

        if (messageInput) {
            messageInput.placeholder =
                "Ask Master Sahab anything...";
        }
    };

    recognition.start();
}


// =====================================================
// PHOTO INPUT
// =====================================================

const photoInput =
    document.getElementById("photo-input");

if (photoInput) {

    photoInput.addEventListener(
        "change",
        function(event) {

            const file =
                event.target.files[0];

            if (!file) return;

            if (!file.type.startsWith("image/")) {

                alert(
                    "Please select a valid image."
                );

                return;
            }

            showSelectedFile(
                file,
                "📷"
            );

            // Reset input
            photoInput.value = "";
        }
    );
}


// =====================================================
// DOCUMENT INPUT
// =====================================================

const documentInput =
    document.getElementById(
        "document-input"
    );

if (documentInput) {

    documentInput.addEventListener(
        "change",
        function(event) {

            const file =
                event.target.files[0];

            if (!file) return;

            const allowedExtensions = [
                ".pdf",
                ".doc",
                ".docx",
                ".txt"
            ];

            const fileName =
                file.name.toLowerCase();

            const valid =
                allowedExtensions.some(
                    extension =>
                        fileName.endsWith(extension)
                );

            if (!valid) {

                alert(
                    "Please select PDF, DOC, DOCX or TXT file."
                );

                return;
            }

            showSelectedFile(
                file,
                "📄"
            );

            // Reset input
            documentInput.value = "";
        }
    );
}


// =====================================================
// SHOW SELECTED FILE
// =====================================================

function showSelectedFile(
    file,
    icon
) {

    if (!chatBox) return;

    const messageDiv =
        document.createElement("div");

    messageDiv.className =
        "message user-message";

    messageDiv.innerHTML = `
        ${icon} <strong>${escapeHTML(file.name)}</strong>
        <br>
        <small>File selected</small>
    `;

    chatBox.appendChild(
        messageDiv
    );

    chatBox.scrollTop =
        chatBox.scrollHeight;
}


// =====================================================
// DASHBOARD QUICK ACTIONS
// =====================================================

function openAIChat() {

    showPage("chat");

    if (messageInput) {
        setTimeout(() => {
            messageInput.focus();
        }, 100);
    }
}


// =====================================================
// INITIALIZATION
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        loadTodayDate();

        // Dashboard is default page
        showPage("dashboard");

    }
);