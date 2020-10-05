import React, {Component} from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {getSerialNumbers, addSerialNumber} from "../http/api"
import colors from "../config/colors"
import "./table.css"


class AddStaffSerail extends Component{
    state = {
        staffSerial: '',
        allSerialNumber: []
    }

    componentDidMount = async() => {
        try {
            const {data: allSerialNumber } = await getSerialNumbers();   
            console.log(allSerialNumber); 

            this.setState({allSerialNumber})
        } catch (error) {

            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }

        }
    }

    handleSeria = (e) => {
        this.setState({staffSerial: e.target.value})
    }

    handleAddSerialNumber = async() => {
        const allOriginalSerailNumbers = [...this.state.allSerialNumber];
        
        const staffSerial = this.state.staffSerial;
        const allSerailNumbers = [...this.state.allSerialNumber, {serailNumber: staffSerial}];
        this.setState({allSerialNumber: allSerailNumbers})

        try {
            const {data } = await addSerialNumber(staffSerial); 
            console.log(data);          

        } catch (error) {
            this.setState({allSerialNumber: allOriginalSerailNumbers})

            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }

        }
    }

    render(){
        const {allSerialNumber} = this.state;

        return (
            <>
                <div className="container" style={{
                    // display: 'flex',
                    justifyContent: "center",
                    marginTop: 40
                }}>
                    <div className="row" style={{justifyContent: "center", marginBottom: 100}}>
                        <h2 style={{fontWeight: "bold", marginBottom: 50, alignItems: "center"}} >Manage Staff/Employee Serial Numbers</h2>
                        
                        <div className="col-md-12" style={{ justifyContent: "center"}}>
                            <div className="row" style={{marginBottom: 20, justifyContent: "center", marginLeft: 100}} >
                                <div className="col-md-6">
                                    <TextField 
                                        style={{width: "100%", }}
                                        label="Serial Number"
                                        variant="filled"
                                        size="medium"
                                        onChange={(e) => this.handleSeria(e)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Button onClick={this.handleAddSerialNumber} style={{width: 200, backgroundColor: colors.skyGreen, marginTop : 10, whiteSpace: "nowrap"}} variant="contained" color="primary">
                                        Add Serial Number
                                    </Button>
                                </div>
                            </div>   
                        </div>
                        <div className="col-md-12" style={{justifyContent: "center"}} >
                            <div className="table100 ver1 m-b-110">
                                <table className="table-bordered table-hover serailTable" data-vertable="ver1">
                                    <thead>
                                        <tr className="row100 head">
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column2" data-column="column2">No.</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column4" data-column="column4">Serial Number</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allSerialNumber.map((serial, i) => (
                                                <tr className="row100" >
                                                    <td style = {{color: "white", border:"2px solid #842335", backgroundColor: colors.tomato}} className=" hoverClass column100 column2" data-column="column2">{i + 1}</td>
                                                    <td style={{border:"2px solid #842335"}} className="column100 column3" data-column="column3">{serial.serailNumber}</td>
                                                </tr>
                                            ))
                                        }
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

export default AddStaffSerail;
