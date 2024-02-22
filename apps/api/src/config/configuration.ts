export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 8080,
  },
  cors: {
    enabled: process.env.CORS_ENABLED === "true",
  },
  db: {
    type: process.env.DB_TYPE || "better-sqlite3",
    database: process.env.DB_DATABASE || "db.dat",
    synchronize: process.env.DB_SYNCHRONIZE === "true",
    autoLoadEntities: true,
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === "true",
    title: process.env.SWAGGER_TITLE || "API",
    description: process.env.SWAGGER_DESCRIPTION || "API description",
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || "60s",
  },
  defaultAdmin: {
    username: process.env.DEFAULT_ADMIN_USERNAME || "admin",
    password: process.env.DEFAULT_ADMIN_PASSWORD || "password",
    firstName: process.env.DEFAULT_ADMIN_FIRST_NAME || "Admin",
    lastName: process.env.DEFAULT_ADMIN_LAST_NAME || "User",
    roles: (process.env.DEFAULT_ADMIN_ROLES || "admin").split(","),
  },
  nodemailer: {
    service: process.env.NODEMAILER_SERVICE || "gmail",
    user: process.env.NODEMAILER_USER || "",
    pass: process.env.NODEMAILER_PASS || "",
    from: process.env.NODEMAILER_FROM || "",
  },
  user: {
    defaultPassword: process.env.USER_DEFAULT_PASSWORD || "password",
  },
});
