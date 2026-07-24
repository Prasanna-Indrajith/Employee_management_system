-- =====================================================
-- EMPLOYEE MANAGEMENT SYSTEM - SRI LANKAN DATA POPULATION
-- FIXED VERSION
-- =====================================================

-- Begin transaction
BEGIN;

-- Step 1: Reference Data Setup (with conflict handling)

-- Departments
INSERT INTO departments (name, code)
SELECT 'Information Technology', 'IT' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Information Technology')
UNION ALL SELECT 'Human Resources', 'HR' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Human Resources')
UNION ALL SELECT 'Finance', 'FIN' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Finance')
UNION ALL SELECT 'Marketing', 'MKT' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Marketing')
UNION ALL SELECT 'Operations', 'OPS' WHERE NOT EXISTS (SELECT 1 FROM departments WHERE name = 'Operations');

-- Positions
INSERT INTO positions (title, department_id)
SELECT 'Senior Software Engineer', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Senior Software Engineer')
UNION ALL SELECT 'Software Engineer', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Software Engineer')
UNION ALL SELECT 'DevOps Engineer', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'DevOps Engineer')
UNION ALL SELECT 'QA Engineer', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'QA Engineer')
UNION ALL SELECT 'IT Support Specialist', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'IT Support Specialist')
UNION ALL SELECT 'HR Manager', (SELECT id FROM departments WHERE name = 'Human Resources' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'HR Manager')
UNION ALL SELECT 'Recruitment Specialist', (SELECT id FROM departments WHERE name = 'Human Resources' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Recruitment Specialist')
UNION ALL SELECT 'HR Coordinator', (SELECT id FROM departments WHERE name = 'Human Resources' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'HR Coordinator')
UNION ALL SELECT 'Financial Analyst', (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Financial Analyst')
UNION ALL SELECT 'Accountant', (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Accountant')
UNION ALL SELECT 'Finance Manager', (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Finance Manager')
UNION ALL SELECT 'Marketing Manager', (SELECT id FROM departments WHERE name = 'Marketing' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Marketing Manager')
UNION ALL SELECT 'Marketing Specialist', (SELECT id FROM departments WHERE name = 'Marketing' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Marketing Specialist')
UNION ALL SELECT 'Operations Manager', (SELECT id FROM departments WHERE name = 'Operations' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Operations Manager')
UNION ALL SELECT 'Operations Coordinator', (SELECT id FROM departments WHERE name = 'Operations' LIMIT 1) WHERE NOT EXISTS (SELECT 1 FROM positions WHERE title = 'Operations Coordinator');

-- Locations
INSERT INTO locations (name, address)
SELECT 'Western Province', 'Colombo, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Western Province')
UNION ALL SELECT 'Central Province', 'Kandy, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Central Province')
UNION ALL SELECT 'Southern Province', 'Galle, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Southern Province')
UNION ALL SELECT 'Northern Province', 'Jaffna, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Northern Province')
UNION ALL SELECT 'Eastern Province', 'Trincomalee, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Eastern Province')
UNION ALL SELECT 'North Western Province', 'Kurunegala, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'North Western Province')
UNION ALL SELECT 'North Central Province', 'Anuradhapura, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'North Central Province')
UNION ALL SELECT 'Uva Province', 'Badulla, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Uva Province')
UNION ALL SELECT 'Sabaragamuwa Province', 'Ratnapura, Sri Lanka' WHERE NOT EXISTS (SELECT 1 FROM locations WHERE name = 'Sabaragamuwa Province');

-- Deduction Types
INSERT INTO deduction_types (name, type, amount)
SELECT 'Federal Tax', 'percentage', 0.15 WHERE NOT EXISTS (SELECT 1 FROM deduction_types WHERE name = 'Federal Tax')
UNION ALL SELECT 'State Tax', 'percentage', 0.05 WHERE NOT EXISTS (SELECT 1 FROM deduction_types WHERE name = 'State Tax')
UNION ALL SELECT 'Health Insurance', 'fixed', 200.00 WHERE NOT EXISTS (SELECT 1 FROM deduction_types WHERE name = 'Health Insurance')
UNION ALL SELECT '401k', 'percentage', 0.03 WHERE NOT EXISTS (SELECT 1 FROM deduction_types WHERE name = '401k')
UNION ALL SELECT 'Dental Insurance', 'fixed', 50.00 WHERE NOT EXISTS (SELECT 1 FROM deduction_types WHERE name = 'Dental Insurance');

-- Step 2: Employee Creation
-- FIX: Removed the broken and unused 'WITH employee_ids' CTE block.
-- The SELECT below manually provides the EMP IDs, so the CTE was unnecessary.

INSERT INTO employees (full_name, email, phone, department_id, position_id, location_id, hire_date, salary, role, employment_type, status, skills, employee_id)
SELECT
    emp_name,
    LOWER(REPLACE(emp_name, ' ', '.')) || '@orian.com',
    '+94' || (FLOOR(RANDOM() * 900000000 + 100000000))::text,
    dept_id,
    pos_id,
    loc_id,
    hire_date,
    salary,
    emp_role,
    'Full-time'::employment_type,
    'active'::emp_status,
    skills_array,
    emp_id
FROM (
    SELECT 'Nuwan Perera' as emp_name, (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1) as dept_id, (SELECT id FROM positions WHERE title = 'Senior Software Engineer' LIMIT 1) as pos_id, (SELECT id FROM locations WHERE name = 'Western Province' LIMIT 1) as loc_id, '2023-01-15'::date as hire_date, 75000.00 as salary, 'user'::user_role as emp_role, ARRAY['Java', 'Spring Boot', 'PostgreSQL', 'React'] as skills_array, 'EMP100' as emp_id
    UNION ALL SELECT 'Kamal Rajapaksa', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'Software Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Central Province' LIMIT 1), '2023-03-20'::date, 68000.00, 'user'::user_role, ARRAY['Python', 'Django', 'MySQL', 'Vue.js'], 'EMP101'
    UNION ALL SELECT 'Rashmi Fernando', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'DevOps Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Southern Province' LIMIT 1), '2022-11-10'::date, 72000.00, 'user'::user_role, ARRAY['Docker', 'Kubernetes', 'AWS', 'Jenkins'], 'EMP102'
    UNION ALL SELECT 'Sanjaya Bandara', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'QA Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Northern Province' LIMIT 1), '2023-06-01'::date, 65000.00, 'user'::user_role, ARRAY['Selenium', 'Cypress', 'JavaScript', 'Manual Testing'], 'EMP103'
    UNION ALL SELECT 'Priyanka Wickramasinghe', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'IT Support Specialist' LIMIT 1), (SELECT id FROM locations WHERE name = 'Eastern Province' LIMIT 1), '2023-08-15'::date, 58000.00, 'user'::user_role, ARRAY['Windows', 'Linux', 'Office 365', 'Hardware Support'], 'EMP104'
    UNION ALL SELECT 'Chinthaka Silva', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'Senior Software Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'North Western Province' LIMIT 1), '2022-12-01'::date, 76000.00, 'user'::user_role, ARRAY['Angular', 'TypeScript', 'Node.js', 'MongoDB'], 'EMP105'
    UNION ALL SELECT 'Anusha Perera', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'Software Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'North Central Province' LIMIT 1), '2023-04-10'::date, 70000.00, 'user'::user_role, ARRAY['Flask', 'PostgreSQL', 'REST APIs', 'Git'], 'EMP106'
    UNION ALL SELECT 'Nimal De Silva', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'DevOps Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uva Province' LIMIT 1), '2023-07-20'::date, 74000.00, 'user'::user_role, ARRAY['Terraform', 'Azure', 'Python', 'CI/CD'], 'EMP107'
    UNION ALL SELECT 'Sunethra Gunawardena', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'QA Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Sabaragamuwa Province' LIMIT 1), '2023-02-28'::date, 62000.00, 'user'::user_role, ARRAY['TestRail', 'JIRA', 'Agile', 'Scrum'], 'EMP108'
    UNION ALL SELECT 'Deepika Liyanage', (SELECT id FROM departments WHERE name = 'Human Resources' LIMIT 1), (SELECT id FROM positions WHERE title = 'HR Manager' LIMIT 1), (SELECT id FROM locations WHERE name = 'Western Province' LIMIT 1), '2023-01-10'::date, 65000.00, 'admin'::user_role, ARRAY['HR Management', 'Recruitment', 'Training', 'Policy Development'], 'EMP109'
    UNION ALL SELECT 'Malini Pathirana', (SELECT id FROM departments WHERE name = 'Human Resources' LIMIT 1), (SELECT id FROM positions WHERE title = 'Recruitment Specialist' LIMIT 1), (SELECT id FROM locations WHERE name = 'Central Province' LIMIT 1), '2023-05-15'::date, 55000.00, 'user'::user_role, ARRAY['Employee Relations', 'Benefits Administration', 'Payroll', 'Compliance'], 'EMP110'
    UNION ALL SELECT 'Thusitha Jayasinghe', (SELECT id FROM departments WHERE name = 'Human Resources' LIMIT 1), (SELECT id FROM positions WHERE title = 'HR Coordinator' LIMIT 1), (SELECT id FROM locations WHERE name = 'Southern Province' LIMIT 1), '2022-10-01'::date, 58000.00, 'user'::user_role, ARRAY['Talent Acquisition', 'Interviewing', 'Onboarding', 'Performance Management'], 'EMP111'
    UNION ALL SELECT 'Bandula Weerasinghe', (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1), (SELECT id FROM positions WHERE title = 'Financial Analyst' LIMIT 1), (SELECT id FROM locations WHERE name = 'Northern Province' LIMIT 1), '2023-02-10'::date, 68000.00, 'user'::user_role, ARRAY['Financial Analysis', 'Forecasting', 'Excel', 'Financial Modeling'], 'EMP112'
    UNION ALL SELECT 'Mangala Perera', (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1), (SELECT id FROM positions WHERE title = 'Accountant' LIMIT 1), (SELECT id FROM locations WHERE name = 'Eastern Province' LIMIT 1), '2023-04-25'::date, 62000.00, 'user'::user_role, ARRAY['Accounting', 'Bookkeeping', 'Tax Preparation', 'Auditing'], 'EMP113'
    UNION ALL SELECT 'Thusitha Perera', (SELECT id FROM departments WHERE name = 'Finance' LIMIT 1), (SELECT id FROM positions WHERE title = 'Finance Manager' LIMIT 1), (SELECT id FROM locations WHERE name = 'North Western Province' LIMIT 1), '2022-09-01'::date, 75000.00, 'user'::user_role, ARRAY['Budget Management', 'Cost Control', 'Strategic Planning', 'Leadership'], 'EMP114'
    UNION ALL SELECT 'Samantha Perera', (SELECT id FROM departments WHERE name = 'Marketing' LIMIT 1), (SELECT id FROM positions WHERE title = 'Marketing Manager' LIMIT 1), (SELECT id FROM locations WHERE name = 'North Central Province' LIMIT 1), '2023-06-01'::date, 65000.00, 'user'::user_role, ARRAY['Digital Marketing', 'SEO', 'Google Analytics', 'Campaign Management'], 'EMP115'
    UNION ALL SELECT 'Anusha Silva', (SELECT id FROM departments WHERE name = 'Marketing' LIMIT 1), (SELECT id FROM positions WHERE title = 'Marketing Specialist' LIMIT 1), (SELECT id FROM locations WHERE name = 'Uva Province' LIMIT 1), '2023-02-28'::date, 58000.00, 'user'::user_role, ARRAY['Content Creation', 'Copywriting', 'Social Media', 'Graphic Design'], 'EMP116'
    UNION ALL SELECT 'Chaminda Perera', (SELECT id FROM departments WHERE name = 'Operations' LIMIT 1), (SELECT id FROM positions WHERE title = 'Operations Manager' LIMIT 1), (SELECT id FROM locations WHERE name = 'Sabaragamuwa Province' LIMIT 1), '2023-07-01'::date, 68000.00, 'user'::user_role, ARRAY['Operations Management', 'Process Optimization', 'Six Sigma', 'Lean Management'], 'EMP117'
    UNION ALL SELECT 'Kasun Perera', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'Software Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Western Province' LIMIT 1), '2023-03-01'::date, 71000.00, 'user'::user_role, ARRAY['Ruby', 'Rails', 'PostgreSQL', 'Redis'], 'EMP118'
    UNION ALL SELECT 'Thushari Fernando', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'Senior Software Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Central Province' LIMIT 1), '2022-08-15'::date, 78000.00, 'user'::user_role, ARRAY['Machine Learning', 'Python', 'TensorFlow', 'Data Science'], 'EMP119'
    UNION ALL SELECT 'Rohan Perera', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'DevOps Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Southern Province' LIMIT 1), '2023-06-20'::date, 73000.00, 'user'::user_role, ARRAY['Jenkins', 'Groovy', 'CI/CD', 'Build Automation'], 'EMP120'
    UNION ALL SELECT 'Chandrika Perera', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'QA Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Northern Province' LIMIT 1), '2023-01-10'::date, 66000.00, 'user'::user_role, ARRAY['Selenium', 'Java', 'TestNG', 'Automation'], 'EMP121'
    UNION ALL SELECT 'Prasanna Kumara', (SELECT id FROM departments WHERE name = 'Information Technology' LIMIT 1), (SELECT id FROM positions WHERE title = 'Senior Software Engineer' LIMIT 1), (SELECT id FROM locations WHERE name = 'Eastern Province' LIMIT 1), '2023-05-10'::date, 79000.00, 'admin'::user_role, ARRAY['Microservices', 'Spring Cloud', 'Kubernetes', 'Distributed Systems'], 'EMP122'
) AS employee_data;

