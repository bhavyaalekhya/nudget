# Nudget Desktop App

A cross-platform desktop application for tracking monthly income and expenses with insightful visual charts — built using **Next.js (App Router)**, **Electron**, **Prisma**, and **SQLite**.

---

## Features

- Add and view categorized expenses and incomes
- Auto-grouped by month
- Pie and Polar charts for insights
- Budget progress bar and totals
- Dynamic payment modes and categories
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
./scripts/dependencies.sh
```

### 3. Environment Setup
Use the shared script to create synchronized `.env` files for both frontend and backend:
```bash
./scripts/environments.sh
```

Else, run the following to generate the `.env` files:
```bash
./scripts/setup.sh
```

### 4. Setup the Database
```bash
./scripts/database.sh
```

### 5. Run in Dev Mode
From the project root directory:
```bash
./scripts/dev.sh
```
This will:
- Start the front end `localhost:3000`.
- Start the backend server `localhost:5050`
- Launch the Electron window with live reload

### 6. Build for Production

#### a. Build the application (frontend + backend)
```bash
./scripts/prod.sh
```

#### b. Package for macOS
```bash
./scripts/package-mac.sh
```

#### c. Package for Windows
```bash
./scripts/package-win.sh
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
