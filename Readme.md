# 📦 Inventory Management System - Backend

A complete **Inventory Management System** backend built with **Node.js**, **Express**, and **MySQL**.  
This backend provides **Admin** and **User** functionalities for managing **sales, purchases, stock, and performance tracking**.

---

## 🚀 Features

### 👑 Admin
- **Sign Up**
- **Register a User**
- **Update, Suspend, and Delete Users**
- **Approve/Disapprove Purchase Orders**
- **View All Users**
- **Track Sales Performance**
- **Track Customer Retention**
- **View Purchases, Sales, Refunded Items, and Stock**

### 👤 User
- **Sign In**
- **Create Sales Orders**
- **Create Purchase Orders**
- **View Purchases, Sales, Refunded Items, and Stock**

---

## 📂 Project Structure



---

## 🛠 Installation & Setup

### 1️⃣ Clone Repository
```bash
git clone https://github.com/R17358/inventory-management-system-mysql-database.git
cd inventory-management-system-mysql-database

2️⃣ Install Dependencies

npm install


3️⃣ Create .env File

PORT=4000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=inventory_db
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d

4️⃣ Create MySQL Database

CREATE DATABASE inventory_db;

5️⃣ Run the Server

npm run dev


Server will run at: http://localhost:4000

📌 API Endpoints

Auth
Method	Endpoint	Description
POST	/api/auth/signup	Admin signup
POST	/api/auth/signin	User/Admin login
Admin
Method	Endpoint	Description
POST	/api/admin/register	Register a new user
PUT	/api/admin/user/:id	Update user details
PATCH	/api/admin/user/:id/suspend	Suspend user
DELETE	/api/admin/user/:id	Delete a user
GET	/api/admin/users	Get all users
PATCH	/api/admin/purchase/:id	Approve/Disapprove purchase
Orders
Method	Endpoint	Description
POST	/api/orders/sales	Create sales order
POST	/api/orders/purchase	Create purchase order
Reports & Stock
Method	Endpoint	Description
GET	/api/reports/stock	Get stock info
GET	/api/reports/sales	Get sales report
GET	/api/reports/customers	Customer retention stats


📦 Dependencies

Express - Web framework

MySQL2 - MySQL driver

Sequelize (optional) - ORM

Dotenv - Environment variables

JWT - Authentication

Bcryptjs - Password hashing

Nodemon - Development server

📜 License

This project is licensed under the MIT License.

👨‍💻 Author

Ritesh Pandit

