import React, {Component} from "react";
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

import {getAllBranches, deleteBranch, updateBranch, addBranch} from "../http/api"
import colors from "../config/colors"
import "./table.css"


class Branches extends Component{
    state = {
        allBranches: [],
        branch: {
            cityName: null,
            branchName: null
        }
    }

    componentDidMount = async() => {
        //getting all branches
        const {data: allBranches} = await getAllBranches();
        this.setState({allBranches});
    }

    handleCity = (e, ID) => {
        const allBranches = this.state.allBranches;
        const index = allBranches.findIndex(x => x.branchID == ID);
        allBranches[index].cityName = e.target.value;
        this.setState({allBranches})
    }

    handleBranch = (e, ID) => {
        const allBranches = this.state.allBranches;
        const index = allBranches.findIndex(x => x.branchID == ID);
        allBranches[index].branchName = e.target.value;
        this.setState({allBranches})
    }

    handleDeleteBranch = async(ID) => {
        const originalBranches = this.state.allBranches;
        const allBranches = originalBranches.filter(br => br.branchID != ID)
        this.setState({allBranches});

        try {
            const {data} = await deleteBranch(ID);
            
            if(data.rowsAffected[0] == 1){
                this.props.onHandleDelteBranch(ID)
                alert("Deleted")
            }else{
                alert("Not deleted try again")
            }

        } catch (error) {
            this.setState({allBranches: originalBranches})

            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }
        }
    }

    handleUpdateBranch = async(branch) => {
        try {
            const {data} = await updateBranch(branch.branchID, branch);
            if(data[0] == 1){
                this.props.onHandleDelteBranch(branch.branchID)
                this.props.onHandleAddBranch(branch, branch.branchID);
                alert("updated");
            }
            
        } catch (error) {
            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }
        }
    }

    handleCityBranch = (e, name) => {
        const branch = this.state.branch;
        branch[name] = e.target.value;
        this.setState({branch})
    }

    handleAddBranch = async() => {
        const originalBranches = [...this.state.allBranches];
        
        const allBranches = [...this.state.allBranches];
        const branch = this.state.branch;

        let maxID = 0;
        allBranches.map(br => {
            maxID = br.branchID;
        })
        
        try {
            const {data} = await addBranch(branch);
            
            allBranches.push({branchID: data[0].branchID, cityName: branch.cityName, branchName: branch.branchName});
            this.setState({allBranches})
            if(data.length > 0){
                this.props.onHandleAddBranch(branch, data[0].branchID);
                alert("branch Added")
            }            

        } catch (error) {
            this.setState({allBranches: originalBranches})

            if(error.message == "Network Error"){
                alert("Error: Network Error")
            }else{
                alert("Error: " + error.response.data)
            }

        }
    }

    render(){
        const {allBranches: branches} = this.state;

        return (
            <>
                <div className="container" style={{
                    // display: 'flex',
                    justifyContent: "center",
                    marginTop: 40
                }}>
                    <div className="row" style={{justifyContent: "center", marginBottom: 100}}>
                        <h2 style={{fontWeight: "bold", marginBottom: 50, alignItems: "center"}} >Manage Branches</h2>
                        
                        <div className="col-md-12" style={{ justifyContent: "center"}}>
                            <div className="row" style={{marginBottom: 20, justifyContent: "center", marginLeft: 100}} >
                                <div className="col-md-4">
                                    <TextField 
                                        style={{width: "100%", }}
                                        label="City Name"
                                        variant="filled"
                                        size="medium"
                                        onChange={(e) => this.handleCityBranch(e, "cityName")}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <TextField 
                                        style={{width: "100%", }}
                                        label="Branch Name"
                                        variant="filled"
                                        size="medium"
                                        onChange={(e) => this.handleCityBranch(e, "branchName")}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <Button onClick={this.handleAddBranch} style={{width: 150, backgroundColor: colors.skyGreen, marginTop : 10}} variant="contained" color="primary">
                                        Add Branch
                                    </Button>
                                </div>
                            </div>   
                        </div>
                        <div className="col-md-12" style={{justifyContent: "center"}} >
                            <div className="table100 ver1 m-b-110">
                                <table className="table-bordered table-hover" data-vertable="ver1">
                                    <thead>
                                        <tr className="row100 head">
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column2" data-column="column2">No.</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column3" data-column="column3">Branch ID</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column3" data-column="column3">City Name</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column4" data-column="column4">Branch Name</th>
                                            <th style={{cursor: "pointer", border:"2px solid #842335"}} className=" clickable column100 column4" data-column="column4"></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            branches.map((bran, i) => (
                                                <tr className="row100" >
                                                    <th style = {{color: "white", border:"2px solid #842335"}} className=" hoverClass column100 column2" data-column="column2">{i + 1}</th>
                                                    <td style={{border:"2px solid #842335"}} className="column100 column3" data-column="column3">{bran.branchID}</td>
                                                    <td style={{border:"2px solid #842335"}} className="column100 column3" data-column="column3"><input onChange={(text) => this.handleCity(text, bran.branchID)} value={bran.cityName} style={{height: 30, margin: "-15px", width: "80%"}} type="text" class="form-control"/></td>
                                                    <td style={{border:"2px solid #842335"}} className="column100 column4" data-column="column4"><input onChange={(text) => this.handleBranch(text, bran.branchID)} value={bran.branchName} style={{height: 30, margin: "-15px", width: "80%"}} type="text" class="form-control"/></td>
                                                    <Button onClick={() => this.handleUpdateBranch(bran)} style={{width: 70, marginLeft: 10, backgroundColor: colors.lightBlue, marginTop: 10, marginBottom: 10}} variant="contained" color="primary">
                                                        Update
                                                    </Button>
                                                    <Button onClick={() => this.handleDeleteBranch(bran.branchID)} style={{width: 70, marginLeft: 10, marginRight: -10, backgroundColor: colors.tomato, marginTop: 10, marginBottom: 10}} variant="contained" color="primary">
                                                        Delete
                                                    </Button>
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

export default Branches;
