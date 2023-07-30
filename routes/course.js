
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")


router.get("/course", (req, res) => {   
    pool.query("SELECT * FROM course", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/course/:id', (req, res) => { 
    pool.query("SELECT * FROM course where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/course", (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO course (name,description,price,planned_time,course_type,author,image) VALUES ($1,$2,$3,$4 ,$5,$6 ,$7 ) RETURNING *',
        [body.name,body.description,body.price,body.planned_time,body.course_type,body.author,body.image],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});
router.post("/course/register/:id", (req, res) => {
    const body = req.body;
    const id= req.params.id 
    var data=[]
     pool.query("SELECT * FROM course where id=$1", [req.params.id], (err, result) => {
        if (!err) {
           data=result.rows.filter(item=>item.id===id)
        } 
    })
    var result1
    const bearerHeader=req.headers['authorization']
    const bearer=bearerHeader.split(" ")
    const bearerToken=bearer[1]
    req.token=bearerToken
    jwt.verify(bearerToken,'secret',((require1,result2)=>{
    if(result2==undefined){
            res.status(502).send("token failed")
    }else{
    router.get('/users',ensureTokenSuper, function(req, res) {
    pool.query("SELECT * FROM users", (err, result) => {
                 if (!err) {
                 result1=result.rows.filter(item=>{item.password==result2.password}) 
                 }
             })  
         })
if(result1[0].balance>data[0].price) {
    pool.query(
        'UPDATE base_theme SET balance=$1  WHERE id = $2',
        [(require1[0].balance-data[0].price),result1[0].id],
        (err, result) => {
           pool.query('INSERT INTO registerCourse(course,users) VALUES ($1,$2) RETURNING *',
        [data[0].id,require1[0].id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("kursni sotib oldingiz");
            }
        });  
        })
     
}else{
    res.status(405).send("mablag yetarli emas")
}}}))});
router.delete("/course/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM course WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/course/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE course SET name=$1    WHERE id = $2',
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