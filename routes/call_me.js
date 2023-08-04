
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/call_me", (req, res) => {   
    pool.query("SELECT * FROM call_me", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/call_me/:id', (req, res) => {
    
    pool.query("SELECT * FROM call_me where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/call_me", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO call_me (fullname,email,message) VALUES ($1,$2,$3) RETURNING *',
        [body.fullname,body.email,body.message],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/call_me/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM call_me WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/call_me/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE call_me SET fullname=$1,email=$2,message=$3 WHERE id = $4',
        [body.fullname,body.email,body.message,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
})
router.get("/call_me/read/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE call_me SET read=$1 WHERE id = $2',
        [body.read,id ],
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