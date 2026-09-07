import os

store_path = 'd:/yukti/frontend/lib/store.tsx'
with open(store_path, 'r', encoding='utf-8') as f:
    content = f.read()

# Add isDemoMode to SessionState
if 'isDemoMode: boolean;' not in content:
    content = content.replace('activePlanId: string | null;', 'activePlanId: string | null;\n  isDemoMode: boolean;')

# Add setDemoMode to SessionState
if 'setDemoMode: (mode: boolean) => void;' not in content:
    content = content.replace('resumePlan: (id: string) => void;', 'resumePlan: (id: string) => void;\n  setDemoMode: (mode: boolean) => void;')

# Add default isDemoMode state
if 'isDemoMode: false,' not in content:
    content = content.replace('activePlanId: null,', 'activePlanId: null,\n      isDemoMode: false,')

# Add setDemoMode action
if 'setDemoMode: (mode) =>' not in content:
    content = content.replace('resumePlan: (id) => set({ activePlanId: id }),', 'resumePlan: (id) => set({ activePlanId: id }),\n      setDemoMode: (mode) => set({ isDemoMode: mode }),')

with open(store_path, 'w', encoding='utf-8') as f:
    f.write(content)

api_client_path = 'd:/yukti/frontend/lib/api-client.ts'
with open(api_client_path, 'r', encoding='utf-8') as f:
    api_content = f.read()

if 'X-Yukti-Mode' not in api_content:
    # We need to import useSessionStore to get the mode
    if 'import { useSessionStore }' not in api_content:
        api_content = 'import { useSessionStore } from "./store";\n' + api_content
    
    # Add header to the fetch call
    api_content = api_content.replace('headers: {\n        "Content-Type": "application/json",\n      },', 'headers: {\n        "Content-Type": "application/json",\n        "X-Yukti-Mode": useSessionStore.getState().isDemoMode ? "demo" : "production",\n      },')

with open(api_client_path, 'w', encoding='utf-8') as f:
    f.write(api_content)
