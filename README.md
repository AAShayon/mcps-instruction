# Amazon Q CLI & MCP Setup Instructions

Complete guide for setting up Amazon Q CLI with Model Context Protocol (MCP) servers for Next.js and Laravel/PHP development.

## 🚀 Quick Start

### 1. Run Setup Script

```bash
curl -fsSL https://raw.githubusercontent.com/AAShayon/mcps-instruction/main/setup-amazon-q.sh | bash
```

Or download and run manually:

```bash
wget https://raw.githubusercontent.com/AAShayon/mcps-instruction/main/setup-amazon-q.sh
chmod +x setup-amazon-q.sh
./setup-amazon-q.sh
```

### 2. Start Amazon Q CLI

```bash
q chat
```

### 3. Switch to Full-Stack Agent

```bash
/agent swap fullstack-dev
```

### 4. Check MCP Status

```bash
/mcp
```

## 📋 What Gets Installed

- **Amazon Q CLI** - AI-powered development assistant
- **MCP Servers**:
  - Filesystem server (workspace access)
  - Next.js DevTools (frontend development)
  
## 🛠️ Supported Technologies

- ✅ Next.js (Frontend)
- ✅ Laravel/PHP (Backend via execute_bash)
- ✅ React
- ✅ Node.js
- ✅ Composer
- ✅ Artisan commands

## 📖 Documentation

- [Complete Setup Guide](./AMAZON_Q_MCP_SETUP.md)
- [Agent Configuration Example](./fullstack-dev.json)

## 🎯 Usage Examples

### Next.js Development
```bash
# In Q CLI after switching to fullstack-dev agent
init                    # Initialize Next.js context
nextjs_docs "routing"   # Search Next.js docs
nextjs_runtime          # Check dev server status
```

### Laravel/PHP Development
```bash
# Use execute_bash tool for Laravel commands
php artisan route:list
php artisan migrate
php artisan make:controller UserController
composer install
```

## 🔧 Manual Configuration

If you prefer manual setup, create `.amazonq/cli-agents/fullstack-dev.json`:

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
        "ALLOWED_DIRECTORIES": "/path/to/your/workspace"
      }
    },
    "nextjs-tools": {
      "command": "npx",
      "args": ["-y", "next-devtools-mcp@latest"],
      "env": {
        "NEXT_PROJECT_PATH": "/path/to/your/workspace"
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

## 🐛 Troubleshooting

### MCP Server Failed
```bash
# Check Node.js
node --version
npx --version

# View logs
Q_LOG_LEVEL=trace q chat
```

### Agent Not Found
```bash
# List agents
/agent list

# Verify file exists
ls .amazonq/cli-agents/
```

## 📚 Resources

- [Amazon Q CLI Docs](https://docs.aws.amazon.com/amazonq/)
- [MCP Protocol](https://modelcontextprotocol.io/)
- [Next.js DevTools MCP](https://github.com/modelcontextprotocol/next-devtools-mcp)

---

**Version:** 1.0.0  
**Last Updated:** November 7, 2025
