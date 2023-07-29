const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-187.railway.app",
    database: "railway",
    password: "PmnOmTpgwPDQz2s1K5Yw",
    port: 5719
})
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool