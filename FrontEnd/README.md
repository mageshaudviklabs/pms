# Performance Management System (PMS)

A comprehensive Performance Management System built with React for the frontend and FastAPI for the backend.

## Features

- Employee management
- Performance appraisals
- Goal tracking
- Feedback system
- User authentication
- Dashboard views for managers and employees

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Python (v3.8 or higher)
- pip

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd pms
   ```

2. Install frontend dependencies:
   ```bash
   npm install
   ```

3. Install backend dependencies:
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

### Running the Application

1. Start the backend server:
   ```bash
   cd Backend
   python -m uvicorn app.main:app --reload
   ```

2. Start the frontend development server:
   ```bash
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173`

## Project Structure

```
pms/
├── Frontend/
│   ├── public/
│   └── src/
│       ├── api/
│       ├── assets/
│       ├── components/
│       ├── hooks/
│       ├── pages/
│       ├── services/
│       ├── styles/
│       ├── utils/
│       ├── types.js
│       ├── App.jsx
│       └── main.jsx
├── Backend/
│   └── app/
│       ├── core/
│       ├── models/
│       ├── repositories/
│       ├── routers/
│       ├── schemas/
│       ├── services/
│       └── utils/
├── .eslintrc.json
├── .prettierrc
├── .gitignore
├── package.json
└── README.md
```

## Technologies Used

- **Frontend:** React, Vite, Tailwind CSS, Axios
- **Backend:** FastAPI, SQLAlchemy, PostgreSQL
- **Testing:** Vitest, React Testing Library
- **Linting:** ESLint, Prettier

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License.
