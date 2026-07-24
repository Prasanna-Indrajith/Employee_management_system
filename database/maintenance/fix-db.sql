-- ==========================================
-- STEP 0: CREATE MISSING ENUM TYPES
-- ==========================================

DO $$
BEGIN
    -- 1. Leave Type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_type') THEN
        CREATE TYPE leave_type AS ENUM ('Vacation', 'Sick', 'Personal', 'Maternity', 'Paternity', 'Unpaid');
    END IF;

    -- 2. Leave Status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'leave_status') THEN
        CREATE TYPE leave_status AS ENUM ('Pending', 'Approved', 'Rejected');
    END IF;

    -- 3. Attendance Status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'attendance_status') THEN
        CREATE TYPE attendance_status AS ENUM ('Present', 'Absent', 'Late', 'Half Day', 'On Leave');
    END IF;

    -- 4. User Role
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE user_role AS ENUM ('admin', 'user', 'hr', 'manager');
    END IF;

    -- 5. Employment Type
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'employment_type') THEN
        CREATE TYPE employment_type AS ENUM ('Full-time', 'Part-time', 'Contract', 'Intern');
    END IF;

    -- 6. Employee Status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'emp_status') THEN
        CREATE TYPE emp_status AS ENUM ('active', 'inactive', 'terminated', 'resigned', 'on_leave');
    END IF;

    -- 7. Payroll Status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payroll_status') THEN
        CREATE TYPE payroll_status AS ENUM ('Pending', 'Processed', 'Paid', 'Failed');
    END IF;

    -- 8. Payslip Status
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'payslip_status') THEN
        CREATE TYPE payslip_status AS ENUM ('Draft', 'Pending', 'Paid');
    END IF;
END $$;