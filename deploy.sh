set -e

echo "🚀 Début du déploiement sur Minikube..."

kubectl apply -f k8s/

kubectl rollout restart deployment/library-api

echo "⏳ Attente de la mise à jour des pods..."
kubectl rollout status deployment/library-api

echo "✅ Déploiement terminé avec succès !"
echo "🌍 URL du service :"
minikube service library-api-service --url