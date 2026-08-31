import express from "express";
import cors from "cors";

import sociosRoutes from "./routes/sociosRoutes.js";
import cuotasRoutes from "./routes/cuotasRoutes.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/socios", sociosRoutes);
app.use("/cuotas", cuotasRoutes);

export default app;