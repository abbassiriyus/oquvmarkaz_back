
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/course_data_category", (req, res) => {   
    pool.query("SELECT * FROM course_data_category", (err, result) => {
        if (!err) {
        res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
})
router.get("/course_data_category/course/:id", (req, res) => {   
    pool.query("SELECT * FROM course_data_category", (err, result) => {
        if (!err) {
     var category=result.rows.filter(item=>item.course==req.params.id)

     pool.query("SELECT * FROM course_data_theme", (err, result) => {
        if (!err) {
       for (let i = 0; i < category.length; i++) {
       category[i].theme=result.rows.filter(item=>item.category==category[i].id)}
       var a=null
       if(category[0]){
      if(category[0].theme[0]){
       a=category[0].theme[0]
       }
       }
       res.status(200).send({all:category,one:a})
        } else {
            res.status(400).send(err)
        }
    })



        } else {
            res.send(err)
        }
    })
})
router.get('/course_data_category/:id', (req, res) => {
    
    pool.query("SELECT * FROM course_data_category where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/course_data_category",ensureTokenSuper, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO course_data_category (name,course) VALUES ($1,$2) RETURNING *',
        [body.name,body.course],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_data_category/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM course_data_category WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/course_data_category/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE course_data_category SET  name=$1,course=$2 WHERE id = $3',
        [body.name,body.course,id],
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