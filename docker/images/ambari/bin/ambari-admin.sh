#!/bin/bash
#
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
#

AMBARI_HOME=${AMBARI_HOME:-/opt/ambari}
JAVA_OPTS=${JAVA_OPTS:-"-Xms1G -Xmx2G -XX:+UseG1GC -XX:MaxGCPauseMillis=200"}

function usage() {
  echo "Usage: ambari-admin.sh <command> [options]"
  echo ""
  echo "Commands:"
  echo "  StartServer [options]     Start Ambari Server"
  echo "  StartAgent [options]      Start Ambari Agent"
  echo "  QuickStart [options]      Start Ambari Server and Agent together"
  echo "  help                      Show this help message"
  echo ""
  echo "StartServer options:"
  echo "  -dbHost <host>           Database host (default: localhost)"
  echo "  -dbPort <port>           Database port (default: 5432)"
  echo "  -dbName <name>           Database name (default: ambari)"
  echo "  -dbUser <user>           Database user (default: ambari)"
  echo "  -dbPassword <password>   Database password (default: bigdata)"
  echo "  -debug                   Start in debug mode"
  echo ""
  echo "StartAgent options:"
  echo "  -serverHost <host>       Ambari Server host (default: localhost)"
  echo "  -serverPort <port>       Ambari Server port (default: 8080)"
  echo ""
  echo "QuickStart options:"
  echo "  -type <type>             QuickStart type: standalone (default: standalone)"
  echo ""
  echo "Examples:"
  echo "  ambari-admin.sh StartServer"
  echo "  ambari-admin.sh StartServer -dbHost postgres -dbUser ambari -dbPassword mypass"
  echo "  ambari-admin.sh StartAgent -serverHost ambari-server"
  echo "  ambari-admin.sh QuickStart -type standalone"
}

