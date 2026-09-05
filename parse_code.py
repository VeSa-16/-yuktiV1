import re
from pathlib import Path

base_dir = Path(r"d:\yukti")
md_file = base_dir / "YUKTI_Prototype_Code.md"

with open(md_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

current_file = None
in_code_block = False
code_content = []

def save_file(rel_path, content):
    if not rel_path: return
    if rel_path.endswith('/'): return
    
    if rel_path.startswith('app/'):
        rel_path = 'backend/' + rel_path
    
    p = base_dir / rel_path
    p.parent.mkdir(parents=True, exist_ok=True)
    with open(p, 'w', encoding='utf-8') as f:
        f.write("".join(content))
    print(f"Saved: {p}")

heading_regex = re.compile(r"^##\s+`([^`]+)`")

for i, line in enumerate(lines):
    match = heading_regex.search(line)
    if match:
        potential_file = match.group(1)
        if not potential_file.endswith('/'):
            current_file = potential_file

    if line.startswith("```"):
        if not in_code_block:
            in_code_block = True
            code_content = []
            
            # Check the next line to see if it overrides the filename with a comment
            if i + 1 < len(lines):
                next_line = lines[i+1].strip()
                if next_line.startswith("# app/"):
                    current_file = next_line.lstrip('# ').strip()
        else:
            in_code_block = False
            if current_file:
                save_file(current_file, code_content)
                # clear current_file if the last heading was a directory, to avoid overwriting
                # Actually, only keep current_file if it came from a heading
                # Let's not clear it, it's safer to keep the last known file
    else:
        if in_code_block:
            code_content.append(line)
