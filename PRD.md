# 📋 Product Requirements Document (PRD) — Alpha AI

---

## 1. 📌 Project Ka Parichay Aur Overview (Executive Summary)

**Alpha AI** ek smart, personalized aur privacy-focused AI study assistant platform hai jo vishesh roop se students ki academic zarooraton ko dhyan me rakh kar banaya gaya hai. Yeh platform student ke apne personal computer par bina kisi cloud subscription ya token fee ke **100% Free aur Local AI** run karta hai. 

Is project ka sabse bada uddeshya yeh hai ki har ek student ko ek aisa personal tutor mile jo uski apni bolchaal ki bhasha me concept samjhaye, uske daily academic schedule ko manage kare, aur uski study progress ko monitor karke use behtar banaye.

---

## 2. 🎯 Problem Statement (Aam Students Ki Badi Pareshaniyan)

Aamtaur par padhai ke dauran students ko in 3 mukhya samasyaon ka samna karna padta hai:

1. **Bhasha Ki Rukawat (Language Barrier)**:
   Aaj ke samay me ChatGPT ya Claude jaise bade AI tools uplabdh toh hain, lekin unka jawab bohot hi formal aur kitabi English me hota hai. Indian students aapas me baat karte samay ya concept samajhte samay Hinglish (Hindi + English mix) ya saral Hindi ka use karte hain. Formal English ki wajah se student ka bohot sara samay sirf shabdon ke matlab samajhne me barbaad ho jata hai.

2. **Bikhra Hua Study System (Fragmented Applications)**:
   Student ko doubt poochne ke liye alag website kholni padti hai, homework aur assignments note karne ke liye diary ya alag note-taking app use karni padti hai, syllabus track karne ke liye printout dekhna padta hai, aur revision ke liye alag quiz websites par jana padta hai. Is bikhre huye system ki wajah se student ka focus toot jata hai.

3. **Mehnge Cloud AI Subscription Aur Privacy Ka Darr**:
   Badi AI companies ke premium plan har mahine hazaaron rupaye ke aate hain, jise aam students afford nahi kar sakte. Sath hi, cloud AI par student ka sara personal study data third-party servers par chala jata hai jahan privacy ka risk bana rehta hai.

---

## 3. 💡 Solution (Alpha AI Inhe Kaise Solve Karta Hai?)

Alpha AI in sabhi samasyaon ka ek single, integrated aur local solution deta hai:

* **Multilingual AI Tutor**: Isme ek in-built language detection engine laga hai jo student ke poochte hi pehchaan leta hai ki sawaal Hindi me hai, Hinglish me hai ya English me, aur usi bhasha me saral udaharano aur step-by-step points ke sath samjhata hai.
* **All-in-One Modular Dashboard**: Ek hi screen par AI chat doubt solver, homework manager, syllabus topic checklists, daily study hours goal meter, aur instant quiz generator integrate kiya gaya hai.
* **100% Local Aur Free Inference**: Meta ka open-source Llama 3.2 model Ollama ke zariye student ke laptop par offline chalta hai. Isse na toh internet ki binding rehti hai aur na hi koi per-message charge lagta hai.

---

## 4. 🗺️ Student User Journey (Student Is App Ko Kaise Use Karta Hai?)

1. **Home Screen Par Aana**: Student jab app open karta hai toh use Dashboard par aaj ki tareekh, ek motivational quote, quick stats, aur pending homework dikhte hain.
2. **AI Tutor Se Doubt Poochna**: Student chat section me jakar kisi bhi topic par sawaal type karta hai (jaise: *"Bhai Newton ka third law simple me samjha do"*). AI turant aasan bhasha me live typing ke sath concept explain karta hai.
3. **Instant Quiz Se Practice Karna**: Concept samajhne ke baad student usi subject par click karke 5 multiple-choice questions (MCQs) ka instant quiz generate karta hai aur apni samajh test karta hai.
4. **Homework Aur Syllabus Track Karna**: School ya college se mile naye homework ko assignments list me add karta hai aur jo topic complete ho gaya use syllabus checklist me tick mark kar deta hai.
5. **Progress Analytics Dekhna**: Progress section me jakar visual bar graph ke jariye check karta hai ki uska kaunsa subject strong hai aur kis subject me revision ki zaroorat hai.

---

## 5. 🛠️ Technology Stack Aur Resources Ka Rationale

Is project me use huye sabhi tools aur unke chune jane ke thos kaaran:

