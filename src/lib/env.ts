type RequiredEnvKey = "DATABASE_URL";

function readEnv(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required env var: ${key}`);
  }
  return value;
}

export const env = {
  DATABASE_URL: readEnv("DATABASE_URL"),
};

