-- Insert sample salary data for testing dynamic payroll system
-- This script adds realistic salary data to employees, salary history, and payroll items

-- 1. Update existing employee salaries
UPDATE employees
SET salary =
  CASE
    -- Engineering employees
    WHEN position_id IN (1, 2, 4) THEN
      CASE
        WHEN full_name LIKE '%Senior%' THEN 120000
        WHEN full_name LIKE '%Team Lead%' THEN 110000
        WHEN full_name LIKE '%Developer%' THEN 95000
        WHEN full_name LIKE '%Junior Developer%' THEN 75000
        WHEN full_name LIKE '%Project Manager%' THEN 105000
        ELSE 85000
      END
    -- Marketing employees
    WHEN position_id IN (7, 8, 9) THEN
      CASE
        WHEN full_name LIKE '%Marketing Executive%' THEN 95000
        WHEN full_name LIKE '%SEO Specialist%' THEN 70000
        WHEN full_name LIKE '%Content Writer%' THEN 65000
        ELSE 60000
      END
    -- Sales employees
    WHEN position_id IN (10, 11) THEN
      CASE
        WHEN full_name LIKE '%Sales Manager%' THEN 100000
        WHEN full_name LIKE '%Sales Representative%' THEN 55000
        ELSE 50000
      END
    -- HR employees
    WHEN position_id IN (12, 13) THEN
      CASE
        WHEN full_name LIKE '%HR Manager%' THEN 90000
        WHEN full_name LIKE '%Recruiter%' THEN 70000
        ELSE 65000
      END
    -- Finance employees
    WHEN position_id IN (14, 15, 16) THEN
      CASE
        WHEN full_name LIKE '%Accountant%' THEN 85000
        WHEN full_name LIKE '%Finance Officer%' THEN 90000
        WHEN full_name LIKE '%Financial Analyst%' THEN 75000
        ELSE 70000
      END
  WHERE salary IS NOT NULL;

-- 2. Insert salary history data
INSERT INTO salary_history (employee_id, old_salary, new_salary, change_date, reason)
SELECT
  e.id,
  -- For demonstration, we'll add 2-3 salary changes per employee
  85000 AS old_salary, -- Previous salary
  e.salary AS new_salary, -- Current salary (from step 1)
  CURRENT_DATE AS change_date,
  CASE
    WHEN RANDOM() < 0.33 THEN 'Annual merit increase'
    WHEN RANDOM() < 0.66 THEN 'Promotion to Senior Developer'
    WHEN RANDOM() < 0.99 THEN 'Market adjustment for Engineering team'
    ELSE 'Cost of living adjustment'
  END AS reason
FROM employees e
WHERE e.salary IS NOT NULL
AND e.id IN (
  SELECT id FROM employees LIMIT 10 -- First 10 employees
)
ORDER BY e.id;

