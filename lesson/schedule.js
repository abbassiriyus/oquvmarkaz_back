
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/schedule", (req, res) => {   
    pool.query("SELECT * FROM schedule", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/schedule/:id', (req, res) => {
    
    pool.query("SELECT * FROM schedule where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/schedule",ensureToken, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO schedule (lesson_name,education_id,start_time,day,end_time,teacher_id) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
        [body.lesson_name,body.education_id,body.start_time,body.day,body.end_time,body.teacher_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/schedule/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM schedule WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/schedule/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE schedule SET lesson_name=$1,education_id=$2,start_time=$3,day=$4,end_time=$5,teacher_id=$6 WHERE id = $7',
        [body.lesson_name,body.education_id,body.start_time,body.day,body.end_time,body.teacher_id,id ],
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