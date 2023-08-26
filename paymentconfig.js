var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

const fs=require('fs')

router.get('/pay',(req,res)=>{

    fs.readFile('./configpayment.txt',{encoding: 'utf-8'},(err,data)=>{
   if(!err){
res.status(200).send(JSON.parse(data))
   }else{
    res.status(400).send(err)
   }
        
    })
})


router.put('/pay',(req,res)=>{
var body=req.body
    fs.readFile('./configpayment.txt',{encoding: 'utf-8'},(err,data)=>{
        if(!err){
            var data2=JSON.parse(data)
  var put={
    "public_key":body.public_key?body.public_key:data2.public_key,
    "strip_key":body.strip_key?body.strip_key:data2.strip_key,
    "paypal_kluch":body.paypal_kluch?body.paypal_kluch:data2.paypal_kluch
  }
   fs.writeFileSync('./configpayment.txt',JSON.stringify(put),{encoding: 'utf-8'})
  res.status(200).send("update")

        }else{
         res.status(400).send(err)
        }
             
         })
})


module.exports = router;