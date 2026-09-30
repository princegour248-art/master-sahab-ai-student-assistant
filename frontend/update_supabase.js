const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "script.js");
const backupPath = path.join(__dirname, "script.js.supabase-backup.js");

let code = fs.readFileSync(filePath, "utf8");

// =====================================================
// 1. BACKUP
// =====================================================

if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log("Backup created:");
    console.log(backupPath);
} else {
    console.log("Backup already exists. Keeping existing backup.");
}

// =====================================================
// 2. ADD MASTER SAHAB USER ID
// =====================================================

const userIdMarker = "MASTER_SAHAB_USER_ID";

if (!code.includes(userIdMarker)) {

    const userIdCode = `

// =====================================================
// MASTER SAHAB USER ID
// =====================================================

let MASTER_SAHAB_USER_ID =
    localStorage.getItem("master_sahab_user_id");

if (!MASTER_SAHAB_USER_ID) {
    MASTER_SAHAB_USER_ID = crypto.randomUUID();

    localStorage.setItem(
        "master_sahab_user_id",
        MASTER_SAHAB_USER_ID
    );
}

console.log(
    "Master Sahab User ID:",
    MASTER_SAHAB_USER_ID
);

`;

    code = userIdCode + code;

    console.log("MASTER_SAHAB_USER_ID added.");
} else {
    console.log("MASTER_SAHAB_USER_ID already exists.");
}

// =====================================================
// 3. ADD USER ID TO /chat REQUEST
// =====================================================

// Exact common pattern
const oldPattern1 = `body: JSON.stringify({

                message: message,

                history:
                    backendHistory

            })`;

const newPattern1 = `body: JSON.stringify({

                message: message,

                user_id:
                    MASTER_SAHAB_USER_ID,

                history:
                    backendHistory

            })`;

if (code.includes(oldPattern1)) {

    code = code.replace(oldPattern1, newPattern1);

    console.log("user_id added to /chat request.");

} else {

    // Alternative formatting
    const oldPattern2 = `body: JSON.stringify({
                message: message,
                history: backendHistory
            })`;

    const newPattern2 = `body: JSON.stringify({
                message: message,
                user_id: MASTER_SAHAB_USER_ID,
                history: backendHistory
            })`;

    if (code.includes(oldPattern2)) {

        code = code.replace(oldPattern2, newPattern2);

        console.log("user_id added to /chat request.");

    } else {

        console.log(
            "WARNING: Could not find the expected /chat request block."
        );

        console.log(
            "No request block was changed."
        );
    }
}

// =====================================================
// 4. SAVE FILE
// =====================================================

fs.writeFileSync(filePath, code, "utf8");

console.log("");
console.log("======================================");
console.log("Master Sahab Supabase update complete!");
console.log("======================================");
console.log("");
console.log("Updated file:");
console.log(filePath);
console.log("");
console.log("Backup:");
console.log(backupPath);