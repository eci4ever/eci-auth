# 🔐 eci-auth

**eci-auth** is a modern authentication system built with [Next.js](https://nextjs.org/), [Prisma](https://www.prisma.io/), and [PostgreSQL](https://www.postgresql.org/). Designed for scalability, security, and developer productivity, this project provides a solid foundation for user management in web applications.

---

## 🚀 Features

- ✅ **User Registration & Login** with secure password hashing
- 🔄 **Session Management** using NextAuth
- 🔒 **Role-based Access Control** (RBAC) ready
- 📦 **Prisma ORM** for type-safe database queries
- 🗄️ **PostgreSQL** as the primary relational database
- 🌐 **API Routes** for authentication endpoints
- 🧪 **Ready for Testing** with built-in API mocks

---

## 🛠️ Tech Stack

| Technology   | Description                              |
|--------------|------------------------------------------|
| Next.js      | React framework for fullstack development |
| Prisma       | ORM for database modeling and querying    |
| PostgreSQL   | Relational database for persistent storage |
| Tailwind CSS | (Optional) Styling framework for UI       |

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/eci4ever/eci-auth.git
cd eci-auth

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Fill in your DATABASE_URL and other secrets

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start the development server
npm run dev

# Or to build the project
"build": "prisma migrate reset --force --skip-seed && prisma generate && prisma migrate deploy && next build",
