# 🔗 Linktin — Backend

> REST API for the professional networking platform that bridges the gap between companies seeking talent and professionals seeking opportunities.

Built with **Node.js + Express** following a **Monolithic 4-Layer Architecture** (routes → controllers → services → models). Includes real-time chat via **Socket.io**, JWT authentication, compatibility matching engine, and database management with **Prisma ORM** over **PostgreSQL**.

---

## 📋 About the Project

Linktin is a professional networking platform that connects companies looking for the right talent with professionals and students looking for their next opportunity. Through a skill-based matching engine, the platform automatically calculates compatibility between what a company needs and what a professional offers, eliminating manual searching and putting the right person in front of the right opportunity.

The backend handles all server-side logic: secure authentication, profile and project management, the matching engine, real-time messaging, and a reputation system between collaborators. All data is persisted in **PostgreSQL** through **Prisma ORM**, and the entire environment runs with a single command via **Docker Compose**.

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| Node.js | Runtime environment |
| Express | HTTP server and routing |
| PostgreSQL | Relational database |
| Prisma ORM | Database modeling and queries |
| Socket.io | Real-time WebSocket communication |
| JWT | Stateless authentication |
| bcrypt | Password hashing |
| Joi | Input validation |
| Docker Compose | Environment containerization |

---

## 👥 Team

| Name | Role |
|------|------|
| Libardo Acosta | Developer |
| Sergio Saucedo | Developer |
| Andrea Sierra | Developer |

---

*Frontend repository → [https://github.com/Libardo19/linktin-fronted*
