
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/payment", (req, res) => {   
    pool.query("SELECT * FROM payment", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/payment/:id', (req, res) => {
    
    pool.query("SELECT * FROM payment where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/payment", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO payment (amout,user_id) VALUES ($1,$2) RETURNING *',
        [body.amout,body.user_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/payment/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM payment WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/payment/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE payment SET amout=$1,user_id=$2 WHERE id = $3',
        [body.amout,body.user_id,id ],
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