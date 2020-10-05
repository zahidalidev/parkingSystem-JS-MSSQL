const express = require("express");
const cors = require("cors");

const branches = require("./routes/branches");
const customers = require("./routes/customers");
const vehicles = require("./routes/vehicles");
const employee = require("./routes/employee");
const serailNumbers = require("./routes/serailNumbers");

const app = express();

// middle ware
app.use(cors())
app.use(express.json());
app.use("/api/branches", branches);
app.use("/api/customers", customers);
app.use('/api/vehicle', vehicles);
app.use("/api/employees", employee);
app.use("/api/serailNumbers", serailNumbers);

// setting port if not in environment variable then 5000
app.set('port', (process.env.PORT || 5000));

// listining on port
app.listen(app.get("port"), () => console.log(`app is running on port ${app.get("port")}...`))