function startServer() {
  echo "Starting Ambari Server..."
  
  # Default values
  DB_HOST="localhost"
  DB_PORT="5432"
  DB_NAME="ambari"
  DB_USER="ambari"
  DB_PASSWORD="bigdata"
  DEBUG_MODE=""
  
  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case $1 in
      -dbHost)
        DB_HOST="$2"
        shift 2
        ;;
      -dbPort)
        DB_PORT="$2"
        shift 2
        ;;
      -dbName)
        DB_NAME="$2"
        shift 2
        ;;
      -dbUser)
        DB_USER="$2"
        shift 2
        ;;
      -dbPassword)
        DB_PASSWORD="$2"
        shift 2
        ;;
      -debug)
        DEBUG_MODE="--debug"
        shift
        ;;
      *)
        echo "Unknown option: $1"
        usage
        exit 1
        ;;
    esac
  done
  
  # Setup database configuration
  echo "Configuring database connection..."
  echo "Database Host: $DB_HOST"
  echo "Database Port: $DB_PORT"
  echo "Database Name: $DB_NAME"
  echo "Database User: $DB_USER"
  
  # Start Ambari Server
  cd ${AMBARI_HOME}/server
  export JAVA_OPTS="${JAVA_OPTS}"
  
  # Set up Python path for Ambari modules
  export PYTHONPATH="${AMBARI_HOME}/server/lib/ambari-server/lib:${AMBARI_HOME}/server/lib/ambari-server:${AMBARI_HOME}/server/lib:${AMBARI_HOME}/server:${PYTHONPATH}"
  
  # Add agent lib path as well for shared modules
  export PYTHONPATH="${AMBARI_HOME}/agent/lib/ambari-agent/lib:${AMBARI_HOME}/agent/lib/ambari-agent:${PYTHONPATH}"
  
  echo "Python path configured for Ambari modules"
  echo "PYTHONPATH: $PYTHONPATH"
  
  # Apply comprehensive startup fix to address all critical issues
  if [ -f "${AMBARI_HOME}/bin/comprehensive-startup-fix.py" ]; then
    echo "Applying comprehensive startup fixes..."
    python3 "${AMBARI_HOME}/bin/comprehensive-startup-fix.py"
  else
    echo "Warning: Comprehensive startup fix not found, applying individual fixes..."
    
    # Apply Python 3.12 compatibility fixes
    if [ -f "${AMBARI_HOME}/bin/python-compat-fix.py" ]; then
      echo "Applying Python 3.12 compatibility fixes..."
      python3 "${AMBARI_HOME}/bin/python-compat-fix.py"
    fi
    
    # Apply complete setup fix for system directories and missing components
    if [ -f "${AMBARI_HOME}/bin/complete-setup-fix.py" ]; then
      echo "Applying complete setup fix..."
      python3 "${AMBARI_HOME}/bin/complete-setup-fix.py"
    fi
    
    # Apply attribute fix for missing class attributes
    if [ -f "${AMBARI_HOME}/bin/attribute-fix.py" ]; then
      echo "Applying attribute fix..."
      python3 "${AMBARI_HOME}/bin/attribute-fix.py"
    fi
    
    # Apply direct fix for all configuration issues
    if [ -f "${AMBARI_HOME}/bin/direct-fix.py" ]; then
      echo "Applying direct configuration fix..."
      python3 "${AMBARI_HOME}/bin/direct-fix.py"
    fi
    
    # Apply final system fix for PostgreSQL and user detection
    if [ -f "${AMBARI_HOME}/bin/final-system-fix.py" ]; then
      echo "Applying final system fix..."
      python3 "${AMBARI_HOME}/bin/final-system-fix.py"
    fi
    
    # Apply direct start fix to bypass setup issues
    if [ -f "${AMBARI_HOME}/bin/direct-start-fix.py" ]; then
      echo "Applying direct start fix..."
      python3 "${AMBARI_HOME}/bin/direct-start-fix.py"
    fi
    
    # Apply Ambari setup for database and agent configuration
    if [ -f "${AMBARI_HOME}/bin/ambari-setup.py" ]; then
      echo "Running Ambari setup..."
      python3 "${AMBARI_HOME}/bin/ambari-setup.py"
    fi
  fi
  
  # Setup Ambari configuration directory (use local directory since we don't have sudo)
  echo "Setting up Ambari configuration..."
  mkdir -p ${AMBARI_HOME}/conf
  mkdir -p ${AMBARI_HOME}/tmp
  mkdir -p ${AMBARI_HOME}/run
  mkdir -p ${AMBARI_HOME}/logs
  mkdir -p ${AMBARI_HOME}/resources
  mkdir -p ${AMBARI_HOME}/resources/views
  mkdir -p ${AMBARI_HOME}/resources/custom_action_definitions
  mkdir -p ${AMBARI_HOME}/resources/Ambari-DDL
  mkdir -p ${AMBARI_HOME}/bootstrap
  mkdir -p ${AMBARI_HOME}/stack-recommendations
  mkdir -p ${AMBARI_HOME}/data/cache
  mkdir -p ${AMBARI_HOME}/conf/keys
  mkdir -p ${AMBARI_HOME}/server/web
  
  # Copy configuration files to local directory
  if [ -f "${AMBARI_HOME}/etc/ambari.properties" ]; then
    cp "${AMBARI_HOME}/etc/ambari.properties" "${AMBARI_HOME}/conf/"
    echo "Copied ambari.properties to ${AMBARI_HOME}/conf/"
  fi
  
  if [ -f "${AMBARI_HOME}/etc/log4j.properties" ]; then
    cp "${AMBARI_HOME}/etc/log4j.properties" "${AMBARI_HOME}/conf/"
    echo "Copied log4j.properties to ${AMBARI_HOME}/conf/"
  fi
  
  # Apply database configuration fix (after config files are copied)
  if [ -f "${AMBARI_HOME}/bin/database-fix.py" ]; then
    echo "Applying database configuration fix..."
    python3 "${AMBARI_HOME}/bin/database-fix.py"
  fi
  
  # Create logs directory
  mkdir -p ${AMBARI_HOME}/logs
  
  # Create password file for database
  echo "$DB_PASSWORD" > "${AMBARI_HOME}/conf/password.dat"
  chmod 600 "${AMBARI_HOME}/conf/password.dat"
  
  # Set environment variables for configuration directory and other paths
  export AMBARI_CONF_DIR=${AMBARI_HOME}/conf
  export AMBARI_OUT_DIR=${AMBARI_HOME}/logs
  export AMBARI_PID_DIR=${AMBARI_HOME}/run
  export AMBARI_LOG_DIR=${AMBARI_HOME}/logs
  export AMBARI_TMP_DIR=${AMBARI_HOME}/tmp
  export AMBARI_RESOURCES_DIR=${AMBARI_HOME}/resources
  
  # Run Ambari Server setup (required before starting)
  echo "Running Ambari Server setup..."
  if [ -f "sbin/ambari-server.py" ]; then
    echo "Running setup with embedded database for Docker..."
    python3 sbin/ambari-server.py setup -s \
      --database=embedded \
      --databasehost=localhost \
      --databaseport=5432 \
      --databasename=ambari \
      --databaseusername=ambari \
      --databasepassword="$DB_PASSWORD" \
      --java-home="$JAVA_HOME" || echo "Setup completed with warnings"
  fi
  
  # Find the correct ambari-server script path
  AMBARI_SERVER_SCRIPT=""
  if [ -f "sbin/ambari-server" ]; then
    AMBARI_SERVER_SCRIPT="sbin/ambari-server"
  elif [ -f "sbin/ambari-server.py" ]; then
    AMBARI_SERVER_SCRIPT="python3 sbin/ambari-server.py"
  elif [ -f "bin/ambari-server" ]; then
    AMBARI_SERVER_SCRIPT="bin/ambari-server"
  elif [ -f "bin/ambari-server.py" ]; then
    AMBARI_SERVER_SCRIPT="python3 bin/ambari-server.py"
  elif [ -f "/usr/sbin/ambari-server" ]; then
    AMBARI_SERVER_SCRIPT="/usr/sbin/ambari-server"
  elif [ -f "/usr/sbin/ambari-server.py" ]; then
    AMBARI_SERVER_SCRIPT="python3 /usr/sbin/ambari-server.py"
  else
    echo "Error: Could not find ambari-server script"
    echo "Searched in:"
    echo "  - ${AMBARI_HOME}/server/sbin/ambari-server"
    echo "  - ${AMBARI_HOME}/server/sbin/ambari-server.py"
    echo "  - ${AMBARI_HOME}/server/bin/ambari-server"
    echo "  - ${AMBARI_HOME}/server/bin/ambari-server.py"
    echo "  - /usr/sbin/ambari-server"
    echo "  - /usr/sbin/ambari-server.py"
    echo ""
    echo "Available files in ${AMBARI_HOME}/server:"
    ls -la ${AMBARI_HOME}/server/ || true
    echo ""
    echo "Available files in ${AMBARI_HOME}/server/sbin/:"
    ls -la ${AMBARI_HOME}/server/sbin/ 2>/dev/null || echo "sbin directory not found"
    echo ""
    echo "Available files in ${AMBARI_HOME}/server/bin/:"
    ls -la ${AMBARI_HOME}/server/bin/ 2>/dev/null || echo "bin directory not found"
    exit 1
  fi
  
  if [ -n "$DEBUG_MODE" ]; then
    echo "Starting Ambari Server in debug mode using: $AMBARI_SERVER_SCRIPT"
    $AMBARI_SERVER_SCRIPT start $DEBUG_MODE
  else
    echo "Starting Ambari Server using: $AMBARI_SERVER_SCRIPT"
    $AMBARI_SERVER_SCRIPT start
  fi
  
  # Keep container running
  tail -f /dev/null
}

