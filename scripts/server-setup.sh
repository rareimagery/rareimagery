#!/usr/bin/env bash
# One-time server bootstrap for RareImagery on Hostinger VPS
# Usage: ssh root@srv1450030.hstgr.cloud 'bash -s' < scripts/server-setup.sh
set -euo pipefail

APP_DIR="/opt/rareimagery"

echo "=== RareImagery Server Setup ==="

# 1. Clone the repo
if [ -d "$APP_DIR" ]; then
  echo "Directory $APP_DIR already exists, pulling latest..."
  cd "$APP_DIR"
  git pull origin main
else
  echo "Cloning repository..."
  git clone git@github.com:rareimagery/rareimagery.git "$APP_DIR"
  cd "$APP_DIR"
fi

# 2. Create .env from example
if [ ! -f .env ]; then
  cp .env.example .env
  echo "Created .env from .env.example"
  echo ">>> IMPORTANT: Edit /opt/rareimagery/.env with real credentials before continuing <<<"
  echo "    - Set secure DRUPAL_DB_PASSWORD and POSTGRES_PASSWORD"
  echo "    - Set DRUPAL_HASH_SALT (run: openssl rand -hex 32)"
  echo "    - Add Stripe and Printful API keys"
  exit 0
fi

# 3. Build and start containers
echo "Building Docker images..."
docker compose build

echo "Starting containers..."
docker compose up -d

# 4. Wait for database
echo "Waiting for PostgreSQL..."
sleep 15

# 5. Install Drupal
echo "Running Drupal site install..."
docker compose exec -T drupal vendor/bin/drush site:install \
  --db-url="pgsql://${DRUPAL_DB_USER:-rareimagery}:${DRUPAL_DB_PASSWORD:-rareimagery_secret}@postgres:5432/${DRUPAL_DB_NAME:-rareimagery}" \
  --site-name="RareImagery" \
  --account-name=admin \
  --account-pass=changeme \
  -y

# 6. Enable custom module
echo "Enabling custom module..."
docker compose exec -T drupal vendor/bin/drush en rareimagery_xstore -y

# 7. Clear cache
docker compose exec -T drupal vendor/bin/drush cr

echo ""
echo "=== Setup Complete ==="
echo "Site: http://$(hostname):8088"
echo "Admin: admin / changeme (change this immediately)"
echo ""
echo "Next steps:"
echo "  1. Change admin password"
echo "  2. Add GitHub Secrets for CI/CD (SSH_PRIVATE_KEY, SSH_HOST, SSH_USER)"
echo "  3. Set up a GitHub deploy key so the server can pull from the repo"
