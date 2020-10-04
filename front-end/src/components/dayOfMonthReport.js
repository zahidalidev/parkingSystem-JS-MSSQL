import React, {Component} from "react";
import Grid from "@material-ui/core/Grid"
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import Button from "@material-ui/core/Button"
import schedule from "node-schedule";

import { getDayOfMOnthReport } from "../http/api";
import {dBToJSCustomDate, customDate} from "../http/customDate";
import colors from "../config/colors";
import "./tableReport.css"

class DayOfMonthReport extends Component{
    state = {
        selectedDate: new Date('2020-01-01T21:11:54'),
        report: []
    }

    handleCurrentReport = async() => {
        try {
            const date = customDate(new Date(this.state.selectedDate));
            const {data} = await getDayOfMOnthReport(this.props.onSelectedBranchID, date);
            data.map((customer) => {
                customer.entryDateTime = dBToJSCustomDate(customer.entryDateTime)
                customer.exitDateTime = customer.exitDateTime == null ? customer.exitDateTime : dBToJSCustomDate(customer.exitDateTime);
            })
            this.setState({report: data})
        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }
        }

        //to run after 10 seconds
        var rule = new schedule.RecurrenceRule();
        rule.second = [0, 10, 20, 30, 40, 50, 59];
        
        schedule.scheduleJob(rule, async() => {
            try {
                let date2 = customDate(new Date(this.state.selectedDate));
                const {data} = await getDayOfMOnthReport(this.props.onSelectedBranchID, date2);
                data.map((customer) => {
                    customer.entryDateTime = dBToJSCustomDate(customer.entryDateTime)
                    customer.exitDateTime = customer.exitDateTime == null ? customer.exitDateTime : dBToJSCustomDate(customer.exitDateTime);
                })
                this.setState({report: data})
            } catch (error) {
                if(error.message == "Network Error"){
                    alert("Error: Network Error")
                }else{
                    alert("Error: " + error.response.data)
                }
            }
        });
    }
    handleDateChange = (date) => {
        this.setState({selectedDate: date});
    };

    render(){
        const {selectedDate} = this.state;
        const {report} = this.state;

        return(
            <div className="container" >
                    <div className="row" style={{marginTop: 80}}>
                        <div className="col-md-2" ></div>

                        <div className="col-md-3">
                            <h5 style={{fontFamily: "red serifs", marginLeft: -10, fontWeight: "bold", color: colors.secondary, whiteSpace: "nowrap"}}>Select Date Within month</h5>
                        </div>
                        <div className="col-md-3">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around" style={{marginTop: -40, color: colors.primary, fontSize: 20}} >
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM-dd-yyyy"
                                        margin="normal"
                                        id="date-picker-inline"
                                        label="Pick Date Withink Month"
                                        value={selectedDate}
                                        onChange={this.handleDateChange}
                                        KeyboardButtonProps={{
                                            'aria-label': 'change date',
                                        }}
                                    />
                                </Grid>
                            </MuiPickersUtilsProvider>
                        </div>
                        <div className="col-md-2" >
                            <Button
                                style={{marginTop: -13}}
                                variant="contained"
                                color="primary"
                                onClick={this.handleCurrentReport}
                            >Generate</Button>
                        </div>

                        <div className="col-md-2" ></div>
                    </div>
                    {/* report table */}
                    <div className="row" style={{justifyContent: "center", marginBottom: 100, marginTop: 50}}>
                        <h2 style={{fontFamily: "red serifs", fontWeight: "bold", marginBottom: 50, alignItems: "center"}} >Report of {selectedDate.toDateString()}</h2>
                        <div style={{justifyContent: "center", marginRight: 0, marginLeft: 15}} >
                            <div className="table100 ver1 m-b-110" style={{overflow:"auto", maxWidth: "1130px"}} >
                                <table className="table-bordered table-hover reportTable" data-vertable="ver1">
                                    <thead>
                                        <tr className="row100 head">
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column2" data-column="column2">No.</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column3" data-column="column3">Customer ID</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column4" data-column="column4">Card Serial</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column5" data-column="column5">Vehicle Number</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column6" data-column="column6">Entry DateTime</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column6" data-column="column6">Exit DateTime</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column6" data-column="column6">Customer Type</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column6" data-column="column6">Vehicle Type</th>
                                        <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column6" data-column="column6">vehiclePrice</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                      {report.map((customer, i) => (
                                        <tr className={customer.exitDateTime == null ? "row100 condColor" : "row100"} >
                                            <th style = {{color: "white", border:"2px solid #842335"}} className=" hoverClass column100 column2" data-column="column2">{i+1}</th>
                                            <td style={{border:"2px solid #842335"}} className="column100  column3" data-column="column3">{customer.customerID}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column4" data-column="column4">{customer.cardSerial}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column5" data-column="column5">{customer.vehicleNumber}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column6" data-column="column6">{customer.entryDateTime}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column3" data-column="column3">{customer.exitDateTime}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column4" data-column="column4">{customer.customerType}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column5" data-column="column5">{customer.vehicleType}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column6" data-column="column6">{customer.vehiclePrice}</td>
                                        </tr>
                                      ))
                                        }
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
            </div>
        );
    }
}

export default DayOfMonthReport;