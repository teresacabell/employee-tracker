const inquirer = require("inquirer");
const mysql = require("mysql2");
const conTable = require("console.table");

// create connection
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "",
  database: "emp_db",
});

// establish connection to db
connection.connect((err) => {
  if (err) throw err;

  console.log("Welcome to the Employee Tracker");
  promptMenu();
});

function promptMenu() {
  inquirer
    .prompt({
      type: "list",
      name: "actionChoice",
      message: "What would you like to do today?",
      choices: [
        "View all employees",
        "View employees by role",
        "View employees by department",
        "View employees by manager",
        "Add employee",
        "Add role",
        "Add department",
        "Update role",
        "Update manager",
        "Delete employee",
        "Delete role",
        "Delete department",
        "View department budgets",
      ],
    })

    .then((answer) => {
      switch (answer.actionChoice) {
        case "View all departments":
            viewAllDept();
            break;
        
        case "View all roles":
            viewAllRoles();
            break;
        
        case "View all employees":
          viewAllEmp();
          break;

        case "View employees by role":
          viewEmpByRole();
          break;

        case "View employees by department":
          viewEmpByDept();
          break;

        case "View employees by manager":
          viewEmpByMan();
          break;

        case "Add employee":
          addEmp();
          break;

        case "Add role":
          addRole();
          break;

        case "Add department":
          addDept();
          break;

        case "Update role":
          updateRole();
          break;

        case "Update manager":
          updateMan();
          break;

        case "Delete employee":
          deleteEmp();
          break;

        case "Delete role":
          deleteRole();
          break;

        case "Delete department":
          deleteDept();
          break;

        case "View department budgets":
          viewDeptBud();
          break;
      }
    });
}

// View all departments
function viewAllDept() {
    console.log('All departments:');

    
}

// View all roles 
function viewAllRoles() {

}

// View all employees
function viewAllEmp() {
  console.log("All employees:");

  const sql =
    'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS Name, empRole.title AS Title, empRole.salary AS Salary, department.dept_name AS Department, CONCAT (manager.first_name, " ", manager.last_name) AS Manager FROM employee LEFT JOIN empRole on employee.role_id = empRole.id LEFT JOIN department on empRole.department_id = department.id LEFT JOIN employee manager on manager.id = employee.manager_id';

  connection
    .promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
    });
}

// View employees by role 
function viewEmpByRole() {

}

// View employee by department
function viewEmpByDept() {

}

// View employee by Manager 
function viewEmpByMan() {

}

// Add employee
function addEmp() {

}

// Add role
function addRole() {

}

// Add another department
function addDept() {
  inquirer
    .prompt({
      type: "input",
      name: "departmentName",
      message: "What is the name of your new department?",
    })
    .then((answer) => {
      console.log(answer);

      const sql = "INSERT INTO department SET ?";
      connection
        .promise()
        .query(sql, { dept_name: answer.departmentName })
        .then(([rows]) => {
          if (rows.affectedRows === 1) {
            console.info(
              `${answer.departmentName} has been successfully added to the database!`
            );
          }
          promptMenu();
        });
    });
}

// Update role
function updateRole() {

}

// Update manager
function updateMan() {

}

// Delete employee
function deleteEmp() {

}

// Delete role 
function deleteRole() {

}

// Delete department
function deleteDept() {

}

// View department budgets
function viewDeptBud() {

}