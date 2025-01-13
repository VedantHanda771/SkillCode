# CheatCode

CheatCode is a web-based application designed to replicate and enhance the functionalities of LeetCode. It enables users to solve coding problems, visualize solutions through flow charts, and manage courses. The platform integrates React for the frontend and MongoDB for data management. CheatCode provides features like CRUD operations for questions, courses, users, and more.

---

## Features

### 1. **Questions Management**
- Add, edit, delete, and view coding questions.
- Track solved and unsolved questions.
- Associate questions with courses and companies.

### 2. **Courses Management**
- Manage courses with details like name, price, and description.
- Visualize courses sold.

### 3. **Flow Charts**
- Generate flow charts to visualize solutions for coding problems.

### 4. **User Management**
- Handle both regular and pro users.
- Pro users have additional features like tracking subscription status.

### 5. **CRUD Operations**
- Perform create, read, update, and delete operations across all collections in MongoDB.

---

## MongoDB Collections

### 1. **Questions**
- Fields: `Q_id`, `Q_name`, `Q_explation`, `Q_input`, `Q_output`, `TypeOfQues`, `Sol`, `Company_name`, `Course_id`, `Status`, `SoftDelete`

### 2. **User**
- Fields: `U_id`, `U_name`, `U_email`, `U_dob`, `Status`, `softDelete`

### 3. **TypeOfQues**
- Fields: `T_id`, `T_name`

### 4. **Difficulty**
- Fields: `D_id`, `D_value`

### 5. **Pro_users**
- Fields: `P_id`, `P_name`, `P_email`, `P_dob`, `P_status`, `P_StartDate`, `P_endDate`

### 6. **Company**
- Fields: `Company_id`, `Company_name`

### 7. **Course**
- Fields: `Course_id`, `Course_name`, `Course_price`, `Course_description`, `Status`, `SoftDelete`

---

## Technology Stack

- **Frontend:** React.js
- **Backend:** Express.js
- **Database:** MongoDB
- **Styling:** Bootstrap

---

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd cheatcode
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

4. Set up MongoDB and configure the connection string in `.env` file:
   ```env
   MONGO_URI=<your-mongodb-connection-string>
   ```

5. Start the development server:
   ```bash
   npm start
   ```

6. Access the deployed version at:  
   [Cheat Code](https://cheatcode-us36.onrender.com/)

---

## Usage

1. **Home Page:** Navigate through the home page to explore features.
2. **Questions Page:** Solve coding problems and track your progress.
3. **Courses Page:** View and purchase courses.
   
---

## Future Enhancements

- Add support for user analytics and performance tracking.
- Integrate additional payment options for course purchases.
- Implement advanced search and filtering for questions.

---


