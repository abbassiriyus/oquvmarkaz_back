var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const http=require("http")
const fs =require("fs")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")
var { Server } =require("socket.io")

const server=http.createServer(router)
const io=new Server(server)

const userSockets={}
io.on('connection',(socket)=>{
console.log(`user id ${socket.id}`);
})





module.exports = router;