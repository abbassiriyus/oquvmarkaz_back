
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")



function ensureToken(req,res,next){
    const bearerHeader=req.headers['authorization']
    if( typeof bearerHeader!== 'undefined'){
    const bearer=bearerHeader.split(" ")
    const bearerToken=bearer[1]
    req.token=bearerToken
    jwt.verify(bearerToken,'secret',((require1,result1)=>{
        if(result1==undefined){
            res.status(502).send("token failed")
        }else{
         next()
        }
     }))
    }else{
        res.status(403)
    }
}




function ensureTokenSuper(req,res,next){
    const bearerHeader=req.headers['authorization']
    if( typeof bearerHeader!== 'undefined'){
    const bearer=bearerHeader.split(" ")
    const bearerToken=bearer[1]
    req.token=bearerToken
    jwt.verify(bearerToken,'secret',((require1,result1)=>{
        if(result1==undefined || result1.position!=3){
            res.status(502).send("token failed")
        }else{
         next()
        }
     }))
    }else{
        res.status(403)
    }
}
function ensureTokenTeacher(req,res,next){
    const bearerHeader=req.headers['authorization']
    if( typeof bearerHeader!== 'undefined'){
    const bearer=bearerHeader.split(" ")
    const bearerToken=bearer[1]
    req.token=bearerToken
    jwt.verify(bearerToken,'secret',((require1,result1)=>{
        if(result1==undefined || result1.position!=2){
            res.status(502).send("token failed")
        }else{
         next()
        }
     }))
    }else{
        res.status(403)
    }
}

function superTeacher(req,res,next){
    const bearerHeader=req.headers['authorization']
    if( typeof bearerHeader!== 'undefined'){
    const bearer=bearerHeader.split(" ")
    const bearerToken=bearer[1]
    req.token=bearerToken
    jwt.verify(bearerToken,'secret',((require1,result1)=>{
        if(result1==undefined || result1.position<2 ){
            res.status(502).send("token failed")
        }else{
         next()
        }
     }))
    }else{
        res.status(403)
    }
}

module.exports={ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher}