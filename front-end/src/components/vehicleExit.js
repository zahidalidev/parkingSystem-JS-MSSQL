import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import $ from "jquery"

import { getCustomerDetail, getDateTime, updateCustomer} from '../http/api';
import colors from "../config/colors";
import {dBToJSCustomDate} from "../http/customDate";

import image from "../assets/10862.png"
import car from "../assets/car.png";
import bike from "../assets/bike.png";
import staffImage from "../assets/staff.png"

const BootstrapInput = withStyles((theme) => ({
    root: {
      'label + &': {
        marginTop: theme.spacing(3),
      },
    },
    input: {
      width: 170,
      borderRadius: 4,
      position: 'relative',
      backgroundColor: colors.lightGray,
      border: '2px solid #ced4da',
      fontSize: 18,
      color: colors.primary,
      padding: '15px 26px 15px 12px',
      transition: theme.transitions.create(['border-color', 'box-shadow']),
      // Use the system font instead of the default Roboto font.
      fontFamily: [
        '-apple-system',
        'BlinkMacSystemFont',
        '"Segoe UI"',
        'Roboto',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif',
        '"Apple Color Emoji"',
        '"Segoe UI Emoji"',
        '"Segoe UI Symbol"',
      ].join(','),
      '&:focus': {
        borderRadius: 4,
        borderColor: '#80bdff',
        boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
      },
    },
  }))(InputBase);
  


