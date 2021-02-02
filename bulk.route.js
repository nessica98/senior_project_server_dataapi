const router = require('express').Router()
const moment = require('moment')

const db = require('./models')
const sequelize = db.sequelize
const GatewayData = db.GatewayData
const nodeGPSdata = db.nodegpsdata
const nodedata = db.nodedata

// server listen : add to server db
router.post('/post',async (req,res)=>{
    const {gatewayId,last_update,payload} = req.body
    if(!(gatewayId && last_update && payload)) {
        console.log('aaa')
        res.sendStatus(400);
        return;
    }
    if(!Array.isArray(payload)){
        console.log('bbb')
        res.sendStatus(400)
        return;
    }
    var nodelist_new = new Set()
    payload.forEach((val,idx)=>{
        console.log('add to db', val);
        nodelist_new.add(val.nodeName)
        var new_GPSrow = nodeGPSdata.build(val)
        new_GPSrow.save().then((result)=>{
            console.log()
        }).catch((err)=>{
            console.error(err)
        })
    })
    nodelist_new.forEach((val)=>{
        console.log(val)
        nodedata.update({nodeupdate:new Date()},{ 
        where: {
          nodename:val
        }
      })
    })
    res.send('add to server DB')
})

module.exports = router