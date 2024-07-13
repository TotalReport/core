# Core schema migrator
The tool is intended to:
1. Convert schema definitions into *.sql files with migrations.
2. Apply migrations to specified database.

## Convert schema definitions into migration files
```sh
pnpm generate --name $migration_name
```

## Apply migration files to database
1. Create file `.env`.
2. In the file define `DB_URL` variable like this:
```env
DB_URL=postgres://postgres:postgres@localhost:5432/totalreport_core
```
3. Run
```sh
pnpm dotenv -- pnpm migrate
```