from fastapi import FastAPI, Query
from categorize import categorize_expense

app = FastAPI()

@app.get("/categorize")
def categorize(description: str = Query(...)):
    return {"category": categorize_expense(description)}