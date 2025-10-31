

# Rescue Federation API

## Overview

The **Rescue Federation API** is a backend REST API designed for a rescue service management platform. It allows users (both customers and admins) to manage service requests, authenticate users, and perform administrative tasks. This API can be integrated into a mobile or web application where customers can submit service requests and admins can manage them.

## Features

* **User Registration and Login**: Allows users (customers) and admins to register and log in.
* **Request Management**: Users can create, retrieve, and filter requests for medical and emergency services.
* **Admin Management**: Admins can manage requests and update their statuses.
* **JWT Authentication**: Secure access to endpoints using JWT tokens.
* **Database**: Uses MongoDB for persistent storage.
* **Rate Limiting**: Limits the number of requests per user (in production).

## Tech Stack

* **Node.js**: Backend runtime environment.
* **Express.js**: Web framework for building APIs.
* **MongoDB**: NoSQL database to store data.
* **JWT**: JSON Web Tokens for authentication and authorization.
* **Mongoose**: ODM (Object Data Modeling) for MongoDB.
* **Bcrypt**: For password hashing and verification.
* **Moment.js**: For handling date and time operations.

## Installation

### Prerequisites

* [Node.js](https://nodejs.org/) (version 14.x or higher)
* [MongoDB](https://www.mongodb.com/) (MongoDB Atlas or local MongoDB instance)

### Clone the Repository

Clone the repository to your local machine:

```bash
git clone https://github.com/mustafaDevop/Rescue_federation_api.git
cd Rescue_federation_api
```

### Install Dependencies

Run the following command to install required dependencies:

```bash
npm install
```

### Environment Variables

Create a `.env` file in the root directory and add the following configuration:

```dotenv
# Database URL for MongoDB
DB_URL=mongodb+srv://<username>:<password>@your-mongodb-url.com

# Port number the app will listen on
PORT=7227

# Base URL for the application
BASE_URL=http://localhost:7227

# JWT Configuration
JWT_SECRET=your_jwt_secret_key
JWT_ACCESS_EXPIRATION_MINUTES=30240
JWT_REFRESH_EXPIRATION_DAYS=30
JWT_RESET_PASSWORD_EXPIRATION_MINUTES=10
JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=10
```

* Replace `<username>`, `<password>`, and `your-mongodb-url.com` with your actual MongoDB connection details.
* Update `JWT_SECRET` with a secure key for JWT encryption.

### Run the Application

To start the application, use the following command:

```bash
npm start
```

The server will start listening on `http://localhost:7227`.

## API Endpoints

### Authentication

* **POST /v1.0/auth/register/customer**
  Register a new customer.
  **Request Body**:

  ```json
  {
    "fullname": "Customer Name",
    "email": "customer@example.com",
    "password": "customer_password",
    "confirmPassword": "customer_password",
    "phoneNumber": "1234567890"
  }
  ```

  **Response**:

  * `201 Created` on successful registration.

* **POST /v1.0/auth/register/admin**
  Register a new admin.
  **Request Body**:

  ```json
  {
    "fullname": "Admin Name",
    "email": "admin@example.com",
    "password": "admin_password",
    "confirmPassword": "admin_password",
    "phoneNumber": "0987654321"
  }
  ```

  **Response**:

  * `201 Created` on successful registration.

* **POST /v1.0/auth/login/customer**
  Login as a customer.
  **Request Body**:

  ```json
  {
    "email": "customer@example.com",
    "password": "customer_password"
  }
  ```

  **Response**:

  * `200 OK` with the access and refresh tokens.

* **POST /v1.0/auth/login/admin**
  Login as an admin.
  **Request Body**:

  ```json
  {
    "email": "admin@example.com",
    "password": "admin_password"
  }
  ```

  **Response**:

  * `200 OK` with the access and refresh tokens.

* **POST /v1.0/auth/logout**
  Logout the current user.
  **Response**:

  * `200 OK` on successful logout.

* **POST /v1.0/auth/refresh-tokens**
  Refresh the access token using a refresh token.
  **Request Body**:

  ```json
  {
    "refreshToken": "your_refresh_token"
  }
  ```

  **Response**:

  * `200 OK` with a new access token.

### Requests Management

* **POST /v1.0/requests**
  Create a new service request.
  **Request Body**:

  ```json
  {
    "name": "Emergency request",
    "serviceType": "Medical",
    "location": "123 Main St",
    "time": "2025-10-30T14:00:00Z"
  }
  ```

  **Response**:

  * `201 Created` with the created request object.

* **GET /v1.0/requests**
  Get all requests for the authenticated user.
  **Response**:

  * `200 OK` with a list of requests.

* **PATCH /v1.0/requests/:requestId/status**
  Update the status of a specific request.
  **Request Body**:

  ```json
  {
    "status": "accept"
  }
  ```

  **Response**:

  * `200 OK` with the updated request object.

* **GET /v1.0/requests/filter**
  Get filtered requests based on query parameters.
  **Query Parameters**:

  * `status`: The status of the request (e.g., 'pending', 'completed').
  * `serviceType`: The type of service (e.g., 'Medical').
  * `startDate`, `endDate`: Date range for filtering.
  * `sortBy`: Field to sort by (e.g., 'createdAt').
  * `sortOrder`: Sort order ('asc' or 'desc').
    **Response**:
  * `200 OK` with the filtered list of requests.

## Error Handling

Errors are handled using a custom error class `ApiError`. If an error occurs in the API, a JSON response with an appropriate status code and message is returned.

### Example Error Response

```json
{
  "status": "error",
  "message": "Invalid status"
}
```

## Security

* **JWT Authentication**: Protects routes by requiring valid tokens for certain operations.
* **Rate Limiting**: The API uses rate limiting middleware to prevent abuse and protect resources.
* **Data Validation**: Request data is validated to ensure it adheres to expected formats and types.

## Contributing

1. Fork the repository.
2. Create a new branch: `git checkout -b feature/your-feature-name`.
3. Commit your changes: `git commit -am 'Add some feature'`.
4. Push to the branch: `git push origin feature/your-feature-name`.
5. Create a new Pull Request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

This README should provide a comprehensive guide to your API, including registration and login functionality for both customers and admins, along with the request management features.
