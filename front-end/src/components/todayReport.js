import React, {Component} from "react";
import schedule from "node-schedule";

import { getTodayReport } from "../http/api";
import {dBToJSCustomDate} from "../http/customDate";
import colors from "../config/colors";
import "./tableReport.css"

let unMount = true; //to stop request when component Unmount
class TodayReport extends Component{
    state = {
        report: [],
    }

    componentWillUnmount = () => {
        unMount = false;
    }

    componentDidMount = async() => {
        //on mounting component
        unMount = true;

        try {
            const {data} = await getTodayReport(this.props.onSelectedBranchID);
            data.map((customer) => {
                customer.entryDateTime = dBToJSCustomDate(customer.entryDateTime)
                customer.exitDateTime = customer.exitDateTime == null ? customer.exitDateTime : dBToJSCustomDate(customer.exitDateTime);
            })
            this.setState({report: data})
        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Day Report Network Error")
            }else{
                alert("Error: " + error.response.data)
            }
        }

        //to run after 10 seconds
        var rule = new schedule.RecurrenceRule();
        rule.second = [0, 10, 20, 30, 40, 50, 59];
        schedule.scheduleJob(rule, async() => {
            
            if(unMount){    //to stop when component will unMount
                try {
                    const {data} = await getTodayReport(this.props.onSelectedBranchID);
                    data.map((customer) => {
                        customer.entryDateTime = dBToJSCustomDate(customer.entryDateTime)
                        customer.exitDateTime = customer.exitDateTime == null ? customer.exitDateTime : dBToJSCustomDate(customer.exitDateTime);
                    })
                    this.setState({report: data})
                } catch (error) {
                    if(error.message == "Network Error"){
                        alert("Error: Day Report Network Error")
                    }else{
                        alert("Error: " + error.response.data)
                    }
                }
            }

        });
    }

    render(){
        const {report} = this.state;

        return(
            <div className="container" >
                    <div className="row " style={{ marginTop: 20}} >
                        <div className="col-md-12">
                            <h2 style={{fontWeight: "bold", marginLeft: "40%", fontFamily: "red serifs"}} >Today's Report</h2>
                        </div>
                    </div>
                    {/* report table */}
                    <div className="row" style={{justifyContent: "center", marginBottom: 100, marginTop: 50}}>
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
                                        <tr key={i} className={customer.exitDateTime == null ? "row100 condColor" : "row100"} >
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

export default TodayReport;