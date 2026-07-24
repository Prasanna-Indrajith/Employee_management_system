-- =====================================================
-- AUDIT SYSTEM DATABASE SCHEMA
-- Minimal comprehensive logging & audit system
-- Retention: 1 year (automated cleanup)
-- =====================================================

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Main Audit Logs Table
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES public.users(id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL, -- LOGIN, LOGOUT, PAYROLL_RUN, SALARY_CHANGE, etc.
    resource_type VARCHAR(50) NOT NULL, -- employee, payroll, user, payslip, etc.
    resource_id UUID, -- ID of the resource being acted upon
    old_values JSONB, -- Previous state of the resource
    new_values JSONB, -- New state of the resource
    ip_address INET, -- Client IP address
    user_agent TEXT, -- Client user agent
    status VARCHAR(20) NOT NULL DEFAULT 'SUCCESS', -- SUCCESS, FAILED, ERROR
    message TEXT, -- Additional context or error message
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- System Logs Table (for application errors, info, etc.)
CREATE TABLE IF NOT EXISTS public.system_logs (
    id SERIAL PRIMARY KEY,
    level VARCHAR(10) NOT NULL, -- ERROR, WARN, INFO, DEBUG
    message TEXT NOT NULL,
    context JSONB, -- Additional context (request details, etc.)
    stack_trace TEXT, -- Error stack trace if applicable
    ip_address INET, -- Client IP if applicable
    user_agent TEXT, -- Client user agent if applicable
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Performance Indexes for Audit Logs
CREATE INDEX IF NOT EXISTS idx_audit_logs_user ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_resource ON public.audit_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_status ON public.audit_logs(status);

-- Performance Indexes for System Logs
CREATE INDEX IF NOT EXISTS idx_system_logs_level ON public.system_logs(level);
CREATE INDEX IF NOT EXISTS idx_system_logs_created_at ON public.system_logs(created_at DESC);

-- Action Types Constraint (for data integrity)
ALTER TABLE public.audit_logs ADD CONSTRAINT chk_audit_action
    CHECK (action IN (
        'LOGIN', 'LOGOUT', 'LOGIN_FAILED',
        'PAYROLL_RUN', 'PAYROLL_FAILED', 'PAYROLL_ITEM_UPDATED',
        'SALARY_CHANGE', 'BONUS_ADDED', 'DEDUCTION_UPDATED',
        'EMPLOYEE_CREATED', 'EMPLOYEE_UPDATED', 'EMPLOYEE_DELETED',
        'USER_CREATED', 'USER_UPDATED', 'USER_DELETED', 'ROLE_CHANGED',
        'PAYSLIP_DOWNLOADED', 'PAYSLIP_GENERATED',
        'REPORT_DOWNLOADED', 'REPORT_GENERATED',
        'ATTendance_CORRECTED', 'LEAVE_APPROVED', 'LEAVE_REJECTED',
        'DATA_EXPORTED', 'SYSTEM_CONFIG_UPDATED'
    ));

-- Status Constraint
ALTER TABLE public.audit_logs ADD CONSTRAINT chk_audit_status
    CHECK (status IN ('SUCCESS', 'FAILED', 'ERROR'));

-- Level Constraint for System Logs
ALTER TABLE public.system_logs ADD CONSTRAINT chk_system_level
    CHECK (level IN ('ERROR', 'WARN', 'INFO', 'DEBUG'));

-- Function to automatically clean up old audit logs (1 year retention)
CREATE OR REPLACE FUNCTION cleanup_old_audit_logs()
RETURNS void AS $$
BEGIN
    DELETE FROM public.audit_logs
    WHERE created_at < CURRENT_DATE - INTERVAL '1 year';
    DELETE FROM public.system_logs
    WHERE created_at < CURRENT_DATE - INTERVAL '1 year';
END;
$$ LANGUAGE plpgsql;

-- Comment for documentation
COMMENT ON TABLE public.audit_logs IS 'Comprehensive audit trail for all system actions with 1-year retention';
COMMENT ON TABLE public.system_logs IS 'Application system logs for errors, warnings, and info events';
COMMENT ON FUNCTION cleanup_old_audit_logs() IS 'Automated cleanup function for log retention management';