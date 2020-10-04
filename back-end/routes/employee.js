const express = require("express");
const sql = require("mssql/msnodesqlv8");
const jwt = require("jsonwebtoken");
const conn = require("../config/config")

const router = express.Router();

router.get("/:id", async(req, res) => {
    try {
        const empUserName = req.params.id;
        await conn.connect();

        const request = new sql.Request(conn);
        request.query(`select * from employees where empUserName = '${empUserName}'`, (emError, employeeResponce) => {
            
            if(emError) return res.status(404).send("employee name not found");

            if(employeeResponce.recordset.length != 0){
                conn.close();
                return res.send(employeeResponce.recordset);
            }else{
                conn.close();
                return res.status(404).send("employee with the User Name Not Found");
            }
            
        })
    } catch (error) {
        conn.close();
        return res.status(500).send(error);
    }

})


router.get("/:empUserName/:empPassword", async(req, res) => {
    try {
        const empUserName = req.params.empUserName;
        const empPassword = req.params.empPassword;

        await conn.connect();

        const request = new sql.Request(conn);
        request.query(`select * from employees where empUserName = '${empUserName}' and empPassword = '${empPassword}'`, (emError, employeeResponce) => {
            
            if(emError) return res.status(404).send("employee name not found");

            if(employeeResponce.recordset.length != 0){
                conn.close();
                const employee = employeeResponce.recordset[0];
                const empDetails = {
                    userName: employee.empUserName,
                    name: employee.empName,
                    branchID: employee.branchID,
                    roll: employee.empRoll,

                }

                const token = jwt.sign(empDetails, "p@rk1ngSystem")
                return res.send(token);
            }else{
                conn.close();
                return res.status(404).send("Employ ID or Password is Wrong");
            }
            
        })
    } catch (error) {
        conn.close();
        return res.status(500).send(error);
    }

})

router.get("/", async(req, res) => {
    try {
        await conn.connect();

        const request = new sql.Request(conn);
        request.query(`select * from employees`, (emError, employeeResponce) => {
            
            if(emError) return res.status(404).send("No Employee Found");

            if(employeeResponce.recordset.length != 0){
                conn.close();
                return res.send(employeeResponce.recordset);
            }else{
                conn.close();
                return res.status(404).send("No Employee Found");
            }
            
        })
    } catch (error) {
        conn.close();
        return res.status(500).send(error);
    }

})

router.post("/", async(req, res) => {
    const empName = req.body.empName;
    const empUserName = req.body.empUserName;
    const empPassword = req.body.empPassword;
    const empRoll = req.body.empRoll;
    const empContactNumber = req.body.empContactNumber;
    const branchID = req.body.branchID;

    try {
        await conn.connect();
        
        const request = new sql.Request(conn);

        request.query(`select empUserName from employees where empUserName = '${empUserName}'`, (emError, nameResponce) => {
            if(emError) {
                conn.close();
                return res.status(404).send("employee name Error")
            };

            if(nameResponce.recordset.length != 0){
                conn.close();
                return res.status(404).send("employee with the User Name already Exist");
            }else{
                request.query(`insert into employees(empName, empUserName, empPassword, empRoll, empContactNumber, branchID) 
                values('${empName}', '${empUserName}', '${empPassword}', '${empRoll}', '${empContactNumber}', ${branchID})`, (error, employeeResponce) => {
                    if(error) {
                        conn.close();
                        return res.status(400).send(error);
                    }
                    
                    conn.close();
                    return res.send(employeeResponce.rowsAffected)
                })
            }
            
        })

    } catch (error) {
        conn.close();
        return res.status(500).send(error);
    }
})

router.delete("/:id", async(req, res) => {
    try {
        const empUserName = req.params.id;
        await conn.connect();

        const request = new sql.Request(conn);
        request.query(`delete from employees where empUserName = '${empUserName}'`, (emError, employeeResponce) => {
            
            if(emError) {
                conn.close();
                return res.status(404).send("employee name not found");
            }

            if(employeeResponce.rowsAffected[0] == 1){
                conn.close();
                return res.send(employeeResponce);
            }else{
                conn.close();
                return res.status(404).send("employee with the User Name Not Found");
            }
            
        })
    } catch (error) {
        conn.close();
        return res.status(500).send(error);
    } 
})


router.put("/:id", async(req, res) => {
    const empUserName = req.params.id;
    const empName = req.body.empName;
    const empPassword = req.body.empPassword;
    const empRoll = req.body.empRoll;
    const empContactNumber = req.body.empContactNumber;
    const branchID = req.body.branchID;

    try {
        await conn.connect();
        
        const request = new sql.Request(conn);

        request.query(`select empUserName from employees where empUserName = '${empUserName}'`, (emError, nameResponce) => {
            if(emError) {
                conn.close();
                return res.status(404).send("employee name Error")
            };

            if(nameResponce.recordset.length == 0){
                conn.close();
                return res.status(404).send("employee with the User Name Not Found");
            }else{
                request.query(`update employees set empName = '${empName}', empUserName = '${empUserName}', 
                    empPassword = '${empPassword}', empRoll = '${empRoll}', empContactNumber = '${empContactNumber}',
                    branchID = ${branchID} where empUserName = '${empUserName}'`, (error, employeeResponce) => {
                    if(error){ 
                        conn.close();
                        return res.status(400).send(error);
                    }
                    
                    conn.close();
                    return res.send(employeeResponce.rowsAffected)
                })
            }
            
        })


    } catch (error) {
        conn.close();
        return res.status(500).send(error);
    }
})

module.exports = router;