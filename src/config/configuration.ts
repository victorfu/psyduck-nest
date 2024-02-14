export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 8080,
  },
  cors: {
    enabled: process.env.CORS_ENABLED === 'true',
  },
  swagger: {
    enabled: process.env.SWAGGER_ENABLED === 'true',
    title: process.env.SWAGGER_TITLE || 'API',
    description: process.env.SWAGGER_DESCRIPTION || 'API description',
  },
});
