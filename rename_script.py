import os

directories_to_scan = [
    r'd:\yukti\frontend\app',
    r'd:\yukti\frontend\components',
    r'd:\yukti\backend\app',
    r'd:\yukti\frontend\public',
]

files_to_scan = [
    r'd:\yukti\frontend\package.json',
    r'd:\yukti\YUKTI_Data_Strategy_and_Data_Architecture.md',
    r'd:\yukti\YUKTI_Prototype_Code.md',
    r'd:\yukti\YUKTI_File_Structure.md',
]

def process_file(filepath):
    if not os.path.exists(filepath): return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = content.replace('YUKTI', 'YuktiFi')
    new_content = new_content.replace('Yukti', 'YuktiFi')
    new_content = new_content.replace('"name": "yukti-frontend"', '"name": "yuktifi-frontend"')
    new_content = new_content.replace('YuktiFiFi', 'YuktiFi')
    new_content = new_content.replace('YuktiFifi', 'YuktiFi')

    if content != new_content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f'Updated: {filepath}')

for d in directories_to_scan:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(('.ts', '.tsx', '.py', '.json', '.md', '.html', '.css', '.js', '.mjs')):
                process_file(os.path.join(root, file))

for f in files_to_scan:
    process_file(f)
