from transformers import AutoTokenizer, AutoModelForCausalLM

# Load once
tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2")
model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2")

VALID_CATEGORIES = {
    "food & drink", "entertainment", "travel", "bills",
    "shopping", "subscription", "utilities", "other"
}

def categorize_expense(expense: str) -> str:
    prompt = f"""Classify the following expense into one of these categories:
Food & Drink, Entertainment, Travel, Bills, Shopping, Subscription, Utilities and Other.

Expense: {expense}
Category:"""
    inputs = tokenizer(prompt, return_tensors="pt")
    outputs = model.generate(**inputs, max_length=64, pad_token_id=tokenizer.eos_token_id)
    text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    category = text.split("Category:")[-1].strip().lower().strip('.')
    return category if category in VALID_CATEGORIES else "other"