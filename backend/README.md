# CreditSea LMS - Backend

This is the backend API for the CreditSea Loan Management System, built with Node.js, Express, TypeScript, and MongoDB.

## Getting Started

1. **Install Dependencies**:
   ```bash
   npm install
   ```

2. **Environment Variables**:
   Create a `.env` file:
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/creditsea_lms
   JWT_SECRET=your_secret_key
   JWT_EXPIRES_IN=7d
   CLIENT_URL=http://localhost:3000
   ```

3. **Seed Database**:
   ```bash
   npm run seed
   ```

4. **Run Development Server**:
   ```bash
   npm run dev
   ```

For full project documentation, including role-based access details and workflow, please refer to the [Main Project README](../README.md).
