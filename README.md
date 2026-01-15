# Library API - DevOps Project

A production-ready REST API for library management, demonstrating modern DevOps practices including CI/CD, containerization, Kubernetes deployment, and comprehensive observability.

## 📋 Table of Contents

- [Features](#features)
- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Docker Usage](#docker-usage)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Observability](#observability)
- [Security](#security)
- [Architecture](#architecture)
- [Testing](#testing)

## ✨ Features

- **REST API:** Complete CRUD operations for book management
- **Observability:** Prometheus metrics + Winston structured logging
- **Security:** SAST (npm audit) + DAST (OWASP ZAP) scanning
- **Containerization:** Docker with optimized builds
- **CI/CD:** Automated GitHub Actions pipeline
- **Kubernetes:** Production-ready deployment manifests
- **Testing:** 100% test coverage with Jest

## 📖 API Documentation

### Base URL
```
http://localhost:3000
```

### Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/health` | Health check | - | `{"status": "UP"}` |
| GET | `/` | Root endpoint | - | `{"message": "Library API is running"}` |
| GET | `/books` | Get all books | - | Array of books |
| GET | `/books/:id` | Get specific book | - | Book object or 404 |
| POST | `/books` | Create new book | `{"title": "...", "author": "..."}` | Created book (201) |
| GET | `/metrics` | Prometheus metrics | - | Metrics in Prometheus format |

### Example Requests

```bash
# Health check
curl http://localhost:3000/health

# Get all books
curl http://localhost:3000/books

# Get specific book
curl http://localhost:3000/books/1

# Create new book
curl -X POST http://localhost:3000/books \
  -H "Content-Type: application/json" \
  -d '{"title": "The Phoenix Project", "author": "Gene Kim"}'

# Get metrics
curl http://localhost:3000/metrics
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Docker (optional)
- kubectl + minikube (for Kubernetes)

### Local Development

1. **Clone repository**
```bash
git clone https://github.com/souissi-ons/library-api-devops.git
cd library-api-devops
```

2. **Install dependencies**
```bash
npm install
```

3. **Run application**
```bash
npm start
```

4. **Run tests**
```bash
npm test
```

Application will be available at `http://localhost:3000`

## 🐳 Docker Usage

### Build Image
```bash
docker build -t library-api:latest .
```

### Run Container
```bash
# Run with port mapping
docker run -p 3000:3000 library-api:latest

# Run with docker-compose
docker-compose up -d
```

### Stop Container
```bash
docker-compose down
```

### Published Image
```bash
docker pull onssouissi/library-api:latest
```

## ☸️ Kubernetes Deployment

### Local Deployment (Minikube)

```bash
# Start minikube
minikube start

# Deploy application
kubectl apply -f k8s/deployment.yaml
kubectl apply -f k8s/service.yaml

# Get service URL
minikube service library-api-service --url

# Test
curl $(minikube service library-api-service --url)/health
```

### Using Deployment Script

```bash
chmod +x scripts/deploy-minikube.sh
./scripts/deploy-minikube.sh
```

### Verify Deployment

```bash
# Check pods
kubectl get pods -l app=library-api

# Check service
kubectl get svc library-api-service

# View logs
kubectl logs -l app=library-api -f
```

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The pipeline runs automatically on:
- Push to `main` branch
- Pull requests to `main`

### Pipeline Stages

1. **Build & Test**
   - Install dependencies with `npm ci`
   - Run Jest tests with coverage
   - Verify 100% test coverage

2. **Security Scan (SAST)**
   - Run `npm audit` for vulnerabilities
   - Generate audit report
   - Fail on high/critical issues

3. **Docker Build**
   - Build optimized Docker image
   - Push to Docker Hub
   - Tag as `latest`

4. **Security Scan (DAST)**
   - Deploy container locally
   - Run OWASP ZAP Baseline Scan
   - Run OWASP ZAP Full Scan
   - Generate security reports

5. **Deploy Test**
   - Create KinD (Kubernetes in Docker) cluster
   - Deploy to test environment
   - Verify deployment health

### View Pipeline

Check the [Actions tab](https://github.com/souissi-ons/library-api-devops/actions) for pipeline status.

## 📊 Observability

### Metrics

Prometheus metrics exposed at `/metrics`:

```bash
curl http://localhost:3000/metrics
```

**Available Metrics:**
- `http_request_duration_ms` - HTTP request duration histogram
  - Labels: `method`, `route`, `code`
  - Buckets: 50, 100, 200, 300, 400, 500, 1000ms
- `process_cpu_seconds_total` - CPU usage
- `process_resident_memory_bytes` - Memory usage
- `nodejs_version_info` - Node.js version
- `nodejs_heap_size_total_bytes` - Heap size

### Logs

Structured JSON logs with Winston:

```json
{
  "level": "info",
  "message": "HTTP Request",
  "method": "GET",
  "url": "/books",
  "status": 200,
  "duration": "15ms",
  "timestamp": "2026-01-15T10:30:45.123Z"
}
```

**Log Levels:**
- `info` - General operations
- `warn` - Warning conditions
- `error` - Error conditions

**View Logs:**

```bash
# Local
npm start

# Docker
docker logs library-api

# Kubernetes
kubectl logs -l app=library-api -f
```
## 🔒 Security

### SAST (Static Application Security Testing)

- **Tool:** npm audit
- **Runs:** Every CI/CD execution
- **Threshold:** Fails on high/critical vulnerabilities

```bash
# Run locally
npm audit

# Generate report
npm audit --json > audit-report.json
```

### DAST (Dynamic Application Security Testing)

- **Tool:** OWASP ZAP
- **Scans:** 
  - Baseline Scan: Quick passive scan
  - Full Scan: Comprehensive active scan
- **Runs:** After Docker build in CI/CD

**Security Reports:**
- Available as GitHub Actions artifacts
- Check the Actions tab after pipeline completion

### Security Best Practices Implemented

✅ Non-root user in Docker container  
✅ Minimal Alpine base image (node:18-alpine)  
✅ No hardcoded secrets  
✅ Production-only dependencies in container  
✅ Input validation on API endpoints  
✅ Health check endpoints  
✅ Resource limits in Kubernetes  

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────┐
│              GitHub Actions CI/CD Pipeline               │
│  Build → Test → Security (SAST) → Docker → DAST         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     Docker Hub                           │
│            onssouissi/library-api:latest                 │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│              Kubernetes Cluster (Minikube)               │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pod 1      │  │   Pod 2      │  │   Pod 3      │  │
│  │ library-api  │  │ library-api  │  │ library-api  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│              ↑                                           │
│    ┌─────────────────┐                                  │
│    │  NodePort :30080│                                  │
│    └─────────────────┘                                  │
└─────────────────────────────────────────────────────────┘
                            ↑
                    External Traffic
```

## 🧪 Testing

### Run Tests

```bash
# Run all tests
npm test

# Run with coverage
npm test -- --coverage

# Watch mode
npm test -- --watch
```

### Test Coverage

Current coverage: **100%**


## 📁 Project Structure

```
library-api-devops/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI/CD pipeline
├── k8s/
│   ├── deployment.yaml         # Kubernetes deployment
│   └── service.yaml            # Kubernetes service
├── scripts/
│   └── deploy-minikube.sh      # Deployment script
├── .dockerignore
├── .gitignore
├── docker-compose.yml
├── Dockerfile
├── package.json
├── plugins.js                  # Observability plugins
├── server.js                   # Main application
├── server.test.js              # Test suite
└── README.md
```
