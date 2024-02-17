export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 8080,
  },
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
  },
  db: {
    type: process.env.DB_TYPE || 'better-sqlite3',
    database: process.env.DB_DATABASE || 'db.dat',
    synchronize: process.env.DB_SYNCHRONIZE === 'true',
    autoLoadEntities: true,
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    title: process.env.SWAGGER_TITLE || 'API',
    description: process.env.SWAGGER_DESCRIPTION || 'API description',
  },
  bcrypt: {
    saltRounds: parseInt(process.env.BCRYPT_SALT_ROUNDS, 10) || 10,
  },
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '60s',
  },
});
