from datetime import datetime

import requests
import random

while True:
    start = 0
    end = int(datetime.now().timestamp())
    timestamp = random.randrange(start, end)
    time = datetime.fromtimestamp(timestamp).isoformat()
    response = requests.post(
        'http://localhost:3000/api/readings',
        headers={
            'Authorization': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsInJvbGVzIjpbInN0YXRpb24iXSwiaWF0IjoxNjI3NzcxODkzfQ.20r6RNcC-5zWVwqaIoTKigRDtvn30bID8pPNBQnuODs',
            'Content-Type': 'application/json',
        },
        json={
            'time': time,
            'temperature': random.randrange(0, 100),
            'rain1h': random.randrange(0, 10),
        })
    print(response.status_code)
