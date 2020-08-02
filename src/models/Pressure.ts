import mongoose from 'mongoose';

export interface Pressure extends mongoose.Document {
    value: number;
    date: Date;
}

const schema = new mongoose.Schema({
    value: Number,
    date: Date,
});

const Pressure = mongoose.model<Pressure>('Pressure', schema);

export default Pressure;
