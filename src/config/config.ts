import dotenv from "dotenv";
dotenv.config();

function requireEnv(varName: string): string {
  const value = process.env[varName];
  if (!value) {
    throw new Error(`Environment variable ${varName} is required`);
  }
  return value;
}

const config = {
  env: process.env.NODE_ENV || "development",
  port: parseInt(process.env.PORT || "3000"),
  debug: process.env.APP_DEBUG === "true",

  postgres: {
    host: requireEnv("POSTGRES_HOST"),
    user: requireEnv("POSTGRES_USER"),
    password: requireEnv("POSTGRES_PASSWORD"),
    database: requireEnv("POSTGRES_DB"),
    port: parseInt(requireEnv("POSTGRES_PORT")),
  },

  pgAdmin: {
    email: requireEnv("PGADMIN_DEFAULT_EMAIL"),
    password: requireEnv("PGADMIN_DEFAULT_PASSWORD"),
  },

  jwt: {
    secret: requireEnv("JWT_SECRET"),
  },
};

export default config;
