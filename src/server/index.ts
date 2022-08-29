import cors from "cors";
import express from "express";
import morgan from "morgan";
import { notFoundError } from "./middlewares/errors";

const app = express();
app.disable("x-powered-by");

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

app.use(notFoundError);

export default app;
