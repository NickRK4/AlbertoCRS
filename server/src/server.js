import express from 'express';
import logger from './middleware/logger.js';
import router from './routes/adminRoutes.js';
import errorHandler from './errors/errors.js';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 8080;

// set up cors
app.use(cors());

// set up json and urlencoded
app.use(express.json());
app.use(express.urlencoded({extended: true}));

// set up router
app.use('/api', router);

// set up logger
app.use(logger);

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
