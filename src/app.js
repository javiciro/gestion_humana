require('dotenv').config();
const express = require('express');
const config = require('./config');



const app = express(); // Creates an Express application instance

app.set('port', config.app.port); // Sets the port for the Express application

module.exports = app; // Exports the Express application instance
