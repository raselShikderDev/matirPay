import express, { Application, Request, Response } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { globalError } from "./app/middleware/globalError";
import notFound from "./app/middleware/notFound";
import path from "path";
import mainRouter from "./app/routes";
import { envVarriables } from "./app/configs/envVars.config";
import session from "express-session"

const app: Application = express();

app.use(express.static(path.join(__dirname, "../public")));

app.use(session({
    secret:envVarriables.EXPRESS_SESSION_SECRET as string,
    resave:false,
    saveUninitialized:true,
    cookie:{
        secure:false,
    }
}))

app.use(cors({
    origin:envVarriables.FRONEND_URL as string,
    credentials:true,
}))

app.use(express.json());
app.use(cors());
app.set("proxy", 1);
app.use(cookieParser());

app.use("/api/v1", mainRouter);

app.get("/", (req: Request, res: Response) => {
  // res.send("Here is the backend of MatirPay")
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

app.use(globalError);

app.use(notFound);

export default app;
