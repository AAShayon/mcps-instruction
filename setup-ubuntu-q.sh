#!/bin/bash
# Amazon Q CLI Setup for Ubuntu
# Version: 1.0.0

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }
print_warning() { echo -e "${YELLOW}⚠${NC} $1"; }
print_error() { echo -e "${RED}✗${NC} $1"; }

command_exists() { command -v "$1" >/dev/null 2>&1; }

main() {
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  Amazon Q CLI & MCP Setup for Ubuntu"
    echo "═══════════════════════════════════════════════════"
    echo ""
    
    # Check if running on Linux
    if [[ "$OSTYPE" != "linux-gnu"* ]]; then
        print_error "This script is for Ubuntu/Linux only"
        exit 1
    fi
    
    # Update system
    print_info "Updating system packages..."
    sudo apt update -qq
    
    # Install Node.js if not present
    if ! command_exists node; then
        print_info "Installing Node.js 18..."
        curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
        sudo apt install -y nodejs
        print_success "Node.js installed: $(node --version)"
    else
        print_success "Node.js already installed: $(node --version)"
    fi
    
    # Install Amazon Q CLI if not present
    if ! command_exists q; then
        print_info "Installing Amazon Q CLI..."
        curl -fsSL https://d3rnber3cjqiqw.cloudfront.net/amazon-q/latest/install.sh | bash
        
        # Add to PATH
        export PATH="$HOME/.local/bin:$PATH"
        
        # Add to bashrc if not already there
        if ! grep -q ".local/bin" ~/.bashrc; then
            echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
            print_success "Added Amazon Q CLI to PATH"
        fi
        
        print_success "Amazon Q CLI installed"
    else
        print_success "Amazon Q CLI already installed: $(q --version)"
    fi
    
    # Setup MCP agent
    print_info "Setting up MCP agent..."
    
    WORKSPACE_PATH=$(pwd)
    mkdir -p .amazonq/cli-agents
    
    cat > .amazonq/cli-agents/fullstack-dev.json << EOF
{
  "\$schema": "https://raw.githubusercontent.com/aws/amazon-q-developer-cli/refs/heads/main/schemas/agent-v1.json",
  "name": "fullstack-dev",
  "description": "Full-stack development agent for Next.js and Laravel/PHP",
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
    
    # Add to .gitignore
    if [ -f ".gitignore" ]; then
        if ! grep -q ".amazonq" .gitignore; then
            echo "" >> .gitignore
            echo "# Amazon Q CLI" >> .gitignore
            echo ".amazonq/" >> .gitignore
            print_success "Added .amazonq/ to .gitignore"
        fi
    fi
    
    # Summary
    echo ""
    echo "═══════════════════════════════════════════════════"
    echo "  Setup Complete!"
    echo "═══════════════════════════════════════════════════"
    echo ""
    print_success "Amazon Q CLI installed and configured"
    print_success "MCP agent created: fullstack-dev"
    print_success "Workspace: $WORKSPACE_PATH"
    echo ""
    print_info "Next steps:"
    echo "  1. source ~/.bashrc"
    echo "  2. q chat"
    echo "  3. /agent swap fullstack-dev"
    echo "  4. /mcp"
    echo "  5. Trust tools when prompted: t"
    echo ""
    print_warning "If 'q' command not found, run: source ~/.bashrc"
    echo ""
}

main "$@"
