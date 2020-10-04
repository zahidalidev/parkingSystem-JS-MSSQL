import React, {Component} from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import colors from "../config/colors";
import { getEmployee, postEmployee, deleteEmployee, updateEmployee, getAllEmployees } from "../http/api";
import "./table.css";


class ManageEmployee extends Component{
    state = {
        employeeDetails: {
            empName: null,
            empUserName: null,
            empPassword: null,
            empRoll: "employee",
            empContactNumber: null,
            branchID: null
        },
        updatedEmployees: []
    }

    handleInputValues = (name, value) => {
        const employeeDetails = this.state.employeeDetails;
        employeeDetails[name] = value;
        this.setState({employeeDetails});
        console.log(employeeDetails)
    }

    handleName = (e) => {
        this.handleInputValues("empName", e.target.value);
    }

    handleLoginID = (e) => {
        this.handleInputValues("empUserName", e.target.value)
    }

    handleLoginPassword = (e) => {
        this.handleInputValues("empPassword", e.target.value)
    }
    
    handleContact = (e) => {
        this.handleInputValues("empContactNumber", e.target.value)
    }

    handleEmployeeRoll = (e) => {
        this.handleInputValues("empRoll", e.target.value)
    }

    handleBranch = (e) => {
        this.handleInputValues("branchID", e.target.value)
    }

