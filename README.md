# Shopmart - Premium E-Commerce Platform

## Overview
Shopmart is a modern, decoupled headless e-commerce application designed to provide a premium user experience and a robust, scalable backend. It caters to both customers looking for quality products and sellers aiming to reach a wider audience. The platform features an aesthetically pleasing UI crafted with Tailwind CSS and Framer Motion, combined with a secure and fast Node.js/Express backend.

## Architecture

Shopmart follows a microservice-inspired modular monolith architecture for the backend and a decoupled Single Page Application (SPA) for the frontend.

### Frontend (Client)
- **Framework:** React 18 with Vite for lightning-fast build and HMR.
- **State Management:** Redux Toolkit (for global UI states like Cart) & React Query (for server state and data fetching).
- **Styling:** Tailwind CSS with a custom premium color palette (`primary` blue shades).
- **Animation & Icons:** Framer Motion for micro-animations and Lucide React for consistent iconography.
- **Routing:** React Router v7.

### Backend (Server)
- **Runtime & Framework:** Node.js with Express.js.
- **Database:** MongoDB via Mongoose for flexible schema management.
- **Authentication:** JWT (JSON Web Tokens) with short-lived access tokens and refresh tokens. Role-Based Access Control (RBAC) separates `customer` and `seller` permissions.
- **Validation:** Zod for strong schema validation on incoming requests.
- **Payments Integration:** Endpoints prepared for Razorpay and Stripe gateways.

### DevOps & CI/CD
- **Containerization:** Docker & Docker Compose for seamless local development and deployment parity.
- **CI/CD:** GitHub Actions pipeline for continuous integration (testing builds) and continuous deployment (Docker image builds).

## Project Structure

```text
shopsmart/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── features/       # Redux slices (auth, cart)
│   │   ├── pages/          # Route components (Home, Login, Register)
│   │   ├── services/       # API integration (Axios instance)
│   │   ├── store/          # Redux store configuration
│   │   ├── index.css       # Tailwind entry and custom utility classes
│   │   └── index.jsx       # Application entry point
│   ├── tailwind.config.js
│   └── vite.config.js
├── server/                 # Node.js Backend
│   ├── src/
│   │   ├── config/         # Database and environment configurations
│   │   ├── middleware/     # Auth (protect, authorize) and Error handling
│   │   ├── modules/        # Domain-driven feature modules (auth, order, payment, product, user)
│   │   ├── utils/          # Helpers (asyncHandler, JWT utilities)
│   │   └── server.js       # Express server initialization
│   └── Dockerfile
├── .github/workflows/      # CI/CD Pipeline Configs
├── docker-compose.yml      # Local development cluster
└── start.sh                # Helper script to boot entire stack
```

## Getting Started

### Prerequisites
- Node.js 20+ or 22+ (LTS recommended)
- Docker Desktop
- MongoDB (if running backend locally without Docker)

### Option 1: Using Docker (Recommended)
1. Ensure Docker daemon is running.
2. Run the start script from the root directory:
   ```bash
   ./start.sh
   ```
3. The frontend will be available at `http://localhost:3000` and backend at `http://localhost:5000`.

### Option 2: Local Development
1. **Backend:**
   ```bash
   cd server
   npm install
   # Create a .env file based on configurations
   npm run dev
   ```
2. **Frontend:**
   ```bash
   cd client
   npm install
   npm run dev
   ```

## Key Features
- **Multi-Vendor Capabilities:** Roles for both standard consumers and verified sellers.
- **Advanced Product Search:** Text-indexed search across product names, descriptions, and tags.
- **Inventory Management:** Low stock thresholds and inventory tracking.
- **Secure Authentication:** Robust JWT integration handling access and refresh token lifecycle.
- **Responsive Premium Design:** Mobile-first, glassmorphic UI elements prioritizing aesthetics.
