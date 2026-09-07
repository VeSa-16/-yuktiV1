import os
import re

replacements = {
    r'\bbg-black\b': 'bg-warm-bg',
    r'\bbg-zinc-900\b': 'bg-warm-surface',
    r'\bbg-zinc-800\b': 'bg-warm-surface',
    r'\bbg-zinc-700\b': 'bg-warm-surface',
    r'\bbg-zinc-950\b': 'bg-warm-bg',
    r'\bbg-zinc-900/50\b': 'bg-warm-bg/50',
    r'\bborder-zinc-800\b': 'border-warm-border',
    r'\bborder-zinc-700\b': 'border-warm-border',
    r'\bborder-zinc-600\b': 'border-warm-muted',
    r'\btext-zinc-500\b': 'text-warm-muted',
    r'\btext-zinc-400\b': 'text-warm-muted',
    r'\btext-zinc-300\b': 'text-warm-text',
    r'\btext-white\b': 'text-warm-text',
    r'\btext-terminal-text\b': 'text-warm-text',
    r'\btext-terminal-cyan\b': 'text-warm-primary',
    r'\btext-terminal-green\b': 'text-warm-secondary',
    r'\btext-terminal-amber\b': 'text-orange-500',
    r'\btext-terminal-red\b': 'text-red-600',
    r'\bborder-terminal-cyan\b': 'border-warm-primary',
    r'\bborder-terminal-green\b': 'border-warm-secondary',
    r'\bborder-terminal-amber\b': 'border-orange-500',
    r'\bborder-terminal-red\b': 'border-red-600',
    r'\bbg-terminal-cyan/20\b': 'bg-warm-primary/20',
    r'\bbg-terminal-green/20\b': 'bg-warm-secondary/20',
    r'\bbg-terminal-amber/20\b': 'bg-orange-500/20',
    r'\bbg-terminal-red/20\b': 'bg-red-600/20',
    r'\bbg-terminal-cyan\b': 'bg-warm-primary',
    r'\bbg-terminal-green\b': 'bg-warm-secondary',
    r'\bbg-terminal-card\b': 'bg-warm-surface',
    r'\bborder-terminal-border\b': 'border-warm-border',
    r'\bfont-mono\b': 'font-sans'
}

frontend_dir = r'd:\yukti\frontend'
for root, dirs, files in os.walk(frontend_dir):
    if 'node_modules' in root or '.next' in root:
        continue
    for file in files:
        if file.endswith('.tsx') or file.endswith('.ts'):
            path = os.path.join(root, file)
            with open(path, 'r', encoding='utf-8') as f:
                original_content = f.read()
            
            content = original_content
            for pattern, replacement in replacements.items():
                content = re.sub(pattern, replacement, content)
            
            if content != original_content:
                with open(path, 'w', encoding='utf-8') as f:
                    f.write(content)
                print(f"Updated {path}")
