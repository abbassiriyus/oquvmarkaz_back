
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/group_student", (req, res) => {   
    pool.query("SELECT * FROM group_student", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/group_student/:id', (req, res) => {
    
    pool.query("SELECT * FROM group_student where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})

router.post("/group_student",superTeacher, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO group_student (student_id,education_id) VALUES ($1,$2) RETURNING *',
        [body.student_id,body.education_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/group_student/:id",superTeacher, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM group_student WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/group_student/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE group_student SET student_id=$1,education_id=$2    WHERE id = $3',
        [body.student_id,body.education_id,id ],
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