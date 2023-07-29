
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {  ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")



router.post("/register", (req, res) => {
    const body = req.body
    var code =Math.floor(Math.random() * 900000)+100000;
    if(body.password.length>7 && body.email.includes('@')){
    pool.query('INSERT INTO verify (password,email,username,code) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.password,body.email,body.username,code], (err, result) => {
            if (err) {
                res.status(400).send("malumot To`liq emas")
            } else {
                res.status(201).send("Created"+code)
            }
        })}else{
            if(body.password.length<8){
            res.status(420).send("parol kam kiritildi")
            }
            if(!(body.email.includes('@'))){
                res.status(421).send("email xato kiritildi")
             }
        }
})

// verifikatsiya
router.post("/verify",ensureToken, (req, res) => {
    const body = req.body
    var datatime=new Date()
    pool.query("SELECT * FROM verify", (err, result) => {
        if (!err) {
        var data2=result.rows.filter(item=>item.code==body.code)
        if(data2.length===1){
          pool.query('INSERT INTO users (password,email,username,date_joined,last_login,time_create,time_update) VALUES ($1,$2,$3,$4,$5,$6,$7) RETURNING *',
        [data2[0].password,data2[0].email,data2[0].username,datatime,datatime,datatime,datatime], (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                pool.query('DELETE FROM verify WHERE id = $1', [data2[0].id], (err, result) => {
                    if (err) {
                        res.status(400).send(err)
                    } else {
                        token = jwt.sign({ password:data2[0].password,email:data2[0].email,username:data2[0].username,position:data2[0].position}, 'secret')
                        res.status(200).send({access:token,position:data2[0].position})
                    }
                })
            }
        })   
        }else{
            res.status(501).send("error code")
        }
        } else {
            res.status(404).send(err)
        }
    })
  
})

// get alluser
router.get('/users',ensureTokenSuper, function(req, res) {
    const bearerHeader=req.headers['authorization']
    if( typeof bearerHeader!== 'undefined'){
    const bearer=bearerHeader.split(" ")
    const bearerToken=bearer[1]
    jwt.verify(bearerToken,'secret',((require1,result1)=>{
        console.log(result1);
     if(result1){
       pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)  
        } else {
            res.send(err)
        } 
    })  
     }  else{
        res.status(500).send("unautorization")
     } 
   

}))
    }else{
        res.status(403)
    }
});
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
                    date_joined:item.date_joined,
                })
               })
                res.status(200).send(b)  
            } else {
                res.send(err)
            }
        })
});
router.get('/teachers',ensureToken, function(req, res) {
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
           var a=result.rows.filter(item=>item.position==2)
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
                date_joined:item.date_joined,
            })
           })
            res.status(200).send(b)  
        } else {
            res.send(err)
        }
    })
});
// get user position
router.get('/users/:id',ensureToken, function(req, res) {
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
           var a=result.rows.filter(item=>item.position*1===req.params.id*1)
            res.status(200).send(result.rows)
        } else {
            res.send(err)
        }
    })
});

// one token user
router.get('/oneuser', ensureToken, function(req, res) {
 console.log(req.token);
 var token=req.token
 jwt.verify(token,'secret',((require1,result1)=>{
    if(result1==undefined){
        res.status(502).send("token failed")
    }else{
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            console.log(result1);
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
    }
 }))
//  res.send("sdds").status(200)
});
// delete user
router.delete("/users/:id", (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM users WHERE user_id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})


// create new user
router.post("/users", (req, res) => {
    const body = req.body;
    const imgFile = req.files.image
    const imgName = Date.now()+imgFile.name.slice(imgFile.name.lastIndexOf('.'))
    pool.query('INSERT INTO users (address, description, email, last_name, password, phone_number, username, position,image) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
    [ body.address,body.description, body.email, body.last_name, body.password, body.phone_number, body.username, body.position,imgName],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                imgFile.mv(`${__dirname}/Images/${imgName}`)
                res.status(201).send("Created");
            }
        });
});


// login in user_password email username
router.post('/login', function(req, res) {
    var body=req.body
    var datatime=new Date()
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
    })
    
});

// put data 
router.put("/users/:id", (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE users SET email = $1, username = $2, user_password=$3, user_img=$4, position=$5  WHERE user_id = $6',
        [body.email, body.username, body.user_password, body.user_img,body.position, id],
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

