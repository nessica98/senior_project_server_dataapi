const router = require('express').Router()
const db = require('./models')
const NodeData = db.nodedata
const NodeOwner = db.NodeOwner
const { v4: uuidv4 } = require('uuid');
const logging = require('./configs/logging')

router.post('/adduser', (req,res)=>{
    const {nodeownername,raw_password} = req.body;
    const newowner = {NodeOwnerId:uuidv4(),NodeOwnerName:nodeownername}
    NodeOwner.create(newowner).then((result)=>{
        res.send({status:"add complete",data:result})
    }).catch((reason)=>{
        console.error(reason)
        
        res.status(500).send({status:"error",reason:reason})
    })
    
})

router.post('/add', async (req,res)=>{
    const {nodename,node_startdate,nodeowner } = req.body
    logging.debug("/api/node/add call")
    if(!(nodename && node_startdate && nodeowner)) {
        res.sendStatus(400);
        return
    }
    const ownerid = await NodeOwner.findOne({where: {NodeOwnerName:nodeowner},raw:true}, {attribute:['NodeOwnerId']})
    //logging.debug(ownerid.NodeOwnerId)
    //console.log(ownerid.NodeOwnerId)
    if(ownerid && ownerid.NodeOwnerId){
        const newnode = {nodename:nodename,nodestartwork:new Date(node_startdate),nodeackupdate:new Date(),nodeupdate:new Date(),nodeownerNodeOwnerId:ownerid.NodeOwnerId,NodeOwnerId:ownerid}
        NodeData.create(newnode).then((result)=>{
            res.send({status:"add complete",data:result})
        }).catch((reason)=>{
            logging.error("error occur", reason)
            //console.log(reason)
            res.sendStatus(500)
        })
        
    }else{
        res.status(404).json({status:"nodeowner not found"})
    }
})

module.exports = router