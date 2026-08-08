import express from "express";
import cors from "cors";

import sociosRoutes from "./routes/sociosRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/socios", sociosRoutes);

export default app;