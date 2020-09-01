import datetime

import requests
import random

for i in range(100):
    start = datetime.datetime(2020, 1, 1).timestamp()
    end = datetime.datetime(2021, 1, 1).timestamp()
    timestamp = random.randrange(start, end)
    response = requests.post(
        'http://localhost:3000/api/readings',
        headers={
            'Authorization': 'Api-Key 1234',
            'Content-Type': 'application/json',
        },
        json={
            'sensorId': '5f41a70283d15aa51cec71b7',
            'timestamp': timestamp,
            'temperature': random.randrange(20, 40),
            'pressure': random.randrange(10, 30),
            'humidity': random.randrange(0, 100),
        })
    print(response.status_code)
