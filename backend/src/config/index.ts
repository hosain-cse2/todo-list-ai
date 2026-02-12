import "dotenv/config";

export interface Config {
  port: number;
  nodeEnv: string;
  jwt: { secret: string; expiresIn: string };
}

const config: Config = {
  port: Number(process.env.PORT) || 4000,
  nodeEnv: process.env.NODE_ENV || "development",
  jwt: {
    secret: process.env.JWT_SECRET || "change-me-in-production",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};

export default config;
