-- Additional tables for dynamic payroll system

-- Payroll Configuration
CREATE TABLE IF NOT EXISTS public.payroll_configurations (
    id SERIAL PRIMARY KEY,
    company_name VARCHAR(100) NOT NULL DEFAULT 'Company Name',
    pay_period_type VARCHAR(20) NOT NULL DEFAULT 'monthly', -- monthly, bi-weekly, weekly
    standard_hours DECIMAL(4,2) DEFAULT 40.0, -- Standard work hours per week
    overtime_rate DECIMAL(5,2) DEFAULT 1.5, -- Overtime multiplier
    tax_rate DECIMAL(5,2) DEFAULT 0.15, -- Default tax rate
    processing_date DATE NOT NULL,
    status VARCHAR(20) DEFAULT 'draft', -- draft, active, archived
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Items (detailed breakdown for each employee)
CREATE TABLE IF NOT EXISTS public.payroll_items (
    id SERIAL PRIMARY KEY,
    payroll_run_id UUID NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,

    -- Base salary calculations
    base_salary DECIMAL(12,2) NOT NULL,
    hourly_rate DECIMAL(8,2) NOT NULL,
    standard_hours DECIMAL(6,2) DEFAULT 40.0,
    overtime_hours DECIMAL(6,2) DEFAULT 0.0,
    overtime_rate DECIMAL(5,2) DEFAULT 1.5,
    overtime_pay DECIMAL(10,2) DEFAULT 0.0,

    -- Additional compensation
    bonuses DECIMAL(10,2) DEFAULT 0.0,
    allowances DECIMAL(10,2) DEFAULT 0.0,
    commissions DECIMAL(10,2) DEFAULT 0.0,

    -- Deductions
    federal_tax DECIMAL(10,2) DEFAULT 0.0,
    state_tax DECIMAL(10,2) DEFAULT 0.0,
    insurance DECIMAL(10,2) DEFAULT 0.0,
    other_deductions DECIMAL(10,2) DEFAULT 0.0,

    -- Totals
    gross_pay DECIMAL(12,2) NOT NULL,
    total_deductions DECIMAL(10,2) DEFAULT 0.0,
    net_pay DECIMAL(12,2) NOT NULL,

    status VARCHAR(20) DEFAULT 'calculated', -- calculated, approved, adjusted
    notes TEXT,

    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Deduction Types
CREATE TABLE IF NOT EXISTS public.deduction_types (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    type VARCHAR(20) NOT NULL, -- fixed, percentage
    amount DECIMAL(10,2),
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Employee Deductions (link employees to specific deductions)
CREATE TABLE IF NOT EXISTS public.employee_deductions (
    id SERIAL PRIMARY KEY,
    employee_id UUID NOT NULL REFERENCES public.employees(id) ON DELETE CASCADE,
    deduction_type_id INTEGER NOT NULL REFERENCES public.deduction_types(id) ON DELETE CASCADE,
    amount DECIMAL(10,2) NOT NULL,
    is_pre_tax BOOLEAN DEFAULT TRUE,
    effective_date DATE NOT NULL DEFAULT CURRENT_DATE,
    end_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payroll Processing Status
CREATE TABLE IF NOT EXISTS public.payroll_processing_log (
    id SERIAL PRIMARY KEY,
    payroll_run_id UUID NOT NULL REFERENCES public.payroll_runs(id) ON DELETE CASCADE,
    step VARCHAR(50) NOT NULL, -- validation, calculation, generation, completion
    status VARCHAR(20) NOT NULL, -- started, in_progress, completed, failed
    employee_count INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    message TEXT,
    started_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP WITHOUT TIME ZONE
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_payroll_items_employee ON public.payroll_items(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_items_run ON public.payroll_items(payroll_run_id);
CREATE INDEX IF NOT EXISTS idx_employee_deductions_employee ON public.employee_deductions(employee_id);
CREATE INDEX IF NOT EXISTS idx_payroll_processing_log_run ON public.payroll_processing_log(payroll_run_id);

-- Insert default deduction types
INSERT INTO public.deduction_types (name, type, amount, description) VALUES
('Federal Tax', 'percentage', 0.15, 'Federal Income Tax Withholding'),
('State Tax', 'percentage', 0.05, 'State Income Tax Withholding'),
('Health Insurance', 'fixed', 200.00, 'Employee Health Insurance Premium'),
('401k', 'percentage', 0.03, 'Retirement Savings Contribution'),
('Dental Insurance', 'fixed', 50.00, 'Dental Insurance Premium')
ON CONFLICT (name) DO NOTHING;