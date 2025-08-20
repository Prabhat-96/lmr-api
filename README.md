# Library-Management-REST-API
 Node.js REST API for a multi-user book management system featuring user authentication (JWT &amp; bcrypt), role-based access control (superadmin, subadmin, user), full CRUD with pagination and search, and  authorization for secure operations.

Features
1. User authentication (Signup/Login) with JWT and hashed passwords (bcrypt)

2. Role-based access (superadmin, subadmin, user)

3. CRUD operations for books (Create, Read, Update, Delete)

4. Search books by title or author, with pagination

5. Authorization: Admins can delete/update any book; users can delete/update only their own

6. Environment variable management using dotenv

Getting Started
1. Clone the Repository

git clone https://github.com/Prabhat-96/lmr-api.git
cd lmr-api

npm install

3. Set up Environment Variables
Create a .env file in the root directory and add the following:


PORT = 
MONGO_URI = 

JWT_SECRET = 
JWT_EXPIRES_IN = 

npm start
The server will run on the port specified in your .env


API Documentation - 

Authentication:

POST /api/v1/auth/signup — Signup a new user (with role)

POST /api/v1/auth/signin — Login and obtain JWT token

User Management (superadmin only)
GET /api/v1/management/user/getuser — Get users (pagination supported)

GET /api/users?id=... — Get a single user by ID

DELETE /api/v1/management/user/deleteuser/:id — Delete user by ID

User - APIs
(User)

POST /api/v1/user/userandbook/addbook — Add a book

GET /api/v1/management/book/getallbooks — Get all books (pagination supported)

GET /api/v1/management/book/getbooks   -  Get User Books only  (pagination supported)

PUT /api/v1/user/userandbook/updatebook/:id — Update book information

DELETE /api/v1/user/userandbook/deletebook/:id — Delete a book (User Own Book Only)

Management - APIs (Admin, Sub-Admin)

GET /api/v1/management/book/addbook — Add a book

GET /api/v1/management/book/getbook - Get all books

PUT /api/v1/management/book/updatebook/:id  -  Update book

DELETE /api/v1/management/book/deletebook/:id   -  Admin can delete any book

GET /api/v1/management/book/searchbook?search=author/title - Search book (by Author/Title)


User Profile:
GET /api/v1/management/user/getuser/ — Get all user

DELETE /api/v1/management/user/deleteuser/:id —   Admin can delete any user 

Testing
Make API requests using Postman.
Include the JWT token in the Authorization header as:

JSON
Authorization: Bearer <your_token_here>