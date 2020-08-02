import mongoose from 'mongoose';

export interface Humidity extends mongoose.Document {
    value: number;
    date: Date;
}

const schema = new mongoose.Schema({
    value: Number,
    date: Date,
});

const Humidity = mongoose.model<Humidity>('Humidity', schema);

export default Humidity;
