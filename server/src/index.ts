import express from "express";
import log from "morgan";
import cookieParser from "cookie-parser";
import mongoose from 'mongoose';
import routes from './routes';
import cors from 'cors';
const app = express();

(async () => {
    await mongoose.connect(`mongodb://root:example@${process.env.MONGO_HOST || 'localhost'}:27017/`, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: true });

    app.use(log('dev'));
    app.use(cookieParser());
    app.use(express.json());

    const whitelist = ['http://localhost:9100', process.env.PUBLIC_URL || 'http://localhost'];

    const corsOptions : cors.CorsOptions = {
        origin: function (origin, callback) {
            if (!origin || whitelist.includes(origin)) {
                callback(null, true);
            } else callback(new Error('Not allowed by CORS'));
        },
        credentials: true
    };
    app.use(cors(corsOptions));
    
    app.use('/api', routes);

    app.listen(process.env.PORT || '9100', () => {
        console.log('Server has started!')
    });
})().catch(e => {
    throw e
});