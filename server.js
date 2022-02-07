const inquirer = require("inquirer");
const mysql = require("mysql2");
const conTable = require("console.table");

const addEmpQ = [
  "What is the new first name?",
  "What is the new last name?",
  "What role?",
  "Who is their manager?",
];
const roleQuery = "SELECT * from empRole";
const manQuery =
  'SELECT CONCAT(employee.first_name, " ", employee.last_name) AS full_name FROM employee';

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
      promptMenu();
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
async function addEmp() {
  const [rows] = await connection.promise().query("SELECT * FROM employee");
  let choiceArr = rows.map(({ id, first_name, last_name }) => ({
    name: first_name + " " + last_name,
    value: id,
  }));
  console.log(choiceArr);

  const [row] = await connection.promise().query("SELECT * FROM empRole");
  let roleArr = row.map(({ id, title }) => ({
    name: title,
    value: id,
  }));
  console.log(roleArr);

  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeFirst",
        message: addEmpQ[0],
      },
      {
        type: "input",
        name: "employeeLast",
        message: addEmpQ[1],
      },
      {
        type: "list",
        name: "role",
        choices: roleArr,
        message: addEmpQ[2],
      },
      {
        type: "list",
        name: "manager",
        choices: choiceArr,
        message: addEmpQ[3],
      },
    ])
    .then((answer) => {
      const empObj = {
        first_name: answer.employeeFirst,
        last_name: answer.employeeLast,
        role_id: answer.role,
        manager_id: answer.manager,
      };
      connection
        .promise()
        .query("INSERT INTO employee SET ?", empObj)
        .then(() => {
          console.log("Employee added to database!");
          promptMenu();
        });
    });
}

// Add another role
function addRole() {
  inquirer
    .prompt({
      type: "input",
      name: "roleName",
      message: "What is the new role?",
    })
    .then((answer) => {
      console.log(answer);

      const sql = "INSERT INTO empRole SET ?";
      connection
        .promise()
        .query(sql, { title: answer.roleName })
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
async function updateRole() {
    const [empList] = await connection.promise().query('SELECT * FROM employee')
    
    const [row] = await connection.promise().query("SELECT * FROM empRole");
    let roleArr = row.map(({ id, title }) => ({
      name: title,
      value: id,
    }));
    console.log(roleArr);

    let empArr = empList.map(({ id, first_name, last_name }) => ({
        name: first_name + " " + last_name,
        value: id,
      }));
      console.log(empArr);

      inquirer.prompt({
          type: 'list',
          name: 'updatedEmp',
          choices: empArr,
          message: 'Which employee would you like to update?'
      }).then(answer => {
           const chosenEmp = answer.updatedEmp;
           inquirer.prompt({
               type: 'list',
               name: 'newRole',
               choices: roleArr,
               message: 'What is their new role?'
           }).then(answers => {
               connection.promise().query('UPDATE employee SET role_id = ? WHERE id = ?', [answers.newRole, chosenEmp]).then(response => console.log(response))
               console.info('Employee has been updated!')
           })
      })
