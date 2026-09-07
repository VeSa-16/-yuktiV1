import re

page_path = 'd:/yukti/frontend/app/market-intelligence/[categoryId]/page.tsx'
with open(page_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace Math.random() with a deterministic distance calculation based on coordinates
target = "Math.random() * 5 + 0.5"
replacement = "Math.abs(c.latitude - (data.competitors.value?.records?.[0]?.latitude || 17.6599)) * 111 + Math.abs(c.longitude - (data.competitors.value?.records?.[0]?.longitude || 75.9064)) * 111"

if target in content:
    content = content.replace(target, replacement)
    with open(page_path, 'w', encoding='utf-8') as f:
        f.write(content)
    print("Fixed Math.random() violation in Map.")
else:
    print("Math.random() not found.")
