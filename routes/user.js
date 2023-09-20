
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
const fs =require("fs")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")
const nodemailer =require("nodemailer")
const transporter = nodemailer.createTransport({
   service: "gmail",
   auth: {
      user: "info.baisan.org@gmail.com",
      pass: "iedlfweqtzyvstgg"
   }
});



// registratsiya
router.post("/register", (req, res) => {
    const body = req.body
    if(body){
    var code =Math.floor(Math.random() * 900000)+100000;
    var a=0
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var d2=result.rows.filter(item=>{item.email===req.body.email})
            var d3=result.rows.filter(item=>{item.password===req.body.password})
        if(d2.length>0 || d3.length>0){
            a=1
        }
        }
    })
    if(body.password.length>7 && body.email.includes('@') && a!==1){
    pool.query('INSERT INTO verify (password,email,username,code) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.password,body.email,body.username,code], (err, result) => {
            if (err) {
                res.status(400).send("malumot To`liq emas")
            } else {
                var mailOptions = {
                    from: "info.baisan.org@gmail.com",
                    to: body.email,
                    subject: "Verification Code",
                    html: `Your activation code:${code}`
                 };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                       console.log(error,"error");
                    }else{
                       console.log("your code: "+code);
                 
                    }
                 });
                res.status(201).send("send message your email")
            }
        })}else{
            if(body.password.length<8){
            res.status(420).send("parol kam kiritildi")
            }
            if(!(body.email.includes('@'))){
                res.status(421).send("email xato kiritildi")
            }}
            if(a==1){
                res.status(422).send("siz kiritgan malumotlar bizni bazamizda oldindan saqlangan")  
            }}else{
                res.status(441).send("malumotni yubormadingiz")
            }
})

router.post("/change/password", (req, res) => {
    const body = req.body
    if(body){
    var code=Math.floor(Math.random()*900000)+100000;
    var a=0
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
         var d2=result.rows.filter(item=>item.email===req.body.email)
        if(d2.length>0){
         a=d2[0].id
        }else{
         res.status(400).send("email topilmadi")
        }
        console.log(a);
    if(body.email.includes('@') && a!==0){
      pool.query('UPDATE users SET verify=$1 WHERE id=$2',
       [code,a], (err, result) => {
            if (err) {
                res.status(400).send("malumot To`liq emas")
            } else {
                var mailOptions = {
                    from: "info.baisan.org@gmail.com",
                    to: body.email,
                    subject: "Verification Code",
                    html: `Your activation code:${code}`
                 };
                transporter.sendMail(mailOptions, function(error, info){
                    if(error){
                       console.log(error,"error");
                    }else{
                       console.log("your code: "+code);
                    }
                 });
                res.status(201).send("send message your email")
            }
        })}else{
            if(!(body.email.includes('@'))){
                res.status(421).send("email xato kiritildi")
            }}
            if(a==1){
                res.status(422).send("siz kiritgan malumotlar bizni bazamizda oldindan saqlangan")  
            }}else{
                res.status(441).send("malumotni yubormadingiz")
            }
})
   }
})

router.put("/reset/", (req, res) => {
    const body = req.body
    pool.query("SELECT * FROM users", (err, result1) => {
        if (!err) {
            console.log(result1.rows);
            console.log(body.code);
            var s=result1.rows.filter(item=>item.verify==body.code)
            console.log(s);
            pool.query('UPDATE users SET password=$1 WHERE id=$2',
            [body.password,s[0].id],
            (err, result) => {
                if (err) {
                    res.status(400).send({err:err,message:'parol oldin ishlatilgan'})
                } else {
                    res.status(200).send("Updated")
                }})
        } else {
            res.status(400).send(err)
        } 
    }) 
  
})

    
// verifikatsiya
router.post("/verify", (req, res) => {
    const body = req.body
    var datatime=new Date()
    pool.query("SELECT * FROM verify", (err, result) => {
        console.log(1);
        if (!err) {

        var data2=result.rows.filter(item=>item.code==body.code)
        if(data2.length===1){
            console.log(2);
          pool.query('INSERT INTO users (password,email,username,date_joined,last_login,time_create,time_update) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [data2[0].password,data2[0].email,data2[0].username,datatime,datatime,datatime,datatime], (err, result) => {
            if (err) {
                console.log(3);
                res.status(400).send(err)
            } else {
                pool.query('DELETE FROM verify WHERE id = $1', [data2[0].id], (err, result) => {
                    console.log(4);
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        console.log(6);
                        token = jwt.sign({ password:data2[0].password,email:data2[0].email,username:data2[0].username,position:data2[0].position}, 'secret')
                        res.status(200).send({access:token,position:data2[0].position})
                    }
                })
            }
        })   
        }else{
            console.log(5);
            res.status(501).send("error code")
        }
        } else {
            res.status(404).send(err)
        }
    })
  
})

