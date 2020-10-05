const express = require('express');
const sql = require("mssql/msnodesqlv8");

const conn = require('../config/config')

const router = express.Router();

router.get("/", async(req, res) => {
    try {
        await conn.connect();

        const request = new sql.Request(conn);
        request.query("select * from staffEmployeeSerials", (err, responce) => {
            if(err) {
                conn.close();
                return res.status(404).send("Branch is not Added");
            }

            conn.close();
            res.send(responce.recordset)
        })

    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})

router.post("/:serailNumber", async(req, res) => {
    try {
        const serailNumber = req.params.serailNumber;

        await conn.connect();

        const request = new sql.Request(conn);
        request.query(`insert into staffEmployeeSerials values('${serailNumber}')`, (err, responce) => {
            if(err) {
                conn.close();
                return res.status(404).send("Branch is not Added");
            }

            conn.close();
            res.send(responce.rowsAffected)
        })

    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})


module.exports = router;
