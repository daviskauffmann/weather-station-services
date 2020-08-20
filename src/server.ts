import mongoose from 'mongoose';
import app from './app';

mongoose.connect(process.env.MONGODB_URI!, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
}, err => {
    if (err) throw err;
    console.log(`Connected to ${process.env.MONGODB_URI}`);

    app.listen(process.env.PORT, () => {
        console.log(`Server listening on port ${process.env.PORT}`);
    });
});
