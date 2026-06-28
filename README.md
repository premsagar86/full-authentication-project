# 🔐 Full Stack Authentication System

A production-inspired authentication system built with **React, Node.js, Express, MySQL, Redis, Docker, and JWT**.

This project demonstrates a secure authentication workflow including email verification, password reset, JWT authentication, refresh token rotation, Redis caching, Dockerized services, and protected routes.

---

## 🚀 Features

### Authentication

* User Registration
* User Login
* User Logout
* Protected Routes
* User Profile
* Persistent Authentication

### Email Verification

* Email OTP Verification
* OTP Expiration
* OTP Resend
* Welcome Email after successful verification

### Password Management

* Forgot Password
* Reset Password
* Secure Password Hashing using bcrypt

### Security

* JWT Authentication
* Access Token
* Refresh Token
* Refresh Token Rotation
* Silent Authentication
* HttpOnly Cookies
* Authentication Middleware
* Password Hashing
* Input Validation
* Rate Limiting
* Redis OTP Storage

### Backend

* REST API Architecture
* Express.js
* MySQL Database
* Redis Integration
* Nodemailer
* Docker Support

### Frontend

* React
* React Router
* Context API Authentication
* Axios Instance
* Toast Notifications
* Responsive UI
* Modern Authentication Pages

---

# 🛠 Tech Stack

## Frontend

* React
* React Router DOM
* Axios
* Tailwind CSS
* React Hook Form
* Zod
* React Toastify
* Vite

## Backend

* Node.js
* Express.js
* JWT
* bcrypt
* crypto
* Nodemailer

## Database

* MySQL

## Cache

* Redis

## DevOps

* Docker
* Docker Compose

---

# 📂 Project Structure

```
project-1
│
├── client
│   ├── src
│   ├── components
│   ├── pages
│   ├── utils
│   └── Backgrounds
│
├── server
│   ├── config
│   ├── controller
│   ├── middleware
│   ├── models
│   ├── routes
│   └── server.js
│
└── docker-compose.yml
```

---

# 🔐 Authentication Flow

1. User creates an account.
2. OTP is sent to the registered email.
3. OTP is stored securely in Redis with expiration.
4. User verifies OTP.
5. Welcome email is sent.
6. User logs in.
7. Server generates:

   * Access Token
   * Refresh Token
8. Access Token expires.
9. Refresh Token silently generates a new Access Token.
10. User remains logged in without interruption.

---

# 📦 Installation

Clone the repository

```bash
git clone https://github.com/premsagar86/full-authentication-project.git
```

Move into the project

```bash
cd full-authentication-project
```

---

## Backend

```bash
cd server
npm install
```

Create a `.env` file and configure:

```env
PORT=
DB_HOST=
DB_USER=
DB_PASSWORD=
DB_NAME=

JWT_SECRET=
JWT_REFRESH_SECRET=

EMAIL=
EMAIL_PASSWORD=

REDIS_URL=
```

Run

```bash
npm run dev
```

---

## Frontend

```bash
cd client
npm install
npm run dev
```

---

## Docker

```bash
docker compose up --build
```

---

# 📡 API Endpoints

## Authentication

```
POST   /signup
POST   /signin
POST   /logout
POST   /verify
POST   /forgot-password
POST   /reset-password
GET    /profile
GET    /refresh-token
```

---

# 🔒 Security Features

* Password Hashing (bcrypt)
* JWT Authentication
* Refresh Token Rotation
* Secure Cookies
* Email Verification
* OTP Expiration
* Redis Caching
* Rate Limiting
* Authentication Middleware
* Protected Routes

---

# 📸 Screenshots

Add screenshots here.

Example:

```
screenshots/
    login.png
    signup.png
    home.png
    profile.png
```

---

# 🚀 Future Improvements

* Google OAuth Login
* GitHub OAuth
* Two-Factor Authentication (2FA)
* Session Management
* Refresh Token Blacklisting
* Login History
* Admin Dashboard
* User Roles & Permissions
* Account Lockout after Multiple Failed Attempts
* Audit Logs

---

# 👨‍💻 Author

**Prem Sagar**

GitHub:
https://github.com/premsagar86

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates further development.
