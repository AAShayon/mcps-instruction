#!/bin/bash
# Amazon Q CLI & MCP Setup Script
# Version: 1.0.0

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

main() {
    echo "Amazon Q CLI & MCP Setup"
    echo "========================"
    echo ""
    
    # Check prerequisites
    if ! command_exists brew; then
        print_error "Homebrew required. Install from https://brew.sh"
        exit 1
    fi
    
    if ! command_exists node; then
        print_info "Installing Node.js..."
        brew install node
    fi
    
    # Install Amazon Q CLI
    if ! command_exists q; then
        print_info "Installing Amazon Q CLI..."
        brew tap aws/tap
        brew install amazon-q
    fi
    
    print_success "Amazon Q CLI installed: $(q --version)"
    
    # Setup agent
    mkdir -p .amazonq/cli-agents
    
    WORKSPACE_PATH=$(pwd)
    
    cat > .amazonq/cli-agents/fullstack-dev.json << EOF
{
  "\$schema": "https://raw.githubusercontent.com/aws/amazon-q-developer-cli/refs/heads/main/schemas/agent-v1.json",
  "name": "fullstack-dev",
  "description": "Full-stack development agent",
  "mcpServers": {
    "workspace-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest"],
      "env": {
        "ALLOWED_DIRECTORIES": "$WORKSPACE_PATH"
      }
    },
    "nextjs-tools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"],
      "env": {
        "NEXT_PROJECT_PATH": "$WORKSPACE_PATH"
      }
    }
  },
  "tools": [
    "fs_read",
    "fs_write",
    "execute_bash",
    "use_aws",
    "@workspace-filesystem",
    "@nextjs-tools"
  ]
}
EOF
    
    print_success "Agent configured for: $WORKSPACE_PATH"
    
    echo ""
    echo "Next steps:"
    echo "  1. q chat"
    echo "  2. /agent swap fullstack-dev"
    echo "  3. /mcp"
}

main "$@"
