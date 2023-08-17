
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/notification", (req, res) => {   
    pool.query("SELECT * FROM notification", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/notification/:id', (req, res) => {
    
    pool.query("SELECT * FROM notification where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
         pool.query(
                'UPDATE notification SET read=$1 WHERE id = $2',
                [true,id ],
                (err, result) => {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                     res.status(200).send(result1.rows)   
                    }
                }
            )
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/notification", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO notification (title,description,user_id,to_user_id) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.title,body.description,body.user_id,body.to_user_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/notification/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM notification WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/notification/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE notification SET title=$1,description=$2,user_id=$3,to_user_id=$4 WHERE id = $5',
        [body.title,body.description,body.user_id,body.to_user_id,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
})
router.get("/notification/read/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE notification SET read=$1 WHERE id = $2',
        [true,id ],
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