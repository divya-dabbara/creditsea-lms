export interface IPaymentDTO {
  loanId: string;
  utrNumber: string;
  amount: number;
  paymentDate: Date;
}

export interface IPaymentResponse {
  success: boolean;
  message: string;
  payment?: any;
  outstandingBalance: number;
}