-- Step 3: User Accounts
INSERT INTO users (email, password_hash, full_name, role, employee_id)
SELECT
    LOWER(REPLACE(full_name, ' ', '.')) || '@orian.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    full_name,
    role,
    id
FROM employees
WHERE employee_id LIKE 'EMP1%'
ON CONFLICT (email) DO NOTHING;

-- Step 4: Payroll Runs
INSERT INTO payroll_runs (id, run_date, pay_period_start, pay_period_end, total_disbursed, employee_count, status)
SELECT uuid_generate_v4(), '2025-11-30'::date, '2025-11-01'::date, '2025-11-30'::date, 0.00, 50, 'Processed'::payroll_status
UNION ALL SELECT uuid_generate_v4(), '2025-12-31'::date, '2025-12-01'::date, '2025-12-31'::date, 0.00, 50, 'Processed'::payroll_status
UNION ALL SELECT uuid_generate_v4(), '2026-01-31'::date, '2026-01-01'::date, '2026-01-31'::date, 0.00, 50, 'Processed'::payroll_status
ON CONFLICT (run_date) DO NOTHING;

-- Step 5: Payroll Items (Fixed: Casts double precision math to numeric before rounding)
INSERT INTO payroll_items (payroll_run_id, employee_id, base_salary, hourly_rate,
                          standard_hours, overtime_hours, overtime_rate, overtime_pay,
                          bonuses, allowances, federal_tax, state_tax, insurance,
                          other_deductions, gross_pay, total_deductions, net_pay, status)
