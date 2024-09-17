
# Player Account Management Server

This Node.js application allows users to log in, update their passwords, and download their player save files. Built with Express, MySQL, JWT-based authentication, and includes rate-limiting for security.

## Features

- **User Authentication**: Players can log in using their credentials, which are verified against a MySQL database.
- **Password Update**: Players can update their account passwords.
- **Player Save Download**: Players can securely download their player save files.
- **JWT Authentication**: All routes are protected using JWT tokens.
- **Rate Limiting**: Prevents abuse by limiting API requests per IP.

## Prerequisites

- **Node.js**: v12.x or newer
- **MySQL**: A running instance of MySQL.
- **npm**: Node package manager (comes with Node.js)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/downthecrop/09-webui.git
cd 09-webui
```

### 2. Install Dependencies

Run the following command to install the required Node.js dependencies:

```bash
npm install
```

### 3. Configure the MySQL Database

The 2009Scape server doesn't run an SQL Server and had authentication disabled by default so you'll need to set that up in `Server\worldprops\default.conf` and import the table `Server\db_exports\global.sql` into MySQL.

### 4. Update Server Configuration

In the `server.js` file, update the following values:

- **`JWT_SECRET`**: Replace `'your_jwt_secret_key'` with a secure, random string.
- **`PLAYER_SAVE_PATH`**: Update this with the correct path where player save files are stored on your server.
- **MySQL Database Configuration**:
  - `host`, `port`, `user`, `password`, and `database` should match your local MySQL setup.

### 5. Start the Server

Once the configuration is updated, you can start the server by running:

```bash
node server.js
```

The server will run on `http://localhost:3000`.

## API Endpoints

### 1. **Login**

**POST** `/api/login`

- **Description**: Authenticates the user and returns a JWT token.
- **Request Body**:
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```
- **Response**:
  ```json
  {
    "token": "your_jwt_token",
    "message": "Login successful."
  }
  ```

### 2. **Download Player Save**

**GET** `/api/download-save`

- **Description**: Allows the authenticated user to download their player save file.
- **Headers**: Requires a valid JWT token in the `Authorization` header.
- **Response**: The player's save file will be downloaded in JSON format.

### 3. **Update Password**

**PUT** `/api/update-password`

- **Description**: Allows the authenticated user to update their password.
- **Request Body**:
  ```json
  {
    "username": "your_username",
    "newPassword": "your_new_password"
  }
  ```
- **Response**:
  ```json
  {
    "message": "Password updated successfully."
  }
  ```

## Security Features

- **JWT Authentication**: Every API request (except login) requires a valid JWT token, which is verified server-side.
- **Rate Limiting**: Limits the number of requests from an IP address to prevent abuse. The current configuration allows 100 requests per 15 minutes per IP.
- **Password Hashing**: User passwords are hashed using `bcrypt` before being stored in the database.

