DROP DATABASE IF EXISTS emp_db;
CREATE DATABASE emp_db;
USE emp_db;

CREATE TABLE department(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(30) NOT NULL
);

CREATE TABLE empRole(
    id INTEGER AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(30) NOT NULL, 
    salary DECIMAL,
    department_id INTEGER,
    FOREIGN KEY(department_id) REFERENCES department(id)
);

CREATE TABLE employee(
    id INTEGER AUTO_INCREMENT PRIMARY KEY, 
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER,
    manager_id INTEGER, 
    FOREIGN KEY(role_id) REFERENCES empRole(id),
    FOREIGN KEY(manager_id) REFERENCES employee(id)
);

