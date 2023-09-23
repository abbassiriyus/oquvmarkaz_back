
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/mycard", (req, res) => {   
    pool.query("SELECT * FROM mycard", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/mycard/:id', (req, res) => {
    
    pool.query("SELECT * FROM mycard where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/mycard",ensureTokenSuper, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO mycard (card_number,card_user,card_name,card_time,teacher_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [body.card_number,body.card_user,body.card_name,body.card_time,body.teache_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/mycard/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM mycard WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/mycard/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE mycard SET card_number=$1,card_user=$2,card_name=$3,card_time=$4,teacher_id=$5 WHERE id = $6',
        [body.card_number,body.card_user,body.card_name,body.card_time,body.teache_id,id],
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