import os
import json
import requests
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY") 

def analyze_with_llm(prompt: str) -> dict:
    """
    Calls the Groq API using llama-3.3-70b-versatile.
    Expects the prompt to instruct the LLM to return valid JSON.

    Args:
        prompt: The structured text to send.

    Returns:
        dict: The parsed JSON from the LLM, or an empty dict if it fails.
    """
    if not GROQ_API_KEY:
        print("[LLM] Fallback triggered: GROQ_API_KEY is not set.")
        return {}
        
    url = "https://api.groq.com/openai/v1/chat/completions"
    headers = {
        "Authorization": f"Bearer {GROQ_API_KEY}",
        "Content-Type": "application/json"
    }

    body = {
        "model": "llama-3.3-70b-versatile",
        "messages": [
            {"role": "user", "content": prompt}
        ],
        "temperature": 0.2,
        "response_format": {"type": "json_object"}
    }

    try:
        print("[LLM] Calling Groq API...")
        response = requests.post(url, headers=headers, json=body, timeout=15)
        response.raise_for_status()
        
        print("[LLM] Response received")
        response_json = response.json()
        
        content = response_json["choices"][0]["message"]["content"]
        
        # Parse the JSON embedded in the response
        try:
            return json.loads(content)
        except json.JSONDecodeError:
            print("[LLM] Fallback triggered: Failed to parse LLM response as JSON")
            return {}
            
    except Exception as e:
        print(f"[LLM] Fallback triggered: API request failed ({e})")
        return {}