-- 3. Insert payroll items for current month (demonstration)
INSERT INTO payroll_items (
  payroll_run_id, employee_id, base_salary, hourly_rate, standard_hours,
  overtime_hours, overtime_rate, overtime_pay, bonuses, allowances, commissions,
  gross_pay, federal_tax, state_tax, insurance, other_deductions,
  total_deductions, net_pay, status, created_at, updated_at
SELECT
  'demo-run-' || EXTRACT(MONTH FROM CURRENT_DATE) || '-' || EXTRACT(YEAR FROM CURRENT_DATE),
  e.id,
  e.salary AS base_salary,
  e.salary / (40 * 52 * 12) AS hourly_rate, -- Annual to hourly
  168.0 AS standard_hours, -- 40 hours/week * 4.2 weeks
  0.0 AS overtime_hours, -- No overtime for demo
  1.5 AS overtime_rate, -- 1.5x multiplier
  0.0 AS overtime_pay, -- No overtime
  CASE
    -- Engineering department bonus
    WHEN e.department_id IN (1, 2, 3, 4) THEN e.salary * 0.05 -- 5% bonus
    -- Marketing department bonus
    WHEN e.department_id IN (5, 6, 7, 8) THEN e.salary * 0.03 -- 3% bonus
    -- Sales department bonus
    WHEN e.department_id IN (10, 11) THEN e.salary * 0.08 -- 8% commission
    ELSE 0.0 -- Other departments 2% allowance
  END AS bonuses,
  CASE
    -- Housing allowance for some departments
    WHEN e.department_id IN (1, 2, 3, 4) THEN 200.0 -- Engineering housing
    ELSE 100.0 -- Standard allowance
  END AS allowances,
  0.0 AS commissions, -- No commissions except sales
  e.base_salary + (e.base_salary * 0.05) + (CASE WHEN e.department_id IN (1, 2, 3, 4) THEN e.salary * 0.05 ELSE 0.0 END) + (CASE WHEN e.department_id IN (5, 6, 7, 8) THEN e.salary * 0.03 ELSE 0.0 END) + (CASE WHEN e.department_id IN (10, 11) THEN e.salary * 0.08 ELSE 0.0 END) AS gross_pay,
  -- Tax calculations
  e.salary * 0.15 AS federal_tax,
  e.salary * 0.05 AS state_tax,
  200.0 AS insurance, -- Fixed health insurance
  e.salary * 0.03 AS other_deductions, -- 401k retirement
  (e.salary * 0.15) + (e.salary * 0.05) + 200.0 + (e.salary * 0.03) AS total_deductions,
  e.base_salary + (e.base_salary * 0.05) + (CASE WHEN e.department_id IN (1, 2, 3, 4) THEN e.salary * 0.05 ELSE 0.0 END) + (CASE WHEN e.department_id IN (5, 6, 7, 8) THEN e.salary * 0.03 ELSE 0.0 END) + (CASE WHEN e.department_id IN (10, 11) THEN e.salary * 0.08 ELSE 0.0 END) - (e.salary * 0.15) - (e.salary * 0.05) - 200.0 - (e.salary * 0.03) AS net_pay,
  'calculated' AS status,
  CURRENT_TIMESTAMP AS created_at,
  CURRENT_TIMESTAMP AS updated_at
FROM employees e
WHERE e.salary IS NOT NULL
AND e.id IN (
  SELECT id FROM employees LIMIT 15 -- First 15 employees for demo
);

-- 4. Create a demo payroll run
INSERT INTO payroll_runs (
  run_date, pay_period_start, pay_period_end, total_disbursed, employee_count, status
) VALUES (
  CURRENT_DATE,
  DATE_TRUNC('month', CURRENT_DATE) AS pay_period_start,
  DATE_TRUNC('month', CURRENT_DATE) + INTERVAL '1 month' - INTERVAL '1 day' AS pay_period_end,
  (SELECT SUM(net_pay) FROM payroll_items WHERE payroll_run_id LIKE 'demo-run-%' LIMIT 1), -- Total from demo payroll items
  (SELECT COUNT(*) FROM payroll_items WHERE payroll_run_id LIKE 'demo-run-%' LIMIT 1), -- Number of employees processed
  'Completed'
);

-- 5. Insert sample payslips
INSERT INTO payslips (
  employee_id, payroll_run_id, month_year, issue_date, net_salary, status, pdf_url
SELECT
  e.id,
  'demo-run-' || EXTRACT(MONTH FROM CURRENT_DATE) || '-' || EXTRACT(YEAR FROM CURRENT_DATE),
  EXTRACT(MONTH FROM CURRENT_DATE) || ' ' || EXTRACT(YEAR FROM CURRENT_DATE),
  CURRENT_DATE,
  pi.net_pay,
  'Paid',
  NULL -- No PDF URL for now
FROM employees e
WHERE e.id IN (
  SELECT employee_id FROM payroll_items WHERE payroll_run_id LIKE 'demo-run-%' LIMIT 10 -- First 10 employees
)
AND e.salary IS NOT NULL
ORDER BY e.full_name;

-- 6. Add employee deductions (demonstration)
INSERT INTO employee_deductions (employee_id, deduction_type_id, amount, is_pre_tax, effective_date)
SELECT
  e.id,
  1, -- Federal Tax
  CASE WHEN e.department_id IN (1, 2, 3, 4) THEN e.salary * 0.15 ELSE e.salary * 0.12 END, -- Different tax rates by department
  TRUE, -- Pre-tax deduction
  CURRENT_DATE,
  NULL -- No end date (ongoing)
FROM employees e
WHERE e.id IN (
  SELECT id FROM employees LIMIT 20 -- First 20 employees for deductions
)
AND e.salary IS NOT NULL;

INSERT INTO employee_deductions (employee_id, deduction_type_id, amount, is_pre_tax, effective_date)
SELECT
  e.id,
  2, -- State Tax
  e.salary * 0.05, -- 5% state tax
  TRUE, -- Pre-tax deduction
  CURRENT_DATE,
  NULL -- No end date (ongoing)
FROM employees e
WHERE e.id IN (
  SELECT id FROM employees LIMIT 20 -- Second set
)
AND e.id NOT IN (SELECT employee_id FROM employee_deductions LIMIT 20) -- Avoid duplicates
AND e.salary IS NOT NULL;

INSERT INTO employee_deductions (employee_id, deduction_type_id, amount, is_pre_tax, effective_date)
SELECT
  e.id,
  3, -- Health Insurance
  200.00, -- Fixed amount
  TRUE, -- Pre-tax deduction
  CURRENT_DATE,
  NULL -- No end date (ongoing)
FROM employees e
WHERE e.id IN (
  SELECT id FROM employees LIMIT 30 -- Third set
)
AND e.id NOT IN (SELECT employee_id FROM employee_deductions LIMIT 40) -- Avoid duplicates
AND e.salary IS NOT NULL;

-- 7. Create a sample payroll configuration
INSERT INTO payroll_configurations (
  company_name, pay_period_type, standard_hours, overtime_rate, tax_rate, processing_date, status
) VALUES (
  'Demo Tech Company',
  'monthly',
  40.0, -- Standard 40 hours per week
  1.5, -- 1.5x overtime rate
  0.15, -- 15% federal tax rate
  CURRENT_DATE,
  'active'
);

-- Output summary
SELECT
  'Sample Data Inserted' as operation,
  COUNT(DISTINCT e.id) as employees_updated,
  COUNT(*) as salary_history_added,
  COUNT(DISTINCT payroll_run_id) as payroll_runs_created,
  COUNT(*) as payroll_items_created,
  COUNT(*) as payslips_created,
  COUNT(*) as employee_deductions_created
FROM employees e;

-- Explanation of what was done
\echo 'Sample payroll data insertion completed!'
\echo 'Employees with updated salaries: ' || (SELECT COUNT(DISTINCT e.id) FROM employees e WHERE e.salary IS NOT NULL)
\echo 'Salary history records added: ' || (SELECT COUNT(*) FROM salary_history)
\echo 'Payroll items created: ' || (SELECT COUNT(*) FROM payroll_items WHERE payroll_run_id LIKE 'demo-run-%')
\echo 'Payslips generated: ' || (SELECT COUNT(*) FROM payslips WHERE payroll_run_id LIKE 'demo-run-%')
\echo 'Employee deductions added: ' || (SELECT COUNT(*) FROM employee_deductions)
\echo 'Payroll configuration created: ' || (SELECT COUNT(*) FROM payroll_configurations)