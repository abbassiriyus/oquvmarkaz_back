
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/base_theme", (req, res) => {   
    pool.query("SELECT * FROM base_theme", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/base_theme/:id', (req, res) => {
    
    pool.query("SELECT * FROM base_theme where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/base_theme",ensureTokenSuper, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO base_theme (name) VALUES ($1) RETURNING *',
        [body.name],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/base_theme/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM base_theme WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/base_theme/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE base_theme SET name=$1    WHERE id = $2',
        [body.name,id ],
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