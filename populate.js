const request = require('request');

function randomRange(min, max) {
    return Math.random() * (max - min) + min;
}

for (let i = 0; i < 100; i++) {
    const start = new Date(2020, 0).getTime();
    const end = new Date(2021, 0).getTime();
    const timestamp = new Date(randomRange(start, end)).getTime();
    const req = request.post('http://localhost:3000/api/readings', {
        headers: {
            'Authorization': 'Api-Key 1234',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            sensorId: '5f41a70283d15aa51cec71b7',
            timestamp,
            temperature: randomRange(20, 40),
            pressure: randomRange(10, 30),
            humidity: randomRange(0, 100),
        }),
    });
    req.on('response', res => {

    });
}
