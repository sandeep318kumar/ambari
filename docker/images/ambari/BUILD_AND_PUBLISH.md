# Building and Publishing Apache Ambari Docker Image

This guide explains how to build and publish the Apache Ambari Docker image so others can pull and use it.

## Prerequisites

1. **Docker Desktop**: Ensure Docker Desktop is running (not paused)
2. **Docker Hub Account**: You'll need access to push to a Docker registry
3. **Sufficient Resources**: At least 8GB RAM and 40GB disk space

## Step 1: Start Docker Desktop

Make sure Docker Desktop is running:
```bash
# Check if Docker is running
docker --version
docker info
```

If Docker Desktop is paused, unpause it through:
- **Mac**: Click the Docker whale icon in the menu bar → "Unpause"
- **Windows**: Right-click Docker Desktop system tray icon → "Unpause"

## Step 2: Build the Docker Image

Navigate to the Ambari Docker directory and build:

```bash
cd docker/images/ambari

# Build with default settings
./docker-build.sh apache/ambari:latest

# Or build with specific parameters
./docker-build.sh apache/ambari:3.1.0 trunk https://github.com/apache/ambari.git 17 17 eclipse-temurin
```

**Build Parameters:**
- `Docker Tag`: apache/ambari:latest
- `Git Branch`: trunk (or specific branch)
- `Ambari Git URL`: https://github.com/apache/ambari.git
- `Java Version`: 17
- `JDK Version`: 17
- `OpenJDK Image`: openjdk

## Step 3: Test the Image Locally

Before publishing, test the image:

```bash
# Test help command
docker run --rm apache/ambari:latest help

# Test server startup (with PostgreSQL)
docker run --rm -p 8080:8080 apache/ambari:latest StartServer

# Test with Docker Compose
docker-compose up
```

## Step 4: Login to Docker Registry

Login to Docker Hub (or your preferred registry):

```bash
docker login

# For other registries:
# docker login your-registry.com
```

## Step 5: Push the Image

Push the built image to the registry:

```bash
# Push using the script
./docker-push.sh apache/ambari:latest

# Or push manually
docker push apache/ambari:latest
```

## Step 6: Build and Push in One Command

Alternatively, use the combined script:

```bash
./docker-build-and-push.sh apache/ambari:latest
```

## Step 7: Tag Additional Versions

Create additional tags for different versions:

```bash
# Tag as latest and specific version
docker tag apache/ambari:latest apache/ambari:3.1.0
docker tag apache/ambari:latest apache/ambari:3.1

# Push all tags
docker push apache/ambari:latest
docker push apache/ambari:3.1.0
docker push apache/ambari:3.1
```

## Usage After Publishing

Once published, others can use the image:

### Pull and Run Server Only
```bash
docker pull apache/ambari:latest
docker run -p 8080:8080 apache/ambari:latest StartServer
```

### Pull and Run with Docker Compose
```bash
# Create docker-compose.yml with:
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
  
  ambari-server:
    image: apache/ambari:latest
    command: "StartServer -dbHost ambari-postgres -dbUser ambari -dbPassword bigdata"
    ports:
      - "8080:8080"
    depends_on:
      - ambari-postgres

# Then run:
docker-compose up
```

### Access Ambari Web UI
- **URL**: http://localhost:8080
- **Username**: admin
- **Password**: admin

## Build for Multiple Architectures

For ARM64 support (Apple M1):

```bash
# Build for ARM64
./docker-build.sh apacheambari/ambari:latest-arm64 trunk https://github.com/apache/ambari.git 17 17 arm64v8/openjdk

# Push ARM64 version
./docker-push.sh apacheambari/ambari:latest-arm64
```

## Automated CI/CD Pipeline

For automated builds, you can set up GitHub Actions or similar:

```yaml
# .github/workflows/docker-build.yml
name: Build and Push Docker Image
on:
  push:
    branches: [ main, trunk ]
  release:
    types: [ published ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: Build and push
      run: |
        cd docker/images/ambari
        echo "${{ secrets.DOCKER_PASSWORD }}" | docker login -u "${{ secrets.DOCKER_USERNAME }}" --password-stdin
        ./docker-build-and-push.sh apacheambari/ambari:latest
```

## Troubleshooting

### Common Issues:

1. **Docker Desktop Paused**: Unpause through the system tray/menu bar
2. **Insufficient Memory**: Increase Docker Desktop memory allocation to 8GB+
3. **Build Timeout**: The build process can take 30-60 minutes for full compilation
4. **Registry Authentication**: Ensure you're logged in with `docker login`
5. **Network Issues**: Check internet connectivity for downloading dependencies

### Build Logs:
```bash
# Check build logs
docker build --no-cache -t apacheambari/ambari:latest -f Dockerfile . 2>&1 | tee build.log

# Check running containers
docker ps -a

# Check image details
docker inspect apacheambari/ambari:latest
```

## Next Steps

After successful publication:

1. **Update Documentation**: Update README files with the published image name
2. **Create Release Notes**: Document what's included in this Docker image version
3. **Test Deployment**: Test the published image in different environments
4. **Monitor Usage**: Set up monitoring for the Docker Hub repository
5. **Automate Updates**: Set up automated builds for new Ambari releases
