import express from 'express';
import logger from './middleware/logger.js';
import userRouter from './routes/userRoutes.js';
import authRouter from './routes/authRoutes.js';
import errorHandler from './errors/errors.js';
import cors from 'cors';
import db from './config/dbPool.js';

// connect to database
try {
    await db.connect();
    console.log('Connected to database');
} catch (error) {
    console.error('Error connecting to database:', error);
}

const app = express();
const port = process.env.PORT || 8080;

// set up cors
app.use(cors());

// set up json and urlencoded
app.use(express.json());
app.use(express.urlencoded({extended: true}));
// set up logger
app.use(logger);
app.use()

// set up routers
app.use('/api/auth', authRouter)
app.use('/api/admin', userRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// customer error handler
app.use(errorHandler);


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
