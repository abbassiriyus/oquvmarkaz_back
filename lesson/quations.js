
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken }=require("../token/token.js")
const fs =require("fs")
 router.get("/quations", (req, res) => {   
     pool.query("SELECT * FROM quations", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
     })
   })

router.get('/quations/:id', (req, res) => {
    
    pool.query("SELECT * FROM quations where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/quations", (req, res) => {
    console.log("hello");
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName = `https://${req.hostname}/`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
    pool.query('INSERT INTO quations (question,answer,image,variant1,variant2,variant3,variant4,test_id) VALUES ($1 ,$2 ,$3 ,$4 ,$5,$6,$7,$8 ) RETURNING *',
        [body.question,body.answer,imgName,body.variant1,body.variant2,body.variant3,body.variant4,body.test_id],
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

router.delete("/quations/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM quations where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                 
            }
            pool.query('DELETE FROM quations WHERE id = $1', [id], (err, result) => {
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
router.put("/quations/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    var imgName=""
  if(body){
    pool.query("SELECT * FROM quations where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                   
              }
              if(req.files){
                const imgFile = req.files.image
                 imgName = `https://${req.hostname}/`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE quations SET question=$1,answer=$2,image=$3,variant1=$4,variant2=$5,variant3=$6,variant4=$7,test_id=$8 WHERE id=$9',
        [body.question,body.answer,imgName,body.variant1,body.variant2,body.variant3,body.variant4,body.test_id,id ],
        (err, result) => {
            if (err) {
                res.status(400).send({err:err,message:'savol ioliq emas'})
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
  }else{
    res.status(430).send("data yuborimadi")
  }
})

module.exports = router;