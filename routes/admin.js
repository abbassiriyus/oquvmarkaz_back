
var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');
const pool = require("../db")
var {ensureToken,ensureTokenSuper,ensureTokenTeacher,superTeacher }=require("../token/token.js")

router.get("/admin",ensureTokenSuper, (req, res) => {   
    pool.query("SELECT * FROM admin", (err, result) => {
        if (!err) {

            res.status(200).send(result.rows)

        } else {
            res.send(err)
        }
    })
})

router.get('/admin/:id',ensureTokenSuper, (req, res) => {
    
    pool.query("SELECT * FROM admin where id=$1", [req.params.id], (err, result) => {
        if (!err) {
            res.status(200).send(result.rows)
        } else {
            res.status(400).send(err)
        }
    })
})


router.post("/admin",ensureTokenSuper, (req, res) => {
    const body = req.body;
    console.log("hello");
        pool.query('INSERT INTO admin (user_id,diogram_get,alluser_get,alluser_post,alluser_delete,alluser_put,student_get,student_post,student_delete,student_put,teacher_get,teacher_post,teacher_delete,teacher_put,admin_get,admin_post,admin_delete,admin_put,course_get,course_post,course_delete,course_put,news_get,news_post,news_delete,news_put,chat_get,chat_post,chat_delete,chat_put,get_allchat,dars_get,dars_post,dars_delete,dars_put,dars_student_get,dars_student_post,dars_student_delete,dars_student_put,test_get,test_post,test_delete,test_put,test_student_get,test_student_post,test_student_delete,test_student_put,call_me_get,call_me_post,call_me_delete,call_me_put,universitet_get,universitet_post,universitet_delete,universitet_put,help_get,help_post,help_delete,help_put,category_get,category_post,category_delete,category_put,notification_get,notification_post,notification_delete,notification_put,get_pay,servis_get,servis_post,servis_delete,servis_put,homiy_get,homiy_post,homiy_delete,homiy_put,sertifikat_get,sertifikat_post,sertifikat_delete,sertifikat_put,create_video,pomish) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21,$22,$23,$24,$25,$26,$27,$28,$29,$30,$31,$32,$33,$34,$35,$36,$37,$38,$39,$40,$41,$42,$43,$44,$45,$46,$47,$48,$49,$50,$51,$52,$53,$54,$55,$56,$57,$58,$59,$60,$61,$62,$63,$64,$65,$66,$67,$68,$69,$70,$71,$72,$73,$74,$75,$76,$77,$78,$79,$80,$81,$82) RETURNING *',
        [body.user_id,body.diogram_get,body.alluser_get,body.alluser_post,body.alluser_delete,body.alluser_put,body.student_get,body.student_post,body.student_delete,body.student_put,body.teacher_get,body.teacher_post,body.teacher_delete,body.teacher_put,body.admin_get,body.admin_post,body.admin_delete,body.admin_put,body.course_get,body.course_post,body.course_delete,body.course_put,body.news_get,body.news_post,body.news_delete,body.news_put,body.chat_get,body.chat_post,body.chat_delete,body.chat_put,body.get_allchat,body.dars_get,body.dars_post,body.dars_delete,body.dars_put,body.dars_student_get,body.dars_student_post,body.dars_student_delete,body.dars_student_put,body.test_get,body.test_post,body.test_delete,body.test_put,body.test_student_get,body.test_student_post,body.test_student_delete,body.test_student_put,body.call_me_get,body.call_me_post,body.call_me_delete,body.call_me_put,body.universitet_get,body.universitet_post,body.universitet_delete,body.universitet_put,body.help_get,body.help_post,body.help_delete,body.help_put,body.category_get,body.category_post,body.category_delete,body.category_put,body.notification_get,body.notification_post,body.notification_delete,body.notification_put,body.get_pay,body.servis_get,body.servis_post,body.servis_delete,body.servis_put,body.homiy_get,body.homiy_post,body.homiy_delete,body.homiy_put,body.sertifikat_get,body.sertifikat_post,body.sertifikat_delete,body.sertifikat_put,body.create_video,body.pomish],
         (err, result) => {
            if (err) {
                res.status(400).send(err);
            } else {
                res.status(201).send("Created");
            }
        });
});

