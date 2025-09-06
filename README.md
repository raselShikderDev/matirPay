# 💳 MatirPay – Digital Wallet Web App (Bangladesh)

MatirPay is a **digital wallet and payment solution** tailored for the Bangladeshi market. It allows users to **securely transfer money, pay bills, manage transactions**, and supports **merchant payments**. The backend is built with **TypeScript and Express**, following **modular architecture** and best practices for scalability and maintainability.

---

## 📖 Project Overview

MatirPay provides a secure and fast digital wallet experience with the following features:

* 🔐 **Authentication** using JWT and session cookies
* 💸 **Send and receive money** between users
* 🏦 **Merchant support** for payments and account management
* 📊 **Transaction history** with advanced filters
* ⚡ **High performance** with TypeScript + Bun
* ✅ **Input validation** using Zod for robust API requests
* 🛡 **Security-focused design** with middlewares for error handling, authorization, and data validation

---

## ⚙️ Setup Instructions

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/raselShikderDev/matirPay.git](https://github.com/raselShikderDev/matirPay.git)
    cd matirPay
    ```

2.  **Install dependencies**
    * Using Bun (recommended):
    ```bash
    bun install
    ```
    * Or using npm:
    ```bash
    npm install
    ```

3.  **Configure environment variables**
    MatirPay uses a `.env` file for storing sensitive configurations like database credentials, JWT secret, and email settings.

4.  **Run the project**
    * Development mode (with hot reload):
    ```bash
    bun run dev
    ```
    * Build and run production:
    ```bash
    bun run build
    bun run start
    ```

---

## 🌍 Live Demo

Check out the live deployed app on Vercel: [MatirPay](https://matirpay.vercel.app/)

---

## 🛠 Technology Stack

**Backend:**
* TypeScript
* Express.js
* MongoDB with Mongoose
* Zod for request validation
* JWT for authentication
* Redis for caching and session management
* Nodemailer for email notifications

**Frontend (planned):**
* React
* Next.js
* Redux Toolkit Query
* Tailwind CSS
* Shadcn UI components

**Tools & Dev Practices:**
* Bun or npm
* ESLint & Prettier for code quality
* GitHub Actions for CI/CD

---

## 📂 Robust Folder Structure

```pgsql
matirPay/
├── src/
│   ├── server.ts               # Entry point of the server
│   ├── app.ts                  # App bootstrap: middlewares, routes, error handling
│   │
│   ├── config/                 # Configuration files
│   │   ├── db.ts               # MongoDB connection setup
│   │   └── redis.ts            # Redis client setup
│   │
│   ├── modules/                # Feature-based modular architecture
│   │   ├── auth/               # Authentication module
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.routes.ts
│   │   │   ├── auth.service.ts
│   │   │   └── auth.validation.ts
│   │   │
│   │   ├── user/               # User module
│   │   │   ├── user.model.ts
│   │   │   ├── user.controller.ts
│   │   │   ├── user.routes.ts
│   │   │   └── user.service.ts
│   │   │
│   │   ├── transaction/        # Transactions module
│   │   │   ├── transaction.model.ts
│   │   │   ├── transaction.controller.ts
│   │   │   ├── transaction.routes.ts
│   │   │   └── transaction.service.ts
│   │   │
│   │   └── merchant/           # Merchant module
│   │       ├── merchant.model.ts
│   │       ├── merchant.controller.ts
│   │       ├── merchant.routes.ts
│   │       └── merchant.service.ts
│   │
│   ├── middlewares/            # Custom middlewares
│   │   ├── auth.middleware.ts
│   │   ├── error.middleware.ts
│   │   └── validate.middleware.ts
│   │
│   ├── utils/                  # Helper functions
│   │   ├── logger.ts
│   │   ├── response.ts
│   │   └── email.ts
│   │
│   ├── constants/              # Application-wide constants
│   │   └── roles.ts
│   │
│   ├── types/                  # TypeScript type definitions
│   │   └── global.d.ts
│   │
│   └── tests/                  # Unit and integration tests
│       └── auth.test.ts
│
├── public/                     # Static assets like images, icons, etc.
├── dist/                       # Compiled JS output after build
├── package.json
├── tsconfig.json
├── .eslintrc.json
├── .prettierrc
└── README.md


## 📌 API Actions (Endpoints Overview)

### 🔐 Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /auth/sign-in | Login with email & password |
| POST   | /auth/log-out | Logout user and clear session |
| POST   | /auth/refresh-token | Refresh JWT access token |
| PATCH  | /auth/change-password | Update password while logged in |
| PATCH  | /auth/reset-password | Reset password after forgetting it |
| PATCH  | /auth/forget-password | Send password reset email |

---

### 📝 OTP
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | /otp/send | Send verification OTP |
| POST   | /otp/verify | Verify OTP |

---

### 👤 User Management
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST   | /users/create-user | - | Create a new user |
| PATCH  | /users/update-user | All | Update user profile |
| GET    | /users/all-user | Admin | Retrieve all users |
| GET    | /users/all-users | Admin, Super Admin | Get all users |
| GET    | /users/all-agents | Admin, Super Admin | Get all agents |
| GET    | /users/all-approved-agents-count | Admin, Super Admin | Get total approved agent count |
| GET    | /users/agents/:id | Admin, Super Admin | Get single agent by id |
| PATCH  | /users/agent-approve/:id | Admin, Super Admin | Approve agent by id |
| PATCH  | /users/agent-suspend/:id | Admin, Super Admin | Suspend agent by id |
| PATCH  | /users/block/:id | Admin, Super Admin | Block agent or user |
| PATCH  | /users/suspend/:id | Admin, Super Admin | Suspend agent or user |
| PATCH  | /users/activate/:id | Admin, Super Admin | Activate agent or user |
| PATCH  | /users/agent-status/:id | Admin, Super Admin | Toggle agent & user status |
| DELETE | /users/:id | Admin, Super Admin | Delete user by id |
| GET    | /users/me | All | Retrieve current logged-in user info |
| GET    | /users/:userId | Admin, Super Admin | Retrieve single user by ID |

---

### 💰 Wallet / Transactions
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| POST   | /wallet/user-send-money | User | Send money as a user |
| POST   | /wallet/user-cash-out | User | User cash-out (to agent) |
| POST   | /wallet/agent-cash-in | Agent | Agent top-up / cash-in to user |
| GET    | /wallet/my-wallet | All | Get logged-in user’s wallet |
| GET    | /wallet/all | Admin, Super Admin | Get all wallets |
| GET    | /wallet/active-wallets | Admin, Super Admin | Get total active wallets |
| PATCH  | /wallet/status/:id | Admin, Super Admin | Toggle wallet status |
| GET    | /wallet/:id | All | Get wallet by ID |

---

### 📊 Transactions
| Method | Endpoint | Roles | Description |
|--------|----------|-------|-------------|
| GET    | /transactions/ | All | View all transactions of logged-in user |
| GET    | /transactions/transactions-amount | Admin, Super Admin | Get total transaction amount |
| GET    | /transactions/all | Admin, Super Admin | View all transactions |
| GET    | /transactions/:id | Admin, Super Admin | View single user transaction |


---
## 🧪 Testing

Currently no unit tests are implemented. You can add Jest / Supertest to test API endpoints in the future.

---
## 📌 Notes

* ✅ Uses **TypeScript strict mode** for safer development.
* ✅ Enforces **clean code** with ESLint & Prettier.
* ✅ Secure authentication with **JWT + session cookies**.
* ✅ Validates all incoming requests with **Zod**.
* 🚀 Ready to integrate with a **React/Next.js frontend** for full-stack usage.

---
## 📜 License

This project is licensed under the **MIT License**. You are free to use, modify, and distribute with attribution.