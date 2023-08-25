var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const fs=require('fs')

router.get('/pay',(req,res)=>{

    fs.readFile('./configpayment.txt',{encoding: 'utf-8'},(err,data)=>{
   if(!err){
res.status(200).send(data)
   }else{
    res.status(400).send(err)
   }
        
    })
})





module.exports = router;