const express = require('express');
const sql = require("mssql/msnodesqlv8");
const conn = require("../config/config");

const router = express.Router();

//generate symmary report 
router.get("/summary/:date", async(req, res) => {
    try {
        const date = req.params.date; 
        await conn.connect();
        const request = new sql.Request(conn);
        request.query(`select s.date, s.totalSale, s.totalEntries, concat(b.cityName, ' ',b.branchName) as branch
         from summary s JOIN branches b on s.branchID = b.branchID where s.date = convert(date, '${date}', 5)`, (error, reportResponce) => {
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

//generate report 
router.get("/report/:branchID/:date", async(req, res) => {
    try {
        const branchID = req.params.branchID;
        const date = req.params.date;

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
        
        request.query(`select * from customers where branchID = ${branchID} and cardSerial = '${cardSerialNumber}' 
                    and exitDateTime is NULL`, (error, customerReponce) => {
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
                        image = 'null' where customerID = ${customerID} and branchID = ${branchID} and 
                        entryDateTime = convert(datetime, '${entryDateTime}' , 5) and  cardSerial = '${cardSerial}' and 
                        exitDateTime is null`, 
                        (error, customerReponce) => {
                            
                            if(error){ 
                                console.log(error)
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
        const transaction = new sql.Transaction(conn);
        const request = new sql.Request(transaction);

        transaction.begin(tError => {
            if(tError) {
                conn.close();
                return res.status(500).send("Error in Entry of Vehicle");
            }
            
            request.query(`select vehiclePrice from vehicles where vehicleType = '${req.body.vehicleType}'`, async(err, vehiclesReponce) => {
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
                
                request.query(`select customerID from customers where cardSerial = '${SerialNumber}' 
                    and branchID = ${branchID} and exitDateTime is null`, async(cusExistErro, cusExistResponce) => {
                        if(cusExistErro){ 
                            conn.close();
                            return res.status(404).send("customer is not added");
                        }
    
                        if(cusExistResponce.recordset.length > 0){
                            conn.close();
                            return res.status(400).send("Bad Reqeuest: Serail Number Already Exist");
                        }
    
                        request.query(
                            `insert into customers
                                (cardSerial, vehicleNumber, entryDateTime, date, image, 
                                    customerType, vehicleType, vehiclePrice, branchID)
                                    values('${SerialNumber}', '${vehicleNumber}', convert(datetime, '${entryTime}' , 5),
                                    convert(date, '${entryTime}', 5), '${image}', '${customerType}', '${vehicleType}', 
                                '${vehiclePrice}', ${branchID} )`, async(error, customerResponce) => {
                                    
                                    if(error){ 
                                        conn.close();
                                        return res.status(404).send("customer is not added");
                                    }
            
                                    
                                    request.query(`select * from summary where date = convert(date, '${firstDayDate}' , 5) and branchID = ${branchID} `, async(sError, sumSelRes) => {
                                        
                                        if(sError){ 
                                            await transaction.rollback();

                                            conn.close();
                                            return res.status(404).send("customer is not added");
                                        }
            
                                        if(sumSelRes.recordset.length === 0){
                                            //insertion into summary table
                                            request.query(`insert into summary(date, totalSale, branchID, totalEntries) 
                                            values(convert(date, '${firstDayDate}' , 5), ${vehiclePrice}, ${branchID}, 1)`, async(sInsErr, sInsResponce) => {
                                                
                                                if(sInsErr){ 
                                                    await transaction.rollback();

                                                    conn.close();
                                                    return res.status(404).send("customer is not added");
                                                }
            
                                                await transaction.commit();

                                                conn.close();
                                                return res.send(customerResponce.rowsAffected)
            
                                            })
            
                                        }else if(sumSelRes.recordset.length === 1){
                                            //updation in summary table
                                            request.query(`update summary set totalSale = totalSale + ${vehiclePrice}, totalEntries = totalEntries + 1 
                                            where date = convert(date, '${firstDayDate}' , 5) and branchID = ${branchID}`, async(sUpdaError, sUpdaResponce) => {
                                                if(sUpdaError){ 
                                                    await transaction.rollback();

                                                    conn.close();
                                                    return res.status(404).send("customer is not added");

                                                }
            
                                                await transaction.commit();

                                                conn.close();
                                                return res.send(customerResponce.rowsAffected)
                                            })
                                        }
                                    })
                                }
                        )
    
                    })
    
            
            })
        })


    } catch (error) {
        
        conn.close();
        return res.status(500).send(error)
    }

})

module.exports = router

