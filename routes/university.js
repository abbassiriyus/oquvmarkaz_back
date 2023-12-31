
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var { ensureToken }=require("../token/token.js")
const fs=require('fs')
router.get("/university", (req, res) => {   
    pool.query("SELECT * FROM university", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/university/:id', (req, res) => {

    pool.query("SELECT * FROM course where homiy_id=$1",[req.params.id],(err1, result1) => {
        if (!err1) { 
         pool.query("SELECT id,rating,course FROM registerCourse",(err,result)=>{
            if(!err){
     for (let i = 0; i < result1.rows.length; i++) {
      var a=0
      var b=0
    for (let j = 0; j < result.rows.length; j++) {
       if(result1.rows[i].id==result.rows[j].course){
       a=a+result.rows[j].rating
       b++
       }
    }
    result1.rows[i].star=a/b
    } res.status(200).send(result1.rows)}})
        } else {
            res.status(400).send(err1)
        }
    })

})


router.post("/university", (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files &&req.files.image){
        const imgFile = req.files.image
         imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
    if(req.files && req.files.logo){
        const logoFile = req.files.logo
         logoName = Date.now()+logoFile.name.slice(logoFile.name.lastIndexOf('.'))
    }else{
        logoName=req.body.logo
    }
        pool.query('INSERT INTO university (title,deckription,image,logo) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.title,body.deckription,req.protocol+"://"+req.hostname+"/"+imgName,req.protocol+"://"+req.hostname+"/"+logoName],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files && req.files.logo){
                    const logoFile = req.files.image
                    logoFile.mv(`${__dirname}/Images/${logoName}`)
                }
                if(req.files&&req.files.image){
                    const imgFile = req.files.image
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(201).send("Created");
            }
        });
});

router.delete("/university/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM university where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                fs.unlink(`${__dirname}/Images/${(result1.rows[0].image).slice((result1.rows[0].image).lastIndexOf('/'))}`,()=>{})  
                fs.unlink(`./Images/${(result1.rows[0].logo).slice((result1.rows[0].logo).lastIndexOf('/'))}`,()=>{})  
            }
            pool.query('DELETE FROM university WHERE id = $1', [id], (err, result) => {
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
router.put("/university/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM university where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].image){
                   
              }
              if(req.files && req.files.image ){
                const imgFile = req.files.image
                 imgName =  result1.rows[0].image
            }else{
                imgName=req.body.image
            }
            if(req.files && req.files.logo){
                const logoFIle = req.files.logo
                 logoName = result1.rows[0].logo
            }else{
                imgName=req.body.logo
            }
    pool.query(
        'UPDATE university SET title=$1,deckription=$2,image=$3,logo=$4 WHERE id = $5',
        [body.title,body.deckription,imgName,logoName,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files && req.files.image){
                    const imgFile = req.files.image
                   imgFile.mv(`${__dirname}/Images/${imgName.slice(imgName.lastIndexOf('/'))}`)
                    }
                    if(req.files && req.files.logo){
                        const imgFile = req.files.logo
                       imgFile.mv(`${__dirname}/Images/${logoName.slice(logoName.lastIndexOf('/'))}`)
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