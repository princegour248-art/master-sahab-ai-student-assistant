# Alpha - Frontend Modular Architecture Guide 🚀

Aapka pura frontend project ab clean aur modular folders me divide kar diya gaya hai, taaki VS Code me samajhna aur edit karna bilkul simple aur easy ho jaye.

---

## 📁 Folder Structure Overview

```text
frontend/
├── index.html                    <-- Main web entry point (links all modular CSS & JS)
├── style.css                     <-- Modular CSS entry point (@import all section styles)
├── script.js                     <-- Modular script fallback loader
│
├── 📂 sections/                  <-- 🌐 Har section ka alag-alag HTML Component
│   ├── sidebar.html              # Responsive collapsible sidebar navigation
│   ├── dashboard.html            # Welcome, stats, quick subjects, today's goals
│   ├── chat.html                 # Alpha AI Chat interface, history & composer
│   ├── subjects.html             # Subjects grid, add subject toolbar
│   ├── assignments.html          # Homework & assignment tracking system
│   ├── goals.html                # Daily study targets, milestone meter & checklist
│   ├── progress.html             # Learning analytics & visual bar graph
│   └── modals.html               # Add subject modal, assignment modal, popups
│
├── 📂 css/                       <-- 🎨 Har section ka alag-alag Styling file
│   ├── main.css                  # Theme variables, typography, buttons, animations
│   ├── layout.css                # Responsive sidebar, main layout & mobile media queries
│   ├── dashboard.css             # Dashboard widgets, stats cards, motivation banner
│   ├── chat.css                  # AI chat bubbles, streaming cursor, composer toolbar
│   ├── subjects.css              # Subject cards, subject details hub popup
│   ├── assignments.css           # Homework cards, due-date badges, filters
│   ├── goals.css                 # Daily goals meter, priority pills, interactive checklist
│   ├── progress.css              # Curriculum mastery KPIs, visual bar chart, badges
│   └── modals.css                # Modal overlay, academic SVG icon picker, form styling
│
└── 📂 js/                        <-- ⚙️ Har section ka alag-alag Logic file
    ├── config.js                 # API URL, Supabase/LocalStorage helpers, SVG icons
    ├── navigation.js             # showPage() and active sidebar tab switching
    ├── dashboard.js              # Dashboard date, stats, motivations, activity feed
    ├── chat.js                   # Alpha AI streaming response, chat history, voice/photo
    ├── subjects.js               # Subjects CRUD, syllabus & topic checklist, study hub
    ├── assignments.js            # Homework & assignment CRUD, status toggling, date badges
    ├── goals.js                  # Daily study goals, priority filters, progress meter
    ├── progress.js               # Progress metrics, interactive bar graph, ranks & badges
    ├── modals.js                 # Modal backdrop click, ESC close listener, theme engine
    └── app.js                    # Master DOMContentLoaded bootstrapper
```

---

## 💡 How to Edit in VS Code:
1. **AI Chat me changes karne ho?**
   - HTML: `frontend/sections/chat.html`
   - Styles: `frontend/css/chat.css`
   - Logic: `frontend/js/chat.js`

2. **Progress & Bar Graph me changes karne ho?**
   - HTML: `frontend/sections/progress.html`
   - Styles: `frontend/css/progress.css`
   - Logic: `frontend/js/progress.js`

3. **Daily Goals me changes karne ho?**
   - HTML: `frontend/sections/goals.html`
   - Styles: `frontend/css/goals.css`
   - Logic: `frontend/js/goals.js`

4. **Homework & Assignments me changes karne ho?**
   - HTML: `frontend/sections/assignments.html`
   - Styles: `frontend/css/assignments.css`
   - Logic: `frontend/js/assignments.js`

5. **Subjects me changes karne ho?**
   - HTML: `frontend/sections/subjects.html`
   - Styles: `frontend/css/subjects.css`
   - Logic: `frontend/js/subjects.js`

6. **Sidebar Navigation me changes karne ho?**
   - HTML: `frontend/sections/sidebar.html`
   - Styles: `frontend/css/layout.css`
   - Logic: `frontend/js/navigation.js`

---

## ⚡ Automatic Sync & Build:
Agar aap `frontend/sections/*.html` me koi bhi naya HTML edit karte hain:
- Ek baar update karne ke liye:
  ```bash
  node frontend/build.js
  ```
- Ya fir auto-watch chalane ke liye (jab bhi aap file save karenge, index.html khud update ho jayega):
  ```bash
  node frontend/build.js --watch
  ```
- Direct CSS ya JS edit karne par build karne ki zaroorat nahi hai, browser refresh karte hi direct reflect ho jata hai!

