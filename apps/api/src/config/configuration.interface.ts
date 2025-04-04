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

export interface DefaultUserConfig {
  defaultPassword: string;
}

export interface FirebaseConfig {
  adminSdkPath: string;
  storageBucket: string;
}

export interface OauthConfig {
  google: {
    clientId: string;
    clientSecret: string;
    redirectUrl: string;
  };
}
