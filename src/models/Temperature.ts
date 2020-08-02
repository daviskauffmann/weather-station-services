import mongoose from 'mongoose';

export interface Temperature extends mongoose.Document {
    value: number;
    date: Date;
}

const schema = new mongoose.Schema({
    value: Number,
    date: Date,
});

const Temperature = mongoose.model<Temperature>('Temperature', schema);

export default Temperature;
