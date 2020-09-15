from datetime import datetime

import requests
import random

while True:
    start = datetime(2020, 1, 1)
    end = datetime(2021, 1, 1)
    timestamp = random.randrange(
        int(start.timestamp()), int(end.timestamp())) * 1000
    response = requests.post(
        'http://localhost:3000/api/readings',
        headers={
            'Authorization': 'Api-Key 1234',
            'Content-Type': 'application/json',
        },
        json={
            'sensorId': '5f41a70283d15aa51cec71b7',
            'timestamp': timestamp,
            'temperature': random.randrange(0, 100),
            'pressure': random.randrange(0, 100),
            'humidity': random.randrange(0, 100),
            'windSpeed': random.randrange(0, 100),
            'windDirection': random.choice(['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']),
            'rainfall': random.randrange(0, 100),
        })
    print(response.status_code)
