# Candidate Management System

A robust full-stack application for managing candidate profiles with user authentication, built following Clean Architecture principles and modern development practices.

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)

## Overview

This application provides a comprehensive solution for managing candidate profiles in a recruitment process. It implements a clean architecture approach, ensuring separation of concerns and maintainability.

### Key Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control
  - Secure password handling with bcrypt

- **Candidate Management**
  - Full CRUD operations
  - Profile information management
  - Education history tracking
  - Work experience records
  - Document management
  - Skills assessment

- **Data Integrity**
  - Automatic transaction handling
  - Data validation
  - Error handling
  - Data retention policies

## Technical Architecture

### Backend Architecture

The backend follows Clean Architecture principles with four main layers:

1. **Domain Layer**
   - Business entities
   - Repository interfaces
   - Domain services
   - Value objects

2. **Application Layer**
   - Use cases
   - DTOs
   - Interface adapters
   - Application services

3. **Infrastructure Layer**
   - Database implementations
   - External services integration
   - Framework-specific code

4. **Presentation Layer**
   - REST API controllers
   - Request/Response handling
   - Route definitions

### Frontend Architecture

The frontend implements a component-based architecture using React with the following structure:

1. **Core Components**
   - Reusable UI components
   - Form components
   - Layout components

2. **Feature Modules**
   - Authentication
   - Candidate management
   - Profile management

3. **State Management**
   - React Context for global state
   - Custom hooks for local state
   - Form state management

## Technology Stack

### Backend
- **Runtime**: Node.js (v18+)
- **Language**: TypeScript
- **Framework**: Express.js
- **ORM**: TypeORM
- **Database**: 
  - PostgreSQL (Production)
  - SQLite (Development/Testing)
- **Testing**: Jest
- **Documentation**: OpenAPI/Swagger
- **Security**: JWT, bcrypt

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **UI Library**: Material-UI
- **HTTP Client**: Axios
- **Routing**: React Router v6
- **Form Handling**: React Hook Form
- **Type Checking**: TypeScript

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (v8 or higher)
- PostgreSQL (v14 or higher)
- Git

### Development Environment Setup

1. **Clone the Repository**
```bash
git clone https://github.com/jsaldaza/AI4Devs-lab-ides-RO-1.git
cd AI4Devs-lab-ides-RO-1
```

2. **Backend Setup**
```bash
# Install dependencies
cd backend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials and JWT secret

# Run database migrations
npm run migration:run

# Start development server
npm run dev
```

3. **Frontend Setup**
```bash
# Install dependencies
cd ../frontend
npm install

# Start development server
npm run dev
```

### Environment Configuration

#### Backend (.env)
```env
# Server Configuration
PORT=3000
NODE_ENV=development

# Database Configuration
DATABASE_URL=postgresql://user:password@localhost:5432/dbname
DATABASE_SSL=false

# Authentication
JWT_SECRET=your_jwt_secret
JWT_EXPIRATION=24h

# CORS Configuration
CORS_ORIGIN=http://localhost:5173
```

## API Documentation

### Authentication Endpoints

```typescript
POST /api/auth/register
{
  "email": string,
  "password": string,
  "name": string
}

POST /api/auth/login
{
  "email": string,
  "password": string
}
```

### Candidate Endpoints

```typescript
GET /api/candidates
Authorization: Bearer {token}
Query Parameters:
  - page: number
  - limit: number
  - search: string
  - isActive: boolean

POST /api/candidates
Authorization: Bearer {token}
{
  "firstName": string,
  "lastName": string,
  "email": string,
  "phone": string,
  "linkedIn": string,
  "portfolio": string,
  "summary": string,
  "skills": string[],
  "education": [{
    "institution": string,
    "degree": string,
    "fieldOfStudy": string,
    "startDate": Date,
    "endDate": Date,
    "isCurrentlyStudying": boolean
  }],
  "workExperience": [{
    "company": string,
    "position": string,
    "startDate": Date,
    "endDate": Date,
    "isCurrentJob": boolean,
    "description": string
  }]
}
```

## Testing

The project includes comprehensive test coverage:

```bash
# Run all tests
npm test

# Run unit tests
npm run test:unit

# Run integration tests
npm run test:integration

# Generate coverage report
npm run test:coverage
```

## Deployment

### Production Build

**Backend:**
```bash
cd backend
npm run build
npm start
```

**Frontend:**
```bash
cd frontend
npm run build
# Output will be in the dist directory
```

### Docker Support

```bash
# Build and run with Docker Compose
docker-compose up --build
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Coding Standards

- Follow TypeScript best practices
- Write unit tests for new features
- Update documentation as needed
- Follow the existing architecture patterns

## License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Clean Architecture principles by Robert C. Martin
- TypeORM documentation and community
- React and Material-UI communities 