const styles = theme => ({
 
  details: {
    // display: 'flex',
    // flexDirection: 'column',
    width: 500
  },
  content: {
    flex: '1 0 auto',
  },
  controls: {
    display: 'flex',
    alignItems: 'center',
    paddingLeft: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  playIcon: {
    height: 38,
    width: 38,
  },
});

class VehicleExit extends React.Component {
    state = {
        SerialNumber: "",
        selectedVehicleType: null,
        selectedStaff: false,
        customerDetails: {},
        exitTime: "",
    }

    //getting serail number from feild
    handleSerialNumber = (e) => {
        const SerialNumber = e.target.value;
        this.setState({SerialNumber});
    }

    //getting details of customer with serialNumber
    handleDetails = async() => {
        try {
            const branchID = this.props.onSelectedBranchID;
            const serialNumber = this.state.SerialNumber;
            const customerDetails = await getCustomerDetail(branchID, serialNumber);
    
            //converting dateTime to custom dateTime
            if(customerDetails.entryDateTime){
                customerDetails.entryDateTime = dBToJSCustomDate(customerDetails.entryDateTime);
            }
    
            this.setState({customerDetails});
    
            //setting staff backGround color
            if(customerDetails.customerType === "staff"){
                $(`.staffClass`).css("background-color", colors.primary);
            }else{
                $(`.staffClass`).css("background-color", colors.lightGray);
            }
    
            //setting vehicle bacground Color
            if(customerDetails.vehicleType === "car"){
                $(`.carClass`).css("background-color", colors.primary);
                $(`.bikeClass`).css("background-color", colors.lightGray);
            }else if(customerDetails.vehicleType === "bike"){
                $(`.bikeClass`).css("background-color", colors.primary);
                $(`.carClass`).css("background-color", colors.lightGray);
            }else{
                $(`.bikeClass`).css("background-color", colors.lightGray);
                $(`.carClass`).css("background-color", colors.lightGray);
            }
    
            //getting exit time
            const exitTime = await getDateTime();
            this.setState({exitTime});
        } catch (error) {
            alert("error: " + error)
        }
    }

    handleCustomer = async() => {
        const customerDetails = this.state.customerDetails;
        const customerID = customerDetails.customerID;

        const body = {
            branchID: customerDetails.branchID,
            entryDateTime: customerDetails.entryDateTime,
            cardSerial: customerDetails.cardSerial,
            exitDateTime: this.state.exitTime 
        };

        try {
            const responce = await updateCustomer(customerID, body);
            if(responce[0] == 1){
                alert("successfull Exit")
            }else{
                alert("already Exited")
            }
            console.log("res: ", responce);
        } catch (error) {
            alert("Deleting Error" + error);
        }
    }

    render(){
      const { classes } = this.props;
      const {customerDetails, exitTime} = this.state;
      return (          
          <div className="container" style={{
            // display: 'flex',
            width: "90%",
            height: "102%",
            justifyContent: "center",
            boxShadow: `2px 2px 5px 5px ${colors.medium}`,
            marginLeft: 70,
            marginTop: -10,
          }}>
            <div className="row" style={{marginTop: 10}}>
                <div className="col-md-6">
                    <div className="row" style={{marginLeft: 20, marginTop: 60}}>
                        {/* card serial number feild */}
                        <div className="col-md-12">
                            <div className="row">
                                <div className="col-md-8">
                                    <h5 style={{fontWeight: "bold", whiteSpace: "nowrap"}} >Scan Card or Enter Serial Number: </h5>
                                    <TextField 
                                        id="filled-basic" 
                                        label="Card Serial Number" 
                                        variant="filled" 
                                        size="medium"
                                        style={{width: "120%", marginBottom: 30}}
                                        onChange={(e) => this.handleSerialNumber(e)}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Button onClick={this.handleDetails} style={{ backgroundColor: "green", marginTop: 65, marginLeft: 55, whiteSpace: "nowrap"}} variant="contained" color="primary">
                                        Get Details
                                    </Button>
                                </div>
                            </div>
                        </div>
                        {/* vehicle number feild */}
                        <div className="col-md-12">
                            <h5 style={{fontWeight: "bold"}} >Vehicle Number: </h5>
                            <TextField 
                                id = "filled-basic" 
                                variant = "filled" 
                                size = "medium"
                                disabled
                                value = {customerDetails.vehicleNumber || "" }
                                style = {{width: "120%", marginBottom: 30}}
                            />
                        </div>
                        {/* selecting cutomer */}
                        <div className="col-md-8">
                            <h5 style={{fontWeight: "bold"}} >Staff/Employee: </h5>
                            <div className="row" style={{marginTop: 20}}>
                                <div className="col-md-9">
                                    <img
                                        style={{marginLeft: 40, padding: 15, backgroundColor: colors.lightGray, borderRadius: 50}}
                                        src={staffImage}
                                        title="No Staff"
                                        width="100px"
                                        height="100px"
                                        className="staffClass"
                                        // style={{objectFit: "cover"}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4" style={{whiteSpace: "nowrap"}}>
                            <h5 style={{fontWeight: "bold"}} >Entry Time:</h5>
                            <p style={{marginTop: 20, color: colors.primary, fontWeight : "bold", whiteSpace: "nowrap", fontSize: 18}}>{customerDetails.entryDateTime}</p>
                            <h5 style={{fontWeight: "bold"}} >Exit Time:</h5>
                            <p style={{marginTop: 20, color: colors.primary, fontWeight : "bold", whiteSpace: "nowrap", fontSize: 18}}>{exitTime}</p>
                        </div>
                    </div>
                </div>
                <div className="col-md-5" style={{marginTop: 30}}>
                    {/* image */}
                    <img
                        style={{marginLeft: 100, borderRadius: 10}}
                        src={image}
                        title="Live from space album cover"
                        width="300px"
                        height="300px"
                        // style={{objectFit: "cover"}}
                    />
                    <h4 style={{marginTop: 50, marginLeft: 120, fontSize: 30}} ><span style={{fontWeight: "bold", color: colors.primary}} >Price: </span>{customerDetails.vehiclePrice}</h4> 
                </div>
           </div>
           <div className="row" style={{marginTop: 30, marginLeft: 20}}>
                <div className="col-md-8">
                    <div className="row" style={{whiteSpace: "nowrap"}}>
                        <div className="col-md-2">
                            <h5 style={{fontWeight: "bold", whiteSpace: "nowrap", marginBottom: 30}} >Select Vehicle: </h5>
                        </div>
                        <div className="col-md-5" >
                            <img
                                style={{padding: 10, marginLeft: 60, backgroundColor: colors.lightGray, borderRadius: 10}}
                                src={car}
                                title="Live from space album cover"
                                width="185px"
                                height="120px"
                                className="carClass"
                            />
                        </div>
                        <div className="col-md-5">
                            <img
                                style={{padding: 10, marginLeft: 20, backgroundColor: colors.lightGray, borderRadius: 10}}
                                src={bike}
                                title="Live from space album cover"
                                width="120px"
                                height="120px"
                                className="bikeClass"
                            />
                        </div>
                    </div>
                </div>
               <div className="col-md-4">
                <Button onClick={this.handleCustomer} style={{width: 250, height: 50, marginTop: 30, marginLeft: -40, backgroundColor: colors.primary}} variant="contained" color="primary">
                    Exit Vehicle
                </Button>
               </div>
           </div>
        </div>
      );
  }
}

export default withStyles(styles, { withTheme: true })(VehicleExit);