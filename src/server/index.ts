import cors from "cors";
import express from "express";
import morgan from "morgan";
import { generalError, notFoundError } from "./middlewares/errors";
import songsRouter from "./routers/songsRouter/songsRouter";
import usersRouter from "./routers/usersRouter/usersRouter";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.static("uploads"));
app.use(express.json());

app.use("/users", usersRouter);
app.use("/songs", songsRouter);

app.use(notFoundError);
app.use(generalError);

export default app;
