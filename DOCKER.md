# Docker Deployment Guide

## Quick Start with Docker Compose

Run the web application with Docker Compose:

```bash
# 1. Clone and navigate to project
git clone https://github.com/thaihadefi/Travel-Website-Final.git
cd Travel-Website-Final

# 2. Create environment file
cp .env.example .env
# Edit .env and add your MongoDB Atlas connection string

# 3. Start the application
docker-compose up -d

# 4. Check status
docker-compose ps

# 5. View logs
docker-compose logs -f

# 6. Access the application
# Client: http://localhost:5001
# Admin: http://localhost:5001/admin
```

## What's Included

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| Web App | travel-website | 5001 | Express application server |

## Database Configuration

This project uses **MongoDB Atlas** (cloud database):
- Set `DATABASE` in `.env` with your MongoDB Atlas connection string
- Example: `DATABASE="mongodb+srv://user:pass@cluster.mongodb.net/travel-website"`
- Get free MongoDB Atlas account at: https://www.mongodb.com/cloud/atlas

## Common Commands

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View all logs
docker-compose logs -f

# View web app logs
docker-compose logs -f web

# Restart services
docker-compose restart

# Rebuild and restart
docker-compose up -d --build

# Stop and remove all data
docker-compose down -v

# Access web container
docker exec -it travel-website sh
```

## Using Dockerfile Only

If you prefer to run without MongoDB (use Atlas):

```bash
# Build image
docker build -t travel-website .

# Run container
docker run -d -p 5001:5001 \
  -e DATABASE="your-mongodb-atlas-uri" \
  --env-file .env \
  --name travel-website \
  travel-website
```

## Using Pre-built Image from Docker Hub

```bash
# Pull image
docker pull thaihadefi/travel-website:v1.0

# Run with cloud MongoDB
docker run -d -p 5001:5001 \
  -e DATABASE="mongodb+srv://..." \
  --env-file .env \
  thaihadefi/travel-website:v1.0
```

## Troubleshooting

**Port already in use:**
```bash
# Check what's using port 5001
lsof -i :5001

# Use different port
docker-compose down
# Edit docker-compose.yml: change "5001:5001" to "8080:5001"
docker-compose up -d
```

**Cannot connect to MongoDB Atlas:**
```bash
# Check web app logs for connection errors
docker-compose logs web

# Verify DATABASE variable in .env is correct
cat .env | grep DATABASE

# Restart web app
docker-compose restart web
```

**Clear all data and restart:**
```bash
docker-compose down -v
docker-compose up -d
```

## Production Deployment

For production, consider:

1. **Use secrets management** instead of `.env` file
2. **Secure MongoDB Atlas** with IP whitelist and strong passwords
3. **Add reverse proxy** (Nginx) for SSL/TLS
4. **Set up MongoDB Atlas backups** and monitoring
5. **Monitor logs** and health checks with logging service
6. **Use specific version tags** instead of `latest`

## Health Checks

The web service has a health check configured:

- **Web App**: HTTP check on `http://localhost:5001`
- Status updates every 30 seconds

Check health status:
```bash
docker-compose ps
```

Healthy service shows `(healthy)` status.
