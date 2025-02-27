import google.generativeai as genai
import re
import json

from app.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-pro")

def process_text(text: str) -> str:
    input = f"""
        Extract details of a money transfer from the following text and return a JSON object with these keys:
        - `to`: The recipient's phone number.
        - `mno`: The mobile network operator (must be one of 'Zeepay', 'MTN', 'Vodafone', or 'AirtelTigo').
        - `amount`: The amount being sent.

        Rules:
        1. If all three parameters (`to`, `mno`, and `amount`) can be accurately extracted, return a properly formatted JSON object.
        2. If any of the parameters are missing or unclear or null, return NULL instead instead of JSON. Make sure you all parameters are extracted else return NULL.
        3. Only process messages related to sending money. If the text is unrelated, return NULL.

        Here is the JSON properties data structure to=string mno=string amount=number

        Text: '{text}'
    """
    response = model.generate_content(input)

    print(response)


    final = ""
    if response.text == "NULL":
        final = {
            "transfer": "null",
            "success": False,
            "message": "Invalid Prompt"
        }
    else: 

        cleaned_text = re.sub(r"```json\n|\n```", "", response.text).strip()
        data = json.loads(cleaned_text)
        
        final = {
            "transfer": data,
            "success": True,
            "message": "Transfer details extracted successfully"
        }


    return final