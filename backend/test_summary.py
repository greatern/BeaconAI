from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

model_name = "google/flan-t5-small"

print("Loading tokenizer...")
tokenizer = AutoTokenizer.from_pretrained(model_name)

print("Loading model...")
model = AutoModelForSeq2SeqLM.from_pretrained(model_name)

prompt = """
Summarize this incident in one sentence.

Category: crime
Location: 1 Kieweit Street, Secunda
Description: I saw someone getting mugged today.

Summary:
"""

inputs = tokenizer(prompt, return_tensors="pt")

outputs = model.generate(
    **inputs,
    max_new_tokens=40,
)

summary = tokenizer.decode(outputs[0], skip_special_tokens=True)

print("\nGenerated Summary:")
print(summary)