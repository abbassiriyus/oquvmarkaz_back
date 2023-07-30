
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


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
    const imgFile = req.files.image
    const imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
        pool.query('INSERT INTO knowladge (name,description,image,link) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.name,body.description,imgName,body.link,],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                imgFile.mv(`${__dirname}/Images/${imgName}`)
                res.status(201).send("Created");
            }
        });
});

router.delete("/knowladge/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM knowladge WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/knowladge/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE knowladge SET name=$1,description=$2,image=$3,link=$4    WHERE id = $5',
        [body.name,body.description,body.image,body.link,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
})

module.exports = router;