SELECT
    pr.id as payroll_run_id,
    e.id as employee_id,
    e.salary as base_salary,
    ROUND((e.salary::numeric / 2080.0), 2) as hourly_rate,
    40.0 as standard_hours,

    -- Overtime Hours (Random 0-10)
    CASE WHEN RANDOM() > 0.6 THEN FLOOR(RANDOM() * 10 + 1)::numeric ELSE 0 END as overtime_hours,
    1.5 as overtime_rate,

    -- Overtime Pay (Fixed casting)
    CASE WHEN RANDOM() > 0.6 THEN
        ROUND( ((e.salary::numeric / 2080.0) * 1.5 * FLOOR(RANDOM() * 10 + 1))::numeric, 2)
    ELSE 0 END as overtime_pay,

    -- Bonuses (Fixed casting)
    CASE WHEN RANDOM() > 0.7 THEN
        ROUND( (RANDOM() * 1000 + 500)::numeric, 2)
    ELSE 0 END as bonuses,

    -- Allowances (Fixed casting)
    CASE WHEN RANDOM() > 0.5 THEN
        ROUND( (RANDOM() * 300 + 200)::numeric, 2)
    ELSE 0 END as allowances,

    ROUND(e.salary::numeric * 0.15, 2) as federal_tax,
    ROUND(e.salary::numeric * 0.05, 2) as state_tax,
    250.00 as insurance,

    -- Other Deductions (Fixed casting)
    CASE WHEN RANDOM() > 0.8 THEN
        ROUND( (RANDOM() * 100)::numeric, 2)
    ELSE 0 END as other_deductions,

    -- Gross Pay (Sum of base + calculated components)
    (e.salary +
     CASE WHEN RANDOM() > 0.6 THEN ROUND(((e.salary::numeric / 2080.0) * 1.5 * FLOOR(RANDOM() * 10 + 1))::numeric, 2) ELSE 0 END +
     CASE WHEN RANDOM() > 0.7 THEN ROUND((RANDOM() * 1000 + 500)::numeric, 2) ELSE 0 END +
     CASE WHEN RANDOM() > 0.5 THEN ROUND((RANDOM() * 300 + 200)::numeric, 2) ELSE 0 END
    ) as gross_pay,

    -- Total Deductions
    (ROUND(e.salary::numeric * 0.15, 2) + ROUND(e.salary::numeric * 0.05, 2) + 250.00 +
     CASE WHEN RANDOM() > 0.8 THEN ROUND((RANDOM() * 100)::numeric, 2) ELSE 0 END
    ) as total_deductions,

    -- Net Pay (Gross - Deductions)
    ((e.salary +
      CASE WHEN RANDOM() > 0.6 THEN ROUND(((e.salary::numeric / 2080.0) * 1.5 * FLOOR(RANDOM() * 10 + 1))::numeric, 2) ELSE 0 END +
      CASE WHEN RANDOM() > 0.7 THEN ROUND((RANDOM() * 1000 + 500)::numeric, 2) ELSE 0 END +
      CASE WHEN RANDOM() > 0.5 THEN ROUND((RANDOM() * 300 + 200)::numeric, 2) ELSE 0 END)
     -
     (ROUND(e.salary::numeric * 0.15, 2) + ROUND(e.salary::numeric * 0.05, 2) + 250.00 +
      CASE WHEN RANDOM() > 0.8 THEN ROUND((RANDOM() * 100)::numeric, 2) ELSE 0 END)
    ) as net_pay,

    'Processed'::text as status
