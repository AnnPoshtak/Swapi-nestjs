SWAPI NestJs is a project that downloads data from `https://swapi.info/` into a database and allows you to manage all entities. There is also basic authorization and registration. And role management. The administrator can modify, delete and create new objects while the user can only read.

## Environment Configuration

Before running the application, you need to set up your environment variables. 

1. Clone the example configuration file:
   ```bash 
   cp .env.example .env
   ```
2. Open .env and fill in your local settings

### Environment Variables Glossary
| Variable | Description | Example / Default |
| :--- | :--- | :--- |
| `JWT_SECRET` | Secret key used to sign and verify JSON Web Tokens for authentication. | `your_very_secret_jwt_secret` |
| `ADMIN_EMAILS` | Comma-separated list of emails (without spaces) that will get the Admin role during seeding.⚠️ CRITICAL: These users must be registered in the system before you run the /seed route, otherwise the process will fail with an error. | `admin@swapi.com,cat@gmail.com` |
| `DB_HOST` | Database host address. | `localhost` |
| `DB_PORT` | Port number your database is listening on. | `5432` |
| `DB_USERNAME` | Database connection username. | `postgres` |
| `DB_PASSWORD` | Database connection password. | `your_super_secret_password` |
| `DB_NAME` | The name of the database for the project. | `swapi` |
| `SWAPI_URL` | The base URL of the third-party Star Wars API to fetch initial data. | `https://swapi.info/api/` |

## Database Configuration

Once the environment is set up, you can move on to configuring the database. **PostgreSQL** is highly recommended for this project to ensure full feature compatibility.

### Option 1: PostgreSQL (Recommended)
Ensure your PostgreSQL server is running and you have created a database instance. Update your `.env` file with your credentials:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_super_secret_password
DB_NAME=swapi
```

## Database Initialization
After configuring the credentials, run the migrations to create the necessary tables for Star Wars entities and users:
```
cd backend
npm install
npm run migration:run
```

>**IMPORTANT:** On the first launch, the database is empty. You must trigger the initial synchronization manually. Follow these steps in the exact order to avoid database errors:

1. Configure Admins: Add the required emails to ADMIN_EMAILS in your .env file (comma-separated, no spaces).

2. Start the app: go to `backend` folder, install all packages ```npm install``` and Run ```npm run start:dev```

3. Register Users: Open http://localhost:3000/api, go to the Auth section, and register the accounts for all emails you specified in ADMIN_EMAILS.

4. Log In: Log into one of these accounts to get your access token.

5. Click on Authorize button on the top of swagger and paste your JWT-token

6. Run Seed: Call the /seed route.

What happens during /seed?

- The system fetches and syncs all Star Wars data from the external SWAPI API.

- The system scans the ADMIN_EMAILS list, finds these pre-registered users in the DB, and grants them Admin permissions.

> Note: If any email from .env is missing in the database at this step, the seeding process will throw an error.

# Running with docker
If you have Docker and Docker Compose installed, you don't need to install Node.js or PostgreSQL locally. The environment can be spun up with a single command.
1. Update your .env for Docker
To make the NestJS container communicate with the PostgreSQL container, change DB_HOST in your .env file from localhost to db (the name of the database service in Docker):
   ```DB_HOST=db
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_super_secret_password
   DB_NAME=swapi
   ```
2. Launch the Containers

   Run the following command in the root directory to build and start the application and database in the background (Migrations will run automatically on container startup):
      ```docker compose up -d --build```

3. Initialize Data (/seed)
Once the containers are up and migrations are applied, follow the same initialization steps as for the local setup:
    1. Open http://localhost:3000/api
    2. Register and Log in.
    3. Call the /seed route to populate your database with Star Wars data and automatically grants Admin permissions


# Useful Docker Commands
- View Logs: `docker compose logs -f` (or `docker compose logs -f backend` for app logs only).

- Stop Containers: `docker compose down`

- Stop and Wipe Data: `docker compose down -v` (removes the database volume, allowing a completely fresh start).