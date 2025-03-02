# Financial Plain Text-to-JSON API

## Overview

**Purpose:** Converts natural language into actionable JSON objects for financial transactions.

This API extracts structured financial transaction details from text inputs. Given an instruction like *"Send 50 GHS to 233256619388 on MTN"*, the API returns a JSON object with the following fields:

- **`to`**: Recipient's phone number
- **`mno`**: Mobile network operator (`Zeepay`, `MTN`, `Vodafone`, `AirtelTigo`)
- **`amount`**: Transaction amount

If any required field is missing or unclear, the API returns `null`.

---

## Features

✅ Parses natural language financial instructions

✅ Returns structured JSON output

✅ Supports multiple mobile network operators

✅ Handles missing or invalid data gracefully

---

## Installation

Ensure **Python 3.7+** is installed, then clone this repository and install dependencies:

```sh
python -m venv .venv
source .venv/bin/activate  # Windows: .venv\Scripts\activate
pip install fastapi uvicorn openai
```

---

## Usage

### **1. Start the API**

Run the FastAPI server:

```sh
uvicorn main:app --reload
```

### **2. Send a Request**

Use **Postman**, **cURL**, or any HTTP client to send a `POST` request.

#### **Example Request**

```json
{
    "text": "Send 500 GHS to 233256619388 on Vodafone"
}
```

#### **Example Response**

```json
{
    "to": "233256619388",
    "mno": "Vodafone",
    "amount": 500
}
```

#### **Handling Invalid Input**

If the input is unrelated to sending money or lacks required details:

```json
null
```

---

## API Endpoints

| Method | Endpoint      | Description                     |
|--------|-------------|---------------------------------|
| POST   | `/parse-text` | Converts text to JSON          |

### **Request Format**

```json
{
    "text": "Your transaction text here"
}
```

### **Response Format**

```json
{
    "to": "Recipient's phone number",
    "mno": "Mobile network operator",
    "amount": Amount
}
```

---

## Future Enhancements

🔹 Support for additional financial actions (e.g., bill payments, airtime top-ups)

🔹 AI-powered voice input integration

🔹 Multi-language support

---

## License

This project is open-source under the **MIT License**.

---

## Author

**Kwame Koranteng Opoku**  
📧 [Email](mailto:kkopoku@example.com)  
🔗 [GitHub](https://github.com/kkopoku)