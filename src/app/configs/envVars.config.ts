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
  // GOOGLE_CLIENT_ID: string;
  // GOOGLE_SECRET: string;
  // GOOGLE_CALLBACK_URL: string;
  FRONEND_URL: string;
  EXPRESS_SESSION_SECRET: string;
  SMTP_HOST: string;
  SMTP_FROM: string;
  SMTP_PASS: string;
  SMTP_USER: string;
  SMTP_PORT: string;

  SSL: {
    SSL_VALIDATION_API: string;
    SSL_PAYMENT_API: string;
    SSL_SECRET_KEY: string;
    SSL_STORE_ID: string;
    SSL_SUCCESS_BACKEND_URL: string;
    SSL_FAIL_BACKEND_URL: string;
    SSL_CANCEL_BACKEND_URL: string;
    SSL_SUCCESS_FRONTEND_URL: string;
    SSL_FAIL_FRONTEND_URL: string;
    SSL_CANCEL_FRONTEND_URL: string;
    SSL_IPN_URL: string;
  };
  CLOUDINARY: {
    CLOUDINARY_URL: string;
    CLOUDINARY_API_SECRET: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_NAME: string;
  };
  REDIS: {
    REDIS_HOST: string;
    REDIS_PORT: string;
    REDIS_USERNAME: string;
    REDIS_PASSWORD: string;
  };
}

const loadEnv = () => {
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
    // "GOOGLE_CLIENT_ID",
    // "GOOGLE_SECRET",
    // "GOOGLE_CALLBACK_URL",
    "EXPRESS_SESSION_SECRET",
    "FRONEND_URL",
    "SSL_VALIDATION_API",
    "SSL_PAYMENT_API",
    "SSL_SECRET_KEY",
    "SSL_STORE_ID",
    "SSL_SUCCESS_BACKEND_URL",
    "SSL_CANCEL_BACKEND_URL",
    "SSL_FAIL_BACKEND_URL",
    "SSL_CANCEL_FRONTEND_URL",
    "SSL_FAIL_FRONTEND_URL",
    "SSL_SUCCESS_FRONTEND_URL",
    "CLOUDINARY_URL",
    "CLOUDINARY_API_SECRET",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_NAME",
    "SMTP_HOST",
    "SMTP_FROM",
    "SMTP_PASS",
    "SMTP_PORT",
    "SMTP_USER",
    "REDIS_HOST",
    "REDIS_PORT",
    "REDIS_USERNAME",
    "REDIS_PASSWORD",
    "SSL_IPN_URL",
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
    JWT_ACCESS_EXPIRES: process.env.JWT_ACCESS_EXPIRES,
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
    BCRYPT_SALT_ROUND: process.env.BCRYPT_SALT_ROUND,
    SUPER_ADMIN_EMAIL: process.env.SUPER_ADMIN_EMAIL,
    SUPER_ADMIN_PASSWORD: process.env.SUPER_ADMIN_PASSWORD,
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET,
    JWT_REFRESH_EXPIRES: process.env.JWT_REFRESH_EXPIRES,
    // GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    // GOOGLE_SECRET: process.env.GOOGLE_SECRET,
    // GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL,
    EXPRESS_SESSION_SECRET: process.env.EXPRESS_SESSION_SECRET,
    FRONEND_URL: process.env.FRONEND_URL,
    SMTP_HOST: process.env.SMTP_HOST,
    SMTP_FROM: process.env.SMTP_FROM,
    SMTP_PASS: process.env.SMTP_PASS,
    SMTP_USER: process.env.SMTP_USER,
    SMTP_PORT: process.env.SMTP_PORT,
    SSL: {
      SSL_VALIDATION_API: process.env.SSL_VALIDATION_API,
      SSL_PAYMENT_API: process.env.SSL_PAYMENT_API,
      SSL_SECRET_KEY: process.env.SSL_SECRET_KEY,
      SSL_STORE_ID: process.env.SSL_STORE_ID,
      SSL_SUCCESS_BACKEND_URL: process.env.SSL_SUCCESS_BACKEND_URL,
      SSL_FAIL_BACKEND_URL: process.env.SSL_FAIL_BACKEND_URL,
      SSL_CANCEL_BACKEND_URL: process.env.SSL_CANCEL_BACKEND_URL,
      SSL_SUCCESS_FRONTEND_URL: process.env.SSL_SUCCESS_FRONTEND_URL,
      SSL_FAIL_FRONTEND_URL: process.env.SSL_FAIL_FRONTEND_URL,
      SSL_CANCEL_FRONTEND_URL: process.env.SSL_CANCEL_FRONTEND_URL,
      SSL_IPN_URL: process.env.SSL_IPN_URL,
    },
    CLOUDINARY: {
      CLOUDINARY_URL: process.env.CLOUDINARY_URL,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_NAME: process.env.CLOUDINARY_NAME,
    },
    REDIS: {
      REDIS_HOST: process.env.REDIS_HOST as string,
      REDIS_PORT: process.env.REDIS_PORT as string,
      REDIS_USERNAME: process.env.REDIS_USERNAME as string,
      REDIS_PASSWORD: process.env.REDIS_PASSWORD as string,
    },
  };
};

export const envVarriables = loadEnv();
