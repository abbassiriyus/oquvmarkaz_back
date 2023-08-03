
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var { ensureToken }=require("../token/token.js")

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


router.post("/course_theme_task",ensureToken, (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.image
         imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
        pool.query('INSERT INTO course_theme_task (content,course_theme,image) VALUES ($1,$2,$3) RETURNING *',
        [body.content,body.course_theme,imgName],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                if(req.files){
                    const imgFile = req.files.image
                    imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(201).send("Created");
            }
        });
});

router.delete("/course_theme_task/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM course_theme_task where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1[0].image){
              fs.unlink(`./Images/${result1[0].image}`,()=>{})   
            }
            pool.query('DELETE FROM course_theme_task WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(err)
                } else {
                    res.status(200).send("Deleted")
                }
            })
        } else {
            res.status(400).send(err)
        }
    })

   


})
router.put("/api_root/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM course_theme_task where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1[0].image){
                fs.unlink(`./Images/${result1[0].image}`,()=>{})   
              }
              if(req.files){
                const imgFile = req.files.image
                 imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.image
            }
    pool.query(
        'UPDATE api_root SET content=$1,course_theme=$2,image=$3 WHERE id = $4',
        [body.content,body.course_theme,imgName,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
} else {
    res.status(400).send(err)
}
    })
})

module.exports = router;