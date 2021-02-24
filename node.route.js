const router = require('express').Router()
const db = require('./models')
const NodeData = db.nodedata
const NodeOwner = db.NodeOwner

router.post('/adduser', (req,res)=>{
    const {nodeownername,raw_password} = req.body;
    const newowner = {NodeOwnerId:uuidv4(),NodeOwnerName:nodeownername, NodeOwnerKeyHd5:raw_password}
    NodeOwner.create(newowner).then((result)=>{
        res.send({status:"add complete",data:result})
    }).catch((reason)=>{
        console.error(reason)
        
        res.status(500).send({status:"error",reason:reason})
    })
    
})

router.post('/add', async (req,res)=>{
    const {nodename,node_startdate,nodeowner } = req.body
    if(!(nodename && node_startdate && nodeowner)) {
        res.sendStatus(400);
        return
    }
    const ownerid = await NodeOwner.findOne({where: {NodeOwnerName:nodeowner},raw:true}, {attribute:['NodeOwnerId']})
    console.log(ownerid.NodeOwnerId)
    if(ownerid.NodeOwnerId){
        const newnode = {nodename:nodename,nodestartwork:new Date(node_startdate),nodeackupdate:new Date(),nodeupdate:new Date(),nodeownerNodeOwnerId:ownerid.NodeOwnerId,NodeOwnerId:ownerid}
        NodeData.create(newnode).then((result)=>{
            res.send({status:"add complete",data:result})
        }).catch((reason)=>{
            console.log(reason)
            res.sendStatus(500)
        })
        
    }else{
        res.status(404).json({status:"nodeowner not found"})
    }
})

module.exports = router