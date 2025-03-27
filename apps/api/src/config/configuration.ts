export default () => ({
  env: process.env.NODE_ENV || "development",
  appUrl: process.env.APP_URL || "http://localhost:8080",
  server: {
    port: parseInt(process.env.PORT, 10) || 8080,
  },
  cors: {
    enabled: process.env.CORS_ENABLED === "true",
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
  firebase: {
    adminSdkPath:
      process.env.FIREBASE_ADMIN_SDK_PATH || "firebase-adminsdk.json",
  },
  cp: {
    workspaceApiUrl: process.env.CP_WORKSPACE_API_URL,
    workspaceApiKey: process.env.CP_WORKSPACE_API_KEY,
  },
});
