import mongoose from 'mongoose';

export interface Reading extends mongoose.Document {
    temperature: number;
    pressure: number;
    humidity: number;
    date: Date;
}

const schema = new mongoose.Schema({
    temperature: Number,
    pressure: Number,
    humidity: Number,
    date: Date,
});

const Reading = mongoose.model<Reading>('Reading', schema);

export default Reading;
