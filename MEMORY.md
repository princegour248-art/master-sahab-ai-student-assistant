# 🧠 Project Memory & Historical Changelog — Alpha AI

---

## 1. 📌 Is Document Ka Maqsad (Purpose of Project Memory)

Yeh document **Alpha AI** project ki **permanent historical memory (yaad-daasht)** hai. Isme project ke banne se lekar ab tak ka poora safar, decisions, architecture me kiye gaye bade badlaav, aur development ke dauran solve kiye gaye critical bugs ka detailed record darj hai.

Yeh file isliye zaroori hai taaki aage chal kar jab bhi koi naya developer aaye ya kisi presentation/viva me poocha jaye ki *"Aapko project banane me kya challenges aaye aur aapne unhe kaise solve kiya?"*, toh aapke paas authentic aur real technical story maujood ho.

---

## 2. ⏳ Complete Chronological Evolution Log (Kab Kya Hua?)

---

### Milestone 1: The Genesis (6 September 2026)
* **Pehli Koshish**: Ek simple study dashboard banane ki koshish ki gayi jisme student AI se apne doubts pooch sake.
* **Initial Structure**: Ek single `index.html`, `style.css` aur `script.js` file banayi gayi.
* **Seekh Aur Faisla**: Jab OpenAI aur Claude ke cloud APIs ko test kiya gaya, toh realize hua ki yeh aam Indian students ke liye affordable nahi hain kyunki inme monthly subscription aur per-token dollar billing lagti hai. Sath hi har student ke paas international credit card nahi hota. Is point par faisla liya gaya ki hum third-party cloud API ke badle **Local Machine par AI model** run karenge jo 100% free aur private ho.

---

### Milestone 2: Local AI & FastAPI Setup (12 – 14 September 2026)
* **Kiya Gaya Kaam**:
  Python virtual environment (`venv`) create kiya gaya aur local machine par **Ollama** server configure karke Meta ka **`llama3.2:1b`** model pull kiya gaya. Backend framework ke roop me **FastAPI** chuna gaya kyunki yeh Python ka sabse fast asynchronous framework hai.
* **Pehli Badi Problem Aur Solution**:
  Shuru me jab student sawaal poochta tha, toh pura answer generate hone tak (5 se 8 seconds) screen freeze ho jaati thi aur student ko lagta tha ki system hang ho gaya hai. Is problem ko solve karne ke liye FastAPI me **NDJSON Token Streaming (`StreamingResponse`)** implement kiya gaya. Iske baad AI jaise-jaise ek-ek shabd generate karta, wo live browser screen par typewriter effect ke sath aane laga.

---

### Milestone 3: Supabase Cloud Integration & DB Crash Fix (20 September 2026)
* **Kiya Gaya Kaam**:
  Student ke conversations ko device restart hone ke baad bhi safe rakhne ke liye **Supabase (Cloud PostgreSQL)** connect kiya gaya aur `chat_history` table create ki gayi. Sath hi security ke liye `backend/.env` file banayi gayi taaki secret database keys kisi ko na dikhein.
* **Critical Bug (Database Down Freeze)**:
  Shuru me database save logic synchronous tha. Jab internet slow hota ya Supabase connect nahi ho pata, toh poori FastAPI backend process crash ho jaati thi aur student ka live chat response bhi ruk jata tha.
* **Kaise Solve Hua?**:
  Humne database insertion ko ek **non-blocking asynchronous `try-except`** block me daala. Iska result yeh hua ki agar Supabase down bhi ho jaye, tab bhi student ka live chat response bina kisi rukawat ke screen par stream hota rehta hai aur error sirf backend console me log ho jata hai.

---

### Milestone 4: Academic Tools & The Quiz Markdown Bug (29 September 2026)
* **Kiya Gaya Kaam**:
  FastAPI me 3 naye powerful endpoints add kiye gaye: `/quiz/generate` (MCQs ke liye), `/goals/plan` (study routine ke liye), aur `/progress/audit` (learning analytics ke liye).
* **Critical Bug (JSONDecodeError Crash)**:
  Llama 3.2 model aksar JSON response ke shuru me aur aakhir me markdown code fences (` ```json ... ``` `) laga kar return karta tha. Jab Python ka native `json.loads()` chalta tha, toh syntax error ki wajah se poora endpoint 500 Internal Server Error de deta tha.
