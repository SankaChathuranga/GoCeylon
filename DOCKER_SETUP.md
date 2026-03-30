# Go Ceylon Docker Setup

This project now includes a full Docker Compose setup for:

- `frontend` - React + Vite app served by Nginx
- `backend` - Spring Boot API
- `db` - PostgreSQL database

## 1. Prerequisites

Install:

- Docker Desktop

## 2. Configure environment values

Create a root `.env` file using `.env.example` as the template.

Important values:

- `VITE_MAPBOX_TOKEN` - required for the discovery map page
- `POSTGRES_*` - database credentials
- `JWT_SECRET` - secret used by the backend

## 3. Start the project

From the project root:

```bash
docker compose up --build
```

## 4. Open the app

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8080`
- PostgreSQL: `localhost:5432`

## 5. Stop the project

```bash
docker compose down
```

To also remove the database volume:

```bash
docker compose down -v
```

## Notes

- The frontend proxies `/api` requests to the backend container through Nginx.
- The backend now reads database and JWT settings from environment variables, so it still works locally without Docker.
- Database data is stored in the named Docker volume `postgres_data`.
