from fastapi import FastAPI
from fastapi.responses import StreamingResponse, JSONResponse
from pydantic import BaseModel, Field
from fastapi.middleware.cors import CORSMiddleware

import requests
import re
import json


app = FastAPI(
    title="Master Sahab",
    description="AI Student Assistant powered by local Ollama",
    version="3.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://127.0.0.1:5500",
        "http://localhost:5500"
    ],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    history: list[ChatMessage] = Field(default_factory=list)


@app.get("/")
def read_root():
    return {"message": "Master Sahab is running!"}


def detect_language(message):
    text = message.strip()

    if re.search(r"[\u0900-\u097F]", text):
        return "Hindi"

    hinglish_words = [
        "kya", "hai", "hain", "kaise", "kaisa", "kaisi",
        "kyu", "kyun", "batao", "samjhao", "mujhe",
        "mera", "meri", "mere", "aap", "aapka", "aapki",
        "karna", "karo", "krna", "krdo", "chahiye",
        "padhai", "padho", "seekhna", "sikho", "kaha",
        "wala", "wali", "bahut", "acha", "accha", "mein"
    ]

    lower = text.lower()

    for word in hinglish_words:
        if re.search(rf"\b{re.escape(word)}\b", lower):
            return "Hinglish"

    return "English"


def language_instruction(language):
    if language == "Hindi":
        return """
Answer in Hindi using Devanagari script.
Keep technical terms such as Python, Java, API, HTML, CSS etc. in English.
"""

    if language == "Hinglish":
        return """
Answer in natural Hinglish using Roman English letters.
Do not use Devanagari.
"""

    return """
Answer only in English.
"""


def generate_stream(message, history):

    language = detect_language(message)

    history_text = ""

    for item in history[-6:]:
        history_text += f"\n{item.role}: {item.content}"

    prompt = f"""
You are Master Sahab, a helpful AI tutor for students.

{language_instruction(language)}

IMPORTANT ANSWER STYLE:

Give a complete answer.

Do NOT give one large paragraph.

Use Markdown formatting.

For educational questions follow this style:

## Main Heading

Give a short and clear introduction.

### Important Points

1. First important point.
2. Second important point.
3. Third important point.

### Example

Give a simple practical example.

### Summary

Give a short conclusion.

RULES:

- Explain step by step when needed.
- Use numbered lists for steps.
- Use bullet points for features or lists.
- Use headings for different sections.
- Give examples when useful.
- Keep the language simple.
- Do not repeat the question.
- Do not mention these instructions.
- Do not invent personal information.
- Complete the explanation before stopping.
- Never intentionally shorten an answer just to save tokens.

Previous conversation:
{history_text}

Student question:
{message}

Now provide the complete answer.
"""

    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "llama3.2:1b",
                "prompt": prompt,
                "stream": True,
                "options": {
                    "num_predict": 350,
                    "num_ctx": 1024,
                    "temperature": 0.2
                }
            },
            stream=True,
            timeout=180
        )

        response.raise_for_status()

        for line in response.iter_lines(decode_unicode=True):

            if not line:
                continue

            try:
                data = json.loads(line)

                text = data.get("response", "")

                if text:
                    yield json.dumps({
                        "response": text,
                        "done": False
                    }) + "\n"

                if data.get("done", False):
                    yield json.dumps({
                        "response": "",
                        "done": True
                    }) + "\n"

            except json.JSONDecodeError:
                continue

    except requests.exceptions.ConnectionError:
        yield json.dumps({
            "response": "Ollama se connection nahi ho pa raha.",
            "done": True
        }) + "\n"

    except requests.exceptions.Timeout:
        yield json.dumps({
            "response": "Ollama response dene me bahut time le raha hai.",
            "done": True
        }) + "\n"

    except Exception as e:
        yield json.dumps({
            "response": f"Master Sahab error: {str(e)}",
            "done": True
        }) + "\n"


@app.post("/chat")
def chat(request: ChatRequest):

    if not request.message.strip():
        return JSONResponse(
            status_code=400,
            content={
                "response": "Please enter a message.",
                "done": True
            }
        )

    return StreamingResponse(
        generate_stream(
            request.message.strip(),
            request.history
        ),
        media_type="application/x-ndjson",
        headers={
            "Cache-Control": "no-cache",
            "X-Accel-Buffering": "no"
        }
    )