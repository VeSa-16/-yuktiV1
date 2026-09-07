import httpx
import time
import sys

BASE_URL = 'http://localhost:8000'

def run_tests():
    print('Starting API End-to-End Bug Bash...')
    with httpx.Client(base_url=BASE_URL) as client:
        
        # 1. Profile Creation
        res = client.post('/profile', json={
            'name': 'Ramesh Kumar',
            'location_input': 'Solapur, Maharashtra',
            'language': 'HI'
        })
        if res.status_code != 200:
            print(f"Failed /profile: {res.text}")
            sys.exit(1)
            
        session_id = res.json()['user_id']
        location_id = res.json()['location_id']
        print(f"Session started: {session_id}, location: {location_id}")

        # 3. Rank Opportunities (Discover)
        res = client.post('/rank-opportunities', json={
            'session_id': session_id,
            'location_id': location_id,
            'margin_capital': 50000
        })
        if res.status_code != 200:
            print(f"Failed /rank-opportunities: {res.text}")
            sys.exit(1)
        print("Ranked opportunities successfully.")

        # Let's say user chose the first one
        category_id = res.json()['rankings'][0]['category_id']

        # 4. We need to save the chosen category and margin capital to the session DB manually since we don't have an endpoint. Wait, does /market-intelligence save it? No.
        # Wait, how does compute_full_financials know the margin_capital? Let's check session_service.py to see if we can update the session.
