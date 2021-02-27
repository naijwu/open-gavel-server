const dotenv = require('dotenv');
dotenv.config();

const express = require('express');
var cors = require('cors')
const app = express();
const mongoose = require('mongoose');

// dev purposes
mongoose.set('debug', true);


// import routes
const authRoute = require('./routes/auth'); 
const staffRoute = require('./routes/staff'); 
const secretariatRoute = require('./routes/secretariat'); 
const committeeRoute = require('./routes/committee');


mongoose.connect(process.env.DB_CONNECT, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', (error) => console.error(error)); // always, on error
db.once('open', () => console.log('Connected to database!')) // once, on open

const corsConfig = {
    origin: process.env.CLIENT_URL,
    optionsSuccessStatus: 200
}

app.options('*', cors());
app.use(cors());

app.use(express.json()); // accept json


// use routes
app.use('/authentication', authRoute); // API routes for Secretariat registrations and All logins
app.use('/staff', staffRoute); // API routes for Sec to manage their staff accounts
app.use('/secretariat', secretariatRoute); // API routes for Secretariat (for them to edit their own profiles)
app.use('/committee', committeeRoute)


const port = process.env.PORT || 8080; // can do 'export PORT=X' to change env variable
app.listen(port, () => {
    console.log(`Server running on port ${port}! (CORS-enabled)`)
});