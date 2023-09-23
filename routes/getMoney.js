
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/getMoney", (req, res) => {   
    pool.query("SELECT * FROM getMoney", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/getMoney/:id', (req, res) => {
    
    pool.query("SELECT * FROM getMoney where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/getMoney",ensureTokenSuper, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO getMoney (card_number,card_user,card_name,card_time,teacher_id,money,status) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [body.card_number,body.card_user,body.card_name,body.card_time,body.teache_id,body.money,body.status],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/getMoney/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM getMoney WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/getMoney/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE getMoney SET card_number=$1,card_user=$2,card_name=$3,card_time=$4,teacher_id=$5,money=$6,status=$7 WHERE id = $8',
        [body.card_number,body.card_user,body.card_name,body.card_time,body.teache_id,body.money,body.status,id],
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