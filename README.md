# Task Manager Project

## Overview

A simple Task Manager application built with Node.js, Express.js, and MongoDB. It allows users to register, login, and manage their tasks.

### Technologies Used
- Node.js
- Express.js
- MongoDB (Mongoose)
- JWT (Authentication)
- bcrypt (Password Hashing)
- express-validator (Request Validation)

## Setup Instructions

1. Clone this repository.
2. Run `npm install` to install all dependencies.
3. Create a `.env` file in the root folder with the following variables:
4. Run `npm start` or `node server.js` to start the server.

## API Endpoints

### Authentication (Public)
- **POST** `/api/users/register`  
- Body: `{ "username": "string", "email": "string", "password": "string" }`
- Register a new user. Passwords are hashed before storage.
- **POST** `/api/users/login`  
- Body: `{ "email": "string", "password": "string" }`
- Returns a JWT token if the credentials are valid.

### User Management (Private)
- **GET** `/api/users/profile`
- Requires `Authorization: Bearer <token>`
- Retrieves the logged-in user's profile.
- **PUT** `/api/users/profile`
- Requires `Authorization: Bearer <token>`
- Allows logged-in user to update username or email.

### Tasks (Private)
- **POST** `/api/tasks`
- Requires `Authorization: Bearer <token>`
- Body: `{ "title": "string", "description": "string", "status": "string", "dueDate": "date" }`
- Creates a new task for the logged-in user (or for all if admin).
- **GET** `/api/tasks`
- Requires `Authorization: Bearer <token>`
- Fetches all tasks for the logged-in user. If the user is an admin, fetches all tasks.
- **GET** `/api/tasks/:id`
- Requires `Authorization: Bearer <token>`
- Fetches the task by ID. A normal user can only view their own task; admin can view any.
- **PUT** `/api/tasks/:id`
- Requires `Authorization: Bearer <token>`
- Updates the task with the provided ID. A normal user can only update their own task; admin can update any.
- **DELETE** `/api/tasks/:id`
- Requires `Authorization: Bearer <token>`
- Deletes the task with the provided ID. A normal user can only delete their own task; admin can delete any.

## Error Handling
- Global error handling middleware returns errors in JSON format.
- Validation errors return status `400` with a list of error messages.
- Unauthorized access returns status `401`.
- Forbidden actions return status `403`.

## Deployment
- This application was deployed on a Render service. Here is the link:
    https://taskmanager-ep76.onrender.com
- You can also run it locally by downloading the entire project.

## License
This project is open source. Feel free to modify and use as needed.
