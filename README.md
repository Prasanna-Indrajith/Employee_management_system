# Employee Management System

A comprehensive web application for managing employee data, attendance, leave requests, and payroll information. Built with Node.js, Express, PostgreSQL for the backend, and React, TypeScript, and Tailwind CSS for the frontend.

## Features

- **Employee Management**: Add, view, edit, and delete employee records.
- **User Authentication**: Secure login for both administrators and regular users.
- **Attendance Tracking**: Record and view employee clock-in/out times.
- **Leave Management**: Submit, track, and approve/reject leave requests.
- **Payroll & Salary**: Manage payroll runs, view payslips, and track salary history.
- **Admin Dashboard**: Overview of key company metrics, employee stats, and salary analytics.
- **User Dashboard**: Personalized view of attendance, leave, and payslips.
- **Responsive Design**: Utilizes Tailwind CSS for a consistent experience across devices.

## Tech Stack

- **Backend**: Node.js, Express, TypeScript, PostgreSQL, bcryptjs, jsonwebtoken, zod, winston, pg, cors, dotenv
- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Shadcn UI, Recharts, Axios, React Router DOM, TanStack Table, Lucide React, Tabler Icons React

## Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/Prasanna-Indrajith/Employee_management_system.git
    cd employee-management-system
    ```

2.  **Backend Setup:**

        - Navigate to the backend directory:
          ```bash
          cd backend
          ```
        - Install dependencies:
          ```bash
          npm install
          ```
        - Create a `.env` file in the `backend/` directory and configure your database connection details and JWT secret:
          ```env
          # .env example for backend
            JWT_SECRET=your_super_secret_key_change_this
            PORT=3001
            DB_USER=your_db_user
            DB_HOST=localhost
            DB_NAME=your_db_name
            DB_PASSWORD=your_db_password
            DB_PORT=5432

NODE_ENV=development

          ```
        - Ensure your PostgreSQL database is running and the necessary tables are created (based on the repository's backend structure).

3.  **Frontend Setup:**
    - Navigate to the frontend directory:
      ```bash
      cd ../frontend
      ```
    - Install dependencies:
      ```bash
      npm install
      ```
    - Configure environment variables if necessary (e.g., for the API URL, though it's hardcoded to `http://localhost:3001/api` in `src/services/api.ts`).

## Usage

1.  **Start the Backend Server:**

    ```bash
    cd backend
    npm run dev # or npm start
    ```

    The backend will typically run on `http://localhost:3001`.

2.  **Start the Frontend Development Server:**

    ```bash
    cd frontend
    npm run dev
    ```

    The frontend will typically run on `http://localhost:5173` (or another port if default is taken).

3.  **Access the Application:**
    Open your browser and navigate to `http://localhost:5173`.

## Project Structure

## Contributing

Contributions are welcome! Please follow these steps:

1.  Fork the repository.
2.  Create a new branch for your feature or fix (`git checkout -b feature/your-feature`).
3.  Make your changes and ensure they are well-tested and formatted.
4.  Commit your changes (`git commit -m 'Add some feature'`).
5.  Push to the branch (`git push origin feature/your-feature`).
6.  Create a Pull Request.

## License

This project is licensed under the MIT License - see the `LICENSE` file for details.
