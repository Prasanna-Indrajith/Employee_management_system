// src/services/employee.service.ts
import { EmployeeRepository } from "../repositories/employee.repository";
import { CreateEmployeeDTO, Employee } from "../types";

export class EmployeeService {
  private employeeRepository: EmployeeRepository;

  constructor() {
    this.employeeRepository = new EmployeeRepository();
  }

  // Business Logic: Get All
  async getAllEmployees(): Promise<Employee[]> {
    return await this.employeeRepository.findAll();
  }

  async getEmployeeById(id: string) {
    return await this.employeeRepository.findById(id);
  }

  // Business Logic: Create
  async createEmployee(data: CreateEmployeeDTO): Promise<Employee> {
    // 1. Business Check: logic for duplicates could go here
    // const existing = await this.employeeRepository.findByEmail(data.email);
    // if (existing) throw new Error("Email already in use");

    // 2. Formatting: Ensure phone number is consistent (e.g., force +94)
    if (data.phone.startsWith("0")) {
      data.phone = "+94" + data.phone.slice(1);
    }

    // 3. Persist
    return await this.employeeRepository.create(data);
  }

  // Business Logic: Update (NEW)
  async updateEmployee(
    id: string,
    data: Partial<CreateEmployeeDTO>
  ): Promise<Employee | null> {
    console.log("Done : Service : 10");

    // 1. Formatting: Apply same phone logic if phone is being updated
    if (data.phone && data.phone.startsWith("0")) {
      data.phone = "+94" + data.phone.slice(1);
    }

    console.log(data);
    // 2. Persist update via Repository
    return await this.employeeRepository.update(id, data);
  }

  // Add this inside EmployeeService class
  async getTimesheets(date?: string) {
    return await this.employeeRepository.findTimesheets(date);
  }

  async getProfile(userId: string) {
    return await this.employeeRepository.findProfileByUserId(userId);
  }

  async updateProfile(
    userId: string,
    data: { phone: string; bio: string; skills: string[] }
  ) {
    return await this.employeeRepository.updateProfile(userId, data);
  }

  async deleteEmployee(id: string) {
    return await this.employeeRepository.delete(id);
  }
}

export const employeeService = new EmployeeService();
