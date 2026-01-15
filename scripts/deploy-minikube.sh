#!/bin/bash

echo "🚀 Starting Minikube deployment..."

# Check if minikube is running
if ! minikube status | grep -q "Running"; then
    echo "Starting Minikube..."
    minikube start
fi

# Apply Kubernetes manifests
echo "Applying Kubernetes manifests..."
kubectl apply -f k8s/

# Wait for deployment
echo "Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/library-api

# Get service URL
echo "✅ Deployment complete!"
echo "Service URL:"
minikube service library-api-service --url

# Show pods
echo ""
echo "Running pods:"
kubectl get pods -l app=library-api