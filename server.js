const inquirer = require("inquirer");
const fs = require("fs");
const ctable = require("console.table");
const mysql = require("mysql");
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

                            addDepartment(answers.Department);
                            runSearch();
                        })
                    break;

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

                            addRole(answers.title, answers.salary, answers.department_id);
                            runSearch();
                        })
                    break;


                case "Remove employee":
                    inquirer
                        .prompt([{
                            name: "id",
                            type: "input",
                            message: "Please enter the Employee id",

                        }]).then(answers => {

                            removeEmployee(answers.id);
                            runSearch();
                        })
                    break;

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

                            updateByRole(answers.employeeId, answers.roleId);
                            runSearch();

                        })

                    break;

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

                            updateByManager(answers.manager, answers.Employee);
                            runSearch();

                        })

                    break;
            }

        });

}

const byEmployees = () => {

    var results = connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, department.d_name AS department, role.salary, CONCAT(manager.first_name, ' ', manager.last_name) AS manager FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department on role.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id;",


        function(error, results) {
            if (error) throw error
            console.table(results)
        })

};


const byDepartment = () => {

    var department = connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.d_name FROM employee LEFT JOIN role on employee.role_id = role.id LEFT JOIN department department on role.department_id = department.id WHERE department.id;",


        function(error, department) {
            if (error) throw error
            console.table(department)
        })
};


const byManager = () => {

    var manager = connection.query("SELECT employee.id, employee.first_name, employee.last_name, department.d_name, employee.manager_id AS department, role.title FROM employee LEFT JOIN role on role.id = employee.role_id LEFT JOIN department ON department.id = role.department_id WHERE manager_id;",


        function(error, manager) {
            if (error) throw error
            console.table(manager)
        })
};


const updateByManager = (managerId, employeeId) => {

    var updateManager = connection.query(
        "UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId],
        function(error, updateManager) {
            if (error) throw error
                // console.table(manager)
        })

    byManager();

}

const addEmployee = (employeeFirst, employeeLast, department, manager) => {

    var add = connection.query(
        "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?", [employeeFirst, employeeLast, department, manager],
        function(error, add) {
            if (error) throw error
        })

    byEmployees();
}

// Shows departments only, without employees
const departmentTable = () => {
    var depTable = connection.query("SELECT d_name FROM department;",


        function(error, depTable) {
            if (error) throw error
            console.table(depTable)
        })
}

// "Add Department"
const addDepartment = (department) => {

    var department = connection.query(
        "INSERT INTO department SET d_name = ?", [department],
        function(error, department) {
            if (error) throw error
                // console.table(manager)
        })

    departmentTable();
}

// Shows roles only, without employees: 

const roleTable = () => {
        var roleT = connection.query("SELECT title, salary, department_id FROM role;",

            function(error, roleT) {
                if (error) throw error
                console.table(roleT)
            })
    }
    // "Add role"
const addRole = (title, salary, department_id) => {

    var newRole = connection.query(
        "INSERT INTO role SET title = ?, salary = ?, department_id = ?", [title, salary, department_id],
        function(error, newRole) {
            if (error) throw error
                // console.table(manager)
        })

    roleTable();
}


// "Remove employee"
const removeEmployee = (id) => {

    var add = connection.query(
        "DELETE FROM employee WHERE id = ?", [id],
        function(error, id) {
            if (error) throw error
        })

    byEmployees();
}

// "Update employee role",
const updateByRole = (employeeId, roleId) => {

    var byRole = connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",

        [roleId, employeeId],
        function(error, role) {
            if (error) throw error

        })
    byDepartment();

}