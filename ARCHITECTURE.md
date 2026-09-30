# 🏛️ System Architecture & Technical Design — Alpha AI

---

## 1. 📌 4-Tier Decoupled Architecture Ka Overview

Alpha AI ko ek **4-Tier Decoupled Architecture** ke siddhant par design kiya gaya hai. Iska matlab yeh hai ki Frontend, Backend API, AI Engine aur Database chaaron hisse aapas me azaad (independent) hain. Agar kisi ek hisse me badlaav ya update kiya jaye, toh doosre hisse par koi negative asar nahi padta:

1. **Presentation Layer (Frontend)**:
   Yeh student ke web browser me run hota hai. Isme zero external framework dependencies ke sath native HTML5, CSS3 aur modular JavaScript use ki gayi hai. Sath hi, browser ka LocalStorage use hota hai jo offline mode me instant speed provide karta hai.

2. **Application Layer (FastAPI Backend Server)**:
   Yeh backend Python server hai jo port `8000` par chal raha hai. Yeh client se aane wali sabhi requests ko receive karta hai, input data ko validate karta hai, student ki bhasha pehchanta hai, aur AI ke sath real-time streaming coordinate karta hai.

3. **Inference Layer (Local AI Ollama Engine)**:
   Yeh machine ke local port `11434` par chalne wala self-hosted AI engine hai. Yeh Meta ke **Llama 3.2 (1B)** model ko execute karta hai aur tokens generate karke backend ko lautaata hai.

4. **Persistence Layer (Hybrid Storage System)**:
   Yeh do hisson me kaam karta hai. Cloud ke upar **Supabase (PostgreSQL)** student ki chat history aur persistent logs ko save karta hai, jabki client browser ke andar **LocalStorage** immediate speed aur offline caching sambhalta hai.

---

## 2. 🔄 End-to-End Data Flow Aur Real-Time Token Streaming

Jab bhi koi student chat box me sawaal type karke `Send` button dabata hai, toh system ke andar nimnlikhit steps me live communication hota hai:

* **Step 1 - Client Se Request Bhejna**:
  Frontend ka JavaScript controller (`chat.js`) student ke message ko capture karta hai, screen par turant student ka message bubble render karta hai, aur backend ke endpoint `POST /chat` par JSON payload bhejta hai jisme message, past chat history aur student ka unique UUID shamil hota hai.

* **Step 2 - Language Detection Aur Prompt Assembly**:
  FastAPI server par request aate hi regex engine check karta hai ki message Hindi me hai, Hinglish me hai ya English me. Is bhasha ke hisab se ek pedagogical system tutor prompt banaya jata hai jo AI ko concise, friendly aur points me bolne ki hidayat deta hai. Is prompt ke sath purani history jod kar ek complete conversation array taiyar kiya jata hai.

* **Step 3 - Local Ollama Service Ko Stream Request**:
  FastAPI backend local machine par chal rahe Ollama server (`http://127.0.0.1:11434/api/generate`) ko HTTP POST request bhejta hai jisme `stream: true` set rehta hai.

* **Step 4 - Live Token Streaming (Typewriter Effect)**:
  Ollama jaise-jaise ek-ek shabd (token) generate karta hai, FastAPI ka `StreamingResponse` use receive karke turant browser ko NDJSON (Newline Delimited JSON) line ke roop me aage forward karta hai. Frontend par `chat.js` ka stream reader in tokens ko continuously message bubble me append karta rehta hai aur ek blue blinking cursor dikhata hai. Isse screen freeze nahi hoti aur ChatGPT jaisa real-time typing effect milta hai.

* **Step 5 - Non-Blocking Background Save**:
  Jab stream khatam ho jaati hai, tab FastAPI backend background me asynchronously poore conversation ko Supabase ki `chat_history` table me insert kar deta hai. Agar Supabase disconnect bhi ho, tab bhi student ka chat session smoothly complete hota hai.

---

## 3. 🧠 Smart Language Detection Ka Technical Logic

AI student ki bhasha kaise pehchanta hai, iska logic `backend/main.py` ke `detect_language()` function me implemented hai:

* **Pehla Check (Hindi Devanagari Scan)**:
  Sabse pehle regex pattern `[\u0900-\u097F]` se text scan hota hai. Agar text me koi bhi Devanagari Hindi character milta hai, toh mode ko turant **Hindi** mark kar diya jata hai aur AI ko Devanagari script me saral Hindi me bolne ka nirdesh milta hai.

* **Doosra Check (Hinglish Vocabulary Match)**:
  Agar Devanagari nahi milti, toh text ke sabhi shabdon ko lowercase me tod kar ek predefined Hinglish dictionary se match kiya jata hai (jaise: `kya`, `kaise`, `batao`, `hai`, `hain`, `kyu`, `mera`, `meri`, `padhna`, `karo`). Agar ek bhi Hinglish keyword mil jata hai, toh mode ko **Hinglish** set kiya jata hai aur AI ko casual romanized mix bhasha me samjhane ki hidayat milti hai.