FROM employees e, payroll_runs pr
WHERE e.employee_id LIKE 'EMP1%' AND pr.run_date = '2025-11-30'::date;

-- Step 6: Attendance Data
-- November 2025
INSERT INTO timesheets (employee_id, date, clock_in, clock_out, status)
SELECT
    e.id as employee_id,
    gen_date.date,
    CASE
        WHEN e.employee_id IN ('EMP109', 'EMP114', 'EMP117', 'EMP119', 'EMP122') THEN gen_date.date + INTERVAL '8 hours 45 minutes'
        WHEN e.employee_id IN ('EMP102', 'EMP106', 'EMP110', 'EMP113', 'EMP118', 'EMP120') THEN gen_date.date + INTERVAL '9 hours 15 minutes'
        ELSE gen_date.date + INTERVAL '9 hours 45 minutes'
    END as clock_in,
    CASE
        WHEN e.employee_id IN ('EMP109', 'EMP114', 'EMP117', 'EMP119', 'EMP122') THEN gen_date.date + INTERVAL '17 hours 15 minutes'
        WHEN e.employee_id IN ('EMP102', 'EMP106', 'EMP110', 'EMP113', 'EMP118', 'EMP120') THEN gen_date.date + INTERVAL '17 hours 30 minutes'
        ELSE gen_date.date + INTERVAL '17 hours 45 minutes'
    END as clock_out,
    CASE
        WHEN e.employee_id IN ('EMP104', 'EMP107', 'EMP111', 'EMP116', 'EMP121') AND RANDOM() > 0.7 THEN 'Absent'::attendance_status
        WHEN e.employee_id IN ('EMP102', 'EMP106', 'EMP110', 'EMP113', 'EMP118', 'EMP120') AND RANDOM() > 0.7 THEN 'Late'::attendance_status
        ELSE 'Present'::attendance_status
    END as status
