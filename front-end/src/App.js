import React, { Component } from 'react';
import {Route} from "react-router-dom";
import jwt from "jsonwebtoken"
import _ from "lodash"

import ResponsiveDrawer from './appBar/appBar';
import {getBranches, getAllEmployees} from "./http/api"
import VehicleEntry from './components/vehicleEntry';
import VehicleExit from './components/vehicleExit';
import ManageEmployee from './components/manageEmployee';
import Branches from './components/branches';
import Login from "./components/login"
import TodayReport from './components/todayReport';
import DayOfMonthReport from './components/dayOfMonthReport';
import MonthSummaryReport from './components/monthSummary';
import AddStaffSerail from './components/staffSerial';


class App extends Component {
  state = {
    branches: [],
    selectedBranchID: null,
    allEmployees: [],
    currentUser: {}
  }

  handleLogout = () => {
    this.setState({currentUser: {}});
  }

  handleLogin = () => {
    //setting current user that is currentlu logged in
    const token = localStorage.getItem('token');
    const currentUser = jwt.decode(token);
    console.log(currentUser)
    if(currentUser != null) this.setState({currentUser})
  }

  componentDidMount = async() => {
    //setting current user that is currentlu logged in
    this.handleLogin();

    try {
        //getting branches from server
        const {data: branches} = await getBranches();
        this.setState({branches});

        //getting employees from server
        const {data: allEmployees} = await getAllEmployees();
        this.setState({allEmployees});

    } catch (error) {
        if(error.message == "Network Error"){
            alert("Error: Network Error")
        }else{
            alert("Error: " + error.response.data)
        }
    }
  }

  //manage employees
  handleAddEmployee = (employee) => {
    const allEmployees = [...this.state.allEmployees];
    allEmployees.push(employee)
    this.setState({allEmployees})
  }
  handleDeleteEmployee = (name) => {
    let allEmployees = [...this.state.allEmployees];
    allEmployees = allEmployees.filter(em => em.empUserName != name)
    this.setState({allEmployees})
  }

  //this function is called from appBar to update selected branch
  handleCurrentBranch = (selectedBranchID) => {
    this.setState({selectedBranchID});
  }

  //manage branch for App bar
  handleDelteBranch = (id) => {
    const originalBranches = [...this.state.branches];
    originalBranches.map((mBr, j) => {
      let index = null;
      mBr.branches.map((br, i) => {
        if(br.branchID == id){
          index = i;
          mBr.branches.splice(i, 1)
        }
      }) 

      if(mBr.branches.length === 0){
        originalBranches.splice(j, 1)
      } 
    })

    this.setState({branches: originalBranches});
  }

  handleAddBranch = (branch, id) => {
    const originalBranches = [...this.state.branches];
    let index = false;
    originalBranches.map(mBr => {
      if(mBr.cityName === branch.cityName){
        mBr.branches.push({branchID: id, branchName: branch.branchName});
        index = true;
      }
    })
    if(index == false){
      originalBranches.push({cityName: branch.cityName, branches: [{branchID: id, branchName: branch.branchName}]})
    }
    this.setState({branches: originalBranches});
  }

  render(){
    const {branches, selectedBranchID, allEmployees, currentUser} = this.state;
    return (
      <div className="App">
        <div className="container">
          <div className="row">
            <div className="col-md-1">
              <ResponsiveDrawer onHandleLogout = {this.handleLogout} onCurrentUser = {currentUser} onBranches = {branches} onHandleCurrentBranch = {this.handleCurrentBranch} />
            </div>

            <div style={{marginTop: 100}} className="col-md-11">
              {
                _.isEmpty(currentUser) ? <Route path="/" exact render={(props) => <Login {...props} onHandleLogin = {this.handleLogin} /> } /> : null
              }
              


              {/* <VehicleEntry onSelectedBranchID={selectedBranchID} /> */}
              {/* <VehicleExit onSelectedBranchID={selectedBranchID} /> */}
              {/* <ManageEmployee onHandleDeleteEmployee = {this.handleDeleteEmployee} onHandleAddEmployee={this.handleAddEmployee} onAllEmployees = {allEmployees} onBranches = {branches} /> */}
              {/* <Branches onHandleAddBranch={this.handleAddBranch} onHandleDelteBranch = {this.handleDelteBranch} /> */}
              {/* <TodayReport onSelectedBranchID={selectedBranchID} /> */}
              {/* <DayOfMonthReport onSelectedBranchID={selectedBranchID} /> */}
              {/* <MonthSummaryReport /> */}
              {/* <AddStaffSerail /> */}


            </div>

          </div>
        </div>
      </div>
    );
  }
}

export default App;
