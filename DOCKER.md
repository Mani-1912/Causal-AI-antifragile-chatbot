# Docker Setup for Arogya

This project includes Docker configurations for development and deployment.

## Prerequisites

- Docker (version 20+)
- Docker Compose (version 1.29+)

## Quick Start

### Start all services
```bash
docker-compose up --build
```

### Access the application
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- Backend health check: http://localhost:5000/api/health
- Ollama API: http://localhost:11434

### Stop services
```bash
docker-compose down
```

## Service Details

### Ollama (LLM Service)
- **Image**: ollama/ollama:latest
- **Port**: 11434
- **Purpose**: Runs llama3.1 model for chat functionality
- **Data persistence**: `ollama_data` volume

### Backend (Flask API)
- **Image**: Custom Python 3.13 Flask application
- **Port**: 5000
- **Dependencies**: ollama service
- **Environment**: OLLAMA_BASE_URL points to ollama:11434
- **Volumes**: Mounts `./backend` and `./datasets` for live updates

### Frontend (React + Vite)
- **Image**: Custom Node.js 20 React application
- **Port**: 5173
- **Dependencies**: backend service
- **Volumes**: Mounts `./frontend/src` for live reloading

## Common Commands

### View logs
```bash
docker-compose logs -f backend    # Backend logs
docker-compose logs -f frontend   # Frontend logs
docker-compose logs -f ollama     # Ollama logs
```

### Rebuild a specific service
```bash
docker-compose up -d --build backend
docker-compose up -d --build frontend
```

### Remove all containers and volumes
```bash
docker-compose down -v
```

### Access container shell
```bash
docker-compose exec backend sh
docker-compose exec frontend sh
```

## Production Notes

- Change `FLASK_ENV` from `production` to `development` for debugging
- Set appropriate `VITE_API_URL` for production deployment
- Ensure Ollama model is pre-downloaded in the image or volume
- Update CORS settings in `backend/app.py` for production hosts

## Troubleshooting

### Backend can't connect to Ollama
- Ensure Ollama container is healthy: `docker-compose ps`
- Check logs: `docker-compose logs ollama`
- The backend waits for Ollama to be healthy before starting

### Frontend can't reach backend
- Verify both services are running: `docker-compose ps`
- Check backend logs for errors: `docker-compose logs backend`
- Ensure `VITE_API_URL` environment variable is set correctly

### Port conflicts
- If ports 5000, 5173, or 11434 are in use, modify `docker-compose.yml`:
  ```yaml
  ports:
    - "8000:5000"  # host:container
    - "3000:5173"
    - "11435:11434"
  ```
