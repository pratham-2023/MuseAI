import requests
import json

url = 'http://localhost:5000/feedback'
data = {
    "name": "Test User",
    "rating": 5,
    "message": "This is a test feedback message seeded by the system."
}

try:
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    print(response.json())
except Exception as e:
    print(f"Error: {e}")
