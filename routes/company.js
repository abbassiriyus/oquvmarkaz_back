
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var url = require('url');
var { ensureToken }=require("../token/token.js")
var fs=require("fs");
const { hostname } = require('os');
router.get("/company", (req, res) => {   
    console.log(req);
    pool.query("SELECT * FROM company", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/company/:id', (req, res) => {
    
    pool.query("SELECT * FROM company where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/company",ensureToken, (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName =Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
        pool.query('INSERT INTO company (email,twiter,image,call_me,whatsapp,address) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [body.email,body.twiter,req.protocol+"://"+req.hostname+"/"+imgName,body.call_me,body.whatsapp,body.address],
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

router.delete("/company/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM company where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                fs.unlink(`./Images/${(result1.rows[0].image).slice((result1.rows[0].image).lastIndexOf('/'))}`,()=>{})   
            }
            pool.query('DELETE FROM company WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(err)
                } else {
                    res.status(200).send("Deleted")
                }
            })
        } else {
            res.status(400).send(err)
        }
    })

   


})
router.put("/company/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM company where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
              if(req.files && result1.rows[0].image){
                imgName = result1.rows[0].image
            }else{
                imgName=req.body.image
            }
       pool.query(
        'UPDATE company SET email=$1,twiter=$2,image=$3,call_me=$4,whatsapp=$5,address=$6 WHERE id=$7',
        [body.email,body.twiter,imgName,body.call_me,body.whatsapp,body.address,id],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files && req.files.image){
                    const imgFile = req.files.image
                    imgFile.mv(`${__dirname}/Images/${imgName.slice(imgName.lastIndexOf('/'))}`)
                }
                res.status(200).send("Updated")
            }
        }
    )
} else {
    res.status(400).send(err)
}
    })
})

module.exports = router;