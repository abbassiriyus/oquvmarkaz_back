

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var { ensureToken }=require("../token/token.js")
const fs=require('fs')
router.get("/homiy", (req, res) => {   
    pool.query("SELECT * FROM homiy", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/homiy/:id', (req, res) => {
    
    pool.query("SELECT * FROM homiy where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/homiy", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName = `https:${req.hostname}/${imgName}`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
    pool.query('INSERT INTO homiy (title,deckription,image,admin_id) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.title,body.deckription,imgName,body.admin_id],
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

router.delete("/homiy/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM homiy where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
              fs.unlink(`./Images/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM homiy WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(err)
                } else {
                    if(req.files){
                        const imgFile = req.files.image
                        imgFile.mv(`${__dirname}/Images/${imgName}`)
                    }
                    res.status(200).send("Deleted")
                }
            })
        } else {
            res.status(400).send(err)
        }
    })

   


})
router.put("/homiy/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM homiy where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                fs.unlink(`./Images/${result1.rows[0].image}`,()=>{})   
              }
              if(req.files){
                const imgFile = req.files.image
                 imgName = `https:${req.hostname}/${imgName}`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE homiy SET title=$1,deckription=$2,image=$3,admin_id=$5 WHERE id = $4',
        [body.title,body.deckription,imgName,id,body.admin_id],
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
} else {
    res.status(400).send(err)
}
    })
})

module.exports = router;