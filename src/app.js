require('dotenv').config();
const express = require('express');
const cors = require("cors")

const config = require('./config');



const app = express(); // Creates an Express application instance
app.use(cors());
app.set('port', config.app.port); // Sets the port for the Express application

module.exports = app; // Exports the Express application instance
