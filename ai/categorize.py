import sys, json
from transformers import AutoTokenizer, AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("microsoft/phi-2")
tokenizer = AutoTokenizer.from_pretrained("microsoft/phi-2")

#expense = sys.argv[1]
prompt = f"""Classify the following expense into one of these categories:
Food & Drink, Entertainment, Travel, Bills, Shopping, Subscription, Utilities and Other.

Expense: "Netflix subscription"
Category:"""

inputs = tokenizer(prompt, return_tensors="pt")
outputs = model.generate(**inputs, max_length=64)
text = tokenizer.decode(outputs[0], skip_special_tokens=True)

print(json.dumps({"category": text.split("Category:")[-1].strip()}))