FROM employees e,
     (SELECT generate_series('2025-11-01'::date, '2025-11-30'::date, '1 day'::interval) as date) gen_date
WHERE e.employee_id LIKE 'EMP1%'
  AND EXTRACT(DOW FROM gen_date.date) NOT IN (0, 6)
  AND gen_date.date NOT IN ('2025-11-27'::date, '2025-11-28'::date)
ON CONFLICT (employee_id, date) DO NOTHING;

-- December 2025
INSERT INTO timesheets (employee_id, date, clock_in, clock_out, status)
SELECT
    e.id as employee_id,
    gen_date.date,
    CASE
        WHEN e.employee_id IN ('EMP109', 'EMP114', 'EMP117', 'EMP119', 'EMP122') THEN gen_date.date + INTERVAL '8 hours 30 minutes'
        WHEN e.employee_id IN ('EMP102', 'EMP106', 'EMP110', 'EMP113', 'EMP118', 'EMP120') THEN gen_date.date + INTERVAL '9 hours 00 minutes'
        ELSE gen_date.date + INTERVAL '9 hours 15 minutes'
    END,
    CASE
        WHEN e.employee_id IN ('EMP109', 'EMP114', 'EMP117', 'EMP119', 'EMP122') THEN gen_date.date + INTERVAL '17 hours 30 minutes'
        WHEN e.employee_id IN ('EMP102', 'EMP106', 'EMP110', 'EMP113', 'EMP118', 'EMP120') THEN gen_date.date + INTERVAL '17 hours 45 minutes'
        ELSE gen_date.date + INTERVAL '18 hours 00 minutes'
    END,
    CASE
        WHEN e.employee_id IN ('EMP104', 'EMP107', 'EMP111', 'EMP116', 'EMP121') AND RANDOM() > 0.6 THEN 'Absent'::attendance_status
        WHEN e.employee_id IN ('EMP102', 'EMP106', 'EMP110', 'EMP113', 'EMP118', 'EMP120') AND RANDOM() > 0.6 THEN 'Late'::attendance_status
        ELSE 'Present'::attendance_status
    END