    GetEmployeeDetails = async() => {
        try {
            const {data} = await getEmployee(this.state.employeeDetails.empUserName);
            this.setState({employeeDetails: data[0]})
        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }
        }
    }
    
    addEmployee = async() => {
        const body = this.state.employeeDetails;
        
        //adding employees 
        this.props.onHandleAddEmployee(body)

        try {
            const {data} = await postEmployee(body)
            if(data[0] == 1){
                alert("Employee Added Successfully")
            }else{
                alert("emplyee not added")
            }
            
        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }

            this.props.onHandleDeleteEmployee(body.empUserName)
        }
    }
    
    deleteEmployee = async() => {
        const userName = this.state.employeeDetails.empUserName;
        
        //updating employees
        this.props.onHandleDeleteEmployee(userName)

        try {
            const {data} = await deleteEmployee(userName);
            if(data.rowsAffected[0] == 1){
                alert("Deleted Successfull")
            }else{
                alert("Not Deleted")
            }

        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }

            //adding employees 
            const body = this.state.employeeDetails;
            this.props.onHandleAddEmployee(body)
        }
    }

    updateEmployee = async() => {
        const emmUsername = this.state.employeeDetails.empUserName
        const body =  this.state.employeeDetails;

        try {
            const {data} = await updateEmployee(emmUsername, body);
            if(data[0] == 1){
                //updating employee
                this.props.onHandleDeleteEmployee(emmUsername)
                this.props.onHandleAddEmployee(body)
                
                alert("updated")
            }
           
        } catch (error) {
            alert("Error: " + error.response.data)
        }
    }

    render(){
        const {employeeDetails} = this.state;
        const {onBranches: branches} = this.props;
        const {updatedEmployees} = this.state;
        const allEmployees = updatedEmployees.length === 0 ? this.props.onAllEmployees : updatedEmployees;

        return(
            <>
                <div className="container" style={{
                    // display: 'flex',
                    width: "90%",
                    // height: "102%",
                    justifyContent: "center",
                    boxShadow: `2px 2px 5px 5px ${colors.medium}`,
                    marginLeft: 70,
                    marginTop: -10,
                }}>
                    <div className="row" style={{justifyContent: "center", marginTop: 40}}>
                        <h2 style={{marginTop: 50, marginBottom: 50,fontWeight: "bold"}} >Manage Employees</h2>
                        <div className = "col-md-12" style={{marginLeft: 70}}>
                            <div className="row" style={{marginBottom: 20}}>
                                <div className="col-md-6" >
                                    <div className="row">
                                        <div className="col-md-8">
                                            <TextField 
                                                style={{width: "100%", }}
                                                label="Employee Login ID"
                                                variant="filled"
                                                size="medium"
                                                value = {employeeDetails.empUserName}
                                                onChange={(e) => this.handleLoginID(e)}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <Button onClick={this.GetEmployeeDetails} style={{width: 100, height: 50, backgroundColor: colors.skyGreen}} variant="contained" color="primary">
                                                Details
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <TextField 
                                        style={{width: "80%", }}
                                        label="Employee Login ID Password"
                                        variant="filled"
                                        size="medium"
                                        value={employeeDetails.empPassword}
                                        onChange={(e) => this.handleLoginPassword(e)}
                                    />
                                </div>
                            </div>                       
                            <div className="row" style={{marginBottom: 20}} >

                                <div className="col-md-6">
                                    <TextField 
                                        style={{width: "80%", }}
                                        label="Employee Name"
                                        variant="filled"
                                        size="medium"
                                        value={employeeDetails.empName}
                                        onChange={(e) => this.handleName(e)}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <TextField 
                                        style={{width: "80%", }}
                                        label="Employee Mobie Number"
                                        variant="filled"
                                        size="medium"
                                        value={employeeDetails.empContactNumber}
                                        onChange={(e) => this.handleContact(e)}
                                    />
                                </div>
                            </div>                       
                            <div className="row" style={{marginBottom: 20}} >
                                <div className="col-md-6">
                                    <FormControl variant="filled" style={{minWidth: 340}}>
                                        <InputLabel htmlFor="grouped-native-select">Select Branch</InputLabel>
                                        <Select native defaultValue="" id="grouped-native-select" 
                                            value={parseInt(employeeDetails.branchID)}
                                            onChange={(branchID) => this.handleBranch(branchID)}
                                        >
                                            <option aria-label="None" value="" />
                                            {
                                                branches.map(city => (
                                                    <optgroup label={city.cityName}>
                                                        {
                                                            city.branches.map((subBranch) => (
                                                                <option value={subBranch.branchID}>{subBranch.branchName}</option>
                                                            ))
                                                        }
                                                    </optgroup>
                                                ))
                                            }
                                        </Select>
                                    </FormControl>
                                </div>

                                <div className="col-md-6">
                                    <FormControl variant="filled" style={{minWidth: 340}}>
                                        <InputLabel id="demo-simple-select-filled-label">Select Roll</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-filled-label"
                                            id="demo-simple-select-filled"
                                            value={employeeDetails.empRoll}
                                            onChange={(roll) => this.handleEmployeeRoll(roll)}
                                        >
                                            <MenuItem value={"employee"}>Employee</MenuItem>
                                            <MenuItem value={"super Visor"}>Super Visor</MenuItem>
                                            <MenuItem value={"admin"}>Admin</MenuItem>
                                        </Select>
                                    </FormControl>
                                </div>
                            </div>                       
                        </div>
                            <div className="row" style={{justifyContent: "center", marginLeft: -35, marginBottom: 50}}>
                                <div className="col-md-4">
                                    <Button onClick={this.updateEmployee} style={{width: 250, height: 50, marginTop: 30, marginBottom: 30, backgroundColor: colors.lightBlue}} variant="contained" color="primary">
                                        Update Employee
                                    </Button>
                                </div>
                                <div className="col-md-4">
                                    <Button onClick={this.addEmployee} style={{width: 250, height: 50, marginTop: 30, marginBottom: 30, backgroundColor: colors.skyGreen}} variant="contained" color="primary">
                                        Add Employee
                                    </Button>
                                </div>
                                <div className="col-md-4">
                                    <Button onClick={this.deleteEmployee} style={{width: 250, height: 50, marginTop: 30, marginBottom: 30, backgroundColor: colors.tomato}} variant="contained" color="primary">
                                        Delete Employee
                                    </Button>
                                </div>
                            </div>                       
                    </div>
                </div>

                <div className="container" style={{
                    // display: 'flex',
                    justifyContent: "center",
                    marginTop: 40
                }}>
                    <div className="row" style={{justifyContent: "center", marginBottom: 100}}>
                        <h2 style={{fontWeight: "bold", marginBottom: 50, alignItems: "center"}} >All Employees</h2>
                        <div className="col-md-12" style={{justifyContent: "center"}} >
                            <div className="table100 ver1 m-b-110">
                                <table className="table-bordered table-hover" data-vertable="ver1">
                                    <thead>
                                        <tr className="row100 head">
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column2" data-column="column2">No.</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column3" data-column="column3">Name</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column4" data-column="column4">Login ID</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column5" data-column="column5">Mobile Number</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column6" data-column="column6">Login Password</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {allEmployees.map((emp, i) => (
                                            <tr className="row100" key={i} >
                                                <th style = {{color: "white", border:"2px solid #842335"}} className=" hoverClass column100 column2" data-column="column2">{i+1}</th>
                                                <td style={{border:"2px solid #842335"}} className="column100 column3" data-column="column3">{emp.empName}</td>
                                                <td style={{border:"2px solid #842335"}} className="column100 column4" data-column="column4">{emp.empUserName}</td>
                                                <td style={{border:"2px solid #842335"}} className="column100 column5" data-column="column5">{emp.empContactNumber}</td>
                                                <td style={{border:"2px solid #842335"}} className="column100 column6" data-column="column6">{emp.empPassword}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
} 

export default ManageEmployee;