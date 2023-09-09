
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/cours_types", (req, res) => {   
    pool.query("SELECT * FROM cours_types", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/cours_types/:id', (req, res) => {
    
    pool.query("SELECT * FROM cours_types where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/cours_types", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO cours_types (name) VALUES ($1) RETURNING *',
        [body.name],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/cours_types/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM cours_types WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/cours_types/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE cours_types SET name=$1 WHERE id = $2',
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