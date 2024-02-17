export interface ServerConfig {
  port: number;
}

export interface CorsConfig {
  enabled: boolean;
}

export interface SwaggerConfig {
  enabled: boolean;
  title: string;
  description: string;
}

export interface BcryptConfig {
  saltRounds: number;
}

export interface JwtConfig {
  secret: string;
  expiresIn: string;
}