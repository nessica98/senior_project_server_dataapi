const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const app_mode = process.env.APP_MODE
const logging = require('./configs/logging')
const app = express();


var allowlist = ['http://localhost:4200', 'http://18.207.139.213','http://localhost:4201']
var corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (allowlist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    corsOptions = { origin: false } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}

app.use(cors(corsOptionsDelegate));

// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

const ApiRoute = require('./api.route')
app.use('/api', ApiRoute)

const db = require('./models')
const sequelize = db.sequelize
sequelize.sync({ force:false }).then((val) => {
  //console.log('DB start run')
  logging.info("DB start run")
}).catch((err)=>{
  logging.error("database error", err)
})

// set port, listen for requests
const PORT = process.env.PORT || 5020;
app.listen(PORT, () => {
  logging.info(`Server is running on port ${PORT}.`);
  //console.log(`Server is running on port ${PORT}.`);
});

process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Process terminated')
  })
})
