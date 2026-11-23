import express from "express";
import { listar } from "../controllers/cursos.js";

const router = express.Router();

router.get("/cursos", listar);

router.use((req, res) => {
    res.status(404).json({ error: "Recurso no encontrado" });
});

export default router;
