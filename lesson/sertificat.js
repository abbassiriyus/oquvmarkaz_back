
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
var fs =require("fs")
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")
const path = require("path");
const PizZip = require("pizzip");
const Docxtemplater = require("docxtemplater");
// var docxConverter = require('docx-pdf');

router.get("/sertificat", (req, res) => {   
     pool.query("SELECT * FROM sertificat", (err, result) => {
        if (!err) {
         res.status(200).send(result.rows)
        } else {
         res.send(err)
        }
     })
   })

router.get('/sertificat/:id', (req, res) => {
    pool.query("SELECT * FROM sertificat where id=$1", [req.params.id], (err, result) => {
        if (!err) {
                  res.status(200).send(result.rows)
          } else {
            res.status(400).send(err)
          }
    })
})
router.post("/sertificat",superTeacher, (req, res) => {
    const body = req.body;
    var imgName="";
    if(req.files){
        const imgFile = req.files.file
         imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.file
    }
    pool.query('INSERT INTO sertificat (description,type,file,director,mentor) VALUES ($1 ,$2 ,$3 ,$4 ,$5 ) RETURNING *',
        [body.description,body.type,imgName,body.director,body.mentor],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
               
                if(req.files){
                    const imgFile = req.files.file
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(201).send("Created");
            }
        });
});

router.delete("/sertificat/:id",superTeacher, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM sertificat where id=$1", [req.params.id], (err, result1) => {
        console.log(result1.rows);
     if (!err && result1.rows.length>0) {
            if(result1.rows[0] && result1.rows[0].file){
              fs.unlink(`./Images/${result1.rows[0].file}`,()=>{})   
            }
            pool.query('DELETE FROM sertificat WHERE id = $1', [id], (err, result) => {
                if (err) {
                    res.status(400).send(
                        {err:err,message:"sertificat id topilmadi "}
                    )
                } else {
                    res.status(200).send("Deleted")
                }
            })
        } else {
            res.status(400).send(err)
        }
    })

   


})
router.put("/sertificat/:id",superTeacher, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query("SELECT * FROM sertificat where id=$1", [req.params.id], (err, result1) => {
        if (!err) {
            if(result1.rows[0].file){
                fs.unlink(`./Images/${result1.rows[0].file}`,()=>{})   
              }
              if(req.files){
                const imgFile = req.files.file
                 imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
            }else{
                imgName=req.body.file
            }
    pool.query(
        'UPDATE sertificat SET description=$1,type=$2,file=$3,director=$4,mentor=$5   WHERE id = $6',
        [body.description,body.type,imgName,body.director,body.mentor,id ],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                if(req.files){
                    const imgFile = req.files.file
                    imgFile.mv(`${__dirname}/Images/${imgName}`)
                }
                res.status(200).send("Updated")
            }
        }
    )
} else {
    res.status(400).send(err)
}
    })
})

router.get('/sertificat_course/users/:id', (req, res) => {
    
pool.query("SELECT * FROM registerCourse where id=$1", [req.params.id], (err, result1) => {
 if (!err) {
    pool.query("SELECT * FROM course where id=$1", [result1.rows[0].course], (err, result2) => {
        if (!err) {
         pool.query("SELECT * FROM sertificat where id=$1", [result2.rows[0].sertificat_id], (err, result3) => {
        if (!err) {
            console.log(result3.rows);
        // Load the docx file as binary content
const content = fs.readFileSync(
    path.resolve(__dirname, `./Images/${result3.rows[0].file}`),
    "binary"
);

const zip = new PizZip(content);

const doc = new Docxtemplater(zip, {
    paragraphLoop: true,
    linebreaks: true,
});
pool.query("SELECT * FROM users where id=$1", [result1.rows[0].users], (err, result4) => {
if (!err) {
    var date=new Date()
    var current_date = date.getFullYear()+"-"+(date.getMonth()+1)+"-"+ date.getDate()
    doc.render({
    full_name: result4.rows[0].last_name,
    description:result3.rows[0].description,
    date: current_date,
    director: result3.rows[0].director,
    mentor: (result4.rows.filter(item=>item.id==result3.rows[0].mentor))[0].last_name,
  });

const buf = doc.getZip().generate({
    type: "nodebuffer",
    compression: "DEFLATE",
});

var name_file=Date.now()
fs.writeFileSync(path.resolve(__dirname, `./sertifikat/${name_file}.docx`), buf);
pool.query(
    'UPDATE registerCourse SET finishing=$1 WHERE id = $2',
    [true,req.params.id ],
    (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
    pool.query('INSERT INTO Student_sertificat (file,title,description,sertificat_id,student_id) VALUES ($1,$2,$3,$4,$5) RETURNING *',
            [`${name_file}.docx`,result4.rows[0].last_name,result3.rows[0].description,result3.rows[0].id,result4.rows[0].id,],
             (err, result) => {
                if (err) {
                    res.status(400).send(err);
                } else {
                    if(req.files){
                        const imgFile = req.files.file
                        imgFile.mv(`${__dirname}/Images/${imgName}`)
                    }
                    res.status(201).send("Created");
                }
            });   





        }
    }
)      




    } else {
        res.status(400).send(err)
    }
})


             
                
                          } else {
                            res.status(400).send({err:err,message:"not found course"})
                          }
                    })
                  } else {
                    res.status(400).send({err:err,message:"not found course"})
                  }
            })
          } else {
            res.status(400).send({err:err,message:"this is id not registerCourse"})
          }
    })
})


module.exports = router;