// get alluser
router.get('/users',ensureTokenSuper, function(req, res) {
       pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)  
        } else {
            res.send(err)
        } 
    })  
});
// get student
router.get('/students',ensureToken, function(req, res) {
   console.log(req.body);
        pool.query("SELECT * FROM users", (err, result) => {
            if (!err) {
               var a=result.rows.filter(item=>item.position==1)
             var b=[]
               a.map(item=>{
                b.push({
                    id:item.id,
                    email:item.email,
                    username:item.username,
                    first_name:item.first_name,
                    last_name:item.last_name,
                    phone_number:item.phone_number,
                    image:item.image,
                    description:item.description,
                    address:item.address,
                    youtobe:item.youtobe,
                    telegram:item.telegram,
                    instagram:item.instagram,
                    date_joined:item.date_joined,
                })
               })
                res.status(200).send(b)  
            } else {
                res.send(err)
            }
        })
});
router.get('/allusers',ensureToken, function(req, res) {
    console.log(req.body);
         pool.query("SELECT * FROM users", (err, result) => {
             if (!err) {
                var a=result.rows
              var b=[]
                a.map(item=>{
                 b.push({
                     id:item.id,
                     email:item.email,
                     username:item.username,
                     first_name:item.first_name,
                     last_name:item.last_name,
                     phone_number:item.phone_number,
                     image:item.image,
                     description:item.description,
                      address:item.address,
                     youtobe:item.youtobe,
                     telegram:item.telegram,
                     instagram:item.instagram,

                     date_joined:item.date_joined,
                 })
                })
                 res.status(200).send(b)  
             } else {
                 res.send(err)
             }
         })
 });
// get teacher 
router.get('/teachers'


, function(req, res) {
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
           var a=result.rows.filter(item=>item.position==2)
         var b=[]
           a.map(item=>{
            b.push({
                id:item.id,
                email:item.email,
                username:item.username,
                last_name:item.last_name,
                phone_number:item.phone_number,
                image:item.image,
                description:item.description,
                address:item.address,
                youtobe:item.youtobe,
                telegram:item.telegram,
                instagram:item.instagram,
                date_joined:item.date_joined,
            })
           })
            res.status(200).send(b)  
        } else {
            res.send(err)
        }
    })
});
router.get('/users/follow/:id', (req, res) => { 
    pool.query("SELECT address,description,email,image,id,username,is_active FROM users", (err, result1) => {
    if (!err) {
        pool.query("SELECT * FROM follow", (err, result2) => {
            if (!err) {
            var userall=result1.rows
            var allcourse=result2.rows
            console.log(allcourse);
            var oneuser=userall.filter(item=>item.id==req.params.id)
            var i_follow=allcourse.filter(item=>item.topuser==req.params.id)
            console.log(i_follow);
             var me_follow=allcourse.filter(item=>item.minuser==req.params.id)
             console.log(me_follow);
            oneuser[0].i_follow=i_follow
             oneuser[0].me_follow=me_follow


            res.status(200).send(oneuser)
                }
            })
        } else {
            res.status(400).send({"err":err,"message":"user topilmadi"})
        }
    })
})
// get user position
router.get('/users/:id',ensureTokenSuper, function(req, res) {
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id)
            res.status(200).send(a)
        } else {
            res.send(err)
        }
    })
});
router.get('/teacher/:id',ensureToken, function(req, res) {
    pool.query("SELECT id , address , description,email,image,username,last_name,phone_number FROM users", (err, result) => {
        if (!err) {
            var course=null
        pool.query("SELECT * FROM course", (err, result2) => {
           course=result2.rows.filter(item=>item.author==req.params.id)
           var a=result.rows.filter(item=>item.id*1===req.params.id*1) 
           a[0].course=course
            res.status(200).send(a)})
        } else {
            res.send(err)
        }
    })
});
// one token user
router.get('/oneuser', ensureToken, function(req, res) {
   var body=req.body
   var result1
   const bearerHeader=req.headers['authorization']
   const bearer=bearerHeader.split(" ")
   const bearerToken=bearer[1]
   req.token=bearerToken
   jwt.verify(bearerToken,'secret',((require1,result)=>{
       if(result==undefined){
           res.status(502).send("token failed")
       }else{
    result1=result    
     pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            if(result1.email){
            var a=result.rows.filter(item=>(item.email===result1.email ))
            }else{
            var a=result.rows.filter(item=>(item.username===result1.username))
            }
     
      var a2=a.filter(item=>item.user_password===result1.user_password)
            res.status(200).send(a2) 
        } else {
            res.send(err)
        }
    }) 
    }}))
  
      
});


// delete user
router.delete("/users/:id",ensureToken, (req, res) => {
    const id = req.params.id
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id) 
            if(a[0].image){
                fs.unlink(`./Images/${a[0].image}`,()=>{})
            }
            pool.query('DELETE FROM users WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            if(a[0].image){
                fs.unlink(`./Images/${a[0].image}`,(err => {console.log('delete');}))
            }
            res.status(200).send("Deleted")
        }
    }) 
        } else {
            res.send(err)
        } 
    }) 

  
})

