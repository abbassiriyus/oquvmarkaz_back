
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/attendance_lesson", (req, res) => {   
    pool.query("SELECT * FROM attendance_lesson", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/attendance_lesson/:id', (req, res) => {
    
    pool.query("SELECT * FROM attendance_lesson where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/attendance_lesson",ensureToken, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO attendance_lesson (lesson_id,student_id,mark,came) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.lesson_id,body.student_id,body.mark,body.came],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/attendance_lesson/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM attendance_lesson WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/attendance_lesson/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE attendance_lesson SET lesson_id=$1,student_id=$2,mark=$3,came=$4 WHERE id = $5',
        [body.lesson_id  ,body.student_id,body.mark,body.came,id ],
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