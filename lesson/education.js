
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/education", (req, res) => {   
    pool.query("SELECT * FROM education", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/education/:id', (req, res) => {
    
    pool.query("SELECT * FROM education where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/education",ensureToken, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO education (education_name,description,start_date,end_date) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.education_name,body.description,body.start_date,body.end_date],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/education/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM education WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/education/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE education SET education_name=$1,description=$2,start_date=$3,end_date=$4 WHERE id = $5',
        [body.education_name,body.description,body.start_date,body.end_date,id ],
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