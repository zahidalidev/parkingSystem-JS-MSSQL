const sql = require("mssql/msnodesqlv8");
const express = require("express");

const conn = require("../config/config");
const { route } = require("./customers");

const router = express.Router();

router.post("/", async(req, res) => {
  try {
    const cityName = req.body.cityName;
    const branchName = req.body.branchName;

    await conn.connect();

    const request = new sql.Request(conn);
    request.query(`insert into branches(cityName, branchName) values('${cityName}', '${branchName}')`, (err, branchReponce) => {
        if(err) {
            conn.close();
            return res.status(404).send("Branch is not Added");
        }

        request.query(`select TOP(1) branchID from branches order by branchID desc`, (gettingIDError, branchIDReponce) => {
            if(gettingIDError) {
                conn.close();
                return res.status(404).send("Branch ID getting Error");
            }
    
            conn.close();
            res.send(branchIDReponce.recordset)
    
        })

    })

  } catch (error) {
    conn.close();
    return res.status(500).send(error)
  }   
})


router.put("/:id", async(req, res) => {
    const branchID = req.params.id;
    const cityName = req.body.cityName;
    const branchName = req.body.branchName;

    try {
        await conn.connect();

        const request = new sql.Request(conn);

        request.query(`select branchID from branches where branchID = ${branchID}`, (err, branchesResponce) => {
            if(err) {
                conn.close();
                return res.status(404).send("No Branch found");
            }

            if(branchesResponce.recordset.length > 0){
                request.query(`update branches set cityName = '${cityName}', branchName = '${branchName}'
                    where branchID = ${branchID}`, (updateErr, branchesUpdateResponce) => {
                    if(updateErr) {
                        conn.close();
                        return res.status(404).send("No Branch Updated");
                    }
        
                    res.send(branchesUpdateResponce.rowsAffected)
                })

            }else{
                return res.status(404).send("No Branch found to Update");
            }
        })

    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})

router.get("/all", async(req, res) => {
    try {
        await conn.connect();

        const request = new sql.Request(conn);

        request.query("select * from branches", (err, branchesResponce) => {
            if(err) {
                conn.close();
                return res.status(404).send("No Branch found");
            }

            res.send(branchesResponce.recordset)
        })

    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})

router.get("/", async(req, res) => {
    try {
        const cityBranches = []

        //connecting
        await conn.connect();

        //for query
        const request = new sql.Request(conn);

        //quering
        request.query("select distinct cityName from branches", (err, citiesName) => {
            if(err) {
                conn.close();
                return res.status(404).send("No city found");
            }
            
            citiesName.recordset.map(city => {
                const cityName = {cityName: city.cityName, branches: []}
                cityBranches.push(cityName)
            })

            request.query("select * from branches", (err2, branches) => {
                if(err2){ 
                    conn.close();
                    return res.status(404).send("Not branch found");
                }
                
                branches.recordset.map((br) => {
                    const index = cityBranches.findIndex(c => c.cityName === br.cityName);
                    const branch = {branchID: br.branchID, branchName: br.branchName};
                    cityBranches[index].branches.push(branch);
                })

                conn.close();
                return res.send(cityBranches);

            })
            
        })
        
    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
});

router.delete("/:id", async(req, res) => {
    try {
        const branchID = req.params.id;
        
        await conn.connect();
        const request = new sql.Request(conn);

        request.query(`select branchID from employees where branchID = ${branchID}`, (err, emResponce) => {
            if(err){ 
                conn.close();
                return res.status(404).send("Branch not found");
            }
            if(emResponce.recordset.length > 0){
                conn.close();
                return res.status(400).send("This Branch have employees or customers so cannot be removed");
            }else{
                request.query(`select branchID from summary where branchID = ${branchID}`, (suError, sumResponce) => {
                    if(suError){ 
                        conn.close();
                        return res.status(404).send("Branch not found");
                    }
                    if(sumResponce.recordset.length > 0){
                        conn.close();
                        return res.status(400).send("This Branch have employees or customers so cannot be removed");
                    }else{
                        request.query(`delete from branches where branchID = ${branchID}`, (error, branchReponce) => {
                            if(error){ 
                                conn.close();
                                return res.status(404).send("Branch not found");
                            }
                            
                            conn.close();
                            return res.send(branchReponce);
                        })
                    }
                })
            }
        })


    } catch (error) {
        conn.close();
        return res.status(500).send(error)
    }
})

module.exports = router;