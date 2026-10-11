# TaskPulse — Modern Daily Task Management System

A full-stack, production-grade **Daily Task Management System** built with **React.js** for the frontend, **Java Spring Boot 3** for the backend, and **MySQL 8.0** for relational data persistence.

---

## 🌟 Key Features

### 1. Modern Interactive Dashboard
- **Real-Time Summary Metrics:** Total tasks, Today's tasks, Pending, In Progress, Completed, and Overdue tasks.
- **Dynamic Completion Rate:** Visual animated progress bar reflecting real-time task progress.
- **Priority Distribution:** Visual breakdown of High, Medium, and Low priority activities.
- **Today's Focus Section:** Highlights urgent actions scheduled for the current date.
- **Upcoming Deadlines Widget:** Displays upcoming tasks with human-readable deadlines (e.g. "Tomorrow", "In 3 days").

### 2. Comprehensive Task Management (CRUD)
- **Add Task:** Create tasks with Title, Description, Category, Priority (Low, Medium, High), Due Date, and Status.
- **View Tasks:** Toggle seamlessly between **Clean Table View** and **Card / Grid View**.
- **Edit Task:** Update all task details in a polished modal dialog.
- **Delete Task:** Safe delete workflow with confirmation modal.
- **Instant Status Toggle:** One-click checkmark or dropdown to switch between *Pending*, *In Progress*, and *Completed*.
- **Live Search:** Instant search filter across task titles, descriptions, and categories.
- **Multi-Criteria Filtering:** Filter simultaneously by status, priority, and category (Study, Work, Personal, Other).
- **Flexible Sorting:** Sort by deadline (due date), priority level, date created, or alphabetical title.

### 3. Additional Features
- **Categorization:** Study, Personal, Work, and Other categories with distinct color-coded badges.
- **Overdue & Today Detection:** Automated date calculation tagging overdue tasks in red and today's tasks in amber.
- **Theme Switcher:** Beautiful Light Mode and Dark Mode with persistent local preference.
- **Responsive Layout:** Optimized for Desktop, Tablet, and Mobile devices (collapsible sidebar drawer).
- **Backend Health Indicator:** Visual live connection pill with pulse animation reflecting Spring Boot API connectivity.
- **Auto Data Seeding:** Automatically seeds sample tasks on startup if the database is fresh.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, JavaScript (ES6+), Vite 8, HTML5, Modern CSS3 Variables |
| **Backend** | Java 21, Spring Boot 3.3.4, Spring Data JPA, Spring Web MVC, Hibernate |
| **Validation** | Jakarta Bean Validation (Hibernate Validator) |
| **Database** | MySQL Server 8.0 |
| **Build Tools** | Apache Maven 3.10.0, Node.js (v24), npm (v11) |
| **IDE** | Visual Studio Code |

---

## 📂 Project Structure

