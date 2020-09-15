import mongoose from 'mongoose';

export enum WindDirection {
    N = 'N',
    NE = 'NE',
    E = 'E',
    SE = 'SE',
    S = 'S',
    SW = 'SW',
    W = 'W',
    NW = 'NW',
}

export interface Reading extends mongoose.Document {
    sensorId: mongoose.Types.ObjectId;
    day: Date;
    count: number;
    data: {
        timestamp: Date;
        temperature: number;
        humidity: number;
        pressure: number;
        windSpeed: number;
        windDirection: WindDirection;
        rainfall: number;
    }[];
}

const schema = new mongoose.Schema<Reading>({
    sensorId: mongoose.Types.ObjectId,
    day: Date,
    count: Number,
    data: [new mongoose.Schema({
        timestamp: Date,
        temperature: Number,
        humidity: Number,
        pressure: Number,
        windSpeed: Number,
        windDirection: {
            type: String,
            enum: Object.values(WindDirection),
        },
        rainfall: Number,
    }, {
        _id: false,
    })],
});

const Reading = mongoose.model<Reading>('Reading', schema);

export default Reading;
