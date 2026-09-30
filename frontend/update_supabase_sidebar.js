const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "script.js");

let code = fs.readFileSync(filePath, "utf8");

// =====================================================
// LOAD SUPABASE HISTORY + SYNC WITH EXISTING SIDEBAR
// =====================================================

const startMarker =
`async function loadChatHistoryFromSupabase() {`;

const endMarker =
`// =====================================================
// GET ALL SAVED CHATS`;

const startIndex = code.indexOf(startMarker);
const endIndex = code.indexOf(endMarker);

if (startIndex === -1 || endIndex === -1) {
    console.log("ERROR: Could not find history function.");
    process.exit(1);
}

const newHistoryFunction = `async function loadChatHistoryFromSupabase() {

    try {

        const response = await fetch(
            \`\${API_BASE_URL}/chat/history/\${MASTER_SAHAB_USER_ID}\`
        );

        if (!response.ok) {
            throw new Error(
                \`History request failed: \${response.status}\`
            );
        }

        const data = await response.json();

        if (!data.success) {
            console.error(
                "History loading failed:",
                data.error
            );
            return [];
        }

        const supabaseHistory =
            data.history || [];

        console.log(
            "Chat history loaded from Supabase:",
            supabaseHistory
        );

        // =============================================
        // Convert Supabase rows into existing
        // Master Sahab local chat format
        // =============================================

        const existingChats =
            getSavedChats();

        const supabaseChats =
            supabaseHistory.map(item => {

                const title =
                    item.message &&
                    item.message.trim()
                        ? item.message
                            .trim()
                            .substring(0, 40)
                        : "New Chat";

                return {

                    id:
                        "supabase-" +
                        item.id,

                    title:

                        title.length >= 40
                            ? title + "..."
                            : title,

                    createdAt:
                        item.created_at ||
                        new Date().toISOString(),

                    updatedAt:
                        item.created_at ||
                        new Date().toISOString(),

                    messages: [

                        {
                            role: "user",
                            text: item.message || ""
                        },

                        {
                            role: "assistant",
                            text: item.response || ""
                        }

                    ]

                };

            });

        // =============================================
        // Merge Supabase history with existing
        // local chats.
        // =============================================

        const localOnlyChats =
            existingChats.filter(chat => {

                return !String(chat.id)
                    .startsWith("supabase-");

            });

        const mergedChats = [
            ...supabaseChats,
            ...localOnlyChats
        ];

        saveAllChats(mergedChats);

        console.log(
            "Supabase history synced with sidebar:",
            mergedChats
        );

        // Refresh existing sidebar
        renderHistory();

        return supabaseHistory;

    } catch (error) {

        console.error(
            "Could not load chat history:",
            error
        );

        return [];

    }

}

`;

code =
    code.substring(0, startIndex) +
    newHistoryFunction +
    code.substring(endIndex);

// =====================================================
// WHEN CHAT PAGE OPENS, LOAD SUPABASE HISTORY FIRST
// =====================================================

const oldPageCode =
`if (pageId === "chat") {
        renderHistory();
    }`;

const newPageCode =
`if (pageId === "chat") {
        loadChatHistoryFromSupabase();
    }`;

if (code.includes(oldPageCode)) {

    code =
        code.replace(
            oldPageCode,
            newPageCode
        );

    console.log(
        "Chat page now loads history from Supabase."
    );

} else {

    console.log(
        "WARNING: Chat page block not found."
    );
}

// =====================================================
// SAVE
// =====================================================

fs.writeFileSync(
    filePath,
    code,
    "utf8"
);

console.log("");
console.log("======================================");
console.log("Supabase sidebar integration complete!");
console.log("======================================");
console.log("");
console.log("Updated:");
console.log(filePath);