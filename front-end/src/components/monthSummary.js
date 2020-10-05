import React, {Component} from "react";
import Grid from "@material-ui/core/Grid"
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider, KeyboardDatePicker } from '@material-ui/pickers'
import Button from "@material-ui/core/Button"
import schedule from "node-schedule";

import { getMonthSummaryReport } from "../http/api";
import {dBToJSCustomDate, customDate} from "../http/customDate";
import colors from "../config/colors";
import "./tableReport.css"

class MonthSummaryReport extends Component{
    state = {
        selectedDate: new Date('2020-01-01T21:11:54'),
        report: [],
        summaryDate: ''
    }

    handleCurrentReport = async() => {
        try {
            const currentDate = new Date(this.state.selectedDate);
            currentDate.setDate('01');
            const date = customDate(currentDate);

            const {data} = await getMonthSummaryReport(date);

            if(data.length > 0){
                data.map((summary) => {
                    const dateArr = summary.date.split("-");
                    summary.date = dateArr[1] + "-" + dateArr[0];
                })
    
                this.setState({report: data, summaryDate: data[0].date})
            }else{
                alert("not Report Found")
            }

        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }
        }
    }

    handleDateChange = (date) => {
        this.setState({selectedDate: date});
    };

    render(){
        const {selectedDate, summaryDate, report} = this.state;

        return(
            <div className="container" >
                    <div className="row" style={{marginTop: 80}}>
                        <div className="col-md-2" ></div>

                        <div className="col-md-3">
                            <h5 style={{marginLeft: -10, fontWeight: "bold", color: colors.secondary, whiteSpace: "nowrap"}}>Select Month Within Year</h5>
                        </div>
                        <div className="col-md-3">
                            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                                <Grid container justify="space-around" style={{marginTop: -40, color: colors.primary, fontSize: 20}} >
                                    <KeyboardDatePicker
                                        disableToolbar
                                        variant="inline"
                                        format="MM-yyyy"
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
                                    <h2 style={{fontFamily: "red serifs", fontWeight: "bold", marginBottom: 50, alignItems: "center"}} >Report Summary of {summaryDate}</h2>
                        <div className="col-md-12" style={{justifyContent: "center", marginRight: 0, marginLeft: 15}} >
                            <div className="table100 ver1 m-b-110" >
                                <table className="table-bordered table-hover " data-vertable="ver1">
                                    <thead>
                                        <tr className="row100 head">
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column2" data-column="column2">No.</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column3" data-column="column3">Branch Name</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column4" data-column="column4">Date</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column5" data-column="column5">Total Sale</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column6" data-column="column6">Total Entries</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                      {report.map((summary, i) => (
                                        <tr className="row100" key={i} >
                                            <th style = {{color: "white", border:"2px solid #842335"}} className=" hoverClass column100 column2" data-column="column2">{i+1}</th>
                                            <td style={{border:"2px solid #842335"}} className="column100  column3" data-column="column3">{summary.branch}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column4" data-column="column4">{summary.date}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column5" data-column="column5">{summary.totalSale}</td>
                                            <td style={{border:"2px solid #842335"}} className="column100  column6" data-column="column6">{summary.totalEntries}</td>
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

export default MonthSummaryReport;