import { ILoanDTO, IBREResult, EmploymentMode } from '../types/loan.types';

export class BREService {
  private static PAN_REGEX = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;

  /**
   * Validates loan application against business rules.
   */
  public static validate(data: ILoanDTO): IBREResult {
    // 1. PAN Validation
    if (!this.PAN_REGEX.test(data.pan)) {
      return { eligible: false, reason: 'Invalid PAN format' };
    }

    // 2. Age Validation (23 to 50)
    const age = this.calculateAge(data.dob);
    if (age < 23 || age > 50) {
      return { eligible: false, reason: `Age must be between 23 and 50. Current age: ${age}` };
    }

    // 3. Salary Validation (>= 25000)
    if (data.monthlySalary < 25000) {
      return { eligible: false, reason: 'Monthly salary must be at least 25,000' };
    }

    // 4. Employment Validation
    if (data.employmentMode === EmploymentMode.UNEMPLOYED) {
      return { eligible: false, reason: 'Unemployed applicants are not eligible for loans' };
    }

    return { eligible: true };
  }

  /**
   * Calculates age based on DOB.
   */
  private static calculateAge(dob: Date): number {
    const today = new Date();
    const birthDate = new Date(dob);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  }
}
