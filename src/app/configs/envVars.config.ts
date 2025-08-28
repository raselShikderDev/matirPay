import dotenv from "dotenv";

dotenv.config();

interface envvars {
  MONGO_URI: string;
  PORT: string;
  NODE_ENV: string;
}

const loadEnv = () => {
  const envVariables: string[] = ["MONGO_URI", "PORT", "NODE_ENV"];

  envVariables.forEach((elem) => {
    if (!process.env[elem]) {
      throw new Error(`Missing envoirnment varriabls ${elem}`);
    }
  });

  return {
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT,
    NODE_ENV: process.env.NODE_ENV as "Development" | "Production",
  };
};

export const envVarriables = loadEnv();
