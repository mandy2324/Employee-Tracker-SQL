const inquirer = require("inquirer")
const mysql = require("mysql")
const cTable = require('console.table');
const util = require("util");
const fs = require("fs");
// Logo requirements:
const logo = require("asciiart-logo");
const config = require("./package.json");
console.log(logo(config).render());

// connection
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "12345678",
    database: "employee_tracker",
});

connection.connect(function(err) {
    if (err) throw err
    console.log("Connected as Id" + connection.threadId)
    startPrompt();
});


function startPrompt() {
    inquirer.prompt([{
        type: "list",
        message: "What would you like to do?",
        name: "choice",
        choices: [
            "View All Employees?",
            "View All Employee's By Roles?",
            "View all Emplyees By Deparments",
            "Update Employee",
            "Add Employee?",
            "Add Role?",
            "Add Department?"
        ]
    }]).then(function(val) {
        switch (val.choice) {
            case "View All Employees?":
                viewAllEmployees();
                break;

            case "View All Employee's By Roles?":
                viewAllRoles();
                break;
            case "View all Emplyees By Deparments":
                viewAllDepartments();
                break;

            case "Add Employee?":
                addEmployee();
                break;

            case "Update Employee":
                updateEmployee();
                break;

            case "Add Role?":
                addRole();
                break;

            case "Add Department?":
                addDepartment();
                break;

        }
    })
}

// "View all employees",
function viewAllEmployees() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title, role.salary, department.name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

// "View all roles",
function viewAllRoles() {
    connection.query("SELECT employee.first_name, employee.last_name, role.title AS Title FROM employee JOIN role ON employee.role_id = role.id;",
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}
// "View all employees by Department",
function viewAllDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}


// "Update employee manager"
function updateByManager(managerId, employeeId) {

    var updateManager = connection.query(
        "UPDATE employee SET manager_id = ? WHERE id = ?", [managerId, employeeId],
        function(error, updateManager) {
            if (error) throw error
                // console.table(manager)
            runSearch();
        })

    byManager();

}

// "Add employee"
function addEmployee(employeeFirst, employeeLast, department, manager) {

    var add = connection.query(
        "INSERT INTO employee SET first_name = ?, last_name = ?, role_id = ?, manager_id = ?", [employeeFirst, employeeLast, department, manager],
        function(error, add) {
            if (error) throw error
                // runSearch();
        })

    // byEmployees();

}

// Shows departments only, without employees
function departmentTable() {
    var depTable = connection.query("SELECT d_name FROM department;",


        function(error, depTable) {
            if (error) throw error
            console.table(depTable)
            runSearch();
        })
}

// "Add Department"
function addDepartment(department) {

    var department = connection.query(
        "INSERT INTO department SET d_name = ?", [department],
        function(error, department) {
            if (error) throw error
                // console.table(manager)
            runSearch();
        })

    departmentTable();
}

// Shows roles only, without employees: 

function roleTable() {
    var roleT = connection.query("SELECT title, salary, department_id FROM role;",

        function(error, roleT) {
            if (error) throw error
            console.table(roleT)
            runSearch();
        })
}
// "Add role"
function addRole(title, salary, department_id) {

    var newRole = connection.query(
        "INSERT INTO role SET title = ?, salary = ?, department_id = ?", [title, salary, department_id],
        function(error, newRole) {
            if (error) throw error
                // console.table(manager)
            runSearch();
        })

    roleTable();
}


// "Remove employee"
function removeEmployee(id) {

    var add = connection.query(
        "DELETE FROM employee WHERE id = ?", [id],
        function(error, id) {
            if (error) throw error
            runSearch();
        })

    byEmployees();
}

// "Update employee role",
function updateByRole(employeeId, roleId) {

    var byRole = connection.query(
        "UPDATE employee SET role_id = ? WHERE id = ?",

        [roleId, employeeId],
        function(error, role) {
            if (error) throw error
            runSearch();
        })
    byDepartment();

}