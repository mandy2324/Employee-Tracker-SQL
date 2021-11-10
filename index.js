const inquirer = require("inquirer")
const mysql = require("mysql2")

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
    database: "employee_trackerDB",
});

connection.connect((err) => {
    if (err) {
        console.log(err);
        res.status(500);
        return res.send("There was an error connecting to the database.");
    }
    console.log("You're connected!");

    // Function for inquirer to prompt data
    startPrompt();

})
connection.query = util.promisify(connection.query);


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
    connection.query("SELECT employee.id, employee.first_name, employee.last_name, role.title, role.salary, department.Dept_name, CONCAT(e.first_name, ' ' ,e.last_name) AS Manager FROM employee INNER JOIN role on role.id = employee.role_id INNER JOIN department on department.id = role.department_id left join employee e on employee.manager_id = e.id;",
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}

// "View all roles",
function viewAllRoles() {
    connection.query("SELECT role.id,  role.title, role.salary, role.department_id AS ROLE FROM ROLE;",
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}
// "View all employees by Department",
function viewAllDepartments() {
    connection.query("SELECT employee.first_name, employee.last_name, department.Dept_name AS Department FROM employee JOIN role ON employee.role_id = role.id JOIN department ON role.department_id = department.id ORDER BY employee.id;",
        function(err, res) {
            if (err) throw err
            console.table(res)
            startPrompt()
        })
}


// "Update employee prompt select role, title"
var roleArr = [];

function selectRole() {
    connection.query("SELECT * FROM role", function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            roleArr.push(res[i].title);
        }

    })
    return roleArr;
}

// "updating the manager "
var managersArr = [];

function selectManager() {
    connection.query("SELECT first_name, last_name FROM employee WHERE manager_id IS NULL", function(err, res) {
        if (err) throw err
        for (var i = 0; i < res.length; i++) {
            managersArr.push(res[i].first_name);
        }

    })
    return managersArr;
}
// Add employee
function addEmployee() {
    inquirer.prompt([{
            name: "firstname",
            type: "input",
            message: "Enter their first name "
        },
        {
            name: "lastname",
            type: "input",
            message: "Enter their last name "
        },
        {
            name: "role",
            type: "list",
            message: "What is their role? ",
            choices: selectRole()
        },
        {
            name: "choice",
            type: "rawlist",
            message: "Whats their managers name?",
            choices: selectManager()
        }
    ]).then(function(val) {
        console.log(val);
        var roleId = selectRole().indexOf(val.role) + 1
        var managerId = selectManager().indexOf(val.choice) + 1
        connection.query("INSERT INTO employee SET ?", {
            first_name: val.firstname,
            last_name: val.lastname,
            manager_id: managerId,
            role_id: roleId


        }, function(err) {
            if (err) throw err
            console.table(val)
            startPrompt()
        })

    })
}

// "Update employee

function updateEmployee() {
    connection.query("SELECT employee.last_name, role.title, employee.id FROM employee JOIN role ON employee.role_id = role.id;", function(err, res) {
        // console.log(res)
        if (err) throw err
        console.log(res)
        inquirer.prompt([{
                name: "Id",
                type: "rawlist",
                choices: function() {
                    var lastName = [];
                    for (var i = 0; i < res.length; i++) {
                        var currentEmployee = {
                            name: res[i].last_name,
                            value: res[i].id


                        }
                        lastName.push(currentEmployee);
                        console.log(currentEmployee);

                    }
                    return lastName;
                },
                message: "What is the Employee's last name? ",
            },
            {
                name: "role",
                type: "rawlist",
                message: "What is the Employees new title? ",
                choices: selectRole()
            },
        ]).then(function(val) {
            var roleId = selectRole().indexOf(val.role) + 1
            connection.query("UPDATE employee SET role_id = ? WHERE id=?", [
                    roleId, val.Id
                ],
                function(err) {
                    if (err) throw err
                    console.table(val)
                    startPrompt()
                })

        });
    });

}
// Add employee role

function addRole() {
    connection.query("SELECT role.title AS Title, role.salary AS Salary FROM role", function(err, res) {
        inquirer.prompt([{
                name: "Title",
                type: "input",
                message: "What is the roles Title?"
            },
            {
                name: "Salary",
                type: "input",
                message: "What is the Salary?"

            }, {
                name: "Manager?",
                type: "list",
                message: "Who is the Manager?",
                choices: selectManager()

            }

        ]).then(function(res) {
            connection.query(
                "INSERT INTO role SET ?", {
                    title: res.Title,
                    salary: res.Salary,
                },
                function(err) {
                    if (err) throw err
                    console.table(res);
                    startPrompt();
                }
            )

        });
    });
}
// Add department
function addDepartment() {

    inquirer.prompt([{
        name: "Dept_name",
        type: "input",
        message: "What Department would you like to add?"
    }]).then(function(res) {
        var query = connection.query(
            "INSERT INTO department SET ? ", {
                Dept_name: res.name

            },
            function(err) {
                if (err) throw err
                console.table(res);
                startPrompt();
            }
        )
    })
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