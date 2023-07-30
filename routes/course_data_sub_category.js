
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/course_data_sub_category", (req, res) => {   
    pool.query("SELECT * FROM course_data_sub_category where id=$1 name=$2 category=$3", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/course_data_sub_category/:id', (req, res) => {
    
    pool.query("SELECT * FROM course_data_sub_category where id=$1 name=$2 category=$3 ", [req.id.name.cotegory], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/course_data_sub_category/:id", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO course_data_sub_category (name,id,category) VALUES ($1, $2, $3) RETURNING *',
        [body.id.body.name,body.cotegory],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_data_sub_category/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM course_data_sub_category WHERE id = $1  name=$2 category=$3 ', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/course_data_sub_category/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE course_data_sub_category SET name=$1  WHERE id = $2 category=$3',
        [body.name,body.id,body.cotegory ],
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