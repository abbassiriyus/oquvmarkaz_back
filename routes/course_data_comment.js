
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/course_theme_comment", (req, res) => {   
    pool.query("SELECT * FROM course_theme_comment", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/course_theme_comment/:id', (req, res) => { 
    pool.query("SELECT * FROM course_theme_comment where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
 
//    ishlash kerak
router.post("/course_theme_comment", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO course_theme_comment (theme,image,text,subcomment,user) VALUES ($1,$2,$3,$4,$5) RETURNING *',
        [body.theme,body.image,body.text,body.subcomment,body.user],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_theme_comment/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM course_theme_comment WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/course_theme_comment/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE course_theme_comment SET name=$1    WHERE id = $2',
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