import re

sidebar_path = 'd:/yukti/frontend/components/Sidebar.tsx'
with open(sidebar_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add Activity to imports
if 'Activity' not in content:
    content = content.replace('Home, Compass, Map, PieChart, Target, Zap, Folder, FileText,', 'Home, Compass, Map, PieChart, Target, Zap, Folder, FileText,\n  Activity,')

# Add categoryId to useStore destructuring
if 'categoryId' not in content:
    content = content.replace('const { userMode, toggleUserMode, preferredLanguage, setLanguage } = useStore();', 'const { userMode, toggleUserMode, preferredLanguage, setLanguage, categoryId } = useStore();')

# Fix state.categoryId to categoryId
content = content.replace('state.categoryId', 'categoryId')

with open(sidebar_path, 'w', encoding='utf-8') as f:
    f.write(content)
print("Fixed Sidebar.tsx")
