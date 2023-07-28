
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
// var Math=require("Math")

// token success
function ensureToken(req,res,next){
    const bearerHeader=req.headers['authorization']
    if( typeof bearerHeader!== 'undefined'){
    const bearer=bearerHeader.split(" ")
    const bearerToken=bearer[1]
    req.token=bearerToken
    jwt.verify(bearerToken,'secret',((require1,result1)=>{
        if(result1==undefined){
            res.status(502).send("token failed")
        }else{
        
         next()
        }
     }))
    }else{
        res.status(403)
    }
}

router.post("/register", (req, res) => {
    const body = req.body
    var code =Math.floor(Math.random() * 900000)+100000;
    pool.query('INSERT INTO verify (password,email,username,code) VALUES ($1,$2,$3,$4) RETURNING *',
        [body.password,body.email,body.username,code], (err, result) => {
            if (err) {
                res.status(400).send(err)
            } else {
                res.status(201).send("Created"+code)
            }
        })
})

// verifikatsiya
router.post("/verify",ensureToken, (req, res) => {
    const body = req.body
    var datatime=new Date()
    pool.query("SELECT * FROM verify", (err, result) => {
        if (!err) {
        console.log(result.rows,"e");
        var data2=result.rows.filter(item=>item.code==body.code)
        console.log(data2);
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
router.get('/users', function(req, res) {
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
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


router.get('/students', function(req, res) {
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
    const imgFile = req.files.user_img
    const imgName = Date.now()+imgFile.name
    pool.query('INSERT INTO users (user_password, email, "surName", "LastName", databirth, "dataRegirter", address_id, position_id, username,user_img) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9,$10) RETURNING *',
    [ body.user_password,body.email, body.surName, body.LastName, body.databirth, body.dataRegirter, body.address_id, body.position_id, body.username,imgName],
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
    pool.query("SELECT * FROM users", (err, result) => {
        if (!err) {
            var token
            var position
        var a=false
        result.rows.map(item=>{
        if(item.user_password==body.user_password && (item.email==body.email || item.username==body.username)){
                  token = jwt.sign({ user_password:body.user_password,email:body.email,username:body.username}, 'secret');
                  position=item.position
                 a=true }
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