function startAgent() {
  echo "Starting Ambari Agent..."
  
  # Default values
  SERVER_HOST="localhost"
  SERVER_PORT="8080"
  
  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case $1 in
      -serverHost)
        SERVER_HOST="$2"
        shift 2
        ;;
      -serverPort)
        SERVER_PORT="$2"
        shift 2
        ;;
      *)
        echo "Unknown option: $1"
        usage
        exit 1
        ;;
    esac
  done
  
  echo "Ambari Server Host: $SERVER_HOST"
  echo "Ambari Server Port: $SERVER_PORT"
  
  # Configure agent
  cd ${AMBARI_HOME}/agent
  
  # Update agent configuration
  if [ -f conf/ambari-agent.ini ]; then
    sed -i "s/hostname=localhost/hostname=$SERVER_HOST/g" conf/ambari-agent.ini
    sed -i "s/url_port=8440/url_port=$SERVER_PORT/g" conf/ambari-agent.ini
  fi
  
  # Find the correct ambari-agent script path
  AMBARI_AGENT_SCRIPT=""
  if [ -f "bin/ambari-agent" ]; then
    AMBARI_AGENT_SCRIPT="bin/ambari-agent"
  elif [ -f "bin/ambari-agent.py" ]; then
    AMBARI_AGENT_SCRIPT="python3 bin/ambari-agent.py"
  elif [ -f "sbin/ambari-agent" ]; then
    AMBARI_AGENT_SCRIPT="sbin/ambari-agent"
  elif [ -f "sbin/ambari-agent.py" ]; then
    AMBARI_AGENT_SCRIPT="python3 sbin/ambari-agent.py"
  elif [ -f "ambari-agent/bin/ambari-agent" ]; then
    AMBARI_AGENT_SCRIPT="ambari-agent/bin/ambari-agent"
  elif [ -f "ambari-agent/bin/ambari-agent.py" ]; then
    AMBARI_AGENT_SCRIPT="python3 ambari-agent/bin/ambari-agent.py"
  elif [ -f "ambari-agent/sbin/ambari-agent" ]; then
    AMBARI_AGENT_SCRIPT="ambari-agent/sbin/ambari-agent"
  elif [ -f "ambari-agent/sbin/ambari-agent.py" ]; then
    AMBARI_AGENT_SCRIPT="python3 ambari-agent/sbin/ambari-agent.py"
  elif [ -f "/usr/sbin/ambari-agent" ]; then
    AMBARI_AGENT_SCRIPT="/usr/sbin/ambari-agent"
  elif [ -f "/usr/sbin/ambari-agent.py" ]; then
    AMBARI_AGENT_SCRIPT="python3 /usr/sbin/ambari-agent.py"
  else
    echo "Error: Could not find ambari-agent script"
    echo "Searched in:"
    echo "  - ${AMBARI_HOME}/agent/bin/ambari-agent"
    echo "  - ${AMBARI_HOME}/agent/bin/ambari-agent.py"
    echo "  - ${AMBARI_HOME}/agent/sbin/ambari-agent"
    echo "  - ${AMBARI_HOME}/agent/sbin/ambari-agent.py"
    echo "  - ${AMBARI_HOME}/agent/ambari-agent/bin/ambari-agent"
    echo "  - ${AMBARI_HOME}/agent/ambari-agent/bin/ambari-agent.py"
    echo "  - ${AMBARI_HOME}/agent/ambari-agent/sbin/ambari-agent"
    echo "  - ${AMBARI_HOME}/agent/ambari-agent/sbin/ambari-agent.py"
    echo "  - /usr/sbin/ambari-agent"
    echo "  - /usr/sbin/ambari-agent.py"
    echo ""
    echo "Available files in ${AMBARI_HOME}/agent:"
    ls -la ${AMBARI_HOME}/agent/ || true
    echo ""
    echo "Available files in ${AMBARI_HOME}/agent/bin/:"
    ls -la ${AMBARI_HOME}/agent/bin/ 2>/dev/null || echo "bin directory not found"
    echo ""
    echo "Available files in ${AMBARI_HOME}/agent/sbin/:"
    ls -la ${AMBARI_HOME}/agent/sbin/ 2>/dev/null || echo "sbin directory not found"
    echo ""
    echo "Available files in ${AMBARI_HOME}/agent/ambari-agent/:"
    ls -la ${AMBARI_HOME}/agent/ambari-agent/ 2>/dev/null || echo "ambari-agent subdirectory not found"
    exit 1
  fi
  
  # Start Ambari Agent
  echo "Starting Ambari Agent using: $AMBARI_AGENT_SCRIPT"
  $AMBARI_AGENT_SCRIPT start
  
  # Keep container running
  tail -f /dev/null
}

