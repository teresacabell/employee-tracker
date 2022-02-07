const inquirer = require("inquirer");
const mysql = require("mysql2");
const conTable = require("console.table");

const addEmpQ = ['What is the new first name?', 'What is the new last name?', 'What role?', 'Who is their manager?'];
const roleQuery = 'SELECT * from empRole; SELECT CONCAT(employee.first_name, " ", employee.last_name) AS full_name FROM employee';

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
        "View all departments",
        "View all roles",
        "View all employees",
        "Add employee",
        "Add role",
        "Add department",
        "Update role",
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
      }
    });
}

// View all departments
function viewAllDept() {
  console.log("All departments:");

  const sql =
    "SELECT department.dept_name AS Name, department.id AS ID FROM department";

  connection
    .promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
    });
}

// View all roles
function viewAllRoles() {
  console.log("All roles:");

  const sql =
    "SELECT empRole.title AS Title, empRole.id as ID, department.dept_name AS Department FROM empRole LEFT JOIN department on empRole.department_id = department.id";

  connection
    .promise()
    .query(sql)
    .then(([rows]) => {
      console.table(rows);
    });
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

// Add employee
function addEmp() {
  connection.query(roleQuery, (err, results) => {
    if (err) throw err; 

    inquirer
    .prompt([
      {
        type: 'input',
        name: 'employeeFirst',
        message: addEmpQ[0]
      },
      {
        type: 'input',
        name: 'employeeLast',
        message: addEmpQ[1],
      },
      {
          type: 'list',
          name: 'role',
          choices: function() {
              let choiceArr = results[0].map(choice => choice.title);
              return choiceArr;
          },
          message: addEmpQ[2]
      },
      {
          type: 'list',
          name: 'manager',
          choices: function() {
              let choiceArr = results[1].map(choice => choice.full_name);
              return choiceArr;
          },
          message: AddEmpQ[3]
      }
    ]).then((answer) => {
        connection.query(
            `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, (SELECT id FROM empRole WHERE title = ?), 
            (SELECT id FROM (SELECT id FROM employee WHERE CONCAT(first_name, " ", last_name)= ?) AS tmptable))`, [answer.employeeFirst, answer.employeeLast, answer.role, answer.manager]
        ) 
        promptMenu();
    })
})
}

// Add another role
function addRole() {
    inquirer
    .prompt({
        type: 'input',
        name: 'roleName',
        message: 'What is the new role?'
    })
    .then((answer) => {
        console.log(answer);

        const sql = 'INSERT INTO empRole SET ?';
        connection.promise()
        .query(sql, { title: answer.roleName})
        .then(([rows]) => {
            if (rows.affectedRows === 1) {
                console.info(
                    `${answer.roleName} has been successfully added to the database!`
                );
            }
            promptMenu();
        });
    });
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
function updateRole() {}




