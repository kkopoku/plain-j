from fastapi import APIRouter
from app.models import TextRequest
from app.gemini_service import process_text

router = APIRouter()

@router.post("/process-text/")
async def process_text_api(request: TextRequest):
    return {"response": process_text(request.text)}