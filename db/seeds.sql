INSERT INTO department(name)
VALUES 
('Management'),
('Office Management'),
('Accounting'),
('Human Resources'),
('Quality Control'),
('Sales'),
('Relations'),
('Warehouse');

INSERT INTO role(title, salary, department_id)
VALUES
('Regional Manager', 95000, 1),
('Receptionist', 40000, 2),
('Accountant', 85000, 3),
('HR Representative', 76000, 4),
('QA Manager', 74000, 5),
('Salesperson', 70000, 6),
('Customer Relations', 50000, 7),
('Supplier Relations', 52000, 7),
('Foreman', 55000, 8);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES 
('Michael', 'Scott', 1, null),
('Pam', 'Beasely', 2, 1),
('Angela', 'Martin', 3, 1),
('Oscar', 'Gutierrez', 3, 1),
('Kevin', 'Malone', 3, 1),
('Toby', 'Flenderson', 4, 1),
('Creed', 'Bratton', 5, 1),
('Dwight', 'Schrute', 6, 1),
('Jim', 'Halpert', 6, 1),
('Stanley', 'Hudson', 6, 1),
('Phyllis', 'Lapin', 6, 1),
('Andy', 'Bernard', 6, 1),
('Kelly', 'Kapoor', 7, 1),
('Meredith', 'Palmer', 8, 1),
('Daryll', 'Philbin', 9, null);



