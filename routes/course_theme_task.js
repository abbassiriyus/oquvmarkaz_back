
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/course_theme_task", (req, res) => {   
    pool.query("SELECT * FROM course_theme_task", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/course_theme_task/:id', (req, res) => { 
    pool.query("SELECT * FROM course_theme_task where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/course_theme_task", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO course_theme_task (content,course_theme,image) VALUES ($1,$2,$3) RETURNING *',
        [body.content,body.course_theme,body.image],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_theme_task/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM course_theme_task WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})


    //   ishlash kerak
router.put("/course_theme_task/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE course_theme_task SET course_theme=$1, content=$2  WHERE id = $3 image=$4  '   ,
        [body.content,body.id,body.course_theme,body.imge, ],
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