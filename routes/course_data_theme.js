
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/course_data_theme", (req, res) => {   
    pool.query("SELECT * FROM course_data_theme", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/course_data_theme/:id', (req, res) => { 
    pool.query("SELECT * FROM course_data_theme where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
 

router.post("/course_data_theme", (req, res) => {
    const body = req.body;
    const imgFile = req.files.image
    const imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
        pool.query('INSERT INTO course_data_theme (name,content,image,video,extra_data,cadegory) VALUES ($1,$2,$3,$4,$5, $6) RETURNING *',
        [body.name,body.content,body.image,body.video,body.extra_data,body.category],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_data_theme/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM course_data_theme WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/course_data_theme/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE course_data_theme SET name=$1,content=$2,image=$3,video=$4,extra_data=5,category=$6 WHERE id = $7',
        [body.name,body.content,body.image,body.video,body.extra_data,body.category,id ],
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