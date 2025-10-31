
# **Rescue Federation API Documentation**

## **Overview**

The **Rescue Federation API** is a backend service that powers the Rescue Federation application. It is built with **Node.js**, **Express**, **MongoDB**, and **Redis** for fast data management. This API provides endpoints for user authentication, managing requests, and more.

### **Tech Stack:**

* **Node.js** (Backend Framework)
* **Express.js** (Web framework)
* **MongoDB** (Database)
* **JWT** (Authentication)
* **Redis** (Caching)
* **Mongoose** (MongoDB ODM)
* **Winston** (Logging)
* **Helmet, XSS-Clean, etc.** (Security middleware)

---

## **Table of Contents**

1. [Installation](#installation)
2. [Environment Setup](#environment-setup)
3. [Running the Application](#running-the-application)
4. [API Endpoints](#api-endpoints)

   * [Auth Routes](#auth-routes)
   * [Request Routes](#request-routes)
5. [Error Handling](#error-handling)
6. [Logging](#logging)
7. [Testing](#testing)
8. [Deploying](#deploying)

---

## **Installation**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/mustafaDevop/Rescue_federation_api.git
   cd Rescue_federation_api
   ```

2. **Install dependencies:**

   Make sure you have Node.js installed. Then run:

   ```bash
   npm install
   ```

3. **Set up environment variables:**

   Copy the `.env.example` file to `.env` and modify it based on your configuration:

   ```bash
   cp .env.example .env
   ```

   Update the `.env` file with your MongoDB URL, JWT secret, and other necessary environment variables.

---

## **Environment Setup**

The application uses the following environment variables:

* **DB_URL**: MongoDB connection URL (e.g., MongoDB Atlas)
* **PORT**: The port the server will run on (default: 7227)
* **BASE_URL**: The base URL for your API (default: `http://localhost:7227`)
* **NODE_ENV**: The environment the app is running in (e.g., `production` or `development`)

### Example `.env` File:

```env
DB_URL=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<db>?retryWrites=true&w=majority
PORT=7227
BASE_URL=http://localhost:7227
NODE_ENV=development
JWT_SECRET=your_jwt_secret_key
JWT_ACCESS_EXPIRATION_MINUTES=30240
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
```

---

## **Running the Application**

There are several ways to run the application depending on the environment.

### **Development Mode** (`dev`):

```bash
npm run dev
```

This will run the server with `nodemon`, automatically restarting the server when changes are made.

### **Production Mode** (`prod`):

```bash
npm run prod
```

This will run the server in production mode with `nodemon`.

### **Start the Server in Production**:

To start the server without `nodemon` (recommended for production):

```bash
npm start
```

### **Expose Local Server using Ngrok**:

If you need to expose your local server to the internet for testing or other purposes, you can use **Ngrok**:

```bash
npm run ngrok
```

This will expose your local server to a public URL.

---

## **API Endpoints**

### **Auth Routes**

1. **Register Customer**:
   `POST /v1.0/auth/register/customer`
   **Request Body**:

   ```json
   {
     "email": "user@example.com",
     "password": "user_password",
     "fullname": "Full Name",
     "phoneNumber": "1234567890"
   }
   ```

2. **Register Admin**:
   `POST /v1.0/auth/register/admin`
   **Request Body**:

   ```json
   {
     "email": "admin@example.com",
     "password": "admin_password",
     "fullname": "Admin Name",
     "phoneNumber": "1234567890"
   }
   ```

3. **Login Customer**:
   `POST /v1.0/auth/login/customer`
   **Request Body**:

   ```json
   {
     "email": "user@example.com",
     "password": "user_password"
   }
   ```

4. **Login Admin**:
   `POST /v1.0/auth/login/admin`
   **Request Body**:

   ```json
   {
     "email": "admin@example.com",
     "password": "admin_password"
   }
   ```

5. **Logout**:
   `POST /v1.0/auth/logout`
   **Request Body**:

   ```json
   {
     "refreshToken": "user_refresh_token"
   }
   ```

6. **Refresh Tokens**:
   `POST /v1.0/auth/refresh-tokens`
   **Request Body**:

   ```json
   {
     "refreshToken": "user_refresh_token"
   }
   ```

---

### **Request Routes**

1. **Create a New Request**:
   `POST /v1.0/request`
   **Request Body**:

   ```json
   {
     "name": "Service Name",
     "serviceType": "Plumbing",
     "location": "123 Main St",
     "time": "2023-10-21T10:00:00"
   }
   ```

2. **Get User's Requests**:
   `GET /v1.0/request`
   This endpoint retrieves all requests for the authenticated user.

3. **Filter Requests**:
   `GET /v1.0/request/filter`
   **Query Params**:

   ```json
   {
     "status": "pending",
     "serviceType": "Plumbing",
     "startDate": "2023-01-01",
     "endDate": "2023-12-31"
   }
   ```

4. **Update Request Status**:
   `PATCH /v1.0/request/:requestId/status`
   **Request Body**:

   ```json
   {
     "status": "completed"
   }
   ```

---

## **Error Handling**

The API uses **HTTP Status Codes** to indicate success or failure.

* **Success Responses**: 2xx codes, e.g., `200 OK`, `201 Created`
* **Client Errors**: 4xx codes, e.g., `400 Bad Request`, `401 Unauthorized`, `404 Not Found`
* **Server Errors**: 5xx codes, e.g., `500 Internal Server Error`

When errors occur, a `message` and `error` are returned in the response.

---

## **Logging**

The application uses **Winston** for logging. Logs are available to track application activities and errors. Logs are written to the console and can be configured to persist to a file in the future.

---

## **Testing**

### Unit Testing

We use **Jest** for unit testing in the application. To run the tests:

1. **Install testing dependencies**:

   ```bash
   npm install --save-dev jest supertest
   ```

2. **Run tests**:

   ```bash
   npm test
   ```

---

## **Deploying**

For deploying the API in **production**:

1. **Set up environment variables** on your server.
2. **Run the app in production** with PM2 or another process manager:

   ```bash
   pm2 start ./bin/www --name "rescue_federation_api"
   ```
3. **Set up a reverse proxy** (e.g., Nginx or Apache) to route traffic to the Node.js app.
4. **Set up a MongoDB Atlas database** and configure it in your `.env` file.
5. **Use SSL certificates** (e.g., Let's Encrypt) to secure your API.


## **Conclusion**

This API serves as the backend for the Rescue Federation system. It provides endpoints for user authentication, request creation, and management. The API is built with security and scalability in mind, and it is easily extendable for future features.
