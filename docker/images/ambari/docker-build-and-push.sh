#!/bin/bash

# Licensed to the Apache Software Foundation (ASF) under one
# or more contributor license agreements.  See the NOTICE file
# distributed with this work for additional information
# regarding copyright ownership.  The ASF licenses this file
# to you under the Apache License, Version 2.0 (the
# "License"); you may not use this file except in compliance
# with the License.  You may obtain a copy of the License at
#
#   http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing,
# software distributed under the License is distributed on an
# "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
# KIND, either express or implied.  See the License for the
# specific language governing permissions and limitations
# under the License.

# Docker build and push script for Apache Ambari
# Based on Apache Pinot's docker-build-and-push.sh approach

set -e

# Default values
DOCKER_TAG=${1:-apacheambari/ambari:latest}
GIT_BRANCH=${2:-trunk}
AMBARI_GIT_URL=${3:-https://github.com/apache/ambari.git}
JAVA_VERSION=${4:-8}
OPENJDK_IMAGE=${5:-openjdk}
AMBARI_VERSION=${6:-2.7.5}

echo "Building and Pushing Apache Ambari Docker Image"
echo "==============================================="
echo "Docker Tag: ${DOCKER_TAG}"
echo "Git Branch: ${GIT_BRANCH}"
echo "Ambari Git URL: ${AMBARI_GIT_URL}"
echo "Java Version: ${JAVA_VERSION}"
echo "OpenJDK Image: ${OPENJDK_IMAGE}"
echo "Ambari Version: ${AMBARI_VERSION}"
echo ""

# Validate parameters
if [[ -z "${DOCKER_TAG}" ]]; then
    echo "Error: Docker tag cannot be empty"
    exit 1
fi

if [[ -z "${AMBARI_GIT_URL}" ]]; then
    echo "Error: Ambari Git URL cannot be empty"
    exit 1
fi

# Check if Docker is available
if ! command -v docker &> /dev/null; then
    echo "Error: Docker is not installed or not in PATH"
    exit 1
fi

# Check if we're in the right directory
if [[ ! -f "Dockerfile" ]]; then
    echo "Error: Dockerfile not found. Please run this script from docker/images/ambari directory"
    exit 1
fi

echo "Step 1: Building Docker image..."
echo "================================"

# Build the Docker image
./docker-build.sh "${DOCKER_TAG}" "${GIT_BRANCH}" "${AMBARI_GIT_URL}" "${JAVA_VERSION}" "${OPENJDK_IMAGE}" "${AMBARI_VERSION}"

if [[ $? -ne 0 ]]; then
    echo "❌ Docker build failed!"
    exit 1
fi

echo ""
echo "Step 2: Pushing Docker image..."
echo "==============================="

# Push the Docker image
./docker-push.sh "${DOCKER_TAG}"

if [[ $? -eq 0 ]]; then
    echo ""
    echo "🎉 Build and push completed successfully!"
    echo "Image: ${DOCKER_TAG}"
    echo ""
    echo "The image is now available in the Docker registry and ready for use."
    echo ""
    echo "Usage Examples:"
    echo "  # Pull and run Ambari Server"
    echo "  docker pull ${DOCKER_TAG}"
    echo "  docker run -p 8080:8080 ${DOCKER_TAG} StartServer"
    echo ""
    echo "  # Access Ambari Web UI at: http://localhost:8080"
    echo "  # Default credentials: admin/admin"
    echo ""
else
    echo ""
    echo "❌ Build and push failed!"
    exit 1
fi
