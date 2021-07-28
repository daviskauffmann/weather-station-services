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
            'x-api-key': '1234',
            'Content-Type': 'application/json',
        },
        json={
            'time': time,
            'stationId': 1,
            'temperature': random.randrange(0, 100),
            'rain1h': random.randrange(0, 10),
        })
    print(response.status_code)
