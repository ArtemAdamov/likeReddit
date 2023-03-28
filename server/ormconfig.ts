const { DataSource } = require("typeorm");

require('dotenv').config();
for (const envName of Object.keys(process.env)) {
  process.env[envName] = process.env[envName].replace(/\\n/g, '\n');
}

const connectionSource = new DataSource({
  type: 'postgres',
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "0412",
  database: "pgcryptos2",
  entities: [
    "dist/entities/*.js"
  ],
  migrations: [
    "dist/migrations/*.js"
  ]
});

module.exports = {
  connectionSource,
}
