
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")
const fs=require("fs")
router.get("/help_category", (req, res) => {   
    pool.query("SELECT * FROM help_category", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/help_category/:id', (req, res) => {
    
    pool.query("SELECT * FROM help_category where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/help_category", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName = `https:${req.hostname}/${imgName}`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
        pool.query('INSERT INTO help_category (name,image) VALUES ($1,$2) RETURNING *',
        [body.name,imgName],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files && req.files.image){
                    const imgFile = req.files.image
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(201).send("Created");
            }
        });
});

router.delete("/help_category/:id", (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM help_category where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
              fs.unlink(`./Images/${result1.rows[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM help_category WHERE id = $1', [id], (err, result) => {
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
router.put("/help_category/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM help_category where id=$1", [req.params.id], (err, result1) => {
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
        'UPDATE help_category SET name=$1,image=$2 WHERE id = $3',
        [body.name,imgName,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files && req.files.image){
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