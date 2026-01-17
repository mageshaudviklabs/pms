from typing import List, Dict

# ===== IN-MEMORY DATABASES =====

employees_db: List[Dict] = [
    {
        "employeeId": "EMP001",
        "employeeName": "Aniket Baral",
        "email": "arun.kumar@company.com",
        "department": "Engineering",
        "designation": "Backend Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Develop REST APIs for PMS module",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP002",
        "employeeName": "Magesh",
        "email": "priya.sharma@company.com",
        "department": "Engineering",
        "designation": "Frontend Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Design dashboard UI using React",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP003",
        "employeeName": "Rishi Raj",
        "email": "ravi.teja@company.com",
        "department": "QA",
        "designation": "QA Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Perform unit and integration testing",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP004",
        "employeeName": "S Harsha",
        "email": "sneha.iyer@company.com",
        "department": "Engineering",
        "designation": "Database Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Create database schema and relations",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP005",
        "employeeName": "Tanishka Singh",
        "email": "vikram.singh@company.com",
        "department": "Engineering",
        "designation": "Backend Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Optimize backend performance",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP006",
        "employeeName": "Viraj Ray",
        "email": "anjali.patel@company.com",
        "department": "Product",
        "designation": "Technical Writer",
        "date": "2026-01-14",
        "currentTaskDetails": "Prepare project documentation",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP007",
        "employeeName": "Rahul Mehta",
        "email": "rahul.mehta@company.com",
        "department": "Engineering",
        "designation": "Security Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Implement authentication and authorization",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP008",
        "employeeName": "Kavya Nair",
        "email": "kavya.nair@company.com",
        "department": "Design",
        "designation": "UI/UX Designer",
        "date": "2026-01-14",
        "currentTaskDetails": "Design user experience flows",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP009",
        "employeeName": "Suresh Reddy",
        "email": "suresh.reddy@company.com",
        "department": "Engineering",
        "designation": "DevOps Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Handle deployment and CI/CD pipeline",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP010",
        "employeeName": "Neha Verma",
        "email": "neha.verma@company.com",
        "department": "QA",
        "designation": "SDET",
        "date": "2026-01-14",
        "currentTaskDetails": "Create automated test cases",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP011",
        "employeeName": "Karthik Raj",
        "email": "karthik.raj@company.com",
        "department": "Engineering",
        "designation": "Frontend Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Integrate frontend with backend APIs",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP012",
        "employeeName": "Pooja Malhotra",
        "email": "pooja.malhotra@company.com",
        "department": "Data",
        "designation": "Data Analyst",
        "date": "2026-01-14",
        "currentTaskDetails": "Prepare performance reports",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP013",
        "employeeName": "Amit Choudhary",
        "email": "amit.choudhary@company.com",
        "department": "Engineering",
        "designation": "Full Stack Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Implement task management module",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP014",
        "employeeName": "Divya Srinivasan",
        "email": "divya.srinivasan@company.com",
        "department": "Product",
        "designation": "Product Analyst",
        "date": "2026-01-14",
        "currentTaskDetails": "Design analytics dashboard",
        "noOfActiveProjects": 0
    },
    {
        "employeeId": "EMP015",
        "employeeName": "Manoj K",
        "email": "manoj.k@company.com",
        "department": "Engineering",
        "designation": "Senior Engineer",
        "date": "2026-01-14",
        "currentTaskDetails": "Review code and manage pull requests",
        "noOfActiveProjects": 0
    }
]

# Manager Database
managers_db: List[Dict] = [
    {
        "managerId": "MGR001",
        "managerName": "Rajesh Krishnan",
        "department": "Engineering"
    },
    {
        "managerId": "MGR002",
        "managerName": "Sunita Reddy",
        "department": "Product"
    }
]

# Task Queue
task_queue: List[Dict] = []
task_counter: int = 0

# Notifications Database
notifications_db: List[Dict] = []
notification_counter: int = 0

# Employee Task History
employee_task_history: Dict[str, List[Dict]] = {
    emp["employeeId"]: [] for emp in employees_db
}
