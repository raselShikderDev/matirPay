import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalError } from "./app/middleware/globalError";
import notFound from "./app/middleware/notFound";
import path from "path";
import mainRouter from "./app/routes";
import { envVarriables } from "./app/configs/envVars.config";
// import expressSession from "express-session";

const app: Application = express();

app.set("trust proxy", 1);
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(
//   expressSession({
//     secret: envVarriables.EXPRESS_SESSION_SECRET as string,
//     resave: false,
//     saveUninitialized: false,
//     cookie: {
//       secure: true,
//       httpOnly: true,
//       sameSite: "none",
//     },
//   }),
// );
app.use(
  cors({
    origin: envVarriables.FRONEND_URL as string,
    credentials: true,
  }),
);

app.use(express.static(path.join(__dirname, "../public")));

app.use("/api/v1", mainRouter);

app.get("/", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.use(globalError);

app.use(notFound);

export default app;
