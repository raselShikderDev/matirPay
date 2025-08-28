import express, { Application, Request, Response } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"
import { globalError } from "./app/middleware/globalError"
import notFound from "./app/middleware/notFound"
import path from "path"



const app:Application = express()

app.use(express.static(path.join(__dirname, "../public")));


app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.get("/", (req:Request, res:Response)=>{
    // res.send("Here is the backend of MatirPay")
    res.sendFile(path.join(__dirname, "./public/index.html"))
})


app.use(globalError)

app.use(notFound)


export default app

