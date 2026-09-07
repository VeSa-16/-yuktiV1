import os
import re

files_to_update = [
    r'd:\yukti\frontend\app\settings\page.tsx',
    r'd:\yukti\frontend\app\score\[categoryId]\page.tsx',
    r'd:\yukti\frontend\app\financials\page.tsx',
    r'd:\yukti\frontend\app\error.tsx',
    r'd:\yukti\frontend\app\category\[categoryId]\page.tsx',
    r'd:\yukti\frontend\app\capital\page.tsx'
]

for path in files_to_update:
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as f:
            content = f.read()
            
        # Fix imports: from"..." -> from "..."
        content = re.sub(r'from"([^"]+)"', r'from "\1"', content)
        # Fix import"..." -> import "..."
        content = re.sub(r'import"([^"]+)"', r'import "\1"', content)
        # Fix return"..." -> return "..."
        content = re.sub(r'return"([^"]+)"', r'return "\1"', content)
        # Fix console.error("..." -> console.error("..." (Wait, it's console.error("..."), not space)
        # Fix === "..." -> ==="..." was replaced with ==="...". Should be === "..."
        content = re.sub(r'==="([^"]+)"', r'=== "\1"', content)
        content = re.sub(r'=="([^"]+)"', r'== "\1"', content)
        content = re.sub(r'!="([^"]+)"', r'!= "\1"', content)
        content = re.sub(r'!==="([^"]+)"', r'!== "\1"', content)
        content = re.sub(r':"([^"]+)"', r': "\1"', content)
        content = re.sub(r'="([^"]+)"', r'="\1"', content) # actually this is fine for jsx attributes
        
        with open(path, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"Repaired {path}")
