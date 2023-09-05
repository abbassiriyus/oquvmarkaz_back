
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var pool = require("../db")
var fs =require("fs")
var {ensureToken,superTeacher }=require("../token/token.js")

router.get("/course", (req, res) => {   
    pool.query("SELECT * FROM course", (err1, result1) => {
        if (!err1) { 
         pool.query("SELECT id,rating,course FROM registerCourse",(err,result)=>{
            if(!err){
   for (let i = 0; i < result1.rows.length; i++) {
   var a=0
   var b=0
    for (let j = 0; j < result.rows.length; j++) {
       if(result1.rows[i].id==result.rows[j].course){
       a=a+result.rows[j].rating
       b++
       }
    }
    result1.rows[i].star=a/b
}


        res.status(200).send(result1.rows)
            }
         })
        } else {
            res.send(err)
        }
    })
})
router.get('/course/:id',ensureToken, (req, res) => { 
    pool.query("SELECT * FROM course where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})
router.post("/course",superTeacher, (req, res) => {
    var body = req.body;
    var imgName=""
  if(req.files){
    var imgFile = req.files.image
     imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
    console.log("sdds");
    pool.query('INSERT INTO course (name,description,price,planned_time,course_type,author,image,homiy_id) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *',
        [body.name,body.description,body.price,body.planned_time,body.course_type,body.author,`https:${req.hostname}/${imgName}`,body.homiy_id],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files && req.files.image){
                    const imgFile = req.files.image
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(201).send("Created");
            }
        });
});
router.post("/course/:courseid/register/:userid", (req, res) => {
var body=req.body
   var userid=req.params.userid
   var courseid=req.params.courseid
   pool.query("SELECT * FROM users where id=$1", [userid], (err, result2) => {
    if (!err && result2.rows.length>0) {
        pool.query("SELECT * FROM course where id=$1", [courseid], (err, result3) => {
    if(!err && result3.rows.length>0 && result2.rows.length>0 && result2.rows[0].balance>result3.rows[0].price){    
        pool.query('INSERT INTO registerCourse (course,users) VALUES ($1,$2) RETURNING *',
   [courseid,userid],
    (err, result) => {
       if (err) {
           res.status(400).send("course va users ni idlarini yuboring");
       } else {
        pool.query(
            'UPDATE users SET balance=$1 WHERE id = $2',
            [(result2.rows[0].balance-result3.rows[0].price),userid],
            (err, result) => {})
           res.status(201).send("Created");
       }
   })} else{
    res.status(445).send('mablag yetarli emas, yokida kurs yoki user aniqlanmadi')
   }
   
})} else {
        res.status(491).send({err:err,message:"siz yuborayapgan user fanda aniqlanmagan"})
    }})});
router.delete("/course/:id",superTeacher, (req, res) => {
    var id = req.params.id
    pool.query("SELECT * FROM course", (err, result) => {
        if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id) 
          if(a.length>0){
            fs.unlink(`./Images/${a[0].image}`,()=>{})
          }
    pool.query('DELETE FROM course WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })   } else {
        res.send(err)
    } 
}) 
})
router.put("/course/:id",superTeacher, (req, res) => {
    var id = req.params.id
    var body = req.body
    var imgFile = req.files.image
    pool.query("SELECT * FROM course", (err, result) => {
        if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id) 
            fs.unlink(`./Images/${a[0].image}`,()=>{})}})

    var imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    pool.query(
        'UPDATE course SET name=$1,description=$2,price=$3,planned_time=$4,course_type=$5,author=$6,image=$7,homiy_id=$8 WHERE id = $9',
        [body.name, body.description,body.price,body.planned_time,body.course_type,body.author,`https:${req.hostname}/${imgName}`,body.homiy_id,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files && req.files.image){
                    const imgFile = req.files.image
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(200).send("Updated")
            }
        }
    )
})

module.exports = router;