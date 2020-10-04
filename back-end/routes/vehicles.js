const express = require("express");
const sql = require("mssql/msnodesqlv8");
const conn = require("../config/config");

const router = express.Router();


router.get('/price/:id', async(req, res) => {
    //data from body of the request
    const vehicleType = req.params.id;

    //connecting
    try {
        await conn.connect();
        
        const request = new sql.Request(conn);
        
        //query to the DB
        request.query(`select vehiclePrice from vehicles where vehicleType = '${vehicleType}'`, (error, vehicleReponce) => {
            if(error) {
                conn.close();
                return res.status(404).send("vehicle price not found for this type of vehicle");
            }
            
            conn.close();
            return res.send(vehicleReponce.recordset);
        })
        
    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})


module.exports = router;