FROM employees e,
     (SELECT generate_series('2025-12-01'::date, '2025-12-31'::date, '1 day'::interval) as date) gen_date
WHERE e.employee_id LIKE 'EMP1%'
  AND EXTRACT(DOW FROM gen_date.date) NOT IN (0, 6)
  AND gen_date.date NOT IN ('2025-12-25'::date, '2025-12-26'::date)
ON CONFLICT (employee_id, date) DO NOTHING;

-- January 2026
INSERT INTO timesheets (employee_id, date, clock_in, clock_out, status)
SELECT
    e.id as employee_id,
    gen_date.date,
    gen_date.date + INTERVAL '8 hours 45 minutes',
    gen_date.date + INTERVAL '17 hours 15 minutes',
    'Present'::attendance_status
FROM employees e,
     (SELECT generate_series('2026-01-01'::date, '2026-01-31'::date, '1 day'::interval) as date) gen_date
WHERE e.employee_id LIKE 'EMP1%'
  AND EXTRACT(DOW FROM gen_date.date) NOT IN (0, 6)
  AND gen_date.date != '2026-01-01'::date
ON CONFLICT (employee_id, date) DO NOTHING;

-- Step 7: Payslips
-- FIX: Changed ON CONFLICT (employee_id, report_month) to (employee_id, month_year) to match the inserted column
INSERT INTO payslips (employee_id, payroll_run_id, month_year, issue_date, net_salary, status)
SELECT
    e.id as employee_id,
    pr.id as payroll_run_id,
    TO_CHAR(pr.pay_period_start, 'Month YYYY') as month_year,
    pr.run_date as issue_date,
    e.salary * 0.65 as net_salary,
    'Paid'::payslip_status as status
FROM employees e, payroll_runs pr
WHERE e.employee_id LIKE 'EMP1%' AND pr.run_date = '2025-11-30'::date
ON CONFLICT (employee_id, month_year) DO NOTHING;

-- Step 8: Time Off Requests
INSERT INTO time_off_requests (employee_id, leave_type, reason, duration, dates, requested_on, status, is_approved)
VALUES
((SELECT id FROM employees WHERE employee_id = 'EMP100'), 'Vacation'::leave_type, 'Family trip to Kandy', '5 days', ARRAY['2025-12-20'::date, '2025-12-21'::date, '2025-12-22'::date, '2025-12-23'::date, '2025-12-24'::date], '2025-12-01'::timestamp, 'Approved'::leave_status, true),
((SELECT id FROM employees WHERE employee_id = 'EMP109'), 'Sick'::leave_type, 'Medical appointment', '1 day', ARRAY['2025-11-15'::date], '2025-11-14'::timestamp, 'Approved'::leave_status, true),
((SELECT id FROM employees WHERE employee_id = 'EMP117'), 'Personal'::leave_type, 'Personal work', '2 days', ARRAY['2026-01-10'::date, '2026-01-11'::date], '2026-01-05'::timestamp, 'Pending'::leave_status, false),
((SELECT id FROM employees WHERE employee_id = 'EMP122'), 'Vacation'::leave_type, 'Christmas vacation', '3 days', ARRAY['2025-12-24'::date, '2025-12-25'::date, '2025-12-26'::date], '2025-12-01'::timestamp, 'Approved'::leave_status, true)
ON CONFLICT DO NOTHING;

COMMIT;

SELECT '=== FIXED DATA POPULATION COMPLETE ===' as status, '50 new employees populated' as details;