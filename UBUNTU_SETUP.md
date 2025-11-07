# Amazon Q CLI & MCP Setup for Ubuntu

Complete guide to setup Amazon Q CLI with MCP servers on Ubuntu for your ecommerce-client-demo project.

## 🚀 Quick Setup on Ubuntu

### 1. Install Prerequisites

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Verify installation
node --version
npm --version
```

### 2. Install Amazon Q CLI

```bash
# Download and install Amazon Q CLI
curl -fsSL https://d3rnber3cjqiqw.cloudfront.net/amazon-q/latest/install.sh | bash

# Add to PATH (add to ~/.bashrc or ~/.zshrc)
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Verify installation
q --version
```

### 3. Clone Your Project

```bash
# Clone your ecommerce project
cd ~/Projects  # or your preferred directory
git clone https://github.com/AAShayon/ecommerce-client-demo.git
cd ecommerce-client-demo
```

### 4. Setup MCP Agent

The project already has `.amazonq/cli-agents/fullstack-dev.json` configured. Just update the paths:

```bash
# Edit the agent config
nano .amazonq/cli-agents/fullstack-dev.json
```

Update the paths to match your Ubuntu system:

```json
{
  "$schema": "https://raw.githubusercontent.com/aws/amazon-q-developer-cli/refs/heads/main/schemas/agent-v1.json",
  "name": "fullstack-dev",
  "description": "Full-stack development agent",
  "mcpServers": {
    "workspace-filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem@latest"],
      "env": {
        "ALLOWED_DIRECTORIES": "/home/YOUR_USERNAME/Projects/ecommerce-client-demo"
      }
    },
    "nextjs-tools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"],
      "env": {
        "NEXT_PROJECT_PATH": "/home/YOUR_USERNAME/Projects/ecommerce-client-demo/frontend"
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
```

**Replace `YOUR_USERNAME` with your actual Ubuntu username.**

### 5. Start Amazon Q CLI

```bash
cd ~/Projects/ecommerce-client-demo
q chat
```

### 6. Switch to Full-Stack Agent

```bash
/agent swap fullstack-dev
```

### 7. Check MCP Status

```bash
/mcp
```

When prompted, trust the tools by typing `t`.

## 🔧 Automated Setup Script for Ubuntu

Create and run this script:

```bash
#!/bin/bash
# setup-ubuntu-q.sh

set -e

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

print_info() { echo -e "${BLUE}ℹ${NC} $1"; }
print_success() { echo -e "${GREEN}✓${NC} $1"; }

# Install Node.js if not present
if ! command -v node &> /dev/null; then
    print_info "Installing Node.js..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt install -y nodejs
fi

# Install Amazon Q CLI if not present
if ! command -v q &> /dev/null; then
    print_info "Installing Amazon Q CLI..."
    curl -fsSL https://d3rnber3cjqiqw.cloudfront.net/amazon-q/latest/install.sh | bash
    export PATH="$HOME/.local/bin:$PATH"
    echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
fi

print_success "Setup complete!"
print_info "Run: source ~/.bashrc"
print_info "Then: q chat"
```

Save and run:

```bash
chmod +x setup-ubuntu-q.sh
./setup-ubuntu-q.sh
source ~/.bashrc
```

## 📋 Project Setup

### Backend (Laravel)

```bash
cd ecom-backend

# Install PHP dependencies
composer install

# Setup environment
cp .env.example .env
php artisan key:generate

# Configure database in .env
nano .env

# Run migrations
php artisan migrate
php artisan db:seed
```

### Frontend (Next.js)

```bash
cd frontend

# Install dependencies
npm install

# Setup environment
cp .env.example .env.local

# Configure API URL
nano .env.local
# Set: NEXT_PUBLIC_API_URL=http://localhost:8000

# Start dev server
npm run dev
```

## 🎯 Using Amazon Q CLI on Ubuntu

### Start Development Session

```bash
# Terminal 1: Start Laravel backend
cd ~/Projects/ecommerce-client-demo/ecom-backend
php artisan serve

# Terminal 2: Start Next.js frontend
cd ~/Projects/ecommerce-client-demo/frontend
npm run dev

# Terminal 3: Start Amazon Q CLI
cd ~/Projects/ecommerce-client-demo
q chat
/agent swap fullstack-dev
```

### Common Commands in Q CLI

```bash
# Check project structure
list files in frontend/src

# Run Laravel commands
php artisan route:list
php artisan migrate:status

# Check Next.js dev server
nextjs_runtime

# Search Next.js docs
nextjs_docs "routing"
```

## 🔄 Sync Between Mac and Ubuntu

### Push from Mac

```bash
# On Mac
cd ~/PhpstormProjects/ecommerce-client-demo
git add .
git commit -m "Update project"
git push origin master
```

### Pull on Ubuntu

```bash
# On Ubuntu
cd ~/Projects/ecommerce-client-demo
git pull origin master

# Update dependencies if needed
cd frontend && npm install
cd ../ecom-backend && composer install
```

## 🐛 Troubleshooting Ubuntu

### Permission Issues

```bash
# Fix npm permissions
sudo chown -R $USER:$USER ~/.npm
sudo chown -R $USER:$USER ~/.local

# Fix project permissions
sudo chown -R $USER:$USER ~/Projects/ecommerce-client-demo
```

### MCP Server Failed

```bash
# Check Node.js
node --version  # Should be 18+
npx --version

# Check logs
Q_LOG_LEVEL=trace q chat
```

### Port Already in Use

```bash
# Kill process on port 3000 (Next.js)
sudo lsof -t -i:3000 | xargs kill -9

# Kill process on port 8000 (Laravel)
sudo lsof -t -i:8000 | xargs kill -9
```

## 📝 Quick Reference

### File Paths

**Mac:**
```
/Users/md.asifafrojshayon/PhpstormProjects/ecommerce-client-demo
```

**Ubuntu:**
```
/home/YOUR_USERNAME/Projects/ecommerce-client-demo
```

### Agent Config Location

```
.amazonq/cli-agents/fullstack-dev.json
```

### Start Q CLI

```bash
cd ~/Projects/ecommerce-client-demo
q chat
/agent swap fullstack-dev
/mcp
```

## 🔗 Resources

- [Amazon Q CLI Docs](https://docs.aws.amazon.com/amazonq/)
- [Node.js Ubuntu Setup](https://github.com/nodesource/distributions)
- [Laravel Ubuntu Setup](https://laravel.com/docs/installation#server-requirements)

---

**Version:** 1.0.0  
**Platform:** Ubuntu 20.04+ / 22.04+
