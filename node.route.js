const router = require('express').Router()
const db = require('./models')
const NodeData = db.nodedata
const NodeOwner = db.NodeOwner

router.post('/add', async (req,res)=>{
    const {nodename,node_startdate,nodeowner } = req.body
    if(!(nodename && node_startdate && nodeowner)) {
        res.sendStatus(400);
        return
    }
    const ownerid = await NodeOwner.findOne({where: {NodeOwnerName:nodeowner},raw:true}, {attribute:['NodeOwnerId']})
    console.log(ownerid.NodeOwnerId)
    if(ownerid){
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