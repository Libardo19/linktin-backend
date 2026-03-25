require("dotenv").config();

const required = [
  "DATABASE_URL",
  "JWT_SECRET",
  "JWT_EXPIRES_IN",
  "PORT",
];

required.forEach((key) => {
  if (!process.env[key]) {
    console.error(`Variable de entorno faltante: ${key}`);
    process.exit(1);
  }
});

module.exports = {
  port:          process.env.PORT,
  nodeEnv:       process.env.NODE_ENV || "development",
  databaseUrl:   process.env.DATABASE_URL,
  jwt: {
    secret:      process.env.JWT_SECRET,
    expiresIn:   process.env.JWT_EXPIRES_IN,
  },
};