* **Kaise Solve Hua?**:
  Humne `backend/main.py` ke andar ek **Regex Pre-Cleaner Filter** lagaya jo parsing se pehle markdown fences aur extra spaces ko clean kar deta hai:
  ```python
  raw_text = re.sub(r"^```json\s*", "", raw_text, flags=re.IGNORECASE)
  raw_text = re.sub(r"\s*```$", "", raw_text)
  quiz = json.loads(raw_text)
  ```
  Is ek filter ne quiz generation ki stability ko 100% reliable bana diya.

---

### Milestone 5: The Great 282KB Monolithic Refactoring (30 September 2026 - Day)
* **Sabse Badi Problem**:
  Project grow hote-hote single `script.js` file **282 KB (hazaron lines)** ki ho gayi thi. Chat, homework, goals aur syllabus ka code ek hi file me mix hone ki wajah se code "spaghetti" ban chuka tha — chota sa button badalne par doosra feature crash ho jata tha.
* **Architectural Pivot (Modular Architecture)**:
  Humne pure frontend ko tod kar modular architecture me badal diya:
  1. `frontend/sections/`: Har screen ka alag chota HTML fragment banaya gaya.
  2. `frontend/css/`: Har screen ki alag scoped styling banayi gayi.
  3. `frontend/js/`: Har feature ka alag decoupled JavaScript controller banaya gaya.
* **Node.js `build.js` Compiler Ka Janm**:
  Alag-alag section files ko browser me manual copy-paste na karna pade, iske liye ek lightweight Node script `build.js` banayi gayi jo sabhi sections ko watch mode me live compile karke ek single production `index.html` create kar deti hai.

---

### Milestone 6: Documentation & Engineering Governance (30 September 2026 - Night)
* **Kiya Gaya Kaam**:
  Project ko standard software engineering ke hisab se 6 comprehensive documents me document kiya gaya:
  - [`PRD.md`](file:///C:/Users/DELL/master-sahab-ai-student-assistant/PRD.md): Business idea, problem, solution aur features.
  - [`ARCHITECTURE.md`](file:///C:/Users/DELL/master-sahab-ai-student-assistant/ARCHITECTURE.md): 4-Tier design, streaming mechanics aur data flow.
  - [`RULES.md`](file:///C:/Users/DELL/master-sahab-ai-student-assistant/RULES.md): AI guidelines, approved libraries aur 8GB RAM constraints.
  - [`DESIGN.md`](file:///C:/Users/DELL/master-sahab-ai-student-assistant/DESIGN.md): UI/UX design system, White + Royal Blue palette aur typography.
  - [`TASK.md`](file:///C:/Users/DELL/master-sahab-ai-student-assistant/TASK.md): Phase-wise task roadmap aur progress matrix.
  - [`MEMORY.md`](file:///C:/Users/DELL/master-sahab-ai-student-assistant/MEMORY.md): Yeh historical log aur bug solving memory.

---

## 3. 🐛 Solved Bugs Ka Detailed Technical Record

1. **Bug #1 - Supabase Cloud Failure Par Live Chat Freeze Hona**:
   * *Problem*: Cloud database down hone ya internet break hone par student ki live streaming chat band ho jaati thi.
   * *Root Cause*: Database save logic chat generation ke synchronous pipeline me phas raha tha.
   * *Fix*: Save logic ko asynchronous `try-except` me wrap kiya gaya taaki database fail hone par bhi live response uninterrupted deliver ho.

2. **Bug #2 - Quiz JSON Parse Crash (`JSONDecodeError`)**:
   * *Problem*: AI model text ke sath ` ```json ` fences bhejta tha jisse frontend par quiz render nahi ho pata tha.
   * *Root Cause*: LLM models conversationally code blocks wrap karne ke aadi hote hain.
   * *Fix*: Python me regular expression clean-up lagaya gaya jo code blocks strip karke pure JSON deliver karta hai.

3. **Bug #3 - Bhasha Ki Confusion (Language Mismatch)**:
   * *Problem*: Student casual Hinglish me doubt poochta tha par AI formal English me jawab deta tha.
   * *Root Cause*: LLM me koi language routing logic nahi tha.
   * *Fix*: Multi-tier regex engine banaya jo Devanagari Hindi aur common Hinglish keywords ko pehchan kar AI ko usi tone me bolne ka nirdesh deta hai.

4. **Bug #4 - 282KB Spaghetti Monolith**:
   * *Problem*: Ek hi `script.js` file me hazaaron lines hone ki wajah se changes karna extremely risky ho gaya tha.
   * *Root Cause*: Rapid prototyping me code ek hi jagah likha gaya tha.
   * *Fix*: Modular sections split kiya gaya aur Node.js `build.js` compiler script develop ki gayi.
