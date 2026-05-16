# CreditSea LMS - Loan Management System

A comprehensive full-stack Loan Management System (LMS) built to handle the entire lifecycle of a loan, from application and automated business rule validation to disbursement and repayment tracking.

## Project Overview
CreditSea LMS is designed for fintech operations, providing a secure and efficient platform for both borrowers and administrators. The system implements a robust role-based access control (RBAC) mechanism, ensuring that each stakeholder (Borrower, Sanction Officer, Disbursement Officer, etc.) has a tailored interface and specific permissions to perform their duties.

## Features
- **JWT Authentication**: Secure session management for all users.
- **Role-Based Access Control (RBAC)**: Dedicated workflows for:
  - **ADMIN**: Full system oversight and user management.
  - **SANCTION**: Loan application review and approval.
  - **DISBURSEMENT**: Fund release and disbursement tracking.
  - **COLLECTION**: Repayment monitoring and balance tracking.
  - **BORROWER**: Loan application and repayment dashboard.
- **Loan Workflow Lifecycle**:
  - `APPLIED` -> `SANCTIONED` (or `REJECTED`) -> `DISBURSED` -> `CLOSED`.
- **BRE (Business Rules Engine)**: Automated pre-qualification checks:
  - PAN format validation.
  - Age criteria (23 - 50 years).
  - Minimum monthly salary (₹25,000).
  - Employment status verification.
- **Payment System**: Outstanding balance tracking with automatic loan closure upon full repayment.
- **Dashboard Modules**: Real-time metrics and task lists for internal staff.
- **File Upload Support**: Secure document handling for loan applications using Multer.
- **Seed Script**: Quick setup with demo accounts for all roles.

## Tech Stack
- **Frontend**: Next.js 15 (App Router), TypeScript, Tailwind CSS
- **Backend**: Node.js, Express, TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT & Bcrypt
- **File Uploads**: Multer (Local Storage)

## Folder Structure
```text
creditsea-lms/
├── backend/
│   ├── src/
│   │   ├── config/      # Database and environment configurations
│   │   ├── controllers/ # Request handlers for API endpoints
│   │   ├── models/      # Mongoose schemas and types
│   │   ├── routes/      # Express route definitions
│   │   ├── services/    # Business logic (BRE, Loan processing, etc.)
│   │   └── scripts/     # Database seeding scripts
│   └── uploads/         # Local storage for uploaded documents
├── frontend/
│   ├── src/
│   │   ├── app/         # Next.js pages and layouts
│   │   ├── components/  # Reusable UI components and role modules
│   │   ├── context/     # Auth and state management
│   │   └── services/    # API client services (Axios)
```

## Installation & Setup

### 1. Prerequisites
- Node.js (v18+)
- MongoDB (Running locally or via Atlas)

### 2. Clone the Repository
```bash
git clone <repository-url>
cd creditsea-lms
```

### 3. Backend Configuration
```bash
cd backend
npm install
```
Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/creditsea_lms
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:3000
```

### 4. Frontend Configuration
```bash
cd ../frontend
npm install
```
Create a `.env.local` file in the `frontend/` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

### 5. Seed Demo Data
Populate the database with pre-configured users for testing:
```bash
cd ../backend
npm run seed
```

## Run Commands
To start the development environment:

**Backend:**
```bash
cd backend
npm run dev
```

**Frontend:**
```bash
cd frontend
npm run dev
```

## Seed Credentials
| Role | Email | Password |
| :--- | :--- | :--- |
| System Admin | admin@lms.com | Password@123 |
| Sanction Officer | sanction@lms.com | Password@123 |
| Disbursement Officer | disbursement@lms.com | Password@123 |
| Collection Agent | collection@lms.com | Password@123 |
| Borrower | borrower@lms.com | Password@123 |

## Workflow Explanation
1. **Application**: Borrower submits a loan request. The **BRE Service** immediately validates eligibility based on age, salary, and documents.
2. **Sanctioning**: Eligible loans appear in the **Sanction Module**. Officers review and set the status to `SANCTIONED`.
3. **Disbursement**: Sanctioned loans move to the **Disbursement Module** for fund release.
4. **Repayment**: Borrowers can track their **Outstanding Balance** and log payments.
5. **Auto-Closure**: When the balance reaches ₹0, the system automatically transitions the loan to `CLOSED`.

## API Modules Summary
- `Auth`: User registration, role-based login, and session persistence.
- `Loan`: Management of loan applications, status transitions, and BRE validation.
- `Payment`: Handling repayments and real-time balance calculations.
- `Dashboard`: Role-specific data aggregation for management views.

## Future Improvements
- **Payment Gateway**: Integration with Razorpay/Stripe for automated repayments.
- **SMS/Email Alerts**: Notifications for approval status and payment reminders.
- **Enhanced BRE**: Credit score (CIBIL) integration via third-party APIs.
- **Reporting**: Exportable CSV/PDF reports for disbursements and collections.
- **Multi-document support**: Support for more document types (Aadhar, ITR, etc.).
