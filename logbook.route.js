const router = require('express').Router()
const db = require('./models')
const LogbookData = db.LogbookData
const LogbookListData = db.LogbookListData

// gateway only!!
router.get('/:nodename', (req,res)=>{
    const {nodename} = req.params
    LogbookData.findAll({where: {nodename:nodename}, include: [{ model: LogbookListData, as: 'lists' }] }).then((data) => {
        data = data.map(val => val.dataValues)
        console.log(data)
        res.send(data)
    })
})

router.post('/add',(req,res)=>{
    const {LogbookId,nodename,LogbookList} = req.body;
    LogbookData.create({
        LogbookListId: LogbookId,
        nodename: nodename,
        lists: LogbookList
    }, { include: [{ model: LogbookListData, as: 'lists' }] }).then((val)=>{
        res.send({status:'complete'})
    }).catch((err)=>{
        res.sendStatus(500)
    })
})

module.exports = router