router.delete("/admin/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    pool.query('DELETE FROM admin WHERE id = $1', [id], (err, result) => {
        if (err) {
            res.status(400).send(err)
        } else {
            res.status(200).send("Deleted")
        }
    })
})
router.put("/admin/:id",ensureTokenSuper, (req, res) => {
    const id = req.params.id
    const body = req.body
    pool.query(
        'UPDATE admin SET user_id=$1,diogram_get=$2,alluser_get=$3,alluser_post=$4,alluser_delete=$5,alluser_put=$6,student_get=$7,student_post=$8,student_delete=$9,student_put=$10,teacher_get=$11,teacher_post=$12,teacher_delete=$13,teacher_put=$14,admin_get=$15,admin_post=$16,admin_delete=$17,admin_put=$18,course_get=$19,course_post=$20,course_delete=$21,course_put=$22,news_get=$23,news_post=$24,news_delete=$25,news_put=$26,chat_get=$27,chat_post=$28,chat_delete=$29,chat_put=$30,get_allchat=$31,dars_get=$32,dars_post=$33,dars_delete=$34,dars_put=$35,dars_student_get=$36,dars_student_post=$37,dars_student_delete=$38,dars_student_put=$39,test_get=$40,test_post=$41,test_delete=$42,test_put=$43,test_student_get=$44,test_student_post=$45,test_student_delete=$46,test_student_put=$47,call_me_get=$48,call_me_post=$49,call_me_delete=$50,call_me_put=$51,universitet_get=$52,universitet_post=$53,universitet_delete=$54,universitet_put=$55,help_get=$56,help_post=$57,help_delete=$58,help_put=$59,category_get=$60,category_post=$61,category_delete=$62,category_put=$63,notification_get=$64,notification_post=$65,notification_delete=$66,notification_put=$67,get_pay=$68,servis_get=$69,servis_post=$70,servis_delete=$71,servis_put=$72,homiy_get=$73,homiy_post=$74,homiy_delete=$75,homiy_put=$76,sertifikat_get=$77,sertifikat_post=$78,sertifikat_delete=$79,sertifikat_put=$80,create_video=$81,pomish=$82  WHERE id = $83',
        [body.user_id,body.diogram_get,body.alluser_get,body.alluser_post,body.alluser_delete,body.alluser_put,body.student_get,body.student_post,body.student_delete,body.student_put,body.teacher_get,body.teacher_post,body.teacher_delete,body.teacher_put,body.admin_get,body.admin_post,body.admin_delete,body.admin_put,body.course_get,body.course_post,body.course_delete,body.course_put,body.news_get,body.news_post,body.news_delete,body.news_put,body.chat_get,body.chat_post,body.chat_delete,body.chat_put,body.get_allchat,body.dars_get,body.dars_post,body.dars_delete,body.dars_put,body.dars_student_get,body.dars_student_post,body.dars_student_delete,body.dars_student_put,body.test_get,body.test_post,body.test_delete,body.test_put,body.test_student_get,body.test_student_post,body.test_student_delete,body.test_student_put,body.call_me_get,body.call_me_post,body.call_me_delete,body.call_me_put,body.universitet_get,body.universitet_post,body.universitet_delete,body.universitet_put,body.help_get,body.help_post,body.help_delete,body.help_put,body.category_get,body.category_post,body.category_delete,body.category_put,body.notification_get,body.notification_post,body.notification_delete,body.notification_put,body.get_pay,body.servis_get,body.servis_post,body.servis_delete,body.servis_put,body.homiy_get,body.homiy_post,body.homiy_delete,body.homiy_put,body.sertifikat_get,body.sertifikat_post,body.sertifikat_delete,body.sertifikat_put,body.create_video,body.pomish,id ],
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