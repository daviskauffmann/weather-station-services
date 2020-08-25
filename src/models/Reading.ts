import mongoose from 'mongoose';

export interface Reading extends mongoose.Document {
    sensorId: mongoose.Types.ObjectId;
    day: Date;
    count: number;
    data: {
        timestamp: Date;
        temperature: number;
        humidity: number;
        pressure: number;
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
    }, {
        _id: false,
    })],
});

const Reading = mongoose.model<Reading>('Reading', schema);

export default Reading;
