import React from 'react';
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import InputBase from '@material-ui/core/InputBase';
import Button from '@material-ui/core/Button';
import $ from "jquery"

import { getDateTime, getVehiclePrice, postCustomer, getFirstDateTime } from '../http/api';

import colors from "../config/colors";
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

class VehicleEntry extends React.Component {
    state = {
        selectedVehicleType: null,
        selectedStaff: false,
        vehiclePrice: null,
        customerDetails: {
            SerialNumber: "",
            vehicleNumber: "",
            entryTime: null,
            image: "",
            customerType: "normal",
            vehicleType: "",
            branchID: null,
        }
    }

    handleVehicleType = async(vehicleClass, vehicleType) => {
        $(`.${this.state.selectedVehicleType}`).css("background-color", colors.lightGray);
    
        $(`.${vehicleClass}`).css("background-color", colors.primary);
        this.setState({selectedVehicleType: vehicleClass});

        const customerDetails = this.state.customerDetails;
        customerDetails.vehicleType = vehicleType;

        this.setState({customerDetails})

        try {
            const entryTime = await getDateTime();
            customerDetails.entryTime = entryTime;

            const vehiclePrice = await getVehiclePrice(this.state.customerDetails.vehicleType)

            this.setState({customerDetails, vehiclePrice: vehiclePrice[0].vehiclePrice})
        } catch (error) {
            alert("Getting date Error: " + error)
        }
    }

    handleStaffStyle = (staffClass) => {
        const selectedStaff = this.state.selectedStaff;
        if(selectedStaff){
            $(`.${staffClass}`).css("background-color", colors.lightGray);
            this.setState({selectedStaff: !selectedStaff});
            
            const customerDetails = this.state.customerDetails;
            customerDetails.customerType = "normal";
            this.setState({customerDetails})
        }else{
            $(`.${staffClass}`).css("background-color", colors.primary);
            this.setState({selectedStaff: !selectedStaff});
            
            const customerDetails = this.state.customerDetails;
            customerDetails.customerType = "staff";
            this.setState({customerDetails})
        }
    }

    handleSerialNumber = (e) => {
        const customerDetails = this.state.customerDetails;
        customerDetails.SerialNumber = e.target.value;

        this.setState({customerDetails})
    }

    handleVehicleNumber = (e) => {
        const customerDetails = this.state.customerDetails;
        customerDetails.vehicleNumber = e.target.value;

        this.setState({customerDetails})
    }

    handleCustomer = async() => {
        const customer = this.state.customerDetails;
        customer.branchID = this.props.onSelectedBranchID;

        try {
            customer.entryTime = await getDateTime();
            customer.firstDayDate = await getFirstDateTime();

            const {data: res} = await postCustomer(customer)
            if(res[0] == 1){
                console.log("Customer is Added")
            }
            console.log("customer insertion Responce: ", res);
        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }
        }
    }

    render(){
      const { classes } = this.props;
      const {customerDetails, vehiclePrice} = this.state;
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
                            <h5 style={{fontWeight: "bold"}} >Scan Card or Enter Serial Number: </h5>
                            <TextField 
                                id="filled-basic" 
                                label="Card Serial Number" 
                                variant="filled" 
                                size="medium"
                                style={{width: "120%", marginBottom: 30}}
                                onChange={(e) => this.handleSerialNumber(e)}
                            />
                        </div>
                        {/* vehicle number feild */}
                        <div className="col-md-12">
                            <h5 style={{fontWeight: "bold"}} >Vehicle Number: </h5>
                            <TextField 
                                id="filled-basic" 
                                label="Vehicle Number" 
                                variant="filled" 
                                size="medium"
                                style={{width: "120%", marginBottom: 30}}
                                onChange={(e) => this.handleVehicleNumber(e)}
                            />
                        </div>
                        {/* selecting cutomer */}
                        <div className="col-md-8">
                            <h5 style={{fontWeight: "bold"}} >Staff/Employee: </h5>
                            <div className="row" style={{marginTop: 20}}>
                                <div className="col-md-9">
                                    <img
                                        style={{marginLeft: 40, padding: 15, backgroundColor: colors.lightGray, borderRadius: 50, cursor: "pointer"}}
                                        src={staffImage}
                                        title="No Staff"
                                        width="100px"
                                        height="100px"
                                        className="staffClass"
                                        onClick={() => this.handleStaffStyle("staffClass")}
                                        // style={{objectFit: "cover"}}
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="col-md-4" style={{whiteSpace: "nowrap"}}>
                            <h5 style={{fontWeight: "bold"}} >Entry Time:</h5>
                            <p style={{marginTop: 20, color: colors.primary, fontWeight : "bold", whiteSpace: "nowrap", fontSize: 18}}>{customerDetails.entryTime}</p>
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
                    <h4 style={{marginTop: 50, marginLeft: 120, fontSize: 30}} ><span style={{fontWeight: "bold", color: colors.primary}} >Price: </span>{vehiclePrice}</h4> 
                </div>
           </div>
           <div className="row" style={{marginTop: 30, marginLeft: 20}}>
                <div className="col-md-8">
                    <div className="row" style={{whiteSpace: "nowrap"}}>
                        <div className="col-md-2">
                            <h5 style={{fontWeight: "bold", whiteSpace: "nowrap", marginBottom: 30}} >Select Vehicle: </h5>
                        </div>
                        <div className="col-md-5" style={{cursor: "pointer"}} onClick={() => {
                            this.handleVehicleType("carClass", "car")
                        }} >
                            <img
                                style={{padding: 10, marginLeft: 60, backgroundColor: colors.lightGray, borderRadius: 10}}
                                src={car}
                                title="Live from space album cover"
                                width="185px"
                                height="120px"
                                className="carClass"
                            />
                        </div>
                        <div className="col-md-5" style={{cursor: "pointer"}} onClick={() => {
                            this.handleVehicleType("bikeClass", "bike")
                        }}>
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
                <Button onClick={this.handleCustomer} style={{width: 250, height: 50, marginTop: 30, marginLeft: -40}} variant="contained" color="primary">
                    Enter Vehicle
                </Button>
               </div>
           </div>
        </div>
      );
  }
}

export default withStyles(styles, { withTheme: true })(VehicleEntry);