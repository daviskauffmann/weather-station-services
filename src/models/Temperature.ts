import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    value: Number,
    date: Date,
});

const Temperature = mongoose.model('Temperature', schema);

export default Temperature;
