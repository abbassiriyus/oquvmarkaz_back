const { Client } = require("pg")

const pool = new Client({
    user: "postgres",
    host: "containers-us-west-163.railway.app",
    database: "railway",
    password: "yG4VyoYUx2n25OIFnJg1",
    port: 6663
})
pool.connect(err => {
    if(err) {
        console.log("Connect Error");
    } else {
        console.log("Connect To PostgreSql");
    }
})

module.exports = pool