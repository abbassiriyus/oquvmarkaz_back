

var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var { ensureToken }=require("../token/token.js")
const fs=require('fs')
router.get("/servis", (req, res) => {   
    pool.query("SELECT * FROM servis", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/servis/:id', (req, res) => {
    
    pool.query("SELECT * FROM servis where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/servis", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
        pool.query('INSERT INTO servis (title,deckription,image) VALUES ($1,$2,$3) RETURNING *',
        [body.title,body.deckription,`https:${req.hostname}/${imgName}`],
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

router.delete("/servis/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM servis where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
              fs.unlink(`./Images/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM servis WHERE id = $1', [id], (err, result) => {
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
router.put("/servis/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM servis where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                fs.unlink(`./Images/${result1.rows[0].image}`,()=>{})   
              }
              if(req.files){
                const imgFile = req.files.image
                 imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE servis SET title=$1,deckription=$2,image=$3 WHERE id = $4',
        [body.title,body.deckription,`https:${req.hostname}/${imgName}`,id ],
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