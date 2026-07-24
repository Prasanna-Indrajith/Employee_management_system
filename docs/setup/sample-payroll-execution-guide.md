# 📋 Instructions to Execute Sample Payroll Data Script

## 🗄️ **Step 1: Update Database Connection**

Replace the connection parameters in the SQL file:

```bash
psql -h [YOUR_HOST] -U [YOUR_USERNAME] -d [YOUR_DATABASE_NAME] -f sample_payroll_data_rs.sql
```

**Example:**
```bash
psql -h localhost -U postgres -d employee_management -f sample_payroll_data_rs.sql
```

## 📝 **Step 2: Execute the Script**

```bash
cd /home/prasa/Documents/EMS/employee_management_system
psql -h localhost -U postgres -d employee_management -f sample_payroll_data_rs.sql
```

## 📊 **Expected Output**

After successful execution, you should see:
```
Sample Data Inserted
Employees with updated salaries: [number]
Salary history records added: [number]
Payroll items created: [number]
Payslips generated: [number]
Employee deductions added: [number]
Payroll configuration created: [number]
```

## 🔧 **Troubleshooting**

If you encounter connection issues:
1. **Check PostgreSQL service**: `sudo systemctl status postgresql`
2. **Verify credentials**: Database username and password
3. **Test connection**: `psql -h localhost -U username -d database_name`
4. **Check port**: Default PostgreSQL port is 5432

## 📈 **What This Does**

### **Employee Salaries**:
- **Engineering Department**: Senior Developer: Rs. 120,000, Team Lead: Rs. 110,000
- **Marketing Department**: Executive: Rs. 95,000, SEO Specialist: Rs. 70,000
- **Sales Department**: Manager: Rs. 100,000, Representative: Rs. 55,000
- **HR Department**: Manager: Rs. 90,000, Recruiter: Rs. 70,000
- **Finance Department**: Accountant: Rs. 85,000, Finance Officer: Rs. 90,000, Analyst: Rs. 75,000

### **Salary History**:
- Adds 2-3 historical changes per employee
- Realistic reasons: Merit increases, market adjustments, cost of living
- Proper date sequences with change dates

### **Payroll Items**:
- **Monthly Calculations**: Base salary, overtime (standard 40 hrs), bonuses
- **Department-specific**: 5% bonus for engineering, 3% for marketing, 8% for sales
- **Tax Deductions**: Federal (15%), State (5%), fixed amounts
- **Insurance & 401k**: Health insurance Rs. 200, retirement 3%
- **Net Pay Calculation**: Gross pay minus all deductions

### **Employee Deductions**:
- **Federal Tax**: 15% of salary
- **State Tax**: 5% of salary
- **Health Insurance**: Fixed Rs. 200 per employee
- **401k Retirement**: 3% of salary

### **Payroll Configuration**:
- Company Name: "Demo Tech Company"
- Pay Period Type: "monthly"
- Standard Hours: 40.0 hours/week
- Overtime Rate: 1.5x
- Tax Rate: 0.15 (15% federal + state tax combined)

### **Sample Data Creation**:
- **Demo Payroll Run**: Current month with unique ID
- **15+ Employees**: Complete payroll items for diverse workforce
- **Realistic Salary Range**: Rs. 55,000 - Rs. 120,000
- **Department Diversity**: Engineering, Marketing, Sales, HR, Finance
- **Comprehensive Deductions**: Federal, state tax, insurance, 401k

---

## 🎯 **Currency Display Benefits**

### **For Frontend**:
All monetary values will now display as **"Rs. 1,20,000.00"** instead of **"$120,000.00"**

### **For Users**:
- **Culturally Appropriate**: Sri Lankan Rupee symbol
- **Professional Formatting**: Proper thousand separators and decimal places
- **Financial Accuracy**: Clear distinction between lakhs and crores if needed

---

## 🚀 **Execution Ready!**

Run the corrected SQL script to populate your database with sample data formatted for Sri Lankan currency display. Your dynamic payroll system is now ready for testing with realistic financial data!