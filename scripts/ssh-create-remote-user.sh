#!/bin/bash

ADMIN_USER=$1
SERVER_IP=$2
NEW_USER=$3
SSH_KEY=$4

if [ -z "$ADMIN_USER" ] || [ -z "$SERVER_IP" ] || [ -z "$NEW_USER" ] || [ -z "$SSH_KEY" ]; then
    echo "Usage: $0 <admin_user> <server_ip> <new_user> <ssh_key>"
    exit 1
fi

export NEW_USER SSH_KEY

ssh -t "${ADMIN_USER}@${SERVER_IP}" "sudo -E bash" << 'EOF'
    if id "$NEW_USER" &>/dev/null; then
        echo "User $NEW_USER already exists"
    else
        useradd -m -s /bin/bash "$NEW_USER"
        echo "User $NEW_USER created"
    fi

    mkdir -p "/home/$NEW_USER/.ssh"
    echo "$SSH_KEY" > "/home/$NEW_USER/.ssh/authorized_keys"
    
    chown -R "$NEW_USER:$NEW_USER" "/home/$NEW_USER/.ssh"
    chmod 700 "/home/$NEW_USER/.ssh"
    chmod 600 "/home/$NEW_USER/.ssh/authorized_keys"
    
    if ! grep -q "^$NEW_USER " /etc/sudoers; then
        echo "$NEW_USER ALL=(ALL:ALL) ALL" >> /etc/sudoers
        echo "All privileges given"
    else
        echo "User already has sudo privileges"
    fi
EOF