### 5.1. Artificial Intelligence (AI & LLM Layer)
* **Ollama**: Local AI runner hai jo bina kisi cloud API ke open-source models ko laptop par execute karta hai. Iski wajah se credit card billing ka jhanjhat khatam ho gaya.
* **Meta Llama 3.2 (1B Parameter)**: Meta ka ultra-lightweight reasoning model hai. Yeh sirf 1.3 GB RAM consume karta hai aur 8GB RAM wale standard student laptop par bina graphics card (GPU) ke bhi super-fast chalta hai.
* **Regex Language Classifier**: Ek smart algorithm jo text me Devanagari Hindi characters aur daily bolchaal ke Hinglish words ko scan karke AI ko sahi bhasha me bolne ka signal deta hai.

### 5.2. Backend Infrastructure Layer
* **Python 3.10+**: AI pipelines aur data handling ke liye sabse reliable language.
* **FastAPI**: Modern asynchronous web framework jo Python me microsecond speed aur real-time streaming provide karta hai.
* **Uvicorn**: High-performance ASGI server jo client requests ko process karta hai.
* **Pydantic**: Request payloads aur data validation ko strictly enforce karta hai taaki server kabhi invalid data se crash na ho.
* **StreamingResponse**: FastAPI ka response handler jo AI ke ek-ek shabd (token) ko live screen par NDJSON format me stream karta hai.

### 5.3. Database Aur Persistence Layer
* **Supabase (Cloud PostgreSQL)**: Student ki chat history ko secure cloud me save karne ke liye use hota hai taaki device band hone par bhi purana conversation gayab na ho.
* **Browser LocalStorage**: Client-side offline cache hai jisse student ka time-table, homework aur goals internet band hone par bhi bina kisi delay ke 0 millisecond me open ho jate hain.

### 5.4. Frontend Engineering
* **Vanilla HTML5 & CSS3**: Pure zero-dependency layout jo instant load hota hai aur React jaise heavy node_modules ke bloat se bachta hai.
* **Modular ES6 JavaScript**: Har feature ka alag controller code likha gaya hai jisse maintenance simple rehti hai.
* **Node.js (`build.js`)**: Custom build tool jo sections ko jodkar ek unified `index.html` create karta hai.

---

## 6. 🚀 Mukhya Features Ka Detail Breakdown

1. **Alpha AI Chat Tutor**:
   Live typewriter streaming ke sath academic doubt solve karta hai. Isme multi-turn history memory hai jisse AI pehle poochhe gaye sawaalon ke context ko yaad rakhta hai.
2. **Instant AI Quiz Generator (`POST /quiz/generate`)**:
   Subject aur topic select karte hi AI 5 conceptual MCQs generate karta hai. Har question ke sath 4 options, sahi answer ka index aur detailed explanation milti hai.
3. **Automated Study Planner (`POST /goals/plan`)**:
   Exam ki aane wali date aur pending syllabus ke hisab se daily study hours, small rest breaks aur revision blocks ka practical time-table bana kar deta hai.
4. **Academic Progress Audit (`POST /progress/audit`)**:
   Student ke completed homework aur topic ticks ko inspect karke calculate karta hai ki student ka subject mastery percentage kitna hai aur agla step kya hona chahiye.
5. **Task & Homework Manager**:
   Due dates, urgency badges (Pending / Done), aur subject filters ke sath school/college assignments ko track karta hai.

---

## 7. 🗄️ Database Tables Ka Structure (Supabase)

### Table: `chat_history`
* `id` (BigInt, Primary Key): Har message ka unique serial number.
* `user_id` (UUID): Har student ka secret session identifier taaki do alag students ki chat mix na ho.
* `message` (Text): Student dwara type kiya gaya sawaal.
* `response` (Text): AI dwara diya gaya poora jawab.
* `created_at` (Timestamp): Message create hone ki exact date aur time.

---

## 8. ⚙️ Project Ko Run Karne Ka Step-by-Step Tarika

1. **Ollama Start Karein**:
   Terminal me command chalayein: `ollama run llama3.2:1b`.
2. **Backend Server Start Karein**:
   Backend folder me jakar environment activate karein aur server run karein:
   ```bash
   cd backend
   venv\Scripts\activate
   uvicorn main:app --reload --port 8000
   ```
3. **Frontend Open Karein**:
   Frontend folder me jakar `index.html` ko browser me Live Server ya direct double click karke run karein.
