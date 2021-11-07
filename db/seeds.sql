use employee_tracker;

INSERT INTO department
    (d_name)
VALUES
    ('Sales'),
    ('Engineering'),
    ('Finance'),
    ('Legal');

    INSERT INTO role
    (title, salary, department_id)

    VALUES
     ('Sales Lead', 12000, 1),
    ('Salesperson', 85000, 1),
    ('Lead Engineer', 250000, 2),
    ('Software Engineer', 520000, 2),
    ('Account Manager', 660000, 3),
    ('Accountant', 625000, 3),
    ('Legal Team Lead', 200000, 4),
    ('Lawyer', 200000, 4);

    INSERT INTO employee
    (first_name, last_name, role_id, manager_id)
VALUES
    ('Ric', 'Ocasek', 1, NULL),
    ('Janis', 'Joplin', 2, 1),
    ('Stevie', 'Nicks', 3, NULL),
    ('Ray', 'Manzarek', 4, 3),
    ('Ray', 'Charles', 5, NULL),
    ('Ann', 'Wilson', 6, 5),
    ('Robert', 'Plant', 7, NULL),
    ('Roger', 'Waters', 8, 7);