# point-of-sale
A Point of Sale software for managing sales and item stocks

## Docker

To run the full stack with frontend, backend and PostgreSQL:

```bash
cp .env.example .env
docker compose up --build
```

Services:

- Frontend: http://localhost
- Backend API: http://localhost:8080/api
- PostgreSQL: localhost:5432

Main Docker variables live in `.env`:
- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `DB_PORT`
- `BACKEND_PORT`
- `FRONTEND_PORT`
- `CORS_ALLOWED_ORIGINS`

To stop everything:

```bash
docker compose down
```

To stop and remove the database volume too:

```bash
docker compose down -v
```

## Running and testing the app
 
### Backend
- To run the Spring application
```bash
cd backend/
./mvnw spring-boot:run
```

- To run tests
```bash
cd backend/
./mvnw clean test
```

- To generate a code coverage report
```bash
cd backend/
./mvnw clean verify
```

- To generate a [mutation test](https://pitest.org/) report
```bash
cd backend/
./mvnw clean test
./mvnw org.pitest:pitest-maven:mutationCoverage
```

- Access to database
```bash
psql -U postgres -d super -h localhost
// password postgres
```

### Frontend
```bash
cd frontend/
npm run dev
// open browser in http://localhost:5173/
```

If you run the frontend outside Docker and want to override the API URL, create `frontend/.env` with:

```bash
VITE_API_BASE_URL=http://localhost:8080/api
```
