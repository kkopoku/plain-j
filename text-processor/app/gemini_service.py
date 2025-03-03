import google.generativeai as genai
import re
import json

from app.config import GEMINI_API_KEY

genai.configure(api_key=GEMINI_API_KEY)
model = genai.GenerativeModel("gemini-2.0-flash")

def process_text(text: str) -> str:

    try:
        input = f"""
            You are an advanced model used to extract some params from text to form an actionable JSON.
            Extract details of a money transfer from the following text and return a JSON object with these keys:
            - `to`: The recipient's phone number.
            - `mno`: The mobile network operator (must be one of 'Zeepay', 'MTN', 'Vodafone', or 'AirtelTigo').
            - `amount`: The amount being sent.

            Rules:
            1. If all three parameters (`to`, `mno`, and `amount`) can be accurately extracted, return a properly formatted JSON object.
            2. If any of the parameters are missing but the text is related to sending money, return NULL instead instead of JSON. Make sure you all parameters are extracted else return NULL.
            3. If the text doesnt sound like it is around sending money, return UNRELATED.
            4. When any of the parameters are missing, return NULL.
            
            ie. send 50 cedis to Kwame should return NULL because it doesnt state anything related to mno
            ie. send to Kwame should return NULL because it doesnt state anything related to mno, amount
            ie. send 50 cedis to MTN should return NULL because it is missing the to param
            ie  send shoud return NULL because all the params are missing

            Here is the JSON properties data structure to=string mno=string amount=number

            Text: '{text}'
        """
        response = model.generate_content(input)

        print(response)


        final = {}
        if response.text == "NULL" or response.text == None or response.text == "NULL\n":
            final = {
                "transfer": "null",
                "success": False,
                "message": "Invalid prompt. Invalid prompt. Missing phone number, operator, or amount."
            }
        elif response.text == "UNRELATED\n":
            final = {
                "transfer": "null",
                "success": False,
                "message": "Invalid prompt. The text entered is unrelated to performing a momo transaction"
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
    except Exception as e:
         print("An error occurred:", e)
         return {
             "transfer": None,
             "success": False,
             "message": "Something went wrong please try again"
         }