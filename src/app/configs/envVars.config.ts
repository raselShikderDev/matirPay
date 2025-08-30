import dotenv from "dotenv";

dotenv.config();

interface envvars {
  MONGO_URI: string;
  PORT: string;
  NODE_ENV: "Development" | "Production";
  JWT_ACCESS_EXPIRES: string;
  JWT_ACCESS_SECRET: string;
  BCRYPT_SALT_ROUND: string;
  SUPER_ADMIN_PASSWORD: string;
  SUPER_ADMIN_EMAIL: string;
  JWT_REFRESH_SECRET: string;
  JWT_REFRESH_EXPIRES: string;
  FRONEND_URL: string;
  EXPRESS_SESSION_SECRET: string;
  SMTP_HOST: string;
  SMTP_FROM: string;
  SMTP_PASS: string;
  SMTP_USER: string;
  SMTP_PORT: string;
  REDIS: {
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
  };
}

const loadEnv = ():envvars => {
  const envVariables: string[] = [
    "MONGO_URI",
    "PORT",
    "NODE_ENV",
    "JWT_ACCESS_EXPIRES",
    "JWT_ACCESS_SECRET",
    "BCRYPT_SALT_ROUND",
    "SUPER_ADMIN_PASSWORD",
    "SUPER_ADMIN_EMAIL",
    "JWT_REFRESH_SECRET",
    "JWT_REFRESH_EXPIRES",
    "EXPRESS_SESSION_SECRET",
    "FRONEND_URL",
    "SMTP_HOST",
    "SMTP_FROM",
    "SMTP_PASS",
    "SMTP_PORT",
    "SMTP_USER",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
  ];

  envVariables.forEach((elem) => {
    if (!process.env[elem]) {
      throw new Error(`Missing envoirnment varriabls ${elem}`);
    }
  });

  return {
    MONGO_URI: process.env.MONGO_URI as string,
    PORT: process.env.PORT as string,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES as string,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET as string,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND as string,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL as string,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD as string,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET as string,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES as string,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    // GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET as string,
    FRONEND_URL: process.env.FRONEND_URL as string,
    SMTP_HOST: process.env.SMTP_HOST as string,
    SMTP_FROM: process.env.SMTP_FROM as string,
    SMTP_PASS: process.env.SMTP_PASS as string,
    SMTP_USER: process.env.SMTP_USER as string,
    SMTP_PORT: process.env.SMTP_PORT as string,
    REDIS: {
      REDIS_HOST: process.env.REDIS_HOST as string,
      REDIS_PORT: process.env.REDIS_PORT as string,
      REDIS_USERNAME: process.env.REDIS_USERNAME as string,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    },
  };
};

export const envVarriables = loadEnv();
