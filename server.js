const inquirer = require("inquirer");
const fs = require("fs");
const ctable = require("console.table");
const mysql = require("mysql2");
const util = require("util");

// Logo requirements: 
const logo = require('asciiart-logo');
const config = require('./package.json');
console.log(logo(config).render());



// connection 
const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: 12345678,
    database: "employee_tracker",
});