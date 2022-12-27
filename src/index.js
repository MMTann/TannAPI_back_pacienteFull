// Importações de bibliotecas Express e Dotenv
import express from "express";
import * as dotenv from "dotenv";
import cors from "cors";
import { loginRouter } from "./routes/microsoft.js";
import passport from "passport";
import "./middlewares/microsoft.js";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.use(passport.initialize());
app.use("/auth", loginRouter);

// rotas dos pacientes
import pacienteController from "./controller/paciente-controller.js";
app.use("/paciente", pacienteController);

export default app;
