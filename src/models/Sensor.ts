import mongoose from 'mongoose';

export interface Sensor extends mongoose.Document {
    name: string;
    createdOn: Date;
}

const schema = new mongoose.Schema({
    name: String,
    createdOn: Date,
});

const Sensor = mongoose.model<Sensor>('Sensor', schema);

export default Sensor;
