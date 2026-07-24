-- 1. CLEAR EXISTING DATA (Optional - Remove if you want to keep old data)
-- We truncate with CASCADE to remove related positions/employees automatically
TRUNCATE TABLE employees CASCADE;
TRUNCATE TABLE positions CASCADE;
TRUNCATE TABLE departments CASCADE;
TRUNCATE TABLE locations CASCADE;

-- 2. INSERT SRI LANKAN PROVINCES
INSERT INTO locations (name) VALUES
('Western Province'),
('Central Province'),
('Southern Province'),
('North Western Province'),
('Sabaragamuwa Province'),
('Eastern Province'),
('Uva Province'),
('North Central Province'),
('Northern Province');

-- 3. INSERT DEPARTMENTS
INSERT INTO departments (name) VALUES
('Engineering'),
('Marketing'),
('Sales'),
('HR'),
('Finance'),
('Design');

-- 4. INSERT POSITIONS (Linked dynamically to Departments)

-- Engineering Positions
INSERT INTO positions (title, department_id) VALUES
('Senior Developer', (SELECT id FROM departments WHERE name = 'Engineering')),
('Junior Developer', (SELECT id FROM departments WHERE name = 'Engineering')),
('Team Lead', (SELECT id FROM departments WHERE name = 'Engineering')),
('Project Manager', (SELECT id FROM departments WHERE name = 'Engineering')),
('Product Manager', (SELECT id FROM departments WHERE name = 'Engineering'));

-- Design Positions
INSERT INTO positions (title, department_id) VALUES
('UI/UX Designer', (SELECT id FROM departments WHERE name = 'Design')),
('Graphic Designer', (SELECT id FROM departments WHERE name = 'Design'));

-- Marketing Positions
INSERT INTO positions (title, department_id) VALUES
('Marketing Executive', (SELECT id FROM departments WHERE name = 'Marketing')),
('SEO Specialist', (SELECT id FROM departments WHERE name = 'Marketing')),
('Content Writer', (SELECT id FROM departments WHERE name = 'Marketing'));

-- Sales Positions
INSERT INTO positions (title, department_id) VALUES
('Sales Representative', (SELECT id FROM departments WHERE name = 'Sales')),
('Sales Manager', (SELECT id FROM departments WHERE name = 'Sales'));

-- HR Positions
INSERT INTO positions (title, department_id) VALUES
('HR Manager', (SELECT id FROM departments WHERE name = 'HR')),
('Recruiter', (SELECT id FROM departments WHERE name = 'HR'));

-- Finance Positions
INSERT INTO positions (title, department_id) VALUES
('Accountant', (SELECT id FROM departments WHERE name = 'Finance')),
('Finance Officer', (SELECT id FROM departments WHERE name = 'Finance')),
('Financial Analyst', (SELECT id FROM departments WHERE name = 'Finance'));

-- General Management (Assigned to Engineering for now, or you can create an Admin dept)
INSERT INTO positions (title, department_id) VALUES
('Senior Manager', (SELECT id FROM departments WHERE name = 'Engineering')),
('Executive', (SELECT id FROM departments WHERE name = 'Engineering'));