// create new user
router.post("/users", (req, res) => {
    const body = req.body;
    var imgName=""
    if(req.files && req.files.image){
         const imgFile = req.files.image
         imgName = `https://${req.hostname}/`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    }else{
        imgName=req.body.image
    }
    pool.query('INSERT INTO users (address, description, email, last_name, password, phone_number, username, position,image,youtobe,telegram,instagram) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10,$11,$12) RETURNING *',
    [ body.address,body.description, body.email, body.last_name, body.password, body.phone_number, body.username, body.position, imgName ,body.youtobe,body.telegram,body.instagram],
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
// login in user_password email username
router.post('/login', function(req, res) {
    var body=req.body
    if(body){var datatime=new Date()
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var token
            var position
          var a=false
        result.rows.map(item=>{
        if(item.password==body.password && (item.email==body.email || item.username==body.username)){
        pool.query('UPDATE users SET last_login=$1 WHERE id = $2',[datatime,item.id])
        token = jwt.sign({"password":item.password,"email":item.email,"username":item.username,"position":item.position}, 'secret');
            position=item.position
                 a=true}
           })
       if(!a){res.status(500).send("Royhatdan o`tmagan") }else{
        res.status(200).send({access:token,position}) 
       }
        } else {
            res.status(401).send(err)
        }
    })}else{
        res.status(441).send("post metodida hech qanday data yuborilmadi")
    }
    
});

// put data 
router.put("/userssuperadmin/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    var imgName=""

   pool.query("SELECT * FROM users", (err, result) => { 
    if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id) 
            fs.unlink(`./Images/${a[0].image}`,()=>{})}})
if(req.files){
    const imgFile = req.files.image
     imgName = `https://${req.hostname}/`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
}else{
     imgName = req.body.image
}
    pool.query('UPDATE users SET address = $1,balance=$2,description=$3,email=$4, image=$5,last_name=$6,password=$7,phone_number=$8,username=$9,position=$10,youtobe=$11,telegram=$12,instagram=$13 WHERE id = $14',
        [body.address, body.balance, body.description, body.email,imgName,body.last_name,body.password,body.phone_number,body.username,body.position,body.youtobe,body.telegram,body.instagram,id],
        (err, result) => {
            if (err) {
                console.log("oddiy xato");
                res.status(400).send(err)
            } else {
                if(req.files){
                 const imgFile = req.files.image
                if(req.files){imgFile.mv(`${__dirname}/Images/${imgName}`)}    
                }
                res.status(200).send("Updated")
            }
        }
    )

})
// put user
router.put("/oneuser/:id",ensureToken, (req, res) => {
    const id = req.params.id
    const body = req.body
    if(req.files){
   const imgFile = req.files.image
   var imgName = `https://${req.hostname}/`+Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
 pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var a=result.rows.filter(item=>item.id==req.params.id) 
            if(a.length>0 && a[0].image){
                fs.unlink(`./Images/${a[0].image}`,()=>{})
            }
    pool.query(
    'UPDATE users SET address = $1,description=$2,email=$3, image=$4,last_name=$5,phone_number=$6,username=$7 WHERE id = $8',
        [body.address, body.description, body.email,imgName,body.last_name,body.phone_number,body.username,id],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                imgFile.mv(`${__dirname}/Images/${imgName}`)
                res.status(200).send("Updated")
            }
        }
    )} 
        })
    }else{
      pool.query("SELECT * FROM users", (err, result) => {
             if (!err) {
                 var a=result.rows.filter(item=>item.id==req.params.id) 
               if(a[0].image){ fs.unlink(`./Images/${a[0].image}`,()=>{})}
                
         pool.query(
         'UPDATE users SET address = $1,description=$2,email=$3, image=$4,last_name=$5,phone_number=$6,username=$7 WHERE id = $8',
             [body.address, body.description, body.email,body.image,body.last_name,body.phone_number,body.username,id],
             (err, result) => {
                 if (err) {
                     res.status(400).send(err)
                 } else {
                     res.status(200).send("Updated")
                 }
             }
         )}
             })
    }
    
   
   
})

router.put("/balance/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    
    pool.query("SELECT * FROM users", (err, result1) => {
        var one=result1.rows.filter(item=>item.id*1===id*1)
        if (!err) { 
          
             pool.query(
        'UPDATE users SET balance=$1 WHERE id = $2',
        [ (body.balance*1)+((one[0].balance)*1),id],
        (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(200).send("Updated")
            }
        }
    )
        } else {
            res.send(err)
        } 
    })
  



})

router.put("/ban/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE users SET is_active=$1    WHERE id = $2',
        [body.is_active,id],
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

