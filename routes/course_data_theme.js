
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
 
//    ishlash kerak
router.post("/course_data_theme", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO course_data_theme (id,name,content,image,vidio,links,extra_data,subcadegory) VALUES ($1,$2,$3,$4,$5 $6 $7 $8) RETURNING *',
        [body.id,body.name,body.content,body.image,body.vidio,body.links,body.extra_data,body.subcategory],
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
        'UPDATE course_data_theme SET name=$1    WHERE id = $2',
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