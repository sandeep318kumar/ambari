# Apache Ambari Docker Workflow

This document outlines the complete workflow for building, publishing, and using Apache Ambari Docker images.

## 🏗️ Phase 1: Build and Publish (Maintainer)

### Prerequisites
- Docker Desktop running (not paused)
- Docker Hub account with push permissions
- At least 8GB RAM and 40GB disk space

### Step 1: Build the Image
```bash
cd docker/images/ambari

# Unpause Docker Desktop if needed
# Mac: Click Docker whale icon → "Unpause"
# Windows: Right-click Docker Desktop → "Unpause"

# Build the image
./docker-build.sh apacheambari/ambari:latest
```

### Step 2: Test Locally
```bash
# Test the image
docker run --rm apacheambari/ambari:latest help

# Test with compose
docker-compose up -d
docker-compose down
```

### Step 3: Login and Push
```bash
# Login to Docker Hub
docker login

# Push the image
./docker-push.sh apacheambari/ambari:latest

# Or build and push in one command
./docker-build-and-push.sh apacheambari/ambari:latest
```

### Step 4: Tag Versions
```bash
# Create version tags
docker tag apacheambari/ambari:latest apacheambari/ambari:3.1.0
docker tag apacheambari/ambari:latest apacheambari/ambari:3.1

# Push all versions
docker push apacheambari/ambari:latest
docker push apacheambari/ambari:3.1.0
docker push apacheambari/ambari:3.1
```

## 🚀 Phase 2: Use Published Image (End Users)

Once the image is published, end users can easily pull and run Ambari:

### Quick Start - Server Only
```bash
# Pull and run Ambari Server
docker pull apache/ambari:latest
docker run -p 8080:8080 apache/ambari:latest StartServer

# Access at http://localhost:8080 (admin/admin)
```

### Full Setup with Docker Compose
```bash
# Create docker-compose.yml
cat > docker-compose.yml << 'EOF'
version: '3.7'
services:
  ambari-postgres:
    image: postgres:13
    environment:
      POSTGRES_DB: ambari
      POSTGRES_USER: ambari
      POSTGRES_PASSWORD: bigdata
    ports:
      - "5432:5432"
    volumes:
      - postgres-data:/var/lib/postgresql/data

  ambari-server:
    image: apache/ambari:latest
    command: "StartServer -dbHost ambari-postgres -dbUser ambari -dbPassword bigdata"
    ports:
      - "8080:8080"
    depends_on:
      - ambari-postgres
    environment:
      JAVA_OPTS: "-Xms2G -Xmx4G"

volumes:
  postgres-data:
EOF

# Run the stack
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f ambari-server

# Stop when done
docker-compose down
```

### Hadoop Cluster Example
```bash
# Download the example compose file
curl -O https://raw.githubusercontent.com/apache/ambari/trunk/docker/images/ambari/examples/docker/hadoop-cluster-compose.yml

# Start with workers
export HADOOP_WORKER_REPLICAS=1
docker-compose -f hadoop-cluster-compose.yml up -d

# Access Ambari at http://localhost:8080
# Access HDFS NameNode at http://localhost:9870
# Access YARN ResourceManager at http://localhost:8088
```

## 📋 Available Commands

The Ambari Docker image supports these commands:

```bash
# Show help
docker run --rm apacheambari/ambari:latest help

# Start Ambari Server
docker run -p 8080:8080 apacheambari/ambari:latest StartServer [options]

# Start Ambari Agent
docker run apacheambari/ambari:latest StartAgent -serverHost <host>

# Start both Server and Agent
docker run -p 8080:8080 apacheambari/ambari:latest QuickStart -type standalone
```

## 🔧 Configuration Options

### Server Options
```bash
StartServer [options]:
  -dbHost <host>           Database host (default: localhost)
  -dbPort <port>           Database port (default: 5432)
  -dbName <name>           Database name (default: ambari)
  -dbUser <user>           Database user (default: ambari)
  -dbPassword <password>   Database password (default: bigdata)
  -debug                   Start in debug mode
```

### Agent Options
```bash
StartAgent [options]:
  -serverHost <host>       Ambari Server host (default: localhost)
  -serverPort <port>       Ambari Server port (default: 8080)
```

### Environment Variables
```bash
# JVM Options
JAVA_OPTS="-Xms2G -Xmx4G -XX:+UseG1GC"

# Ambari Home
AMBARI_HOME="/opt/ambari"

# Docker Compose Variables
AMBARI_IMAGE="apacheambari/ambari:latest"
POSTGRES_IMAGE="postgres:13"
AMBARI_AGENT_REPLICAS="1"
```

## 🌐 Port Mappings

| Port | Service | Description |
|------|---------|-------------|
| 5432 | PostgreSQL | Database |
| 8080 | Ambari Server | Web UI |
| 8440 | Ambari Server | HTTPS |
| 8441 | Ambari Agent | Agent Communication |
| 9870 | HDFS NameNode | Web UI |
| 8088 | YARN ResourceManager | Web UI |
| 19888 | MapReduce JobHistory | Web UI |

## 🔍 Troubleshooting

### Common Issues

1. **Docker Desktop Paused**
   ```bash
   # Check Docker status
   docker info
   # Unpause through Docker Desktop UI
   ```

2. **Port Conflicts**
   ```bash
   # Check what's using port 8080
   lsof -i :8080
   # Use different port
   docker run -p 8081:8080 apacheambari/ambari:latest StartServer
   ```

3. **Database Connection Issues**
   ```bash
   # Check PostgreSQL is running
   docker-compose ps
   # Check logs
   docker-compose logs ambari-postgres
   ```

4. **Memory Issues**
   ```bash
   # Reduce memory usage
   export JAVA_OPTS="-Xms1G -Xmx2G"
   docker-compose up
   ```

### Useful Commands
```bash
# Check container status
docker ps -a

# View container logs
docker logs <container-name>

# Execute commands in container
docker exec -it <container-name> bash

# Check image details
docker inspect apacheambari/ambari:latest

# Clean up
docker system prune -a
```

## 📚 Additional Resources

- [Ambari Docker README](images/ambari/README.md)
- [Build and Publish Guide](images/ambari/BUILD_AND_PUBLISH.md)
- [Hadoop Cluster Example](images/ambari/examples/docker/hadoop-cluster-compose.yml)
- [Apache Ambari Documentation](https://ambari.apache.org/documentation.html)
- [Docker Compose Documentation](https://docs.docker.com/compose/)

## 🤝 Contributing

To contribute to the Ambari Docker setup:

1. Fork the repository
2. Make changes to the Docker files
3. Test locally with `docker-build.sh`
4. Submit a pull request
5. Maintainers will build and publish updated images

## 📄 License

Licensed under the Apache License, Version 2.0. See the main project LICENSE file for details.
