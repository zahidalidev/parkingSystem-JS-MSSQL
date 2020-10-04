const express = require('express');
const sql = require("mssql/msnodesqlv8");
const conn = require("../config/config");

const router = express.Router();

//generate report 
router.get("/report/:branchID/:date", async(req, res) => {
    try {
        const branchID = req.params.branchID;
        const date = req.params.date; 
        console.log(branchID, date)
        await conn.connect();
        const request = new sql.Request(conn);
        request.query(`select * from customers where branchID = ${branchID} and date = convert(date, '${date}', 5)`, (error, reportResponce) => {
            if(error) {
                conn.close();
                return res.status(404).send("Report not found");
            }

            conn.close();
            return res.send(reportResponce.recordset)
        });
        
    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})

//sending customer with branchID and serialNumber
router.get("/customerDetails/:branchID/:serialNumber", async(req, res) => {
    try {
        await conn.connect();
    
        const request = new sql.Request(conn);
        
        const branchID = req.params.branchID;
        const cardSerialNumber = req.params.serialNumber;
        
        request.query(`select * from customers where branchID = ${branchID} and cardSerial = '${cardSerialNumber}'`, (error, customerReponce) => {
            if(error) {
                conn.close();
                return res.status(404).send("Customer with this serail number not found");
            }

            conn.close();
            return res.send(customerReponce.recordset[0])
        })

    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})

//updating customer with branchID and serialNumber setting exit time
router.put("/:id", async(req, res) => {
    
    try {
        await conn.connect();
        
        const request = new sql.Request(conn);
        
        const customerID = req.params.id;

        const branchID = req.body.branchID ;
        const entryDateTime = req.body.entryDateTime ;
        const cardSerial = req.body.cardSerial ;
        const exitDateTime = req.body.exitDateTime ; 

        request.query(`update customers set exitDateTime = convert(datetime, '${exitDateTime}' , 5),
                        image = "null", where customerID = ${customerID} and branchID = ${branchID} and 
                        entryDateTime = convert(datetime, '${entryDateTime}' , 5) and  cardSerial = '${cardSerial}' and 
                        exitDateTime is null`, 
                        (error, customerReponce) => {
                            
                            if(error){ 
                                conn.close();
                                return res.status(404).send("Customer with this serail number not found");
                            }
                            
                            conn.close();
                            return res.send(customerReponce.rowsAffected);
                        }
        )
    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})

//inserting Customer
router.post("/", async(req, res) => {
    try {
        //making connection
        await conn.connect();
        
        //quering
        const request = new sql.Request(conn);
        request.query(`select vehiclePrice from vehicles where vehicleType = '${req.body.vehicleType}'`, (err, vehiclesReponce) => {
            if(err) {
                conn.close();
                return res.status(404).send("price for the vehicle not found");
            }
            
            //calues from request body
            const SerialNumber = req.body.SerialNumber;
            const vehicleNumber = req.body.vehicleNumber;
            const entryTime = req.body.entryTime;
            const firstDayDate = req.body.firstDayDate;
            const image = req.body.image || null;
            const customerType = req.body.customerType;
            const vehicleType = req.body.vehicleType;
            const vehiclePrice = customerType == "staff" ? 0 : vehiclesReponce.recordset[0].vehiclePrice
            const branchID = req.body.branchID;
            
            request.query(
                `insert into customers
                    (cardSerial, vehicleNumber, entryDateTime, date, image, 
                        customerType, vehicleType, vehiclePrice, branchID)
                        values('${SerialNumber}', '${vehicleNumber}', convert(datetime, '${entryTime}' , 5),
                        convert(date, '${entryTime}', 5), '${image}', '${customerType}', '${vehicleType}', 
                    '${vehiclePrice}', ${branchID} )`, (error, customerResponce) => {
                        if(err){ 
                            conn.close();
                            return res.status(404).send("customer is not added");
                        }

                        
                        request.query(`select * from summary where date = convert(date, '${firstDayDate}' , 5)`, (sError, sumSelRes) => {
                            if(sError){ 
                                conn.close();
                                return res.status(404).send("customer is not added");
                            }

                            if(sumSelRes.recordset.length === 0){
                                //insertion into summary table
                                request.query(`insert into summary(date, totalSale, branchID) 
                                values(convert(date, '${firstDayDate}' , 5), ${vehiclePrice}, ${branchID})`, (sInsErr, sInsResponce) => {
                                    if(sInsErr){ 
                                        conn.close();
                                        return res.status(404).send("customer is not added");
                                    }

                                    conn.close();
                                    return res.send(customerResponce.rowsAffected)

                                })

                            }else if(sumSelRes.recordset.length === 1){
                                //updation in summary table
                                request.query(`update summary set totalSale = totalSale + ${vehiclePrice} 
                                where date = convert(date, '${firstDayDate}' , 5) and branchID = ${branchID}`, (sUpdaError, sUpdaResponce) => {
                                    if(sUpdaError){ 
                                        conn.close();
                                        return res.status(404).send("customer is not added");
                                    }

                                    conn.close();
                                    return res.send(customerResponce.rowsAffected)
                                })
                            }
                        })
                    }
            )
        
        })

    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }

})

module.exports = router

