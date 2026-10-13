#!/usr/bin/env bash
set -e

echo "=== Fixing NVM and Node.js LTS Configuration ==="

# 1. Check or install NVM
export NVM_DIR="$HOME/.nvm"

if [ ! -s "$NVM_DIR/nvm.sh" ]; then
    echo "NVM not found or incomplete in $NVM_DIR. Installing NVM v0.40.1..."
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.1/install.sh | bash
fi

# 2. Source NVM in current shell
if [ -s "$NVM_DIR/nvm.sh" ]; then
    echo "Loading NVM..."
    \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
else
    echo "Error: Could not locate $NVM_DIR/nvm.sh"
    exit 1
fi

# 3. Ensure ~/.bashrc has NVM snippet
BASHRC="$HOME/.bashrc"
if [ -f "$BASHRC" ]; then
    if ! grep -q 'NVM_DIR' "$BASHRC"; then
        echo "Adding NVM initialization to $BASHRC..."
        cat << 'EOF' >> "$BASHRC"

# NVM Configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
    else
        echo "NVM snippet already present in $BASHRC."
    fi
fi

# 4. Ensure ~/.zshrc has NVM snippet if zsh is used
ZSHRC="$HOME/.zshrc"
if [ -f "$ZSHRC" ]; then
    if ! grep -q 'NVM_DIR' "$ZSHRC"; then
        echo "Adding NVM initialization to $ZSHRC..."
        cat << 'EOF' >> "$ZSHRC"

# NVM Configuration
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
EOF
    fi
fi

# 5. Install and activate latest Node.js LTS
echo "Installing latest Node.js LTS..."
nvm install --lts
nvm use --lts
nvm alias default 'lts/*'

echo ""
echo "=== Success! Current Node and NPM versions: ==="
echo "Node: $(node -v)"
echo "NPM:  $(npm -v)"
echo ""
echo "Tip: Run 'source ~/.bashrc' (or open a new terminal window) to apply changes to existing terminals."
