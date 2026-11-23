import { obtenerCursos } from "../models/cursos.js";

export async function listar(req, res) {
    try {
        const cursos = await obtenerCursos();
        res.json(cursos);
    } catch (error) {
        console.error("Error al consultar los cursos:", error.message);
        res.status(500).json({ error: "No se pudieron obtener los cursos" });
    }
}
