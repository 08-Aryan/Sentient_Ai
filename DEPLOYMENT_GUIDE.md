# Cloud Deployment Guide (Docker)

This guide details how to deploy your **Context-Aware Sentiment Chatbot** to a cloud server (VPS) like DigitalOcean, AWS EC2, or Linode using Docker Compose.

## Prerequisites

1.  **A Cloud Server (VPS)**:
    -   OS: Ubuntu 22.04 LTS (Recommended) or Debian 11/12.
    -   Specs: 1 vCPU, 1GB RAM minimum (2GB Recommended).
2.  **Domain Name (Optional)**: If you want a custom URL (e.g., `chat.example.com`).

---

## Step 1: Connect to Your Server

Open your terminal and SSH into your server:

```bash
ssh root@<YOUR_SERVER_IP>
```

## Step 2: Install Docker & Docker Compose

Run these commands to install Docker engine:

```bash
# Update package list
apt-get update

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Verify installation
docker --version
docker compose version
```

## Step 3: Get Your Code

You have two options to get your code onto the server:

### Option A: Git (Recommended)
If your code is on GitHub/GitLab:

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/<YOUR_USERNAME>/<YOUR_REPO>.git app
    cd app
    ```

### Option B: Copy from Local
If your code is only on your computer:

1.  **Run this on your LOCAL computer** (not the server):
    ```bash
    # Replace contents inside < > with your actual path and IP
    scp -r /path/to/project root@<YOUR_SERVER_IP>:/root/app
    ```
2.  **On the server**:
    ```bash
    cd /root/app
    ```

## Step 4: Configuration

Create the production environment file:

1.  **Create `.env`**:
    ```bash
    nano backend/.env
    ```

2.  **Paste the following content** (Update keys as needed):
    ```env
    FLASK_ENV=production
    SECRET_KEY=complex_production_key_here
    DATABASE_URL=sqlite:////app/instance/chatbot.db
    # Add any other keys from your local .env
    ```

3.  **Save and Exit**: Press `Ctrl+X`, then `Y`, then `Enter`.

## Step 5: Start the Application

Run the application in the background:

```bash
docker compose up --build -d
```

## Step 6: Verify Deployment

1.  Open your browser and visit: `http://<YOUR_SERVER_IP>:3000`
2.  You should see the chatbot login page.

---

## Optional: Setup Domain & SSL (HTTPS)

To use a domain (like `chat.example.com`) and secure HTTPS:

1.  **Update DNS**: Point `chat.example.com` to your server's IP (A Record).
2.  **Install Nginx on Host** (as a reverse proxy):
    ```bash
    apt-get install nginx certbot python3-certbot-nginx
    ```
3.  **Configure Nginx Proxy**:
    Edit `/etc/nginx/sites-available/chat`:
    ```nginx
    server {
        server_name chat.example.com;

        location / {
            proxy_pass http://localhost:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
        }
    }
    ```
4.  **Enable Site**:
    ```bash
    ln -s /etc/nginx/sites-available/chat /etc/nginx/sites-enabled/
    nginx -t
    systemctl restart nginx
    ```
5.  **Get SSL Cert**:
    ```bash
    certbot --nginx -d chat.example.com
    ```

Your app is now live at `https://chat.example.com`!
