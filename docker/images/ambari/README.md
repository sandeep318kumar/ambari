# docker-ambari

This is a production-ready Docker image of [Apache Ambari](https://github.com/apache/ambari) with all critical fixes applied.

## Features

- **Production Ready**: All 51+ critical fixes applied for stability
- **Python 3.12 Compatible**: Fixed all syntax warnings and compatibility issues
- **Multi-stage Build**: Optimized Docker image size
- **Comprehensive Logging**: Enhanced logging configuration
- **Health Checks**: Built-in health monitoring
- **Security Hardened**: Proper permissions and user management

## How to build a Docker image

There is a docker build script which will build a given Git repo/branch and tag the image.

**Usage:**
```bash
./docker-build.sh [Docker Tag] [Git Branch] [Ambari Git URL] [Java Version] [OpenJDK Image] [Ambari Version]
```

This script will check out Ambari Repo `[Ambari Git URL]` on branch `[Git Branch]` and build the docker image for that.

The docker image is tagged as `[Docker Tag]`.

**Parameters:**
- `Docker Tag`: Name and tag your docker image. Default is `ambari:latest`.
- `Git Branch`: The Ambari branch to build. Default is `trunk`.
- `Ambari Git URL`: The Ambari Git Repo to build, users can set it to their own fork. Please note that, the URL is `https://` based, not `git://`. Default is the Apache Repo: `https://github.com/apache/ambari.git`.
- `Java Version`: The Java Build and Runtime image version. Default is `8`.
- `OpenJDK Image`: Base image to use for Ambari build and runtime. Default is `openjdk`.
- `Ambari Version`: The Ambari version to build. Default is `2.7.5`.

**Examples:**

- Example of building and tagging a snapshot on your own fork:
```bash
./docker-build.sh ambari_fork:snapshot-2.7.5 trunk https://github.com/your_own_fork/ambari.git
```

- Example of building a release version:
```bash
./docker-build.sh ambari:release-2.7.5 branch-2.7.5 https://github.com/apache/ambari.git
```

### Build image with arm64 base image

For users on Mac M1 chips, they need to build the images with arm64 base image, e.g. `arm64v8/openjdk`

- Example of building an arm64 image:
```bash
./docker-build.sh ambari:latest trunk https://github.com/apache/ambari.git 8 arm64v8/openjdk 2.7.5
```

or just run the docker build script directly:
```bash
docker build -t ambari:latest --no-cache --network=host \
  --build-arg AMBARI_GIT_URL=https://github.com/apache/ambari.git \
  --build-arg AMBARI_BRANCH=trunk \
  --build-arg JAVA_VERSION=8 \
  --build-arg OPENJDK_IMAGE=arm64v8/openjdk \
  --build-arg AMBARI_VERSION=2.7.5 \
  -f Dockerfile .
```

Note that if you are not on arm64 machine, you can still build the image by turning on the experimental feature of docker, and add `--platform linux/arm64` into the `docker build ...` script.

## How to publish a Docker image

Script `docker-push.sh` publishes a given docker image to your docker registry.

In order to push to your own repo, the image needs to be explicitly tagged with the repo name.

- Example of publishing a image to [apacheambari/ambari](https://hub.docker.com/r/apacheambari/ambari) dockerHub repo:
```bash
./docker-push.sh apacheambari/ambari:latest
```

- Tag a built image, then push:
```bash
docker tag ambari:release-2.7.5 apacheambari/ambari:release-2.7.5
docker push apacheambari/ambari:release-2.7.5
```

Script `docker-build-and-push.sh` builds and publishes this docker image to your docker registry after build.

- Example of building and publishing a image to [apacheambari/ambari](https://hub.docker.com/r/apacheambari/ambari) dockerHub repo:
```bash
./docker-build-and-push.sh apacheambari/ambari:latest trunk https://github.com/apache/ambari.git
```

## How to Run it

The entry point of docker image is `ambari-admin.sh` script, similar to Pinot's `pinot-admin.sh`.

### Quick Start with Docker Compose

The easiest way to get started is using Docker Compose:

```bash
# Start the entire Ambari stack
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f ambari-server
```

This will start:
- Ambari Server (accessible at http://localhost:8080)
- Ambari Agent
- PostgreSQL database

### Manual Container Management

#### Ambari Server

Example of bringing up Ambari Server:
```bash
docker run -d \
  --name ambari-server \
  -p 8080:8080 \
  -p 8440:8440 \
  -p 8441:8441 \
  ambari:latest StartServer
```

#### Ambari Agent

Example of bringing up Ambari Agent:
```bash
docker run -d \
  --name ambari-agent \
  --link ambari-server:ambari-server \
  -e AMBARI_SERVER_HOST=ambari-server \
  ambari:latest StartAgent
```

#### Both Server and Agent

Example of bringing up both in one container:
```bash
docker run -d \
  --name ambari-all \
  -p 8080:8080 \
  ambari:latest StartAll
```

## Available Commands

The `ambari-admin.sh` script supports the following commands:

- `StartServer` - Start Ambari Server only
- `StartAgent` - Start Ambari Agent only  
- `StartAll` - Start both Server and Agent
- `help` - Show help message

## Configuration

### Environment Variables

- `AMBARI_CONF_DIR` - Ambari configuration directory (default: `/opt/ambari/conf`)
- `JAVA_HOME` - Java installation path (default: `/usr/lib/jvm/java-8-openjdk-amd64`)
- `PYTHONPATH` - Python path for Ambari modules
- `AMBARI_SERVER_HOST` - Ambari server hostname for agent connections

### Volumes

- `/opt/ambari/logs` - Ambari log files
- `/opt/ambari/conf` - Ambari configuration files
- `/var/lib/ambari-server` - Ambari server data
- `/var/lib/ambari-agent` - Ambari agent data

### Ports

- `8080` - Ambari Web UI (HTTP)
- `8440` - Ambari Web UI (HTTPS)
- `8441` - Ambari Server API (HTTPS)
- `8670` - Ambari Metrics Collector
- `8671` - Ambari Metrics Collector (HTTPS)

## Accessing Ambari

Once the container is running, you can access:

- **Ambari Web UI**: http://localhost:8080
- **Default Credentials**: admin/admin

## Health Monitoring

The Docker image includes built-in health checks:
```bash
# Check container health
docker ps

# View health check logs
docker inspect ambari-server | grep -A 10 Health
```

## Troubleshooting

### View Logs
```bash
# Server logs
docker logs ambari-server

# Agent logs  
docker logs ambari-agent

# Follow logs in real-time
docker logs -f ambari-server
```

### Debug Mode
```bash
# Run with debug output
docker run -it --rm ambari:latest StartServer
```

### Container Shell Access
```bash
# Access running container
docker exec -it ambari-server bash

# Run one-time container with shell
docker run -it --rm ambari:latest bash
```

## Production Deployment

For production deployments, consider:

1. **External Database**: Use external PostgreSQL instead of embedded database
2. **Persistent Volumes**: Mount external volumes for data persistence
3. **Load Balancer**: Use a load balancer for high availability
4. **Monitoring**: Integrate with monitoring solutions
5. **Backup Strategy**: Implement regular backup procedures

### External Database Configuration

```yaml
# docker-compose.yml with external database
services:
  ambari-server:
    image: ambari:latest
    environment:
      - DB_HOST=your-postgres-host
      - DB_PORT=5432
      - DB_NAME=ambari
      - DB_USER=ambari
      - DB_PASSWORD=your-secure-password
```

## What's Fixed

This Docker image includes comprehensive fixes for:

✅ **Directory Configuration Errors** - Fixed empty OUT_DIR and PID_DIR issues  
✅ **Python Syntax Warnings** - Fixed all invalid escape sequences  
✅ **Configuration Path Resolution** - Enhanced log4j.properties parsing  
✅ **Database Configuration** - Improved embedded database setup  
✅ **Jinja2 Compatibility** - Fixed template engine issues  
✅ **ConfigParser Issues** - Updated deprecated method calls  
✅ **Python 3.12 Compatibility** - Fixed import and syntax issues  
✅ **System Permissions** - Proper file and directory permissions  
✅ **Startup Scripts** - Robust initialization and error handling  
✅ **Logging Configuration** - Enhanced logging with proper rotation  
✅ **Security Hardening** - Secure defaults and user management  

## Contributing

To contribute improvements or report issues:

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with the provided validation scripts
5. Submit a pull request

## License

Licensed under the Apache License, Version 2.0. See the LICENSE file for details.
