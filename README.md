# Library API - DevOps Project

A production-ready REST API for library management, demonstrating modern DevOps practices including CI/CD, containerization, Kubernetes deployment, and comprehensive observability.

## Features

- **REST API:** Complete CRUD operations for book management
- **Observability:** Prometheus metrics + Winston structured logging
- **Security:** SAST (npm audit) + DAST (OWASP ZAP) scanning
- **Containerization:** Docker with multi-stage builds
- **CI/CD:** Automated GitHub Actions pipeline
- **Kubernetes:** Production-ready deployment manifests
- **Testing:** 100% test coverage with Jest

## Table of Contents

- [API Documentation](#api-documentation)
- [Getting Started](#getting-started)
- [Docker Usage](#docker-usage)
- [Kubernetes Deployment](#kubernetes-deployment)
- [CI/CD Pipeline](#cicd-pipeline)
- [Observability](#observability)
- [Security](#security)

## API Documentation

### Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/health` | Health check | - | `{"status": "UP"}` |
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

## Getting Started

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

## Docker Usage

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

## Kubernetes Deployment

### Local Deployment (Minikube)
```bash
# Start minikube
minikube start

# Deploy application
kubectl apply -f k8s/

# Get service URL
minikube service library-api-service --url

# Test
curl $(minikube service library-api-service --url)/health
```

### Verify Deployment
```bash
kubectl get pods -l app=library-api
kubectl get svc library-api-service
kubectl logs -l app=library-api -f
```

## CI/CD Pipeline

### GitHub Actions Workflow

The pipeline runs automatically on:
- Push to `main` branch
- Pull requests to `main`

### Pipeline Stages

1. **Build & Test**
   - Install dependencies
   - Run Jest tests
   - Check test coverage

2. **Security Scan (SAST)**
   - npm audit for vulnerabilities
   - Fail on high/critical issues

3. **Docker Build**
   - Build Docker image
   - Push to Docker Hub
   - Tag as `latest`

4. **Security Scan (DAST)**
   - Deploy container locally
   - Run OWASP ZAP scans
   - Generate security reports

### View Pipeline

Check the [Actions tab](https://github.com/souissi-ons/library-api-devops/actions) for pipeline status.

## Observability

### Metrics

Prometheus metrics exposed at `/metrics`:
```bash
curl http://localhost:3000/metrics
```

**Key Metrics:**
- `http_request_duration_ms` - Request duration histogram
- `process_cpu_seconds_total` - CPU usage
- `process_resident_memory_bytes` - Memory usage
- `nodejs_version_info` - Node.js version

### Logs

Structured JSON logs with Winston:
```json
{
  "level": "info",
  "message": "HTTP Request",
  "method": "GET",
  "url": "/books",
  "status": 200,
  "duration": "15ms"
}
```

View logs:
```bash
# Local
npm start

# Docker
docker logs library-api

# Kubernetes
kubectl logs -l app=library-api -f
```

## Security

### SAST (Static Analysis)

- **Tool:** npm audit
- **Runs:** Every CI/CD execution
- **Threshold:** Fails on high/critical vulnerabilities
```bash
npm audit
```

### DAST (Dynamic Analysis)

- **Tool:** OWASP ZAP
- **Scans:** Baseline + Full scan
- **Runs:** After Docker build in CI/CD

### Security Best Practices

✅ Non-root user in Docker container  
✅ Minimal Alpine base image  
✅ No hardcoded secrets  
✅ Regular dependency updates  
✅ Input validation  
✅ Health check endpoints  

## Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Actions CI/CD                  │
│  Build → Test → Security Scan → Docker → Deploy         │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                     Docker Hub                           │
│              library-api:latest image                    │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                  Kubernetes Cluster                      │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pod 1      │  │   Pod 2      │  │   Pod 3      │  │
│  │ library-api  │  │ library-api  │  │ library-api  │  │
│  └──────────────┘  └──────────────┘  └──────────────┘  │
│              ↑                                           │
│    ┌─────────────────┐                                  │
│    │  LoadBalancer   │                                  │
│    └─────────────────┘                                  │
└─────────────────────────────────────────────────────────┘
                            ↓
                    External Traffic
```

## Testing

### Run Tests
```bash
npm test
```

### Test Coverage
```bash
npm test -- --coverage
```

Current coverage: **100%**

## Acknowledgments

- DevOps Handbook by Gene Kim
- OWASP Security Guidelines
- Kubernetes Documentation
- GitHub Actions Community