* **Teesra Check (English Fallback)**:
  Agar upar ke dono rules match nahi hote, toh system default **English** mode apply karta hai aur clear academic English me step-by-step jawab generate karta hai.

---

## 4. 🏗️ Frontend Modular Component Architecture

Pehle frontend ka hazaron lines ka code ek hi file me bhara hua tha jisse project ko edit karna bohot mushkil ho raha tha. Isliye poore frontend ko modular structure me badal diya gaya:

* **Sections Folder (`frontend/sections/`)**:
  Is folder me har ek screen ka alag HTML fragment rakha gaya hai:
  - `sidebar.html`: Collapsible left navigation aur branding logo.
  - `dashboard.html`: Quick statistics, daily quote aur quick subject cards.
  - `chat.html`: Alpha AI streaming chat window aur input bar.
  - `subjects.html`: Subject syllabus tracker aur chapter checklists.
  - `assignments.html`: Homework CRUD manager aur due-date badges.
  - `goals.html`: Daily study targets aur interactive completion meter.
  - `progress.html`: Learning analytics aur performance bar charts.
  - `modals.html`: Naye subject ya homework add karne wale dialog popups.

* **CSS Folder (`frontend/css/`)**:
  Har section ki styling alag file me rakhi gayi hai (`chat.css`, `dashboard.css`, `layout.css`, etc.) aur unhe master `style.css` ke zariye import kiya jata hai.

* **JavaScript Modules (`frontend/js/`)**:
  Har feature ka logic alag decoupled JS file me hai (`chat.js`, `subjects.js`, `goals.js`, `navigation.js`, etc.) jo global scope ko pollute kiye bina kaam karta hai.

* **Automated Node.js Bundler (`build.js`)**:
  Ek custom compiler script banayi gayi hai. Jab developer `node frontend/build.js` chalata hai, toh yeh script sabhi `sections/*.html` files ko read karke automatically ek single production-ready `index.html` file generate kar deti hai. Isme `--watch` mode bhi hai jisse file save karte hi page live auto-compile ho jata hai.

---

## 5. 💾 Hybrid Storage & Data Synchronization Strategy

Student ka data browser aur cloud ke beech balance banakar save kiya jata hai:

* **Instant Offline Speed (LocalStorage)**:
  Jab bhi student koi task complete tick karta hai, subject add karta hai, ya naya goal banata hai, toh pehle yeh data turant browser ke `LocalStorage` me update hota hai. Iska faayda yeh hai ki UI par 0 millisecond ka delay rehta hai aur internet slow hone par bhi buttons smoothly chalte hain.

* **Permanent Cloud Sync (Supabase PostgreSQL)**:
  Important records aur complete AI chat logs Supabase cloud database me sync hote hain. Isse student agar computer restart kare ya doosre browser me login kare, toh uska purana academic record safely wapis load ho jata hai.

---

## 6. 🌐 API Endpoints Reference Matrix

Backend dwara provide kiye jane wale sabhi active API routes:

* `GET /`: Health check endpoint jo batata hai ki server chal raha hai aur Supabase se connected hai ya nahi.
* `POST /chat`: Core streaming endpoint jo student ka prompt lekar live typewriter tokens stream karta hai.
* `GET /chat/history/{user_id}`: Diye gaye student UUID ke purane saved conversations ko Supabase se fetch karke deta hai.
* `POST /quiz/generate`: Kisi bhi subject aur topic ke upar 5 MCQs, unke options aur explanations ka JSON return karta hai.
* `POST /goals/plan`: Exam date aur study hours ke hisab se daily routine timetable banata hai.
* `POST /progress/audit`: Completed topics aur homework scores ko analyze karke academic report deta hai.

---

## 7. 🔒 Security, Isolation & Environment Protection

* **Secret Keys Ki Suraksha**:
  Supabase ki secret database key (`SUPABASE_SECRET_KEY`) sirf aur sirf `backend/.env` file me rehti hai. Is key ko kabhi bhi frontend ke kisi JavaScript code me nahi daala gaya hai taaki koi browser inspect karke database access na chura sake.

* **CORS Origin Gatekeeper**:
  FastAPI server me strict CORS rules lagaye gaye hain jo sirf authorized local frontend addresses (`http://127.0.0.1:5500` aur `http://localhost:5500`) se aane wali requests ko allow karte hain aur unauthorized external access ko block kar dete hain.

* **Local Machine Privacy**:
  Kyunki sara conversational AI logic local Ollama server par run hota hai, isliye student ke academic doubts, private questions aur learning logs kisi third-party public AI company ke server par transfer nahi hote.