function quickStart() {
  echo "Starting Ambari QuickStart..."
  
  # Default values
  TYPE="standalone"
  
  # Parse arguments
  while [[ $# -gt 0 ]]; do
    case $1 in
      -type)
        TYPE="$2"
        shift 2
        ;;
      *)
        echo "Unknown option: $1"
        usage
        exit 1
        ;;
    esac
  done
  
  echo "QuickStart Type: $TYPE"
  
  case $TYPE in
    standalone)
      echo "Starting Ambari in standalone mode (Server + Agent)..."
      
      # Start server in background
      startServer &
      SERVER_PID=$!
      
      # Wait for server to start
      echo "Waiting for Ambari Server to start..."
      sleep 30
      
      # Start agent
      startAgent &
      AGENT_PID=$!
      
      # Wait for both processes
      wait $SERVER_PID $AGENT_PID
      ;;
    *)
      echo "Unknown QuickStart type: $TYPE"
      usage
      exit 1
      ;;
  esac
}

# Main script logic
case "$1" in
  StartServer)
    shift
    startServer "$@"
    ;;
  StartAgent)
    shift
    startAgent "$@"
    ;;
  QuickStart)
    shift
    quickStart "$@"
    ;;
  help|--help|-h)
    usage
    ;;
  *)
    echo "Unknown command: $1"
    echo ""
    usage
    exit 1
    ;;
esac
