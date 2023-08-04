
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/test", (req, res) => {   
    pool.query("SELECT * FROM test", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/test/:id', (req, res) => {
    
    pool.query("SELECT * FROM test where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/test",ensureToken, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO test (education_id,start_time,day,deadline,end_time,level_start,level_end,teacher_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [body.education_id,body.start_time,body.day,body.deadline,body.end_time,body.level_start,body.level_end,body.teacher_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/test/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM test WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/test/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE test SET education_id=$1,start_time=$2,day=$3,deadline=$4,end_time=$5,level_start=$6,level_end=$7,teacher_id=$8 WHERE id = $9',
        [body.education_id,body.start_time,body.day,body.deadline,body.end_time,body.level_start,body.level_end,body.teacher_id,id ],
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