const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-148.railway.app",
    database: "railway",
    password: "oeNiQ6N9FiOXRLtoDyuw",
    port: 6577
})
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool