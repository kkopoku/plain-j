from fastapi import FastAPI
from app.routes import router

app = FastAPI()

# Include API routes
app.include_router(router)

# Run using `uvicorn main:app --reload`