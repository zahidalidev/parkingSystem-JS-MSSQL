import React, {Component} from "react";
import TextField from "@material-ui/core/TextField";
import Button from "@material-ui/core/Button";

import {getEmployeeLogin} from "../http/api";
import colors from "../config/colors";

class Login extends Component{
    state = {
        employeeDetails: {
            empUserName: "",
            empPassword: ""
        }
    }

    handleChange = (e, name) => {
        const employeeDetails = this.state.employeeDetails;
        employeeDetails[name] = e.target.value;
        this.setState({employeeDetails})
    }

    handleLogin = async() => {
        const employeeDetails = this.state.employeeDetails;
        try {
            const {data} = await getEmployeeLogin(employeeDetails.empUserName, employeeDetails.empPassword);
            localStorage.setItem("token", data);
            alert("logged in")

            //refereshing page
            // window.location.reload(false)
            this.props.onHandleLogin();
        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }
        }
    }

    render(){

        return(
            <>
                 <div className="container" style={{
                    // display: 'flex',
                    width: "90%",
                    height: "102%",
                    justifyContent: "center",
                    boxShadow: `2px 2px 5px 5px ${colors.darkGray}`,
                    marginLeft: 10,
                    marginTop: 20,
                }}>
                    <div className="row" style={{justifyContent: "center", marginTop: 40}}>
                        <h2 style={{marginTop: 80, marginBottom: 50,fontWeight: "bold", color: colors.primary}} >Login</h2>
                        <div className = "col-md-12">
                            <div className="row" style={{marginBottom: 20, marginLeft: 170}}>
                                <div className="col-md-12">
                                    <TextField 
                                        style={{width: "80%", marginBottom: 30}}
                                        label="Login ID"
                                        variant="outlined"
                                        size="medium"
                                        onChange={(e) => this.handleChange(e, "empUserName")}
                                    />
                                </div>
                                <div className="col-md-12">
                                    <TextField 
                                        style={{width: "80%", marginBottom: 30}}
                                        label="Login password"
                                        variant="outlined"
                                        size="medium"
                                        onChange={(e) => this.handleChange(e, "empPassword")}
                                    />
                                </div>
                                <div className="col-md-12" style={{marginLeft: 160}}>
                                    <Button onClick={this.handleLogin} style={{width: 250, marginTop: 30, marginBottom: 30, backgroundColor: colors.primary}} variant="contained" color="primary">
                                        Login
                                    </Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}


export default Login;