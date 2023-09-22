
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureTokenSuper}=require("../token/token.js")
var fs =require("fs")
router.get("/knowladge", (req, res) => {   
    pool.query("SELECT * FROM knowladge", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/knowladge/:id', (req, res) => {
    
    pool.query("SELECT * FROM knowladge where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/knowladge", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
        pool.query('INSERT INTO knowladge (name,description,image,link,base_theme) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [body.name,body.description,req.protocol+"://"+req.hostname+"/"+imgName,body.link,body.base_theme],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
           if(req.files){
            const imgFile = req.files.image
           imgFile.mv(`${__dirname}/Images/${imgName}`)
            }
                res.status(201).send("Created");
            }
        });
});

router.delete("/knowladge/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM knowladge WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/knowladge/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    var imgName="";
    if(req.files){
    var imgFile = req.files.image
     imgName=Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
     }else{
      imgName=req.body.image
     }
    pool.query(
        'UPDATE knowladge SET name=$1,description=$2,image=$3,link=$4,base_theme=$5   WHERE id = $6',
        [body.name,body.description,req.protocol+"://"+req.hostname+"/"+imgName,body.link,body.base_theme,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files){
                    const imgFile = req.files.image
                   imgFile.mv(`${__dirname}/Images/${imgName}`)
                    }
                res.status(200).send("Updated")
            }
        }
    )
})

module.exports = router;