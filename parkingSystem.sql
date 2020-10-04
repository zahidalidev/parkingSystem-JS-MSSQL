create database parkingSystem
USE parkingSystem

-- -----------------------------------------------------
-- Table `parkingSystem`.`branches`
-- -----------------------------------------------------

CREATE TABLE branches (
  branchID INT NOT NULL IDENTITY,
  cityName VARCHAR(255) NOT NULL,
  branchName VARCHAR(255) NOT NULL,
  PRIMARY KEY (branchID)
)

-- -----------------------------------------------------
-- Table `parkingSystem`.`vehicles`
-- -----------------------------------------------------

CREATE TABLE vehicles(
  vehicleType VARCHAR(55) NOT NULL,
  vehiclePrice VARCHAR(55) NOT NULL,
  PRIMARY KEY (vehicleType)
)

-- -----------------------------------------------------
-- Table `parkingSystem`.`customers`
-- -----------------------------------------------------

CREATE TABLE customers(
  customerID INT NOT NULL IDENTITY,
  cardSerial VARCHAR(55) NOT NULL,
  vehicleNumber VARCHAR(55) NOT NULL,
  entryDateTime dateTime NOT NULL,
  exitDateTime dateTime NULL,
  date date NOT NULL,
  image VARCHAR(555) NULL,
  customerType VARCHAR(55) NOT NULL,
  vehicleType VARCHAR(55) NOT NULL,
  vehiclePrice VARCHAR(55) NOT NULL,
  branchID INT NOT NULL foreign key references branches(branchID),
  PRIMARY KEY (customerID)
)

-- -----------------------------------------------------
-- Table `parkingSystem`.`employees`
-- -----------------------------------------------------

CREATE TABLE employees(
  employeeID INT NOT NULL IDENTITY,
  empName VARCHAR(255) NOT NULL,
  empUserName VARCHAR(255) NOT NULL unique,
  empPassword VARCHAR(255) NOT NULL,
  empRoll VARCHAR(255) NOT NULL,
  empContactNumber VARCHAR(255) NOT NULL,
  branchID INT NULL foreign key references branches(branchID),
  PRIMARY KEY (employeeID),
)

-- -----------------------------------------------------
-- Table `parkingSystem`.`staffEmployeeSerials`
-- -----------------------------------------------------

CREATE TABLE staffEmployeeSerials (
  serailNumber VARCHAR(255) NOT NULL,
  PRIMARY KEY (serailNumber)
)

-- -----------------------------------------------------
-- Table `parkingSystem`.`summary`
-- -----------------------------------------------------

CREATE TABLE summary (
  summaryID INT NOT NULL IDENTITY,
  date date NOT NULL,
  totalSale int NULL,
  totalEntries int NULL,
  branchID INT NOT NULL foreign key references branches(branchID),
  PRIMARY KEY (summaryID),
)

drop table summary


