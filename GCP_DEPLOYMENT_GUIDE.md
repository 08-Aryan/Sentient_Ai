# Google Cloud Deployment Guide (Free Tier)

This guide walks you through deploying your chatbot to **Google Cloud Platform (GCP)** using the **Always Free** e2-micro Compute Engine instance.

## Prerequisites

1.  **Google Cloud Account**: [Sign up here](https://cloud.google.com/).
2.  **Billing Account**: Required to activate the account, but we will stay within free tier limits.

---

## Step 1: Create a Project

1.  Go to the [GCP Console](https://console.cloud.google.com/).
2.  Click the project dropdown (top left) and select **"New Project"**.
3.  Name it `sentiment-chatbot` and click **Create**.

## Step 2: Create the VM Instance (e2-micro)

1.  Navigate to **Compute Engine** > **VM instances**.
2.  Click **"Create Instance"**.
3.  **Name**: `chatbot-server`
4.  **Region**: `us-central1` or `us-west1` (or `us-east1`). **Important**: Only specific regions are eligible for Always Free. `us-central1` is a safe bet.
5.  **Machine Configuration**:
    -   **Series**: `E2`
    -   **Machine type**: `e2-micro` (2 vCPU, 1 GB memory).
    -   *Look for the "Your first 744 hours of e2-micro instance usage are free this month" message on the right.*
6.  **Boot Disk**:
    -   Click **Change**.
    -   **Operating System**: `Ubuntu`
    -   **Version**: `Ubuntu 22.04 LTS x86/64`
    -   **Boot disk type**: `Standard persistent disk` (30 GB is free).
    -   Click **Select**.
7.  **Firewall**:
    -   Check **Allow HTTP traffic**.
    -   Check **Allow HTTPS traffic**.
8.  Click **Create**.

## Step 3: Configure Firewall (Open Port 3000)

By default, only ports 80 and 443 are open. We need port 3000 for our app (or we can use 80, but let's stick to 3000 as configured or map 3000:80).

*Actually, our `docker-compose.yml` maps host port 3000 to container port 80. Let's open port 3000.*

1.  Go to **VPC network** > **Firewall**.
2.  Click **Create Firewall Rule**.
3.  **Name**: `allow-chatbot-3000`
4.  **Targets**: `All instances in the network`
5.  **Source IPv4 ranges**: `0.0.0.0/0`
6.  **Protocols and ports**:
    -   Check **TCP** and enter `3000`.
7.  Click **Create**.

## Step 4: Connect & Install Docker

1.  Go back to **VM instances**.
2.  Click **SSH** next to your instance to open a browser terminal.

### Run these commands in the SSH window:

**1. Install Docker:**
```bash
sudo apt-get update
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

**2. Clone Your Code:**
(Replace `<YOUR_REPO_URL>` with your actual GitHub HTTPS URL)
```bash
git clone https://github.com/YOUR_USERNAME/YOUR_REPO.git app
cd app
```
*Note: If your repo is private, you'll need to generate a Personal Access Token (PAT) on GitHub and use it as the password.*

**3. Configure Environment:**
```bash
nano backend/.env
```
Paste your production config (adjust YOUR_EXTERNAL_IP):
```env
FLASK_ENV=production
SECRET_KEY=put_a_long_secret_random_string_here
DATABASE_URL=sqlite:////app/instance/chatbot.db
CORS_ORIGINS=http://localhost:3000,http://<YOUR_EXTERNAL_IP>:3000
```
Press `Ctrl+X`, `Y`, `Enter` to save.

## Step 5: Deploy

Run the application:

```bash
sudo docker compose up --build -d
```

## Step 6: Verify

Open your browser and verify connectivity:
`http://<YOUR_VM_EXTERNAL_IP>:3000`

(You can find the External IP in the VM instances list).

---

## Important Cost Note
To ensure you stay free:
1.  **Stop the instance** if you are not using it extensively (though e2-micro is free for the whole month).
2.  **Delete the project** when you are done to remove all resources (Disk, IP, VM).
