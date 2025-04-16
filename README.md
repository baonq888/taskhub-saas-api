# TaskHub SaaS API

**A scalable multi-tenant SaaS API built with Node.js, PostgreSQL, and Redis.**  
TaskHub is a project management system designed for multi-tenancy with a shared database architecture. It provides task and project management features while ensuring tenant isolation and performance optimization.

## Tech Stack
- **Backend:** Node.js (Express)
- **Database:** PostgreSQL 
- **Cache & Queues:** Redis 
- **Authentication:** JWT & OAuth2
- **Message Broker:** RabbitMQ 
- **Storage:** Supabase Storage

## Features
- Multi-Tenant Architecture (Shared DB, Row-Level Security)  
- Project & Task Management (Projects, Boards, Tasks)  
- Role-Based Access Control (RBAC)  
- Real-Time Updates (WebSockets)  
- Activity Logs & Notifications  
- API Rate Limiting & Caching  
- File Uploads via Supabase Storage  

## Installation & Setup

### Clone the repository
```sh
git clone https://github.com/yourusername/taskhub-saas-api.git
cd taskhub-saas-api
```

### Install dependencies
```sh
npm install
```

### Set up environment variables
Create a `.env` file in the root directory and add the following:
```
PORT=3000
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret

```

### Run migrations
```sh
npx prisma migrate dev
```

### Start the API Server
```sh
npm run dev
```



