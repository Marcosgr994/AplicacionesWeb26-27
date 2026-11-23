import express from "express";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { comprobarConexion } from "./config/db.js";
import api from "./routes/api.js";
import paginas from "./routes/paginas.js";

const app = express();
const carpetaActual = fileURLToPath(new URL(".", import.meta.url));
const PUERTO = process.env.PORT || 3000;

app.use((req, res, next) => {
    console.log(req.method, req.url);
    next();
});

app.set("view engine", "ejs");
app.set("views", join(carpetaActual, "views"));

app.use(express.json());
app.use(express.static(join(carpetaActual, "public")));

app.use("/api", api);
app.use("/", paginas);

app.use((req, res) => {
    res.status(404).send("Página no encontrada");
});

app.listen(PUERTO, async () => {
    console.log("Servidor en http://localhost:" + PUERTO);
    await comprobarConexion();
});