```
Daily_Task_Management_system/
├── backend/                               # Spring Boot Application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/dailytask/management/
│   │   │   │   ├── config/                # CorsConfig, DataInitializer
│   │   │   │   ├── controller/            # TaskController (REST Endpoints)
│   │   │   │   ├── dto/                   # TaskRequestDto, TaskResponseDto, etc.
│   │   │   │   ├── entity/                # Task (JPA Entity)
│   │   │   │   ├── exception/             # GlobalExceptionHandler, Custom Exceptions
│   │   │   │   ├── repository/            # TaskRepository (Spring Data JPA)
│   │   │   │   ├── service/               # TaskService & TaskServiceImpl
│   │   │   │   └── DailyTaskApplication.java # Spring Boot Main Entry
│   │   │   └── resources/
│   │   │       ├── application.properties # Spring & MySQL Connection Config
│   │   │       └── schema.sql             # SQL Schema & Seed Definitions
│   │   └── test/
│   │       └── java/com/dailytask/management/
│   │           └── DailyTaskApplicationTests.java # Mockito & JUnit 5 Tests
│   ├── pom.xml                            # Maven Dependencies & Build Configuration
│   └── mvnw.cmd                           # Maven Wrapper
│
├── frontend/                              # React Application
│   ├── src/
│   │   ├── api/
│   │   │   └── taskApi.js                 # REST API Communication Service
│   │   ├── components/
│   │   │   ├── DashboardView.jsx          # Dashboard Metrics & Widgets
│   │   │   ├── DeleteConfirmModal.jsx     # Delete Confirmation Dialog
│   │   │   ├── EmptyState.jsx             # Empty State Illustration
│   │   │   ├── Navbar.jsx                 # Top Navigation Bar with Date & Status
│   │   │   ├── SettingsView.jsx           # Theme, API & Database Settings
│   │   │   ├── Sidebar.jsx                # Collapsible Sidebar Navigation
│   │   │   ├── TaskCard.jsx               # Grid Card View Item
│   │   │   ├── TaskListView.jsx           # Filterable Task List (Table & Card)
│   │   │   ├── TaskModal.jsx              # Add/Edit Task Form Modal
│   │   │   ├── TaskRow.jsx                # Table Row View Item
│   │   │   └── Toast.jsx                  # Notification Toasts
│   │   ├── App.jsx                        # Root React Component & State Management
│   │   ├── index.css                      # Modern CSS Tokens & Responsive Styles
│   │   └── main.jsx                       # React DOM Mount Entry
│   ├── index.html                         # HTML5 Template with Typography
│   ├── package.json                       # npm Scripts & Dependencies
│   └── vite.config.js                     # Vite Configuration with Dev Proxy
│
├── .vscode/                               # Visual Studio Code Run & Debug Config
│   ├── launch.json                        # VS Code F5 Run Configurations
│   └── tasks.json                         # Build & Launch Tasks
│
├── database.sql                           # Standalone MySQL Schema & Seed SQL Script
├── run-backend.bat                        # One-click Windows script to start backend
├── run-frontend.bat                       # One-click Windows script to start frontend
├── start-all.bat                          # One-click Windows script to start both
└── README.md                              # Complete Documentation
```

---

## 🗄️ MySQL Database Setup

### 1. Database & Table Details
- **Database Name:** `daily_task_management`
- **Table Name:** `tasks`

Fields:
| Column | Type | Constraints | Description |
|---|---|---|---|
| `id` | BIGINT | PRIMARY KEY, AUTO_INCREMENT | Unique task identifier |
| `title` | VARCHAR(255) | NOT NULL | Task title |
| `description` | TEXT | NULL | Detailed notes/checklist |
| `category` | VARCHAR(50) | NOT NULL, DEFAULT 'Other' | Category (Study, Work, Personal, Other) |
| `priority` | ENUM('Low', 'Medium', 'High') | NOT NULL, DEFAULT 'Medium' | Task urgency |
| `due_date` | DATE | NULL | Deadline |
| `status` | ENUM('Pending', 'In Progress', 'Completed') | NOT NULL, DEFAULT 'Pending' | Current status |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT CURRENT_TIMESTAMP | Creation time |
| `updated_at` | TIMESTAMP | NOT NULL, ON UPDATE CURRENT_TIMESTAMP | Last modified time |

### 2. Manual SQL Execution (Optional)
Spring Boot and Hibernate are configured to automatically generate the database and table schema (`update` mode) and seed initial data automatically via `DataInitializer.java`.

If you prefer to execute the SQL script manually using MySQL Workbench or the MySQL Command Line Client:
```sql
mysql -u root -p < database.sql
```

### 3. Database Credentials Configuration
In `backend/src/main/resources/application.properties`:
```properties
spring.datasource.url=jdbc:mysql://localhost:3306/daily_task_management?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
```
If your MySQL `root` password is not `root`, either:
- Edit `spring.datasource.password=YOUR_PASSWORD` in `application.properties`, OR
- Set an environment variable:
  ```powershell
  $env:DB_PASSWORD="YOUR_PASSWORD"
  ```

---

## 🚀 How to Run the Application

