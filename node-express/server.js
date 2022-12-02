

require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const schedule = require('node-schedule');

const app = express();

// Security HTTP headers
app.use(helmet());

// user Boday Parser
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' }));

// Development Logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// CORS Policy
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*')
    res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept, Authorization',
    );
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    next();
});
const whitelist = [
    'http://localhost:3000',
];
const corsOptions = {
    origin: (origin, callback) => {
        if (whitelist.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
};
app.use(cors(corsOptions));

// user cokies
if (process.env.COOKIE_SECRET) {
    app.use(cookieParser(COOKIES.SECRET));
} else {
    app.use(cookieParser());
}

// Jobs
const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [0, new schedule.Range(0, 6)];
rule.hour = 12;
rule.minute = 0;

schedule.scheduleJob(rule, async () => {

});

const port = process.env.PORT || '4000';
app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
