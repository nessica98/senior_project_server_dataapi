const router = require("express").Router();
const bodyParser = require("body-parser");
const cors = require("cors");
require('dotenv').config()
const app_mode = process.env.APP_MODE


// simple route
router.get("/", (req, res) => {
  res.json({ message: "Welcome to boatapp application." });
});

const db = require('./models')
const gpsRoute = require('./gps.route')

const gatewayRoute = require('./gateway.route')
const LogbookRoute = require('./logbook.route')
const bulkTxRoute = require('./bulk.route')
const authRoute = require('./auth.route')
const nodeRoute = require('./node.route')

const sequelize = db.sequelize
const NodeGPS = db.nodegpsdata

router.use('/gps', gpsRoute)
router.use('/logbook', LogbookRoute)
router.use('/gateway', gatewayRoute)
router.use('/_bulk',bulkTxRoute)
// if (app_mode === 'Server') {
//   console.log('SERVER')
//   router.use('/gateway', gatewayRoute)
//   router.use('/_bulk', bulkTxRoute)
// } else if (app_mode === 'Gateway') {
//   router.use('/authen',authRoute)
//   console.log('GATEWAY')
  
// }

module.exports = router