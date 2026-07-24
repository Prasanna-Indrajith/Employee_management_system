## Software Solutions Company — Departments & Positions

---

### Company Roles

``` bash
Product
├─ Head of Product
├─ Product Manager
└─ UX Designer

Design
├─ Head of Design
├─ UX Designer
└─ UI Designer

Data
├─ Head of Data
├─ Data Engineer
└─ Data Analyst

IT
├─ IT Director
├─ System Administrator
└─ Cloud Architect

Marketing
├─ Marketing Manager
├─ Digital Marketer
└─ SEO Specialist

HR
├─ General Counsel
├─ CFO
└─ Head of HR
```

---

### Database table plan for departments and roles

Tables:`departments, roles, employees (reference)`

Required tables (minimum)

**departments**
`id (PK), name, code`

**roles**
`id (PK), department_id (FK → departments.id), name, short_name`

**employees**
`id (PK), first_name, last_name, email, department_id (FK), role_id (FK), hired_at, status`

SQL schema (Postgres-style):
```sql
-- departments
CREATE TABLE departments (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  code TEXT NOT NULL UNIQUE
);

-- roles
CREATE TABLE roles (
  id SERIAL PRIMARY KEY,
  department_id INT NOT NULL REFERENCES departments(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  short_name TEXT NOT NULL,
  UNIQUE(department_id, name)
);

-- employees
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  department_id INT REFERENCES departments(id),
  role_id INT REFERENCES roles(id),
  hired_at DATE,
  status TEXT DEFAULT 'active'
);


```

to employee add `bio, skills, employement type(full-time, intern), salary, joined date`