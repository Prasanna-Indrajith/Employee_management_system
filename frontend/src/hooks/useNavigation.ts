import { useNavigate } from 'react-router-dom';

export const useAdminNavigation = () => {
  const navigate = useNavigate();

  return {
    goToDashboard: () => navigate('/admin/dashboard'),
    goToEmployees: () => navigate('/admin/employees/all'),
    goToEmployeeProfile: (id) => navigate(`/admin/employees/${id}`),
    goToTimesheets: () => navigate('/admin/attendance/timesheets'),
    goToTimeOffRequests: () => navigate('/admin/attendance/time-off-requests'),
    goToPayroll: () => navigate('/admin/salary/payroll'),
    goToSalaryReports: () => navigate('/admin/salary/report'),
  };
};