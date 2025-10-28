# WE Education - Backend API

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local atau Atlas)
- Gmail account dengan App Password

### Installation

1. Clone repository
```bash
git clone <repo-url>
cd backend-we
```

2. Install dependencies
```bash
npm install
```

3. Setup environment variables
```bash
cp .env.example .env
# Edit .env dengan credentials kamu
```

4. Start server
```bash
npm start
```

Server berjalan di: `http://localhost:5000`
API Docs: `http://localhost:5000/api-docs`

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Daftar user baru
- `POST /api/auth/login` - Login
- `POST /api/auth/activation` - Aktivasi akun
- `POST /api/auth/refresh-token` - Refresh access token
- `POST /api/auth/logout` - Logout
- `POST /api/auth/forgot-password` - Request reset password
- `POST /api/auth/reset-password` - Reset password

#### Member
- `GET /api/member/dashboard` - Member dashboard (protected)

#### Teacher
- `GET /api/teacher/dashboard` - Teacher dashboard (protected)

#### Admin
- `GET /api/admin/users` - Get all users
- `DELETE /api/admin/users/:id` - Delete user
- `PATCH /api/admin/users/:id/role` - Update user role

### Testing dengan Postman

1. Import Postman collection
2. Setup environment variable `baseUrl = http://localhost:5000`
3. Test endpoints sesuai urutan

### Project Structure