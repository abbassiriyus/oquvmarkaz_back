
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/language", (req, res) => {   
    pool.query("SELECT * FROM language", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})
router.get("/language/mass", (req, res) => {   
    pool.query("SELECT * FROM language", (err, result) => {
        if (!err) {
 var massiv=[]
            for (let i = 0; i < result.rows.length; i++) {
 massiv.push(result.rows[i])
    
 }
            res.status(200).send(massiv)

        } else {
            res.send(err)
        }
    })
})

router.get('/language/:id', (req, res) => {
    
    pool.query("SELECT * FROM language where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/language",ensureTokenSuper, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO language (lg) VALUES ($1) RETURNING *',
        [body.lg],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/language/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM language WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/language/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE language SET lg=$1    WHERE id = $2',
        [body.lg,id ],
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