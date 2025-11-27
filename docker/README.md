# Apache Ambari Docker Images

This directory contains Docker images and configurations for Apache Ambari, designed with a comprehensive approach similar to Apache Pinot's Docker setup for ease of use, flexibility, and production readiness.

## Directory Structure

```
docker/
└── images/
    └── ambari/
        ├── Dockerfile                          # Main Ambari Docker image (build from source)
        ├── Dockerfile.artifacts                # Quick build from pre-compiled artifacts
        ├── README.md                          # Comprehensive documentation
        ├── docker-build.sh                   # Build script for source-based image
        ├── docker-build-artifacts.sh         # Build script for artifacts-based image
        ├── docker-push.sh                    # Push script
        ├── docker-build-and-push.sh          # Combined build and push
        ├── docker-compose.yml                # Multi-container setup (Server + Agent + DB)
        ├── docker-compose-quickstart.yml     # Single-container QuickStart setup
        ├── bin/
        │   └── ambari-admin.sh               # Main entry point script
        ├── etc/
        │   └── ambari.properties             # Configuration template
        ├── artifacts/                        # Pre-built Ambari artifacts (optional)
        │   ├── ambari-server/
        │   └── ambari-agent/
        └── examples/
            └── docker/
                └── hadoop-cluster-compose.yml # Example Hadoop cluster setup
```

## Quick Start

### Option 1: QuickStart (Recommended for Testing)

The fastest way to get Ambari running - similar to Pinot's QuickStart approach:

```bash
cd docker/images/ambari
docker run -p 8080:8080 apache/ambari:latest QuickStart -type standalone
```

Or with Docker Compose:

```bash
export AMBARI_IMAGE=apache/ambari:latest
docker-compose -f docker-compose-quickstart.yml up
```

### Option 2: Multi-Container Setup (Recommended for Development)

```bash
cd docker/images/ambari
docker-compose up
```

To include Ambari Agent:

```bash
export AMBARI_AGENT_REPLICAS=1
docker-compose up
```

### Option 3: Build from Source

```bash
cd docker/images/ambari
./docker-build.sh apache/ambari:latest
docker run -p 8080:8080 apache/ambari:latest QuickStart -type standalone
```

### Option 4: Build from Artifacts (Quick Testing)

If you have pre-built artifacts:

```bash
cd docker/images/ambari
./docker-build-artifacts.sh apache/ambari:artifacts
docker run -p 8080:8080 apache/ambari:artifacts QuickStart -type standalone
```

### Access Ambari Web UI

Open your browser and navigate to: http://localhost:8080

- **Username**: admin
- **Password**: admin

## Features

### Key Features (Similar to Pinot's Approach)

- **JDK 17 Support**: Built with OpenJDK 17 as specified in Ambari requirements
- **PostgreSQL Integration**: Uses PostgreSQL as the default database
- **Multi-Component Support**: Supports both Ambari Server and Agent in the same image
- **Docker Compose Ready**: Multiple compose files for different use cases
- **Health Checks**: Comprehensive health checks similar to Pinot
- **Configurable**: Supports various build-time and runtime configurations
- **QuickStart Mode**: Single container setup for quick testing
- **Artifact Support**: Quick builds from pre-compiled artifacts
- **ARM64 Support**: Native support for Apple M1 and ARM64 architectures

### Key Differences from Pinot Docker Setup

1. **Database**: Uses PostgreSQL instead of embedded database
2. **Components**: Supports both Server and Agent components
3. **Java Version**: Uses JDK 17 (Ambari requirement) vs JDK 11 (Pinot default)
4. **Metrics**: Metrics are optional and disabled by default as requested
5. **Ports**: Different port mappings (8080 for Ambari vs 9000 for Pinot Controller)
6. **Architecture**: Cluster management focus vs real-time analytics

## Build Options

### Build from Source (Full Build)

Similar to Pinot's comprehensive build process:

```bash
./docker-build.sh [Docker Tag] [Git Branch] [Ambari Git URL] [Java Version] [JDK Version] [OpenJDK Image]
```

### Build from Artifacts (Quick Build)

For faster builds when you have pre-compiled artifacts:

```bash
./docker-build-artifacts.sh [Docker Tag] [Java Version] [OpenJDK Image] [Ambari Version]
```

## Configuration

### Build Arguments

The Docker images support the following build arguments:

- `JAVA_VERSION`: Java runtime version (default: 17)
- `OPENJDK_IMAGE`: Base OpenJDK image (default: eclipse-temurin)
- `AMBARI_GIT_URL`: Ambari Git repository URL
- `AMBARI_BRANCH`: Git branch to build from (default: trunk)
- `JDK_VERSION`: JDK version for Maven build (default: 17)
- `AMBARI_VERSION`: Ambari version for artifacts build

### Environment Variables

Runtime configuration through environment variables:

- `JAVA_OPTS`: JVM options for Ambari processes
- `AMBARI_HOME`: Ambari installation directory (default: /opt/ambari)
- `AMBARI_IMAGE`: Ambari Docker image (default: apache/ambari:latest)
- `POSTGRES_IMAGE`: PostgreSQL Docker image (default: postgres:15)
- `AMBARI_AGENT_REPLICAS`: Number of Ambari Agent replicas (default: 0)

## Docker Compose Services

The provided Docker Compose setup includes:

- **ambari-postgres**: PostgreSQL database for Ambari metadata
- **ambari-server**: Ambari Server for cluster management
- **ambari-agent**: Ambari Agent for node management (optional)

## Components and Ports

| Component | Port | Description |
|-----------|------|-------------|
| PostgreSQL | 5432 | Database for Ambari metadata |
| Ambari Server | 8080 | Web UI and REST API |
| Ambari Server | 8440 | HTTPS Web UI |
| Ambari Agent | 8441 | Agent communication |

## Examples

### Build for ARM64 (Apple M1)

```bash
./docker-build.sh apache/ambari:arm64 trunk https://github.com/apache/ambari.git 17 17 arm64v8/eclipse-temurin
```

### Build and Push to Registry

```bash
./docker-build-and-push.sh myregistry/ambari:latest
```

### Custom Database Configuration

```bash
docker run -p 8080:8080 apache/ambari:latest StartServer \
  -dbHost external-db.example.com \
  -dbUser prod_user \
  -dbPassword secure_password
```

## Prerequisites

**Docker Requirements:**
- Docker 20.10+
- Docker Compose 1.29+
- At least 8GB RAM allocated to Docker
- At least 40GB disk space

## Documentation

For comprehensive documentation, see [docker/images/ambari/README.md](images/ambari/README.md).

## Contributing

When adding new Docker configurations:

1. Follow the existing directory structure
2. Include comprehensive documentation
3. Add example configurations where applicable
4. Test with both x86_64 and ARM64 architectures
5. Ensure compatibility with the latest Ambari version
6. Follow Pinot's patterns for consistency

## License

Licensed under the Apache License, Version 2.0. See the main project LICENSE file for details.
