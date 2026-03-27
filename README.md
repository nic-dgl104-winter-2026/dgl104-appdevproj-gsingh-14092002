# DGL 104 - Task Management System (TMS)

## Introduction
The Task Management System (TMS) is a full-stack web application that allows users to create, assign, track, and manage tasks efficiently. The system includes user authentication, role-based access, a Kanban board, a live dashboard with a pie chart, and real-time notifications. This project was built as part of the DGL 104 Application Development course at North Island College.

**Live Demo:** https://task-management-system-mhpx.onrender.com

## Tech Stack
- **Frontend:** HTML, CSS, Vanilla JavaScript
- **Backend:** Node.js, Express.js
- **Database:** SQLite (better-sqlite3)
- **Authentication:** JSON Web Tokens (JWT) + bcryptjs
- **CI/CD:** GitHub Actions
- **Deployment:** Render.com

## Unique Features
- User registration and login with encrypted passwords
- Role-based access control (Admin, Manager, Developer, Tester)
- Create, edit, delete and view tasks with priority levels and due dates
- Assign tasks to any registered user
- Kanban board with three columns — To Do, In Progress, Completed
- Live pie chart on the dashboard showing task progress
- Sort tasks by priority, due date, or status
- Real-time server-side notifications when tasks are updated
- Fully deployed and accessible online

## Design Patterns
This project implements four software design patterns:

### 1. Singleton Pattern
Located in `backend/db/database.js`. Ensures only one database connection is created and shared across the entire application. No matter how many requests come in, the same single connection is reused.

### 2. Factory Pattern
Located in `backend/patterns/factory.js`. Dynamically creates user objects with different permissions based on their role. Admin gets full access, Manager can assign tasks, Developer and Tester get basic access.

### 3. Observer Pattern
Located in `backend/patterns/observer.js`. Works like a subscription system. Whenever a task is created, updated, or deleted, all subscribers are automatically notified. The server logs every task change in real time.

### 4. Strategy Pattern
Located in `backend/patterns/strategy.js`. Allows tasks to be sorted using different algorithms — by priority, by due date, or by status — without changing the core code. The strategy can be swapped at any time.

## Installation Guidelines
The application is fully deployed and accessible online. No installation required.

**Live Demo:** https://task-management-system-mhpx.onrender.com

**To use the app:**
1. Open the link above in any browser
2. Click Register to create a new account
3. Choose your role (Admin, Manager, Developer, Tester)
4. Login and start managing your tasks

**Note:** The app is hosted on Render.com free tier. 
If the app takes 30-50 seconds to load for the first time, 
that is normal — the server wakes up after being inactive.

---

**For developers who want to run it locally:**
1. Clone the repo and run `npm install`
2. Create a `.env` file with `PORT=3000` and `JWT_SECRET=supersecretkey123`
3. Run `npm run dev` and open `http://localhost:3000`

## Summary of the Project
The Task Management System was built to demonstrate real-world software development practices including design patterns, REST API development, user authentication, database management, and CI/CD pipelines. The application follows a clean MVC-inspired architecture where the frontend communicates with the backend through a REST API. The backend handles all business logic and database operations while the frontend provides a simple and intuitive user interface. The project was developed incrementally starting from the database layer, then the backend routes, and finally the frontend interface.

## Contributions
- **Gagandeep Singh** — Full project development including backend API, database design, frontend interface, design pattern implementation, CI/CD pipeline setup, and deployment.

Code contributions were made through pull requests following open source best practices. All changes are tracked through Git commit history.

## References
- Node.js Documentation — https://nodejs.org/docs
- Express.js Documentation — https://expressjs.com
- better-sqlite3 Documentation — https://github.com/WiseLibs/better-sqlite3
- JWT Documentation — https://jwt.io
- bcryptjs — https://www.npmjs.com/package/bcryptjs
- Chart.js — https://www.chartjs.org
- Render Deployment — https://render.com
- Design Patterns Reference — https://refactoring.guru/design-patterns
