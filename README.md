# TaskManager
My first extensive project that affects both the backend and the database

## Description
An application for managing tasks with user registration and authentication.

## Installation
1. Clone the repository
2. Install the dependencies: `npm install`
3. Create a '.env` file with the variables:
4. Start the server: `npm start`

## API Documentation

### Registration
POST /api/register
- Data: { "username", "email", "password" }

### Entrance
POST /api/login
- Data: { "email", "password" }

### Get tasks
GET /api/tasks
- Requires authorization

### Create a task
POST /api/tasks
- Data: { "title", "description", "DueDate" }

### Update task
PUT /api/tasks/:id
- Data: { "title", "description", "status"}

### Delete an issue
DELETE /api/tasks/:id
