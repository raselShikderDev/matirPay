import express, { Application, Request, Response } from "express"
import cookieParser from "cookie-parser"
import cors from "cors"

const app:Application = express()


app.use(express.json())
app.use(cors())
app.use(cookieParser())


app.get("/", (req:Request, res:Response)=>{
    res.send("Here is the backend of MatirPay")
})


export default app

