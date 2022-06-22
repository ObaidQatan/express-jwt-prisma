import { join } from "path";
import express, { Request, Response } from "express";
import { config } from 'dotenv';
import { createServer } from "http";
// import logger from 'morgan';

import userRouter from './routers/user';
import adminRouter from './routers/admin';
config();

//NOTE: Config
const app = express();
const port = process.env.PORT || 3000;

// app.use(logger('dev'));
app.use(express.static(join(__dirname, "public")));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//

//NOTE: Routers
app.get("/", (req: Request, res: Response) => {
    res.json({ message: "Hello World" });
});
//
app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

app.all("*", (req: Request, res: Response) => {
    res.status(404).json({ message: "Not Found" });
});
//

app.listen(port, () => console.log(`Listening http://localhost:${port}/`));