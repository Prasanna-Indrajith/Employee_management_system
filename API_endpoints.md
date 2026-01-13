# API Endpoints Documentation

Base URL: `http://localhost:3001/api`

## Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/register` | Register a new user | No |
| `POST` | `/login` | User login | No |
| `POST` | `/logout` | User logout | Yes |
| `GET` | `/me` | Get current user info | Yes |

## Employees (`/api/employees`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/me` | Get current employee profile | Yes |
| `PUT` | `/me` | Update current employee profile | Yes |
| `GET` | `/me/attendance` | Get current employee's attendance | Yes |
| `GET` | `/timesheets` | Get timesheets (supports `?date=YYYY-MM-DD`) | Yes |
| `GET` | `/timesheets/pdf/:date` | Download timesheet PDF (Admin only) | Yes (Admin) |
| `GET` | `/my-attendance/pdf/:month` | Download personal attendance PDF | Yes |
| `GET` | `/attendance/today` | Redirects to today's timesheet | Yes |
| `GET` | `/` | Get all employees | Yes |
| `POST` | `/` | Create new employee | Yes (Admin) |
| `GET` | `/:id` | Get employee by ID | Yes |
| `PUT` | `/:id` | Update employee by ID | Yes (Admin) |
| `DELETE` | `/:id` | Delete employee by ID | Yes (Admin) |

## Leaves (`/api/leaves`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `POST` | `/request` | Request a leave | Yes |
| `GET` | `/me` | Get current user's leave history | Yes |
| `GET` | `/admin/all` | Get all leave requests | Yes (Admin) |
| `PATCH` | `/admin/:id/status` | Approve/Reject leave request | Yes (Admin) |

## Payroll (`/api/payroll`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/runs` | Get all payroll runs | Yes |
| `GET` | `/payslips/me` | Get current user's payslips | Yes |
| `GET` | `/payslips/:id/pdf` | Download payslip PDF | Yes |
| `GET` | `/salary-history/me` | Get current user's salary history | Yes |
| `GET` | `/reports` | Get salary analytics reports | Yes |

## Dashboard (`/api/dashboard`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/stats` | Get dashboard statistics | Yes (Admin) |

## Lookups (`/api/lookups`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `GET` | `/` | Get dropdown options (departments, positions, locations) | Yes |

## Admin (`/api/admin`)
| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :--- |
| `*` | `/` | Test endpoint for admin access verification | Yes (Admin) |
