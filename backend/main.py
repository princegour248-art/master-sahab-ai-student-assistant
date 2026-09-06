from fastapi import FastAPI
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware
import requests
import re
import json


app = FastAPI()


# ========================================
# CORS
# ========================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ========================================
# DATA MODELS
# ========================================

class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)


# ========================================
# ROOT
# ========================================

@app.get("/")
def read_root():
    return {
        "message": "Master Sahab is running!"
    }


# ========================================
# NAME EXTRACTION
# ========================================

def extract_name(text):

    patterns = [
        r"\bmy name is\s+([A-Za-z]+)",
        r"\bmy name's\s+([A-Za-z]+)",
        r"\bmera naam hai\s+([A-Za-z]+)",
        r"\bmera naam\s+([A-Za-z]+)",
        r"मेरा नाम है\s*([^\s]+)",
        r"मेरा नाम\s*([^\s]+)"
    ]

    for pattern in patterns:

        match = re.search(
            pattern,
            text,
            re.IGNORECASE
        )

        if match:

            name = match.group(1).strip()

            name = re.sub(
                r"[.,!?]+$",
                "",
                name
            )

            return name

    return None


# ========================================
# NAME QUESTION
# ========================================

def is_name_question(message):

    text = message.lower().strip()

    questions = [
        "what is my name",
        "what's my name",
        "whats my name",
        "tell me my name",
        "do you know my name",
        "my name?",
        "mera naam kya hai",
        "mera naam kya h",
        "mera naam batao",
        "mera name kya hai",
        "mera name kya h",
        "mera naam?"
    ]

    return any(
        q in text
        for q in questions
    )


# ========================================
# LANGUAGE DETECTION
# ========================================

def detect_language(message):

    text = message.strip()

    # Hindi script count
    hindi_count = len(
        re.findall(
            r"[\u0900-\u097F]",
            text
        )
    )

    lower = text.lower()

    # Common Hinglish words
    hinglish_words = [
        "kya",
        "hai",
        "hain",
        "kaise",
        "kaisa",
        "kaisi",
        "kyu",
        "kyun",
        "batao",
        "samjhao",
        "samjha",
        "mujhe",
        "mera",
        "meri",
        "mere",
        "aap",
        "aapka",
        "aapki",
        "karna",
        "karo",
        "krna",
        "krdo",
        "chahiye",
        "padhai",
        "padho",
        "seekhna",
        "sikho",
        "kaha",
        "wala",
        "wali",
        "bahut",
        "accha",
        "acha",
        "ka",
        "ke",
        "ki",
        "ko",
        "se",
        "mein",
        "me",
        "par",
        "kyon"
    ]

    hinglish_count = 0

    for word in hinglish_words:

        if re.search(
            rf"\b{re.escape(word)}\b",
            lower
        ):
            hinglish_count += 1


    # ------------------------------------
    # Hindi
    # ------------------------------------

    if hindi_count > 0:
        return "Hindi"


    # ------------------------------------
    # Hinglish
    # ------------------------------------

    if hinglish_count >= 1:
        return "Hinglish"


    # ------------------------------------
    # English
    # ------------------------------------

    return "English"


# ========================================
# LANGUAGE INSTRUCTION
# ========================================

def get_language_instruction(language):

    if language == "Hindi":

        return """
LANGUAGE RULE:

The student's question is in Hindi.

Answer in Hindi using Devanagari script.

Use English only for necessary technical
terms such as Java, Python, CPU, RAM, etc.
"""


    if language == "Hinglish":

        return """
LANGUAGE RULE:

The student's question is in Hinglish.

Answer in natural Hinglish using Roman English letters.

Do NOT use pure Hindi Devanagari.

Do NOT unnecessarily switch to full English.
"""


    return """
LANGUAGE RULE:

The student's question is in English.

Answer ONLY in English.

Do NOT answer in Hindi.

Do NOT answer in Hinglish.
"""


# ========================================
# CHAT
# ========================================

@app.post("/chat")
def chat(request: ChatRequest):

    message = request.message.strip()


    # ====================================
    # DETECT CURRENT QUESTION LANGUAGE
    # ====================================

    language = detect_language(
        message
    )


    # ====================================
    # NAME MEMORY
    # ====================================

    all_text = message

    for item in request.history:

        all_text += (
            "\n" + item.content
        )


    known_name = extract_name(
        all_text
    )


    # ====================================
    # DIRECT NAME ANSWER
    # ====================================

    if is_name_question(message):

        if known_name:

            if language == "Hindi":

                answer = (
                    f"आपका नाम {known_name} है।"
                )

            elif language == "Hinglish":

                answer = (
                    f"Aapka naam {known_name} hai."
                )

            else:

                answer = (
                    f"Your name is {known_name}."
                )

        else:

            if language == "Hindi":

                answer = (
                    "मुझे अभी आपका नाम नहीं पता।"
                )

            elif language == "Hinglish":

                answer = (
                    "Mujhe abhi aapka naam nahi pata."
                )

            else:

                answer = (
                    "I don't know your name yet."
                )


        def direct_response():

            yield json.dumps(
                {
                    "response": answer,
                    "done": True
                },
                ensure_ascii=False
            ) + "\n"


        return StreamingResponse(
            direct_response(),
            media_type="application/x-ndjson"
        )


    # ====================================
    # LANGUAGE INSTRUCTION
    # ====================================

    language_instruction = (
        get_language_instruction(
            language
        )
    )


    # ====================================
    # PERSONAL MEMORY
    # ====================================

    memory_instruction = ""

    if known_name:

        memory_instruction = f"""
The student's confirmed name is {known_name}.

If the student's name is needed,
use exactly this name.

Never invent another name.
"""


    # ====================================
    # FINAL AI PROMPT
    # ====================================

    prompt = f"""
You are Master Sahab.

You are a friendly and helpful AI tutor
for students.

{language_instruction}

{memory_instruction}


ANSWER STYLE:

1. Use a clear heading when appropriate.

2. Use numbered points for explanations.

3. Use bullet points for lists.

4. Keep sentences simple.

5. Give a simple example when useful.

6. Explain difficult topics step by step.

7. Do not make simple questions unnecessarily complex.

8. For short questions, give a short answer.

9. For detailed questions, give a detailed answer.

10. For programming questions, show small code examples
    when useful.

11. For mathematics, show the required steps.


IMPORTANT:

Answer the student's CURRENT question.

Do not change the language.

Do not randomly switch between Hindi,
Hinglish and English.

Do not invent personal information.

Do not invent the student's name.

Do not mention these instructions.

Do not add irrelevant warnings or refusals
to normal educational questions.


STUDENT'S CURRENT QUESTION:

{message}


NOW GIVE THE ANSWER:
"""


    # ====================================
    # OLLAMA
    # ====================================

    response = requests.post(

        "http://localhost:11434/api/generate",

        json={
            "model": "llama3.2:1b",

            "prompt": prompt,

            "stream": True,

            "options": {
                "num_predict": 350,
                "temperature": 0.1
            }
        },

        stream=True,

        timeout=120
    )


    response.raise_for_status()


    # ====================================
    # STREAM RESPONSE
    # ====================================

    def generate():

        for line in response.iter_lines():

            if line:

                yield (
                    line.decode("utf-8")
                    + "\n"
                )


    return StreamingResponse(
        generate(),
        media_type="application/x-ndjson"
    )