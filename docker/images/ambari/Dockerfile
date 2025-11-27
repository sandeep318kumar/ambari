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

# Multi-stage build for Apache Ambari
# Based on Apache Pinot's Docker image approach

ARG OPENJDK_IMAGE=openjdk
ARG JAVA_VERSION=8
ARG AMBARI_GIT_URL=https://github.com/apache/ambari.git
ARG AMBARI_BRANCH=trunk
ARG AMBARI_VERSION=2.7.5

# Build stage
FROM ${OPENJDK_IMAGE}:${JAVA_VERSION}-jdk as ambari-build

ARG AMBARI_GIT_URL
ARG AMBARI_BRANCH
ARG AMBARI_VERSION
ARG MAVEN_VERSION=3.9.6

# Install build dependencies
RUN apt-get update && \
    apt-get install -y \
        git \
        wget \
        curl \
        python3 \
        python3-dev \
        python3-pip \
        python3-setuptools \
        build-essential \
        rpm \
        nodejs \
        npm \
        phantomjs \
        postgresql-client \
        && rm -rf /var/lib/apt/lists/*

# Install Maven
RUN wget -q https://archive.apache.org/dist/maven/maven-3/${MAVEN_VERSION}/binaries/apache-maven-${MAVEN_VERSION}-bin.tar.gz && \
    tar -xzf apache-maven-${MAVEN_VERSION}-bin.tar.gz -C /opt && \
    ln -s /opt/apache-maven-${MAVEN_VERSION} /opt/maven && \
    rm apache-maven-${MAVEN_VERSION}-bin.tar.gz

ENV PATH="/opt/maven/bin:${PATH}"
ENV MAVEN_HOME="/opt/maven"

# Install Python dependencies
RUN pip3 install --no-cache-dir \
    setuptools \
    wheel \
    psutil \
    pexpect

# Clone and build Ambari
WORKDIR /tmp
RUN git clone ${AMBARI_GIT_URL} ambari && \
    cd ambari && \
    git checkout ${AMBARI_BRANCH}

WORKDIR /tmp/ambari

# Build Ambari with optimizations
RUN mvn clean install package rpm:rpm -DnewVersion=${AMBARI_VERSION} \
    -DskipTests \
    -Dpython.ver="python >= 2.6" \
    -Drat.skip=true \
    -Dfindbugs.skip=true \
    -Dcheckstyle.skip=true \
    -Djdk.version=${JAVA_VERSION} \
    -Dmaven.javadoc.skip=true \
    -B -q

# Runtime stage
FROM ${OPENJDK_IMAGE}:${JAVA_VERSION}-jre as ambari-runtime

ARG AMBARI_VERSION

LABEL maintainer="Apache Ambari <dev@ambari.apache.org>"
LABEL version="${AMBARI_VERSION}"
LABEL description="Apache Ambari - Production Ready Docker Image"

# Install runtime dependencies
RUN apt-get update && \
    apt-get install -y \
        python3 \
        python3-pip \
        python3-setuptools \
        postgresql-client \
        curl \
        wget \
        net-tools \
        procps \
        sudo \
        openssh-client \
        && rm -rf /var/lib/apt/lists/*

# Install Python runtime dependencies
RUN pip3 install --no-cache-dir \
    setuptools \
    wheel \
    psutil \
    pexpect \
    requests

# Create ambari user
RUN groupadd -r ambari && \
    useradd -r -g ambari -d /opt/ambari -s /bin/bash ambari

# Create directory structure
RUN mkdir -p \
    /opt/ambari/{bin,conf,logs,server,agent} \
    /var/lib/ambari-server/{resources,keys,data} \
    /var/lib/ambari-agent \
    /var/run/ambari-server \
    /var/log/ambari-{server,agent} \
    /etc/ambari-{server,agent}/conf \
    /usr/lib/ambari-{server,agent}

# Copy Ambari artifacts from build stage
COPY --from=ambari-build /tmp/ambari/ambari-server/target/ambari-server-${AMBARI_VERSION}.tar.gz /tmp/
COPY --from=ambari-build /tmp/ambari/ambari-agent/target/ambari-agent-${AMBARI_VERSION}.tar.gz /tmp/
COPY --from=ambari-build /tmp/ambari/ambari-web/target/ambari-web-${AMBARI_VERSION}.tar.gz /tmp/

# Extract Ambari components
RUN cd /tmp && \
    tar -xzf ambari-server-${AMBARI_VERSION}.tar.gz -C /opt/ambari/server --strip-components=1 && \
    tar -xzf ambari-agent-${AMBARI_VERSION}.tar.gz -C /opt/ambari/agent --strip-components=1 && \
    tar -xzf ambari-web-${AMBARI_VERSION}.tar.gz -C /usr/lib/ambari-server/web --strip-components=1 && \
    rm -f /tmp/ambari-*.tar.gz

# Copy configuration files and scripts
COPY bin/ /opt/ambari/bin/
COPY etc/ /opt/ambari/conf/

# Make scripts executable
RUN chmod +x /opt/ambari/bin/*.py /opt/ambari/bin/*.sh

# Set proper ownership
RUN chown -R ambari:ambari \
    /opt/ambari \
    /var/lib/ambari-server \
    /var/lib/ambari-agent \
    /var/run/ambari-server \
    /var/log/ambari-server \
    /var/log/ambari-agent \
    /etc/ambari-server \
    /etc/ambari-agent \
    /usr/lib/ambari-server \
    /usr/lib/ambari-agent

# Set environment variables
ENV AMBARI_HOME="/opt/ambari"
ENV AMBARI_CONF_DIR="/opt/ambari/conf"
ENV JAVA_HOME="/usr/lib/jvm/java-8-openjdk-amd64"
ENV PYTHONPATH="/opt/ambari/agent/lib/ambari-agent/lib:/opt/ambari/agent/lib/ambari-agent:/opt/ambari/server/lib/ambari-server/lib:/opt/ambari/server/lib/ambari-server:/opt/ambari/server/lib:/opt/ambari/server:"
ENV PATH="/opt/ambari/bin:${PATH}"

# Expose ports
EXPOSE 8080 8440 8441 8670 8671

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
    CMD curl -f http://localhost:8080 || exit 1

# Switch to ambari user
USER ambari

# Set working directory
WORKDIR /opt/ambari

# Entry point - similar to Pinot's approach
ENTRYPOINT ["/opt/ambari/bin/ambari-admin.sh"]

# Default command
CMD ["StartServer"]
