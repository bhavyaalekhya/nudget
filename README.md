# Nudget Desktop App

A cross-platform desktop application for tracking monthly income and expenses with insightful visual charts — built using **Next.js (App Router)**, **Electron**, **Prisma**, and **SQLite**.

---

## Features

- Add and view categorized expenses and incomes
- Auto-grouped by month
- Pie and Polar charts for insights
- Budget progress bar and totals
- Dynamic payment modes and categories
- Dynamic pacing estimate for current month estimate
- Built-in SQLite database (local and private)
- Exported as a desktop app using Electron

---

## Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, static export)
- **Backend**: [Express](https://expressjs.com/) + [Prisma ORM](https://www.prisma.io/)
- **Database**: SQLite (file-based, no setup required)
- **Desktop shell**: [Electron](https://www.electronjs.org/)
- **Charts**: Chart.js + react-chartjs-2

---

## Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/bhavyaalekhya/nudget.git
cd nudget
```

### 2. Install Dependencies
Installs dependencies for `Electron`, `frontend`, and `backend`.
```bash
cd frontend
npm install

cd .. && cd backend
npm install

cd ..
npm install
```

### 3. Environment Setup
Use the shared script to create synchronized `.env` files for both frontend and backend:
```bash
echo "---Building front end and back end environments---"
cd backend
node create-env.js
```

Else, run the following to generate the `.env` files:
```bash
echo "---Building front end and back end environments---"
cp backend/.env.example backend/.env

cp frontend/.env.example frontend/.env
```

### 4. Setup the Database
```bash
echo "----Setting up database----"
cd backend
npx prisma generate
npx prisma db push
```

### 5. Run in Dev Mode
From the project root directory:
```bash
echo "---Setting up Dev mode---"
npm run dev
```
This will:
- Start the front end `localhost:3000`.
- Start the backend server `localhost:5050`
- Launch the Electron window with live reload

### 6. Build for Production
```bash
echo "---Building backend---"
cd backend
npm run dev

echo "---Building frontend---"
cd frontend
npm run build

echo "---Starting electron---"
cd ..
npm run start
```

---
## Folder Structure
```graphql
/
├── frontend/        # Next.js frontend app
│   ├── src/
│   └── out/         # Static export (after build)
│
├── backend/         # Express API + Prisma
│   └── prisma/
│       └── schema.prisma
│
├── main.js      # Electron main process
├── package.json     # Root scripts for dev/start
└── README.md
```

---
