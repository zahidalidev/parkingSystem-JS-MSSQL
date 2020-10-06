import axios from "axios";
import http from "../config/http";
import {customDate} from "./customDate";

const endPoint = http.apiEndPoint;
const dataTimeEndPoint = http.dataTimeEndPoint;


                              //manage Serial Numbers

//getting Serial Numbers
export const getSerialNumbers = async() => {
  const data = await axios.get(`${endPoint}/serailNumbers`)
  return data;
}

//adding Serial Number
export const addSerialNumber = async(serial) => {
  const data = await axios.post(`${endPoint}/serailNumbers/${serial}`);
  return data;
}

                              //manage branches
//getting all branches
export const getBranches = async() => {
    const data = await axios.get(`${endPoint}/branches`)
    return data;
}

//getting branches in simple format
export const getAllBranches = async() => {
  const data = await axios.get(`${endPoint}/branches/all`);
  return data;
}

//delete branch
export const deleteBranch = async(id) => {
  const data = await axios.delete(`${endPoint}/branches/${id}`)
  return data;
}

//add Branch
export const addBranch = async(body) => {
  const data = await axios.post(`${endPoint}/branches`, body);
  return data;
}

//update branch
export const updateBranch = async(id, body) => {
  const data = axios.put(`${endPoint}/branches/${id}`, body);
  return data;
}
                              //manage customers and reports

export const getMonthSummaryReport = async(date) => {
  const data = await axios.get(`${endPoint}/customers/summary/${date}`);
  return data;
}

export const getTodayReport = async(id) => {
  const date = await getDateTime();
  const data = await axios.get(`${endPoint}/customers/report/${id}/${date}`);
  return data;
}

export const getDayOfMOnthReport = async(id, date) => {
  const data = await axios.get(`${endPoint}/customers/report/${id}/${date}`);
  return data;
}

//posting customer data
export const postCustomer = async(body) => {
    const data = await axios.post(`${endPoint}/customers`, body);
    return data;
}

//updating 
export const updateCustomer = async(customerID, body) => {
  const {data} = await axios.put(`${endPoint}/customers/${customerID}`, body)
  return data;
}

//getting customer with the serialNumber
export const getCustomerDetail = async(branchID, serialNumber) => {
  const {data} = await axios.get(`${endPoint}/customers/customerDetails/${branchID}/${serialNumber}`)
  return data;
}

                                //manage vehicles
//getting price of vehicle
export const getVehiclePrice = async(vehicleType) => {
  const {data} = await axios.get(`${endPoint}/vehicle/price/${vehicleType}`);
  return data;
}

                                //manage Employees
//inserting employee
export const postEmployee = async(body) => {
  const data = await axios.post(`${endPoint}/employees`, body);
  return data;
} 

//get employee by username
export const getEmployee = async(id) => {
  const data = await axios.get(`${endPoint}/employees/${id}`)
  return data;
}

//get employee by login credentials
export const getEmployeeLogin = async(empUserName, empPassword) => {
  const data = await axios.get(`${endPoint}/employees/${empUserName}/${empPassword}`)
  return data;
}

//delete employee
export const deleteEmployee = async(id) => {
  const data = await axios.delete(`${endPoint}/employees/${id}`)
  return data;
} 

//update employee
export const updateEmployee = async(id, body) => {
  const data = await axios.put(`${endPoint}/employees/${id}`, body);
  return data;
}

//gettting all employees
export const getAllEmployees = async() => {
  const data = await axios.get(`${endPoint}/employees`)
  return data;
}

//getting time from world API
export const getDateTime = async() => {
  const {data} = await axios.get(dataTimeEndPoint)

  const apiTime = new Date(data.utc_datetime);
  
  const apiYMDHM = customDate(apiTime); //making custom date

  return apiYMDHM
}

//getting time from world API and setting day to 1 for summary
export const getFirstDateTime = async() => {
  const {data} = await axios.get(dataTimeEndPoint)
  const apiTime = new Date(data.utc_datetime);
  apiTime.setDate('01');
  console.log(apiTime)

  const apiYMDHM = customDate(apiTime); //making custom date
  return apiYMDHM
}

//validating system date time by comparing system dataTime and the dateTime from API
// export const validateSystemDate = async() => {
//   const {data} = await axios.get(dataTimeEndPoint)

//   const apiTime = new Date(data.utc_datetime);
//   const apiYMDHM = apiTime.getFullYear().toString() + " " + apiTime.getMonth().toString() + " " + apiTime.getDay().toString() + " " + apiTime.getHours().toString() + " " + apiTime.getMinutes().toString();
  
//   const localTime = new Date();
//   const localYMDHM = localTime.getFullYear().toString() + " " + localTime.getMonth().toString() + " " + localTime.getDay().toString() + " " + localTime.getHours().toString() + " " + localTime.getMinutes().toString();

//   if(apiYMDHM === localYMDHM){
//     return apiYMDHM
//   }else{
//     return false;
//   }
// }