### Option A: Using One-Click Batch Scripts (Easiest)
1. Double-click `start-all.bat` (or run `./start-all.bat` in PowerShell).
2. It opens two dedicated command windows:
   - Window 1: Spring Boot Backend on `http://localhost:8080`
   - Window 2: React Vite Frontend on `http://localhost:5173`
3. Open your browser to **`http://localhost:5173`**.

---

### Option B: Running Separately in Visual Studio Code

#### 1. Open the Project in VS Code
Open the root directory `f:\Daily_Task_Management_system` in VS Code.

#### 2. Start the Spring Boot Backend
1. Open a new Terminal in VS Code (`Terminal -> New Terminal`).
2. Navigate to the backend directory:
   ```powershell
   cd backend
   ```
3. Run the Spring Boot application:
   ```powershell
   mvn spring-boot:run
   ```
   *(Or using the Maven wrapper: `.\mvnw.cmd spring-boot:run`)*
4. The backend will initialize, connect to MySQL, create the `tasks` table, seed sample tasks, and listen on **`http://localhost:8080`**.

#### 3. Start the React Frontend
1. Open a second Terminal tab in VS Code (`Terminal -> Split Terminal` or `+`).
2. Navigate to the frontend directory:
   ```powershell
   cd frontend
   ```
3. Start the development server:
   ```powershell
   npm run dev
   ```
4. Open your browser and navigate to **`http://localhost:5173`**.

---

## 📡 REST API Documentation

Base URL: `http://localhost:8080/api`

| HTTP Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `GET` | `/api/tasks` | Get all tasks (supports query filters) | None |
| `GET` | `/api/tasks/{id}` | Get single task by ID | None |
| `POST` | `/api/tasks` | Create a new task | Task JSON |
| `PUT` | `/api/tasks/{id}` | Update task details | Task JSON |
| `PATCH` | `/api/tasks/{id}/status` | Update task status | `{"status": "Completed"}` |
| `DELETE` | `/api/tasks/{id}` | Delete task by ID | None |
| `GET` | `/api/tasks/stats` | Get dashboard summary metrics | None |
| `GET` | `/api/tasks/today` | Get tasks due today | None |
| `GET` | `/api/tasks/overdue` | Get overdue tasks | None |
| `GET` | `/api/tasks/upcoming` | Get upcoming tasks | None |
| `POST` | `/api/tasks/seed` | Reset/seed sample tasks | None |

### Sample Request: Create Task (`POST /api/tasks`)
```json
{
  "title": "Complete college assignment",
  "description": "Finish and submit the pending software engineering assignment.",
  "category": "Study",
  "priority": "High",
  "dueDate": "2026-10-12",
  "status": "Pending"
}
```

### Sample Response (`201 Created`):
```json
{
  "success": true,
  "message": "Task created successfully",
  "data": {
    "id": 1,
    "title": "Complete college assignment",
    "description": "Finish and submit the pending software engineering assignment.",
    "category": "Study",
    "priority": "High",
    "dueDate": "2026-10-12",
    "status": "Pending",
    "createdAt": "2026-10-10T14:00:00",
    "updatedAt": "2026-10-10T14:00:00",
    "overdue": false,
    "dueToday": false,
    "daysRemaining": 2
  },
  "timestamp": "2026-10-10T14:00:00.123"
}
```

---

## 🧪 Testing and Verification

### Backend Unit Tests
Execute the automated test suite with Maven:
```powershell
cd backend
mvn test
```
Result:
```
[INFO] Running com.dailytask.management.DailyTaskApplicationTests
[INFO] Tests run: 5, Failures: 0, Errors: 0, Skipped: 0
[INFO] BUILD SUCCESS
```

### Frontend Build Verification
Verify the frontend production bundle:
```powershell
cd frontend
npm run build
```
Result:
```
✓ built in 1.91s
```

---

## 💡 Keyboard Shortcuts
- Press `N` on any screen to immediately trigger the **Create New Task** modal dialog.
- Press `Esc` to instantly close any active modal.
