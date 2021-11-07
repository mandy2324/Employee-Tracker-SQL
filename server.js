const inquirer = require("inquirer");
const fs = require("fs");
const ctable = require("console.table");
const mysql = require("mysql2");
const util = require("util");

// Logo requirements:
const logo = require("asciiart-logo");
const config = require("./package.json");
console.log(logo(config).render());

// connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3001,
    user: "root",
    password: 12345678,
    database: "employee_tracker",
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        res.status(500);
        return res.send("error connecting the database");
    }
    console.log("connection successfull");

    runSearch();
});


const runSearch = () => {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "what would you like to do?",
            choices: [
                "View all employees",
                "View all employees by department",
                "View all employees by manager",
                "Add employee",
                "Add Department",
                "Add Role",
                "Remove employee",
                "Update employee role",
                "Update employee manager",
            ],
        })
        .then((answers) => {
            switch (answers.action) {
                case "view all employees":
                    byEmployees();
                    runSearch();

                    break;
                case "View all employees by department":

                    byDepartment();
                    runSearch();

                    break;

                case "View all employees by manager":

                    byManager();
                    runSearch();

                    break;


                case "Add employee":
                    inquirer
                        .prompt([{
                                name: "employeeFirst",
                                type: "input",
                                message: "What is the employee's first name?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                }
                            },
                            {
                                name: "employeeLast",
                                type: "input",
                                message: "What is the employee's last name?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                }
                            },
                            {
                                name: "department",
                                type: "input",
                                message: "Please enter the role id",

                            },
                            {
                                name: "manager",
                                type: "input",
                                message: "Please enter manager id",
                            }
                        ]).then(answers => {

                            addEmployee(answers.employeeFirst, answers.employeeLast, answers.department, answers.manager);
                            runSearch();
                        })

                    break;

                case "Add Department":
                    inquirer
                        .prompt([{
                                name: "Department",
                                type: "input",
                                message: "Please enter the department you would like to add?",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                }
                            },

                        ]).then(answers => {
                            // Adds department to database
                            addDepartment(answers.Department);
                            runSearch();
                        })
                    break;
                    // Start new case
                    // Takes further input
                case "Add Role":
                    inquirer
                        .prompt([{
                                name: "title",
                                type: "input",
                                message: "Please enter the role's title.",
                                validate: answer => {
                                    if (answer !== "") {
                                        return true;
                                    }
                                    return "Please enter at least one character.";
                                }
                            },
                            {
                                name: "salary",
                                type: "input",
                                message: "Please enter the role's salary.",

                            },
                            {
                                name: "department_id",
                                type: "input",
                                message: "Please enter the department id.",

                            }

                        ]).then(answers => {
                            // Adds role to database
                            addRole(answers.title, answers.salary, answers.department_id);
                            runSearch();
                        })
                    break;

                    // Start new case
                    // Takes further input
                case "Remove employee":
                    inquirer
                        .prompt([{
                            name: "id",
                            type: "input",
                            message: "Please enter the Employee id",

                        }]).then(answers => {
                            // Removes employee to database
                            removeEmployee(answers.id);
                            runSearch();
                        })
                    break;

                    // Start new case
                case "Update employee role":

                    inquirer
                        .prompt([{
                                name: "employeeId",
                                type: "input",
                                message: "Please enter employee's id",
                            },
                            {
                                name: "roleId",
                                type: "input",
                                message: "Please enter role's id",

                            }

                        ]).then(answers => {
                            // Updates employee's role
                            updateByRole(answers.employeeId, answers.roleId);
                            runSearch();

                        })

                    break;
                    // Start new case
                    // Takes further input
                case "Update employee manager":

                    inquirer
                        .prompt([{
                                name: "manager",
                                type: "input",
                                message: "Please enter manager id",
                            },
                            {
                                name: "Employee",
                                type: "input",
                                message: "Please enter employee id",

                            }
                        ]).then(answers => {
                            // Updates employee's manager
                            updateByManager(answers.manager, answers.Employee);
                            runSearch();

                        })

                    break;
            }

        });

}