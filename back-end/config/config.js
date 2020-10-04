const sql = require("mssql/msnodesqlv8");

module.exports = new sql.ConnectionPool({
    database: "parkingSystem",
    server: "(localdb)\\MSSQLLocalDB",
    driver: "msnodesqlv8",
    options: {
        trustedConnection: true
    }
})