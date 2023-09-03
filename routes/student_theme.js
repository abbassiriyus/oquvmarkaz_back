
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/student_theme", (req, res) => {   
    pool.query("SELECT * FROM student_theme", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/student_theme/:id',ensureToken, (req, res) => {
    
    pool.query("SELECT * FROM student_theme where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/student_theme",ensureToken, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO student_theme (student_id,theme_id,complate) VALUES ($1,$2,$3) RETURNING *',
        [body.student_id,body.theme_id,body.complate],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/student_theme/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM student_theme WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/student_theme/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE student_theme SET student_id=$1,theme_id=$2,complate=$3  WHERE id = $4',
        [body.student_id,body.theme_id,body.complate,id ],
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