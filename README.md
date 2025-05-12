# SIT323- Cloud Native Application Development

## sit323-2025-prac9p - Adding a Database

## Steps for completing this task:

### 1. Enable Kubernetes in Docker Desktop

### 2. Create these files:
    I. mongo-deployment.yaml
    II. mongo-service.yaml
    III. mongo-pv.yaml
    IV. mongo-pvc.yaml

### 3. Apply these files:
``` kubectl apply -f <yaml file> ```

### 4. Create a MongoDB user:
#### Ensure the pod is running, access to the mongoDB shell and create user:
```
mongosh
use myDB
db.createUser({
... user: "admin",
... pwd: "password113",
... roles: [ { role: "readWrite", db: "myDB" } ]
... })
```

### 5. Create & Apply mongo-secret.yaml file:
``` kubectl apply -f mongo-secret.yaml ```

### 6. Modify the deployment.yaml to connect MongoDB

### 7. Apply the deployment.yaml file:
``` kubectl apply -f deployment.yaml ```

### 8. Build & Push the Docker Image:
```
docker build -t sit323-2025-prac9p:latest .
docker tag sit323-2025-prac9p:latest 11ruben/prac9p-mongodb:latest
docker push 11ruben/prac9p-mongodb:latest
```

### 9. Restart the deployment pod:
``` kubectl rollout restart deployment sit323-2025-prac9p ```

### 10. Access the application with port forwarding:
``` kubectl port-forward service/sit323-2025-prac9p-xxxxxxx-xxxxxx 3040:3040 ```

### 11. Perform CRUD operation with the application
