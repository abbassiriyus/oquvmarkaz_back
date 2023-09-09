var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureTokenSuper}=require("../token/token.js")
var fs =require("fs")
router.get("/student_sertificat", (req, res) => {   
    pool.query("SELECT * FROM Student_sertificat", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/student_sertificat/:id', (req, res) => {
    
    pool.query("SELECT * FROM Student_sertificat where student_id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})



router.delete("/student_sertificat/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM Student_sertificat WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/student_sertificat/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM Student_sertificat where id=$1", [req.params.id], (err, result1) => {
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
        'UPDATE Student_sertificat SET title=$1,description=$2,image=$3 WHERE id = $4',
        [body.title,body.description,imgName,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
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