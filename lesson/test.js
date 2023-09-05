
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/test", (req, res) => {   
    pool.query("SELECT * FROM test", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})

router.get('/test/:id', (req, res) => {
    
    pool.query("SELECT * FROM test where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.get('/test/student/:id', (req, res) => {
let dateObject = new Date();
console.log("A date object is defined")

let date = (dateObject.getDate());
let month = (dateObject.getMonth());
let year = dateObject.getFullYear();

let hours = dateObject.getHours();
let minutes = dateObject.getMinutes();
let seconds = dateObject.getSeconds();
var a=year + "-" + month + "-" + date + " " + hours + ":" + minutes + ":" + seconds;
    pool.query("SELECT * FROM group_student where student_id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            pool.query("SELECT * FROM test", (err, result2) => {
                if (!err) {
        var test=[]
    for (let i = 0; i < result1.rows.length; i++) {
        for (let j = 0; j < result2.rows.length; j++) {
    if((result1.rows[i].education_id==result2.rows[j].education_id)&&(result2.rows[j].day).getDate()==date&&(result2.rows[j].day).getFullYear()==year&&(result2.rows[j].day).getMonth()==month&&`${result2.rows[j].start_time}`.slice(0,2)<hours&&`${result2.rows[j].end_time}`.slice(0,2)>hours){
        test.push(result2.rows[j])
       }}}
       res.status(200).send(test)
    } else {
                    res.send({err:err,message:"not found education"})
                }
            })
        } else {
            res.status(400).send(err)
        }
    })
})

router.post("/test",ensureToken, (req, res) => {
    const body = req.body;
        pool.query('INSERT INTO test (education_id,start_time,day,deadline,end_time,level_start,level_end,teacher_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [body.education_id,body.start_time,body.day,body.deadline,body.end_time,body.level_start,body.level_end,body.teacher_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/test/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM test WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/test/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE test SET education_id=$1,start_time=$2,day=$3,deadline=$4,end_time=$5,level_start=$6,level_end=$7,teacher_id=$8 WHERE id = $9',
        [body.education_id,body.start_time,body.day,body.deadline,body.end_time,body.level_start,body.level_end,body.teacher_id,id ],
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