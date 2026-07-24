-- 1. Enable UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Create Enums (For fixed logic)
DO $$ BEGIN
    CREATE TYPE user_role AS ENUM ('admin', 'user');
    CREATE TYPE employment_type AS ENUM ('Full-time', 'Part-time', 'Contract');
    CREATE TYPE emp_status AS ENUM ('active', 'inactive');
    CREATE TYPE attendance_status AS ENUM ('Present', 'Late', 'Absent');
    CREATE TYPE leave_status AS ENUM ('Pending', 'Rejected', 'Approved');
    CREATE TYPE payroll_status AS ENUM ('Pending', 'Processing', 'Processed', 'Failed');
    CREATE TYPE payslip_status AS ENUM ('Paid', 'Pending');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- 3. LOOKUP TABLES (The "Smart" way)
CREATE TABLE departments (
    id SERIAL PRIMARY KEY, -- Simple numbers (1, 2, 3) are fine for lookups
    name VARCHAR(100) NOT NULL UNIQUE,
    code VARCHAR(10) -- e.g. "ENG", "MKT"
);

CREATE TABLE positions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL UNIQUE,
    department_id INT REFERENCES departments(id) -- Optional: Link position to department
);

CREATE TABLE locations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL UNIQUE, -- e.g. "Colombo HQ"
    address TEXT
);

-- 4. EMPLOYEES TABLE (Updated with Foreign Keys)
CREATE TABLE employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(150) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(20),

    -- Foreign Keys replacing the old text columns
    department_id INT REFERENCES departments(id),
    position_id INT REFERENCES positions(id),
    location_id INT REFERENCES locations(id),

    hire_date DATE NOT NULL,
    salary DECIMAL(12, 2) DEFAULT 0,
    bio TEXT,

    role user_role DEFAULT 'user',
    employment_type employment_type DEFAULT 'Full-time',
    status emp_status DEFAULT 'active',

    skills TEXT[],
    manager_id UUID REFERENCES employees(id),

    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. USERS TABLE (Auth)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(150) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(150),
    role user_role DEFAULT 'user',
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. ATTENDANCE
CREATE TABLE timesheets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    clock_in TIMESTAMP,
    clock_out TIMESTAMP,
    status attendance_status DEFAULT 'Absent',
    CONSTRAINT unique_attendance_per_day UNIQUE (employee_id, date)
);

-- 7. LEAVE REQUESTS
CREATE TABLE time_off_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    leave_type VARCHAR(50) NOT NULL,
    reason TEXT,
    duration VARCHAR(50),
    dates DATE[],
    requested_on TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status leave_status DEFAULT 'Pending',
    is_approved BOOLEAN DEFAULT FALSE
);

-- 8. PAYROLL RUNS
CREATE TABLE payroll_runs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    run_date DATE NOT NULL,
    pay_period_start DATE NOT NULL,
    pay_period_end DATE NOT NULL,
    total_disbursed DECIMAL(15, 2) DEFAULT 0,
    employee_count INT DEFAULT 0,
    status payroll_status DEFAULT 'Pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. PAYSLIPS
CREATE TABLE payslips (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    payroll_run_id UUID REFERENCES payroll_runs(id) ON DELETE CASCADE,
    month_year VARCHAR(50),
    issue_date DATE NOT NULL,
    net_salary DECIMAL(12, 2) NOT NULL,
    status payslip_status DEFAULT 'Pending',
    pdf_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. SALARY HISTORY
CREATE TABLE salary_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    employee_id UUID REFERENCES employees(id) ON DELETE CASCADE,
    old_salary DECIMAL(12, 2),
    new_salary DECIMAL(12, 2) NOT NULL,
    change_date DATE DEFAULT CURRENT_DATE,
    reason TEXT
);


-- 1. Add the missing column
ALTER TABLE employees
ADD COLUMN employee_id VARCHAR(20) UNIQUE;

-- 2. (Optional) Backfill existing users (like your Admin) with a dummy ID
UPDATE employees
SET employee_id = 'EMP000'
WHERE employee_id IS NULL;